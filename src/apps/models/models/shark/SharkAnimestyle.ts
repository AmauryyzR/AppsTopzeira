import * as THREE from 'three';
import {
  createSharkRig,
  chainWeights,
  buildSharkHumanoidMeta,
  createSharkAnimations,
} from './SharkRig';
import {
  SkinBuilder,
  createSharkHoodGeometry,
  createRolledLipGeometry,
  createSharkTeethGeometries,
  createSharkEyesGroup,
  createSharkPupilsGroup,
  createSharkEyeHighlightsGroup,
  createSharkGillsGeometries,
  createSharkFinGeometry,
  createDrawstringsGeometries,
  createAnimeHeadGeometry,
  createBlindfoldGeometry,
  createLayeredHairGeometries,
  createHoodieTorsoGeometry,
  createHoodieWaistHemGeometry,
  createKangarooPocketGeometry,
  createSharkTailFlukeGeometry,
  createHoodieSleeveGeometry,
  createRibbedWristCuffGeometry,
  createAnimeHandGeometry,
  createBaggyJoggerGeometry,
  createJoggerPelvisGeometry,
  createRibbedAnkleCuffGeometry,
  createAnkleSkinGeometry,
  createSneakerSoleGeometries,
  createSneakerUpperGeometries,
} from './SharkGeometry';
import {
  createPocketSharkTexture,
  createSleeveWaveTexture,
} from './SharkTextures';

export function createSharkAnimestyle(): THREE.Group {
  const root = new THREE.Group();
  root.name = 'SharkAnimestyle_Character';

  // 1. Initialize Canonical 30-Bone Armature
  const rig = createSharkRig();
  root.add(rig.rootBone);

  // 2. High-Quality Stylized Anime PBR Materials
  const pocketTexture = createPocketSharkTexture();
  const sleeveTexture = createSleeveWaveTexture();

  const matSharkSlateBlue = new THREE.MeshStandardMaterial({
    color: 0x4d6f8f,
    roughness: 0.68,
    metalness: 0.04,
    name: 'Shark_slate_blue',
  });

  const matHoodLiningWhite = new THREE.MeshStandardMaterial({
    color: 0xeef2f6,
    roughness: 0.85,
    metalness: 0.0,
    name: 'Hood_lining_white',
  });

  const matHoodieBlack = new THREE.MeshStandardMaterial({
    color: 0x1a1b1f,
    roughness: 0.88,
    metalness: 0.02,
    name: 'Hoodie_black',
  });

  const matPocketGraphic = new THREE.MeshStandardMaterial({
    map: pocketTexture,
    roughness: 0.82,
    metalness: 0.04,
    name: 'Graphic_pocket',
  });

  const matSleeveGraphic = new THREE.MeshStandardMaterial({
    map: sleeveTexture,
    roughness: 0.84,
    metalness: 0.04,
    name: 'Graphic_sleeve',
  });

  const matJoggersBlack = new THREE.MeshStandardMaterial({
    color: 0x151619,
    roughness: 0.86,
    metalness: 0.02,
    name: 'Joggers_black',
  });

  const matRibbedDark = new THREE.MeshStandardMaterial({
    color: 0x121316,
    roughness: 0.95,
    metalness: 0.0,
    name: 'Ribbed_dark',
  });

  const matAnimeSkin = new THREE.MeshStandardMaterial({
    color: 0xfae7dc,
    roughness: 0.58,
    metalness: 0.0,
    name: 'Anime_skin',
  });

  const matSilverHair = new THREE.MeshStandardMaterial({
    color: 0xd8dde4,
    roughness: 0.38,
    metalness: 0.12,
    name: 'Silver_hair',
  });

  const matBlindfoldBlack = new THREE.MeshStandardMaterial({
    color: 0x0e0f11,
    roughness: 0.85,
    metalness: 0.02,
    name: 'Blindfold_black',
  });

  const matIvoryTeeth = new THREE.MeshStandardMaterial({
    color: 0xfcfbf4,
    roughness: 0.35,
    metalness: 0.05,
    name: 'Ivory_teeth',
  });

  const matEyeSclera = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.40,
    metalness: 0.0,
    name: 'Shark_eye_sclera',
  });

  const matEyePupil = new THREE.MeshStandardMaterial({
    color: 0x070809,
    roughness: 0.08,
    metalness: 0.15,
    name: 'Shark_eye_pupil',
  });

  const matEyeHighlight = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.10,
    emissive: 0xffffff,
    emissiveIntensity: 0.25,
    name: 'Shark_eye_highlight',
  });

  const matGillsDark = new THREE.MeshStandardMaterial({
    color: 0x121315,
    roughness: 0.90,
    metalness: 0.0,
    name: 'Hood_gills_dark',
  });

  const matSneakerSoleWhite = new THREE.MeshStandardMaterial({
    color: 0xf2f4f7,
    roughness: 0.45,
    metalness: 0.02,
    name: 'Sneaker_midsole_white',
  });

  const matSneakerOutsole = new THREE.MeshStandardMaterial({
    color: 0x1c2128,
    roughness: 0.70,
    metalness: 0.05,
    name: 'Sneaker_outsole',
  });

  const matSneakerBlack = new THREE.MeshStandardMaterial({
    color: 0x18191c,
    roughness: 0.65,
    metalness: 0.02,
    name: 'Sneaker_black',
  });

  const matSneakerWhite = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.50,
    metalness: 0.0,
    name: 'Sneaker_white',
  });

  // 3. Assemble Geometries into SkinBuilder
  const builder = new SkinBuilder(rig);

  // --- HEAD & SHARK HOOD ---
  // Outer Shark Hood Shell
  builder.add(createSharkHoodGeometry(false), matSharkSlateBlue, p =>
    chainWeights(rig, ['Neck', 'Head'], p)
  );

  // Inner White Fleece Lining
  builder.add(createSharkHoodGeometry(true), matHoodLiningWhite, p =>
    chainWeights(rig, ['Neck', 'Head'], p)
  );

  // Thick White Rolled Fleece Piping (Lip framing face opening)
  builder.add(createRolledLipGeometry(), matHoodLiningWhite, p =>
    chainWeights(rig, ['Neck', 'Head'], p)
  );

  // 11 Sharp Ivory Shark Teeth
  createSharkTeethGeometries().forEach(tGeo => {
    builder.add(tGeo, matIvoryTeeth, () => ({
      indices: [rig.boneIndices.get('Head')!, 0, 0, 0],
      weights: [1, 0, 0, 0],
    }));
  });

  // Bulging Shark Eyes (White sclera, glossy black pupil, highlight)
  createSharkEyesGroup().forEach(sclera => {
    builder.add(sclera, matEyeSclera, () => ({
      indices: [rig.boneIndices.get('Head')!, 0, 0, 0],
      weights: [1, 0, 0, 0],
    }));
  });

  createSharkPupilsGroup().forEach(pupil => {
    builder.add(pupil, matEyePupil, () => ({
      indices: [rig.boneIndices.get('Head')!, 0, 0, 0],
      weights: [1, 0, 0, 0],
    }));
  });

  createSharkEyeHighlightsGroup().forEach(hl => {
    builder.add(hl, matEyeHighlight, () => ({
      indices: [rig.boneIndices.get('Head')!, 0, 0, 0],
      weights: [1, 0, 0, 0],
    }));
  });

  // Lateral Gill Slits (|||)
  createSharkGillsGeometries().forEach(gill => {
    builder.add(gill, matGillsDark, () => ({
      indices: [rig.boneIndices.get('Head')!, 0, 0, 0],
      weights: [1, 0, 0, 0],
    }));
  });

  // Top Primary Swept-back Dorsal Fin
  const topFin = createSharkFinGeometry(0.32, 0.24, 0.036, 0.74);
  topFin.translate(0, 1.64, -0.04);
  builder.add(topFin, matSharkSlateBlue, () => ({
    indices: [rig.boneIndices.get('Head')!, 0, 0, 0],
    weights: [1, 0, 0, 0],
  }));

  // Secondary Rear Dorsal Fin
  const rearFin = createSharkFinGeometry(0.18, 0.14, 0.024, 0.60);
  rearFin.rotateX(-0.85);
  rearFin.translate(0, 1.38, -0.24);
  builder.add(rearFin, matSharkSlateBlue, () => ({
    indices: [rig.boneIndices.get('Head')!, 0, 0, 0],
    weights: [1, 0, 0, 0],
  }));


  // Hood Drawstrings & Mini Fin Aglets
  const { cords, aglets } = createDrawstringsGeometries();
  cords.forEach(c => {
    builder.add(c, matSharkSlateBlue, p => chainWeights(rig, ['Neck', 'Chest'], p));
  });
  aglets.forEach(a => {
    builder.add(a, matSharkSlateBlue, p => chainWeights(rig, ['Neck', 'Chest'], p));
  });

  // Anime Boy Head & Ears
  builder.add(createAnimeHeadGeometry(), matAnimeSkin, () => ({
    indices: [rig.boneIndices.get('Head')!, 0, 0, 0],
    weights: [1, 0, 0, 0],
  }));

  // Black Fabric Blindfold (Gojo/2B Style)
  builder.add(createBlindfoldGeometry(), matBlindfoldBlack, () => ({
    indices: [rig.boneIndices.get('Head')!, 0, 0, 0],
    weights: [1, 0, 0, 0],
  }));

  // 20+ Spiky Silver Anime Hair Clumps
  createLayeredHairGeometries().forEach(h => {
    builder.add(h, matSilverHair, () => ({
      indices: [rig.boneIndices.get('Head')!, 0, 0, 0],
      weights: [1, 0, 0, 0],
    }));
  });

  // --- OVERSIZED STREETWEAR HOODIE ---
  // Torso Body with Organic Drapery Folds
  builder.add(createHoodieTorsoGeometry(), matHoodieBlack, p =>
    chainWeights(rig, ['Hips', 'Spine', 'Chest'], p)
  );

  // Ribbed Waistband Hem
  builder.add(createHoodieWaistHemGeometry(), matRibbedDark, p =>
    chainWeights(rig, ['Hips', 'Spine'], p)
  );

  // Kangaroo Front Pocket with Shark-Wave Graphic
  builder.add(createKangarooPocketGeometry(), matPocketGraphic, p =>
    chainWeights(rig, ['Hips', 'Spine'], p)
  );

  // 3D Caudal Shark Tail Fluke (Attached to lower back)
  builder.add(createSharkTailFlukeGeometry(), matSharkSlateBlue, p =>
    chainWeights(rig, ['TailFin.01', 'TailFin.02', 'TailFin.03', 'TailFin.04'], p)
  );

  // Baggy Dropped Sleeves with Organic Elbow Folds
  builder.add(createHoodieSleeveGeometry(true), matSleeveGraphic, p =>
    chainWeights(rig, ['Clavicle.L', 'UpperArm.L', 'Forearm.L'], p)
  );
  builder.add(createHoodieSleeveGeometry(false), matSleeveGraphic, p =>
    chainWeights(rig, ['Clavicle.R', 'UpperArm.R', 'Forearm.R'], p)
  );

  // Ribbed Wrist Cuffs
  builder.add(createRibbedWristCuffGeometry(true), matRibbedDark, () => ({
    indices: [rig.boneIndices.get('Forearm.L')!, rig.boneIndices.get('Hand.L')!, 0, 0],
    weights: [0.6, 0.4, 0, 0],
  }));
  builder.add(createRibbedWristCuffGeometry(false), matRibbedDark, () => ({
    indices: [rig.boneIndices.get('Forearm.R')!, rig.boneIndices.get('Hand.R')!, 0, 0],
    weights: [0.6, 0.4, 0, 0],
  }));

  // Stylized Anime Hands (Curved relaxed fingers)
  builder.add(createAnimeHandGeometry(true), matAnimeSkin, () => ({
    indices: [rig.boneIndices.get('Hand.L')!, 0, 0, 0],
    weights: [1, 0, 0, 0],
  }));
  builder.add(createAnimeHandGeometry(false), matAnimeSkin, () => ({
    indices: [rig.boneIndices.get('Hand.R')!, 0, 0, 0],
    weights: [1, 0, 0, 0],
  }));

  // --- BAGGY JOGGERS ---
  // Continuous Jogger Pelvis / Waistband (joining legs under hoodie with zero gaps!)
  builder.add(createJoggerPelvisGeometry(), matJoggersBlack, p =>
    chainWeights(rig, ['Hips', 'Spine'], p)
  );

  builder.add(createBaggyJoggerGeometry(true), matJoggersBlack, p =>
    chainWeights(rig, ['Hips', 'Thigh.L', 'Shin.L'], p)
  );
  builder.add(createBaggyJoggerGeometry(false), matJoggersBlack, p =>
    chainWeights(rig, ['Hips', 'Thigh.R', 'Shin.R'], p)
  );

  // Ribbed Ankle Cuffs
  builder.add(createRibbedAnkleCuffGeometry(true), matRibbedDark, () => ({
    indices: [rig.boneIndices.get('Shin.L')!, rig.boneIndices.get('Foot.L')!, 0, 0],
    weights: [0.8, 0.2, 0, 0],
  }));
  builder.add(createRibbedAnkleCuffGeometry(false), matRibbedDark, () => ({
    indices: [rig.boneIndices.get('Shin.R')!, rig.boneIndices.get('Foot.R')!, 0, 0],
    weights: [0.8, 0.2, 0, 0],
  }));

  // Exposed Ankle Skin
  builder.add(createAnkleSkinGeometry(true), matAnimeSkin, () => ({
    indices: [rig.boneIndices.get('Foot.L')!, 0, 0, 0],
    weights: [1, 0, 0, 0],
  }));
  builder.add(createAnkleSkinGeometry(false), matAnimeSkin, () => ({
    indices: [rig.boneIndices.get('Foot.R')!, 0, 0, 0],
    weights: [1, 0, 0, 0],
  }));

  // --- CHUNKY PLATFORM STREETWEAR SNEAKERS ---
  [true, false].forEach(isLeft => {
    const { outsole, midsole } = createSneakerSoleGeometries(isLeft);
    const uppers = createSneakerUpperGeometries(isLeft);
    const footBone = isLeft ? rig.boneIndices.get('Foot.L')! : rig.boneIndices.get('Foot.R')!;
    const toeBone = isLeft ? rig.boneIndices.get('Toe.L')! : rig.boneIndices.get('Toe.R')!;

    builder.add(outsole, matSneakerOutsole, () => ({
      indices: [footBone, toeBone, 0, 0],
      weights: [0.7, 0.3, 0, 0],
    }));

    builder.add(midsole, matSneakerSoleWhite, () => ({
      indices: [footBone, toeBone, 0, 0],
      weights: [0.7, 0.3, 0, 0],
    }));

    builder.add(uppers.whitePanels, matSneakerWhite, () => ({
      indices: [toeBone, footBone, 0, 0],
      weights: [0.8, 0.2, 0, 0],
    }));

    builder.add(uppers.blueMudguard, matSharkSlateBlue, () => ({
      indices: [footBone, toeBone, 0, 0],
      weights: [0.6, 0.4, 0, 0],
    }));

    builder.add(uppers.blackQuarter, matSneakerBlack, () => ({
      indices: [footBone, 0, 0, 0],
      weights: [1, 0, 0, 0],
    }));

    builder.add(uppers.laces, matSneakerWhite, () => ({
      indices: [footBone, toeBone, 0, 0],
      weights: [0.5, 0.5, 0, 0],
    }));

    builder.add(uppers.heelFin, matSharkSlateBlue, () => ({
      indices: [footBone, 0, 0, 0],
      weights: [1, 0, 0, 0],
    }));
  });

  // 4. Finalize Mesh Batching
  builder.finish(root);

  // 5. Attach Humanoid Engine Metadata & Game Animation Clips
  root.userData = {
    ...buildSharkHumanoidMeta(),
    previewDirection: [0.85, 0.30, 1.40],
  };

  root.animations = createSharkAnimations();

  return root;
}
