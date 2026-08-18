import { OP_TYPES, createStep } from '../engine/ExecutionEngine.js';

export const linearSearch = {
  id: 'linear-search',
  name: 'Linear Search',
  category: 'searching',
  structureType: 'array',
  complexity: {
    timeBest: 'O(1)',
    timeAverage: 'O(n)',
    timeWorst: 'O(n)',
    space: 'O(1)',
    stable: 'N/A'
  },
  description: 'Sequentially checks each element in the collection until a match is found or the whole list has been searched.',
  code: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i; // Target found
    }
  }
  return -1; // Not found
}`,
  execute(initialData, options = {}) {
    const arr = [...initialData];
    const target = options.target !== undefined ? options.target : (arr[Math.floor(arr.length * 0.7)] || 25);
    const steps = [];

    steps.push(createStep({
      type: OP_TYPES.MESSAGE,
      variables: { target },
      stateSnapshot: [...arr],
      description: `Searching for target value: ${target}`,
      codeLine: 1
    }));

    let foundIdx = -1;
    for (let i = 0; i < arr.length; i++) {
      steps.push(createStep({
        type: OP_TYPES.COMPARE,
        indices: [i],
        values: [arr[i], target],
        variables: { i, target, currentVal: arr[i] },
        stateSnapshot: [...arr],
        description: `Check index ${i}: Is ${arr[i]} equal to target ${target}?`,
        codeLine: 3
      }));

      if (arr[i] === target) {
        foundIdx = i;
        steps.push(createStep({
          type: OP_TYPES.PATH_FOUND,
          indices: [i],
          values: [arr[i]],
          variables: { i, target, foundIdx: i },
          stateSnapshot: [...arr],
          description: `Target ${target} found at index ${i}!`,
          codeLine: 4
        }));
        break;
      }
    }

    if (foundIdx === -1) {
      steps.push(createStep({
        type: OP_TYPES.REJECT,
        variables: { target, found: false },
        stateSnapshot: [...arr],
        description: `Target ${target} not found in array.`,
        codeLine: 7
      }));
    }

    return steps;
  }
};

export const binarySearch = {
  id: 'binary-search',
  name: 'Binary Search',
  category: 'searching',
  structureType: 'array',
  complexity: {
    timeBest: 'O(1)',
    timeAverage: 'O(log n)',
    timeWorst: 'O(log n)',
    space: 'O(1)',
    stable: 'N/A'
  },
  description: 'Search a sorted array by repeatedly dividing the search interval in half. Compares target value to middle element.',
  code: `function binarySearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;
  while (low <= high) {
    let mid = Math.floor((low + high) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}`,
  execute(initialData, options = {}) {
    // Sort array for binary search
    const arr = [...initialData].sort((a, b) => a - b);
    const target = options.target !== undefined ? options.target : (arr[Math.floor(arr.length * 0.6)] || 30);
    const steps = [];

    steps.push(createStep({
      type: OP_TYPES.MESSAGE,
      variables: { target },
      stateSnapshot: [...arr],
      description: `Searching sorted array for target: ${target}`,
      codeLine: 1
    }));

    let low = 0;
    let high = arr.length - 1;
    let found = false;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);

      steps.push(createStep({
        type: OP_TYPES.VISIT,
        indices: [low, mid, high],
        values: [arr[low], arr[mid], arr[high]],
        variables: { low, mid, high, target, midVal: arr[mid] },
        stateSnapshot: [...arr],
        description: `Search window: [${low}..${high}]. Midpoint at index ${mid} (${arr[mid]})`,
        codeLine: 5,
        extra: { low, mid, high }
      }));

      steps.push(createStep({
        type: OP_TYPES.COMPARE,
        indices: [mid],
        values: [arr[mid], target],
        variables: { low, mid, high, target, midVal: arr[mid] },
        stateSnapshot: [...arr],
        description: `Compare mid ${arr[mid]} with target ${target}`,
        codeLine: 6,
        extra: { low, mid, high }
      }));

      if (arr[mid] === target) {
        steps.push(createStep({
          type: OP_TYPES.PATH_FOUND,
          indices: [mid],
          values: [arr[mid]],
          variables: { low, mid, high, target, foundIndex: mid },
          stateSnapshot: [...arr],
          description: `Target ${target} found at mid index ${mid}!`,
          codeLine: 6,
          extra: { low, mid, high }
        }));
        found = true;
        break;
      } else if (arr[mid] < target) {
        steps.push(createStep({
          type: OP_TYPES.MESSAGE,
          indices: [mid],
          variables: { low: mid + 1, mid, high, target, elimination: 'left-half' },
          stateSnapshot: [...arr],
          description: `${arr[mid]} < ${target} => Target must be in right half. Setting low = ${mid + 1}`,
          codeLine: 7,
          extra: { low: mid + 1, mid, high }
        }));
        low = mid + 1;
      } else {
        steps.push(createStep({
          type: OP_TYPES.MESSAGE,
          indices: [mid],
          variables: { low, mid, high: mid - 1, target, elimination: 'right-half' },
          stateSnapshot: [...arr],
          description: `${arr[mid]} > ${target} => Target must be in left half. Setting high = ${mid - 1}`,
          codeLine: 8,
          extra: { low, mid, high: mid - 1 }
        }));
        high = mid - 1;
      }
    }

    if (!found) {
      steps.push(createStep({
        type: OP_TYPES.REJECT,
        variables: { target, found: false },
        stateSnapshot: [...arr],
        description: `Target ${target} does not exist in array.`,
        codeLine: 10
      }));
    }

    return steps;
  }
};
