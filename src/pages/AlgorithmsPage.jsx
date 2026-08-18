import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ALGORITHMS, CATEGORIES } from '../algorithms/registry.js';
import { ALGORITHM_METADATA } from '../algorithms/knowledge/KnowledgeBase.js';
import { useVisualizerStore } from '../store/useVisualizerStore.js';
import {
  Search,
  Play,
  ArrowRight,
  BookOpen,
  Layers,
  Sparkles,
  Zap,
  ShieldCheck,
  Cpu,
  HelpCircle,
  BarChart2
} from 'lucide-react';

export function AlgorithmsPage() {
  const [selectedCat, setSelectedCat] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const setAlgorithm = useVisualizerStore((s) => s.setAlgorithm);

  const filtered = Object.values(ALGORITHMS).filter((algo) => {
    if (selectedCat !== 'all' && algo.category !== selectedCat) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const meta = ALGORITHM_METADATA[algo.id] || {};
      const matchName = algo.name.toLowerCase().includes(q);
      const matchDesc = algo.description.toLowerCase().includes(q);
      const matchParadigm = meta.paradigm?.toLowerCase().includes(q);
      const matchTags = algo.tags && algo.tags.some((t) => t.toLowerCase().includes(q));
      return matchName || matchDesc || matchTags || matchParadigm;
    }
    return true;
  });

  const handleLaunch = (algoId) => {
    setAlgorithm(algoId);
    navigate('/visualizer');
  };

  const handleLearn = (algoId) => {
    setAlgorithm(algoId);
    navigate('/learn');
  };

  const handleCompare = (algoId) => {
    navigate('/compare');
  };

  return (
    <div style={{
      width: '100%',
      minHeight: 'calc(100vh - var(--nav-height))',
      padding: '36px 40px',
      background: 'var(--bg-primary)',
      color: '#f5f5f5',
      overflowY: 'auto'
    }}>
      <div style={{ maxWidth: '1180px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge cyan">ALGORITHM ATLAS</span>
              <span className="badge emerald">42 BESPOKE 3D MODELS</span>
            </div>
            <h1 style={{ fontSize: '30px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.5px' }}>
              The 3D Algorithm Universe
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Structured theoretical properties, time/space complexities, algorithm prerequisites, and real-time 3D models.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge cyan" style={{ padding: '6px 12px', fontSize: '12px' }}>
              {filtered.length} Algorithms Listed
            </span>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div
          className="glass-panel"
          style={{
            padding: '12px 18px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          {/* Search Input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '240px' }}>
            <Search size={15} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search algorithm, paradigm, complexity, or prerequisite..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '13px',
                width: '100%',
                outline: 'none'
              }}
            />
          </div>

          {/* Category Chips */}
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedCat('all')}
              style={{
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '11px',
                background: selectedCat === 'all' ? 'var(--bg-surface-elevated)' : 'transparent',
                border: `1px solid ${selectedCat === 'all' ? 'var(--accent-cyan)' : 'var(--border-subtle)'}`,
                color: selectedCat === 'all' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              All Categories
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.name)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '11px',
                  background: selectedCat === cat.name ? 'var(--bg-surface-elevated)' : 'transparent',
                  border: `1px solid ${selectedCat === cat.name ? 'var(--accent-cyan)' : 'var(--border-subtle)'}`,
                  color: selectedCat === cat.name ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Algorithm Atlas Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: '16px'
        }}>
          {filtered.map((algo) => {
            const meta = ALGORITHM_METADATA[algo.id] || {};
            const comp = algo.complexity || {};

            return (
              <div
                key={algo.id}
                className="glass-panel"
                style={{
                  padding: '18px',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '14px',
                  transition: 'all 0.2s ease',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}
              >
                <div>
                  {/* Category & Difficulty Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span className="badge cyan" style={{ fontSize: '10px' }}>
                      {algo.category}
                    </span>
                    <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      {meta.difficulty || 'Intermediate'}
                    </span>
                  </div>

                  {/* Algorithm Title */}
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
                    {algo.name}
                  </h3>

                  {/* Short Description */}
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '12px' }}>
                    {algo.description}
                  </p>

                  {/* Complexity & Paradigm Strip */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '6px',
                    padding: '8px 10px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '10px' }}>TIME (AVG)</span>
                      <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{comp.timeAverage || 'N/A'}</span>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '10px' }}>SPACE</span>
                      <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>{comp.space || 'O(1)'}</span>
                    </div>
                  </div>

                  {/* Prerequisites Tags */}
                  {meta.prerequisites?.length > 0 && (
                    <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginRight: '2px' }}>Prerequisites:</span>
                      {meta.prerequisites.map((p, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: '9px',
                            fontFamily: 'var(--font-mono)',
                            padding: '1px 5px',
                            borderRadius: '3px',
                            background: 'rgba(255, 255, 255, 0.04)',
                            color: 'var(--text-secondary)'
                          }}
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '12px'
                }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => handleLearn(algo.id)}
                      className="btn-secondary"
                      style={{ fontSize: '11px', padding: '5px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <BookOpen size={12} />
                      <span>Learn</span>
                    </button>
                    <button
                      onClick={() => handleCompare(algo.id)}
                      className="btn-secondary"
                      style={{ fontSize: '11px', padding: '5px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <BarChart2 size={12} />
                      <span>Bench</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleLaunch(algo.id)}
                    className="btn-primary"
                    style={{ fontSize: '11px', padding: '5px 12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Play size={12} fill="#000000" />
                    <span>3D View</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
