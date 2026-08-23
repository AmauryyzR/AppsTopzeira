import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { InputManager } from './InputManager';
import { Player } from './Player';
import { buildWorld, WorldRefs } from './WorldBuilder';

const SUN_OFFSET = new THREE.Vector3(26, 40, 16);
const MAX_SPEED = 5.6;
const PLAYER_RADIUS = 0.45;
const BOUNDS = 53.5;
const JUMP_SPEED = 9.0;
const G_RISE_HOLD = 20;
const G_RISE_CUT = 46;
const G_FALL = 28;
const CAM_DIST = Math.hypot(16, 10.5);
const CAM_PITCH0 = Math.atan2(16, 10.5);
const PITCH_MIN = 0.2;
const PITCH_MAX = 1.38;
const CAM_SENS = 0.005;
const TOUCH_CAM_SENS = 0.007;

class DustSystem {
  private pool: { sprite: THREE.Sprite; mat: THREE.SpriteMaterial; life: number; max: number; vx: number; vy: number; vz: number }[] = [];
  private tex: THREE.Texture;

  constructor(scene: THREE.Scene) {
    const c = document.createElement('canvas');
    c.width = 64;
    c.height = 64;
    const g = c.getContext('2d')!;
    const grad = g.createRadialGradient(32, 32, 2, 32, 32, 30);
    grad.addColorStop(0, 'rgba(255,255,255,0.9)');
    grad.addColorStop(0.5, 'rgba(230,220,190,0.5)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
    this.tex = new THREE.CanvasTexture(c);

    for (let i = 0; i < 24; i++) {
      const mat = new THREE.SpriteMaterial({
        map: this.tex,
        color: 0xe0d2b4,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      });
      const sprite = new THREE.Sprite(mat);
      sprite.visible = false;
      scene.add(sprite);
      this.pool.push({ sprite, mat, life: 0, max: 1, vx: 0, vy: 0, vz: 0 });
    }
  }

  spawn(x: number, z: number, count = 1) {
    for (let i = 0; i < count; i++) {
      const p = this.pool.find((e) => e.life <= 0);
      if (!p) return;
      p.life = 0.38 + Math.random() * 0.2;
      p.max = p.life;
      p.vx = (Math.random() - 0.5) * 0.7;
      p.vy = 0.6 + Math.random() * 0.6;
      p.vz = (Math.random() - 0.5) * 0.7;
      p.sprite.position.set(x + (Math.random() - 0.5) * 0.3, 0.12, z + (Math.random() - 0.5) * 0.3);
      p.sprite.scale.setScalar(0.32);
      p.sprite.visible = true;
    }
  }

  update(dt: number) {
    for (const p of this.pool) {
      if (p.life <= 0) continue;
      p.life -= dt;
      if (p.life <= 0) {
        p.sprite.visible = false;
        p.mat.opacity = 0;
        continue;
      }
      p.sprite.position.x += p.vx * dt;
      p.sprite.position.y += p.vy * dt;
      p.sprite.position.z += p.vz * dt;
      p.sprite.scale.addScalar(dt * 1.3);
      p.mat.opacity = 0.45 * (p.life / p.max);
    }
  }

  dispose() {
    for (const p of this.pool) p.mat.dispose();
    this.tex.dispose();
  }
}

export class GameEngine {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private sun: THREE.DirectionalLight;
  private world: WorldRefs;
  private player = new Player();
  private dust: DustSystem;
  private input: InputManager;
  private container: HTMLElement;
  private onReady?: () => void;

  private clock = new THREE.Clock();
  private rafId = 0;
  private elapsed = 0;
  private dustTimer = 0;
  private ready = false;

  private lookTarget = new THREE.Vector3();
  private vel = new THREE.Vector3();
  private desired = new THREE.Vector3();
  private camOffset = new THREE.Vector3();
  private camYaw = 0;
  private camPitch = CAM_PITCH0;
  private camDist = CAM_DIST;
  private vy = 0;
  private grounded = true;
  private rmbDown = false;
  private lastX = 0;
  private lastY = 0;
  private envTexture: THREE.Texture | null = null;

  // Touch Camera drag & pinch
  private touchCamId: number | null = null;
  private lastTouchX = 0;
  private lastTouchY = 0;
  private pinchDist = 0;

  constructor(container: HTMLElement, input: InputManager, onReady?: () => void) {
    this.container = container;
    this.input = input;
    this.onReady = onReady;

    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    const isPortrait = h > w;

    // High performance renderer configuration
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      precision: 'mediump',
      stencil: false,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.setSize(w, h);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(this.renderer.domElement);

    // Far fog
    this.scene.fog = new THREE.Fog(0x8ecdf5, 80, 180);

    // IBL Environment
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    this.scene.environment = this.envTexture;
    this.scene.environmentIntensity = 0.35;

    // Camera with adaptive FOV for both Portrait and Landscape
    this.camera = new THREE.PerspectiveCamera(isPortrait ? 58 : 46, w / h, 0.2, 500);
    this.camera.position.set(0, CAM_DIST * Math.sin(CAM_PITCH0), CAM_DIST * Math.cos(CAM_PITCH0));

    // Lights
    this.scene.add(new THREE.HemisphereLight(0xb5e2ff, 0x48a834, 1.0));

    this.sun = new THREE.DirectionalLight(0xfff6de, 2.5);
    this.sun.position.copy(SUN_OFFSET);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(1024, 1024);
    this.sun.shadow.camera.left = -32;
    this.sun.shadow.camera.right = 32;
    this.sun.shadow.camera.top = 32;
    this.sun.shadow.camera.bottom = -32;
    this.sun.shadow.camera.near = 5;
    this.sun.shadow.camera.far = 115;
    this.sun.shadow.bias = -0.0003;
    this.sun.shadow.normalBias = 0.02;
    this.scene.add(this.sun);
    this.scene.add(this.sun.target);

    // Build World
    this.world = buildWorld(this.scene);

    // Player
    this.scene.add(this.player.group);
    this.player.group.position.set(3.2, 0, 4.2);
    this.player.setYaw(Math.PI * 0.75);

    this.dust = new DustSystem(this.scene);

    this.lookTarget.copy(this.player.group.position);
    this.camera.position.copy(this.player.group.position).add(this.camOffset.set(0, CAM_DIST * Math.sin(CAM_PITCH0), CAM_DIST * Math.cos(CAM_PITCH0)));

    // Desktop Mouse & Pointer Lock Listeners
    container.addEventListener('contextmenu', this.onContextMenu);
    container.addEventListener('mousedown', this.onMouseDown);
    container.addEventListener('wheel', this.onWheel, { passive: false });
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
    document.addEventListener('pointerlockchange', this.onLockChange);

    // Mobile Touch Camera Listeners (Roblox swipe to orbit & pinch to zoom)
    container.addEventListener('touchstart', this.onTouchStart, { passive: false });
    container.addEventListener('touchmove', this.onTouchMove, { passive: false });
    container.addEventListener('touchend', this.onTouchEnd, { passive: false });
    container.addEventListener('touchcancel', this.onTouchEnd, { passive: false });

    this.renderer.domElement.style.cursor = 'grab';
    window.addEventListener('resize', this.onResize);
    window.addEventListener('orientationchange', this.onResize);

    this.tick();
  }

  private onContextMenu = (e: MouseEvent) => {
    e.preventDefault();
  };

  private onMouseDown = (e: MouseEvent) => {
    if (e.button !== 2) return;
    this.rmbDown = true;
    this.lastX = e.clientX;
    this.lastY = e.clientY;
    this.renderer.domElement.style.cursor = 'grabbing';
    try {
      const req = this.renderer.domElement.requestPointerLock() as unknown;
      if (req instanceof Promise) req.catch(() => {});
    } catch {
      /* fallback */
    }
  };

  private onMouseMove = (e: MouseEvent) => {
    if (!this.rmbDown) return;
    const dx = e.movementX !== undefined ? e.movementX : e.clientX - this.lastX;
    const dy = e.movementY !== undefined ? e.movementY : e.clientY - this.lastY;
    this.lastX = e.clientX;
    this.lastY = e.clientY;
    this.camYaw -= dx * CAM_SENS;
    this.camPitch = Math.min(PITCH_MAX, Math.max(PITCH_MIN, this.camPitch + dy * CAM_SENS));
  };

  private onMouseUp = (e: MouseEvent) => {
    if (e.button !== 2) return;
    this.rmbDown = false;
    this.renderer.domElement.style.cursor = 'grab';
    if (document.pointerLockElement === this.renderer.domElement) {
      document.exitPointerLock();
    }
  };

  private onLockChange = () => {
    if (!document.pointerLockElement) {
      this.rmbDown = false;
      this.renderer.domElement.style.cursor = 'grab';
    }
  };

  private onWheel = (e: WheelEvent) => {
    e.preventDefault();
    this.camDist = Math.min(34, Math.max(7, this.camDist * (1 + e.deltaY * 0.0011)));
  };

  // Mobile Touch Camera Controls (Roblox style swipe & pinch)
  private onTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 1) {
      const t = e.touches[0];
      const target = e.target as HTMLElement;
      if (target.closest('.jt-joystick') || target.closest('.jt-touchbtn')) return;

      this.touchCamId = t.identifier;
      this.lastTouchX = t.clientX;
      this.lastTouchY = t.clientY;
    } else if (e.touches.length === 2) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      this.pinchDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
    }
  };

  private onTouchMove = (e: TouchEvent) => {
    if (e.touches.length === 1 && this.touchCamId !== null) {
      const t = Array.from(e.touches).find((touch) => touch.identifier === this.touchCamId);
      if (!t) return;
      const dx = t.clientX - this.lastTouchX;
      const dy = t.clientY - this.lastTouchY;
      this.lastTouchX = t.clientX;
      this.lastTouchY = t.clientY;

      this.camYaw -= dx * TOUCH_CAM_SENS;
      this.camPitch = Math.min(PITCH_MAX, Math.max(PITCH_MIN, this.camPitch + dy * TOUCH_CAM_SENS));
    } else if (e.touches.length === 2) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      if (this.pinchDist > 0) {
        const factor = this.pinchDist / dist;
        this.camDist = Math.min(34, Math.max(7, this.camDist * factor));
      }
      this.pinchDist = dist;
    }
  };

  private onTouchEnd = (e: TouchEvent) => {
    if (this.touchCamId !== null) {
      const stillActive = Array.from(e.touches).some((t) => t.identifier === this.touchCamId);
      if (!stillActive) {
        this.touchCamId = null;
      }
    }
    if (e.touches.length < 2) {
      this.pinchDist = 0;
    }
  };

  private onResize = () => {
    const w = this.container.clientWidth || window.innerWidth;
    const h = this.container.clientHeight || window.innerHeight;
    const isPortrait = h > w;

    this.camera.aspect = w / h;
    this.camera.fov = isPortrait ? 58 : 46;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  private tick = () => {
    this.rafId = requestAnimationFrame(this.tick);
    const dt = Math.min(this.clock.getDelta(), 0.05);
    this.elapsed += dt;

    this.input.update();
    const iv = this.input.vector;
    const cy = Math.cos(this.camYaw);
    const sy = Math.sin(this.camYaw);
    const wx = iv.x * cy + iv.z * sy;
    const wz = -iv.x * sy + iv.z * cy;

    this.desired.set(wx, 0, wz).multiplyScalar(MAX_SPEED);
    this.vel.lerp(this.desired, 1 - Math.exp(-dt * 12));
    if (this.vel.lengthSq() < 0.0004) this.vel.set(0, 0, 0);

    const pos = this.player.group.position;
    pos.addScaledVector(this.vel, dt);

    // Jump & Gravity
    if (this.grounded && this.input.consumeJump()) {
      this.vy = JUMP_SPEED;
      this.grounded = false;
      this.dust.spawn(pos.x, pos.z, 2);
      this.player.takeoff();
    }

    if (!this.grounded) {
      const g = this.vy > 0 ? (this.input.isJumpHeld() ? G_RISE_HOLD : G_RISE_CUT) : G_FALL;
      this.vy -= g * dt;
      pos.y += this.vy * dt;

      if (pos.y <= 0) {
        const impact = Math.min(1, Math.abs(this.vy) / 11);
        pos.y = 0;
        this.vy = 0;
        this.grounded = true;
        this.player.land(impact);
        this.dust.spawn(pos.x, pos.z, 2 + Math.round(impact * 3));
      }
    }

    // Boundary
    const r = Math.hypot(pos.x, pos.z);
    if (r > BOUNDS) {
      pos.x *= BOUNDS / r;
      pos.z *= BOUNDS / r;
    }

    // Collisions
    for (const c of this.world.colliders) {
      if (c.r > 5 && this.world.isOverBridge(pos.x, pos.z)) {
        continue;
      }
      const dx = pos.x - c.x;
      const dz = pos.z - c.z;
      const d = Math.hypot(dx, dz);
      const min = c.r + PLAYER_RADIUS;
      if (d < min && d > 0.0001) {
        pos.x = c.x + (dx / d) * min;
        pos.z = c.z + (dz / d) * min;
      }
    }

    // Animation update
    const speedRatio = this.vel.length() / MAX_SPEED;
    if (speedRatio > 0.06) {
      this.player.turnTowards(Math.atan2(this.vel.x, this.vel.z), dt);
    }
    this.player.update(dt, speedRatio, this.elapsed, !this.grounded, this.vy);

    // Dust timer
    this.dustTimer -= dt;
    if (this.grounded && speedRatio > 0.4 && this.dustTimer <= 0) {
      this.dust.spawn(pos.x, pos.z);
      this.dustTimer = 0.12;
    }
    this.dust.update(dt);

    this.world.update(this.elapsed, dt);

    // Camera follow with smooth damping
    const cp = Math.cos(this.camPitch);
    this.camOffset.set(
      this.camDist * cp * Math.sin(this.camYaw),
      this.camDist * Math.sin(this.camPitch),
      this.camDist * cp * Math.cos(this.camYaw)
    );
    this.desired.copy(pos).add(this.camOffset);
    this.camera.position.lerp(this.desired, 1 - Math.exp(-dt * 5.5));
    this.lookTarget.lerp(pos, 1 - Math.exp(-dt * 7));
    this.camera.lookAt(this.lookTarget.x, this.lookTarget.y + 0.85, this.lookTarget.z);

    // Sun target tracking
    this.sun.position.copy(pos).add(SUN_OFFSET);
    this.sun.target.position.copy(pos);

    // Render
    this.renderer.render(this.scene, this.camera);

    if (!this.ready) {
      this.ready = true;
      this.onReady?.();
    }
  };

  dispose() {
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('orientationchange', this.onResize);
    this.container.removeEventListener('contextmenu', this.onContextMenu);
    this.container.removeEventListener('mousedown', this.onMouseDown);
    this.container.removeEventListener('wheel', this.onWheel);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('pointerlockchange', this.onLockChange);
    this.container.removeEventListener('touchstart', this.onTouchStart);
    this.container.removeEventListener('touchmove', this.onTouchMove);
    this.container.removeEventListener('touchend', this.onTouchEnd);
    this.container.removeEventListener('touchcancel', this.onTouchEnd);
    this.envTexture?.dispose();
    this.player.dispose();
    this.world.dispose();
    this.dust.dispose();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
