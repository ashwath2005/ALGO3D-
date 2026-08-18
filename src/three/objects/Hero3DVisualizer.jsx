import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Hero3DVisualizer() {
  const groupRef = useRef();
  const ringRef = useRef();
  const coreRef = useRef();

  // Create nodes for a 3D geometric algorithm helix / graph ring
  const nodes = useMemo(() => {
    const list = [];
    const count = 16;
    const radius = 5.2;

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const height = Math.sin(i * 1.2) * 1.4;
      list.push({
        id: i,
        x: Math.cos(angle) * radius,
        y: height,
        z: Math.sin(angle) * radius,
        val: ((i * 17) % 89) + 10,
        color: i % 3 === 0 ? '#38bdf8' : i % 3 === 1 ? '#10b981' : '#a855f7'
      });
    }
    return list;
  }, []);

  // Ambient floating animation
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.18;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.08;
    }
    if (ringRef.current) {
      ringRef.current.rotation.y -= delta * 0.35;
      ringRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.5) * 0.15;
    }
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.5;
      coreRef.current.rotation.x += delta * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.4, 0]}>
      {/* 1. Floating Quantum Core Geometric Polyhedron */}
      <group ref={coreRef} position={[0, 0, 0]}>
        <mesh>
          <octahedronGeometry args={[1.3, 0]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#38bdf8"
            emissiveIntensity={0.8}
            wireframe
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.55, 24, 24]} />
          <meshStandardMaterial
            color="#10b981"
            emissive="#10b981"
            emissiveIntensity={0.9}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* 2. Gyroscopic Energy Orbit Ring */}
      <group ref={ringRef} position={[0, 0, 0]}>
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[3.6, 0.03, 16, 64]} />
          <meshBasicMaterial color="#a855f7" transparent opacity={0.6} />
        </mesh>
      </group>

      {/* 3. Graph Edge Beams connecting circular nodes */}
      {nodes.map((node, i) => {
        const next = nodes[(i + 1) % nodes.length];
        const mid = [(node.x + next.x) / 2, (node.y + next.y) / 2, (node.z + next.z) / 2];
        const len = Math.hypot(next.x - node.x, next.y - node.y, next.z - node.z);

        return (
          <group key={`edge-${i}`}>
            <mesh position={mid}>
              <cylinderGeometry args={[0.02, 0.02, len, 8]} />
              <meshBasicMaterial color="#1e293b" transparent opacity={0.4} />
            </mesh>

            {/* Inner Core Connection */}
            {i % 2 === 0 && (
              <mesh position={[node.x / 2, node.y / 2, node.z / 2]}>
                <cylinderGeometry args={[0.015, 0.015, Math.hypot(node.x, node.y, node.z), 6]} />
                <meshBasicMaterial color="#38bdf8" transparent opacity={0.25} />
              </mesh>
            )}
          </group>
        );
      })}

      {/* 4. Sculpted 3D Algorithm Nodes */}
      {nodes.map((node) => (
        <group key={`node-${node.id}`} position={[node.x, node.y, node.z]}>
          <mesh>
            <sphereGeometry args={[0.26, 20, 20]} />
            <meshStandardMaterial
              color={node.color}
              emissive={node.color}
              emissiveIntensity={0.7}
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>

          {/* Outer Pulse Halo Ring */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.34, 0.4, 20]} />
            <meshBasicMaterial color={node.color} transparent opacity={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
