import { OP_TYPES, createStep } from '../engine/ExecutionEngine.js';

// --- SHELL SORT ---
export const shellSort = {
  id: 'shell-sort',
  name: 'Shell Sort',
  category: 'sorting',
  structureType: 'array',
  complexity: { timeBest: 'O(n log n)', timeAverage: 'O(n^1.5)', timeWorst: 'O(n²)', space: 'O(1)' },
  properties: { stable: false, inPlace: true },
  description: 'Generalization of insertion sort that allows exchanges of elements that are far apart using a diminishing gap sequence.',
  code: `function shellSort(arr) {
  let n = arr.length;
  for (let gap = Math.floor(n/2); gap > 0; gap = Math.floor(gap/2)) {
    for (let i = gap; i < n; i++) {
      let temp = arr[i];
      let j = i;
      while (j >= gap && arr[j - gap] > temp) {
        arr[j] = arr[j - gap];
        j -= gap;
      }
      arr[j] = temp;
    }
  }
  return arr;
}`,
  execute(initialData) {
    const arr = [...initialData];
    const steps = [];
    const n = arr.length;

    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
      steps.push(createStep({
        type: OP_TYPES.MESSAGE,
        stateSnapshot: [...arr],
        description: `Set gap size = ${gap}`,
        explanation: `Comparing elements spaced ${gap} positions apart`,
        variables: { gap, n },
        codeLine: 3
      }));

      for (let i = gap; i < n; i++) {
        const temp = arr[i];
        let j = i;

        steps.push(createStep({
          type: OP_TYPES.VISIT,
          indices: [i],
          stateSnapshot: [...arr],
          description: `Evaluating element ${temp} at index ${i} with gap ${gap}`,
          variables: { gap, i, temp },
          codeLine: 5
        }));

        while (j >= gap && arr[j - gap] > temp) {
          steps.push(createStep({
            type: OP_TYPES.COMPARE,
            indices: [j - gap, j],
            values: [arr[j - gap], temp],
            stateSnapshot: [...arr],
            description: `Compare ${arr[j - gap]} (idx ${j - gap}) > ${temp} (idx ${j})`,
            variables: { gap, i, j, temp },
            codeLine: 7
          }));

          arr[j] = arr[j - gap];
          arr[j - gap] = temp;

          steps.push(createStep({
            type: OP_TYPES.SWAP,
            indices: [j - gap, j],
            values: [arr[j - gap], arr[j]],
            stateSnapshot: [...arr],
            description: `Shift ${arr[j]} forward by gap ${gap}`,
            variables: { gap, i, j, temp },
            codeLine: 8
          }));

          j -= gap;
        }
      }
    }

    steps.push(createStep({
      type: OP_TYPES.COMPLETE,
      stateSnapshot: [...arr],
      description: 'Array sorted using Shell Sort!',
      codeLine: 13
    }));

    return steps;
  }
};

// --- COCKTAIL SHAKER SORT ---
export const cocktailShakerSort = {
  id: 'cocktail-shaker-sort',
  name: 'Cocktail Shaker Sort',
  category: 'sorting',
  structureType: 'array',
  complexity: { timeBest: 'O(n)', timeAverage: 'O(n²)', timeWorst: 'O(n²)', space: 'O(1)' },
  properties: { stable: true, inPlace: true },
  description: 'Bidirectional variant of bubble sort that traverses both forward and backward through the list on alternating passes.',
  code: `function cocktailSort(arr) {
  let start = 0, end = arr.length - 1, swapped = true;
  while (swapped) {
    swapped = false;
    for (let i = start; i < end; i++) {
      if (arr[i] > arr[i + 1]) {
        swap(arr, i, i + 1);
        swapped = true;
      }
    }
    if (!swapped) break;
    end--;
    for (let i = end - 1; i >= start; i--) {
      if (arr[i] > arr[i + 1]) {
        swap(arr, i, i + 1);
        swapped = true;
      }
    }
    start++;
  }
  return arr;
}`,
  execute(initialData) {
    const arr = [...initialData];
    const steps = [];
    let start = 0;
    let end = arr.length - 1;
    let swapped = true;

    while (swapped) {
      swapped = false;

      // Forward pass (Left to Right)
      for (let i = start; i < end; i++) {
        steps.push(createStep({
          type: OP_TYPES.COMPARE,
          indices: [i, i + 1],
          values: [arr[i], arr[i + 1]],
          stateSnapshot: [...arr],
          description: `Forward: Compare index ${i} (${arr[i]}) and ${i + 1} (${arr[i + 1]})`,
          variables: { start, end, i, direction: 'forward' },
          codeLine: 6
        }));

        if (arr[i] > arr[i + 1]) {
          const temp = arr[i];
          arr[i] = arr[i + 1];
          arr[i + 1] = temp;
          swapped = true;

          steps.push(createStep({
            type: OP_TYPES.SWAP,
            indices: [i, i + 1],
            values: [arr[i], arr[i + 1]],
            stateSnapshot: [...arr],
            description: `Forward: Swap ${arr[i + 1]} with ${arr[i]}`,
            variables: { start, end, i },
            codeLine: 7
          }));
        }
      }

      if (!swapped) break;
      end--;

      // Backward pass (Right to Left)
      for (let i = end - 1; i >= start; i--) {
        steps.push(createStep({
          type: OP_TYPES.COMPARE,
          indices: [i, i + 1],
          values: [arr[i], arr[i + 1]],
          stateSnapshot: [...arr],
          description: `Backward: Compare index ${i} (${arr[i]}) and ${i + 1} (${arr[i + 1]})`,
          variables: { start, end, i, direction: 'backward' },
          codeLine: 14
        }));

        if (arr[i] > arr[i + 1]) {
          const temp = arr[i];
          arr[i] = arr[i + 1];
          arr[i + 1] = temp;
          swapped = true;

          steps.push(createStep({
            type: OP_TYPES.SWAP,
            indices: [i, i + 1],
            values: [arr[i], arr[i + 1]],
            stateSnapshot: [...arr],
            description: `Backward: Swap ${arr[i + 1]} with ${arr[i]}`,
            variables: { start, end, i },
            codeLine: 15
          }));
        }
      }
      start++;
    }

    steps.push(createStep({
      type: OP_TYPES.COMPLETE,
      stateSnapshot: [...arr],
      description: 'Array sorted using Cocktail Shaker Sort!',
      codeLine: 19
    }));

    return steps;
  }
};

// --- COUNTING SORT ---
export const countingSort = {
  id: 'counting-sort',
  name: 'Counting Sort',
  category: 'sorting',
  structureType: 'array',
  complexity: { timeBest: 'O(n + k)', timeAverage: 'O(n + k)', timeWorst: 'O(n + k)', space: 'O(k)' },
  properties: { stable: true, inPlace: false },
  description: 'Non-comparison integer sorting algorithm that counts the occurrences of each unique element and calculates their positions.',
  code: `function countingSort(arr) {
  let max = Math.max(...arr);
  let count = new Array(max + 1).fill(0);
  for (let num of arr) count[num]++;
  let idx = 0;
  for (let i = 0; i <= max; i++) {
    while (count[i] > 0) {
      arr[idx++] = i;
      count[i]--;
    }
  }
  return arr;
}`,
  execute(initialData) {
    const arr = [...initialData];
    const steps = [];
    const maxVal = Math.max(...arr, 1);
    const count = new Array(maxVal + 1).fill(0);

    steps.push(createStep({
      type: OP_TYPES.MESSAGE,
      stateSnapshot: [...arr],
      description: `Counting frequencies of values (Max = ${maxVal})`,
      variables: { maxVal },
      codeLine: 2
    }));

    for (let i = 0; i < arr.length; i++) {
      count[arr[i]]++;
      steps.push(createStep({
        type: OP_TYPES.VISIT,
        indices: [i],
        values: [arr[i]],
        stateSnapshot: [...arr],
        description: `Tally value ${arr[i]}: Count is now ${count[arr[i]]}`,
        variables: { index: i, val: arr[i], count: count[arr[i]] },
        codeLine: 4
      }));
    }

    let writeIdx = 0;
    for (let val = 0; val <= maxVal; val++) {
      while (count[val] > 0) {
        arr[writeIdx] = val;
        steps.push(createStep({
          type: OP_TYPES.OVERWRITE,
          indices: [writeIdx],
          values: [val],
          stateSnapshot: [...arr],
          description: `Place frequency tally: ${val} at index ${writeIdx}`,
          variables: { writeIdx, val, remainingCount: count[val] },
          codeLine: 8
        }));
        count[val]--;
        writeIdx++;
      }
    }

    steps.push(createStep({
      type: OP_TYPES.COMPLETE,
      stateSnapshot: [...arr],
      description: 'Array sorted using Counting Sort!',
      codeLine: 12
    }));

    return steps;
  }
};

// --- RADIX SORT (LSD) ---
export const radixSort = {
  id: 'radix-sort',
  name: 'Radix Sort (LSD)',
  category: 'sorting',
  structureType: 'array',
  complexity: { timeBest: 'O(d * (n + k))', timeAverage: 'O(d * (n + k))', timeWorst: 'O(d * (n + k))', space: 'O(n + k)' },
  properties: { stable: true, inPlace: false },
  description: 'Non-comparison sorting algorithm that sorts keys digit by digit starting from least significant digit (LSD) to most significant digit.',
  code: `function radixSort(arr) {
  let max = Math.max(...arr);
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    countingSortByDigit(arr, exp);
  }
  return arr;
}`,
  execute(initialData) {
    let arr = [...initialData];
    const steps = [];
    const maxVal = Math.max(...arr, 1);

    for (let exp = 1; Math.floor(maxVal / exp) > 0; exp *= 10) {
      steps.push(createStep({
        type: OP_TYPES.MESSAGE,
        stateSnapshot: [...arr],
        description: `Sorting by digit place exponent: ${exp} (1s, 10s, 100s place)`,
        variables: { exp, maxVal },
        codeLine: 3
      }));

      const output = new Array(arr.length).fill(0);
      const count = new Array(10).fill(0);

      for (let i = 0; i < arr.length; i++) {
        const digit = Math.floor(arr[i] / exp) % 10;
        count[digit]++;
      }

      for (let i = 1; i < 10; i++) count[i] += count[i - 1];

      for (let i = arr.length - 1; i >= 0; i--) {
        const digit = Math.floor(arr[i] / exp) % 10;
        output[count[digit] - 1] = arr[i];
        count[digit]--;
      }

      for (let i = 0; i < arr.length; i++) {
        arr[i] = output[i];
        steps.push(createStep({
          type: OP_TYPES.OVERWRITE,
          indices: [i],
          values: [arr[i]],
          stateSnapshot: [...arr],
          description: `Place ${arr[i]} after sorting on digit place ${exp}`,
          variables: { index: i, val: arr[i], exp },
          codeLine: 4
        }));
      }
    }

    steps.push(createStep({
      type: OP_TYPES.COMPLETE,
      stateSnapshot: [...arr],
      description: 'Array sorted using Radix Sort!',
      codeLine: 6
    }));

    return steps;
  }
};

// --- GNOME SORT ---
export const gnomeSort = {
  id: 'gnome-sort',
  name: 'Gnome Sort',
  category: 'sorting',
  structureType: 'array',
  complexity: { timeBest: 'O(n)', timeAverage: 'O(n²)', timeWorst: 'O(n²)', space: 'O(1)' },
  properties: { stable: true, inPlace: true },
  description: 'Simple sorting algorithm that moves an element to its proper place by a series of swaps, similar to a garden gnome placing flower pots.',
  code: `function gnomeSort(arr) {
  let pos = 0;
  while (pos < arr.length) {
    if (pos === 0 || arr[pos] >= arr[pos - 1]) {
      pos++;
    } else {
      swap(arr, pos, pos - 1);
      pos--;
    }
  }
  return arr;
}`,
  execute(initialData) {
    const arr = [...initialData];
    const steps = [];
    let pos = 0;

    while (pos < arr.length) {
      if (pos === 0 || arr[pos] >= arr[pos - 1]) {
        steps.push(createStep({
          type: OP_TYPES.VISIT,
          indices: [pos],
          values: [arr[pos]],
          stateSnapshot: [...arr],
          description: `Gnome steps forward to index ${pos + 1}`,
          variables: { pos },
          codeLine: 4
        }));
        pos++;
      } else {
        steps.push(createStep({
          type: OP_TYPES.COMPARE,
          indices: [pos - 1, pos],
          values: [arr[pos - 1], arr[pos]],
          stateSnapshot: [...arr],
          description: `${arr[pos - 1]} > ${arr[pos]}, Gnome steps backward and swaps`,
          variables: { pos },
          codeLine: 6
        }));

        const temp = arr[pos];
        arr[pos] = arr[pos - 1];
        arr[pos - 1] = temp;

        steps.push(createStep({
          type: OP_TYPES.SWAP,
          indices: [pos - 1, pos],
          values: [arr[pos - 1], arr[pos]],
          stateSnapshot: [...arr],
          description: `Swap elements at index ${pos - 1} and ${pos}`,
          variables: { pos },
          codeLine: 7
        }));

        pos--;
      }
    }

    steps.push(createStep({
      type: OP_TYPES.COMPLETE,
      stateSnapshot: [...arr],
      description: 'Array sorted using Gnome Sort!',
      codeLine: 10
    }));

    return steps;
  }
};

// --- COMB SORT ---
export const combSort = {
  id: 'comb-sort',
  name: 'Comb Sort',
  category: 'sorting',
  structureType: 'array',
  complexity: { timeBest: 'O(n log n)', timeAverage: 'O(n² / 2^p)', timeWorst: 'O(n²)', space: 'O(1)' },
  properties: { stable: false, inPlace: true },
  description: 'Improvement on Bubble Sort that eliminates turtles (small values near the end) by using a shrink factor of 1.3 to calculate gaps.',
  code: `function combSort(arr) {
  let gap = arr.length, shrink = 1.3, sorted = false;
  while (!sorted) {
    gap = Math.floor(gap / shrink);
    if (gap <= 1) { gap = 1; sorted = true; }
    for (let i = 0; i + gap < arr.length; i++) {
      if (arr[i] > arr[i + gap]) {
        swap(arr, i, i + gap);
        sorted = false;
      }
    }
  }
  return arr;
}`,
  execute(initialData) {
    const arr = [...initialData];
    const steps = [];
    let gap = arr.length;
    const shrink = 1.3;
    let sorted = false;

    while (!sorted) {
      gap = Math.floor(gap / shrink);
      if (gap <= 1) {
        gap = 1;
        sorted = true;
      }

      steps.push(createStep({
        type: OP_TYPES.MESSAGE,
        stateSnapshot: [...arr],
        description: `Comb gap = ${gap}`,
        variables: { gap, sorted },
        codeLine: 4
      }));

      for (let i = 0; i + gap < arr.length; i++) {
        steps.push(createStep({
          type: OP_TYPES.COMPARE,
          indices: [i, i + gap],
          values: [arr[i], arr[i + gap]],
          stateSnapshot: [...arr],
          description: `Compare indices ${i} (${arr[i]}) and ${i + gap} (${arr[i + gap]})`,
          variables: { i, gap },
          codeLine: 7
        }));

        if (arr[i] > arr[i + gap]) {
          const temp = arr[i];
          arr[i] = arr[i + gap];
          arr[i + gap] = temp;
          sorted = false;

          steps.push(createStep({
            type: OP_TYPES.SWAP,
            indices: [i, i + gap],
            values: [arr[i], arr[i + gap]],
            stateSnapshot: [...arr],
            description: `Swap ${arr[i + gap]} and ${arr[i]}`,
            variables: { i, gap },
            codeLine: 8
          }));
        }
      }
    }

    steps.push(createStep({
      type: OP_TYPES.COMPLETE,
      stateSnapshot: [...arr],
      description: 'Array sorted using Comb Sort!',
      codeLine: 12
    }));

    return steps;
  }
};
