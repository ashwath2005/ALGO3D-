import React from 'react';
import { Html } from '@react-three/drei';
import { useVisualizerStore } from '../../store/useVisualizerStore.js';

export function NumberFieldVisualizer() {
  const data = useVisualizerStore((s) => s.data);
  const currentStep = useVisualizerStore((s) => s.currentStep);

  const isPrime = Array.isArray(data) ? data : [];
  const activeIndices = currentStep?.targets?.indices || [];
  const variables = currentStep?.variables || {};
  const currentPrime = variables.prime;

  const numbers = Array.from({ length: 23 }, (_, i) => i + 2); // 2 .. 24

  return (
    <group position={[0, -0.5, 0]}>
      <gridHelper args={[24, 24, '#1f2937', '#111827']} position={[0, -0.2, 0]} />

      {/* Sieve Prime HUD */}
      {currentPrime && (
        <Html position={[0, 4.0, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
          <div style={{
            background: 'rgba(5, 5, 5, 0.9)',
            border: '1px solid var(--accent-emerald)',
            padding: '3px 12px',
            borderRadius: '4px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--accent-emerald)'
          }}>
            CURRENT ACTIVE PRIME: <span style={{ color: '#fff', fontWeight: 700 }}>{currentPrime}</span> (Eliminating multiples)
          </div>
        </Html>
      )}

      {/* Number Spheres (2 to 24) */}
      <group position={[0, 0, 0]}>
        {numbers.map((num) => {
          const isMarkedPrime = isPrime[num] === 1;
          const isCurrentActive = activeIndices.includes(num) || num === currentPrime;
          const isComposite = isPrime[num] === 0;

          const row = Math.floor((num - 2) / 6);
          const col = (num - 2) % 6;
          const posX = (col - 2.5) * 1.5;
          const posZ = (row - 1.5) * 1.5;

          let sphereColor = isComposite ? '#334155' : isMarkedPrime ? '#10b981' : '#38bdf8';
          let emissive = isCurrentActive ? '#10b981' : '#000000';
          let emissiveIntensity = isCurrentActive ? 0.8 : 0;

          return (
            <group key={`num-${num}`} position={[posX, 0.6, posZ]}>
              <mesh castShadow receiveShadow>
                <sphereGeometry args={[0.45, 24, 24]} />
                <meshStandardMaterial
                  color={sphereColor}
                  emissive={emissive}
                  emissiveIntensity={emissiveIntensity}
                  roughness={0.2}
                  transparent={isComposite}
                  opacity={isComposite ? 0.35 : 1}
                />
              </mesh>

              <Html center distanceFactor={14} style={{ pointerEvents: 'none' }}>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: isComposite ? '#64748b' : '#ffffff'
                }}>
                  {num}
                </span>
              </Html>
            </group>
          );
        })}
      </group>
    </group>
  );
}
