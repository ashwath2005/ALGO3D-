import React, { useMemo } from 'react';
import { Html } from '@react-three/drei';
import { useVisualizerStore } from '../../store/useVisualizerStore.js';

export function SpatialGeometryVisualizer() {
  const currentStep = useVisualizerStore((s) => s.currentStep);
  const variables = currentStep?.variables || {};

  const points = useMemo(() => [
    { id: 0, x: -3.5, y: -2, z: 0 },
    { id: 1, x: 3.5, y: -2, z: 0 },
    { id: 2, x: 4.2, y: 1.2, z: 0 },
    { id: 3, x: 1.2, y: 3.2, z: 0 },
    { id: 4, x: -2.2, y: 2.8, z: 0 },
    { id: 5, x: -3.8, y: 0.5, z: 0 },
    { id: 6, x: 0, y: 0, z: 0 },
    { id: 7, x: 1.2, y: 1.0, z: 0 }
  ], []);

  const activeIndices = currentStep?.targets?.indices || [];
  const pivotIdx = variables.pivotIdx ?? 0;
  const isRightTurn = variables.isRightTurn || currentStep?.type === 'REMOVE';

  return (
    <group position={[0, 0, 0]}>
      <gridHelper args={[24, 24, '#1f2937', '#111827']} position={[0, -3, 0]} />

      {/* Convex Hull HUD */}
      <Html position={[0, 4.2, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
        <div style={{
          background: 'rgba(5, 5, 5, 0.9)',
          border: '1px solid var(--accent-emerald)',
          padding: '3px 12px',
          borderRadius: '4px',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--accent-emerald)'
        }}>
          GRAHAM SCAN: <span style={{ color: '#fff', fontWeight: 700 }}>Stack Depth = {activeIndices.length}</span>
          {isRightTurn && <span style={{ marginLeft: '8px', color: '#f43f5e' }}>(NON-LEFT TURN POPPED)</span>}
        </div>
      </Html>

      {/* 3D Convex Hull Perimeter Boundary Ribbons */}
      {activeIndices.length >= 2 && (
        <group>
          {activeIndices.map((ptIdx, i) => {
            const nextPtIdx = activeIndices[(i + 1) % activeIndices.length];
            const p1 = points[ptIdx];
            const p2 = points[nextPtIdx];
            if (!p1 || !p2) return null;
            if (activeIndices.length < 3 && i === activeIndices.length - 1) return null;

            const mid = [(p1.x + p2.x) / 2, (p1.y + p2.y) / 2, (p1.z + p2.z) / 2];
            const len = Math.hypot(p2.x - p1.x, p2.y - p1.y, p2.z - p1.z);
            const rotZ = Math.atan2(p2.y - p1.y, p2.x - p1.x);

            return (
              <mesh key={`hull-edge-${i}`} position={mid} rotation={[0, 0, rotZ]}>
                <boxGeometry args={[len, 0.08, 0.08]} />
                <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.8} />
              </mesh>
            );
          })}
        </group>
      )}

      {points.map((pt, idx) => {
        const isHullVertex = activeIndices.includes(idx);
        const isPivot = idx === pivotIdx;

        return (
          <group key={`point-${pt.id}`} position={[pt.x, pt.y, pt.z]}>
            <mesh castShadow receiveShadow>
              <sphereGeometry args={[0.35, 24, 24]} />
              <meshStandardMaterial
                color={isPivot ? '#a855f7' : isHullVertex ? '#10b981' : '#38bdf8'}
                emissive={isPivot ? '#a855f7' : isHullVertex ? '#10b981' : '#38bdf8'}
                emissiveIntensity={isPivot ? 0.9 : isHullVertex ? 0.7 : 0.2}
                roughness={0.2}
              />
            </mesh>

            <Html center distanceFactor={14} style={{ pointerEvents: 'none' }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                fontWeight: 600,
                color: isPivot ? '#a855f7' : isHullVertex ? '#10b981' : '#ffffff',
                background: 'rgba(5, 5, 5, 0.85)',
                padding: '1px 4px',
                borderRadius: '3px',
                border: `1px solid ${isPivot ? '#a855f7' : isHullVertex ? '#10b981' : 'rgba(255,255,255,0.1)'}`,
                whiteSpace: 'nowrap'
              }}>
                {isPivot ? `PIVOT (P${pt.id})` : `P${pt.id}`}
              </span>
            </Html>
          </group>
        );
      })}
    </group>
  );
}
