import { OP_TYPES, createStep } from '../engine/ExecutionEngine.js';

export const selectionSort = {
  id: 'selection-sort',
  name: 'Selection Sort',
  category: 'sorting',
  structureType: 'array',
  complexity: {
    timeBest: 'O(n²)',
    timeAverage: 'O(n²)',
    timeWorst: 'O(n²)',
    space: 'O(1)',
    stable: 'No'
  },
  description: 'Divides the array into sorted and unsorted regions, repeatedly finding the minimum element from the unsorted region.',
  code: `function selectionSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      swap(arr, i, minIdx);
    }
  }
  return arr;
}`,
  execute(initialData) {
    const arr = [...initialData];
    const steps = [];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      steps.push(createStep({
        type: OP_TYPES.VISIT,
        indices: [i],
        variables: { i, minIdx, j: i },
        stateSnapshot: [...arr],
        description: `Assume minimum is at index ${i} (${arr[i]})`,
        codeLine: 4
      }));

      for (let j = i + 1; j < n; j++) {
        steps.push(createStep({
          type: OP_TYPES.COMPARE,
          indices: [j, minIdx],
          values: [arr[j], arr[minIdx]],
          variables: { i, minIdx, j },
          stateSnapshot: [...arr],
          description: `Compare ${arr[j]} at index ${j} with current minimum ${arr[minIdx]}`,
          codeLine: 6
        }));

        if (arr[j] < arr[minIdx]) {
          minIdx = j;
          steps.push(createStep({
            type: OP_TYPES.HIGHLIGHT,
            indices: [minIdx],
            variables: { i, minIdx, j },
            stateSnapshot: [...arr],
            description: `New minimum found: ${arr[minIdx]} at index ${minIdx}`,
            codeLine: 7
          }));
        }
      }

      if (minIdx !== i) {
        const temp = arr[i];
        arr[i] = arr[minIdx];
        arr[minIdx] = temp;

        steps.push(createStep({
          type: OP_TYPES.SWAP,
          indices: [i, minIdx],
          values: [arr[i], arr[minIdx]],
          variables: { i, minIdx },
          stateSnapshot: [...arr],
          description: `Swap minimum ${arr[i]} with element at index ${i}`,
          codeLine: 11
        }));
      }

      steps.push(createStep({
        type: OP_TYPES.HIGHLIGHT,
        indices: [i],
        variables: { i, minIdx: i },
        stateSnapshot: [...arr],
        description: `Index ${i} (${arr[i]}) is now sorted`,
        codeLine: 3
      }));
    }

    steps.push(createStep({
      type: OP_TYPES.COMPLETE,
      stateSnapshot: [...arr],
      description: `Array sorted using Selection Sort!`,
      codeLine: 14
    }));

    return steps;
  }
};

export const insertionSort = {
  id: 'insertion-sort',
  name: 'Insertion Sort',
  category: 'sorting',
  structureType: 'array',
  complexity: {
    timeBest: 'O(n)',
    timeAverage: 'O(n²)',
    timeWorst: 'O(n²)',
    space: 'O(1)',
    stable: 'Yes'
  },
  description: 'Iteratively builds a sorted portion of the array by shifting larger elements right and inserting each key into its place.',
  code: `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`,
  execute(initialData) {
    const arr = [...initialData];
    const steps = [];

    for (let i = 1; i < arr.length; i++) {
      const key = arr[i];
      let j = i - 1;

      steps.push(createStep({
        type: OP_TYPES.VISIT,
        indices: [i],
        variables: { i, key, j },
        stateSnapshot: [...arr],
        description: `Select key ${key} at index ${i} to insert into sorted left subarray`,
        codeLine: 3
      }));

      while (j >= 0 && arr[j] > key) {
        steps.push(createStep({
          type: OP_TYPES.COMPARE,
          indices: [j, j + 1],
          values: [arr[j], key],
          variables: { i, key, j },
          stateSnapshot: [...arr],
          description: `${arr[j]} > ${key}, shift ${arr[j]} to the right`,
          codeLine: 5
        }));

        arr[j + 1] = arr[j];
        arr[j] = key; // for smooth visualization swap animation

        steps.push(createStep({
          type: OP_TYPES.SWAP,
          indices: [j, j + 1],
          values: [arr[j], arr[j + 1]],
          variables: { i, key, j },
          stateSnapshot: [...arr],
          description: `Shift element at index ${j} rightward`,
          codeLine: 6
        }));

        j--;
      }

      steps.push(createStep({
        type: OP_TYPES.HIGHLIGHT,
        indices: [j + 1],
        variables: { i, key, insertedAt: j + 1 },
        stateSnapshot: [...arr],
        description: `Key ${key} inserted at index ${j + 1}`,
        codeLine: 9
      }));
    }

    steps.push(createStep({
      type: OP_TYPES.COMPLETE,
      stateSnapshot: [...arr],
      description: `Array sorted using Insertion Sort!`,
      codeLine: 11
    }));

    return steps;
  }
};
