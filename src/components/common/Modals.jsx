import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ALGORITHMS } from '../../algorithms/registry.js';
import { useVisualizerStore } from '../../store/useVisualizerStore.js';
import { useSettingsStore } from '../../store/useSettingsStore.js';
import { buildShareUrl, copyShareUrlToClipboard } from '../../utils/shareUrl.js';
import { Search, X, ChevronRight, Keyboard, Share2, Check, Copy, ExternalLink, Zap } from 'lucide-react';

export function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const setAlgorithm = useVisualizerStore((s) => s.setAlgorithm);
  const setStep = useVisualizerStore((s) => s.setStep);
  const setSpeed = useVisualizerStore((s) => s.setSpeed);
  const setIsPlaying = useVisualizerStore((s) => s.setIsPlaying);
  const reset = useVisualizerStore((s) => s.reset);
  const setSoundEnabled = useSettingsStore((s) => s.setSoundEnabled);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isCommand = query.trim().startsWith('>');
  const cleanCmd = query.replace(/^>\s*/, '').toLowerCase().trim();

  // Execute quick commands
  const handleExecuteCommand = (cmdText) => {
    const text = (cmdText || cleanCmd).toLowerCase();
    
    if (text.startsWith('compare')) {
      const parts = text.split(/\s+/).slice(1);
      navigate(`/compare?a=${parts[0] || 'quick-sort'}&b=${parts[1] || 'merge-sort'}`);
      onClose();
      return;
    }
    if (text.startsWith('jump')) {
      const stepNum = parseInt(text.replace(/[^0-9]/g, ''), 10);
      if (!isNaN(stepNum)) {
        setStep(Math.max(0, stepNum - 1));
      }
      navigate('/visualizer');
      onClose();
      return;
    }
    if (text.startsWith('speed')) {
      const sp = parseFloat(text.replace(/[^0-9.]/g, ''));
      if (!isNaN(sp)) setSpeed(sp);
      onClose();
      return;
    }
    if (text.startsWith('sound on')) {
      setSoundEnabled(true);
      onClose();
      return;
    }
    if (text.startsWith('sound off')) {
      setSoundEnabled(false);
      onClose();
      return;
    }
    if (text.startsWith('debug on')) {
      window.dispatchEvent(new CustomEvent('algo3d-debug-toggle', { detail: { toggleDebug: true } }));
      onClose();
      return;
    }
    if (text.startsWith('debug off')) {
      window.dispatchEvent(new CustomEvent('algo3d-debug-toggle', { detail: { toggleDebug: false } }));
      onClose();
      return;
    }
    if (text === 'challenge') {
      navigate('/challenge');
      onClose();
      return;
    }
    if (text === 'atlas' || text === 'algorithms') {
      navigate('/algorithms');
      onClose();
      return;
    }
    if (text.startsWith('learn')) {
      navigate('/learn');
      onClose();
      return;
    }
    if (text === 'reset') {
      reset();
      onClose();
      return;
    }
    if (text === 'play' || text === 'run') {
      setIsPlaying(true);
      onClose();
      return;
    }
    if (text === 'pause') {
      setIsPlaying(false);
      onClose();
      return;
    }
  };

  const commandPresets = [
    { label: '> compare quick-sort merge-sort', desc: 'Race Quick Sort vs Merge Sort side-by-side' },
    { label: '> jump 25', desc: 'Jump timeline directly to step 25' },
    { label: '> speed 2x', desc: 'Set animation playback rate to 2x' },
    { label: '> debug on', desc: 'Toggle real-time WebGL and memory telemetry HUD' },
    { label: '> sound off', desc: 'Mute procedural audio synthesizer' },
    { label: '> challenge', desc: 'Open interactive algorithm challenge lab' },
    { label: '> atlas', desc: 'Browse full Algorithm Knowledge Graph & Atlas' }
  ].filter(p => !cleanCmd || p.label.toLowerCase().includes(cleanCmd) || p.desc.toLowerCase().includes(cleanCmd));

  const filteredAlgos = Object.values(ALGORITHMS).filter((algo) => {
    const q = query.toLowerCase().trim();
    if (!q || isCommand) return false;
    return (
      algo.name.toLowerCase().includes(q) ||
      algo.category.toLowerCase().includes(q) ||
      algo.description.toLowerCase().includes(q) ||
      algo.id.toLowerCase().includes(q)
    );
  });

  const handleSelect = (algoId) => {
    setAlgorithm(algoId);
    navigate('/visualizer');
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.82)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      paddingTop: '12vh',
      zIndex: 99999
    }} onClick={onClose}>
      <div
        className="glass-panel"
        style={{
          width: '580px',
          maxHeight: '68vh',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.85)',
          border: '1px solid var(--border-subtle)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Box */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <Search size={18} style={{ color: 'var(--accent-cyan)' }} />
          <input
            type="text"
            placeholder="Search algorithms, or type '>' for commands (e.g. > compare quick merge)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (isCommand) handleExecuteCommand();
                else if (filteredAlgos[0]) handleSelect(filteredAlgos[0].id);
              }
            }}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              color: '#ffffff',
              fontSize: '14px',
              outline: 'none',
              fontFamily: 'var(--font-sans)'
            }}
            autoFocus
          />
          <kbd style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--text-muted)',
            border: '1px solid var(--border-subtle)',
            padding: '2px 6px',
            borderRadius: '4px'
          }}>
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div style={{
          padding: '8px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          {isCommand ? (
            commandPresets.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                No matching commands found. Type <code>&gt; compare</code>, <code>&gt; jump 20</code>, <code>&gt; debug on</code>
              </div>
            ) : (
              commandPresets.map((cmd, idx) => (
                <button
                  key={`cmd-${idx}`}
                  onClick={() => handleExecuteCommand(cmd.label.replace(/^>\s*/, ''))}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'transparent',
                    border: '1px solid transparent',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--bg-surface-elevated)';
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 600, color: 'var(--accent-cyan)' }}>
                      {cmd.label}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      {cmd.desc}
                    </span>
                  </div>
                  <Zap size={14} style={{ color: 'var(--accent-amber)' }} />
                </button>
              ))
            )
          ) : query.trim() === '' ? (
            Object.values(ALGORITHMS).slice(0, 8).map((algo) => (
              <button
                key={algo.id}
                onClick={() => handleSelect(algo.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'transparent',
                  border: '1px solid transparent',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-surface-elevated)';
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'transparent';
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>
                      {algo.name}
                    </span>
                    <span className="badge cyan" style={{ textTransform: 'capitalize' }}>
                      {algo.category}
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    {algo.description}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'var(--accent-emerald)'
                  }}>
                    {algo.complexity.timeAverage}
                  </span>
                  <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
                </div>
              </button>
            ))
          ) : filteredAlgos.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
              No matching algorithms found.
            </div>
          ) : (
            filteredAlgos.map((algo) => (
              <button
                key={algo.id}
                onClick={() => handleSelect(algo.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'transparent',
                  border: '1px solid transparent',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-surface-elevated)';
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'transparent';
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>
                      {algo.name}
                    </span>
                    <span className="badge cyan" style={{ textTransform: 'capitalize' }}>
                      {algo.category}
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    {algo.description}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'var(--accent-emerald)'
                  }}>
                    {algo.complexity.timeAverage}
                  </span>
                  <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export function SettingsModal({ isOpen, onClose }) {
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const setSoundEnabled = useSettingsStore((s) => s.setSoundEnabled);
  const quality = useSettingsStore((s) => s.quality);
  const setQuality = useSettingsStore((s) => s.setQuality);
  const particles = useSettingsStore((s) => s.particles);
  const setParticles = useSettingsStore((s) => s.setParticles);
  const cameraMode = useSettingsStore((s) => s.cameraMode);
  const setCameraMode = useSettingsStore((s) => s.setCameraMode);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999
    }} onClick={onClose}>
      <div
        className="glass-panel"
        style={{
          width: '460px',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff' }}>Laboratory Settings</h3>
          <button onClick={onClose} className="btn-icon" style={{ width: '26px', height: '26px' }}>
            <X size={14} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Sound Synthesizer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>Audio Feedback</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Algorithmic procedural tones</div>
            </div>
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: 'var(--accent-cyan)' }}
            />
          </div>

          {/* Visual Quality Mode */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>Visual Quality</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Three.js render precision & shadows</div>
            </div>
            <select
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              style={{
                background: 'var(--bg-surface-elevated)',
                color: '#ffffff',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-sm)',
                padding: '4px 10px',
                fontSize: '12px',
                outline: 'none'
              }}
            >
              <option value="high">High (60 FPS + AA)</option>
              <option value="medium">Medium</option>
              <option value="low">Low (Battery Saver)</option>
            </select>
          </div>

          {/* Particle Field */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>Ambient Particles</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Deep-space floating particles</div>
            </div>
            <input
              type="checkbox"
              checked={particles}
              onChange={(e) => setParticles(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: 'var(--accent-cyan)' }}
            />
          </div>

          {/* Camera View Angle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>Camera View</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Perspective or overhead layout</div>
            </div>
            <select
              value={cameraMode}
              onChange={(e) => setCameraMode(e.target.value)}
              style={{
                background: 'var(--bg-surface-elevated)',
                color: '#ffffff',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-sm)',
                padding: '4px 10px',
                fontSize: '12px',
                outline: 'none'
              }}
            >
              <option value="orbit">Dynamic Orbit (Default)</option>
              <option value="overhead">Overhead View</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
          <button onClick={onClose} className="btn-primary">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export function KeyboardShortcutsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const shortcuts = [
    {
      category: 'Playback & Stepping',
      items: [
        { keys: ['Space'], action: 'Play / Pause algorithm' },
        { keys: ['→', 'L', 'K'], action: 'Step forward one step' },
        { keys: ['←', 'H', 'J'], action: 'Step backward one step' },
        { keys: ['Home'], action: 'Jump to beginning' },
        { keys: ['End'], action: 'Jump to final state' },
        { keys: ['R'], action: 'Reset to initial state' }
      ]
    },
    {
      category: 'Playback Speed',
      items: [
        { keys: ['1'], action: 'Set speed to 0.25x' },
        { keys: ['2'], action: 'Set speed to 0.5x' },
        { keys: ['3'], action: 'Set speed to 1.0x (Normal)' },
        { keys: ['4'], action: 'Set speed to 2.0x (Fast)' },
        { keys: ['5'], action: 'Set speed to 4.0x (Hyper)' }
      ]
    },
    {
      category: 'View & Navigation',
      items: [
        { keys: ['F'], action: 'Toggle Fullscreen / Theater Mode' },
        { keys: ['S'], action: 'Share / Copy link to current step' },
        { keys: ['⌘K', 'Ctrl+K'], action: 'Quick Search Algorithms' },
        { keys: ['?'], action: 'Toggle Keyboard Shortcuts' },
        { keys: ['ESC'], action: 'Close modal dialog' }
      ]
    }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999
    }} onClick={onClose}>
      <div
        className="glass-panel"
        style={{
          width: '560px',
          maxHeight: '80vh',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.85)',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Keyboard size={18} style={{ color: 'var(--accent-cyan)' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>Keyboard Shortcuts</h3>
          </div>
          <button onClick={onClose} className="btn-icon" style={{ width: '26px', height: '26px' }}>
            <X size={14} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {shortcuts.map((grp) => (
            <div key={grp.category} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {grp.category}
              </div>
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                padding: '4px 8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}>
                {grp.items.map((item, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '4px 6px',
                    fontSize: '12px',
                    color: 'var(--text-secondary)'
                  }}>
                    <span>{item.action}</span>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {item.keys.map((k) => (
                        <kbd key={k} style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '11px',
                          fontWeight: 600,
                          color: '#ffffff',
                          background: 'rgba(255,255,255,0.08)',
                          border: '1px solid rgba(255,255,255,0.15)',
                          padding: '2px 7px',
                          borderRadius: '4px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.5)'
                        }}>
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ShareModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const algorithmId = useVisualizerStore((s) => s.algorithmId);
  const currentAlgorithm = useVisualizerStore((s) => s.currentAlgorithm);
  const currentStepIndex = useVisualizerStore((s) => s.currentStepIndex);
  const data = useVisualizerStore((s) => s.data);
  const playbackSpeed = useVisualizerStore((s) => s.playbackSpeed);

  if (!isOpen) return null;

  const shareUrl = buildShareUrl({
    algorithmId,
    stepIndex: currentStepIndex,
    data,
    speed: playbackSpeed
  });

  const handleCopy = async () => {
    await copyShareUrlToClipboard({
      algorithmId,
      stepIndex: currentStepIndex,
      data,
      speed: playbackSpeed
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999
    }} onClick={onClose}>
      <div
        className="glass-panel"
        style={{
          width: '500px',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.85)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Share2 size={17} style={{ color: 'var(--accent-cyan)' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>Share Algorithm State</h3>
          </div>
          <button onClick={onClose} className="btn-icon" style={{ width: '26px', height: '26px' }}>
            <X size={14} />
          </button>
        </div>

        {/* Snapshot Summary */}
        <div style={{
          background: 'rgba(56, 189, 248, 0.05)',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          borderRadius: 'var(--radius-sm)',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          fontSize: '12px',
          fontFamily: 'var(--font-mono)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Algorithm:</span>
            <span style={{ color: '#fff', fontWeight: 600 }}>{currentAlgorithm?.name || algorithmId}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Current Step:</span>
            <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>
              {currentStepIndex >= 0 ? `Step ${currentStepIndex}` : 'Initial State'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Playback Speed:</span>
            <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>{playbackSpeed}x</span>
          </div>
        </div>

        {/* Copy URL Bar */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            readOnly
            value={shareUrl}
            style={{
              flex: 1,
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-sm)',
              padding: '8px 12px',
              color: '#ffffff',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              outline: 'none'
            }}
          />
          <button
            onClick={handleCopy}
            className="btn-primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              fontSize: '12px',
              whiteSpace: 'nowrap'
            }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? 'Copied!' : 'Copy Link'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
