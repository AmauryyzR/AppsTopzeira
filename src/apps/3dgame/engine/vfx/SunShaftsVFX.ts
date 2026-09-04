import * as THREE from 'three';

const sunShaftVertexShader = /* glsl */ `
varying vec2 vUv;
varying vec3 vWorldPosition;

void main() {
  vUv = uv;
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPos.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

const sunShaftFragmentShader = /* glsl */ `
uniform vec3 uColor;
uniform float uOpacity;
uniform float uTime;
varying vec2 vUv;
varying vec3 vWorldPosition;

void main() {
  // Lateral beam feathering (Gaussian bell-curve across horizontal UV)
  float uDist = abs(vUv.x - 0.5) * 2.0;
  float horizontalEdge = smoothstep(1.0, 0.0, uDist);
  horizontalEdge = pow(horizontalEdge, 2.6);

  // Vertical beam fade (intense near canopy origin, softly dissolving near ground)
  float verticalFade = smoothstep(0.08, 0.45, vUv.y) * smoothstep(1.0, 0.72, vUv.y);

  // Subtle organic shimmer / light drift
  float shimmer = 0.90 + 0.10 * sin(uTime * 1.5 + vUv.x * 6.28 + vWorldPosition.y * 0.4);

  float alpha = horizontalEdge * verticalFade * uOpacity * shimmer;
  if (alpha < 0.002) discard;

  gl_FragColor = vec4(uColor, alpha);
}
`;

export interface SunShaftConfig {
  x: number;
  z: number;
  height: number;
  widthTop: number;
  widthBottom: number;
  slantX: number;
  slantZ: number;
  phaseOffset: number;
}

/**
 * AAA Stylized Anime Sunbeams / Volumetric Light Shafts (God Rays) (Loop 12)
 * Creates soft, golden crepuscular light rays radiating from the celestial sun
 * through the foliage canopy, matching Genshin Impact & Breath of the Wild atmosphere.
 */
export class SunShaftsVFX {
  public readonly group = new THREE.Group();
  private material: THREE.ShaderMaterial;
  private geometries: THREE.BufferGeometry[] = [];
  private time = 0;
  private shaftMeshes: THREE.Mesh[] = [];

  constructor() {
    this.group.name = 'VolumetricSunShafts_Genshin';

    this.material = new THREE.ShaderMaterial({
      name: 'AnimeSunShaftMaterial',
      vertexShader: sunShaftVertexShader,
      fragmentShader: sunShaftFragmentShader,
      uniforms: {
        uColor: { value: new THREE.Color(0xfff3c4) }, // Warm honey golden morning/afternoon sun
        uOpacity: { value: 0.040 }, // Delicate anime atmospheric halation
        uTime: { value: 0 },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: true,
      side: THREE.DoubleSide,
    });

    this.buildShafts();
  }

  private buildShafts() {
    // 8 Slender stylized light beam planes placed strategically around the plaza and foliage groves
    const shaftPlacements: SunShaftConfig[] = [
      { x: 12, z: 8, height: 26, widthTop: 2.4, widthBottom: 4.6, slantX: 0.18, slantZ: 0.12, phaseOffset: 0.0 },
      { x: -14, z: 12, height: 24, widthTop: 2.2, widthBottom: 4.2, slantX: 0.20, slantZ: 0.15, phaseOffset: 1.2 },
      { x: 18, z: -10, height: 28, widthTop: 2.6, widthBottom: 5.0, slantX: 0.16, slantZ: 0.14, phaseOffset: 2.5 },
      { x: -16, z: -14, height: 25, widthTop: 2.0, widthBottom: 4.0, slantX: 0.22, slantZ: 0.10, phaseOffset: 3.7 },
      { x: 4, z: 18, height: 24, widthTop: 2.4, widthBottom: 4.4, slantX: 0.19, slantZ: 0.16, phaseOffset: 4.8 },
      { x: -6, z: 22, height: 27, widthTop: 2.5, widthBottom: 4.8, slantX: 0.17, slantZ: 0.13, phaseOffset: 0.8 },
      { x: 22, z: 16, height: 26, widthTop: 2.4, widthBottom: 4.5, slantX: 0.21, slantZ: 0.11, phaseOffset: 2.1 },
      { x: 0, z: -8, height: 25, widthTop: 2.6, widthBottom: 5.0, slantX: 0.18, slantZ: 0.14, phaseOffset: 3.4 },
    ];

    for (let i = 0; i < shaftPlacements.length; i++) {
      const cfg = shaftPlacements[i];

      const geo = new THREE.BufferGeometry();
      const halfTop = cfg.widthTop / 2;
      const halfBottom = cfg.widthBottom / 2;
      const h = cfg.height;

      // 8 Vertices forming a cross quad (two intersecting perpendicular planes for 360 view)
      const verts: number[] = [
        // Plane A (Z-aligned)
        -halfTop, h, 0,
        halfTop, h, 0,
        -halfBottom, 0, 0,
        halfBottom, 0, 0,

        // Plane B (X-aligned cross)
        0, h, -halfTop,
        0, h, halfTop,
        0, 0, -halfBottom,
        0, 0, halfBottom,
      ];

      const uvs: number[] = [
        // Plane A
        0, 1,
        1, 1,
        0, 0,
        1, 0,

        // Plane B
        0, 1,
        1, 1,
        0, 0,
        1, 0,
      ];

      const indices: number[] = [
        0, 2, 1,  1, 2, 3, // Plane A
        4, 6, 5,  5, 6, 7, // Plane B
      ];

      geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
      geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
      geo.setIndex(indices);
      this.geometries.push(geo);

      const mesh = new THREE.Mesh(geo, this.material);
      mesh.position.set(cfg.x, 0.5, cfg.z);
      mesh.rotation.x = cfg.slantX;
      mesh.rotation.z = -cfg.slantZ;
      mesh.renderOrder = 200; // Render after opaque geometry
      this.group.add(mesh);
      this.shaftMeshes.push(mesh);
    }
  }

  public update(dt: number, sunDir?: THREE.Vector3) {
    this.time += dt;
    this.material.uniforms.uTime.value = this.time;

    if (sunDir) {
      const sunAngleX = Math.atan2(sunDir.y, Math.sqrt(sunDir.x * sunDir.x + sunDir.z * sunDir.z));
      const sunAngleY = Math.atan2(sunDir.x, sunDir.z);

      for (let i = 0; i < this.shaftMeshes.length; i++) {
        const mesh = this.shaftMeshes[i];
        mesh.rotation.y = sunAngleY;
        mesh.rotation.x = -(Math.PI / 2 - sunAngleX) * 0.45;
      }
    }
  }

  public dispose() {
    for (const g of this.geometries) {
      g.dispose();
    }
    this.geometries = [];
    this.material.dispose();
    while (this.group.children.length > 0) {
      const child = this.group.children[0];
      this.group.remove(child);
    }
    this.shaftMeshes = [];
  }
}
