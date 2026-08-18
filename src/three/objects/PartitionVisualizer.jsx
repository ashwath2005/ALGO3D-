import React from 'react';
import { Html } from '@react-three/drei';
import { useVisualizerStore } from '../../store/useVisualizerStore.js';

export function PartitionVisualizer() {
  const data = useVisualizerStore((s) => s.data);
  const currentStep = useVisualizerStore((s) => s.currentStep);

  const arr = Array.isArray(data) ? data : [];
  const activeIndices = currentStep?.targets?.indices || [];
  const variables = currentStep?.variables || {};
  const low = variables.low;
  const mid = variables.mid;
  const high = variables.high;

  return (
    <group position={[0, -1.6, 0]}>
      <gridHelper args={[24, 24, '#1f2937', '#111827']} position={[0, -0.05, 0]} />

      {/* 3 Physical Colored Zone Pedestals */}
      <group position={[0, -0.1, 0]}>
        {/* Zone 0 (Red) */}
        <group position={[-5, 0, 0]}>
          <mesh>
            <boxGeometry args={[4.5, 0.12, 3]} />
            <meshStandardMaterial color="#f43f5e" emissive="#f43f5e" emissiveIntensity={0.2} transparent opacity={0.35} />
          </mesh>
          <Html position={[0, 0.2, 1.2]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
            <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#f43f5e', background: '#000', padding: '1px 5px', borderRadius: '3px', border: '1px solid #f43f5e' }}>
              ZONE 0 (RED)
            </span>
          </Html>
        </group>

        {/* Zone 1 (White) */}
        <group position={[0, 0, 0]}>
          <mesh>
            <boxGeometry args={[4.5, 0.12, 3]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.15} transparent opacity={0.25} />
          </mesh>
          <Html position={[0, 0.2, 1.2]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
            <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#ffffff', background: '#000', padding: '1px 5px', borderRadius: '3px', border: '1px solid #ffffff' }}>
              ZONE 1 (WHITE)
            </span>
          </Html>
        </group>

        {/* Zone 2 (Blue) */}
        <group position={[5, 0, 0]}>
          <mesh>
            <boxGeometry args={[4.5, 0.12, 3]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.2} transparent opacity={0.35} />
          </mesh>
          <Html position={[0, 0.2, 1.2]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
            <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#38bdf8', background: '#000', padding: '1px 5px', borderRadius: '3px', border: '1px solid #38bdf8' }}>
              ZONE 2 (BLUE)
            </span>
          </Html>
        </group>
      </group>

      {/* Array Elements */}
      {arr.map((val, idx) => {
        const isSelected = activeIndices.includes(idx);
        const isLow = idx === low;
        const isMid = idx === mid;
        const isHigh = idx === high;

        let blockColor = val === 0 ? '#f43f5e' : val === 1 ? '#e2e8f0' : '#38bdf8';
        let emissive = isSelected ? blockColor : '#000000';
        let emissiveIntensity = isSelected ? 0.6 : 0;

        const posX = (idx - (arr.length - 1) / 2) * 1.35;

        return (
          <group key={`dnf-block-${idx}`} position={[posX, 0.6, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[1.1, 1.1, 1.1]} />
              <meshStandardMaterial
                color={blockColor}
                emissive={emissive}
                emissiveIntensity={emissiveIntensity}
                roughness={0.2}
                metalness={0.4}
              />
            </mesh>

            {/* Pointers (LOW, MID, HIGH) */}
            {isLow && (
              <Html position={[0, 1.3, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
                <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#f43f5e', background: '#000', padding: '1px 4px', borderRadius: '3px', border: '1px solid #f43f5e' }}>
                  LOW
                </span>
              </Html>
            )}

            {isMid && (
              <Html position={[0, 1.7, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
                <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#ffffff', background: '#000', padding: '1px 4px', borderRadius: '3px', border: '1px solid #ffffff' }}>
                  MID
                </span>
              </Html>
            )}

            {isHigh && (
              <Html position={[0, 1.3, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
                <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#38bdf8', background: '#000', padding: '1px 4px', borderRadius: '3px', border: '1px solid #38bdf8' }}>
                  HIGH
                </span>
              </Html>
            )}

            {/* Value Label */}
            <Html center distanceFactor={14} style={{ pointerEvents: 'none' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '14px', color: val === 1 ? '#000000' : '#ffffff' }}>
                {val}
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}
