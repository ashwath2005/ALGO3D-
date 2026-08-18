import React, { useMemo } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useVisualizerStore } from '../../store/useVisualizerStore.js';

function GraphNode3D({ node, isVisited, isHighlighted, isSource, isTarget, distance, inDegree, algorithmId, onClick }) {
  let color = '#1e293b';
  let emissive = '#000000';
  let emissiveIntensity = 0;

  if (isSource) {
    color = '#10b981'; // green source
    emissive = '#10b981';
    emissiveIntensity = 0.6;
  } else if (isTarget) {
    color = '#f43f5e'; // red target
    emissive = '#f43f5e';
    emissiveIntensity = 0.6;
  } else if (isHighlighted) {
    color = '#ec4899';
    emissive = '#ec4899';
    emissiveIntensity = 0.6;
  } else if (isVisited) {
    color = '#38bdf8';
    emissive = '#38bdf8';
    emissiveIntensity = 0.5;
  }

  return (
    <group position={[node.x, node.y, node.z]} onClick={onClick}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.65, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
          roughness={0.2}
          metalness={0.5}
        />
      </mesh>

      {/* Outer subtle glow halo */}
      <mesh>
        <sphereGeometry args={[0.78, 16, 16]} />
        <meshBasicMaterial
          color={emissiveIntensity > 0 ? color : '#334155'}
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>

      <Html center distanceFactor={15} style={{ pointerEvents: 'none' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px'
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            fontWeight: 700,
            color: '#ffffff'
          }}>
            {node.label || node.id}
          </span>

          {/* Distance Badge for Dijkstra / Bellman-Ford */}
          {distance !== undefined && (
            <span style={{
              fontSize: '8px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--accent-amber)',
              background: 'rgba(0,0,0,0.85)',
              padding: '1px 4px',
              borderRadius: '2px',
              border: '1px solid #f59e0b'
            }}>
              d: {distance === Infinity ? '∞' : distance}
            </span>
          )}

          {/* In-Degree Badge for Topological Sort */}
          {inDegree !== undefined && algorithmId === 'topological-sort' && (
            <span style={{
              fontSize: '8px',
              fontFamily: 'var(--font-mono)',
              color: inDegree === 0 ? 'var(--accent-emerald)' : 'var(--accent-cyan)',
              background: 'rgba(0,0,0,0.85)',
              padding: '1px 4px',
              borderRadius: '2px',
              border: `1px solid ${inDegree === 0 ? '#10b981' : '#38bdf8'}`
            }}>
              in: {inDegree}
            </span>
          )}

          {isSource && (
            <span style={{ fontSize: '8px', color: '#10b981', background: 'rgba(16,185,129,0.2)', padding: '1px 3px', borderRadius: '2px' }}>
              SRC
            </span>
          )}
          {isTarget && (
            <span style={{ fontSize: '8px', color: '#f43f5e', background: 'rgba(244,63,94,0.2)', padding: '1px 3px', borderRadius: '2px' }}>
              DEST
            </span>
          )}
        </div>
      </Html>
    </group>
  );
}

function GraphEdge3D({ edge, nodeMap, isEdgeActive, isPathEdge, isRejected }) {
  const sourceNode = nodeMap[edge.source];
  const targetNode = nodeMap[edge.target];

  const { start, end, mid, length, orientation } = useMemo(() => {
    if (!sourceNode || !targetNode) return {};
    const s = new THREE.Vector3(sourceNode.x, sourceNode.y, sourceNode.z);
    const t = new THREE.Vector3(targetNode.x, targetNode.y, targetNode.z);
    const m = new THREE.Vector3().addVectors(s, t).multiplyScalar(0.5);
    const len = s.distanceTo(t);

    const dir = new THREE.Vector3().subVectors(t, s).normalize();
    const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);

    return {
      start: s,
      end: t,
      mid: [m.x, m.y, m.z],
      length: len,
      orientation: quat
    };
  }, [sourceNode, targetNode]);

  if (!sourceNode || !targetNode || !length) return null;

  let edgeColor = '#334155';
  let emissive = '#000000';
  let emissiveIntensity = 0;
  let radius = 0.035;

  if (isRejected) {
    edgeColor = '#f43f5e';
    emissive = '#f43f5e';
    emissiveIntensity = 0.7;
    radius = 0.05;
  } else if (isPathEdge) {
    edgeColor = '#10b981';
    emissive = '#10b981';
    emissiveIntensity = 0.8;
    radius = 0.08;
  } else if (isEdgeActive) {
    edgeColor = '#ec4899';
    emissive = '#ec4899';
    emissiveIntensity = 0.6;
    radius = 0.06;
  }

  return (
    <group>
      {/* 3D Edge Tube */}
      <mesh position={mid} quaternion={orientation}>
        <cylinderGeometry args={[radius, radius, length, 8]} />
        <meshStandardMaterial
          color={edgeColor}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
          roughness={0.4}
        />
      </mesh>

      {/* Weight Badge */}
      {edge.weight !== undefined && (
        <Html position={mid} center distanceFactor={15} style={{ pointerEvents: 'none' }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            fontWeight: 600,
            color: isPathEdge ? '#10b981' : isEdgeActive ? '#ec4899' : 'var(--text-secondary)',
            background: 'rgba(5, 5, 5, 0.85)',
            border: `1px solid ${isPathEdge ? '#10b981' : isEdgeActive ? '#ec4899' : 'rgba(255,255,255,0.1)'}`,
            padding: '1px 4px',
            borderRadius: '3px'
          }}>
            {edge.weight}
          </span>
        </Html>
      )}
    </group>
  );
}

export function GraphVisualizer() {
  const data = useVisualizerStore((s) => s.data);
  const currentStep = useVisualizerStore((s) => s.currentStep);
  const activeState = useVisualizerStore((s) => s.activeState);
  const algorithmId = useVisualizerStore((s) => s.algorithmId);
  const sourceId = useVisualizerStore((s) => s.graphSourceNode);
  const targetId = useVisualizerStore((s) => s.graphTargetNode);
  const setSource = useVisualizerStore((s) => s.setGraphSourceNode);
  const setTarget = useVisualizerStore((s) => s.setGraphTargetNode);
  const editMode = useVisualizerStore((s) => s.graphEditMode);

  const graph = data && data.nodes ? data : { nodes: [], edges: [] };
  const variables = currentStep?.variables || {};
  const distances = variables.distances || variables.dist || {};
  const inDegrees = variables.inDegree || variables.inDegrees || {};

  const nodeMap = useMemo(() => {
    const map = {};
    graph.nodes.forEach(n => { map[n.id] = n; });
    return map;
  }, [graph.nodes]);

  const handleNodeClick = (nodeId) => {
    if (editMode === 'selectSource') {
      setSource(nodeId);
    } else if (editMode === 'selectTarget') {
      setTarget(nodeId);
    }
  };

  return (
    <group position={[0, 0, 0]}>
      <gridHelper args={[24, 24, '#1e293b', '#0f172a']} position={[0, -2, 0]} />

      {/* Edges */}
      {graph.edges.map((edge, idx) => {
        const edgeKey = `${edge.source}-${edge.target}`;
        const revKey = `${edge.target}-${edge.source}`;
        const isEdgeActive = activeState.activeEdges?.includes(edgeKey) || activeState.activeEdges?.includes(revKey);
        const isPathEdge = (activeState.activeEdges?.includes(edgeKey) || activeState.activeEdges?.includes(revKey)) &&
          (activeState.description?.includes('Shortest Path') || activeState.description?.includes('MST') || currentStep?.type === 'EDGE_ACCEPT');
        const isRejected = (activeState.activeEdges?.includes(edgeKey) || activeState.activeEdges?.includes(revKey)) && currentStep?.type === 'EDGE_REJECT';

        return (
          <GraphEdge3D
            key={`edge-${idx}-${edgeKey}`}
            edge={edge}
            nodeMap={nodeMap}
            isEdgeActive={isEdgeActive}
            isPathEdge={isPathEdge}
            isRejected={isRejected}
          />
        );
      })}

      {/* Nodes */}
      {graph.nodes.map((node) => {
        const isVisited = activeState.activeNodes?.includes(node.id);
        const isHighlighted = activeState.highlightedIndices?.includes(node.id);
        const isSource = node.id === sourceId;
        const isTarget = node.id === targetId;
        const dist = distances[node.id];
        const inDeg = inDegrees[node.id];

        return (
          <GraphNode3D
            key={`graph-node-${node.id}`}
            node={node}
            isVisited={isVisited}
            isHighlighted={isHighlighted}
            isSource={isSource}
            isTarget={isTarget}
            distance={dist}
            inDegree={inDeg}
            algorithmId={algorithmId}
            onClick={() => handleNodeClick(node.id)}
          />
        );
      })}
    </group>
  );
}
