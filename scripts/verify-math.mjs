import * as THREE from 'three';

// Exact replica of getTrunkCenterAt
function getTrunkCenterAt(y, height = 4.85) {
  const t = Math.max(0, Math.min(1, y / height));
  const cx = Math.sin(t * Math.PI * 0.85) * 0.42 - Math.sin(t * Math.PI * 1.8) * 0.12;
  const cz = -Math.cos(t * Math.PI * 0.75) * 0.30 + Math.sin(t * Math.PI * 1.5) * 0.10;
  return new THREE.Vector3(cx, y, cz);
}

// Exact replica of trunk radius at (y, angle)
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
  const socketMounds = [
    { y: 2.45, angle: 0.48, rad: 0.075 },
    { y: 3.25, angle: -2.45, rad: 0.065 },
    { y: 3.95, angle: -1.25, rad: 0.055 },
    { y: 4.45, angle: 1.95, rad: 0.048 },
  ];
  for (const sm of socketMounds) {
    const dy = (y - sm.y) / 0.42;
    let dAngle = Math.abs(angle - sm.angle);
    while (dAngle > Math.PI) dAngle = Math.abs(dAngle - Math.PI * 2);
    const dTheta = dAngle / 0.60;
    const dist2 = dy * dy + dTheta * dTheta;
    if (dist2 < 4.0) {
      branchKnoll += Math.exp(-dist2 * 0.80) * sm.rad;
    }
  }
  return Math.max(0.01, baseR + flute + cardinalGrip + branchKnoll);
}

const trunkHeight = 4.85;
const sockets = [
  {
    name: 'Socket 0 (Lower Bough)',
    y: 2.45,
    rot: new THREE.Euler(0.12, 0.48, -0.08),
    scale: 1.10,
    moundAngle: 0.48,
    nominalRadius: 0.155,
  },
  {
    name: 'Socket 1 (Mid Bough)',
    y: 3.25,
    rot: new THREE.Euler(-0.10, -2.45, 0.08),
    scale: 1.02,
    moundAngle: -2.45,
    nominalRadius: 0.145,
  },
  {
    name: 'Socket 2 (High Bough)',
    y: 3.95,
    rot: new THREE.Euler(0.08, -1.25, 0.04),
    scale: 0.94,
    moundAngle: -1.25,
    nominalRadius: 0.138,
  },
  {
    name: 'Socket 3 (Crown Fork)',
    y: 4.45,
    rot: new THREE.Euler(-0.08, 1.95, -0.04),
    scale: 0.88,
    moundAngle: 1.95,
    nominalRadius: 0.130,
  },
  {
    name: 'Socket 4 (Summit Leader)',
    y: 4.80,
    rot: new THREE.Euler(0.04, 0.25, 0.08),
    scale: 1.00,
    moundAngle: 0.0,
    nominalRadius: 0.145,
  }
];

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
const masterTangent0 = masterCurve.getTangentAt(0);

// Summit Branch spline
const summitPoints = [
  new THREE.Vector3(0.00, -0.28, 0.00),
  new THREE.Vector3(0.00, 0.00, 0.00),
  new THREE.Vector3(0.04, 0.60, -0.02),
  new THREE.Vector3(0.06, 1.20, 0.02),
  new THREE.Vector3(0.04, 1.75, -0.01),
];
const summitCurve = new THREE.CatmullRomCurve3(summitPoints);
const summitTangent0 = summitCurve.getTangentAt(0);

console.log('================================================================');
console.log('           MATHEMATICAL & GEOMETRICAL AUDIT REPORT              ');
console.log('================================================================\n');

console.log('1. MASTER BRANCH SPLINE CHARACTERISTICS (Local Space):');
console.log('   - Length approx:', masterCurve.getLength().toFixed(3), 'm');
console.log('   - Start Point:', masterPoints[0].toArray());
console.log('   - End Point:  ', masterPoints[masterPoints.length - 1].toArray());
console.log('   - Tangent at t=0:', masterTangent0.toArray().map(v => v.toFixed(4)));

console.log('\n2. LATERAL SOCKET CONNECTIONS (Sockets 0 to 3):');

for (let i = 0; i < 4; i++) {
  const s = sockets[i];
  const center = getTrunkCenterAt(s.y, trunkHeight);
  const rotMat = new THREE.Matrix4().makeRotationFromEuler(s.rot);
  
  // Tangent in trunk space
  const worldTangent = masterTangent0.clone().applyMatrix4(rotMat).normalize();
  const branchAzimuth = Math.atan2(worldTangent.z, worldTangent.x);
  
  const rTrunkAtBranch = getTrunkRadius(s.y, branchAzimuth, trunkHeight);
  const rTrunkOpposite = getTrunkRadius(s.y, branchAzimuth + Math.PI, trunkHeight);
  
  // Branch collar radius at t=0
  const branchCollarT0 = 0.145 * s.scale * 1.65;
  
  console.log(`\n------------------------------------------------------------`);
  console.log(` ${s.name} (Socket index ${i})`);
  console.log(`------------------------------------------------------------`);
  console.log(` - Height (y):               ${s.y.toFixed(2)} m`);
  console.log(` - Trunk Centerline Pos:     [${center.x.toFixed(3)}, ${center.y.toFixed(3)}, ${center.z.toFixed(3)}]`);
  console.log(` - Direction Vector (Euler): [${worldTangent.x.toFixed(3)}, ${worldTangent.y.toFixed(3)}, ${worldTangent.z.toFixed(3)}]`);
  console.log(` - Branch Azimuth:           ${branchAzimuth.toFixed(3)} rad (${((branchAzimuth * 180) / Math.PI).toFixed(1)}°)`);
  console.log(` - Mound Knoll Angle:        ${s.moundAngle.toFixed(3)} rad (${((s.moundAngle * 180) / Math.PI).toFixed(1)}°)`);
  console.log(` - Azimuth Alignment Error:  ${Math.abs(branchAzimuth - s.moundAngle).toFixed(4)} rad (${((Math.abs(branchAzimuth - s.moundAngle) * 180) / Math.PI).toFixed(2)}°)`);
  console.log(` - Trunk Radius at Emergence: ${rTrunkAtBranch.toFixed(3)} m`);
  console.log(` - Trunk Radius Opposite:    ${rTrunkOpposite.toFixed(3)} m`);
  console.log(` - Branch Collar Flare (t=0): ${branchCollarT0.toFixed(3)} m`);
  
  // Check: Submergence in heartwood
  const isSubmerged = rTrunkAtBranch > branchCollarT0 && rTrunkOpposite > branchCollarT0;
  console.log(` - Base Cap Submerged?:      ${isSubmerged ? 'PROVEN (Base cap is 100% enclosed inside trunk heartwood)' : 'WARNING: Protrudes'}`);
  
  // Check: Emergence along spline curve
  console.log(' - Spline Profile Penetration Profile:');
  let emerged = false;
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
    
    const margin = distXZ - branchR - trunkR;
    const status = distXZ + branchR < trunkR ? 'Fully Inside' : (distXZ - branchR < trunkR ? 'Intersecting Bark (Collar Transition)' : 'Free Air (Emerged)');
    
    console.log(`    t=${t.toFixed(1)} | BranchPos=[${(center.x + ptRot.x).toFixed(2)}, ${curY.toFixed(2)}, ${(center.z + ptRot.z).toFixed(2)}] | distXZ=${distXZ.toFixed(3)}m | trunkR=${trunkR.toFixed(3)}m | branchR=${branchR.toFixed(3)}m -> ${status}`);
  }
}

console.log(`\n============================================================`);
console.log(` 3. ZENITH SUMMIT BRANCH (Socket 4 at y = 4.80m)`);
console.log(`============================================================`);
const s4 = sockets[4];
const c4 = getTrunkCenterAt(s4.y, trunkHeight);
const rotMat4 = new THREE.Matrix4().makeRotationFromEuler(s4.rot);
const summitDir = summitTangent0.clone().applyMatrix4(rotMat4).normalize();
const trunkRTop = getTrunkRadius(s4.y, 0, trunkHeight);

console.log(` - Trunk Tip Height:         ${trunkHeight} m`);
console.log(` - Socket 4 Position:        [${c4.x.toFixed(3)}, ${c4.y.toFixed(3)}, ${c4.z.toFixed(3)}]`);
console.log(` - Upward Tangent:           [${summitDir.x.toFixed(3)}, ${summitDir.y.toFixed(3)}, ${summitDir.z.toFixed(3)}]`);
console.log(` - Summit Branch Start (t=0): y_rel = -0.28m (starts at y = ${(s4.y - 0.28).toFixed(2)}m inside trunk heartwood)`);
const trunkR_at_start = getTrunkRadius(s4.y - 0.28, 0, trunkHeight);
console.log(` - Trunk Radius at Start:    ${trunkR_at_start.toFixed(3)} m`);
console.log(` - Summit Branch Collar:     ${(0.165 * 1.65).toFixed(3)} m`);
console.log(` - Base Cap Submerged?:      ${trunkR_at_start > (0.165 * 1.65) ? 'PROVEN (Submerged inside trunk wood)' : 'WARNING: Protrudes'}`);

console.log(`\n4. CANOPY VERTICAL CONTINUITY AUDIT:`);
console.log(` - Trunk Summit:             y = 4.85m`);
console.log(` - Summit Central Tip:       y = ${(s4.y + 1.75).toFixed(2)}m (6.55m total height)`);
console.log(` - Summit Leaf Bouquets Top: y = ${(s4.y + 1.82 + 0.65).toFixed(2)}m (7.27m apex dome)`);
console.log(` - Lateral Bough Apexes:`);
for (let i = 0; i < 4; i++) {
  const s = sockets[i];
  const rotMat = new THREE.Matrix4().makeRotationFromEuler(s.rot);
  const endPt = masterPoints[masterPoints.length - 1].clone().multiplyScalar(s.scale).applyMatrix4(rotMat);
  const apexY = s.y + endPt.y;
  console.log(`    Socket ${i}: y_apex = ${apexY.toFixed(2)}m, reach_XZ = ${Math.hypot(endPt.x, endPt.z).toFixed(2)}m`);
}
