import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useVisualizerStore } from '../../store/useVisualizerStore.js';

function SmoothSequenceNode({
  targetX,
  targetY,
  val,
  idx,
  isInWindow,
  nodeColor,
  emissive,
  emissiveIntensity,
  hasNext,
  isNextInWindow
}) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, targetX, 16, delta);
      groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, targetY, 16, delta);
    }
  });

  return (
    <group ref={groupRef} position={[targetX, targetY, 0]}>
      {/* Connecting Pipe to Next Node */}
      {hasNext && (
        <mesh position={[0.7, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.06, 0.06, 1.4, 8]} />
          <meshStandardMaterial
            color={isInWindow && isNextInWindow ? '#10b981' : '#334155'}
            emissive={isInWindow && isNextInWindow ? '#10b981' : '#000000'}
            emissiveIntensity={isInWindow && isNextInWindow ? 0.6 : 0}
          />
        </mesh>
      )}

      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.5, 24, 24]} />
        <meshStandardMaterial
          color={nodeColor}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
          roughness={0.2}
        />
      </mesh>

      <Html center distanceFactor={14} style={{ pointerEvents: 'none' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          fontFamily: 'var(--font-mono)'
        }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff' }}>
            {val}
          </span>
          <span style={{ fontSize: '8px', color: 'var(--text-muted)' }}>
            [{idx}]
          </span>
        </div>
      </Html>
    </group>
  );
}

export function SequencePathVisualizer() {
  const data = useVisualizerStore((s) => s.data);
  const currentStep = useVisualizerStore((s) => s.currentStep);

  const arr = Array.isArray(data) ? data : [];
  const activeIndices = currentStep?.targets?.indices || [];
  const variables = currentStep?.variables || {};
  const currMax = variables.currMax !== undefined ? variables.currMax : arr[0];
  const maxSoFar = variables.maxSoFar !== undefined ? variables.maxSoFar : arr[0];
  const isReset = currMax < 0;

  return (
    <group position={[0, -1.6, 0]}>
      <gridHelper args={[24, 24, '#1f2937', '#111827']} position={[0, -0.05, 0]} />

      {/* Kadane Running Banners */}
      <Html position={[0, 3.2, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
        <div style={{
          display: 'flex',
          gap: '12px',
          fontFamily: 'var(--font-mono)'
        }}>
          <div style={{
            background: 'rgba(5, 5, 5, 0.9)',
            border: `1px solid ${isReset ? 'var(--accent-rose, #f43f5e)' : 'var(--accent-cyan)'}`,
            padding: '4px 12px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '11px',
            color: isReset ? '#f43f5e' : 'var(--accent-cyan)',
            boxShadow: '0 0 14px rgba(0,0,0,0.6)'
          }}>
            CURRENT WINDOW SUM: <span style={{ color: '#fff', fontWeight: 700 }}>{currMax}</span>
            {isReset && <span style={{ marginLeft: '6px', fontSize: '9px' }}>(RESET WINDOW &lt; 0)</span>}
          </div>
          <div style={{
            background: 'rgba(5, 5, 5, 0.9)',
            border: '1px solid var(--accent-emerald)',
            padding: '4px 12px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '11px',
            color: 'var(--accent-emerald)',
            boxShadow: '0 0 14px rgba(16, 185, 129, 0.3)'
          }}>
            GLOBAL MAX SO FAR: <span style={{ color: '#fff', fontWeight: 700 }}>{maxSoFar}</span>
          </div>
        </div>
      </Html>

      {/* Connected 3D Node Chain */}
      {arr.map((val, idx) => {
        const isInWindow = activeIndices.includes(idx);
        const posX = (idx - (arr.length - 1) / 2) * 1.4;

        let nodeColor = isInWindow ? '#10b981' : val < 0 ? '#f43f5e' : '#38bdf8';
        let emissive = isInWindow ? '#10b981' : val < 0 ? '#f43f5e' : '#000000';
        let emissiveIntensity = isInWindow ? 0.7 : val < 0 ? 0.3 : 0;

        return (
          <SmoothSequenceNode
            key={`kadane-node-${idx}`}
            targetX={posX}
            targetY={0.6}
            val={val}
            idx={idx}
            isInWindow={isInWindow}
            nodeColor={nodeColor}
            emissive={emissive}
            emissiveIntensity={emissiveIntensity}
            hasNext={idx < arr.length - 1}
            isNextInWindow={activeIndices.includes(idx + 1)}
          />
        );
      })}
    </group>
  );
}
