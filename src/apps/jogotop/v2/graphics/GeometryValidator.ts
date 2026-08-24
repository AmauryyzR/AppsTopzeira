import * as THREE from 'three';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export class GeometryValidator {
  public static validateGeometry(
    geometry: THREE.BufferGeometry,
    assetName = 'UnnamedGeometry',
    maxRadius = 140
  ): ValidationResult {
    const errors: string[] = [];

    // 1. Position attribute must exist
    const posAttr = geometry.attributes.position;
    if (!posAttr) {
      errors.push(`[${assetName}] Missing 'position' attribute.`);
      return { valid: false, errors };
    }

    if (posAttr.itemSize !== 3) {
      errors.push(`[${assetName}] 'position' attribute itemSize must be 3 (got ${posAttr.itemSize}).`);
    }

    const vertexCount = posAttr.count;
    if (vertexCount === 0) {
      errors.push(`[${assetName}] 'position' attribute has 0 vertices.`);
      return { valid: false, errors };
    }

    const posArray = posAttr.array;
    for (let i = 0; i < posArray.length; i++) {
      if (!Number.isFinite(posArray[i])) {
        errors.push(`[${assetName}] Non-finite position at index ${i} (value: ${posArray[i]}).`);
        break; // don't spam thousands of errors
      }
    }

    // 2. Normal attribute validation
    const normAttr = geometry.attributes.normal;
    if (normAttr) {
      if (normAttr.count !== vertexCount) {
        errors.push(`[${assetName}] 'normal' count (${normAttr.count}) does not match 'position' count (${vertexCount}).`);
      }
      const normArray = normAttr.array;
      for (let i = 0; i < normArray.length; i++) {
        if (!Number.isFinite(normArray[i])) {
          errors.push(`[${assetName}] Non-finite normal at index ${i} (value: ${normArray[i]}).`);
          break;
        }
      }
    }

    // 3. Color attribute validation
    const colorAttr = geometry.attributes.color;
    if (colorAttr) {
      if (colorAttr.count !== vertexCount) {
        errors.push(`[${assetName}] 'color' count (${colorAttr.count}) does not match 'position' count (${vertexCount}).`);
      }
      const colorArray = colorAttr.array;
      for (let i = 0; i < colorArray.length; i++) {
        if (!Number.isFinite(colorArray[i])) {
          errors.push(`[${assetName}] Non-finite color at index ${i} (value: ${colorArray[i]}).`);
          break;
        }
      }
    }

    // 4. Index validation
    if (geometry.index) {
      const indexArray = geometry.index.array;
      for (let i = 0; i < indexArray.length; i++) {
        const idx = indexArray[i];
        if (!Number.isInteger(idx) || idx < 0 || idx >= vertexCount) {
          errors.push(`[${assetName}] Invalid index value ${idx} at position ${i} (valid range: 0..${vertexCount - 1}).`);
          break;
        }
      }
    }

    // 5. Bounding box & sphere validation
    try {
      if (!geometry.boundingBox) geometry.computeBoundingBox();
      const bb = geometry.boundingBox;
      if (
        !bb ||
        !Number.isFinite(bb.min.x) ||
        !Number.isFinite(bb.min.y) ||
        !Number.isFinite(bb.min.z) ||
        !Number.isFinite(bb.max.x) ||
        !Number.isFinite(bb.max.y) ||
        !Number.isFinite(bb.max.z)
      ) {
        errors.push(`[${assetName}] Bounding box contains non-finite values.`);
      }

      if (!geometry.boundingSphere) geometry.computeBoundingSphere();
      const bs = geometry.boundingSphere;
      if (
        !bs ||
        !Number.isFinite(bs.center.x) ||
        !Number.isFinite(bs.center.y) ||
        !Number.isFinite(bs.center.z) ||
        !Number.isFinite(bs.radius)
      ) {
        errors.push(`[${assetName}] Bounding sphere contains non-finite values.`);
      } else if (bs.radius > maxRadius + 0.05) {
        errors.push(`[${assetName}] Bounding sphere radius (${bs.radius.toFixed(2)}) exceeds maximum allowed radius (${maxRadius}).`);
      }
    } catch (err) {
      errors.push(`[${assetName}] Failed to compute bounding volumes: ${String(err)}`);
    }

    const valid = errors.length === 0;
    if (!valid && (import.meta as any).env?.DEV) {
      console.error(`Geometry validation failed for [${assetName}]:`, errors);
    }

    return { valid, errors };
  }

  public static validateInstancedMesh(mesh: THREE.InstancedMesh, assetName = 'InstancedMesh'): ValidationResult {
    const errors: string[] = [];
    const matArray = mesh.instanceMatrix.array;

    for (let i = 0; i < mesh.count * 16; i++) {
      if (!Number.isFinite(matArray[i])) {
        errors.push(`[${assetName}] Non-finite value in instanceMatrix at index ${i}.`);
        break;
      }
    }

    if (mesh.geometry) {
      const geoRes = this.validateGeometry(mesh.geometry, `${assetName}.geometry`);
      errors.push(...geoRes.errors);
    }

    const valid = errors.length === 0;
    if (!valid && (import.meta as any).env?.DEV) {
      console.error(`InstancedMesh validation failed for [${assetName}]:`, errors);
    }

    return { valid, errors };
  }

  public static assertValid(geometry: THREE.BufferGeometry, assetName = 'UnnamedGeometry', maxRadius = 140) {
    const result = this.validateGeometry(geometry, assetName, maxRadius);
    if (!result.valid) {
      throw new Error(`GeometryValidator assertion failed for [${assetName}]: ${result.errors.join('; ')}`);
    }
  }
}
