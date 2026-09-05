import * as THREE from 'three';
import { createLowPolyTrunkMesh } from './LowPolyTrunk';
import {
  createMasterBranchData,
  createSummitBranchData,
  createBranchWoodMaterial,
} from './LowPolyBranch';
import {
  createLeafMaterial,
  mergeBufferGeometriesFast,
} from './LowPolyLeaf';

/**
 * Creates a complete, majestic Low-Poly Anime Tree inspired by Genshin Impact (Windrise Oak / Liyue Cedar).
 * 
 * True Modular Architecture:
 * 1. TRUNK: 24-segment fluted organic trunk with grounded bell flare base (zero ugly root fins)
 *    and 5 mathematically calculated branch sockets.
 * 2. MODULAR MASTER BRANCH INSTANTIATION: Uses the isolated, perfected Master Branch (`createMasterBranchData()`)
 *    and instantiates it directly onto each lateral trunk socket with proper scaling and orientation.
 * 3. CENTRAL LEADER & APEX CROWN: A central leader bough rises from the top socket to support the
 *    monumental Grand Sunlit Apex Crown (golden lime dome capping the canopy heart).
 * 4. PERFORMANCE: Merged into 4 high-performance sub-meshes (1 wood, 3 cel-shaded foliage tiers).
 */
export function createCompleteLowPolyTree(enableWind = true): THREE.Group {
  const treeGroup = new THREE.Group();
  treeGroup.name = 'Majestic_Genshin_Oak_Tree';
  treeGroup.userData.previewDirection = [0.12, 0.12, 1];

  // 1. SCULPTED TRUNK (Clean, grounded base without separate roots)
  const { group: trunkGroup, sockets } = createLowPolyTrunkMesh();

  const woodGeometries: THREE.BufferGeometry[] = [];
  trunkGroup.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      const clonedGeo = mesh.geometry.clone();
      mesh.updateMatrix();
      clonedGeo.applyMatrix4(mesh.matrix);
      woodGeometries.push(clonedGeo);
    }
  });

  // Foliage collectors for each shade tier
  const foliageSunlit: THREE.BufferGeometry[] = [];
  const foliageMeadow: THREE.BufferGeometry[] = [];
  const foliageJade: THREE.BufferGeometry[] = [];

  // =========================================================================
  // 2. INSTANTIATE THE MASTER MODULAR BRANCH ONTO LATERAL SOCKETS (4 BOUGHS)
  // =========================================================================
  // Sockets 0, 1, 2, 3 correspond to East, West, North, and South boughs.
  // Each socket provides exact position, rotation, scale, and radius.
  for (let i = 0; i < 4; i++) {
    const sock = sockets[i];
    const branchData = createMasterBranchData();

    // Construct exact transformation matrix from socket parameters
    const mat4 = new THREE.Matrix4();
    const rotMat = new THREE.Matrix4().makeRotationFromQuaternion(sock.quaternion);
    const scaleMat = new THREE.Matrix4().makeScale(sock.scale, sock.scale, sock.scale);
    const posMat = new THREE.Matrix4().setPosition(sock.position);

    mat4.multiply(posMat).multiply(rotMat).multiply(scaleMat);

    // Apply transformation to wood
    branchData.woodGeometry.applyMatrix4(mat4);
    woodGeometries.push(branchData.woodGeometry);

    // Apply transformation to each foliage tier
    branchData.foliageSunlit.applyMatrix4(mat4);
    foliageSunlit.push(branchData.foliageSunlit);

    branchData.foliageMeadow.applyMatrix4(mat4);
    foliageMeadow.push(branchData.foliageMeadow);

    branchData.foliageJade.applyMatrix4(mat4);
    foliageJade.push(branchData.foliageJade);
  }

  // =========================================================================
  // 3. ZENITH SUMMIT MASTER BRANCH & GRAND APEX CROWN (SOCKET 4)
  // =========================================================================
  // Socket 4 continues the trunk central leader into the monumental Grand Sunlit Apex Dome.
  // Every single leaf is physically attached to a wooden twig. ZERO floating leaves.
  const sockSummit = sockets[4];
  const summitData = createSummitBranchData();

  const summitMat4 = new THREE.Matrix4();
  const summitRotMat = new THREE.Matrix4().makeRotationFromQuaternion(sockSummit.quaternion);
  const summitScaleMat = new THREE.Matrix4().makeScale(sockSummit.scale, sockSummit.scale, sockSummit.scale);
  const summitPosMat = new THREE.Matrix4().setPosition(sockSummit.position);

  summitMat4.multiply(summitPosMat).multiply(summitRotMat).multiply(summitScaleMat);

  summitData.woodGeometry.applyMatrix4(summitMat4);
  woodGeometries.push(summitData.woodGeometry);

  summitData.foliageSunlit.applyMatrix4(summitMat4);
  foliageSunlit.push(summitData.foliageSunlit);

  summitData.foliageMeadow.applyMatrix4(summitMat4);
  foliageMeadow.push(summitData.foliageMeadow);

  summitData.foliageJade.applyMatrix4(summitMat4);
  foliageJade.push(summitData.foliageJade);

  // =========================================================================
  // 5. MERGE WOOD & FOLIAGE MESHES FOR AAA PERFORMANCE
  // =========================================================================
  if (woodGeometries.length > 0) {
    const mergedWoodGeo = mergeBufferGeometriesFast(woodGeometries);
    const woodMat = createBranchWoodMaterial();
    const woodMesh = new THREE.Mesh(mergedWoodGeo, woodMat);
    woodMesh.name = 'Genshin_Tree_Wood_Merged';
    woodMesh.castShadow = true;
    woodMesh.receiveShadow = true;
    treeGroup.add(woodMesh);
  }

  if (foliageSunlit.length > 0) {
    const mergedSunlitGeo = mergeBufferGeometriesFast(foliageSunlit);
    const sunlitMat = createLeafMaterial('sunlit', enableWind);
    const sunlitMesh = new THREE.Mesh(mergedSunlitGeo, sunlitMat);
    sunlitMesh.name = 'Genshin_Foliage_Sunlit';
    sunlitMesh.castShadow = true;
    sunlitMesh.receiveShadow = true;
    treeGroup.add(sunlitMesh);
  }

  if (foliageMeadow.length > 0) {
    const mergedMeadowGeo = mergeBufferGeometriesFast(foliageMeadow);
    const meadowMat = createLeafMaterial('meadow', enableWind);
    const meadowMesh = new THREE.Mesh(mergedMeadowGeo, meadowMat);
    meadowMesh.name = 'Genshin_Foliage_Meadow';
    meadowMesh.castShadow = true;
    meadowMesh.receiveShadow = true;
    treeGroup.add(meadowMesh);
  }

  if (foliageJade.length > 0) {
    const mergedJadeGeo = mergeBufferGeometriesFast(foliageJade);
    const jadeMat = createLeafMaterial('jade', enableWind);
    const jadeMesh = new THREE.Mesh(mergedJadeGeo, jadeMat);
    jadeMesh.name = 'Genshin_Foliage_Jade';
    jadeMesh.castShadow = true;
    jadeMesh.receiveShadow = true;
    treeGroup.add(jadeMesh);
  }

  return treeGroup;
}
