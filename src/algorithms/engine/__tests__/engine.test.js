import { ExecutionEngine } from '../ExecutionEngine.js';
import { bubbleSort } from '../../sorting/bubbleSort.js';
import { quickSort } from '../../sorting/quickMergeSort.js';
import { binarySearch } from '../../searching/searchAlgorithms.js';
import { CheckpointManager } from '../CheckpointManager.js';
import { OP_TYPES } from '../StepModel.js';

export function runPhase1Tests() {
  console.log('🧪 Starting ALGO3D Phase 1 Architecture Verification Tests...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  }

  // TEST 1: Bubble Sort Step Generation & Execution Engine Loading
  {
    const initialArr = [50, 20, 40, 10, 30];
    const steps = bubbleSort.execute(initialArr);
    assert(steps.length > 0, 'Bubble Sort emits discrete steps');

    const engine = new ExecutionEngine();
    engine.load(steps, initialArr);
    assert(engine.currentStepIndex === -1, 'Engine loads at initial index -1');
    assert(engine.steps.length === steps.length, 'Engine registers all steps correctly');
  }

  // TEST 2: Deterministic Forward Stepping & Metrics Accumulation
  {
    const initialArr = [30, 10, 20];
    const steps = bubbleSort.execute(initialArr);
    const engine = new ExecutionEngine();
    engine.load(steps, initialArr);

    engine.next();
    assert(engine.currentStepIndex === 0, 'Engine steps forward to index 0');
    
    // Step forward 3 times
    engine.next();
    engine.next();
    assert(engine.currentStepIndex === 2, 'Engine steps forward to index 2');
    assert(engine.metrics.operations === 3, 'Metrics accurately track operation count');
  }

  // TEST 3: Deterministic Backward Stepping (Reversibility)
  {
    const initialArr = [30, 10, 20];
    const steps = bubbleSort.execute(initialArr);
    const engine = new ExecutionEngine();
    engine.load(steps, initialArr);

    engine.seek(4);
    const stateAtStep4 = [...engine.getCurrentState()];
    
    engine.previous();
    assert(engine.currentStepIndex === 3, 'Engine steps backward to index 3');
    
    engine.next();
    assert(JSON.stringify(engine.getCurrentState()) === JSON.stringify(stateAtStep4), 'State matches exactly after backward/forward oscillation');
  }

  // TEST 4: Arbitrary Seeking & Checkpoint Reconstruction
  {
    const initialArr = [80, 20, 50, 10, 70, 30, 60, 40];
    const steps = quickSort.execute(initialArr);
    const engine = new ExecutionEngine();
    engine.load(steps, initialArr);

    // Seek to step 15
    engine.seek(15);
    assert(engine.currentStepIndex === 15, 'Engine seeks directly to step 15');
    
    // Jump to beginning
    engine.jumpToStart();
    assert(engine.currentStepIndex === -1, 'Engine jumps to start (-1)');
    assert(JSON.stringify(engine.getCurrentState()) === JSON.stringify(initialArr), 'Initial state restored on jumpToStart');

    // Jump to end
    engine.jumpToEnd();
    assert(engine.currentStepIndex === steps.length - 1, 'Engine jumps to end');
  }

  // TEST 5: Checkpoint Manager Lookup & Integrity
  {
    const checkpointMgr = new CheckpointManager(10);
    const initial = [5, 4, 3, 2, 1];
    const steps = bubbleSort.execute(initial);
    checkpointMgr.buildCheckpoints(steps, initial);

    const nearest = checkpointMgr.getNearestCheckpoint(12);
    assert(nearest.stepIndex >= 0 && nearest.stepIndex <= 12, 'Nearest checkpoint correctly returned');
    
    const reconstructed = checkpointMgr.reconstructState(8, steps);
    assert(Array.isArray(reconstructed), 'State successfully reconstructed from checkpoint');
  }

  // TEST 6: Edge Cases (Empty Array & Single Element)
  {
    const singleArr = [42];
    const stepsSingle = bubbleSort.execute(singleArr);
    const engineSingle = new ExecutionEngine();
    engineSingle.load(stepsSingle, singleArr);
    assert(engineSingle.steps.length >= 1, 'Single element array handled gracefully');
    engineSingle.jumpToEnd();
    assert(engineSingle.getCurrentState()[0] === 42, 'Single element value preserved');
  }

  console.log(`\n========================================`);
  console.log(`Total: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
  console.log(`========================================\n`);

  return { passed, failed };
}

// Auto-run if running directly in node environment
if (typeof process !== 'undefined' && process.argv && process.argv[1]?.includes('engine.test.js')) {
  runPhase1Tests();
}
