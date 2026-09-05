import * as THREE from 'three';
import { createDinoAnimations, createDinoRig, chainWeights } from './DinoRig';
import { ellipsoid, roundedPanel, SkinBuilder, softSpike, sweep, v } from './DinoGeometry';

/**
 * GemniDINO 3D Character Model
 * High-fidelity rigged chibi dinosaur-costumed character inspired by the concept reference.
 * - Under 100,000 triangles
 * - 30-joint game-ready humanoid skeleton with articulated tail and socket attachments
 * - Pre-rigged animations: Idle, Walk, Wave
 */
export function createGemniDino(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'GemniDINO';
  group.userData.previewDirection = [.24, .06, 1];
  const rig = createDinoRig(), builder = new SkinBuilder(rig);

  const mat = (name: string, color: number, roughness = .85) => {
    const material = new THREE.MeshStandardMaterial({ color, roughness, metalness: 0 });
    material.name = name;
    return material;
  };

  // Materials tuned to the concept artwork
  const green = mat('Sage_fleece', 0x93ab3e);
  green.emissive.set(0x283309);
  green.emissiveIntensity = .12;

  const trim = mat('Olive_seams', 0x647929);
  const inner = mat('Hood_lining', 0x334417);
  const cream = mat('Cream_canvas', 0xf2dfa8);
  const ivory = mat('Ivory_teeth_and_soles', 0xffeed0);
  const amber = mat('Amber_buttons_and_spikes', 0xf89b20, .58);

  const skin = mat('Warm_skin', 0xf4b184, .68);
  skin.vertexColors = true;
  skin.emissive.set(0xb76035);
  skin.emissiveIntensity = .10;

  const blush = mat('Cheek_blush', 0xee857b, .78);
  blush.emissive.set(0x441416);
  blush.emissiveIntensity = .08;

  const mouthCavity = mat('Mouth_cavity', 0x3d1416, .75);
  const tongue = mat('Tongue_pink', 0xeb6b78, .55);
  const mouth = mat('Closed_smile', 0x915438);

  const earInner = mat('Ear_inner', 0xdca17f);
  const hair = mat('Chocolate_hair', 0x48291a, .72);
  const hairLight = mat('Hair_highlights', 0x68412b, .76);

  const white = mat('Eye_white', 0xfff9ea, .35);
  const iris = mat('Hazel_iris', 0x7da420, .38);
  const irisDark = mat('Iris_outer_ring', 0x314214, .45);
  const black = mat('Pupils', 0x110e0a, .24);

  const add = builder.add.bind(builder);
  const ball = (p: number[], s: number[], material: THREE.Material, bone = 'Head', segments = 24, rings = 16) =>
    add(ellipsoid(p, s, segments, rings), material, bone);
  const line = (points: number[][], radius: number, material: THREE.Material, bone = 'Head', steps = 24) =>
    add(sweep(points.map(p => v(p[0], p[1], p[2])), [radius, radius, radius], 8, steps), material, bone);

  // ==========================================
  // 1. LEGS, SOCKS & DETAILED CHUNKY TRAINERS
  // ==========================================
  for (const [side, sign] of [['L', 1], ['R', -1]] as const) {
    const x = sign * .28;
    const legWeight = (p: THREE.Vector3) => chainWeights(rig, [`Thigh.${side}`, `Shin.${side}`, `Foot.${side}`], p);

    // Chubby legs
    add(sweep([v(x, .93, 0), v(x, .64, .015), v(sign * .30, .25, .015)], [.145, .12, .105], 20, 22), skin, legWeight);

    // Green shorts cuff & sock rim
    ball([x, .86, 0], [.205, .205, .22], trim, `Thigh.${side}`);
    ball([sign * .30, .30, .03], [.135, .115, .145], trim, `Shin.${side}`, 20, 12);

    // Ribbed socks texture lines
    for (let i = 0; i < 9; i++) {
      const a = i / 9 * Math.PI * 2;
      line(
        [[sign * .30 + Math.sin(a) * .129, .25, .03 + Math.cos(a) * .137],
         [sign * .30 + Math.sin(a) * .131, .37, .03 + Math.cos(a) * .138]],
        .005, green, `Shin.${side}`, 4
      );
    }

    // Chunky Platform Sneakers
    ball([sign * .30, .085, .15], [.22, .072, .34], ivory, `Foot.${side}`, 28, 16);
    ball([sign * .30, .175, .10], [.203, .12, .285], green, `Foot.${side}`, 28, 16);
    ball([sign * .30, .142, .323], [.194, .073, .134], cream, `Toe.${side}`, 24, 14);
    ball([sign * .30, .255, .035], [.17, .070, .17], cream, `Foot.${side}`, 24, 14);

    // Sneaker Orange Strap with Paw Emblem
    const strap = roundedPanel(.34, .095, .045, .035);
    strap.rotateX(-.42);
    strap.translate(sign * .30, .251, .241);
    add(strap, amber, `Foot.${side}`);

    // Paw pad emblem on shoe strap
    ball([sign * .30, .279, .275], [.038, .018, .020], ivory, `Foot.${side}`, 12, 8);
    for (const dx of [-.027, 0, .027]) {
      ball([sign * .30 + dx, .304, .262], [.011, .011, .012], ivory, `Foot.${side}`, 10, 6);
    }
    ball([sign * .30 + sign * .185, .18, .11], [.016, .042, .041], amber, `Foot.${side}`, 16, 10);

    // Sole tread grooves
    for (let i = 0; i < 4; i++) {
      line([[sign * .30 - .16 + i * .105, .046, .407], [sign * .30 - .16 + i * .105, .075, .413]], .004, cream, `Toe.${side}`, 3);
    }
  }

  // ==========================================
  // 2. COAT BODY, CREAM PLACKET & TOGGLES
  // ==========================================
  const bodyWeight = (p: THREE.Vector3) => chainWeights(rig, ['Hips', 'Spine', 'Chest'], p);
  const coatProfile = [
    [0, .76], [.41, .76], [.51, .80], [.53, .95], [.50, 1.23], [.44, 1.58], [.35, 1.88], [.24, 1.98], [0, 1.98]
  ];
  const coat = new THREE.LatheGeometry(coatProfile.map(([r, y]) => new THREE.Vector2(r, y)), 48);
  coat.scale(1, 1, .70);
  coat.computeVertexNormals();
  add(coat, green, bodyWeight);

  // Cream Front Placket Panels (Curved conforming to coat)
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
        positions.push(x, y, z);
        uv.push(i / cols, t);
        if (j < rows && i < cols) {
          const k = j * (cols + 1) + i;
          if (sign > 0) indices.push(k, k + 1, k + cols + 1, k + 1, k + cols + 2, k + cols + 1);
          else indices.push(k, k + cols + 1, k + 1, k + 1, k + cols + 1, k + cols + 2);
        }
      }
    }
    const panel = new THREE.BufferGeometry();
    panel.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    panel.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    panel.setIndex(indices);
    panel.computeVertexNormals();
    add(panel, cream, bodyWeight);

    // Flapped Patch Pockets with Amber Stud
    const pocket = roundedPanel(.205, .27, .055, .040);
    pocket.rotateY(sign * .48);
    pocket.translate(sign * .367, 1.06, .274);
    add(pocket, trim, bodyWeight);

    const flap = roundedPanel(.218, .085, .045, .025);
    flap.rotateY(sign * .48);
    flap.translate(sign * .37, 1.175, .303);
    add(flap, green, bodyWeight);

    ball([sign * .375, 1.17, .341], [.017, .017, .008], amber, 'Spine', 12, 8);
  }

  // 3 Chunky Duffle Coat Toggle Closures
  for (const y of [1.04, 1.36, 1.68]) {
    const z = .37 - (y - 1.04) * .12;
    for (const sign of [-1, 1]) {
      // Leather circular reinforcement patch
      ball([sign * .105, y, z], [.054, .064, .026], amber, 'Spine', 18, 12);
      const loop = new THREE.TorusGeometry(.028, .009, 8, 18);
      loop.translate(sign * .105, y, z + .028);
      add(loop, amber, 'Spine');
    }
    // Cream braided rope loop connecting the toggles
    line([[-.095, y, z + .042], [0, y + .009, z + .048], [.095, y, z + .042]], .014, cream, 'Spine', 14);
    // Chunky wooden toggle peg in the center
    ball([0, y + .006, z + .054], [.066, .026, .026], amber, 'Spine', 18, 12);
  }

  // Coat Hem Piping
  const hem: number[][] = [];
  for (let i = 0; i <= 48; i++) {
    const a = i / 48 * Math.PI * 2;
    hem.push([Math.sin(a) * .496, .80, Math.cos(a) * .346]);
  }
  line(hem, .022, trim, 'Hips', 48);

  // ==========================================
  // 3. ARMS, SLEEVES & MITTEN PAWS (WITH PADS)
  // ==========================================
  for (const [side, sign] of [['L', 1], ['R', -1]] as const) {
    const armWeight = (p: THREE.Vector3) => chainWeights(rig, [`UpperArm.${side}`, `Forearm.${side}`, `Hand.${side}`], p);
    add(
      sweep(
        [v(sign * .35, 1.83, 0), v(sign * .61, 1.64, .01), v(sign * .77, 1.40, .055), v(sign * .89, 1.25, .10)],
        [.225, .21, .19, .18],
        24, 28
      ),
      green,
      armWeight
    );

    // Sleeve Cuff
    ball([sign * .895, 1.24, .105], [.195, .145, .196], trim, `Hand.${side}`);

    // Mitten Paw Hand
    ball([sign * .94, 1.16, .15], [.185, .205, .175], green, `Hand.${side}`);

    // Orange Paw Print Pads on Palm (Visible on waving hand & rest)
    // Main Kidney/Oval Palm Pad
    ball([sign * .94, 1.12, .310], [.080, .072, .024], amber, `Hand.${side}`, 20, 12);
    // 4 Round Toe Pads along paw arch
    const toePadOffsets = [-.075, -.025, .025, .075];
    for (const dx of toePadOffsets) {
      const dy = 1.238 - Math.abs(dx) * .18;
      ball([sign * .94 + dx, dy, .300], [.026, .030, .020], amber, `Hand.${side}`, 14, 10);
    }

    // 4 Rounded Ivory Claws at Mitten Tip
    for (let i = 0; i < 4; i++) {
      const claw = softSpike(.072, .112, .060);
      const angle = (i - 1.5) * .22;
      claw.rotateZ(Math.PI + angle);
      claw.translate(sign * .94 + (i - 1.5) * .085, 1.038, .215);
      add(claw, ivory, `Hand.${side}`);
    }
  }

  // ==========================================
  // 4. CURVED DINO TAIL & DORSAL PLATES
  // ==========================================
  const tailNames = ['Tail.01', 'Tail.02', 'Tail.03', 'Tail.04'];
  const tailWeight = (p: THREE.Vector3) => chainWeights(rig, tailNames, p);
  const tailPoints = [
    v(0, 1.02, -.25),
    v(.16, .86, -.59),
    v(.50, .80, -.94),
    v(.81, .96, -1.19),
    v(.96, 1.19, -1.27)
  ];
  add(sweep(tailPoints, [.265, .24, .18, .115, .004], 24, 38), green, tailWeight);

  // Tail Spikes along the curve
  for (let i = 0; i < 4; i++) {
    const t = (i + .5) / 4;
    const p = new THREE.CatmullRomCurve3(tailPoints).getPoint(t);
    const spike = softSpike(.19 - t * .07, .24 - t * .12, .07);
    spike.rotateY(Math.PI / 2);
    spike.translate(p.x, p.y + .20 * (1 - t), p.z);
    add(spike, amber, tailWeight);
  }

  // Back Spine Spikes on Coat
  for (const y of [1.15, 1.43, 1.72]) {
    const spike = softSpike(.24, .25, .08);
    spike.rotateX(-Math.PI / 2);
    spike.translate(0, y, -.29);
    add(spike, amber, bodyWeight);
  }

  // Neck
  ball([0, 2.035, .02], [.15, .18, .145], skin, 'Neck');

  // ==========================================
  // 5. HOOD OPEN SHELL & INNER LINING
  // ==========================================
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
        positions.push(x, y, z);
        uv.push(i / cols, j / rows);
        if (j < rows && i < cols) {
          const k = j * (cols + 1) + i;
          if (!lining) indices.push(k, k + cols + 1, k + 1, k + 1, k + cols + 1, k + cols + 2);
          else indices.push(k, k + 1, k + cols + 1, k + 1, k + cols + 2, k + cols + 1);
        }
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    const normals = geo.getAttribute('normal');
    for (let row = 0; row <= rows; row++) {
      const first = row * (cols + 1), last = first + cols;
      const normal = v(0, 0, 0)
        .fromBufferAttribute(normals, first)
        .add(v(0, 0, 0).fromBufferAttribute(normals, last))
        .normalize();
      normals.setXYZ(first, normal.x, normal.y, normal.z);
      normals.setXYZ(last, normal.x, normal.y, normal.z);
    }
    add(geo, lining ? inner : green, 'Head');
  }

  // Hood Rim Piping
  const lip: number[][] = [];
  for (let i = 0; i <= 64; i++) {
    const a = i / 64 * Math.PI * 2;
    lip.push([
      Math.cos(a) * Math.sin(.98) * .815,
      2.72 - .10 * Math.cos(.98) + Math.sin(a) * Math.sin(.98) * .835,
      .185 + Math.cos(.98) * .67
    ]);
  }
  line(lip, .037, trim, 'Head', 72);

  // ==========================================
  // 6. CHIBI FACE, EYES, ROSY BLUSH & SMILE
  // ==========================================
  // Hair base silhouette inside hood
  ball([0, 2.63, .285], [.605, .635, .44], hair, 'Head', 36, 24);

  // Face head sphere
  const face = ellipsoid([0, 2.51, .39], [.555, .534, .409], 40, 28);
  add(face, skin, 'Head');

  // Surface contour function for cheek & feature placement
  const faceSurface = (x: number, y: number) =>
    .39 + .409 * Math.sqrt(Math.max(.025, 1 - (x / .555) ** 2 - ((y - 2.51) / .534) ** 2));

  // Layered Anime Eyes conforming to cheeks
  const eyeLayer = (x: number, y: number, rx: number, ry: number, offset: number, depth: number, material: THREE.Material) => {
    const center = Math.sign(x) * .245;
    x = center + (x - center) * .82;
    y = 2.60 + (y - 2.60) * .82;
    const geo = ellipsoid([x, y, 0], [rx * .82, ry * .82, depth], 24, 16);
    const p = geo.getAttribute('position');
    for (let i = 0; i < p.count; i++) p.setZ(i, p.getZ(i) + faceSurface(p.getX(i), p.getY(i)) + offset);
    geo.computeVertexNormals();
    add(geo, material, 'Head');
  };

  for (const sign of [-1, 1]) {
    // Chibi Ears
    ball([sign * .54, 2.43, .40], [.12, .155, .090], skin);
    ball([sign * .584, 2.44, .462], [.057, .09, .018], earInner, 'Head', 18, 12);

    // Eye layers (Ivory sclera, deep ring, hazel iris, dark pupil, dual specular highlights)
    eyeLayer(sign * .245, 2.61, .178, .222, .004, .010, hair);
    eyeLayer(sign * .245, 2.602, .166, .208, .015, .010, white);
    eyeLayer(sign * .245, 2.584, .120, .162, .029, .006, irisDark);
    eyeLayer(sign * .245, 2.581, .104, .148, .038, .005, iris);
    eyeLayer(sign * .245, 2.603, .064, .102, .047, .006, black);

    // Primary large highlight (top-left) & secondary highlight (bottom-right)
    eyeLayer(sign * .245 - .035, 2.661, .034, .042, .060, .005, white);
    eyeLayer(sign * .245 + .033, 2.520, .014, .018, .055, .004, white);

    // Cute upper anime eyeliner curve & eyebrow
    line(
      [[sign * .09, 2.727], [sign * .19, 2.802], [sign * .30, 2.804], [sign * .396, 2.712]].map(([x, y]) => {
        const cx = Math.sign(x) * .245;
        x = cx + (x - cx) * .82;
        y = 2.60 + (y - 2.60) * .82;
        return [x, y, faceSurface(x, y) + .020];
      }),
      .013,
      hair
    );
    line(
      [[sign * .13, 2.885], [sign * .22, 2.920], [sign * .32, 2.894]].map(([x, y]) => [x, y, faceSurface(x, y) + .017]),
      .022,
      hair,
      'Head',
      16
    );

    // Rosy Pink Cheeks (Blush) under each eye
    ball(
      [sign * .330, 2.440, faceSurface(sign * .330, 2.440) + .006],
      [.095, .052, .010],
      blush,
      'Head',
      18,
      12
    );
  }

  // Cute Button Nose
  ball([0, 2.452, .807], [.048, .037, .042], skin, 'Head', 24, 16);

  // Joyful Open Smile (:D) with dark mouth cavity & cute pink tongue
  // Dark oral cavity
  ball([0, 2.270, faceSurface(0, 2.270) + .002], [.092, .058, .016], mouthCavity, 'Jaw', 22, 14);
  // Pink tongue at bottom of mouth cavity
  ball([0, 2.242, faceSurface(0, 2.242) + .006], [.064, .032, .014], tongue, 'Jaw', 18, 12);
  // Upper & lower smiling lip contours
  line(
    [[-.095, 2.325], [-.050, 2.308], [0, 2.304], [.050, 2.308], [.095, 2.325]].map(([x, y]) => [
      x, y, faceSurface(x, y) + .008
    ]),
    .007,
    mouth,
    'Jaw',
    20
  );
  line(
    [[-.090, 2.322], [-.055, 2.228], [0, 2.215], [.055, 2.228], [.090, 2.322]].map(([x, y]) => [
      x, y, faceSurface(x, y) + .008
    ]),
    .006,
    mouth,
    'Jaw',
    20
  );

  // Voluminous layered anime bangs framing forehead and face
  const locks = [
    // Left side & temple
    [[-.49, 2.94, .48], [-.55, 2.69, .49], [-.49, 2.48, .56]],
    [[-.38, 3.03, .61], [-.45, 2.91, .69], [-.43, 2.67, .69]],
    [[-.28, 3.09, .62], [-.35, 2.94, .73], [-.27, 2.80, .75]],
    // Center-left sweeping bangs
    [[-.18, 3.14, .62], [-.24, 2.98, .76], [-.14, 2.86, .77]],
    [[-.08, 3.16, .63], [-.02, 2.99, .78], [.08, 2.87, .77]],
    // Center-right sweeping bangs
    [[.06, 3.15, .63], [.14, 2.98, .77], [.24, 2.87, .74]],
    [[.20, 3.12, .61], [.28, 2.96, .73], [.36, 2.85, .70]],
    // Right side & temple
    [[.34, 3.07, .59], [.46, 2.86, .63], [.45, 2.66, .64]],
    [[.49, 2.93, .48], [.55, 2.70, .48], [.49, 2.47, .56]],
  ];
  locks.forEach((points, i) => {
    add(
      sweep(points.map(p => v(p[0], p[1] - .015, p[2] - .045)), [.102, .086, .005], 14, 18, .48),
      i % 3 === 0 ? hairLight : hair,
      'Head'
    );
  });

  // ==========================================
  // 7. DINO MUZZLE, EYES, NOSTRILS & TEETH
  // ==========================================
  // Dino Snout / Brow
  ball([0, 3.235, .560], [.56, .172, .155], green, 'Head', 36, 22);

  // Big Cartoon Dino Eyes on Hood
  for (const sign of [-1, 1]) {
    ball([sign * .405, 3.422, .394], [.176, .185, .133], green, 'Head', 28, 18);
    ball([sign * .405, 3.431, .501], [.125, .147, .040], white);
    ball([sign * .394, 3.425, .537], [.077, .101, .016], black);
    ball([sign * .410, 3.467, .554], [.024, .028, .007], white, 'Head', 16, 10);
    // Nostrils on snout
    ball([sign * .207, 3.258, .692], [.054, .039, .022], trim, 'Head', 18, 12);
    ball([sign * .207, 3.258, .706], [.029, .024, .009], inner, 'Head', 16, 10);
  }

  // Rounded Ivory Dinosaur Teeth Framing Hood Opening
  for (let i = 0; i < 7; i++) {
    const a = .29 + i / 6 * (Math.PI - .58);
    const x = Math.cos(a) * .613, y = 2.92 + Math.sin(a) * .280;
    const tooth = softSpike(i === 3 ? .130 : .110, .132, .058);
    tooth.rotateZ(Math.PI + (a - Math.PI / 2) * .36);
    tooth.translate(x, y, .709);
    add(tooth, ivory, 'Head');
  }
  // Two small corner teeth on lower hood opening
  for (const sign of [-1, 1]) {
    const lowerTooth = softSpike(.082, .095, .045);
    lowerTooth.rotateZ(sign * .35);
    lowerTooth.translate(sign * .52, 2.50, .66);
    add(lowerTooth, ivory, 'Head');
  }

  // Hood Center Seam Line
  line([[0, 3.30, .702], [0, 3.47, .46], [0, 3.55, .185], [0, 3.50, -.04]], .006, trim, 'Head', 28);

  // ==========================================
  // 8. TALL PROMINENT HOOD CREST SPIKES
  // ==========================================
  // 5 Warm Amber Hood Spikes along the midline, with prominent front crest
  const hoodSpikes = [
    // Front-most prominent crest spike (high above snout, pointing up-forward, clearly visible in front view)
    { pos: [0, 3.56, .42], size: [.27, .32, .11], rotX: .22 },
    // Crown crest spike
    { pos: [0, 3.66, .14], size: [.26, .30, .10], rotX: -.12 },
    // Upper back crest spike
    { pos: [0, 3.50, -.12], size: [.25, .28, .095], rotX: -.48 },
    // Mid back crest spike
    { pos: [0, 3.18, -.34], size: [.23, .26, .090], rotX: -.88 },
    // Lower back crest spike
    { pos: [0, 2.76, -.44], size: [.21, .24, .085], rotX: -1.28 }
  ];

  for (const item of hoodSpikes) {
    const spike = softSpike(item.size[0], item.size[1], item.size[2]);
    spike.rotateX(item.rotX);
    spike.translate(item.pos[0], item.pos[1], item.pos[2]);
    add(spike, amber, 'Head');
  }

  // Folded collar framing the neck where the hood rests on the coat
  for (const sign of [-1, 1]) {
    line(
      [[sign * .52, 2.025, .36], [sign * .35, 2.016, .34], [sign * .20, 1.987, .30], [sign * .055, 1.916, .25]],
      .060,
      green,
      'Neck',
      22
    );
  }

  // Finalize Skinned Meshes and Attach Rig
  builder.finish(group);

  // Animations & Metadata
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

/** Legacy alias for backwards compatibility */
export const createDinoChibi = createGemniDino;
