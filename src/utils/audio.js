// Procedural Web Audio API sound synthesizer with semantic acoustics
class SoundFX {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.masterVolume = 0.08;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setEnabled(val) {
    this.enabled = val;
  }

  setVolume(vol) {
    this.masterVolume = Math.max(0, Math.min(1, vol));
  }

  playTone(freq = 440, type = 'sine', duration = 0.08, volume = 0.05) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      const computedVol = volume * (this.masterVolume / 0.08);
      gain.gain.setValueAtTime(computedVol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Audio autoplay safety catch
    }
  }

  // --- Semantic Operation Audio Presets ---
  compare(val = 50) {
    const freq = 220 + (Math.abs(val) % 100) * 6;
    this.playTone(freq, 'sine', 0.05, 0.035);
  }

  swap() {
    this.playTone(480, 'triangle', 0.08, 0.05);
    setTimeout(() => this.playTone(640, 'triangle', 0.08, 0.05), 30);
  }

  visit(index = 0) {
    const freq = 300 + (index % 12) * 22;
    this.playTone(freq, 'sine', 0.06, 0.04);
  }

  relax(dist = 1) {
    const freq = 520 + (dist % 10) * 15;
    this.playTone(freq, 'sine', 0.09, 0.05);
  }

  insert() {
    this.playTone(660, 'sine', 0.09, 0.05);
  }

  delete() {
    this.playTone(220, 'sawtooth', 0.08, 0.025);
  }

  rotate() {
    this.playTone(520, 'sine', 0.08, 0.04);
    setTimeout(() => this.playTone(780, 'sine', 0.1, 0.05), 40);
  }

  backtrack() {
    this.playTone(380, 'triangle', 0.07, 0.04);
    setTimeout(() => this.playTone(260, 'triangle', 0.09, 0.04), 35);
  }

  conflict() {
    this.playTone(240, 'sawtooth', 0.12, 0.035);
  }

  complete() {
    if (!this.enabled) return;
    const chords = [440, 554.37, 659.25, 880];
    chords.forEach((f, i) => {
      setTimeout(() => {
        this.playTone(f, 'sine', 0.22, 0.04);
      }, i * 50);
    });
  }

  click() {
    this.playTone(900, 'sine', 0.015, 0.02);
  }
}

export const sound = new SoundFX();
