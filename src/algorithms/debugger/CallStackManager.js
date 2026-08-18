/**
 * Call Stack Reconstruction Manager for ALGO3D Debugger
 * Computes logical call stacks with function frames, parameters, depth, and local scope.
 */

export class CallStackManager {
  /**
   * Reconstruct logical call stack for a given algorithm and step
   */
  static buildCallStack(algorithmId, step, stepIndex, currentState) {
    if (!step) {
      return [
        {
          id: 'frame-0',
          name: `${algorithmId || 'algorithm'}(initialState)`,
          depth: 0,
          line: 1,
          scope: { state: currentState },
          isCurrent: true
        }
      ];
    }

    const vars = step.variables || {};
    const codeLine = step.codeLine || 1;
    const frames = [];

    // Base root frame
    frames.push({
      id: 'frame-root',
      name: `${algorithmId || 'main'}()`,
      depth: 0,
      line: 1,
      scope: { ...vars },
      isCurrent: false
    });

    // 1. Recursive Algorithms Call Stack Reconstruction
    if (algorithmId === 'quick-sort') {
      const low = vars.low !== undefined ? vars.low : (step.extra?.low ?? 0);
      const high = vars.high !== undefined ? vars.high : (step.extra?.high ?? (Array.isArray(currentState) ? currentState.length - 1 : 0));
      const pivot = vars.pivot !== undefined ? vars.pivot : step.extra?.pivot;
      
      frames.push({
        id: 'frame-qs',
        name: `quickSort(low=${low}, high=${high})`,
        depth: 1,
        line: codeLine <= 3 ? codeLine : 3,
        scope: { low, high, pivot },
        isCurrent: codeLine <= 3
      });

      if (codeLine >= 4 || step.type === 'COMPARE' || step.type === 'SWAP') {
        frames.push({
          id: 'frame-partition',
          name: `partition(low=${low}, high=${high})`,
          depth: 2,
          line: codeLine,
          scope: { low, high, pivot, i: vars.i, j: vars.j },
          isCurrent: true
        });
      }
    } else if (algorithmId === 'merge-sort') {
      const l = vars.left !== undefined ? vars.left : 0;
      const r = vars.right !== undefined ? vars.right : (Array.isArray(currentState) ? currentState.length - 1 : 0);
      const mid = Math.floor((l + r) / 2);

      frames.push({
        id: 'frame-ms',
        name: `mergeSort(l=${l}, r=${r})`,
        depth: 1,
        line: codeLine <= 4 ? codeLine : 4,
        scope: { left: l, right: r, mid },
        isCurrent: codeLine <= 4
      });

      if (codeLine >= 5 || step.type === 'OVERWRITE' || step.type === 'COMPARE') {
        frames.push({
          id: 'frame-merge',
          name: `merge(l=${l}, m=${mid}, r=${r})`,
          depth: 2,
          line: codeLine,
          scope: { left: l, mid, right: r, k: vars.k, i: vars.i, j: vars.j },
          isCurrent: true
        });
      }
    } else if (algorithmId === 'dfs') {
      const u = vars.u || (step.nodes && step.nodes[0]) || 'A';
      frames.push({
        id: 'frame-dfs',
        name: `dfs(vertex='${u}')`,
        depth: 1,
        line: codeLine,
        scope: { currentVertex: u, visited: vars.visited, path: vars.path },
        isCurrent: true
      });
    } else if (algorithmId === 'n-queens') {
      const row = vars.row !== undefined ? vars.row : (step.extra?.row ?? 0);
      const col = vars.col !== undefined ? vars.col : (step.extra?.col ?? 0);

      frames.push({
        id: 'frame-solve',
        name: `solveNQueens(row=${row})`,
        depth: 1,
        line: codeLine <= 3 ? codeLine : 3,
        scope: { row, totalQueens: 8 },
        isCurrent: codeLine <= 3
      });

      if (codeLine >= 4) {
        frames.push({
          id: 'frame-isSafe',
          name: `isSafe(row=${row}, col=${col})`,
          depth: 2,
          line: codeLine,
          scope: { row, col, isConflict: vars.isConflict },
          isCurrent: true
        });
      }
    } else if (algorithmId === 'avl-tree' || algorithmId === 'bst') {
      const val = vars.val || (step.nodes && step.nodes[0]) || 'node';
      frames.push({
        id: 'frame-tree-insert',
        name: `insert(root, val=${val})`,
        depth: 1,
        line: codeLine,
        scope: { ...vars },
        isCurrent: !step.extra?.rotationType
      });

      if (step.extra?.rotationType) {
        frames.push({
          id: 'frame-rotate',
          name: `rotate${step.extra.rotationType}(node=${val})`,
          depth: 2,
          line: codeLine,
          scope: { rotation: step.extra.rotationType, balanceFactor: vars.balanceFactor },
          isCurrent: true
        });
      }
    } else {
      // 2. Iterative Algorithms Generic Stack
      if (vars.i !== undefined || vars.pass !== undefined) {
        const pass = vars.pass !== undefined ? vars.pass : vars.i;
        frames.push({
          id: 'frame-outer-loop',
          name: `outerLoop(i=${pass})`,
          depth: 1,
          line: codeLine <= 2 ? codeLine : 2,
          scope: { i: pass, ...vars },
          isCurrent: vars.j === undefined
        });

        if (vars.j !== undefined) {
          frames.push({
            id: 'frame-inner-loop',
            name: `innerLoop(j=${vars.j})`,
            depth: 2,
            line: codeLine,
            scope: { ...vars },
            isCurrent: true
          });
        }
      } else if (vars.u !== undefined || vars.current !== undefined) {
        const u = vars.u || vars.current;
        frames.push({
          id: 'frame-vertex',
          name: `processVertex('${u}')`,
          depth: 1,
          line: codeLine,
          scope: { currentVertex: u, ...vars },
          isCurrent: true
        });
      } else {
        frames[0].isCurrent = true;
      }
    }

    return frames;
  }
}
