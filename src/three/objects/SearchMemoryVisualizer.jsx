import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useVisualizerStore } from '../../store/useVisualizerStore.js';

function SmoothMemoryBlock({
  targetX,
  targetY,
  val,
  idx,
  blockColor,
  emissive,
  emissiveIntensity,
  isOutOfRange,
  isCurrentLow,
  isCurrentHigh,
  isCurrentMid,
  algorithmId,
  mid
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
      {/* 3D Memory Cell */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.1, 1.1, 1.1]} />
        <meshStandardMaterial
          color={blockColor}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
          roughness={0.2}
          metalness={0.5}
          transparent={isOutOfRange}
          opacity={isOutOfRange ? 0.35 : 1}
        />
      </mesh>

      {/* Pointers / Role Tags */}
      {isCurrentLow && (
        <Html position={[0, 1.2, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
          <span style={{
            fontSize: '9px',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            color: '#f59e0b',
            background: 'rgba(0,0,0,0.85)',
            padding: '1px 5px',
            borderRadius: '3px',
            border: '1px solid #f59e0b'
          }}>
            {algorithmId === 'two-sum-pointer' ? 'LEFT' : 'LOW'}
          </span>
        </Html>
      )}

      {isCurrentHigh && !isCurrentLow && (
        <Html position={[0, 1.2, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
          <span style={{
            fontSize: '9px',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            color: '#f59e0b',
            background: 'rgba(0,0,0,0.85)',
            padding: '1px 5px',
            borderRadius: '3px',
            border: '1px solid #f59e0b'
          }}>
            {algorithmId === 'two-sum-pointer' ? 'RIGHT' : 'HIGH'}
          </span>
        </Html>
      )}

      {isCurrentMid && (
        <Html position={[0, 1.6, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
          <span style={{
            fontSize: '9px',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            color: '#38bdf8',
            background: 'rgba(0,0,0,0.85)',
            padding: '1px 5px',
            borderRadius: '3px',
            border: '1px solid #38bdf8'
          }}>
            {algorithmId === 'ternary-search' ? (idx === mid ? 'MID 1' : 'MID 2') : algorithmId === 'interpolation-search' ? 'PROBE' : 'MID'}
          </span>
        </Html>
      )}

      {/* Number Label */}
      <Html center distanceFactor={14} style={{ pointerEvents: 'none' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          fontFamily: 'var(--font-mono)'
        }}>
          <span style={{
            fontSize: '13px',
            fontWeight: 700,
            color: isOutOfRange ? '#475569' : '#ffffff'
          }}>
            {val}
          </span>
          <span style={{ fontSize: '8px', color: isOutOfRange ? '#334155' : 'var(--text-muted)' }}>
            [{idx}]
          </span>
        </div>
      </Html>
    </group>
  );
}

function SmoothConeScanner({ targetX }) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, targetX, 16, delta);
    }
  });

  return (
    <group ref={groupRef} position={[targetX, 3.0, 0]}>
      <mesh rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.6, 2.2, 16, 1, true]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.25} wireframe={false} />
      </mesh>
    </group>
  );
}

export function SearchMemoryVisualizer() {
  const data = useVisualizerStore((s) => s.data);
  const currentStep = useVisualizerStore((s) => s.currentStep);
  const algorithmId = useVisualizerStore((s) => s.algorithmId);

  const arr = Array.isArray(data) ? data : [];
  const activeIndices = currentStep?.targets?.indices || [];
  const variables = currentStep?.variables || {};
  const isFound = currentStep?.type === 'PATH_FOUND' || currentStep?.type === 'FOUND';

  const low = variables.low !== undefined ? variables.low : variables.l !== undefined ? variables.l : variables.left;
  const high = variables.high !== undefined ? variables.high : variables.r !== undefined ? variables.r : variables.right;
  const mid = variables.mid !== undefined ? variables.mid : variables.mid1 !== undefined ? variables.mid1 : variables.pos;
  const mid2 = variables.mid2;
  const target = variables.target;
  const currentSum = variables.currentSum;
  const stepBlock = variables.step || variables.blockSize || 3;

  return (
    <group position={[0, -1.6, 0]}>
      {/* Floor Grid */}
      <gridHelper args={[24, 24, '#1f2937', '#111827']} position={[0, -0.05, 0]} />

      {/* Target HUD Header */}
      {target !== undefined && (
        <Html position={[0, 3.0, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
          <div style={{
            background: 'rgba(5, 5, 5, 0.9)',
            border: `1px solid ${isFound ? 'var(--accent-emerald)' : 'var(--accent-cyan)'}`,
            padding: '4px 14px',
            borderRadius: '4px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: isFound ? 'var(--accent-emerald)' : 'var(--accent-cyan)',
            boxShadow: '0 0 16px rgba(0,0,0,0.6)'
          }}>
            SEARCH TARGET: <span style={{ color: '#fff', fontWeight: 700 }}>{target}</span>
            {currentSum !== undefined && (
              <span style={{ marginLeft: '12px', color: 'var(--accent-amber)' }}>
                | CURRENT SUM: <span style={{ color: '#fff', fontWeight: 700 }}>{currentSum}</span>
              </span>
            )}
            {isFound && <span style={{ marginLeft: '10px', fontWeight: 700 }}>➔ TARGET FOUND!</span>}
          </div>
        </Html>
      )}

      {/* Linear Scanner Light Cone */}
      {algorithmId === 'linear-search' && activeIndices.length > 0 && (
        <SmoothConeScanner targetX={(activeIndices[0] - (arr.length - 1) / 2) * 1.4} />
      )}

      {/* Jump Search Block Dividing Pillars */}
      {algorithmId === 'jump-search' && (
        <group position={[0, 0, 0]}>
          {Array.from({ length: Math.ceil(arr.length / stepBlock) }).map((_, blockIdx) => {
            const startIdx = blockIdx * stepBlock;
            const posX = (startIdx - 0.5 - (arr.length - 1) / 2) * 1.4;
            if (blockIdx === 0) return null;
            return (
              <group key={`jump-block-${blockIdx}`} position={[posX, 0.5, 0]}>
                <mesh>
                  <cylinderGeometry args={[0.03, 0.03, 2.2, 8]} />
                  <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.5} />
                </mesh>
                <Html position={[0, 1.4, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
                  <span style={{ fontSize: '7px', fontFamily: 'var(--font-mono)', color: '#f59e0b', background: '#000', padding: '1px 3px', borderRadius: '2px', border: '1px solid #f59e0b' }}>
                    BLOCK {blockIdx}
                  </span>
                </Html>
              </group>
            );
          })}
        </group>
      )}

      {/* Memory Blocks */}
      {arr.map((val, idx) => {
        const isSelected = activeIndices.includes(idx);
        const isCurrentMid = idx === mid || idx === mid2;
        const isCurrentLow = idx === low;
        const isCurrentHigh = idx === high;

        const isOutOfRange = (low !== undefined && high !== undefined) && (idx < low || idx > high);

        let blockColor = '#1e293b';
        let emissive = '#000000';
        let emissiveIntensity = 0;

        if (isFound && isSelected) {
          blockColor = '#10b981';
          emissive = '#10b981';
          emissiveIntensity = 0.8;
        } else if (isSelected || isCurrentMid) {
          blockColor = '#38bdf8';
          emissive = '#38bdf8';
          emissiveIntensity = 0.6;
        } else if (isCurrentLow || isCurrentHigh) {
          blockColor = '#f59e0b';
          emissive = '#f59e0b';
          emissiveIntensity = 0.4;
        } else if (isOutOfRange) {
          blockColor = '#0f172a';
        }

        const posX = (idx - (arr.length - 1) / 2) * 1.4;
        const posY = (isSelected || isCurrentMid) ? 0.3 : 0;

        return (
          <SmoothMemoryBlock
            key={`search-block-${idx}`}
            targetX={posX}
            targetY={posY}
            val={val}
            idx={idx}
            blockColor={blockColor}
            emissive={emissive}
            emissiveIntensity={emissiveIntensity}
            isOutOfRange={isOutOfRange}
            isCurrentLow={isCurrentLow}
            isCurrentHigh={isCurrentHigh}
            isCurrentMid={isCurrentMid}
            algorithmId={algorithmId}
            mid={mid}
          />
        );
      })}
    </group>
  );
}
