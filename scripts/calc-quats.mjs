import * as THREE from 'three';

// Replicate getTrunkCenterAt
function getTrunkCenterAt(y, height = 4.85) {
  const t = Math.max(0, Math.min(1, y / height));
  const cx = Math.sin(t * Math.PI * 0.85) * 0.42 - Math.sin(t * Math.PI * 1.8) * 0.12;
  const cz = -Math.cos(t * Math.PI * 0.75) * 0.30 + Math.sin(t * Math.PI * 1.5) * 0.10;
  return new THREE.Vector3(cx, y, cz);
}

// Master branch spline points in local space
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
console.log('Master Branch Initial Tangent T0:', T0.toArray().map(v => v.toFixed(4)));

// Desired branch growth directions based on botanical harmony:
// 4 boughs radiating around the trunk in golden angle / 4-quadrant balance
const targetDirections = [
  { name: 'Bough 0 (South-East)', y: 2.45, dir: new THREE.Vector3(0.85, 0.28, 0.45).normalize(), scale: 1.10 },
  { name: 'Bough 1 (North-West)', y: 3.25, dir: new THREE.Vector3(-0.85, 0.30, -0.42).normalize(), scale: 1.02 },
  { name: 'Bough 2 (South-West)', y: 3.95, dir: new THREE.Vector3(-0.35, 0.32, 0.88).normalize(), scale: 0.94 },
  { name: 'Bough 3 (North-East)', y: 4.45, dir: new THREE.Vector3(0.45, 0.35, -0.82).normalize(), scale: 0.88 },
];

for (const b of targetDirections) {
  // Compute exact quaternion that rotates T0 into b.dir
  const q = new THREE.Quaternion().setFromUnitVectors(T0, b.dir);
  const rotEuler = new THREE.Euler().setFromQuaternion(q, 'XYZ');
  
  // Verify that T0 transformed by q equals b.dir
  const rotatedT0 = T0.clone().applyQuaternion(q);
  const dot = rotatedT0.dot(b.dir);
  
  // Calculate polar angle on trunk surface
  const azimuth = Math.atan2(b.dir.z, b.dir.x);
  
  console.log(`\n${b.name}:`);
  console.log(`  Target Dir:   [${b.dir.x.toFixed(3)}, ${b.dir.y.toFixed(3)}, ${b.dir.z.toFixed(3)}]`);
  console.log(`  Euler Angles: [${rotEuler.x.toFixed(4)}, ${rotEuler.y.toFixed(4)}, ${rotEuler.z.toFixed(4)}]`);
  console.log(`  Azimuth:      ${azimuth.toFixed(4)} rad (${((azimuth * 180) / Math.PI).toFixed(1)}°)`);
  console.log(`  Alignment Dot Product: ${dot.toFixed(6)} (1.0 = PERFECT ALIGNMENT)`);
}
