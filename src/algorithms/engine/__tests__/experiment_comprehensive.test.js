import { DatasetEngine } from '../../experiment/DatasetEngine.js';
import { BenchmarkEngine } from '../../experiment/BenchmarkEngine.js';
import { ALGORITHMS } from '../../registry.js';

console.log('🧪 RUNNING COMPREHENSIVE PHASE 4 EXPERIMENT & BENCHMARK TEST SUITE...\n');

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
// 1. DATASET ENGINE & SEED DETERMINISM
// ==========================================
console.log('=== 1. Testing DatasetEngine & Seed Determinism ===');

const seedA = 928472;
const ds1 = DatasetEngine.generateArrayDataset({ size: 100, distribution: 'random', seed: seedA });
const ds2 = DatasetEngine.generateArrayDataset({ size: 100, distribution: 'random', seed: seedA });
const ds3 = DatasetEngine.generateArrayDataset({ size: 100, distribution: 'random', seed: 111111 });

assert(ds1.data.length === 100, 'Dataset 1 should have 100 elements');
assert(JSON.stringify(ds1.data) === JSON.stringify(ds2.data), 'Same seed (928472) MUST generate identical datasets');
assert(JSON.stringify(ds1.data) !== JSON.stringify(ds3.data), 'Different seeds MUST generate distinct datasets');

// Test Sorted
const sortedDs = DatasetEngine.generateArrayDataset({ size: 50, distribution: 'sorted' });
let isMonotonic = true;
for (let i = 1; i < sortedDs.data.length; i++) {
  if (sortedDs.data[i] < sortedDs.data[i - 1]) isMonotonic = false;
}
assert(isMonotonic, 'Sorted distribution should be non-decreasing');

// Test Reverse Sorted
const reverseDs = DatasetEngine.generateArrayDataset({ size: 50, distribution: 'reverse' });
let isReverseMonotonic = true;
for (let i = 1; i < reverseDs.data.length; i++) {
  if (reverseDs.data[i] > reverseDs.data[i - 1]) isReverseMonotonic = false;
}
assert(isReverseMonotonic, 'Reverse sorted distribution should be non-increasing');

// Test Duplicates
const dupDs = DatasetEngine.generateArrayDataset({ size: 100, distribution: 'duplicates' });
const uniqueCount = new Set(dupDs.data).size;
assert(uniqueCount <= 4, 'Duplicates distribution should have 4 or fewer unique elements');

// Test Custom Input
const customDs = DatasetEngine.generateArrayDataset({ distribution: 'custom', customInput: '99, 12, 45, 88, 3' });
assert(customDs.data.length === 5, 'Custom input should parse 5 numbers');
assert(customDs.data[0] === 99 && customDs.data[4] === 3, 'Custom input values should match precisely');

// ==========================================
// 2. BENCHMARK ENGINE & MULTI-ALGORITHM RUNS
// ==========================================
console.log('\n=== 2. Testing BenchmarkEngine ===');

const benchmarkReport = BenchmarkEngine.runBenchmark({
  algorithmIds: ['bubble-sort', 'quick-sort', 'merge-sort', 'heap-sort'],
  dataset: ds1,
  repetitions: 3,
  warmupRuns: 1
});

assert(benchmarkReport.results.length === 4, 'Benchmark should yield 4 algorithm results');
assert(benchmarkReport.results[0].rank === 1, 'First result should have rank 1');
assert(benchmarkReport.results[0].stats.meanTime >= 0, 'Mean time should be non-negative');
assert(benchmarkReport.results[0].metrics.operations > 0, 'Operations should be > 0');
assert(benchmarkReport.insights.length > 0, 'Comparative insights should be generated');

// Verify that Quick Sort has fewer comparisons than Bubble Sort on random data
const bubbleRes = benchmarkReport.results.find((r) => r.algorithmId === 'bubble-sort');
const quickRes = benchmarkReport.results.find((r) => r.algorithmId === 'quick-sort');
assert(
  quickRes.metrics.comparisons < bubbleRes.metrics.comparisons,
  `Quick Sort comparisons (${quickRes.metrics.comparisons}) should be fewer than Bubble Sort (${bubbleRes.metrics.comparisons})`
);

// ==========================================
// 3. COMPLEXITY SWEEPER TEST
// ==========================================
console.log('\n=== 3. Testing Complexity Sweeper ===');

const sweepReport = BenchmarkEngine.runComplexitySweep({
  algorithmIds: ['bubble-sort', 'quick-sort'],
  sizes: [10, 25, 50, 100],
  distribution: 'random',
  seed: 42
});

assert(sweepReport['bubble-sort'].dataPoints.length === 4, 'Bubble sort should have 4 data points');
assert(sweepReport['quick-sort'].dataPoints.length === 4, 'Quick sort should have 4 data points');
assert(
  sweepReport['bubble-sort'].dataPoints[3].operations > sweepReport['bubble-sort'].dataPoints[0].operations,
  'Operations should grow as N increases'
);

console.log('\n========================================================');
console.log(`PHASE 4 AUDIT RESULTS: ${passCount} / ${passCount + failCount} checks PASSED!`);
if (failCount === 0) {
  console.log('🎉 ZERO ERRORS! PHASE 4 EXPERIMENT LAB IS 100% SOUND!');
} else {
  console.error(`❌ ${failCount} CHECKS FAILED!`);
  process.exit(1);
}
console.log('========================================================\n');
