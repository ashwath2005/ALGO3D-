import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChallengeEngine,
  CHALLENGE_CATEGORIES,
  CHALLENGES_DATABASE
} from '../algorithms/challenges/ChallengeEngine.js';
import { useVisualizerStore } from '../store/useVisualizerStore.js';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  HelpCircle,
  Flame,
  Bug,
  Cpu,
  Brain,
  Play,
  Award
} from 'lucide-react';

export function ChallengePage() {
  const navigate = useNavigate();
  const setAlgorithm = useVisualizerStore((s) => s.setAlgorithm);

  const [activeCategory, setActiveCategory] = useState('All');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [progress, setProgress] = useState(ChallengeEngine.getProgress());

  const activeChallenges = ChallengeEngine.getChallengesByCategory(activeCategory);
  const challenge = activeChallenges[currentIdx] || activeChallenges[0];
  const isCorrect = selectedOpt === challenge?.correctIndex;

  const handleSelectOption = (optIdx) => {
    if (submitted) return;
    setSelectedOpt(optIdx);
  };

  const handleSubmit = () => {
    if (selectedOpt === null || submitted) return;
    setSubmitted(true);

    if (selectedOpt === challenge.correctIndex) {
      const updated = ChallengeEngine.recordSuccess(challenge.id);
      setProgress(updated);
    }
  };

  const handleNext = () => {
    setSubmitted(false);
    setSelectedOpt(null);
    setCurrentIdx((prev) => (prev + 1) % activeChallenges.length);
  };

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setCurrentIdx(0);
    setSubmitted(false);
    setSelectedOpt(null);
  };

  const handleInspectIn3D = () => {
    if (challenge?.targetAlgorithm) {
      setAlgorithm(challenge.targetAlgorithm);
      navigate('/visualizer');
    }
  };

  if (!challenge) {
    return (
      <div style={{ padding: '40px', color: '#fff', textAlign: 'center' }}>
        No challenges found in this category.
      </div>
    );
  }

  return (
    <div style={{
      width: '100%',
      minHeight: 'calc(100vh - var(--nav-height))',
      padding: '32px 40px',
      background: 'var(--bg-primary)',
      color: '#f5f5f5',
      overflowY: 'auto'
    }}>
      <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Header with Progress Ribbon */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge cyan">PHASE 5 CHALLENGE LAB</span>
              <span className="badge amber">INTERACTIVE MASTERY</span>
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.5px' }}>
              Algorithm Challenge Studio
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Test your operational intuition: predict next steps, analyze asymptotic boundaries, and identify code bugs.
            </p>
          </div>

          {/* Progress & Streak Counters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              className="glass-panel"
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: '1px solid rgba(245, 158, 11, 0.3)'
              }}
            >
              <Flame size={16} style={{ color: 'var(--accent-amber)' }} />
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>SCORE</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>{progress.score} pts</span>
              </div>
            </div>

            <div
              className="glass-panel"
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }}
            >
              <Award size={16} style={{ color: 'var(--accent-emerald)' }} />
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>SOLVED</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>
                  {progress.completedIds.length} / {CHALLENGES_DATABASE.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div style={{ display: 'flex', gap: '6px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px', flexWrap: 'wrap' }}>
          {CHALLENGE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '12px',
                fontWeight: activeCategory === cat ? 600 : 400,
                color: activeCategory === cat ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                background: activeCategory === cat ? 'var(--bg-surface-elevated)' : 'transparent',
                border: `1px solid ${activeCategory === cat ? 'var(--accent-cyan)' : 'transparent'}`,
                cursor: 'pointer'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Challenge Card Container */}
        <div
          className="glass-panel"
          style={{
            padding: '24px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            boxShadow: '0 20px 45px rgba(0, 0, 0, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Challenge Metadata Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge cyan">{challenge.category}</span>
              <span className="badge amber">{challenge.difficulty}</span>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                Challenge #{currentIdx + 1} of {activeChallenges.length}
              </span>
            </div>

            {challenge.targetAlgorithm && (
              <button
                onClick={handleInspectIn3D}
                className="btn-secondary"
                style={{ fontSize: '11px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                <Play size={11} fill="currentColor" />
                <span>Inspect in 3D Scene</span>
              </button>
            )}
          </div>

          {/* Title & Scenario */}
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
              {challenge.title}
            </h2>
            {challenge.scenario && (
              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.5)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px 14px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  color: 'var(--accent-cyan)',
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.5'
                }}
              >
                {challenge.scenario}
              </div>
            )}
          </div>

          {/* Question */}
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>
            {challenge.question}
          </div>

          {/* Options Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {challenge.options.map((opt, idx) => {
              const isSelected = selectedOpt === idx;
              const isCorrectOption = idx === challenge.correctIndex;

              let bg = 'rgba(255, 255, 255, 0.02)';
              let border = '1px solid var(--border-subtle)';
              let color = '#ffffff';

              if (submitted) {
                if (isCorrectOption) {
                  bg = 'rgba(16, 185, 129, 0.15)';
                  border = '1px solid var(--accent-emerald)';
                  color = 'var(--accent-emerald)';
                } else if (isSelected) {
                  bg = 'rgba(239, 68, 68, 0.15)';
                  border = '1px solid #ef4444';
                  color = '#ef4444';
                }
              } else if (isSelected) {
                bg = 'rgba(56, 189, 248, 0.15)';
                border = '1px solid var(--accent-cyan)';
                color = 'var(--accent-cyan)';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={submitted}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-sm)',
                    background: bg,
                    border,
                    color,
                    fontSize: '13px',
                    textAlign: 'left',
                    cursor: submitted ? 'default' : 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: 'var(--text-muted)',
                      width: '18px'
                    }}>
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    <span>{opt}</span>
                  </div>

                  {submitted && isCorrectOption && (
                    <CheckCircle2 size={16} style={{ color: 'var(--accent-emerald)' }} />
                  )}
                  {submitted && isSelected && !isCorrectOption && (
                    <XCircle size={16} style={{ color: '#ef4444' }} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Banner upon submit */}
          {submitted && (
            <div
              style={{
                background: isCorrect ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                border: `1px solid ${isCorrect ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                borderRadius: 'var(--radius-sm)',
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}
            >
              <div style={{
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                color: isCorrect ? 'var(--accent-emerald)' : '#ef4444'
              }}>
                {isCorrect ? '✓ CORRECT ANSWER' : '✗ INCORRECT'}
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                {challenge.explanation}
              </p>
            </div>
          )}

          {/* Action Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
            <button
              onClick={() => {
                setSubmitted(false);
                setSelectedOpt(null);
              }}
              className="btn-icon"
              title="Reset current challenge"
              style={{ width: '34px', height: '34px' }}
            >
              <RotateCcw size={14} />
            </button>

            {!submitted ? (
              <button
                onClick={handleSubmit}
                disabled={selectedOpt === null}
                className="btn-primary"
                style={{
                  padding: '8px 20px',
                  fontSize: '13px',
                  fontWeight: 600,
                  opacity: selectedOpt === null ? 0.5 : 1
                }}
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="btn-primary"
                style={{
                  padding: '8px 20px',
                  fontSize: '13px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>Next Challenge</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
