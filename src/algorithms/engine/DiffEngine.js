/**
 * Authoritative State Diff Engine for ALGO3D
 * Calculates structural and value differences between consecutive execution states.
 */

export function calculateStateDiff(prevState, currState, step) {
  if (!currState) return null;
  if (!prevState) {
    return {
      type: 'INITIAL_STATE',
      summary: 'Initial un-executed state loaded.',
      changes: []
    };
  }

  // 1. Array State Diff
  if (Array.isArray(prevState) && Array.isArray(currState)) {
    // 1D Array
    if (!Array.isArray(prevState[0]) && !Array.isArray(currState[0])) {
      const changes = [];
      const maxLen = Math.max(prevState.length, currState.length);

      for (let i = 0; i < maxLen; i++) {
        const prevVal = prevState[i];
        const currVal = currState[i];

        if (prevVal !== currVal) {
          changes.push({
            entity: `Index [${i}]`,
            index: i,
            prev: prevVal,
            next: currVal,
            description: prevVal === undefined
              ? `Inserted ${currVal}`
              : currVal === undefined
              ? `Removed ${prevVal}`
              : `Changed from ${prevVal} to ${currVal}`
          });
        }
      }

      if (changes.length === 0) {
        // Look at step indices if read/compare
        const indices = step?.targets?.indices || [];
        if (indices.length > 0) {
          return {
            type: step?.type || 'INSPECT',
            summary: `Active elements at indices [${indices.join(', ')}]`,
            changes: indices.map((idx) => ({
              entity: `Index [${idx}]`,
              index: idx,
              prev: currState[idx],
              next: currState[idx],
              description: `Value ${currState[idx]} inspected/active`
            }))
          };
        }
        return {
          type: step?.type || 'NO_CHANGE',
          summary: 'Internal state maintained.',
          changes: []
        };
      }

      return {
        type: step?.type || 'MUTATION',
        summary: changes.length === 2 && changes[0].prev === changes[1].next && changes[0].next === changes[1].prev
          ? `Swapped values at [${changes[0].index}] (${changes[0].next}) and [${changes[1].index}] (${changes[1].next})`
          : `${changes.length} element(s) updated`,
        changes
      };
    }

    // 2D Matrix Diff
    if (Array.isArray(prevState[0]) && Array.isArray(currState[0])) {
      const changes = [];
      for (let r = 0; r < currState.length; r++) {
        for (let c = 0; c < (currState[r]?.length || 0); c++) {
          const p = prevState[r]?.[c];
          const n = currState[r]?.[c];
          if (p !== n) {
            changes.push({
              entity: `Cell [${r},${c}]`,
              index: [r, c],
              prev: p,
              next: n,
              description: `Cell [${r},${c}] changed from ${p} to ${n}`
            });
          }
        }
      }

      return {
        type: step?.type || 'MATRIX_UPDATE',
        summary: changes.length > 0 ? `${changes.length} cell(s) modified in 2D grid` : 'Grid examined',
        changes
      };
    }
  }

  // 2. Graph State Diff (node/edge distance changes)
  if (typeof currState === 'object' && currState.nodes) {
    const changes = [];
    const distances = step?.variables?.distances || step?.variables?.dist;
    const prevDistances = step?.variables?.prevDistances;

    if (distances && prevDistances) {
      for (const nodeKey of Object.keys(distances)) {
        if (distances[nodeKey] !== prevDistances[nodeKey]) {
          changes.push({
            entity: `Vertex ${nodeKey}`,
            prev: prevDistances[nodeKey] === Infinity ? '∞' : prevDistances[nodeKey],
            next: distances[nodeKey] === Infinity ? '∞' : distances[nodeKey],
            description: `Distance relaxed from ${prevDistances[nodeKey] === Infinity ? '∞' : prevDistances[nodeKey]} to ${distances[nodeKey]}`
          });
        }
      }
    }

    return {
      type: step?.type || 'GRAPH_OP',
      summary: changes.length > 0 ? `Updated distances for ${changes.length} vertex/vertices` : `Graph traversal step on ${step?.nodes?.[0] || 'node'}`,
      changes
    };
  }

  return {
    type: step?.type || 'OP',
    summary: step?.metadata?.description || 'Operation executed',
    changes: []
  };
}
