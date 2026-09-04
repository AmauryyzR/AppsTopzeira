import * as THREE from 'three';
import { CollisionBox } from './ParkWorld';
import { InputState } from '../input/InputManager';

export class PhysicsSimulation {
  public position = new THREE.Vector3(0, 0, 8);
  public velocity = new THREE.Vector3(0, 0, 0);

  public isGrounded = true;
  public speed = 0;
  public facingAngle = 0;
  public turnRate = 0;

  // Jump & Impact Physics Signals
  public jumpSquash = 0; // Elastic deformation factor (0 = neutral, >0 = squashed, <0 = stretched)
  public verticalVelocity = 0;

  private readonly playerRadius = 0.42;
  private readonly playerHeight = 1.85;

  // Snappy Gravitational Physics (Fast Responsive Fall)
  // Rise gravity: 24.0 m/s^2 | Fall gravity: 48.0 m/s^2 (2x descent acceleration for crisp, weighty landing)
  private readonly riseGravity = 24.0;
  private readonly fallGravity = 48.0;
  private readonly baseJumpImpulse = 11.2;
  private readonly terminalVelocity = -36.0;

  // Horizontal Kinematics
  private readonly walkSpeed = 6.4;
  private readonly sprintSpeed = 14.2;
  private readonly dashBurstSpeed = 16.5;
  private readonly groundAcceleration = 56.0;
  private readonly groundDeceleration = 34.0;
  private readonly airAcceleration = 18.0;
  private readonly airDeceleration = 8.0;

  // AAA Jump Enhancements
  private coyoteTimer = 0; // Allowed jump window after leaving ground (s)
  private readonly coyoteTimeDuration = 0.14;

  private jumpBufferTimer = 0; // Pre-landing jump command buffer (s)
  private readonly jumpBufferDuration = 0.16;

  private wasGroundedLastFrame = true;
  private prevFacingAngle = 0;

  constructor(spawnX = 0, spawnY = 0, spawnZ = 8) {
    this.position.set(spawnX, spawnY, spawnZ);
  }

  public update(input: InputState, cameraYaw: number, collisionBoxes: CollisionBox[], dt: number) {
    // 1. Update Timers for Coyote Time and Jump Buffering
    if (this.isGrounded) {
      this.coyoteTimer = this.coyoteTimeDuration;
    } else {
      this.coyoteTimer = Math.max(0, this.coyoteTimer - dt);
    }

    if (input.isJumping) {
      this.jumpBufferTimer = this.jumpBufferDuration;
    } else {
      this.jumpBufferTimer = Math.max(0, this.jumpBufferTimer - dt);
    }

    // 2. Camera-Relative Desired Horizontal Direction
    let moveDirX = 0;
    let moveDirZ = 0;
    const inputLen = Math.hypot(input.moveX, input.moveZ);

    if (inputLen > 0.01) {
      const normX = input.moveX / Math.max(1, inputLen);
      const normZ = input.moveZ / Math.max(1, inputLen);

      const sinY = Math.sin(cameraYaw);
      const cosY = Math.cos(cameraYaw);

      moveDirX = normX * cosY + normZ * sinY;
      moveDirZ = -normX * sinY + normZ * cosY;

      const targetFacing = Math.atan2(moveDirX, moveDirZ);
      let angleDiff = targetFacing - this.facingAngle;
      while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
      while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

      // Smooth angular turning with bounded max angular velocity (Genshin / BotW style)
      const maxAngularSpeed = 12.0; // rad/s (~680 deg/s max turn speed)
      const angularStep = THREE.MathUtils.clamp(
        angleDiff * (1 - Math.exp(-14 * dt)),
        -maxAngularSpeed * dt,
        maxAngularSpeed * dt
      );

      this.facingAngle += angularStep;
      while (this.facingAngle > Math.PI) this.facingAngle -= 2 * Math.PI;
      while (this.facingAngle < -Math.PI) this.facingAngle += 2 * Math.PI;

      this.turnRate = angularStep / Math.max(0.0001, dt);
      this.prevFacingAngle = this.facingAngle;
    } else {
      this.turnRate *= Math.max(0, 1 - 10 * dt);
    }

    // 3. Horizontal Acceleration & Air Resistance
    if (input.isDashTriggered) {
      if (inputLen > 0.05) {
        this.velocity.x = moveDirX * this.dashBurstSpeed;
        this.velocity.z = moveDirZ * this.dashBurstSpeed;
      } else {
        const facingX = Math.sin(this.facingAngle);
        const facingZ = Math.cos(this.facingAngle);
        this.velocity.x = facingX * this.dashBurstSpeed;
        this.velocity.z = facingZ * this.dashBurstSpeed;
      }
    }

    const targetMaxSpeed = input.isSprinting ? this.sprintSpeed : this.walkSpeed;
    const targetVx = moveDirX * targetMaxSpeed * inputLen;
    const targetVz = moveDirZ * targetMaxSpeed * inputLen;

    const currentAccel = this.isGrounded
      ? (inputLen > 0.05 ? this.groundAcceleration : this.groundDeceleration)
      : (inputLen > 0.05 ? this.airAcceleration : this.airDeceleration);

    this.velocity.x += (targetVx - this.velocity.x) * Math.min(1, currentAccel * dt);
    this.velocity.z += (targetVz - this.velocity.z) * Math.min(1, currentAccel * dt);

    // 4. Jump Impulse Execution (Coyote Time + Jump Buffer)
    const canJump = (this.isGrounded || this.coyoteTimer > 0);
    const wantsJump = (this.jumpBufferTimer > 0);

    if (canJump && wantsJump) {
      // Newton impulse: apply upward velocity v0
      this.velocity.y = this.baseJumpImpulse;
      this.isGrounded = false;
      this.coyoteTimer = 0;
      this.jumpBufferTimer = 0;
      // Take-off stretch signal
      this.jumpSquash = -0.22;
    }

    // 5. Gravitational Physics (Natural rise, fast & snappy fall)
    if (!this.isGrounded) {
      const currentGravity = this.velocity.y > 0 ? this.riseGravity : this.fallGravity;
      this.velocity.y -= currentGravity * dt;

      // Terminal fall velocity clamp
      if (this.velocity.y < this.terminalVelocity) {
        this.velocity.y = this.terminalVelocity;
      }
    }

    // 6. Proposed New Position (Semi-implicit Euler integration)
    let nextX = this.position.x + this.velocity.x * dt;
    let nextY = this.position.y + this.velocity.y * dt;
    let nextZ = this.position.z + this.velocity.z * dt;

    // 7. Ground and Platform Vertical Collisions
    let groundHeight = 0;
    let isLandingThisFrame = false;
    let preCollisionVy = this.velocity.y;

    // Check platform tops for vertical landing
    for (const box of collisionBoxes) {
      const isAboveBoxHorizontally =
        nextX + this.playerRadius > box.min.x &&
        nextX - this.playerRadius < box.max.x &&
        nextZ + this.playerRadius > box.min.z &&
        nextZ - this.playerRadius < box.max.z;

      if (isAboveBoxHorizontally) {
        if (this.position.y >= box.max.y - 0.28 && nextY <= box.max.y) {
          if (box.max.y > groundHeight) {
            groundHeight = box.max.y;
          }
        }
      }
    }

    // Touchdown resolution
    if (nextY <= groundHeight) {
      nextY = groundHeight;

      if (!this.wasGroundedLastFrame && preCollisionVy < -1.5) {
        // Impact landing squash proportional to impact velocity (snappy cartoon impulse)
        const impactSpeed = Math.abs(preCollisionVy);
        this.jumpSquash = Math.min(0.28, impactSpeed * 0.022);
        isLandingThisFrame = true;
      }

      this.velocity.y = 0;
      this.isGrounded = true;
    } else {
      this.isGrounded = false;
    }

    // 8. Horizontal Collision Resolution (AABB Sliding)
    for (const box of collisionBoxes) {
      const playerTop = nextY + this.playerHeight;
      const playerBottom = nextY;
      const overlapY = playerBottom < box.max.y && playerTop > box.min.y;

      if (!overlapY) continue;

      const overlapX =
        nextX + this.playerRadius > box.min.x &&
        nextX - this.playerRadius < box.max.x;
      const overlapZ =
        nextZ + this.playerRadius > box.min.z &&
        nextZ - this.playerRadius < box.max.z;

      if (overlapX && overlapZ) {
        const penLeft = (nextX + this.playerRadius) - box.min.x;
        const penRight = box.max.x - (nextX - this.playerRadius);
        const penFront = (nextZ + this.playerRadius) - box.min.z;
        const penBack = box.max.z - (nextZ - this.playerRadius);

        const minPen = Math.min(penLeft, penRight, penFront, penBack);

        if (minPen === penLeft) {
          nextX = box.min.x - this.playerRadius;
          if (this.velocity.x > 0) this.velocity.x = 0;
        } else if (minPen === penRight) {
          nextX = box.max.x + this.playerRadius;
          if (this.velocity.x < 0) this.velocity.x = 0;
        } else if (minPen === penFront) {
          nextZ = box.min.z - this.playerRadius;
          if (this.velocity.z > 0) this.velocity.z = 0;
        } else if (minPen === penBack) {
          nextZ = box.max.z + this.playerRadius;
          if (this.velocity.z < 0) this.velocity.z = 0;
        }
      }
    }

    // 9. Commit Position & Signals
    this.position.set(nextX, nextY, nextZ);
    this.speed = Math.hypot(this.velocity.x, this.velocity.z);
    this.verticalVelocity = this.velocity.y;
    this.wasGroundedLastFrame = this.isGrounded;

    // 10. Elastic recovery of squash/stretch (Snappy responsive recovery)
    this.jumpSquash *= Math.max(0, 1 - 16 * dt);
  }

  public reset(spawnX = 0, spawnY = 0, spawnZ = 8) {
    this.position.set(spawnX, spawnY, spawnZ);
    this.velocity.set(0, 0, 0);
    this.isGrounded = true;
    this.speed = 0;
    this.facingAngle = 0;
    this.turnRate = 0;
    this.jumpSquash = 0;
    this.verticalVelocity = 0;
    this.coyoteTimer = 0;
    this.jumpBufferTimer = 0;
  }
}
