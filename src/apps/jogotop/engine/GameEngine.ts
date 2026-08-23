import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { InputManager } from './InputManager';
import { Player } from './Player';
import { buildWorld, WorldRefs } from './WorldBuilder';

const MAX_SPEED = 5.6;
const PLAYER_RADIUS = 0.45;
const BOUNDS = 53.5;
const JUMP_SPEED = 9.0;
const G_RISE_HOLD = 20;
const G_RISE_CUT = 46;
const G_FALL = 28;

// Natural 3rd-person adventure camera (Roblox / Genshin standard)
const CAM_DIST = 9.5;
const CAM_PITCH0 = 0.42; // ~24 degrees incline
const PITCH_MIN = 0.05;
const PITCH_MAX = 1.15; // ~66 degrees max, prevents ground near-plane clipping
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

    for (let i = 0; i < 20; i++) {
      const mat = new THREE.SpriteMaterial({
        map: this.tex,
        color: 0xe0d2b4,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      });
      const sprite = new THREE.Sprite(mat);
      sprite.castShadow = false;
      sprite.receiveShadow = false;
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

  // Dedicated camera touch tracking (ignoring joystick, jump, and fullscreen buttons)
  private camTouches = new Map<number, { x: number; y: number }>();
  private initialPinchDist = 0;
  private initialPinchCamDist = 0;

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
      stencil: false,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.setSize(w, h);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setClearColor(0x8ecdf5, 1.0);
    this.scene.background = new THREE.Color(0x8ecdf5);
    container.appendChild(this.renderer.domElement);

    // Far fog
    this.scene.fog = new THREE.Fog(0x8ecdf5, 80, 250);

    // IBL Environment
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    this.scene.environment = this.envTexture;
    this.scene.environmentIntensity = 0.35;

    // Perspective Camera with near plane 0.1 to prevent any near-plane clipping
    this.camera = new THREE.PerspectiveCamera(isPortrait ? 56 : 46, w / h, 0.1, 600);
    this.camera.position.set(0, CAM_DIST * Math.sin(CAM_PITCH0), CAM_DIST * Math.cos(CAM_PITCH0));

    // Lights
    this.scene.add(new THREE.HemisphereLight(0xb5e2ff, 0x48a834, 1.0));

    // Fixed sun light covering the entire park uniformly
    this.sun = new THREE.DirectionalLight(0xfff6de, 2.5);
    this.sun.position.set(38, 60, 24);
    this.sun.target.position.set(0, 0, 0);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(2048, 2048);
    this.sun.shadow.camera.left = -58;
    this.sun.shadow.camera.right = 58;
    this.sun.shadow.camera.top = 58;
    this.sun.shadow.camera.bottom = -58;
    this.sun.shadow.camera.near = 10;
    this.sun.shadow.camera.far = 160;
    this.sun.shadow.bias = -0.0004;
    this.sun.shadow.normalBias = 0.04;
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
    this.camOffset.set(
      this.camDist * Math.cos(this.camPitch) * Math.sin(this.camYaw),
      this.camDist * Math.sin(this.camPitch),
      this.camDist * Math.cos(this.camPitch) * Math.cos(this.camYaw)
    );
    this.camera.position.copy(this.player.group.position).add(this.camOffset);

    // Desktop Mouse & Pointer Lock Listeners
    container.addEventListener('contextmenu', this.onContextMenu);
    container.addEventListener('mousedown', this.onMouseDown);
    container.addEventListener('wheel', this.onWheel, { passive: false });
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
    document.addEventListener('pointerlockchange', this.onLockChange);

    // Mobile Touch Camera Listeners (Roblox swipe to orbit & pinch to zoom)
    window.addEventListener('touchstart', this.onTouchStart, { passive: false });
    window.addEventListener('touchmove', this.onTouchMove, { passive: false });
    window.addEventListener('touchend', this.onTouchEnd, { passive: false });
    window.addEventListener('touchcancel', this.onTouchEnd, { passive: false });

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
    this.camDist = Math.min(22, Math.max(4.5, this.camDist * (1 + e.deltaY * 0.0011)));
  };

  // Dedicated Mobile Camera Touch Control (Independent from Joystick / Jump / Fullscreen UI)
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
        this.initialPinchCamDist = this.camDist;
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

        this.camYaw -= dx * TOUCH_CAM_SENS;
        this.camPitch = Math.min(PITCH_MAX, Math.max(PITCH_MIN, this.camPitch + dy * TOUCH_CAM_SENS));
      }
    } else if (this.camTouches.size >= 2) {
      const ids = Array.from(this.camTouches.keys());
      const t1 = Array.from(e.touches).find((t) => t.identifier === ids[0]);
      const t2 = Array.from(e.touches).find((t) => t.identifier === ids[1]);
      if (t1 && t2) {
        const curDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
        if (this.initialPinchDist > 0 && curDist > 10) {
          const ratio = this.initialPinchDist / curDist;
          this.camDist = Math.min(22, Math.max(4.5, this.initialPinchCamDist * ratio));
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

  private onResize = () => {
    const w = this.container.clientWidth || window.innerWidth;
    const h = this.container.clientHeight || window.innerHeight;
    const isPortrait = h > w;

    this.camera.aspect = w / h;
    this.camera.fov = isPortrait ? 56 : 46;
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

    // Synchronized Camera Follow (Zero desync, zero ground clipping!)
    const cp = Math.cos(this.camPitch);
    this.camOffset.set(
      this.camDist * cp * Math.sin(this.camYaw),
      this.camDist * Math.sin(this.camPitch),
      this.camDist * cp * Math.cos(this.camYaw)
    );

    // Single unified lerp keeps camera rigidly synchronized with target
    this.lookTarget.lerp(pos, 1 - Math.exp(-dt * 8.5));
    const targetCamPos = this.desired.copy(this.lookTarget).add(this.camOffset);
    this.camera.position.lerp(targetCamPos, 1 - Math.exp(-dt * 8.5));
    this.camera.lookAt(this.lookTarget.x, this.lookTarget.y + 1.1, this.lookTarget.z);

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
    window.removeEventListener('touchstart', this.onTouchStart);
    window.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('touchend', this.onTouchEnd);
    window.removeEventListener('touchcancel', this.onTouchEnd);
    this.envTexture?.dispose();
    this.player.dispose();
    this.world.dispose();
    this.dust.dispose();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
