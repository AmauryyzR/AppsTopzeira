import * as THREE from 'three';
import { CameraRig } from './CameraRig';
import { ParkWorld } from './ParkWorld';
import { PlayerCharacter } from './PlayerCharacter';
import { PhysicsSimulation } from './PhysicsSimulation';
import { InputManager } from '../input/InputManager';

export class GameEngine {
  public readonly scene: THREE.Scene;
  public readonly renderer: THREE.WebGLRenderer;
  public readonly cameraRig: CameraRig;
  public readonly parkWorld: ParkWorld;
  public readonly playerCharacter: PlayerCharacter;
  public readonly physics: PhysicsSimulation;
  public readonly input: InputManager;

  private container: HTMLElement;
  private resizeObserver: ResizeObserver | null = null;
  private animFrameId: number | null = null;
  private lastTime = 0;
  private isDisposed = false;

  constructor(container: HTMLElement, input: InputManager, onReady?: () => void) {
    this.container = container;
    this.input = input;

    // 1. Scene & Atmosphere
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x7dc5f5);
    this.scene.fog = new THREE.FogExp2(0x9bd8ff, 0.008);

    // 2. Camera Rig
    const aspect = container.clientWidth / (container.clientHeight || 1);
    this.cameraRig = new CameraRig(58, aspect, 0.1, 400);
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
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const width = Math.max(320, container.clientWidth);
    const height = Math.max(240, container.clientHeight);
    this.renderer.setSize(width, height, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    container.appendChild(this.renderer.domElement);

    // 4. Lighting Rig
    this.setupLighting();

    // 5. 3D Park World & Player Character
    this.parkWorld = new ParkWorld();
    this.scene.add(this.parkWorld.group);

    this.playerCharacter = new PlayerCharacter();
    this.scene.add(this.playerCharacter.group);

    this.physics = new PhysicsSimulation(0, 0, 8);

    // 6. Responsive Resize Handling
    this.resizeObserver = new ResizeObserver(() => this.handleResize());
    this.resizeObserver.observe(container);

    // 7. Start Animation Loop
    this.lastTime = performance.now();
    this.loop();

    onReady?.();
  }

  private setupLighting() {
    // Hemispheric Ambient Light (Soft sky and grass bounce)
    const hemiLight = new THREE.HemisphereLight(0xfff7ed, 0x3d7e35, 0.9);
    hemiLight.position.set(0, 50, 0);
    this.scene.add(hemiLight);

    // Directional Sunlight with Soft Shadows
    const sunLight = new THREE.DirectionalLight(0xfffaed, 1.8);
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

    // Subtle Fill Light from opposite angle
    const fillLight = new THREE.DirectionalLight(0xbae6fd, 0.5);
    fillLight.position.set(-35, 40, -35);
    this.scene.add(fillLight);
  }

  private handleResize() {
    if (!this.container || this.isDisposed) return;
    const w = this.container.clientWidth || 320;
    const h = this.container.clientHeight || 240;

    this.cameraRig.camera.aspect = w / h;
    this.cameraRig.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
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
    this.playerCharacter.updateAnimation(this.physics.speed, this.physics.isGrounded, dt);

    // 4. Update Roblox-Style Orbital Camera
    this.cameraRig.update(this.physics.position, dt);

    // 5. Render Scene
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
    this.cameraRig.dispose();
    this.parkWorld.dispose();
    this.playerCharacter.dispose();
    this.renderer.dispose();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
