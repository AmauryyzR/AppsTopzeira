import { SKINS } from '../data/skins';
import { saveManager } from '../store/SaveManager';
import { GameEngine } from './GameEngine';
import { GameMode, Position, Skin } from '../types';
import { drawSnakeArtwork } from './SnakeArtwork';

export class Renderer {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private cellSize = 0;
  private dpr: number;
  private mouthOpenAmount = 0;
  private chewTimer = 0;
  private readonly maxChewDuration = 0.6;
  private lastJustAte = false;
  private lastRenderTime = 0;
  private bulges: { age: number }[] = [];
  private tailParticleAccumulator = 0;
  private headParticleAccumulator = 0;
  private visualHeadAngle: number | null = null;

  constructor(canvas: HTMLCanvasElement, gridWidth: number) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false })!;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.resize(gridWidth);
  }

  public resize(gridWidth: number) {
    const container = this.canvas.parentElement;
    if (!container) return;
    const size = Math.min(container.clientWidth, container.clientHeight, 1200);
    this.cellSize = size / gridWidth;
    this.canvas.style.width = `${size}px`;
    this.canvas.style.height = `${size}px`;
    this.canvas.width = Math.max(1, Math.round(size * this.dpr));
    this.canvas.height = Math.max(1, Math.round(size * this.dpr));
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  public render(engine: GameEngine) {
    const state = engine.state;
    const settings = saveManager.data.settings;
    const skin = SKINS.find(item => item.id === saveManager.data.selectedSkin) || SKINS[0];
    const now = performance.now();
    const elapsed = this.lastRenderTime ? (now - this.lastRenderTime) / 1000 : 1 / 60;
    const dt = Math.min(0.05, elapsed);
    this.lastRenderTime = now;
    const time = now / 1000;

    this.updateEatingAnimation(engine, dt);
    this.drawBoard(time);

    const shaking = settings.screenShake && state.gameOver;
    if (shaking) {
      this.ctx.save();
      this.ctx.translate((Math.random() - 0.5) * 9, (Math.random() - 0.5) * 9);
    }

    if (settings.particles) engine.particleSystem.draw(this.ctx, this.cellSize);
    this.drawFoods(state.foods, settings.glow, time);

    const visualPositions = this.getVisualPositions(engine);
    if (visualPositions.length) {
      this.emitTrailParticles(engine, skin, visualPositions, dt);
      const mouthOpen = this.updateMouth(engine, visualPositions[0], dt);
      const visualHeadDirection = this.updateVisualHeadDirection(
        engine,
        dt,
        settings.headTracksFood,
      );
      drawSnakeArtwork({
        ctx: this.ctx,
        positions: visualPositions,
        cellSize: this.cellSize,
        skin,
        direction: visualHeadDirection,
        time,
        mouthOpen,
        glow: settings.glow,
        bulges: this.bulges.map(bulge => {
          const progress = Math.min(1, bulge.age / 1.5);
          return { progress, strength: 1 - progress };
        }),
      });
    }

    if (shaking) this.ctx.restore();
  }

  private updateEatingAnimation(engine: GameEngine, dt: number) {
    if (engine.justAte && !this.lastJustAte) {
      this.chewTimer = this.maxChewDuration;
      this.bulges.push({ age: 0 });
    }
    this.lastJustAte = engine.justAte;
    this.chewTimer = Math.max(0, this.chewTimer - dt);
    for (let index = this.bulges.length - 1; index >= 0; index--) {
      this.bulges[index].age += dt;
      if (this.bulges[index].age >= 1.5) this.bulges.splice(index, 1);
    }
  }

  private drawBoard(time: number) {
    const width = this.canvas.width / this.dpr;
    const height = this.canvas.height / this.dpr;
    const background = this.ctx.createRadialGradient(width * 0.48, height * 0.42, this.cellSize, width * 0.5, height * 0.5, width * 0.76);
    background.addColorStop(0, '#16243a');
    background.addColorStop(0.55, '#101b2d');
    background.addColorStop(1, '#080f1e');
    this.ctx.fillStyle = background;
    this.ctx.fillRect(0, 0, width, height);

    const ambient = this.ctx.createRadialGradient(width * (0.25 + Math.sin(time * 0.12) * 0.03), height * 0.18, 0, width * 0.25, height * 0.18, width * 0.55);
    ambient.addColorStop(0, 'rgba(16, 185, 129, 0.055)');
    ambient.addColorStop(1, 'rgba(16, 185, 129, 0)');
    this.ctx.fillStyle = ambient;
    this.ctx.fillRect(0, 0, width, height);

    this.ctx.lineWidth = 1;
    for (let x = 0; x <= width + 0.5; x += this.cellSize) {
      const major = Math.round(x / this.cellSize) % 5 === 0;
      this.ctx.strokeStyle = major ? 'rgba(148, 163, 184, 0.07)' : 'rgba(148, 163, 184, 0.035)';
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, height);
      this.ctx.stroke();
    }
    for (let y = 0; y <= height + 0.5; y += this.cellSize) {
      const major = Math.round(y / this.cellSize) % 5 === 0;
      this.ctx.strokeStyle = major ? 'rgba(148, 163, 184, 0.07)' : 'rgba(148, 163, 184, 0.035)';
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(width, y);
      this.ctx.stroke();
    }

    const vignette = this.ctx.createRadialGradient(width / 2, height / 2, width * 0.28, width / 2, height / 2, width * 0.72);
    vignette.addColorStop(0, 'rgba(2, 6, 23, 0)');
    vignette.addColorStop(1, 'rgba(2, 6, 23, 0.52)');
    this.ctx.fillStyle = vignette;
    this.ctx.fillRect(0, 0, width, height);
  }

  private drawFoods(foods: Position[], glow: boolean, time: number) {
    foods.forEach((food, index) => {
      const centerX = (food.x + 0.5) * this.cellSize;
      const centerY = (food.y + 0.5) * this.cellSize;
      const pulse = 1 + Math.sin(time * 5.5 + index) * 0.08;
      const radius = this.cellSize * 0.32 * pulse;
      this.ctx.save();
      this.ctx.translate(centerX, centerY);
      this.ctx.fillStyle = 'rgba(2, 6, 23, 0.55)';
      this.ctx.beginPath();
      this.ctx.ellipse(0, this.cellSize * 0.18, radius * 0.94, radius * 0.42, 0, 0, Math.PI * 2);
      this.ctx.fill();
      if (glow) {
        this.ctx.shadowColor = '#fde047';
        this.ctx.shadowBlur = this.cellSize * 0.6;
      }
      const coinGradient = this.ctx.createRadialGradient(-radius * 0.3, -radius * 0.35, 0, 0, 0, radius);
      coinGradient.addColorStop(0, '#fff7ae');
      coinGradient.addColorStop(0.38, '#facc15');
      coinGradient.addColorStop(0.75, '#d97706');
      coinGradient.addColorStop(1, '#854d0e');
      this.ctx.fillStyle = coinGradient;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
      this.ctx.strokeStyle = '#fef08a';
      this.ctx.lineWidth = Math.max(1, this.cellSize * 0.045);
      this.ctx.beginPath();
      this.ctx.arc(0, 0, radius * 0.73, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.fillStyle = '#92400e';
      this.ctx.font = `900 ${radius * 1.25}px ui-monospace, monospace`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText('$', 0, radius * 0.08);
      this.ctx.fillStyle = 'rgba(255,255,255,0.7)';
      this.ctx.beginPath();
      this.ctx.arc(-radius * 0.34, -radius * 0.34, radius * 0.12, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    });
  }

  private getVisualPositions(engine: GameEngine): Position[] {
    const state = engine.state;
    const progress = engine.interpolationProgress;
    const positions: Position[] = [];
    const head = state.snake[0];
    if (!head) return positions;
    const previousHead = engine.previousSnake[0] || head;
    let headX = head.x;
    let headY = head.y;
    if (progress < 1 && !state.gameOver && Math.abs(head.x - previousHead.x) <= 1 && Math.abs(head.y - previousHead.y) <= 1) {
      headX = previousHead.x + (head.x - previousHead.x) * progress;
      headY = previousHead.y + (head.y - previousHead.y) * progress;
    }
    positions.push({ x: headX, y: headY });
    for (let index = 1; index < state.snake.length; index++) {
      const segment = state.snake[index];
      const previous = engine.previousSnake[index] || segment;
      let x = segment.x;
      let y = segment.y;
      if (progress < 1 && !state.gameOver && Math.abs(segment.x - previous.x) <= 1.5 && Math.abs(segment.y - previous.y) <= 1.5) {
        x = previous.x + (segment.x - previous.x) * progress;
        y = previous.y + (segment.y - previous.y) * progress;
      }
      positions.push({ x, y });
    }
    if (!engine.justAte && progress < 1 && !state.gameOver && engine.previousSnake.length) {
      const oldTail = engine.previousSnake[engine.previousSnake.length - 1];
      const newTail = state.snake[state.snake.length - 1] || oldTail;
      if (Math.abs(oldTail.x - newTail.x) <= 1 && Math.abs(oldTail.y - newTail.y) <= 1) {
        positions.push({ x: oldTail.x + (newTail.x - oldTail.x) * progress, y: oldTail.y + (newTail.y - oldTail.y) * progress });
      }
    }
    return positions;
  }

  private updateMouth(engine: GameEngine, visualHead: Position, dt: number) {
    let minimumDistance = Infinity;
    const wrapping = engine.mode === GameMode.NO_WALLS;
    engine.state.foods.forEach(food => {
      let dx = food.x - visualHead.x;
      let dy = food.y - visualHead.y;
      if (wrapping) {
        if (dx > engine.gridWidth / 2) dx -= engine.gridWidth;
        else if (dx < -engine.gridWidth / 2) dx += engine.gridWidth;
        if (dy > engine.gridHeight / 2) dy -= engine.gridHeight;
        else if (dy < -engine.gridHeight / 2) dy += engine.gridHeight;
      }
      minimumDistance = Math.min(minimumDistance, Math.hypot(dx, dy));
    });
    let target = 0;
    if (this.chewTimer > 0) target = 1;
    else if (minimumDistance < 1.8) target = Math.max(0, Math.min(1, (1.8 - minimumDistance) / 0.8));
    const speed = target > this.mouthOpenAmount ? 11 : 2.6;
    this.mouthOpenAmount += Math.sign(target - this.mouthOpenAmount) * Math.min(Math.abs(target - this.mouthOpenAmount), dt * speed);
    if (this.chewTimer > 0) {
      const progress = (this.maxChewDuration - this.chewTimer) / this.maxChewDuration;
      return this.mouthOpenAmount * (0.5 + Math.cos(progress * Math.PI * 4) * 0.5);
    }
    return this.mouthOpenAmount;
  }

  private updateVisualHeadDirection(engine: GameEngine, dt: number, enabled: boolean): Position {
    const movementDirection = engine.state.direction;
    const movementAngle = Math.atan2(movementDirection.y, movementDirection.x);

    if (!enabled || engine.state.gameOver) {
      this.visualHeadAngle = movementAngle;
      return movementDirection;
    }

    if (this.visualHeadAngle === null) this.visualHeadAngle = movementAngle;
    const head = engine.state.snake[0];
    let targetAngle = movementAngle;
    let bestAngularDistance = Infinity;
    let trackingFood = false;

    if (head) {
      for (const food of engine.state.foods) {
        let dx = food.x - head.x;
        let dy = food.y - head.y;

        if (engine.mode === GameMode.NO_WALLS) {
          if (dx > engine.gridWidth / 2) dx -= engine.gridWidth;
          else if (dx < -engine.gridWidth / 2) dx += engine.gridWidth;
          if (dy > engine.gridHeight / 2) dy -= engine.gridHeight;
          else if (dy < -engine.gridHeight / 2) dy += engine.gridHeight;
        }

        // Use grid adjacency instead of interpolated distance. This keeps the
        // target stable for the whole game tick and excludes diagonal cells.
        if (Math.abs(dx) + Math.abs(dy) !== 1) continue;

        const candidateAngle = Math.atan2(dy, dx);
        const angularDistance = Math.abs(this.normalizeAngle(candidateAngle - this.visualHeadAngle));
        if (angularDistance < bestAngularDistance) {
          bestAngularDistance = angularDistance;
          targetAngle = candidateAngle;
          trackingFood = true;
        }
      }
    }

    const delta = this.normalizeAngle(targetAngle - this.visualHeadAngle);
    const responsiveness = trackingFood ? 13 : 18;
    const blend = 1 - Math.exp(-responsiveness * dt);
    this.visualHeadAngle = this.normalizeAngle(this.visualHeadAngle + delta * blend);

    return {
      x: Math.cos(this.visualHeadAngle),
      y: Math.sin(this.visualHeadAngle),
    };
  }

  private normalizeAngle(angle: number) {
    return Math.atan2(Math.sin(angle), Math.cos(angle));
  }

  private emitTrailParticles(engine: GameEngine, skin: Skin, positions: Position[], dt: number) {
    const settings = saveManager.data.settings;
    if (!settings.particles || !skin.trail || skin.particleType === 'none' || engine.state.gameOver) return;
    const energetic = ['fire', 'plasma', 'rainbow'].includes(skin.particleType);
    this.tailParticleAccumulator = Math.min(4, this.tailParticleAccumulator + dt * (energetic ? 24 : 11));
    this.headParticleAccumulator = Math.min(2, this.headParticleAccumulator + dt * (energetic ? 3.5 : 1.2));
    const tail = positions[positions.length - 1];
    while (tail && this.tailParticleAccumulator >= 1) {
      engine.particleSystem.emitTrail(tail.x, tail.y, skin.particleType, skin.glowColor);
      this.tailParticleAccumulator -= 1;
    }
    while (this.headParticleAccumulator >= 1) {
      engine.particleSystem.emitTrail(positions[0].x, positions[0].y, skin.particleType, skin.glowColor);
      this.headParticleAccumulator -= 1;
    }
  }

}
