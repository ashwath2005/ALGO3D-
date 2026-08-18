import React from 'react';
import { Layers, Terminal, Sparkles, Cpu, ShieldCheck } from 'lucide-react';

export function AboutPage() {
  return (
    <div style={{
      width: '100%',
      minHeight: 'calc(100vh - var(--nav-height))',
      padding: '48px 40px',
      background: 'var(--bg-primary)',
      overflowY: 'auto'
    }}>
      <div style={{ maxWidth: '780px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div>
          <span className="badge cyan" style={{ marginBottom: '8px' }}>ARCHITECTURE & PHILOSOPHY</span>
          <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#ffffff', marginTop: '6px' }}>
            About ALGO3D
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: '1.6' }}>
            ALGO3D is an interactive 3D laboratory built for developers, computer science students, and researchers to explore data structures and algorithms through decoupled step-by-step 3D visual execution.
          </p>
        </div>

        {/* Technical Architecture */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#ffffff' }}>
            Core Engineering Tenets
          </h2>

          <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent-cyan)', marginBottom: '6px' }}>
              1. Decoupled Algorithm Execution Engine
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Algorithms do not manipulate 3D objects or render trees directly. Instead, algorithmic procedures run through an execution engine that records discrete operations (<code>COMPARE</code>, <code>SWAP</code>, <code>VISIT</code>, <code>ROTATE</code>, <code>INSERT</code>). The visualizer consumes these operations reactively with bidirectional history scrubbing.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent-emerald)', marginBottom: '6px' }}>
              2. Cinematic 3D WebGL Visualization
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Built with Three.js, React Three Fiber, @react-three/drei, and GSAP. Features high-performance geometries, custom dynamic lighting, physical position interpolations, and an ultra-dark OLED visual language.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent-violet)', marginBottom: '6px' }}>
              3. Synchronized Code & Metrics Pipeline
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Each algorithmic step is mapped to its precise source code line and updates live comparison counters, swap counts, visited vertices, and computational complexity parameters in real time.
            </p>
          </div>
        </div>

        {/* Tech Stack */}
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#ffffff', marginBottom: '14px' }}>
            Technology Stack
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px'
          }}>
            <div style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ color: 'var(--text-muted)' }}>Core</div>
              <div style={{ color: '#ffffff', fontWeight: 600, marginTop: '4px' }}>React 18 + Vite</div>
            </div>
            <div style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ color: 'var(--text-muted)' }}>3D WebGL</div>
              <div style={{ color: '#ffffff', fontWeight: 600, marginTop: '4px' }}>Three.js + R3F + Drei</div>
            </div>
            <div style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ color: 'var(--text-muted)' }}>Animation</div>
              <div style={{ color: '#ffffff', fontWeight: 600, marginTop: '4px' }}>GSAP Interpolation</div>
            </div>
            <div style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ color: 'var(--text-muted)' }}>State Store</div>
              <div style={{ color: '#ffffff', fontWeight: 600, marginTop: '4px' }}>Zustand 5</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
