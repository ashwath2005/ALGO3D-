import React, { Suspense } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { CosmicAlgorithmField } from '../three/particles/CosmicAlgorithmField.jsx';
import { useVisualizerStore } from '../store/useVisualizerStore.js';
import { Play, Compass, Activity, Layers, Terminal, Zap } from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();
  const setAlgorithm = useVisualizerStore((s) => s.setAlgorithm);

  const handleLaunch = (algoId) => {
    setAlgorithm(algoId);
    navigate('/visualizer');
  };

  return (
    <div style={{
      width: '100%',
      minHeight: 'calc(100vh - var(--nav-height))',
      position: 'relative',
      overflowY: 'auto',
      overflowX: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      background: '#000000',
      color: '#f5f5f5'
    }}>
      {/* 1. Live 3D Cosmic Particle & Constellation Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.8
      }}>
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
          <Suspense fallback={null}>
            <CosmicAlgorithmField count={400} />
          </Suspense>
        </Canvas>
      </div>

      {/* 2. Soft Vignette / Spotlight Layer */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '900px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(56, 189, 248, 0.08) 0%, rgba(16, 185, 129, 0.03) 40%, rgba(0, 0, 0, 0) 75%)',
        pointerEvents: 'none',
        zIndex: 1
      }} />

      {/* 3. Main Hero Content Container */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '90px 24px 50px 24px',
        maxWidth: '1080px',
        margin: '0 auto'
      }}>
        {/* Release Pill Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '24px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--text-secondary)',
          marginBottom: '28px',
          backdropFilter: 'blur(12px)',
          letterSpacing: '0.4px'
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-cyan)' }} />
          ALGO3D 2.0 • 42 BESPOKE 3D ALGORITHM SCENES
        </div>

        {/* Master Clean Typography Headline */}
        <h1 style={{
          fontSize: 'clamp(42px, 7vw, 84px)',
          fontWeight: 800,
          lineHeight: '1.04',
          letterSpacing: '-3px',
          color: '#ffffff',
          marginBottom: '24px',
          maxWidth: '920px'
        }}>
          Where Algorithms<br />
          <span style={{
            background: 'linear-gradient(180deg, #ffffff 30%, rgba(255, 255, 255, 0.6) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Become Physical Space.
          </span>
        </h1>

        <p style={{
          fontSize: 'clamp(15px, 2vw, 18px)',
          color: 'var(--text-secondary)',
          maxWidth: '620px',
          lineHeight: '1.6',
          marginBottom: '44px'
        }}>
          An interactive 3D laboratory for Data Structures & Algorithms. Watch recursion collapse, tree rotations balance, and shortest paths illuminate in real time.
        </p>

        {/* Primary Call to Action Buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: '52px'
        }}>
          <Link
            to="/visualizer"
            className="btn-primary"
            style={{
              padding: '14px 34px',
              fontSize: '14px',
              fontWeight: 700,
              textDecoration: 'none',
              borderRadius: 'var(--radius-sm)',
              boxShadow: '0 0 30px rgba(56, 189, 248, 0.35)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Play size={16} fill="#000000" />
            <span>LAUNCH 3D LAB</span>
          </Link>

          <Link
            to="/algorithms"
            className="btn-secondary"
            style={{
              padding: '14px 28px',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Compass size={16} />
            <span>ALGORITHM ATLAS</span>
          </Link>

          <Link
            to="/compare"
            className="btn-secondary"
            style={{
              padding: '14px 28px',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Activity size={16} />
            <span>BENCHMARK LAB</span>
          </Link>
        </div>

        {/* Featured Signature Algorithms */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          maxWidth: '850px'
        }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.5px' }}>
            FEATURED:
          </span>
          {[
            { id: 'quick-sort', label: 'Quick Sort 3D' },
            { id: 'dijkstra', label: 'Dijkstra Shortest Path' },
            { id: 'avl-tree', label: 'AVL Rotations' },
            { id: 'n-queens', label: 'N-Queens Chess' },
            { id: 'kmp-search', label: 'KMP String' },
            { id: 'convex-hull-graham', label: 'Convex Hull' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleLaunch(item.id)}
              style={{
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                backdropFilter: 'blur(8px)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-cyan)';
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.background = 'rgba(56, 189, 248, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Four Platform Feature Pillars */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '1140px',
        margin: '40px auto 80px auto',
        padding: '0 24px',
        width: '100%'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          {/* Card 1 */}
          <div style={{
            background: 'rgba(10, 15, 26, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 'var(--radius-md)',
            padding: '28px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            backdropFilter: 'blur(16px)',
            transition: 'border-color var(--transition-fast)'
          }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              background: 'rgba(56, 189, 248, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-cyan)'
            }}>
              <Layers size={20} />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>42 Bespoke 3D Scenes</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Every algorithm features a unique physical metaphor—from 3D constraint chessboards to live AVL tree rotations.
            </p>
          </div>

          {/* Card 2 */}
          <div style={{
            background: 'rgba(10, 15, 26, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 'var(--radius-md)',
            padding: '28px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            backdropFilter: 'blur(16px)',
            transition: 'border-color var(--transition-fast)'
          }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-emerald)'
            }}>
              <Activity size={20} />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>Deterministic Lab</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Mulberry32 seeded PRNG runs reproducible algorithm races, variance distributions, and asymptotic sweeps across N=10..500.
            </p>
          </div>

          {/* Card 3 */}
          <div style={{
            background: 'rgba(10, 15, 26, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 'var(--radius-md)',
            padding: '28px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            backdropFilter: 'blur(16px)',
            transition: 'border-color var(--transition-fast)'
          }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              background: 'rgba(168, 85, 247, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-purple)'
            }}>
              <Terminal size={20} />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>Custom Algorithm SDK</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Write custom JavaScript algorithms with automated test runners and render them live in the 3D WebGL scene.
            </p>
          </div>

          {/* Card 4 */}
          <div style={{
            background: 'rgba(10, 15, 26, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 'var(--radius-md)',
            padding: '28px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            backdropFilter: 'blur(16px)',
            transition: 'border-color var(--transition-fast)'
          }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              background: 'rgba(245, 158, 11, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-amber)'
            }}>
              <Zap size={20} />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>Time Travel Engine</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Instant checkpoint recovery and state reconstruction across any point in execution history with zero drift.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Minimalist Footer */}
      <footer style={{
        marginTop: 'auto',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '24px',
        textAlign: 'center',
        fontSize: '11px',
        color: 'var(--text-muted)',
        fontFamily: 'var(--font-mono)',
        position: 'relative',
        zIndex: 10,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(10px)'
      }}>
        <span>ALGO3D • THE INTERACTIVE 3D ALGORITHM LABORATORY</span>
      </footer>
    </div>
  );
}
