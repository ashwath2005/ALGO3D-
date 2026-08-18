import { OP_TYPES, createStep } from '../engine/ExecutionEngine.js';

export const heapSort = {
  id: 'heap-sort',
  name: 'Heap Sort',
  category: 'sorting',
  structureType: 'array',
  complexity: {
    timeBest: 'O(n log n)',
    timeAverage: 'O(n log n)',
    timeWorst: 'O(n log n)',
    space: 'O(1)',
    stable: 'No'
  },
  description: 'Builds a max-heap from the input array, then repeatedly extracts the maximum element to the end of the array.',
  code: `function heapSort(arr) {
  let n = arr.length;
  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }
  // Extract elements from heap
  for (let i = n - 1; i > 0; i--) {
    swap(arr, 0, i);
    heapify(arr, i, 0);
  }
  return arr;
}`,
  execute(initialData) {
    const arr = [...initialData];
    const steps = [];
    const n = arr.length;

    function heapify(size, i) {
      let largest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;

      if (left < size) {
        steps.push(createStep({
          type: OP_TYPES.COMPARE,
          indices: [left, largest],
          values: [arr[left], arr[largest]],
          variables: { i, largest, left, right, heapSize: size },
          stateSnapshot: [...arr],
          description: `Compare left child ${arr[left]} with current largest ${arr[largest]}`,
          codeLine: 5
        }));
        if (arr[left] > arr[largest]) {
          largest = left;
        }
      }

      if (right < size) {
        steps.push(createStep({
          type: OP_TYPES.COMPARE,
          indices: [right, largest],
          values: [arr[right], arr[largest]],
          variables: { i, largest, left, right, heapSize: size },
          stateSnapshot: [...arr],
          description: `Compare right child ${arr[right]} with current largest ${arr[largest]}`,
          codeLine: 5
        }));
        if (arr[right] > arr[largest]) {
          largest = right;
        }
      }

      if (largest !== i) {
        const temp = arr[i];
        arr[i] = arr[largest];
        arr[largest] = temp;

        steps.push(createStep({
          type: OP_TYPES.SWAP,
          indices: [i, largest],
          values: [arr[i], arr[largest]],
          variables: { i, largest, heapSize: size },
          stateSnapshot: [...arr],
          description: `Swap root ${arr[largest]} with largest child ${arr[i]}`,
          codeLine: 5
        }));

        heapify(size, largest);
      }
    }

    // Build Max Heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapify(n, i);
    }

    // Extract one by one
    for (let i = n - 1; i > 0; i--) {
      const temp = arr[0];
      arr[0] = arr[i];
      arr[i] = temp;

      steps.push(createStep({
        type: OP_TYPES.SWAP,
        indices: [0, i],
        values: [arr[0], arr[i]],
        variables: { i, extractedMax: arr[i], heapSize: i },
        stateSnapshot: [...arr],
        description: `Move current max ${arr[i]} to end at index ${i}`,
        codeLine: 9
      }));

      steps.push(createStep({
        type: OP_TYPES.HIGHLIGHT,
        indices: [i],
        variables: { i, finalizedIndex: i, heapSize: i },
        stateSnapshot: [...arr],
        description: `Index ${i} (${arr[i]}) is finalized`,
        codeLine: 9
      }));

      heapify(i, 0);
    }

    steps.push(createStep({
      type: OP_TYPES.COMPLETE,
      stateSnapshot: [...arr],
      description: `Array sorted using Heap Sort!`,
      codeLine: 12
    }));

    return steps;
  }
};
