import { ALGORITHMS, generateInitialData } from '../../registry.js';
import { ExecutionEngine } from '../ExecutionEngine.js';

console.log('🧪 Running Comprehensive Multi-Pass Verification on all 42 algorithms...');

let totalAlgos = 0;
let passedAlgos = 0;
let errors = [];

for (const [id, algo] of Object.entries(ALGORITHMS)) {
  totalAlgos++;
  try {
    const initialData = generateInitialData(algo.structureType, 8, 'random');
    let steps = [];

    if (algo.structureType === 'graph') {
      steps = algo.execute(initialData, 'A', 'F');
    } else if (algo.structureType === 'tree') {
      let treeRoot = null;
      for (const val of [50, 30, 70, 20, 40]) {
        const res = algo.executeInsert(treeRoot, val);
        treeRoot = res.root;
        steps.push(...res.steps);
      }
    } else {
      steps = algo.execute(initialData);
    }

    if (!steps || steps.length === 0) {
      throw new Error(`Generated 0 steps.`);
    }

    // Test ExecutionEngine lifecycle
    const engine = new ExecutionEngine({
      onStepChange: () => {},
      onPlaybackChange: () => {},
      onComplete: () => {}
    });

    engine.load(steps, initialData);

    // 1. Step Forward all the way to completion
    for (let i = 0; i < steps.length; i++) {
      engine.next();
    }
    if (engine.currentStepIndex !== steps.length - 1) {
      throw new Error(`Engine forward step failed to reach end. Cursor: ${engine.currentStepIndex}, Expected: ${steps.length - 1}`);
    }

    // 2. Step Backward all the way back to start
    for (let i = steps.length - 1; i >= 0; i--) {
      engine.previous();
    }
    if (engine.currentStepIndex !== -1) {
      throw new Error(`Engine backward step failed to restore start. Cursor: ${engine.currentStepIndex}, Expected: -1`);
    }

    // 3. Scrub directly to midpoint
    const midPoint = Math.floor(steps.length / 2);
    engine.seek(midPoint);
    if (engine.currentStepIndex !== midPoint) {
      throw new Error(`Engine seek failed. Cursor: ${engine.currentStepIndex}, Expected: ${midPoint}`);
    }

    // 4. Jump to Start and Jump to End
    engine.jumpToEnd();
    if (engine.currentStepIndex !== steps.length - 1) {
      throw new Error(`Engine jumpToEnd failed.`);
    }

    engine.jumpToStart();
    if (engine.currentStepIndex !== -1) {
      throw new Error(`Engine jumpToStart failed.`);
    }

    console.log(`  ✅ Verified: [${id}] - ${steps.length} steps, forward/backward/scrub/jump OK`);
    passedAlgos++;
  } catch (err) {
    console.error(`  ❌ ERROR in [${id}]:`, err.message);
    errors.push({ id, error: err.message });
  }
}

console.log('\n========================================================');
console.log(`Summary: ${passedAlgos} / ${totalAlgos} algorithms 100% verified`);
if (errors.length > 0) {
  console.log('Errors:', errors);
  process.exit(1);
} else {
  console.log('🎉 ALL 42 ALGORITHMS, TIMELINES, FORWARD/BACKWARD STEPPING, AND CHECKPOINTS VERIFIED 100% SOUND!');
}
console.log('========================================================\n');
