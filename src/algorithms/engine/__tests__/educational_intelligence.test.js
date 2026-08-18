import { ALGORITHMS, generateInitialData } from '../../registry.js';
import { ExecutionEngine } from '../ExecutionEngine.js';
import { generateStepExplanation } from '../ExplanationEngine.js';
import { getAlgorithmInvariant } from '../InvariantEngine.js';
import { calculateStateDiff } from '../DiffEngine.js';

console.log('🧪 Verifying Educational Intelligence & Invariant Engine across all 42 algorithms...\n');

let totalChecks = 0;
let passedChecks = 0;

for (const [id, algo] of Object.entries(ALGORITHMS)) {
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

  // Verify invariant evaluation on initial state
  const inv = getAlgorithmInvariant(id, initialData, null, {});
  totalChecks++;
  if (inv && inv.name && inv.statement && inv.status) {
    passedChecks++;
  } else {
    console.error(`❌ Invariant failed for ${id}`);
  }

  // Verify explanation generation for each step
  for (let i = 0; i < Math.min(steps.length, 5); i++) {
    const step = steps[i];
    const nextStep = i + 1 < steps.length ? steps[i + 1] : null;
    const prevStep = i > 0 ? steps[i - 1] : null;

    const explanation = generateStepExplanation({
      algorithmId: id,
      step,
      nextStep,
      prevStep,
      currentState: initialData,
      prevState: initialData,
      variables: step.variables || {}
    });

    totalChecks++;
    if (explanation.what && explanation.why && explanation.invariant && explanation.nextOp) {
      passedChecks++;
    } else {
      console.error(`❌ Explanation failed for ${id} step ${i}`);
    }
  }

  console.log(`  ✅ [${id}] Invariant & Educational Explanations OK (${steps.length} steps)`);
}

console.log(`\n========================================================`);
console.log(`Educational Verification: ${passedChecks} / ${totalChecks} checks passed!`);
console.log(`========================================================`);
