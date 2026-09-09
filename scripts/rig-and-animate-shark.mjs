import fs from 'fs';
import path from 'path';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

// Polyfills for Node environment
globalThis.self = globalThis;
if (typeof globalThis.FileReader === 'undefined') {
  globalThis.FileReader = class FileReader {
    readAsArrayBuffer(blob) {
      blob.arrayBuffer().then((buf) => {
        this.result = buf;
        if (this.onload) this.onload({ target: this });
        if (this.onloadend) this.onloadend({ target: this });
      });
    }
  };
}
globalThis.createImageBitmap = () => Promise.resolve({});

async function main() {
  console.log('Loading D:/IDEwork/SiteTopzeira/shanimationreal.glb...');
  const inputBuffer = fs.readFileSync('D:/IDEwork/SiteTopzeira/shanimationreal.glb');

  const loader = new GLTFLoader();
  const gltf = await new Promise((resolve, reject) => {
    loader.parse(
      inputBuffer.buffer.slice(inputBuffer.byteOffset, inputBuffer.byteOffset + inputBuffer.byteLength),
      '',
      resolve,
      reject
    );
  });

  let originalMesh = null;
  gltf.scene.traverse((c) => {
    if ((c.isMesh || c.isSkinnedMesh) && !originalMesh) {
      originalMesh = c;
    }
  });

  if (!originalMesh) {
    throw new Error('No mesh found in shanimationreal.glb');
  }

  console.log(`Original mesh found: ${originalMesh.name} with ${originalMesh.geometry.attributes.position.count} vertices`);

  // 1. Prepare Geometry
  const geometry = originalMesh.geometry.clone();
  geometry.deleteAttribute('skinIndex');
  geometry.deleteAttribute('skinWeight');

  const pos = geometry.attributes.position;
  const count = pos.count;

  // 2. Define Clean Bone Hierarchy and Rest Positions in Model Space (Height = 1.0m, T-Pose)
  const BONE_SPECS = [
    { name: 'Root', parent: null, pos: [0, 0, 0] },
    { name: 'Hips', parent: 'Root', pos: [0, 0.36, 0.10] },
    { name: 'Spine', parent: 'Hips', pos: [0, 0.44, 0.11] },
    { name: 'Chest', parent: 'Spine', pos: [0, 0.53, 0.11] },
    { name: 'Neck', parent: 'Chest', pos: [0, 0.60, 0.10] },
    { name: 'Head', parent: 'Neck', pos: [0, 0.76, 0.11] },
    { name: 'Tail', parent: 'Hips', pos: [0, 0.44, -0.11] },

    // Left Arm (T-pose extending +X)
    { name: 'Clavicle.L', parent: 'Chest', pos: [0.06, 0.58, 0.10] },
    { name: 'UpperArm.L', parent: 'Clavicle.L', pos: [0.13, 0.62, 0.09] },
    { name: 'Forearm.L', parent: 'UpperArm.L', pos: [0.22, 0.62, 0.10] },
    { name: 'Hand.L', parent: 'Forearm.L', pos: [0.31, 0.62, 0.11] },

    // Right Arm (T-pose extending -X)
    { name: 'Clavicle.R', parent: 'Chest', pos: [-0.06, 0.58, 0.10] },
    { name: 'UpperArm.R', parent: 'Clavicle.R', pos: [-0.13, 0.62, 0.09] },
    { name: 'Forearm.R', parent: 'UpperArm.R', pos: [-0.22, 0.62, 0.10] },
    { name: 'Hand.R', parent: 'Forearm.R', pos: [-0.31, 0.62, 0.11] },

    // Left Leg
    { name: 'Thigh.L', parent: 'Hips', pos: [0.08, 0.34, 0.10] },
    { name: 'Shin.L', parent: 'Thigh.L', pos: [0.09, 0.22, 0.10] },
    { name: 'Foot.L', parent: 'Shin.L', pos: [0.11, 0.09, 0.12] },
    { name: 'Toe.L', parent: 'Foot.L', pos: [0.12, 0.03, 0.18] },

    // Right Leg
    { name: 'Thigh.R', parent: 'Hips', pos: [-0.08, 0.34, 0.10] },
    { name: 'Shin.R', parent: 'Thigh.R', pos: [-0.09, 0.22, 0.10] },
    { name: 'Foot.R', parent: 'Shin.R', pos: [-0.11, 0.09, 0.12] },
    { name: 'Toe.R', parent: 'Foot.R', pos: [-0.12, 0.03, 0.18] },

    // Hoodie Cords
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
    boneWorldPos.set(spec.name, new THREE.Vector3(...spec.pos));
  });

  BONE_SPECS.forEach((spec) => {
    const bone = boneMap.get(spec.name);
    if (!spec.parent) {
      bone.position.set(...spec.pos);
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

  console.log(`Created skeleton with ${bones.length} bones.`);

  // 3. Precise Anatomical Skin Weight Assignment
  const P = Object.fromEntries(boneWorldPos.entries());
  P.HandTipL = new THREE.Vector3(0.39, 0.62, 0.11);
  P.HandTipR = new THREE.Vector3(-0.39, 0.62, 0.11);

  function distToSeg(pt, A, B) {
    const v = new THREE.Vector3().subVectors(B, A);
    const lenSq = v.lengthSq();
    if (lenSq < 1e-6) return pt.distanceTo(A);
    const toPt = new THREE.Vector3().subVectors(pt, A);
    const t = THREE.MathUtils.clamp(toPt.dot(v) / lenSq, 0, 1);
    const proj = new THREE.Vector3().copy(A).addScaledVector(v, t);
    return pt.distanceTo(proj);
  }

  const skinIndices = new Uint16Array(count * 4);
  const skinWeights = new Float32Array(count * 4);
  const usageStats = new Array(bones.length).fill(0);

  for (let i = 0; i < count; i++) {
    const pt = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i));
    const rawWeights = new Map();

    // A. Head & Neck
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

    // B. Tail Fin Fluke (Rear lower back)
    if (pt.z < -0.05 && pt.y >= 0.32 && pt.y <= 0.54) {
      const dTail = pt.distanceTo(P.Tail);
      rawWeights.set('Tail', 1.5 / (dTail * dTail + 0.004));
    }

    // C. Hoodie Cords (Front chest drawstrings)
    if (pt.z > 0.17 && pt.y >= 0.42 && pt.y <= 0.58 && Math.abs(pt.x) < 0.08) {
      if (pt.x > 0.01) {
        rawWeights.set('Cord.L', 3.0);
      } else if (pt.x < -0.01) {
        rawWeights.set('Cord.R', 3.0);
      }
    }

    // D. Left Arm
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

    // E. Right Arm
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

    // F. Left Leg
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

    // G. Right Leg
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

    // H. Torso
    if (pt.y >= 0.30 && pt.y <= 0.62 && Math.abs(pt.x) < 0.18 && pt.z >= -0.05) {
      const dHips = distToSeg(pt, P.Hips, P.Spine);
      const dSpine = distToSeg(pt, P.Spine, P.Chest);
      const dChest = distToSeg(pt, P.Chest, P.Neck);
      rawWeights.set('Hips', 1.0 / (dHips * dHips + 0.008));
      rawWeights.set('Spine', 1.0 / (dSpine * dSpine + 0.008));
      rawWeights.set('Chest', 1.0 / (dChest * dChest + 0.008));
    }

    // Safety fallback
    if (rawWeights.size === 0) {
      if (pt.y > 0.60) rawWeights.set('Head', 1.0);
      else if (pt.y < 0.35) rawWeights.set(pt.x > 0 ? 'Foot.L' : 'Foot.R', 1.0);
      else rawWeights.set('Chest', 1.0);
    }

    // Normalization to 4 influential joints
    const sorted = Array.from(rawWeights.entries()).sort((a, b) => b[1] - a[1]).slice(0, 4);
    let sum = sorted.reduce((acc, curr) => acc + curr[1], 0);
    if (sum === 0) sum = 1;

    for (let k = 0; k < 4; k++) {
      if (k < sorted.length) {
        const bName = sorted[k][0];
        const bIdx = boneIndices.get(bName);
        const wNorm = sorted[k][1] / sum;
        skinIndices[i * 4 + k] = bIdx;
        skinWeights[i * 4 + k] = wNorm;
        if (wNorm > 0.05) usageStats[bIdx]++;
      } else {
        skinIndices[i * 4 + k] = 0;
        skinWeights[i * 4 + k] = 0;
      }
    }
  }

  geometry.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(skinIndices, 4));
  geometry.setAttribute('skinWeight', new THREE.Float32BufferAttribute(skinWeights, 4));

  console.log('Skinning completed. Active bones summary:');
  BONE_SPECS.forEach((s, idx) => {
    console.log(`  ${s.name.padEnd(12)}: ${usageStats[idx]} vertices`);
  });

  // 4. Material calibration for vibrancy & anime rendering
  const material = originalMesh.material.clone();
  material.roughness = 0.48;
  material.metalness = 0.0;
  material.side = THREE.DoubleSide;
  material.shadowSide = THREE.DoubleSide;
  material.color.setRGB(1.0, 1.0, 1.0);

  // 5. Construct SkinnedMesh
  const skinnedMesh = new THREE.SkinnedMesh(geometry, material);
  skinnedMesh.name = 'SharkSkinnedMesh';
  skinnedMesh.castShadow = true;
  skinnedMesh.receiveShadow = true;
  skinnedMesh.frustumCulled = false;

  skinnedMesh.add(rootBone);
  skinnedMesh.bind(skeleton);

  // 6. Create High-Quality Animation Clips
  const rotTrack = (boneName, times, quats) => {
    const values = [];
    quats.forEach((q) => values.push(q.x, q.y, q.z, q.w));
    return new THREE.QuaternionKeyframeTrack(`${boneName}.quaternion`, times, values);
  };

  const posTrack = (boneName, times, positions) => {
    const values = [];
    positions.forEach((p) => values.push(p.x, p.y, p.z));
    return new THREE.VectorKeyframeTrack(`${boneName}.position`, times, values);
  };

  // Base rest rotations for arms (to hang naturally from T-pose down to sides)
  const ARM_REST_Z_L = -1.36; // drops left arm down
  const ARM_REST_Z_R = 1.36;  // drops right arm down
  const HIPS_REST_Y = 0.36;

  // --- A. IDLE CLIP (duration: 2.4s) ---
  const idleTracks = [];
  {
    const times = [0, 0.6, 1.2, 1.8, 2.4];

    // Hips vertical breathing bounce
    const hipsPositions = times.map((t) => {
      const dy = Math.sin((t / 2.4) * Math.PI * 2) * 0.008;
      return new THREE.Vector3(0, HIPS_REST_Y + dy, 0.10);
    });
    idleTracks.push(posTrack('Hips', times, hipsPositions));

    // Chest breathing pitch
    const chestQuats = times.map((t) => {
      const pitch = Math.sin((t / 2.4) * Math.PI * 2) * 0.025;
      return new THREE.Quaternion().setFromEuler(new THREE.Euler(pitch, 0, 0));
    });
    idleTracks.push(rotTrack('Chest', times, chestQuats));

    // Head counter-nod
    const headQuats = times.map((t) => {
      const pitch = -Math.sin((t / 2.4) * Math.PI * 2) * 0.015;
      return new THREE.Quaternion().setFromEuler(new THREE.Euler(pitch, 0, 0));
    });
    idleTracks.push(rotTrack('Head', times, headQuats));

    // Upper arms gentle sway at sides
    const armLQuats = times.map((t) => {
      const swayX = Math.sin((t / 2.4) * Math.PI * 2) * 0.02;
      const swayZ = ARM_REST_Z_L + Math.cos((t / 2.4) * Math.PI * 2) * 0.02;
      return new THREE.Quaternion().setFromEuler(new THREE.Euler(swayX, 0, swayZ, 'YXZ'));
    });
    idleTracks.push(rotTrack('UpperArm.L', times, armLQuats));

    const armRQuats = times.map((t) => {
      const swayX = -Math.sin((t / 2.4) * Math.PI * 2) * 0.02;
      const swayZ = ARM_REST_Z_R - Math.cos((t / 2.4) * Math.PI * 2) * 0.02;
      return new THREE.Quaternion().setFromEuler(new THREE.Euler(swayX, 0, swayZ, 'YXZ'));
    });
    idleTracks.push(rotTrack('UpperArm.R', times, armRQuats));

    // Forearms slight relaxed bend
    const fArmL = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0.20, 0));
    idleTracks.push(rotTrack('Forearm.L', [0, 2.4], [fArmL, fArmL]));
    const fArmR = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -0.20, 0));
    idleTracks.push(rotTrack('Forearm.R', [0, 2.4], [fArmR, fArmR]));

    // Tail gentle ocean hydrodynamic sway
    const tailQuats = times.map((t) => {
      const yaw = Math.sin((t / 2.4) * Math.PI * 2) * 0.14;
      const pitch = Math.cos((t / 2.4) * Math.PI * 4) * 0.04 - 0.05;
      return new THREE.Quaternion().setFromEuler(new THREE.Euler(pitch, yaw, 0));
    });
    idleTracks.push(rotTrack('Tail', times, tailQuats));

    // Cords subtle drift
    const cordLQuats = times.map((t) => {
      const pitch = Math.sin((t / 2.4) * Math.PI * 2) * 0.04;
      return new THREE.Quaternion().setFromEuler(new THREE.Euler(pitch, 0, 0.02));
    });
    idleTracks.push(rotTrack('Cord.L', times, cordLQuats));

    const cordRQuats = times.map((t) => {
      const pitch = Math.sin((t / 2.4) * Math.PI * 2 + 0.5) * 0.04;
      return new THREE.Quaternion().setFromEuler(new THREE.Euler(pitch, 0, -0.02));
    });
    idleTracks.push(rotTrack('Cord.R', times, cordRQuats));
  }
  const idleClip = new THREE.AnimationClip('Idle', 2.4, idleTracks);

  // --- B. WALK CLIP (duration: 0.8s) ---
  const walkTracks = [];
  {
    const steps = 9;
    const times = Array.from({ length: steps }, (_, i) => (i / (steps - 1)) * 0.8);

    // Hips bounce
    const hipsPositions = times.map((t) => {
      const phase = (t / 0.8) * Math.PI * 2;
      const bounce = Math.abs(Math.cos(phase)) * 0.025;
      return new THREE.Vector3(0, HIPS_REST_Y + bounce, 0.10);
    });
    walkTracks.push(posTrack('Hips', times, hipsPositions));

    // Legs stride & flexion
    const thighLQuats = times.map((t) => {
      const phase = (t / 0.8) * Math.PI * 2;
      const pitch = Math.sin(phase) * 0.58;
      return new THREE.Quaternion().setFromEuler(new THREE.Euler(pitch, 0, 0));
    });
    walkTracks.push(rotTrack('Thigh.L', times, thighLQuats));

    const thighRQuats = times.map((t) => {
      const phase = (t / 0.8) * Math.PI * 2;
      const pitch = -Math.sin(phase) * 0.58;
      return new THREE.Quaternion().setFromEuler(new THREE.Euler(pitch, 0, 0));
    });
    walkTracks.push(rotTrack('Thigh.R', times, thighRQuats));

    const shinLQuats = times.map((t) => {
      const phase = (t / 0.8) * Math.PI * 2;
      const bend = Math.max(0, -Math.sin(phase)) * 0.75;
      return new THREE.Quaternion().setFromEuler(new THREE.Euler(bend, 0, 0));
    });
    walkTracks.push(rotTrack('Shin.L', times, shinLQuats));

    const shinRQuats = times.map((t) => {
      const phase = (t / 0.8) * Math.PI * 2;
      const bend = Math.max(0, Math.sin(phase)) * 0.75;
      return new THREE.Quaternion().setFromEuler(new THREE.Euler(bend, 0, 0));
    });
    walkTracks.push(rotTrack('Shin.R', times, shinRQuats));

    const footLQuats = times.map((t) => {
      const phase = (t / 0.8) * Math.PI * 2;
      const pitch = -Math.cos(phase) * 0.22;
      return new THREE.Quaternion().setFromEuler(new THREE.Euler(pitch, 0, 0));
    });
    walkTracks.push(rotTrack('Foot.L', times, footLQuats));

    const footRQuats = times.map((t) => {
      const phase = (t / 0.8) * Math.PI * 2;
      const pitch = Math.cos(phase) * 0.22;
      return new THREE.Quaternion().setFromEuler(new THREE.Euler(pitch, 0, 0));
    });
    walkTracks.push(rotTrack('Foot.R', times, footRQuats));

    // Arms counter-pump
    const armLQuats = times.map((t) => {
      const phase = (t / 0.8) * Math.PI * 2;
      const pumpX = -Math.sin(phase) * 0.52;
      const swayZ = ARM_REST_Z_L - Math.abs(Math.cos(phase)) * 0.08;
      return new THREE.Quaternion().setFromEuler(new THREE.Euler(pumpX, 0, swayZ, 'YXZ'));
    });
    walkTracks.push(rotTrack('UpperArm.L', times, armLQuats));

    const armRQuats = times.map((t) => {
      const phase = (t / 0.8) * Math.PI * 2;
      const pumpX = Math.sin(phase) * 0.52;
      const swayZ = ARM_REST_Z_R + Math.abs(Math.cos(phase)) * 0.08;
      return new THREE.Quaternion().setFromEuler(new THREE.Euler(pumpX, 0, swayZ, 'YXZ'));
    });
    walkTracks.push(rotTrack('UpperArm.R', times, armRQuats));

    // Forearms dynamic flexion on forward stroke
    const fArmLQuats = times.map((t) => {
      const phase = (t / 0.8) * Math.PI * 2;
      const bend = 0.25 + Math.max(0, -Math.sin(phase)) * 0.35;
      return new THREE.Quaternion().setFromEuler(new THREE.Euler(0, bend, 0));
    });
    walkTracks.push(rotTrack('Forearm.L', times, fArmLQuats));

    const fArmRQuats = times.map((t) => {
      const phase = (t / 0.8) * Math.PI * 2;
      const bend = -0.25 - Math.max(0, Math.sin(phase)) * 0.35;
      return new THREE.Quaternion().setFromEuler(new THREE.Euler(0, bend, 0));
    });
    walkTracks.push(rotTrack('Forearm.R', times, fArmRQuats));

    // Torso yaw & lean
    const chestQuats = times.map((t) => {
      const phase = (t / 0.8) * Math.PI * 2;
      const yaw = Math.sin(phase) * 0.08;
      const pitch = 0.06;
      return new THREE.Quaternion().setFromEuler(new THREE.Euler(pitch, yaw, 0));
    });
    walkTracks.push(rotTrack('Chest', times, chestQuats));

    // Tail rhythmic hydrodynamic wag with phase lag
    const tailQuats = times.map((t) => {
      const phase = (t / 0.8) * Math.PI * 2;
      const yaw = Math.sin(phase - 0.4) * 0.28;
      const pitch = -0.10 + Math.cos(phase * 2) * 0.06;
      return new THREE.Quaternion().setFromEuler(new THREE.Euler(pitch, yaw, 0));
    });
    walkTracks.push(rotTrack('Tail', times, tailQuats));

    // Cords walking swing
    const cordLQuats = times.map((t) => {
      const phase = (t / 0.8) * Math.PI * 2;
      const pitch = Math.sin(phase) * 0.16;
      return new THREE.Quaternion().setFromEuler(new THREE.Euler(pitch, 0, 0.05));
    });
    walkTracks.push(rotTrack('Cord.L', times, cordLQuats));

    const cordRQuats = times.map((t) => {
      const phase = (t / 0.8) * Math.PI * 2;
      const pitch = -Math.sin(phase) * 0.16;
      return new THREE.Quaternion().setFromEuler(new THREE.Euler(pitch, 0, -0.05));
    });
    walkTracks.push(rotTrack('Cord.R', times, cordRQuats));
  }
  const walkClip = new THREE.AnimationClip('Walk', 0.8, walkTracks);

  // --- C. RUN CLIP (duration: 0.55s) ---
  const runTracks = [];
  {
    const steps = 9;
    const times = Array.from({ length: steps }, (_, i) => (i / (steps - 1)) * 0.55);

    // Hips springy bounce & forward thrust
    const hipsPositions = times.map((t) => {
      const phase = (t / 0.55) * Math.PI * 2;
      const bounce = Math.abs(Math.cos(phase)) * 0.04;
      return new THREE.Vector3(0, HIPS_REST_Y + bounce, 0.10);
    });
    runTracks.push(posTrack('Hips', times, hipsPositions));

    // High knee drive and stride
    const thighLQuats = times.map((t) => {
      const phase = (t / 0.55) * Math.PI * 2;
      const pitch = Math.sin(phase) * 0.88;
      return new THREE.Quaternion().setFromEuler(new THREE.Euler(pitch, 0, 0));
    });
    runTracks.push(rotTrack('Thigh.L', times, thighLQuats));

    const thighRQuats = times.map((t) => {
      const phase = (t / 0.55) * Math.PI * 2;
      const pitch = -Math.sin(phase) * 0.88;
      return new THREE.Quaternion().setFromEuler(new THREE.Euler(pitch, 0, 0));
    });
    runTracks.push(rotTrack('Thigh.R', times, thighRQuats));

    const shinLQuats = times.map((t) => {
      const phase = (t / 0.55) * Math.PI * 2;
      const bend = Math.max(0, -Math.sin(phase)) * 1.10;
      return new THREE.Quaternion().setFromEuler(new THREE.Euler(bend, 0, 0));
    });
    runTracks.push(rotTrack('Shin.L', times, shinLQuats));

    const shinRQuats = times.map((t) => {
      const phase = (t / 0.55) * Math.PI * 2;
      const bend = Math.max(0, Math.sin(phase)) * 1.10;
      return new THREE.Quaternion().setFromEuler(new THREE.Euler(bend, 0, 0));
    });
    runTracks.push(rotTrack('Shin.R', times, shinRQuats));

    // Punchy arm counter-pump with aerodynamic tuck
    const armLQuats = times.map((t) => {
      const phase = (t / 0.55) * Math.PI * 2;
      const pumpX = -Math.sin(phase) * 0.82;
      const tuckZ = ARM_REST_Z_L - 0.15;
      return new THREE.Quaternion().setFromEuler(new THREE.Euler(pumpX, 0, tuckZ, 'YXZ'));
    });
    runTracks.push(rotTrack('UpperArm.L', times, armLQuats));

    const armRQuats = times.map((t) => {
      const phase = (t / 0.55) * Math.PI * 2;
      const pumpX = Math.sin(phase) * 0.82;
      const tuckZ = ARM_REST_Z_R + 0.15;
      return new THREE.Quaternion().setFromEuler(new THREE.Euler(pumpX, 0, tuckZ, 'YXZ'));
    });
    runTracks.push(rotTrack('UpperArm.R', times, armRQuats));

    // Forward sprint lean
    const chestQuats = times.map((t) => {
      const phase = (t / 0.55) * Math.PI * 2;
      const yaw = Math.sin(phase) * 0.12;
      const pitch = 0.22;
      return new THREE.Quaternion().setFromEuler(new THREE.Euler(pitch, yaw, 0));
    });
    runTracks.push(rotTrack('Chest', times, chestQuats));

    // Tail fast aerodynamic stabilization wag
    const tailQuats = times.map((t) => {
      const phase = (t / 0.55) * Math.PI * 2;
      const yaw = Math.sin(phase - 0.35) * 0.38;
      const pitch = -0.16 + Math.cos(phase * 2) * 0.08;
      return new THREE.Quaternion().setFromEuler(new THREE.Euler(pitch, yaw, 0));
    });
    runTracks.push(rotTrack('Tail', times, tailQuats));
  }
  const runClip = new THREE.AnimationClip('Run', 0.55, runTracks);

  // --- D. JUMP CLIP (duration: 1.0s) ---
  const jumpTracks = [];
  {
    const times = [0, 0.15, 0.35, 0.70, 1.0];

    // Hips: Crouch -> Launch -> Air Apex -> Landing
    const hipsPositions = [
      new THREE.Vector3(0, HIPS_REST_Y - 0.06, 0.10), // crouch
      new THREE.Vector3(0, HIPS_REST_Y + 0.08, 0.10), // launch extension
      new THREE.Vector3(0, HIPS_REST_Y + 0.04, 0.10), // apex
      new THREE.Vector3(0, HIPS_REST_Y - 0.08, 0.10), // landing impact
      new THREE.Vector3(0, HIPS_REST_Y, 0.10),        // recovery
    ];
    jumpTracks.push(posTrack('Hips', times, hipsPositions));

    // Thighs tuck in air
    const thighLQuats = [
      new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.35, 0, 0)),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(0.20, 0, 0)),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.45, 0, 0)),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.40, 0, 0)),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0)),
    ];
    jumpTracks.push(rotTrack('Thigh.L', times, thighLQuats));
    jumpTracks.push(rotTrack('Thigh.R', times, thighLQuats));

    // Shins flexion
    const shinQuats = [
      new THREE.Quaternion().setFromEuler(new THREE.Euler(0.70, 0, 0)),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(0.10, 0, 0)),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(0.85, 0, 0)),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(0.80, 0, 0)),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0)),
    ];
    jumpTracks.push(rotTrack('Shin.L', times, shinQuats));
    jumpTracks.push(rotTrack('Shin.R', times, shinQuats));

    // Arms spread for aerodynamic balance
    const armLQuats = [
      new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.40, 0, ARM_REST_Z_L)),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(0.35, 0, ARM_REST_Z_L - 0.30)),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(0.10, 0, ARM_REST_Z_L - 0.25)),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.35, 0, ARM_REST_Z_L)),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, ARM_REST_Z_L)),
    ];
    jumpTracks.push(rotTrack('UpperArm.L', times, armLQuats));

    const armRQuats = [
      new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.40, 0, ARM_REST_Z_R)),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(0.35, 0, ARM_REST_Z_R + 0.30)),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(0.10, 0, ARM_REST_Z_R + 0.25)),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.35, 0, ARM_REST_Z_R)),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, ARM_REST_Z_R)),
    ];
    jumpTracks.push(rotTrack('UpperArm.R', times, armRQuats));

    // Tail whips up on jump
    const tailQuats = [
      new THREE.Quaternion().setFromEuler(new THREE.Euler(0.30, 0, 0)),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.45, 0, 0)),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.25, 0, 0)),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(0.40, 0, 0)),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.05, 0, 0)),
    ];
    jumpTracks.push(rotTrack('Tail', times, tailQuats));
  }
  const jumpClip = new THREE.AnimationClip('Jump', 1.0, jumpTracks);

  const animations = [idleClip, walkClip, runClip, jumpClip];
  console.log(`Created ${animations.length} animation clips: ${animations.map((a) => a.name).join(', ')}`);

  // 7. Assemble Export Scene
  const exportScene = new THREE.Scene();
  exportScene.name = 'SharkCharacterScene';
  exportScene.add(skinnedMesh);

  // 8. GLTF Export
  console.log('Exporting GLB with GLTFExporter...');
  const exporter = new GLTFExporter();
  const glbBuffer = await exporter.parseAsync(exportScene, {
    binary: true,
    animations,
    embedImages: true,
  });

  console.log(`GLB export success! Binary size: ${(glbBuffer.byteLength / 1024 / 1024).toFixed(2)} MB`);

  // Save to public/3dgame and dist/3dgame
  const targetPaths = [
    'public/3dgame/character.glb',
    'public/3dgame/shark_character.glb',
    'dist/3dgame/character.glb',
    'dist/3dgame/shark_character.glb',
  ];

  for (const targetPath of targetPaths) {
    const fullPath = path.resolve('D:/IDEwork/SiteTopzeira', targetPath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, Buffer.from(glbBuffer));
    console.log(`Wrote -> ${targetPath} (${glbBuffer.byteLength} bytes)`);
  }

  console.log('ALL GLB ASSETS EXPORTED SUCCESSFULLY!');
}

main().catch((err) => {
  console.error('Fatal Error during rigging & animation:', err);
  process.exit(1);
});
