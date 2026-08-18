import React from 'react';
import { Layers, Terminal, Sparkles, Cpu, ShieldCheck, Users, ExternalLink } from 'lucide-react';

function GithubIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export function AboutPage() {
  return (
    <div style={{
      width: '100%',
      minHeight: 'calc(100vh - var(--nav-height))',
      padding: '48px 40px',
      background: 'var(--bg-primary)',
      overflowY: 'auto'
    }}>
      <div style={{ maxWidth: '820px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div>
          <span className="badge cyan" style={{ marginBottom: '8px' }}>ARCHITECTURE & COLLABORATION</span>
          <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#ffffff', marginTop: '6px' }}>
            About ALGO3D
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: '1.6' }}>
            ALGO3D is an interactive 3D laboratory built for developers, computer science students, and researchers to explore data structures and algorithms through decoupled step-by-step 3D visual execution and deterministic empirical benchmarking.
          </p>
        </div>

        {/* Project Authors & Team */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={18} style={{ color: 'var(--accent-cyan)' }} />
            <span>Project Authors & Collaborators</span>
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            {/* Ashwath S */}
            <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>Ashwath S</span>
                <a
                  href="https://github.com/ashwath2005"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontSize: '12px', fontFamily: 'var(--font-mono)' }}
                >
                  <GithubIcon size={14} />
                  <span>@ashwath2005</span>
                </a>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
                3D Graphics & Engine Architecture
              </span>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Engineered the WebGL Three.js scenes, unified execution engine, semantic camera choreography, and sound synthesizer.
              </p>
            </div>

            {/* Cathrin */}
            <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>Cathrin</span>
                <a
                  href="https://github.com/Cathrin-11"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontSize: '12px', fontFamily: 'var(--font-mono)' }}
                >
                  <GithubIcon size={14} />
                  <span>@Cathrin-11</span>
                </a>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--accent-purple)', fontFamily: 'var(--font-mono)' }}>
                Algorithms & Benchmarking Systems
              </span>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Co-developed algorithm models, deterministic dataset configurations, challenge laboratory, and educational intelligence systems.
              </p>
            </div>
          </div>
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
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
