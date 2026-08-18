import { OP_TYPES, createStep } from '../engine/ExecutionEngine.js';

export const quickSort = {
  id: 'quick-sort',
  name: 'Quick Sort',
  category: 'sorting',
  structureType: 'array',
  complexity: {
    timeBest: 'O(n log n)',
    timeAverage: 'O(n log n)',
    timeWorst: 'O(n²)',
    space: 'O(log n)',
    stable: 'No'
  },
  description: 'Selects a pivot element and partitions the array into values smaller and larger than the pivot, recursively sorting each side.',
  code: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    let pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}
function partition(arr, low, high) {
  let pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      swap(arr, i, j);
    }
  }
  swap(arr, i + 1, high);
  return i + 1;
}`,
  execute(initialData) {
    const arr = [...initialData];
    const steps = [];

    function partition(low, high, depth = 0) {
      const pivot = arr[high];
      steps.push(createStep({
        type: OP_TYPES.VISIT,
        indices: [high],
        variables: { pivot, pivotVal: pivot, pivotIdx: high, low, high, recursionDepth: depth },
        stateSnapshot: [...arr],
        description: `Chosen pivot: ${pivot} at index ${high}`,
        codeLine: 10
      }));

      let i = low - 1;

      for (let j = low; j < high; j++) {
        steps.push(createStep({
          type: OP_TYPES.COMPARE,
          indices: [j, high],
          values: [arr[j], pivot],
          variables: { pivot, pivotVal: pivot, pivotIdx: high, low, high, i, j, recursionDepth: depth },
          stateSnapshot: [...arr],
          description: `Compare ${arr[j]} with pivot ${pivot}`,
          codeLine: 13
        }));

        if (arr[j] < pivot) {
          i++;
          if (i !== j) {
            const temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;

            steps.push(createStep({
              type: OP_TYPES.SWAP,
              indices: [i, j],
              values: [arr[i], arr[j]],
              variables: { pivot, pivotVal: pivot, pivotIdx: high, low, high, i, j, recursionDepth: depth },
              stateSnapshot: [...arr],
              description: `Swap ${arr[j]} (< pivot) to left partition at index ${i}`,
              codeLine: 15
            }));
          }
        }
      }

      // Place pivot in correct slot
      const temp = arr[i + 1];
      arr[i + 1] = arr[high];
      arr[high] = temp;

      steps.push(createStep({
        type: OP_TYPES.SWAP,
        indices: [i + 1, high],
        values: [arr[i + 1], arr[high]],
        variables: { pivot, pivotVal: pivot, pivotIdx: i + 1, low, high, i: i + 1, recursionDepth: depth },
        stateSnapshot: [...arr],
        description: `Move pivot ${arr[i + 1]} into its final partitioned position at index ${i + 1}`,
        codeLine: 18
      }));

      steps.push(createStep({
        type: OP_TYPES.HIGHLIGHT,
        indices: [i + 1],
        variables: { pivot, pivotVal: pivot, pivotIdx: i + 1, low, high, recursionDepth: depth },
        stateSnapshot: [...arr],
        description: `Pivot ${arr[i + 1]} is locked in sorted position.`,
        codeLine: 19
      }));

      return i + 1;
    }

    function sort(low, high, depth = 0) {
      if (low < high) {
        const pi = partition(low, high, depth);
        sort(low, pi - 1, depth + 1);
        sort(pi + 1, high, depth + 1);
      } else if (low === high) {
        steps.push(createStep({
          type: OP_TYPES.HIGHLIGHT,
          indices: [low],
          variables: { low, high, recursionDepth: depth },
          stateSnapshot: [...arr],
          description: `Single element at index ${low} is sorted.`,
          codeLine: 2
        }));
      }
    }

    sort(0, arr.length - 1, 0);

    steps.push(createStep({
      type: OP_TYPES.COMPLETE,
      stateSnapshot: [...arr],
      description: `Array sorted using Quick Sort!`,
      codeLine: 6
    }));

    return steps;
  }
};

export const mergeSort = {
  id: 'merge-sort',
  name: 'Merge Sort',
  category: 'sorting',
  structureType: 'array',
  complexity: {
    timeBest: 'O(n log n)',
    timeAverage: 'O(n log n)',
    timeWorst: 'O(n log n)',
    space: 'O(n)',
    stable: 'Yes'
  },
  description: 'Divide-and-conquer algorithm that recursively splits the array in halves and merges the sorted subarrays.',
  code: `function mergeSort(arr, l = 0, r = arr.length - 1) {
  if (l < r) {
    let m = Math.floor((l + r) / 2);
    mergeSort(arr, l, m);
    mergeSort(arr, m + 1, r);
    merge(arr, l, m, r);
  }
  return arr;
}`,
  execute(initialData) {
    const arr = [...initialData];
    const steps = [];

    function merge(l, m, r, depth = 0) {
      const left = arr.slice(l, m + 1);
      const right = arr.slice(m + 1, r + 1);
      let i = 0, j = 0, k = l;

      steps.push(createStep({
        type: OP_TYPES.MESSAGE,
        indices: [l, r],
        variables: { l, r, m, k, recursionDepth: depth },
        stateSnapshot: [...arr],
        description: `Merging subarrays [${l}..${m}] and [${m + 1}..${r}]`,
        codeLine: 5
      }));

      while (i < left.length && j < right.length) {
        steps.push(createStep({
          type: OP_TYPES.COMPARE,
          indices: [l + i, m + 1 + j],
          values: [left[i], right[j]],
          variables: { l, r, m, i, j, k, leftVal: left[i], rightVal: right[j], recursionDepth: depth },
          stateSnapshot: [...arr],
          description: `Compare ${left[i]} with ${right[j]}`,
          codeLine: 6
        }));

        if (left[i] <= right[j]) {
          arr[k] = left[i];
          i++;
        } else {
          arr[k] = right[j];
          j++;
        }

        steps.push(createStep({
          type: OP_TYPES.OVERWRITE,
          indices: [k],
          values: [arr[k]],
          variables: { l, r, m, k, placedVal: arr[k], recursionDepth: depth },
          stateSnapshot: [...arr],
          description: `Place ${arr[k]} at index ${k}`,
          codeLine: 7
        }));
        k++;
      }

      while (i < left.length) {
        arr[k] = left[i];
        steps.push(createStep({
          type: OP_TYPES.OVERWRITE,
          indices: [k],
          values: [arr[k]],
          variables: { l, r, m, k, placedVal: arr[k], recursionDepth: depth },
          stateSnapshot: [...arr],
          description: `Copy remaining left element ${arr[k]} to index ${k}`,
          codeLine: 7
        }));
        i++;
        k++;
      }

      while (j < right.length) {
        arr[k] = right[j];
        steps.push(createStep({
          type: OP_TYPES.OVERWRITE,
          indices: [k],
          values: [arr[k]],
          variables: { l, r, m, k, placedVal: arr[k], recursionDepth: depth },
          stateSnapshot: [...arr],
          description: `Copy remaining right element ${arr[k]} to index ${k}`,
          codeLine: 7
        }));
        j++;
        k++;
      }
    }

    function sort(l, r, depth = 0) {
      if (l < r) {
        const m = Math.floor((l + r) / 2);
        sort(l, m, depth + 1);
        sort(m + 1, r, depth + 1);
        merge(l, m, r, depth);
      }
    }

    sort(0, arr.length - 1, 0);

    steps.push(createStep({
      type: OP_TYPES.COMPLETE,
      stateSnapshot: [...arr],
      description: `Array sorted using Merge Sort!`,
      codeLine: 8
    }));

    return steps;
  }
};
