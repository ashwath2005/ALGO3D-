import React from 'react';
import { Check, Info } from 'lucide-react';

export function Toast({ message, visible, icon: Icon = Check }) {
  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '84px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(5, 5, 5, 0.92)',
        border: '1px solid var(--accent-cyan)',
        borderRadius: 'var(--radius-full)',
        padding: '8px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        zIndex: 150,
        boxShadow: '0 8px 32px rgba(56, 189, 248, 0.3)',
        backdropFilter: 'blur(16px)',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <Icon size={14} style={{ color: 'var(--accent-cyan)' }} />
      <span style={{
        fontSize: '12px',
        fontFamily: 'var(--font-mono)',
        fontWeight: 600,
        color: '#ffffff'
      }}>
        {message}
      </span>
    </div>
  );
}
