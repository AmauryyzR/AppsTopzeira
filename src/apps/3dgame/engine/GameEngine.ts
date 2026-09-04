import * as THREE from 'three';
import { CameraRig } from './CameraRig';
import { ParkWorld } from './ParkWorld';
import { PlayerCharacter } from './PlayerCharacter';
import { PhysicsSimulation } from './PhysicsSimulation';
import { InputManager } from '../input/InputManager';
import { SkyDome } from './shaders/SkyDomeShader';
import { disposeToonCache } from './shaders/ToonMaterial';
import { AtmosphericVFXSystem } from './vfx/AtmosphericVFXSystem';
import { GenshinDashTrailVFX } from './vfx/GenshinDashTrailVFX';
import { SoundEffectsEngine } from './audio/SoundEffectsEngine';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

export class GameEngine {
  public readonly scene: THREE.Scene;
  public readonly renderer: THREE.WebGLRenderer;
  public readonly composer: EffectComposer;
  public readonly bloomPass: UnrealBloomPass;
  public readonly smaaPass: SMAAPass;
  public readonly cameraRig: CameraRig;
  public readonly parkWorld: ParkWorld;
  public readonly playerCharacter: PlayerCharacter;
  public readonly physics: PhysicsSimulation;
  public readonly input: InputManager;
  public readonly skyDome: SkyDome;
  public readonly vfx: AtmosphericVFXSystem;
  public readonly dashVFX: GenshinDashTrailVFX;
  public readonly audio: SoundEffectsEngine;
  public sunLight!: THREE.DirectionalLight;
  public hemiLight!: THREE.HemisphereLight;
  public fillLight!: THREE.DirectionalLight;

  private container: HTMLElement;
  private resizeObserver: ResizeObserver | null = null;
  private animFrameId: number | null = null;
  private lastTime = 0;
  private isDisposed = false;
  private wasGroundedLastFrame = true;
  private footstepTimer = 0;

  constructor(container: HTMLElement, input: InputManager, onReady?: () => void) {
    this.container = container;
    this.input = input;

    // 1. Scene & Atmosphere (Genshin / BoTW Anime Horizon)
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xb8daf4);
    this.scene.fog = new THREE.Fog(0xb8daf4, 45, 250);

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
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

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

    // 4. Post-Processing Pipeline (Genshin Impact Bloom, SMAA Anti-Aliasing, ACES Tone Mapping)
    const renderTarget = new THREE.WebGLRenderTarget(width * dpr, height * dpr, {
      type: THREE.HalfFloatType,
      samples: 4,
    });
    this.composer = new EffectComposer(this.renderer, renderTarget);
    const renderPass = new RenderPass(this.scene, this.cameraRig.camera);
    this.composer.addPass(renderPass);

    // UnrealBloomPass calibrated for anime/Genshin aesthetic:
    // Threshold 0.94 ensures only high-energy rim glow, sun highlights, and paper lanterns trigger bloom,
    // keeping stone plaza, grass lawn, and water surfaces crystal-clear with punchy contrast
    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      0.18, // bloom strength (delicate anime halation)
      0.32, // bloom radius
      0.94  // bloom threshold
    );
    this.composer.addPass(this.bloomPass);

    // SMAA Subpixel Morphological Anti-Aliasing for smooth, pristine anime edges
    this.smaaPass = new SMAAPass();
    this.composer.addPass(this.smaaPass);

    const outputPass = new OutputPass();
    this.composer.addPass(outputPass);

    // 5. Lighting Rig
    this.setupLighting();

    // 5. 3D Park World & Player Character
    this.parkWorld = new ParkWorld();
    this.scene.add(this.parkWorld.group);

    this.playerCharacter = new PlayerCharacter();
    this.scene.add(this.playerCharacter.group);

    // Dynamic Cel-Shaded Atmospheric VFX (Loop 7: Sakura, Fireflies, Splashes, Dust)
    this.vfx = new AtmosphericVFXSystem();
    this.scene.add(this.vfx.group);

    // Stylized Genshin Dash & Sprint Trail VFX (Ghost After-Images, Streamers, Shockwave, Sparks)
    this.dashVFX = new GenshinDashTrailVFX(this.playerCharacter);
    this.scene.add(this.dashVFX.group);

    // Procedural Web Audio Soundscapes (Loop 9: Jump, Land, Footsteps)
    this.audio = new SoundEffectsEngine();

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
    const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x86efac, 0.70);
    hemiLight.position.set(0, 50, 0);
    this.scene.add(hemiLight);
    this.hemiLight = hemiLight;

    // Directional Sunlight with Soft Shadows (Warm welcoming anime sun)
    const sunLight = new THREE.DirectionalLight(0xfff6e6, 1.25);
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
    sunLight.shadow.bias = -0.00008;
    sunLight.shadow.normalBias = 0.05;
    sunLight.shadow.radius = 2.0;
    this.scene.add(sunLight);
    this.sunLight = sunLight;

    // Subtle Fill Light from opposite angle
    const fillLight = new THREE.DirectionalLight(0xbae6fd, 0.6);
    fillLight.position.set(-35, 40, -35);
    this.scene.add(fillLight);
    this.fillLight = fillLight;

    // Stylized Rim / Backlight for character edge pop (Blender aesthetic)
    const rimLight = new THREE.DirectionalLight(0xfff1e6, 1.1);
    rimLight.position.set(-25, 45, -40);
    this.scene.add(rimLight);
  }

  private handleResize() {
    if (!this.container || this.isDisposed) return;
    const w = this.container.clientWidth || 320;
    const h = this.container.clientHeight || 240;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.cameraRig.camera.aspect = w / h;
    this.cameraRig.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(w, h, true);
    this.composer.setSize(w, h);
    this.bloomPass.resolution.set(w, h);
    this.smaaPass.setSize(w * dpr, h * dpr);
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

    // Dash burst audio and shockwave trigger
    if (inputState.isDashTriggered) {
      this.dashVFX.triggerDashBurst(this.physics.position, this.physics.velocity);
      this.audio.playDash();
    }

    // 4. Update Roblox-Style Orbital Camera & Sprint FOV Kick
    this.cameraRig.setSprinting(inputState.isSprinting, this.physics.speed);
    this.cameraRig.update(this.physics.position, dt);

    // 5. Update Dynamic Sun & Sky Atmosphere (Loop 8: Diurnal Celestial Progression)
    const timeSec = performance.now() * 0.001;
    const sunOrbAngle = timeSec * 0.016 + 0.95;
    const sunX = Math.cos(sunOrbAngle) * 55;
    const sunY = Math.max(14, Math.sin(sunOrbAngle) * 60 + 22);
    const sunZ = Math.sin(sunOrbAngle * 0.7) * 45;
    this.sunLight.position.set(sunX, sunY, sunZ);

    this.skyDome.update(dt, this.sunLight.position, this.cameraRig.camera.position);

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

    // Stylized Genshin Dash Trail VFX (Ghost after-images, ribbon streamers, shockwave rings)
    this.dashVFX.update(
      dt,
      this.playerCharacter,
      this.physics.position,
      this.physics.velocity,
      this.physics.speed,
      inputState.isSprinting,
      this.physics.isGrounded
    );

    // 9. Procedural Web Audio Sensory Triggers (Loop 9: Jump, Land, Footsteps)
    if (!this.wasGroundedLastFrame && this.physics.isGrounded) {
      this.audio.playLand(Math.abs(this.physics.verticalVelocity));
    } else if (this.wasGroundedLastFrame && !this.physics.isGrounded && this.physics.verticalVelocity > 2.0) {
      this.audio.playJump();
    }
    this.wasGroundedLastFrame = this.physics.isGrounded;

    if (this.physics.isGrounded && this.physics.speed > 1.2) {
      this.footstepTimer += dt;
      const isSprinting = inputState.isSprinting;
      const stepInterval = isSprinting ? 0.26 : 0.36;
      if (this.footstepTimer >= stepInterval) {
        this.footstepTimer = 0;
        this.audio.playFootstep(isSprinting);
      }
    }

    // 10. Render Scene via Post-Processing Pipeline (Bloom + Tone Mapping)
    this.composer.render();

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
    this.audio.dispose();
    this.vfx.dispose();
    this.dashVFX.dispose();
    this.skyDome.dispose();
    this.cameraRig.dispose();
    this.parkWorld.dispose();
    this.playerCharacter.dispose();
    disposeToonCache();
    this.bloomPass.dispose();
    this.smaaPass.dispose();
    this.composer.dispose();
    this.renderer.dispose();
    if ((window as any).__engine === this) {
      delete (window as any).__engine;
    }
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
