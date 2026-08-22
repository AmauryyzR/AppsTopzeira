import { GameMode, SaveData, Stats } from '../types';

const SAVE_KEY = 'snake_aaa_save_data';

const DEFAULT_STATS: Stats = {
  gamesPlayed: 0,
  totalScore: 0,
  foodEaten: 0,
  maxLength: 0
};

const DEFAULT_SAVE: SaveData = {
  coins: 0,
  highScores: {
    [GameMode.CLASSIC]: 0,
    [GameMode.NO_WALLS]: 0,
    [GameMode.TIME_ATTACK]: 0,
    [GameMode.COIN_FEVER]: 0,
    [GameMode.FORBIDDEN]: 0,
    [GameMode.ALL_IN]: 0,
  },
  unlockedSkins: ['default', 'neon_blue'],
  selectedSkin: 'default',
  settings: {
    masterVolume: 1.0,
    musicVolume: 0.7,
    sfxVolume: 1.0,
    particles: true,
    screenShake: true,
    glow: true,
    headTracksFood: true,
    gridSize: 20,
    difficulty: 'medium',
  },
  stats: DEFAULT_STATS,
  unlockedAchievements: []
};

export class SaveManager {
  private static instance: SaveManager;
  public data: SaveData;
  public forcedRoll: number | null = null;

  private constructor() {
    this.data = this.load();
  }

  public static getInstance(): SaveManager {
    if (!SaveManager.instance) {
      SaveManager.instance = new SaveManager();
    }
    return SaveManager.instance;
  }

  private load(): SaveData {
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_SAVE,
          ...parsed,
          highScores: { ...DEFAULT_SAVE.highScores, ...(parsed.highScores || {}) },
          settings: { ...DEFAULT_SAVE.settings, ...(parsed.settings || {}) },
          stats: { ...DEFAULT_SAVE.stats, ...(parsed.stats || {}) },
          unlockedAchievements: parsed.unlockedAchievements || []
        };
      }
    } catch (e) {
      console.error('Failed to load save data', e);
    }
    return { ...DEFAULT_SAVE };
  }

  private saveTimeout: number | null = null;
  private listeners: (() => void)[] = [];

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify(): void {
    this.listeners.forEach(l => l());
  }

  public save(): void {
    this.notify();
    if (this.saveTimeout !== null) {
      clearTimeout(this.saveTimeout);
    }
    this.saveTimeout = window.setTimeout(() => {
      try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(this.data));
      } catch (e) {
        console.error('Failed to save data', e);
      }
    }, 100);
  }

  public addCoins(amount: number): void {
    this.data.coins += amount;
    // Also track achievements for coins
    if (this.data.coins >= 100) this.unlockAchievement('rich_100');
    if (this.data.coins >= 500) this.unlockAchievement('rich_500');
    this.save();
  }

  public spendCoins(amount: number): boolean {
    if (this.data.coins >= amount) {
      this.data.coins -= amount;
      this.save();
      return true;
    }
    return false;
  }

  public unlockSkin(skinId: string): void {
    if (!this.data.unlockedSkins.includes(skinId)) {
      this.data.unlockedSkins.push(skinId);
      if (this.data.unlockedSkins.length >= 5) this.unlockAchievement('collector_5');
      if (this.data.unlockedSkins.length >= 10) this.unlockAchievement('collector_10');
      this.save();
    }
  }

  public updateHighScore(mode: GameMode, score: number): boolean {
    if (score > (this.data.highScores[mode] || 0)) {
      this.data.highScores[mode] = score;
      this.save();
      return true;
    }
    return false;
  }

  public addStat(key: keyof Stats, value: number): void {
    this.data.stats[key] += value;
    this.save();
  }

  public updateMaxStat(key: keyof Stats, value: number): void {
    if (value > this.data.stats[key]) {
      this.data.stats[key] = value;
      this.save();
    }
  }

  public unlockAchievement(id: string): boolean {
    if (!this.data.unlockedAchievements.includes(id)) {
      this.data.unlockedAchievements.push(id);
      this.save();
      // Optionally emit event here to show a toast
      return true;
    }
    return false;
  }
}

export const saveManager = SaveManager.getInstance();
