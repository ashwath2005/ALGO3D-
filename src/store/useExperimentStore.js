import { create } from 'zustand';
import { ALGORITHMS, getAlgorithmById } from '../algorithms/registry.js';
import { DatasetEngine } from '../algorithms/experiment/DatasetEngine.js';
import { BenchmarkEngine } from '../algorithms/experiment/BenchmarkEngine.js';

const STORAGE_KEY = 'algo3d_experiment_history';
const NOTES_STORAGE_KEY = 'algo3d_experiment_notes';

function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveHistory(history) {
  try {
    const bounded = history.slice(0, 20);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bounded));
  } catch (e) {
    // ignore
  }
}

function loadNotes() {
  try {
    const raw = localStorage.getItem(NOTES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveNotes(notesObj) {
  try {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notesObj));
  } catch (e) {
    // ignore
  }
}

export const useExperimentStore = create((set, get) => {
  const initialSeed = 601984;
  const initialConfig = {
    size: 100,
    distribution: 'random',
    min: 5,
    max: 999,
    seed: initialSeed,
    customInput: ''
  };
  const initialDataset = DatasetEngine.generateArrayDataset(initialConfig);

  return {
    experimentId: `EXP-${Math.floor(100000 + Math.random() * 900000)}`,
    category: 'Sorting',
    selectedAlgorithms: ['quick-sort', 'merge-sort', 'heap-sort', 'bubble-sort'],
    datasetConfig: initialConfig,
    dataset: initialDataset,
    repetitions: 5,
    warmupRuns: 3,
    activeMetric: 'time', // 'time' | 'comparisons' | 'swaps' | 'writes' | 'totalOperations'

    // Benchmark state
    isBenchmarking: false,
    benchmarkResults: null,
    complexityData: null,
    isComplexitySweeping: false,
    caseStudyData: null,
    isCaseStudyRunning: false,
    history: loadHistory(),
    notes: loadNotes(),

    setActiveMetric: (metric) => set({ activeMetric: metric }),

    setCategory: (category) => {
      let algos = ['quick-sort', 'merge-sort', 'heap-sort', 'bubble-sort'];
      if (category === 'Searching') {
        algos = ['binary-search', 'linear-search', 'jump-search', 'interpolation-search'];
      } else if (category === 'Graphs') {
        algos = ['dijkstra', 'bfs', 'dfs', 'bellman-ford'];
      } else if (category === 'Trees') {
        algos = ['bst', 'avl-tree'];
      } else if (category === 'Dynamic Programming') {
        algos = ['knapsack-01', 'longest-common-subsequence', 'coin-change-dp'];
      }
      set({
        category,
        selectedAlgorithms: algos,
        benchmarkResults: null,
        experimentId: `EXP-${Math.floor(100000 + Math.random() * 900000)}`
      });
      get().generateDataset();
    },

    toggleAlgorithm: (algoId) => {
      const current = get().selectedAlgorithms;
      let updated;
      if (current.includes(algoId)) {
        if (current.length <= 1) return;
        updated = current.filter((id) => id !== algoId);
      } else {
        if (current.length >= 6) return;
        updated = [...current, algoId];
      }
      set({ selectedAlgorithms: updated });
    },

    setDatasetConfig: (partial) => {
      const updatedConfig = { ...get().datasetConfig, ...partial };
      const newDataset = DatasetEngine.generateArrayDataset(updatedConfig);
      set({ datasetConfig: updatedConfig, dataset: newDataset });
    },

    generateDataset: (newSeed = null) => {
      const activeSeed = newSeed !== null ? newSeed : Math.floor(Math.random() * 900000) + 100000;
      const updatedConfig = { ...get().datasetConfig, seed: activeSeed };
      const newDataset = DatasetEngine.generateArrayDataset(updatedConfig);
      set({ datasetConfig: updatedConfig, dataset: newDataset });
    },

    setRepetitions: (repetitions) => set({ repetitions }),

    saveNoteForExperiment: (expId, text) => {
      const allNotes = { ...get().notes, [expId]: text };
      saveNotes(allNotes);
      set({ notes: allNotes });
    },

    // Execute Benchmark
    runBenchmark: () => {
      set({ isBenchmarking: true });
      setTimeout(() => {
        try {
          const report = BenchmarkEngine.runBenchmark({
            algorithmIds: get().selectedAlgorithms,
            dataset: get().dataset,
            repetitions: get().repetitions,
            warmupRuns: get().warmupRuns
          });

          const expId = get().experimentId;
          const historyEntry = {
            id: expId,
            timestamp: new Date().toLocaleTimeString(),
            algorithms: get().selectedAlgorithms.map((id) => ALGORITHMS[id]?.name || id),
            datasetType: get().dataset.distribution,
            size: get().dataset.size,
            seed: get().dataset.seed,
            winner: report.results[0]?.name || 'N/A',
            fastestTime: report.results[0]?.stats.meanTime || 0
          };
          const newHistory = [historyEntry, ...get().history.filter(h => h.id !== expId)];
          saveHistory(newHistory);

          set({
            benchmarkResults: report,
            isBenchmarking: false,
            history: newHistory
          });
        } catch (err) {
          console.error('Benchmark execution error:', err);
          set({ isBenchmarking: false });
        }
      }, 30);
    },

    // Execute Complexity Sweep across N = 10..500
    runComplexitySweep: (sizes = [10, 25, 50, 100, 200, 500]) => {
      set({ isComplexitySweeping: true });
      setTimeout(() => {
        try {
          const sweep = BenchmarkEngine.runComplexitySweep({
            algorithmIds: get().selectedAlgorithms,
            sizes,
            distribution: get().dataset.distribution,
            seed: get().dataset.seed
          });
          set({ complexityData: sweep, isComplexitySweeping: false });
        } catch (err) {
          console.error('Complexity sweep error:', err);
          set({ isComplexitySweeping: false });
        }
      }, 30);
    },

    // Execute Cross-Dataset Case Study
    runCaseStudy: (algoId = 'quick-sort') => {
      set({ isCaseStudyRunning: true });
      setTimeout(() => {
        try {
          const res = BenchmarkEngine.runCaseStudy({
            algorithmId: algoId,
            size: get().dataset.size,
            seed: get().dataset.seed,
            repetitions: get().repetitions
          });
          set({ caseStudyData: res, isCaseStudyRunning: false });
        } catch (err) {
          console.error('Case study error:', err);
          set({ isCaseStudyRunning: false });
        }
      }, 30);
    },

    // Export CSV
    exportCSV: () => {
      const results = get().benchmarkResults?.results;
      if (!results || results.length === 0) return;

      let csv = 'Rank,Algorithm,Category,Theoretical Complexity,Mean Time (ms),Min Time (ms),Max Time (ms),StdDev (ms),Comparisons,Swaps,Writes,Operations\n';
      results.forEach((r) => {
        csv += `${r.rank},"${r.name}","${r.category}","${r.complexity?.timeAverage || 'N/A'}",${r.stats.meanTime},${r.stats.minTime},${r.stats.maxTime},${r.stats.stdDev},${r.metrics.comparisons},${r.metrics.swaps},${r.metrics.writes},${r.totalOperations}\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `algo3d_${get().experimentId}_${get().dataset.id}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    // Export JSON
    exportJSON: () => {
      const report = get().benchmarkResults;
      if (!report) return;

      const exportPayload = {
        experimentId: get().experimentId,
        dataset: get().dataset,
        configuration: {
          repetitions: get().repetitions,
          warmupRuns: get().warmupRuns,
          activeMetric: get().activeMetric
        },
        report
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
      const link = document.createElement('a');
      link.setAttribute('href', dataStr);
      link.setAttribute('download', `algo3d_${get().experimentId}_${get().dataset.id}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    // Export Markdown Research Report
    exportReport: () => {
      const report = get().benchmarkResults;
      if (!report) return;

      let md = `# ALGO3D Computational Benchmark Report — ${get().experimentId}\n\n`;
      md += `**Date:** ${new Date().toISOString()}\n`;
      md += `**Dataset ID:** \`${get().dataset.id}\` (Seed: \`${get().dataset.seed}\`, Size: \`${get().dataset.size}\`, Distribution: \`${get().dataset.distribution}\`)\n`;
      md += `**Measured Repetitions:** ${get().repetitions} (Warmup: ${get().warmupRuns})\n\n`;
      md += `## 1. Key Performance Summary\n\n`;
      md += `| Rank | Algorithm | Theoretical | Mean Time (ms) | Min / Max (ms) | Comparisons | Swaps/Writes | Total Operations |\n`;
      md += `| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;
      report.results.forEach((r) => {
        md += `| #${r.rank} | **${r.name}** | ${r.complexity?.timeAverage || 'N/A'} | ${r.stats.meanTime} | ${r.stats.minTime} / ${r.stats.maxTime} | ${r.metrics.comparisons} | ${r.metrics.swaps + r.metrics.writes} | ${r.totalOperations} |\n`;
      });
      md += `\n## 2. Factual Insights\n\n`;
      report.insights.forEach((ins) => {
        md += `- ${ins}\n`;
      });
      md += `\n---\n*Generated by ALGO3D Benchmark Lab 2.0*\n`;

      const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `algo3d_report_${get().experimentId}.md`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
});
