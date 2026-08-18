import React, { useState, useEffect } from 'react';
import { useVisualizerStore } from '../../store/useVisualizerStore.js';
import { animationController } from '../../animations/AnimationController.js';
import { Terminal, X } from 'lucide-react';

export function DebugOverlay() {
  const [visible, setVisible] = useState(false);
  const [fps, setFps] = useState(60);

  const algorithmId = useVisualizerStore((s) => s.algorithmId);
  const currentStepIndex = useVisualizerStore((s) => s.currentStepIndex);
  const steps = useVisualizerStore((s) => s.steps);
  const isPlaying = useVisualizerStore((s) => s.isPlaying);
  const playbackSpeed = useVisualizerStore((s) => s.playbackSpeed);
  const stats = useVisualizerStore((s) => s.stats);
  const currentStep = useVisualizerStore((s) => s.currentStep);

  // Check URL query param ?debug=true
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('debug') === 'true') {
        setVisible(true);
      }
    }
  }, []);

  // Simple FPS counter
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animId;

    const loop = (now) => {
      frameCount++;
      if (now - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '80px',
      left: '20px',
      width: '320px',
      background: 'rgba(0, 0, 0, 0.9)',
      border: '1px solid rgba(56, 189, 248, 0.4)',
      borderRadius: '8px',
      padding: '12px',
      fontFamily: 'var(--font-mono)',
      fontSize: '11px',
      color: '#f5f5f5',
      zIndex: 999,
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.8)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-cyan)' }}>
          <Terminal size={13} />
          <span style={{ fontWeight: 700 }}>ENGINE DIAGNOSTICS</span>
        </div>
        <button onClick={() => setVisible(false)} style={{ color: 'var(--text-muted)' }}>
          <X size={12} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-muted)' }}>FPS:</span>
          <span style={{ color: fps >= 55 ? '#10b981' : fps >= 30 ? '#f59e0b' : '#ef4444', fontWeight: 600 }}>
            {fps} FPS
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-muted)' }}>Algorithm:</span>
          <span style={{ color: '#ffffff' }}>{algorithmId}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-muted)' }}>Cursor / Total:</span>
          <span>{currentStepIndex} / {steps.length}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-muted)' }}>Playback:</span>
          <span style={{ color: isPlaying ? 'var(--accent-cyan)' : 'var(--text-secondary)' }}>
            {isPlaying ? `PLAYING (${playbackSpeed}x)` : 'PAUSED'}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-muted)' }}>Anim Version:</span>
          <span>v{animationController.getVersion()}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-muted)' }}>Active Op:</span>
          <span style={{ color: 'var(--accent-amber)' }}>{currentStep?.type || 'IDLE'}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-muted)' }}>Comparisons / Swaps:</span>
          <span>{stats.comparisons} / {stats.swaps}</span>
        </div>
      </div>
    </div>
  );
}
