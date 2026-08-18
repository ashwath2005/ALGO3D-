import { SafeEvaluator } from '../../debugger/SafeEvaluator.js';
import { BreakpointManager } from '../../debugger/BreakpointManager.js';
import { CallStackManager } from '../../debugger/CallStackManager.js';
import { DebuggerEngine } from '../../debugger/DebuggerEngine.js';
import { ALGORITHMS, generateInitialData } from '../../registry.js';
import { ExecutionEngine } from '../ExecutionEngine.js';

console.log('🧪 RUNNING COMPREHENSIVE PHASE 3 DEBUGGER TEST SUITE...\n');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    passCount++;
  } else {
    failCount++;
    console.error(`❌ ASSERTION FAILED: ${message}`);
  }
}

// ==========================================
// 1. SAFE EVALUATOR TESTS
// ==========================================
console.log('=== 1. Testing SafeEvaluator (No eval) ===');
const ctx = {
  i: 3,
  j: 7,
  val: 88,
  distance: 5,
  operation: 'SWAP',
  isConflict: true,
  arr: [10, 20, 30, 40, 50],
  stats: { swaps: 12 }
};

assert(SafeEvaluator.evaluate('val > 50', ctx).result === true, 'val > 50 should be true');
assert(SafeEvaluator.evaluate('val < 50', ctx).result === false, 'val < 50 should be false');
assert(SafeEvaluator.evaluate('i === 3', ctx).result === true, 'i === 3 should be true');
assert(SafeEvaluator.evaluate('j !== 3', ctx).result === true, 'j !== 3 should be true');
assert(SafeEvaluator.evaluate('distance <= 5', ctx).result === true, 'distance <= 5 should be true');
assert(SafeEvaluator.evaluate('operation === "SWAP"', ctx).result === true, 'operation === "SWAP" should be true');
assert(SafeEvaluator.evaluate('isConflict === true', ctx).result === true, 'isConflict === true should be true');
assert(SafeEvaluator.evaluate('arr.length === 5', ctx).result === true, 'arr.length === 5 should be true');
assert(SafeEvaluator.evaluate('arr[2] === 30', ctx).result === true, 'arr[2] === 30 should be true');
assert(SafeEvaluator.evaluate('stats.swaps === 12', ctx).result === true, 'stats.swaps === 12 should be true');
assert(SafeEvaluator.evaluate('', ctx).success === false, 'Empty expression should fail safely');
assert(SafeEvaluator.evaluate('nonExistentVar > 10', ctx).result === false, 'Missing var should evaluate safely without crashing');

// ==========================================
// 2. BREAKPOINT MANAGER TESTS
// ==========================================
console.log('\n=== 2. Testing BreakpointManager ===');
const bpMgr = new BreakpointManager();

bpMgr.toggleLineBreakpoint(6);
assert(bpMgr.breakpoints.length === 1, 'Line 6 breakpoint should be added');
assert(bpMgr.breakpoints[0].line === 6, 'Breakpoint line should be 6');

// Evaluate matching line
const stepMatch = { type: 'SWAP', codeLine: 6, variables: { i: 2 } };
const resMatch = bpMgr.evaluateStep(stepMatch, 5, [1, 2, 3]);
assert(resMatch.hit === true, 'Line 6 step should trigger breakpoint');

// Evaluate non-matching line
const stepNoMatch = { type: 'COMPARE', codeLine: 4, variables: { i: 2 } };
const resNoMatch = bpMgr.evaluateStep(stepNoMatch, 6, [1, 2, 3]);
assert(resNoMatch.hit === false, 'Line 4 step should not trigger breakpoint');

// Conditional breakpoint
bpMgr.toggleLineBreakpoint(10, 'i > 5');
const condStepFalse = { type: 'COMPARE', codeLine: 10, variables: { i: 2 } };
const condStepTrue = { type: 'COMPARE', codeLine: 10, variables: { i: 8 } };
assert(bpMgr.evaluateStep(condStepFalse, 7, []).hit === false, 'Condition i > 5 (i=2) should not hit');
assert(bpMgr.evaluateStep(condStepTrue, 8, []).hit === true, 'Condition i > 5 (i=8) should hit');

// Operation breakpoint
bpMgr.toggleOpBreakpoint('ROTATE');
const rotateStep = { type: 'ROTATE', codeLine: 15, variables: {} };
assert(bpMgr.evaluateStep(rotateStep, 9, []).hit === true, 'ROTATE operation breakpoint should hit');

// Invariant violation breakpoint
bpMgr.breakOnInvariant = true;
const invariantViolation = { status: 'VIOLATION', rule: 'Heap order violation' };
assert(bpMgr.evaluateStep({ type: 'COMPARE', codeLine: 2 }, 10, [], invariantViolation).hit === true, 'Invariant violation should trigger breakpoint');

// ==========================================
// 3. CALL STACK MANAGER TESTS
// ==========================================
console.log('\n=== 3. Testing CallStackManager ===');
const qsStep = {
  type: 'COMPARE',
  codeLine: 4,
  variables: { low: 0, high: 7, pivot: 42, i: 2, j: 5 }
};
const qsStack = CallStackManager.buildCallStack('quick-sort', qsStep, 3, [10, 20, 30]);
assert(qsStack.length >= 3, 'Quick sort call stack should have root, quickSort, and partition frames');
assert(qsStack[1].name.includes('quickSort'), 'Frame 1 should be quickSort');
assert(qsStack[2].name.includes('partition'), 'Frame 2 should be partition');
assert(qsStack[2].scope.pivot === 42, 'Partition frame scope should contain pivot 42');

const dfsStep = {
  type: 'VISIT',
  codeLine: 2,
  nodes: ['C'],
  variables: { u: 'C', visited: ['A', 'B', 'C'] }
};
const dfsStack = CallStackManager.buildCallStack('dfs', dfsStep, 4, {});
assert(dfsStack.length >= 2, 'DFS stack should contain dfs(vertex=C)');
assert(dfsStack[1].name.includes("dfs(vertex='C')"), 'DFS stack frame name should include vertex C');

// ==========================================
// 4. DEBUGGER ENGINE & TIME TRAVEL ACROSS ALL 42 ALGORITHMS
// ==========================================
console.log('\n=== 4. Testing DebuggerEngine & Time Travel Across All 42 Algorithms ===');
const debuggerEng = new DebuggerEngine();

for (const [algoId, algo] of Object.entries(ALGORITHMS)) {
  const initialData = generateInitialData(algo.structureType, 8, 'random');
  let steps = [];
  try {
    if (algo.structureType === 'graph') {
      steps = algo.execute(initialData, 'A', 'F');
    } else if (algo.structureType === 'tree') {
      let root = null;
      for (const v of initialData) {
        const res = algo.executeInsert(root, v);
        root = res.root;
        steps.push(...res.steps);
      }
    } else {
      steps = algo.execute(initialData);
    }
  } catch (err) {
    console.error(`Error generating steps for ${algoId}:`, err);
  }

  assert(steps.length > 0, `${algoId} generated ${steps.length} steps`);

  // Test Time Travel with ExecutionEngine
  const engine = new ExecutionEngine();
  engine.load(steps, initialData);

  // Jump to middle
  const midIdx = Math.floor(steps.length / 2);
  engine.seek(midIdx);
  assert(engine.currentStepIndex === midIdx, `${algoId} successfully time-traveled to step ${midIdx}`);

  // Test Call Stack at mid
  const stack = debuggerEng.getCallStack(algoId, steps[midIdx], midIdx, engine.getCurrentState());
  assert(stack.length >= 1, `${algoId} generated valid call stack at step ${midIdx}`);

  // Test Watches at mid
  const watches = debuggerEng.evaluateWatches(['i', 'j', 'val', 'current', 'distance'], {
    step: midIdx,
    ...(steps[midIdx]?.variables || {})
  });
  assert(watches.length === 5, `${algoId} evaluated 5 watches`);

  // Jump to start and end
  engine.jumpToStart();
  assert(engine.currentStepIndex === -1, `${algoId} jumped to start`);

  engine.jumpToEnd();
  assert(engine.currentStepIndex === steps.length - 1, `${algoId} jumped to end`);
}

console.log('\n========================================================');
console.log(`DEBUGGER AUDIT RESULTS: ${passCount} / ${passCount + failCount} checks PASSED!`);
if (failCount === 0) {
  console.log('🎉 ZERO ERRORS! PHASE 3 DEBUGGER ENGINE IS 100% SOUND!');
} else {
  console.error(`❌ ${failCount} CHECKS FAILED!`);
  process.exit(1);
}
console.log('========================================================\n');
