/**
 * Deterministic Dataset Engine for ALGO3D Experiment Lab
 * Features seeded pseudo-random number generation (Mulberry32) and algorithm-specific stress generators.
 */

// Seeded PRNG: Mulberry32
export function createPRNG(seed = 123456) {
  let s = Math.floor(Math.abs(seed)) || 123456;
  return function next() {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export class DatasetEngine {
  /**
   * Generate an array dataset deterministically based on configuration
   */
  static generateArrayDataset({
    size = 100,
    distribution = 'random',
    min = 5,
    max = 999,
    seed = null,
    customInput = null
  } = {}) {
    const activeSeed = seed !== null && seed !== undefined ? Math.abs(parseInt(seed, 10)) : Math.floor(Math.random() * 900000) + 100000;
    const prng = createPRNG(activeSeed);

    let data = [];
    const clampedSize = Math.max(4, Math.min(size, 2000));
    const range = Math.max(1, max - min);

    // 1. Handle Custom User Input
    if (distribution === 'custom' && customInput) {
      if (Array.isArray(customInput)) {
        data = customInput.filter((n) => typeof n === 'number' && !isNaN(n));
      } else if (typeof customInput === 'string') {
        data = customInput
          .split(/[\s,]+/)
          .map((s) => Number(s.trim()))
          .filter((n) => !isNaN(n));
      }
      if (data.length === 0) data = [42, 17, 8, 91, 23, 65, 34, 78];
      return {
        id: `DS-${activeSeed}`,
        seed: activeSeed,
        size: data.length,
        distribution: 'custom',
        min: Math.min(...data),
        max: Math.max(...data),
        data,
        description: 'User-provided custom numerical dataset.'
      };
    }

    // 2. Standard Distributions
    switch (distribution) {
      case 'sorted':
        data = Array.from({ length: clampedSize }, (_, i) =>
          Math.floor(min + (i / (clampedSize - 1 || 1)) * range)
        );
        break;

      case 'reverse':
      case 'reverse_sorted':
        data = Array.from({ length: clampedSize }, (_, i) =>
          Math.floor(max - (i / (clampedSize - 1 || 1)) * range)
        );
        break;

      case 'nearly_sorted':
        data = Array.from({ length: clampedSize }, (_, i) =>
          Math.floor(min + (i / (clampedSize - 1 || 1)) * range)
        );
        // Perturb roughly 5% of elements
        const swapCount = Math.max(1, Math.floor(clampedSize * 0.05));
        for (let k = 0; k < swapCount; k++) {
          const idxA = Math.floor(prng() * clampedSize);
          const idxB = Math.floor(prng() * clampedSize);
          const tmp = data[idxA];
          data[idxA] = data[idxB];
          data[idxB] = tmp;
        }
        break;

      case 'duplicates':
      case 'duplicate_heavy':
      case 'few_unique':
        // Only 3-4 distinct values repeated across the entire array
        const uniquePool = [
          min,
          Math.floor(min + range * 0.33),
          Math.floor(min + range * 0.66),
          max
        ];
        data = Array.from({ length: clampedSize }, () =>
          uniquePool[Math.floor(prng() * uniquePool.length)]
        );
        break;

      case 'negatives':
      case 'random_with_negatives':
        data = Array.from({ length: clampedSize }, () =>
          Math.floor(prng() * (max + Math.abs(min))) - Math.abs(min)
        );
        break;

      case 'pathological_quick':
        // Adversarial case for Quick Sort with last-element pivot (e.g. alternating extremes)
        data = Array.from({ length: clampedSize }, (_, i) =>
          i % 2 === 0 ? Math.floor(min + i * 2) : Math.floor(max - i * 2)
        );
        break;

      case 'random':
      default:
        data = Array.from({ length: clampedSize }, () =>
          Math.floor(min + prng() * (range + 1))
        );
        break;
    }

    return {
      id: `DS-${activeSeed}`,
      seed: activeSeed,
      size: data.length,
      distribution,
      min: Math.min(...data),
      max: Math.max(...data),
      data,
      description: DatasetEngine.getDistributionDescription(distribution)
    };
  }

  /**
   * Explanatory descriptions for each distribution
   */
  static getDistributionDescription(dist) {
    switch (dist) {
      case 'sorted':
        return 'Monotonically non-decreasing array. Best case for Insertion Sort, potential worst case for naive Quick Sort.';
      case 'reverse':
      case 'reverse_sorted':
        return 'Monotonically non-increasing array. Maximum inversion count, worst case for Insertion Sort.';
      case 'nearly_sorted':
        return 'Already sorted except for a few perturbed elements. Highlights adaptive algorithm efficiency.';
      case 'duplicates':
      case 'duplicate_heavy':
        return 'Contains very few unique elements. Tests 3-way partitioning and stability under high collision.';
      case 'pathological_quick':
        return 'Engineered adversarial ordering designed to cause unbalanced partition splits.';
      case 'negatives':
        return 'Contains positive and negative values. Useful for Kadane and Two-Sum boundary testing.';
      case 'random':
      default:
        return 'Uniform pseudo-random distribution across the defined range.';
    }
  }

  /**
   * Graph Dataset Generator
   */
  static generateGraphDataset({ vertices = 6, density = 0.4, weighted = true, seed = 54321 } = {}) {
    const prng = createPRNG(seed);
    const nodeIds = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].slice(0, vertices);
    const nodes = nodeIds.map((id) => ({ id }));
    const edges = [];

    // Ensure a connected spanning spine first
    for (let i = 0; i < nodeIds.length - 1; i++) {
      const u = nodeIds[i];
      const v = nodeIds[i + 1];
      const weight = weighted ? Math.floor(prng() * 9) + 1 : 1;
      edges.push({ source: u, target: v, weight });
    }

    // Add additional random edges based on density
    for (let i = 0; i < nodeIds.length; i++) {
      for (let j = i + 2; j < nodeIds.length; j++) {
        if (prng() < density) {
          const weight = weighted ? Math.floor(prng() * 9) + 1 : 1;
          edges.push({ source: nodeIds[i], target: nodeIds[j], weight });
        }
      }
    }

    return {
      id: `GRAPH-${seed}`,
      seed,
      nodeCount: nodes.length,
      edgeCount: edges.length,
      data: { nodes, edges },
      description: `Graph with ${nodes.length} vertices and ${edges.length} edges (density ${(density * 100).toFixed(0)}%).`
    };
  }

  /**
   * String Dataset Generator for KMP / LCS
   */
  static generateStringDataset({ length = 20, patternLength = 4, repetitive = false, seed = 67890 } = {}) {
    const prng = createPRNG(seed);
    const alphabet = repetitive ? ['A', 'B'] : ['A', 'B', 'C', 'D', 'E'];

    let text = '';
    for (let i = 0; i < length; i++) {
      text += alphabet[Math.floor(prng() * alphabet.length)];
    }

    let pattern = '';
    if (repetitive) {
      pattern = 'ABA';
    } else {
      // Pick a random substring from text or random letters
      const start = Math.floor(prng() * Math.max(1, length - patternLength));
      pattern = text.slice(start, start + patternLength) || 'ABCD';
    }

    return {
      id: `STR-${seed}`,
      seed,
      text,
      pattern,
      description: `Text (${text.length} chars) & Pattern (${pattern.length} chars).`
    };
  }
}
