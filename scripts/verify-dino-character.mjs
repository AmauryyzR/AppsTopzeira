import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const output = path.resolve('output/dino');
await fs.mkdir(output, {recursive: true});
const bundle = path.join(output, 'character.mjs');
await build({entryPoints: ['src/apps/models/models/dino/DinoChibi.ts'], bundle: true, platform: 'node', format: 'esm', outfile: bundle, external: ['three', 'three/*']});
const {createGemniDino, createDinoChibi} = await import(pathToFileURL(bundle));
const character = (createGemniDino ?? createDinoChibi)();
character.updateMatrixWorld(true);
let triangles = 0, meshes = 0, weightedVertices = 0, blendedVertices = 0;
const skeletons = new Set();
character.traverse(mesh => {
  if (!mesh.isSkinnedMesh) return;
  meshes++;
  skeletons.add(mesh.skeleton);
  const geo = mesh.geometry;
  const p = geo.getAttribute('position'), weights = geo.getAttribute('skinWeight'), indices = geo.getAttribute('skinIndex');
  triangles += (geo.index?.count ?? p.count) / 3;
  for (const attr of Object.values(geo.attributes)) for (const value of attr.array) assert(Number.isFinite(value), 'Non-finite geometry attribute');
  for (let i = 0; i < p.count; i++) {
    let sum = 0, influences = 0;
    for (let j = 0; j < 4; j++) {
      const weight = weights.array[i * 4 + j], bone = indices.array[i * 4 + j];
      assert(weight >= 0 && weight <= 1);
      assert(Number.isInteger(bone) && bone >= 0 && bone < mesh.skeleton.bones.length);
      sum += weight; if (weight > .001) influences++;
    }
    assert(Math.abs(sum - 1) < 1e-5, 'Weights must sum to one');
    weightedVertices++; if (influences > 1) blendedVertices++;
  }
});
assert(triangles < 100000, `Triangle budget: ${triangles}`);
assert.equal(skeletons.size, 1);
assert(blendedVertices > 1000, 'Expect real joint blending, not only rigid attachments');
const skeleton = [...skeletons][0];
assert.equal(skeleton.bones.length, 30);
for (const name of ['Root','Hips','Spine','Chest','Neck','Head','Jaw','UpperArm.L','UpperArm.R','Forearm.L','Forearm.R','Hand.L','Hand.R','Thigh.L','Thigh.R','Shin.L','Shin.R','Foot.L','Foot.R','Toe.L','Toe.R','Tail.04','GripSocket.L','GripSocket.R']) {
  assert(character.getObjectByName(name)?.isBone, `Missing bone ${name}`);
}
const mixer = new THREE.AnimationMixer(character);
const restHand = character.getObjectByName('Hand.R').getWorldPosition(new THREE.Vector3());
const deformation = {};
for (const clip of character.animations) {
  mixer.stopAllAction(); skeleton.pose();
  const action = mixer.clipAction(clip).reset().play();
  let maxDisplacement = 0;
  for (let frame = 0; frame < 12; frame++) {
    mixer.setTime(clip.duration * frame / 12);
    character.updateMatrixWorld(true); skeleton.update();
    character.traverse(mesh => {
      if (!mesh.isSkinnedMesh) return;
      const positions = mesh.geometry.getAttribute('position');
      for (let i = 0; i < positions.count; i += 113) {
        const rest = new THREE.Vector3().fromBufferAttribute(positions, i);
        const posed = mesh.applyBoneTransform(i, rest.clone());
        assert(posed.toArray().every(Number.isFinite));
        maxDisplacement = Math.max(maxDisplacement, posed.distanceTo(rest));
      }
    });
  }
  assert(maxDisplacement > .005, `${clip.name} did not deform the mesh`);
  deformation[clip.name] = Number(maxDisplacement.toFixed(4));
  if (clip.name === 'Wave') {
    mixer.setTime(.8); character.updateMatrixWorld(true);
    assert(character.getObjectByName('Hand.R').getWorldPosition(new THREE.Vector3()).y > restHand.y + .25, 'Wave should raise the paw');
  }
  action.stop();
}
mixer.stopAllAction(); skeleton.pose(); character.updateMatrixWorld(true);
// GLTFExporter needs FileReader for binary blobs in Node, but this asset has no external textures.
globalThis.FileReader = class {
  async readAsArrayBuffer(blob) {this.result = await blob.arrayBuffer(); this.onloadend?.();}
  async readAsDataURL(blob) {this.result = `data:${blob.type};base64,${Buffer.from(await blob.arrayBuffer()).toString('base64')}`; this.onloadend?.();}
};
const binary = await new GLTFExporter().parseAsync(character, {binary: true, animations: character.animations});
await fs.writeFile(path.join(output, 'dino-chibi.glb'), Buffer.from(binary));
const view = new DataView(binary);
assert.equal(view.getUint32(0, true), 0x46546c67);
const jsonLength = view.getUint32(12, true);
const gltf = JSON.parse(new TextDecoder().decode(new Uint8Array(binary, 20, jsonLength)).trim());
assert.equal(gltf.animations.length, 3);
assert(gltf.skins.length > 0);
assert(gltf.skins.every(skin => skin.joints.length === 30));
const reloaded = await new GLTFLoader().parseAsync(binary, '');
assert.deepEqual(reloaded.animations.map(clip => clip.name), ['Idle', 'Walk', 'Wave']);
let importedTriangles = 0;
reloaded.scene.traverse(mesh => {
  if (!mesh.isSkinnedMesh) return;
  importedTriangles += (mesh.geometry.index?.count ?? mesh.geometry.getAttribute('position').count) / 3;
  assert.equal(mesh.skeleton.bones.length, 30);
});
assert.equal(importedTriangles, triangles);
const importedMixer = new THREE.AnimationMixer(reloaded.scene);
importedMixer.clipAction(reloaded.animations[2]).play(); importedMixer.update(.8);
reloaded.scene.updateMatrixWorld(true);
assert(reloaded.scene.getObjectByName('HandR').getWorldPosition(new THREE.Vector3()).y > restHand.y + .25, 'Imported wave failed');
const report = {triangles, triangleLimit: 100000, meshes, bones: skeleton.bones.length, weightedVertices, blendedVertices, animations: deformation, glbBytes: binary.byteLength, glbRoundTrip: 'passed'};
await fs.writeFile(path.join(output, 'validation.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
