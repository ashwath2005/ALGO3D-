import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SceneContainer } from '../three/scene/SceneContainer.jsx';
import { AlgorithmSelector } from '../components/controls/AlgorithmSelector.jsx';
import { PlaybackControls } from '../components/controls/PlaybackControls.jsx';
import { CodePanel } from '../components/panels/CodePanel.jsx';
import { MetricsPanel } from '../components/panels/MetricsPanel.jsx';
import { GraphToolbar } from '../components/panels/GraphToolbar.jsx';
import { StateDiffPanel } from '../components/panels/StateDiffPanel.jsx';
import { VariableWatcherPanel } from '../components/panels/VariableWatcherPanel.jsx';
import { KeyboardShortcutsModal, ShareModal } from '../components/common/Modals.jsx';
import { Toast } from '../components/common/Toast.jsx';
import { useVisualizerStore } from '../store/useVisualizerStore.js';
import { parseShareUrl, copyShareUrlToClipboard } from '../utils/shareUrl.js';
import { Keyboard, Share2, Maximize2, Minimize2 } from 'lucide-react';

export function VisualizerPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  const togglePlay = useVisualizerStore((s) => s.togglePlay);
  const stepForward = useVisualizerStore((s) => s.stepForward);
  const stepBackward = useVisualizerStore((s) => s.stepBackward);
  const jumpToStart = useVisualizerStore((s) => s.jumpToStart);
  const jumpToEnd = useVisualizerStore((s) => s.jumpToEnd);
  const reset = useVisualizerStore((s) => s.reset);
  const setPlaybackSpeed = useVisualizerStore((s) => s.setPlaybackSpeed);
  const loadFromUrlState = useVisualizerStore((s) => s.loadFromUrlState);
  const algorithmId = useVisualizerStore((s) => s.algorithmId);
  const currentStepIndex = useVisualizerStore((s) => s.currentStepIndex);
  const data = useVisualizerStore((s) => s.data);
  const playbackSpeed = useVisualizerStore((s) => s.playbackSpeed);

  const showToast = (msg) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  };

  // 1. Deep Link URL Hydration on Mount
  useEffect(() => {
    if (location.search) {
      const parsed = parseShareUrl(location.search);
      if (parsed.algorithmId || parsed.stepIndex !== null || parsed.data || parsed.speed) {
        loadFromUrlState(parsed);
        showToast(`Loaded state: ${parsed.algorithmId || 'Algorithm'}${parsed.stepIndex !== null ? ` (Step ${parsed.stepIndex})` : ''}`);
      }
    }
  }, [location.search, loadFromUrlState]);

  // 2. Fullscreen toggle
  const toggleFullscreenMode = () => {
    if (!document.fullscreenElement) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // 3. Power-User Keyboard Listener
  useEffect(() => {
    const handleKeyDown = async (e) => {
      // Ignore keystrokes when typing in inputs/textareas/selects
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target?.tagName)) return;

      const key = e.key.toLowerCase();

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowRight' || key === 'l') {
        e.preventDefault();
        stepForward();
      } else if (e.code === 'ArrowLeft' || key === 'h') {
        e.preventDefault();
        stepBackward();
      } else if (e.code === 'Home') {
        e.preventDefault();
        jumpToStart();
      } else if (e.code === 'End') {
        e.preventDefault();
        jumpToEnd();
      } else if (key === 'r') {
        e.preventDefault();
        reset();
      } else if (key === '1') {
        e.preventDefault();
        setPlaybackSpeed(0.25);
        showToast('Speed: 0.25x');
      } else if (key === '2') {
        e.preventDefault();
        setPlaybackSpeed(0.5);
        showToast('Speed: 0.5x');
      } else if (key === '3') {
        e.preventDefault();
        setPlaybackSpeed(1.0);
        showToast('Speed: 1.0x (Normal)');
      } else if (key === '4') {
        e.preventDefault();
        setPlaybackSpeed(2.0);
        showToast('Speed: 2.0x (Fast)');
      } else if (key === '5') {
        e.preventDefault();
        setPlaybackSpeed(4.0);
        showToast('Speed: 4.0x (Hyper)');
      } else if (key === 'f') {
        e.preventDefault();
        toggleFullscreenMode();
      } else if (key === '?' || key === '/') {
        e.preventDefault();
        setShortcutsOpen((prev) => !prev);
      } else if (key === 's' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        await copyShareUrlToClipboard({
          algorithmId,
          stepIndex: currentStepIndex,
          data,
          speed: playbackSpeed
        });
        showToast('Link to current step copied to clipboard!');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    togglePlay,
    stepForward,
    stepBackward,
    jumpToStart,
    jumpToEnd,
    reset,
    setPlaybackSpeed,
    algorithmId,
    currentStepIndex,
    data,
    playbackSpeed
  ]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: isFullscreen ? '100vh' : 'calc(100vh - var(--nav-height))',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        background: '#000000'
      }}
    >
      {/* Top Algorithm Selection Bar */}
      <AlgorithmSelector />

      {/* Main 3D Canvas Area */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <SceneContainer />

        {/* Floating Quick Action Dock (Top Right) */}
        <div
          style={{
            position: 'absolute',
            top: '14px',
            right: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            zIndex: 35
          }}
        >
          {/* Share Link Button */}
          <button
            className="btn-icon"
            onClick={() => setShareOpen(true)}
            title="Share deep-link to current algorithm step (Key: S)"
            style={{
              background: 'rgba(5, 5, 5, 0.85)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            <Share2 size={14} style={{ color: 'var(--accent-cyan)' }} />
          </button>

          {/* Keyboard Shortcuts Guide Button */}
          <button
            className="btn-icon"
            onClick={() => setShortcutsOpen(true)}
            title="Keyboard Shortcuts Guide (Key: ?)"
            style={{
              background: 'rgba(5, 5, 5, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            <Keyboard size={14} />
          </button>

          {/* Fullscreen / Theater Mode Toggle */}
          <button
            className="btn-icon"
            onClick={toggleFullscreenMode}
            title={isFullscreen ? 'Exit Fullscreen (Key: F)' : 'Fullscreen Theater Mode (Key: F)'}
            style={{
              background: 'rgba(5, 5, 5, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>

        {/* Floating Side Panels */}
        <MetricsPanel />
        <CodePanel />
        <StateDiffPanel />
        <VariableWatcherPanel />
        <GraphToolbar />
      </div>

      {/* Bottom Playback & Scrubber Controls */}
      <PlaybackControls />

      {/* Global Modals & Notifications */}
      <KeyboardShortcutsModal isOpen={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
      <ShareModal isOpen={shareOpen} onClose={() => setShareOpen(false)} />
      <Toast message={toastMessage} visible={toastVisible} />
    </div>
  );
}
