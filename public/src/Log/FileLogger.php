<?php

declare(strict_types=1);

namespace App\Log;

/**
 * Logger fichier minimal, une ligne par entrée : [date] LEVEL: message {context}
 */
final class FileLogger implements LoggerInterface
{
    public function __construct(private readonly string $path) {}

    public function emergency(string $message, array $context = []): void
    {
        $this->log('emergency', $message, $context);
    }

    public function alert(string $message, array $context = []): void
    {
        $this->log('alert', $message, $context);
    }

    public function critical(string $message, array $context = []): void
    {
        $this->log('critical', $message, $context);
    }

    public function error(string $message, array $context = []): void
    {
        $this->log('error', $message, $context);
    }

    public function warning(string $message, array $context = []): void
    {
        $this->log('warning', $message, $context);
    }

    public function notice(string $message, array $context = []): void
    {
        $this->log('notice', $message, $context);
    }

    public function info(string $message, array $context = []): void
    {
        $this->log('info', $message, $context);
    }

    public function debug(string $message, array $context = []): void
    {
        $this->log('debug', $message, $context);
    }

    public function log(string $level, string $message, array $context = []): void
    {
        $dir = dirname($this->path);
        if (!is_dir($dir)) {
            mkdir($dir, 0775, true);
        }

        $line = sprintf(
            '[%s] %s: %s%s%s',
            date('Y-m-d H:i:s'),
            strtoupper($level),
            $this->interpolate($message, $context),
            $context === [] ? '' : ' ' . json_encode($context, JSON_UNESCAPED_UNICODE),
            PHP_EOL
        );

        file_put_contents($this->path, $line, FILE_APPEND | LOCK_EX);
    }

    /**
     * Remplace les marqueurs {clé} du message par la valeur du contexte,
     * comme le préconise PSR-3.
     *
     * @param array<mixed> $context
     */
    private function interpolate(string $message, array $context): string
    {
        $replacements = [];
        foreach ($context as $key => $value) {
            if (is_scalar($value) || (is_object($value) && method_exists($value, '__toString'))) {
                $replacements['{' . $key . '}'] = (string) $value;
            }
        }

        return $replacements === [] ? $message : strtr($message, $replacements);
    }
}
