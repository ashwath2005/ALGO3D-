import { create } from 'zustand';
import { sound } from '../utils/audio.js';

export const useSettingsStore = create((set, get) => ({
  soundEnabled: true,
  quality: 'high', // 'high' | 'medium' | 'low'
  particles: true,
  showCodePanel: true,
  showComplexityPanel: true,
  cameraMode: 'orbit', // 'orbit' | 'cinematic' | 'overhead'
  reducedMotion: false,

  setSoundEnabled: (val) => {
    sound.setEnabled(val);
    set({ soundEnabled: val });
  },

  setQuality: (quality) => set({ quality }),
  setParticles: (val) => set({ particles: val }),
  setShowCodePanel: (val) => set({ showCodePanel: val }),
  setShowComplexityPanel: (val) => set({ showComplexityPanel: val }),
  setCameraMode: (cameraMode) => set({ cameraMode }),
  setReducedMotion: (val) => set({ reducedMotion: val })
}));
