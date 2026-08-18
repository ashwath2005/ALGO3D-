import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useVisualizerStore } from '../../store/useVisualizerStore.js';
import { useSettingsStore } from '../../store/useSettingsStore.js';
import { AmbientParticles } from '../particles/AmbientParticles.jsx';
import { CameraController } from '../camera/CameraController.jsx';

// 12 Bespoke Sorting 3D Visualizers
import {
  BubbleSort3D,
  SelectionSort3D,
  InsertionSort3D,
  QuickSort3D,
  MergeSort3D,
  HeapSort3D,
  ShellSort3D,
  CocktailSort3D,
  CombSort3D,
  GnomeSort3D
} from '../objects/SortingVisualizers3D.jsx';
import { FrequencyBucketVisualizer } from '../objects/FrequencyBucketVisualizer.jsx';
import { DigitBucketVisualizer } from '../objects/DigitBucketVisualizer.jsx';

// Searching & Array 3D Visualizers
import { SearchMemoryVisualizer } from '../objects/SearchMemoryVisualizer.jsx';
import { PartitionVisualizer } from '../objects/PartitionVisualizer.jsx';
import { SequencePathVisualizer } from '../objects/SequencePathVisualizer.jsx';

// Data Structures 3D Visualizers
import { LinkedListVisualizer } from '../objects/LinkedListVisualizer.jsx';
import { StackVisualizer, QueueVisualizer } from '../objects/StackQueueVisualizer.jsx';
import { HashTableVisualizer } from '../objects/HashTableVisualizer.jsx';

// Trees & Graphs 3D Visualizers
import { TreeVisualizer } from '../objects/TreeVisualizer.jsx';
import { GraphVisualizer } from '../objects/GraphVisualizer.jsx';

// DP, Backtracking, Math & Spatial 3D Visualizers
import { MatrixGridVisualizer } from '../objects/MatrixGridVisualizer.jsx';
import { NQueensArena3D } from '../objects/NQueensArena3D.jsx';
import { SpatialGeometryVisualizer } from '../objects/SpatialGeometryVisualizer.jsx';
import { IntervalTimelineVisualizer } from '../objects/IntervalTimelineVisualizer.jsx';
import { StringPatternVisualizer } from '../objects/StringPatternVisualizer.jsx';
import { NumberFieldVisualizer } from '../objects/NumberFieldVisualizer.jsx';
import { ArrayVisualizer } from '../objects/ArrayVisualizer.jsx';

export function SceneContainer() {
  const structureType = useVisualizerStore((s) => s.structureType);
  const algorithmId = useVisualizerStore((s) => s.algorithmId);
  const quality = useSettingsStore((s) => s.quality);

  const renderActiveVisualizer = () => {
    // === 1. 12 BESPOKE SORTING ADAPTERS ===
    if (algorithmId === 'bubble-sort') return <BubbleSort3D />;
    if (algorithmId === 'selection-sort') return <SelectionSort3D />;
    if (algorithmId === 'insertion-sort') return <InsertionSort3D />;
    if (algorithmId === 'quick-sort') return <QuickSort3D />;
    if (algorithmId === 'merge-sort') return <MergeSort3D />;
    if (algorithmId === 'heap-sort') return <HeapSort3D />;
    if (algorithmId === 'shell-sort') return <ShellSort3D />;
    if (algorithmId === 'cocktail-shaker-sort') return <CocktailSort3D />;
    if (algorithmId === 'comb-sort') return <CombSort3D />;
    if (algorithmId === 'gnome-sort') return <GnomeSort3D />;
    if (algorithmId === 'counting-sort') return <FrequencyBucketVisualizer />;
    if (algorithmId === 'radix-sort') return <DigitBucketVisualizer />;

    // === 2. 5 BESPOKE SEARCHING & ARRAY ADAPTERS ===
    if (algorithmId === 'dutch-national-flag') return <PartitionVisualizer />;
    if (algorithmId === 'kadanes-algorithm') return <SequencePathVisualizer />;
    if (['linear-search', 'binary-search', 'jump-search', 'interpolation-search', 'ternary-search', 'two-sum-pointer'].includes(algorithmId)) {
      return <SearchMemoryVisualizer />;
    }

    // === 3. 4 DATA STRUCTURE ADAPTERS ===
    if (algorithmId === 'linked-list') return <LinkedListVisualizer />;
    if (algorithmId === 'stack') return <StackVisualizer />;
    if (algorithmId === 'queue') return <QueueVisualizer />;
    if (algorithmId === 'hash-table') return <HashTableVisualizer />;

    // === 4. 2 TREE ADAPTERS ===
    if (algorithmId === 'bst' || algorithmId === 'avl-tree' || structureType === 'tree') {
      return <TreeVisualizer />;
    }

    // === 5. 7 GRAPH ADAPTERS ===
    if (structureType === 'graph') return <GraphVisualizer />;

    // === 6. 5 DP & BACKTRACKING ADAPTERS ===
    if (algorithmId === 'n-queens') return <NQueensArena3D />;
    if (algorithmId === 'activity-selection') return <IntervalTimelineVisualizer />;
    if (algorithmId === 'kmp-search') return <StringPatternVisualizer />;
    if (algorithmId === 'sieve-eratosthenes') return <NumberFieldVisualizer />;
    if (['knapsack-01', 'longest-common-subsequence', 'coin-change-dp', 'matrix-spiral'].includes(algorithmId) || structureType === 'matrix') {
      return <MatrixGridVisualizer />;
    }

    // === 7. SPATIAL & GEOMETRY ===
    if (algorithmId === 'convex-hull-graham' || structureType === 'spatial') {
      return <SpatialGeometryVisualizer />;
    }

    return <ArrayVisualizer />;
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: '#000000', isolation: 'isolate', zIndex: 1 }}>
      <Canvas
        camera={{ position: [0, 3.0, 16], fov: 45 }}
        gl={{
          antialias: quality !== 'low',
          powerPreference: 'high-performance',
          alpha: false
        }}
        dpr={quality === 'high' ? [1, 2] : [1, 1.5]}
      >
        {/* Subtle OLED ambient and key lighting */}
        <ambientLight intensity={0.45} />
        <directionalLight
          position={[10, 15, 10]}
          intensity={1.2}
          castShadow={quality === 'high'}
          shadow-mapSize={1024}
        />
        <pointLight position={[-10, 8, -5]} intensity={0.5} color="#38bdf8" />
        <pointLight position={[5, -5, 5]} intensity={0.3} color="#a855f7" />

        {/* Dynamic Camera Control */}
        <CameraController />
        <OrbitControls
          enableDamping
          dampingFactor={0.06}
          rotateSpeed={0.75}
          zoomSpeed={0.8}
          panSpeed={0.75}
          maxDistance={45}
          minDistance={4}
          maxPolarAngle={Math.PI / 2 + 0.1}
        />

        {/* Ambient Particle Field */}
        <AmbientParticles />

        {/* Active Dedicated 3D Scene */}
        <Suspense fallback={null}>
          {renderActiveVisualizer()}
        </Suspense>
      </Canvas>
    </div>
  );
}
