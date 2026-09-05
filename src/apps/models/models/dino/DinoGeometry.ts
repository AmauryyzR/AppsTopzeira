import * as THREE from 'three';
import { mergeGeometries, mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { DinoRig } from './DinoRig';

export const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
export type WeightFunction = (point: THREE.Vector3) => [number, number][];

export function ellipsoid(position: number[], scale: number[], segments = 28, rings = 20) {
  const geo = new THREE.SphereGeometry(1, segments, rings);
  geo.scale(scale[0], scale[1], scale[2]);
  geo.translate(position[0], position[1], position[2]);
  return geo;
}

/** Smooth tapered tube, with a closed tip, for soft sleeves, locks of hair and the tail. */
export function sweep(points: THREE.Vector3[], radii: number[], radial = 20, steps = 28, flatten = 1) {
  const curve = new THREE.CatmullRomCurve3(points);
  const frames = curve.computeFrenetFrames(steps, false);
  const positions: number[] = [], uv: number[] = [], indices: number[] = [];
  for (let row = 0; row <= steps; row++) {
    const t = row / steps;
    const p = curve.getPointAt(t);
    const f = t * (radii.length - 1), i = Math.min(Math.floor(f), radii.length - 2);
    const r = THREE.MathUtils.lerp(radii[i], radii[i + 1], f - i);
    for (let col = 0; col <= radial; col++) {
      const a = col / radial * Math.PI * 2;
      const q = p.clone().addScaledVector(frames.normals[row], Math.cos(a) * r).addScaledVector(frames.binormals[row], Math.sin(a) * r * flatten);
      positions.push(q.x, q.y, q.z); uv.push(col / radial, t);
      if (row < steps && col < radial) {
        const k = row * (radial + 1) + col;
        indices.push(k, k + 1, k + radial + 1, k + 1, k + radial + 2, k + radial + 1);
      }
    }
  }
  for (const row of [0, steps]) {
    const p = curve.getPointAt(row / steps), center = positions.length / 3;
    positions.push(p.x, p.y, p.z); uv.push(.5, .5);
    const base = row * (radial + 1);
    for (let i = 0; i < radial; i++) {
      if (row === 0) indices.push(center, base + i + 1, base + i);
      else indices.push(center, base + i, base + i + 1);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(indices); geo.computeVertexNormals();
  const normals = geo.getAttribute('normal');
  for (let row = 0; row <= steps; row++) {
    const first = row * (radial + 1), last = first + radial;
    const n = v(0, 0, 0).fromBufferAttribute(normals, first).add(v(0, 0, 0).fromBufferAttribute(normals, last)).normalize();
    normals.setXYZ(first, n.x, n.y, n.z); normals.setXYZ(last, n.x, n.y, n.z);
  }
  return geo;
}

export function roundedPanel(width: number, height: number, depth: number, radius = .06) {
  const shape = new THREE.Shape();
  const x = -width / 2, y = -height / 2, r = Math.min(radius, width / 3, height / 3);
  shape.moveTo(x + r, y); shape.lineTo(x + width - r, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + r);
  shape.lineTo(x + width, y + height - r); shape.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  shape.lineTo(x + r, y + height); shape.quadraticCurveTo(x, y + height, x, y + height - r);
  shape.lineTo(x, y + r); shape.quadraticCurveTo(x, y, x + r, y);
  const geo = new THREE.ExtrudeGeometry(shape, {depth, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: .015, bevelThickness: .015, curveSegments: 6});
  geo.translate(0, 0, -depth / 2);
  geo.deleteAttribute('normal');
  const smooth = mergeVertices(geo);
  smooth.computeVertexNormals(); geo.dispose();
  return smooth;
}

/** Sewn, softly rounded triangular plates and ivory costume teeth. */
export function softSpike(width: number, height: number, depth: number) {
  const shape = new THREE.Shape();
  shape.moveTo(-width / 2, 0);
  shape.quadraticCurveTo(-width * .46, height * .35, -width * .13, height * .89);
  shape.quadraticCurveTo(0, height * 1.07, width * .15, height * .88);
  shape.quadraticCurveTo(width * .45, height * .38, width / 2, 0);
  shape.quadraticCurveTo(0, -height * .09, -width / 2, 0);
  const bevel = Math.min(width, height, depth) * .22;
  const geo = new THREE.ExtrudeGeometry(shape, {depth, bevelEnabled: true, bevelSegments: 3, bevelSize: bevel, bevelThickness: bevel, curveSegments: 7, steps: 1});
  geo.translate(0, 0, -depth / 2);
  geo.deleteAttribute('normal');
  const smooth = mergeVertices(geo);
  smooth.computeVertexNormals(); geo.dispose();
  return smooth;
}

export class SkinBuilder {
  private buckets = new Map<THREE.Material, THREE.BufferGeometry[]>();
  constructor(private rig: DinoRig) {}

  add(geometry: THREE.BufferGeometry, material: THREE.Material, binding: string | WeightFunction) {
    const geo = geometry.index ? geometry.toNonIndexed() : geometry;
    geo.normalizeNormals();
    const positions = geo.getAttribute('position');
    if (!geo.hasAttribute('uv')) geo.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(positions.count * 2), 2));
    if (!geo.hasAttribute('color')) geo.setAttribute('color', new THREE.Float32BufferAttribute(new Float32Array(positions.count * 3).fill(1), 3));
    const indices: number[] = [], weights: number[] = [];
    const point = new THREE.Vector3();
    for (let i = 0; i < positions.count; i++) {
      point.fromBufferAttribute(positions, i);
      const influences = typeof binding === 'string' ? [[this.rig.index[binding], 1]] : binding(point);
      for (let n = 0; n < 4; n++) {
        indices.push(influences[n]?.[0] ?? 0);
        weights.push(influences[n]?.[1] ?? 0);
      }
    }
    geo.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(indices, 4));
    geo.setAttribute('skinWeight', new THREE.Float32BufferAttribute(weights, 4));
    const bucket = this.buckets.get(material) ?? [];
    bucket.push(geo); this.buckets.set(material, bucket);
    if (geo !== geometry) geometry.dispose();
  }

  finish(group: THREE.Group) {
    group.add(this.rig.bones[0]); group.updateMatrixWorld(true);
    this.rig.skeleton.calculateInverses();
    let triangles = 0;
    for (const [material, pieces] of this.buckets) {
      const merged = mergeGeometries(pieces, false)!;
      const geo = mergeVertices(merged);
      merged.dispose();
      triangles += (geo.index?.count ?? geo.getAttribute('position').count) / 3;
      const mesh = new THREE.SkinnedMesh(geo, material);
      mesh.name = `Dino_${material.name}`;
      mesh.castShadow = true; mesh.receiveShadow = true;
      // Animated appendages can exceed the rest-pose sphere.
      mesh.frustumCulled = false;
      group.add(mesh); mesh.bind(this.rig.skeleton);
      mesh.normalizeSkinWeights();
      for (const piece of pieces) piece.dispose();
    }
    if (triangles >= 100_000) throw new Error(`Dino character exceeds triangle budget: ${triangles}`);
    group.userData.triangles = triangles;
    group.userData.boneCount = this.rig.bones.length;
    group.userData.rig = 'Humanoid A-pose, Y-up, +Z forward; articulated mittens and four tail joints';
  }
}
