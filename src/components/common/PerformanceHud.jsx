import React, { useState, useEffect, useRef } from 'react';
import { useVisualizerStore } from '../../store/useVisualizerStore.js';
import { useSettingsStore } from '../../store/useSettingsStore.js';
import { Activity, Cpu, HardDrive, Zap } from 'lucide-react';

export function PerformanceHud() {
  const [fps, setFps] = useState(60);
  const [frameTime, setFrameTime] = useState(16.6);
  const [visible, setVisible] = useState(false);

  const algorithmId = useVisualizerStore((s) => s.algorithmId);
  const currentStepIndex = useVisualizerStore((s) => s.currentStepIndex);
  const totalSteps = useVisualizerStore((s) => s.steps?.length || 0);
  const isPlaying = useVisualizerStore((s) => s.isPlaying);
  const speed = useVisualizerStore((s) => s.speed);
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);

  const frameRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const fpsAccumRef = useRef([]);

  useEffect(() => {
    // Check if ?debug=true is present in URL
    const params = new URLSearchParams(window.location.search);
    if (params.get('debug') === 'true') {
      setVisible(true);
    }

    // Command Center / global event listener for debug toggle
    const handleToggleDebug = (e) => {
      if (e.detail?.toggleDebug !== undefined) {
        setVisible(e.detail.toggleDebug);
      }
    };
    window.addEventListener('algo3d-debug-toggle', handleToggleDebug);

    let animId;
    const updateStats = (now) => {
      frameRef.current++;
      const delta = now - lastTimeRef.current;

      if (delta >= 400) {
        const currentFps = Math.round((frameRef.current * 1000) / delta);
        const currentMs = (delta / frameRef.current).toFixed(1);
        setFps(Math.min(120, currentFps));
        setFrameTime(currentMs);
        frameRef.current = 0;
        lastTimeRef.current = now;
      }
      animId = requestAnimationFrame(updateStats);
    };

    animId = requestAnimationFrame(updateStats);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('algo3d-debug-toggle', handleToggleDebug);
    };
  }, []);

  if (!visible) return null;

  const estimatedMemoryKb = ((totalSteps * 0.45) + 12).toFixed(1);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '16px',
        right: '16px',
        zIndex: 9999,
        background: 'rgba(5, 8, 15, 0.92)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '10px 14px',
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        color: 'var(--text-secondary)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        minWidth: '220px',
        pointerEvents: 'auto'
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        paddingBottom: '4px'
      }}>
        <span style={{ color: 'var(--accent-cyan)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Activity size={12} /> ALGO3D TELEMETRY
        </span>
        <button
          onClick={() => setVisible(false)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '10px',
            padding: '0 2px'
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px' }}>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>FPS: </span>
          <span style={{
            color: fps >= 50 ? 'var(--accent-emerald)' : fps >= 30 ? 'var(--accent-amber)' : 'var(--accent-pink)',
            fontWeight: 700
          }}>
            {fps}
          </span>
          <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}> ({frameTime}ms)</span>
        </div>

        <div>
          <span style={{ color: 'var(--text-muted)' }}>Engine: </span>
          <span style={{ color: isPlaying ? 'var(--accent-emerald)' : 'var(--text-primary)', fontWeight: 600 }}>
            {isPlaying ? `RUN (${speed}x)` : 'IDLE'}
          </span>
        </div>

        <div>
          <span style={{ color: 'var(--text-muted)' }}>Steps: </span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
            {currentStepIndex + 1} / {totalSteps}
          </span>
        </div>

        <div>
          <span style={{ color: 'var(--text-muted)' }}>Snapshots: </span>
          <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>
            ~{estimatedMemoryKb} KB
          </span>
        </div>
      </div>

      <div style={{
        fontSize: '9px',
        color: 'var(--text-muted)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        paddingTop: '4px',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <span>Algo: {algorithmId}</span>
        <span>Audio: {soundEnabled ? 'ON' : 'MUTED'}</span>
      </div>
    </div>
  );
}
