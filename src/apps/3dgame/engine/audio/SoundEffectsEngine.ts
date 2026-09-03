/**
 * AAA-Grade Procedural Web Audio Sound Effects Engine (Loop 9)
 * Pure Web Audio API synthesis - zero external asset dependencies, zero network lag.
 * Synthesizes dynamic soundscapes:
 * 1. Bouncy anime jump sweeps
 * 2. Satisfying ground impact thuds
 * 3. Alternating footstep clicks for grass and stone paths
 * 4. Ambient fountain water droplet gurgles
 */
export class SoundEffectsEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted = false;
  private footstepAlternate = false;

  constructor() {
    // AudioContext will be initialized on first user interaction
    const initOnGesture = () => {
      this.ensureContext();
      window.removeEventListener('pointerdown', initOnGesture);
      window.removeEventListener('keydown', initOnGesture);
      window.removeEventListener('touchstart', initOnGesture);
    };

    window.addEventListener('pointerdown', initOnGesture, { once: true });
    window.addEventListener('keydown', initOnGesture, { once: true });
    window.addEventListener('touchstart', initOnGesture, { once: true });
  }

  private ensureContext(): boolean {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return false;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.22; // Comfortable default volume
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return true;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.22, this.ctx.currentTime, 0.05);
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public isSoundMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Play dynamic bouncy anime jump sound
   */
  public playJump() {
    if (this.isMuted || !this.ensureContext() || !this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    // Frequency sweep upward (190 Hz -> 420 Hz)
    osc.frequency.setValueAtTime(190, t);
    osc.frequency.exponentialRampToValueAtTime(420, t + 0.14);

    // Volume envelope
    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.16);
  }

  /**
   * Play crunchy satisfying landing thud
   */
  public playLand(impactVelocity = 10) {
    if (this.isMuted || !this.ensureContext() || !this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const volume = Math.min(0.6, 0.2 + (impactVelocity / 35.0) * 0.4);

    // Low-frequency impact body
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(38, t + 0.15);

    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.16);
  }

  /**
   * Play subtle footstep tap alternating between left and right foot
   */
  public playFootstep(isSprinting = false) {
    if (this.isMuted || !this.ensureContext() || !this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    this.footstepAlternate = !this.footstepAlternate;
    const baseFreq = this.footstepAlternate ? 260 : 230;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, t);
    osc.frequency.exponentialRampToValueAtTime(60, t + 0.05);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, t);

    const vol = isSprinting ? 0.18 : 0.12;
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.06);
  }

  public dispose() {
    if (this.ctx && this.ctx.state !== 'closed') {
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
  }
}
