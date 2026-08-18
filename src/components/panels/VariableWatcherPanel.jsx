import React, { useState } from 'react';
import { useVisualizerStore } from '../../store/useVisualizerStore.js';
import { Eye, ChevronDown, ChevronUp, Braces } from 'lucide-react';

export function VariableWatcherPanel() {
  const [collapsed, setCollapsed] = useState(false);
  const currentStep = useVisualizerStore((s) => s.currentStep);
  const selectedVariable = useVisualizerStore((s) => s.selectedVariable);
  const selectVariable = useVisualizerStore((s) => s.selectVariable);
  const variableDiffs = useVisualizerStore((s) => s.variableDiffs);

  const variables = currentStep?.variables || {};
  const varKeys = Object.keys(variables);

  if (varKeys.length === 0) return null;

  return (
    <div
      className="glass-panel"
      style={{
        position: 'absolute',
        bottom: '80px',
        right: '20px',
        width: '280px',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        zIndex: 35,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 12px 32px rgba(0,0,0,0.7)'
      }}
    >
      {/* Header */}
      <div
        onClick={() => setCollapsed(!collapsed)}
        style={{
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(0,0,0,0.5)',
          borderBottom: collapsed ? 'none' : '1px solid var(--border-subtle)',
          cursor: 'pointer'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Braces size={13} style={{ color: 'var(--accent-cyan)' }} />
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)' }}>
            Variable Watcher
          </span>
          <span className="badge cyan" style={{ padding: '1px 4px', fontSize: '9px' }}>
            {varKeys.length} active
          </span>
        </div>
        <button style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
          {collapsed ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
      </div>

      {/* Variables List */}
      {!collapsed && (
        <div style={{
          padding: '10px 12px',
          maxHeight: '180px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px'
        }}>
          {varKeys.map((key) => {
            const val = variables[key];
            const diff = variableDiffs[key];
            const isSelected = selectedVariable?.name === key;
            const displayVal = typeof val === 'object' ? JSON.stringify(val) : String(val);

            return (
              <div
                key={`var-${key}`}
                onClick={() => selectVariable(isSelected ? null : key)}
                title="Click to track history and link with 3D elements"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '3px 8px',
                  borderRadius: '3px',
                  background: isSelected ? 'rgba(56, 189, 248, 0.2)' : 'var(--bg-surface)',
                  border: `1px solid ${isSelected ? 'var(--accent-cyan)' : 'transparent'}`,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: 'var(--accent-cyan)', fontWeight: isSelected ? 700 : 500 }}>
                    {key}:
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {diff?.changed && diff.prev !== null && (
                    <span style={{ color: 'var(--text-muted)', textDecoration: 'line-through', fontSize: '10px' }}>
                      {String(diff.prev)}
                    </span>
                  )}
                  <span style={{
                    color: diff?.changed ? 'var(--accent-amber)' : '#ffffff',
                    fontWeight: 600,
                    maxWidth: '120px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {displayVal}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
