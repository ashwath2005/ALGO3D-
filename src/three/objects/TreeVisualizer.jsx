import React, { useMemo } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useVisualizerStore } from '../../store/useVisualizerStore.js';
import { calculateTreeLayout } from '../../algorithms/trees/treeAlgorithms.js';

function TreeNode3D({ node, activeNodeId, visitedNodeIds, rotationInfo, algorithmId }) {
  if (!node) return null;

  const isActive = activeNodeId === node.id || activeNodeId === node.val;
  const isRotating = rotationInfo && (rotationInfo.nodeVal === node.val || rotationInfo.node === node.val);
  const bf = node.balanceFactor !== undefined ? node.balanceFactor : (node.left?.height || 0) - (node.right?.height || 0);

  let color = '#1e293b';
  let emissive = '#000000';
  let emissiveIntensity = 0;

  if (isRotating) {
    color = '#ec4899';
    emissive = '#ec4899';
    emissiveIntensity = 0.7;
  } else if (isActive) {
    color = '#38bdf8';
    emissive = '#38bdf8';
    emissiveIntensity = 0.6;
  }

  return (
    <group position={[node.x, node.y, node.z]}>
      {/* Node Sphere */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
          roughness={0.2}
          metalness={0.5}
        />
      </mesh>

      {/* Node Value Label & Balance Factor */}
      <Html center distanceFactor={16} style={{ pointerEvents: 'none' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px'
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            fontWeight: 700,
            color: '#ffffff'
          }}>
            {node.val}
          </span>
          <div style={{ display: 'flex', gap: '3px' }}>
            {node.height !== undefined && (
              <span style={{
                fontSize: '8px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--accent-cyan)'
              }}>
                h:{node.height}
              </span>
            )}
            {algorithmId === 'avl-tree' && (
              <span style={{
                fontSize: '8px',
                fontFamily: 'var(--font-mono)',
                color: Math.abs(bf) > 1 ? '#ec4899' : 'var(--accent-emerald)',
                fontWeight: 600
              }}>
                bf:{bf > 0 ? `+${bf}` : bf}
              </span>
            )}
          </div>
        </div>
      </Html>

      {/* Rotation Banner Tag */}
      {isRotating && (
        <Html position={[0, 1.3, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
          <div style={{
            background: 'rgba(236, 72, 153, 0.25)',
            border: '1px solid #ec4899',
            borderRadius: '4px',
            padding: '2px 8px',
            color: '#ffffff',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            whiteSpace: 'nowrap',
            boxShadow: '0 0 12px rgba(236, 72, 153, 0.5)'
          }}>
            {rotationInfo.rotationType || 'AVL'} ROTATION
          </div>
        </Html>
      )}

      {/* Branch Lines to Children */}
      {node.left && (
        <TreeBranch
          startX={0}
          startY={0}
          endX={node.left.x - node.x}
          endY={node.left.y - node.y}
          label="< L"
        />
      )}
      {node.right && (
        <TreeBranch
          startX={0}
          startY={0}
          endX={node.right.x - node.x}
          endY={node.right.y - node.y}
          label="> R"
        />
      )}

      {/* Recursive Children */}
      {node.left && (
        <TreeNode3D
          node={node.left}
          activeNodeId={activeNodeId}
          visitedNodeIds={visitedNodeIds}
          rotationInfo={rotationInfo}
          algorithmId={algorithmId}
        />
      )}
      {node.right && (
        <TreeNode3D
          node={node.right}
          activeNodeId={activeNodeId}
          visitedNodeIds={visitedNodeIds}
          rotationInfo={rotationInfo}
          algorithmId={algorithmId}
        />
      )}
    </group>
  );
}

function TreeBranch({ startX, startY, endX, endY, label }) {
  const { linePos, length, angle } = useMemo(() => {
    const dx = endX - startX;
    const dy = endY - startY;
    const len = Math.sqrt(dx * dx + dy * dy);
    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2;
    const rot = Math.atan2(dy, dx) - Math.PI / 2;
    return {
      linePos: [midX, midY, 0],
      length: len,
      angle: rot
    };
  }, [startX, startY, endX, endY]);

  return (
    <group position={linePos} rotation={[0, 0, angle]}>
      <mesh>
        <cylinderGeometry args={[0.04, 0.04, length, 8]} />
        <meshStandardMaterial color="#475569" emissive="#38bdf8" emissiveIntensity={0.15} />
      </mesh>
    </group>
  );
}

export function TreeVisualizer() {
  const steps = useVisualizerStore((s) => s.steps);
  const currentStepIndex = useVisualizerStore((s) => s.currentStepIndex);
  const activeState = useVisualizerStore((s) => s.activeState);
  const algorithmId = useVisualizerStore((s) => s.algorithmId);

  // Extract active tree root from step snapshot or generate layout
  const treeRoot = useMemo(() => {
    if (currentStepIndex >= 0 && steps[currentStepIndex]?.nodes?.[0]) {
      const root = steps[currentStepIndex].nodes[0];
      calculateTreeLayout(root);
      return root;
    }
    return null;
  }, [steps, currentStepIndex]);

  return (
    <group position={[0, 2.5, 0]}>
      {treeRoot ? (
        <TreeNode3D
          node={treeRoot}
          activeNodeId={activeState.activeNodes?.[0]}
          visitedNodeIds={activeState.visitedIndices}
          rotationInfo={activeState.rotationInfo}
          algorithmId={algorithmId}
        />
      ) : (
        <Html center distanceFactor={14}>
          <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
            Tree is ready. Step forward or play to build structure.
          </div>
        </Html>
      )}
    </group>
  );
}
