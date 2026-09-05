import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ModelStats, ModelStudioSettings, ShadingMode } from './types';

export class ModelStudioEngine {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;

  private keyLight!: THREE.DirectionalLight;
  private fillLight!: THREE.DirectionalLight;
  private rimLight!: THREE.DirectionalLight;
  private hemiLight!: THREE.HemisphereLight;

  private gridGroup: THREE.Group;
  private shadowPlane: THREE.Mesh;

  private currentModelGroup: THREE.Group;
  private originalMaterials: Map<THREE.Mesh, THREE.Material | THREE.Material[]>;

  private clayMaterial: THREE.MeshStandardMaterial;
  private isDisposed = false;
  private animFrameId: number | null = null;

  public settings: ModelStudioSettings = {
    shadingMode: 'material',
    showGrid: true,
    showShadows: true,
    autoRotate: false,
    backgroundColor: '#353942',
  };

  private onStatsUpdate?: (stats: ModelStats) => void;

  constructor(container: HTMLElement, onStatsUpdate?: (stats: ModelStats) => void) {
    this.container = container;
    this.onStatsUpdate = onStatsUpdate;
    this.originalMaterials = new Map();

    // 1. Scene & Background
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.settings.backgroundColor);

    // 2. Camera
    const aspect = container.clientWidth / (container.clientHeight || 1);
    this.camera = new THREE.PerspectiveCamera(42, aspect, 0.1, 500);
    this.camera.position.set(7, 5.5, 8.5);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    container.appendChild(this.renderer.domElement);

    // 4. Controls (Blender navigation)
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = true;
    this.controls.target.set(0, 2.5, 0);
    this.controls.minDistance = 1;
    this.controls.maxDistance = 100;
    this.controls.maxPolarAngle = Math.PI / 2 + 0.1; // Allow slightly below horizon

    // 5. Studio Lighting
    this.setupLighting();

    // 6. Blender-style Grid and Shadow Catcher Floor
    this.gridGroup = new THREE.Group();
    this.setupGrid();
    this.scene.add(this.gridGroup);

    const planeGeo = new THREE.PlaneGeometry(80, 80);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.32 });
    this.shadowPlane = new THREE.Mesh(planeGeo, shadowMat);
    this.shadowPlane.rotation.x = -Math.PI / 2;
    this.shadowPlane.position.y = -0.001;
    this.shadowPlane.receiveShadow = true;
    this.scene.add(this.shadowPlane);

    // 7. Model container
    this.currentModelGroup = new THREE.Group();
    this.scene.add(this.currentModelGroup);

    // 8. Shared Clay Material for Clay Shading mode
    this.clayMaterial = new THREE.MeshStandardMaterial({
      color: 0x9ca3af,
      roughness: 0.65,
      metalness: 0.0,
      flatShading: false,
    });

    // 9. Resize & Render Loop
    window.addEventListener('resize', this.onResize);
    (window as unknown as { __studioEngine: unknown }).__studioEngine = this;
    this.startLoop();
  }

  public setCameraView(pos: { x: number; y: number; z: number }, target: { x: number; y: number; z: number }): void {
    this.camera.position.set(pos.x, pos.y, pos.z);
    this.controls.target.set(target.x, target.y, target.z);
    this.controls.update();
  }

  private setupLighting(): void {
    // Key Light (Main highlight and soft shadow caster)
    this.keyLight = new THREE.DirectionalLight(0xffffff, 1.3);
    this.keyLight.position.set(8, 14, 7);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 2048;
    this.keyLight.shadow.mapSize.height = 2048;
    this.keyLight.shadow.camera.near = 0.5;
    this.keyLight.shadow.camera.far = 40;
    this.keyLight.shadow.camera.left = -10;
    this.keyLight.shadow.camera.right = 10;
    this.keyLight.shadow.camera.top = 10;
    this.keyLight.shadow.camera.bottom = -10;
    this.keyLight.shadow.bias = -0.0004;
    this.keyLight.shadow.normalBias = 0.025;
    this.scene.add(this.keyLight);

    // Fill Light (Softens opposite side shadows with sky bounce)
    this.fillLight = new THREE.DirectionalLight(0xb5ceee, 0.8);
    this.fillLight.position.set(-8, 8, -6);
    this.scene.add(this.fillLight);

    // Rim Light (Creates sharp silhouette outline edge highlights)
    this.rimLight = new THREE.DirectionalLight(0xffeedd, 0.7);
    this.rimLight.position.set(0, 9, -9);
    this.scene.add(this.rimLight);

    // Ambient / Hemisphere Light (Warm sky / soft ground bounce for natural under-canopy fill)
    this.hemiLight = new THREE.HemisphereLight(0xe6effa, 0x50545c, 0.9);
    this.scene.add(this.hemiLight);
  }

  private setupGrid(): void {
    // 30x30 Studio Grid
    const size = 30;
    const divisions = 30;
    const gridHelper = new THREE.GridHelper(size, divisions, 0x5a606d, 0x414550);
    gridHelper.position.y = 0;
    this.gridGroup.add(gridHelper);

    // Subtle Blender-like X (Red) and Z (Green) axis lines
    const axisMaterialX = new THREE.LineBasicMaterial({ color: 0xcc4444, linewidth: 2 });
    const axisMaterialZ = new THREE.LineBasicMaterial({ color: 0x44aa55, linewidth: 2 });

    const xPoints = [new THREE.Vector3(-size / 2, 0.001, 0), new THREE.Vector3(size / 2, 0.001, 0)];
    const xGeo = new THREE.BufferGeometry().setFromPoints(xPoints);
    const xLine = new THREE.Line(xGeo, axisMaterialX);
    this.gridGroup.add(xLine);

    const zPoints = [new THREE.Vector3(0, 0.001, -size / 2), new THREE.Vector3(0, 0.001, size / 2)];
    const zGeo = new THREE.BufferGeometry().setFromPoints(zPoints);
    const zLine = new THREE.Line(zGeo, axisMaterialZ);
    this.gridGroup.add(zLine);
  }

  /**
   * Sets and centers a 3D model in the studio.
   */
  public setModel(model: THREE.Object3D, frameCamera = true): void {
    // Clean previous model
    this.clearModel();

    this.currentModelGroup.add(model);

    // Cache original materials and configure shadows
    this.originalMaterials.clear();
    model.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = this.settings.showShadows;
        mesh.receiveShadow = this.settings.showShadows;
        this.originalMaterials.set(mesh, mesh.material);
      }
    });

    // Apply active shading mode
    this.applyShadingMode(this.settings.shadingMode);

    // Calculate stats & bounding box
    const stats = this.computeStats(model);
    if (this.onStatsUpdate) {
      this.onStatsUpdate(stats);
    }

    if (frameCamera) {
      this.frameModel();
    }
  }

  public getModelGroup(): THREE.Group {
    return this.currentModelGroup;
  }

  public clearModel(): void {
    while (this.currentModelGroup.children.length > 0) {
      const child = this.currentModelGroup.children[0];
      this.currentModelGroup.remove(child);
    }
    this.originalMaterials.clear();
  }

  /**
   * Focuses and smoothly centers camera on current model bounds.
   */
  public frameModel(): void {
    if (this.currentModelGroup.children.length === 0) {
      this.controls.target.set(0, 1.5, 0);
      this.camera.position.set(7, 5.5, 8.5);
      this.controls.update();
      return;
    }

    const box = new THREE.Box3().setFromObject(this.currentModelGroup);
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(size);

    const maxDim = Math.max(size.x / Math.min(this.camera.aspect, 1), size.y, size.z, 2);
    const fov = this.camera.fov * (Math.PI / 180);
    let cameraDistance = maxDim / (2 * Math.tan(fov / 2));
    cameraDistance *= 1.35; // margin

    this.controls.target.copy(center);

    const previewDirection = this.currentModelGroup.children[0]?.userData.previewDirection;
    const dir = (Array.isArray(previewDirection)
      ? new THREE.Vector3().fromArray(previewDirection)
      : new THREE.Vector3(1, 0.7, 1.2)).normalize();
    this.camera.position.copy(center).addScaledVector(dir, cameraDistance);
    this.camera.near = Math.max(0.05, cameraDistance / 50);
    this.camera.far = Math.max(200, cameraDistance * 30);
    this.camera.updateProjectionMatrix();

    this.controls.update();
  }

  /**
   * Computes polygon count, vertex count, and bounding box dimensions.
   */
  private computeStats(object: THREE.Object3D): ModelStats {
    let vertices = 0;
    let triangles = 0;
    let meshCount = 0;

    object.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        meshCount++;
        const mesh = child as THREE.Mesh;
        const geo = mesh.geometry;
        if (geo) {
          const pos = geo.getAttribute('position');
          if (pos) {
            vertices += pos.count;
          }
          if (geo.index) {
            triangles += geo.index.count / 3;
          } else if (pos) {
            triangles += pos.count / 3;
          }
        }
      }
    });

    const box = new THREE.Box3().setFromObject(object);
    const size = new THREE.Vector3();
    box.getSize(size);

    return {
      vertices,
      triangles: Math.round(triangles),
      meshCount,
      dimensions: {
        width: Number(size.x.toFixed(2)),
        height: Number(size.y.toFixed(2)),
        depth: Number(size.z.toFixed(2)),
      },
    };
  }

  /**
   * Updates Shading Mode: 'material' | 'clay' | 'wireframe'
   */
  public setShadingMode(mode: ShadingMode): void {
    this.settings.shadingMode = mode;
    this.applyShadingMode(mode);
  }

  private applyShadingMode(mode: ShadingMode): void {
    this.currentModelGroup.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const origMat = this.originalMaterials.get(mesh);
        if (!origMat) return;

        if (mode === 'clay') {
          mesh.material = this.clayMaterial;
        } else if (mode === 'wireframe') {
          if (Array.isArray(origMat)) {
            mesh.material = origMat.map((m) => {
              const clone = m.clone();
              (clone as THREE.MeshStandardMaterial).wireframe = true;
              return clone;
            });
          } else {
            const clone = origMat.clone();
            (clone as THREE.MeshStandardMaterial).wireframe = true;
            mesh.material = clone;
          }
        } else {
          // 'material'
          mesh.material = origMat;
        }
      }
    });
  }

  public setGridVisible(visible: boolean): void {
    this.settings.showGrid = visible;
    this.gridGroup.visible = visible;
  }

  public setShadowsVisible(visible: boolean): void {
    this.settings.showShadows = visible;
    this.renderer.shadowMap.enabled = visible;
    this.shadowPlane.visible = visible;
    this.currentModelGroup.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = visible;
        child.receiveShadow = visible;
      }
    });
  }

  public setAutoRotate(enabled: boolean): void {
    this.settings.autoRotate = enabled;
    this.controls.autoRotate = enabled;
    this.controls.autoRotateSpeed = 2.0;
  }

  public setBackgroundColor(colorHex: string): void {
    this.settings.backgroundColor = colorHex;
    this.scene.background = new THREE.Color(colorHex);
  }

  private onResize = (): void => {
    if (!this.container || this.isDisposed) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight || 1;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  private clock = new THREE.Clock();

  private startLoop(): void {
    const loop = () => {
      if (this.isDisposed) return;
      this.animFrameId = requestAnimationFrame(loop);
      const elapsedTime = this.clock.getElapsedTime();

      // Update uTime on materials supporting wind sway
      this.currentModelGroup.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          const mat = mesh.material;
          if (Array.isArray(mat)) {
            mat.forEach((m) => {
              if (m?.userData?.shader?.uniforms?.uTime) {
                m.userData.shader.uniforms.uTime.value = elapsedTime;
              }
            });
          } else if (mat && (mat as any).userData?.shader?.uniforms?.uTime) {
            (mat as any).userData.shader.uniforms.uTime.value = elapsedTime;
          }
        }
      });

      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    };
    loop();
  }

  public dispose(): void {
    this.isDisposed = true;
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
    }
    window.removeEventListener('resize', this.onResize);
    this.controls.dispose();
    this.renderer.dispose();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
