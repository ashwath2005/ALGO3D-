import React, { useState } from 'react';
import { useVisualizerStore } from '../../store/useVisualizerStore.js';
import { Sparkles, ChevronDown, ChevronUp, X, HelpCircle, ArrowRight, ShieldCheck, ArrowRightCircle } from 'lucide-react';

export function StateDiffPanel() {
  const [open, setOpen] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const currentStep = useVisualizerStore((s) => s.currentStep);
  const educationalState = useVisualizerStore((s) => s.educationalState);

  const what = educationalState?.what || currentStep?.metadata?.explanation || currentStep?.description;
  const why = educationalState?.why;
  const where = educationalState?.where;
  const diff = educationalState?.diff;
  const invariant = educationalState?.invariant;
  const nextOp = educationalState?.nextOp;

  if (!what || !open) return null;

  return (
    <div
      className="glass-panel"
      style={{
        position: 'absolute',
        top: '12px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        maxWidth: expanded ? '680px' : '560px',
        padding: '10px 16px',
        borderRadius: expanded ? 'var(--radius-md)' : 'var(--radius-full)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        zIndex: 30,
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.65)',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        background: 'rgba(5, 5, 5, 0.88)',
        backdropFilter: 'blur(16px)',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* Top Banner Row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '26px',
          height: '26px',
          borderRadius: '6px',
          background: 'var(--accent-cyan-dim)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Sparkles size={14} style={{ color: 'var(--accent-cyan)' }} />
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', fontWeight: 700 }}>
              {currentStep?.type || 'INFO'} OPERATION
            </span>
            {where && (
              <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                • {where}
              </span>
            )}
          </div>
          <div style={{
            fontSize: '12px',
            color: '#f5f5f5',
            lineHeight: '1.4',
            whiteSpace: expanded ? 'normal' : 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {what}
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="btn-icon"
          style={{ width: '24px', height: '24px', flexShrink: 0 }}
          title={expanded ? 'Collapse Details' : 'Expand Educational Intelligence'}
        >
          {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>

        <button
          onClick={() => setOpen(false)}
          className="btn-icon"
          style={{ width: '24px', height: '24px', flexShrink: 0 }}
          title="Close HUD"
        >
          <X size={12} />
        </button>
      </div>

      {/* Expanded Educational Drawer */}
      {expanded && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          paddingTop: '8px',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: '11px',
          fontFamily: 'var(--font-mono)'
        }}>
          {/* WHY Section */}
          {why && (
            <div style={{
              background: 'rgba(56, 189, 248, 0.06)',
              padding: '6px 10px',
              borderRadius: 'var(--radius-sm)',
              borderLeft: '2px solid var(--accent-cyan)'
            }}>
              <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '2px' }}>
                WHY THIS STEP OCCURRED:
              </div>
              <div style={{ color: 'var(--text-secondary)', lineHeight: '1.4', fontFamily: 'inherit' }}>
                {why}
              </div>
            </div>
          )}

          {/* STATE DIFF Section */}
          {diff && diff.changes && diff.changes.length > 0 && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '6px 10px',
              borderRadius: 'var(--radius-sm)',
              borderLeft: '2px solid var(--accent-amber)'
            }}>
              <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--accent-amber)', marginBottom: '4px' }}>
                STATE DIFF (BEFORE ➔ AFTER):
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {diff.changes.slice(0, 3).map((ch, idx) => (
                  <div key={`diff-${idx}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                    <span style={{ color: '#fff', fontWeight: 600 }}>{ch.entity}:</span>
                    <span style={{ color: 'var(--text-muted)' }}>{ch.prev !== undefined ? String(ch.prev) : 'none'}</span>
                    <ArrowRight size={10} style={{ color: 'var(--accent-amber)' }} />
                    <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>{ch.next !== undefined ? String(ch.next) : 'none'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ALGORITHM INVARIANT Section */}
          {invariant && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.05)',
              padding: '6px 10px',
              borderRadius: 'var(--radius-sm)',
              borderLeft: '2px solid var(--accent-emerald)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '9px', fontWeight: 700, color: 'var(--accent-emerald)', marginBottom: '2px' }}>
                <ShieldCheck size={11} />
                <span>INVARIANT: {invariant.name}</span>
                <span className="badge green" style={{ fontSize: '8px', padding: '0 4px' }}>{invariant.status}</span>
              </div>
              <div style={{ color: 'var(--text-secondary)', lineHeight: '1.3' }}>
                {invariant.detail || invariant.statement}
              </div>
            </div>
          )}

          {/* NEXT OPERATION PREVIEW */}
          {nextOp && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--text-muted)',
              fontSize: '10px',
              paddingTop: '2px'
            }}>
              <ArrowRightCircle size={11} style={{ color: 'var(--accent-cyan)' }} />
              <span>NEXT STEP:</span>
              <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{nextOp}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
