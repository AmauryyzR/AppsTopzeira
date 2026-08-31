import * as THREE from 'three';

export class CameraRig {
  public readonly camera: THREE.PerspectiveCamera;

  // Spherical Angles (Roblox Standard)
  public yaw = 0; // Horizontal orbit angle (radians)
  public pitch = 0.28; // Natural 3rd-person eye angle (~16 degrees)
  public distance = 6.5; // Distance from character (meters)

  private targetYaw = 0;
  private targetPitch = 0.28;
  private targetDistance = 6.5;

  private readonly minPitch = -0.10; // Can look slightly up
  private readonly maxPitch = 1.10; // ~63 degrees max elevation
  private readonly minDistance = 2.8;
  private readonly maxDistance = 16.0;

  // Smooth follow focus target
  public currentFocus = new THREE.Vector3(0, 1.1, 8);
  private desiredFocus = new THREE.Vector3(0, 1.1, 8);

  // Desktop Mouse State
  private isMouseDown = false;
  private lastMouseX = 0;
  private lastMouseY = 0;

  // Mobile Touch State (Tracks camera drag touches specifically)
  private cameraTouches = new Map<number, { x: number; y: number }>();
  private initialPinchDist = 0;
  private initialPinchDistance = 6.5;

  private domElement: HTMLElement | null = null;

  constructor(fov = 56, aspect = 16 / 9, near = 0.1, far = 500) {
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.updatePositionImmediate();
  }

  public attach(domElement: HTMLElement) {
    this.domElement = domElement;

    // 1. Desktop Mouse Handlers
    domElement.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
    domElement.addEventListener('wheel', this.onWheel, { passive: false });
    domElement.addEventListener('contextmenu', this.onContextMenu);

    // 2. Mobile Touch Handlers
    domElement.addEventListener('touchstart', this.onTouchStart, { passive: false });
    domElement.addEventListener('touchmove', this.onTouchMove, { passive: false });
    domElement.addEventListener('touchend', this.onTouchEnd);
    domElement.addEventListener('touchcancel', this.onTouchEnd);
  }

  public dispose() {
    if (this.domElement) {
      this.domElement.removeEventListener('mousedown', this.onMouseDown);
      this.domElement.removeEventListener('wheel', this.onWheel);
      this.domElement.removeEventListener('contextmenu', this.onContextMenu);
      this.domElement.removeEventListener('touchstart', this.onTouchStart);
      this.domElement.removeEventListener('touchmove', this.onTouchMove);
      this.domElement.removeEventListener('touchend', this.onTouchEnd);
      this.domElement.removeEventListener('touchcancel', this.onTouchEnd);
      this.domElement = null;
    }
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
    this.cameraTouches.clear();
  }

  private onContextMenu = (e: MouseEvent) => {
    e.preventDefault();
  };

  private onMouseDown = (e: MouseEvent) => {
    this.isMouseDown = true;
    this.lastMouseX = e.clientX;
    this.lastMouseY = e.clientY;
  };

  private onMouseMove = (e: MouseEvent) => {
    if (!this.isMouseDown) return;

    const dx = e.clientX - this.lastMouseX;
    const dy = e.clientY - this.lastMouseY;
    this.lastMouseX = e.clientX;
    this.lastMouseY = e.clientY;

    const sensitivity = 0.0055;
    this.applyOrbitDelta(dx * sensitivity, dy * sensitivity);
  };

  private onMouseUp = () => {
    this.isMouseDown = false;
  };

  private onWheel = (e: WheelEvent) => {
    e.preventDefault();
    const zoomDelta = e.deltaY * 0.005;
    this.targetDistance = THREE.MathUtils.clamp(
      this.targetDistance + zoomDelta,
      this.minDistance,
      this.maxDistance
    );
  };

  // Mobile Touch Gestures (Independent from Joystick)
  private onTouchStart = (e: TouchEvent) => {
    // Only capture touches that are on the canvas outside UI buttons
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      // Ignore touch if it started in the bottom-left joystick zone (x < 35% width, y > 60% height)
      const isJoystickZone = t.clientX < window.innerWidth * 0.35 && t.clientY > window.innerHeight * 0.55;
      // Ignore touch if it started on bottom-right jump button zone
      const isJumpZone = t.clientX > window.innerWidth * 0.78 && t.clientY > window.innerHeight * 0.70;

      if (!isJoystickZone && !isJumpZone) {
        this.cameraTouches.set(t.identifier, { x: t.clientX, y: t.clientY });
      }
    }

    if (this.cameraTouches.size === 2) {
      const touches = Array.from(this.cameraTouches.values());
      this.initialPinchDist = Math.hypot(touches[0].x - touches[1].x, touches[0].y - touches[1].y);
      this.initialPinchDistance = this.targetDistance;
    }
  };

  private onTouchMove = (e: TouchEvent) => {
    if (e.cancelable) e.preventDefault();

    if (this.cameraTouches.size >= 1) {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        const prev = this.cameraTouches.get(t.identifier);
        if (prev) {
          if (this.cameraTouches.size === 1) {
            // Single finger camera orbit
            const dx = t.clientX - prev.x;
            const dy = t.clientY - prev.y;
            this.cameraTouches.set(t.identifier, { x: t.clientX, y: t.clientY });

            const touchSens = 0.0065;
            this.applyOrbitDelta(dx * touchSens, dy * touchSens);
          } else {
            // Update touch position
            this.cameraTouches.set(t.identifier, { x: t.clientX, y: t.clientY });
          }
        }
      }

      if (this.cameraTouches.size === 2) {
        // Two-finger pinch zoom on camera area
        const touches = Array.from(this.cameraTouches.values());
        const currentDist = Math.hypot(touches[0].x - touches[1].x, touches[0].y - touches[1].y);
        if (this.initialPinchDist > 8 && currentDist > 8) {
          const ratio = this.initialPinchDist / currentDist;
          this.targetDistance = THREE.MathUtils.clamp(
            this.initialPinchDistance * ratio,
            this.minDistance,
            this.maxDistance
          );
        }
      }
    }
  };

  private onTouchEnd = (e: TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      this.cameraTouches.delete(e.changedTouches[i].identifier);
    }
    if (this.cameraTouches.size < 2) {
      this.initialPinchDist = 0;
    }
  };

  public applyOrbitDelta(deltaYaw: number, deltaPitch: number) {
    this.targetYaw -= deltaYaw;
    this.targetPitch = THREE.MathUtils.clamp(
      this.targetPitch + deltaPitch,
      this.minPitch,
      this.maxPitch
    );
  }

  public update(playerPos: THREE.Vector3, dt: number) {
    // 1. Smoothly follow target position (Torso / eye height)
    this.desiredFocus.set(playerPos.x, playerPos.y + 1.15, playerPos.z);
    this.currentFocus.lerp(this.desiredFocus, 1 - Math.exp(-16 * dt));

    // 2. Smooth spring interpolation for angles & distance
    let diffYaw = this.targetYaw - this.yaw;
    while (diffYaw > Math.PI) diffYaw -= 2 * Math.PI;
    while (diffYaw < -Math.PI) diffYaw += 2 * Math.PI;
    this.yaw += diffYaw * Math.min(1, 22 * dt);

    this.pitch += (this.targetPitch - this.pitch) * Math.min(1, 20 * dt);
    this.distance += (this.targetDistance - this.distance) * Math.min(1, 16 * dt);

    // 3. Compute spherical camera world position
    const cosP = Math.cos(this.pitch);
    const sinP = Math.sin(this.pitch);
    const cosY = Math.cos(this.yaw);
    const sinY = Math.sin(this.yaw);

    const camX = this.currentFocus.x + this.distance * cosP * sinY;
    const camY = this.currentFocus.y + this.distance * sinP;
    const camZ = this.currentFocus.z + this.distance * cosP * cosY;

    this.camera.position.set(camX, camY, camZ);
    this.camera.lookAt(this.currentFocus.x, this.currentFocus.y, this.currentFocus.z);
  }

  private updatePositionImmediate() {
    const cosP = Math.cos(this.pitch);
    const sinP = Math.sin(this.pitch);
    const cosY = Math.cos(this.yaw);
    const sinY = Math.sin(this.yaw);

    this.camera.position.set(
      this.currentFocus.x + this.distance * cosP * sinY,
      this.currentFocus.y + this.distance * sinP,
      this.currentFocus.z + this.distance * cosP * cosY
    );
    this.camera.lookAt(this.currentFocus);
  }
}
