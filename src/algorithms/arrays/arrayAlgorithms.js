import { OP_TYPES, createStep } from '../engine/ExecutionEngine.js';

// --- KADANE'S MAXIMUM SUBARRAY ---
export const kadaneAlgorithm = {
  id: 'kadanes-algorithm',
  name: "Kadane's Algorithm",
  category: 'arrays',
  structureType: 'array',
  complexity: { timeBest: 'O(n)', timeAverage: 'O(n)', timeWorst: 'O(n)', space: 'O(1)' },
  description: 'Finds the contiguous subarray within a one-dimensional numeric array that has the largest sum in linear time.',
  code: `function maxSubArray(arr) {
  let maxSoFar = arr[0], currMax = arr[0];
  for (let i = 1; i < arr.length; i++) {
    currMax = Math.max(arr[i], currMax + arr[i]);
    maxSoFar = Math.max(maxSoFar, currMax);
  }
  return maxSoFar;
}`,
  execute(initialData) {
    // Generate array with both positive and negative values for authentic Kadane demonstration
    const arr = initialData.map((v, i) => (i % 2 === 0 ? v : -Math.round(v * 0.7)));
    const steps = [];
    let maxSoFar = arr[0];
    let currMax = arr[0];
    let start = 0, end = 0, tempStart = 0;

    steps.push(createStep({
      type: OP_TYPES.MESSAGE,
      stateSnapshot: [...arr],
      description: `Starting Kadane's Algorithm. Initial currMax = ${currMax}, maxSoFar = ${maxSoFar}`,
      variables: { currMax, maxSoFar, i: 0 },
      codeLine: 2
    }));

    for (let i = 1; i < arr.length; i++) {
      steps.push(createStep({
        type: OP_TYPES.VISIT,
        indices: [i],
        values: [arr[i]],
        stateSnapshot: [...arr],
        description: `Evaluating element ${arr[i]} at index ${i}`,
        variables: { i, element: arr[i], currMax, maxSoFar },
        codeLine: 3
      }));

      if (arr[i] > currMax + arr[i]) {
        currMax = arr[i];
        tempStart = i;
        steps.push(createStep({
          type: OP_TYPES.ASSIGN,
          indices: [i],
          values: [currMax],
          stateSnapshot: [...arr],
          description: `Element ${arr[i]} > current running sum (${currMax + arr[i]}). Start new window from index ${i}`,
          variables: { currMax, tempStart },
          codeLine: 4
        }));
      } else {
        currMax = currMax + arr[i];
      }

      if (currMax > maxSoFar) {
        maxSoFar = currMax;
        start = tempStart;
        end = i;
        steps.push(createStep({
          type: OP_TYPES.HIGHLIGHT,
          indices: Array.from({ length: end - start + 1 }, (_, k) => start + k),
          values: [maxSoFar],
          stateSnapshot: [...arr],
          description: `New maximum subarray found in range [${start}..${end}] with sum = ${maxSoFar}`,
          variables: { maxSoFar, start, end },
          codeLine: 5
        }));
      }
    }

    steps.push(createStep({
      type: OP_TYPES.COMPLETE,
      indices: Array.from({ length: end - start + 1 }, (_, k) => start + k),
      stateSnapshot: [...arr],
      description: `Kadane's complete! Maximum contiguous subarray sum = ${maxSoFar} (Indices ${start} to ${end})`,
      variables: { maxSubarraySum: maxSoFar, start, end },
      codeLine: 7
    }));

    return steps;
  }
};

// --- DUTCH NATIONAL FLAG (3-WAY PARTITION) ---
export const dutchNationalFlag = {
  id: 'dutch-national-flag',
  name: 'Dutch National Flag (0s, 1s, 2s)',
  category: 'arrays',
  structureType: 'array',
  complexity: { timeBest: 'O(n)', timeAverage: 'O(n)', timeWorst: 'O(n)', space: 'O(1)' },
  description: 'Partitions an array containing three distinct values (e.g. 0s, 1s, 2s) into three sorted sections in a single linear pass using three pointers (low, mid, high).',
  code: `function sort012(arr) {
  let low = 0, mid = 0, high = arr.length - 1;
  while (mid <= high) {
    if (arr[mid] === 0) {
      swap(arr, low++, mid++);
    } else if (arr[mid] === 1) {
      mid++;
    } else {
      swap(arr, mid, high--);
    }
  }
  return arr;
}`,
  execute(initialData) {
    // Map initial data into 0, 1, 2 values
    const arr = initialData.map(v => v % 3);
    const steps = [];
    let low = 0, mid = 0, high = arr.length - 1;

    steps.push(createStep({
      type: OP_TYPES.MESSAGE,
      stateSnapshot: [...arr],
      description: '3-way partition initialized with low=0, mid=0, high=' + high,
      variables: { low, mid, high },
      codeLine: 2
    }));

    while (mid <= high) {
      steps.push(createStep({
        type: OP_TYPES.VISIT,
        indices: [mid],
        values: [arr[mid]],
        stateSnapshot: [...arr],
        description: `Check mid index ${mid} (Value = ${arr[mid]})`,
        variables: { low, mid, high, val: arr[mid] },
        codeLine: 4
      }));

      if (arr[mid] === 0) {
        const temp = arr[low];
        arr[low] = arr[mid];
        arr[mid] = temp;

        steps.push(createStep({
          type: OP_TYPES.SWAP,
          indices: [low, mid],
          values: [arr[low], arr[mid]],
          stateSnapshot: [...arr],
          description: `Value is 0: Swap with low pointer (index ${low}), advance low & mid`,
          variables: { low, mid, high },
          codeLine: 5
        }));

        low++;
        mid++;
      } else if (arr[mid] === 1) {
        steps.push(createStep({
          type: OP_TYPES.MESSAGE,
          indices: [mid],
          stateSnapshot: [...arr],
          description: 'Value is 1: Already in middle section, advance mid pointer',
          variables: { low, mid, high },
          codeLine: 7
        }));
        mid++;
      } else {
        const temp = arr[mid];
        arr[mid] = arr[high];
        arr[high] = temp;

        steps.push(createStep({
          type: OP_TYPES.SWAP,
          indices: [mid, high],
          values: [arr[mid], arr[high]],
          stateSnapshot: [...arr],
          description: `Value is 2: Swap with high pointer (index ${high}), decrement high`,
          variables: { low, mid, high },
          codeLine: 9
        }));

        high--;
      }
    }

    steps.push(createStep({
      type: OP_TYPES.COMPLETE,
      stateSnapshot: [...arr],
      description: 'Dutch National Flag 3-way partition complete!',
      codeLine: 12
    }));

    return steps;
  }
};

// --- TWO SUM (TWO-POINTER) ---
export const twoSumPointer = {
  id: 'two-sum-pointer',
  name: 'Two Sum (Two Pointer)',
  category: 'arrays',
  structureType: 'array',
  complexity: { timeBest: 'O(1)', timeAverage: 'O(n)', timeWorst: 'O(n)', space: 'O(1)' },
  description: 'Finds two numbers in a sorted array that sum up to a specific target value using inward-moving left and right pointers.',
  code: `function twoSum(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left < right) {
    let sum = arr[left] + arr[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }
  return [-1, -1];
}`,
  execute(initialData, options = {}) {
    const arr = [...initialData].sort((a, b) => a - b);
    const target = options.target !== undefined ? options.target : (arr[1] + arr[arr.length - 2] || 60);
    const steps = [];
    let left = 0;
    let right = arr.length - 1;

    steps.push(createStep({
      type: OP_TYPES.MESSAGE,
      stateSnapshot: [...arr],
      description: `Two Pointer search for pair summing to target: ${target}`,
      variables: { left, right, target },
      codeLine: 2
    }));

    while (left < right) {
      const sum = arr[left] + arr[right];

      steps.push(createStep({
        type: OP_TYPES.COMPARE,
        indices: [left, right],
        values: [arr[left], arr[right]],
        stateSnapshot: [...arr],
        description: `Compare pair: arr[${left}] (${arr[left]}) + arr[${right}] (${arr[right]}) = ${sum} vs Target ${target}`,
        variables: { left, right, sum, target },
        codeLine: 4
      }));

      if (sum === target) {
        steps.push(createStep({
          type: OP_TYPES.PATH_FOUND,
          indices: [left, right],
          values: [arr[left], arr[right]],
          stateSnapshot: [...arr],
          description: `Pair found! arr[${left}] (${arr[left]}) + arr[${right}] (${arr[right]}) = ${target}`,
          variables: { left, right, targetSum: target },
          codeLine: 5
        }));
        return steps;
      }

      if (sum < target) {
        steps.push(createStep({
          type: OP_TYPES.MESSAGE,
          indices: [left],
          stateSnapshot: [...arr],
          description: `Sum ${sum} < target ${target} => Increment left pointer`,
          variables: { left: left + 1, right },
          codeLine: 6
        }));
        left++;
      } else {
        steps.push(createStep({
          type: OP_TYPES.MESSAGE,
          indices: [right],
          stateSnapshot: [...arr],
          description: `Sum ${sum} > target ${target} => Decrement right pointer`,
          variables: { left, right: right - 1 },
          codeLine: 7
        }));
        right--;
      }
    }

    steps.push(createStep({
      type: OP_TYPES.REJECT,
      stateSnapshot: [...arr],
      description: `No two elements in the array sum to ${target}`,
      codeLine: 9
    }));

    return steps;
  }
};
