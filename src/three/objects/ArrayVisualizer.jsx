import React, { useRef, useEffect } from 'react';
import { Html } from '@react-three/drei';
import gsap from 'gsap';
import { useVisualizerStore } from '../../store/useVisualizerStore.js';
import { resolveVisualState, getVisualStateTheme, VISUAL_STATES } from '../../algorithms/engine/ExecutionEngine.js';
import { animationController } from '../../animations/AnimationController.js';

function ArrayBar({ index, value, total, currentStep, isBinarySearch }) {
  const meshRef = useRef();
  const targetX = (index - (total - 1) / 2) * 1.35;
  const height = Math.max(0.6, (value / 100) * 5.2);
  const posY = height / 2;

  const selectedObject = useVisualizerStore((s) => s.selectedObject);
  const select3DObject = useVisualizerStore((s) => s.select3DObject);
  const isSelected = selectedObject?.type === 'array_element' && selectedObject?.index === index;

  // Resolve visual state from execution engine
  const visualState = resolveVisualState(currentStep, 'index', index);
  const theme = getVisualStateTheme(visualState);

  // Version-safe GSAP position translation
  useEffect(() => {
    if (meshRef.current) {
      const version = animationController.getVersion();
      gsap.to(meshRef.current.position, {
        x: targetX,
        y: posY,
        duration: 0.38,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    }
  }, [targetX, posY]);

  return (
    <group>
      <mesh
        ref={meshRef}
        position={[targetX, posY, 0]}
        castShadow
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          select3DObject({ type: 'array_element', index, value });
        }}
      >
        <boxGeometry args={[0.9, height, 0.9]} />
        <meshStandardMaterial
          color={isSelected ? '#38bdf8' : theme.color}
          emissive={isSelected ? '#38bdf8' : theme.emissive}
          emissiveIntensity={isSelected ? 0.8 : theme.intensity}
          roughness={0.25}
          metalness={0.4}
        />

        {/* Selected wireframe halo */}
        {isSelected && (
          <mesh>
            <boxGeometry args={[0.98, height + 0.08, 0.98]} />
            <meshBasicMaterial color="#38bdf8" wireframe />
          </mesh>
        )}

        {/* Top cap glow rim */}
        <mesh position={[0, height / 2 + 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.88, 0.88]} />
          <meshBasicMaterial
            color={isSelected ? '#38bdf8' : (theme.intensity > 0 ? theme.color : '#404040')}
            transparent
            opacity={0.8}
          />
        </mesh>
      </mesh>

      {/* Floating 3D Text / HTML Badges */}
      <Html
        position={[targetX, height + 0.55, 0]}
        center
        distanceFactor={15}
        style={{ pointerEvents: 'none', transition: 'all 0.25s ease' }}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px'
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            fontWeight: 600,
            color: isSelected ? '#38bdf8' : (theme.intensity > 0 ? '#ffffff' : 'var(--text-secondary)'),
            background: 'rgba(5, 5, 5, 0.85)',
            padding: '1px 5px',
            borderRadius: '4px',
            border: `1px solid ${isSelected ? 'var(--accent-cyan)' : (theme.intensity > 0 ? theme.color : 'rgba(255,255,255,0.1)')}`,
            boxShadow: isSelected ? '0 0 12px var(--accent-cyan-glow)' : (theme.intensity > 0 ? `0 0 10px ${theme.color}` : 'none')
          }}>
            {value}
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            color: isSelected ? 'var(--accent-cyan)' : 'var(--text-muted)'
          }}>
            [{index}]
          </span>
        </div>
      </Html>
    </group>
  );
}

export function ArrayVisualizer() {
  const data = useVisualizerStore((s) => s.data);
  const currentStep = useVisualizerStore((s) => s.currentStep);
  const algorithmId = useVisualizerStore((s) => s.algorithmId);

  const isBinarySearch = algorithmId === 'binary-search';
  const arrayData = Array.isArray(data) ? data : [];

  return (
    <group position={[0, 0, 0]}>
      {/* Ground Grid Pedestal */}
      <gridHelper
        args={[24, 24, '#1f2937', '#111827']}
        position={[0, -0.01, 0]}
      />

      {arrayData.map((val, idx) => (
        <ArrayBar
          key={`bar-${idx}`}
          index={idx}
          value={val}
          total={arrayData.length}
          currentStep={currentStep}
          isBinarySearch={isBinarySearch}
        />
      ))}
    </group>
  );
}
