import React, { useRef, useState, useEffect } from 'react';
import {
  ALGORITHMS,
  CATEGORIES,
  getAlgorithmById
} from '../../algorithms/registry.js';
import { useVisualizerStore } from '../../store/useVisualizerStore.js';
import {
  Shuffle,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Sparkles,
  SlidersHorizontal
} from 'lucide-react';

export function AlgorithmSelector() {
  const algorithmId = useVisualizerStore((s) => s.algorithmId);
  const setAlgorithm = useVisualizerStore((s) => s.setAlgorithm);
  const dataMode = useVisualizerStore((s) => s.dataMode);
  const dataSize = useVisualizerStore((s) => s.dataSize);
  const regenerateData = useVisualizerStore((s) => s.regenerateData);
  const setCustomData = useVisualizerStore((s) => s.setCustomData);
  const structureType = useVisualizerStore((s) => s.structureType);

  const [activeCategory, setActiveCategory] = useState(() => {
    const initialAlgo = ALGORITHMS[algorithmId];
    return initialAlgo?.category || 'sorting';
  });
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customInput, setCustomInput] = useState('35, 12, 89, 42, 60, 18, 77');

  const categoryScrollRef = useRef(null);
  const algoScrollRef = useRef(null);

  // Sync category when algorithm changes
  useEffect(() => {
    const currentAlgo = ALGORITHMS[algorithmId];
    if (currentAlgo && currentAlgo.category) {
      setActiveCategory(currentAlgo.category);
    }
  }, [algorithmId]);

  const filteredAlgos = Object.values(ALGORITHMS).filter((algo) => {
    if (activeCategory === 'all') return true;
    return algo.category === activeCategory;
  });

  const handleCategoryClick = (catId) => {
    setActiveCategory(catId);
    const algosInCat = Object.values(ALGORITHMS).filter((a) => catId === 'all' || a.category === catId);
    if (algosInCat.length > 0) {
      const isAlreadyInCat = algosInCat.some((a) => a.id === algorithmId);
      if (!isAlreadyInCat) {
        setAlgorithm(algosInCat[0].id);
      }
    }
  };

  const scrollNav = (ref, offset) => {
    if (ref.current) {
      ref.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    const parsed = customInput
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n) && n > 0 && n <= 100);

    if (parsed.length > 0) {
      setCustomData(parsed);
      setShowCustomModal(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      background: 'rgba(5, 5, 5, 0.9)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'relative',
      zIndex: 30
    }}>
      {/* Upper Row: Category Navigation Carousel + Dataset Controls */}
      <div style={{
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        {/* Category Scroll Container with Chevron Arrows */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1, minWidth: 0 }}>
          <button
            onClick={() => scrollNav(categoryScrollRef, -200)}
            className="btn-icon"
            style={{ width: '24px', height: '24px', flexShrink: 0, padding: 0 }}
            title="Scroll categories left"
          >
            <ChevronLeft size={14} />
          </button>

          <div
            ref={categoryScrollRef}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              overflowX: 'auto',
              scrollbarWidth: 'none',
              scrollBehavior: 'smooth',
              padding: '2px 0'
            }}
          >
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  style={{
                    padding: '4px 12px',
                    fontSize: '11px',
                    fontWeight: isActive ? 600 : 500,
                    borderRadius: 'var(--radius-full)',
                    whiteSpace: 'nowrap',
                    color: isActive ? '#ffffff' : 'var(--text-secondary)',
                    background: isActive ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    border: isActive ? '1px solid var(--accent-cyan)' : '1px solid rgba(255, 255, 255, 0.06)',
                    boxShadow: isActive ? '0 0 12px rgba(56, 189, 248, 0.25)' : 'none',
                    transition: 'all var(--transition-fast)',
                    cursor: 'pointer',
                    flexShrink: 0
                  }}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => scrollNav(categoryScrollRef, 200)}
            className="btn-icon"
            style={{ width: '24px', height: '24px', flexShrink: 0, padding: 0 }}
            title="Scroll categories right"
          >
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Dataset Generator Controls (Array specific) */}
        {structureType === 'array' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            <button
              onClick={() => regenerateData('random')}
              className={`btn-secondary ${dataMode === 'random' ? 'active' : ''}`}
              style={{ fontSize: '10px', padding: '4px 8px' }}
              title="Random dataset"
            >
              <Shuffle size={11} />
              <span>Random</span>
            </button>

            <button
              onClick={() => regenerateData('nearly')}
              className={`btn-secondary ${dataMode === 'nearly' ? 'active' : ''}`}
              style={{ fontSize: '10px', padding: '4px 8px' }}
              title="Nearly sorted dataset"
            >
              <span>Nearly</span>
            </button>

            <button
              onClick={() => regenerateData('reverse')}
              className={`btn-secondary ${dataMode === 'reverse' ? 'active' : ''}`}
              style={{ fontSize: '10px', padding: '4px 8px' }}
              title="Reverse dataset"
            >
              <span>Reversed</span>
            </button>

            <button
              onClick={() => setShowCustomModal(true)}
              className="btn-secondary"
              style={{ fontSize: '10px', padding: '4px 8px' }}
              title="Custom input numbers"
            >
              <Edit3 size={11} />
              <span>Custom</span>
            </button>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.04)',
              padding: '3px 8px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)'
            }}>
              <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                N:{dataSize}
              </span>
              <input
                type="range"
                min="5"
                max="16"
                value={dataSize}
                onChange={(e) => regenerateData(dataMode, parseInt(e.target.value, 10))}
                style={{
                  width: '55px',
                  accentColor: 'var(--accent-cyan)',
                  cursor: 'pointer'
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Lower Row: Algorithm Pills Carousel (1-Click Switch) */}
      <div style={{
        padding: '6px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        background: 'rgba(0, 0, 0, 0.4)'
      }}>
        <button
          onClick={() => scrollNav(algoScrollRef, -180)}
          className="btn-icon"
          style={{ width: '22px', height: '22px', flexShrink: 0, padding: 0 }}
          title="Scroll algorithms left"
        >
          <ChevronLeft size={13} />
        </button>

        <div
          ref={algoScrollRef}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            scrollBehavior: 'smooth',
            flex: 1
          }}
        >
          {filteredAlgos.map((algo) => {
            const isSelected = algorithmId === algo.id;
            return (
              <button
                key={algo.id}
                onClick={() => setAlgorithm(algo.id)}
                style={{
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontWeight: isSelected ? 700 : 500,
                  borderRadius: '4px',
                  whiteSpace: 'nowrap',
                  color: isSelected ? 'var(--accent-cyan)' : 'var(--text-primary)',
                  background: isSelected ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                  border: isSelected ? '1px solid rgba(56, 189, 248, 0.6)' : '1px solid rgba(255, 255, 255, 0.06)',
                  boxShadow: isSelected ? '0 0 10px rgba(56, 189, 248, 0.2)' : 'none',
                  transition: 'all var(--transition-fast)',
                  cursor: 'pointer',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {isSelected && <Sparkles size={11} style={{ color: 'var(--accent-cyan)' }} />}
                <span>{algo.name}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => scrollNav(algoScrollRef, 180)}
          className="btn-icon"
          style={{ width: '22px', height: '22px', flexShrink: 0, padding: 0 }}
          title="Scroll algorithms right"
        >
          <ChevronRight size={13} />
        </button>
      </div>

      {/* Custom Data Input Modal */}
      {showCustomModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100
        }}>
          <div className="glass-panel" style={{
            width: '420px',
            padding: '24px',
            borderRadius: 'var(--radius-lg)'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: '#ffffff' }}>
              Custom Array Data
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Enter comma-separated numbers (1 - 100):
            </p>

            <form onSubmit={handleCustomSubmit}>
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-medium)',
                  color: '#ffffff',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  outline: 'none',
                  marginBottom: '16px'
                }}
                autoFocus
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Apply Dataset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
