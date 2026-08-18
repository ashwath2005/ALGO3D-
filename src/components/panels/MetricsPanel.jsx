import React from 'react';
import { useVisualizerStore } from '../../store/useVisualizerStore.js';
import { useSettingsStore } from '../../store/useSettingsStore.js';
import { Activity, Zap, Cpu, Clock, X } from 'lucide-react';

export function MetricsPanel() {
  const currentAlgorithm = useVisualizerStore((s) => s.currentAlgorithm);
  const stats = useVisualizerStore((s) => s.stats);
  const showComplexityPanel = useSettingsStore((s) => s.showComplexityPanel);
  const setShowComplexityPanel = useSettingsStore((s) => s.setShowComplexityPanel);

  const comp = currentAlgorithm?.complexity || {};

  if (!showComplexityPanel) {
    return (
      <button
        onClick={() => setShowComplexityPanel(true)}
        className="glass-panel"
        style={{
          position: 'absolute',
          top: '80px',
          left: '20px',
          padding: '8px 12px',
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--text-secondary)',
          fontSize: '12px',
          zIndex: 25
        }}
      >
        <Activity size={14} />
        <span>Complexity & Metrics</span>
      </button>
    );
  }

  return (
    <div
      className="glass-panel"
      style={{
        position: 'absolute',
        top: '80px',
        left: '20px',
        width: '290px',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '14px',
        zIndex: 25
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={14} style={{ color: 'var(--accent-cyan)' }} />
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
            Complexity & Metrics
          </span>
        </div>
        <button
          onClick={() => setShowComplexityPanel(false)}
          className="btn-icon"
          style={{ width: '22px', height: '22px' }}
        >
          <X size={12} />
        </button>
      </div>

      {/* Complexity Matrix */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '8px',
        background: 'var(--bg-surface)',
        padding: '10px',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-subtle)'
      }}>
        <div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>TIME (AVG)</div>
          <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--accent-cyan)' }}>
            {comp.timeAverage || 'O(n)'}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>TIME (WORST)</div>
          <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-primary)' }}>
            {comp.timeWorst || 'O(n)'}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>SPACE</div>
          <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--accent-emerald)' }}>
            {comp.space || 'O(1)'}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>STABILITY</div>
          <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-secondary)' }}>
            {comp.stable || 'N/A'}
          </div>
        </div>
      </div>

      {/* Dynamic Live Execution Counters */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        padding: '10px',
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-subtle)',
        fontFamily: 'var(--font-mono)',
        fontSize: '11px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
          <span>Comparisons</span>
          <span style={{ color: 'var(--accent-amber)', fontWeight: 600 }}>{stats.comparisons}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
          <span>Swaps / Writes</span>
          <span style={{ color: '#ec4899', fontWeight: 600 }}>{stats.swaps}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
          <span>Visited Nodes</span>
          <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{stats.visitedNodes}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
          <span>Total Operations</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{stats.operations}</span>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          color: 'var(--text-muted)',
          paddingTop: '4px',
          borderTop: '1px solid var(--border-subtle)'
        }}>
          <span>Simulated Time</span>
          <span>{stats.executionTimeMs} ms</span>
        </div>
      </div>
    </div>
  );
}
