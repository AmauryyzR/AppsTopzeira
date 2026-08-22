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

export interface ForbiddenProjectile {
  id: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  velocityX: number;
  velocityY: number;
  rotation: number;
  angularVelocity: number;
  spinning: boolean;
  warningTime: number;
  warningDuration: number;
  age: number;
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
  public forbiddenProjectiles: ForbiddenProjectile[] = [];
  private forbiddenSpawnAccumulator = 0;
  private nextForbiddenProjectileId = 1;

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

    const foodsCount = this.mode === GameMode.FORBIDDEN
      ? 16
      : this.mode === GameMode.COIN_FEVER
        ? 8
        : 1;
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
    this.forbiddenProjectiles = [];
    this.forbiddenSpawnAccumulator = 0;
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
    if (this.mode !== GameMode.COIN_FEVER && this.mode !== GameMode.FORBIDDEN) return 1;
    const time = this.state.survivalTime;
    let value = 1;
    if (time >= 100) value = 10;
    else if (time >= 50) value = 5;
    else if (time >= 20) value = 2;
    return this.mode === GameMode.FORBIDDEN ? value * 2 : value;
  }

  public updateForbiddenProjectiles(deltaTime: number, spawnInterval = 1) {
    if (this.mode !== GameMode.FORBIDDEN || this.state.gameOver) return;

    const dt = Math.max(0, Math.min(0.05, deltaTime));
    const interval = Math.max(0.3, Math.min(1, spawnInterval));
    this.forbiddenSpawnAccumulator += dt;
    while (this.forbiddenSpawnAccumulator >= interval) {
      this.forbiddenSpawnAccumulator -= interval;
      this.spawnForbiddenProjectile();
    }

    const head = this.state.snake[0];
    const previousHead = this.previousSnake[0] || head;
    let collisionHead = head;
    if (head && previousHead && Math.abs(head.x - previousHead.x) <= 1 && Math.abs(head.y - previousHead.y) <= 1) {
      collisionHead = {
        x: previousHead.x + (head.x - previousHead.x) * this.interpolationProgress,
        y: previousHead.y + (head.y - previousHead.y) * this.interpolationProgress,
      };
    }
    for (const projectile of this.forbiddenProjectiles) {
      projectile.age += dt;
      if (projectile.warningTime > 0) {
        projectile.warningTime = Math.max(0, projectile.warningTime - dt);
        continue;
      }

      const previousX = projectile.x;
      const previousY = projectile.y;
      projectile.x += projectile.velocityX * dt;
      projectile.y += projectile.velocityY * dt;
      if (projectile.spinning) {
        projectile.rotation += projectile.angularVelocity * dt;
      }

      if (collisionHead && this.distanceToSegment(collisionHead.x, collisionHead.y, previousX, previousY, projectile.x, projectile.y) <= 0.744) {
        this.triggerGameOver();
        return;
      }
    }

    this.forbiddenProjectiles = this.forbiddenProjectiles.filter(projectile => (
      projectile.age < 8
      && projectile.x > -3
      && projectile.x < this.gridWidth + 2
      && projectile.y > -3
      && projectile.y < this.gridHeight + 2
    ));
  }

  private spawnForbiddenProjectile() {
    const head = this.state.snake[0];
    if (!head) return;

    const nearbyTargets: Position[] = [];
    for (let offsetY = -3; offsetY <= 3; offsetY++) {
      for (let offsetX = -3; offsetX <= 3; offsetX++) {
        const distance = Math.hypot(offsetX, offsetY);
        const x = head.x + offsetX;
        const y = head.y + offsetY;
        if (distance < 1 || distance > 3 || x < 0 || x >= this.gridWidth || y < 0 || y >= this.gridHeight) continue;
        nearbyTargets.push({ x, y });
      }
    }
    const target = nearbyTargets[Math.floor(Math.random() * nearbyTargets.length)] || head;

    let x = 0;
    let y = 0;
    const edge = Math.floor(Math.random() * 4);
    if (edge === 0) {
      x = Math.random() * (this.gridWidth - 1);
      y = -1.4;
    } else if (edge === 1) {
      x = this.gridWidth + 0.4;
      y = Math.random() * (this.gridHeight - 1);
    } else if (edge === 2) {
      x = Math.random() * (this.gridWidth - 1);
      y = this.gridHeight + 0.4;
    } else {
      x = -1.4;
      y = Math.random() * (this.gridHeight - 1);
    }

    const directionX = target.x - x;
    const directionY = target.y - y;
    const magnitude = Math.hypot(directionX, directionY) || 1;
    const speed = 7.2 + Math.random() * 1.6 + Math.min(2.2, this.state.survivalTime * 0.018);
    const spinning = Math.random() < 0.225;
    const warningDuration = 0.36;

    this.forbiddenProjectiles.push({
      id: this.nextForbiddenProjectileId++,
      x,
      y,
      targetX: target.x,
      targetY: target.y,
      velocityX: directionX / magnitude * speed,
      velocityY: directionY / magnitude * speed,
      rotation: spinning ? Math.random() * Math.PI * 2 : 0,
      angularVelocity: spinning ? (Math.random() < 0.5 ? -1 : 1) * (4.5 + Math.random() * 2.5) : 0,
      spinning,
      warningTime: warningDuration,
      warningDuration,
      age: 0,
    });

    if (this.forbiddenProjectiles.length > 10) {
      this.forbiddenProjectiles.splice(0, this.forbiddenProjectiles.length - 10);
    }
  }

  private distanceToSegment(px: number, py: number, x1: number, y1: number, x2: number, y2: number) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lengthSquared = dx * dx + dy * dy;
    if (lengthSquared === 0) return Math.hypot(px - x1, py - y1);
    const projection = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / lengthSquared));
    return Math.hypot(px - (x1 + projection * dx), py - (y1 + projection * dy));
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
