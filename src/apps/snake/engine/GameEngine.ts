import { Position, GameMode } from '../types';
import { SKINS } from '../data/skins';
import { saveManager } from '../store/SaveManager';
import { ParticleSystem } from './ParticleSystem';
import { audioManager } from '../audio/AudioManager';

export interface GameStateData {
  snake: Position[];
  direction: Position;
  foods: Position[];
  score: number;
  gameOver: boolean;
  timeLeft: number;
  survivalTime: number;
  multiplier: number;
  streak: number;
}

export class GameEngine {
  public gridWidth: number;
  public gridHeight: number;
  public mode: GameMode;

  public state: GameStateData;
  public particleSystem: ParticleSystem;

  private lastEatTime: number = 0;

  // Interpolation properties for smooth rendering
  public interpolationProgress: number = 0;
  public previousSnake: Position[] = [];
  public justAte: boolean = false;

  constructor(gridWidth: number, gridHeight: number, mode: GameMode) {
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;
    this.mode = mode;
    this.particleSystem = new ParticleSystem();

    this.state = this.getInitialState();
    this.previousSnake = [...this.state.snake];
  }

  private getInitialState(): GameStateData {
    const startX = Math.floor(this.gridWidth / 2);
    const startY = Math.floor(this.gridHeight / 2);
    const snake = [
      { x: startX, y: startY },
      { x: startX - 1, y: startY },
      { x: startX - 2, y: startY }
    ];

    const foodsCount = this.mode === GameMode.COIN_FEVER ? 8 : 1;
    const initialFoods: Position[] = [];
    for (let i = 0; i < foodsCount; i++) {
      initialFoods.push(this.generateFood(snake, initialFoods));
    }

    return {
      snake,
      direction: { x: 1, y: 0 },
      foods: initialFoods,
      score: 0,
      gameOver: false,
      timeLeft: this.mode === GameMode.TIME_ATTACK ? 60 : 0,
      survivalTime: 0,
      multiplier: 1,
      streak: 0
    };
  }

  public reset(mode: GameMode) {
    this.mode = mode;
    this.state = this.getInitialState();
    this.previousSnake = [...this.state.snake];
    this.particleSystem.particles = [];
    this.interpolationProgress = 0;
  }

  private generateFood(snake: Position[], existingFoods: Position[] = []): Position {
    let newFood: Position;
    let isOccupied = true;
    while (isOccupied) {
      newFood = {
        x: Math.floor(Math.random() * this.gridWidth),
        y: Math.floor(Math.random() * this.gridHeight)
      };
      isOccupied =
        snake.some(segment => segment.x === newFood.x && segment.y === newFood.y) ||
        existingFoods.some(food => food.x === newFood.x && food.y === newFood.y);
    }
    return newFood!;
  }

  public getCoinValue(): number {
    if (this.mode !== GameMode.COIN_FEVER) return 1;
    const time = this.state.survivalTime;
    if (time >= 100) return 10;
    if (time >= 50) return 5;
    if (time >= 20) return 2;
    return 1;
  }

  public update(direction: Position) {
    if (this.state.gameOver) return;

    // Track previous positions for smooth rendering
    this.previousSnake = [...this.state.snake];
    this.justAte = false;

    // Time attack logic
    if (this.mode === GameMode.TIME_ATTACK && this.state.timeLeft <= 0) {
      this.triggerGameOver();
      return;
    }

    this.state.direction = direction;
    const head = this.state.snake[0];

    const newHead = {
      x: head.x + direction.x,
      y: head.y + direction.y
    };

    // Wall collision / Wrapping
    if (this.mode === GameMode.NO_WALLS) {
      if (newHead.x < 0) newHead.x = this.gridWidth - 1;
      if (newHead.x >= this.gridWidth) newHead.x = 0;
      if (newHead.y < 0) newHead.y = this.gridHeight - 1;
      if (newHead.y >= this.gridHeight) newHead.y = 0;
    } else {
      if (newHead.x < 0 || newHead.x >= this.gridWidth || newHead.y < 0 || newHead.y >= this.gridHeight) {
        this.triggerGameOver();
        return;
      }
    }

    // Self collision
    if (this.state.snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
      this.triggerGameOver();
      return;
    }

    this.state.snake.unshift(newHead);

    // Food collision
    const eatenFoodIndex = this.state.foods.findIndex(food => food.x === newHead.x && food.y === newHead.y);
    if (eatenFoodIndex !== -1) {
      this.handleEat(eatenFoodIndex);
      this.justAte = true;
    } else {
      this.state.snake.pop();
    }

    // Reset interpolation progress for the new tick
    this.interpolationProgress = 0;
  }

  private handleEat(eatenFoodIndex: number) {
    audioManager.playEat();
    const now = Date.now();

    let comboGrew = false;
    if (now - this.lastEatTime < 2000) {
      this.state.streak++;
      const oldMult = this.state.multiplier;
      this.state.multiplier = Math.min(5, 1 + Math.floor(this.state.streak / 3));
      if (this.state.multiplier > oldMult) comboGrew = true;
    } else {
      this.state.streak = 1;
      this.state.multiplier = 1;
    }
    this.lastEatTime = now;

    if (comboGrew && this.state.multiplier > 1) {
      audioManager.playCombo();
    }

    const coinVal = this.getCoinValue();
    const points = 10 * coinVal * this.state.multiplier;
    this.state.score += points;
    saveManager.addCoins(coinVal);

    saveManager.addStat('foodEaten', 1);
    saveManager.addStat('totalScore', points);
    saveManager.updateMaxStat('maxLength', this.state.snake.length);

    // Achievement checks
    if (!saveManager.data.unlockedAchievements.includes('first_blood')) saveManager.unlockAchievement('first_blood');
    if (this.state.snake.length >= 20) saveManager.unlockAchievement('snake_charmer');
    if (this.state.snake.length >= 50) saveManager.unlockAchievement('behemoth');
    if (this.state.score >= 100) saveManager.unlockAchievement('century');
    if (this.state.multiplier >= 5) saveManager.unlockAchievement('speed_demon_5');

    // Replace eaten food
    this.state.foods[eatenFoodIndex] = this.generateFood(this.state.snake, this.state.foods.filter((_, idx) => idx !== eatenFoodIndex));
  }

  private triggerGameOver() {
    this.state.gameOver = true;
    audioManager.playDeath();

    saveManager.addStat('gamesPlayed', 1);
    if (saveManager.data.stats.gamesPlayed >= 10) saveManager.unlockAchievement('dedicated_10');
    if (saveManager.data.stats.gamesPlayed >= 50) saveManager.unlockAchievement('dedicated_50');

    const isNewHigh = saveManager.updateHighScore(this.mode, this.state.score);
    // Extra visual burst on death if particles enabled
    if (saveManager.data.settings.particles) {
      const head = this.state.snake[0];
      const skin = SKINS.find(s => s.id === saveManager.data.selectedSkin) || SKINS[0];
      const pType = skin.particleType !== 'none' ? skin.particleType : 'smoke';

      this.particleSystem.emit(head.x, head.y, '#ef4444', 50, 4, pType as any);
      if (this.state.snake.length > 1) {
        this.particleSystem.emit(this.state.snake[1].x, this.state.snake[1].y, '#f87171', 30, 2, pType as any);
      }
    }
  }

  public tickTime() {
    if (this.state.gameOver) return;

    this.state.survivalTime++;

    if (this.mode === GameMode.TIME_ATTACK && this.state.timeLeft > 0) {
      this.state.timeLeft--;
      if (this.state.timeLeft <= 0) {
        this.triggerGameOver();
      }
    }

    // Decay streak
    if (Date.now() - this.lastEatTime > 3000) {
      this.state.streak = 0;
      this.state.multiplier = 1;
    }
  }
}
