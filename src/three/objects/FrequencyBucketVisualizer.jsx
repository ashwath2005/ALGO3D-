import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useVisualizerStore } from '../../store/useVisualizerStore.js';

function SmoothBucketColumn({ posX, colHeight, isBucketActive, cnt, bucketIdx }) {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.scale.y = THREE.MathUtils.damp(meshRef.current.scale.y, colHeight, 16, delta);
      meshRef.current.position.y = (meshRef.current.scale.y) / 2;
    }
  });

  return (
    <group position={[posX, 0, 0]}>
      <mesh ref={meshRef} position={[0, colHeight / 2, 0]}>
        <boxGeometry args={[1.1, 1, 1.1]} />
        <meshStandardMaterial
          color={isBucketActive ? '#f59e0b' : '#0f172a'}
          emissive={isBucketActive ? '#f59e0b' : '#000000'}
          emissiveIntensity={isBucketActive ? 0.6 : 0}
          roughness={0.3}
        />
      </mesh>

      <Html position={[0, colHeight + 0.35, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          fontFamily: 'var(--font-mono)'
        }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: isBucketActive ? '#f59e0b' : '#ffffff' }}>
            {cnt}
          </span>
          <span style={{ fontSize: '8px', color: 'var(--text-muted)' }}>
            val {bucketIdx}
          </span>
        </div>
      </Html>
    </group>
  );
}

function SmoothRunwayBar({ targetX, height, isTarget, val, idx }) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, targetX, 16, delta);
    }
  });

  return (
    <group ref={groupRef} position={[targetX, height / 2, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.0, height, 1.0]} />
        <meshStandardMaterial
          color={isTarget ? '#38bdf8' : '#1e293b'}
          emissive={isTarget ? '#38bdf8' : '#000000'}
          emissiveIntensity={isTarget ? 0.6 : 0}
          roughness={0.2}
        />
      </mesh>

      <Html position={[0, height / 2 + 0.35, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          fontFamily: 'var(--font-mono)'
        }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#ffffff' }}>
            {val}
          </span>
          <span style={{ fontSize: '8px', color: 'var(--text-muted)' }}>
            idx {idx}
          </span>
        </div>
      </Html>
    </group>
  );
}

export function FrequencyBucketVisualizer() {
  const data = useVisualizerStore((s) => s.data);
  const currentStep = useVisualizerStore((s) => s.currentStep);

  const arr = Array.isArray(data) ? data : [];
  const activeIndices = currentStep?.targets?.indices || [];
  const variables = currentStep?.variables || {};
  const currentVal = variables.val !== undefined ? variables.val : activeIndices[0];
  const countArray = variables.count || [0, 0, 0, 0, 0, 0, 0, 0];

  return (
    <group position={[0, -1.6, 0]}>
      <gridHelper args={[24, 24, '#1f2937', '#111827']} position={[0, -0.05, 0]} />

      {/* Top Section: Frequency Buckets */}
      <group position={[0, 2.8, -1.8]}>
        <Html position={[-6.5, 0, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, color: 'var(--accent-amber)' }}>
            FREQUENCY BUCKETS:
          </span>
        </Html>

        {countArray.slice(0, 8).map((cnt, bucketIdx) => {
          const isBucketActive = currentVal === bucketIdx;
          const posX = (bucketIdx - 3.5) * 1.35;
          const colHeight = Math.max(0.3, cnt * 0.5);

          return (
            <SmoothBucketColumn
              key={`freq-bucket-${bucketIdx}`}
              posX={posX}
              colHeight={colHeight}
              isBucketActive={isBucketActive}
              cnt={cnt}
              bucketIdx={bucketIdx}
            />
          );
        })}
      </group>

      {/* Bottom Section: Output Runway (Array elements) */}
      <group position={[0, 0, 1.2]}>
        <Html position={[-6.5, 0.5, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, color: 'var(--accent-cyan)' }}>
            ARRAY RUNWAY:
          </span>
        </Html>

        {arr.map((val, idx) => {
          const isTarget = activeIndices.includes(idx);
          const height = Math.max(0.8, (val / 100) * 3.5);
          const posX = (idx - (arr.length - 1) / 2) * 1.35;

          return (
            <SmoothRunwayBar
              key={`tally-bar-${idx}`}
              targetX={posX}
              height={height}
              isTarget={isTarget}
              val={val}
              idx={idx}
            />
          );
        })}
      </group>
    </group>
  );
}
