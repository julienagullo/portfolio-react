<?php

declare(strict_types=1);

namespace App\Http;

use RuntimeException;

/**
 * Requête HTTP sortante, construite via cURL avec une interface fluide.
 * Singleton : une seule instance dans toute l'appli, récupérée via
 * instance(). reset() est OBLIGATOIRE avant chaque nouvel appel pour
 * repartir d'un état propre (sinon headers/body/query du précédent
 * appel resteraient collés dessus).
 *
 * Usage :
 *   $response = Request::getInstance()
 *       ->to('https://api.mistral.ai/v1/chat/completions')
 *       ->method('POST')
 *       ->bearerToken($apiKey)
 *       ->jsonBody(['model' => 'mistral-small-4', 'messages' => [...]])
 *       ->send();
 */
final class Request
{
    private static ?self $instance = null;

    private string $url = '';
    private string $method = 'GET';
    /** @var array<string, string> */
    private array $headers = [];
    /** @var array<string, string|int|float|bool> */
    private array $query = [];
    private ?string $body = null;
    private int $timeoutSeconds = 10;
    /** @var array<int, mixed> options CURLOPT_* brutes */
    private array $curlOptions = [];

    private function __construct() {}

    public static function getInstance(): self
    {
        return self::$instance ??= new self();
    }

    public function reset(): self
    {
        $this->url = '';
        $this->method = 'GET';
        $this->headers = [];
        $this->query = [];
        $this->body = null;
        $this->timeoutSeconds = 10;
        $this->curlOptions = [];

        return $this;
    }

    public function to(string $url): self
    {
        $this->url = $url;

        return $this;
    }

    public function method(string $method): self
    {
        $this->method = strtoupper($method);

        return $this;
    }

    public function header(string $name, string $value): self
    {
        $this->headers[$name] = $value;

        return $this;
    }

    /**
     * @param array<string, string> $headers
     */
    public function headers(array $headers): self
    {
        foreach ($headers as $name => $value) {
            $this->header($name, $value);
        }

        return $this;
    }

    public function bearerToken(string $token): self
    {
        return $this->header('Authorization', 'Bearer ' . $token);
    }

    public function query(string $key, string|int|float|bool $value): self
    {
        $this->query[$key] = $value;

        return $this;
    }

    /**
     * @param array<mixed> $data
     */
    public function jsonBody(array $data): self
    {
        $this->body = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);

        return $this->header('Content-Type', 'application/json');
    }

    public function timeout(int $seconds): self
    {
        $this->timeoutSeconds = $seconds;

        return $this;
    }

    public function config(array $options): self
    {
        foreach ($options as $option => $value) {
            $this->curlOptions[$option] = $value;
        }

        return $this;
    }

    public function send(): Response
    {
        if ($this->url === '') {
            throw new RuntimeException('Aucune URL définie : appelle to($url) avant send().');
        }

        $url = $this->buildUrl();
        $ch = curl_init($url);

        if ($ch === false) {
            throw new RuntimeException("Impossible d'initialiser cURL pour $url");
        }

        $options = $this->curlOptions + [
            CURLOPT_CUSTOMREQUEST => $this->method,
            CURLOPT_HTTPHEADER => $this->buildHeaderLines(),
            CURLOPT_TIMEOUT => $this->timeoutSeconds,
            CURLOPT_POSTFIELDS => $this->body,
        ];

        $options[CURLOPT_RETURNTRANSFER] = true;
        $options[CURLOPT_HEADER] = true;

        curl_setopt_array($ch, $options);

        $raw = curl_exec($ch);

        if ($raw === false) {
            $error = curl_error($ch);

            throw new RuntimeException("Requête HTTP échouée ($this->method $url) : $error");
        }

        /** @var string $raw */
        $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $headerSize = (int) curl_getinfo($ch, CURLINFO_HEADER_SIZE);

        $rawHeaders = substr($raw, 0, $headerSize);
        $body = substr($raw, $headerSize);

        return new Response($status, self::parseHeaders($rawHeaders), $body);
    }

    /**
     * Comme send(), mais appelle $onChunk(string) au fur et à mesure que
     * les données arrivent, sans attendre la fin de la réponse — pour du
     * streaming (SSE, réponses LLM token par token, etc.). Ne retourne rien :
     * pas de Response ni de status HTTP fiable avant la fin du transfert.
     *
     * @param callable(string): void $onChunk
     */
    public function sendStreamed(callable $onChunk): void
    {
        if ($this->url === '') {
            throw new RuntimeException('Aucune URL définie : appelle to($url) avant sendStreamed().');
        }

        $url = $this->buildUrl();
        $ch = curl_init($url);

        if ($ch === false) {
            throw new RuntimeException("Impossible d'initialiser cURL pour $url");
        }

        $options = $this->curlOptions + [
            CURLOPT_CUSTOMREQUEST => $this->method,
            CURLOPT_HTTPHEADER => $this->buildHeaderLines(),
            CURLOPT_TIMEOUT => $this->timeoutSeconds,
            CURLOPT_POSTFIELDS => $this->body,
        ];

        // Le status arrive avec les headers, avant le premier octet de body : on le capture ici pour
        // savoir, dès le WRITEFUNCTION, si les chunks qui suivent sont un vrai flux SSE (2xx) ou un
        // corps d'erreur classique (ex. Mistral en 429 renvoie un JSON, pas du SSE) — sans ça une
        // erreur upstream passait telle quelle par $onChunk (ou, ici, ne matchait aucun "data: " et
        // finissait en réponse vide et silencieuse côté client, sans log ni message d'erreur).
        $status = null;
        $errorBody = '';

        $options[CURLOPT_HEADERFUNCTION] = static function ($ch, string $line) use (&$status): int {
            if (preg_match('#^HTTP/\d(?:\.\d)?\s+(\d{3})#', $line, $m)) {
                $status = (int) $m[1];
            }

            return strlen($line);
        };

        $options[CURLOPT_WRITEFUNCTION] = static function ($ch, string $chunk) use ($onChunk, &$status, &$errorBody): int {
            if ($status !== null && $status >= 400) {
                $errorBody .= $chunk;
            } else {
                $onChunk($chunk);
            }

            return strlen($chunk);
        };

        curl_setopt_array($ch, $options);

        if (curl_exec($ch) === false) {
            throw new RuntimeException("Requête HTTP échouée ($this->method $url) : " . curl_error($ch));
        }

        if ($status !== null && $status >= 400) {
            throw new RuntimeException("Requête HTTP en erreur ($this->method $url) : HTTP $status — $errorBody");
        }
    }

    private function buildUrl(): string
    {
        if ($this->query === []) {
            return $this->url;
        }

        $separator = str_contains($this->url, '?') ? '&' : '?';

        return $this->url . $separator . http_build_query($this->query);
    }

    /**
     * @return list<string>
     */
    private function buildHeaderLines(): array
    {
        $lines = [];
        foreach ($this->headers as $name => $value) {
            $lines[] = "$name: $value";
        }

        return $lines;
    }

    /**
     * @return array<string, string>
     */
    private static function parseHeaders(string $rawHeaders): array
    {
        $headers = [];

        $blocks = explode("\r\n\r\n", trim($rawHeaders));
        $lastBlock = end($blocks);

        foreach (explode("\r\n", (string) $lastBlock) as $line) {
            if (!str_contains($line, ':')) {
                continue;
            }

            [$name, $value] = explode(':', $line, 2);
            $headers[strtolower(trim($name))] = trim($value);
        }

        return $headers;
    }
}
