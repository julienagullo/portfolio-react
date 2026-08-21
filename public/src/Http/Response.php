<?php

declare(strict_types=1);

namespace App\Http;

/**
 * Résultat d'une requête sortante (Request::send()).
 */
final class Response
{
    public function __construct(
        private readonly int $status,
        /** @var array<string, string> */
        private readonly array $headers,
        private readonly string $body,
    ) {
    }

    public function status(): int
    {
        return $this->status;
    }

    public function isSuccess(): bool
    {
        return $this->status >= 200 && $this->status < 300;
    }

    public function header(string $name, ?string $default = null): ?string
    {
        return $this->headers[strtolower($name)] ?? $default;
    }

    public function body(): string
    {
        return $this->body;
    }

    /**
     * @return array<mixed>
     */
    public function json(): array
    {
        $decoded = json_decode($this->body, true);

        return is_array($decoded) ? $decoded : [];
    }
}
