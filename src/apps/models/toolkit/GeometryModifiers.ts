import * as THREE from 'three';

/**
 * Automatically applies Triplanar UV Mapping to any BufferGeometry.
 * Projects textures along X, Y, and Z axes based on normal orientation,
 * completely eliminating texture stretching on organic curves, branches, and rocks.
 */
export function applyTriplanarUVs(geometry: THREE.BufferGeometry, scale = 0.5): THREE.BufferGeometry {
  const pos = geometry.getAttribute('position');
  const norm = geometry.getAttribute('normal');
  if (!pos) return geometry;

  const count = pos.count;
  const uvs = new Float32Array(count * 2);

  const v = new THREE.Vector3();
  const n = new THREE.Vector3();

  for (let i = 0; i < count; i++) {
    v.fromBufferAttribute(pos, i);
    if (norm) {
      n.fromBufferAttribute(norm, i);
    } else {
      n.set(0, 1, 0);
    }

    const absX = Math.abs(n.x);
    const absY = Math.abs(n.y);
    const absZ = Math.abs(n.z);

    // Dominant axis projection
    if (absY > absX && absY > absZ) {
      // Top/Bottom projection (XZ)
      uvs[i * 2] = v.x * scale;
      uvs[i * 2 + 1] = v.z * scale;
    } else if (absX > absZ) {
      // Side projection (ZY)
      uvs[i * 2] = v.z * scale;
      uvs[i * 2 + 1] = v.y * scale;
    } else {
      // Front/Back projection (XY)
      uvs[i * 2] = v.x * scale;
      uvs[i * 2 + 1] = v.y * scale;
    }
  }

  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  return geometry;
}

/**
 * Displaces vertices using a 3D displacement function and recomputes normals.
 */
export function displaceGeometry(
  geometry: THREE.BufferGeometry,
  displaceFn: (x: number, y: number, z: number) => { dx: number; dy: number; dz: number }
): THREE.BufferGeometry {
  const pos = geometry.getAttribute('position');
  if (!pos) return geometry;

  const count = pos.count;
  for (let i = 0; i < count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);

    const delta = displaceFn(x, y, z);
    pos.setXYZ(i, x + delta.dx, y + delta.dy, z + delta.dz);
  }

  pos.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
}

/**
 * Extrudes a smooth, tapered organic tube along 3D guide points using CatmullRomCurve3
 * with mathematically exact Frenet frames, aligned UV mapping, and uniform texel density.
 */
export function extrudeCurvedTube(
  points: THREE.Vector3[],
  radiusBottom: number,
  radiusTop: number,
  tubularSegments = 36,
  radialSegments = 18,
  texelScale = 1.35
): THREE.BufferGeometry {
  const curve = new THREE.CatmullRomCurve3(points);
  const curveLength = curve.getLength();

  // Compute Frenet frames for smooth, twist-free radial orientation
  const frames = curve.computeFrenetFrames(tubularSegments, false);

  const numVertices = (tubularSegments + 1) * (radialSegments + 1);
  const positions = new Float32Array(numVertices * 3);
  const normals = new Float32Array(numVertices * 3);
  const uvs = new Float32Array(numVertices * 2);

  // Uniform world texel scale: 1 texture tile = 1.5m x 1.5m
  const avgRadius = (radiusBottom + radiusTop) * 0.5;
  const avgCircumference = 2 * Math.PI * avgRadius;
  const repeatAlong = Math.max(0.5, curveLength / 1.5);
  const repeatAround = Math.max(1.0, Math.max(1, Math.round(avgCircumference / 1.5)));

  let vIdx = 0;
  let uvIdx = 0;

  for (let i = 0; i <= tubularSegments; i++) {
    const t = i / tubularSegments;
    const p = curve.getPointAt(t);
    const N = frames.normals[i];
    const B = frames.binormals[i];
    const radius = radiusBottom * (1 - t) + radiusTop * t;

    for (let j = 0; j <= radialSegments; j++) {
      const uFrac = j / radialSegments;
      const angle = uFrac * Math.PI * 2;
      const sinTheta = Math.sin(angle);
      const cosTheta = Math.cos(angle);

      // Normal vector in tube cross-section plane (pointing outwards)
      const nx = N.x * cosTheta + B.x * sinTheta;
      const ny = N.y * cosTheta + B.y * sinTheta;
      const nz = N.z * cosTheta + B.z * sinTheta;

      // Position
      positions[vIdx] = p.x + nx * radius;
      positions[vIdx + 1] = p.y + ny * radius;
      positions[vIdx + 2] = p.z + nz * radius;

      // Normal
      normals[vIdx] = nx;
      normals[vIdx + 1] = ny;
      normals[vIdx + 2] = nz;

      vIdx += 3;

      // UVs:
      // U wraps circumference (X axis of bark texture)
      // V runs along branch length from trunk to tip (Y axis of bark texture - vertical fissures!)
      uvs[uvIdx] = uFrac * repeatAround;
      uvs[uvIdx + 1] = t * repeatAlong;
      uvIdx += 2;
    }
  }

  // Indices for triangle quads: Counter-Clockwise (CCW) front-facing winding
  const numIndices = tubularSegments * radialSegments * 6;
  const indices = new Uint32Array(numIndices);
  let idx = 0;

  for (let i = 0; i < tubularSegments; i++) {
    for (let j = 0; j < radialSegments; j++) {
      const a = i * (radialSegments + 1) + j;
      const b = (i + 1) * (radialSegments + 1) + j;
      const c = (i + 1) * (radialSegments + 1) + (j + 1);
      const d = i * (radialSegments + 1) + (j + 1);

      // (a, d, b) and (b, d, c) for outward-facing surface normals
      indices[idx++] = a;
      indices[idx++] = d;
      indices[idx++] = b;

      indices[idx++] = b;
      indices[idx++] = d;
      indices[idx++] = c;
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
  geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geo.setIndex(new THREE.BufferAttribute(indices, 1));

  return geo;
}

/**
 * Merges an array of geometries into one clean BufferGeometry.
 */
export function mergeBufferGeometries(geometries: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const merged = new THREE.BufferGeometry();
  let totalPos = 0;
  let totalNorm = 0;
  let totalUv = 0;
  let totalIndex = 0;

  for (const g of geometries) {
    if (g.attributes.position) totalPos += g.attributes.position.array.length;
    if (g.attributes.normal) totalNorm += g.attributes.normal.array.length;
    if (g.attributes.uv) totalUv += g.attributes.uv.array.length;
    if (g.index) totalIndex += g.index.array.length;
  }

  const posArr = new Float32Array(totalPos);
  const normArr = new Float32Array(totalNorm);
  const uvArr = new Float32Array(totalUv);
  const indexArr = totalIndex > 0 ? new Uint32Array(totalIndex) : null;

  let posOffset = 0;
  let normOffset = 0;
  let uvOffset = 0;
  let indexOffset = 0;
  let vertexOffset = 0;

  for (const g of geometries) {
    const p = g.attributes.position;
    const n = g.attributes.normal;
    const u = g.attributes.uv;
    const idx = g.index;

    if (p) {
      posArr.set(p.array, posOffset);
      posOffset += p.array.length;
    }
    if (n) {
      normArr.set(n.array, normOffset);
      normOffset += n.array.length;
    }
    if (u) {
      uvArr.set(u.array, uvOffset);
      uvOffset += u.array.length;
    }
    if (idx && indexArr) {
      for (let i = 0; i < idx.array.length; i++) {
        indexArr[indexOffset + i] = idx.array[i] + vertexOffset;
      }
      indexOffset += idx.array.length;
    }
    if (p) {
      vertexOffset += p.count;
    }
  }

  merged.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
  if (totalNorm > 0) merged.setAttribute('normal', new THREE.BufferAttribute(normArr, 3));
  if (totalUv > 0) merged.setAttribute('uv', new THREE.BufferAttribute(uvArr, 2));
  if (indexArr) merged.setIndex(new THREE.BufferAttribute(indexArr, 1));

  return merged;
}
