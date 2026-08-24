import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { GeometryValidator } from '../graphics/GeometryValidator';

describe('GeometryValidator', () => {
  it('accepts valid geometries with proper attributes and finite bounds', () => {
    const box = new THREE.BoxGeometry(1, 1, 1);
    const result = GeometryValidator.validateGeometry(box, 'BoxTest', 140);
    expect(result.valid).toBe(true);
    expect(result.errors.length).toBe(0);
    box.dispose();
  });

  it('rejects geometries containing NaN in positions', () => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array([0, 0, 0, 1, NaN, 0, 0, 1, 0]);
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    const result = GeometryValidator.validateGeometry(geo, 'NanGeoTest', 140);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('Non-finite position'))).toBe(true);
    geo.dispose();
  });

  it('rejects geometries with out-of-range index buffer', () => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0]); // 3 vertices
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setIndex([0, 1, 99]); // index 99 is invalid (max is 2)

    const result = GeometryValidator.validateGeometry(geo, 'IndexOutOfBoundsTest', 140);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('Invalid index value 99'))).toBe(true);
    geo.dispose();
  });

  it('rejects geometries whose bounding sphere exceeds the maximum allowed radius', () => {
    const largePlane = new THREE.PlaneGeometry(500, 500);
    const result = GeometryValidator.validateGeometry(largePlane, 'GiantPlaneTest', 140);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('exceeds maximum allowed radius'))).toBe(true);
    largePlane.dispose();
  });

  it('rejects InstancedMesh containing non-finite matrices', () => {
    const geo = new THREE.BoxGeometry(1, 1, 1);
    const mat = new THREE.MeshBasicMaterial();
    const inst = new THREE.InstancedMesh(geo, mat, 2);

    const m = new THREE.Matrix4().set(1, 0, 0, Infinity, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    inst.setMatrixAt(0, m);

    const result = GeometryValidator.validateInstancedMesh(inst, 'InfiniteMatrixTest');
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('Non-finite value in instanceMatrix'))).toBe(true);

    geo.dispose();
    mat.dispose();
    inst.dispose();
  });
});
