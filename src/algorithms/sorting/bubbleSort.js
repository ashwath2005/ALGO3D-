import { OP_TYPES, createStep } from '../engine/ExecutionEngine.js';

export const bubbleSort = {
  id: 'bubble-sort',
  name: 'Bubble Sort',
  category: 'sorting',
  structureType: 'array',
  complexity: {
    timeBest: 'O(n)',
    timeAverage: 'O(n²)',
    timeWorst: 'O(n²)',
    space: 'O(1)',
    stable: 'Yes'
  },
  description: 'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
  code: `function bubbleSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        swap(arr, j, j + 1);
      }
    }
  }
  return arr;
}`,
  execute(initialData) {
    const arr = [...initialData];
    const steps = [];
    const n = arr.length;

    steps.push(createStep({
      type: OP_TYPES.MESSAGE,
      stateSnapshot: [...arr],
      description: `Starting Bubble Sort with ${n} elements.`,
      codeLine: 1
    }));

    for (let i = 0; i < n; i++) {
      let swapped = false;
      for (let j = 0; j < n - i - 1; j++) {
        // Compare step
        steps.push(createStep({
          type: OP_TYPES.COMPARE,
          indices: [j, j + 1],
          values: [arr[j], arr[j + 1]],
          variables: { i, j, pass: i, swapped },
          stateSnapshot: [...arr],
          description: `Compare element at index ${j} (${arr[j]}) with index ${j + 1} (${arr[j + 1]})`,
          codeLine: 5
        }));

        if (arr[j] > arr[j + 1]) {
          // Swap elements
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          swapped = true;

          steps.push(createStep({
            type: OP_TYPES.SWAP,
            indices: [j, j + 1],
            values: [arr[j], arr[j + 1]],
            variables: { i, j, pass: i, swapped: true },
            stateSnapshot: [...arr],
            description: `Swap ${arr[j + 1]} and ${arr[j]} since ${arr[j + 1]} > ${arr[j]}`,
            codeLine: 6
          }));
        }
      }

      // Mark sorted element at end of pass
      steps.push(createStep({
        type: OP_TYPES.HIGHLIGHT,
        indices: [n - i - 1],
        variables: { i, sortedIndex: n - i - 1, pass: i },
        stateSnapshot: [...arr],
        description: `Element at index ${n - i - 1} (${arr[n - i - 1]}) is now in its final sorted position.`,
        codeLine: 4
      }));

      if (!swapped) break;
    }

    steps.push(createStep({
      type: OP_TYPES.COMPLETE,
      stateSnapshot: [...arr],
      description: `Array successfully sorted with Bubble Sort!`,
      codeLine: 9
    }));

    return steps;
  }
};
