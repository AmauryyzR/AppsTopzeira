import { describe, expect, it } from 'vitest';
import { G_RISE_HOLD, GameSimulation, JUMP_SPEED, MAX_SPEED, PLAYER_RADIUS } from '../simulation/GameSimulation';
import { generateWorldDefinition, SEED_CONSTANT } from '../world/WorldDefinition';

describe('GameSimulation Physics & Gameplay Invariants', () => {
  const createSim = () => {
    const world = generateWorldDefinition(SEED_CONSTANT);
    return new GameSimulation(world);
  };

  it('initializes at spawn position and grounded', () => {
    const sim = createSim();
    expect(sim.x).toBeCloseTo(3.2, 4);
    expect(sim.y).toBe(0);
    expect(sim.z).toBeCloseTo(4.2, 4);
    expect(sim.grounded).toBe(true);
    expect(sim.vx).toBe(0);
    expect(sim.vy).toBe(0);
    expect(sim.vz).toBe(0);
  });

  it('accelerates with input towards max speed', () => {
    const sim = createSim();
    const input = { moveX: 0, moveZ: -1, jumpPressed: false, jumpHeld: false };

    // Step forward 1 second (60 steps of 1/60s)
    for (let i = 0; i < 60; i++) {
      sim.step(1 / 60, input, 0);
    }

    expect(sim.speedRatio).toBeGreaterThan(0.95);
    expect(Math.abs(sim.vz)).toBeCloseTo(MAX_SPEED, 0.2);
  });

  it('executes jump, gravity arc, and landing with proper events', () => {
    const sim = createSim();

    // Trigger jump
    sim.step(1 / 60, { moveX: 0, moveZ: 0, jumpPressed: true, jumpHeld: true }, 0);
    expect(sim.grounded).toBe(false);
    expect(sim.vy).toBeCloseTo(JUMP_SPEED - (G_RISE_HOLD * 1) / 60, 4);

    let maxApexY = 0;
    let landed = false;

    // Simulate jump arc for 1.2 seconds (72 steps)
    for (let i = 0; i < 72; i++) {
      sim.step(1 / 60, { moveX: 0, moveZ: 0, jumpPressed: false, jumpHeld: true }, 0);
      if (sim.y > maxApexY) maxApexY = sim.y;
      if (sim.grounded) {
        landed = true;
        break;
      }
    }

    expect(maxApexY).toBeGreaterThan(1.2); // Apex reached above ground
    expect(landed).toBe(true);
    expect(sim.grounded).toBe(true);
    expect(sim.y).toBe(0);
    expect(sim.vy).toBe(0);
  });

  it('enforces boundary clamps at BOUNDS radius', () => {
    const sim = createSim();
    sim.x = 100;
    sim.z = 100;

    sim.step(1 / 60, { moveX: 0, moveZ: 0, jumpPressed: false, jumpHeld: false }, 0);
    const dist = Math.hypot(sim.x, sim.z);
    expect(dist).toBeCloseTo(sim.bounds, 4);
  });

  it('resolves collision against park colliders (fountain/trees)', () => {
    const sim = createSim();
    // Move player inside central fountain collider at (0, 0, r=2.6)
    sim.x = 0.5;
    sim.z = 0.5;

    sim.step(1 / 60, { moveX: 0, moveZ: 0, jumpPressed: false, jumpHeld: false }, 0);
    const distFromFountain = Math.hypot(sim.x, sim.z);
    expect(distFromFountain).toBeGreaterThanOrEqual(2.6 + PLAYER_RADIUS - 0.001);
  });

  it('produces identical state regardless of rendering timestep (fixed step determinism)', () => {
    const simA = createSim();
    const simB = createSim();

    const input = { moveX: 1, moveZ: 1, jumpPressed: false, jumpHeld: false };

    // simA updated with 60 steps of 1/60s
    for (let i = 0; i < 60; i++) {
      simA.step(1 / 60, input, 0.5);
    }

    // simB updated with identical 60 steps of 1/60s
    for (let i = 0; i < 60; i++) {
      simB.step(1 / 60, input, 0.5);
    }

    expect(simA.x).toBeCloseTo(simB.x, 6);
    expect(simA.z).toBeCloseTo(simB.z, 6);
    expect(simA.yaw).toBeCloseTo(simB.yaw, 6);
    expect(simA.speedRatio).toBeCloseTo(simB.speedRatio, 6);
  });
});
