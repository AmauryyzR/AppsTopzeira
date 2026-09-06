import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Polyfill FileReader and document for Node.js environment
if (typeof globalThis.self === 'undefined') {
  globalThis.self = globalThis;
}

if (typeof globalThis.FileReader === 'undefined') {
  globalThis.FileReader = class FileReader {
    readAsArrayBuffer(blob) {
      blob.arrayBuffer().then(buf => {
        this.result = buf;
        if (this.onload) this.onload({ target: this });
        if (this.onloadend) this.onloadend({ target: this });
      });
    }
  };
}

class FakeCanvas {
  constructor() {
    this.width = 512;
    this.height = 512;
  }
  getContext() {
    return {
      fillRect: () => {},
      clearRect: () => {},
      beginPath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      bezierCurveTo: () => {},
      closePath: () => {},
      fill: () => {},
      stroke: () => {},
      arc: () => {},
      createImageData: (w, h) => ({ data: new Uint8Array(w * h * 4) }),
      putImageData: () => {},
      drawImage: () => {},
      translate: () => {},
      scale: () => {},
      save: () => {},
      restore: () => {},
      getImageData: () => ({ data: new Uint8Array(512 * 512 * 4) }),
    };
  }
  toDataURL() {
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  }
  toBlob(cb) {
    cb(new Blob([new Uint8Array(4)]));
  }
}

if (typeof globalThis.HTMLCanvasElement === 'undefined') {
  globalThis.HTMLCanvasElement = FakeCanvas;
}

if (typeof globalThis.document === 'undefined') {
  globalThis.document = {
    createElement: (tag) => {
      if (tag === 'canvas') {
        return new FakeCanvas();
      }
      return {};
    }
  };
}

const output = path.resolve('output/shark');
await fs.mkdir(output, { recursive: true });
const bundle = path.join(output, 'character.mjs');

await build({
  entryPoints: ['src/apps/models/models/shark/SharkAnimestyle.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outfile: bundle,
  external: ['three', 'three/*'],
});

const { createSharkAnimestyle } = await import(pathToFileURL(bundle));
const character = createSharkAnimestyle();
character.updateMatrixWorld(true);

let triangles = 0;
let meshes = 0;
let weightedVertices = 0;
let blendedVertices = 0;
const skeletons = new Set();

character.traverse(mesh => {
  if (!mesh.isSkinnedMesh) return;
  meshes++;
  skeletons.add(mesh.skeleton);
  const geo = mesh.geometry;
  const p = geo.getAttribute('position');
  const weights = geo.getAttribute('skinWeight');
  const indices = geo.getAttribute('skinIndex');

  triangles += (geo.index?.count ?? p.count) / 3;

  for (const attr of Object.values(geo.attributes)) {
    for (const value of attr.array) {
      assert(Number.isFinite(value), 'Non-finite geometry attribute');
    }
  }

  for (let i = 0; i < p.count; i++) {
    let sum = 0;
    let influences = 0;
    for (let j = 0; j < 4; j++) {
      const weight = weights.array[i * 4 + j];
      const bone = indices.array[i * 4 + j];
      assert(weight >= 0 && weight <= 1);
      assert(Number.isInteger(bone) && bone >= 0 && bone < mesh.skeleton.bones.length);
      sum += weight;
      if (weight > 0.001) influences++;
    }
    assert(Math.abs(sum - 1) < 1e-4, 'Weights must sum to 1.0');
    weightedVertices++;
    if (influences > 1) blendedVertices++;
  }
});

console.log(`Measured triangles: ${triangles}`);
console.log(`Skinned meshes: ${meshes}`);
console.log(`Weighted vertices: ${weightedVertices}`);
console.log(`Blended vertices: ${blendedVertices}`);

assert(triangles < 100000, `Triangle budget exceeded: ${triangles} >= 100000`);
assert.equal(skeletons.size, 1, 'Should have exactly 1 shared skeleton');
const skeleton = [...skeletons][0];
assert.equal(skeleton.bones.length, 30, `Expected 30 bones, found ${skeleton.bones.length}`);

// Verify required bones
const requiredBones = [
  'Root', 'Hips', 'Spine', 'Chest', 'Neck', 'Head', 'Jaw', 'HeadSocket',
  'Clavicle.L', 'Clavicle.R', 'UpperArm.L', 'UpperArm.R', 'Forearm.L', 'Forearm.R',
  'Hand.L', 'Hand.R', 'GripSocket.L', 'GripSocket.R',
  'Thigh.L', 'Thigh.R', 'Shin.L', 'Shin.R', 'Foot.L', 'Foot.R', 'Toe.L', 'Toe.R',
  'TailFin.01', 'TailFin.02', 'TailFin.03', 'TailFin.04'
];

for (const name of requiredBones) {
  assert(character.getObjectByName(name)?.isBone, `Missing bone: ${name}`);
}

console.log('Skeleton hierarchy: 30 bones verified successfully.');

// Test animations
const mixer = new THREE.AnimationMixer(character);
const deformation = {};
for (const clip of character.animations) {
  const action = mixer.clipAction(clip);
  action.play();
  mixer.setTime(0);
  character.updateMatrixWorld(true);
  const p0 = character.getObjectByName('TailFin.04').getWorldPosition(new THREE.Vector3());
  mixer.setTime(clip.duration * 0.5);
  character.updateMatrixWorld(true);
  const p1 = character.getObjectByName('TailFin.04').getWorldPosition(new THREE.Vector3());
  deformation[clip.name] = Number(p0.distanceTo(p1).toFixed(4));
  action.stop();
}

console.log('Animation deformations:', deformation);

// GLTF Round-trip export test
const exporter = new GLTFExporter();
const glbBuffer = await exporter.parseAsync(character, {
  binary: true,
  animations: character.animations,
});

const glbPath = path.join(output, 'shark-animestyle.glb');
await fs.writeFile(glbPath, Buffer.from(glbBuffer));
console.log(`GLB saved: ${glbPath} (${glbBuffer.byteLength} bytes)`);

const loader = new GLTFLoader();
const loadedGltf = await new Promise((resolve, reject) => {
  loader.parse(glbBuffer, '', resolve, reject);
});

let loadedTriangles = 0;
loadedGltf.scene.traverse(obj => {
  if (obj.isMesh || obj.isSkinnedMesh) {
    const g = obj.geometry;
    loadedTriangles += (g.index?.count ?? g.getAttribute('position').count) / 3;
  }
});

console.log(`Loaded GLB triangles: ${loadedTriangles}`);
assert.equal(loadedTriangles, triangles, 'GLB round-trip triangle mismatch');
console.log('SUCCESS: SharkAnimestyle completely verified with 0 errors!');
