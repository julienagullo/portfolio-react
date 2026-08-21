<?php

declare(strict_types=1);

namespace App\Http;

/**
 * Enveloppe simple autour des superglobales PHP (requête entrante).
 */
final class ServerRequest
{
    private string $method;
    /** @var array<string, string> */
    private array $query;
    /** @var array<string, string> */
    private array $headers;
    private string $rawBody;

    private function __construct()
    {
        $this->method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
        $this->query = $_GET;
        $this->headers = self::extractHeaders();
        $this->rawBody = (string) file_get_contents('php://input');
    }

    public static function fromGlobals(): self
    {
        return new self();
    }

    public function method(): string
    {
        return $this->method;
    }

    public function query(string $key, ?string $default = null): ?string
    {
        return $this->query[$key] ?? $default;
    }

    public function header(string $name, ?string $default = null): ?string
    {
        return $this->headers[strtolower($name)] ?? $default;
    }

    public function ip(): string
    {
        return $_SERVER['REMOTE_ADDR'] ?? '';
    }

    public function rawBody(): string
    {
        return $this->rawBody;
    }

    /**
     * @return array<mixed>
     */
    public function json(): array
    {
        if ($this->rawBody === '') {
            return [];
        }

        $decoded = json_decode($this->rawBody, true);

        return is_array($decoded) ? $decoded : [];
    }

    /**
     * @return array<string, string>
     */
    private static function extractHeaders(): array
    {
        if (function_exists('getallheaders')) {
            $headers = getallheaders();
            return array_change_key_case($headers, CASE_LOWER);
        }

        $headers = [];
        foreach ($_SERVER as $key => $value) {
            if (str_starts_with($key, 'HTTP_')) {
                $name = str_replace('_', '-', strtolower(substr($key, 5)));
                $headers[$name] = $value;
            }
        }

        return $headers;
    }
}
