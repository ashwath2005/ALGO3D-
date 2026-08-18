import { OP_TYPES, createStep } from '../engine/ExecutionEngine.js';

// --- N-QUEENS PROBLEM (BACKTRACKING) ---
export const nQueens = {
  id: 'n-queens',
  name: 'N-Queens (Backtracking)',
  category: 'backtracking',
  structureType: 'matrix',
  complexity: { timeBest: 'O(N!)', timeAverage: 'O(N!)', timeWorst: 'O(N!)', space: 'O(N²)' },
  description: 'Places N non-attacking chess queens on an N×N chessboard using recursive backtracking, checking row, column, and diagonal conflicts.',
  code: `function solveNQueens(n = 4) {
  let board = Array.from({length: n}, () => Array(n).fill(0));
  function isSafe(row, col) {
    for (let i = 0; i < row; i++) if (board[i][col]) return false;
    for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) if (board[i][j]) return false;
    for (let i = row, j = col; i >= 0 && j < n; i--, j++) if (board[i][j]) return false;
    return true;
  }
  function place(row) {
    if (row === n) return true;
    for (let col = 0; col < n; col++) {
      if (isSafe(row, col)) {
        board[row][col] = 1;
        if (place(row + 1)) return true;
        board[row][col] = 0; // Backtrack
      }
    }
    return false;
  }
  place(0);
}`,
  execute(initialData, options = {}) {
    const n = 4;
    const board = Array.from({ length: n }, () => Array(n).fill(0));
    const steps = [];

    function isSafe(row, col) {
      for (let i = 0; i < row; i++) if (board[i][col] === 1) return false;
      for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) if (board[i][j] === 1) return false;
      for (let i = row, j = col; i >= 0 && j < n; i--, j++) if (board[i][j] === 1) return false;
      return true;
    }

    steps.push(createStep({
      type: OP_TYPES.MESSAGE,
      stateSnapshot: board.map(r => [...r]),
      description: `Starting 4-Queens Backtracking search on ${n}x${n} board`,
      variables: { boardSize: n },
      codeLine: 2
    }));

    function placeQueen(row) {
      if (row === n) {
        steps.push(createStep({
          type: OP_TYPES.PATH_FOUND,
          stateSnapshot: board.map(r => [...r]),
          description: `All ${n} Queens placed safely on the board!`,
          variables: { status: 'SOLVED' },
          codeLine: 9
        }));
        return true;
      }

      for (let col = 0; col < n; col++) {
        steps.push(createStep({
          type: OP_TYPES.VISIT,
          indices: [row, col],
          stateSnapshot: board.map(r => [...r]),
          description: `Attempting Queen placement at Row ${row}, Column ${col}`,
          variables: { row, col, depth: row },
          codeLine: 11
        }));

        if (isSafe(row, col)) {
          board[row][col] = 1;
          steps.push(createStep({
            type: OP_TYPES.PLACE,
            indices: [row, col],
            values: [1],
            stateSnapshot: board.map(r => [...r]),
            description: `Position (Row ${row}, Col ${col}) is safe. Queen placed!`,
            variables: { row, col, placed: true },
            codeLine: 12
          }));

          if (placeQueen(row + 1)) return true;

          // Backtrack
          board[row][col] = 0;
          steps.push(createStep({
            type: OP_TYPES.BACKTRACK,
            indices: [row, col],
            values: [0],
            stateSnapshot: board.map(r => [...r]),
            description: `Backtracking: Removing Queen at (Row ${row}, Col ${col})`,
            variables: { row, col, backtracked: true },
            codeLine: 14
          }));
        } else {
          steps.push(createStep({
            type: OP_TYPES.REJECT,
            indices: [row, col],
            stateSnapshot: board.map(r => [...r]),
            description: `Conflict detected at (Row ${row}, Col ${col}). Cannot place.`,
            variables: { row, col, safe: false },
            codeLine: 11
          }));
        }
      }
      return false;
    }

    placeQueen(0);

    steps.push(createStep({
      type: OP_TYPES.COMPLETE,
      stateSnapshot: board.map(r => [...r]),
      description: 'N-Queens configuration complete!',
      codeLine: 17
    }));

    return steps;
  }
};

// --- ACTIVITY SELECTION (GREEDY) ---
export const activitySelection = {
  id: 'activity-selection',
  name: 'Activity Selection (Greedy)',
  category: 'greedy',
  structureType: 'array',
  complexity: { timeBest: 'O(n log n)', timeAverage: 'O(n log n)', timeWorst: 'O(n log n)', space: 'O(1)' },
  description: 'Greedy algorithm to select the maximum number of mutually non-overlapping activities sorted by their finish times.',
  code: `function selectActivities(start, finish) {
  // Sort activities by finish time
  let selected = [0];
  let lastFinish = finish[0];
  for (let i = 1; i < start.length; i++) {
    if (start[i] >= lastFinish) {
      selected.push(i);
      lastFinish = finish[i];
    }
  }
  return selected;
}`,
  execute(initialData) {
    const activities = [
      { id: 1, s: 1, f: 3, dur: 2 },
      { id: 2, s: 2, f: 5, dur: 3 },
      { id: 3, s: 4, f: 7, dur: 3 },
      { id: 4, s: 6, f: 8, dur: 2 },
      { id: 5, s: 8, f: 10, dur: 2 }
    ];

    const arr = activities.map(a => a.f);
    const steps = [];
    const selected = [0];
    let lastFinish = activities[0].f;

    steps.push(createStep({
      type: OP_TYPES.MESSAGE,
      indices: [0],
      stateSnapshot: [...arr],
      description: `First activity (Finish: ${activities[0].f}) greedily selected`,
      variables: { selectedActivity: activities[0].id, finishTime: lastFinish },
      codeLine: 3
    }));

    for (let i = 1; i < activities.length; i++) {
      const act = activities[i];

      steps.push(createStep({
        type: OP_TYPES.COMPARE,
        indices: [i],
        values: [act.s, lastFinish],
        stateSnapshot: [...arr],
        description: `Check Activity ${act.id} (Start: ${act.s}) >= Last Finish (${lastFinish})`,
        variables: { activityId: act.id, startTime: act.s, lastFinish },
        codeLine: 6
      }));

      if (act.s >= lastFinish) {
        selected.push(i);
        lastFinish = act.f;
        steps.push(createStep({
          type: OP_TYPES.PATH_FOUND,
          indices: [i],
          stateSnapshot: [...arr],
          description: `Activity ${act.id} scheduled! New finish milestone: ${lastFinish}`,
          variables: { scheduled: act.id, finishTime: lastFinish },
          codeLine: 7
        }));
      } else {
        steps.push(createStep({
          type: OP_TYPES.REJECT,
          indices: [i],
          stateSnapshot: [...arr],
          description: `Activity ${act.id} conflicts with current schedule. Skipped.`,
          codeLine: 9
        }));
      }
    }

    steps.push(createStep({
      type: OP_TYPES.COMPLETE,
      indices: selected,
      stateSnapshot: [...arr],
      description: `Greedy Selection finished! Scheduled ${selected.length} activities.`,
      variables: { totalActivitiesScheduled: selected.length },
      codeLine: 11
    }));

    return steps;
  }
};
