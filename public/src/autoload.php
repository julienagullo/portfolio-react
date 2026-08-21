<?php

declare(strict_types=1);

/**
 * Autoloader PSR-4 minimal, sans Composer.
 *
 * Un seul préfixe géré : le namespace racine "App\" est mappé sur ce
 * dossier (public/src). App\Http\Request => src/Http/Request.php
 */

spl_autoload_register(static function (string $class): void {
    $prefix = 'App\\';

    if (!str_starts_with($class, $prefix)) {
        return;
    }

    $relative = substr($class, strlen($prefix));
    $path = __DIR__ . '/' . str_replace('\\', '/', $relative) . '.php';

    if (is_file($path)) {
        require $path;
    }
});
