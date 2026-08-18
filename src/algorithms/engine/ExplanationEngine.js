/**
 * Authoritative Educational Intelligence Explanation Engine for ALGO3D
 * Generates contextual answers to:
 * 1. WHAT is happening?
 * 2. WHERE is it happening?
 * 3. WHY is it happening?
 * 4. WHAT changed?
 * 5. WHAT happens next?
 */

import { OP_TYPES } from './StepModel.js';
import { getAlgorithmInvariant } from './InvariantEngine.js';
import { calculateStateDiff } from './DiffEngine.js';

export function generateStepExplanation({
  algorithmId = 'bubble-sort',
  step = null,
  nextStep = null,
  prevStep = null,
  currentState = null,
  prevState = null,
  variables = {}
}) {
  if (!step) {
    return {
      what: 'Algorithm is idle. Press Play or Step Forward to begin execution.',
      where: 'Entire dataset',
      why: 'Ready to process initial state.',
      diff: null,
      invariant: getAlgorithmInvariant(algorithmId, currentState, null, variables),
      nextOp: 'Start execution from first step'
    };
  }

  const vars = { ...variables, ...(step.variables || {}) };
  const indices = step.targets?.indices || step.indices || [];
  const nodes = step.targets?.nodes || step.nodes || [];
  const edges = step.targets?.edges || step.edges || [];
  const values = step.payload?.values || step.values || [];
  const type = step.type;

  let what = step.metadata?.explanation || step.description || '';
  let why = '';
  let where = '';

  // Determine WHERE
  if (nodes.length > 0) {
    where = `Vertex ${nodes.join(' ➔ ')}`;
  } else if (edges.length > 0) {
    where = `Edge (${edges.join(', ')})`;
  } else if (indices.length > 0) {
    where = indices.length === 1 ? `Index [${indices[0]}]` : `Indices [${indices.join(', ')}]`;
  } else {
    where = 'Global structure';
  }

  // Derive WHY based on Algorithm and Operation Type
  switch (algorithmId) {
    // === SORTING ===
    case 'bubble-sort':
      if (type === OP_TYPES.COMPARE) {
        why = values.length >= 2
          ? values[0] > values[1]
            ? `Inversion detected: ${values[0]} > ${values[1]}. The larger element must bubble to the right.`
            : `Correct relative order: ${values[0]} <= ${values[1]}. No swap is needed.`
          : 'Testing adjacent elements for ordering.';
      } else if (type === OP_TYPES.SWAP) {
        why = 'Swapping positions to move the larger element closer to its settled position on the right.';
      } else if (type === OP_TYPES.HIGHLIGHT) {
        why = 'The maximum element of this pass has settled at the end of the unsorted partition and is now permanently sorted.';
      }
      break;

    case 'selection-sort':
      if (type === OP_TYPES.COMPARE) {
        why = `Scanning unsorted portion to find the absolute minimum value. Comparing current candidate with scanned element.`;
      } else if (type === OP_TYPES.SWAP || type === OP_TYPES.MOVE) {
        why = `Placing the confirmed minimum element into the sorted prefix at the front of the array.`;
      }
      break;

    case 'insertion-sort':
      if (type === OP_TYPES.VISIT) {
        why = `Selecting element ${values[0] || ''} as the active key to be inserted into the sorted subarray.`;
      } else if (type === OP_TYPES.COMPARE) {
        why = `Comparing key against elements in the sorted portion to find the exact insertion point.`;
      } else if (type === OP_TYPES.SWAP || type === OP_TYPES.WRITE || type === OP_TYPES.OVERWRITE) {
        why = `Shifting larger sorted elements rightward to make space for the active key.`;
      }
      break;

    case 'quick-sort':
      if (type === OP_TYPES.PIVOT_SELECT || type === OP_TYPES.SELECT) {
        why = `Choosing pivot element to divide the array into elements smaller than the pivot and elements greater than the pivot.`;
      } else if (type === OP_TYPES.COMPARE) {
        why = `Evaluating element relative to pivot value ${vars.pivotVal ?? ''} to determine partition placement.`;
      } else if (type === OP_TYPES.SWAP) {
        why = `Relocating elements that violate the partition boundary to their correct sub-arena.`;
      }
      break;

    case 'merge-sort':
      if (type === OP_TYPES.SPLIT) {
        why = `Dividing array into smaller sub-arrays until base case (single-element subarrays) is reached.`;
      } else if (type === OP_TYPES.COMPARE) {
        why = `Comparing front elements of left and right sorted subarrays to determine the next smallest value.`;
      } else if (type === OP_TYPES.MERGE || type === OP_TYPES.WRITE || type === OP_TYPES.OVERWRITE) {
        why = `Merging smaller sorted pieces into a larger sorted subarray in non-decreasing order.`;
      }
      break;

    case 'heap-sort':
      if (type === OP_TYPES.HEAPIFY) {
        why = `Restoring max-heap property: parent must be greater than or equal to both child nodes.`;
      } else if (type === OP_TYPES.EXTRACT || type === OP_TYPES.SWAP) {
        why = `Extracting the maximum root value to the sorted end of the array, then shrinking the active heap boundary.`;
      }
      break;

    case 'shell-sort':
      if (type === OP_TYPES.COMPARE) {
        why = `Comparing elements separated by gap ${vars.gap || ''} to eliminate distant inversions before adjacent sorting.`;
      }
      break;

    case 'cocktail-shaker-sort':
      if (type === OP_TYPES.COMPARE) {
        why = `Bidirectional pass (${vars.direction || 'forward'}): bubbling extreme values to both ends of the array.`;
      }
      break;

    case 'comb-sort':
      if (type === OP_TYPES.COMPARE) {
        why = `Comparing across shrinking gap ${vars.gap || ''} with shrink factor 1.3 to quickly eliminate turtles (small values near array end).`;
      }
      break;

    case 'gnome-sort':
      if (type === OP_TYPES.COMPARE) {
        why = `Gnome checks if current pair is ordered. If yes, steps forward; if inverted, swaps and steps backward.`;
      }
      break;

    case 'counting-sort':
      if (type === OP_TYPES.WRITE || type === OP_TYPES.UPDATE) {
        why = `Incrementing frequency bucket tally for value ${values[0] ?? ''} without any pairwise comparisons.`;
      }
      break;

    case 'radix-sort':
      if (type === OP_TYPES.MOVE || type === OP_TYPES.INSERT) {
        why = `Distributing numbers into buckets [0..9] based on the current digit at base place ${vars.exp || 1}.`;
      }
      break;

    // === SEARCHING ===
    case 'linear-search':
      if (type === OP_TYPES.COMPARE) {
        why = `Checking if value ${values[0] ?? ''} at index ${indices[0]} matches search target ${vars.target ?? ''}.`;
      }
      break;

    case 'binary-search':
      if (type === OP_TYPES.COMPARE) {
        why = `Comparing target with midpoint element to eliminate half of the remaining search space.`;
      }
      break;

    case 'jump-search':
      if (type === OP_TYPES.COMPARE) {
        why = `Checking block boundary index to locate the specific interval containing the target.`;
      }
      break;

    case 'interpolation-search':
      if (type === OP_TYPES.COMPARE) {
        why = `Probing estimated index computed from linear interpolation slope based on key value distribution.`;
      }
      break;

    case 'ternary-search':
      if (type === OP_TYPES.COMPARE) {
        why = `Dividing search space into three equal segments via two probe points to eliminate 1/3 or 2/3 of space.`;
      }
      break;

    // === ARRAYS & TWO POINTER ===
    case 'kadanes-algorithm':
      if (type === OP_TYPES.VISIT || type === OP_TYPES.UPDATE) {
        why = `Deciding whether to extend the existing subarray sum or restart a new subarray from the current element.`;
      }
      break;

    case 'dutch-national-flag':
      if (type === OP_TYPES.SWAP || type === OP_TYPES.MOVE) {
        why = `Moving element into its correct color zone (0=Red, 1=White, 2=Blue) using three-way partition pointers.`;
      }
      break;

    case 'two-sum-pointer':
      if (type === OP_TYPES.COMPARE) {
        why = `Summing left and right values against target. If sum < target, increment left pointer; if sum > target, decrement right pointer.`;
      }
      break;

    // === DATA STRUCTURES ===
    case 'linked-list':
      if (type === OP_TYPES.INSERT || type === OP_TYPES.SET_POINTER) {
        why = `Updating next pointer references to splice new node into the chain without losing existing nodes.`;
      } else if (type === OP_TYPES.DELETE) {
        why = `Bypassing deleted node by linking predecessor directly to successor.`;
      }
      break;

    case 'stack':
      if (type === OP_TYPES.PUSH) {
        why = `Adding new element directly onto the top of the stack chamber (LIFO).`;
      } else if (type === OP_TYPES.POP) {
        why = `Removing the top-most element from the stack chamber.`;
      }
      break;

    case 'queue':
      if (type === OP_TYPES.ENQUEUE) {
        why = `Appending new element at REAR of conveyor track (FIFO).`;
      } else if (type === OP_TYPES.DEQUEUE) {
        why = `Removing front-most element from the conveyor track.`;
      }
      break;

    case 'hash-table':
      if (type === OP_TYPES.INSERT || type === OP_TYPES.SET_POINTER) {
        why = `Hashing key using key % capacity, mapping to bucket index and resolving collision via linked chaining.`;
      }
      break;

    // === TREES ===
    case 'bst':
      if (type === OP_TYPES.COMPARE) {
        why = `Comparing value with node key: value < key branches LEFT; value > key branches RIGHT.`;
      }
      break;

    case 'avl-tree':
      if (type === OP_TYPES.ROTATE) {
        why = `Tree is imbalanced (|BF| > 1). Performing ${vars.rotationType || ''} rotation to restore AVL height balance.`;
      } else if (type === OP_TYPES.UPDATE) {
        why = `Recalculating node height and balance factor = height(left) - height(right).`;
      }
      break;

    // === GRAPHS ===
    case 'dijkstra':
      if (type === OP_TYPES.SELECT || type === OP_TYPES.VISIT) {
        why = `Vertex ${nodes[0] || ''} has the minimum tentative distance among unvisited vertices. Finalizing shortest path.`;
      } else if (type === OP_TYPES.RELAX || type === OP_TYPES.DISTANCE_UPDATE) {
        why = `A shorter path to neighbor vertex has been discovered. Relaxing edge and updating tentative distance.`;
      }
      break;

    case 'bellman-ford':
      if (type === OP_TYPES.RELAX || type === OP_TYPES.DISTANCE_UPDATE) {
        why = `Relaxing edge in pass ${vars.pass || 1} to propagate shortest distance paths up to ${vars.pass || 1} hops.`;
      }
      break;

    case 'bfs':
      if (type === OP_TYPES.DISCOVER || type === OP_TYPES.ENQUEUE) {
        why = `Enqueuing unvisited neighbor into BFS frontier queue to explore all vertices at current hop depth first.`;
      }
      break;

    case 'dfs':
      if (type === OP_TYPES.VISIT || type === OP_TYPES.RECURSE) {
        why = `Advancing recursively along the deepest unvisited branch before backtracking.`;
      } else if (type === OP_TYPES.BACKTRACK || type === OP_TYPES.RETURN) {
        why = `All descendants from current vertex fully explored. Returning back to predecessor on the call stack.`;
      }
      break;

    case 'prim':
      if (type === OP_TYPES.EDGE_ACCEPT || type === OP_TYPES.SELECT) {
        why = `Selecting minimum weight edge crossing the cut between visited and unvisited vertices to grow the MST.`;
      }
      break;

    case 'kruskal':
      if (type === OP_TYPES.EDGE_ACCEPT) {
        why = `Edge connects two disjoint trees without creating a cycle; merging components into MST.`;
      } else if (type === OP_TYPES.EDGE_REJECT) {
        why = `Both endpoints already belong to the same connected component. Adding this edge would create a cycle. Rejecting edge.`;
      }
      break;

    case 'topological-sort':
      if (type === OP_TYPES.PROCESS || type === OP_TYPES.SELECT) {
        why = `Vertex has in-degree = 0 (zero unsatisfied prerequisites) and can be safely placed in topological order.`;
      }
      break;

    // === DYNAMIC PROGRAMMING ===
    case 'knapsack-01':
      if (type === OP_TYPES.UPDATE || type === OP_TYPES.COMPARE) {
        why = `Comparing value of TAKING item vs SKIPPING item to maximize total value within capacity constraint.`;
      }
      break;

    case 'longest-common-subsequence':
      if (type === OP_TYPES.COMPARE || type === OP_TYPES.UPDATE) {
        why = `If characters match, extend diagonal match by +1; otherwise inherit optimal solution from adjacent cells.`;
      }
      break;

    case 'coin-change-dp':
      if (type === OP_TYPES.UPDATE) {
        why = `Building minimum coin count for current amount using previously solved smaller amount subproblems.`;
      }
      break;

    // === GREEDY & BACKTRACKING ===
    case 'n-queens':
      if (type === OP_TYPES.PLACE) {
        why = `Placing queen in candidate column on current row and testing for row/column/diagonal attack conflicts.`;
      } else if (type === OP_TYPES.BACKTRACK || type === OP_TYPES.REMOVE) {
        why = `No valid column placement exists for subsequent rows. Backtracking to try next column for previous queen.`;
      }
      break;

    case 'activity-selection':
      if (type === OP_TYPES.SELECT || type === OP_TYPES.EDGE_ACCEPT) {
        why = `Greedily selecting compatible activity with earliest finish time to maximize remaining time window.`;
      } else if (type === OP_TYPES.REJECT) {
        why = `Activity overlaps with previously selected activity. Rejecting to prevent schedule conflict.`;
      }
      break;

    // === STRINGS & MATHEMATICS ===
    case 'kmp-search':
      if (type === OP_TYPES.COMPARE) {
        why = `Matching text character with pattern character. On mismatch, pattern will shift using LPS table without backtracking text pointer.`;
      }
      break;

    case 'sieve-eratosthenes':
      if (type === OP_TYPES.MARK || type === OP_TYPES.DELETE) {
        why = `Marking multiple of prime ${vars.prime || ''} as composite since any multiple of a prime is not prime.`;
      }
      break;

    // === SPATIAL & MATRICES ===
    case 'convex-hull-graham':
      if (type === OP_TYPES.BACKTRACK || type === OP_TYPES.REMOVE) {
        why = `Non-left turn detected (clockwise orientation). Removing vertex because it cannot lie on the outer convex perimeter.`;
      } else if (type === OP_TYPES.PLACE || type === OP_TYPES.SELECT) {
        why = `Valid counter-clockwise left turn confirmed. Adding candidate vertex to convex boundary stack.`;
      }
      break;

    case 'matrix-spiral':
      if (type === OP_TYPES.MOVE || type === OP_TYPES.VISIT) {
        why = `Traversing current matrix boundary in clockwise spiral order (Top ➔ Right ➔ Bottom ➔ Left).`;
      }
      break;

    default:
      why = 'Executing step according to algorithm rules.';
      break;
  }

  if (!why) {
    why = 'Algorithm executing next deterministic operation.';
  }

  // Next Operation Preview
  let nextOp = 'End of execution / Final state reached';
  if (nextStep) {
    const nextType = nextStep.type;
    const nextIndices = nextStep.targets?.indices || nextStep.indices || [];
    const nextNodes = nextStep.targets?.nodes || nextStep.nodes || [];
    if (nextNodes.length > 0) {
      nextOp = `${nextType} on Vertex ${nextNodes.join(', ')}`;
    } else if (nextIndices.length > 0) {
      nextOp = `${nextType} at Index [${nextIndices.join(', ')}]`;
    } else {
      nextOp = `${nextType} (${nextStep.description || 'Next step'})`;
    }
  }

  // State Diff
  const diff = calculateStateDiff(prevState, currentState, step);

  // Invariant
  const invariant = getAlgorithmInvariant(algorithmId, currentState, step, vars);

  return {
    what,
    where,
    why,
    diff,
    invariant,
    nextOp
  };
}
