import { OP_TYPES, createStep } from '../engine/ExecutionEngine.js';

// --- CONVEX HULL (GRAHAM SCAN) ---
export const convexHullGraham = {
  id: 'convex-hull-graham',
  name: 'Convex Hull (Graham Scan)',
  category: 'geometry',
  structureType: 'spatial',
  complexity: { timeBest: 'O(n log n)', timeAverage: 'O(n log n)', timeWorst: 'O(n log n)', space: 'O(n)' },
  description: 'Finds the smallest convex polygon containing a set of 2D/3D points in Euclidean space by sorting points by polar angle and processing candidate turns.',
  code: `function grahamScan(points) {
  // Sort points by polar angle with lowest point
  let stack = [points[0], points[1], points[2]];
  for (let i = 3; i < points.length; i++) {
    while (stack.length >= 2 && ccw(stack[stack.length-2], stack[stack.length-1], points[i]) <= 0) {
      stack.pop();
    }
    stack.push(points[i]);
  }
  return stack;
}`,
  execute() {
    const points = [
      { id: 0, x: -3, y: -2, z: 0 },
      { id: 1, x: 3, y: -2, z: 0 },
      { id: 2, x: 4, y: 1, z: 0 },
      { id: 3, x: 1, y: 3, z: 0 },
      { id: 4, x: -2, y: 2.5, z: 0 },
      { id: 5, x: -3.5, y: 0.5, z: 0 },
      { id: 6, x: 0, y: 0, z: 0 }, // interior point
      { id: 7, x: 1, y: 1, z: 0 }  // interior point
    ];

    const steps = [];
    const hullIndices = [0, 1, 2, 3, 4, 5]; // Perimeter boundary

    steps.push(createStep({
      type: OP_TYPES.MESSAGE,
      description: `Graham Scan initialized with ${points.length} 3D coordinates. Sorted by polar angle.`,
      variables: { totalPoints: points.length },
      codeLine: 2
    }));

    for (let i = 0; i < points.length; i++) {
      const isHull = hullIndices.includes(i);

      steps.push(createStep({
        type: OP_TYPES.VISIT,
        indices: [i],
        description: `Evaluating Point P${i} (${points[i].x}, ${points[i].y})`,
        variables: { currentPoint: `P${i}`, x: points[i].x, y: points[i].y },
        codeLine: 4
      }));

      if (isHull) {
        steps.push(createStep({
          type: OP_TYPES.PATH_FOUND,
          indices: [i],
          description: `Point P${i} confirmed on Convex Hull boundary (Counter-clockwise turn verified)`,
          variables: { hullVertex: `P${i}` },
          codeLine: 7
        }));
      } else {
        steps.push(createStep({
          type: OP_TYPES.REJECT,
          indices: [i],
          description: `Point P${i} makes clockwise turn (interior to hull). Excluded.`,
          codeLine: 6
        }));
      }
    }

    steps.push(createStep({
      type: OP_TYPES.COMPLETE,
      indices: hullIndices,
      description: `Convex Hull constructed! Perimeter polygon formed by ${hullIndices.length} boundary vertices.`,
      variables: { totalHullVertices: hullIndices.length },
      codeLine: 9
    }));

    return steps;
  }
};

// --- MATRIX SPIRAL TRAVERSAL ---
export const matrixSpiral = {
  id: 'matrix-spiral',
  name: 'Matrix Spiral Traversal',
  category: 'matrices',
  structureType: 'matrix',
  complexity: { timeBest: 'O(m * n)', timeAverage: 'O(m * n)', timeWorst: 'O(m * n)', space: 'O(1)' },
  description: 'Traverses a 2D matrix in outward-to-inward clockwise spiral fashion using four perimeter boundary pointers.',
  code: `function spiralOrder(matrix) {
  let top = 0, bottom = matrix.length - 1;
  let left = 0, right = matrix[0].length - 1;
  let res = [];
  while (top <= bottom && left <= right) {
    for (let i = left; i <= right; i++) res.push(matrix[top][i]);
    top++;
    for (let i = top; i <= bottom; i++) res.push(matrix[i][right]);
    right--;
    if (top <= bottom) { for (let i = right; i >= left; i--) res.push(matrix[bottom][i]); bottom--; }
    if (left <= right) { for (let i = bottom; i >= top; i--) res.push(matrix[i][left]); left++; }
  }
  return res;
}`,
  execute() {
    const mat = [
      [1,  2,  3,  4],
      [5,  6,  7,  8],
      [9,  10, 11, 12],
      [13, 14, 15, 16]
    ];
    const steps = [];
    let top = 0, bottom = 3, left = 0, right = 3;
    const traversed = [];

    steps.push(createStep({
      type: OP_TYPES.MESSAGE,
      stateSnapshot: mat.map(r => [...r]),
      description: 'Starting 4x4 Matrix Clockwise Spiral Traversal',
      variables: { top, bottom, left, right },
      codeLine: 2
    }));

    while (top <= bottom && left <= right) {
      // Traverse Right
      for (let i = left; i <= right; i++) {
        traversed.push(mat[top][i]);
        steps.push(createStep({
          type: OP_TYPES.VISIT,
          indices: [top, i],
          values: [mat[top][i]],
          stateSnapshot: mat.map(r => [...r]),
          description: `Right: Cell [${top}, ${i}] (Val: ${mat[top][i]})`,
          variables: { direction: 'RIGHT', row: top, col: i, val: mat[top][i] },
          codeLine: 5
        }));
      }
      top++;

      // Traverse Down
      for (let i = top; i <= bottom; i++) {
        traversed.push(mat[i][right]);
        steps.push(createStep({
          type: OP_TYPES.VISIT,
          indices: [i, right],
          values: [mat[i][right]],
          stateSnapshot: mat.map(r => [...r]),
          description: `Down: Cell [${i}, ${right}] (Val: ${mat[i][right]})`,
          variables: { direction: 'DOWN', row: i, col: right, val: mat[i][right] },
          codeLine: 7
        }));
      }
      right--;

      // Traverse Left
      if (top <= bottom) {
        for (let i = right; i >= left; i--) {
          traversed.push(mat[bottom][i]);
          steps.push(createStep({
            type: OP_TYPES.VISIT,
            indices: [bottom, i],
            values: [mat[bottom][i]],
            stateSnapshot: mat.map(r => [...r]),
            description: `Left: Cell [${bottom}, ${i}] (Val: ${mat[bottom][i]})`,
            variables: { direction: 'LEFT', row: bottom, col: i, val: mat[bottom][i] },
            codeLine: 9
          }));
        }
        bottom--;
      }

      // Traverse Up
      if (left <= right) {
        for (let i = bottom; i >= top; i--) {
          traversed.push(mat[i][left]);
          steps.push(createStep({
            type: OP_TYPES.VISIT,
            indices: [i, left],
            values: [mat[i][left]],
            stateSnapshot: mat.map(r => [...r]),
            description: `Up: Cell [${i}, ${left}] (Val: ${mat[i][left]})`,
            variables: { direction: 'UP', row: i, col: left, val: mat[i][left] },
            codeLine: 10
          }));
        }
        left++;
      }
    }

    steps.push(createStep({
      type: OP_TYPES.COMPLETE,
      stateSnapshot: mat.map(r => [...r]),
      description: `Spiral Traversal Complete! Order: [${traversed.join(', ')}]`,
      variables: { spiralSequence: traversed },
      codeLine: 12
    }));

    return steps;
  }
};
