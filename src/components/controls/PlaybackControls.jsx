import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Gauge
} from 'lucide-react';
import { useVisualizerStore } from '../../store/useVisualizerStore.js';

export function PlaybackControls() {
  const isPlaying = useVisualizerStore((s) => s.isPlaying);
  const togglePlay = useVisualizerStore((s) => s.togglePlay);
  const stepForward = useVisualizerStore((s) => s.stepForward);
  const stepBackward = useVisualizerStore((s) => s.stepBackward);
  const reset = useVisualizerStore((s) => s.reset);
  const steps = useVisualizerStore((s) => s.steps);
  const currentStepIndex = useVisualizerStore((s) => s.currentStepIndex);
  const applyStep = useVisualizerStore((s) => s.applyStep);
  const playbackSpeed = useVisualizerStore((s) => s.playbackSpeed);
  const setPlaybackSpeed = useVisualizerStore((s) => s.setPlaybackSpeed);
  const activeState = useVisualizerStore((s) => s.activeState);

  const totalSteps = steps.length;
  const currentProgress = totalSteps > 0 ? ((currentStepIndex + 1) / totalSteps) * 100 : 0;

  const speedOptions = [0.25, 0.5, 1, 1.5, 2, 4];

  return (
    <div style={{
      height: 'var(--bottom-bar-height)',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      background: 'rgba(5, 5, 5, 0.85)',
      backdropFilter: 'blur(16px)',
      borderTop: '1px solid var(--border-subtle)',
      position: 'relative',
      zIndex: 40,
      gap: '20px'
    }}>
      {/* Playback Button Group */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Reset */}
        <button
          className="btn-icon"
          onClick={reset}
          title="Reset Visualizer (R)"
        >
          <RotateCcw size={15} />
        </button>

        {/* Step Backward */}
        <button
          className="btn-icon"
          onClick={stepBackward}
          disabled={currentStepIndex < 0}
          title="Step Backward (Left Arrow)"
        >
          <SkipBack size={15} />
        </button>

        {/* Main Play / Pause Button */}
        <button
          onClick={togglePlay}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '42px',
            height: '42px',
            borderRadius: 'var(--radius-sm)',
            background: isPlaying ? 'var(--accent-cyan)' : '#ffffff',
            color: '#000000',
            border: 'none',
            boxShadow: isPlaying ? '0 0 16px var(--accent-cyan-glow)' : '0 2px 10px rgba(0,0,0,0.5)',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)'
          }}
          title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
        >
          {isPlaying ? <Pause size={18} fill="#000000" /> : <Play size={18} fill="#000000" />}
        </button>

        {/* Step Forward */}
        <button
          className="btn-icon"
          onClick={stepForward}
          disabled={totalSteps > 0 && currentStepIndex >= totalSteps - 1}
          title="Step Forward (Right Arrow)"
        >
          <SkipForward size={15} />
        </button>
      </div>

      {/* Center: Timeline Scrubber & Live Step Description */}
      <div style={{
        flex: 1,
        maxWidth: '650px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
      }}>
        {/* Step Text Info */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{
            fontSize: '12px',
            color: 'var(--text-primary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '500px'
          }}>
            {activeState.description}
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--text-secondary)'
          }}>
            {Math.max(0, currentStepIndex + 1)} / {totalSteps}
          </span>
        </div>

        {/* Scrubber Progress Bar */}
        <input
          type="range"
          min="-1"
          max={Math.max(0, totalSteps - 1)}
          value={currentStepIndex}
          onChange={(e) => applyStep(parseInt(e.target.value, 10))}
          style={{
            width: '100%',
            height: '4px',
            appearance: 'none',
            background: 'var(--bg-surface-active)',
            borderRadius: '2px',
            outline: 'none',
            accentColor: 'var(--accent-cyan)',
            cursor: 'pointer'
          }}
        />
      </div>

      {/* Right: Speed Multiplier */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Gauge size={14} style={{ color: 'var(--text-secondary)' }} />
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          background: 'var(--bg-surface)',
          padding: '2px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)'
        }}>
          {speedOptions.map((speed) => (
            <button
              key={speed}
              onClick={() => setPlaybackSpeed(speed)}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                padding: '3px 7px',
                borderRadius: '3px',
                color: playbackSpeed === speed ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                background: playbackSpeed === speed ? 'var(--accent-cyan-dim)' : 'transparent',
                fontWeight: playbackSpeed === speed ? 600 : 400
              }}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
