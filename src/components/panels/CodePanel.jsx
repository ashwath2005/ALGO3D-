import React from 'react';
import { useVisualizerStore } from '../../store/useVisualizerStore.js';
import { useSettingsStore } from '../../store/useSettingsStore.js';
import { Code2, X } from 'lucide-react';

export function CodePanel() {
  const currentAlgorithm = useVisualizerStore((s) => s.currentAlgorithm);
  const activeState = useVisualizerStore((s) => s.activeState);
  const showCodePanel = useSettingsStore((s) => s.showCodePanel);
  const setShowCodePanel = useSettingsStore((s) => s.setShowCodePanel);

  const lines = currentAlgorithm?.code ? currentAlgorithm.code.split('\n') : [];
  const activeLine = activeState.codeLine || 1;

  if (!showCodePanel) {
    return (
      <button
        onClick={() => setShowCodePanel(true)}
        className="glass-panel"
        style={{
          position: 'absolute',
          top: '80px',
          right: '20px',
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
        <Code2 size={14} />
        <span>Code</span>
      </button>
    );
  }

  return (
    <div
      className="glass-panel"
      style={{
        position: 'absolute',
        top: '80px',
        right: '20px',
        width: '380px',
        maxHeight: 'calc(100% - 170px)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 25,
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <div style={{
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'rgba(0,0,0,0.4)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Code2 size={14} style={{ color: 'var(--accent-cyan)' }} />
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
            Execution Code
          </span>
          <span className="badge cyan">Live Sync</span>
        </div>
        <button
          onClick={() => setShowCodePanel(false)}
          className="btn-icon"
          style={{ width: '22px', height: '22px' }}
        >
          <X size={12} />
        </button>
      </div>

      {/* Code Viewer Body */}
      <div style={{
        padding: '12px 0',
        overflowY: 'auto',
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        lineHeight: '1.6'
      }}>
        {lines.map((lineText, idx) => {
          const lineNum = idx + 1;
          const isCurrent = lineNum === activeLine;

          return (
            <div
              key={`line-${lineNum}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1px 12px',
                background: isCurrent ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                borderLeft: isCurrent ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                color: isCurrent ? '#ffffff' : 'var(--text-secondary)',
                transition: 'all 0.15s ease'
              }}
            >
              {/* Line Number */}
              <span style={{
                width: '24px',
                textAlign: 'right',
                marginRight: '12px',
                color: isCurrent ? 'var(--accent-cyan)' : 'var(--text-muted)',
                userSelect: 'none'
              }}>
                {lineNum}
              </span>

              {/* Line Code */}
              <pre style={{
                margin: 0,
                fontFamily: 'inherit',
                color: isCurrent ? '#ffffff' : 'inherit',
                whiteSpace: 'pre-wrap'
              }}>
                {lineText}
              </pre>
            </div>
          );
        })}
      </div>
    </div>
  );
}
