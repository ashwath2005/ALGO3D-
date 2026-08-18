import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSettingsStore } from '../../store/useSettingsStore.js';

export function AmbientParticles({ count = 250 }) {
  const quality = useSettingsStore((s) => s.quality);
  const particlesEnabled = useSettingsStore((s) => s.particles);
  const pointsRef = useRef();

  const particleCount = useMemo(() => {
    if (!particlesEnabled) return 0;
    if (quality === 'low') return 60;
    if (quality === 'medium') return 150;
    return count;
  }, [quality, particlesEnabled, count]);

  const geometry = useMemo(() => {
    if (particleCount <= 0) return null;
    const pos = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 35;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 35;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return geo;
  }, [particleCount]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.02;
      pointsRef.current.rotation.x += delta * 0.005;
    }
  });

  if (!particlesEnabled || !geometry || particleCount === 0) return null;

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.12}
        color="#38bdf8"
        transparent
        opacity={0.35}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}
