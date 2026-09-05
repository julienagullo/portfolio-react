<?php

declare(strict_types=1);

require __DIR__ . '/src/autoload.php';

use App\Cache\RateLimiter;
use App\Config\Env;
use App\Http\Request;
use App\Http\ServerRequest;
use App\Log\FileLogger;
use App\Rag\Retriever;

const MAX_QUESTION_LENGTH = 500;
const MAX_HISTORY_ANSWER_LENGTH = 1500;
const DEFAULT_MISTRAL_MODEL = 'ministral-8b-2512';

Env::load(__DIR__ . '/../.env');

$mistralModel = Env::get('MISTRAL_API_MODEL', DEFAULT_MISTRAL_MODEL);

$logger = new FileLogger(__DIR__ . '/var/log/app.log');
$request = ServerRequest::fromGlobals();

$logger->info('Requête reçue sur api.php', ['method' => $request->method(), 'ip' => $request->ip()]);

$limiter = new RateLimiter(__DIR__ . '/var/cache/rate-limit.json');

// GET : lecture du quota courant pour la barre d'énergie du front, sans consommer de requête.
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

if ($apiKey === null) {
    $logger->error('MISTRAL_API_KEY manquant');
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['ok' => false, 'error' => 'Configuration serveur incomplète.'], JSON_UNESCAPED_UNICODE);
    exit;
}

// Requête de similarité ancrée sur l'échange précédent, sinon une relance vague ("et quelles technos ?") matche des chunks hors-sujet.
$retrievalQuery = trim("$previousQuestion $previousAnswer $question");

$context = [];
try {
    $retriever = new Retriever(__DIR__ . '/rag', $apiKey);
    $context = $retriever->topChunks($retrievalQuery, $language);
} catch (Throwable $e) {
    $logger->warning('Recherche RAG échouée, réponse sans contexte', ['error' => $e->getMessage()]);
}

// System prompt écrit et versionné ici (pas d'agent Mistral opaque) : sans ces règles, le modèle invente des détails absents du contexte.
$systemPrompts = [
    'fr' => <<<PROMPT
        Tu es l'assistant conversationnel du portfolio de Julien, développeur web, et tu réponds à la première personne en son nom.

        Règles strictes :
        - Réponds UNIQUEMENT à partir des informations du contexte fourni ci-dessous.
        - N'invente JAMAIS un projet, une date, une technologie, un outil ou un détail qui n'y figure pas explicitement.
        - Si l'information demandée n'est pas dans le contexte, dis-le clairement (ex. "Je n'ai pas cette information") plutôt que de deviner ou généraliser.
        - Ne mentionne jamais le mot "contexte" et ne recopie jamais sa structure (titres, listes) dans ta réponse : réponds toujours de façon naturelle et fluide.
        - Réponds en français, de façon concise et conversationnelle.
        PROMPT,
    'en' => <<<PROMPT
        You are the conversational assistant of Julien's portfolio, a web developer, and you answer in the first person on his behalf.

        Strict rules:
        - Answer ONLY using the information in the context provided below.
        - NEVER invent a project, date, technology, tool or detail that is not explicitly there.
        - If the requested information is not in the context, say so clearly (e.g. "I don't have that information") rather than guessing or generalizing.
        - Never mention the word "context" and never copy its structure (headings, lists) into your answer: always answer naturally and fluently.
        - Answer in English, concisely and conversationally.
        PROMPT,
];

$systemPrompt = $systemPrompts[$language];
if ($context !== []) {
    $systemPrompt .= "\n\n" . ($language === 'en' ? 'Available context:' : 'Contexte disponible :') . "\n---\n" . implode("\n\n", $context) . "\n---";
}

$messages = [['role' => 'system', 'content' => $systemPrompt]];
if ($previousQuestion !== '' && $previousAnswer !== '') {
    $messages[] = ['role' => 'user', 'content' => $previousQuestion];
    $messages[] = ['role' => 'assistant', 'content' => $previousAnswer];
}
$messages[] = ['role' => 'user', 'content' => $question];

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

            $payload = substr($line, 6);
            if ($payload === '[DONE]') {
                continue;
            }

            $data = json_decode($payload, true);
            $delta = $data['choices'][0]['delta']['content'] ?? null;
            if ($delta !== null) {
                echo $delta;
                flush();
            }
        }
    }
};

try {
    Request::getInstance()
        ->reset()
        ->to('https://api.mistral.ai/v1/chat/completions')
        ->method('POST')
        ->bearerToken($apiKey)
        ->timeout(60)
        ->jsonBody([
            'model' => $mistralModel,
            'messages' => $messages,
            'stream' => true,
        ])
        ->sendStreamed($onChunk);
} catch (Throwable $e) {
    $logger->error('Streaming Mistral échoué', ['error' => $e->getMessage()]);
    echo "Le service de chat n'a pas répondu, réessaie plus tard.";
}
