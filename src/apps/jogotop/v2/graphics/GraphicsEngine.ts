import * as THREE from 'three';
import {
  GraphicsCapabilities,
  GraphicsDiagnosticsSnapshot,
  GraphicsProfileConfig,
  PlayerSnapshot,
  WorldDefinitionData,
} from '../types';
import { CameraRig } from './CameraRig';
import { EffectsView } from './EffectsView';
import { GeometryCatalog } from './GeometryCatalog';
import { GraphicsDiagnostics } from './GraphicsDiagnostics';
import { resolveGraphicsProfile } from './GraphicsProfile';
import { MaterialPalette } from './MaterialPalette';
import { PlayerView } from './PlayerView';
import { ResourceRegistry } from './ResourceRegistry';
import { WorldView } from './WorldView';

export class GraphicsEngine {
  private container: HTMLElement | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private scene = new THREE.Scene();
  private registry = new ResourceRegistry();
  private diagnostics = new GraphicsDiagnostics();

  public cameraRig: CameraRig | null = null;
  public worldView: WorldView | null = null;
  public playerView: PlayerView | null = null;
  public effectsView: EffectsView | null = null;
  public palette: MaterialPalette | null = null;
  public catalog: GeometryCatalog | null = null;

  public profile: GraphicsProfileConfig;
  private resizeObserver: ResizeObserver | null = null;
  private resizeRafId = 0;
  private elapsed = 0;
  private testMode: 'none' | 'minimal' | 'world' | 'player' | 'orbit' = 'none';

  private contextLossTimestamps: number[] = [];
  private disposed = false;

  constructor(private worldData: WorldDefinitionData) {
    this.profile = resolveGraphicsProfile();
    this.detectTestMode();
  }

  private detectTestMode() {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const test = params.get('graphicsTest');
      if (test === 'minimal' || test === 'world' || test === 'player' || test === 'orbit') {
        this.testMode = test;
      }
    }
  }

  public async initialize(container: HTMLElement): Promise<GraphicsCapabilities> {
    this.container = container;
    this.diagnostics.setState('booting');

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, this.profile.maxDpr);

    // Initialize WebGLRenderer with mobile-safe baseline flags
    this.renderer = new THREE.WebGLRenderer({
      alpha: false,
      antialias: false,
      stencil: false,
      preserveDrawingBuffer: false,
      powerPreference: 'default',
    });

    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.NoToneMapping;
    this.renderer.setClearColor(0x8ecdf5, 1.0);
    this.scene.background = new THREE.Color(0x8ecdf5);

    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(width, height, false);
    container.appendChild(this.renderer.domElement);

    // Setup Context Loss handling
    const dom = this.renderer.domElement;
    dom.addEventListener('webglcontextlost', this.onContextLost, false);
    dom.addEventListener('webglcontextrestored', this.onContextRestored, false);

    // Create subsystems
    this.palette = new MaterialPalette(this.registry);
    this.catalog = new GeometryCatalog(this.registry);
    this.cameraRig = new CameraRig(width, height);
    this.cameraRig.setInitialPosition(
      this.worldData.spawnPosition[0],
      this.worldData.spawnPosition[1],
      this.worldData.spawnPosition[2],
      this.worldData.spawnYaw
    );
    this.cameraRig.attach(this.container);

    // Build scene based on test mode
    this.buildScene();

    // Setup responsive ResizeObserver
    this.setupResizeObserver();

    this.diagnostics.setProfile(this.profile.name, dpr, width, height);
    this.diagnostics.setState('ready');

    return {
      isWebGL2: this.renderer.capabilities.isWebGL2,
      profile: this.profile.name,
      dpr,
      width,
      height,
    };
  }

  private buildScene() {
    if (!this.palette || !this.catalog) return;

    if (this.testMode === 'minimal') {
      // Minimal test mode: single shaded box
      const cubeGeo = this.registry.trackGeometry(new THREE.BoxGeometry(2, 2, 2));
      const cube = new THREE.Mesh(cubeGeo, this.palette.hoodieRed);
      cube.position.set(0, 1, 0);
      this.scene.add(cube);
      return;
    }

    if (this.testMode === 'player') {
      // Ground only + player
      const groundGeo = this.registry.trackGeometry(new THREE.CircleGeometry(20, 32).rotateX(-Math.PI / 2));
      const ground = new THREE.Mesh(groundGeo, this.palette.grassInner);
      this.scene.add(ground);

      this.playerView = new PlayerView(this.palette, this.registry);
      this.scene.add(this.playerView.group);
      return;
    }

    // World mode, Orbit mode, or Default standard mode
    this.worldView = new WorldView(this.worldData, this.palette, this.catalog, this.registry, this.profile);
    this.scene.add(this.worldView.group);

    if (this.testMode !== 'world') {
      this.playerView = new PlayerView(this.palette, this.registry);
      this.scene.add(this.playerView.group);

      this.effectsView = new EffectsView(this.palette, this.registry);
      this.scene.add(this.effectsView.group);
    }
  }

  private setupResizeObserver() {
    if (!this.container || typeof ResizeObserver === 'undefined') return;

    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          if (this.resizeRafId) cancelAnimationFrame(this.resizeRafId);
          this.resizeRafId = requestAnimationFrame(() => {
            this.resize(Math.floor(width), Math.floor(height));
          });
        }
      }
    });

    this.resizeObserver.observe(this.container);

    if (typeof window !== 'undefined' && window.visualViewport) {
      window.visualViewport.addEventListener('resize', this.onVisualViewportResize);
    }
  }

  private onVisualViewportResize = () => {
    if (!this.container) return;
    const w = window.visualViewport?.width || this.container.clientWidth;
    const h = window.visualViewport?.height || this.container.clientHeight;
    if (w > 0 && h > 0) {
      this.resize(Math.floor(w), Math.floor(h));
    }
  };

  public resize(width: number, height: number, customDpr?: number) {
    if (!this.renderer || !this.cameraRig || width <= 0 || height <= 0 || this.disposed) return;

    const dpr = customDpr || Math.min(window.devicePixelRatio || 1, this.profile.maxDpr);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(width, height, false);
    this.cameraRig.resize(width, height);
    this.diagnostics.setProfile(this.profile.name, dpr, width, height);
  }

  public render(previous: PlayerSnapshot, current: PlayerSnapshot, alpha: number, dt: number) {
    if (!this.renderer || !this.cameraRig || this.diagnostics.state !== 'ready' || this.disposed) {
      return;
    }

    this.diagnostics.beginFrame();
    this.elapsed += dt;

    // In orbit test mode, automatically spin camera and simulate player movement
    if (this.testMode === 'orbit') {
      this.cameraRig.yaw += dt * 0.5;
    }

    // 1. Render Player View
    if (this.playerView) {
      this.playerView.render(previous, current, alpha, dt);
    }

    // 2. Update Camera follow
    const px = previous.position[0] + (current.position[0] - previous.position[0]) * alpha;
    const py = previous.position[1] + (current.position[1] - previous.position[1]) * alpha;
    const pz = previous.position[2] + (current.position[2] - previous.position[2]) * alpha;
    this.cameraRig.update([px, py, pz], dt);

    // 3. Update World Animations
    if (this.worldView) {
      this.worldView.update(this.elapsed, dt);
    }

    // 4. Update Effects
    if (this.effectsView) {
      this.effectsView.update(dt);
    }

    // 5. Render Scene
    this.renderer.render(this.scene, this.cameraRig.camera);

    this.diagnostics.endFrame(this.renderer);
  }

  private onContextLost = (e: Event) => {
    e.preventDefault();
    const now = Date.now();
    this.contextLossTimestamps.push(now);

    // Filter to last 60 seconds
    this.contextLossTimestamps = this.contextLossTimestamps.filter((t) => now - t <= 60000);

    this.diagnostics.recordContextLoss();

    if (this.contextLossTimestamps.length >= 3) {
      console.error('Fatal WebGL error: 3 context losses occurred in 60 seconds.');
      this.diagnostics.setState('fatal');
    }
  };

  private onContextRestored = () => {
    if (this.diagnostics.state === 'fatal' || this.disposed) return;
    console.info('WebGL Context Restored. Rebuilding scene graph.');
    this.diagnostics.recordContextRestored();
    this.buildScene();
  };

  public getDiagnostics(): GraphicsDiagnosticsSnapshot {
    return this.diagnostics.getSnapshot();
  }

  // Debug methods for automated testing of context loss
  public forceContextLoss() {
    if (this.renderer) {
      this.renderer.forceContextLoss();
    }
  }

  public forceContextRestore() {
    if (this.renderer) {
      this.renderer.forceContextRestore();
    }
  }

  public dispose() {
    if (this.disposed) return;
    this.disposed = true;

    if (this.resizeRafId) cancelAnimationFrame(this.resizeRafId);
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    if (typeof window !== 'undefined' && window.visualViewport) {
      window.visualViewport.removeEventListener('resize', this.onVisualViewportResize);
    }

    if (this.renderer) {
      const dom = this.renderer.domElement;
      dom.removeEventListener('webglcontextlost', this.onContextLost);
      dom.removeEventListener('webglcontextrestored', this.onContextRestored);
      dom.remove();
      this.renderer.dispose();
      this.renderer = null;
    }

    this.cameraRig?.detach();
    this.worldView?.dispose();
    this.playerView?.dispose();
    this.effectsView?.dispose();
    this.registry.dispose();
    this.scene.clear();
  }
}
