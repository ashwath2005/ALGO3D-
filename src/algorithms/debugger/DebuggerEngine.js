import { BreakpointManager } from './BreakpointManager.js';
import { CallStackManager } from './CallStackManager.js';
import { SafeEvaluator } from './SafeEvaluator.js';

/**
 * Debugger Engine for ALGO3D
 * Coordinates breakpoints, call stack, stepping semantics, watches, variable history, and 3D object linking.
 */
export class DebuggerEngine {
  constructor() {
    this.breakpointManager = new BreakpointManager();
    this.watches = ['i', 'j', 'pivot', 'current', 'distance', 'balanceFactor', 'arr.length'];
  }

  /**
   * Evaluate watches for current context
   */
  evaluateWatches(watches = this.watches, context = {}) {
    const list = watches || this.watches;
    return list.map((expr) => {
      const res = SafeEvaluator.evaluate(expr, context);
      return {
        expression: expr,
        value: res.success && res.result !== undefined ? res.result : 'undefined',
        isValid: res.success,
        error: res.error
      };
    });
  }

  /**
   * Reconstruct logical Call Stack
   */
  getCallStack(algorithmId, step, stepIndex, currentState) {
    return CallStackManager.buildCallStack(algorithmId, step, stepIndex, currentState);
  }

  /**
   * Track historical values for a specific variable across all steps
   */
  getVariableTimeline(varName, steps = [], initialState = null) {
    if (!varName || !Array.isArray(steps)) return [];

    const history = [];
    let lastVal = undefined;

    steps.forEach((step, idx) => {
      const vars = step.variables || {};
      const val = vars[varName];

      if (val !== undefined && val !== lastVal) {
        history.push({
          stepIndex: idx,
          operation: step.type,
          description: step.description,
          value: val,
          prevValue: lastVal
        });
        lastVal = val;
      }
    });

    return history;
  }

  /**
   * Track historical operations on a specific 3D Object
   * @param {Object} objSpec - { type: 'array_element' | 'tree_node' | 'graph_vertex' | 'matrix_cell', index?, id?, key? }
   */
  getObjectTimeline(objSpec, steps = []) {
    if (!objSpec || !Array.isArray(steps)) return [];

    const history = [];

    steps.forEach((step, idx) => {
      let isRelevant = false;
      let detail = '';

      if (objSpec.type === 'array_element' && objSpec.index !== undefined) {
        if (step.indices && step.indices.includes(objSpec.index)) {
          isRelevant = true;
          detail = `${step.type} at index ${objSpec.index} (value: ${step.values?.[step.indices.indexOf(objSpec.index)] || 'current'})`;
        }
      } else if (objSpec.type === 'graph_vertex' && objSpec.id) {
        if (step.nodes && step.nodes.includes(objSpec.id)) {
          isRelevant = true;
          detail = `${step.type} on vertex ${objSpec.id}`;
        }
      } else if (objSpec.type === 'tree_node' && objSpec.id) {
        if ((step.nodes && step.nodes.includes(objSpec.id)) || (step.values && step.values.includes(objSpec.id))) {
          isRelevant = true;
          detail = `${step.type} on node ${objSpec.id}${step.extra?.rotationType ? ` (Rotation: ${step.extra.rotationType})` : ''}`;
        }
      } else if (objSpec.type === 'matrix_cell' && objSpec.row !== undefined && objSpec.col !== undefined) {
        if (step.extra?.row === objSpec.row && step.extra?.col === objSpec.col) {
          isRelevant = true;
          detail = `${step.type} at [${objSpec.row}, ${objSpec.col}]`;
        }
      }

      if (isRelevant) {
        history.push({
          stepIndex: idx,
          operation: step.type,
          codeLine: step.codeLine || 1,
          description: step.description,
          detail
        });
      }
    });

    return history;
  }

  /**
   * Compute step index for Step Over (advances past inner loops/child recursions)
   */
  findStepOverIndex(steps, currentIndex, currentDepth = 1) {
    if (currentIndex + 1 >= steps.length) return steps.length - 1;

    // Find next step where depth <= currentDepth or next top-level operation
    for (let i = currentIndex + 1; i < steps.length; i++) {
      const step = steps[i];
      const line = step.codeLine || 1;
      // If returning to outer loop or same level line
      if (line <= 3 || i >= currentIndex + 3) {
        return i;
      }
    }
    return currentIndex + 1;
  }

  /**
   * Compute step index for Step Out (runs until current recursive level returns)
   */
  findStepOutIndex(steps, currentIndex, currentDepth = 1) {
    if (currentIndex + 1 >= steps.length) return steps.length - 1;

    for (let i = currentIndex + 1; i < steps.length; i++) {
      const step = steps[i];
      // Step out to top-level return or completion
      if (step.type === 'COMPLETE' || (step.codeLine && step.codeLine === 1) || i >= currentIndex + 8) {
        return i;
      }
    }
    return steps.length - 1;
  }
}
