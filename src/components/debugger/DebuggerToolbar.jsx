import React from 'react';
import { useVisualizerStore } from '../../store/useVisualizerStore.js';
import {
  Bug,
  Play,
  Pause,
  CornerDownRight,
  ArrowRight,
  CornerUpLeft,
  CircleDot,
  ShieldAlert,
  RotateCcw,
  Zap
} from 'lucide-react';

export function DebuggerToolbar() {
  const debugMode = useVisualizerStore((s) => s.debugMode);
  const toggleDebugMode = useVisualizerStore((s) => s.toggleDebugMode);
  const debuggerStatus = useVisualizerStore((s) => s.debuggerStatus);
  const breakpointHit = useVisualizerStore((s) => s.breakpointHit);
  const continueToBreakpoint = useVisualizerStore((s) => s.continueToBreakpoint);
  const stepInto = useVisualizerStore((s) => s.stepInto);
  const stepOver = useVisualizerStore((s) => s.stepOver);
  const stepOut = useVisualizerStore((s) => s.stepOut);
  const pause = useVisualizerStore((s) => s.pause);
  const reset = useVisualizerStore((s) => s.reset);
  const isPlaying = useVisualizerStore((s) => s.isPlaying);
  const breakOnInvariant = useVisualizerStore((s) => s.breakOnInvariant);
  const setBreakOnInvariant = useVisualizerStore((s) => s.setBreakOnInvariant);

  const getStatusBadge = () => {
    switch (debuggerStatus) {
      case 'RUNNING':
        return { label: 'RUNNING', bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.4)', color: '#34d399' };
      case 'BREAKPOINT':
        return { label: 'BREAKPOINT HIT', bg: 'rgba(239, 68, 68, 0.2)', border: 'rgba(239, 68, 68, 0.6)', color: '#f87171' };
      case 'STEPPING':
        return { label: 'STEPPING', bg: 'rgba(56, 189, 248, 0.15)', border: 'rgba(56, 189, 248, 0.4)', color: '#38bdf8' };
      case 'COMPLETED':
        return { label: 'COMPLETED', bg: 'rgba(168, 85, 247, 0.15)', border: 'rgba(168, 85, 247, 0.4)', color: '#c084fc' };
      default:
        return { label: 'PAUSED', bg: 'rgba(234, 179, 8, 0.12)', border: 'rgba(234, 179, 8, 0.35)', color: '#facc15' };
    }
  };

  const statusInfo = getStatusBadge();

  return (
    <div
      className="glass-panel"
      style={{
        position: 'absolute',
        top: '14px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '5px 14px',
        borderRadius: 'var(--radius-full)',
        zIndex: 35,
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.7)',
        border: debugMode ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid var(--border-subtle)',
        background: 'rgba(8, 8, 8, 0.92)',
        backdropFilter: 'blur(16px)',
        transition: 'all var(--transition-fast)'
      }}
    >
      {/* Debug Mode Toggle */}
      <button
        onClick={toggleDebugMode}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          borderRadius: 'var(--radius-full)',
          background: debugMode ? 'var(--accent-cyan-dim)' : 'transparent',
          border: `1px solid ${debugMode ? 'var(--accent-cyan)' : 'var(--border-subtle)'}`,
          color: debugMode ? 'var(--accent-cyan)' : 'var(--text-secondary)',
          fontSize: '11px',
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          cursor: 'pointer',
          transition: 'all var(--transition-fast)'
        }}
        title="Toggle Phase 3 Algorithm Debugger"
      >
        <Bug size={13} />
        <span>DEBUG {debugMode ? 'ON' : 'OFF'}</span>
      </button>

      {/* Live Status Pill */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          padding: '2px 8px',
          borderRadius: '12px',
          background: statusInfo.bg,
          border: `1px solid ${statusInfo.border}`,
          color: statusInfo.color,
          fontSize: '10px',
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          letterSpacing: '0.5px'
        }}
      >
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusInfo.color }} />
        <span>{statusInfo.label}</span>
      </div>

      <div style={{ width: '1px', height: '18px', background: 'var(--border-subtle)' }} />

      {/* Stepping Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {/* Continue / Pause */}
        {isPlaying ? (
          <button
            onClick={pause}
            className="btn-icon"
            style={{ width: '28px', height: '28px' }}
            title="Pause execution (F5 / Space)"
          >
            <Pause size={13} style={{ color: '#facc15' }} />
          </button>
        ) : (
          <button
            onClick={continueToBreakpoint}
            className="btn-icon"
            style={{ width: '28px', height: '28px' }}
            title="Continue to next breakpoint (F5)"
          >
            <Play size={13} style={{ color: '#34d399' }} />
          </button>
        )}

        {/* Step Over (F6) */}
        <button
          onClick={stepOver}
          className="btn-icon"
          style={{ width: '28px', height: '28px' }}
          title="Step Over: next logical operation at current scope (F6)"
        >
          <ArrowRight size={13} />
        </button>

        {/* Step Into (F7) */}
        <button
          onClick={stepInto}
          className="btn-icon"
          style={{ width: '28px', height: '28px' }}
          title="Step Into: step inside function/recursion (F7)"
        >
          <CornerDownRight size={13} />
        </button>

        {/* Step Out (F8) */}
        <button
          onClick={stepOut}
          className="btn-icon"
          style={{ width: '28px', height: '28px' }}
          title="Step Out: run until current recursive frame returns (F8)"
        >
          <CornerUpLeft size={13} />
        </button>

        {/* Restart */}
        <button
          onClick={reset}
          className="btn-icon"
          style={{ width: '28px', height: '28px' }}
          title="Restart / Reset (R)"
        >
          <RotateCcw size={12} />
        </button>
      </div>

      <div style={{ width: '1px', height: '18px', background: 'var(--border-subtle)' }} />

      {/* Invariant Break Toggle */}
      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '11px',
          color: breakOnInvariant ? 'var(--accent-amber)' : 'var(--text-muted)',
          cursor: 'pointer',
          userSelect: 'none',
          fontFamily: 'var(--font-mono)'
        }}
        title="Automatically break execution if an invariant violation occurs"
      >
        <input
          type="checkbox"
          checked={breakOnInvariant}
          onChange={(e) => setBreakOnInvariant(e.target.checked)}
          style={{ accentColor: 'var(--accent-amber)', width: '13px', height: '13px' }}
        />
        <span>Break on Invariant</span>
      </label>
    </div>
  );
}
