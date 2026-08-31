import * as THREE from 'three';
import { CollisionBox } from './ParkWorld';
import { InputState } from '../input/InputManager';

export class PhysicsSimulation {
  public position = new THREE.Vector3(0, 0, 8);
  public velocity = new THREE.Vector3(0, 0, 0);

  public isGrounded = true;
  public speed = 0;
  public facingAngle = 0;

  private readonly playerRadius = 0.42;
  private readonly playerHeight = 1.85;

  private readonly walkSpeed = 6.2;
  private readonly sprintSpeed = 10.2;
  private readonly acceleration = 45.0;
  private readonly deceleration = 32.0;
  private readonly jumpVelocity = 8.6;
  private readonly gravity = 22.0;

  constructor(spawnX = 0, spawnY = 0, spawnZ = 8) {
    this.position.set(spawnX, spawnY, spawnZ);
  }

  public update(input: InputState, cameraYaw: number, collisionBoxes: CollisionBox[], dt: number) {
    // 1. Calculate camera-relative desired movement direction
    // In Roblox/3D games, +Z input is backward, -Z is forward, +X is right, -X is left
    let moveDirX = 0;
    let moveDirZ = 0;

    const inputLen = Math.hypot(input.moveX, input.moveZ);
    if (inputLen > 0.01) {
      const normX = input.moveX / Math.max(1, inputLen);
      const normZ = input.moveZ / Math.max(1, inputLen);

      // Rotate input by camera yaw angle
      const sinY = Math.sin(cameraYaw);
      const cosY = Math.cos(cameraYaw);

      moveDirX = normX * cosY + normZ * sinY;
      moveDirZ = -normX * sinY + normZ * cosY;

      // Update facing angle when moving
      this.facingAngle = Math.atan2(moveDirX, moveDirZ);
    }

    // 2. Horizontal Acceleration / Deceleration
    const targetMaxSpeed = input.isSprinting ? this.sprintSpeed : this.walkSpeed;
    const targetVx = moveDirX * targetMaxSpeed * inputLen;
    const targetVz = moveDirZ * targetMaxSpeed * inputLen;

    const accel = inputLen > 0.05 ? this.acceleration : this.deceleration;
    this.velocity.x += (targetVx - this.velocity.x) * Math.min(1, accel * dt);
    this.velocity.z += (targetVz - this.velocity.z) * Math.min(1, accel * dt);

    // 3. Jump and Gravity
    if (this.isGrounded && input.isJumping) {
      this.velocity.y = this.jumpVelocity;
      this.isGrounded = false;
    }

    if (!this.isGrounded) {
      this.velocity.y -= this.gravity * dt;
    }

    // 4. Proposed New Position
    let nextX = this.position.x + this.velocity.x * dt;
    let nextY = this.position.y + this.velocity.y * dt;
    let nextZ = this.position.z + this.velocity.z * dt;

    // 5. Collision with Ground (y = 0)
    let groundHeight = 0;
    this.isGrounded = false;

    // Check platform tops for vertical landing
    for (const box of collisionBoxes) {
      const isAboveBoxHorizontally =
        nextX + this.playerRadius > box.min.x &&
        nextX - this.playerRadius < box.max.x &&
        nextZ + this.playerRadius > box.min.z &&
        nextZ - this.playerRadius < box.max.z;

      if (isAboveBoxHorizontally) {
        // Landing on top of obstacle
        if (this.position.y >= box.max.y - 0.25 && nextY <= box.max.y) {
          if (box.max.y > groundHeight) {
            groundHeight = box.max.y;
          }
        }
      }
    }

    if (nextY <= groundHeight) {
      nextY = groundHeight;
      this.velocity.y = 0;
      this.isGrounded = true;
    }

    // 6. Horizontal Collision Resolution (AABB Sliding)
    for (const box of collisionBoxes) {
      // Check if vertical ranges overlap
      const playerTop = nextY + this.playerHeight;
      const playerBottom = nextY;
      const overlapY = playerBottom < box.max.y && playerTop > box.min.y;

      if (!overlapY) continue;

      // Check collision in X axis
      const overlapX =
        nextX + this.playerRadius > box.min.x &&
        nextX - this.playerRadius < box.max.x;
      const overlapZ =
        nextZ + this.playerRadius > box.min.z &&
        nextZ - this.playerRadius < box.max.z;

      if (overlapX && overlapZ) {
        // Push out on the shallowest penetration axis
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

    // 7. Commit Position
    this.position.set(nextX, nextY, nextZ);
    this.speed = Math.hypot(this.velocity.x, this.velocity.z);
  }

  public reset(spawnX = 0, spawnY = 0, spawnZ = 8) {
    this.position.set(spawnX, spawnY, spawnZ);
    this.velocity.set(0, 0, 0);
    this.isGrounded = true;
    this.speed = 0;
    this.facingAngle = 0;
  }
}
