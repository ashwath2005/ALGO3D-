/**
 * Safe Condition Evaluator for ALGO3D Breakpoints & Watch Expressions
 * Absolute zero use of eval() or new Function().
 * Evaluates tokens safely against a context of variables and state.
 */

export class SafeEvaluator {
  /**
   * Safely evaluate a simple expression against a context object
   * @param {string} expr - e.g. "val > 50", "i === 3", "distance < 10", "arr.length === 8", "operation === 'SWAP'"
   * @param {Object} context - e.g. { val: 42, i: 3, distance: 7, arr: [1,2,3], operation: 'COMPARE', step: 14 }
   * @returns {{ success: boolean, result: any, error?: string }}
   */
  static evaluate(expr, context = {}) {
    if (!expr || typeof expr !== 'string') {
      return { success: false, result: null, error: 'Empty expression' };
    }

    const trimmed = expr.trim();
    if (!trimmed) {
      return { success: false, result: null, error: 'Empty expression' };
    }

    try {
      // 1. Check for comparison operators: ===, !==, ==, !=, >=, <=, >, <
      const operators = ['===', '!==', '==', '!=', '>=', '<=', '>', '<'];
      let operator = null;
      let leftStr = '';
      let rightStr = '';

      for (const op of operators) {
        const idx = trimmed.indexOf(op);
        if (idx !== -1) {
          operator = op;
          leftStr = trimmed.slice(0, idx).trim();
          rightStr = trimmed.slice(idx + op.length).trim();
          break;
        }
      }

      if (operator) {
        const leftVal = SafeEvaluator.resolveValue(leftStr, context);
        const rightVal = SafeEvaluator.resolveValue(rightStr, context);

        let res = false;
        switch (operator) {
          case '===':
          case '==':
            res = leftVal === rightVal;
            break;
          case '!==':
          case '!=':
            res = leftVal !== rightVal;
            break;
          case '>':
            res = Number(leftVal) > Number(rightVal);
            break;
          case '<':
            res = Number(leftVal) < Number(rightVal);
            break;
          case '>=':
            res = Number(leftVal) >= Number(rightVal);
            break;
          case '<=':
            res = Number(leftVal) <= Number(rightVal);
            break;
          default:
            res = false;
        }
        return { success: true, result: res };
      }

      // 2. Direct property or variable evaluation
      const directVal = SafeEvaluator.resolveValue(trimmed, context);
      return { success: true, result: directVal };
    } catch (err) {
      return { success: false, result: null, error: err.message };
    }
  }

  /**
   * Resolve a token (literal number, boolean, string, or property path) from context
   */
  static resolveValue(token, context = {}) {
    if (!token) return undefined;
    const t = token.trim();

    // Check literal numbers
    if (!isNaN(t) && t !== '') {
      return Number(t);
    }

    // Check boolean literals
    if (t === 'true') return true;
    if (t === 'false') return false;
    if (t === 'null') return null;
    if (t === 'undefined') return undefined;

    // Check string literals (enclosed in single or double quotes)
    if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
      return t.slice(1, -1);
    }

    // Check nested property paths like "arr.length", "variables.i", "distance[C]", "stats.swaps"
    // Convert bracket notation "arr[0]" -> "arr.0" or "distance[C]" -> "distance.C"
    const normalized = t.replace(/\[([^\]]+)\]/g, '.$1');
    const parts = normalized.split('.');

    let current = context;
    for (const part of parts) {
      if (current === null || current === undefined) {
        return undefined;
      }
      const cleanPart = part.replace(/['"]/g, '');
      current = current[cleanPart];
    }

    return current;
  }
}
