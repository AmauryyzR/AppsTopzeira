import { saveManager } from '../store/SaveManager';

class AudioManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  
  private musicInterval: number | null = null;
  private eatBuffer: AudioBuffer | null = null;
  private pedrinDeathBuffer: AudioBuffer | null = null;
  private slotWinBuffer: AudioBuffer | null = null;
  private slotLossBuffer: AudioBuffer | null = null;
  private loadingEat: boolean = false;
  private loadingPedrinDeath: boolean = false;
  private pedrinDeathQueued: boolean = false;
  private loadingSlotSounds: boolean = false;

  public init() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      this.masterGain = this.ctx.createGain();
      this.musicGain = this.ctx.createGain();
      this.sfxGain = this.ctx.createGain();

      this.musicGain.connect(this.masterGain);
      this.sfxGain.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      this.updateVolumes();
      this.loadEatSound();
      this.loadPedrinDeathSound();
      this.loadSlotSounds();
    } catch (e) {
      console.warn('Web Audio API not supported', e);
    }
  }

  private async loadEatSound() {
    if (this.eatBuffer || this.loadingEat || !this.ctx) return;
    this.loadingEat = true;
    try {
      const response = await fetch('/dragon-studio-dropping-a-coin-478359.mp3');
      const arrayBuffer = await response.arrayBuffer();
      this.eatBuffer = await this.ctx.decodeAudioData(arrayBuffer);
    } catch (e) {
      console.warn('Failed to load eat sound effect:', e);
    } finally {
      this.loadingEat = false;
    }
  }

  private async loadPedrinDeathSound() {
    if (this.pedrinDeathBuffer || this.loadingPedrinDeath || !this.ctx) return;
    this.loadingPedrinDeath = true;
    try {
      const response = await fetch('/pedrin-death.mp3');
      const arrayBuffer = await response.arrayBuffer();
      this.pedrinDeathBuffer = await this.ctx.decodeAudioData(arrayBuffer);
      if (this.pedrinDeathQueued) {
        this.pedrinDeathQueued = false;
        this.playPedrinDeath();
      }
    } catch (e) {
      console.warn('Failed to load Pedrin death sound effect:', e);
      if (this.pedrinDeathQueued) {
        this.pedrinDeathQueued = false;
        this.playPedrinDeathFallback();
      }
    } finally {
      this.loadingPedrinDeath = false;
    }
  }

  private async loadSlotSounds() {
    if (this.loadingSlotSounds || !this.ctx) return;
    this.loadingSlotSounds = true;
    
    // Load Win sound
    if (!this.slotWinBuffer) {
      try {
        const response = await fetch('/freesound_community-cash-register-purchase-87313.mp3');
        const arrayBuffer = await response.arrayBuffer();
        this.slotWinBuffer = await this.ctx.decodeAudioData(arrayBuffer);
      } catch (e) {
        console.warn('Failed to load slot win sound:', e);
      }
    }

    // Load Loss sound
    if (!this.slotLossBuffer) {
      try {
        const response = await fetch('/mori_sound-fx-loose-cartoon-521523.mp3');
        const arrayBuffer = await response.arrayBuffer();
        this.slotLossBuffer = await this.ctx.decodeAudioData(arrayBuffer);
      } catch (e) {
        console.warn('Failed to load slot loss sound:', e);
      }
    }

    this.loadingSlotSounds = false;
  }

  public updateVolumes() {
    if (!this.ctx || !this.masterGain || !this.musicGain || !this.sfxGain) return;
    const settings = saveManager.data.settings;
    this.masterGain.gain.value = settings.masterVolume;
    this.musicGain.gain.value = settings.musicVolume;
    this.sfxGain.gain.value = settings.sfxVolume;
  }

  private playTone(freq: number, type: OscillatorType, duration: number, vol = 0.5) {
    if (!this.ctx || !this.sfxGain) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    // Envelope
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  public playEat() {
    this.init();
    if (!this.ctx || !this.sfxGain) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    if (this.eatBuffer) {
      const source = this.ctx.createBufferSource();
      source.buffer = this.eatBuffer;
      source.connect(this.sfxGain);
      source.start(0);
    } else {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Fallback popup sound
      osc.type = 'sine';
      const baseFreq = 500 + Math.random() * 200;
      osc.frequency.setValueAtTime(baseFreq, t);
      osc.frequency.exponentialRampToValueAtTime(baseFreq + 200, t + 0.1);
      
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.8, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.2);
    }
    
    if (navigator.vibrate) navigator.vibrate(20);
  }

  public playCombo() {
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.linearRampToValueAtTime(1200, t + 0.1);
    
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.5, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.3);
  }

  public playDeath() {
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.5);
    
    gain.gain.setValueAtTime(0.8, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);
    
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.5);
    
    if (navigator.vibrate) navigator.vibrate([100, 50, 200]);
  }

  public playPedrinDeath() {
    this.init();
    if (!this.ctx || !this.sfxGain) {
      this.playPedrinDeathFallback();
      return;
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();

    if (!this.pedrinDeathBuffer) {
      this.pedrinDeathQueued = true;
      void this.loadPedrinDeathSound();
      return;
    }

    const source = this.ctx.createBufferSource();
    source.buffer = this.pedrinDeathBuffer;
    source.connect(this.sfxGain);
    source.start(0);

    if (navigator.vibrate) navigator.vibrate([120, 40, 220]);
  }

  private playPedrinDeathFallback() {
    const audio = new Audio('/pedrin-death.mp3');
    const settings = saveManager.data.settings;
    audio.volume = Math.max(0, Math.min(1, settings.masterVolume * settings.sfxVolume));
    void audio.play().catch(() => undefined);
  }

  public playClick() {
    this.playTone(600, 'sine', 0.05, 0.3);
  }

  public playBet() {
    this.playTone(750, 'sine', 0.06, 0.25);
  }

  public playAllIn() {
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, t);
    osc.frequency.exponentialRampToValueAtTime(1200, t + 0.5);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.3, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.5);
  }

  public playSpin() {
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;
    for (let i = 0; i < 8; i++) {
      const clickTime = t + i * 0.12;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150 + i * 40, clickTime);

      gain.gain.setValueAtTime(0, clickTime);
      gain.gain.linearRampToValueAtTime(0.3, clickTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.01, clickTime + 0.06);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(clickTime);
      osc.stop(clickTime + 0.07);
    }
  }

  public playSlotWin() {
    this.init();
    if (!this.ctx || !this.sfxGain) return;
    const ctx = this.ctx;
    const sfxGain = this.sfxGain;
    if (ctx.state === 'suspended') ctx.resume();

    if (this.slotWinBuffer) {
      const source = ctx.createBufferSource();
      source.buffer = this.slotWinBuffer;
      source.connect(sfxGain);
      source.start(0);
    } else {
      const t = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, i) => {
        const noteTime = t + i * 0.12;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0, noteTime);
        gain.gain.linearRampToValueAtTime(0.4, noteTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, noteTime + 0.35);

        osc.connect(gain);
        gain.connect(sfxGain);
        osc.start(noteTime);
        osc.stop(noteTime + 0.4);
      });
    }
  }

  public playSlotLoss() {
    this.init();
    if (!this.ctx || !this.sfxGain) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    if (this.slotLossBuffer) {
      const source = this.ctx.createBufferSource();
      source.buffer = this.slotLossBuffer;
      source.connect(this.sfxGain);
      source.start(0);
    } else {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, t);
      osc.frequency.linearRampToValueAtTime(110, t + 0.4);

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.35, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.4);
    }
  }

  public playPurchase() {
    this.playTone(400, 'square', 0.1, 0.2);
    setTimeout(() => this.playTone(600, 'square', 0.1, 0.2), 100);
    setTimeout(() => this.playTone(800, 'square', 0.2, 0.2), 200);
  }

  public playError() {
    this.playTone(200, 'square', 0.1, 0.2);
    setTimeout(() => this.playTone(150, 'square', 0.2, 0.2), 100);
  }

  public startMusic() {
    if (!this.ctx || this.musicInterval) return;
    this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const notes = [220, 261.63, 329.63, 392.00, 440]; // A minor pentatonic
    let step = 0;

    this.musicInterval = window.setInterval(() => {
      if (!this.ctx || !this.musicGain) return;
      
      const freq = notes[step % notes.length];
      step++;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq / 2, this.ctx.currentTime); // Bass octave

      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.1, this.ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(this.musicGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.3);
    }, 250); 
  }

  public stopMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }
}

export const audioManager = new AudioManager();
