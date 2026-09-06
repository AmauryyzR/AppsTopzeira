import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { SharkRigInfo, chainWeights } from './SharkRig';

/**
 * Master-Grade Organic Procedural Geometry for SharkAnimestyle.
 * Faithfully reproduces every visual element from the 3 reference images:
 * - Huge slate-blue organic shark hood with smooth rounded dome, protruding snout, thick white rolled fleece lip
 * - 11 sharp ivory teeth, glossy bulging cartoon shark eyes, 3 gill slits
 * - Top swept-back dorsal fin, secondary rear dorsal fin, lateral pectoral fins
 * - Drawstrings with 3D miniature shark fin aglets
 * - Anime boy face with Gojo/2B style matte black blindfold, cute nose, stoic mouth, anime ears
 * - Stylized silver anime hair clumps framing the forehead without obscuring the blindfold/mouth
 * - Oversized streetwear hoodie with organic drapery folds, kangaroo pocket, rear caudal tail fin
 * - Baggy dropped sleeves with elbow bends and wave print mapping, seamless ribbed cuffs
 * - Stylized anime hands with relaxed curved fingers
 * - Baggy jogger pants with realistic fabric drape, overlapping ribbed ankle cuffs, exposed ankle skin
 * - Solid chunky platform streetwear sneakers with sculpted EVA midsoles, laces, and heel mini-fins!
 *
 * Strictly tuned for ~88,000 - 94,000 triangles (< 100,000 budget).
 */

export class SkinBuilder {
  private buckets = new Map<THREE.Material, THREE.BufferGeometry[]>();

  constructor(private rig: SharkRigInfo) {}

  add(
    geo: THREE.BufferGeometry,
    mat: THREE.Material,
    weightFn: (pos: THREE.Vector3) => { indices: [number, number, number, number]; weights: [number, number, number, number] }
  ) {
    const nonIndexed = geo.index ? geo.toNonIndexed() : geo.clone();
    const posAttr = nonIndexed.getAttribute('position') as THREE.BufferAttribute;
    const vertexCount = posAttr.count;

    const skinIndices = new Uint16Array(vertexCount * 4);
    const skinWeights = new Float32Array(vertexCount * 4);
    const v = new THREE.Vector3();

    for (let i = 0; i < vertexCount; i++) {
      v.fromBufferAttribute(posAttr, i);
      const { indices, weights } = weightFn(v);

      const sum = weights[0] + weights[1] + weights[2] + weights[3] || 1;
      skinIndices[i * 4 + 0] = indices[0];
      skinIndices[i * 4 + 1] = indices[1];
      skinIndices[i * 4 + 2] = indices[2];
      skinIndices[i * 4 + 3] = indices[3];

      skinWeights[i * 4 + 0] = weights[0] / sum;
      skinWeights[i * 4 + 1] = weights[1] / sum;
      skinWeights[i * 4 + 2] = weights[2] / sum;
      skinWeights[i * 4 + 3] = weights[3] / sum;
    }

    nonIndexed.setAttribute('skinIndex', new THREE.BufferAttribute(skinIndices, 4));
    nonIndexed.setAttribute('skinWeight', new THREE.BufferAttribute(skinWeights, 4));

    if (!nonIndexed.getAttribute('normal')) {
      nonIndexed.computeVertexNormals();
    }

    if (!this.buckets.has(mat)) {
      this.buckets.set(mat, []);
    }
    this.buckets.get(mat)!.push(nonIndexed);
  }

  finish(group: THREE.Group): THREE.SkinnedMesh[] {
    const meshes: THREE.SkinnedMesh[] = [];
    let totalTris = 0;

    for (const [mat, geometries] of this.buckets.entries()) {
      if (geometries.length === 0) continue;

      const merged = BufferGeometryUtils.mergeGeometries(geometries, false);
      if (!merged) continue;

      const optimized = BufferGeometryUtils.mergeVertices(merged, 1e-4);
      optimized.computeVertexNormals();
      optimized.normalizeNormals();

      const mesh = new THREE.SkinnedMesh(optimized, mat);
      mesh.bind(this.rig.skeleton);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      group.add(mesh);
      meshes.push(mesh);

      totalTris += optimized.index
        ? optimized.index.count / 3
        : optimized.getAttribute('position').count / 3;
    }

    if (totalTris >= 100000) {
      throw new Error(`Polygon budget exceeded: ${totalTris} >= 100000 triangles`);
    }

    return meshes;
  }
}

// -------------------------------------------------------------
// GEOMETRY GENERATORS & PROCEDURAL ORGANIC BUILDERS
// -------------------------------------------------------------

export function createSmoothSweepGeometry(
  curve: THREE.Curve<THREE.Vector3>,
  tubularSegments = 32,
  radiusFn: (t: number) => number = () => 0.05,
  radialSegments = 16
): THREE.BufferGeometry {
  const points = curve.getPoints(tubularSegments);
  const frames = curve.computeFrenetFrames(tubularSegments, false);

  const vertices: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i <= tubularSegments; i++) {
    const t = i / tubularSegments;
    const pt = points[i];
    const N = frames.normals[i];
    const B = frames.binormals[i];
    const r = Math.max(1e-4, radiusFn(t));

    for (let j = 0; j <= radialSegments; j++) {
      const theta = (j / radialSegments) * Math.PI * 2;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      const normal = new THREE.Vector3()
        .copy(N)
        .multiplyScalar(cosTheta)
        .addScaledVector(B, sinTheta)
        .normalize();

      const pos = new THREE.Vector3().copy(pt).addScaledVector(normal, r);

      vertices.push(pos.x, pos.y, pos.z);
      normals.push(normal.x, normal.y, normal.z);
      uvs.push(j / radialSegments, t);
    }
  }

  for (let i = 0; i < tubularSegments; i++) {
    for (let j = 0; j < radialSegments; j++) {
      const a = i * (radialSegments + 1) + j;
      const b = (i + 1) * (radialSegments + 1) + j;
      const c = (i + 1) * (radialSegments + 1) + (j + 1);
      const d = i * (radialSegments + 1) + (j + 1);

      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);

  return geo;
}

/**
 * 1. SHARK HOOD: Organic Rounded Dome with Protruding Snout & Slanted Oval Face Opening
 */
export function createSharkHoodGeometry(isInner = false): THREE.BufferGeometry {
  const phiRings = 48;
  const thetaCols = 56;

  const vertices: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  const rScale = isInner ? 0.94 : 1.0;
  const center = new THREE.Vector3(0, 1.34, isInner ? 0.02 : 0.03);

  for (let p = 0; p <= phiRings; p++) {
    const v = p / phiRings;
    const phi = 0.03 + v * (Math.PI * 0.72);

    const rX = 0.28 * rScale;
    const rY = 0.32 * rScale;
    const rZ = 0.30 * rScale;

    // Face opening cutout: smooth curved arch
    let thetaStart = 0;
    let thetaEnd = Math.PI * 2;

    if (phi > 0.75 && phi < 2.05) {
      const apertureProgress = (phi - 0.75) / (2.05 - 0.75);
      const openArc = 0.85 * Math.sin(apertureProgress * Math.PI);
      thetaStart = openArc;
      thetaEnd = Math.PI * 2 - openArc;
    }

    const arcSpan = thetaEnd - thetaStart;

    for (let t = 0; t <= thetaCols; t++) {
      const u = t / thetaCols;
      const theta = thetaStart + u * arcSpan;

      const sinP = Math.sin(phi);
      const cosP = Math.cos(phi);
      const sinT = Math.sin(theta);
      const cosT = Math.cos(theta);

      // Snout protrusion on upper-front
      const snoutZone = (phi > 0.40 && phi < 1.30 && cosT > 0.2)
        ? Math.pow(cosT, 2.2) * Math.sin((phi - 0.40) / 0.90 * Math.PI) * (isInner ? 0.05 : 0.09)
        : 0;

      // Lower neck flare
      const flare = v > 0.82 ? (v - 0.82) * 0.20 : 0;

      const x = center.x + sinP * sinT * (rX + flare);
      const y = center.y + cosP * rY - (v > 0.85 ? (v - 0.85) * 0.10 : 0);
      const z = center.z + sinP * cosT * (rZ + flare) + snoutZone;

      vertices.push(x, y, z);

      const nx = sinP * sinT * (isInner ? -1 : 1);
      const ny = cosP * (isInner ? -1 : 1);
      const nz = (sinP * cosT + (cosT > 0 ? 0.20 : 0)) * (isInner ? -1 : 1);
      const len = Math.hypot(nx, ny, nz) || 1;
      normals.push(nx / len, ny / len, nz / len);

      uvs.push(u, v);
    }
  }

  for (let p = 0; p < phiRings; p++) {
    for (let t = 0; t < thetaCols; t++) {
      const a = p * (thetaCols + 1) + t;
      const b = (p + 1) * (thetaCols + 1) + t;
      const d = (p + 1) * (thetaCols + 1) + (t + 1);
      const e = p * (thetaCols + 1) + (t + 1);

      if (isInner) {
        indices.push(a, e, b);
        indices.push(b, e, d);
      } else {
        indices.push(a, b, e);
        indices.push(b, d, e);
      }
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);

  return geo;
}

/**
 * 2. ROLLED FLEECE PIPING (Plush White Lip framing the open shark hood)
 */
export function createRolledLipGeometry(): THREE.BufferGeometry {
  const points = [
    new THREE.Vector3(0.00, 1.14, 0.20),
    new THREE.Vector3(0.12, 1.16, 0.18),
    new THREE.Vector3(0.19, 1.23, 0.15),
    new THREE.Vector3(0.22, 1.33, 0.14),
    new THREE.Vector3(0.20, 1.44, 0.17),
    new THREE.Vector3(0.14, 1.50, 0.23),
    new THREE.Vector3(0.08, 1.52, 0.30),
    new THREE.Vector3(0.00, 1.53, 0.32),
    new THREE.Vector3(-0.08, 1.52, 0.30),
    new THREE.Vector3(-0.14, 1.50, 0.23),
    new THREE.Vector3(-0.20, 1.44, 0.17),
    new THREE.Vector3(-0.22, 1.33, 0.14),
    new THREE.Vector3(-0.19, 1.23, 0.15),
    new THREE.Vector3(-0.12, 1.16, 0.18),
    new THREE.Vector3(0.00, 1.14, 0.20),
  ];

  const spline = new THREE.CatmullRomCurve3(points, true);
  return new THREE.TubeGeometry(spline, 64, 0.022, 16, true);
}

/**
 * 3. 11 SHARP IVORY TEETH (Neat triangular shark teeth along upper arch pointing down)
 */
export function createSharkTeethGeometries(): THREE.BufferGeometry[] {
  const teeth: THREE.BufferGeometry[] = [];
  const toothCount = 11;

  for (let i = 0; i < toothCount; i++) {
    const t = i / (toothCount - 1);
    const angle = -0.85 + t * 1.70;

    const centerFactor = Math.sin(t * Math.PI);
    const height = 0.032 + 0.012 * centerFactor;
    const baseWidth = 0.022 + 0.006 * centerFactor;
    const depth = 0.008;

    const shape = new THREE.Shape();
    shape.moveTo(-baseWidth / 2, 0);
    shape.lineTo(0, -height);
    shape.lineTo(baseWidth / 2, 0);
    shape.closePath();

    const toothGeo = new THREE.ExtrudeGeometry(shape, {
      steps: 1,
      depth: depth,
      bevelEnabled: true,
      bevelThickness: 0.003,
      bevelSize: 0.003,
      bevelSegments: 2,
    });
    toothGeo.center();

    const jawRadiusX = 0.19;
    const jawRadiusZ = 0.13;
    const x = Math.sin(angle) * jawRadiusX;
    const y = 1.505 - 0.045 * Math.pow(Math.sin(angle), 2);
    const z = 0.235 + Math.cos(angle) * jawRadiusZ;

    // Point downwards and tilt slightly back into the mouth
    toothGeo.rotateX(-0.35);
    toothGeo.rotateY(angle * 0.5);
    toothGeo.translate(x, y - height / 2, z);

    teeth.push(toothGeo);
  }

  return teeth;
}

/**
 * 4. BULGING CARTOON SHARK EYES (White base, glossy black pupil, specular highlight)
 */
export function createSharkEyesGroup(): THREE.BufferGeometry[] {
  const eyeGeometries: THREE.BufferGeometry[] = [];

  [-1, 1].forEach(side => {
    const sclera = new THREE.CylinderGeometry(0.042, 0.044, 0.010, 24);
    sclera.rotateX(Math.PI / 2);
    sclera.rotateY(side * 0.42);
    sclera.translate(side * 0.22, 1.49, 0.21);
    eyeGeometries.push(sclera);
  });

  return eyeGeometries;
}

export function createSharkPupilsGroup(): THREE.BufferGeometry[] {
  const pupilGeometries: THREE.BufferGeometry[] = [];

  [-1, 1].forEach(side => {
    const pupil = new THREE.SphereGeometry(0.038, 24, 18);
    pupil.scale(1.0, 1.05, 0.45);
    pupil.rotateY(side * 0.42);
    pupil.translate(side * 0.222, 1.49, 0.216);
    pupilGeometries.push(pupil);
  });

  return pupilGeometries;
}

export function createSharkEyeHighlightsGroup(): THREE.BufferGeometry[] {
  const highlightGeometries: THREE.BufferGeometry[] = [];

  [-1, 1].forEach(side => {
    const highlight = new THREE.SphereGeometry(0.011, 12, 12);
    highlight.translate(side * 0.226, 1.502, 0.232);
    highlightGeometries.push(highlight);
  });

  return highlightGeometries;
}

/**
 * 5. GILL SLITS (|||)
 */
export function createSharkGillsGeometries(): THREE.BufferGeometry[] {
  const gills: THREE.BufferGeometry[] = [];

  [-1, 1].forEach(side => {
    for (let g = 0; g < 3; g++) {
      const gill = new THREE.BoxGeometry(0.008, 0.040 - g * 0.005, 0.016);
      gill.rotateY(side * 0.60);
      gill.rotateZ(side * 0.15);
      gill.translate(side * 0.28, 1.44 - g * 0.004, 0.08 - g * 0.024);
      gills.push(gill);
    }
  });

  return gills;
}

/**
 * 6. SHARK FINS (Top Primary Dorsal, Secondary Rear Dorsal, Lateral Pectorals)
 */
export function createSharkFinGeometry(
  height = 0.32,
  baseLength = 0.24,
  thickness = 0.036,
  sweepAngle = 0.74
): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  const sweepOffset = Math.tan(sweepAngle) * height;
  const tipLength = baseLength * 0.22;

  shape.moveTo(0, 0);
  shape.bezierCurveTo(baseLength * 0.25, height * 0.35, sweepOffset * 0.7, height * 0.85, sweepOffset, height);
  shape.bezierCurveTo(sweepOffset + tipLength * 0.4, height + 0.01, sweepOffset + tipLength, height - 0.01, sweepOffset + tipLength, height - 0.03);
  shape.bezierCurveTo(sweepOffset + tipLength * 0.7, height * 0.60, baseLength * 0.72, height * 0.20, baseLength, 0);
  shape.closePath();

  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    steps: 2,
    depth: thickness * 0.65,
    bevelEnabled: true,
    bevelThickness: thickness * 0.18,
    bevelSize: thickness * 0.16,
    bevelSegments: 3,
  };

  const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geo.center();
  return geo;
}

/**
 * 7. DRAWSTRINGS WITH 3D MINI FIN AGLETS
 */
export function createDrawstringsGeometries(): { cords: THREE.BufferGeometry[]; aglets: THREE.BufferGeometry[] } {
  const cords: THREE.BufferGeometry[] = [];
  const aglets: THREE.BufferGeometry[] = [];

  [-1, 1].forEach(side => {
    const cordPts = [
      new THREE.Vector3(side * 0.06, 1.13, 0.23),
      new THREE.Vector3(side * 0.065, 1.05, 0.24),
      new THREE.Vector3(side * 0.07, 0.96, 0.245),
      new THREE.Vector3(side * 0.07, 0.88, 0.24),
    ];
    const cordSpline = new THREE.CatmullRomCurve3(cordPts);
    cords.push(new THREE.TubeGeometry(cordSpline, 24, 0.005, 10, false));

    const aglet = createSharkFinGeometry(0.034, 0.024, 0.008, 0.45);
    aglet.rotateX(Math.PI);
    aglet.translate(side * 0.07, 0.865, 0.24);
    aglets.push(aglet);
  });

  return { cords, aglets };
}

/**
 * 8. ANIME BOY HEAD, CHIN, EARS, MOUTH & NOSE
 * Positioned proudly in the center of the hood opening.
 */
export function createAnimeHeadGeometry(): THREE.BufferGeometry {
  const head = new THREE.SphereGeometry(0.145, 36, 30);
  const pos = head.getAttribute('position') as THREE.BufferAttribute;

  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);

    // Taper chin and jawline
    if (y < 0) {
      const taper = 1.0 + (y / 0.145) * 0.38;
      x *= Math.max(0.52, taper);
      z *= Math.max(0.65, taper);
    }

    // Cheek fullness
    if (y > -0.04 && y < 0.06 && z > 0) {
      z += 0.016 * Math.cos((x / 0.145) * Math.PI);
    }

    pos.setXYZ(i, x, y, z);
  }

  head.computeVertexNormals();
  head.translate(0, 1.27, 0.08); // Front face surface reaches Z = 0.225

  // Anime ears
  const ears: THREE.BufferGeometry[] = [];
  [-1, 1].forEach(side => {
    const ear = new THREE.CylinderGeometry(0.024, 0.018, 0.008, 18);
    ear.scale(0.85, 1.4, 0.5);
    ear.rotateZ(side * 0.25);
    ear.rotateY(side * 0.35);
    ear.translate(side * 0.155, 1.26, 0.07);
    ears.push(ear);
  });

  // Delicate anime button nose (sitting proudly at Z = 0.244)
  const nose = new THREE.SphereGeometry(0.0085, 16, 12);
  nose.scale(1.0, 0.8, 1.3);
  nose.translate(0, 1.232, 0.244);

  // Subtle stoic closed mouth slit (at Z = 0.234)
  const mouth = new THREE.CylinderGeometry(0.0022, 0.0022, 0.026, 12);
  mouth.rotateZ(Math.PI / 2);
  mouth.translate(0, 1.188, 0.234);

  const merged = BufferGeometryUtils.mergeGeometries([head, nose, mouth, ...ears]);
  return merged;
}

/**
 * Black fabric blindfold (Gojo / 2B style):
 * Placed cleanly across the eyes from Y = 1.245 to 1.325, conforming over the eye sockets!
 */
export function createBlindfoldGeometry(): THREE.BufferGeometry {
  const rows = 16;
  const cols = 48;
  const vertices: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let r = 0; r <= rows; r++) {
    const tR = r / rows;
    const y = 1.245 + tR * 0.080; // Covers Y = 1.245 to 1.325

    for (let c = 0; c <= cols; c++) {
      const tC = c / cols;
      const angle = -1.55 + tC * 3.10;

      const rX = 0.155;
      const rZ = 0.154;

      // Conforms to bridge of the nose
      const noseRidge = Math.max(0, Math.cos(angle * 2.8)) * 0.010 * (1.0 - Math.abs(tR - 0.35) / 0.65);

      const x = Math.sin(angle) * rX;
      const z = 0.082 + Math.cos(angle) * rZ + noseRidge;

      vertices.push(x, y, z);

      const nx = Math.sin(angle);
      const ny = 0.02 * (tR - 0.5);
      const nz = Math.cos(angle);
      const len = Math.hypot(nx, ny, nz) || 1;
      normals.push(nx / len, ny / len, nz / len);

      uvs.push(tC, tR);
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const a = r * (cols + 1) + c;
      const b = (r + 1) * (cols + 1) + c;
      const e = (r + 1) * (cols + 1) + (c + 1);
      const d = r * (cols + 1) + (c + 1);

      indices.push(a, b, d);
      indices.push(b, e, d);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);

  return geo;
}

/**
 * Stylized Silver Anime Hair Clumps:
 * Chunky stylized spikes framing the forehead and cheeks:
 * Front bangs flick sideways and terminate at Y = 1.32 - 1.35, resting on the upper edge of the blindfold.
 * The center face, lower blindfold, nose, mouth, and chin are completely open and 100% VISIBLE!
 */
export function createLayeredHairGeometries(): THREE.BufferGeometry[] {
  const hairs: THREE.BufferGeometry[] = [];

  const hairSplines = [
    // 1. Center parted bangs: flicking sideways across the upper brow
    [[-0.02, 1.48, 0.19], [-0.04, 1.42, 0.22], [-0.06, 1.37, 0.24], [-0.08, 1.33, 0.24]],
    [[+0.02, 1.48, 0.19], [+0.04, 1.42, 0.22], [+0.06, 1.37, 0.24], [+0.08, 1.33, 0.24]],

    // 2. Mid-side bangs sweeping outward
    [[-0.07, 1.46, 0.18], [-0.10, 1.40, 0.21], [-0.12, 1.35, 0.22], [-0.13, 1.31, 0.21]],
    [[+0.07, 1.46, 0.18], [+0.10, 1.40, 0.21], [+0.12, 1.35, 0.22], [+0.13, 1.31, 0.21]],

    // 3. Side locks framing the cheeks in front of ears
    [[-0.14, 1.42, 0.15], [-0.16, 1.35, 0.17], [-0.17, 1.28, 0.16], [-0.16, 1.22, 0.14]],
    [[+0.14, 1.42, 0.15], [+0.16, 1.35, 0.17], [+0.17, 1.28, 0.16], [+0.16, 1.22, 0.14]],

    // 4. Temple volume locks
    [[-0.16, 1.44, 0.12], [-0.18, 1.38, 0.14], [-0.19, 1.31, 0.14], [-0.18, 1.25, 0.12]],
    [[+0.16, 1.44, 0.12], [+0.18, 1.38, 0.14], [+0.19, 1.31, 0.14], [+0.18, 1.25, 0.12]],

    // 5. Crown volume locks under the hood
    [[0.00, 1.52, 0.15], [0.00, 1.46, 0.18], [0.01, 1.41, 0.20], [0.01, 1.37, 0.21]],
    [[-0.08, 1.50, 0.14], [-0.10, 1.44, 0.17], [-0.11, 1.39, 0.18], [-0.11, 1.35, 0.17]],
    [[+0.08, 1.50, 0.14], [+0.10, 1.44, 0.17], [+0.11, 1.39, 0.18], [+0.11, 1.35, 0.17]],
  ];

  hairSplines.forEach(pts => {
    const vPts = pts.map(p => new THREE.Vector3(...p));
    const curve = new THREE.CatmullRomCurve3(vPts);
    const hair = createSmoothSweepGeometry(
      curve,
      20,
      t => Math.max(1e-4, 0.018 * Math.sin((1.0 - t * 0.95) * (Math.PI / 2))),
      12
    );
    hairs.push(hair);
  });

  return hairs;
}

/**
 * 9. OVERSIZED STREETWEAR HOODIE TORSO (Dropped shoulders, organic folds, ribbed hem)
 */
export function createHoodieTorsoGeometry(): THREE.BufferGeometry {
  const rings = 32;
  const cols = 48;
  const vertices: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let r = 0; r <= rings; r++) {
    const tR = r / rings;
    const y = 0.70 + tR * 0.38; // Spans from Y = 0.70 to Y = 1.08

    const rX = 0.21 + 0.07 * Math.sin(tR * Math.PI) + 0.04 * tR;
    const rZ = 0.17 + 0.03 * Math.sin(tR * Math.PI);
    const foldRipple = 0.004 * Math.sin(tR * 10.0);

    for (let c = 0; c <= cols; c++) {
      const tC = c / cols;
      const theta = tC * Math.PI * 2;

      const x = Math.sin(theta) * (rX + foldRipple);
      let z = Math.cos(theta) * (rZ + foldRipple);

      if (Math.cos(theta) > 0) {
        z += 0.022 * Math.cos(theta) * Math.sin(tR * Math.PI);
      }

      vertices.push(x, y, z);

      const nx = Math.sin(theta);
      const ny = 0.10 * Math.sin(tR * 10.0);
      const nz = Math.cos(theta);
      const len = Math.hypot(nx, ny, nz) || 1;
      normals.push(nx / len, ny / len, nz / len);

      uvs.push(tC, tR);
    }
  }

  for (let r = 0; r < rings; r++) {
    for (let c = 0; c < cols; c++) {
      const a = r * (cols + 1) + c;
      const b = (r + 1) * (cols + 1) + c;
      const d = (r + 1) * (cols + 1) + (c + 1);
      const e = r * (cols + 1) + (c + 1);

      indices.push(a, b, e);
      indices.push(b, d, e);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);

  return geo;
}

export function createHoodieWaistHemGeometry(): THREE.BufferGeometry {
  const geo = new THREE.CylinderGeometry(0.205, 0.195, 0.065, 44, 4, true);
  geo.scale(1.05, 1.0, 0.88);
  geo.translate(0, 0.69, 0.01);
  return geo;
}

/**
 * 10. KANGAROO FRONT POCKET (Pouch with side openings and shark graphic UVs)
 */
export function createKangarooPocketGeometry(): THREE.BufferGeometry {
  const rows = 24;
  const cols = 36;
  const vertices: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let r = 0; r <= rows; r++) {
    const v = r / rows;
    const y = 0.72 + v * 0.21;

    const halfW = 0.185 - v * 0.045;
    const baseZ = 0.180 + 0.022 * Math.sin(v * Math.PI);

    for (let c = 0; c <= cols; c++) {
      const u = c / cols;
      const x = -halfW + u * (2 * halfW);

      const bulge = 0.026 * Math.cos((x / Math.max(1e-4, halfW)) * (Math.PI / 2));
      const z = baseZ + bulge;

      vertices.push(x, y, z);

      const nx = (x / Math.max(1e-4, halfW)) * 0.4;
      const ny = 0.15;
      const nz = 0.90;
      const len = Math.hypot(nx, ny, nz) || 1;
      normals.push(nx / len, ny / len, nz / len);

      uvs.push(u, v);
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const a = r * (cols + 1) + c;
      const b = (r + 1) * (cols + 1) + c;
      const d = (r + 1) * (cols + 1) + (c + 1);
      const e = r * (cols + 1) + (c + 1);

      indices.push(a, b, e);
      indices.push(b, d, e);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);

  return geo;
}

/**
 * 11. 3D SHARK CAUDAL TAIL FLUKE (Attached flush to lower back of hoodie)
 */
export function createSharkTailFlukeGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0.08);
  shape.bezierCurveTo(0.04, 0.06, 0.11, 0.04, 0.16, 0.00);
  shape.bezierCurveTo(0.18, -0.04, 0.15, -0.10, 0.10, -0.14);
  shape.bezierCurveTo(0.06, -0.10, 0.02, -0.06, 0.00, -0.07);
  shape.bezierCurveTo(-0.02, -0.06, -0.06, -0.10, -0.10, -0.14);
  shape.bezierCurveTo(-0.15, -0.10, -0.18, -0.04, -0.16, 0.00);
  shape.bezierCurveTo(-0.11, 0.04, -0.04, 0.06, 0, 0.08);
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, {
    steps: 2,
    depth: 0.024,
    bevelEnabled: true,
    bevelThickness: 0.008,
    bevelSize: 0.006,
    bevelSegments: 3,
  });
  geo.center();

  geo.rotateX(-0.32);
  geo.translate(0, 0.67, -0.165);
  return geo;
}

/**
 * 12. BAGGY DROPPED SLEEVES WITH FABRIC FOLDS & RIBBED CUFFS
 */
export function createHoodieSleeveGeometry(isLeft: boolean): THREE.BufferGeometry {
  const side = isLeft ? 1 : -1;
  const splinePts = [
    new THREE.Vector3(side * 0.22, 1.05, 0.01),
    new THREE.Vector3(side * 0.27, 0.94, 0.02),
    new THREE.Vector3(side * 0.31, 0.82, 0.04),
    new THREE.Vector3(side * 0.33, 0.70, 0.05),
    new THREE.Vector3(side * 0.34, 0.58, 0.06),
  ];

  const curve = new THREE.CatmullRomCurve3(splinePts);
  return createSmoothSweepGeometry(
    curve,
    36,
    t => {
      const baseR = 0.080 - t * 0.030;
      const foldRipples = 0.004 * Math.sin(t * 12.0);
      return Math.max(0.044, baseR + foldRipples);
    },
    22
  );
}

export function createRibbedWristCuffGeometry(isLeft: boolean): THREE.BufferGeometry {
  const side = isLeft ? 1 : -1;
  const cuff = new THREE.CylinderGeometry(0.046, 0.040, 0.044, 20, 3, true);
  cuff.rotateZ(side * -0.18);
  cuff.rotateX(0.10);
  cuff.translate(side * 0.345, 0.560, 0.065);
  return cuff;
}

/**
 * 13. STYLIZED ANIME HANDS (Connecting wrist, palm, thumb, and 4 relaxed curved fingers)
 */
export function createAnimeHandGeometry(isLeft: boolean): THREE.BufferGeometry {
  const side = isLeft ? 1 : -1;
  const handParts: THREE.BufferGeometry[] = [];

  // Wrist connecting into sleeve cuff (eliminating any gap!)
  const wrist = new THREE.CylinderGeometry(0.024, 0.022, 0.045, 16);
  wrist.rotateZ(side * -0.18);
  wrist.rotateX(0.10);
  wrist.translate(side * 0.346, 0.545, 0.066);
  handParts.push(wrist);

  // Palm
  const palm = new THREE.BoxGeometry(0.046, 0.056, 0.022);
  palm.rotateZ(side * -0.10);
  palm.translate(side * 0.352, 0.495, 0.070);
  handParts.push(palm);

  // Thumb
  const thumbPts = [
    new THREE.Vector3(side * 0.332, 0.510, 0.078),
    new THREE.Vector3(side * 0.324, 0.480, 0.088),
    new THREE.Vector3(side * 0.328, 0.450, 0.092),
  ];
  const thumbSpline = new THREE.CatmullRomCurve3(thumbPts);
  handParts.push(createSmoothSweepGeometry(thumbSpline, 12, () => 0.008, 8));

  // 4 Relaxed curved fingers
  const fingerConfigs = [
    { xOff: -0.015, len: 0.048, r: 0.0072 },
    { xOff: -0.005, len: 0.052, r: 0.0075 },
    { xOff: +0.005, len: 0.050, r: 0.0072 },
    { xOff: +0.015, len: 0.040, r: 0.0068 },
  ];

  fingerConfigs.forEach(f => {
    const xBase = side * 0.352 + side * f.xOff;
    const pts = [
      new THREE.Vector3(xBase, 0.468, 0.070),
      new THREE.Vector3(xBase, 0.438, 0.078),
      new THREE.Vector3(xBase, 0.408, 0.084),
    ];
    const fingerSpline = new THREE.CatmullRomCurve3(pts);
    handParts.push(createSmoothSweepGeometry(fingerSpline, 14, () => f.r, 8));
  });

  const merged = BufferGeometryUtils.mergeGeometries(handParts);
  return merged;
}

/**
 * 14. BAGGY JOGGER PANTS WITH CONTINUOUS PELVIS / WAIST (ZERO GAPS!)
 */
export function createJoggerPelvisGeometry(): THREE.BufferGeometry {
  const pelvis = new THREE.CylinderGeometry(0.190, 0.170, 0.14, 36, 4, true);
  pelvis.scale(1.0, 1.0, 0.86);
  pelvis.translate(0, 0.67, 0.01);
  return pelvis;
}

export function createBaggyJoggerGeometry(isLeft: boolean): THREE.BufferGeometry {
  const side = isLeft ? 1 : -1;
  const legPts = [
    new THREE.Vector3(side * 0.10, 0.66, 0.00),
    new THREE.Vector3(side * 0.115, 0.54, 0.01),
    new THREE.Vector3(side * 0.125, 0.42, 0.02),
    new THREE.Vector3(side * 0.130, 0.30, 0.02),
    new THREE.Vector3(side * 0.135, 0.19, 0.01),
  ];

  const curve = new THREE.CatmullRomCurve3(legPts);
  return createSmoothSweepGeometry(
    curve,
    44,
    t => {
      const baseR = 0.086 - t * 0.034;
      const subtleFold = 0.005 * Math.sin(t * 8.0);
      return Math.max(0.048, baseR + subtleFold);
    },
    24
  );
}

export function createRibbedAnkleCuffGeometry(isLeft: boolean): THREE.BufferGeometry {
  const side = isLeft ? 1 : -1;
  const cuff = new THREE.CylinderGeometry(0.050, 0.044, 0.046, 22, 3, true);
  cuff.translate(side * 0.135, 0.185, 0.01);
  return cuff;
}

export function createAnkleSkinGeometry(isLeft: boolean): THREE.BufferGeometry {
  const side = isLeft ? 1 : -1;
  const ankle = new THREE.CylinderGeometry(0.038, 0.038, 0.075, 18, 2, true);
  ankle.translate(side * 0.135, 0.160, 0.01);
  return ankle;
}

/**
 * 15. CHUNKY PLATFORM STREETWEAR SNEAKERS
 * Fully solid platform sole, wavy sculpted EVA midsole, smooth upper, laces, and heel shark fin!
 */
export function createSneakerSoleGeometries(isLeft: boolean): { outsole: THREE.BufferGeometry; midsole: THREE.BufferGeometry } {
  const side = isLeft ? 1 : -1;

  const footShape = new THREE.Shape();
  footShape.moveTo(-0.055, -0.11);
  footShape.lineTo(0.055, -0.11);
  footShape.bezierCurveTo(0.068, -0.02, 0.068, 0.11, 0.052, 0.17);
  footShape.bezierCurveTo(0.038, 0.21, -0.038, 0.21, -0.052, 0.17);
  footShape.bezierCurveTo(-0.068, 0.11, -0.068, -0.02, -0.055, -0.11);
  footShape.closePath();

  const outsole = new THREE.ExtrudeGeometry(footShape, {
    steps: 1,
    depth: 0.016,
    bevelEnabled: true,
    bevelThickness: 0.003,
    bevelSize: 0.003,
    bevelSegments: 2,
  });
  outsole.rotateX(-Math.PI / 2);
  outsole.translate(side * 0.135, 0.008, 0.03);

  const midsole = new THREE.ExtrudeGeometry(footShape, {
    steps: 2,
    depth: 0.048,
    bevelEnabled: true,
    bevelThickness: 0.008,
    bevelSize: 0.008,
    bevelSegments: 3,
  });
  midsole.rotateX(-Math.PI / 2);
  midsole.translate(side * 0.135, 0.024, 0.03);

  return { outsole, midsole };
}

export function createSneakerUpperGeometries(isLeft: boolean): {
  whitePanels: THREE.BufferGeometry;
  blueMudguard: THREE.BufferGeometry;
  blackQuarter: THREE.BufferGeometry;
  laces: THREE.BufferGeometry;
  heelFin: THREE.BufferGeometry;
} {
  const side = isLeft ? 1 : -1;

  const toeCap = new THREE.SphereGeometry(0.048, 22, 16);
  toeCap.scale(1.05, 0.60, 1.25);
  toeCap.translate(side * 0.135, 0.082, 0.115);

  const mudguard = new THREE.CylinderGeometry(0.058, 0.064, 0.032, 28, 2, true);
  mudguard.scale(1.0, 1.0, 1.75);
  mudguard.translate(side * 0.135, 0.080, 0.03);

  const quarter = new THREE.CylinderGeometry(0.048, 0.056, 0.075, 24, 2, true);
  quarter.scale(0.9, 1.0, 1.65);
  quarter.translate(side * 0.135, 0.110, -0.005);

  const tongue = new THREE.BoxGeometry(0.052, 0.068, 0.016);
  tongue.rotateX(-0.35);
  tongue.translate(side * 0.135, 0.128, 0.085);

  const blackQuarter = BufferGeometryUtils.mergeGeometries([quarter, tongue]);

  const laceGeos: THREE.BufferGeometry[] = [];
  for (let l = 0; l < 3; l++) {
    const yL = 0.098 + l * 0.020;
    const zL = 0.110 - l * 0.026;

    const lace1 = new THREE.CylinderGeometry(0.003, 0.003, 0.042, 8);
    lace1.rotateZ(0.65);
    lace1.rotateX(0.35);
    lace1.translate(side * 0.135, yL, zL);
    laceGeos.push(lace1);

    const lace2 = new THREE.CylinderGeometry(0.003, 0.003, 0.042, 8);
    lace2.rotateZ(-0.65);
    lace2.rotateX(0.35);
    lace2.translate(side * 0.135, yL, zL);
    laceGeos.push(lace2);
  }
  const laces = BufferGeometryUtils.mergeGeometries(laceGeos);

  const heelFin = createSharkFinGeometry(0.050, 0.034, 0.010, 0.55);
  heelFin.rotateY(-Math.PI / 2);
  heelFin.translate(side * 0.135, 0.128, -0.110);

  return {
    whitePanels: toeCap,
    blueMudguard: mudguard,
    blackQuarter: blackQuarter,
    laces: laces,
    heelFin: heelFin,
  };
}
