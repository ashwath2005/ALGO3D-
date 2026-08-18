import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function CosmicAlgorithmField({ count = 450 }) {
  const pointsRef = useRef();
  const linesRef = useRef();

  // Generate 3D particle points and connecting constellation vectors
  const { pointGeo, lineGeo } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const palette = [
      new THREE.Color('#38bdf8'), // Cyan
      new THREE.Color('#10b981'), // Emerald
      new THREE.Color('#a855f7'), // Purple
      new THREE.Color('#64748b')  // Slate
    ];

    const nodes = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 55;
      const y = (Math.random() - 0.5) * 35;
      const z = -12 + (Math.random() - 0.5) * 25; // Placed deeply in background

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      const c = palette[i % palette.length];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      if (i < 90) {
        nodes.push(new THREE.Vector3(x, y, z));
      }
    }

    // Build sparse connecting filaments between nearby nodes
    const linePositions = [];
    const maxDist = 7.5;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const d = nodes[i].distanceTo(nodes[j]);
        if (d < maxDist) {
          linePositions.push(nodes[i].x, nodes[i].y, nodes[i].z);
          linePositions.push(nodes[j].x, nodes[j].y, nodes[j].z);
        }
      }
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const lGeo = new THREE.BufferGeometry();
    lGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

    return { pointGeo: pGeo, lineGeo: lGeo };
  }, [count]);

  // Smooth ambient cosmological rotation
  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.025;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.03;
    }
    if (linesRef.current) {
      linesRef.current.rotation.y += delta * 0.025;
      linesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.03;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Subtle Constellation Network Lines */}
      <lineSegments ref={linesRef} geometry={lineGeo}>
        <lineBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* 2. Shimmering Particle Constellation Points */}
      <points ref={pointsRef} geometry={pointGeo}>
        <pointsMaterial
          size={0.14}
          vertexColors
          transparent
          opacity={0.65}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  );
}
