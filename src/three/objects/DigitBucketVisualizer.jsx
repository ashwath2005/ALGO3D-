import React from 'react';
import { Html } from '@react-three/drei';
import { useVisualizerStore } from '../../store/useVisualizerStore.js';

export function DigitBucketVisualizer() {
  const data = useVisualizerStore((s) => s.data);
  const currentStep = useVisualizerStore((s) => s.currentStep);

  const arr = Array.isArray(data) ? data : [];
  const activeIndices = currentStep?.targets?.indices || [];
  const variables = currentStep?.variables || {};
  const exp = variables.exp || 1;
  const placeName = exp === 1 ? "1's Place (Units)" : exp === 10 ? "10's Place (Tens)" : "100's Place (Hundreds)";

  const buckets = Array.from({ length: 10 }, (_, i) => i);

  return (
    <group position={[0, -1.6, 0]}>
      <gridHelper args={[24, 24, '#1f2937', '#111827']} position={[0, -0.05, 0]} />

      {/* Active Digit Place Chamber Header */}
      <Html position={[0, 3.2, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
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
          RADIX PASS: <span style={{ color: '#fff', fontWeight: 700 }}>{placeName}</span> (exp = {exp})
        </div>
      </Html>

      {/* 10 Digit Bucket Trays [0 .. 9] */}
      <group position={[0, 0, -2]}>
        {buckets.map((b) => {
          const posX = (b - 4.5) * 1.35;

          return (
            <group key={`digit-bucket-${b}`} position={[posX, 0, 0]}>
              <mesh receiveShadow>
                <boxGeometry args={[1.2, 0.25, 1.2]} />
                <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.6} />
              </mesh>

              <Html position={[0, 0.35, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'var(--accent-cyan)',
                  background: 'rgba(0,0,0,0.8)',
                  padding: '1px 5px',
                  borderRadius: '3px',
                  border: '1px solid rgba(56,189,248,0.3)'
                }}>
                  [{b}]
                </span>
              </Html>
            </group>
          );
        })}
      </group>

      {/* Array Elements Sorted by Digit */}
      <group position={[0, 0, 1.5]}>
        {arr.map((val, idx) => {
          const isTarget = activeIndices.includes(idx);
          const currentDigit = Math.floor(val / exp) % 10;
          const posX = (idx - (arr.length - 1) / 2) * 1.35;

          return (
            <group key={`radix-elem-${idx}`} position={[posX, 0.6, 0]}>
              <mesh castShadow receiveShadow>
                <boxGeometry args={[1.05, 1.05, 1.05]} />
                <meshStandardMaterial
                  color={isTarget ? '#38bdf8' : '#1e293b'}
                  emissive={isTarget ? '#38bdf8' : '#000000'}
                  emissiveIntensity={isTarget ? 0.6 : 0}
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
                  <span style={{ fontSize: '8px', color: 'var(--accent-amber)', fontWeight: 600 }}>
                    digit: {currentDigit}
                  </span>
                </div>
              </Html>
            </group>
          );
        })}
      </group>
    </group>
  );
}
