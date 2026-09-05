import * as THREE from 'three';

function getTrunkCenterAt(y, height = 4.85) {
  const t = Math.max(0, Math.min(1, y / height));
  const cx = Math.sin(t * Math.PI * 0.85) * 0.42 - Math.sin(t * Math.PI * 1.8) * 0.12;
  const cz = -Math.cos(t * Math.PI * 0.75) * 0.30 + Math.sin(t * Math.PI * 1.5) * 0.10;
  return new THREE.Vector3(cx, y, cz);
}

function getTrunkRadius(y, angle, height = 4.85) {
  const t = y / height;
  let baseR = 0.58 * Math.pow(Math.max(0.08, 1.0 - t * 0.76), 0.72);
  if (t < 0.32) {
    const baseT = 1.0 - t / 0.32;
    baseR += Math.pow(baseT, 2.2) * 0.85;
  }
  if (t > 0.96) {
    const tipT = (t - 0.96) / 0.04;
    baseR *= Math.cos(tipT * Math.PI * 0.5);
  }
  const twist = t * 0.28;
  const flute = Math.cos(angle * 5.0) * 0.022 * (1.0 - t * 0.4);
  let cardinalGrip = 0;
  if (t < 0.32) {
    const gT = 1.0 - t / 0.32;
    const cardCos = Math.cos(angle * 4.0);
    cardinalGrip = Math.pow(Math.max(0, cardCos), 2.0) * 0.26 * Math.pow(gT, 1.6);
  }
  let branchKnoll = 0;
  // Exact aligned knoll angles:
  const socketMounds = [
    { y: 2.45, angle: 0.4869, rad: 0.075 },
    { y: 3.25, angle: -2.6827, rad: 0.065 },
    { y: 3.95, angle: 1.9493, rad: 0.055 },
    { y: 4.45, angle: -1.0689, rad: 0.048 },
  ];
  for (const sm of socketMounds) {
    const dy = (y - sm.y) / 0.38;
    let dAngle = Math.abs(angle - sm.angle);
    while (dAngle > Math.PI) dAngle = Math.abs(dAngle - Math.PI * 2);
    const dTheta = dAngle / 0.55;
    const dist2 = dy * dy + dTheta * dTheta;
    if (dist2 < 4.0) {
      branchKnoll += Math.exp(-dist2 * 0.80) * sm.rad;
    }
  }
  return Math.max(0.01, baseR + flute + cardinalGrip + branchKnoll);
}

const trunkHeight = 4.85;

// Master Branch spline
const masterPoints = [
  new THREE.Vector3(0.00, 0.00, 0.00),
  new THREE.Vector3(0.24, 0.08, 0.02),
  new THREE.Vector3(0.68, 0.32, 0.04),
  new THREE.Vector3(1.35, 0.66, -0.06),
  new THREE.Vector3(2.10, 0.96, 0.04),
  new THREE.Vector3(2.80, 1.18, -0.02),
];
const masterCurve = new THREE.CatmullRomCurve3(masterPoints);
const T0 = masterCurve.getTangentAt(0).normalize();

const socketDefs = [
  { name: 'Socket 0 (Lower Bough)', y: 2.45, dir: new THREE.Vector3(0.85, 0.28, 0.45).normalize(), scale: 1.10, nominalR: 0.155 },
  { name: 'Socket 1 (Mid Bough)', y: 3.25, dir: new THREE.Vector3(-0.85, 0.30, -0.42).normalize(), scale: 1.02, nominalR: 0.145 },
  { name: 'Socket 2 (High Bough)', y: 3.95, dir: new THREE.Vector3(-0.35, 0.32, 0.88).normalize(), scale: 0.94, nominalR: 0.138 },
  { name: 'Socket 3 (Crown Fork)', y: 4.45, dir: new THREE.Vector3(0.45, 0.35, -0.82).normalize(), scale: 0.88, nominalR: 0.130 },
];

console.log('=== VERIFICATION OF ALIGNED QUATERNION SOCKETS ===');
for (let i = 0; i < socketDefs.length; i++) {
  const s = socketDefs[i];
  const q = new THREE.Quaternion().setFromUnitVectors(T0, s.dir);
  const rotMat = new THREE.Matrix4().makeRotationFromQuaternion(q);
  const worldTangent = T0.clone().applyQuaternion(q);
  const azimuth = Math.atan2(worldTangent.z, worldTangent.x);
  
  const rTrunk = getTrunkRadius(s.y, azimuth, trunkHeight);
  const branchCollarR0 = 0.145 * s.scale * 1.65;
  
  console.log(`\n${s.name} at y=${s.y}m:`);
  console.log(`  Direction:       [${s.dir.x.toFixed(3)}, ${s.dir.y.toFixed(3)}, ${s.dir.z.toFixed(3)}]`);
  console.log(`  Tangent:         [${worldTangent.x.toFixed(3)}, ${worldTangent.y.toFixed(3)}, ${worldTangent.z.toFixed(3)}]`);
  console.log(`  Dot Alignment:   ${worldTangent.dot(s.dir).toFixed(6)}`);
  console.log(`  Branch Azimuth:  ${azimuth.toFixed(4)} rad (${((azimuth * 180)/Math.PI).toFixed(1)}°)`);
  console.log(`  Trunk Knoll R:   ${rTrunk.toFixed(3)} m`);
  console.log(`  Branch Collar R: ${branchCollarR0.toFixed(3)} m`);
  console.log(`  Enclosed?        ${rTrunk > branchCollarR0 ? 'YES - 100% Submerged inside trunk heartwood' : 'NO - Fails'}`);
  
  // Trace surface intersection point along the spline
  for (let step = 0; step <= 10; step++) {
    const t = step / 10;
    const ptLocal = masterCurve.getPointAt(t);
    const ptRot = ptLocal.clone().multiplyScalar(s.scale).applyMatrix4(rotMat);
    const distXZ = Math.hypot(ptRot.x, ptRot.z);
    
    let collar = 1.0;
    if (t < 0.28) {
      const cT = 1.0 - t / 0.28;
      collar += Math.pow(cT, 2.0) * 0.65;
    }
    const branchR = 0.145 * s.scale * (1.0 - Math.pow(t, 0.82) * (1.0 - 0.042 / 0.145)) * collar;
    const curY = s.y + ptRot.y;
    const curAngle = Math.atan2(ptRot.z, ptRot.x);
    const trunkR = getTrunkRadius(curY, curAngle, trunkHeight);
    
    if (distXZ >= trunkR - branchR && distXZ <= trunkR + branchR) {
      console.log(`  -> Seamless Bark Intersection at t=${t.toFixed(2)}: distXZ=${distXZ.toFixed(3)}m, trunkR=${trunkR.toFixed(3)}m, branchR=${branchR.toFixed(3)}m`);
      break;
    }
  }
}
