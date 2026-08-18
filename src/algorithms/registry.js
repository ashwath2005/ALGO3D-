// Sorting
import { bubbleSort } from './sorting/bubbleSort.js';
import { selectionSort, insertionSort } from './sorting/selectionInsertionSort.js';
import { quickSort, mergeSort } from './sorting/quickMergeSort.js';
import { heapSort } from './sorting/heapSort.js';
import {
  shellSort,
  cocktailShakerSort,
  countingSort,
  radixSort,
  gnomeSort,
  combSort
} from './sorting/allSorting.js';

// Searching
import { linearSearch, binarySearch } from './searching/searchAlgorithms.js';
import { jumpSearch, interpolationSearch, ternarySearch } from './searching/allSearching.js';

// Arrays & Two Pointer
import { kadaneAlgorithm, dutchNationalFlag, twoSumPointer } from './arrays/arrayAlgorithms.js';

// Data Structures
import { linkedListOps, stackOps, queueOps, hashTableOps } from './structures/dataStructureOps.js';

// Trees
import { bstOps, avlOps } from './trees/treeAlgorithms.js';

// Graphs
import { dijkstra, bfs, dfs, prim, createDefaultGraph } from './graphs/graphAlgorithms.js';
import { bellmanFord, kruskal, topologicalSort } from './graphs/allGraphs.js';

// Dynamic Programming
import { knapsack01, longestCommonSubsequence, coinChangeDP } from './dp/allDP.js';

// Greedy & Backtracking
import { nQueens, activitySelection } from './greedyBacktracking/allGreedyBacktracking.js';

// Strings & Math
import { kmpPatternMatch, sieveOfEratosthenes } from './stringsMath/allStringsMath.js';

// Spatial & Matrices
import { convexHullGraham, matrixSpiral } from './spatial/allSpatial.js';

export const ALGORITHMS = {
  // === SORTING ===
  'bubble-sort': { ...bubbleSort, difficulty: 'Easy', tags: ['comparison', 'stable', 'basic'] },
  'selection-sort': { ...selectionSort, difficulty: 'Easy', tags: ['comparison', 'in-place'] },
  'insertion-sort': { ...insertionSort, difficulty: 'Easy', tags: ['comparison', 'online', 'stable'] },
  'quick-sort': { ...quickSort, difficulty: 'Medium', tags: ['divide-and-conquer', 'pivot', 'fast'] },
  'merge-sort': { ...mergeSort, difficulty: 'Medium', tags: ['divide-and-conquer', 'stable', 'recursive'] },
  'heap-sort': { ...heapSort, difficulty: 'Medium', tags: ['heap', 'tree-based', 'in-place'] },
  'shell-sort': { ...shellSort, difficulty: 'Medium', tags: ['gap-sequence', 'diminishing-increment'] },
  'cocktail-shaker-sort': { ...cocktailShakerSort, difficulty: 'Easy', tags: ['bidirectional', 'bubble-variant'] },
  'comb-sort': { ...combSort, difficulty: 'Medium', tags: ['shrink-factor', 'gap-sequence'] },
  'gnome-sort': { ...gnomeSort, difficulty: 'Easy', tags: ['garden-gnome', 'step-back'] },
  'counting-sort': { ...countingSort, difficulty: 'Easy', tags: ['non-comparison', 'integer-sort', 'stable'] },
  'radix-sort': { ...radixSort, difficulty: 'Medium', tags: ['non-comparison', 'digit-by-digit', 'lsd'] },

  // === SEARCHING ===
  'linear-search': { ...linearSearch, difficulty: 'Easy', tags: ['sequential', 'unsorted'] },
  'binary-search': { ...binarySearch, difficulty: 'Easy', tags: ['logarithmic', 'divide-and-conquer', 'sorted'] },
  'jump-search': { ...jumpSearch, difficulty: 'Easy', tags: ['block-jump', 'square-root', 'sorted'] },
  'interpolation-search': { ...interpolationSearch, difficulty: 'Medium', tags: ['slope-probe', 'uniform-distribution'] },
  'ternary-search': { ...ternarySearch, difficulty: 'Medium', tags: ['3-way-split', 'logarithmic'] },

  // === ARRAYS & TWO POINTER ===
  'kadanes-algorithm': { ...kadaneAlgorithm, difficulty: 'Medium', tags: ['maximum-subarray', 'linear-time', 'dynamic-sum'] },
  'dutch-national-flag': { ...dutchNationalFlag, difficulty: 'Medium', tags: ['3-way-partition', 'pointers', 'in-place'] },
  'two-sum-pointer': { ...twoSumPointer, difficulty: 'Easy', tags: ['two-pointer', 'sorted-pair', 'target-sum'] },

  // === DATA STRUCTURES ===
  'linked-list': { ...linkedListOps, difficulty: 'Easy', tags: ['pointers', 'node-chain', 'dynamic-memory'] },
  'stack': { ...stackOps, difficulty: 'Easy', tags: ['lifo', 'push-pop', 'depth'] },
  'queue': { ...queueOps, difficulty: 'Easy', tags: ['fifo', 'front-rear', 'conveyor'] },
  'hash-table': { ...hashTableOps, difficulty: 'Medium', tags: ['hash-function', 'chaining', 'collision'] },

  // === TREES ===
  'bst': { ...bstOps, difficulty: 'Medium', tags: ['binary-search', 'hierarchical', 'traversals'] },
  'avl-tree': { ...avlOps, difficulty: 'Hard', tags: ['self-balancing', 'rotations', 'height-balanced'] },

  // === GRAPHS ===
  'dijkstra': { ...dijkstra, difficulty: 'Medium', tags: ['shortest-path', 'greedy', 'priority-queue'] },
  'bellman-ford': { ...bellmanFord, difficulty: 'Hard', tags: ['negative-weights', 'relaxation', 'shortest-path'] },
  'bfs': { ...bfs, difficulty: 'Easy', tags: ['layer-by-layer', 'queue', 'connectivity'] },
  'dfs': { ...dfs, difficulty: 'Easy', tags: ['recursive-stack', 'depth', 'backtracking'] },
  'prim': { ...prim, difficulty: 'Medium', tags: ['minimum-spanning-tree', 'greedy', 'cut-property'] },
  'kruskal': { ...kruskal, difficulty: 'Medium', tags: ['mst', 'dsu', 'edge-sorting'] },
  'topological-sort': { ...topologicalSort, difficulty: 'Medium', tags: ['dag', 'in-degree', 'dependency-ordering'] },

  // === DYNAMIC PROGRAMMING ===
  'knapsack-01': { ...knapsack01, difficulty: 'Medium', tags: ['dp-table', 'combinatorial-optimization', 'memoization'] },
  'longest-common-subsequence': { ...longestCommonSubsequence, difficulty: 'Medium', tags: ['dp-matrix', 'strings', 'subsequence'] },
  'coin-change-dp': { ...coinChangeDP, difficulty: 'Medium', tags: ['min-coins', 'bottom-up', 'unbounded'] },

  // === GREEDY & BACKTRACKING ===
  'n-queens': { ...nQueens, difficulty: 'Hard', tags: ['backtracking', 'chess-board', 'recursion'] },
  'activity-selection': { ...activitySelection, difficulty: 'Easy', tags: ['greedy-scheduling', 'finish-times', 'intervals'] },

  // === STRINGS & MATHEMATICS ===
  'kmp-search': { ...kmpPatternMatch, difficulty: 'Hard', tags: ['pattern-matching', 'lps-array', 'linear-time'] },
  'sieve-eratosthenes': { ...sieveOfEratosthenes, difficulty: 'Easy', tags: ['prime-numbers', 'multiples', 'math'] },

  // === SPATIAL & MATRICES ===
  'convex-hull-graham': { ...convexHullGraham, difficulty: 'Hard', tags: ['geometry', 'polygon-boundary', 'polar-angle'] },
  'matrix-spiral': { ...matrixSpiral, difficulty: 'Easy', tags: ['2d-grid', 'spiral-order', 'boundary-pointers'] }
};

export const CATEGORIES = [
  { id: 'all', name: 'All Universe' },
  { id: 'sorting', name: 'Sorting' },
  { id: 'searching', name: 'Searching' },
  { id: 'arrays', name: 'Arrays & Pointers' },
  { id: 'structures', name: 'Data Structures' },
  { id: 'trees', name: 'Trees & Heaps' },
  { id: 'graphs', name: 'Graph Algorithms' },
  { id: 'dynamicProgramming', name: 'Dynamic Programming' },
  { id: 'greedy', name: 'Greedy' },
  { id: 'backtracking', name: 'Backtracking' },
  { id: 'strings', name: 'Strings' },
  { id: 'mathematics', name: 'Mathematics' },
  { id: 'geometry', name: 'Geometry & Spatial' },
  { id: 'matrices', name: 'Matrices' }
];

export function getAlgorithmById(id) {
  return ALGORITHMS[id] || ALGORITHMS['bubble-sort'];
}

export function generateInitialData(structureType, size = 8, mode = 'random') {
  if (structureType === 'array') {
    if (mode === 'sorted') {
      return Array.from({ length: size }, (_, i) => Math.round(10 + (i * 80) / size));
    }
    if (mode === 'reverse') {
      return Array.from({ length: size }, (_, i) => Math.round(90 - (i * 80) / size));
    }
    if (mode === 'nearly') {
      const arr = Array.from({ length: size }, (_, i) => Math.round(10 + (i * 80) / size));
      if (arr.length > 3) {
        const temp = arr[1]; arr[1] = arr[2]; arr[2] = temp;
      }
      return arr;
    }
    return Array.from({ length: size }, () => Math.floor(Math.random() * 85) + 10);
  }

  if (structureType === 'linkedList') {
    return [15, 28, 42, 67, 89];
  }

  if (structureType === 'stack') {
    return [12, 24, 38, 52];
  }

  if (structureType === 'queue') {
    return [10, 20, 30, 40, 50];
  }

  if (structureType === 'hashTable') {
    return [[], [22], [], [15, 29], [], [40], []];
  }

  if (structureType === 'tree') {
    return [50, 30, 70, 20, 40, 60, 80];
  }

  if (structureType === 'graph') {
    return createDefaultGraph();
  }

  if (structureType === 'matrix') {
    return [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];
  }

  if (structureType === 'spatial') {
    return [
      { id: 0, x: -3, y: -2, z: 0 },
      { id: 1, x: 3, y: -2, z: 0 },
      { id: 2, x: 4, y: 1, z: 0 },
      { id: 3, x: 1, y: 3, z: 0 },
      { id: 4, x: -2, y: 2.5, z: 0 },
      { id: 5, x: -3.5, y: 0.5, z: 0 }
    ];
  }

  return [25, 12, 89, 45, 63, 17, 76, 34];
}
