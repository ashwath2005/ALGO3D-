import { create } from 'zustand';
import { ALGORITHMS, getAlgorithmById, generateInitialData } from '../algorithms/registry.js';
import {
  ExecutionEngine,
  OP_TYPES,
  VISUAL_STATES,
  resolveVisualState,
  generateStepExplanation,
  getAlgorithmInvariant,
  calculateStateDiff
} from '../algorithms/engine/ExecutionEngine.js';
import { DebuggerEngine } from '../algorithms/debugger/DebuggerEngine.js';
import { sound } from '../utils/audio.js';

// Instantiate authoritative ExecutionEngine & DebuggerEngine singletons
let engineInstance = null;
const debuggerEngine = new DebuggerEngine();

function getEngine(set, get) {
  if (!engineInstance) {
    engineInstance = new ExecutionEngine({
      onStepChange: ({ step, stepIndex, state, prevState, nextStep, prevStep, metrics }) => {
        // Trigger audio cues based on operation type
        if (step) {
          if (step.type === OP_TYPES.COMPARE) sound.compare(step.values?.[0] || 50);
          else if (step.type === OP_TYPES.SWAP) sound.swap();
          else if (step.type === OP_TYPES.VISIT) sound.visit(step.indices?.[0] || 0);
          else if (step.type === OP_TYPES.ROTATE) sound.rotate();
          else if (step.type === OP_TYPES.COMPLETE || step.type === OP_TYPES.PATH_FOUND) sound.complete();
        }

        // Active State resolution for visualizers
        const activeState = {
          comparedIndices: step?.type === OP_TYPES.COMPARE ? step.indices : [],
          swappedIndices: step?.type === OP_TYPES.SWAP ? step.indices : [],
          highlightedIndices: (step?.type === OP_TYPES.HIGHLIGHT || step?.type === OP_TYPES.PATH_FOUND) ? step.indices : [],
          visitedIndices: step?.type === OP_TYPES.VISIT ? step.indices : [],
          activeNodes: step?.nodes || [],
          activeEdges: step?.edges || [],
          description: step?.description || (stepIndex < 0 ? 'Ready to execute algorithm.' : ''),
          codeLine: step?.codeLine || 1,
          codeLines: step?.metadata?.codeLines || [step?.codeLine || 1],
          rotationInfo: step?.extra?.rotationType ? step.extra : null
        };

        // Educational Intelligence context generation
        const algorithmId = get().algorithmId;
        const currentData = state !== null && state !== undefined ? state : get().data;
        const explanationContext = generateStepExplanation({
          algorithmId,
          step,
          nextStep,
          prevStep,
          currentState: currentData,
          prevState,
          variables: step?.variables || {}
        });

        // Compute ghost preview state if next step is a mutation
        let ghostState = null;
        if (nextStep && (nextStep.type === OP_TYPES.SWAP || nextStep.type === OP_TYPES.WRITE || nextStep.type === OP_TYPES.OVERWRITE)) {
          if (Array.isArray(currentData)) {
            const preview = [...currentData];
            if (nextStep.type === OP_TYPES.SWAP && nextStep.indices?.length === 2) {
              const [a, b] = nextStep.indices;
              if (preview[a] !== undefined && preview[b] !== undefined) {
                const tmp = preview[a];
                preview[a] = preview[b];
                preview[b] = tmp;
                ghostState = preview;
              }
            }
          }
        }

        // --- PHASE 3: Debugger Reconstructions ---
        const callStack = debuggerEngine.getCallStack(algorithmId, step, stepIndex, currentData);
        
        const evalContext = {
          step: stepIndex,
          operation: step?.type || 'NONE',
          codeLine: step?.codeLine || 1,
          indices: step?.indices || [],
          values: step?.values || [],
          arr: Array.isArray(currentData) ? currentData : [],
          state: currentData,
          stats: metrics,
          ...(step?.variables || {})
        };
        const evaluatedWatches = debuggerEngine.evaluateWatches(get().watches, evalContext);

        // Compute Variable Diffs (current vs previous step variables)
        const currentVars = step?.variables || {};
        const prevVars = prevStep?.variables || {};
        const variableDiffs = {};
        Object.keys(currentVars).forEach((key) => {
          const curr = currentVars[key];
          const prev = prevVars[key];
          variableDiffs[key] = {
            current: curr,
            prev: prev !== undefined ? prev : null,
            changed: prev !== undefined && prev !== curr
          };
        });

        // Check Breakpoints if playing or continuing
        let bpCheck = { hit: false };
        if (get().isPlaying && stepIndex >= 0) {
          bpCheck = debuggerEngine.breakpointManager.evaluateStep(
            step,
            stepIndex,
            currentData,
            explanationContext.invariant
          );

          if (bpCheck.hit) {
            engineInstance.pause();
            sound.click();
            set({
              debuggerStatus: 'BREAKPOINT',
              breakpointHit: {
                reason: bpCheck.reason,
                breakpoint: bpCheck.breakpoint,
                stepIndex
              }
            });
          }
        }

        // Refresh selected variable history if present
        let selVar = get().selectedVariable;
        if (selVar) {
          const history = debuggerEngine.getVariableTimeline(selVar.name, get().steps, get().initialData);
          selVar = {
            ...selVar,
            value: currentVars[selVar.name] !== undefined ? currentVars[selVar.name] : selVar.value,
            history
          };
        }

        // Refresh selected object history if present
        let selObj = get().selectedObject;
        if (selObj) {
          const history = debuggerEngine.getObjectTimeline(selObj, get().steps);
          selObj = {
            ...selObj,
            history
          };
        }

        set({
          currentStepIndex: stepIndex,
          currentStep: step,
          nextStep,
          prevStep,
          data: currentData,
          stats: metrics,
          activeState,
          educationalState: explanationContext,
          ghostState,
          callStack,
          evaluatedWatches,
          variableDiffs,
          selectedVariable: selVar,
          selectedObject: selObj,
          debuggerStatus: bpCheck.hit ? 'BREAKPOINT' : (get().isPlaying ? 'RUNNING' : (stepIndex >= get().steps.length - 1 ? 'COMPLETED' : 'PAUSED')),
          breakpoints: [...debuggerEngine.breakpointManager.breakpoints]
        });
      },
      onPlaybackChange: (isPlaying) => {
        set({
          isPlaying,
          debuggerStatus: isPlaying ? 'RUNNING' : (get().currentStepIndex >= get().steps.length - 1 ? 'COMPLETED' : 'PAUSED')
        });
      },
      onComplete: () => {
        sound.complete();
        set({ debuggerStatus: 'COMPLETED' });
      }
    });
  }
  return engineInstance;
}

export const useVisualizerStore = create((set, get) => ({
  algorithmId: 'bubble-sort',
  currentAlgorithm: ALGORITHMS['bubble-sort'],
  structureType: 'array',

  // Data state
  dataSize: 8,
  dataMode: 'random',
  data: generateInitialData('array', 8, 'random'),
  initialData: generateInitialData('array', 8, 'random'),

  // Execution & Step state
  steps: [],
  currentStepIndex: -1,
  currentStep: null,
  isPlaying: false,
  playbackSpeed: 1,

  // Live Metrics
  stats: {
    comparisons: 0,
    swaps: 0,
    writes: 0,
    visits: 0,
    operations: 0,
    executionTimeMs: 0
  },

  // Active Highlighting states for 3D renderers
  activeState: {
    comparedIndices: [],
    swappedIndices: [],
    highlightedIndices: [],
    visitedIndices: [],
    activeNodes: [],
    activeEdges: [],
    description: 'Ready to execute algorithm.',
    codeLine: 1,
    codeLines: [1],
    rotationInfo: null
  },

  // Educational Intelligence state
  educationalState: {
    what: 'Ready to execute algorithm.',
    where: 'Entire structure',
    why: 'Select Play or Step to inspect execution.',
    diff: null,
    invariant: getAlgorithmInvariant('bubble-sort', null, null),
    nextOp: 'Start execution from first step'
  },
  ghostState: null,

  // --- PHASE 3: Debugger & Time-Travel State ---
  debugMode: false,
  debuggerStatus: 'PAUSED', // 'RUNNING' | 'PAUSED' | 'STEPPING' | 'BREAKPOINT' | 'COMPLETED' | 'ERROR'
  breakpointHit: null,
  breakpoints: [],
  breakOnInvariant: false,
  watches: ['i', 'j', 'pivot', 'current', 'distance', 'balanceFactor', 'arr.length'],
  evaluatedWatches: [],
  callStack: [],
  selectedFrameIndex: 0,
  selectedObject: null, // { type, index?, id?, row?, col?, value?, metadata?, history: [] }
  selectedVariable: null, // { name, value, history: [] }
  variableDiffs: {},

  // Graph-specific Interactive State
  graphSourceNode: 'A',
  graphTargetNode: 'F',
  graphEditMode: 'none',

  // --- Debugger Actions ---
  toggleDebugMode: () => {
    set((state) => ({ debugMode: !state.debugMode }));
  },

  setBreakOnInvariant: (enabled) => {
    debuggerEngine.breakpointManager.breakOnInvariant = enabled;
    set({ breakOnInvariant: enabled });
  },

  toggleLineBreakpoint: (line, condition = '') => {
    debuggerEngine.breakpointManager.toggleLineBreakpoint(line, condition);
    set({ breakpoints: [...debuggerEngine.breakpointManager.breakpoints] });
  },

  toggleOpBreakpoint: (opType, condition = '') => {
    debuggerEngine.breakpointManager.toggleOpBreakpoint(opType, condition);
    set({ breakpoints: [...debuggerEngine.breakpointManager.breakpoints] });
  },

  removeBreakpoint: (id) => {
    debuggerEngine.breakpointManager.removeBreakpoint(id);
    set({ breakpoints: [...debuggerEngine.breakpointManager.breakpoints] });
  },

  setBreakpointCondition: (id, condition) => {
    debuggerEngine.breakpointManager.setCondition(id, condition);
    set({ breakpoints: [...debuggerEngine.breakpointManager.breakpoints] });
  },

  addWatch: (expr) => {
    if (!expr || get().watches.includes(expr.trim())) return;
    const newWatches = [...get().watches, expr.trim()];
    set({ watches: newWatches });
    const evalContext = {
      step: get().currentStepIndex,
      ...(get().currentStep?.variables || {}),
      arr: get().data,
      state: get().data
    };
    set({ evaluatedWatches: debuggerEngine.evaluateWatches(newWatches, evalContext) });
  },

  removeWatch: (expr) => {
    const newWatches = get().watches.filter((w) => w !== expr);
    set({ watches: newWatches });
    const evalContext = {
      step: get().currentStepIndex,
      ...(get().currentStep?.variables || {}),
      arr: get().data,
      state: get().data
    };
    set({ evaluatedWatches: debuggerEngine.evaluateWatches(newWatches, evalContext) });
  },

  select3DObject: (objectSpec) => {
    if (!objectSpec) {
      set({ selectedObject: null });
      return;
    }
    const history = debuggerEngine.getObjectTimeline(objectSpec, get().steps);
    const objWithHistory = {
      ...objectSpec,
      history
    };
    set({ selectedObject: objWithHistory });
  },

  selectVariable: (varName) => {
    if (!varName) {
      set({ selectedVariable: null });
      return;
    }
    const history = debuggerEngine.getVariableTimeline(varName, get().steps, get().initialData);
    const currVal = get().currentStep?.variables?.[varName];
    set({
      selectedVariable: {
        name: varName,
        value: currVal !== undefined ? currVal : 'undefined',
        history
      }
    });

    // Bidirectionally highlight 3D object if variable points to an array index
    if (typeof currVal === 'number' && get().structureType === 'array' && currVal >= 0 && currVal < get().data.length) {
      get().select3DObject({
        type: 'array_element',
        index: currVal,
        value: get().data[currVal]
      });
    }
  },

  selectStackFrame: (frameIndex) => {
    set({ selectedFrameIndex: frameIndex });
  },

  // Stepping Semantics
  stepInto: () => {
    const engine = getEngine(set, get);
    set({ debuggerStatus: 'STEPPING', breakpointHit: null });
    engine.next();
  },

  stepOver: () => {
    const engine = getEngine(set, get);
    set({ debuggerStatus: 'STEPPING', breakpointHit: null });
    const targetIdx = debuggerEngine.findStepOverIndex(get().steps, get().currentStepIndex);
    engine.seek(targetIdx, { isStep: true });
  },

  stepOut: () => {
    const engine = getEngine(set, get);
    set({ debuggerStatus: 'STEPPING', breakpointHit: null });
    const targetIdx = debuggerEngine.findStepOutIndex(get().steps, get().currentStepIndex);
    engine.seek(targetIdx, { isStep: true });
  },

  continueToBreakpoint: () => {
    const engine = getEngine(set, get);
    set({ breakpointHit: null, debuggerStatus: 'RUNNING' });
    engine.play();
  },

  // Initialize and load an algorithm
  setAlgorithm: (algorithmId) => {
    const algo = getAlgorithmById(algorithmId);
    const engine = getEngine(set, get);
    engine.pause();

    const initialData = generateInitialData(algo.structureType, get().dataSize, get().dataMode);

    let steps = [];
    try {
      if (algo.structureType === 'graph') {
        steps = algo.execute(initialData, get().graphSourceNode, get().graphTargetNode);
      } else if (algo.structureType === 'tree') {
        let treeRoot = null;
        for (const val of initialData) {
          const res = algo.executeInsert(treeRoot, val);
          treeRoot = res.root;
          steps.push(...res.steps);
        }
      } else {
        steps = algo.execute(initialData);
      }
    } catch (e) {
      console.warn('Execution generator warning:', e);
      steps = [];
    }

    set({
      algorithmId,
      currentAlgorithm: algo,
      structureType: algo.structureType,
      initialData,
      data: initialData,
      steps,
      selectedObject: null,
      selectedVariable: null,
      breakpointHit: null
    });

    engine.load(steps, initialData);
  },

  // Re-generate current dataset
  regenerateData: (mode = null, size = null) => {
    const newMode = mode || get().dataMode;
    const newSize = size || get().dataSize;
    const algo = get().currentAlgorithm;
    const engine = getEngine(set, get);
    engine.pause();

    const initialData = generateInitialData(algo.structureType, newSize, newMode);

    let steps = [];
    try {
      if (algo.structureType === 'graph') {
        steps = algo.execute(initialData, get().graphSourceNode, get().graphTargetNode);
      } else if (algo.structureType === 'tree') {
        let treeRoot = null;
        for (const val of initialData) {
          const res = algo.executeInsert(treeRoot, val);
          treeRoot = res.root;
          steps.push(...res.steps);
        }
      } else {
        steps = algo.execute(initialData);
      }
    } catch (e) {
      console.warn('Execution error:', e);
    }

    set({
      dataMode: newMode,
      dataSize: newSize,
      data: initialData,
      initialData,
      steps,
      selectedObject: null,
      selectedVariable: null,
      breakpointHit: null
    });

    engine.load(steps, initialData);
  },

  // Set custom user array/data
  setCustomData: (customArray) => {
    const algo = get().currentAlgorithm;
    const engine = getEngine(set, get);
    engine.pause();

    let steps = [];
    try {
      steps = algo.execute(customArray);
    } catch (e) {
      console.warn('Execution error:', e);
    }

    set({
      data: [...customArray],
      initialData: [...customArray],
      dataSize: customArray.length,
      steps,
      selectedObject: null,
      selectedVariable: null,
      breakpointHit: null
    });

    engine.load(steps, customArray);
  },

  // Reset to initial un-executed state
  reset: () => {
    const engine = getEngine(set, get);
    sound.click();
    set({ breakpointHit: null, debuggerStatus: 'PAUSED' });
    engine.reset();
  },

  // Step Forward
  stepForward: () => {
    const engine = getEngine(set, get);
    set({ breakpointHit: null });
    engine.next();
  },

  // Step Backward
  stepBackward: () => {
    const engine = getEngine(set, get);
    set({ breakpointHit: null });
    engine.previous();
  },

  // Seek to specific step index
  applyStep: (targetIndex) => {
    const engine = getEngine(set, get);
    engine.seek(targetIndex);
  },

  // Play / Pause controls
  setPlaybackSpeed: (speed) => {
    set({ playbackSpeed: speed });
    const engine = getEngine(set, get);
    engine.setSpeed(speed);
  },

  play: () => {
    const engine = getEngine(set, get);
    set({ breakpointHit: null });
    engine.play();
  },

  pause: () => {
    const engine = getEngine(set, get);
    engine.pause();
  },

  togglePlay: () => {
    const engine = getEngine(set, get);
    set({ breakpointHit: null });
    engine.togglePlay();
  },

  // Jump to beginning
  jumpToStart: () => {
    const engine = getEngine(set, get);
    set({ breakpointHit: null });
    engine.jumpToStart();
  },

  // Jump to end
  jumpToEnd: () => {
    const engine = getEngine(set, get);
    set({ breakpointHit: null });
    engine.jumpToEnd();
  },

  // Deep-link state loader from URL params
  loadFromUrlState: ({ algorithmId, stepIndex, data, speed }) => {
    const targetAlgoId = algorithmId && ALGORITHMS[algorithmId] ? algorithmId : get().algorithmId;
    const algo = getAlgorithmById(targetAlgoId);
    const engine = getEngine(set, get);
    engine.pause();

    let initialData;
    if (data && Array.isArray(data) && data.length > 0 && algo.structureType === 'array') {
      initialData = [...data];
    } else {
      initialData = generateInitialData(algo.structureType, get().dataSize, get().dataMode);
    }

    let steps = [];
    try {
      if (algo.structureType === 'graph') {
        steps = algo.execute(initialData, get().graphSourceNode, get().graphTargetNode);
      } else if (algo.structureType === 'tree') {
        let treeRoot = null;
        for (const val of initialData) {
          const res = algo.executeInsert(treeRoot, val);
          treeRoot = res.root;
          steps.push(...res.steps);
        }
      } else {
        steps = algo.execute(initialData);
      }
    } catch (e) {
      console.warn('URL hydration execution error:', e);
      steps = [];
    }

    if (speed) {
      set({ playbackSpeed: speed });
      engine.setSpeed(speed);
    }

    set({
      algorithmId: targetAlgoId,
      currentAlgorithm: algo,
      structureType: algo.structureType,
      initialData,
      data: initialData,
      dataSize: initialData.length || get().dataSize,
      steps,
      selectedObject: null,
      selectedVariable: null,
      breakpointHit: null
    });

    engine.load(steps, initialData);

    if (stepIndex !== null && stepIndex !== undefined && stepIndex >= 0) {
      setTimeout(() => {
        engine.seek(stepIndex);
      }, 50);
    }
  },

  // Graph manipulation actions
  setGraphSourceNode: (nodeId) => {
    set({ graphSourceNode: nodeId });
    get().setAlgorithm(get().algorithmId);
  },

  setGraphTargetNode: (nodeId) => {
    set({ graphTargetNode: nodeId });
    get().setAlgorithm(get().algorithmId);
  },

  setGraphEditMode: (mode) => set({ graphEditMode: mode })
}));
