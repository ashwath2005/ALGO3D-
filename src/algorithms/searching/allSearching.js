import { OP_TYPES, createStep } from '../engine/ExecutionEngine.js';

// --- JUMP SEARCH ---
export const jumpSearch = {
  id: 'jump-search',
  name: 'Jump Search',
  category: 'searching',
  structureType: 'array',
  complexity: { timeBest: 'O(1)', timeAverage: 'O(√n)', timeWorst: 'O(√n)', space: 'O(1)' },
  properties: { requiresSorted: true },
  description: 'Searches a sorted array by jumping ahead by fixed steps of size √n, then performing a linear search backwards.',
  code: `function jumpSearch(arr, target) {
  let n = arr.length;
  let step = Math.floor(Math.sqrt(n));
  let prev = 0;
  while (arr[Math.min(step, n) - 1] < target) {
    prev = step;
    step += Math.floor(Math.sqrt(n));
    if (prev >= n) return -1;
  }
  while (arr[prev] < target) {
    prev++;
    if (prev === Math.min(step, n)) return -1;
  }
  if (arr[prev] === target) return prev;
  return -1;
}`,
  execute(initialData, options = {}) {
    const arr = [...initialData].sort((a, b) => a - b);
    const target = options.target !== undefined ? options.target : (arr[Math.floor(arr.length * 0.7)] || 40);
    const steps = [];
    const n = arr.length;
    const blockSize = Math.floor(Math.sqrt(n));
    let step = blockSize;
    let prev = 0;

    steps.push(createStep({
      type: OP_TYPES.MESSAGE,
      stateSnapshot: [...arr],
      description: `Jump Search for ${target} with block jump size √${n} = ${blockSize}`,
      variables: { target, blockSize, n },
      codeLine: 3
    }));

    while (arr[Math.min(step, n) - 1] < target) {
      const checkIdx = Math.min(step, n) - 1;
      steps.push(createStep({
        type: OP_TYPES.COMPARE,
        indices: [checkIdx],
        values: [arr[checkIdx], target],
        stateSnapshot: [...arr],
        description: `Block check at index ${checkIdx} (${arr[checkIdx]} < ${target}). Jumping forward...`,
        variables: { prev, step, checkIdx, target },
        codeLine: 5
      }));

      prev = step;
      step += blockSize;
      if (prev >= n) {
        steps.push(createStep({
          type: OP_TYPES.REJECT,
          stateSnapshot: [...arr],
          description: `Target ${target} is larger than all elements. Not found.`,
          codeLine: 8
        }));
        return steps;
      }
    }

    steps.push(createStep({
      type: OP_TYPES.MESSAGE,
      stateSnapshot: [...arr],
      description: `Target lies within block range [${prev} .. ${Math.min(step, n) - 1}]. Linear searching block...`,
      variables: { prev, step, target },
      codeLine: 10
    }));

    while (arr[prev] < target) {
      steps.push(createStep({
        type: OP_TYPES.COMPARE,
        indices: [prev],
        values: [arr[prev], target],
        stateSnapshot: [...arr],
        description: `Checking element at index ${prev} (${arr[prev]})`,
        variables: { prev, target },
        codeLine: 11
      }));

      prev++;
      if (prev === Math.min(step, n)) {
        steps.push(createStep({
          type: OP_TYPES.REJECT,
          stateSnapshot: [...arr],
          description: `Target ${target} not found in candidate block.`,
          codeLine: 13
        }));
        return steps;
      }
    }

    if (arr[prev] === target) {
      steps.push(createStep({
        type: OP_TYPES.PATH_FOUND,
        indices: [prev],
        values: [arr[prev]],
        stateSnapshot: [...arr],
        description: `Target ${target} found at index ${prev}!`,
        variables: { foundIndex: prev, target },
        codeLine: 14
      }));
    } else {
      steps.push(createStep({
        type: OP_TYPES.REJECT,
        stateSnapshot: [...arr],
        description: `Target ${target} not found in array.`,
        codeLine: 15
      }));
    }

    return steps;
  }
};

// --- INTERPOLATION SEARCH ---
export const interpolationSearch = {
  id: 'interpolation-search',
  name: 'Interpolation Search',
  category: 'searching',
  structureType: 'array',
  complexity: { timeBest: 'O(1)', timeAverage: 'O(log log n)', timeWorst: 'O(n)', space: 'O(1)' },
  properties: { requiresSorted: true, uniformDistributionPreferred: true },
  description: 'Improves Binary Search for uniformly distributed sorted data by estimating probe position using slope formula.',
  code: `function interpolationSearch(arr, target) {
  let low = 0, high = arr.length - 1;
  while (low <= high && target >= arr[low] && target <= arr[high]) {
    if (low === high) {
      if (arr[low] === target) return low;
      return -1;
    }
    let pos = low + Math.floor(((target - arr[low]) * (high - low)) / (arr[high] - arr[low]));
    if (arr[pos] === target) return pos;
    if (arr[pos] < target) low = pos + 1;
    else high = pos - 1;
  }
  return -1;
}`,
  execute(initialData, options = {}) {
    const arr = [...initialData].sort((a, b) => a - b);
    const target = options.target !== undefined ? options.target : (arr[Math.floor(arr.length * 0.5)] || 30);
    const steps = [];
    let low = 0;
    let high = arr.length - 1;

    steps.push(createStep({
      type: OP_TYPES.MESSAGE,
      stateSnapshot: [...arr],
      description: `Interpolation Search for target: ${target}`,
      variables: { low, high, target },
      codeLine: 2
    }));

    while (low <= high && target >= arr[low] && target <= arr[high]) {
      if (low === high) {
        if (arr[low] === target) {
          steps.push(createStep({
            type: OP_TYPES.PATH_FOUND,
            indices: [low],
            stateSnapshot: [...arr],
            description: `Target ${target} found at index ${low}!`,
            variables: { foundIndex: low, target },
            codeLine: 4
          }));
          return steps;
        }
        break;
      }

      const pos = low + Math.floor(((target - arr[low]) * (high - low)) / (arr[high] - arr[low]));

      steps.push(createStep({
        type: OP_TYPES.VISIT,
        indices: [low, pos, high],
        values: [arr[low], arr[pos], arr[high]],
        stateSnapshot: [...arr],
        description: `Probing formula estimated index ${pos} (Value: ${arr[pos]}) in window [${low}..${high}]`,
        variables: { low, high, pos, probeValue: arr[pos], target },
        codeLine: 7
      }));

      steps.push(createStep({
        type: OP_TYPES.COMPARE,
        indices: [pos],
        values: [arr[pos], target],
        stateSnapshot: [...arr],
        description: `Compare probed value ${arr[pos]} with target ${target}`,
        variables: { pos, probeValue: arr[pos], target },
        codeLine: 8
      }));

      if (arr[pos] === target) {
        steps.push(createStep({
          type: OP_TYPES.PATH_FOUND,
          indices: [pos],
          values: [arr[pos]],
          stateSnapshot: [...arr],
          description: `Target ${target} found at probed index ${pos}!`,
          variables: { foundIndex: pos, target },
          codeLine: 8
        }));
        return steps;
      }

      if (arr[pos] < target) {
        low = pos + 1;
      } else {
        high = pos - 1;
      }
    }

    steps.push(createStep({
      type: OP_TYPES.REJECT,
      stateSnapshot: [...arr],
      description: `Target ${target} not found in array.`,
      codeLine: 12
    }));

    return steps;
  }
};

// --- TERNARY SEARCH ---
export const ternarySearch = {
  id: 'ternary-search',
  name: 'Ternary Search',
  category: 'searching',
  structureType: 'array',
  complexity: { timeBest: 'O(1)', timeAverage: 'O(log3 n)', timeWorst: 'O(log3 n)', space: 'O(1)' },
  properties: { requiresSorted: true },
  description: 'Divides the sorted array into three equal parts using two midpoints (mid1 and mid2), eliminating 2/3 of remaining elements.',
  code: `function ternarySearch(arr, target, l = 0, r = arr.length - 1) {
  while (r >= l) {
    let mid1 = l + Math.floor((r - l) / 3);
    let mid2 = r - Math.floor((r - l) / 3);
    if (arr[mid1] === target) return mid1;
    if (arr[mid2] === target) return mid2;
    if (target < arr[mid1]) r = mid1 - 1;
    else if (target > arr[mid2]) l = mid2 + 1;
    else { l = mid1 + 1; r = mid2 - 1; }
  }
  return -1;
}`,
  execute(initialData, options = {}) {
    const arr = [...initialData].sort((a, b) => a - b);
    const target = options.target !== undefined ? options.target : (arr[Math.floor(arr.length * 0.4)] || 25);
    const steps = [];
    let l = 0;
    let r = arr.length - 1;

    steps.push(createStep({
      type: OP_TYPES.MESSAGE,
      stateSnapshot: [...arr],
      description: `Ternary Search for target ${target} across 3 equal partitions`,
      variables: { l, r, target },
      codeLine: 1
    }));

    while (r >= l) {
      const mid1 = l + Math.floor((r - l) / 3);
      const mid2 = r - Math.floor((r - l) / 3);

      steps.push(createStep({
        type: OP_TYPES.VISIT,
        indices: [mid1, mid2],
        values: [arr[mid1], arr[mid2]],
        stateSnapshot: [...arr],
        description: `Ternary midpoints: mid1 = index ${mid1} (${arr[mid1]}), mid2 = index ${mid2} (${arr[mid2]})`,
        variables: { l, r, mid1, mid2, target },
        codeLine: 3
      }));

      if (arr[mid1] === target) {
        steps.push(createStep({
          type: OP_TYPES.PATH_FOUND,
          indices: [mid1],
          values: [arr[mid1]],
          stateSnapshot: [...arr],
          description: `Target ${target} found at mid1 (index ${mid1})!`,
          variables: { foundIndex: mid1 },
          codeLine: 5
        }));
        return steps;
      }

      if (arr[mid2] === target) {
        steps.push(createStep({
          type: OP_TYPES.PATH_FOUND,
          indices: [mid2],
          values: [arr[mid2]],
          stateSnapshot: [...arr],
          description: `Target ${target} found at mid2 (index ${mid2})!`,
          variables: { foundIndex: mid2 },
          codeLine: 6
        }));
        return steps;
      }

      if (target < arr[mid1]) {
        r = mid1 - 1;
      } else if (target > arr[mid2]) {
        l = mid2 + 1;
      } else {
        l = mid1 + 1;
        r = mid2 - 1;
      }
    }

    steps.push(createStep({
      type: OP_TYPES.REJECT,
      stateSnapshot: [...arr],
      description: `Target ${target} not found in array.`,
      codeLine: 11
    }));

    return steps;
  }
};
