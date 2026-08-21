<?php

declare(strict_types=1);

namespace App\Cache;

use RuntimeException;

/**
 * Rate limiting par IP, fenêtre fixe de 24h, stocké dans un fichier JSON.
 * Purge les IP dont la fenêtre est expirée à chaque appel — pas de tâche
 * cron séparée, le fichier ne grossit jamais au-delà du trafic des
 * dernières 24h.
 */
final class RateLimiter
{
    private const MAX_REQUESTS = 20;
    private const WINDOW_SECONDS = 24 * 60 * 60;

    public function __construct(private readonly string $storagePath) {}

    public function attempt(string $ip): bool
    {
        $dir = dirname($this->storagePath);
        if (!is_dir($dir)) {
            mkdir($dir, 0775, true);
        }

        $handle = fopen($this->storagePath, 'c+');

        if ($handle === false) {
            throw new RuntimeException("Impossible d'ouvrir le fichier de rate limiting : $this->storagePath");
        }

        try {
            flock($handle, LOCK_EX);

            $entries = $this->readEntries($handle);
            $now = time();
            $entries = $this->purgeExpired($entries, $now);

            $entry = $entries[$ip] ?? ['count' => 0, 'first_request_at' => $now];
            $allowed = $entry['count'] < self::MAX_REQUESTS;

            if ($allowed) {
                $entry['count']++;
                $entries[$ip] = $entry;
            }

            $this->writeEntries($handle, $entries);

            return $allowed;
        } finally {
            flock($handle, LOCK_UN);
            fclose($handle);
        }
    }

    /**
     * @param resource $handle
     * @return array<string, array{count: int, first_request_at: int}>
     */
    private function readEntries($handle): array
    {
        $raw = stream_get_contents($handle);

        if ($raw === false || $raw === '') {
            return [];
        }

        $decoded = json_decode($raw, true);

        return is_array($decoded) ? $decoded : [];
    }

    /**
     * @param array<string, array{count: int, first_request_at: int}> $entries
     * @return array<string, array{count: int, first_request_at: int}>
     */
    private function purgeExpired(array $entries, int $now): array
    {
        foreach ($entries as $ip => $entry) {
            if ($now - $entry['first_request_at'] >= self::WINDOW_SECONDS) {
                unset($entries[$ip]);
            }
        }

        return $entries;
    }

    /**
     * @param resource $handle
     * @param array<string, array{count: int, first_request_at: int}> $entries
     */
    private function writeEntries($handle, array $entries): void
    {
        rewind($handle);
        ftruncate($handle, 0);
        fwrite($handle, json_encode($entries, JSON_UNESCAPED_UNICODE));
        fflush($handle);
    }
}
