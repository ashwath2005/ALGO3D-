import React from 'react';
import { Html } from '@react-three/drei';
import { useVisualizerStore } from '../../store/useVisualizerStore.js';

export function MatrixGridVisualizer() {
  const data = useVisualizerStore((s) => s.data);
  const currentStep = useVisualizerStore((s) => s.currentStep);
  const algorithmId = useVisualizerStore((s) => s.algorithmId);

  const matrix = Array.isArray(data) && Array.isArray(data[0]) ? data : [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];

  const rows = matrix.length;
  const cols = matrix[0]?.length || 4;
  const activeIndices = currentStep?.targets?.indices || [];
  const variables = currentStep?.variables || {};

  // N-Queens Attack lines
  const isNQueens = algorithmId === 'n-queens';
  const queenPositions = [];
  if (isNQueens) {
    matrix.forEach((row, r) => {
      row.forEach((val, c) => {
        if (val === 1) queenPositions.push({ r, c });
      });
    });
  }

  return (
    <group position={[0, 0, 0]}>
      <gridHelper args={[24, 24, '#1f2937', '#111827']} position={[0, -1, 0]} />

      {/* Algorithm-specific HUD */}
      {isNQueens && (
        <Html position={[0, 4.2, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
          <div style={{
            background: 'rgba(5, 5, 5, 0.9)',
            border: '1px solid var(--accent-cyan)',
            padding: '3px 12px',
            borderRadius: '4px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--accent-cyan)'
          }}>
            3D CHESSBOARD: <span style={{ color: '#fff', fontWeight: 700 }}>{queenPositions.length} / {rows} Queens Placed</span>
          </div>
        </Html>
      )}

      {matrix.map((row, r) => (
        <group key={`matrix-row-${r}`}>
          {row.map((val, c) => {
            const isTargetCell = activeIndices[0] === r && activeIndices[1] === c;
            const isQueen = isNQueens && val === 1;
            const isConflict = isNQueens && isTargetCell && (variables.isConflict || currentStep?.type === 'REJECT');

            let cellColor = isConflict ? '#f43f5e' : isTargetCell ? '#38bdf8' : isQueen ? '#ec4899' : (r + c) % 2 === 0 ? '#1e293b' : '#0f172a';
            let emissive = isConflict ? '#f43f5e' : isTargetCell ? '#38bdf8' : isQueen ? '#ec4899' : '#000000';
            let emissiveIntensity = isConflict || isTargetCell || isQueen ? 0.6 : 0;

            const posX = (c - (cols - 1) / 2) * 1.6;
            const posZ = (r - (rows - 1) / 2) * 1.6;

            return (
              <group key={`cell-${r}-${c}`} position={[posX, 0, posZ]}>
                {/* 3D Cell Pedestal */}
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[1.4, 0.4, 1.4]} />
                  <meshStandardMaterial
                    color={cellColor}
                    emissive={emissive}
                    emissiveIntensity={emissiveIntensity}
                    roughness={0.25}
                    metalness={0.4}
                  />
                </mesh>

                {/* Queen 3D Tower or Cell Value */}
                {isQueen ? (
                  <group position={[0, 0.6, 0]}>
                    <mesh castShadow>
                      <cylinderGeometry args={[0.3, 0.45, 0.8, 16]} />
                      <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={0.7} />
                    </mesh>
                    <Html position={[0, 0.8, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
                      <span style={{ fontSize: '10px', color: '#fff', fontWeight: 800 }}>♛</span>
                    </Html>
                  </group>
                ) : (
                  <Html position={[0, 0.4, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      fontFamily: 'var(--font-mono)'
                    }}>
                      <span style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        color: isTargetCell ? '#ffffff' : 'var(--text-secondary)'
                      }}>
                        {val}
                      </span>
                      <span style={{ fontSize: '7px', color: 'var(--text-muted)' }}>
                        [{r},{c}]
                      </span>
                    </div>
                  </Html>
                )}
              </group>
            );
          })}
        </group>
      ))}
    </group>
  );
}
