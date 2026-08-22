<?php

declare(strict_types=1);

namespace App\Cache;

use RuntimeException;

/**
 * Rate limiting par IP, fenêtre fixe de 4h, stocké dans un fichier JSON.
 * Purge les IP dont la fenêtre est expirée à chaque appel — pas de tâche
 * cron séparée, le fichier ne grossit jamais au-delà du trafic limité.
 */
final class RateLimiter
{
    private const MAX_REQUESTS = 20;
    private const WINDOW_SECONDS = 4 * 60 * 60;

    public function __construct(private readonly string $storagePath) {}

    /**
     * @return array{allowed: bool, remaining: int, limit: int}
     */
    public function attempt(string $ip): array
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

            return [
                'allowed' => $allowed,
                // Exposé au front pour la barre d'énergie de quota sous le profil du robot.
                'remaining' => max(0, self::MAX_REQUESTS - $entry['count']),
                'limit' => self::MAX_REQUESTS,
            ];
        } finally {
            flock($handle, LOCK_UN);
            fclose($handle);
        }
    }

    /**
     * Lit le quota courant de l'IP sans le consommer (pas d'incrément, pas
     * d'écriture) — utilisé pour initialiser la barre d'énergie du front dès
     * l'ouverture du chat, avant toute question posée.
     *
     * @return array{remaining: int, limit: int}
     */
    public function peek(string $ip): array
    {
        $full = ['remaining' => self::MAX_REQUESTS, 'limit' => self::MAX_REQUESTS];

        if (!is_file($this->storagePath)) {
            return $full;
        }

        $handle = fopen($this->storagePath, 'r');
        if ($handle === false) {
            return $full;
        }

        try {
            flock($handle, LOCK_SH);
            $entries = $this->readEntries($handle);
        } finally {
            flock($handle, LOCK_UN);
            fclose($handle);
        }

        $entry = $entries[$ip] ?? null;
        $now = time();

        if ($entry === null || $now - $entry['first_request_at'] >= self::WINDOW_SECONDS) {
            return $full;
        }

        return [
            'remaining' => max(0, self::MAX_REQUESTS - $entry['count']),
            'limit' => self::MAX_REQUESTS,
        ];
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
