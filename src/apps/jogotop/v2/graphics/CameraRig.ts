import * as THREE from 'three';
import { CameraInput } from '../types';

export const CAM_DIST_DEFAULT = 9.5;
export const CAM_DIST_MIN = 4.5;
export const CAM_DIST_MAX = 22.0;

export const CAM_PITCH_DEFAULT = 0.42; // ~24 deg
export const CAM_PITCH_MIN = 0.05;
export const CAM_PITCH_MAX = 1.15; // ~66 deg

export const CAM_FOV_PORTRAIT = 56;
export const CAM_FOV_LANDSCAPE = 46;
export const CAM_NEAR = 0.25;
export const CAM_FAR = 180.0;

export const MOUSE_CAM_SENS = 0.005;
export const TOUCH_CAM_SENS = 0.007;

export class CameraRig {
  public readonly camera: THREE.PerspectiveCamera;
  public yaw = 0;
  public pitch = CAM_PITCH_DEFAULT;
  public dist = CAM_DIST_DEFAULT;

  private lookTarget = new THREE.Vector3();
  private camOffset = new THREE.Vector3();
  private targetCamPos = new THREE.Vector3();

  private domElement: HTMLElement | null = null;
  private rmbDown = false;
  private lastMouseX = 0;
  private lastMouseY = 0;

  private camTouches = new Map<number, { x: number; y: number }>();
  private initialPinchDist = 0;
  private initialPinchCamDist = CAM_DIST_DEFAULT;

  constructor(width: number, height: number) {
    const isPortrait = height > width;
    const aspect = width / (height || 1);
    const fov = isPortrait ? CAM_FOV_PORTRAIT : CAM_FOV_LANDSCAPE;

    this.camera = new THREE.PerspectiveCamera(fov, aspect, CAM_NEAR, CAM_FAR);
    this.updateCameraOffset();
  }

  public resize(width: number, height: number) {
    const isPortrait = height > width;
    this.camera.aspect = width / (height || 1);
    this.camera.fov = isPortrait ? CAM_FOV_PORTRAIT : CAM_FOV_LANDSCAPE;
    this.camera.updateProjectionMatrix();
  }

  public setInitialPosition(x: number, y: number, z: number, yaw = 0) {
    this.yaw = yaw;
    this.lookTarget.set(x, y, z);
    this.updateCameraOffset();
    this.camera.position.copy(this.lookTarget).add(this.camOffset);
    this.camera.lookAt(this.lookTarget.x, this.lookTarget.y + 1.1, this.lookTarget.z);
  }

  public applyInput(input: CameraInput) {
    this.yaw -= input.yawDelta;
    this.pitch = Math.min(CAM_PITCH_MAX, Math.max(CAM_PITCH_MIN, this.pitch + input.pitchDelta));
    if (input.zoomDelta !== 0) {
      this.dist = Math.min(CAM_DIST_MAX, Math.max(CAM_DIST_MIN, this.dist * (1 + input.zoomDelta)));
    }
  }

  public update(targetPos: [number, number, number], dt: number) {
    this.updateCameraOffset();

    // Smooth follow
    const lerpK = 1 - Math.exp(-dt * 8.5);
    this.lookTarget.x += (targetPos[0] - this.lookTarget.x) * lerpK;
    this.lookTarget.y += (targetPos[1] - this.lookTarget.y) * lerpK;
    this.lookTarget.z += (targetPos[2] - this.lookTarget.z) * lerpK;

    this.targetCamPos.copy(this.lookTarget).add(this.camOffset);
    this.camera.position.lerp(this.targetCamPos, lerpK);
    this.camera.lookAt(this.lookTarget.x, this.lookTarget.y + 1.1, this.lookTarget.z);

    // Validate in debug mode
    if ((import.meta as any).env?.DEV) {
      const p = this.camera.position;
      if (!Number.isFinite(p.x) || !Number.isFinite(p.y) || !Number.isFinite(p.z)) {
        console.error('Camera position contains NaN/Infinity:', p);
      }
    }
  }

  private updateCameraOffset() {
    const cp = Math.cos(this.pitch);
    this.camOffset.set(
      this.dist * cp * Math.sin(this.yaw),
      this.dist * Math.sin(this.pitch),
      this.dist * cp * Math.cos(this.yaw)
    );
  }

  public attach(domElement: HTMLElement) {
    this.domElement = domElement;

    // Desktop Mouse listeners attached to DOM element
    domElement.addEventListener('contextmenu', this.onContextMenu);
    domElement.addEventListener('mousedown', this.onMouseDown);
    domElement.addEventListener('wheel', this.onWheel, { passive: false });
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
    document.addEventListener('pointerlockchange', this.onLockChange);

    // Touch listeners attached to container
    domElement.addEventListener('touchstart', this.onTouchStart, { passive: false });
    domElement.addEventListener('touchmove', this.onTouchMove, { passive: false });
    domElement.addEventListener('touchend', this.onTouchEnd, { passive: false });
    domElement.addEventListener('touchcancel', this.onTouchEnd, { passive: false });
  }

  public detach() {
    if (!this.domElement) return;
    this.domElement.removeEventListener('contextmenu', this.onContextMenu);
    this.domElement.removeEventListener('mousedown', this.onMouseDown);
    this.domElement.removeEventListener('wheel', this.onWheel);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('pointerlockchange', this.onLockChange);
    this.domElement.removeEventListener('touchstart', this.onTouchStart);
    this.domElement.removeEventListener('touchmove', this.onTouchMove);
    this.domElement.removeEventListener('touchend', this.onTouchEnd);
    this.domElement.removeEventListener('touchcancel', this.onTouchEnd);
    this.domElement = null;
  }

  private onContextMenu = (e: MouseEvent) => {
    e.preventDefault();
  };

  private onMouseDown = (e: MouseEvent) => {
    if (e.button !== 2) return; // Right mouse button
    this.rmbDown = true;
    this.lastMouseX = e.clientX;
    this.lastMouseY = e.clientY;
    if (this.domElement) {
      this.domElement.style.cursor = 'grabbing';
      try {
        const req = this.domElement.requestPointerLock() as unknown;
        if (req instanceof Promise) req.catch(() => {});
      } catch {
        /* fallback */
      }
    }
  };

  private onMouseMove = (e: MouseEvent) => {
    if (!this.rmbDown) return;
    const dx = e.movementX !== undefined ? e.movementX : e.clientX - this.lastMouseX;
    const dy = e.movementY !== undefined ? e.movementY : e.clientY - this.lastMouseY;
    this.lastMouseX = e.clientX;
    this.lastMouseY = e.clientY;

    this.yaw -= dx * MOUSE_CAM_SENS;
    this.pitch = Math.min(CAM_PITCH_MAX, Math.max(CAM_PITCH_MIN, this.pitch + dy * MOUSE_CAM_SENS));
  };

  private onMouseUp = (e: MouseEvent) => {
    if (e.button !== 2) return;
    this.rmbDown = false;
    if (this.domElement) this.domElement.style.cursor = 'grab';
    if (document.pointerLockElement === this.domElement) {
      document.exitPointerLock();
    }
  };

  private onLockChange = () => {
    if (document.pointerLockElement !== this.domElement) {
      this.rmbDown = false;
      if (this.domElement) this.domElement.style.cursor = 'grab';
    }
  };

  private onWheel = (e: WheelEvent) => {
    e.preventDefault();
    this.dist = Math.min(CAM_DIST_MAX, Math.max(CAM_DIST_MIN, this.dist * (1 + e.deltaY * 0.0011)));
  };

  private isTouchOnUI = (touch: Touch): boolean => {
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    return !!el && !!(el.closest('.jt-joystick') || el.closest('.jt-touchbtn') || el.closest('.jt-fullscreen-btn'));
  };

  private onTouchStart = (e: TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      if (!this.isTouchOnUI(t)) {
        this.camTouches.set(t.identifier, { x: t.clientX, y: t.clientY });
      }
    }

    if (this.camTouches.size === 2) {
      const ids = Array.from(this.camTouches.keys());
      const t1 = Array.from(e.touches).find((t) => t.identifier === ids[0]);
      const t2 = Array.from(e.touches).find((t) => t.identifier === ids[1]);
      if (t1 && t2) {
        this.initialPinchDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
        this.initialPinchCamDist = this.dist;
      }
    }
  };

  private onTouchMove = (e: TouchEvent) => {
    if (this.camTouches.size === 1) {
      const [camId, last] = Array.from(this.camTouches.entries())[0];
      const t = Array.from(e.touches).find((touch) => touch.identifier === camId);
      if (t) {
        const dx = t.clientX - last.x;
        const dy = t.clientY - last.y;
        last.x = t.clientX;
        last.y = t.clientY;

        this.yaw -= dx * TOUCH_CAM_SENS;
        this.pitch = Math.min(CAM_PITCH_MAX, Math.max(CAM_PITCH_MIN, this.pitch + dy * TOUCH_CAM_SENS));
      }
    } else if (this.camTouches.size >= 2) {
      const ids = Array.from(this.camTouches.keys());
      const t1 = Array.from(e.touches).find((t) => t.identifier === ids[0]);
      const t2 = Array.from(e.touches).find((t) => t.identifier === ids[1]);
      if (t1 && t2) {
        const curDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
        if (this.initialPinchDist > 0 && curDist > 10) {
          const ratio = this.initialPinchDist / curDist;
          this.dist = Math.min(CAM_DIST_MAX, Math.max(CAM_DIST_MIN, this.initialPinchCamDist * ratio));
        }
        const last1 = this.camTouches.get(t1.identifier);
        const last2 = this.camTouches.get(t2.identifier);
        if (last1) {
          last1.x = t1.clientX;
          last1.y = t1.clientY;
        }
        if (last2) {
          last2.x = t2.clientX;
          last2.y = t2.clientY;
        }
      }
    }
  };

  private onTouchEnd = (e: TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      this.camTouches.delete(t.identifier);
    }
    if (this.camTouches.size < 2) {
      this.initialPinchDist = 0;
    }
  };
}
