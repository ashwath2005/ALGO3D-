import React, { useState } from 'react';
import { useVisualizerStore } from '../../store/useVisualizerStore.js';
import {
  Bug,
  Activity,
  Layers,
  CircleDot,
  Eye,
  Box,
  Clock,
  ChevronRight,
  ChevronDown,
  X,
  Plus,
  Trash2,
  Search,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Sparkles
} from 'lucide-react';

export function DebuggerDrawer() {
  const debugMode = useVisualizerStore((s) => s.debugMode);
  const currentStep = useVisualizerStore((s) => s.currentStep);
  const currentStepIndex = useVisualizerStore((s) => s.currentStepIndex);
  const steps = useVisualizerStore((s) => s.steps);
  const data = useVisualizerStore((s) => s.data);
  const structureType = useVisualizerStore((s) => s.structureType);
  const callStack = useVisualizerStore((s) => s.callStack);
  const selectedFrameIndex = useVisualizerStore((s) => s.selectedFrameIndex);
  const selectStackFrame = useVisualizerStore((s) => s.selectStackFrame);
  const breakpoints = useVisualizerStore((s) => s.breakpoints);
  const toggleLineBreakpoint = useVisualizerStore((s) => s.toggleLineBreakpoint);
  const toggleOpBreakpoint = useVisualizerStore((s) => s.toggleOpBreakpoint);
  const removeBreakpoint = useVisualizerStore((s) => s.removeBreakpoint);
  const setBreakpointCondition = useVisualizerStore((s) => s.setBreakpointCondition);
  const watches = useVisualizerStore((s) => s.watches);
  const evaluatedWatches = useVisualizerStore((s) => s.evaluatedWatches);
  const addWatch = useVisualizerStore((s) => s.addWatch);
  const removeWatch = useVisualizerStore((s) => s.removeWatch);
  const selectedVariable = useVisualizerStore((s) => s.selectedVariable);
  const selectVariable = useVisualizerStore((s) => s.selectVariable);
  const selectedObject = useVisualizerStore((s) => s.selectedObject);
  const select3DObject = useVisualizerStore((s) => s.select3DObject);
  const variableDiffs = useVisualizerStore((s) => s.variableDiffs);
  const applyStep = useVisualizerStore((s) => s.applyStep);
  const breakpointHit = useVisualizerStore((s) => s.breakpointHit);

  const [activeTab, setActiveTab] = useState('variables'); // 'variables' | 'stack' | 'breakpoints' | 'watches' | 'object' | 'search'
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [newWatchInput, setNewWatchInput] = useState('');
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const [newLineBpInput, setNewLineBpInput] = useState('');
  const [editingConditionId, setEditingConditionId] = useState(null);
  const [conditionInput, setConditionInput] = useState('');
  const toggleDebugMode = useVisualizerStore((s) => s.toggleDebugMode);

  if (!debugMode) return null;

  const currentVariables = currentStep?.variables || {};

  const handleAddWatch = (e) => {
    e.preventDefault();
    if (newWatchInput.trim()) {
      addWatch(newWatchInput.trim());
      setNewWatchInput('');
    }
  };

  const handleAddLineBp = (e) => {
    e.preventDefault();
    const lineNum = parseInt(newLineBpInput.trim(), 10);
    if (!isNaN(lineNum) && lineNum > 0) {
      toggleLineBreakpoint(lineNum);
      setNewLineBpInput('');
    }
  };

  // Filter history steps for search tab
  const filteredSteps = steps
    .map((step, idx) => ({ step, idx }))
    .filter(({ step, idx }) => {
      if (!historySearchQuery.trim()) return true;
      const q = historySearchQuery.toLowerCase().trim();
      return (
        step.type.toLowerCase().includes(q) ||
        step.description.toLowerCase().includes(q) ||
        String(idx).includes(q)
      );
    });

  return (
    <div
      className="glass-panel"
      style={{
        position: 'absolute',
        bottom: '12px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'min(780px, calc(100% - 640px))',
        minWidth: '400px',
        height: isCollapsed ? '38px' : '230px',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 30,
        overflow: 'hidden',
        boxShadow: '0 20px 45px rgba(0, 0, 0, 0.85)',
        border: '1px solid rgba(56, 189, 248, 0.28)',
        background: 'rgba(8, 8, 8, 0.96)',
        backdropFilter: 'blur(16px)',
        transition: 'height 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* Breakpoint Alert Banner if hit */}
      {breakpointHit && !isCollapsed && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.2)',
            borderBottom: '1px solid rgba(239, 68, 68, 0.4)',
            padding: '6px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            color: '#f87171'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444' }} />
            <span>{breakpointHit.reason}</span>
          </div>
          <span style={{ color: 'var(--text-muted)' }}>Step {breakpointHit.stepIndex}</span>
        </div>
      )}

      {/* Header Tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(0, 0, 0, 0.5)',
          overflowX: 'auto'
        }}
      >
        <button
          onClick={() => setActiveTab('variables')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '8px 10px',
            fontSize: '11px',
            fontWeight: activeTab === 'variables' ? 600 : 400,
            color: activeTab === 'variables' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
            background: activeTab === 'variables' ? 'rgba(56, 189, 248, 0.08)' : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'variables' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          <Activity size={12} />
          <span>Variables</span>
        </button>

        <button
          onClick={() => setActiveTab('stack')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '8px 10px',
            fontSize: '11px',
            fontWeight: activeTab === 'stack' ? 600 : 400,
            color: activeTab === 'stack' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
            background: activeTab === 'stack' ? 'rgba(56, 189, 248, 0.08)' : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'stack' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          <Layers size={12} />
          <span>Call Stack ({callStack.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('breakpoints')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '8px 10px',
            fontSize: '11px',
            fontWeight: activeTab === 'breakpoints' ? 600 : 400,
            color: activeTab === 'breakpoints' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
            background: activeTab === 'breakpoints' ? 'rgba(56, 189, 248, 0.08)' : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'breakpoints' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          <CircleDot size={12} />
          <span>Breakpoints ({breakpoints.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('watches')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '8px 10px',
            fontSize: '11px',
            fontWeight: activeTab === 'watches' ? 600 : 400,
            color: activeTab === 'watches' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
            background: activeTab === 'watches' ? 'rgba(56, 189, 248, 0.08)' : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'watches' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          <Eye size={12} />
          <span>Watches</span>
        </button>

        <button
          onClick={() => setActiveTab('object')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '8px 10px',
            fontSize: '11px',
            fontWeight: activeTab === 'object' ? 600 : 400,
            color: activeTab === 'object' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
            background: activeTab === 'object' ? 'rgba(56, 189, 248, 0.08)' : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'object' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          <Box size={12} />
          <span>Inspector {selectedObject ? '●' : ''}</span>
        </button>

        <button
          onClick={() => setActiveTab('search')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '8px 10px',
            fontSize: '11px',
            fontWeight: activeTab === 'search' ? 600 : 400,
            color: activeTab === 'search' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
            background: activeTab === 'search' ? 'rgba(56, 189, 248, 0.08)' : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'search' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          <Clock size={12} />
          <span>Timeline Search</span>
        </button>

        {/* Right Dock Action Controls */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px', paddingRight: '8px' }}>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="btn-icon"
            style={{ width: '22px', height: '22px' }}
            title={isCollapsed ? 'Expand Debugger Drawer' : 'Collapse Debugger Drawer'}
          >
            {isCollapsed ? <ChevronDown size={13} /> : <ChevronRight size={13} style={{ transform: 'rotate(90deg)' }} />}
          </button>
          <button
            onClick={toggleDebugMode}
            className="btn-icon"
            style={{ width: '22px', height: '22px' }}
            title="Close Debugger Mode"
          >
            <X size={12} />
          </button>
        </div>
      </div>

      {/* Tab Body Content */}
      {!isCollapsed && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 14px', fontSize: '11px' }}>
          {/* 1. VARIABLES TAB */}
          {activeTab === 'variables' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
              <span>REGISTER</span>
              <span>VALUE & CHANGE DIFF</span>
            </div>

            {Object.keys(currentVariables).length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
                No active local variables at Step {currentStepIndex < 0 ? '0' : currentStepIndex}.
              </div>
            ) : (
              Object.entries(currentVariables).map(([varName, val]) => {
                const diff = variableDiffs[varName];
                const isSelected = selectedVariable?.name === varName;

                return (
                  <div
                    key={varName}
                    onClick={() => selectVariable(varName)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '5px 8px',
                      borderRadius: 'var(--radius-sm)',
                      background: isSelected ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                      border: `1px solid ${isSelected ? 'var(--accent-cyan)' : 'var(--border-subtle)'}`,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--accent-cyan)' }}>
                        {varName}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {diff?.changed && diff.prev !== null && (
                        <span style={{ color: 'var(--text-muted)', textDecoration: 'line-through', fontFamily: 'var(--font-mono)' }}>
                          {String(diff.prev)}
                        </span>
                      )}
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        color: diff?.changed ? 'var(--accent-amber)' : '#ffffff',
                        background: diff?.changed ? 'rgba(245, 158, 11, 0.12)' : 'transparent',
                        padding: diff?.changed ? '1px 4px' : '0',
                        borderRadius: '3px'
                      }}>
                        {String(val)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}

            {/* Variable History Drawer if selected */}
            {selectedVariable && selectedVariable.history?.length > 0 && (
              <div style={{
                marginTop: '10px',
                padding: '8px',
                background: 'rgba(56, 189, 248, 0.04)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                borderRadius: 'var(--radius-sm)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontWeight: 600, color: 'var(--accent-cyan)' }}>
                  <span>Timeline of '{selectedVariable.name}'</span>
                  <button onClick={() => selectVariable(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <X size={12} />
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', maxHeight: '90px', overflowY: 'auto' }}>
                  {selectedVariable.history.map((h, i) => (
                    <button
                      key={i}
                      onClick={() => applyStep(h.stepIndex)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '3px 6px',
                        background: h.stepIndex === currentStepIndex ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                        border: 'none',
                        color: '#ffffff',
                        fontSize: '10px',
                        fontFamily: 'var(--font-mono)',
                        cursor: 'pointer',
                        borderRadius: '2px',
                        textAlign: 'left'
                      }}
                    >
                      <span style={{ color: 'var(--accent-cyan)' }}>Step {h.stepIndex}: {h.operation}</span>
                      <span>{h.prevValue !== undefined ? `${h.prevValue} ➔ ` : ''}<b>{String(h.value)}</b></span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. CALL STACK TAB */}
        {activeTab === 'stack' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {callStack.map((frame, idx) => (
              <div
                key={frame.id}
                onClick={() => selectStackFrame(idx)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-sm)',
                  background: selectedFrameIndex === idx ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                  border: `1px solid ${selectedFrameIndex === idx ? 'var(--accent-cyan)' : 'var(--border-subtle)'}`,
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: frame.isCurrent ? 'var(--accent-emerald)' : 'var(--text-muted)' }}>
                      {frame.isCurrent ? '▶' : ' '}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 600,
                      color: frame.isCurrent ? '#ffffff' : 'var(--text-secondary)',
                      paddingLeft: `${frame.depth * 10}px`
                    }}>
                      {frame.name}
                    </span>
                  </div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
                    Line {frame.line}
                  </span>
                </div>

                {/* Local Scope Preview */}
                {selectedFrameIndex === idx && Object.keys(frame.scope || {}).length > 0 && (
                  <div style={{
                    marginTop: '4px',
                    padding: '4px 8px',
                    background: 'rgba(0,0,0,0.4)',
                    borderRadius: '2px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    fontSize: '10px',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {Object.entries(frame.scope).map(([k, v]) => (
                      <span key={k} style={{ color: 'var(--text-secondary)' }}>
                        <span style={{ color: 'var(--accent-cyan)' }}>{k}:</span> {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 3. BREAKPOINTS TAB */}
        {activeTab === 'breakpoints' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Add Line Breakpoint Input */}
            <form onSubmit={handleAddLineBp} style={{ display: 'flex', gap: '6px' }}>
              <input
                type="number"
                placeholder="Line number (e.g. 5)"
                value={newLineBpInput}
                onChange={(e) => setNewLineBpInput(e.target.value)}
                style={{
                  flex: 1,
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '4px 8px',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  outline: 'none'
                }}
              />
              <button type="submit" className="btn-primary" style={{ padding: '4px 10px', fontSize: '11px' }}>
                <Plus size={12} /> Add
              </button>
            </form>

            {/* Quick Operation Breakpoint Badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', margin: '4px 0' }}>
              {['SWAP', 'COMPARE', 'ROTATE', 'RELAX', 'PATH_FOUND'].map((op) => {
                const hasOp = breakpoints.some((b) => b.type === 'op' && b.opType === op);
                return (
                  <button
                    key={op}
                    onClick={() => toggleOpBreakpoint(op)}
                    style={{
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '10px',
                      fontFamily: 'var(--font-mono)',
                      background: hasOp ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${hasOp ? '#ef4444' : 'var(--border-subtle)'}`,
                      color: hasOp ? '#f87171' : 'var(--text-secondary)',
                      cursor: 'pointer'
                    }}
                  >
                    {hasOp ? `● ${op}` : `+ ${op}`}
                  </button>
                );
              })}
            </div>

            {/* Active Breakpoints List */}
            {breakpoints.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '15px', color: 'var(--text-muted)' }}>
                No active breakpoints. Click code lines or add above.
              </div>
            ) : (
              breakpoints.map((bp) => (
                <div
                  key={bp.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 8px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: '#ef4444', fontSize: '12px' }}>●</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#ffffff' }}>
                        {bp.type === 'line' ? `Line ${bp.line}` : `Op: ${bp.opType}`}
                      </span>
                      {bp.hitCount > 0 && (
                        <span className="badge amber">Hit {bp.hitCount}x</span>
                      )}
                    </div>

                    {/* Condition editor */}
                    {editingConditionId === bp.id ? (
                      <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                        <input
                          type="text"
                          value={conditionInput}
                          onChange={(e) => setConditionInput(e.target.value)}
                          placeholder="e.g. i > 3 or val > 50"
                          style={{
                            background: 'var(--bg-surface)',
                            border: '1px solid var(--border-medium)',
                            color: '#fff',
                            fontSize: '10px',
                            fontFamily: 'var(--font-mono)',
                            padding: '2px 4px',
                            borderRadius: '2px'
                          }}
                        />
                        <button
                          onClick={() => {
                            setBreakpointCondition(bp.id, conditionInput);
                            setEditingConditionId(null);
                          }}
                          style={{ fontSize: '10px', background: 'var(--accent-cyan)', color: '#000', border: 'none', padding: '2px 6px', borderRadius: '2px' }}
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          setEditingConditionId(bp.id);
                          setConditionInput(bp.condition || '');
                        }}
                        style={{ fontSize: '10px', color: bp.condition ? 'var(--accent-amber)' : 'var(--text-muted)', cursor: 'pointer', fontFamily: 'var(--font-mono)' }}
                      >
                        {bp.condition ? `Condition: ${bp.condition}` : '+ Add Condition'}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => removeBreakpoint(bp.id)}
                    className="btn-icon"
                    style={{ width: '22px', height: '22px' }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* 4. WATCHES TAB */}
        {activeTab === 'watches' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <form onSubmit={handleAddWatch} style={{ display: 'flex', gap: '6px' }}>
              <input
                type="text"
                placeholder="Watch expression (e.g. arr[i], distance[C], pivot)"
                value={newWatchInput}
                onChange={(e) => setNewWatchInput(e.target.value)}
                style={{
                  flex: 1,
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '4px 8px',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  outline: 'none'
                }}
              />
              <button type="submit" className="btn-primary" style={{ padding: '4px 10px', fontSize: '11px' }}>
                <Plus size={12} /> Watch
              </button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {evaluatedWatches.map((w) => (
                <div
                  key={w.expression}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '5px 8px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                    {w.expression}
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 600,
                      color: w.isValid ? '#ffffff' : 'var(--text-muted)'
                    }}>
                      {typeof w.value === 'object' ? JSON.stringify(w.value) : String(w.value)}
                    </span>
                    <button
                      onClick={() => removeWatch(w.expression)}
                      className="btn-icon"
                      style={{ width: '20px', height: '20px' }}
                    >
                      <X size={11} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. 3D OBJECT INSPECTOR TAB */}
        {activeTab === 'object' && (
          <div>
            {!selectedObject ? (
              <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)' }}>
                Click any 3D bar, tree node, or graph vertex in the scene to inspect its history and time-travel!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{
                  padding: '8px',
                  background: 'rgba(56, 189, 248, 0.06)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <span style={{ color: 'var(--accent-cyan)', fontWeight: 700, fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
                      {selectedObject.type} {selectedObject.index !== undefined ? `[${selectedObject.index}]` : selectedObject.id}
                    </span>
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      Current Value: <b>{String(selectedObject.value !== undefined ? selectedObject.value : 'N/A')}</b>
                    </div>
                  </div>
                  <button onClick={() => select3DObject(null)} className="btn-icon" style={{ width: '22px', height: '22px' }}>
                    <X size={12} />
                  </button>
                </div>

                <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: '4px' }}>
                  OPERATIONS TIMELINE (Click to time travel):
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '140px', overflowY: 'auto' }}>
                  {selectedObject.history?.length === 0 ? (
                    <div style={{ padding: '10px', color: 'var(--text-muted)', textAlign: 'center' }}>
                      No operations recorded for this object yet.
                    </div>
                  ) : (
                    selectedObject.history.map((evt, idx) => (
                      <button
                        key={idx}
                        onClick={() => applyStep(evt.stepIndex)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '4px 8px',
                          borderRadius: 'var(--radius-sm)',
                          background: evt.stepIndex === currentStepIndex ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255,255,255,0.02)',
                          border: `1px solid ${evt.stepIndex === currentStepIndex ? 'var(--accent-cyan)' : 'var(--border-subtle)'}`,
                          color: '#ffffff',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>
                          Step {evt.stepIndex}: {evt.operation}
                        </span>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '10px' }}>
                          {evt.description || evt.detail}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 6. TIMELINE SEARCH & TIME TRAVEL TAB */}
        {activeTab === 'search' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Search size={13} style={{ color: 'var(--accent-cyan)' }} />
              <input
                type="text"
                placeholder="Search steps by type (SWAP, COMPARE, ROTATE) or index..."
                value={historySearchQuery}
                onChange={(e) => setHistorySearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '4px 8px',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', maxHeight: '180px', overflowY: 'auto' }}>
              {filteredSteps.slice(0, 40).map(({ step, idx }) => (
                <button
                  key={idx}
                  onClick={() => applyStep(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '4px 8px',
                    borderRadius: 'var(--radius-sm)',
                    background: idx === currentStepIndex ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${idx === currentStepIndex ? 'var(--accent-cyan)' : 'transparent'}`,
                    color: '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', fontSize: '10px', minWidth: '46px' }}>
                      Step {idx}
                    </span>
                    <span className="badge cyan" style={{ fontSize: '9px' }}>
                      {step.type}
                    </span>
                  </div>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                    {step.description}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
        </div>
      )}
    </div>
  );
}
