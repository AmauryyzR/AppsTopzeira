import * as THREE from 'three';

export interface Disposable {
  dispose(): void;
}

export class ResourceRegistry {
  private geometries = new Set<THREE.BufferGeometry>();
  private materials = new Set<THREE.Material>();
  private textures = new Set<THREE.Texture>();
  private customDisposables = new Set<Disposable>();

  public trackGeometry<T extends THREE.BufferGeometry>(geo: T): T {
    this.geometries.add(geo);
    return geo;
  }

  public trackMaterial<T extends THREE.Material>(mat: T): T {
    this.materials.add(mat);
    return mat;
  }

  public trackTexture<T extends THREE.Texture>(tex: T): T {
    this.textures.add(tex);
    return tex;
  }

  public trackDisposable<T extends Disposable>(disp: T): T {
    this.customDisposables.add(disp);
    return disp;
  }

  public trackMesh<T extends THREE.Mesh>(mesh: T): T {
    if (mesh.geometry) {
      this.trackGeometry(mesh.geometry);
    }
    if (mesh.material) {
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((m) => this.trackMaterial(m));
      } else {
        this.trackMaterial(mesh.material);
      }
    }
    return mesh;
  }

  public trackObjectTree(root: THREE.Object3D) {
    root.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.geometry) {
        this.trackGeometry(mesh.geometry);
      }
      if (mesh.material) {
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => this.trackMaterial(m));
        } else {
          this.trackMaterial(mesh.material);
        }
      }
    });
  }

  public getGeometryCount(): number {
    return this.geometries.size;
  }

  public getMaterialCount(): number {
    return this.materials.size;
  }

  public getTextureCount(): number {
    return this.textures.size;
  }

  public dispose() {
    // 1. Dispose custom disposables
    for (const d of this.customDisposables) {
      try {
        d.dispose();
      } catch (err) {
        console.warn('Error disposing custom resource:', err);
      }
    }
    this.customDisposables.clear();

    // 2. Dispose textures
    for (const tex of this.textures) {
      try {
        tex.dispose();
      } catch (err) {
        console.warn('Error disposing texture:', err);
      }
    }
    this.textures.clear();

    // 3. Dispose materials
    for (const mat of this.materials) {
      try {
        mat.dispose();
      } catch (err) {
        console.warn('Error disposing material:', err);
      }
    }
    this.materials.clear();

    // 4. Dispose geometries
    for (const geo of this.geometries) {
      try {
        geo.dispose();
      } catch (err) {
        console.warn('Error disposing geometry:', err);
      }
    }
    this.geometries.clear();
  }
}
