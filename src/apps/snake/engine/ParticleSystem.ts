export type ParticleType = 
  | 'sparkle' 
  | 'fire' 
  | 'digital' 
  | 'smoke' 
  | 'bubble' 
  | 'ice' 
  | 'ghost' 
  | 'rainbow' 
  | 'leaf' 
  | 'gold' 
  | 'plasma' 
  | 'circle';

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  type: ParticleType;
  rotation: number;
  vr: number;
}

export class ParticleSystem {
  public particles: Particle[] = [];
  private readonly maxParticles = 280;

  public emit(
    x: number, 
    y: number, 
    color: string, 
    count: number, 
    speedMultiplier: number = 1, 
    type: ParticleType = 'circle'
  ) {
    const available = Math.max(0, this.maxParticles - this.particles.length);
    for (let i = 0; i < Math.min(count, available); i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (Math.random() * 3 + 1) * speedMultiplier;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        maxLife: 0.8 + Math.random() * 0.4,
        color,
        size: Math.random() * 6 + 3,
        type,
        rotation: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.2
      });
    }
  }

  public emitTrail(x: number, y: number, type: Exclude<ParticleType, 'circle'>, color: string) {
    if (this.particles.length >= this.maxParticles) return;
    const angle = Math.random() * Math.PI * 2;
    let speed = Math.random() * 0.15;
    let life = 0.3 + Math.random() * 0.15;
    let size = Math.random() * 4 + 4;
    let colorOut = color;
    let vr = (Math.random() - 0.5) * 0.2;
    
    if (type === 'fire') {
      speed = Math.random() * 0.35;
      life = 0.15 + Math.random() * 0.2;
      size = Math.random() * 8 + 4;
      if (Math.random() > 0.6) colorOut = '#ef4444';
      else if (Math.random() > 0.3) colorOut = '#f97316';
      else colorOut = '#facc15';
      vr = (Math.random() - 0.5) * 0.5;
    } else if (type === 'smoke') {
      speed = Math.random() * 0.15;
      life = 0.4 + Math.random() * 0.25;
      size = Math.random() * 12 + 6;
      vr = (Math.random() - 0.5) * 0.1;
    } else if (type === 'digital') {
      speed = 0;
      life = 0.1 + Math.random() * 0.1;
      size = Math.random() * 6 + 3;
      vr = 0;
    } else if (type === 'leaf') {
      speed = Math.random() * 0.08 + 0.03;
      life = 0.4 + Math.random() * 0.2;
      size = Math.random() * 6 + 4;
      const leafGreens = ['#22c55e', '#16a34a', '#15803d', '#86efac', '#4ade80'];
      colorOut = leafGreens[Math.floor(Math.random() * leafGreens.length)];
      vr = (Math.random() - 0.5) * 0.15;
    } else if (type === 'bubble') {
      speed = 0; // custom vx/vy applied below
      life = 0.3 + Math.random() * 0.25;
      size = Math.random() * 7 + 4;
      const sludgeGreens = ['#84cc16', '#65a30d', '#a3e635', '#22c55e'];
      colorOut = sludgeGreens[Math.floor(Math.random() * sludgeGreens.length)];
      vr = (Math.random() - 0.5) * 0.1;
    } else if (type === 'ice') {
      speed = Math.random() * 0.15 + 0.03;
      life = 0.3 + Math.random() * 0.15;
      size = Math.random() * 8 + 4;
      const iceCyans = ['#06b6d4', '#0891b2', '#67e8f9', '#e0f7fa', '#ffffff'];
      colorOut = iceCyans[Math.floor(Math.random() * iceCyans.length)];
      vr = (Math.random() - 0.5) * 0.2;
    } else if (type === 'gold') {
      speed = Math.random() * 0.18 + 0.05;
      life = 0.25 + Math.random() * 0.15;
      size = Math.random() * 6 + 3;
      if (Math.random() > 0.4) colorOut = '#eab308';
      else if (Math.random() > 0.1) colorOut = '#fde047';
      else colorOut = '#ffffff';
      vr = (Math.random() - 0.5) * 0.4;
    } else if (type === 'ghost') {
      speed = Math.random() * 0.12 + 0.03;
      life = 0.35 + Math.random() * 0.2;
      size = Math.random() * 10 + 6;
      const ghostPurples = ['#a855f7', '#9333ea', '#7e22ce', '#c084fc', '#e9d5ff'];
      colorOut = ghostPurples[Math.floor(Math.random() * ghostPurples.length)];
      vr = (Math.random() - 0.5) * 0.05;
    } else if (type === 'rainbow') {
      speed = Math.random() * 0.18 + 0.05;
      life = 0.25 + Math.random() * 0.15;
      size = Math.random() * 7 + 3;
      const hue = Math.floor(Math.random() * 360);
      colorOut = `hsl(${hue}, 100%, 60%)`;
      vr = (Math.random() - 0.5) * 0.3;
    } else if (type === 'plasma') {
      speed = Math.random() * 0.4 + 0.1;
      life = 0.1 + Math.random() * 0.1;
      size = Math.random() * 8 + 4;
      if (Math.random() > 0.5) colorOut = color;
      else colorOut = '#ffffff';
      vr = (Math.random() - 0.5) * 0.8;
    }
    
    let vx = Math.cos(angle) * speed;
    let vy = Math.sin(angle) * speed;
    
    if (type === 'bubble') {
      vx = (Math.random() - 0.5) * 0.1;
      vy = -Math.random() * 0.2 - 0.05;
    } else if (type === 'leaf') {
      vx = Math.cos(angle) * speed + (Math.random() - 0.5) * 0.05;
      vy = Math.random() * 0.15 + 0.05;
    }
    
    this.particles.push({
      x,
      y,
      vx,
      vy,
      life,
      maxLife: life,
      color: colorOut,
      size,
      type,
      rotation: Math.random() * Math.PI * 2,
      vr
    });
  }

  public update(dt: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * (dt * 60); // normalize speed to 60fps
      p.y += p.vy * (dt * 60);
      p.life -= dt;
      p.rotation += p.vr * (dt * 60);
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  public draw(ctx: CanvasRenderingContext2D, cellSize: number) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const p of this.particles) {
      const alpha = Math.max(0, p.life / p.maxLife);
      const px = (p.x + 0.5) * cellSize;
      const py = (p.y + 0.5) * cellSize;
      const drawSize = p.size * alpha;

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;

      if (p.type === 'sparkle') {
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, drawSize);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.2, p.color);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(0, -drawSize);
        ctx.quadraticCurveTo(drawSize/4, -drawSize/4, drawSize, 0);
        ctx.quadraticCurveTo(drawSize/4, drawSize/4, 0, drawSize);
        ctx.quadraticCurveTo(-drawSize/4, drawSize/4, -drawSize, 0);
        ctx.quadraticCurveTo(-drawSize/4, -drawSize/4, 0, -drawSize);
        ctx.fill();
      } else if (p.type === 'fire') {
        const grad = ctx.createRadialGradient(0, drawSize/2, 0, 0, drawSize/2, drawSize);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.3, '#facc15');
        grad.addColorStop(0.6, '#f97316');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(0, -drawSize * 1.2);
        ctx.quadraticCurveTo(drawSize, -drawSize * 0.2, drawSize * 0.8, drawSize * 0.5);
        ctx.quadraticCurveTo(drawSize * 0.4, drawSize, 0, drawSize * 0.8);
        ctx.quadraticCurveTo(-drawSize * 0.4, drawSize, -drawSize * 0.8, drawSize * 0.5);
        ctx.quadraticCurveTo(-drawSize, -drawSize * 0.2, 0, -drawSize * 1.2);
        ctx.fill();
      } else if (p.type === 'digital') {
        // High performance outer glow using alpha fill
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha * 0.35;
        ctx.fillRect(-drawSize * 0.75, -drawSize * 0.75, drawSize * 1.5, drawSize * 1.5);
        
        ctx.globalAlpha = alpha;
        ctx.fillRect(-drawSize/2, -drawSize/2, drawSize, drawSize);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(-drawSize/2, -drawSize/2, drawSize, drawSize);
      } else if (p.type === 'smoke') {
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, drawSize);
        grad.addColorStop(0, p.color);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, drawSize, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'bubble') {
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1.5;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.beginPath();
        ctx.arc(0, 0, drawSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(-drawSize * 0.35, -drawSize * 0.35, drawSize * 0.2, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'ice') {
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.moveTo(-drawSize, 0);
          ctx.lineTo(drawSize, 0);
          ctx.stroke();
          
          ctx.beginPath();
          ctx.moveTo(-drawSize * 0.6, -drawSize * 0.15);
          ctx.lineTo(-drawSize * 0.4, 0);
          ctx.lineTo(-drawSize * 0.6, drawSize * 0.15);
          ctx.moveTo(drawSize * 0.6, -drawSize * 0.15);
          ctx.lineTo(drawSize * 0.4, 0);
          ctx.lineTo(drawSize * 0.6, drawSize * 0.15);
          ctx.stroke();
          
          ctx.rotate(Math.PI / 3);
        }
      } else if (p.type === 'ghost') {
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, drawSize);
        grad.addColorStop(0, p.color);
        grad.addColorStop(0.5, 'rgba(168, 85, 247, 0.2)');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, drawSize * 1.5, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'rainbow') {
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, drawSize);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.4, p.color);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(0, -drawSize);
        ctx.quadraticCurveTo(0, 0, drawSize, 0);
        ctx.quadraticCurveTo(0, 0, 0, drawSize);
        ctx.quadraticCurveTo(0, 0, -drawSize, 0);
        ctx.quadraticCurveTo(0, 0, 0, -drawSize);
        ctx.fill();
      } else if (p.type === 'leaf') {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.moveTo(-drawSize, 0);
        ctx.quadraticCurveTo(0, -drawSize * 0.4, drawSize, 0);
        ctx.quadraticCurveTo(0, drawSize * 0.4, -drawSize, 0);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-drawSize, 0);
        ctx.lineTo(drawSize, 0);
        ctx.stroke();
      } else if (p.type === 'gold') {
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, drawSize);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.3, '#fde047');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(0, -drawSize);
        ctx.quadraticCurveTo(0, 0, drawSize, 0);
        ctx.quadraticCurveTo(0, 0, 0, drawSize);
        ctx.quadraticCurveTo(0, 0, -drawSize, 0);
        ctx.quadraticCurveTo(0, 0, 0, -drawSize);
        ctx.fill();
      } else if (p.type === 'plasma') {
        // High performance glowing concentric rings instead of slow shadowBlur
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 4.0;
        ctx.globalAlpha = alpha * 0.3;
        ctx.beginPath();
        ctx.arc(0, 0, drawSize * 1.1, 0, Math.PI * 2);
        ctx.stroke();

        ctx.lineWidth = 1.5;
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, drawSize * 1.1, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, drawSize);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.4, p.color);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, drawSize, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    ctx.restore();
  }
}
