import { OP_TYPES } from './StepModel.js';

/**
 * Standardized Visual Entity States
 */
export const VISUAL_STATES = {
  IDLE: 'idle',
  ACTIVE: 'active',
  SELECTED: 'selected',
  COMPARING: 'comparing',
  SWAPPING: 'swapping',
  VISITED: 'visited',
  SORTED: 'sorted',
  INSERTING: 'inserting',
  DELETING: 'deleting',
  PATH: 'path',
  SOURCE: 'source',
  TARGET: 'target',
  ERROR: 'error'
};

/**
 * Color and Emissive mapping for visual states in Three.js
 */
export const VISUAL_THEME = {
  [VISUAL_STATES.IDLE]: {
    color: '#262626',
    emissive: '#000000',
    intensity: 0
  },
  [VISUAL_STATES.ACTIVE]: {
    color: '#38bdf8',
    emissive: '#38bdf8',
    intensity: 0.4
  },
  [VISUAL_STATES.SELECTED]: {
    color: '#a855f7',
    emissive: '#a855f7',
    intensity: 0.5
  },
  [VISUAL_STATES.COMPARING]: {
    color: '#f59e0b',
    emissive: '#f59e0b',
    intensity: 0.5
  },
  [VISUAL_STATES.SWAPPING]: {
    color: '#ec4899',
    emissive: '#ec4899',
    intensity: 0.6
  },
  [VISUAL_STATES.VISITED]: {
    color: '#38bdf8',
    emissive: '#38bdf8',
    intensity: 0.4
  },
  [VISUAL_STATES.SORTED]: {
    color: '#10b981',
    emissive: '#10b981',
    intensity: 0.55
  },
  [VISUAL_STATES.INSERTING]: {
    color: '#10b981',
    emissive: '#10b981',
    intensity: 0.5
  },
  [VISUAL_STATES.DELETING]: {
    color: '#f43f5e',
    emissive: '#f43f5e',
    intensity: 0.5
  },
  [VISUAL_STATES.PATH]: {
    color: '#10b981',
    emissive: '#10b981',
    intensity: 0.7
  },
  [VISUAL_STATES.SOURCE]: {
    color: '#10b981',
    emissive: '#10b981',
    intensity: 0.6
  },
  [VISUAL_STATES.TARGET]: {
    color: '#f43f5e',
    emissive: '#f43f5e',
    intensity: 0.6
  },
  [VISUAL_STATES.ERROR]: {
    color: '#ef4444',
    emissive: '#ef4444',
    intensity: 0.7
  }
};

/**
 * Resolves the visual state for a specific entity (e.g. array index, graph node ID, tree node ID)
 * based on current step and active persistent states.
 */
export function resolveVisualState(step, entityType, entityId, context = {}) {
  if (!step) return VISUAL_STATES.IDLE;

  const { sortedIndices = [], visitedNodes = [], sourceId = null, targetId = null } = context;

  // Graph special nodes
  if (entityType === 'node') {
    if (entityId === sourceId) return VISUAL_STATES.SOURCE;
    if (entityId === targetId) return VISUAL_STATES.TARGET;
  }

  // Active in current step
  switch (step.type) {
    case OP_TYPES.COMPARE:
      if (step.targets.indices?.includes(entityId) || step.targets.nodes?.includes(entityId)) {
        return VISUAL_STATES.COMPARING;
      }
      break;

    case OP_TYPES.SWAP:
      if (step.targets.indices?.includes(entityId) || step.targets.nodes?.includes(entityId)) {
        return VISUAL_STATES.SWAPPING;
      }
      break;

    case OP_TYPES.VISIT:
    case OP_TYPES.MOVE:
      if (step.targets.indices?.includes(entityId) || step.targets.nodes?.includes(entityId)) {
        return VISUAL_STATES.VISITED;
      }
      break;

    case OP_TYPES.INSERT:
    case OP_TYPES.PUSH:
    case OP_TYPES.ENQUEUE:
      if (step.targets.indices?.includes(entityId) || step.targets.nodes?.includes(entityId)) {
        return VISUAL_STATES.INSERTING;
      }
      break;

    case OP_TYPES.DELETE:
    case OP_TYPES.POP:
    case OP_TYPES.DEQUEUE:
      if (step.targets.indices?.includes(entityId) || step.targets.nodes?.includes(entityId)) {
        return VISUAL_STATES.DELETING;
      }
      break;

    case OP_TYPES.PATH_FOUND:
      if (step.targets.indices?.includes(entityId) || step.targets.nodes?.includes(entityId)) {
        return VISUAL_STATES.PATH;
      }
      break;

    case OP_TYPES.HIGHLIGHT:
    case OP_TYPES.SORTED:
      if (step.targets.indices?.includes(entityId) || step.targets.nodes?.includes(entityId)) {
        return VISUAL_STATES.SORTED;
      }
      break;

    case OP_TYPES.REJECT:
      return VISUAL_STATES.ERROR;

    default:
      break;
  }

  // Check persistent sorted/visited lists
  if (sortedIndices.includes(entityId)) {
    return VISUAL_STATES.SORTED;
  }
  if (visitedNodes.includes(entityId)) {
    return VISUAL_STATES.VISITED;
  }

  return VISUAL_STATES.IDLE;
}

/**
 * Get color specifications for a given visual state
 */
export function getVisualStateTheme(state) {
  return VISUAL_THEME[state] || VISUAL_THEME[VISUAL_STATES.IDLE];
}
