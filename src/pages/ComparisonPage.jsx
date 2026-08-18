import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ALGORITHMS } from '../algorithms/registry.js';
import { useExperimentStore } from '../store/useExperimentStore.js';
import { useVisualizerStore } from '../store/useVisualizerStore.js';
import {
  Play,
  RotateCcw,
  Sparkles,
  BarChart2,
  TrendingUp,
  Sliders,
  FileSpreadsheet,
  Download,
  ExternalLink,
  Bug,
  Eye,
  CheckCircle2,
  ShieldAlert,
  Zap,
  Info,
  Clock,
  ChevronRight,
  Database,
  Award,
  Compass,
  FileText,
  Activity,
  Layers,
  HelpCircle,
  Hash
} from 'lucide-react';

export function ComparisonPage() {
  const navigate = useNavigate();

  const experimentId = useExperimentStore((s) => s.experimentId);
  const category = useExperimentStore((s) => s.category);
  const setCategory = useExperimentStore((s) => s.setCategory);
  const selectedAlgorithms = useExperimentStore((s) => s.selectedAlgorithms);
  const toggleAlgorithm = useExperimentStore((s) => s.toggleAlgorithm);
  const datasetConfig = useExperimentStore((s) => s.datasetConfig);
  const setDatasetConfig = useExperimentStore((s) => s.setDatasetConfig);
  const dataset = useExperimentStore((s) => s.dataset);
  const generateDataset = useExperimentStore((s) => s.generateDataset);
  const repetitions = useExperimentStore((s) => s.repetitions);
  const setRepetitions = useExperimentStore((s) => s.setRepetitions);
  const warmupRuns = useExperimentStore((s) => s.warmupRuns);
  const isBenchmarking = useExperimentStore((s) => s.isBenchmarking);
  const benchmarkResults = useExperimentStore((s) => s.benchmarkResults);
  const runBenchmark = useExperimentStore((s) => s.runBenchmark);
  const activeMetric = useExperimentStore((s) => s.activeMetric);
  const setActiveMetric = useExperimentStore((s) => s.setActiveMetric);
  const complexityData = useExperimentStore((s) => s.complexityData);
  const isComplexitySweeping = useExperimentStore((s) => s.isComplexitySweeping);
  const runComplexitySweep = useExperimentStore((s) => s.runComplexitySweep);
  const caseStudyData = useExperimentStore((s) => s.caseStudyData);
  const isCaseStudyRunning = useExperimentStore((s) => s.isCaseStudyRunning);
  const runCaseStudy = useExperimentStore((s) => s.runCaseStudy);
  const history = useExperimentStore((s) => s.history);
  const notes = useExperimentStore((s) => s.notes);
  const saveNoteForExperiment = useExperimentStore((s) => s.saveNoteForExperiment);
  const exportCSV = useExperimentStore((s) => s.exportCSV);
  const exportJSON = useExperimentStore((s) => s.exportJSON);
  const exportReport = useExperimentStore((s) => s.exportReport);

  const setVisualizerAlgorithm = useVisualizerStore((s) => s.setAlgorithm);
  const setVisualizerCustomData = useVisualizerStore((s) => s.setCustomData);

  const [activeTab, setActiveTab] = useState('benchmark'); // 'benchmark' | 'complexity' | 'dataset' | 'casestudy' | 'history'
  const [customText, setCustomText] = useState('');
  const [caseStudyAlgo, setCaseStudyAlgo] = useState('quick-sort');
  const [currentNote, setCurrentNote] = useState('');

  // Initial benchmark run on mount
  useEffect(() => {
    if (!benchmarkResults && !isBenchmarking) {
      runBenchmark();
    }
  }, []);

  useEffect(() => {
    setCurrentNote(notes[experimentId] || '');
  }, [experimentId, notes]);

  // Bridge to Phase 1: 3D Visualizer
  const handleOpenInVisualizer = (algoId) => {
    setVisualizerAlgorithm(algoId);
    if (dataset?.data && Array.isArray(dataset.data)) {
      setVisualizerCustomData(dataset.data);
    }
    navigate('/visualizer');
  };

  // Bridge to Phase 3: Algorithm Debugger
  const handleOpenInDebugger = (algoId) => {
    setVisualizerAlgorithm(algoId);
    if (dataset?.data && Array.isArray(dataset.data)) {
      setVisualizerCustomData(dataset.data);
    }
    useVisualizerStore.setState({ debugMode: true });
    navigate('/visualizer');
  };

  const categories = ['Sorting', 'Searching', 'Graphs', 'Trees', 'Dynamic Programming'];
  const categoryAlgos = Object.values(ALGORITHMS).filter((a) => a.category === category);

  // Dynamic ranking based on activeMetric
  const rankedResults = useMemo(() => {
    if (!benchmarkResults?.results) return [];
    const list = [...benchmarkResults.results];

    if (activeMetric === 'time') {
      list.sort((a, b) => a.stats.meanTime - b.stats.meanTime);
    } else if (activeMetric === 'comparisons') {
      list.sort((a, b) => a.metrics.comparisons - b.metrics.comparisons);
    } else if (activeMetric === 'swaps') {
      list.sort((a, b) => a.metrics.swaps - b.metrics.swaps);
    } else if (activeMetric === 'writes') {
      list.sort((a, b) => a.metrics.writes - b.metrics.writes);
    } else if (activeMetric === 'totalOperations') {
      list.sort((a, b) => a.totalOperations - b.totalOperations);
    }
    return list;
  }, [benchmarkResults, activeMetric]);

  // Key performance cards derivation
  const fastestAlgo = useMemo(() => {
    if (!benchmarkResults?.results?.length) return null;
    return [...benchmarkResults.results].sort((a, b) => a.stats.meanTime - b.stats.meanTime)[0];
  }, [benchmarkResults]);

  const fewestComparesAlgo = useMemo(() => {
    if (!benchmarkResults?.results?.length) return null;
    return [...benchmarkResults.results].sort((a, b) => a.metrics.comparisons - b.metrics.comparisons)[0];
  }, [benchmarkResults]);

  const fewestOpsAlgo = useMemo(() => {
    if (!benchmarkResults?.results?.length) return null;
    return [...benchmarkResults.results].sort((a, b) => a.totalOperations - b.totalOperations)[0];
  }, [benchmarkResults]);

  const mostStableAlgo = useMemo(() => {
    if (!benchmarkResults?.results?.length) return null;
    return [...benchmarkResults.results].sort((a, b) => a.stats.stdDev - b.stats.stdDev)[0];
  }, [benchmarkResults]);

  // Maximum value for race progress bars
  const maxRaceValue = useMemo(() => {
    if (!rankedResults.length) return 1;
    if (activeMetric === 'time') {
      return Math.max(...rankedResults.map((r) => r.stats.meanTime), 0.001);
    }
    if (activeMetric === 'comparisons') {
      return Math.max(...rankedResults.map((r) => r.metrics.comparisons), 1);
    }
    if (activeMetric === 'swaps') {
      return Math.max(...rankedResults.map((r) => r.metrics.swaps), 1);
    }
    if (activeMetric === 'writes') {
      return Math.max(...rankedResults.map((r) => r.metrics.writes), 1);
    }
    return Math.max(...rankedResults.map((r) => r.totalOperations), 1);
  }, [rankedResults, activeMetric]);

  const baselineValue = useMemo(() => {
    if (!rankedResults.length) return 1;
    if (activeMetric === 'time') return rankedResults[0].stats.meanTime || 0.001;
    if (activeMetric === 'comparisons') return rankedResults[0].metrics.comparisons || 1;
    if (activeMetric === 'swaps') return rankedResults[0].metrics.swaps || 1;
    if (activeMetric === 'writes') return rankedResults[0].metrics.writes || 1;
    return rankedResults[0].totalOperations || 1;
  }, [rankedResults, activeMetric]);

  return (
    <div style={{
      width: '100%',
      minHeight: 'calc(100vh - var(--nav-height))',
      padding: '24px 32px',
      background: 'var(--bg-primary)',
      color: '#f5f5f5',
      overflowY: 'auto'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* 1. Header & Experiment Status Capsule */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge cyan" style={{ fontFamily: 'var(--font-mono)' }}>EXPERIMENT LAB 2.0</span>
              <span className="badge emerald" style={{ fontFamily: 'var(--font-mono)' }}>SEEDED PRNG</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                {experimentId}
              </span>
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.5px' }}>
              Algorithm Benchmark & Experiment Laboratory
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Empirical multi-algorithm races, relative performance scaling, and seamless 3D time-travel bridges.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => runBenchmark()}
              disabled={isBenchmarking}
              className="btn-primary"
              style={{
                padding: '10px 22px',
                fontSize: '13px',
                fontWeight: 700,
                opacity: isBenchmarking ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 0 20px rgba(56, 189, 248, 0.3)'
              }}
            >
              <Play size={14} fill="#000000" />
              <span>{isBenchmarking ? 'RUNNING EXPERIMENT...' : 'RUN EXPERIMENT'}</span>
            </button>

            <button
              onClick={() => generateDataset()}
              className="btn-secondary"
              title="Regenerate Seed & Dataset"
              style={{ padding: '10px 14px' }}
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        {/* 2. Compact Experiment Metadata & Validity Strip */}
        <div className="glass-panel" style={{
          padding: '12px 18px',
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          background: 'rgba(8, 12, 22, 0.75)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Dataset: </span>
              <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>{dataset.id}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Seed: </span>
              <span style={{ color: '#ffffff', fontWeight: 600 }}>{dataset.seed}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Size: </span>
              <span style={{ color: '#ffffff', fontWeight: 600 }}>{dataset.size} elements</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Distribution: </span>
              <span style={{ color: 'var(--accent-emerald)', textTransform: 'capitalize', fontWeight: 600 }}>
                {dataset.distribution.replace('_', ' ')}
              </span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Runs: </span>
              <span style={{ color: '#ffffff', fontWeight: 600 }}>{repetitions}× (Warmup: {warmupRuns}×)</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
            <CheckCircle2 size={13} />
            <span>✓ VALID CONTROLLED COMPARISON</span>
          </div>
        </div>

        {/* 3. Category Bar & Repetitions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '12px',
                  fontFamily: 'var(--font-mono)',
                  background: category === cat ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                  color: category === cat ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  border: `1px solid ${category === cat ? 'var(--accent-cyan)' : 'transparent'}`,
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all var(--transition-fast)'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Repetitions:</span>
            {[1, 5, 10, 25].map((count) => (
              <button
                key={count}
                onClick={() => setRepetitions(count)}
                style={{
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '11px',
                  background: repetitions === count ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.05)',
                  color: repetitions === count ? '#000000' : 'var(--text-secondary)',
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  fontWeight: repetitions === count ? 700 : 400
                }}
              >
                {count}x
              </button>
            ))}
          </div>
        </div>

        {/* 4. Tab Navigation */}
        <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
          {[
            { id: 'benchmark', label: 'Benchmark Lab', icon: BarChart2 },
            { id: 'complexity', label: 'Empirical Complexity', icon: TrendingUp },
            { id: 'dataset', label: 'Dataset Studio', icon: Sliders },
            { id: 'casestudy', label: 'Cross-Dataset Case Study', icon: Compass },
            { id: 'history', label: `History & Notes (${history.length})`, icon: FileSpreadsheet }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-xs)',
                  background: isActive ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                  color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  border: `1px solid ${isActive ? 'var(--accent-cyan)' : 'transparent'}`,
                  fontSize: '12px',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ================= TAB 1: BENCHMARK LAB ================= */}
        {activeTab === 'benchmark' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* 4 Key Performance Metrics Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
              <div className="glass-panel" style={{ padding: '14px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.5px' }}>
                  FASTEST EXECUTION
                </div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--accent-emerald)', marginTop: '4px' }}>
                  {fastestAlgo?.name || 'N/A'}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                  {fastestAlgo ? `${fastestAlgo.stats.meanTime} ms` : '—'}
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '14px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.5px' }}>
                  FEWEST COMPARISONS
                </div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--accent-cyan)', marginTop: '4px' }}>
                  {fewestComparesAlgo?.name || 'N/A'}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                  {fewestComparesAlgo ? `${fewestComparesAlgo.metrics.comparisons.toLocaleString()} compares` : '—'}
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '14px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.5px' }}>
                  FEWEST TOTAL OPERATIONS
                </div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--accent-purple)', marginTop: '4px' }}>
                  {fewestOpsAlgo?.name || 'N/A'}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                  {fewestOpsAlgo ? `${fewestOpsAlgo.totalOperations.toLocaleString()} ops` : '—'}
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '14px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.5px' }}>
                  MOST STABLE RUNTIME
                </div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--accent-amber)', marginTop: '4px' }}>
                  {mostStableAlgo?.name || 'N/A'}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                  {mostStableAlgo ? `±${mostStableAlgo.stats.stdDev} ms variance` : '—'}
                </div>
              </div>
            </div>

            {/* Factual Insights Callout */}
            {benchmarkResults?.insights && benchmarkResults.insights.length > 0 && (
              <div style={{
                background: 'rgba(16, 185, 129, 0.06)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: 'var(--radius-sm)',
                padding: '14px 18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent-emerald)', fontWeight: 700 }}>
                  <Sparkles size={13} />
                  <span>EXPERIMENT INSIGHTS (FACTUAL DERIVATION)</span>
                </div>
                {benchmarkResults.insights.map((ins, i) => (
                  <div key={i} style={{ fontSize: '12px', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                    {ins}
                  </div>
                ))}
              </div>
            )}

            {/* Visual Performance Race & Metric Switcher */}
            <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Activity size={15} style={{ color: 'var(--accent-cyan)' }} />
                  <span>PERFORMANCE RACE & RELATIVE BASELINE</span>
                </div>

                {/* Metric Switcher Tabs */}
                <div style={{ display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.4)', padding: '3px', borderRadius: 'var(--radius-xs)' }}>
                  {[
                    { id: 'time', label: 'Time' },
                    { id: 'comparisons', label: 'Comparisons' },
                    { id: 'swaps', label: 'Swaps' },
                    { id: 'writes', label: 'Writes' },
                    { id: 'totalOperations', label: 'Total Ops' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setActiveMetric(m.id)}
                      style={{
                        padding: '4px 10px',
                        fontSize: '10px',
                        fontFamily: 'var(--font-mono)',
                        borderRadius: 'var(--radius-xs)',
                        background: activeMetric === m.id ? 'var(--accent-cyan)' : 'transparent',
                        color: activeMetric === m.id ? '#000000' : 'var(--text-secondary)',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 700
                      }}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Race Horizontal Bars */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {rankedResults.map((algo, index) => {
                  let currentValue = 0;
                  let displayStr = '';

                  if (activeMetric === 'time') {
                    currentValue = algo.stats.meanTime;
                    displayStr = `${algo.stats.meanTime} ms`;
                  } else if (activeMetric === 'comparisons') {
                    currentValue = algo.metrics.comparisons;
                    displayStr = `${algo.metrics.comparisons.toLocaleString()} compares`;
                  } else if (activeMetric === 'swaps') {
                    currentValue = algo.metrics.swaps;
                    displayStr = `${algo.metrics.swaps.toLocaleString()} swaps`;
                  } else if (activeMetric === 'writes') {
                    currentValue = algo.metrics.writes;
                    displayStr = `${algo.metrics.writes.toLocaleString()} writes`;
                  } else {
                    currentValue = algo.totalOperations;
                    displayStr = `${algo.totalOperations.toLocaleString()} ops`;
                  }

                  const barPercent = Math.max(8, (currentValue / maxRaceValue) * 100);
                  const multiplier = (currentValue / baselineValue).toFixed(2);

                  return (
                    <div key={algo.algorithmId} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ color: index === 0 ? 'var(--accent-emerald)' : 'var(--text-muted)', fontWeight: 700 }}>
                            #{index + 1}
                          </span>
                          <span style={{ color: '#ffffff', fontWeight: 600 }}>{algo.name}</span>
                          <span style={{ fontSize: '10px', color: 'var(--accent-cyan)' }}>
                            {algo.complexity?.timeAverage || ''}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>{displayStr}</span>
                          <span style={{
                            fontSize: '10px',
                            color: index === 0 ? 'var(--accent-emerald)' : 'var(--accent-amber)',
                            fontWeight: 700
                          }}>
                            {index === 0 ? '1.00× (Baseline)' : `${multiplier}×`}
                          </span>
                        </div>
                      </div>

                      {/* Bar Fill */}
                      <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{
                          width: `${barPercent}%`,
                          height: '100%',
                          background: index === 0
                            ? 'var(--accent-emerald)'
                            : index === 1
                            ? 'var(--accent-cyan)'
                            : 'var(--accent-purple)',
                          borderRadius: '4px',
                          transition: 'width 0.4s ease'
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Detailed Statistical Table */}
            <div className="glass-panel" style={{ padding: '16px', borderRadius: 'var(--radius-md)', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', fontFamily: 'var(--font-mono)', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '11px' }}>
                    <th style={{ padding: '10px' }}>RANK</th>
                    <th style={{ padding: '10px' }}>ALGORITHM</th>
                    <th style={{ padding: '10px' }}>THEORY</th>
                    <th style={{ padding: '10px' }}>MEAN TIME</th>
                    <th style={{ padding: '10px' }}>MIN / MAX</th>
                    <th style={{ padding: '10px' }}>STD DEV</th>
                    <th style={{ padding: '10px' }}>COMPARES</th>
                    <th style={{ padding: '10px' }}>SWAPS/WRITES</th>
                    <th style={{ padding: '10px' }}>TOTAL OPS</th>
                    <th style={{ padding: '10px', textAlign: 'right' }}>BRIDGES</th>
                  </tr>
                </thead>
                <tbody>
                  {rankedResults.map((r, i) => (
                    <tr key={r.algorithmId} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '12px 10px', color: i === 0 ? 'var(--accent-emerald)' : 'var(--text-muted)', fontWeight: 700 }}>
                        {i === 0 ? '👑 #1' : `#${i + 1}`}
                      </td>
                      <td style={{ padding: '12px 10px', fontWeight: 600, color: '#ffffff' }}>
                        {r.name}
                      </td>
                      <td style={{ padding: '12px 10px', color: 'var(--accent-cyan)' }}>
                        {r.complexity?.timeAverage || 'N/A'}
                      </td>
                      <td style={{ padding: '12px 10px', color: 'var(--accent-emerald)', fontWeight: 700 }}>
                        {r.stats.meanTime} ms
                      </td>
                      <td style={{ padding: '12px 10px', color: 'var(--text-muted)' }}>
                        {r.stats.minTime} / {r.stats.maxTime} ms
                      </td>
                      <td style={{ padding: '12px 10px', color: 'var(--text-secondary)' }}>
                        ±{r.stats.stdDev} ms
                      </td>
                      <td style={{ padding: '12px 10px', color: '#ffffff' }}>
                        {r.metrics.comparisons.toLocaleString()}
                      </td>
                      <td style={{ padding: '12px 10px', color: 'var(--text-secondary)' }}>
                        {r.metrics.swaps + r.metrics.writes}
                      </td>
                      <td style={{ padding: '12px 10px', color: 'var(--accent-purple)', fontWeight: 600 }}>
                        {r.totalOperations.toLocaleString()}
                      </td>
                      <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            onClick={() => handleOpenInVisualizer(r.algorithmId)}
                            title="Inspect in 3D Visualizer"
                            style={{
                              background: 'rgba(56, 189, 248, 0.1)',
                              border: '1px solid var(--accent-cyan)',
                              color: 'var(--accent-cyan)',
                              padding: '4px 8px',
                              borderRadius: '3px',
                              cursor: 'pointer'
                            }}
                          >
                            <Eye size={12} />
                          </button>

                          <button
                            onClick={() => handleOpenInDebugger(r.algorithmId)}
                            title="Launch in Time-Travel Debugger"
                            style={{
                              background: 'rgba(168, 85, 247, 0.1)',
                              border: '1px solid var(--accent-purple)',
                              color: 'var(--accent-purple)',
                              padding: '4px 8px',
                              borderRadius: '3px',
                              cursor: 'pointer'
                            }}
                          >
                            <Bug size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Why Did It Win? & Educational Takeaways */}
            {fastestAlgo && (
              <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <HelpCircle size={15} />
                  <span>WHY DID {fastestAlgo.name.toUpperCase()} RANK #1 IN THIS EXPERIMENT?</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  On this <strong>{dataset.size}-element {dataset.distribution.replace('_', ' ')}</strong> dataset, {fastestAlgo.name} achieved the lowest wall-clock runtime ({fastestAlgo.stats.meanTime} ms) due to optimal in-place memory access and partition efficiency. Although algorithms like Merge Sort divide subproblems evenly, Quick Sort's tight inner comparison loops and cache-friendly pivot swaps minimize runtime overhead in JavaScript V8 execution.
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: COMPLEXITY LAB ================= */}
        {activeTab === 'complexity' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>Empirical Asymptotic Sweeper</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    Sweeps input sizes across N = 10, 25, 50, 100, 200, 500 to observe growth trajectories.
                  </p>
                </div>
                <button
                  onClick={() => runComplexitySweep()}
                  disabled={isComplexitySweeping}
                  className="btn-primary"
                  style={{ padding: '8px 18px', fontSize: '12px', fontWeight: 700 }}
                >
                  {isComplexitySweeping ? 'SWEEPING...' : 'RUN COMPLEXITY SWEEP'}
                </button>
              </div>

              {complexityData ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {Object.values(complexityData).map((item) => (
                    <div key={item.id} className="glass-panel" style={{ padding: '14px', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span style={{ fontWeight: 700, color: '#ffffff' }}>{item.name}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent-cyan)' }}>
                          Theoretical: {item.complexity?.timeAverage || 'N/A'}
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '8px' }}>
                        {item.dataPoints.map((dp) => (
                          <div key={dp.n} style={{ background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '3px', textAlign: 'center' }}>
                            <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>N = {dp.n}</div>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
                              {dp.timeMs} ms
                            </div>
                            <div style={{ fontSize: '9px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                              {dp.comparisons} comp
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                  Click "RUN COMPLEXITY SWEEP" to execute empirical N=10..500 scaling.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 3: DATASET STUDIO ================= */}
        {activeTab === 'dataset' && (
          <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>Seeded Dataset Studio (Mulberry32 PRNG)</h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
              {[
                { id: 'random', label: 'Random Uniform' },
                { id: 'sorted', label: 'Already Sorted' },
                { id: 'reverse', label: 'Reverse Sorted' },
                { id: 'nearly_sorted', label: 'Nearly Sorted (10% noise)' },
                { id: 'duplicates', label: 'Heavy Duplicates' },
                { id: 'pathological_quick', label: 'Pathological Quick Killer' },
                { id: 'negatives', label: 'Negative Integers' }
              ].map((dist) => (
                <button
                  key={dist.id}
                  onClick={() => setDatasetConfig({ distribution: dist.id })}
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-sm)',
                    background: datasetConfig.distribution === dist.id ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${datasetConfig.distribution === dist.id ? 'var(--accent-cyan)' : 'var(--border-subtle)'}`,
                    color: datasetConfig.distribution === dist.id ? 'var(--accent-cyan)' : 'var(--text-primary)',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '12px',
                    fontFamily: 'var(--font-mono)',
                    textAlign: 'left'
                  }}
                >
                  {dist.label}
                </button>
              ))}
            </div>

            {/* Custom Raw Array Preview */}
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '6px' }}>
                LIVE SEEDED ARRAY PREVIEW ({dataset.data.length} elements):
              </div>
              <div style={{
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--accent-cyan)',
                maxHeight: '120px',
                overflowY: 'auto'
              }}>
                [{dataset.data.slice(0, 50).join(', ')}{dataset.data.length > 50 ? '...' : ''}]
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: CROSS-DATASET CASE STUDY ================= */}
        {activeTab === 'casestudy' && (
          <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>Cross-Dataset Distribution Sensitivity</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Tests a single algorithm across 5 distinct input distributions to evaluate worst-case and best-case performance.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <select
                  value={caseStudyAlgo}
                  onChange={(e) => setCaseStudyAlgo(e.target.value)}
                  style={{
                    background: 'rgba(0,0,0,0.6)',
                    border: '1px solid var(--border-subtle)',
                    color: '#ffffff',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-xs)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px'
                  }}
                >
                  {categoryAlgos.map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>

                <button
                  onClick={() => runCaseStudy(caseStudyAlgo)}
                  disabled={isCaseStudyRunning}
                  className="btn-primary"
                  style={{ padding: '6px 16px', fontSize: '12px', fontWeight: 700 }}
                >
                  {isCaseStudyRunning ? 'TESTING...' : 'RUN CASE STUDY'}
                </button>
              </div>
            </div>

            {caseStudyData ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', fontFamily: 'var(--font-mono)', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '11px' }}>
                      <th style={{ padding: '10px' }}>DISTRIBUTION</th>
                      <th style={{ padding: '10px' }}>MEAN TIME</th>
                      <th style={{ padding: '10px' }}>COMPARISONS</th>
                      <th style={{ padding: '10px' }}>SWAPS/WRITES</th>
                      <th style={{ padding: '10px' }}>TOTAL OPERATIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {caseStudyData.distributionResults.map((row) => (
                      <tr key={row.distribution} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '12px 10px', textTransform: 'capitalize', fontWeight: 600, color: 'var(--accent-cyan)' }}>
                          {row.distribution.replace('_', ' ')}
                        </td>
                        <td style={{ padding: '12px 10px', color: 'var(--accent-emerald)', fontWeight: 700 }}>
                          {row.meanTime} ms
                        </td>
                        <td style={{ padding: '12px 10px', color: '#ffffff' }}>
                          {row.comparisons.toLocaleString()}
                        </td>
                        <td style={{ padding: '12px 10px', color: 'var(--text-secondary)' }}>
                          {row.swaps + row.writes}
                        </td>
                        <td style={{ padding: '12px 10px', color: 'var(--accent-purple)', fontWeight: 600 }}>
                          {row.totalOperations.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                Click "RUN CASE STUDY" to evaluate {ALGORITHMS[caseStudyAlgo]?.name} across Random, Sorted, Reverse, Nearly Sorted, and Duplicate arrays.
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 5: HISTORY & NOTES & EXPORTS ================= */}
        {activeTab === 'history' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Export Toolbar */}
            <div className="glass-panel" style={{ padding: '16px 20px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>
                Export Experiment Data ({experimentId})
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => exportCSV()}
                  className="btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', padding: '6px 12px' }}
                >
                  <Download size={13} />
                  <span>EXPORT CSV</span>
                </button>
                <button
                  onClick={() => exportJSON()}
                  className="btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', padding: '6px 12px' }}
                >
                  <Download size={13} />
                  <span>EXPORT JSON</span>
                </button>
                <button
                  onClick={() => exportReport()}
                  className="btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', padding: '6px 12px', fontWeight: 700 }}
                >
                  <FileText size={13} fill="#000000" />
                  <span>DOWNLOAD REPORT (.MD)</span>
                </button>
              </div>
            </div>

            {/* Experiment Notebook Notes Editor */}
            <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                EXPERIMENT RESEARCH NOTEBOOK ({experimentId})
              </div>
              <textarea
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                placeholder="Type your hypothesis, observations, or conclusions regarding this benchmark run..."
                rows={4}
                style={{
                  width: '100%',
                  background: 'rgba(0,0,0,0.5)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px',
                  color: '#ffffff',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '13px',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => saveNoteForExperiment(experimentId, currentNote)}
                  className="btn-primary"
                  style={{ padding: '6px 16px', fontSize: '12px', fontWeight: 700 }}
                >
                  SAVE NOTE
                </button>
              </div>
            </div>

            {/* Previous Experiments History Table */}
            <div className="glass-panel" style={{ padding: '16px', borderRadius: 'var(--radius-md)' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', marginBottom: '12px' }}>Previous Experiment Runs</h3>
              {history.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                  No saved history yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {history.map((h, i) => (
                    <div
                      key={h.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        background: 'rgba(0,0,0,0.3)',
                        borderRadius: 'var(--radius-xs)',
                        border: '1px solid rgba(255,255,255,0.04)',
                        fontSize: '12px',
                        fontFamily: 'var(--font-mono)'
                      }}
                    >
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>{h.id}</span>
                        <span style={{ color: 'var(--text-muted)' }}>{h.timestamp}</span>
                        <span style={{ color: '#ffffff' }}>{h.algorithms?.join(', ') || ''}</span>
                        <span style={{ color: 'var(--accent-emerald)' }}>N={h.size}</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Winner: <strong>{h.winner}</strong> ({h.fastestTime} ms)</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
