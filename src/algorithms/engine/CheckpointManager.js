import { deepClone, OP_TYPES } from './StepModel.js';

export const DEFAULT_CHECKPOINT_INTERVAL = 25;

/**
 * Deterministic State Reducer
 * Applies an operation step to an existing state snapshot producing the next immutable state.
 */
export function applyOperation(currentState, step) {
  if (!step) return currentState;

  // If step explicitly carries full state snapshot, use it
  if (step.stateSnapshot !== null && step.stateSnapshot !== undefined) {
    return deepClone(step.stateSnapshot);
  }

  if (Array.isArray(currentState)) {
    const nextArr = [...currentState];

    switch (step.type) {
      case OP_TYPES.SWAP: {
        const [i, j] = step.targets.indices;
        if (i !== undefined && j !== undefined && nextArr[i] !== undefined && nextArr[j] !== undefined) {
          const temp = nextArr[i];
          nextArr[i] = nextArr[j];
          nextArr[j] = temp;
        }
        return nextArr;
      }

      case OP_TYPES.WRITE:
      case OP_TYPES.OVERWRITE: {
        const [idx] = step.targets.indices;
        const val = step.payload.values?.[0];
        if (idx !== undefined && val !== undefined) {
          nextArr[idx] = val;
        }
        return nextArr;
      }

      case OP_TYPES.INSERT:
      case OP_TYPES.PUSH:
      case OP_TYPES.ENQUEUE: {
        const val = step.payload.values?.[0];
        if (val !== undefined) {
          const idx = step.targets.indices?.[0];
          if (idx !== undefined && idx <= nextArr.length) {
            nextArr.splice(idx, 0, val);
          } else {
            nextArr.push(val);
          }
        }
        return nextArr;
      }

      case OP_TYPES.DELETE:
      case OP_TYPES.POP:
      case OP_TYPES.DEQUEUE: {
        const idx = step.targets.indices?.[0];
        if (idx !== undefined && idx < nextArr.length) {
          nextArr.splice(idx, 1);
        } else if (step.type === OP_TYPES.POP) {
          nextArr.pop();
        } else if (step.type === OP_TYPES.DEQUEUE) {
          nextArr.shift();
        }
        return nextArr;
      }

      default:
        return nextArr;
    }
  }

  return deepClone(currentState);
}

/**
 * Checkpoint Manager
 * Stores periodic full state checkpoints to accelerate arbitrary timeline scrubbing without replaying from step 0.
 */
export class CheckpointManager {
  constructor(interval = DEFAULT_CHECKPOINT_INTERVAL) {
    this.interval = interval;
    this.checkpoints = new Map(); // stepIndex -> stateSnapshot
    this.initialState = null;
  }

  /**
   * Set initial un-executed state (index -1)
   */
  setInitialState(state) {
    this.initialState = deepClone(state);
    this.checkpoints.clear();
    this.checkpoints.set(-1, this.initialState);
  }

  /**
   * Build checkpoints across an entire step timeline
   */
  buildCheckpoints(steps, initialState) {
    this.setInitialState(initialState);
    if (!Array.isArray(steps) || steps.length === 0) return;

    let currentState = deepClone(initialState);

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      currentState = applyOperation(currentState, step);

      // Record checkpoint at defined intervals or on final step
      if ((i + 1) % this.interval === 0 || i === steps.length - 1) {
        this.checkpoints.set(i, deepClone(currentState));
      }
    }
  }

  /**
   * Find nearest checkpoint <= targetIndex
   */
  getNearestCheckpoint(targetIndex) {
    if (targetIndex < 0) {
      return { stepIndex: -1, state: deepClone(this.initialState) };
    }

    let bestIndex = -1;
    for (const stepIndex of this.checkpoints.keys()) {
      if (stepIndex <= targetIndex && stepIndex > bestIndex) {
        bestIndex = stepIndex;
      }
    }

    const state = this.checkpoints.get(bestIndex) || this.initialState;
    return {
      stepIndex: bestIndex,
      state: deepClone(state)
    };
  }

  /**
   * Reconstruct state at targetIndex by restoring nearest checkpoint and rolling forward
   */
  reconstructState(targetIndex, steps) {
    if (targetIndex < 0) {
      return deepClone(this.initialState);
    }

    const { stepIndex: checkpointIdx, state: checkpointState } = this.getNearestCheckpoint(targetIndex);
    let state = deepClone(checkpointState);

    // Replay remaining steps from checkpoint to targetIndex
    for (let i = checkpointIdx + 1; i <= targetIndex; i++) {
      if (i >= 0 && i < steps.length) {
        state = applyOperation(state, steps[i]);
      }
    }

    return state;
  }

  clear() {
    this.checkpoints.clear();
    this.initialState = null;
  }
}
