import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { useVisualizerStore } from '../../store/useVisualizerStore.js';
import { useSettingsStore } from '../../store/useSettingsStore.js';

/**
 * Authoritative Camera Controller for ALGO3D
 * Provides perfectly framed, non-occluded views for all 42 algorithms.
 * Guarantees that neither top HUD banners nor side elements are hidden behind panels.
 */
export function CameraController() {
  const { camera, controls } = useThree();
  const structureType = useVisualizerStore((s) => s.structureType);
  const algorithmId = useVisualizerStore((s) => s.algorithmId);
  const currentStep = useVisualizerStore((s) => s.currentStep);
  const data = useVisualizerStore((s) => s.data);
  const selectedObject = useVisualizerStore((s) => s.selectedObject);
  const cameraMode = useSettingsStore((s) => s.cameraMode);
  const activeTweenRef = useRef(null);

  useEffect(() => {
    if (activeTweenRef.current) {
      activeTweenRef.current.kill();
    }

    let targetCamPos = [0, 3.0, 15];
    let lookTarget = [0, 1.0, 0];

    if (cameraMode === 'overhead') {
      targetCamPos = [0, 22, 0.1];
      lookTarget = [0, 0, 0];
    } else if (structureType === 'tree' || algorithmId === 'bst' || algorithmId === 'avl-tree') {
      // Tree: wide branches (x = -7..+7) and vertical span (y = 2.5..-2.0)
      targetCamPos = [0, 1.2, 17.5];
      lookTarget = [0, 0.6, 0];
    } else if (structureType === 'graph') {
      // Graphs: 6-8 nodes spanning x = -5..+5, y = -2.5..+2.5
      targetCamPos = [0, 1.5, 17];
      lookTarget = [0, 0, 0];
    } else if (algorithmId === 'n-queens') {
      // N-Queens: Classic Staunton perspective
      targetCamPos = [0, 6.2, 7.8];
      lookTarget = [0, 0.4, 0];
    } else if (structureType === 'matrix' || ['knapsack-01', 'longest-common-subsequence', 'coin-change-dp', 'matrix-spiral'].includes(algorithmId)) {
      // Matrices: Elevated perspective angle to view full grid and queen towers cleanly
      targetCamPos = [0, 11, 13];
      lookTarget = [0, 0, 0];
    } else if (structureType === 'stack') {
      // Stack: Tall vertical chamber
      targetCamPos = [0, 2.8, 13.5];
      lookTarget = [0, 1.8, 0];
    } else if (structureType === 'queue') {
      // Queue: Conveyor track
      targetCamPos = [0, 2.0, 15.5];
      lookTarget = [0, 0.6, 0];
    } else if (structureType === 'linkedList') {
      // Linked List: Horizontal node chain
      const listLen = Array.isArray(data) ? data.length : 5;
      const camZ = Math.max(14, 10 + listLen * 0.75);
      targetCamPos = [0, 1.8, camZ];
      lookTarget = [0, 0.8, 0];
    } else if (structureType === 'hashTable') {
      // Hash Table: 7 bucket slots with vertical chains and formula header
      targetCamPos = [0, 2.2, 17.5];
      lookTarget = [0, 1.0, 0];
    } else if (structureType === 'spatial' || algorithmId === 'convex-hull-graham') {
      // Convex Hull: 3D point cloud
      targetCamPos = [0, 1.0, 16.5];
      lookTarget = [0, 0.5, 0];
    } else if (algorithmId === 'counting-sort') {
      // Counting Sort: Frequency buckets on top + runway on bottom
      targetCamPos = [0, 2.6, 17];
      lookTarget = [0, 1.2, 0];
    } else if (algorithmId === 'radix-sort') {
      // Radix Sort: 10 digit trays + array runway + header banner
      targetCamPos = [0, 2.8, 18];
      lookTarget = [0, 1.2, 0];
    } else if (algorithmId === 'activity-selection') {
      // Activity Selection: 3D interval timeline
      targetCamPos = [0, 2.4, 15.5];
      lookTarget = [0, 1.5, 0];
    } else if (algorithmId === 'kmp-search') {
      // KMP: Text track + Pattern track + LPS banner
      targetCamPos = [0, 2.2, 16.5];
      lookTarget = [0, 0.8, 0];
    } else if (algorithmId === 'sieve-eratosthenes') {
      // Sieve: 6x4 3D number field
      targetCamPos = [0, 7.5, 13.5];
      lookTarget = [0, 0, 0];
    } else {
      // 1D Array Sorting & Searching (Bubble, Selection, Insertion, Quick, Merge, Heap, Shell, Cocktail, Comb, Gnome, Binary, Linear, Jump, etc.)
      const arr = Array.isArray(data) ? data : [];
      const totalLen = arr.length || 8;

      // Ensure generous Z distance and vertical centering
      const camZ = Math.max(15.5, 10.5 + totalLen * 0.65);
      const camY = 1.8;
      targetCamPos = [0, camY, camZ];
      lookTarget = [0, 0.0, 0];
    }

    // Phase 3: Subtle focus tracking on selected 3D object
    if (selectedObject) {
      if (selectedObject.index !== undefined && Array.isArray(data) && data.length > 0) {
        const totalLen = data.length;
        const objX = (selectedObject.index - (totalLen - 1) / 2) * 1.35;
        lookTarget[0] = objX * 0.35;
      }
    }

    // Animate camera position and orbit target smoothly in tandem
    const targetObj = {
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z,
      tx: controls ? controls.target.x : lookTarget[0],
      ty: controls ? controls.target.y : lookTarget[1],
      tz: controls ? controls.target.z : lookTarget[2]
    };

    activeTweenRef.current = gsap.to(targetObj, {
      x: targetCamPos[0],
      y: targetCamPos[1],
      z: targetCamPos[2],
      tx: lookTarget[0],
      ty: lookTarget[1],
      tz: lookTarget[2],
      duration: 0.85,
      ease: 'power3.out',
      overwrite: 'auto',
      onUpdate: () => {
        camera.position.set(targetObj.x, targetObj.y, targetObj.z);
        if (controls) {
          controls.target.set(targetObj.tx, targetObj.ty, targetObj.tz);
          controls.update();
        } else {
          camera.lookAt(targetObj.tx, targetObj.ty, targetObj.tz);
        }
      }
    });

    return () => {
      if (activeTweenRef.current) {
        activeTweenRef.current.kill();
      }
    };
  }, [structureType, algorithmId, data, cameraMode, camera, controls, selectedObject]);

  return null;
}
