/**
 * Authoritative Challenge Engine for ALGO3D Challenge Lab
 * Features Prediction, Complexity, Debugging (broken sandboxed code), and Decision challenges.
 */

const PROGRESS_STORAGE_KEY = 'algo3d_challenge_progress';

export const CHALLENGE_CATEGORIES = [
  'All',
  'Prediction',
  'Complexity',
  'Debugging',
  'Algorithm Decision'
];

export const CHALLENGES_DATABASE = [
  // ==========================================
  // 1. PREDICTION CHALLENGES
  // ==========================================
  {
    id: 'pred-1',
    category: 'Prediction',
    difficulty: 'Beginner',
    title: 'Bubble Sort: Next Inversion Swap',
    scenario: 'Array state: [14, 33, 27, 35, 10]. Pointer is at index 1 comparing 33 and 27.',
    question: 'What is the immediate next operation executed by Bubble Sort?',
    options: [
      'Advance to compare 35 and 10 without swapping',
      'SWAP elements 33 and 27 at indices 1 and 2',
      'Restart the pass from index 0',
      'Mark 35 as permanently sorted'
    ],
    correctIndex: 1,
    explanation: 'Since 33 > 27, the adjacent order invariant is violated. Bubble Sort immediately emits a SWAP between index 1 and index 2.',
    targetAlgorithm: 'bubble-sort'
  },
  {
    id: 'pred-2',
    category: 'Prediction',
    difficulty: 'Intermediate',
    title: 'AVL Tree: Balance Factor & Rotation',
    scenario: 'Inserted keys: [30, 20, 10]. Node 30 has left subtree height 2 and right subtree height 0 (Balance Factor = +2).',
    question: 'Which rotation does AVL Tree execute to restore balance?',
    options: [
      'Left Rotation (RR)',
      'Right-Left Double Rotation (RL)',
      'Right Rotation (LL)',
      'Left-Right Double Rotation (LR)'
    ],
    correctIndex: 2,
    explanation: 'With a +2 balance factor and a left-heavy left child (LL imbalance), a single Right Rotation at node 30 promotes 20 to the root with children 10 and 30.',
    targetAlgorithm: 'avl-tree'
  },
  {
    id: 'pred-3',
    category: 'Prediction',
    difficulty: 'Intermediate',
    title: "Dijkstra's Greedy Min-Heap Extraction",
    scenario: 'Source: Node A. Priority Queue tentative distances: { B: 4, C: 2, D: 7, E: 5 }.',
    question: 'Which vertex is extracted next from the priority queue?',
    options: [
      'Node D (highest tentative distance)',
      'Node B (first alphabetical neighbor)',
      'Node C (smallest tentative distance = 2)',
      'Node E (most recently added)'
    ],
    correctIndex: 2,
    explanation: "Dijkstra's algorithm greedily extracts the unvisited vertex with the minimum tentative distance: Node C (dist = 2).",
    targetAlgorithm: 'dijkstra'
  },
  {
    id: 'pred-4',
    category: 'Prediction',
    difficulty: 'Intermediate',
    title: 'Quick Sort: Lomuto Partition Boundary',
    scenario: 'Subarray: [8, 4, 12, 7]. Pivot is 7. Current elements examined: 8 (greater), 4 (smaller).',
    question: 'When 4 is identified as smaller than pivot 7, what swap occurs?',
    options: [
      '4 is swapped with pivot 7',
      '4 is swapped with 8 at the partition boundary pointer',
      '8 is swapped with pivot 7',
      'No swap occurs until the end'
    ],
    correctIndex: 1,
    explanation: 'In Lomuto partitioning, discovering an element smaller than the pivot increments the boundary pointer and swaps the small element (4) with the first larger element (8).',
    targetAlgorithm: 'quick-sort'
  },

  // ==========================================
  // 2. COMPLEXITY CHALLENGES
  // ==========================================
  {
    id: 'comp-1',
    category: 'Complexity',
    difficulty: 'Intermediate',
    title: 'Quick Sort Pathological Worst Case',
    scenario: 'An array of N elements is already sorted in ascending order. Quick Sort uses the last element as pivot without randomization.',
    question: 'What is the resulting time complexity and recursion tree depth?',
    options: [
      'O(N log N) time, O(log N) depth',
      'O(N²) time, O(N) depth',
      'O(N) time, O(1) depth',
      'O(N log² N) time, O(log N) depth'
    ],
    correctIndex: 1,
    explanation: 'With the last element as pivot on sorted data, partition sizes are N-1 and 0 at every level. This produces a degenerate recursion tree of depth N and quadratic O(N²) comparisons.',
    targetAlgorithm: 'quick-sort'
  },
  {
    id: 'comp-2',
    category: 'Complexity',
    difficulty: 'Beginner',
    title: 'Binary Search Comparison Upper Bound',
    scenario: 'A sorted dataset contains 1,048,576 (2²⁰) elements.',
    question: 'What is the maximum number of element comparisons required to find any target (or conclude it is absent)?',
    options: [
      '~1,048,576 comparisons',
      '~524,288 comparisons',
      'At most 21 comparisons',
      'At most 100 comparisons'
    ],
    correctIndex: 2,
    explanation: 'Binary Search halves the search space in each step: ceil(log₂(1048576)) + 1 = 20 + 1 = 21 comparisons maximum.',
    targetAlgorithm: 'binary-search'
  },

  // ==========================================
  // 3. DEBUG CHALLENGES (SANDBOXED BROKEN CODE)
  // ==========================================
  {
    id: 'dbg-1',
    category: 'Debugging',
    difficulty: 'Intermediate',
    title: 'Bug Detect: Infinite Loop in Binary Search',
    scenario: `Broken Code:
function binarySearch(arr, target) {
  let low = 0, high = arr.length - 1;
  while (low <= high) {
    let mid = Math.floor((low + high) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) low = mid; // BUG HERE
    else high = mid - 1;
  }
  return -1;
}`,
    question: 'Why does this implementation hang in an infinite loop when searching for an absent target?',
    options: [
      'Math.floor should be Math.ceil',
      'When low and high are adjacent (e.g. low=0, high=1) and arr[mid] < target, mid evaluates to 0 and low is assigned 0 repeatedly without advancing',
      'high should be assigned mid instead of mid - 1',
      'Array indexing is 1-based instead of 0-based'
    ],
    correctIndex: 1,
    explanation: 'When low and high differ by 1, mid = Math.floor(low + high / 2) = low. If arr[mid] < target, setting low = mid leaves low unchanged, looping infinitely. It must be low = mid + 1.',
    targetAlgorithm: 'binary-search'
  },
  {
    id: 'dbg-2',
    category: 'Debugging',
    difficulty: 'Advanced',
    title: 'Bug Detect: Dijkstra Infinite Cycle Relaxation',
    scenario: `Broken Code:
function dijkstra(graph, start) {
  const dist = { [start]: 0 };
  const pq = new MinPriorityQueue();
  pq.push(start, 0);
  
  while (!pq.isEmpty()) {
    const { node: u, priority: d } = pq.pop();
    // BUG: Missing if (d > dist[u]) continue / visited check
    for (const [v, weight] of graph.neighbors(u)) {
      if (dist[u] + weight < (dist[v] ?? Infinity)) {
        dist[v] = dist[u] + weight;
        pq.push(v, dist[v]);
      }
    }
  }
}`,
    question: 'What bug manifests if the priority queue contains multiple stale entries for the same node?',
    options: [
      'Memory overflow from exploring redundant higher-distance paths that have already been settled with a smaller distance',
      'The algorithm will return undefined',
      'The graph will delete its vertices',
      'Priority queue throws a type error'
    ],
    correctIndex: 0,
    explanation: 'Without checking whether the extracted distance d exceeds the settled dist[u], stale queue entries trigger redundant edge relaxations, degrading performance from O((V+E) log V) to O(E log V).',
    targetAlgorithm: 'dijkstra'
  },

  // ==========================================
  // 4. ALGORITHM DECISION CHALLENGES
  // ==========================================
  {
    id: 'dec-1',
    category: 'Algorithm Decision',
    difficulty: 'Intermediate',
    title: 'Optimal Routing with Negative Weights',
    scenario: 'You are designing a currency exchange arbitrage detection engine where graph edges represent exchange rates with logarithmic weights that can be negative.',
    question: 'Which shortest path algorithm MUST be chosen to handle negative edge weights and detect negative cycles?',
    options: [
      "Dijkstra's Algorithm",
      'Breadth-First Search (BFS)',
      'Bellman-Ford Algorithm',
      "Prim's Algorithm"
    ],
    correctIndex: 2,
    explanation: "Dijkstra's greedy assumption fails on negative weights. Bellman-Ford relaxes all edges V-1 times and reliably detects negative-weight cycles on the V-th pass.",
    targetAlgorithm: 'bellman-ford'
  },
  {
    id: 'dec-2',
    category: 'Algorithm Decision',
    difficulty: 'Beginner',
    title: 'Real-Time Sensor Stream Sorting (Nearly Sorted)',
    scenario: 'A temperature sensor appends 10 new readings per second to a 1,000-element array that is already 98% sorted.',
    question: 'Which sorting algorithm will execute fastest with minimal comparisons and near O(N) time?',
    options: [
      'Heap Sort',
      'Merge Sort',
      'Insertion Sort',
      'Selection Sort'
    ],
    correctIndex: 2,
    explanation: 'Insertion Sort is adaptive: on nearly sorted data with few inversions, its inner loop terminates almost immediately, achieving optimal O(N) execution time with zero auxiliary memory.',
    targetAlgorithm: 'insertion-sort'
  }
];

export class ChallengeEngine {
  static getAllChallenges() {
    return CHALLENGES_DATABASE;
  }

  static getChallengesByCategory(category) {
    if (!category || category === 'All') return CHALLENGES_DATABASE;
    return CHALLENGES_DATABASE.filter((c) => c.category === category);
  }

  static getProgress() {
    try {
      const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : { completedIds: [], score: 0, streak: 0 };
    } catch (e) {
      return { completedIds: [], score: 0, streak: 0 };
    }
  }

  static recordSuccess(challengeId) {
    try {
      const prog = ChallengeEngine.getProgress();
      if (!prog.completedIds.includes(challengeId)) {
        prog.completedIds.push(challengeId);
        prog.score += 100;
        prog.streak += 1;
        localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(prog));
      }
      return prog;
    } catch (e) {
      return { completedIds: [], score: 0, streak: 0 };
    }
  }

  static resetProgress() {
    try {
      localStorage.removeItem(PROGRESS_STORAGE_KEY);
    } catch (e) {
      // ignore
    }
  }
}
