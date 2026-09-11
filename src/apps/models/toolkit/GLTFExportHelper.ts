import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';

/**
 * Exports any Three.js Object3D into a binary .glb file and triggers a browser download.
 */
export async function exportToGLB(object: THREE.Object3D, fileName = 'model.glb'): Promise<void> {
  const exporter = new GLTFExporter();
  // Export a stable bind pose even when the live preview is in the middle of a jump.
  const snapshot=clone(object);
  snapshot.traverse(child=>{if((child as THREE.SkinnedMesh).isSkinnedMesh)(child as THREE.SkinnedMesh).skeleton.pose();});
  snapshot.updateMatrixWorld(true);
  const animations: THREE.AnimationClip[] = [];
  snapshot.traverse(child => animations.push(...child.animations));

  return new Promise((resolve, reject) => {
    exporter.parse(
      snapshot,
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
      { binary: true, animations }
    );
  });
}
