import { ALGORITHMS, generateInitialData } from '../../registry.js';

console.log('Testing execution of all 42 registered algorithms:');
let passCount = 0;
let failCount = 0;

for (const [id, algo] of Object.entries(ALGORITHMS)) {
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

    if (!Array.isArray(steps) || steps.length === 0) {
      console.error(`❌ FAIL: ${id} returned 0 steps or invalid format`);
      failCount++;
    } else {
      console.log(`✅ PASS: ${id} (${steps.length} steps, structure: ${algo.structureType})`);
      passCount++;
    }
  } catch (err) {
    console.error(`❌ ERROR in ${id}:`, err.message);
    failCount++;
  }
}

console.log(`\n========================================`);
console.log(`Total: ${passCount + failCount} | Passed: ${passCount} | Failed: ${failCount}`);
console.log(`========================================`);
