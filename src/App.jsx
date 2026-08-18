import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/navigation/Navbar.jsx';
import { SearchModal, SettingsModal, KeyboardShortcutsModal } from './components/common/Modals.jsx';
import { DebugOverlay } from './components/common/DebugOverlay.jsx';
import { PerformanceHud } from './components/common/PerformanceHud.jsx';
import { LandingPage } from './pages/LandingPage.jsx';
import { VisualizerPage } from './pages/VisualizerPage.jsx';
import { AlgorithmsPage } from './pages/AlgorithmsPage.jsx';
import { ComparisonPage } from './pages/ComparisonPage.jsx';
import { ChallengePage } from './pages/ChallengePage.jsx';
import { LearnPage } from './pages/LearnPage.jsx';
import { AboutPage } from './pages/AboutPage.jsx';
import { useVisualizerStore } from './store/useVisualizerStore.js';

export function App() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const setAlgorithm = useVisualizerStore((s) => s.setAlgorithm);

  // Initialize initial algorithm on startup & global keyboard listeners
  useEffect(() => {
    setAlgorithm('bubble-sort');

    const handleGlobalKeyDown = (e) => {
      // Ctrl+K or Cmd+K to toggle Search / Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      // '?' to open Keyboard Shortcuts (when not typing in an input/textarea)
      if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
        e.preventDefault();
        setShortcutsOpen((prev) => !prev);
      }
      // Escape closes any open modals
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setSettingsOpen(false);
        setShortcutsOpen(false);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [setAlgorithm]);

  return (
    <BrowserRouter>
      <div style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#000000',
        color: '#f5f5f5',
        overflow: 'hidden'
      }}>
        {/* Master Navigation Bar */}
        <Navbar
          onOpenSearch={() => setSearchOpen(true)}
          onOpenSettings={() => setSettingsOpen(true)}
          onOpenShortcuts={() => setShortcutsOpen(true)}
        />

        {/* Dynamic Page Routes */}
        <main style={{ flex: 1, position: 'relative', overflowY: 'auto', overflowX: 'hidden' }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/visualizer" element={<VisualizerPage />} />
            <Route path="/algorithms" element={<AlgorithmsPage />} />
            <Route path="/compare" element={<ComparisonPage />} />
            <Route path="/challenge" element={<ChallengePage />} />
            <Route path="/learn" element={<LearnPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Global Modals & Telemetry */}
        <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
        <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
        <KeyboardShortcutsModal isOpen={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
        <DebugOverlay />
        <PerformanceHud />
      </div>
    </BrowserRouter>
  );
}
export default App;
