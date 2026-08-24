import * as THREE from 'three';
import { MaterialPalette } from './MaterialPalette';
import { ResourceRegistry } from './ResourceRegistry';

interface DustParticle {
  mesh: THREE.Mesh;
  life: number;
  maxLife: number;
  vx: number;
  vy: number;
  vz: number;
  baseScale: number;
}

export class EffectsView {
  public readonly group = new THREE.Group();
  private pool: DustParticle[] = [];
  private poolSize = 24;

  constructor(palette: MaterialPalette, registry: ResourceRegistry, poolSize = 24) {
    this.poolSize = poolSize;
    const geo = registry.trackGeometry(new THREE.DodecahedronGeometry(0.12, 0));

    for (let i = 0; i < this.poolSize; i++) {
      const mesh = new THREE.Mesh(geo, palette.dust);
      mesh.visible = false;
      mesh.matrixAutoUpdate = true;
      this.group.add(mesh);

      this.pool.push({
        mesh,
        life: 0,
        maxLife: 1,
        vx: 0,
        vy: 0,
        vz: 0,
        baseScale: 0.12,
      });
    }
  }

  public spawn(x: number, z: number, count = 1) {
    for (let i = 0; i < count; i++) {
      const p = this.pool.find((e) => e.life <= 0);
      if (!p) return;

      p.life = 0.35 + Math.random() * 0.2;
      p.maxLife = p.life;
      p.vx = (Math.random() - 0.5) * 0.7;
      p.vy = 0.6 + Math.random() * 0.6;
      p.vz = (Math.random() - 0.5) * 0.7;
      p.baseScale = 0.28 + Math.random() * 0.12;

      p.mesh.position.set(x + (Math.random() - 0.5) * 0.3, 0.12, z + (Math.random() - 0.5) * 0.3);
      p.mesh.scale.setScalar(p.baseScale);
      p.mesh.visible = true;
    }
  }

  public update(dt: number) {
    for (const p of this.pool) {
      if (p.life <= 0) continue;
      p.life -= dt;

      if (p.life <= 0) {
        p.mesh.visible = false;
        continue;
      }

      p.mesh.position.x += p.vx * dt;
      p.mesh.position.y += p.vy * dt;
      p.mesh.position.z += p.vz * dt;

      // Scale down to 0 over lifetime instead of using opacity/alpha shaders
      const progress = p.life / p.maxLife; // 1 down to 0
      const currentScale = p.baseScale * progress;
      p.mesh.scale.setScalar(currentScale);
    }
  }

  public dispose() {
    for (const p of this.pool) {
      p.mesh.removeFromParent();
    }
    this.pool.length = 0;
  }
}
