import * as THREE from 'three';

function getTrunkCenterAt(y, height = 4.85) {
  const t = Math.max(0, Math.min(1, y / height));
  const cx = Math.sin(t * Math.PI * 0.85) * 0.42 - Math.sin(t * Math.PI * 1.8) * 0.12;
  const cz = -Math.cos(t * Math.PI * 0.75) * 0.30 + Math.sin(t * Math.PI * 1.5) * 0.10;
  return new THREE.Vector3(cx, y, cz);
}

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
  { name: 'Socket 0 (Lower Bough)', y: 2.45, dir: new THREE.Vector3(0.85, 0.28, 0.45).normalize(), scale: 1.10 },
  { name: 'Socket 1 (Mid Bough)', y: 3.25, dir: new THREE.Vector3(-0.85, 0.30, -0.42).normalize(), scale: 1.02 },
  { name: 'Socket 2 (High Bough)', y: 3.95, dir: new THREE.Vector3(-0.35, 0.32, 0.88).normalize(), scale: 0.94 },
  { name: 'Socket 3 (Crown Fork)', y: 4.45, dir: new THREE.Vector3(0.45, 0.35, -0.82).normalize(), scale: 0.88 },
];

console.log('=== WORLD POSITIONS OF LATERAL BOUGH APEXES & CLOUDS ===');
const boughTips = [];
for (let i = 0; i < socketDefs.length; i++) {
  const s = socketDefs[i];
  const q = new THREE.Quaternion().setFromUnitVectors(T0, s.dir);
  const center = getTrunkCenterAt(s.y, 4.85);
  const localTip = masterPoints[masterPoints.length - 1].clone().multiplyScalar(s.scale);
  const worldTip = localTip.clone().applyQuaternion(q).add(center);
  boughTips.push(worldTip);
  console.log(`${s.name}:`);
  console.log(`  Trunk Base: [${center.x.toFixed(2)}, ${center.y.toFixed(2)}, ${center.z.toFixed(2)}]`);
  console.log(`  Apex Tip:   [${worldTip.x.toFixed(2)}, ${worldTip.y.toFixed(2)}, ${worldTip.z.toFixed(2)}]`);
}

// Distance between adjacent boughs in XZ and 3D
console.log('\n=== ADJACENT BOUGH SEPARATIONS (GAPS TO BRIDGE) ===');
for (let i = 0; i < boughTips.length; i++) {
  const nextI = (i + 1) % boughTips.length;
  const p1 = boughTips[i];
  const p2 = boughTips[nextI];
  const dist3D = p1.distanceTo(p2);
  const distXZ = Math.hypot(p1.x - p2.x, p1.z - p2.z);
  const midPoint = p1.clone().add(p2).multiplyScalar(0.5);
  console.log(`Bough ${i} -> Bough ${nextI}:`);
  console.log(`  3D Distance: ${dist3D.toFixed(2)}m (XZ: ${distXZ.toFixed(2)}m, dY: ${(p2.y - p1.y).toFixed(2)}m)`);
  console.log(`  Natural Bridge Midpoint: [${midPoint.x.toFixed(2)}, ${midPoint.y.toFixed(2)}, ${midPoint.z.toFixed(2)}]`);
}
