<?php

declare(strict_types=1);

require __DIR__ . '/src/autoload.php';

use App\Cache\RateLimiter;
use App\Config\Env;
use App\Http\Request;
use App\Http\ServerRequest;
use App\Log\FileLogger;
use App\Rag\Retriever;

// Garde-fou contre un pavé de texte collé dans le chat : consommerait de
// l'embedding et des tokens de génération pour rien. À garder en phase avec
// le maxLength du <textarea> côté front (RobotChat.tsx), qui n'est qu'un
// confort UX — cette limite serveur reste la seule qui fasse foi.
const MAX_QUESTION_LENGTH = 500;
// Échange précédent (question + réponse) réinjecté pour la fluidité
// conversationnelle : un seul tour, pas un historique complet. La question
// précédente réutilise la même limite que la question courante ; la réponse
// précédente vient du LLM (plus longue qu'une saisie utilisateur) mais reste
// tronquée ici par défense en profondeur — le front est stateless, rien
// n'empêche un appel forgé avec un champ démesuré.
const MAX_HISTORY_ANSWER_LENGTH = 1500;

Env::load(__DIR__ . '/../.env');

$logger = new FileLogger(__DIR__ . '/var/log/app.log');
$request = ServerRequest::fromGlobals();

$logger->info('Requête reçue sur api.php', ['method' => $request->method(), 'ip' => $request->ip()]);

$limiter = new RateLimiter(__DIR__ . '/var/cache/rate-limit.json');

// GET : simple lecture du quota courant pour initialiser la barre d'énergie
// du front à l'ouverture du chat, sans consommer de requête ni toucher au RAG/LLM.
if ($request->method() === 'GET') {
    $quota = $limiter->peek($request->ip());
    header('Content-Type: application/json; charset=utf-8');
    header("X-RateLimit-Limit: {$quota['limit']}");
    header("X-RateLimit-Remaining: {$quota['remaining']}");
    echo json_encode(['ok' => true, ...$quota], JSON_UNESCAPED_UNICODE);
    exit;
}

$rateLimit = $limiter->attempt($request->ip());

header("X-RateLimit-Limit: {$rateLimit['limit']}");
header("X-RateLimit-Remaining: {$rateLimit['remaining']}");

if (!$rateLimit['allowed']) {
    $logger->warning('Rate limit dépassé', ['ip' => $request->ip()]);

    http_response_code(429);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['ok' => false, 'error' => 'Trop de requêtes, réessaie plus tard.'], JSON_UNESCAPED_UNICODE);
    exit;
}

$body = $request->json();
$question = trim((string) ($body['question'] ?? ''));
$language = ($body['language'] ?? 'fr') === 'en' ? 'en' : 'fr';
$previousQuestion = mb_substr(trim((string) ($body['previousQuestion'] ?? '')), 0, MAX_QUESTION_LENGTH);
$previousAnswer = mb_substr(trim((string) ($body['previousAnswer'] ?? '')), 0, MAX_HISTORY_ANSWER_LENGTH);

if ($question === '') {
    http_response_code(400);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['ok' => false, 'error' => 'Question vide.'], JSON_UNESCAPED_UNICODE);
    exit;
}

if (mb_strlen($question) > MAX_QUESTION_LENGTH) {
    http_response_code(400);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(
        ['ok' => false, 'error' => 'Question trop longue (' . MAX_QUESTION_LENGTH . ' caractères max).'],
        JSON_UNESCAPED_UNICODE,
    );
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

$context = [];
try {
    $retriever = new Retriever(__DIR__ . '/rag', $apiKey);
    $context = $retriever->topChunks($question, $language);
} catch (Throwable $e) {
    $logger->warning('Recherche RAG échouée, réponse sans contexte', ['error' => $e->getMessage()]);
}

$promptParts = [];

if ($previousQuestion !== '' && $previousAnswer !== '') {
    $promptParts[] = "Échange précédent :\nVisiteur : $previousQuestion\nToi : $previousAnswer";
}

if ($context !== []) {
    $promptParts[] = "Contexte pertinent :\n---\n" . implode("\n\n", $context) . "\n---";
}

$inputs = $promptParts === []
    ? $question
    : implode("\n\n", $promptParts) . "\n\nQuestion du visiteur : $question";

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
