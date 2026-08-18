/**
 * Algorithm Knowledge Base & Metadata Registry for ALGO3D
 * Provides structured computer science properties, prerequisites, and learning paths.
 */

export const ALGORITHM_METADATA = {
  // === SORTING ===
  'bubble-sort': {
    paradigm: 'Brute Force / Comparison',
    stable: true,
    inPlace: true,
    difficulty: 'Beginner',
    prerequisites: ['Arrays', 'Loops', 'Conditional Swapping'],
    relatedAlgorithms: ['selection-sort', 'insertion-sort', 'cocktail-sort'],
    whatItDoes: 'Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.',
    howItWorks: 'In each pass, the largest unsorted element bubbles up to its correct final position at the end of the array.',
    whenToUse: 'Small datasets or educational demonstrations of basic comparison mechanics.',
    whenNotToUse: 'Large datasets (O(n²) worst and average case complexity).',
    advantages: ['Simple to understand and implement', 'In-place with O(1) auxiliary space', 'Stable sort preserving duplicate order'],
    limitations: ['Extremely slow on large inputs', 'O(n²) comparisons and swaps']
  },
  'selection-sort': {
    paradigm: 'Greedy / Selection',
    stable: false,
    inPlace: true,
    difficulty: 'Beginner',
    prerequisites: ['Arrays', 'Min/Max Finding'],
    relatedAlgorithms: ['bubble-sort', 'insertion-sort', 'heap-sort'],
    whatItDoes: 'Divides the array into sorted and unsorted regions, repeatedly finding the minimum element from the unsorted region and moving it to the sorted region.',
    howItWorks: 'Scans the unsorted suffix to locate the minimum element, then performs exactly one swap per pass to append it to the sorted prefix.',
    whenToUse: 'When auxiliary memory is constrained and minimizing the number of write operations (at most n-1 swaps) is critical.',
    whenNotToUse: 'Large datasets or when stability is required.',
    advantages: ['Performs at most O(n) memory writes', 'In-place algorithm with O(1) extra space', 'Consistent O(n²) performance regardless of input ordering'],
    limitations: ['O(n²) comparisons even on already sorted arrays', 'Unstable sort']
  },
  'insertion-sort': {
    paradigm: 'Incremental Construction',
    stable: true,
    inPlace: true,
    difficulty: 'Beginner',
    prerequisites: ['Arrays', 'Linear Search'],
    relatedAlgorithms: ['bubble-sort', 'selection-sort', 'shell-sort'],
    whatItDoes: 'Builds the final sorted array one item at a time by repeatedly inserting an unsorted element into its proper position in the sorted subarray.',
    howItWorks: 'Maintains a sorted left prefix. For each new element, shifts larger elements to the right to create a slot for insertion.',
    whenToUse: 'Small datasets (N < 50) or nearly sorted datasets where it runs in near-linear O(n) time.',
    whenNotToUse: 'Large reverse-ordered datasets.',
    advantages: ['Adaptive: O(n) time for nearly sorted data', 'Stable and in-place', 'Low overhead and cache-friendly'],
    limitations: ['O(n²) worst-case on reverse-sorted inputs']
  },
  'quick-sort': {
    paradigm: 'Divide and Conquer',
    stable: false,
    inPlace: true,
    difficulty: 'Intermediate',
    prerequisites: ['Recursion', 'Array Partitioning', 'Pivot Selection'],
    relatedAlgorithms: ['merge-sort', 'heap-sort', 'dutch-national-flag'],
    whatItDoes: 'Selects a pivot element and partitions the array into two subarrays of elements less than and greater than the pivot, then recursively sorts the subarrays.',
    howItWorks: 'Lomuto or Hoare partitioning places the pivot in its final position in O(n) time, dividing the problem into two smaller subproblems.',
    whenToUse: 'General-purpose high-performance in-memory sorting where average O(n log n) speed and in-place sorting are desired.',
    whenNotToUse: 'When worst-case O(n²) must be strictly avoided or stability is mandatory.',
    advantages: ['Fastest general-purpose sorting algorithm in practice', 'In-place with O(log n) call stack space', 'Excellent cache locality'],
    limitations: ['O(n²) worst-case on unbalanced partitions without randomized/median-of-three pivots', 'Not stable']
  },
  'merge-sort': {
    paradigm: 'Divide and Conquer',
    stable: true,
    inPlace: false,
    difficulty: 'Intermediate',
    prerequisites: ['Recursion', 'Two-Pointer Merging'],
    relatedAlgorithms: ['quick-sort', 'heap-sort', 'linked-list'],
    whatItDoes: 'Recursively divides the array into halves until single elements remain, then merges the sorted halves back together.',
    howItWorks: 'Splits at midpoint in O(1), recursively sorts left and right halves, and merges two sorted arrays in linear O(n) time.',
    whenToUse: 'When guaranteed O(n log n) worst-case performance and stability are required, or when sorting linked lists and external files.',
    whenNotToUse: 'When memory is tightly constrained (requires O(n) auxiliary space for arrays).',
    advantages: ['Guaranteed O(n log n) across best, average, and worst cases', 'Stable sorting', 'Parallelizes and streams well'],
    limitations: ['Requires O(n) auxiliary space for array merging']
  },
  'heap-sort': {
    paradigm: 'Selection / Binary Heap',
    stable: false,
    inPlace: true,
    difficulty: 'Intermediate',
    prerequisites: ['Binary Heaps', 'Complete Binary Trees', 'Sift-Down / Heapify'],
    relatedAlgorithms: ['quick-sort', 'merge-sort', 'selection-sort'],
    whatItDoes: 'Builds a max-heap from the input array, then repeatedly extracts the maximum element and restores the heap property.',
    howItWorks: 'Floyd’s heapify constructs a max-heap in O(n) time. The root is swapped with the last element and heapified down in O(log n) time.',
    whenToUse: 'When guaranteed O(n log n) time and strict O(1) auxiliary space are required without worst-case degradation.',
    whenNotToUse: 'When stability is needed or maximum cache locality is desired (heap traversal has non-sequential memory access).',
    advantages: ['Strict O(n log n) upper bound', 'In-place with O(1) auxiliary memory', 'No recursive call stack overhead'],
    limitations: ['Poorer cache performance than Quick Sort', 'Not stable']
  },

  // === SEARCHING ===
  'binary-search': {
    paradigm: 'Decrease and Conquer',
    stable: true,
    inPlace: true,
    difficulty: 'Beginner',
    prerequisites: ['Sorted Arrays', 'Pointers / Indices'],
    relatedAlgorithms: ['linear-search', 'jump-search', 'interpolation-search'],
    whatItDoes: 'Finds the position of a target value within a sorted array by repeatedly halving the search space.',
    howItWorks: 'Compares target with the middle element. If unequal, eliminates the half in which the target cannot lie in O(1) time.',
    whenToUse: 'Looking up items in any sorted random-access dataset.',
    whenNotToUse: 'Unsorted arrays or linked lists without O(1) random access.',
    advantages: ['Logarithmic O(log n) time complexity', 'Minimal comparisons required (at most ~30 for 1 billion items)', 'Low memory overhead'],
    limitations: ['Strict requirement that input array must be sorted']
  },
  'linear-search': {
    paradigm: 'Brute Force',
    stable: true,
    inPlace: true,
    difficulty: 'Beginner',
    prerequisites: ['Arrays', 'Iteration'],
    relatedAlgorithms: ['binary-search', 'jump-search'],
    whatItDoes: 'Sequentially checks each element of the array until a match is found or the whole list has been searched.',
    howItWorks: 'Iterates from index 0 to n-1, returning the index upon equality.',
    whenToUse: 'Small unsorted arrays or when performing a single search where sorting overhead is unjustified.',
    whenNotToUse: 'Large datasets with repeated queries.',
    advantages: ['Works on unsorted data', 'Works on streaming/linked data', 'Zero preprocessing overhead'],
    limitations: ['Linear O(n) search time']
  },

  // === GRAPHS ===
  'dijkstra': {
    paradigm: 'Greedy / Dynamic Programming',
    stable: true,
    inPlace: false,
    difficulty: 'Intermediate',
    prerequisites: ['Graphs', 'Priority Queues / Min-Heaps', 'Edge Relaxation'],
    relatedAlgorithms: ['bellman-ford', 'bfs', 'prim'],
    whatItDoes: 'Finds the shortest paths from a single source vertex to all other vertices in a weighted graph with non-negative edge weights.',
    howItWorks: 'Greedily extracts the unvisited vertex with the minimum tentative distance, then relaxes all outgoing edges.',
    whenToUse: 'Routing, network latency optimization, GPS mapping with non-negative road weights.',
    whenNotToUse: 'Graphs containing negative edge weights or negative cycles.',
    advantages: ['Optimal O((V + E) log V) time with min-heap', 'Fastest single-source shortest path for non-negative graphs'],
    limitations: ['Fails and produces incorrect results on graphs with negative edge weights']
  },
  'bellman-ford': {
    paradigm: 'Dynamic Programming',
    stable: true,
    inPlace: false,
    difficulty: 'Intermediate',
    prerequisites: ['Graphs', 'Edge Relaxation', 'Negative Cycles'],
    relatedAlgorithms: ['dijkstra', 'floyd-warshall'],
    whatItDoes: 'Computes shortest paths from a single source to all vertices and detects negative-weight cycles.',
    howItWorks: 'Relaxes all E edges V-1 times. A V-th iteration detects whether any distance can still decrease (indicating a negative cycle).',
    whenToUse: 'Financial arbitrage detection, distributed distance-vector routing, graphs with negative edge weights.',
    whenNotToUse: 'Large graphs with only positive weights where Dijkstra is significantly faster.',
    advantages: ['Correctly handles negative weights', 'Detects negative-weight cycles'],
    limitations: ['Slower O(V * E) time complexity']
  },
  'bfs': {
    paradigm: 'Breadth-First Traversal',
    stable: true,
    inPlace: false,
    difficulty: 'Beginner',
    prerequisites: ['Graphs', 'Queues (FIFO)'],
    relatedAlgorithms: ['dfs', 'dijkstra', 'topological-sort'],
    whatItDoes: 'Explores all vertices of a graph level-by-level starting from a root node.',
    howItWorks: 'Uses a FIFO queue to visit all neighbors at distance d before moving to distance d+1.',
    whenToUse: 'Finding unweighted shortest paths, level-order tree traversal, connected components.',
    whenNotToUse: 'Weighted graphs or deep graph property exploration.',
    advantages: ['Guarantees shortest path in unweighted graphs', 'Visits closest nodes first'],
    limitations: ['Requires O(V) memory for queue in wide graphs']
  },
  'dfs': {
    paradigm: 'Depth-First Traversal / Backtracking',
    stable: true,
    inPlace: false,
    difficulty: 'Beginner',
    prerequisites: ['Graphs', 'Recursion / Stacks (LIFO)'],
    relatedAlgorithms: ['bfs', 'topological-sort'],
    whatItDoes: 'Explores as deep as possible along each branch before backtracking.',
    howItWorks: 'Uses a recursion stack to advance along unvisited edges until reaching a dead end, then backtracks.',
    whenToUse: 'Cycle detection, topological sorting, maze solving, strongly connected components.',
    whenNotToUse: 'Finding shortest paths in unweighted graphs.',
    advantages: ['Memory efficient for deep graphs (O(h) call stack)', 'Natural for topological sorting and cycle checks'],
    limitations: ['Can get stuck in deep paths or infinite loops without visited set']
  },

  // === TREES ===
  'bst': {
    paradigm: 'Hierarchical Binary Tree',
    stable: true,
    inPlace: true,
    difficulty: 'Beginner',
    prerequisites: ['Binary Trees', 'Recursion', 'Total Ordering'],
    relatedAlgorithms: ['avl-tree', 'binary-search'],
    whatItDoes: 'Maintains elements in a binary tree where left children are smaller and right children are larger than the parent.',
    howItWorks: 'Navigates left or right at each node based on key comparison for O(h) insert, search, and delete.',
    whenToUse: 'Dynamic ordered data lookup, range queries, in-order traversal for sorted data.',
    whenNotToUse: 'When insertions may arrive in sorted order (degenerates to an O(n) linked list).',
    advantages: ['Simple dynamic data structure', 'In-order traversal yields sorted output'],
    limitations: ['Unbalanced worst-case height is O(n)']
  },
  'avl-tree': {
    paradigm: 'Self-Balancing Binary Search Tree',
    stable: true,
    inPlace: true,
    difficulty: 'Advanced',
    prerequisites: ['BST', 'Tree Rotations', 'Balance Factors'],
    relatedAlgorithms: ['bst'],
    whatItDoes: 'Self-balancing BST where the heights of the two child subtrees of any node differ by at most one.',
    howItWorks: 'Computes balance factor = height(left) - height(right). Restores balance after insert/delete using LL, RR, LR, or RL rotations.',
    whenToUse: 'Lookup-intensive applications requiring guaranteed O(log n) search time.',
    whenNotToUse: 'Frequent write-heavy workloads where rotation rebalancing overhead dominates.',
    advantages: ['Strict balance guarantees optimal O(log n) search bounds', 'Faster lookups than Red-Black trees'],
    limitations: ['More frequent rotations on insertion and deletion']
  },

  // === DYNAMIC PROGRAMMING ===
  'knapsack-01': {
    paradigm: 'Dynamic Programming',
    stable: true,
    inPlace: false,
    difficulty: 'Intermediate',
    prerequisites: ['DP Table', 'Optimal Substructure', 'Overlapping Subproblems'],
    relatedAlgorithms: ['longest-common-subsequence', 'coin-change-dp'],
    whatItDoes: 'Selects a subset of items with given weights and values to maximize total value without exceeding capacity W.',
    howItWorks: 'Constructs a 2D table DP[i][w] = max(DP[i-1][w], val[i] + DP[i-1][w-wt[i]]) to evaluate including or excluding item i.',
    whenToUse: 'Resource allocation, portfolio optimization, budgeting constraints.',
    whenNotToUse: 'When capacity W is extremely large (pseudo-polynomial time O(n * W)).',
    advantages: ['Finds exact global optimum', 'Avoids exponential 2^n brute-force exploration'],
    limitations: ['Pseudo-polynomial complexity dependent on capacity W']
  },
  'longest-common-subsequence': {
    paradigm: 'Dynamic Programming',
    stable: true,
    inPlace: false,
    difficulty: 'Intermediate',
    prerequisites: ['DP Table', 'String Matching'],
    relatedAlgorithms: ['knapsack-01', 'kmp'],
    whatItDoes: 'Finds the longest subsequence present in both strings in the same relative order.',
    howItWorks: 'If characters match, DP[i][j] = 1 + DP[i-1][j-1]; otherwise, DP[i][j] = max(DP[i-1][j], DP[i][j-1]).',
    whenToUse: 'Diff tools (git diff), DNA sequence alignment, revision control.',
    whenNotToUse: 'Extremely long strings where memory O(m * n) is prohibitive.',
    advantages: ['Solves sequence similarity in polynomial O(m * n) time'],
    limitations: ['Requires quadratic table space']
  },
  'coin-change-dp': {
    paradigm: 'Dynamic Programming',
    stable: true,
    inPlace: false,
    difficulty: 'Intermediate',
    prerequisites: ['DP Array', 'Memoization'],
    relatedAlgorithms: ['knapsack-01'],
    whatItDoes: 'Finds the minimum number of coins needed to make up a given amount using available coin denominations.',
    howItWorks: 'Computes DP[a] = min(DP[a - coin] + 1) for all coins, building solutions from 1 up to total amount.',
    whenToUse: 'Currency denomination optimization, discrete change computation.',
    whenNotToUse: 'When greedy approach is provably optimal (canonical coin systems like US coins).',
    advantages: ['Works correctly on non-canonical currency systems where greedy fails'],
    limitations: ['O(amount * coins) space and time']
  },

  // === BACKTRACKING ===
  'n-queens': {
    paradigm: 'Backtracking / State Space Tree',
    stable: true,
    inPlace: true,
    difficulty: 'Advanced',
    prerequisites: ['Recursion', 'Constraint Satisfaction', 'Diagonals'],
    relatedAlgorithms: ['dfs'],
    whatItDoes: 'Places N non-attacking queens on an N×N chessboard such that no two queens share the same row, column, or diagonal.',
    howItWorks: 'Places queens row by row. If a conflict is detected with existing queens, backtracks immediately to try the next column.',
    whenToUse: 'Constraint satisfaction problems, puzzle solving, scheduling conflicts.',
    whenNotToUse: 'Very large N (NP-complete / exponential search space).',
    advantages: ['Prunes invalid search subtrees early, drastically reducing search space compared to N^N brute force'],
    limitations: ['Exponential time complexity for large N']
  }
};

/**
 * Curated Guided Learning Paths
 */
export const LEARNING_PATHS = [
  {
    id: 'dsa-foundations',
    name: 'DSA Foundations',
    description: 'Master the fundamental data structures and elementary algorithms from linear arrays to graphs.',
    level: 'Beginner to Intermediate',
    algorithms: [
      'linear-search',
      'binary-search',
      'bubble-sort',
      'insertion-sort',
      'bst',
      'bfs',
      'dfs'
    ]
  },
  {
    id: 'sorting-mastery',
    name: 'Sorting Mastery',
    description: 'Deep-dive into comparison, divide-and-conquer, heap-based, and non-comparison distribution sorts.',
    level: 'Comprehensive',
    algorithms: [
      'bubble-sort',
      'selection-sort',
      'insertion-sort',
      'merge-sort',
      'quick-sort',
      'heap-sort',
      'counting-sort',
      'radix-sort'
    ]
  },
  {
    id: 'graph-mastery',
    name: 'Graph Mastery',
    description: 'Understand graph traversals, shortest path algorithms, and minimum spanning trees in 3D WebGL.',
    level: 'Intermediate to Advanced',
    algorithms: [
      'bfs',
      'dfs',
      'dijkstra',
      'bellman-ford',
      'prim',
      'kruskal',
      'topological-sort'
    ]
  },
  {
    id: 'trees-and-spatial',
    name: 'Trees & Spatial Architectures',
    description: 'Explore balanced search trees, spatial geometry, and 2D grid matrix traversals.',
    level: 'Intermediate',
    algorithms: [
      'bst',
      'avl-tree',
      'convex-hull-graham',
      'matrix-spiral'
    ]
  },
  {
    id: 'dp-and-backtracking',
    name: 'Dynamic Programming & Backtracking',
    description: 'Conquer optimal substructure, 2D memoization tables, and constraint satisfaction.',
    level: 'Advanced',
    algorithms: [
      'knapsack-01',
      'longest-common-subsequence',
      'coin-change-dp',
      'n-queens'
    ]
  }
];

/**
 * User Notes Storage Engine
 */
const NOTES_STORAGE_KEY = 'algo3d_user_algorithm_notes';

export class NotesEngine {
  static getNotes(algoId) {
    try {
      const all = JSON.parse(localStorage.getItem(NOTES_STORAGE_KEY) || '{}');
      return all[algoId] || '';
    } catch (e) {
      return '';
    }
  }

  static saveNotes(algoId, text) {
    try {
      const all = JSON.parse(localStorage.getItem(NOTES_STORAGE_KEY) || '{}');
      all[algoId] = text;
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(all));
    } catch (e) {
      // ignore
    }
  }
}
