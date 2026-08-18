import React from 'react';
import { Html } from '@react-three/drei';
import { useVisualizerStore } from '../../store/useVisualizerStore.js';

export function StringPatternVisualizer() {
  const currentStep = useVisualizerStore((s) => s.currentStep);
  const variables = currentStep?.variables || {};

  const text = variables.text || 'ABABDABACDABABCABAB';
  const pattern = variables.pattern || 'ABABCABAB';
  const textIdx = variables.textIndex !== undefined ? variables.textIndex : variables.i !== undefined ? variables.i : 0;
  const patIdx = variables.patternIndex !== undefined ? variables.patternIndex : variables.j !== undefined ? variables.j : 0;
  const lps = variables.lps || [0, 0, 1, 2, 0, 1, 2, 3, 4];
  const isMatchFound = currentStep?.type === 'PATH_FOUND' || currentStep?.type === 'FOUND';

  return (
    <group position={[0, -0.5, 0]}>
      <gridHelper args={[24, 24, '#1f2937', '#111827']} position={[0, -0.2, 0]} />

      {/* LPS Header Table */}
      <Html position={[0, 4.2, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
        <div style={{
          background: 'rgba(5, 5, 5, 0.9)',
          border: '1px solid var(--accent-cyan)',
          padding: '4px 14px',
          borderRadius: '4px',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--accent-cyan)',
          display: 'flex',
          gap: '12px'
        }}>
          <span>KMP SEARCH: <strong style={{ color: '#fff' }}>Text [{textIdx}] vs Pattern [{patIdx}]</strong></span>
          {patIdx > 0 && <span>| LPS[{patIdx - 1}] = <strong style={{ color: 'var(--accent-amber)' }}>{lps[patIdx - 1] ?? 0}</strong></span>}
        </div>
      </Html>

      {/* Main Text Track */}
      <group position={[0, 1.4, 0]}>
        <Html position={[-7.5, 0, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--accent-cyan)' }}>
            TEXT:
          </span>
        </Html>

        {text.split('').map((char, idx) => {
          const isCurrentChar = idx === textIdx;
          const posX = (idx - (text.length - 1) / 2) * 0.75;

          return (
            <group key={`text-char-${idx}`} position={[posX, 0, 0]}>
              <mesh castShadow receiveShadow>
                <boxGeometry args={[0.68, 0.68, 0.68]} />
                <meshStandardMaterial
                  color={isCurrentChar ? '#38bdf8' : '#1e293b'}
                  emissive={isCurrentChar ? '#38bdf8' : '#000000'}
                  emissiveIntensity={isCurrentChar ? 0.6 : 0}
                  roughness={0.2}
                />
              </mesh>
              <Html center distanceFactor={14} style={{ pointerEvents: 'none' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: '#ffffff' }}>
                  {char}
                </span>
              </Html>
            </group>
          );
        })}
      </group>

      {/* Pattern Track */}
      <group position={[0, -0.2, 0]}>
        <Html position={[-7.5, 0, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: '#ec4899' }}>
            PATTERN:
          </span>
        </Html>

        {pattern.split('').map((char, idx) => {
          const isCurrentPat = idx === patIdx;
          const posX = (idx - (pattern.length - 1) / 2) * 0.75;

          return (
            <group key={`pat-char-${idx}`} position={[posX, 0, 0]}>
              <mesh castShadow receiveShadow>
                <boxGeometry args={[0.68, 0.68, 0.68]} />
                <meshStandardMaterial
                  color={isMatchFound ? '#10b981' : isCurrentPat ? '#ec4899' : '#1e293b'}
                  emissive={isMatchFound ? '#10b981' : isCurrentPat ? '#ec4899' : '#000000'}
                  emissiveIntensity={isMatchFound || isCurrentPat ? 0.6 : 0}
                  roughness={0.2}
                />
              </mesh>
              <Html center distanceFactor={14} style={{ pointerEvents: 'none' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: '#ffffff' }}>
                  {char}
                </span>
              </Html>
            </group>
          );
        })}
      </group>
    </group>
  );
}
