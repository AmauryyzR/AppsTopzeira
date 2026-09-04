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

  private readonly minPitch = -1.05; // ~ -60 degrees tilt up toward zenith and clouds
  private readonly maxPitch = 1.15; // ~65 degrees max elevation
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

  public readonly baseFov: number;
  private targetFov: number;

  constructor(fov = 56, aspect = 16 / 9, near = 0.1, far = 500) {
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.baseFov = fov;
    this.targetFov = fov;
    this.updatePositionImmediate();
  }

  public setSprinting(isSprinting: boolean, speed: number) {
    this.targetFov = isSprinting && speed > 5.0 ? this.baseFov + 7.0 : this.baseFov;
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

  public setOrbit(yaw: number, pitch: number, distance?: number) {
    this.targetYaw = yaw;
    this.yaw = yaw;
    this.targetPitch = THREE.MathUtils.clamp(pitch, this.minPitch, this.maxPitch);
    this.pitch = this.targetPitch;
    if (distance !== undefined) {
      this.targetDistance = THREE.MathUtils.clamp(distance, this.minDistance, this.maxDistance);
      this.distance = this.targetDistance;
    }
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

    // 3. Dynamic Ground Clearance & Over-The-Shoulder Zoom (BotW / Genshin Style)
    // When tilting upward (pitch < 0), the camera descends toward the ground.
    // To prevent clipping and maintain visual appeal when approaching the floor (Y < 0.85m),
    // dynamically reduce camera distance (smooth shoulder zoom-in from 6.5m down to ~3.2m)
    // and gently offset over the right shoulder (+0.45m), keeping camera Y >= 0.30m
    // and maintaining the hero fully framed in the third-person view without being clipped.
    const cosP = Math.cos(this.pitch);
    const sinP = Math.sin(this.pitch);
    const cosY = Math.cos(this.yaw);
    const sinY = Math.sin(this.yaw);

    // Camera view direction vector (points where the camera is looking)
    const dirX = -sinY * cosP;
    const dirY = -sinP;
    const dirZ = -cosY * cosP;

    // Right vector for shoulder offset (perpendicular to horizontal yaw)
    const rightX = cosY;
    const rightZ = -sinY;

    // Ground clearance thresholding
    const minGroundY = 0.30;
    const thresholdGroundY = 0.85;

    // Unconstrained camera height with nominal distance
    const rawCamY = this.currentFocus.y - dirY * this.distance;

    let effDistance = this.distance;
    let shoulderShift = 0;

    if (rawCamY < thresholdGroundY) {
      const t = THREE.MathUtils.clamp(
        (thresholdGroundY - rawCamY) / (thresholdGroundY - 0.20),
        0,
        1
      );
      // Hermite S-curve
      const smoothT = t * t * (3 - 2 * t);
      // Smoothly zoom in to ~3.2m (shoulder framing)
      const targetShoulderDist = Math.max(2.8, Math.min(this.distance, 3.2));
      effDistance = THREE.MathUtils.lerp(this.distance, targetShoulderDist, smoothT);
      shoulderShift = THREE.MathUtils.lerp(0.0, 0.45, smoothT);
    }

    // Camera world position
    let camX = this.currentFocus.x - dirX * effDistance + rightX * shoulderShift;
    let camY = this.currentFocus.y - dirY * effDistance;
    let camZ = this.currentFocus.z - dirZ * effDistance + rightZ * shoulderShift;

    // Clamp strictly above ground
    camY = Math.max(minGroundY, camY);

    this.camera.position.set(camX, camY, camZ);

    // Look target follows direction vector so camera rotates exactly as commanded by pitch and yaw
    // while keeping hero elegantly framed over shoulder
    const lookDist = 50.0;
    this.camera.lookAt(
      camX + dirX * lookDist,
      camY + dirY * lookDist,
      camZ + dirZ * lookDist
    );

    // Smooth dynamic FOV kick on sprint boost
    if (Math.abs(this.camera.fov - this.targetFov) > 0.05) {
      this.camera.fov += (this.targetFov - this.camera.fov) * Math.min(1, 8.0 * dt);
      this.camera.updateProjectionMatrix();
    }
  }

  private updatePositionImmediate() {
    const cosP = Math.cos(this.pitch);
    const sinP = Math.sin(this.pitch);
    const cosY = Math.cos(this.yaw);
    const sinY = Math.sin(this.yaw);

    const dirX = -sinY * cosP;
    const dirY = -sinP;
    const dirZ = -cosY * cosP;

    const rightX = cosY;
    const rightZ = -sinY;

    const minGroundY = 0.30;
    const thresholdGroundY = 0.85;

    const rawCamY = this.currentFocus.y - dirY * this.distance;
    let effDistance = this.distance;
    let shoulderShift = 0;

    if (rawCamY < thresholdGroundY) {
      const t = THREE.MathUtils.clamp(
        (thresholdGroundY - rawCamY) / (thresholdGroundY - 0.20),
        0,
        1
      );
      const smoothT = t * t * (3 - 2 * t);
      const targetShoulderDist = Math.max(2.8, Math.min(this.distance, 3.2));
      effDistance = THREE.MathUtils.lerp(this.distance, targetShoulderDist, smoothT);
      shoulderShift = THREE.MathUtils.lerp(0.0, 0.45, smoothT);
    }

    let camX = this.currentFocus.x - dirX * effDistance + rightX * shoulderShift;
    let camY = Math.max(minGroundY, this.currentFocus.y - dirY * effDistance);
    let camZ = this.currentFocus.z - dirZ * effDistance + rightZ * shoulderShift;

    this.camera.position.set(camX, camY, camZ);

    const lookDist = 50.0;
    this.camera.lookAt(
      camX + dirX * lookDist,
      camY + dirY * lookDist,
      camZ + dirZ * lookDist
    );
  }
}
