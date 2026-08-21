<?php

declare(strict_types=1);

require __DIR__ . '/src/autoload.php';

use App\Cache\RateLimiter;
use App\Config\Env;
use App\Http\Request;
use App\Http\ServerRequest;
use App\Log\FileLogger;
use App\Rag\Retriever;

Env::load(__DIR__ . '/../.env');

$logger = new FileLogger(__DIR__ . '/var/log/app.log');
$request = ServerRequest::fromGlobals();

$logger->info('Requête reçue sur api.php', ['method' => $request->method(), 'ip' => $request->ip()]);

$limiter = new RateLimiter(__DIR__ . '/var/cache/rate-limit.json');

if (!$limiter->attempt($request->ip())) {
    $logger->warning('Rate limit dépassé', ['ip' => $request->ip()]);

    http_response_code(429);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['ok' => false, 'error' => 'Trop de requêtes, réessaie plus tard.'], JSON_UNESCAPED_UNICODE);
    exit;
}

$body = $request->json();
$question = trim((string) ($body['question'] ?? ''));
$language = ($body['language'] ?? 'fr') === 'en' ? 'en' : 'fr';

if ($question === '') {
    http_response_code(400);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['ok' => false, 'error' => 'Question vide.'], JSON_UNESCAPED_UNICODE);
    exit;
}

$apiKey = Env::get('MISTRAL_API_KEY');
$agentId = Env::get('MISTRAL_AGENT_ID');

if ($apiKey === null || $agentId === null) {
    $logger->error('MISTRAL_API_KEY ou MISTRAL_AGENT_ID manquant');
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['ok' => false, 'error' => 'Configuration serveur incomplète.'], JSON_UNESCAPED_UNICODE);
    exit;
}

// Contexte RAG : dégradation gracieuse si la recherche échoue (l'agent
// répondra sans contexte plutôt que de planter tout le chat), mais on log
// l'incident — sans RAG, il replonge dans l'hallucination.
$context = [];
try {
    $retriever = new Retriever(__DIR__ . '/rag', $apiKey);
    $context = $retriever->topChunks($question, $language);
} catch (Throwable $e) {
    $logger->warning('Recherche RAG échouée, réponse sans contexte', ['error' => $e->getMessage()]);
}

$inputs = $context === []
    ? $question
    : "Contexte pertinent :\n---\n" . implode("\n\n", $context) . "\n---\n\nQuestion du visiteur : $question";

// À partir d'ici on passe en streaming : la réponse arrive au fil du texte
// généré (event: message.output.delta), pas en JSON — plus simple pour
// l'erreur pendant le stream : on l'écrit directement comme texte dans le
// flux, le front l'affiche tel quel dans la bulle (pas de round-trip JSON
// possible une fois les headers envoyés).
header('Content-Type: text/event-stream; charset=utf-8');
header('Cache-Control: no-cache');
header('X-Accel-Buffering: no');
while (ob_get_level() > 0) {
    ob_end_flush();
}

$buffer = '';
$onChunk = function (string $chunk) use (&$buffer): void {
    $buffer .= $chunk;

    while (($pos = strpos($buffer, "\n\n")) !== false) {
        $eventBlock = substr($buffer, 0, $pos);
        $buffer = substr($buffer, $pos + 2);

        foreach (explode("\n", $eventBlock) as $line) {
            if (!str_starts_with($line, 'data: ')) {
                continue;
            }

            $data = json_decode(substr($line, 6), true);
            if (($data['type'] ?? null) === 'message.output.delta' && isset($data['content'])) {
                echo $data['content'];
                flush();
            }
        }
    }
};

try {
    Request::getInstance()
        ->reset()
        ->to('https://api.mistral.ai/v1/conversations')
        ->method('POST')
        ->bearerToken($apiKey)
        ->timeout(60)
        ->jsonBody([
            'agent_id' => $agentId,
            'inputs' => $inputs,
            'stream' => true,
        ])
        ->sendStreamed($onChunk);
} catch (Throwable $e) {
    $logger->error('Streaming Mistral échoué', ['error' => $e->getMessage()]);
    echo "Le service de chat n'a pas répondu, réessaie plus tard.";
}
