import React from 'react';
import { Html } from '@react-three/drei';
import { useVisualizerStore } from '../../store/useVisualizerStore.js';

export function IntervalTimelineVisualizer() {
  const currentStep = useVisualizerStore((s) => s.currentStep);
  const activeIndices = currentStep?.targets?.indices || [];
  const variables = currentStep?.variables || {};

  const activities = [
    { id: 1, s: 1, f: 3, dur: 2 },
    { id: 2, s: 2, f: 5, dur: 3 },
    { id: 3, s: 4, f: 7, dur: 3 },
    { id: 4, s: 6, f: 8, dur: 2 },
    { id: 5, s: 8, f: 10, dur: 2 }
  ];

  const selectedActivities = variables.selected || activeIndices;

  return (
    <group position={[0, -0.5, 0]}>
      <gridHelper args={[24, 24, '#1f2937', '#111827']} position={[0, -0.2, 0]} />

      {/* Timeline Header */}
      <Html position={[0, 4.0, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
        <div style={{
          background: 'rgba(5, 5, 5, 0.9)',
          border: '1px solid var(--accent-emerald)',
          padding: '4px 14px',
          borderRadius: '4px',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--accent-emerald)'
        }}>
          GREEDY ACTIVITY SELECTION: <span style={{ color: '#fff', fontWeight: 700 }}>Sorted by Finish Time</span>
        </div>
      </Html>

      {/* 3D Activity Intervals */}
      {activities.map((act, idx) => {
        const isScheduled = selectedActivities.includes(idx) || selectedActivities.includes(act.id);
        const isCurrent = activeIndices.includes(idx);
        const isRejected = currentStep?.type === 'REJECT' && isCurrent;
        const posX = ((act.s + act.f) / 2 - 5.5) * 1.3;
        const posY = (activities.length - 1 - idx) * 0.85;
        const length = act.dur * 1.3;

        let barColor = isRejected ? '#f43f5e' : isScheduled ? '#10b981' : isCurrent ? '#f59e0b' : '#38bdf8';
        let emissive = isRejected ? '#f43f5e' : isScheduled ? '#10b981' : isCurrent ? '#f59e0b' : '#000000';
        let emissiveIntensity = isRejected || isScheduled || isCurrent ? 0.7 : 0;

        return (
          <group key={`act-${act.id}`} position={[posX, posY, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[length, 0.45, 0.8]} />
              <meshStandardMaterial
                color={barColor}
                emissive={emissive}
                emissiveIntensity={emissiveIntensity}
                roughness={0.2}
              />
            </mesh>

            <Html position={[0, 0.45, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 700,
                color: isRejected ? '#f43f5e' : isScheduled ? '#10b981' : '#ffffff',
                background: 'rgba(5, 5, 5, 0.85)',
                padding: '2px 8px',
                borderRadius: '4px',
                border: `1px solid ${isRejected ? '#f43f5e' : isScheduled ? '#10b981' : 'rgba(255,255,255,0.15)'}`,
                whiteSpace: 'nowrap'
              }}>
                Act {act.id} [{act.s} ➔ {act.f}] {isRejected ? '(OVERLAP REJECTED)' : isScheduled ? '(SELECTED)' : ''}
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}
