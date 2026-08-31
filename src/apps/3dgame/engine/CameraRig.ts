import * as THREE from 'three';

export class CameraRig {
  public readonly camera: THREE.PerspectiveCamera;

  // Spherical Coordinates (Roblox Standard)
  public yaw = 0; // Horizontal orbit angle (radians)
  public pitch = 0.38; // Vertical elevation angle (~22 degrees)
  public distance = 8.5; // Distance from character (meters)

  private targetYaw = 0;
  private targetPitch = 0.38;
  private targetDistance = 8.5;

  private readonly minPitch = 0.04;
  private readonly maxPitch = 1.35; // ~77 degrees elevation
  private readonly minDistance = 3.0;
  private readonly maxDistance = 22.0;

  // Smooth follow focus target
  public currentFocus = new THREE.Vector3(0, 1.2, 0);
  private desiredFocus = new THREE.Vector3(0, 1.2, 0);

  // Interaction State
  private isMouseDown = false;
  private lastMouseX = 0;
  private lastMouseY = 0;

  // Mobile Multi-Touch State
  private activeTouches = new Map<number, { x: number; y: number }>();
  private initialPinchDist = 0;
  private initialPinchDistance = 8.5;

  private domElement: HTMLElement | null = null;

  constructor(fov = 60, aspect = 16 / 9, near = 0.1, far = 500) {
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.updatePositionImmediate();
  }

  public attach(domElement: HTMLElement) {
    this.domElement = domElement;

    // 1. Mouse Events (Desktop Orbit & Zoom)
    domElement.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
    domElement.addEventListener('wheel', this.onWheel, { passive: false });
    domElement.addEventListener('contextmenu', this.onContextMenu);

    // 2. Touch Events (Mobile Orbit & Pinch Zoom)
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
  }

  private onContextMenu = (e: MouseEvent) => {
    e.preventDefault();
  };

  private onMouseDown = (e: MouseEvent) => {
    // Right click (2) or left click (0) on 3D canvas
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

    // Roblox Mouse Orbit Mapping
    const sensitivity = 0.0055;
    this.applyOrbitDelta(dx * sensitivity, dy * sensitivity);
  };

  private onMouseUp = () => {
    this.isMouseDown = false;
  };

  private onWheel = (e: WheelEvent) => {
    e.preventDefault();
    const zoomDelta = e.deltaY * 0.006;
    this.targetDistance = THREE.MathUtils.clamp(
      this.targetDistance + zoomDelta,
      this.minDistance,
      this.maxDistance
    );
  };

  // Mobile Touch Gestures
  private onTouchStart = (e: TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      this.activeTouches.set(t.identifier, { x: t.clientX, y: t.clientY });
    }

    if (this.activeTouches.size === 2) {
      const touches = Array.from(this.activeTouches.values());
      this.initialPinchDist = Math.hypot(touches[0].x - touches[1].x, touches[0].y - touches[1].y);
      this.initialPinchDistance = this.targetDistance;
    }
  };

  private onTouchMove = (e: TouchEvent) => {
    if (e.cancelable) e.preventDefault();

    if (this.activeTouches.size === 1) {
      const t = e.changedTouches[0];
      const prev = this.activeTouches.get(t.identifier);
      if (prev) {
        const dx = t.clientX - prev.x;
        const dy = t.clientY - prev.y;
        this.activeTouches.set(t.identifier, { x: t.clientX, y: t.clientY });

        const touchSens = 0.007;
        this.applyOrbitDelta(dx * touchSens, dy * touchSens);
      }
    } else if (this.activeTouches.size === 2) {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (this.activeTouches.has(t.identifier)) {
          this.activeTouches.set(t.identifier, { x: t.clientX, y: t.clientY });
        }
      }
      const touches = Array.from(this.activeTouches.values());
      const currentDist = Math.hypot(touches[0].x - touches[1].x, touches[0].y - touches[1].y);
      if (this.initialPinchDist > 5 && currentDist > 5) {
        const ratio = this.initialPinchDist / currentDist;
        this.targetDistance = THREE.MathUtils.clamp(
          this.initialPinchDistance * ratio,
          this.minDistance,
          this.maxDistance
        );
      }
    }
  };

  private onTouchEnd = (e: TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      this.activeTouches.delete(e.changedTouches[i].identifier);
    }
    if (this.activeTouches.size < 2) {
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
    // 1. Smoothly follow target position (Head / torso height offset)
    this.desiredFocus.set(playerPos.x, playerPos.y + 1.25, playerPos.z);
    this.currentFocus.lerp(this.desiredFocus, 1 - Math.exp(-14 * dt));

    // 2. Smooth spring interpolation for angles & distance
    this.yaw += (this.targetYaw - this.yaw) * Math.min(1, 20 * dt);
    this.pitch += (this.targetPitch - this.pitch) * Math.min(1, 18 * dt);
    this.distance += (this.targetDistance - this.distance) * Math.min(1, 14 * dt);

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
