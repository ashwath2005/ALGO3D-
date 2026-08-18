import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useVisualizerStore } from '../../store/useVisualizerStore.js';

function SmoothStackItem({ posY, val, isTop, color, emissive, emissiveIntensity }) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, posY, 16, delta);
    }
  });

  return (
    <group ref={groupRef} position={[0, posY, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2, 0.8, 1.6]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
          roughness={0.2}
          metalness={0.5}
        />
      </mesh>

      <Html center distanceFactor={15} style={{ pointerEvents: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            fontWeight: 700,
            color: '#ffffff'
          }}>
            {val}
          </span>
          {isTop && (
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              color: 'var(--accent-cyan)',
              background: 'rgba(56, 189, 248, 0.2)',
              padding: '1px 5px',
              borderRadius: '3px'
            }}>TOP</span>
          )}
        </div>
      </Html>
    </group>
  );
}

// --- STACK VISUALIZER ---
export function StackVisualizer() {
  const data = useVisualizerStore((s) => s.data);
  const activeState = useVisualizerStore((s) => s.activeState);

  const stack = Array.isArray(data) ? data : [];

  return (
    <group position={[0, 0, 0]}>
      {/* Acrylic Stack Chamber Rails */}
      <group position={[0, 2.5, 0]}>
        {/* Left Post */}
        <mesh position={[-1.2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 6, 8]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.3} transparent opacity={0.6} />
        </mesh>
        {/* Right Post */}
        <mesh position={[1.2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 6, 8]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.3} transparent opacity={0.6} />
        </mesh>
        {/* Bottom Base */}
        <mesh position={[0, -3, 0]}>
          <boxGeometry args={[2.8, 0.2, 2.2]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} />
        </mesh>
      </group>

      {/* Stack Items */}
      {stack.map((val, idx) => {
        const isTop = idx === stack.length - 1;
        const isHighlighted = activeState.highlightedIndices.includes(idx);
        const isVisited = activeState.visitedIndices.includes(idx);

        let color = '#1e293b';
        let emissive = '#000000';
        let emissiveIntensity = 0;

        if (isHighlighted) {
          color = '#10b981';
          emissive = '#10b981';
          emissiveIntensity = 0.5;
        } else if (isVisited) {
          color = '#f59e0b';
          emissive = '#f59e0b';
          emissiveIntensity = 0.5;
        } else if (isTop) {
          color = '#38bdf8';
          emissive = '#38bdf8';
          emissiveIntensity = 0.35;
        }

        const posY = -0.2 + idx * 0.95;

        return (
          <SmoothStackItem
            key={`stack-item-${idx}-${val}`}
            posY={posY}
            val={val}
            isTop={isTop}
            color={color}
            emissive={emissive}
            emissiveIntensity={emissiveIntensity}
          />
        );
      })}
    </group>
  );
}

function SmoothQueueItem({ targetX, val, color, emissive, emissiveIntensity }) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, targetX, 16, delta);
    }
  });

  return (
    <group ref={groupRef} position={[targetX, 0.8, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.3, 1.2, 1.2]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
          roughness={0.2}
          metalness={0.4}
        />
      </mesh>

      <Html center distanceFactor={15} style={{ pointerEvents: 'none' }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          fontWeight: 700,
          color: '#ffffff'
        }}>
          {val}
        </span>
      </Html>
    </group>
  );
}

// --- QUEUE VISUALIZER ---
export function QueueVisualizer() {
  const data = useVisualizerStore((s) => s.data);
  const activeState = useVisualizerStore((s) => s.activeState);

  const queue = Array.isArray(data) ? data : [];

  return (
    <group position={[0, 0, 0]}>
      {/* Conveyor Rails */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[16, 0.1, 2]} />
        <meshStandardMaterial color="#0f172a" roughness={0.6} />
      </mesh>

      {/* FRONT and REAR markers */}
      {queue.length > 0 && (
        <>
          <group position={[-(queue.length - 1) * 0.9 - 1.6, 1, 0]}>
            <Html center distanceFactor={15} style={{ pointerEvents: 'none' }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: 'var(--accent-emerald)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                background: 'rgba(5, 5, 5, 0.8)',
                padding: '2px 6px',
                borderRadius: '4px'
              }}>FRONT ➔</span>
            </Html>
          </group>

          <group position={[(queue.length - 1) * 0.9 + 1.6, 1, 0]}>
            <Html center distanceFactor={15} style={{ pointerEvents: 'none' }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: 'var(--accent-amber)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                background: 'rgba(5, 5, 5, 0.8)',
                padding: '2px 6px',
                borderRadius: '4px'
              }}>➔ REAR</span>
            </Html>
          </group>
        </>
      )}

      {queue.map((val, idx) => {
        const isVisited = activeState.visitedIndices.includes(idx);
        const isHighlighted = activeState.highlightedIndices.includes(idx);

        const targetX = (idx - (queue.length - 1) / 2) * 1.8;

        let color = '#1e293b';
        let emissive = '#000000';
        let emissiveIntensity = 0;

        if (isHighlighted) {
          color = '#10b981';
          emissive = '#10b981';
          emissiveIntensity = 0.5;
        } else if (isVisited) {
          color = '#ec4899';
          emissive = '#ec4899';
          emissiveIntensity = 0.5;
        }

        return (
          <SmoothQueueItem
            key={`q-item-${idx}-${val}`}
            targetX={targetX}
            val={val}
            color={color}
            emissive={emissive}
            emissiveIntensity={emissiveIntensity}
          />
        );
      })}
    </group>
  );
}
