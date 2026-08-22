<?php

declare(strict_types=1);

namespace App\Rag;

use App\Http\Request;
use RuntimeException;

/**
 * Recherche par similarité sur les embeddings pré-calculés
 * (rag/embeddings-{fr,en}.json, générés par generate-rag-embeddings.mjs).
 *
 * Les embeddings des documents sont stockés déjà normalisés (norme 1) par
 * le script de génération : la similarité cosinus se réduit alors à un
 * simple produit scalaire (dot product) sur des vecteurs unitaires, sans
 * recalculer la norme des documents à chaque question — seule la question,
 * nouvelle à chaque requête, doit être normalisée à la volée.
 */
final class Retriever
{
    private const EMBEDDING_MODEL = 'mistral-embed';
    private const SIMILARITY_THRESHOLD = 0.65;

    public function __construct(
        private readonly string $ragDir,
        private readonly string $apiKey,
    ) {
    }

    /**
     * @return string[] les $k chunks de texte les plus pertinents pour la question
     */
    public function topChunks(string $question, string $language, int $k = 4): array
    {
        $entries = $this->loadEntries($language);
        if ($entries === []) {
            return [];
        }

        $questionEmbedding = $this->normalize($this->embed($question));

        $scored = [];
        foreach ($entries as $entry) {
            $scored[] = [
                'text' => $entry['text'],
                'score' => $this->dot($questionEmbedding, $entry['embedding']),
            ];
        }

        usort($scored, static fn (array $a, array $b): int => $b['score'] <=> $a['score']);

        $relevant = array_filter($scored, static fn (array $entry): bool => $entry['score'] >= self::SIMILARITY_THRESHOLD);
        $topTexts = array_map(static fn (array $entry) => $entry['text'], array_slice($relevant, 0, $k));
        $summary = $entries[0]['text'] ?? null;

        if ($summary !== null) {
            $marker = $language === 'en' ? '[Full chronological summary] ' : '[Résumé chronologique complet] ';
            $marked = $marker . $summary;

            $index = array_search($summary, $topTexts, true);
            if ($index !== false) {
                $topTexts[$index] = $marked;
            } else {
                array_unshift($topTexts, $marked);
            }
        }

        return $topTexts;
    }

    /**
     * @return array<int, array{text: string, embedding: float[]}>
     */
    private function loadEntries(string $language): array
    {
        $path = $this->ragDir . '/embeddings-' . $language . '.json';
        if (!is_file($path)) {
            return [];
        }

        $decoded = json_decode((string) file_get_contents($path), true);

        return is_array($decoded) ? $decoded : [];
    }

    /**
     * @return float[]
     */
    private function embed(string $text): array
    {
        $response = Request::getInstance()
            ->reset()
            ->to('https://api.mistral.ai/v1/embeddings')
            ->method('POST')
            ->bearerToken($this->apiKey)
            ->jsonBody(['model' => self::EMBEDDING_MODEL, 'input' => [$text]])
            ->send();

        if (!$response->isSuccess()) {
            throw new RuntimeException("Impossible de calculer l'embedding de la question.");
        }

        return $response->json()['data'][0]['embedding'] ?? [];
    }

    /**
     * Ramène un vecteur à une norme de 1. Appliqué uniquement à l'embedding
     * de la question (celui des documents est déjà normalisé en amont, une
     * fois pour toutes, par generate-rag-embeddings.mjs).
     *
     * @param float[] $v
     * @return float[]
     */
    private function normalize(array $v): array
    {
        $sum = 0.0;
        foreach ($v as $x) {
            $sum += $x ** 2;
        }

        if ($sum <= 1e-24) {
            return $v;
        }

        $inv = 1 / sqrt($sum);

        return array_map(static fn (float $x): float => $x * $inv, $v);
    }

    /**
     * Produit scalaire. Équivaut à la similarité cosinus tant que les deux
     * vecteurs sont normalisés (voir docblock de la classe).
     *
     * @param float[] $a
     * @param float[] $b
     */
    private function dot(array $a, array $b): float
    {
        $sum = 0.0;
        for ($i = 0, $n = count($a); $i < $n; $i++) {
            $sum += $a[$i] * $b[$i];
        }

        return $sum;
    }
}
