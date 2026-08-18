import React from 'react';
import { useVisualizerStore } from '../../store/useVisualizerStore.js';
import { MapPin, Navigation, Compass, Target } from 'lucide-react';

export function GraphToolbar() {
  const structureType = useVisualizerStore((s) => s.structureType);
  const data = useVisualizerStore((s) => s.data);
  const sourceNode = useVisualizerStore((s) => s.graphSourceNode);
  const targetNode = useVisualizerStore((s) => s.graphTargetNode);
  const setSource = useVisualizerStore((s) => s.setGraphSourceNode);
  const setTarget = useVisualizerStore((s) => s.setGraphTargetNode);

  if (structureType !== 'graph' || !data?.nodes) return null;

  const nodeIds = data.nodes.map((n) => n.id);

  return (
    <div
      className="glass-panel"
      style={{
        position: 'absolute',
        top: '80px',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '6px 14px',
        borderRadius: 'var(--radius-full)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        zIndex: 25
      }}
    >
      {/* Source Node Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <MapPin size={13} style={{ color: '#10b981' }} />
        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Source:</span>
        <select
          value={sourceNode}
          onChange={(e) => setSource(e.target.value)}
          style={{
            background: 'var(--bg-surface)',
            color: '#10b981',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '4px',
            padding: '2px 6px',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          {nodeIds.map((id) => (
            <option key={`src-${id}`} value={id} style={{ background: '#111111', color: '#ffffff' }}>
              Node {id}
            </option>
          ))}
        </select>
      </div>

      <div style={{ width: '1px', height: '14px', background: 'var(--border-subtle)' }} />

      {/* Target Node Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Target size={13} style={{ color: '#f43f5e' }} />
        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Destination:</span>
        <select
          value={targetNode}
          onChange={(e) => setTarget(e.target.value)}
          style={{
            background: 'var(--bg-surface)',
            color: '#f43f5e',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: '4px',
            padding: '2px 6px',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          {nodeIds.map((id) => (
            <option key={`dest-${id}`} value={id} style={{ background: '#111111', color: '#ffffff' }}>
              Node {id}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
