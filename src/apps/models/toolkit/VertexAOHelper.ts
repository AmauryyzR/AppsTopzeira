import * as THREE from 'three';

/**
 * Computes fast curvature-based Ambient Occlusion (Cavity Shading) into geometry vertex colors.
 * Darkens crevices, cracks, and interior corners for enhanced depth and realism.
 */
export function bakeCavityAO(
  geometry: THREE.BufferGeometry,
  darkness = 0.5,
  contrast = 1.6
): THREE.BufferGeometry {
  const pos = geometry.getAttribute('position');
  const norm = geometry.getAttribute('normal');
  if (!pos || !norm) return geometry;

  const count = pos.count;
  const colors = new Float32Array(count * 3);

  const v1 = new THREE.Vector3();
  const v2 = new THREE.Vector3();
  const n1 = new THREE.Vector3();

  // Simple and fast locality-based occlusion estimation
  for (let i = 0; i < count; i++) {
    v1.fromBufferAttribute(pos, i);
    n1.fromBufferAttribute(norm, i);

    let occlusion = 0;
    let samples = 0;

    // Sample neighboring vertices in buffer window
    const sampleRange = 6;
    for (let j = Math.max(0, i - sampleRange); j <= Math.min(count - 1, i + sampleRange); j++) {
      if (i === j) continue;
      v2.fromBufferAttribute(pos, j);

      const diff = v2.clone().sub(v1);
      const dist = diff.length();
      if (dist > 0.001 && dist < 1.2) {
        diff.normalize();
        // Dot product with normal: if neighbor is in front of surface normal, it occludes
        const dot = Math.max(0, n1.dot(diff));
        occlusion += dot * (1.0 - dist / 1.2);
        samples++;
      }
    }

    let ao = 1.0;
    if (samples > 0) {
      const avgOccl = Math.min(1, (occlusion / samples) * contrast);
      ao = 1.0 - avgOccl * darkness;
    }

    colors[i * 3] = ao;
    colors[i * 3 + 1] = ao;
    colors[i * 3 + 2] = ao;
  }

  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  return geometry;
}
