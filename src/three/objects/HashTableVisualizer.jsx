import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useVisualizerStore } from '../../store/useVisualizerStore.js';

function SmoothHashChainNode({ nodeY, val }) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, nodeY, 16, delta);
    }
  });

  return (
    <group ref={groupRef} position={[0, nodeY, 0]}>
      {/* Vertical chain link */}
      <mesh position={[0, -0.55, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.8, 8]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>

      {/* Chain Node */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.8, 1.0]} />
        <meshStandardMaterial
          color="#1e293b"
          emissive="#10b981"
          emissiveIntensity={0.3}
          roughness={0.2}
        />
      </mesh>

      <Html center distanceFactor={15} style={{ pointerEvents: 'none' }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          fontWeight: 700,
          color: '#ffffff'
        }}>
          {val}
        </span>
      </Html>
    </group>
  );
}

export function HashTableVisualizer() {
  const data = useVisualizerStore((s) => s.data);
  const currentStep = useVisualizerStore((s) => s.currentStep);
  const activeState = useVisualizerStore((s) => s.activeState);
  const variables = currentStep?.variables || {};
  const activeKey = variables.key;
  const activeHash = variables.hash !== undefined ? variables.hash : (activeKey !== undefined ? activeKey % 7 : undefined);

  const buckets = Array.isArray(data) ? data : [[], [], [], [], [], [], []];

  return (
    <group position={[0, -1.0, 0]}>
      {/* Ground plane */}
      <gridHelper args={[24, 24, '#1f2937', '#111827']} position={[0, -0.6, 0]} />

      {/* Hash Calculation Formula Banner */}
      <Html position={[0, 3.4, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
        <div style={{
          background: 'rgba(5, 5, 5, 0.9)',
          border: '1px solid var(--accent-cyan)',
          padding: '4px 14px',
          borderRadius: '4px',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--accent-cyan)',
          boxShadow: '0 0 16px rgba(56, 189, 248, 0.3)'
        }}>
          HASH FUNCTION: <span style={{ color: '#fff', fontWeight: 700 }}>hash(key) = key % 7</span>
          {activeKey !== undefined && (
            <span style={{ marginLeft: '10px', color: 'var(--accent-amber)' }}>
              | key {activeKey} ➔ bucket [{activeHash}]
            </span>
          )}
        </div>
      </Html>

      {buckets.map((chain, bucketIdx) => {
        const isBucketActive = activeState.visitedIndices.includes(bucketIdx) || activeState.highlightedIndices.includes(bucketIdx) || bucketIdx === activeHash;
        const posX = (bucketIdx - (buckets.length - 1) / 2) * 2.2;

        return (
          <group key={`bucket-${bucketIdx}`} position={[posX, 0, 0]}>
            {/* Bucket Slot Base */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[1.6, 0.4, 1.4]} />
              <meshStandardMaterial
                color={isBucketActive ? '#38bdf8' : '#0f172a'}
                emissive={isBucketActive ? '#38bdf8' : '#000000'}
                emissiveIntensity={isBucketActive ? 0.4 : 0}
                roughness={0.3}
              />
            </mesh>

            {/* Bucket Index Badge */}
            <Html position={[0, -0.6, 0]} center distanceFactor={15} style={{ pointerEvents: 'none' }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 700,
                color: isBucketActive ? '#38bdf8' : 'var(--text-muted)',
                background: 'rgba(5, 5, 5, 0.85)',
                padding: '2px 6px',
                borderRadius: '3px',
                border: `1px solid ${isBucketActive ? '#38bdf8' : 'rgba(255,255,255,0.1)'}`
              }}>
                BUCKET [{bucketIdx}]
              </span>
            </Html>

            {/* Chained Linked Nodes in this bucket */}
            {chain.map((val, chainIdx) => (
              <SmoothHashChainNode
                key={`chain-${bucketIdx}-${chainIdx}`}
                nodeY={(chainIdx + 1) * 1.1}
                val={val}
              />
            ))}
          </group>
        );
      })}
    </group>
  );
}
