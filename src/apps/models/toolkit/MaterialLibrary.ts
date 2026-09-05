import * as THREE from 'three';
import { createProceduralFoliageTexture, createProceduralStoneTextures, createNormalMapFromHeight } from './ProceduralTextures';

class MaterialLibraryClass {
  private barkMaterial: THREE.MeshStandardMaterial | null = null;
  private foliageMaterial: THREE.MeshStandardMaterial | null = null;
  private stoneMaterial: THREE.MeshStandardMaterial | null = null;
  private rustedIronMaterial: THREE.MeshStandardMaterial | null = null;

  public getBarkMaterial(): THREE.MeshStandardMaterial {
    if (!this.barkMaterial) {
      const loader = new THREE.TextureLoader();

      // Load ChatGPT-generated 4K/1024x1024 high-res bark texture
      const barkDiffuse = loader.load(
        '/textures/ancient_oak_bark.png',
        (tex) => {
          tex.wrapS = THREE.RepeatWrapping;
          tex.wrapT = THREE.RepeatWrapping;

          // Generate Sobel Normal Map dynamically from the loaded image
          const img = tex.image as HTMLImageElement;
          if (img && img.width > 0 && img.height > 0) {
            const canvas = document.createElement('canvas');
            canvas.width = Math.min(img.width, 1024);
            canvas.height = Math.min(img.height, 1024);
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              const heightBuffer = new Float32Array(canvas.width * canvas.height);
              for (let i = 0; i < heightBuffer.length; i++) {
                const r = imgData.data[i * 4];
                const g = imgData.data[i * 4 + 1];
                const b = imgData.data[i * 4 + 2];
                heightBuffer[i] = (0.299 * r + 0.587 * g + 0.114 * b) / 255.0;
              }
              const normalTex = createNormalMapFromHeight(heightBuffer, canvas.width, canvas.height, 2.5);
              normalTex.wrapS = THREE.RepeatWrapping;
              normalTex.wrapT = THREE.RepeatWrapping;
              if (this.barkMaterial) {
                this.barkMaterial.normalMap = normalTex;
                this.barkMaterial.normalScale.set(1.0, 1.0);
                this.barkMaterial.needsUpdate = true;
              }
            }
          }
        }
      );
      barkDiffuse.wrapS = THREE.RepeatWrapping;
      barkDiffuse.wrapT = THREE.RepeatWrapping;

      this.barkMaterial = new THREE.MeshStandardMaterial({
        map: barkDiffuse,
        roughness: 0.88,
        metalness: 0.02,
        name: 'PBR_ChatGPTOakBark',
      });
    }
    return this.barkMaterial;
  }

  public getFoliageMaterial(): THREE.MeshStandardMaterial {
    if (!this.foliageMaterial) {
      const loader = new THREE.TextureLoader();

      // Load ChatGPT-generated Stylized Hand-Painted Game Foliage Texture (1254x1254)
      const foliageDiffuse = loader.load(
        '/textures/stylized_oak_leaves.png',
        (tex) => {
          tex.wrapS = THREE.RepeatWrapping;
          tex.wrapT = THREE.RepeatWrapping;

          // Subtle relief normal map for stylized leaf clusters
          const img = tex.image as HTMLImageElement;
          if (img && img.width > 0 && img.height > 0) {
            const canvas = document.createElement('canvas');
            canvas.width = Math.min(img.width, 1024);
            canvas.height = Math.min(img.height, 1024);
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              const heightBuffer = new Float32Array(canvas.width * canvas.height);
              for (let i = 0; i < heightBuffer.length; i++) {
                const r = imgData.data[i * 4];
                const g = imgData.data[i * 4 + 1];
                const b = imgData.data[i * 4 + 2];
                heightBuffer[i] = (0.299 * r + 0.587 * g + 0.114 * b) / 255.0;
              }
              const normalTex = createNormalMapFromHeight(heightBuffer, canvas.width, canvas.height, 1.8);
              normalTex.wrapS = THREE.RepeatWrapping;
              normalTex.wrapT = THREE.RepeatWrapping;
              if (this.foliageMaterial) {
                this.foliageMaterial.normalMap = normalTex;
                this.foliageMaterial.normalScale.set(0.6, 0.6);
                this.foliageMaterial.needsUpdate = true;
              }
            }
          }
        }
      );
      foliageDiffuse.wrapS = THREE.RepeatWrapping;
      foliageDiffuse.wrapT = THREE.RepeatWrapping;

      this.foliageMaterial = new THREE.MeshStandardMaterial({
        map: foliageDiffuse,
        roughness: 0.65,
        metalness: 0.0,
        vertexColors: true,
        name: 'PBR_StylizedGameFoliage',
      });
    }
    return this.foliageMaterial;
  }

  public getStoneMaterial(): THREE.MeshStandardMaterial {
    if (!this.stoneMaterial) {
      const tex = createProceduralStoneTextures(512);
      this.stoneMaterial = new THREE.MeshStandardMaterial({
        map: tex.map,
        normalMap: tex.normalMap,
        normalScale: new THREE.Vector2(1.5, 1.5),
        roughness: 0.9,
        metalness: 0.05,
        name: 'PBR_MossyStone',
      });
    }
    return this.stoneMaterial;
  }

  public getRustedIronMaterial(): THREE.MeshStandardMaterial {
    if (!this.rustedIronMaterial) {
      this.rustedIronMaterial = new THREE.MeshStandardMaterial({
        color: 0x4a433e,
        roughness: 0.75,
        metalness: 0.65,
        name: 'PBR_RustedIron',
      });
    }
    return this.rustedIronMaterial;
  }
}

export const MaterialLibrary = new MaterialLibraryClass();
