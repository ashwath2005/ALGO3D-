import { OP_TYPES, createStep } from '../engine/ExecutionEngine.js';

// --- KMP STRING PATTERN MATCHING ---
export const kmpPatternMatch = {
  id: 'kmp-search',
  name: 'Knuth-Morris-Pratt (KMP)',
  category: 'strings',
  structureType: 'array',
  complexity: { timeBest: 'O(n)', timeAverage: 'O(n + m)', timeWorst: 'O(n + m)', space: 'O(m)' },
  description: 'Searches for occurrences of a pattern within a main text by employing the longest proper prefix which is also a suffix (LPS array) to bypass re-examination of matched characters.',
  code: `function KMPSearch(pat, txt) {
  let lps = computeLPS(pat);
  let i = 0, j = 0;
  while (i < txt.length) {
    if (pat[j] === txt[i]) { i++; j++; }
    if (j === pat.length) return i - j;
    else if (i < txt.length && pat[j] !== txt[i]) {
      if (j !== 0) j = lps[j - 1];
      else i++;
    }
  }
  return -1;
}`,
  execute(initialData, options = {}) {
    const text = 'ABABDABACDABABCABAB';
    const pattern = 'ABABCABAB';
    const arr = text.split('').map((c, i) => c.charCodeAt(0));
    const steps = [];

    steps.push(createStep({
      type: OP_TYPES.MESSAGE,
      stateSnapshot: [...arr],
      description: `KMP Searching text: "${text}" for pattern: "${pattern}"`,
      variables: { text, pattern },
      codeLine: 1
    }));

    let i = 0;
    let j = 0;

    while (i < text.length) {
      steps.push(createStep({
        type: OP_TYPES.COMPARE,
        indices: [i],
        values: [text.charCodeAt(i), pattern.charCodeAt(j)],
        stateSnapshot: [...arr],
        description: `Check text[${i}] ('${text[i]}') with pattern[${j}] ('${pattern[j]}')`,
        variables: { textIndex: i, patternIndex: j, charText: text[i], charPat: pattern[j] },
        codeLine: 4
      }));

      if (pattern[j] === text[i]) {
        i++;
        j++;
      }

      if (j === pattern.length) {
        const matchIdx = i - j;
        steps.push(createStep({
          type: OP_TYPES.PATH_FOUND,
          indices: Array.from({ length: pattern.length }, (_, k) => matchIdx + k),
          stateSnapshot: [...arr],
          description: `Pattern "${pattern}" matched starting at index ${matchIdx}!`,
          variables: { matchedIndex: matchIdx },
          codeLine: 5
        }));
        break;
      } else if (i < text.length && pattern[j] !== text[i]) {
        if (j !== 0) {
          j = 0;
        } else {
          i++;
        }
      }
    }

    steps.push(createStep({
      type: OP_TYPES.COMPLETE,
      stateSnapshot: [...arr],
      description: 'KMP Search complete!',
      codeLine: 10
    }));

    return steps;
  }
};

// --- SIEVE OF ERATOSTHENES ---
export const sieveOfEratosthenes = {
  id: 'sieve-eratosthenes',
  name: 'Sieve of Eratosthenes',
  category: 'mathematics',
  structureType: 'array',
  complexity: { timeBest: 'O(n log log n)', timeAverage: 'O(n log log n)', timeWorst: 'O(n log log n)', space: 'O(n)' },
  description: 'Ancient prime generation algorithm that finds all prime numbers up to any given limit by iteratively marking multiples of each prime as composite starting from 2.',
  code: `function sieve(n) {
  let prime = new Array(n + 1).fill(true);
  prime[0] = prime[1] = false;
  for (let p = 2; p * p <= n; p++) {
    if (prime[p]) {
      for (let i = p * p; i <= n; i += p) {
        prime[i] = false;
      }
    }
  }
  return prime;
}`,
  execute(initialData) {
    const n = 24;
    const isPrime = new Array(n + 1).fill(1); // 1 for prime, 0 for composite
    isPrime[0] = 0;
    isPrime[1] = 0;
    const steps = [];

    steps.push(createStep({
      type: OP_TYPES.MESSAGE,
      stateSnapshot: [...isPrime],
      description: `Sieve of Eratosthenes: Finding all primes up to ${n}`,
      variables: { limit: n },
      codeLine: 2
    }));

    for (let p = 2; p * p <= n; p++) {
      if (isPrime[p] === 1) {
        steps.push(createStep({
          type: OP_TYPES.VISIT,
          indices: [p],
          values: [p],
          stateSnapshot: [...isPrime],
          description: `Prime found: ${p}. Marking all multiples ${p*p}, ${p*p+p}... as composite`,
          variables: { prime: p },
          codeLine: 4
        }));

        for (let i = p * p; i <= n; i += p) {
          isPrime[i] = 0;
          steps.push(createStep({
            type: OP_TYPES.OVERWRITE,
            indices: [i],
            values: [0],
            stateSnapshot: [...isPrime],
            description: `Marked composite: ${i} (multiple of ${p})`,
            variables: { compositeNumber: i, primeFactor: p },
            codeLine: 6
          }));
        }
      }
    }

    const primes = [];
    for (let i = 2; i <= n; i++) if (isPrime[i] === 1) primes.push(i);

    steps.push(createStep({
      type: OP_TYPES.COMPLETE,
      indices: primes,
      stateSnapshot: [...isPrime],
      description: `Sieve finished! Primes up to ${n}: [${primes.join(', ')}]`,
      variables: { primeCount: primes.length, primesList: primes },
      codeLine: 10
    }));

    return steps;
  }
};
