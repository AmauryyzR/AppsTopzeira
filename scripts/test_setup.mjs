globalThis.self = globalThis;
globalThis.FileReader = class FileReader {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((buf) => {
      if (this.onload) this.onload({ target: this });
      if (this.onloadend) this.onloadend({ target: this });
    });
  }
};
globalThis.createImageBitmap = () => Promise.resolve({});

import fs from 'fs';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const buf = fs.readFileSync('D:/IDEwork/SiteTopzeira/shanimationreal.glb');
const loader = new GLTFLoader();

loader.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength), '', (gltf) => {
  console.log('GLTF loaded.');
  let skinnedMesh = null;
  gltf.scene.traverse((c) => {
    if (c.isSkinnedMesh && !skinnedMesh) skinnedMesh = c;
  });

  console.log('SkinnedMesh found:', !!skinnedMesh);

  // Now run exact setupSkinnedSharkMesh code
  try {
    const geom = skinnedMesh.geometry;
    geom.deleteAttribute('skinIndex');
    geom.deleteAttribute('skinWeight');

    const pos = geom.attributes.position;
    const count = pos.count;

    const BONE_SPECS = [
      { name: 'Root', parent: null, pos: [0, 0, 0] },
      { name: 'Hips', parent: 'Root', pos: [0, 0.36, 0.10] },
      { name: 'Spine', parent: 'Hips', pos: [0, 0.44, 0.11] },
      { name: 'Chest', parent: 'Spine', pos: [0, 0.53, 0.11] },
      { name: 'Neck', parent: 'Chest', pos: [0, 0.60, 0.10] },
      { name: 'Head', parent: 'Neck', pos: [0, 0.76, 0.11] },
      { name: 'Tail', parent: 'Hips', pos: [0, 0.44, -0.11] },

      { name: 'Clavicle.L', parent: 'Chest', pos: [0.06, 0.58, 0.10] },
      { name: 'UpperArm.L', parent: 'Clavicle.L', pos: [0.13, 0.62, 0.09] },
      { name: 'Forearm.L', parent: 'UpperArm.L', pos: [0.22, 0.62, 0.10] },
      { name: 'Hand.L', parent: 'Forearm.L', pos: [0.31, 0.62, 0.11] },

      { name: 'Clavicle.R', parent: 'Chest', pos: [-0.06, 0.58, 0.10] },
      { name: 'UpperArm.R', parent: 'Clavicle.R', pos: [-0.13, 0.62, 0.09] },
      { name: 'Forearm.R', parent: 'UpperArm.R', pos: [-0.22, 0.62, 0.10] },
      { name: 'Hand.R', parent: 'Forearm.R', pos: [-0.31, 0.62, 0.11] },

      { name: 'Thigh.L', parent: 'Hips', pos: [0.08, 0.34, 0.10] },
      { name: 'Shin.L', parent: 'Thigh.L', pos: [0.09, 0.22, 0.10] },
      { name: 'Foot.L', parent: 'Shin.L', pos: [0.11, 0.09, 0.12] },
      { name: 'Toe.L', parent: 'Foot.L', pos: [0.12, 0.03, 0.18] },

      { name: 'Thigh.R', parent: 'Hips', pos: [-0.08, 0.34, 0.10] },
      { name: 'Shin.R', parent: 'Thigh.R', pos: [-0.09, 0.22, 0.10] },
      { name: 'Foot.R', parent: 'Shin.R', pos: [-0.11, 0.09, 0.12] },
      { name: 'Toe.R', parent: 'Foot.R', pos: [-0.12, 0.03, 0.18] },

      { name: 'Cord.L', parent: 'Chest', pos: [0.03, 0.52, 0.19] },
      { name: 'Cord.R', parent: 'Chest', pos: [-0.03, 0.52, 0.19] },
    ];

    const boneMap = new Map();
    const bones = [];
    const boneWorldPos = new Map();
    const boneIndices = new Map();

    BONE_SPECS.forEach((spec, idx) => {
      const bone = new THREE.Bone();
      bone.name = spec.name;
      boneMap.set(spec.name, bone);
      bones.push(bone);
      boneIndices.set(spec.name, idx);
      boneWorldPos.set(spec.name, new THREE.Vector3(spec.pos[0], spec.pos[1], spec.pos[2]));
    });

    BONE_SPECS.forEach((spec) => {
      const bone = boneMap.get(spec.name);
      if (!spec.parent) {
        bone.position.set(spec.pos[0], spec.pos[1], spec.pos[2]);
      } else {
        const parentBone = boneMap.get(spec.parent);
        parentBone.add(bone);
        const pPos = boneWorldPos.get(spec.parent);
        bone.position.set(spec.pos[0] - pPos.x, spec.pos[1] - pPos.y, spec.pos[2] - pPos.z);
      }
    });

    const rootBone = boneMap.get('Root');
    rootBone.updateWorldMatrix(true, true);

    const skeleton = new THREE.Skeleton(bones);
    skeleton.calculateInverses();

    const P = Object.fromEntries(boneWorldPos.entries());
    P.HandTipL = new THREE.Vector3(0.39, 0.62, 0.11);
    P.HandTipR = new THREE.Vector3(-0.39, 0.62, 0.11);

    const distToSeg = (pt, A, B) => {
      const v = new THREE.Vector3().subVectors(B, A);
      const lenSq = v.lengthSq();
      if (lenSq < 1e-6) return pt.distanceTo(A);
      const toPt = new THREE.Vector3().subVectors(pt, A);
      const t = THREE.MathUtils.clamp(toPt.dot(v) / lenSq, 0, 1);
      const proj = new THREE.Vector3().copy(A).addScaledVector(v, t);
      return pt.distanceTo(proj);
    };

    const skinIndices = new Uint16Array(count * 4);
    const skinWeights = new Float32Array(count * 4);

    for (let i = 0; i < count; i++) {
      const pt = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i));
      const rawWeights = new Map();

      if (pt.y > 0.56) {
        if (pt.y > 0.64) {
          const dHead = pt.distanceTo(P.Head);
          rawWeights.set('Head', 1.0 / (dHead * dHead + 0.008));
        } else {
          const t = (pt.y - 0.56) / (0.64 - 0.56);
          rawWeights.set('Head', t * 2.0);
          rawWeights.set('Neck', (1 - t) * 2.0);
        }
      }

      if (pt.z < -0.05 && pt.y >= 0.32 && pt.y <= 0.54) {
        const dTail = pt.distanceTo(P.Tail);
        rawWeights.set('Tail', 1.5 / (dTail * dTail + 0.004));
      }

      if (pt.z > 0.17 && pt.y >= 0.42 && pt.y <= 0.58 && Math.abs(pt.x) < 0.08) {
        if (pt.x > 0.01) rawWeights.set('Cord.L', 3.0);
        else if (pt.x < -0.01) rawWeights.set('Cord.R', 3.0);
      }

      if (pt.x > 0.11 && pt.y >= 0.46 && pt.y <= 0.74 && pt.z > -0.05) {
        const dClav = distToSeg(pt, P['Clavicle.L'], P['UpperArm.L']);
        const dUA = distToSeg(pt, P['UpperArm.L'], P['Forearm.L']);
        const dFA = distToSeg(pt, P['Forearm.L'], P['Hand.L']);
        const dH = distToSeg(pt, P['Hand.L'], P.HandTipL);
        if (pt.x < 0.14) rawWeights.set('Clavicle.L', 1.0 / (dClav * dClav + 0.003));
        rawWeights.set('UpperArm.L', 1.0 / (dUA * dUA + 0.002));
        rawWeights.set('Forearm.L', 1.0 / (dFA * dFA + 0.002));
        rawWeights.set('Hand.L', 1.0 / (dH * dH + 0.002));
      }

      if (pt.x < -0.11 && pt.y >= 0.46 && pt.y <= 0.74 && pt.z > -0.05) {
        const dClav = distToSeg(pt, P['Clavicle.R'], P['UpperArm.R']);
        const dUA = distToSeg(pt, P['UpperArm.R'], P['Forearm.R']);
        const dFA = distToSeg(pt, P['Forearm.R'], P['Hand.R']);
        const dH = distToSeg(pt, P['Hand.R'], P.HandTipR);
        if (pt.x > -0.14) rawWeights.set('Clavicle.R', 1.0 / (dClav * dClav + 0.003));
        rawWeights.set('UpperArm.R', 1.0 / (dUA * dUA + 0.002));
        rawWeights.set('Forearm.R', 1.0 / (dFA * dFA + 0.002));
        rawWeights.set('Hand.R', 1.0 / (dH * dH + 0.002));
      }

      if (pt.x > 0.01 && pt.y < 0.35) {
        const dTh = distToSeg(pt, P['Thigh.L'], P['Shin.L']);
        const dSh = distToSeg(pt, P['Shin.L'], P['Foot.L']);
        const dFt = distToSeg(pt, P['Foot.L'], P['Toe.L']);
        rawWeights.set('Thigh.L', 1.0 / (dTh * dTh + 0.004));
        rawWeights.set('Shin.L', 1.0 / (dSh * dSh + 0.004));
        rawWeights.set('Foot.L', 1.0 / (dFt * dFt + 0.003));
        if (pt.y < 0.05 && pt.z > 0.14) {
          rawWeights.set('Toe.L', 1.0 / (pt.distanceTo(P['Toe.L']) * pt.distanceTo(P['Toe.L']) + 0.002));
        }
      }

      if (pt.x < -0.01 && pt.y < 0.35) {
        const dTh = distToSeg(pt, P['Thigh.R'], P['Shin.R']);
        const dSh = distToSeg(pt, P['Shin.R'], P['Foot.R']);
        const dFt = distToSeg(pt, P['Foot.R'], P['Toe.R']);
        rawWeights.set('Thigh.R', 1.0 / (dTh * dTh + 0.004));
        rawWeights.set('Shin.R', 1.0 / (dSh * dSh + 0.004));
        rawWeights.set('Foot.R', 1.0 / (dFt * dFt + 0.003));
        if (pt.y < 0.05 && pt.z > 0.14) {
          rawWeights.set('Toe.R', 1.0 / (pt.distanceTo(P['Toe.R']) * pt.distanceTo(P['Toe.R']) + 0.002));
        }
      }

      if (pt.y >= 0.30 && pt.y <= 0.62 && Math.abs(pt.x) < 0.18 && pt.z >= -0.05) {
        const dHips = distToSeg(pt, P.Hips, P.Spine);
        const dSpine = distToSeg(pt, P.Spine, P.Chest);
        const dChest = distToSeg(pt, P.Chest, P.Neck);
        rawWeights.set('Hips', 1.0 / (dHips * dHips + 0.008));
        rawWeights.set('Spine', 1.0 / (dSpine * dSpine + 0.008));
        rawWeights.set('Chest', 1.0 / (dChest * dChest + 0.008));
      }

      if (rawWeights.size === 0) {
        if (pt.y > 0.60) rawWeights.set('Head', 1.0);
        else if (pt.y < 0.35) rawWeights.set(pt.x > 0 ? 'Foot.L' : 'Foot.R', 1.0);
        else rawWeights.set('Chest', 1.0);
      }

      const sorted = Array.from(rawWeights.entries()).sort((a, b) => b[1] - a[1]).slice(0, 4);
      let sum = sorted.reduce((acc, curr) => acc + curr[1], 0);
      if (sum === 0) sum = 1;

      for (let k = 0; k < 4; k++) {
        if (k < sorted.length) {
          const bName = sorted[k][0];
          const bIdx = boneIndices.get(bName);
          skinIndices[i * 4 + k] = bIdx;
          skinWeights[i * 4 + k] = sorted[k][1] / sum;
        } else {
          skinIndices[i * 4 + k] = 0;
          skinWeights[i * 4 + k] = 0;
        }
      }
    }

    geom.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(skinIndices, 4));
    geom.setAttribute('skinWeight', new THREE.Float32BufferAttribute(skinWeights, 4));

    skinnedMesh.bind(skeleton);
    console.log('Successfully bound skeleton to SkinnedMesh!');

    const rootContainer = new THREE.Group();
    rootContainer.add(rootBone);
    rootContainer.add(skinnedMesh);

    // Test matrix world update
    rootContainer.updateMatrixWorld(true);
    console.log('Matrix world updated without errors!');
  } catch(e) {
    console.error('Error during setup:', e);
  }
});
