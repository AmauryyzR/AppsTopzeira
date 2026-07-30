import { SKINS } from '../data/skins';
import { saveManager } from '../store/SaveManager';
import { GameEngine } from './GameEngine';
import { GameMode } from '../types';

export class Renderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private cellSize: number;
  private dpr: number;

  private mouthOpenAmount: number = 0;
  private chewTimer: number = 0;
  private readonly maxChewDuration: number = 0.6;
  private lastJustAte: boolean = false;
  private lastRenderTime: number = 0;
  private bulges: { age: number }[] = [];

  constructor(canvas: HTMLCanvasElement, gridWidth: number) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false })!;
    this.dpr = window.devicePixelRatio || 1;
    this.cellSize = 0;
    this.resize(gridWidth);
  }

  public resize(gridWidth: number) {
    const container = this.canvas.parentElement;
    if (!container) return;
    
    // Scale up by devicePixelRatio for crispness
    const size = Math.min(container.clientWidth, container.clientHeight, 1200);
    this.cellSize = size / gridWidth;
    
    this.canvas.style.width = `${size}px`;
    this.canvas.style.height = `${size}px`;
    
    this.canvas.width = size * this.dpr;
    this.canvas.height = size * this.dpr;
    
    this.ctx.scale(this.dpr, this.dpr);
  }

  public render(engine: GameEngine) {
    const state = engine.state;
    const settings = saveManager.data.settings;
    const skin = SKINS.find(s => s.id === saveManager.data.selectedSkin) || SKINS[0];
    const gridWidth = engine.gridWidth;
    const gridHeight = engine.gridHeight;
    const wrapping = engine.mode === GameMode.NO_WALLS;

    const now = performance.now();
    const dt = this.lastRenderTime ? (now - this.lastRenderTime) / 1000 : 0.016;
    this.lastRenderTime = now;

    if (engine.justAte && !this.lastJustAte) {
        this.chewTimer = this.maxChewDuration;
        this.bulges.push({ age: 0 });
    }
    this.lastJustAte = engine.justAte;

    if (this.chewTimer > 0) {
        this.chewTimer = Math.max(0, this.chewTimer - dt);
    }

    for (let j = this.bulges.length - 1; j >= 0; j--) {
        const b = this.bulges[j];
        b.age += dt;
        if (b.age >= 1.5) {
            this.bulges.splice(j, 1);
        }
    }
    
    // Clear background
    this.ctx.fillStyle = '#0f172a'; // slate-900 background
    this.ctx.fillRect(0, 0, this.canvas.width / this.dpr, this.canvas.height / this.dpr);
    
    // Draw Grid
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    this.ctx.lineWidth = 1;
    const cw = this.canvas.width / this.dpr;
    const ch = this.canvas.height / this.dpr;
    
    for (let x = 0; x <= cw; x += this.cellSize) {
      this.ctx.beginPath(); this.ctx.moveTo(x, 0); this.ctx.lineTo(x, ch); this.ctx.stroke();
    }
    for (let y = 0; y <= ch; y += this.cellSize) {
      this.ctx.beginPath(); this.ctx.moveTo(0, y); this.ctx.lineTo(cw, y); this.ctx.stroke();
    }

    if (settings.screenShake && state.gameOver) {
      this.ctx.save();
      const shakeX = (Math.random() - 0.5) * 10;
      const shakeY = (Math.random() - 0.5) * 10;
      this.ctx.translate(shakeX, shakeY);
    }

    if (settings.particles) {
      engine.particleSystem.draw(this.ctx, this.cellSize);
    }

    // Draw Foods (Coins)
    for (const food of state.foods) {
      const foodX = food.x * this.cellSize;
      const foodY = food.y * this.cellSize;
      const foodSize = this.cellSize * 0.65;
      const cx = foodX + this.cellSize/2;
      const cy = foodY + this.cellSize/2;
      const pulseTime = performance.now() / 1000;
      const pulseScale = 1.0 + 0.12 * Math.sin(pulseTime * 5.5);
      const r = (foodSize/2) * pulseScale;
      
      if (settings.glow) {
        this.ctx.shadowColor = '#fde047';
        this.ctx.shadowBlur = 15;
      }

      // Outer rim
      this.ctx.fillStyle = '#ca8a04';
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, r, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Inner face
      this.ctx.fillStyle = '#facc15';
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, r * 0.75, 0, Math.PI * 2);
      this.ctx.fill();
      
      this.ctx.shadowBlur = 0;
      
      // Coin symbol
      this.ctx.fillStyle = '#a16207';
      this.ctx.font = `bold ${r * 1.2}px sans-serif`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText('$', cx, cy + r * 0.1);
    }

    // Smooth Snake Rendering
    const progress = engine.interpolationProgress;
    const snake = state.snake;
    
    // Calculate exact visual positions
    const visualPositions: {x: number, y: number}[] = [];
    
    // 1. Head
    const head = state.snake[0];
    const prevHead = engine.previousSnake[0] || head;
    let hx = head.x;
    let hy = head.y;
    
    if (progress < 1 && !state.gameOver) {
        if (Math.abs(head.x - prevHead.x) <= 1 && Math.abs(head.y - prevHead.y) <= 1) {
            hx = prevHead.x + (head.x - prevHead.x) * progress;
            hy = prevHead.y + (head.y - prevHead.y) * progress;
        }
    }
    visualPositions.push({ x: hx, y: hy });
    
    // 2. Body (interpolated for fluid sliding)
    for (let i = 1; i < state.snake.length; i++) {
        const seg = state.snake[i];
        const prevSeg = engine.previousSnake[i] || seg;
        let sx = seg.x;
        let sy = seg.y;
        
        if (progress < 1 && !state.gameOver) {
            if (Math.abs(seg.x - prevSeg.x) <= 1.5 && Math.abs(seg.y - prevSeg.y) <= 1.5) {
                sx = prevSeg.x + (seg.x - prevSeg.x) * progress;
                sy = prevSeg.y + (seg.y - prevSeg.y) * progress;
            }
        }
        visualPositions.push({ x: sx, y: sy });
    }
    
    // 3. Tail retraction (only if we didn't just eat and there was a previous tail)
    if (!engine.justAte && progress < 1 && !state.gameOver && engine.previousSnake.length > 0) {
        const oldTail = engine.previousSnake[engine.previousSnake.length - 1];
        const newTail = state.snake[state.snake.length - 1] || oldTail;
        
        if (Math.abs(oldTail.x - newTail.x) <= 1 && Math.abs(oldTail.y - newTail.y) <= 1) {
            const tx = oldTail.x + (newTail.x - oldTail.x) * progress;
            const ty = oldTail.y + (newTail.y - oldTail.y) * progress;
            visualPositions.push({ x: tx, y: ty });
        }
    }

    if (settings.particles && skin.trail && skin.particleType !== 'none' && !state.gameOver) {
        const tailPos = visualPositions[visualPositions.length - 1];
        if (tailPos) {
            const tailRate = skin.particleType === 'fire' || skin.particleType === 'plasma' ? 0.8 : 0.5;
            if (Math.random() < tailRate) {
                engine.particleSystem.emitTrail(tailPos.x, tailPos.y, skin.particleType as any, skin.glowColor);
            }
        }
        const headRate = skin.particleType === 'fire' || skin.particleType === 'plasma' ? 0.3 : 0.15;
        if (Math.random() < headRate) {
            engine.particleSystem.emitTrail(visualPositions[0].x, visualPositions[0].y, skin.particleType as any, skin.glowColor);
        }
    }

    if (visualPositions.length > 0) {
      // 1. Draw continuous thick body stroke
      this.ctx.strokeStyle = skin.bodyColors[0];
      this.ctx.lineWidth = this.cellSize * 0.8;
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
      
      if (settings.glow && skin.trail) {
          this.ctx.shadowColor = skin.glowColor;
          this.ctx.shadowBlur = 10;
      }
      
      this.ctx.beginPath();
      for (let i = 0; i < visualPositions.length; i++) {
          const px = visualPositions[i].x * this.cellSize + this.cellSize/2;
          const py = visualPositions[i].y * this.cellSize + this.cellSize/2;
          
          if (i === 0) {
              this.ctx.moveTo(px, py);
          } else {
              // Insert the intermediate grid corner cell to prevent diagonal cutting during turns
              const cornerGrid = state.snake[i];
              if (cornerGrid) {
                  const cpx = cornerGrid.x * this.cellSize + this.cellSize/2;
                  const cpy = cornerGrid.y * this.cellSize + this.cellSize/2;
                  
                  const prevPx = visualPositions[i-1].x * this.cellSize + this.cellSize/2;
                  const prevPy = visualPositions[i-1].y * this.cellSize + this.cellSize/2;
                  
                  // Check wrapping for both parts of the step
                  const wrap1 = Math.abs(cpx - prevPx) > this.cellSize * 1.5 || Math.abs(cpy - prevPy) > this.cellSize * 1.5;
                  const wrap2 = Math.abs(px - cpx) > this.cellSize * 1.5 || Math.abs(py - cpy) > this.cellSize * 1.5;
                  
                  if (wrap1 || wrap2) {
                      this.ctx.moveTo(px, py);
                  } else {
                      this.ctx.lineTo(cpx, cpy);
                      this.ctx.lineTo(px, py);
                  }
              } else {
                  const prevPx = visualPositions[i-1].x * this.cellSize + this.cellSize/2;
                  const prevPy = visualPositions[i-1].y * this.cellSize + this.cellSize/2;
                  
                  if (Math.abs(px - prevPx) > this.cellSize * 1.5 || Math.abs(py - prevPy) > this.cellSize * 1.5) {
                      this.ctx.moveTo(px, py);
                  } else {
                      this.ctx.lineTo(px, py);
                  }
              }
          }
      }
      this.ctx.stroke();
      this.ctx.shadowBlur = 0;

      // Draw swallowed coin bulges
      if (this.bulges.length > 0) {
          for (const b of this.bulges) {
              const t_progress = b.age / 1.5;
              const index = t_progress * (visualPositions.length - 1);
              const idx1 = Math.floor(index);
              const idx2 = Math.min(visualPositions.length - 1, idx1 + 1);
              const f = index - idx1;

              const p1 = visualPositions[idx1];
              const p2 = visualPositions[idx2];

              if (!p1) continue;

              let bx = p1.x;
              let by = p1.y;

              if (p2) {
                  if (Math.abs(p2.x - p1.x) > 1.5 || Math.abs(p2.y - p1.y) > 1.5) {
                      bx = f < 0.5 ? p1.x : p2.x;
                      by = f < 0.5 ? p1.y : p2.y;
                  } else {
                      bx = p1.x + (p2.x - p1.x) * f;
                      by = p1.y + (p2.y - p1.y) * f;
                  }
              }

              const bpx = bx * this.cellSize + this.cellSize/2;
              const bpy = by * this.cellSize + this.cellSize/2;

              const extraR = this.cellSize * 0.22 * (1 - t_progress);
              const bulgeR = (this.cellSize * 0.4) + extraR;

              // Compute color to match the local body region color exactly
              let bulgeColor = skin.bodyColors[0];
              if (skin.pattern === 'gradient') {
                  bulgeColor = skin.bodyColors[idx1 % skin.bodyColors.length];
              } else if (skin.pattern === 'striped') {
                  bulgeColor = (idx1 % 2 === 0) ? (skin.bodyColors[1] || skin.bodyColors[0]) : skin.bodyColors[0];
              }

              this.ctx.fillStyle = bulgeColor;
              this.ctx.shadowBlur = 0; // Disable any highlights/glow in drawing the bulge

              this.ctx.beginPath();
              this.ctx.arc(bpx, bpy, bulgeR, 0, Math.PI * 2);
              this.ctx.fill();
          }
      }

      // 2. Draw textures and Head
      for (let i = visualPositions.length - 1; i >= 0; i--) {
          const p = visualPositions[i];
          const px = p.x * this.cellSize + this.cellSize/2;
          const py = p.y * this.cellSize + this.cellSize/2;

          if (i === 0) {
              // Mouth animation variables
              const R = this.cellSize * 0.42;
              let alpha = 0;
              const maxAlpha = Math.PI / 5; // Maximum half-opening angle (total 72 degrees)
              let targetFoodDir: { x: number, y: number } | null = null;
              let minVisualDist = Infinity;

              // 1. Calculate wrapped distance to normal foods
              for (const food of state.foods) {
                let dx = food.x - hx;
                let dy = food.y - hy;

                if (wrapping) {
                  const halfW = gridWidth / 2;
                  const halfH = gridHeight / 2;
                  if (dx > halfW) dx -= gridWidth;
                  else if (dx < -halfW) dx += gridWidth;

                  if (dy > halfH) dy -= gridHeight;
                  else if (dy < -halfH) dy += gridHeight;
                }

                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < minVisualDist) {
                  minVisualDist = dist;
                  targetFoodDir = { x: dx, y: dy };
                }
              }

              // 2. Override if just ate (visualizing sliding onto the coin)
              if (engine.justAte) {
                let dx = head.x - hx;
                let dy = head.y - hy;

                if (wrapping) {
                  const halfW = gridWidth / 2;
                  const halfH = gridHeight / 2;
                  if (dx > halfW) dx -= gridWidth;
                  else if (dx < -halfW) dx += gridWidth;

                  if (dy > halfH) dy -= gridHeight;
                  else if (dy < -halfH) dy += gridHeight;
                }

                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < minVisualDist) {
                  minVisualDist = dist;
                  targetFoodDir = state.direction;
                }
              }

              // 3. Compute alpha (mouth opening with smooth time-decay closing)
              let targetMouthOpen = 0;
              if (this.chewTimer > 0) {
                targetMouthOpen = 1.0;
              } else if (minVisualDist < 1.8) {
                targetMouthOpen = Math.max(0, Math.min(1, (1.8 - minVisualDist) / 0.8));
              }

              if (targetMouthOpen > this.mouthOpenAmount) {
                this.mouthOpenAmount = Math.min(targetMouthOpen, this.mouthOpenAmount + dt * 12);
              } else {
                this.mouthOpenAmount = Math.max(targetMouthOpen, this.mouthOpenAmount - dt * 2.2);
              }

              if (this.chewTimer > 0) {
                const chewProgress = (this.maxChewDuration - this.chewTimer) / this.maxChewDuration;
                const chew = 0.5 + 0.5 * Math.cos(chewProgress * Math.PI * 4);
                alpha = this.mouthOpenAmount * chew * maxAlpha;
              } else {
                alpha = this.mouthOpenAmount * maxAlpha;
              }

              // 4. Calculate head angle theta
              let theta = Math.atan2(state.direction.y, state.direction.x);
              if (alpha > 0.01 && targetFoodDir && minVisualDist < 1.8) {
                theta = Math.atan2(targetFoodDir.y, targetFoodDir.x);
              }

              const mdx = Math.cos(theta);
              const mdy = Math.sin(theta);
              const px_perp = -mdy;
              const py_perp = mdx;

              // 5. Draw head base shape (Circle)
              this.ctx.fillStyle = skin.headColor;
              if (settings.glow) {
                  this.ctx.shadowColor = skin.glowColor;
                  this.ctx.shadowBlur = 15;
              }
              this.ctx.beginPath();
              this.ctx.arc(px, py, R, 0, Math.PI * 2);
              this.ctx.fill();

              // 6. Draw snout projection & mouth cavity & fangs if open
              if (alpha > 0.01) {
                  const sizeMult = engine.justAte ? 1.45 : 1.15;
                  const projMult = engine.justAte ? 0.75 : 0.55;
                  const mouthR = R * sizeMult;
                  const mouthProj = R * projMult * (alpha / maxAlpha);

                  const cx = px + mdx * mouthProj;
                  const cy = py + mdy * mouthProj;

                  // Draw outer snout semi-circle facing forward
                  this.ctx.beginPath();
                  this.ctx.arc(cx, cy, mouthR, theta - Math.PI / 2, theta + Math.PI / 2);
                  this.ctx.lineTo(cx, cy);
                  this.ctx.closePath();
                  this.ctx.fill();
                  this.ctx.shadowBlur = 0; // Turn off glow for inner cavity

                  let mouthInteriorStyle = 'rgba(0, 0, 0, 0.45)';
                  let toothColor = '#ffffff';

                  if (skin.id === 'magma_core') {
                    mouthInteriorStyle = 'rgba(239, 68, 68, 0.8)';
                    toothColor = '#facc15';
                  } else if (skin.id === 'toxic_sludge') {
                    mouthInteriorStyle = 'rgba(101, 163, 13, 0.7)';
                    toothColor = '#ccfbf1';
                  } else if (skin.id === 'crimson_fire') {
                    mouthInteriorStyle = 'rgba(185, 28, 28, 0.7)';
                    toothColor = '#fef08a';
                  } else if (skin.id === 'cyber_pink') {
                    mouthInteriorStyle = 'rgba(219, 39, 119, 0.6)';
                  } else if (skin.id === 'shadow_fiend') {
                    mouthInteriorStyle = 'rgba(15, 23, 42, 0.95)';
                    toothColor = '#94a3b8';
                  } else if (skin.id === 'golden_serpent') {
                    mouthInteriorStyle = 'rgba(161, 98, 7, 0.7)';
                  } else if (skin.id === 'ice_wyrm') {
                    mouthInteriorStyle = 'rgba(8, 145, 178, 0.6)';
                    toothColor = '#e0f7fa';
                  }

                  // Draw Cavity (semi-circle wedge)
                  const cavityR = mouthR * 0.75;
                  this.ctx.fillStyle = mouthInteriorStyle;
                  this.ctx.beginPath();
                  this.ctx.arc(cx, cy, cavityR, theta - Math.PI / 2, theta + Math.PI / 2);
                  this.ctx.lineTo(cx, cy);
                  this.ctx.closePath();
                  this.ctx.fill();

                  // Draw teeth/fangs pointing forward & inward
                  const fangSize = mouthR * 0.25;
                  this.ctx.fillStyle = toothColor;

                  const x_top = cx + cavityR * Math.cos(theta - Math.PI / 2);
                  const y_top = cy + cavityR * Math.sin(theta - Math.PI / 2);
                  const x_bottom = cx + cavityR * Math.cos(theta + Math.PI / 2);
                  const y_bottom = cy + cavityR * Math.sin(theta + Math.PI / 2);

                  // Top fang: points forward and inward
                  const topFangAngle = theta - Math.PI / 2 + Math.PI / 5;
                  const x_top_fang_tip = cx + (cavityR - fangSize * 0.8) * Math.cos(topFangAngle);
                  const y_top_fang_tip = cy + (cavityR - fangSize * 0.8) * Math.sin(topFangAngle);

                  this.ctx.beginPath();
                  this.ctx.moveTo(x_top, y_top);
                  this.ctx.lineTo(cx + (cavityR - fangSize) * Math.cos(theta - Math.PI / 2), cy + (cavityR - fangSize) * Math.sin(theta - Math.PI / 2));
                  this.ctx.lineTo(x_top_fang_tip, y_top_fang_tip);
                  this.ctx.closePath();
                  this.ctx.fill();

                  // Bottom fang: points forward and inward
                  const bottomFangAngle = theta + Math.PI / 2 - Math.PI / 5;
                  const x_bottom_fang_tip = cx + (cavityR - fangSize * 0.8) * Math.cos(bottomFangAngle);
                  const y_bottom_fang_tip = cy + (cavityR - fangSize * 0.8) * Math.sin(bottomFangAngle);

                  this.ctx.beginPath();
                  this.ctx.moveTo(x_bottom, y_bottom);
                  this.ctx.lineTo(cx + (cavityR - fangSize) * Math.cos(theta + Math.PI / 2), cy + (cavityR - fangSize) * Math.sin(theta + Math.PI / 2));
                  this.ctx.lineTo(x_bottom_fang_tip, y_bottom_fang_tip);
                  this.ctx.closePath();
                  this.ctx.fill();
              }
              this.ctx.shadowBlur = 0;

              // 7. Draw Eyes (remain on the head base circle, shifted back)
              this.ctx.fillStyle = '#ffffff';
              const eyeSize = this.cellSize * 0.15;
              const currentEyeSize = alpha > 0.01 ? eyeSize * 1.15 : eyeSize;
              const currentPupilSize = alpha > 0.01 ? eyeSize * 0.45 : eyeSize * 0.4;
              
              // Place eyes further back to make room for mouth in front
              const eyeOffsetForward = this.cellSize * 0.06; 
              const eyeOffsetSide = this.cellSize * 0.22;
              
              const eye1X = px + mdx * eyeOffsetForward + px_perp * eyeOffsetSide;
              const eye1Y = py + mdy * eyeOffsetForward + py_perp * eyeOffsetSide;
              const eye2X = px + mdx * eyeOffsetForward - px_perp * eyeOffsetSide;
              const eye2Y = py + mdy * eyeOffsetForward - py_perp * eyeOffsetSide;
              
              this.ctx.beginPath(); 
              this.ctx.arc(eye1X, eye1Y, currentEyeSize, 0, Math.PI*2); 
              this.ctx.fill();
              
              this.ctx.beginPath(); 
              this.ctx.arc(eye2X, eye2Y, currentEyeSize, 0, Math.PI*2); 
              this.ctx.fill();
              
              // Draw pupils
              this.ctx.fillStyle = '#000000';
              let pupilOffsetForward = currentEyeSize * 0.35;
              let pupilOffsetSide1 = 0;
              let pupilOffsetSide2 = 0;
              
              if (alpha > 0.01) {
                pupilOffsetSide1 = -currentEyeSize * 0.15;
                pupilOffsetSide2 = currentEyeSize * 0.15;
              }
              
              const pupil1X = eye1X + mdx * pupilOffsetForward + px_perp * pupilOffsetSide1;
              const pupil1Y = eye1Y + mdy * pupilOffsetForward + py_perp * pupilOffsetSide1;
              const pupil2X = eye2X + mdx * pupilOffsetForward + px_perp * pupilOffsetSide2;
              const pupil2Y = eye2Y + mdy * pupilOffsetForward + py_perp * pupilOffsetSide2;
              
              this.ctx.beginPath(); 
              this.ctx.arc(pupil1X, pupil1Y, currentPupilSize, 0, Math.PI*2); 
              this.ctx.fill();
              
              this.ctx.beginPath(); 
              this.ctx.arc(pupil2X, pupil2Y, currentPupilSize, 0, Math.PI*2); 
              this.ctx.fill();
          } else {
              // Draw Patterns
              if (skin.pattern === 'striped') {
                  this.ctx.fillStyle = skin.bodyColors[1] || 'rgba(0,0,0,0.2)';
                  if (i % 2 === 0) {
                      this.ctx.beginPath();
                      this.ctx.arc(px, py, this.cellSize * 0.25, 0, Math.PI * 2);
                      this.ctx.fill();
                  }
              } else if (skin.pattern === 'scaled') {
                  this.ctx.fillStyle = skin.bodyColors[1] || 'rgba(255,255,255,0.2)';
                  this.ctx.beginPath();
                  this.ctx.moveTo(px, py - this.cellSize*0.25);
                  this.ctx.lineTo(px + this.cellSize*0.25, py);
                  this.ctx.lineTo(px, py + this.cellSize*0.25);
                  this.ctx.lineTo(px - this.cellSize*0.25, py);
                  this.ctx.fill();
              } else if (skin.pattern === 'gradient') {
                  this.ctx.fillStyle = skin.bodyColors[i % skin.bodyColors.length];
                  this.ctx.beginPath();
                  this.ctx.arc(px, py, this.cellSize * 0.35, 0, Math.PI * 2);
                  this.ctx.fill();
              }
          }
      }
    }

    if (settings.screenShake && state.gameOver) {
      this.ctx.restore();
    }
  }
}
