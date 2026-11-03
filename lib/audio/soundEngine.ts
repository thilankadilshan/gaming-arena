/**
 * Zero-asset procedural Web Audio API Synthesizer
 * Generates retro 8-bit / cyber-arcade sound effects using Web Audio oscillators and filters.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Lazy AudioContext initialization on first user interaction to comply with browser autoplay policies
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Apple Pickup: FM dual-oscillator bell chime
   * High-pitch retro ding with fast envelope
   */
  public playPickupApple() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Carrier Oscillator
      const carrier = ctx.createOscillator();
      const carrierGain = ctx.createGain();

      // Modulator Oscillator
      const modulator = ctx.createOscillator();
      const modulatorGain = ctx.createGain();

      carrier.type = 'sine';
      carrier.frequency.setValueAtTime(587.33, now); // D5
      carrier.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5

      modulator.type = 'triangle';
      modulator.frequency.setValueAtTime(1174.66, now); // 2x carrier

      // Modulator modulation depth
      modulatorGain.gain.setValueAtTime(300, now);
      modulatorGain.gain.exponentialRampToValueAtTime(1, now + 0.18);

      modulator.connect(carrier.frequency);

      // Carrier envelope
      carrierGain.gain.setValueAtTime(0.25, now);
      carrierGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      carrier.connect(carrierGain);
      carrierGain.connect(ctx.destination);

      carrier.start(now);
      modulator.start(now);
      carrier.stop(now + 0.25);
      modulator.stop(now + 0.25);
    } catch {
      // AudioContext fallback
    }
  }

  /**
   * Golden Star Pickup: 4-note ascending high-frequency arpeggio shimmer
   * C6, E6, G6, C7 with bandpass filtering and slight reverb simulation
   */
  public playPickupStar() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [1046.5, 1318.5, 1567.98, 2093.0]; // C6, E6, G6, C7
      const noteDuration = 0.06;

      notes.forEach((freq, idx) => {
        const startTime = now + idx * noteDuration;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, startTime);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(freq, startTime);
        filter.Q.setValueAtTime(3, startTime);

        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.18);
      });
    } catch {
      // AudioContext fallback
    }
  }

  /**
   * Game Over: Sub-bass frequency drop (160 Hz -> 28 Hz) + noise crunch burst
   */
  public playGameOver() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Sub-bass pitch drop
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(28, now + 0.45);

      oscGain.gain.setValueAtTime(0.35, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.55);

      // Noise burst crunch
      const bufferSize = ctx.sampleRate * 0.25;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.setValueAtTime(800, now);
      noiseFilter.frequency.exponentialRampToValueAtTime(100, now + 0.25);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.2, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      whiteNoise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + 0.26);
    } catch {
      // AudioContext fallback
    }
  }
}

export const soundEngine = new SoundEngine();
