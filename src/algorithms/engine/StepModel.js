/**
 * Comprehensive Standardized Operation Registry
 */
export const OP_TYPES = {
  // Comparison & Access
  COMPARE: 'COMPARE',
  READ: 'READ',
  SELECT: 'SELECT',
  PIVOT_SELECT: 'PIVOT_SELECT',
  VISIT: 'VISIT',
  DISCOVER: 'DISCOVER',
  PROCESS: 'PROCESS',

  // Mutation & Modification
  SWAP: 'SWAP',
  WRITE: 'WRITE',
  ASSIGN: 'ASSIGN',
  OVERWRITE: 'OVERWRITE',
  UPDATE: 'UPDATE',
  INSERT: 'INSERT',
  DELETE: 'DELETE',
  MOVE: 'MOVE',
  SET_POINTER: 'SET_POINTER',

  // Structural & Tree/Graph specific
  ROTATE: 'ROTATE',
  RECOLOR: 'RECOLOR',
  SPLIT: 'SPLIT',
  COMBINE: 'COMBINE',
  MERGE: 'MERGE',
  PARTITION: 'PARTITION',
  HEAPIFY: 'HEAPIFY',
  EXTRACT: 'EXTRACT',
  BUILD: 'BUILD',

  // Linear Structure operations
  PUSH: 'PUSH',
  POP: 'POP',
  PEEK: 'PEEK',
  ENQUEUE: 'ENQUEUE',
  DEQUEUE: 'DEQUEUE',
  ENQUEUE_NODE: 'ENQUEUE_NODE',
  DEQUEUE_NODE: 'DEQUEUE_NODE',

  // Graph Pathfinding & Spanning
  RELAX: 'RELAX',
  DISTANCE_UPDATE: 'DISTANCE_UPDATE',
  EDGE_ACCEPT: 'EDGE_ACCEPT',
  EDGE_REJECT: 'EDGE_REJECT',
  UNION: 'UNION',
  FIND: 'FIND',
  COMPRESS: 'COMPRESS',
  COMPONENT_FOUND: 'COMPONENT_FOUND',

  // Backtracking & Recursion
  RECURSE: 'RECURSE',
  RETURN: 'RETURN',
  PLACE: 'PLACE',
  REMOVE: 'REMOVE',
  BACKTRACK: 'BACKTRACK',

  // State & Outcome
  MARK: 'MARK',
  UNMARK: 'UNMARK',
  FOUND: 'FOUND',
  PATH_FOUND: 'PATH_FOUND',
  SORTED: 'SORTED',
  HIGHLIGHT: 'HIGHLIGHT',
  UNHIGHLIGHT: 'UNHIGHLIGHT',
  COMPLETE: 'COMPLETE',
  MESSAGE: 'MESSAGE',
  REJECT: 'REJECT'
};

/**
 * Visual Role / Categorization of steps
 */
export const STEP_CATEGORIES = {
  COMPARISON: 'comparison',
  MUTATION: 'mutation',
  ACCESS: 'access',
  STRUCTURAL: 'structural',
  RECURSION: 'recursion',
  GRAPH: 'graph',
  INFO: 'info',
  TERMINAL: 'terminal'
};

/**
 * Determine step category from operation type
 */
export function getStepCategory(type) {
  switch (type) {
    case OP_TYPES.COMPARE:
    case OP_TYPES.PIVOT_SELECT:
    case OP_TYPES.SELECT:
      return STEP_CATEGORIES.COMPARISON;

    case OP_TYPES.SWAP:
    case OP_TYPES.WRITE:
    case OP_TYPES.ASSIGN:
    case OP_TYPES.OVERWRITE:
    case OP_TYPES.UPDATE:
    case OP_TYPES.INSERT:
    case OP_TYPES.DELETE:
    case OP_TYPES.PUSH:
    case OP_TYPES.POP:
    case OP_TYPES.ENQUEUE:
    case OP_TYPES.DEQUEUE:
    case OP_TYPES.SET_POINTER:
    case OP_TYPES.ROTATE:
    case OP_TYPES.RECOLOR:
      return STEP_CATEGORIES.MUTATION;

    case OP_TYPES.VISIT:
    case OP_TYPES.READ:
    case OP_TYPES.DISCOVER:
    case OP_TYPES.PROCESS:
    case OP_TYPES.MOVE:
      return STEP_CATEGORIES.ACCESS;

    case OP_TYPES.RELAX:
    case OP_TYPES.DISTANCE_UPDATE:
    case OP_TYPES.EDGE_ACCEPT:
    case OP_TYPES.EDGE_REJECT:
    case OP_TYPES.UNION:
    case OP_TYPES.FIND:
    case OP_TYPES.COMPRESS:
    case OP_TYPES.COMPONENT_FOUND:
      return STEP_CATEGORIES.GRAPH;

    case OP_TYPES.RECURSE:
    case OP_TYPES.RETURN:
    case OP_TYPES.PLACE:
    case OP_TYPES.REMOVE:
    case OP_TYPES.BACKTRACK:
      return STEP_CATEGORIES.RECURSION;

    case OP_TYPES.PATH_FOUND:
    case OP_TYPES.FOUND:
    case OP_TYPES.SORTED:
    case OP_TYPES.COMPLETE:
      return STEP_CATEGORIES.TERMINAL;

    default:
      return STEP_CATEGORIES.INFO;
  }
}

/**
 * Deep clone an object or array safely
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    return obj.map(deepClone);
  }
  const cloned = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}

let stepIdCounter = 0;

/**
 * Canonical Step Factory
 */
export function createStep({
  id = null,
  type = OP_TYPES.MESSAGE,
  targets = {},
  payload = {},
  stateSnapshot = null,
  description = '',
  explanation = '',
  variables = {},
  codeLine = 1,
  codeLines = null,
  metrics = null,
  animation = null,
  extra = {},
  // Backward compatibility shorthand arguments
  indices = null,
  nodes = null,
  edges = null,
  values = null
}) {
  const stepId = id !== null ? id : ++stepIdCounter;

  // Normalize targets
  const normalizedTargets = {
    indices: Array.isArray(indices) ? [...indices] : Array.isArray(targets.indices) ? [...targets.indices] : [],
    nodes: Array.isArray(nodes) ? [...nodes] : Array.isArray(targets.nodes) ? [...targets.nodes] : [],
    edges: Array.isArray(edges) ? [...edges] : Array.isArray(targets.edges) ? [...targets.edges] : []
  };

  // Normalize payload
  const normalizedPayload = {
    values: Array.isArray(values) ? [...values] : Array.isArray(payload.values) ? [...payload.values] : [],
    ...payload
  };

  // Normalize code line / range
  const normalizedCodeLines = Array.isArray(codeLines)
    ? [...codeLines]
    : codeLine
    ? [codeLine]
    : [1];

  const category = getStepCategory(type);

  // Normalized animation configuration
  const normalizedAnimation = {
    duration: animation?.duration || 400,
    easing: animation?.easing || 'power2.out',
    ...animation
  };

  const step = {
    id: stepId,
    type,
    targets: normalizedTargets,
    payload: normalizedPayload,
    stateSnapshot: stateSnapshot !== null ? deepClone(stateSnapshot) : null,
    metadata: {
      description: description || '',
      explanation: explanation || description || '',
      codeLine: normalizedCodeLines[0],
      codeLines: normalizedCodeLines,
      category,
      timestamp: Date.now()
    },
    variables: deepClone(variables || {}),
    metrics: metrics ? { ...metrics } : null,
    animation: normalizedAnimation,
    extra: deepClone(extra),

    // Backward-compatibility getters
    get indices() { return this.targets.indices; },
    get nodes() { return this.targets.nodes; },
    get edges() { return this.targets.edges; },
    get values() { return this.payload.values; },
    get description() { return this.metadata.description; },
    get explanation() { return this.metadata.explanation; },
    get codeLine() { return this.metadata.codeLine; }
  };

  return step;
}

/**
 * Normalizes legacy step objects to the canonical structure
 */
export function normalizeStep(rawStep, fallbackIndex = 0) {
  if (!rawStep) {
    return createStep({
      id: fallbackIndex,
      type: OP_TYPES.MESSAGE,
      description: 'Idle step'
    });
  }

  if (rawStep.targets && rawStep.metadata && rawStep.id !== undefined) {
    return rawStep;
  }

  return createStep({
    id: rawStep.id !== undefined ? rawStep.id : fallbackIndex,
    type: rawStep.type || OP_TYPES.MESSAGE,
    indices: rawStep.indices,
    nodes: rawStep.nodes,
    edges: rawStep.edges,
    values: rawStep.values,
    stateSnapshot: rawStep.stateSnapshot,
    description: rawStep.description || '',
    explanation: rawStep.explanation || rawStep.description || '',
    variables: rawStep.variables || {},
    codeLine: rawStep.codeLine || 1,
    codeLines: rawStep.codeLines,
    extra: rawStep.extra || {}
  });
}

/**
 * Validate that an array of steps constitutes a well-formed timeline
 */
export function assertTimelineValid(timeline) {
  if (!Array.isArray(timeline)) {
    throw new Error('Timeline must be an array of steps');
  }
  for (let i = 0; i < timeline.length; i++) {
    const s = timeline[i];
    if (!s || typeof s !== 'object') {
      throw new Error(`Step at index ${i} is invalid`);
    }
  }
  return true;
}

