import React, { useRef, useEffect } from 'react';
import { Html } from '@react-three/drei';
import gsap from 'gsap';
import { useVisualizerStore } from '../../store/useVisualizerStore.js';

function LinkedNode({ val, index, total, isVisited, isHighlighted }) {
  const groupRef = useRef();
  const targetX = (index - (total - 1) / 2) * 2.5;

  let color = '#1e293b';
  let emissive = '#000000';
  let emissiveIntensity = 0;

  if (isVisited) {
    color = '#38bdf8';
    emissive = '#38bdf8';
    emissiveIntensity = 0.5;
  } else if (isHighlighted) {
    color = '#10b981';
    emissive = '#10b981';
    emissiveIntensity = 0.5;
  }

  useEffect(() => {
    if (groupRef.current) {
      gsap.to(groupRef.current.position, {
        x: targetX,
        y: 1.2,
        duration: 0.4,
        ease: 'power2.out'
      });
    }
  }, [targetX]);

  return (
    <group ref={groupRef} position={[targetX, 1.2, 0]}>
      {/* Node Body (Rounded Capsule-like block) */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.3, 0.9, 0.9]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
          roughness={0.2}
          metalness={0.4}
        />
      </mesh>

      {/* Pointer Connector Section */}
      <mesh position={[0.45, 0, 0]}>
        <boxGeometry args={[0.35, 0.85, 0.85]} />
        <meshStandardMaterial color="#0f172a" roughness={0.5} />
      </mesh>

      {/* 3D Value Label */}
      <Html center distanceFactor={15} style={{ pointerEvents: 'none' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px'
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            fontWeight: 700,
            color: '#ffffff'
          }}>
            {val}
          </span>
          {index === 0 && (
            <span style={{
              fontSize: '8px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--accent-cyan)',
              background: 'var(--accent-cyan-dim)',
              padding: '1px 4px',
              borderRadius: '2px'
            }}>HEAD</span>
          )}
        </div>
      </Html>

      {/* Pointer Arrow to Next Node */}
      {index < total - 1 ? (
        <group position={[1.2, 0, 0]}>
          <mesh rotation={[0, 0, -Math.PI / 2]}>
            <cylinderGeometry args={[0.04, 0.04, 0.9, 8]} />
            <meshStandardMaterial color="#64748b" emissive="#38bdf8" emissiveIntensity={0.2} />
          </mesh>
          <mesh position={[0.45, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <coneGeometry args={[0.12, 0.25, 8]} />
            <meshStandardMaterial color="#38bdf8" />
          </mesh>
        </group>
      ) : (
        /* Null Terminator */
        <group position={[1.1, 0, 0]}>
          <Html center distanceFactor={15} style={{ pointerEvents: 'none' }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--text-muted)',
              border: '1px dashed rgba(255,255,255,0.2)',
              padding: '2px 6px',
              borderRadius: '4px'
            }}>NULL</span>
          </Html>
        </group>
      )}
    </group>
  );
}

export function LinkedListVisualizer() {
  const data = useVisualizerStore((s) => s.data);
  const activeState = useVisualizerStore((s) => s.activeState);

  const list = Array.isArray(data) ? data : [];

  return (
    <group position={[0, 0, 0]}>
      <gridHelper args={[24, 24, '#1f2937', '#111827']} position={[0, -0.01, 0]} />
      {list.map((val, idx) => (
        <LinkedNode
          key={`ll-node-${idx}-${val}`}
          val={val}
          index={idx}
          total={list.length}
          isVisited={activeState.visitedIndices.includes(idx)}
          isHighlighted={activeState.highlightedIndices.includes(idx)}
        />
      ))}
    </group>
  );
}
