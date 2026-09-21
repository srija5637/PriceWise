import { getEnrichedProducts } from '@/lib/db/seed-data';
import { Product } from '@/types';

/**
 * Calculates cosine similarity between two numeric vectors.
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length || vecA.length === 0) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  return denominator === 0 ? 0 : dotProduct / denominator;
}

/**
 * Deterministic pseudo-embedding for local semantic matching
 */
export function generateLocalEmbedding(text: string): number[] {
  const vector: number[] = new Array(32).fill(0);
  const words = text.toLowerCase().split(/\s+/);

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    for (let c = 0; c < word.length; c++) {
      const idx = (word.charCodeAt(c) * (c + 1)) % 32;
      vector[idx] += 1;
    }
  }

  // Normalize
  const mag = Math.sqrt(vector.reduce((a, b) => a + b * b, 0)) || 1;
  return vector.map((v) => parseFloat((v / mag).toFixed(4)));
}

/**
 * Hybrid Search: Combines keyword matching, structured filters, and semantic vector similarity
 */
export function hybridProductSearch(query: string, limit: number = 6): Array<{ product: Product; score: number; matchType: 'keyword' | 'semantic' }> {
  const all = getEnrichedProducts();
  const queryLower = query.toLowerCase();
  const queryVec = generateLocalEmbedding(query);

  const scored = all.map((product) => {
    const textBlob = `${product.name} ${product.brand} ${product.model} ${product.description || ''} ${product.category?.name || ''}`.toLowerCase();

    // 1. Keyword check
    let keywordScore = 0;
    if (textBlob.includes(queryLower)) keywordScore += 0.6;
    if (product.name.toLowerCase().includes(queryLower)) keywordScore += 0.4;

    // 2. Semantic check
    const productVec = generateLocalEmbedding(textBlob);
    const semanticScore = cosineSimilarity(queryVec, productVec);

    // Hybrid combined score
    const combinedScore = keywordScore > 0 ? keywordScore * 0.7 + semanticScore * 0.3 : semanticScore;

    return {
      product,
      score: parseFloat(combinedScore.toFixed(3)),
      matchType: (keywordScore > 0 ? 'keyword' : 'semantic') as 'keyword' | 'semantic',
    };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, limit);
}
