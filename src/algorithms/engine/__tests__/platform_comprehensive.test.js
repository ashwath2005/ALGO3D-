import { ALGORITHM_METADATA, LEARNING_PATHS } from '../../knowledge/KnowledgeBase.js';
import { ChallengeEngine, CHALLENGES_DATABASE } from '../../challenges/ChallengeEngine.js';
import { CustomAlgorithmSDK } from '../../custom/CustomAlgorithmSDK.js';
import { BranchManager } from '../../simulation/BranchManager.js';
import { ALGORITHMS } from '../../registry.js';

console.log('🧪 RUNNING COMPREHENSIVE PHASE 5 PLATFORM & CHALLENGE TEST SUITE...\n');

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
// 1. KNOWLEDGE BASE & METADATA TESTS
// ==========================================
console.log('=== 1. Testing KnowledgeBase & Learning Paths ===');

for (const [algoId, meta] of Object.entries(ALGORITHM_METADATA)) {
  assert(ALGORITHMS[algoId] !== undefined, `Algorithm ${algoId} in metadata must exist in ALGORITHMS registry`);
  assert(meta.paradigm && meta.paradigm.length > 0, `${algoId} must declare an algorithmic paradigm`);
  assert(Array.isArray(meta.prerequisites), `${algoId} must declare prerequisites array`);
  assert(meta.whatItDoes && meta.whatItDoes.length > 10, `${algoId} must have a valid whatItDoes description`);
}

for (const path of LEARNING_PATHS) {
  assert(path.algorithms.length >= 3, `Learning path ${path.name} must have at least 3 algorithms`);
  for (const algoId of path.algorithms) {
    assert(ALGORITHMS[algoId] !== undefined, `Path algorithm ${algoId} must exist in ALGORITHMS`);
  }
}

// ==========================================
// 2. CHALLENGE ENGINE TESTS
// ==========================================
console.log('\n=== 2. Testing Challenge Engine ===');

const allChallenges = ChallengeEngine.getAllChallenges();
assert(allChallenges.length >= 8, 'Challenge database should contain at least 8 structured challenges');

for (const c of allChallenges) {
  assert(c.title && c.title.length > 0, `Challenge ${c.id} must have a title`);
  assert(c.options && c.options.length >= 2, `Challenge ${c.id} must have at least 2 options`);
  assert(
    c.correctIndex >= 0 && c.correctIndex < c.options.length,
    `Challenge ${c.id} correctIndex must point to a valid option`
  );
  assert(c.explanation && c.explanation.length > 10, `Challenge ${c.id} must have a detailed explanation`);
}

// ==========================================
// 3. CUSTOM ALGORITHM SDK TESTS
// ==========================================
console.log('\n=== 3. Testing Custom Algorithm SDK & Sandboxed Execution ===');

const customCode = `
const n = arr.length;
for (let i = 0; i < n - 1; i++) {
  for (let j = 0; j < n - i - 1; j++) {
    if (context.compare(j, j + 1)) {
      context.swap(j, j + 1);
    }
  }
}
return arr;
`;

const executionResult = CustomAlgorithmSDK.runCustomAlgorithm(customCode, [50, 20, 80, 10]);
assert(executionResult.success === true, 'Custom algorithm should execute successfully');
assert(JSON.stringify(executionResult.output) === JSON.stringify([10, 20, 50, 80]), 'Custom algorithm should sort input array correctly');
assert(executionResult.steps.length > 0, 'Custom algorithm should emit steps');

// Test Automated Test Runner
const testRunner = CustomAlgorithmSDK.runTests(customCode);
assert(testRunner.allPassed === true, 'Custom algorithm must pass all automated test cases');

// ==========================================
// 4. BRANCH SIMULATION ENGINE TESTS
// ==========================================
console.log('\n=== 4. Testing BranchManager Simulation ===');

const branchA = BranchManager.createBranch({
  originalAlgorithmId: 'bubble-sort',
  originalData: [10, 20, 30],
  branchStepIndex: 2,
  modifiedData: [30, 20, 10],
  branchName: 'Reverse Hypothetical'
});

assert(branchA.branchId.startsWith('BRANCH-'), 'Branch ID should start with BRANCH-');
assert(branchA.modifiedData.length === 3, 'Branch modified data should have length 3');

const branchComp = BranchManager.compareBranches(
  branchA,
  { branchId: 'BRANCH-ORIG', branchName: 'Original', originalData: [10, 20, 30] },
  (arr) => ALGORITHMS['bubble-sort'].execute([...arr])
);

assert(branchComp.branchA.totalSteps > 0, 'Branch A should have non-zero steps');
assert(branchComp.branchB.totalSteps > 0, 'Branch B should have non-zero steps');

console.log('\n========================================================');
console.log(`PHASE 5 PLATFORM AUDIT RESULTS: ${passCount} / ${passCount + failCount} checks PASSED!`);
if (failCount === 0) {
  console.log('🎉 ZERO ERRORS! PHASE 5 ALGORITHM PLATFORM IS 100% SOUND!');
} else {
  console.error(`❌ ${failCount} CHECKS FAILED!`);
  process.exit(1);
}
console.log('========================================================\n');
