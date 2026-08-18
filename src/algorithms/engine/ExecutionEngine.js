import { OP_TYPES, normalizeStep, assertTimelineValid, deepClone } from './StepModel.js';
import { CheckpointManager } from './CheckpointManager.js';
import { animationController } from '../../animations/AnimationController.js';
import { generateStepExplanation } from './ExplanationEngine.js';
import { getAlgorithmInvariant } from './InvariantEngine.js';
import { calculateStateDiff } from './DiffEngine.js';

export { OP_TYPES, createStep, normalizeStep, deepClone } from './StepModel.js';
export { CheckpointManager, applyOperation } from './CheckpointManager.js';
export { VISUAL_STATES, resolveVisualState, getVisualStateTheme } from './VisualStateResolver.js';
export { generateStepExplanation } from './ExplanationEngine.js';
export { getAlgorithmInvariant } from './InvariantEngine.js';
export { calculateStateDiff } from './DiffEngine.js';

/**
 * Authoritative Execution Engine
 * Pure state machine managing step execution, timeline cursor, checkpoints, metrics, and playback.
 */
export class ExecutionEngine {
  constructor({ onStepChange, onPlaybackChange, onComplete } = {}) {
    this.steps = [];
    this.initialState = null;
    this.currentState = null;
    this.currentStepIndex = -1;
    this.isPlaying = false;
    this.playbackSpeed = 1;
    this.playbackTimer = null;

    this.checkpointManager = new CheckpointManager();

    // Callbacks for reactive bridge
    this.onStepChange = onStepChange || (() => {});
    this.onPlaybackChange = onPlaybackChange || (() => {});
    this.onComplete = onComplete || (() => {});

    // Metrics snapshot
    this.metrics = {
      comparisons: 0,
      swaps: 0,
      writes: 0,
      visits: 0,
      operations: 0,
      executionTimeMs: 0
    };
  }

  /**
   * Load algorithm steps and initial state
   */
  load(rawSteps = [], initialState = null) {
    this.pause();
    animationController.invalidate();

    // Normalize all steps
    this.steps = rawSteps.map((step, idx) => normalizeStep(step, idx));
    this.initialState = deepClone(initialState);
    this.currentState = deepClone(initialState);
    this.currentStepIndex = -1;

    // Build checkpoints across timeline
    this.checkpointManager.buildCheckpoints(this.steps, this.initialState);

    // Reset metrics
    this.metrics = {
      comparisons: 0,
      swaps: 0,
      writes: 0,
      visits: 0,
      operations: 0,
      executionTimeMs: 0
    };

    this.notifyStepChange();
  }

  /**
   * Get currently active step or null if at beginning
   */
  getCurrentStep() {
    if (this.currentStepIndex < 0 || this.currentStepIndex >= this.steps.length) {
      return null;
    }
    return this.steps[this.currentStepIndex];
  }

  /**
   * Get current state
   */
  getCurrentState() {
    return this.currentState;
  }

  /**
   * Step forward by one step
   */
  next() {
    if (this.currentStepIndex + 1 >= this.steps.length) {
      if (this.isPlaying) this.pause();
      this.onComplete();
      return false;
    }

    const nextIndex = this.currentStepIndex + 1;
    this.seek(nextIndex, { isStep: true });
    return true;
  }

  /**
   * Step backward by one step
   */
  previous() {
    if (this.currentStepIndex <= 0) {
      this.reset();
      return false;
    }

    const prevIndex = this.currentStepIndex - 1;
    this.seek(prevIndex, { isStep: true });
    return true;
  }

  /**
   * Seek to an arbitrary step index with fast checkpoint reconstruction
   */
  seek(targetIndex, { isStep = false } = {}) {
    const clampedIndex = Math.max(-1, Math.min(targetIndex, this.steps.length - 1));
    if (clampedIndex === this.currentStepIndex && !isStep) return;

    // Invalidate animations on scrub
    animationController.invalidate();

    // Reconstruct state via checkpoints
    this.currentState = this.checkpointManager.reconstructState(clampedIndex, this.steps);
    this.currentStepIndex = clampedIndex;

    // Recalculate metrics
    this.recalculateMetrics(clampedIndex);

    this.notifyStepChange();
  }

  /**
   * Jump to beginning (initial un-executed state)
   */
  jumpToStart() {
    this.seek(-1);
  }

  /**
   * Jump to end of timeline
   */
  jumpToEnd() {
    this.seek(this.steps.length - 1);
  }

  /**
   * Reset engine to initial state
   */
  reset() {
    this.pause();
    animationController.invalidate();
    this.currentState = deepClone(this.initialState);
    this.currentStepIndex = -1;
    this.metrics = {
      comparisons: 0,
      swaps: 0,
      writes: 0,
      visits: 0,
      operations: 0,
      executionTimeMs: 0
    };
    this.notifyStepChange();
  }

  /**
   * Recalculate metrics up to target index
   */
  recalculateMetrics(targetIndex) {
    let comparisons = 0;
    let swaps = 0;
    let writes = 0;
    let visits = 0;

    for (let i = 0; i <= targetIndex; i++) {
      const s = this.steps[i];
      if (s.type === OP_TYPES.COMPARE) comparisons++;
      if (s.type === OP_TYPES.SWAP) swaps++;
      if (s.type === OP_TYPES.WRITE || s.type === OP_TYPES.OVERWRITE) writes++;
      if (s.type === OP_TYPES.VISIT || s.type === OP_TYPES.MOVE) visits++;
    }

    this.metrics = {
      comparisons,
      swaps,
      writes,
      visits,
      operations: targetIndex + 1,
      executionTimeMs: Math.round((targetIndex + 1) * (500 / this.playbackSpeed))
    };
  }

  /**
   * Start playback loop
   */
  play() {
    this.pause();
    if (this.currentStepIndex + 1 >= this.steps.length) {
      this.reset();
    }

    this.isPlaying = true;
    this.onPlaybackChange(true);

    const stepInterval = Math.max(80, Math.floor(550 / this.playbackSpeed));

    this.playbackTimer = setInterval(() => {
      if (this.currentStepIndex + 1 >= this.steps.length) {
        this.pause();
        this.onComplete();
      } else {
        this.next();
      }
    }, stepInterval);
  }

  /**
   * Pause playback loop
   */
  pause() {
    if (this.playbackTimer) {
      clearInterval(this.playbackTimer);
      this.playbackTimer = null;
    }
    if (this.isPlaying) {
      this.isPlaying = false;
      this.onPlaybackChange(false);
    }
  }

  /**
   * Toggle Play / Pause
   */
  togglePlay() {
    if (this.isPlaying) this.pause();
    else this.play();
  }

  /**
   * Set playback speed multiplier
   */
  setSpeed(speed) {
    this.playbackSpeed = speed;
    if (this.isPlaying) {
      this.pause();
      this.play();
    }
  }

  /**
   * Notify reactive subscribers
   */
  notifyStepChange() {
    const step = this.getCurrentStep();
    const prevStep = this.currentStepIndex > 0 ? this.steps[this.currentStepIndex - 1] : null;
    const nextStep = this.currentStepIndex + 1 < this.steps.length ? this.steps[this.currentStepIndex + 1] : null;
    const prevState = this.currentStepIndex > 0 ? this.checkpointManager.reconstructState(this.currentStepIndex - 1, this.steps) : this.initialState;

    this.onStepChange({
      step,
      stepIndex: this.currentStepIndex,
      totalSteps: this.steps.length,
      state: this.currentState,
      prevState,
      nextStep,
      prevStep,
      metrics: { ...this.metrics }
    });
  }

  /**
   * Clean up all timers and memory
   */
  dispose() {
    this.pause();
    animationController.cancelAll();
    this.checkpointManager.clear();
    this.steps = [];
    this.initialState = null;
    this.currentState = null;
  }
}
