import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ALGORITHMS } from '../algorithms/registry.js';
import { ALGORITHM_METADATA, LEARNING_PATHS, NotesEngine } from '../algorithms/knowledge/KnowledgeBase.js';
import { CustomAlgorithmSDK } from '../algorithms/custom/CustomAlgorithmSDK.js';
import { useVisualizerStore } from '../store/useVisualizerStore.js';
import {
  BookOpen,
  Play,
  Sparkles,
  Layers,
  FileCode,
  CheckCircle2,
  XCircle,
  Plus,
  Save,
  Trash2,
  Cpu,
  BarChart2,
  HelpCircle,
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';

export function LearnPage() {
  const navigate = useNavigate();
  const setAlgorithm = useVisualizerStore((s) => s.setAlgorithm);
  const setCustomData = useVisualizerStore((s) => s.setCustomData);

  const [selectedTab, setSelectedTab] = useState('docs'); // 'docs' | 'paths' | 'builder'
  const [selectedAlgoId, setSelectedAlgoId] = useState('bubble-sort');
  const [activePathId, setActivePathId] = useState('dsa-foundations');
  const [notesText, setNotesText] = useState('');
  const [notesSaved, setNotesSaved] = useState(false);

  // Custom Algorithm Builder State
  const [builderId, setBuilderId] = useState('my-custom-sort');
  const [builderName, setBuilderName] = useState('My Adaptive Sort');
  const [builderCode, setBuilderCode] = useState(CustomAlgorithmSDK.getTemplates()[0].code);
  const [testResults, setTestResults] = useState(null);
  const [customAlgos, setCustomAlgos] = useState(CustomAlgorithmSDK.getRegisteredCustomAlgorithms());

  const currentAlgo = ALGORITHMS[selectedAlgoId] || ALGORITHMS['bubble-sort'];
  const currentMeta = ALGORITHM_METADATA[selectedAlgoId] || {};
  const activePath = LEARNING_PATHS.find((p) => p.id === activePathId) || LEARNING_PATHS[0];

  // Load user notes when algorithm changes
  useEffect(() => {
    setNotesText(NotesEngine.getNotes(selectedAlgoId));
    setNotesSaved(false);
  }, [selectedAlgoId]);

  const handleSaveNotes = () => {
    NotesEngine.saveNotes(selectedAlgoId, notesText);
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  };

  const handleLaunchVisualizer = (algoId = selectedAlgoId) => {
    setAlgorithm(algoId);
    navigate('/visualizer');
  };

  const handleRunBuilderTests = () => {
    const res = CustomAlgorithmSDK.runTests(builderCode);
    setTestResults(res);
  };

  const handleSaveCustomAlgo = () => {
    try {
      CustomAlgorithmSDK.saveCustomAlgorithm({
        id: builderId,
        name: builderName,
        code: builderCode
      });
      setCustomAlgos(CustomAlgorithmSDK.getRegisteredCustomAlgorithms());
      alert(`Custom algorithm "${builderName}" saved successfully!`);
    } catch (err) {
      alert(`Error saving algorithm: ${err.message}`);
    }
  };

  return (
    <div style={{
      width: '100%',
      height: 'calc(100vh - var(--nav-height))',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-primary)',
      color: '#f5f5f5',
      overflow: 'hidden'
    }}>
      {/* Top Learning Engine Mode Bar */}
      <div style={{
        padding: '10px 24px',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'rgba(0, 0, 0, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge cyan">PHASE 5 PLATFORM</span>
          <h1 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', margin: 0 }}>
            Learning Engine & Custom Algorithm Studio
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={() => setSelectedTab('docs')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              fontWeight: selectedTab === 'docs' ? 600 : 400,
              color: selectedTab === 'docs' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              background: selectedTab === 'docs' ? 'var(--bg-surface-elevated)' : 'transparent',
              border: `1px solid ${selectedTab === 'docs' ? 'var(--accent-cyan)' : 'transparent'}`,
              cursor: 'pointer'
            }}
          >
            <BookOpen size={14} />
            <span>Algorithm Theory</span>
          </button>

          <button
            onClick={() => setSelectedTab('paths')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              fontWeight: selectedTab === 'paths' ? 600 : 400,
              color: selectedTab === 'paths' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              background: selectedTab === 'paths' ? 'var(--bg-surface-elevated)' : 'transparent',
              border: `1px solid ${selectedTab === 'paths' ? 'var(--accent-cyan)' : 'transparent'}`,
              cursor: 'pointer'
            }}
          >
            <Layers size={14} />
            <span>Learning Paths</span>
          </button>

          <button
            onClick={() => setSelectedTab('builder')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              fontWeight: selectedTab === 'builder' ? 600 : 400,
              color: selectedTab === 'builder' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              background: selectedTab === 'builder' ? 'var(--bg-surface-elevated)' : 'transparent',
              border: `1px solid ${selectedTab === 'builder' ? 'var(--accent-cyan)' : 'transparent'}`,
              cursor: 'pointer'
            }}
          >
            <FileCode size={14} />
            <span>Custom SDK Builder</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* ============================================================ */}
        {/* TAB 1: ALGORITHM THEORY & DEEP DOCUMENTATION */}
        {/* ============================================================ */}
        {selectedTab === 'docs' && (
          <>
            {/* Left Algorithm Index List */}
            <div style={{
              width: '280px',
              height: '100%',
              borderRight: '1px solid var(--border-subtle)',
              background: 'var(--bg-secondary)',
              overflowY: 'auto',
              padding: '14px 10px'
            }}>
              <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '8px', padding: '0 8px' }}>
                42 ALGORITHMS INDEX
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {Object.values(ALGORITHMS).map((algo) => (
                  <button
                    key={algo.id}
                    onClick={() => setSelectedAlgoId(algo.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '7px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: selectedAlgoId === algo.id ? 'var(--bg-surface-elevated)' : 'transparent',
                      border: `1px solid ${selectedAlgoId === algo.id ? 'var(--accent-cyan)' : 'transparent'}`,
                      color: selectedAlgoId === algo.id ? '#ffffff' : 'var(--text-secondary)',
                      fontSize: '12px',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <span>{algo.name}</span>
                    <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      {algo.complexity?.timeAverage}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Detailed Documentation & Notes */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '30px 40px' }}>
              <div style={{ maxWidth: '840px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Header Strip */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span className="badge cyan">{currentAlgo.category}</span>
                      <span className="badge amber">{currentMeta.paradigm || 'Algorithmic Paradigm'}</span>
                    </div>
                    <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff' }}>
                      {currentAlgo.name}
                    </h2>
                  </div>

                  <button
                    onClick={() => handleLaunchVisualizer(selectedAlgoId)}
                    className="btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '12px' }}
                  >
                    <Play size={13} fill="#000000" />
                    <span>Launch 3D Visualizer</span>
                  </button>
                </div>

                {/* Asymptotic Complexity Matrix */}
                <div className="glass-panel" style={{ padding: '16px 20px', borderRadius: 'var(--radius-md)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px' }}>
                  <div>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TIME (BEST)</span>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent-emerald)', marginTop: '2px' }}>
                      {currentAlgo.complexity?.timeBest || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TIME (AVERAGE)</span>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent-cyan)', marginTop: '2px' }}>
                      {currentAlgo.complexity?.timeAverage || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TIME (WORST)</span>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#ef4444', marginTop: '2px' }}>
                      {currentAlgo.complexity?.timeWorst || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>SPACE COMPLEXITY</span>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent-amber)', marginTop: '2px' }}>
                      {currentAlgo.complexity?.space || 'O(1)'}
                    </div>
                  </div>
                </div>

                {/* Structured Properties */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '6px' }}>
                      WHAT IT DOES
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                      {currentMeta.whatItDoes || currentAlgo.description}
                    </p>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '6px' }}>
                      HOW IT WORKS
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                      {currentMeta.howItWorks || 'Executes deterministic state transitions step-by-step according to mathematical invariants.'}
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '14px', borderRadius: 'var(--radius-sm)' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '4px' }}>
                        WHEN TO USE IT
                      </span>
                      <p style={{ fontSize: '12px', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                        {currentMeta.whenToUse || 'Standard inputs where asymptotic constraints match requirements.'}
                      </p>
                    </div>

                    <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '14px', borderRadius: 'var(--radius-sm)' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#ef4444', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '4px' }}>
                        WHEN NOT TO USE IT
                      </span>
                      <p style={{ fontSize: '12px', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                        {currentMeta.whenNotToUse || 'Adversarial inputs that trigger worst-case performance.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Personal Notes Section */}
                <div className="glass-panel" style={{ padding: '16px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>
                      Personal Notes for {currentAlgo.name}
                    </span>
                    <button
                      onClick={handleSaveNotes}
                      className="btn-secondary"
                      style={{ fontSize: '11px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Save size={12} />
                      <span>{notesSaved ? 'Saved!' : 'Save Notes'}</span>
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Write private notes, intuition, edge cases, or interview reminders..."
                    value={notesText}
                    onChange={(e) => setNotesText(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '10px',
                      color: '#fff',
                      fontSize: '12px',
                      fontFamily: 'var(--font-sans)',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* ============================================================ */}
        {/* TAB 2: GUIDED LEARNING PATHS */}
        {/* ============================================================ */}
        {selectedTab === 'paths' && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '30px 40px' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <span className="badge cyan">GUIDED ROADMAPS</span>
                <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', marginTop: '6px' }}>
                  Curated Learning Paths
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Step-by-step conceptual mastery progression designed to build solid algorithmic foundations.
                </p>
              </div>

              {/* Path Switcher Tabs */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {LEARNING_PATHS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setActivePathId(p.id)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '12px',
                      fontWeight: activePathId === p.id ? 600 : 400,
                      color: activePathId === p.id ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                      background: activePathId === p.id ? 'var(--bg-surface-elevated)' : 'transparent',
                      border: `1px solid ${activePathId === p.id ? 'var(--accent-cyan)' : 'var(--border-subtle)'}`,
                      cursor: 'pointer'
                    }}
                  >
                    {p.name}
                  </button>
                ))}
              </div>

              {/* Active Path Description Card */}
              <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>{activePath.name}</h3>
                    <span className="badge amber">{activePath.level}</span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{activePath.description}</p>
                </div>

                {/* Algorithm Step Sequence */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {activePath.algorithms.map((algoId, idx) => {
                    const a = ALGORITHMS[algoId];
                    if (!a) return null;

                    return (
                      <div
                        key={algoId}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 16px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid var(--border-subtle)',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: 'var(--bg-surface-elevated)',
                            border: '1px solid var(--accent-cyan)',
                            color: 'var(--accent-cyan)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            fontFamily: 'var(--font-mono)',
                            fontWeight: 700
                          }}>
                            {idx + 1}
                          </span>
                          <div>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>{a.name}</span>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '8px' }}>
                              ({a.complexity?.timeAverage})
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleLaunchVisualizer(algoId)}
                          className="btn-primary"
                          style={{ fontSize: '11px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Play size={11} fill="#000000" />
                          <span>Visualize</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: CUSTOM ALGORITHM BUILDER STUDIO */}
        {/* ============================================================ */}
        {selectedTab === 'builder' && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '30px 40px' }}>
            <div style={{ maxWidth: '980px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className="badge cyan">DEVELOPER SDK</span>
                    <span className="badge emerald">SANDBOXED ENGINE</span>
                  </div>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff' }}>
                    Custom Algorithm Platform & Builder
                  </h2>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Define, test, 3D-visualize, and benchmark your own custom algorithms using standard ALGO3D execution context primitives.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={handleRunBuilderTests}
                    className="btn-secondary"
                    style={{ fontSize: '12px', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <CheckCircle2 size={13} style={{ color: 'var(--accent-emerald)' }} />
                    <span>Run Test Cases</span>
                  </button>

                  <button
                    onClick={handleSaveCustomAlgo}
                    className="btn-primary"
                    style={{ fontSize: '12px', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Save size={13} fill="#000000" />
                    <span>Save Custom Algorithm</span>
                  </button>
                </div>
              </div>

              {/* Builder Inputs */}
              <div className="glass-panel" style={{ padding: '18px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                      ALGORITHM IDENTIFIER (ID)
                    </span>
                    <input
                      type="text"
                      value={builderId}
                      onChange={(e) => setBuilderId(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'rgba(0,0,0,0.5)',
                        border: '1px solid var(--border-medium)',
                        padding: '6px 10px',
                        borderRadius: 'var(--radius-sm)',
                        color: '#fff',
                        fontSize: '12px',
                        fontFamily: 'var(--font-mono)'
                      }}
                    />
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                      DISPLAY NAME
                    </span>
                    <input
                      type="text"
                      value={builderName}
                      onChange={(e) => setBuilderName(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'rgba(0,0,0,0.5)',
                        border: '1px solid var(--border-medium)',
                        padding: '6px 10px',
                        borderRadius: 'var(--radius-sm)',
                        color: '#fff',
                        fontSize: '12px'
                      }}
                    />
                  </div>
                </div>

                {/* Code Editor Area */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      ALGORITHM CODE (JavaScript)
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--accent-cyan)' }}>
                      Context APIs: context.compare(i, j) | context.swap(i, j) | context.emit(op)
                    </span>
                  </div>
                  <textarea
                    rows={12}
                    value={builderCode}
                    onChange={(e) => setBuilderCode(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(0, 0, 0, 0.7)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '12px',
                      color: '#38bdf8',
                      fontSize: '12px',
                      fontFamily: 'var(--font-mono)',
                      lineHeight: '1.6',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Test Results Output */}
                {testResults && (
                  <div style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: testResults.allPassed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    border: `1px solid ${testResults.allPassed ? 'var(--accent-emerald)' : '#ef4444'}`
                  }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: testResults.allPassed ? 'var(--accent-emerald)' : '#ef4444', marginBottom: '6px' }}>
                      {testResults.allPassed ? '✓ ALL TEST CASES PASSED' : '✗ TEST SUITE FAILED'}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                      {testResults.results.map((r) => (
                        <div key={r.testId} style={{ color: r.passed ? 'var(--text-secondary)' : '#ef4444' }}>
                          Test #{r.testId}: [{r.input.join(', ')}] ➔ [{r.actual?.join(', ') || 'error'}] ({r.passed ? 'PASSED' : 'FAILED'})
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
