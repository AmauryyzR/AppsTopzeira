import * as THREE from 'three';
import { CameraRig } from './CameraRig';
import { ParkWorld } from './ParkWorld';
import { PlayerCharacter } from './PlayerCharacter';
import { PhysicsSimulation } from './PhysicsSimulation';
import { InputManager } from '../input/InputManager';
import { SkyDome } from './shaders/SkyDomeShader';
import { disposeToonCache } from './shaders/ToonMaterial';
import { AtmosphericVFXSystem } from './vfx/AtmosphericVFXSystem';

export class GameEngine {
  public readonly scene: THREE.Scene;
  public readonly renderer: THREE.WebGLRenderer;
  public readonly cameraRig: CameraRig;
  public readonly parkWorld: ParkWorld;
  public readonly playerCharacter: PlayerCharacter;
  public readonly physics: PhysicsSimulation;
  public readonly input: InputManager;
  public readonly skyDome: SkyDome;
  public readonly vfx: AtmosphericVFXSystem;
  public sunLight!: THREE.DirectionalLight;

  private container: HTMLElement;
  private resizeObserver: ResizeObserver | null = null;
  private animFrameId: number | null = null;
  private lastTime = 0;
  private isDisposed = false;

  constructor(container: HTMLElement, input: InputManager, onReady?: () => void) {
    this.container = container;
    this.input = input;

    // 1. Scene & Atmosphere (Genshin / BoTW Anime Horizon)
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xc7e4fa);
    this.scene.fog = new THREE.FogExp2(0xc7e4fa, 0.0055);

    // 2. Anime Cel-Shaded SkyDome
    this.skyDome = new SkyDome();
    this.scene.add(this.skyDome.mesh);

    // 3. Camera Rig
    const aspect = container.clientWidth / (container.clientHeight || 1);
    this.cameraRig = new CameraRig(58, aspect, 0.1, 800);
    this.cameraRig.attach(container);

    // 3. High-Performance WebGL2 Renderer
    this.renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: true,
      alpha: false,
    });
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.renderer.setPixelRatio(dpr);

    const width = Math.max(320, container.clientWidth);
    const height = Math.max(240, container.clientHeight);
    this.renderer.setSize(width, height, true);

    const canvas = this.renderer.domElement;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    canvas.style.touchAction = 'none';

    container.appendChild(canvas);

    // 4. Lighting Rig
    this.setupLighting();

    // 5. 3D Park World & Player Character
    this.parkWorld = new ParkWorld();
    this.scene.add(this.parkWorld.group);

    this.playerCharacter = new PlayerCharacter();
    this.scene.add(this.playerCharacter.group);

    // Dynamic Cel-Shaded Atmospheric VFX (Loop 7: Sakura, Fireflies, Splashes, Dust)
    this.vfx = new AtmosphericVFXSystem();
    this.scene.add(this.vfx.group);

    this.physics = new PhysicsSimulation(0, 0, 8);

    // 6. Responsive Resize Handling
    this.resizeObserver = new ResizeObserver(() => this.handleResize());
    this.resizeObserver.observe(container);

    // 7. Start Animation Loop
    this.lastTime = performance.now();
    this.loop();

    (window as any).__engine = this;

    onReady?.();
  }

  private setupLighting() {
    // Hemispheric Ambient Light (Soft anime sky and grass bounce)
    const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x86efac, 1.0);
    hemiLight.position.set(0, 50, 0);
    this.scene.add(hemiLight);

    // Directional Sunlight with Soft Shadows (Warm welcoming anime sun)
    const sunLight = new THREE.DirectionalLight(0xfff6e6, 2.0);
    sunLight.position.set(45, 65, 35);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 160;
    sunLight.shadow.camera.left = -50;
    sunLight.shadow.camera.right = 50;
    sunLight.shadow.camera.top = 50;
    sunLight.shadow.camera.bottom = -50;
    sunLight.shadow.bias = -0.0003;
    this.scene.add(sunLight);
    this.sunLight = sunLight;

    // Subtle Fill Light from opposite angle
    const fillLight = new THREE.DirectionalLight(0xbae6fd, 0.6);
    fillLight.position.set(-35, 40, -35);
    this.scene.add(fillLight);

    // Stylized Rim / Backlight for character edge pop (Blender aesthetic)
    const rimLight = new THREE.DirectionalLight(0xfff1e6, 1.1);
    rimLight.position.set(-25, 45, -40);
    this.scene.add(rimLight);
  }

  private handleResize() {
    if (!this.container || this.isDisposed) return;
    const w = this.container.clientWidth || 320;
    const h = this.container.clientHeight || 240;

    this.cameraRig.camera.aspect = w / h;
    this.cameraRig.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(w, h, true);
  }

  private loop = () => {
    if (this.isDisposed) return;

    const now = performance.now();
    const dt = Math.min(0.05, Math.max(0.001, (now - this.lastTime) / 1000));
    this.lastTime = now;

    // 1. Sample Inputs
    const inputState = this.input.sampleInput();

    // 2. Step Physics with Collision Detection
    this.physics.update(inputState, this.cameraRig.yaw, this.parkWorld.collisionBoxes, dt);

    // 3. Update Character Visuals & Animation
    this.playerCharacter.setPosition(
      this.physics.position.x,
      this.physics.position.y,
      this.physics.position.z
    );
    this.playerCharacter.setFacingAngle(this.physics.facingAngle, dt);
    this.playerCharacter.updateAnimation({
      speed: this.physics.speed,
      isGrounded: this.physics.isGrounded,
      verticalVelocity: this.physics.verticalVelocity,
      jumpSquash: this.physics.jumpSquash,
      turnRate: this.physics.turnRate,
      dt,
    });

    // 4. Update Roblox-Style Orbital Camera
    this.cameraRig.update(this.physics.position, dt);

    // 5. Update Anime SkyDome & Atmosphere
    this.skyDome.update(dt, this.sunLight?.position, this.cameraRig.camera.position);

    // 6. Update Instanced Living GrassField (Wind Waves & Player Interaction)
    this.parkWorld.grassField.update(dt, this.physics.position, this.sunLight?.position);

    // 7. Update Stylized Water & Fountain Hydrodynamics (Waves, Caustics, Cascades)
    this.parkWorld.update(dt, this.sunLight?.position);

    // 8. Update Dynamic Cel-Shaded Atmospheric VFX (Sakura, Fireflies, Splashes, Dust)
    this.vfx.update(
      dt,
      this.physics.position,
      this.physics.isGrounded,
      this.physics.speed
    );

    // 9. Render Scene
    this.renderer.render(this.scene, this.cameraRig.camera);

    this.animFrameId = requestAnimationFrame(this.loop);
  };

  public respawnPlayer() {
    this.physics.reset(0, 0, 8);
  }

  public dispose() {
    this.isDisposed = true;
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    this.vfx.dispose();
    this.skyDome.dispose();
    this.cameraRig.dispose();
    this.parkWorld.dispose();
    this.playerCharacter.dispose();
    disposeToonCache();
    this.renderer.dispose();
    if ((window as any).__engine === this) {
      delete (window as any).__engine;
    }
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
