/**
 * "What If?" Branch Simulation Engine for ALGO3D
 * Enables branching simulations from any step without mutating original execution.
 */

export class BranchManager {
  static createBranch({
    originalAlgorithmId,
    originalData,
    branchStepIndex,
    modifiedData,
    branchName = 'Hypothetical Branch'
  }) {
    return {
      branchId: `BRANCH-${Date.now()}`,
      branchName,
      algorithmId: originalAlgorithmId,
      branchStepIndex,
      originalData: Array.isArray(originalData) ? [...originalData] : originalData,
      modifiedData: Array.isArray(modifiedData) ? [...modifiedData] : modifiedData,
      createdAt: new Date().toISOString()
    };
  }

  static compareBranches(branchA, branchB, executeFn) {
    if (!executeFn) return null;

    const stepsA = executeFn(branchA.modifiedData || branchA.originalData);
    const stepsB = executeFn(branchB.modifiedData || branchB.originalData);

    return {
      branchA: {
        id: branchA.branchId,
        name: branchA.branchName,
        totalSteps: stepsA.length,
        compares: stepsA.filter((s) => s.type === 'COMPARE').length,
        swaps: stepsA.filter((s) => s.type === 'SWAP').length
      },
      branchB: {
        id: branchB.branchId,
        name: branchB.branchName,
        totalSteps: stepsB.length,
        compares: stepsB.filter((s) => s.type === 'COMPARE').length,
        swaps: stepsB.filter((s) => s.type === 'SWAP').length
      }
    };
  }
}
