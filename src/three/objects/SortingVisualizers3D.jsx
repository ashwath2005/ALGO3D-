import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useVisualizerStore } from '../../store/useVisualizerStore.js';

/**
 * Universal High-Performance Damped 3D Sort Bar
 * Glides smoothly across the array when swapped or shifted.
 */
function AnimatedSortBar({
  targetX,
  targetY,
  targetZ = 0,
  width = 1.0,
  height,
  depth = 1.0,
  color,
  emissive,
  emissiveIntensity = 0,
  roughness = 0.2,
  metalness = 0.35,
  val,
  badgeText = null,
  badgeColor = null,
  isLifted = false
}) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      const liftOffset = isLifted ? 0.35 : 0;
      groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, targetX, 16, delta);
      groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, targetY + liftOffset, 16, delta);
      groupRef.current.position.z = THREE.MathUtils.damp(groupRef.current.position.z, targetZ, 16, delta);
    }
  });

  return (
    <group ref={groupRef} position={[targetX, targetY, targetZ]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>

      {badgeText && (
        <Html position={[0, height / 2 + 0.45, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
          <span style={{
            fontSize: '7px',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            color: badgeColor || '#f59e0b',
            background: '#000000',
            padding: '1px 4px',
            borderRadius: '2px',
            border: `1px solid ${badgeColor || '#f59e0b'}`,
            whiteSpace: 'nowrap'
          }}>
            {badgeText}
          </span>
        </Html>
      )}

      <Html position={[0, height / 2 + 0.3, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: '#ffffff' }}>
          {val}
        </span>
      </Html>
    </group>
  );
}

/**
 * Universal Smooth Positioned Group for Arch / Divider / Marker overlays
 */
function SmoothGroup({ targetPosition, children }) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, targetPosition[0], 16, delta);
      groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, targetPosition[1], 16, delta);
      groupRef.current.position.z = THREE.MathUtils.damp(groupRef.current.position.z, targetPosition[2], 16, delta);
    }
  });

  return (
    <group ref={groupRef} position={targetPosition}>
      {children}
    </group>
  );
}

// ==========================================
// 1. BUBBLE SORT — "ADJACENT COMPARISON & SETTLED SUFFIX"
// ==========================================
export function BubbleSort3D() {
  const data = useVisualizerStore((s) => s.data);
  const currentStep = useVisualizerStore((s) => s.currentStep);
  const activeIndices = currentStep?.targets?.indices || [];
  const isSwap = currentStep?.type === 'SWAP';
  const arr = Array.isArray(data) ? data : [];
  const variables = currentStep?.variables || {};
  const pass = variables.i ?? 0;
  const sortedBoundary = Math.max(0, arr.length - pass);

  // Dynamic arch height based on active compared bars
  let archX = 0;
  let archY = 3.0;
  if (activeIndices.length === 2 && Math.abs(activeIndices[0] - activeIndices[1]) === 1) {
    const h0 = Math.max(0.6, ((arr[activeIndices[0]] || 50) / 100) * 3.2);
    const h1 = Math.max(0.6, ((arr[activeIndices[1]] || 50) / 100) * 3.2);
    archY = Math.max(h0, h1) + 0.35;
    archX = ((activeIndices[0] + activeIndices[1]) / 2 - (arr.length - 1) / 2) * 1.35;
  }

  return (
    <group position={[0, -1.8, 0]}>
      <gridHelper args={[24, 24, '#1f2937', '#111827']} position={[0, -0.05, 0]} />

      {/* Comparison Arch snug over compared pair */}
      {activeIndices.length === 2 && Math.abs(activeIndices[0] - activeIndices[1]) === 1 && (
        <SmoothGroup targetPosition={[archX, archY, 0]}>
          <mesh>
            <torusGeometry args={[0.55, 0.035, 16, 32, Math.PI]} />
            <meshStandardMaterial
              color={isSwap ? '#ec4899' : '#f59e0b'}
              emissive={isSwap ? '#ec4899' : '#f59e0b'}
              emissiveIntensity={0.8}
            />
          </mesh>
          <Html position={[0, 0.25, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '8px',
              fontWeight: 700,
              color: isSwap ? '#ec4899' : '#f59e0b',
              background: 'rgba(0,0,0,0.9)',
              padding: '1px 4px',
              borderRadius: '2px',
              border: `1px solid ${isSwap ? '#ec4899' : '#f59e0b'}`,
              whiteSpace: 'nowrap'
            }}>
              {isSwap ? 'SWAP ➔' : 'COMPARE'}
            </span>
          </Html>
        </SmoothGroup>
      )}

      {/* Settled Suffix Marker */}
      {sortedBoundary < arr.length && (
        <SmoothGroup targetPosition={[(sortedBoundary - 0.5 - (arr.length - 1) / 2) * 1.35, 1.4, 0]}>
          <mesh>
            <boxGeometry args={[0.04, 2.8, 1.2]} />
            <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.4} transparent opacity={0.5} />
          </mesh>
          <Html position={[0, 1.55, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
            <span style={{
              fontSize: '7px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              color: '#10b981',
              background: 'rgba(0,0,0,0.85)',
              padding: '1px 3px',
              borderRadius: '2px',
              border: '1px solid #10b981',
              whiteSpace: 'nowrap'
            }}>
              SETTLED
            </span>
          </Html>
        </SmoothGroup>
      )}

      {arr.map((val, idx) => {
        const isCompared = activeIndices.includes(idx);
        const height = Math.max(0.6, (val / 100) * 3.2);
        const posX = (idx - (arr.length - 1) / 2) * 1.35;
        const isPermanentlySorted = idx >= sortedBoundary || currentStep?.type === 'COMPLETE';

        let color = isPermanentlySorted ? '#10b981' : isCompared ? (isSwap ? '#ec4899' : '#f59e0b') : '#1e293b';
        let emissive = isCompared ? color : isPermanentlySorted ? '#10b981' : '#000000';
        let emissiveIntensity = isCompared || isPermanentlySorted ? 0.6 : 0;

        return (
          <AnimatedSortBar
            key={`bubble-${idx}`}
            targetX={posX}
            targetY={height / 2}
            width={1.0}
            height={height}
            depth={1.0}
            color={color}
            emissive={emissive}
            emissiveIntensity={emissiveIntensity}
            val={val}
            isLifted={isCompared && isSwap}
          />
        );
      })}
    </group>
  );
}

// ==========================================
// 2. SELECTION SORT — "SORTED PREFIX & MINIMUM SCAN"
// ==========================================
export function SelectionSort3D() {
  const data = useVisualizerStore((s) => s.data);
  const currentStep = useVisualizerStore((s) => s.currentStep);
  const activeIndices = currentStep?.targets?.indices || [];
  const arr = Array.isArray(data) ? data : [];
  const variables = currentStep?.variables || {};
  const minIdx = variables.minIdx !== undefined ? variables.minIdx : activeIndices[1];
  const scanIdx = variables.j !== undefined ? variables.j : activeIndices[0];
  const sortedPrefixEnd = variables.i ?? 0;

  return (
    <group position={[0, -1.8, 0]}>
      <gridHelper args={[24, 24, '#1f2937', '#111827']} position={[0, -0.05, 0]} />

      {/* Sorted vs Unsorted Region Divider Wall */}
      {sortedPrefixEnd > 0 && (
        <SmoothGroup targetPosition={[(sortedPrefixEnd - 0.5 - (arr.length - 1) / 2) * 1.35, 1.4, 0]}>
          <mesh>
            <boxGeometry args={[0.04, 2.8, 1.2]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.6} transparent opacity={0.5} />
          </mesh>
          <Html position={[0, 1.55, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
            <span style={{
              fontSize: '7px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              color: '#38bdf8',
              background: 'rgba(0,0,0,0.85)',
              padding: '1px 3px',
              borderRadius: '2px',
              border: '1px solid #38bdf8',
              whiteSpace: 'nowrap'
            }}>
              SORTED | UNSORTED
            </span>
          </Html>
        </SmoothGroup>
      )}

      {arr.map((val, idx) => {
        const isMin = idx === minIdx;
        const isScanning = idx === scanIdx;
        const isSorted = idx < sortedPrefixEnd || currentStep?.type === 'COMPLETE';
        const height = Math.max(0.6, (val / 100) * 3.2);
        const posX = (idx - (arr.length - 1) / 2) * 1.35;

        let color = isSorted ? '#10b981' : isMin ? '#f59e0b' : isScanning ? '#38bdf8' : '#1e293b';
        let emissive = isSorted ? '#10b981' : isMin || isScanning ? color : '#000000';

        return (
          <AnimatedSortBar
            key={`selection-${idx}`}
            targetX={posX}
            targetY={height / 2}
            width={1.0}
            height={height}
            depth={1.0}
            color={color}
            emissive={emissive}
            emissiveIntensity={0.6}
            val={val}
            badgeText={isMin && !isSorted ? 'MIN' : null}
            badgeColor="#f59e0b"
            isLifted={isMin && !isSorted}
          />
        );
      })}
    </group>
  );
}

// ==========================================
// 3. INSERTION SORT — "LIFT, SHIFT & INSERT"
// ==========================================
export function InsertionSort3D() {
  const data = useVisualizerStore((s) => s.data);
  const currentStep = useVisualizerStore((s) => s.currentStep);
  const activeIndices = currentStep?.targets?.indices || [];
  const arr = Array.isArray(data) ? data : [];
  const activeKeyIdx = activeIndices[0];

  return (
    <group position={[0, -1.8, 0]}>
      <gridHelper args={[24, 24, '#1f2937', '#111827']} position={[0, -0.05, 0]} />

      {arr.map((val, idx) => {
        const isLifted = idx === activeKeyIdx && (currentStep?.type === 'VISIT' || currentStep?.type === 'COMPARE');
        const height = Math.max(0.8, (val / 100) * 3.0);
        const posX = (idx - (arr.length - 1) / 2) * 1.35;
        const posY = isLifted ? height / 2 + 1.2 : height / 2;

        let color = isLifted ? '#38bdf8' : activeIndices.includes(idx) ? '#f59e0b' : '#1e293b';

        return (
          <AnimatedSortBar
            key={`insertion-${idx}`}
            targetX={posX}
            targetY={posY}
            width={1.05}
            height={height}
            depth={0.5}
            color={color}
            emissive={isLifted ? '#38bdf8' : activeIndices.includes(idx) ? '#f59e0b' : '#000000'}
            emissiveIntensity={isLifted ? 0.8 : activeIndices.includes(idx) ? 0.5 : 0}
            val={val}
            badgeText={isLifted ? 'KEY' : null}
            badgeColor="#38bdf8"
          />
        );
      })}
    </group>
  );
}

// ==========================================
// 4. QUICK SORT — "PARTITION ARENA & PIVOT PEDESTAL"
// ==========================================
export function QuickSort3D() {
  const data = useVisualizerStore((s) => s.data);
  const currentStep = useVisualizerStore((s) => s.currentStep);
  const activeIndices = currentStep?.targets?.indices || [];
  const arr = Array.isArray(data) ? data : [];
  const variables = currentStep?.variables || {};
  const pivotIdx = variables.pivotIdx !== undefined ? variables.pivotIdx : activeIndices[activeIndices.length - 1];
  const low = variables.low;
  const high = variables.high;

  return (
    <group position={[0, -1.8, 0]}>
      <gridHelper args={[24, 24, '#1f2937', '#111827']} position={[0, -0.05, 0]} />

      {/* Subarray Boundary Brackets */}
      {low !== undefined && high !== undefined && (
        <SmoothGroup targetPosition={[((low + high) / 2 - (arr.length - 1) / 2) * 1.35, 3.4, 0]}>
          <mesh>
            <boxGeometry args={[(high - low + 1) * 1.35, 0.06, 0.2]} />
            <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={0.6} />
          </mesh>
          <Html position={[0, 0.3, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
            <span style={{ fontSize: '8px', fontFamily: 'var(--font-mono)', color: '#a855f7', background: '#000', padding: '1px 4px', borderRadius: '2px', border: '1px solid #a855f7' }}>
              PARTITION [{low}..{high}]
            </span>
          </Html>
        </SmoothGroup>
      )}

      {arr.map((val, idx) => {
        const isPivot = idx === pivotIdx;
        const isCompared = activeIndices.includes(idx);
        const height = Math.max(0.6, (val / 100) * 3.0);
        const posX = (idx - (arr.length - 1) / 2) * 1.35;
        const posY = isPivot ? height / 2 + 0.4 : height / 2;

        let color = isPivot ? '#a855f7' : isCompared ? '#38bdf8' : '#1e293b';

        return (
          <AnimatedSortBar
            key={`quick-${idx}`}
            targetX={posX}
            targetY={posY}
            width={1.0}
            height={height}
            depth={1.0}
            color={color}
            emissive={isPivot ? '#a855f7' : isCompared ? '#38bdf8' : '#000000'}
            emissiveIntensity={isPivot || isCompared ? 0.6 : 0}
            val={val}
            badgeText={isPivot ? 'PIVOT' : null}
            badgeColor="#a855f7"
          />
        );
      })}
    </group>
  );
}

// ==========================================
// 5. MERGE SORT — "DIVIDE & MERGE RIBBONS"
// ==========================================
export function MergeSort3D() {
  const data = useVisualizerStore((s) => s.data);
  const currentStep = useVisualizerStore((s) => s.currentStep);
  const activeIndices = currentStep?.targets?.indices || [];
  const arr = Array.isArray(data) ? data : [];
  const isMerging = currentStep?.type === 'MERGE' || currentStep?.type === 'OVERWRITE';

  return (
    <group position={[0, -1.8, 0]}>
      <gridHelper args={[24, 24, '#1f2937', '#111827']} position={[0, -0.05, 0]} />

      <group position={[0, 0, 0]}>
        {arr.map((val, idx) => {
          const isTarget = activeIndices.includes(idx);
          const height = Math.max(0.6, (val / 100) * 3.0);
          const posX = (idx - (arr.length - 1) / 2) * 1.35;
          const posZ = isTarget ? (isMerging ? 0.7 : -0.7) : 0;

          let color = isTarget ? (isMerging ? '#10b981' : '#38bdf8') : '#1e293b';

          return (
            <AnimatedSortBar
              key={`merge-${idx}`}
              targetX={posX}
              targetY={height / 2}
              targetZ={posZ}
              width={1.0}
              height={height}
              depth={1.0}
              color={color}
              emissive={isTarget ? color : '#000000'}
              emissiveIntensity={isTarget ? 0.6 : 0}
              val={val}
            />
          );
        })}
      </group>
    </group>
  );
}

// ==========================================
// 6. HEAP SORT — "DUAL HEAP TREE & RUNWAY"
// ==========================================
function AnimatedHeapNode({ targetX, targetY, val, isRoot, isTarget }) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, targetX, 16, delta);
      groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, targetY, 16, delta);
    }
  });

  return (
    <group ref={groupRef} position={[targetX, targetY, 0]}>
      <mesh castShadow>
        <sphereGeometry args={[0.38, 24, 24]} />
        <meshStandardMaterial
          color={isRoot ? '#a855f7' : isTarget ? '#38bdf8' : '#1e293b'}
          emissive={isRoot ? '#a855f7' : isTarget ? '#38bdf8' : '#000000'}
          emissiveIntensity={0.6}
          roughness={0.2}
        />
      </mesh>
      <Html center distanceFactor={14} style={{ pointerEvents: 'none' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, color: '#ffffff' }}>
          {val}
        </span>
      </Html>
    </group>
  );
}

export function HeapSort3D() {
  const data = useVisualizerStore((s) => s.data);
  const currentStep = useVisualizerStore((s) => s.currentStep);
  const activeIndices = currentStep?.targets?.indices || [];
  const arr = Array.isArray(data) ? data : [];

  return (
    <group position={[0, -1.8, 0]}>
      <gridHelper args={[24, 24, '#1f2937', '#111827']} position={[0, -0.05, 0]} />

      {/* Upper 3D Binary Heap Tree Layer */}
      <group position={[0, 2.6, 0]}>
        {arr.slice(0, 7).map((val, idx) => {
          const depth = Math.floor(Math.log2(idx + 1));
          const levelIdx = idx - (Math.pow(2, depth) - 1);
          const totalAtDepth = Math.pow(2, depth);
          const posX = (levelIdx - (totalAtDepth - 1) / 2) * (6.5 / (depth + 1));
          const posY = -depth * 1.0;
          const isTarget = activeIndices.includes(idx);

          return (
            <AnimatedHeapNode
              key={`heap-node-${idx}`}
              targetX={posX}
              targetY={posY}
              val={val}
              isRoot={idx === 0}
              isTarget={isTarget}
            />
          );
        })}
      </group>

      {/* Lower Array Runway */}
      <group position={[0, 0, 1.8]}>
        {arr.map((val, idx) => {
          const isTarget = activeIndices.includes(idx);
          const posX = (idx - (arr.length - 1) / 2) * 1.35;

          return (
            <AnimatedSortBar
              key={`heap-arr-${idx}`}
              targetX={posX}
              targetY={0.4}
              width={1.0}
              height={0.8}
              depth={1.0}
              color={isTarget ? '#38bdf8' : '#1e293b'}
              emissive={isTarget ? '#38bdf8' : '#000000'}
              emissiveIntensity={0.5}
              val={val}
            />
          );
        })}
      </group>
    </group>
  );
}

// ==========================================
// 7. SHELL SORT — "GAP SEQUENCE ARCHES"
// ==========================================
export function ShellSort3D() {
  const data = useVisualizerStore((s) => s.data);
  const currentStep = useVisualizerStore((s) => s.currentStep);
  const activeIndices = currentStep?.targets?.indices || [];
  const variables = currentStep?.variables || {};
  const gap = variables.gap || 1;
  const arr = Array.isArray(data) ? data : [];

  return (
    <group position={[0, -1.8, 0]}>
      <gridHelper args={[24, 24, '#1f2937', '#111827']} position={[0, -0.05, 0]} />

      {/* Gap Arch Over Connected Pair */}
      {activeIndices.length === 2 && (
        <SmoothGroup targetPosition={[((activeIndices[0] + activeIndices[1]) / 2 - (arr.length - 1) / 2) * 1.35, 3.0, 0]}>
          <mesh>
            <torusGeometry args={[(Math.abs(activeIndices[0] - activeIndices[1]) * 1.35) / 2, 0.035, 16, 32, Math.PI]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.8} />
          </mesh>
          <Html position={[0, 0.35, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
            <span style={{ fontSize: '8px', fontFamily: 'var(--font-mono)', color: '#38bdf8', background: '#000', padding: '1px 4px', borderRadius: '2px', border: '1px solid #38bdf8' }}>
              GAP = {gap}
            </span>
          </Html>
        </SmoothGroup>
      )}

      {arr.map((val, idx) => {
        const isTarget = activeIndices.includes(idx);
        const height = Math.max(0.6, (val / 100) * 3.0);
        const posX = (idx - (arr.length - 1) / 2) * 1.35;

        return (
          <AnimatedSortBar
            key={`shell-${idx}`}
            targetX={posX}
            targetY={height / 2}
            width={1.0}
            height={height}
            depth={1.0}
            color={isTarget ? '#38bdf8' : '#1e293b'}
            emissive={isTarget ? '#38bdf8' : '#000000'}
            emissiveIntensity={isTarget ? 0.6 : 0}
            val={val}
          />
        );
      })}
    </group>
  );
}

// ==========================================
// 8. COCKTAIL SHAKER SORT — "TWO-WAY SCAN BEACON"
// ==========================================
export function CocktailSort3D() {
  const data = useVisualizerStore((s) => s.data);
  const currentStep = useVisualizerStore((s) => s.currentStep);
  const activeIndices = currentStep?.targets?.indices || [];
  const variables = currentStep?.variables || {};
  const direction = variables.direction || 'forward';
  const arr = Array.isArray(data) ? data : [];

  return (
    <group position={[0, -1.8, 0]}>
      <gridHelper args={[24, 24, '#1f2937', '#111827']} position={[0, -0.05, 0]} />

      {arr.map((val, idx) => {
        const isTarget = activeIndices.includes(idx);
        const height = Math.max(0.6, (val / 100) * 3.0);
        const posX = (idx - (arr.length - 1) / 2) * 1.35;
        let color = isTarget ? (direction === 'forward' ? '#38bdf8' : '#f59e0b') : '#1e293b';

        return (
          <AnimatedSortBar
            key={`cocktail-${idx}`}
            targetX={posX}
            targetY={height / 2}
            width={1.0}
            height={height}
            depth={1.0}
            color={color}
            emissive={isTarget ? color : '#000000'}
            emissiveIntensity={isTarget ? 0.6 : 0}
            val={val}
          />
        );
      })}
    </group>
  );
}

// ==========================================
// 9. COMB SORT — "SHRINKING COMB BRIDGE"
// ==========================================
export function CombSort3D() {
  const data = useVisualizerStore((s) => s.data);
  const currentStep = useVisualizerStore((s) => s.currentStep);
  const activeIndices = currentStep?.targets?.indices || [];
  const variables = currentStep?.variables || {};
  const gap = variables.gap || 1;
  const arr = Array.isArray(data) ? data : [];

  return (
    <group position={[0, -1.8, 0]}>
      <gridHelper args={[24, 24, '#1f2937', '#111827']} position={[0, -0.05, 0]} />

      {/* Comb Horizontal Bar & Teeth */}
      {activeIndices.length === 2 && (
        <SmoothGroup targetPosition={[((activeIndices[0] + activeIndices[1]) / 2 - (arr.length - 1) / 2) * 1.35, 3.2, 0]}>
          <mesh>
            <boxGeometry args={[Math.abs(activeIndices[1] - activeIndices[0]) * 1.35, 0.08, 0.3]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.8} />
          </mesh>
          <Html position={[0, 0.3, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
            <span style={{ fontSize: '8px', fontFamily: 'var(--font-mono)', color: '#38bdf8', background: '#000', padding: '1px 3px', borderRadius: '2px', border: '1px solid #38bdf8' }}>
              COMB GAP = {gap}
            </span>
          </Html>
        </SmoothGroup>
      )}

      {arr.map((val, idx) => {
        const isTarget = activeIndices.includes(idx);
        const height = Math.max(0.6, (val / 100) * 3.0);
        const posX = (idx - (arr.length - 1) / 2) * 1.35;

        return (
          <AnimatedSortBar
            key={`comb-${idx}`}
            targetX={posX}
            targetY={height / 2}
            width={1.0}
            height={height}
            depth={1.0}
            color={isTarget ? '#38bdf8' : '#1e293b'}
            emissive={isTarget ? '#38bdf8' : '#000000'}
            emissiveIntensity={isTarget ? 0.6 : 0}
            val={val}
          />
        );
      })}
    </group>
  );
}

// ==========================================
// 10. GNOME SORT — "GNOME CURSOR BEACON"
// ==========================================
export function GnomeSort3D() {
  const data = useVisualizerStore((s) => s.data);
  const currentStep = useVisualizerStore((s) => s.currentStep);
  const activeIndices = currentStep?.targets?.indices || [];
  const variables = currentStep?.variables || {};
  const pos = variables.pos !== undefined ? variables.pos : activeIndices[0] || 0;
  const arr = Array.isArray(data) ? data : [];

  return (
    <group position={[0, -1.8, 0]}>
      <gridHelper args={[24, 24, '#1f2937', '#111827']} position={[0, -0.05, 0]} />

      {/* 3D Gnome Cursor Beacon */}
      <SmoothGroup targetPosition={[(pos - (arr.length - 1) / 2) * 1.35, 3.2, 0]}>
        <mesh>
          <coneGeometry args={[0.25, 0.55, 16]} />
          <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.8} />
        </mesh>
        <Html position={[0, 0.5, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
          <span style={{ fontSize: '8px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#10b981', background: '#000', padding: '1px 3px', borderRadius: '2px', border: '1px solid #10b981' }}>
            GNOME
          </span>
        </Html>
      </SmoothGroup>

      {arr.map((val, idx) => {
        const isTarget = activeIndices.includes(idx);
        const isAtGnome = idx === pos;
        const height = Math.max(0.6, (val / 100) * 3.0);
        const posX = (idx - (arr.length - 1) / 2) * 1.35;

        return (
          <AnimatedSortBar
            key={`gnome-${idx}`}
            targetX={posX}
            targetY={height / 2}
            width={1.0}
            height={height}
            depth={1.0}
            color={isAtGnome ? '#10b981' : isTarget ? '#f59e0b' : '#1e293b'}
            emissive={isAtGnome ? '#10b981' : isTarget ? '#f59e0b' : '#000000'}
            emissiveIntensity={isAtGnome || isTarget ? 0.6 : 0}
            val={val}
          />
        );
      })}
    </group>
  );
}
