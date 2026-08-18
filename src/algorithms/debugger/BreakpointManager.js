import { SafeEvaluator } from './SafeEvaluator.js';

/**
 * Breakpoint Manager for ALGO3D Debugger
 * Manages line breakpoints, operation breakpoints, conditional breakpoints, and invariant checks.
 */
export class BreakpointManager {
  constructor() {
    this.breakpoints = []; // Array of { id, type: 'line' | 'op' | 'invariant', line?, opType?, condition?, enabled, hitCount }
    this.breakOnInvariant = false;
  }

  /**
   * Add or toggle a line breakpoint
   */
  toggleLineBreakpoint(line, condition = '') {
    const existing = this.breakpoints.find((bp) => bp.type === 'line' && bp.line === line);
    if (existing) {
      this.breakpoints = this.breakpoints.filter((bp) => bp.id !== existing.id);
      return { action: 'removed', breakpoint: existing };
    } else {
      const newBp = {
        id: `line-${line}-${Date.now()}`,
        type: 'line',
        line,
        condition: condition.trim(),
        enabled: true,
        hitCount: 0
      };
      this.breakpoints.push(newBp);
      return { action: 'added', breakpoint: newBp };
    }
  }

  /**
   * Add or toggle an operation breakpoint
   */
  toggleOpBreakpoint(opType, condition = '') {
    const existing = this.breakpoints.find((bp) => bp.type === 'op' && bp.opType === opType);
    if (existing) {
      this.breakpoints = this.breakpoints.filter((bp) => bp.id !== existing.id);
      return { action: 'removed', breakpoint: existing };
    } else {
      const newBp = {
        id: `op-${opType}-${Date.now()}`,
        type: 'op',
        opType,
        condition: condition.trim(),
        enabled: true,
        hitCount: 0
      };
      this.breakpoints.push(newBp);
      return { action: 'added', breakpoint: newBp };
    }
  }

  /**
   * Set breakpoint enabled state
   */
  setEnabled(id, enabled) {
    const bp = this.breakpoints.find((b) => b.id === id);
    if (bp) bp.enabled = enabled;
  }

  /**
   * Set condition for a breakpoint
   */
  setCondition(id, condition) {
    const bp = this.breakpoints.find((b) => b.id === id);
    if (bp) bp.condition = (condition || '').trim();
  }

  /**
   * Remove a breakpoint by ID
   */
  removeBreakpoint(id) {
    this.breakpoints = this.breakpoints.filter((b) => b.id !== id);
  }

  /**
   * Clear all breakpoints
   */
  clearAll() {
    this.breakpoints = [];
  }

  /**
   * Check if a step triggers any active breakpoint
   */
  evaluateStep(step, stepIndex, state, invariantState = null) {
    if (!step) return { hit: false };

    // 1. Check Break on Invariant Violation
    if (this.breakOnInvariant && invariantState && invariantState.status === 'VIOLATION') {
      return {
        hit: true,
        reason: `Invariant Violation: ${invariantState.rule}`,
        breakpoint: { type: 'invariant', rule: invariantState.rule }
      };
    }

    // Build evaluation context
    const context = {
      step: stepIndex,
      operation: step.type,
      codeLine: step.codeLine || 1,
      indices: step.indices || [],
      values: step.values || [],
      arr: Array.isArray(state) ? state : [],
      state,
      ...(step.variables || {})
    };

    for (const bp of this.breakpoints) {
      if (!bp.enabled) continue;

      let matches = false;

      // Line breakpoint match
      if (bp.type === 'line' && (step.codeLine === bp.line || (step.metadata?.codeLines && step.metadata.codeLines.includes(bp.line)))) {
        matches = true;
      }

      // Operation breakpoint match
      if (bp.type === 'op' && step.type === bp.opType) {
        matches = true;
      }

      if (matches) {
        // If condition exists, evaluate it safely
        if (bp.condition) {
          const evalRes = SafeEvaluator.evaluate(bp.condition, context);
          if (evalRes.success && Boolean(evalRes.result)) {
            bp.hitCount += 1;
            return {
              hit: true,
              reason: `Breakpoint hit at line ${step.codeLine} (${bp.condition})`,
              breakpoint: bp
            };
          }
        } else {
          bp.hitCount += 1;
          return {
            hit: true,
            reason: bp.type === 'line' ? `Breakpoint hit at line ${bp.line}` : `Operation breakpoint hit: ${bp.opType}`,
            breakpoint: bp
          };
        }
      }
    }

    return { hit: false };
  }
}
