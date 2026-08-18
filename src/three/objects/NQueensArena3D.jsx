import React, { useMemo } from 'react';
import { Html } from '@react-three/drei';
import { useVisualizerStore } from '../../store/useVisualizerStore.js';

// Realistic Classic Staunton 3D Chess Queen
function StauntonChessQueen({ isLocked, isConflict, isTesting, isSelected, onClick }) {
  let pieceColor = '#10b981'; // Emerald when placed
  let pieceRoughness = 0.2;
  let pieceMetalness = 0.6;
  let emissiveColor = '#10b981';
  let emissiveIntensity = 0.3;

  if (isConflict) {
    pieceColor = '#ef4444';
    emissiveColor = '#ef4444';
    emissiveIntensity = 0.8;
  } else if (isTesting) {
    pieceColor = '#38bdf8';
    emissiveColor = '#38bdf8';
    emissiveIntensity = 0.6;
  } else if (isSelected) {
    pieceColor = '#a855f7';
    emissiveColor = '#a855f7';
    emissiveIntensity = 0.7;
  }

  return (
    <group onClick={onClick} position={[0, 0, 0]}>
      {/* 1. Base Foot Skirt */}
      <mesh position={[0, 0.06, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.42, 0.48, 0.12, 32]} />
        <meshStandardMaterial
          color={pieceColor}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity * 0.3}
          roughness={pieceRoughness}
          metalness={pieceMetalness}
        />
      </mesh>

      {/* 2. Base Step-Up Ring */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.34, 0.42, 0.08, 32]} />
        <meshStandardMaterial
          color={pieceColor}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity * 0.3}
          roughness={pieceRoughness}
          metalness={pieceMetalness}
        />
      </mesh>

      {/* 3. Lower Torus Bead */}
      <mesh position={[0, 0.21, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.33, 0.035, 16, 32]} />
        <meshStandardMaterial
          color={pieceColor}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity * 0.4}
          roughness={pieceRoughness}
          metalness={pieceMetalness}
        />
      </mesh>

      {/* 4. Elegant Tapered Stem */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.3, 0.62, 32]} />
        <meshStandardMaterial
          color={pieceColor}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity * 0.4}
          roughness={pieceRoughness}
          metalness={pieceMetalness}
        />
      </mesh>

      {/* 5. Mid-Neck Torus Collar */}
      <mesh position={[0, 0.88, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.22, 0.04, 16, 32]} />
        <meshStandardMaterial
          color={pieceColor}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity * 0.5}
          roughness={pieceRoughness}
          metalness={pieceMetalness}
        />
      </mesh>

      {/* 6. Flared Queen Crown Cup (Coronet) */}
      <mesh position={[0, 1.08, 0]} castShadow>
        <cylinderGeometry args={[0.32, 0.18, 0.32, 32]} />
        <meshStandardMaterial
          color={pieceColor}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity * 0.5}
          roughness={pieceRoughness}
          metalness={pieceMetalness}
        />
      </mesh>

      {/* 7. Eight Coronet Pearls on Crown Rim */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const px = Math.cos(angle) * 0.3;
        const pz = Math.sin(angle) * 0.3;
        return (
          <mesh key={`pearl-${i}`} position={[px, 1.25, pz]}>
            <sphereGeometry args={[0.04, 12, 12]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive={emissiveColor}
              emissiveIntensity={emissiveIntensity * 0.8}
              roughness={0.1}
              metalness={0.9}
            />
          </mesh>
        );
      })}

      {/* 8. Queen Zenith Center Finial Ball */}
      <mesh position={[0, 1.34, 0]}>
        <sphereGeometry args={[0.09, 20, 20]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity * 1.2}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
    </group>
  );
}

export function NQueensArena3D() {
  const currentStep = useVisualizerStore((s) => s.currentStep);
  const selectedObject = useVisualizerStore((s) => s.selectedObject);
  const select3DObject = useVisualizerStore((s) => s.select3DObject);

  const snapshot = currentStep?.stateSnapshot;
  const variables = currentStep?.variables || {};
  const targets = currentStep?.targets || {};
  const activeIndices = targets.indices || [];

  const boardSize = 4;
  const tileSize = 1.6;
  const offset = ((boardSize - 1) * tileSize) / 2;

  // Extract placed queens from current algorithm snapshot
  const placedQueens = useMemo(() => {
    const list = [];
    if (Array.isArray(snapshot)) {
      for (let r = 0; r < snapshot.length; r++) {
        for (let c = 0; c < snapshot[r].length; c++) {
          if (snapshot[r][c] === 1) {
            list.push({ row: r, col: c });
          }
        }
      }
    }
    return list;
  }, [snapshot]);

  const activeRow = variables.row !== undefined ? variables.row : activeIndices[0];
  const activeCol = variables.col !== undefined ? variables.col : activeIndices[1];
  const isConflict = variables.safe === false || currentStep?.type === 'REJECT';

  return (
    <group position={[0, -0.4, 0]}>
      {/* Ground Pedestal Grid */}
      <gridHelper args={[24, 24, '#1f2937', '#0f172a']} position={[0, -0.2, 0]} />

      {/* Raised Wooden/Slate Chessboard Rim Frame */}
      <mesh position={[0, -0.08, 0]} receiveShadow>
        <boxGeometry args={[boardSize * tileSize + 0.5, 0.16, boardSize * tileSize + 0.5]} />
        <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.7} />
      </mesh>

      {/* Classic 4x4 Checkered Tiles */}
      {Array.from({ length: boardSize }).map((_, r) =>
        Array.from({ length: boardSize }).map((_, c) => {
          const posX = c * tileSize - offset;
          const posZ = r * tileSize - offset;
          const isDark = (r + c) % 2 === 1;
          const isTarget = r === activeRow && c === activeCol;
          const hasQueen = placedQueens.some((q) => q.row === r && q.col === c);

          // Classic Chessboard palette: Slate Dark vs Pearl Light
          let tileColor = isDark ? '#1e293b' : '#64748b';
          let emissive = '#000000';
          let emissiveIntensity = 0;

          if (hasQueen) {
            tileColor = '#064e3b';
            emissive = '#10b981';
            emissiveIntensity = 0.4;
          } else if (isTarget) {
            if (isConflict) {
              tileColor = '#4c0519';
              emissive = '#ef4444';
              emissiveIntensity = 0.6;
            } else {
              tileColor = '#0c4a6e';
              emissive = '#38bdf8';
              emissiveIntensity = 0.5;
            }
          }

          return (
            <group key={`tile-${r}-${c}`} position={[posX, 0, posZ]}>
              <mesh
                receiveShadow
                onClick={(e) => {
                  e.stopPropagation();
                  select3DObject({
                    type: 'board_square',
                    row: r,
                    col: c,
                    hasQueen
                  });
                }}
              >
                <boxGeometry args={[tileSize * 0.95, 0.08, tileSize * 0.95]} />
                <meshStandardMaterial
                  color={tileColor}
                  emissive={emissive}
                  emissiveIntensity={emissiveIntensity}
                  roughness={0.3}
                  metalness={0.3}
                />
              </mesh>

              {/* Corner Coordinate Label */}
              <Html position={[-tileSize * 0.36, 0.06, tileSize * 0.36]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  color: isTarget || hasQueen ? '#ffffff' : (isDark ? 'rgba(255,255,255,0.4)' : '#0f172a'),
                  fontWeight: 700
                }}>
                  {String.fromCharCode(65 + c)}{r + 1}
                </span>
              </Html>
            </group>
          );
        })
      )}

      {/* Placed Staunton Queens */}
      {placedQueens.map((q) => {
        const posX = q.col * tileSize - offset;
        const posZ = q.row * tileSize - offset;
        const isSelected = selectedObject?.type === 'queen' && selectedObject?.row === q.row && selectedObject?.col === q.col;

        return (
          <group key={`queen-${q.row}-${q.col}`} position={[posX, 0.04, posZ]}>
            <StauntonChessQueen
              isLocked={true}
              isSelected={isSelected}
              isConflict={false}
              onClick={(e) => {
                e.stopPropagation();
                select3DObject({
                  type: 'queen',
                  row: q.row,
                  col: q.col,
                  status: 'LOCKED'
                });
              }}
            />
          </group>
        );
      })}

      {/* Candidate / Probing Queen */}
      {activeRow !== undefined && activeCol !== undefined && !placedQueens.some((q) => q.row === activeRow && q.col === activeCol) && (
        <group
          position={[
            activeCol * tileSize - offset,
            0.3,
            activeRow * tileSize - offset
          ]}
        >
          <StauntonChessQueen
            isTesting={!isConflict}
            isConflict={isConflict}
            isSelected={false}
          />
        </group>
      )}
    </group>
  );
}
