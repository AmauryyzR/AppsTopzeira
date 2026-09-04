import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

/**
 * Exports any Three.js Object3D into a binary .glb file and triggers a browser download.
 */
export async function exportToGLB(object: THREE.Object3D, fileName = 'model.glb'): Promise<void> {
  const exporter = new GLTFExporter();

  return new Promise((resolve, reject) => {
    exporter.parse(
      object,
      (gltf) => {
        try {
          const blob = new Blob([gltf as ArrayBuffer], { type: 'application/octet-stream' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = fileName.endsWith('.glb') ? fileName : `${fileName}.glb`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(link.href);
          resolve();
        } catch (err) {
          reject(err);
        }
      },
      (error) => {
        console.error('Error exporting GLTF:', error);
        reject(error);
      },
      { binary: true }
    );
  });
}
