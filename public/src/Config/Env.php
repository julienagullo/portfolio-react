<?php

declare(strict_types=1);

namespace App\Config;

/**
 * Parser .env minimal, sans dépendance (pas de vlucas/phpdotenv).
 * KEY=value par ligne, commentaires `#`, guillemets simples/doubles
 * optionnels autour de la valeur.
 */
final class Env
{
    private static bool $loaded = false;
    /** @var array<string, string> */
    private static array $values = [];

    public static function load(string $path): void
    {
        if (self::$loaded) {
            return;
        }
        self::$loaded = true;

        if (!is_file($path)) {
            return;
        }

        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [];

        foreach ($lines as $line) {
            $line = trim($line);

            if ($line === '' || str_starts_with($line, '#') || !str_contains($line, '=')) {
                continue;
            }

            [$key, $value] = explode('=', $line, 2);
            self::$values[trim($key)] = self::stripQuotes(trim($value));
        }
    }

    public static function get(string $key, ?string $default = null): ?string
    {
        if (array_key_exists($key, self::$values) && self::$values[$key] !== '') {
            return self::$values[$key];
        }

        $fromEnv = getenv($key);

        return $fromEnv !== false && $fromEnv !== '' ? $fromEnv : $default;
    }

    private static function stripQuotes(string $value): string
    {
        $len = strlen($value);

        if ($len >= 2 && (($value[0] === '"' && $value[$len - 1] === '"') || ($value[0] === "'" && $value[$len - 1] === "'"))) {
            return substr($value, 1, -1);
        }

        return $value;
    }
}
