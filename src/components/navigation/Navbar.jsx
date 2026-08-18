import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Layers,
  Sliders,
  Volume2,
  VolumeX,
  Search,
  BookOpen,
  Info,
  Play,
  Keyboard
} from 'lucide-react';
import { useSettingsStore } from '../../store/useSettingsStore.js';

export function Navbar({ onOpenSearch, onOpenSettings, onOpenShortcuts }) {
  const location = useLocation();
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const setSoundEnabled = useSettingsStore((s) => s.setSoundEnabled);

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{
      height: 'var(--nav-height)',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'relative',
      zIndex: 40
    }}>
      {/* Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            background: '#0a0a0a',
            border: '1px solid var(--border-medium)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              border: '2px solid var(--accent-cyan)',
              borderRadius: '2px',
              transform: 'rotate(45deg)'
            }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{
              fontSize: '14px',
              fontWeight: 700,
              letterSpacing: '1px',
              color: '#ffffff',
              fontFamily: 'var(--font-mono)'
            }}>
              ALGO3D
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Link
            to="/visualizer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              fontWeight: 500,
              color: isActive('/visualizer') ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: isActive('/visualizer') ? 'var(--bg-surface-elevated)' : 'transparent',
              border: `1px solid ${isActive('/visualizer') ? 'var(--border-medium)' : 'transparent'}`,
              textDecoration: 'none',
              transition: 'all var(--transition-fast)'
            }}
          >
            <Play size={13} style={{ color: 'var(--accent-cyan)' }} />
            <span>Visualizer</span>
          </Link>

          <Link
            to="/algorithms"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              fontWeight: 500,
              color: isActive('/algorithms') ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: isActive('/algorithms') ? 'var(--bg-surface-elevated)' : 'transparent',
              border: `1px solid ${isActive('/algorithms') ? 'var(--border-medium)' : 'transparent'}`,
              textDecoration: 'none',
              transition: 'all var(--transition-fast)'
            }}
          >
            <Layers size={13} />
            <span>Atlas</span>
          </Link>

          <Link
            to="/compare"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              fontWeight: 500,
              color: isActive('/compare') ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: isActive('/compare') ? 'var(--bg-surface-elevated)' : 'transparent',
              border: `1px solid ${isActive('/compare') ? 'var(--border-medium)' : 'transparent'}`,
              textDecoration: 'none',
              transition: 'all var(--transition-fast)'
            }}
          >
            <span>Compare</span>
          </Link>

          <Link
            to="/challenge"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              fontWeight: 500,
              color: isActive('/challenge') ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: isActive('/challenge') ? 'var(--bg-surface-elevated)' : 'transparent',
              border: `1px solid ${isActive('/challenge') ? 'var(--border-medium)' : 'transparent'}`,
              textDecoration: 'none',
              transition: 'all var(--transition-fast)'
            }}
          >
            <span>Challenge</span>
          </Link>

          <Link
            to="/learn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              fontWeight: 500,
              color: isActive('/learn') ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: isActive('/learn') ? 'var(--bg-surface-elevated)' : 'transparent',
              border: `1px solid ${isActive('/learn') ? 'var(--border-medium)' : 'transparent'}`,
              textDecoration: 'none',
              transition: 'all var(--transition-fast)'
            }}
          >
            <BookOpen size={13} />
            <span>Learn</span>
          </Link>

          <Link
            to="/about"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              fontWeight: 500,
              color: isActive('/about') ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: isActive('/about') ? 'var(--bg-surface-elevated)' : 'transparent',
              border: `1px solid ${isActive('/about') ? 'var(--border-medium)' : 'transparent'}`,
              textDecoration: 'none',
              transition: 'all var(--transition-fast)'
            }}
          >
            <Info size={13} />
            <span>About</span>
          </Link>
        </nav>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Search button */}
        <button
          onClick={onOpenSearch}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '5px 12px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)',
            fontSize: '12px'
          }}
        >
          <Search size={13} />
          <span>Search</span>
          <kbd style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            background: 'rgba(255,255,255,0.06)',
            padding: '1px 4px',
            borderRadius: '3px',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            ⌘K
          </kbd>
        </button>

        {/* Audio Mute Toggle */}
        <button
          className="btn-icon"
          onClick={() => setSoundEnabled(!soundEnabled)}
          title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
        >
          {soundEnabled ? <Volume2 size={15} style={{ color: 'var(--accent-cyan)' }} /> : <VolumeX size={15} />}
        </button>

        {/* Keyboard Shortcuts button */}
        {onOpenShortcuts && (
          <button
            className="btn-icon"
            onClick={onOpenShortcuts}
            title="Keyboard Shortcuts (Key: ?)"
          >
            <Keyboard size={15} />
          </button>
        )}

        {/* Settings button */}
        <button
          className="btn-icon"
          onClick={onOpenSettings}
          title="Open Settings"
        >
          <Sliders size={15} />
        </button>
      </div>
    </header>
  );
}
