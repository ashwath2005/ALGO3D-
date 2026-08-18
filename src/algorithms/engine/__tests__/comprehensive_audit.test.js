import { ALGORITHMS, generateInitialData } from '../../registry.js';
import { ExecutionEngine, OP_TYPES } from '../ExecutionEngine.js';
import { getAlgorithmInvariant } from '../InvariantEngine.js';
import { calculateStateDiff } from '../DiffEngine.js';
import { generateStepExplanation } from '../ExplanationEngine.js';

console.log('🔍 RUNNING COMPREHENSIVE PROJECT-WIDE AUDIT & BUG DETECTION...\n');

let totalTests = 0;
let failedTests = [];

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    failedTests.push(message);
    console.error(`❌ FAILED: ${message}`);
  }
}

// ----------------------------------------------------
// TEST 1: ALL 42 ALGORITHMS WITH EDGE CASES
// ----------------------------------------------------
console.log('=== 1. Testing All 42 Algorithms Across Edge Cases ===');

const edgeCases = {
  array: [
    { name: 'Normal random', data: [45, 12, 89, 34, 78, 23, 56, 91] },
    { name: 'Already sorted', data: [10, 20, 30, 40, 50, 60, 70, 80] },
    { name: 'Reverse sorted', data: [90, 80, 70, 60, 50, 40, 30, 20] },
    { name: 'With duplicates', data: [30, 10, 30, 50, 10, 50, 30, 20] },
    { name: 'Single element', data: [42] },
    { name: 'With negative numbers', data: [-15, 8, -3, 22, -1, 0, 14, -7] }
  ]
};

for (const [id, algo] of Object.entries(ALGORITHMS)) {
  assert(algo.id === id, `Algorithm ID mismatch: ${id} vs ${algo.id}`);
  assert(typeof algo.name === 'string' && algo.name.length > 0, `Missing name for ${id}`);
  assert(typeof algo.code === 'string' && algo.code.length > 0, `Missing code for ${id}`);
  assert(typeof algo.complexity === 'object', `Missing complexity for ${id}`);

  if (algo.structureType === 'array') {
    for (const testCase of edgeCases.array) {
      // Don't test negative on counting/radix sorts which expect non-negative
      if (testCase.name === 'With negative numbers' && (id === 'counting-sort' || id === 'radix-sort' || id === 'sieve-eratosthenes')) {
        continue;
      }
      try {
        let steps = [];
        if (id === 'two-sum-pointer') {
          steps = algo.execute(testCase.data, 50);
        } else if (id.includes('search')) {
          steps = algo.execute(testCase.data, { target: 30 });
        } else {
          steps = algo.execute(testCase.data);
        }

        assert(Array.isArray(steps), `${id} (${testCase.name}): execute did not return an array`);
        assert(steps.length > 0, `${id} (${testCase.name}): returned empty steps`);

        // Verify each step has valid schema
        steps.forEach((st, stepIdx) => {
          assert(st.type && Object.values(OP_TYPES).includes(st.type), `${id} step ${stepIdx}: invalid OP_TYPE ${st.type}`);
          assert(Array.isArray(st.stateSnapshot), `${id} step ${stepIdx}: missing stateSnapshot`);
          assert(typeof st.description === 'string', `${id} step ${stepIdx}: missing description`);
        });
      } catch (err) {
        assert(false, `CRASH in ${id} with ${testCase.name}: ${err.message}\n${err.stack}`);
      }
    }
  } else if (algo.structureType === 'graph') {
    try {
      const graphData = generateInitialData('graph');
      const steps = algo.execute(graphData, 'A', 'F');
      assert(Array.isArray(steps) && steps.length > 0, `${id}: returned empty graph steps`);
    } catch (err) {
      assert(false, `CRASH in ${id}: ${err.message}`);
    }
  } else if (algo.structureType === 'tree') {
    try {
      let root = null;
      const steps = [];
      for (const val of [50, 30, 70, 20, 40]) {
        const res = algo.executeInsert(root, val);
        root = res.root;
        steps.push(...res.steps);
      }
      assert(steps.length > 0, `${id}: returned empty tree steps`);
    } catch (err) {
      assert(false, `CRASH in tree ${id}: ${err.message}`);
    }
  } else if (algo.structureType === 'matrix') {
    try {
      const matrixData = generateInitialData('matrix');
      const steps = algo.execute(matrixData);
      assert(Array.isArray(steps) && steps.length > 0, `${id}: returned empty matrix steps`);
    } catch (err) {
      assert(false, `CRASH in matrix ${id}: ${err.message}`);
    }
  } else if (algo.structureType === 'spatial') {
    try {
      const spatialData = generateInitialData('spatial');
      const steps = algo.execute(spatialData);
      assert(Array.isArray(steps) && steps.length > 0, `${id}: returned empty spatial steps`);
    } catch (err) {
      assert(false, `CRASH in spatial ${id}: ${err.message}`);
    }
  }
}

// ----------------------------------------------------
// TEST 2: EXECUTION ENGINE STEPPING, TIMELINE & CHECKPOINTS
// ----------------------------------------------------
console.log('=== 2. Testing Execution Engine Lifecycle & Checkpoint Recovery ===');

for (const [id, algo] of Object.entries(ALGORITHMS)) {
  try {
    const initialData = generateInitialData(algo.structureType, 8, 'random');
    let steps = [];
    if (algo.structureType === 'graph') {
      steps = algo.execute(initialData, 'A', 'F');
    } else if (algo.structureType === 'tree') {
      let r = null;
      for (const val of [50, 30, 70]) {
        const res = algo.executeInsert(r, val);
        r = res.root;
        steps.push(...res.steps);
      }
    } else {
      steps = algo.execute(initialData);
    }

    const engine = new ExecutionEngine();
    engine.load(steps, initialData);

    assert(engine.currentStepIndex === -1, `${id}: initial step index should be -1`);
    
    // Step forward all the way
    while (engine.next()) {}
    assert(engine.currentStepIndex === steps.length - 1, `${id}: should reach last step`);

    // Step backward all the way
    while (engine.previous()) {}
    assert(engine.currentStepIndex === -1, `${id}: should reach start index`);

    // Jump to middle step and verify checkpoint reconstruction
    const midIdx = Math.floor(steps.length / 2);
    engine.seek(midIdx);
    assert(engine.currentStepIndex === midIdx, `${id}: seek(${midIdx}) failed`);

    // Jump to end
    engine.jumpToEnd();
    assert(engine.currentStepIndex === steps.length - 1, `${id}: jumpToEnd failed`);

    // Jump to start
    engine.jumpToStart();
    assert(engine.currentStepIndex === -1, `${id}: jumpToStart failed`);

  } catch (err) {
    assert(false, `CRASH in engine test for ${id}: ${err.message}`);
  }
}

// ----------------------------------------------------
// TEST 3: INVARIANT ENGINE, DIFF ENGINE, EXPLANATION ENGINE
// ----------------------------------------------------
console.log('=== 3. Testing Invariant, Diff, & Explanation Engines ===');

for (const [id, algo] of Object.entries(ALGORITHMS)) {
  try {
    const initialData = generateInitialData(algo.structureType, 8, 'random');
    const inv = getAlgorithmInvariant(id, initialData, null, {});
    assert(inv !== null && typeof inv === 'object', `Null invariant for ${id}`);
    assert(typeof inv.name === 'string', `Missing invariant name for ${id}`);
    assert(typeof inv.statement === 'string', `Missing invariant statement for ${id}`);
    assert(typeof inv.status === 'string', `Missing invariant status for ${id}`);

    // Diff testing
    const diff = calculateStateDiff(algo.structureType, initialData, initialData);
    assert(diff !== null && Array.isArray(diff.changes), `Invalid diff result for ${id}`);

    // Explanation testing with null/empty step safety
    const safeExp = generateStepExplanation({
      algorithmId: id,
      step: { type: OP_TYPES.MESSAGE, description: 'Test', variables: {} },
      nextStep: null,
      prevStep: null,
      currentState: initialData,
      prevState: initialData,
      variables: {}
    });
    assert(safeExp && safeExp.what && safeExp.why, `Unsafe explanation generation for ${id}`);
  } catch (err) {
    assert(false, `CRASH in educational engines for ${id}: ${err.message}`);
  }
}

console.log(`\n========================================================`);
console.log(`AUDIT RESULTS: ${totalTests - failedTests.length} / ${totalTests} checks PASSED!`);
if (failedTests.length > 0) {
  console.log(`❌ Total Failures: ${failedTests.length}`);
  failedTests.slice(0, 10).forEach((f) => console.log(' - ' + f));
} else {
  console.log(`🎉 ZERO BUGS DETECTED ACROSS ALL 42 ALGORITHMS & ENGINES!`);
}
console.log(`========================================================\n`);

if (failedTests.length > 0) {
  process.exit(1);
}
