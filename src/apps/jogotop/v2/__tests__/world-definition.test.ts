import { describe, expect, it } from 'vitest';
import {
  BOUNDS_RADIUS,
  generateWorldDefinition,
  PLAZA_CENTER,
  POND_CENTER,
  SEED_CONSTANT,
} from '../world/WorldDefinition';

describe('WorldDefinition Determinism & Validation', () => {
  it('generates consistent, deterministic output with the fixed seed', () => {
    const world1 = generateWorldDefinition(SEED_CONSTANT);
    const world2 = generateWorldDefinition(SEED_CONSTANT);

    expect(world1.seed).toBe(SEED_CONSTANT);
    expect(world1.bounds).toBe(BOUNDS_RADIUS);
    expect(world1.trees.length).toBe(world2.trees.length);
    expect(world1.bushes.length).toBe(world2.bushes.length);
    expect(world1.rocks.length).toBe(world2.rocks.length);
    expect(world1.benches.length).toBe(world2.benches.length);
    expect(world1.flowers.length).toBe(world2.flowers.length);
    expect(world1.tufts.length).toBe(world2.tufts.length);
    expect(world1.lamps.length).toBe(world2.lamps.length);
    expect(world1.butterflies.length).toBe(world2.butterflies.length);
    expect(world1.colliders.length).toBe(world2.colliders.length);

    // Verify first 5 trees match exactly
    for (let i = 0; i < Math.min(5, world1.trees.length); i++) {
      expect(world1.trees[i].x).toBeCloseTo(world2.trees[i].x, 6);
      expect(world1.trees[i].z).toBeCloseTo(world2.trees[i].z, 6);
      expect(world1.trees[i].scale).toBeCloseTo(world2.trees[i].scale, 6);
    }
  });

  it('contains zero non-finite numbers in any property or descriptor', () => {
    const world = generateWorldDefinition(SEED_CONSTANT);

    const checkFinite = (val: number, path: string) => {
      expect(Number.isFinite(val), `${path} is not finite (${val})`).toBe(true);
    };

    expect(world.bounds).toBe(53.5);
    expect(world.plaza.x).toBe(PLAZA_CENTER.x);
    expect(world.pond.x).toBe(POND_CENTER.x);

    world.pathPoints.forEach(([x, z], idx) => {
      checkFinite(x, `pathPoints[${idx}].x`);
      checkFinite(z, `pathPoints[${idx}].z`);
    });

    world.colliders.forEach((c, idx) => {
      checkFinite(c.x, `collider[${idx}].x`);
      checkFinite(c.z, `collider[${idx}].z`);
      checkFinite(c.r, `collider[${idx}].r`);
    });

    world.trees.forEach((t, idx) => {
      checkFinite(t.x, `tree[${idx}].x`);
      checkFinite(t.z, `tree[${idx}].z`);
      checkFinite(t.scale, `tree[${idx}].scale`);
      checkFinite(t.yaw, `tree[${idx}].yaw`);
    });

    world.flowers.forEach((f, idx) => {
      checkFinite(f.x, `flower[${idx}].x`);
      checkFinite(f.z, `flower[${idx}].z`);
      checkFinite(f.scale, `flower[${idx}].scale`);
    });
  });

  it('keeps all elements within the world boundaries envelope (radius 140)', () => {
    const world = generateWorldDefinition(SEED_CONSTANT);
    const MAX_VISUAL_RADIUS = 140;

    world.trees.forEach((t) => {
      const dist = Math.hypot(t.x, t.z);
      expect(dist).toBeLessThan(MAX_VISUAL_RADIUS);
    });

    world.flowers.forEach((f) => {
      const dist = Math.hypot(f.x, f.z);
      expect(dist).toBeLessThan(MAX_VISUAL_RADIUS);
    });

    world.colliders.forEach((c) => {
      const dist = Math.hypot(c.x, c.z);
      expect(dist).toBeLessThan(MAX_VISUAL_RADIUS);
    });
  });
});
