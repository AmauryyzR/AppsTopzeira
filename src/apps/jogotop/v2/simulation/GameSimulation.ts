import {
  Collider,
  GameplayInput,
  PlayerSnapshot,
  WorldDefinitionData,
} from '../types';

export const MAX_SPEED = 5.6;
export const PLAYER_RADIUS = 0.45;
export const JUMP_SPEED = 9.0;
export const G_RISE_HOLD = 20;
export const G_RISE_CUT = 46;
export const G_FALL = 28;

export interface SimulationEvent {
  type: 'jump' | 'land' | 'dust';
  x: number;
  z: number;
  impact?: number;
}

export class GameSimulation {
  public x: number;
  public y: number;
  public z: number;
  public vx = 0;
  public vy = 0;
  public vz = 0;
  public yaw: number;
  public grounded = true;
  public speedRatio = 0;
  public animationTime = 0;
  public isSitting = false;

  private desiredVx = 0;
  private desiredVz = 0;
  private previousSnapshot: PlayerSnapshot;
  private currentSnapshot: PlayerSnapshot;
  private pendingEvents: SimulationEvent[] = [];

  readonly bounds: number;
  readonly colliders: Collider[];
  readonly bridge: { x: number; z: number; radius: number };

  constructor(world: WorldDefinitionData) {
    this.bounds = world.bounds;
    this.colliders = world.colliders;
    this.bridge = world.bridge;

    this.x = world.spawnPosition[0];
    this.y = world.spawnPosition[1];
    this.z = world.spawnPosition[2];
    this.yaw = world.spawnYaw;

    const initialSnap: PlayerSnapshot = {
      position: [this.x, this.y, this.z],
      yaw: this.yaw,
      verticalVelocity: this.vy,
      grounded: this.grounded,
      speedRatio: 0,
      animationTime: 0,
      isSitting: false,
    };

    this.previousSnapshot = { ...initialSnap, position: [...initialSnap.position] };
    this.currentSnapshot = { ...initialSnap, position: [...initialSnap.position] };
  }

  public isOverBridge(x: number, z: number): boolean {
    return Math.hypot(x - this.bridge.x, z - this.bridge.z) < this.bridge.radius;
  }

  public step(dt: number, input: GameplayInput, cameraYaw: number) {
    // 1. Save previous state for interpolation
    this.previousSnapshot = {
      position: [this.x, this.y, this.z],
      yaw: this.yaw,
      verticalVelocity: this.vy,
      grounded: this.grounded,
      speedRatio: this.speedRatio,
      animationTime: this.animationTime,
      isSitting: this.isSitting,
    };

    this.animationTime += dt;

    // 2. Compute camera-relative movement
    const cy = Math.cos(cameraYaw);
    const sy = Math.sin(cameraYaw);
    const wx = input.moveX * cy + input.moveZ * sy;
    const wz = -input.moveX * sy + input.moveZ * cy;

    this.desiredVx = wx * MAX_SPEED;
    this.desiredVz = wz * MAX_SPEED;

    // 3. Exponential acceleration lerp
    const accelK = 1 - Math.exp(-dt * 12);
    this.vx += (this.desiredVx - this.vx) * accelK;
    this.vz += (this.desiredVz - this.vz) * accelK;

    const horizSpeedSq = this.vx * this.vx + this.vz * this.vz;
    if (horizSpeedSq < 0.0004) {
      this.vx = 0;
      this.vz = 0;
    }

    const horizSpeed = Math.sqrt(this.vx * this.vx + this.vz * this.vz);
    this.speedRatio = Math.min(1, horizSpeed / MAX_SPEED);

    // 4. Update horizontal position
    this.x += this.vx * dt;
    this.z += this.vz * dt;

    // 5. Jump & Gravity
    if (this.grounded && input.jumpPressed) {
      this.vy = JUMP_SPEED;
      this.grounded = false;
      this.pendingEvents.push({ type: 'jump', x: this.x, z: this.z });
    }

    if (!this.grounded) {
      const g = this.vy > 0 ? (input.jumpHeld ? G_RISE_HOLD : G_RISE_CUT) : G_FALL;
      this.vy -= g * dt;
      this.y += this.vy * dt;

      if (this.y <= 0) {
        const impact = Math.min(1, Math.abs(this.vy) / 11);
        this.y = 0;
        this.vy = 0;
        this.grounded = true;
        this.pendingEvents.push({ type: 'land', x: this.x, z: this.z, impact });
      }
    }

    // 6. Perimeter boundary clamp
    const r = Math.hypot(this.x, this.z);
    if (r > this.bounds) {
      this.x = (this.x * this.bounds) / r;
      this.z = (this.z * this.bounds) / r;
    }

    // 7. Circle-circle collisions
    for (const c of this.colliders) {
      // If it's a large collider (like the pond) and we are on the bridge, skip
      if (c.r > 5 && this.isOverBridge(this.x, this.z)) {
        continue;
      }
      const dx = this.x - c.x;
      const dz = this.z - c.z;
      const d = Math.hypot(dx, dz);
      const minDist = c.r + PLAYER_RADIUS;
      if (d < minDist && d > 0.0001) {
        this.x = c.x + (dx / d) * minDist;
        this.z = c.z + (dz / d) * minDist;
      }
    }

    // 8. Turn character smoothly towards movement direction
    if (this.speedRatio > 0.06) {
      const targetYaw = Math.atan2(this.vx, this.vz);
      let diff = targetYaw - this.yaw;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      this.yaw += diff * (1 - Math.exp(-dt * 14));
    }

    // 9. Store current state snapshot
    this.currentSnapshot = {
      position: [this.x, this.y, this.z],
      yaw: this.yaw,
      verticalVelocity: this.vy,
      grounded: this.grounded,
      speedRatio: this.speedRatio,
      animationTime: this.animationTime,
      isSitting: this.isSitting,
    };
  }

  public getSnapshots(): { previous: PlayerSnapshot; current: PlayerSnapshot } {
    return {
      previous: this.previousSnapshot,
      current: this.currentSnapshot,
    };
  }

  public consumeEvents(): SimulationEvent[] {
    const ev = this.pendingEvents;
    this.pendingEvents = [];
    return ev;
  }

  public setSitting(sitting: boolean) {
    this.isSitting = sitting;
  }
}
