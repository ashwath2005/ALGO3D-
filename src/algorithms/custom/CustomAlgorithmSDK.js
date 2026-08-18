/**
 * Custom Algorithm SDK & Execution Sandbox for ALGO3D
 * Enables developers to define, test, benchmark, and 3D-visualize custom algorithms.
 */

const CUSTOM_ALGOS_KEY = 'algo3d_custom_algorithms_registry';

export class CustomAlgorithmSDK {
  static getRegisteredCustomAlgorithms() {
    try {
      const raw = localStorage.getItem(CUSTOM_ALGOS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  static saveCustomAlgorithm({
    id,
    name,
    category = 'Custom',
    visualizationType = 'array',
    code,
    description = 'User-defined custom algorithm',
    timeComplexity = 'O(N²)',
    spaceComplexity = 'O(1)'
  }) {
    if (!id || !name || !code) {
      throw new Error('Algorithm id, name, and executable code are required.');
    }

    const cleanId = id.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    const existing = CustomAlgorithmSDK.getRegisteredCustomAlgorithms();
    const filtered = existing.filter((a) => a.id !== cleanId);

    const algoRecord = {
      id: cleanId,
      name,
      category,
      visualizationType,
      code,
      description,
      timeComplexity,
      spaceComplexity,
      version: 1,
      createdAt: new Date().toISOString()
    };

    filtered.push(algoRecord);
    localStorage.setItem(CUSTOM_ALGOS_KEY, JSON.stringify(filtered));
    return algoRecord;
  }

  static removeCustomAlgorithm(id) {
    try {
      const existing = CustomAlgorithmSDK.getRegisteredCustomAlgorithms();
      const filtered = existing.filter((a) => a.id !== id);
      localStorage.setItem(CUSTOM_ALGOS_KEY, JSON.stringify(filtered));
    } catch (e) {
      // ignore
    }
  }

  /**
   * Execute custom algorithm code safely and capture operations
   */
  static runCustomAlgorithm(codeStr, inputData = [45, 12, 89, 34, 23, 78]) {
    const steps = [];
    const arr = Array.isArray(inputData) ? [...inputData] : [10, 20, 30];

    // Execution Context API
    const context = {
      emit(op) {
        steps.push({
          type: op.type || 'STEP',
          description: op.description || `${op.type || 'Operation'} executed`,
          targets: {
            indices: op.indices || [],
            node: op.node,
            from: op.from,
            to: op.to
          },
          variables: op.variables || {},
          codeLine: op.line || 1,
          state: Array.isArray(op.state) ? [...op.state] : [...arr]
        });
      },
      compare(i, j) {
        context.emit({
          type: 'COMPARE',
          indices: [i, j],
          description: `Compare elements at index ${i} (${arr[i]}) and index ${j} (${arr[j]})`,
          variables: { i, j },
          state: [...arr]
        });
        return arr[i] > arr[j];
      },
      swap(i, j) {
        const tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
        context.emit({
          type: 'SWAP',
          indices: [i, j],
          description: `Swap elements at index ${i} and index ${j} -> [${arr[i]}, ${arr[j]}]`,
          variables: { i, j },
          state: [...arr]
        });
      }
    };

    try {
      // Construct sandboxed execution function
      const fn = new Function('arr', 'context', codeStr);
      const output = fn(arr, context);

      // Add final completed step
      steps.push({
        type: 'COMPLETE',
        description: 'Algorithm execution complete',
        targets: { indices: [] },
        variables: {},
        codeLine: 1,
        state: [...arr]
      });

      return {
        success: true,
        output: output || arr,
        steps,
        error: null
      };
    } catch (err) {
      return {
        success: false,
        output: null,
        steps,
        error: err.message
      };
    }
  }

  /**
   * Automated Test Runner for custom algorithms
   */
  static runTests(codeStr, testCases = [
    { input: [5, 2, 8, 1, 9], expected: [1, 2, 5, 8, 9] },
    { input: [3, 3, 3], expected: [3, 3, 3] },
    { input: [100], expected: [100] }
  ]) {
    const results = [];
    let allPassed = true;

    for (let idx = 0; idx < testCases.length; idx++) {
      const tc = testCases[idx];
      const run = CustomAlgorithmSDK.runCustomAlgorithm(codeStr, tc.input);

      const isMatch = run.success && JSON.stringify(run.output) === JSON.stringify(tc.expected);
      if (!isMatch) allPassed = false;

      results.push({
        testId: idx + 1,
        input: tc.input,
        expected: tc.expected,
        actual: run.output,
        passed: isMatch,
        error: run.error
      });
    }

    return {
      allPassed,
      results
    };
  }

  /**
   * Templates to help developers get started
   */
  static getTemplates() {
    return [
      {
        id: 'bubble-template',
        name: 'Simple Sorting Algorithm',
        code: `// Simple Bubble Sort Template
const n = arr.length;
for (let i = 0; i < n - 1; i++) {
  for (let j = 0; j < n - i - 1; j++) {
    // context.compare emits a COMPARE step
    if (context.compare(j, j + 1)) {
      // context.swap swaps elements in array and emits a SWAP step
      context.swap(j, j + 1);
    }
  }
}
return arr;`
      },
      {
        id: 'selection-template',
        name: 'Selection Sort Template',
        code: `// Selection Sort Template
const n = arr.length;
for (let i = 0; i < n - 1; i++) {
  let minIdx = i;
  for (let j = i + 1; j < n; j++) {
    if (context.compare(minIdx, j)) {
      minIdx = j;
    }
  }
  if (minIdx !== i) {
    context.swap(i, minIdx);
  }
}
return arr;`
      }
    ];
  }
}
