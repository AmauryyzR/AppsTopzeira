import * as THREE from 'three';
import { createDinoAnimations, createDinoRig, chainWeights } from './DinoRig';
import { ellipsoid, roundedPanel, SkinBuilder, softSpike, sweep, v } from './DinoGeometry';

/** Original procedural interpretation of the supplied dinosaur-costume reference. */
export function createDinoChibi(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Dino_Chibi';
  group.userData.previewDirection = [.24, .06, 1];
  const rig = createDinoRig(), builder = new SkinBuilder(rig);
  const mat = (name: string, color: number, roughness = .85) => {
    const material = new THREE.MeshStandardMaterial({color, roughness, metalness: 0});
    material.name = name; return material;
  };
  const green = mat('Sage_fleece', 0x91a543);
  green.emissive.set(0x263108); green.emissiveIntensity = .13;
  const trim = mat('Olive_seams', 0x667c2b);
  const inner = mat('Hood_lining', 0x354718);
  const cream = mat('Cream_canvas', 0xf0d79e);
  const ivory = mat('Ivory_teeth_and_soles', 0xffedc4);
  const amber = mat('Amber_buttons_and_spikes', 0xf3a329, .62);
  const skin = mat('Warm_skin', 0xf2ac7e, .7);
  skin.vertexColors = true;
  skin.emissive.set(0xb76035); skin.emissiveIntensity = .12;
  const earInner = mat('Ear_inner', 0xdca17f);
  const hair = mat('Chocolate_hair', 0x4b2b1b, .72);
  const hairLight = mat('Hair_highlights', 0x67402a, .78);
  const white = mat('Eye_white', 0xfff7e5, .38);
  const iris = mat('Hazel_iris', 0x789b22, .40);
  const irisDark = mat('Iris_outer_ring', 0x344418, .48);
  const black = mat('Pupils', 0x100d08, .26);
  const mouth = mat('Closed_smile', 0x915438);
  const add = builder.add.bind(builder);
  const ball = (p: number[], s: number[], material: THREE.Material, bone = 'Head', segments = 24, rings = 16) => add(ellipsoid(p, s, segments, rings), material, bone);
  const line = (points: number[][], radius: number, material: THREE.Material, bone = 'Head', steps = 24) =>
    add(sweep(points.map(p => v(p[0], p[1], p[2])), [radius, radius, radius], 8, steps), material, bone);

  // Short legs, ribbed socks and layered miniature trainers.
  for (const [side, sign] of [['L', 1], ['R', -1]] as const) {
    const x = sign * .28;
    const legWeight = (p: THREE.Vector3) => chainWeights(rig, [`Thigh.${side}`, `Shin.${side}`, `Foot.${side}`], p);
    add(sweep([v(x, .93, 0), v(x, .64, .015), v(sign * .30, .25, .015)], [.145, .12, .105], 20, 22), skin, legWeight);
    ball([x, .86, 0], [.205, .205, .22], trim, `Thigh.${side}`);
    ball([sign * .30, .30, .03], [.135, .115, .145], trim, `Shin.${side}`, 20, 12);
    for (let i = 0; i < 9; i++) {
      const a = i / 9 * Math.PI * 2;
      line([[sign * .30 + Math.sin(a) * .129, .25, .03 + Math.cos(a) * .137], [sign * .30 + Math.sin(a) * .131, .37, .03 + Math.cos(a) * .138]], .005, green, `Shin.${side}`, 4);
    }
    ball([sign * .30, .085, .15], [.22, .072, .34], ivory, `Foot.${side}`, 28, 16);
    ball([sign * .30, .175, .10], [.203, .12, .285], green, `Foot.${side}`, 28, 16);
    ball([sign * .30, .142, .323], [.194, .073, .134], cream, `Toe.${side}`, 24, 14);
    ball([sign * .30, .255, .035], [.17, .070, .17], cream, `Foot.${side}`, 24, 14);
    const strap = roundedPanel(.34, .095, .045, .035);
    strap.rotateX(-.42); strap.translate(sign * .30, .251, .241); add(strap, amber, `Foot.${side}`);
    ball([sign * .30, .279, .275], [.035, .015, .019], ivory, `Foot.${side}`, 12, 8);
    for (const dx of [-.027, 0, .027]) ball([sign * .30 + dx, .304, .262], [.010, .010, .011], ivory, `Foot.${side}`, 10, 6);
    ball([sign * .30 + sign * .185, .18, .11], [.016, .042, .041], amber, `Foot.${side}`, 16, 10);
    // Sole seams and little tread divisions remain actual geometry in the exported asset.
    for (let i = 0; i < 4; i++) line([[sign * .30 - .16 + i * .105, .046, .407], [sign * .30 - .16 + i * .105, .075, .413]], .004, cream, `Toe.${side}`, 3);
  }

  const bodyWeight = (p: THREE.Vector3) => chainWeights(rig, ['Hips', 'Spine', 'Chest'], p);
  const coatProfile = [[0, .76], [.41, .76], [.51, .80], [.53, .95], [.50, 1.23], [.44, 1.58], [.35, 1.88], [.24, 1.98], [0, 1.98]];
  const coat = new THREE.LatheGeometry(coatProfile.map(([r, y]) => new THREE.Vector2(r, y)), 48);
  coat.scale(1, 1, .70); coat.computeVertexNormals(); add(coat, green, bodyWeight);
  // Two curved cream front panels follow the coat instead of floating flat in front of it.
  for (const sign of [-1, 1]) {
    const positions: number[] = [], indices: number[] = [], uv: number[] = [];
    const rows = 20, cols = 10;
    for (let j = 0; j <= rows; j++) {
      const t = j / rows, y = .81 + t * 1.10;
      const width = THREE.MathUtils.lerp(.235, .13, t);
      const profile = coatProfile.slice(2, -1);
      let section = 0;
      while (section < profile.length - 2 && profile[section + 1][1] < y) section++;
      const [r0, y0] = profile[section], [r1, y1] = profile[section + 1];
      const r = THREE.MathUtils.lerp(r0, r1, (y - y0) / (y1 - y0));
      for (let i = 0; i <= cols; i++) {
        const x = sign * (.012 + i / cols * width);
        const z = Math.sqrt(Math.max(.01, r * r - x * x)) * .70 + .018;
        positions.push(x, y, z); uv.push(i / cols, t);
        if (j < rows && i < cols) {
          const k = j * (cols + 1) + i;
          if (sign > 0) indices.push(k, k + 1, k + cols + 1, k + 1, k + cols + 2, k + cols + 1);
          else indices.push(k, k + cols + 1, k + 1, k + 1, k + cols + 1, k + cols + 2);
        }
      }
    }
    const panel = new THREE.BufferGeometry();
    panel.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); panel.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); panel.setIndex(indices); panel.computeVertexNormals();
    add(panel, cream, bodyWeight);
    // Raised welt pockets with an inset flap and a brass stud.
    const pocket = roundedPanel(.205, .27, .055, .040);
    pocket.rotateY(sign * .48); pocket.translate(sign * .367, 1.06, .274); add(pocket, trim, bodyWeight);
    const flap = roundedPanel(.218, .085, .045, .025);
    flap.rotateY(sign * .48); flap.translate(sign * .37, 1.175, .303); add(flap, green, bodyWeight);
    ball([sign * .375, 1.17, .341], [.017, .017, .008], amber, 'Spine', 12, 8);
  }
  for (const y of [1.04, 1.36, 1.68]) {
    const z = .37 - (y - 1.04) * .12;
    for (const sign of [-1, 1]) {
      ball([sign * .102, y, z], [.049, .059, .026], amber, 'Spine', 20, 14);
      const loop = new THREE.TorusGeometry(.027, .009, 8, 18); loop.translate(sign * .102, y, z + .028); add(loop, amber, 'Spine');
    }
    line([[-.087, y, z + .042], [0, y + .008, z + .046], [.087, y, z + .042]], .012, cream, 'Spine', 14);
  }
  // Hem piping.
  const hem: number[][] = [];
  for (let i = 0; i <= 48; i++) {const a = i / 48 * Math.PI * 2; hem.push([Math.sin(a) * .496, .80, Math.cos(a) * .346]);}
  line(hem, .022, trim, 'Hips', 48);

  // Sleeves have continuous blended elbow weights; hands are mitten-shaped costume paws.
  for (const [side, sign] of [['L', 1], ['R', -1]] as const) {
    const armWeight = (p: THREE.Vector3) => chainWeights(rig, [`UpperArm.${side}`, `Forearm.${side}`, `Hand.${side}`], p);
    add(sweep([v(sign * .35, 1.83, 0), v(sign * .61, 1.64, .01), v(sign * .77, 1.40, .055), v(sign * .89, 1.25, .10)], [.225, .21, .19, .18], 24, 28), green, armWeight);
    ball([sign * .895, 1.24, .105], [.195, .145, .196], trim, `Hand.${side}`);
    ball([sign * .94, 1.16, .15], [.18, .20, .17], green, `Hand.${side}`);
    ball([sign * .94, 1.13, .307], [.072, .069, .021], amber, `Hand.${side}`, 20, 12);
    for (const dx of [-.073, 0, .073]) ball([sign * .94 + dx, 1.239 - Math.abs(dx) * .25, .295], [.027, .031, .021], amber, `Hand.${side}`, 14, 10);
    for (let i = 0; i < 3; i++) {
      const claw = softSpike(.080, .117, .065);
      claw.rotateZ(Math.PI + (i - 1) * .18); claw.translate(sign * .94 + (i - 1) * .104, 1.042, .21);
      add(claw, ivory, `Hand.${side}`);
    }
  }

  // A curved, fully weighted tail with separate softly rounded dorsal plates.
  const tailNames = ['Tail.01', 'Tail.02', 'Tail.03', 'Tail.04'];
  const tailWeight = (p: THREE.Vector3) => chainWeights(rig, tailNames, p);
  const tailPoints = [v(0, 1.02, -.25), v(.16, .86, -.59), v(.50, .80, -.94), v(.81, .96, -1.19), v(.96, 1.19, -1.27)];
  add(sweep(tailPoints, [.265, .24, .18, .115, .004], 24, 38), green, tailWeight);
  for (let i = 0; i < 4; i++) {
    const t = (i + .5) / 4;
    const p = new THREE.CatmullRomCurve3(tailPoints).getPoint(t);
    const spike = softSpike(.19 - t * .07, .24 - t * .12, .07);
    spike.rotateY(Math.PI / 2); spike.translate(p.x, p.y + .20 * (1 - t), p.z);
    add(spike, amber, tailWeight);
  }
  for (const y of [1.15, 1.43, 1.72]) {
    const spike = softSpike(.24, .25, .08); spike.rotateX(-Math.PI / 2); spike.translate(0, y, -.29);
    add(spike, amber, bodyWeight);
  }

  ball([0, 2.035, .02], [.15, .18, .145], skin, 'Neck');
  // Hood is a lined open shell, not a solid sphere over the face.
  for (const lining of [false, true]) {
    const positions: number[] = [], uv: number[] = [], indices: number[] = [];
    const rows = 34, cols = 64;
    for (let j = 0; j <= rows; j++) {
      const phi = .98 + j / rows * (Math.PI - .98);
      const inset = lining ? .045 : 0;
      for (let i = 0; i <= cols; i++) {
        const a = i / cols * Math.PI * 2;
        const x = Math.cos(a) * Math.sin(phi) * (.83 - inset);
        const y = 2.72 - .10 * Math.max(0, Math.cos(phi)) + Math.sin(a) * Math.sin(phi) * (.85 - inset);
        const z = .185 + Math.cos(phi) * (.67 - inset);
        positions.push(x, y, z); uv.push(i / cols, j / rows);
        if (j < rows && i < cols) {
          const k = j * (cols + 1) + i;
          if (!lining) indices.push(k, k + cols + 1, k + 1, k + 1, k + cols + 1, k + cols + 2);
          else indices.push(k, k + 1, k + cols + 1, k + 1, k + cols + 2, k + cols + 1);
        }
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); geo.setIndex(indices); geo.computeVertexNormals();
    const normals = geo.getAttribute('normal');
    for (let row = 0; row <= rows; row++) {
      const first = row * (cols + 1), last = first + cols;
      const normal = v(0, 0, 0).fromBufferAttribute(normals, first).add(v(0, 0, 0).fromBufferAttribute(normals, last)).normalize();
      normals.setXYZ(first, normal.x, normal.y, normal.z); normals.setXYZ(last, normal.x, normal.y, normal.z);
    }
    add(geo, lining ? inner : green, 'Head');
  }
  const lip: number[][] = [];
  for (let i = 0; i <= 64; i++) {
    const a = i / 64 * Math.PI * 2;
    lip.push([Math.cos(a) * Math.sin(.98) * .815, 2.72 - .10 * Math.cos(.98) + Math.sin(a) * Math.sin(.98) * .835, .185 + Math.cos(.98) * .67]);
  }
  line(lip, .037, trim, 'Head', 72);
  // Sculpted face, ears and a chocolate-brown hair silhouette inside the hood.
  ball([0, 2.63, .285], [.605, .635, .44], hair, 'Head', 36, 24);
  const face = ellipsoid([0, 2.51, .39], [.555, .534, .409], 40, 28);
  add(face, skin, 'Head');
  const faceSurface = (x: number, y: number) => .39 + .409 * Math.sqrt(Math.max(.025, 1 - (x / .555) ** 2 - ((y - 2.51) / .534) ** 2));
  // Eye layers conform to the sculpted cheeks, rather than reading as protruding flat discs.
  const eyeLayer = (x: number, y: number, rx: number, ry: number, offset: number, depth: number, material: THREE.Material) => {
    const center = Math.sign(x) * .245;
    x = center + (x - center) * .82;
    y = 2.60 + (y - 2.60) * .82;
    const geo = ellipsoid([x, y, 0], [rx * .82, ry * .82, depth], 24, 16);
    const p = geo.getAttribute('position');
    for (let i = 0; i < p.count; i++) p.setZ(i, p.getZ(i) + faceSurface(p.getX(i), p.getY(i)) + offset);
    geo.computeVertexNormals(); add(geo, material, 'Head');
  };
  for (const sign of [-1, 1]) {
    ball([sign * .54, 2.43, .40], [.12, .155, .090], skin);
    ball([sign * .584, 2.44, .462], [.057, .09, .018], earInner, 'Head', 18, 12);
    eyeLayer(sign * .245, 2.61, .174, .217, .004, .010, hair);
    eyeLayer(sign * .245, 2.602, .162, .202, .015, .010, white);
    eyeLayer(sign * .245, 2.584, .116, .156, .029, .006, irisDark);
    eyeLayer(sign * .245, 2.581, .100, .142, .038, .005, iris);
    eyeLayer(sign * .245, 2.603, .060, .098, .047, .006, black);
    eyeLayer(sign * .245 - .034, 2.661, .032, .040, .060, .005, white);
    eyeLayer(sign * .245 + .033, 2.519, .012, .016, .055, .004, white);
    line([[sign * .09, 2.727], [sign * .19, 2.799], [sign * .30, 2.800], [sign * .394, 2.71]].map(([x,y]) => {const cx=Math.sign(x)*.245; x=cx+(x-cx)*.82; y=2.60+(y-2.60)*.82; return [x,y,faceSurface(x,y)+.019];}), .012, hair);
    line([[sign * .13, 2.882], [sign * .22, 2.917], [sign * .32, 2.891]].map(([x,y]) => [x,y,faceSurface(x,y)+.017]), .023, hair, 'Head', 16);
  }
  ball([0, 2.452, .807], [.048, .037, .042], skin, 'Head', 24, 16);
  line([[-.095, 2.317], [-.050, 2.300], [0, 2.295], [.050, 2.300], [.095, 2.317]]
    .map(([x,y]) => [x,y,faceSurface(x,y)+.006]), .006, mouth, 'Jaw', 20);
  const locks = [
    [[-.38, 3.03, .61], [-.45, 2.91, .69], [-.43, 2.67, .69]],
    [[-.20, 3.13, .61], [-.28, 2.97, .75], [-.18, 2.87, .765]],
    [[-.05, 3.16, .62], [.015, 3.00, .766], [.12, 2.88, .764]],
    [[.15, 3.14, .61], [.22, 2.99, .744], [.32, 2.89, .717]],
    [[.34, 3.07, .59], [.46, 2.86, .63], [.45, 2.66, .64]],
    [[-.49, 2.94, .48], [-.55, 2.69, .49], [-.49, 2.48, .56]],
    [[.49, 2.93, .48], [.55, 2.70, .48], [.49, 2.47, .56]],
  ];
  locks.forEach((points, i) => {
    add(sweep(points.map(p => v(p[0], p[1] - .015, p[2] - .045)), [.095, .082, .004], 14, 18, .48), i % 3 === 0 ? hairLight : hair, 'Head');
  });

  // Dinosaur muzzle, glassy toy eyes and small recessed-looking nostrils.
  ball([0, 3.235, .560], [.56, .172, .155], green, 'Head', 36, 22);
  for (const sign of [-1, 1]) {
    ball([sign * .405, 3.422, .394], [.176, .185, .133], green, 'Head', 28, 18);
    ball([sign * .405, 3.431, .501], [.125, .147, .040], white);
    ball([sign * .394, 3.425, .537], [.077, .101, .016], black);
    ball([sign * .410, 3.467, .554], [.024, .028, .007], white, 'Head', 16, 10);
    ball([sign * .207, 3.258, .692], [.054, .039, .022], trim, 'Head', 18, 12);
    ball([sign * .207, 3.258, .706], [.029, .024, .009], inner, 'Head', 16, 10);
  }
  // Upper jaw teeth follow the arch around the forehead.
  for (let i = 0; i < 7; i++) {
    const a = .29 + i / 6 * (Math.PI - .58);
    const x = Math.cos(a) * .613, y = 2.92 + Math.sin(a) * .280;
    const tooth = softSpike(i === 3 ? .128 : .105, .128, .055);
    tooth.rotateZ(Math.PI + (a - Math.PI / 2) * .36); tooth.translate(x, y, .709);
    add(tooth, ivory, 'Head');
  }
  // Center seam and orange plush plates run from the hood crown down its back.
  line([[0, 3.30, .702], [0, 3.47, .46], [0, 3.55, .185], [0, 3.50, -.04]], .006, trim, 'Head', 28);
  for (let i = 0; i < 5; i++) {
    const angle = i * .40;
    const spike = softSpike(.265 - i * .014, .285 - i * .014, .10);
    spike.rotateY(.60); spike.rotateX(-angle);
    spike.translate(0, 2.72 + Math.cos(angle) * .827, .185 - Math.sin(angle) * .65);
    add(spike, amber, 'Head');
  }
  // Folded collar frames the neck where the hood rests on the coat.
  for (const sign of [-1, 1]) line([[sign * .52, 2.025, .36], [sign * .35, 2.016, .34], [sign * .20, 1.987, .30], [sign * .055, 1.916, .25]], .060, green, 'Neck', 22);

  builder.finish(group);
  group.animations = createDinoAnimations();
  group.userData.animationNames = group.animations.map(clip => clip.name);
  group.userData.sockets = ['GripSocket.L', 'GripSocket.R', 'HeadSocket'];
  group.scale.setScalar(.35);
  group.userData.units = 'meters';
  group.userData.humanoid = {
    hips: 'Hips', spine: 'Spine', chest: 'Chest', neck: 'Neck', head: 'Head', jaw: 'Jaw',
    leftShoulder: 'Clavicle.L', leftUpperArm: 'UpperArm.L', leftLowerArm: 'Forearm.L', leftHand: 'Hand.L',
    rightShoulder: 'Clavicle.R', rightUpperArm: 'UpperArm.R', rightLowerArm: 'Forearm.R', rightHand: 'Hand.R',
    leftUpperLeg: 'Thigh.L', leftLowerLeg: 'Shin.L', leftFoot: 'Foot.L', leftToes: 'Toe.L',
    rightUpperLeg: 'Thigh.R', rightLowerLeg: 'Shin.R', rightFoot: 'Foot.R', rightToes: 'Toe.R',
  };
  return group;
}
