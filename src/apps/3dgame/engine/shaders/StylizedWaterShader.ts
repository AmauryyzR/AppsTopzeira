import * as THREE from 'three';

export interface StylizedWaterMaterialOptions {
  shallowColor?: THREE.ColorRepresentation;
  deepColor?: THREE.ColorRepresentation;
  foamColor?: THREE.ColorRepresentation;
  causticColor?: THREE.ColorRepresentation;
  sunColor?: THREE.ColorRepresentation;
  opacity?: number;
  innerRadius?: number;
  outerRadius?: number;
  fountainCenter?: THREE.Vector2;
}

export interface StylizedWaterfallMaterialOptions {
  waterColor?: THREE.ColorRepresentation;
  foamColor?: THREE.ColorRepresentation;
  sunColor?: THREE.ColorRepresentation;
  speed?: number;
  opacity?: number;
}

/**
 * Creates custom ShaderMaterial for Anime Cel-Shaded Pool Water (Genshin Impact / Zelda: BotW).
 * Features:
 * - Trochoidal/sinusoidal vertex wave displacement with exact analytical normal calculation.
 * - 2-layer procedural Voronoi caustics simulation.
 * - Stylized frothy shoreline foam rim along basin coping and central pedestal.
 * - Stepped anime sun specular glints on wave crests.
 * - Depth gradient from turquoise crystal shallows to deep sapphire abyss.
 * - Soft Fresnel sky rim reflection.
 */
export function createStylizedWaterMaterial(
  options: StylizedWaterMaterialOptions = {}
): THREE.ShaderMaterial {
  const uniforms = {
    uTime: { value: 0 },
    uSunDirection: { value: new THREE.Vector3(45, 65, 35).normalize() },
    uSunColor: { value: new THREE.Color(options.sunColor ?? 0xfff6e6) },
    uShallowColor: { value: new THREE.Color(options.shallowColor ?? 0x2dd4bf) }, // Turquoise #2dd4bf / #38bdf8
    uDeepColor: { value: new THREE.Color(options.deepColor ?? 0x0284c7) },       // Deep sapphire #0284c7 / #0369a1
    uFoamColor: { value: new THREE.Color(options.foamColor ?? 0xf0fdfa) },       // Shoreline foam #f0fdfa
    uCausticColor: { value: new THREE.Color(options.causticColor ?? 0xfef08a) }, // Warm golden/sunlit caustics
    uOpacity: { value: options.opacity ?? 0.88 },
    uInnerRadius: { value: options.innerRadius ?? 0.95 },
    uOuterRadius: { value: options.outerRadius ?? 4.05 },
    uFountainCenter: { value: options.fountainCenter ?? new THREE.Vector2(0, 0) },
  };

  const vertexShader = /* glsl */ `
    uniform float uTime;

    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    varying vec2 vUv;
    varying float vWaveElevation;
    varying vec3 vViewPosition;

    #include <fog_pars_vertex>

    // 3 Trochoidal Gerstner Wave Components
    struct Wave {
      vec2 dir;
      float freq;
      float speed;
      float amp;
      float steepness;
    };

    void main() {
      vUv = uv;

      // 3 Harmonic waves traveling in complementary directions
      Wave w1 = Wave(normalize(vec2(1.0, 0.4)),  2.8,  1.4, 0.024, 0.45);
      Wave w2 = Wave(normalize(vec2(-0.6, 0.8)), 4.6,  2.1, 0.014, 0.35);
      Wave w3 = Wave(normalize(vec2(0.3, -0.9)), 7.2,  2.8, 0.008, 0.25);

      vec3 pos = position;
      vec3 worldPos = (modelMatrix * vec4(pos, 1.0)).xyz;

      float dX = 0.0;
      float dY = 0.0;
      float dZ = 0.0;

      float nX = 0.0;
      float nY = 1.0;
      float nZ = 0.0;

      // Wave 1
      float phase1 = dot(w1.dir, worldPos.xz) * w1.freq - uTime * w1.speed;
      float c1 = cos(phase1);
      float s1 = sin(phase1);
      dX -= w1.steepness * w1.amp * w1.dir.x * s1;
      dZ -= w1.steepness * w1.amp * w1.dir.y * s1;
      dY += w1.amp * c1;
      nX -= w1.dir.x * w1.freq * w1.amp * s1;
      nZ -= w1.dir.y * w1.freq * w1.amp * s1;
      nY -= w1.steepness * w1.freq * w1.amp * c1;

      // Wave 2
      float phase2 = dot(w2.dir, worldPos.xz) * w2.freq - uTime * w2.speed;
      float c2 = cos(phase2);
      float s2 = sin(phase2);
      dX -= w2.steepness * w2.amp * w2.dir.x * s2;
      dZ -= w2.steepness * w2.amp * w2.dir.y * s2;
      dY += w2.amp * c2;
      nX -= w2.dir.x * w2.freq * w2.amp * s2;
      nZ -= w2.dir.y * w2.freq * w2.amp * s2;
      nY -= w2.steepness * w2.freq * w2.amp * c2;

      // Wave 3
      float phase3 = dot(w3.dir, worldPos.xz) * w3.freq - uTime * w3.speed;
      float c3 = cos(phase3);
      float s3 = sin(phase3);
      dX -= w3.steepness * w3.amp * w3.dir.x * s3;
      dZ -= w3.steepness * w3.amp * w3.dir.y * s3;
      dY += w3.amp * c3;
      nX -= w3.dir.x * w3.freq * w3.amp * s3;
      nZ -= w3.dir.y * w3.freq * w3.amp * s3;
      nY -= w3.steepness * w3.freq * w3.amp * c3;

      pos.x += dX;
      pos.y += dY;
      pos.z += dZ;

      vWaveElevation = dY;
      vec3 waveNormal = vec3(-nX, nY, -nZ);
      vNormal = normalize(mat3(modelMatrix) * waveNormal);

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;

      vViewPosition = -mvPosition.xyz;
      vWorldPosition = (modelMatrix * vec4(pos, 1.0)).xyz;

      #include <fog_vertex>
    }
  `;

  const fragmentShader = /* glsl */ `
    precision highp float;

    uniform float uTime;
    uniform vec3 uSunDirection;
    uniform vec3 uSunColor;
    uniform vec3 uShallowColor;
    uniform vec3 uDeepColor;
    uniform vec3 uFoamColor;
    uniform vec3 uCausticColor;
    uniform float uOpacity;
    uniform float uInnerRadius;
    uniform float uOuterRadius;
    uniform vec2 uFountainCenter;

    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    varying vec2 vUv;
    varying float vWaveElevation;
    varying vec3 vViewPosition;

    #include <fog_pars_fragment>

    // 2D Hash Function for Procedural Voronoi
    vec2 hash2(vec2 p) {
      p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
      return fract(sin(p) * 43758.5453123);
    }

    // Procedural Voronoi with animated cell jitter
    float voronoi(vec2 p, float time) {
      vec2 i_pos = floor(p);
      vec2 f_pos = fract(p);
      float minDist = 8.0;

      for (int j = -1; j <= 1; j++) {
        for (int i = -1; i <= 1; i++) {
          vec2 neighbor = vec2(float(i), float(j));
          vec2 point = hash2(i_pos + neighbor);
          point = 0.5 + 0.45 * sin(time + 6.2831853 * point);
          vec2 diff = neighbor + point - f_pos;
          minDist = min(minDist, dot(diff, diff));
        }
      }
      return sqrt(minDist);
    }

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      vec3 sunDir = normalize(uSunDirection);

      // 1. Exact Radial Shoreline Distance
      float r = length(vWorldPosition.xz - uFountainCenter);
      float distInner = max(0.0, r - uInnerRadius);
      float distOuter = max(0.0, uOuterRadius - r);
      float edgeDist = min(distInner, distOuter);

      // 2. Depth Factor (0.0 = crystal shallows at shoreline, 1.0 = deep sapphire center pool)
      float maxDepthDist = (uOuterRadius - uInnerRadius) * 0.48;
      float depthFactor = clamp(edgeDist / max(0.001, maxDepthDist), 0.0, 1.0);

      // Cel-Graded Depth Gradient (Zelda BotW / Genshin Impact turquoise into sapphire)
      vec3 waterColor = mix(uShallowColor, uDeepColor, smoothstep(0.04, 0.85, depthFactor));

      // 3. Two-Layer Procedural Voronoi Caustics
      vec2 uv1 = vWorldPosition.xz * 3.4 + vec2(uTime * 0.16, uTime * 0.11);
      vec2 uv2 = vWorldPosition.xz * 4.6 + vec2(-uTime * 0.13, uTime * 0.20);

      float v1 = voronoi(uv1, uTime * 1.3);
      float v2 = voronoi(uv2, uTime * 1.5 + 2.1);

      // Inverted caustic filament lines
      float c1 = pow(clamp(1.0 - v1, 0.0, 1.0), 2.6);
      float c2 = pow(clamp(1.0 - v2, 0.0, 1.0), 2.6);
      float causticIntensity = min(c1, c2) * 2.5 + (c1 * c2) * 2.2;
      causticIntensity = smoothstep(0.12, 0.60, causticIntensity);

      // Caustics are bright in sunny shallows and penetrate through the translucent pool
      float causticMask = (1.0 - depthFactor * 0.35);
      waterColor += uCausticColor * causticIntensity * causticMask * 0.65;

      // 4. Stylized Shoreline Foam Rim (contact with stone basin coping and central pedestal)
      float theta = atan(vWorldPosition.z - uFountainCenter.y, vWorldPosition.x - uFountainCenter.x);
      float foamPerturb = 0.035 * sin(theta * 16.0 + uTime * 2.8) +
                          0.018 * sin(theta * 32.0 - uTime * 4.2);
      float perturbedEdgeDist = edgeDist + foamPerturb;

      // Crisp frothy shoreline band
      float foamBand = smoothstep(0.16, 0.01, perturbedEdgeDist);

      // Micro-bubbly foam texture
      float bubbleNoise = voronoi(vWorldPosition.xz * 14.0, uTime * 0.9);
      float foamBubbles = step(0.30, bubbleNoise);
      float finalFoam = foamBand * (0.60 + 0.40 * foamBubbles);

      // 5. Stepped Anime Specular Glint
      vec3 halfVec = normalize(sunDir + viewDir);
      float NdotH = max(0.0, dot(normal, halfVec));

      // Dual-step cel highlight (broad glint + intense starry apex sparkle)
      float specBroad = smoothstep(0.87, 0.91, NdotH) * 0.35;
      float specSharp = smoothstep(0.965, 0.985, NdotH) * 1.50;
      // Modulate sharp sparkle on wave crests
      specSharp *= smoothstep(-0.005, 0.025, vWaveElevation);
      vec3 specular = (specBroad + specSharp) * uSunColor;

      // 6. Fresnel Rim Reflection (glancing anime sky bounce)
      float fresnel = pow(1.0 - max(0.0, dot(normal, viewDir)), 3.5);
      vec3 skyReflection = vec3(0.85, 0.94, 1.0);
      waterColor = mix(waterColor, skyReflection, fresnel * 0.38);

      // 7. Composite Color & Anime Shoreline Foam
      waterColor = mix(waterColor, uFoamColor, finalFoam);
      waterColor += specular;

      // 8. Controlled Translucency
      float alpha = mix(uOpacity * 0.78, uOpacity, depthFactor);
      alpha = mix(alpha, 1.0, finalFoam); // Foam rim is dense and opaque

      gl_FragColor = vec4(waterColor, alpha);

      #include <fog_fragment>
    }
  `;

  const mergedUniforms = THREE.UniformsUtils.merge([
    THREE.UniformsLib.fog,
    uniforms,
  ]);

  const material = new THREE.ShaderMaterial({
    uniforms: mergedUniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    fog: true,
  });

  return material;
}

/**
 * Creates custom ShaderMaterial for Anime Waterfalls, Cascades, and Fountain Jets.
 * Features:
 * - High-speed vertical UV scrolling with sleek water streamlines.
 * - Upper lip and landing impact contact foam bands.
 * - Cel-shaded shimmering highlights and bubbly turbulence.
 */
export function createStylizedWaterfallMaterial(
  options: StylizedWaterfallMaterialOptions = {}
): THREE.ShaderMaterial {
  const uniforms = {
    uTime: { value: 0 },
    uSpeed: { value: options.speed ?? 2.8 },
    uWaterColor: { value: new THREE.Color(options.waterColor ?? 0x38bdf8) }, // Vibrant turquoise #38bdf8
    uFoamColor: { value: new THREE.Color(options.foamColor ?? 0xf8fafc) },   // Pure frothy white #f8fafc
    uSunColor: { value: new THREE.Color(options.sunColor ?? 0xfff6e6) },
    uSunDirection: { value: new THREE.Vector3(45, 65, 35).normalize() },
    uOpacity: { value: options.opacity ?? 0.85 },
  };

  const vertexShader = /* glsl */ `
    uniform float uTime;

    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    varying vec2 vUv;
    varying vec3 vViewPosition;

    #include <fog_pars_vertex>

    void main() {
      vUv = uv;

      vec3 pos = position;

      // Subtle ripple flutter on the flowing water sheet
      float ripple = sin(pos.y * 10.0 + uTime * 7.0) * 0.015 +
                     cos(uv.x * 20.0 + uTime * 5.0) * 0.012;
      pos += normal * ripple;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;

      vViewPosition = -mvPosition.xyz;
      vNormal = normalize(mat3(modelMatrix) * normal);
      vWorldPosition = (modelMatrix * vec4(pos, 1.0)).xyz;

      #include <fog_vertex>
    }
  `;

  const fragmentShader = /* glsl */ `
    precision highp float;

    uniform float uTime;
    uniform float uSpeed;
    uniform vec3 uWaterColor;
    uniform vec3 uFoamColor;
    uniform vec3 uSunColor;
    uniform vec3 uSunDirection;
    uniform float uOpacity;

    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    varying vec2 vUv;
    varying vec3 vViewPosition;

    #include <fog_pars_fragment>

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      vec3 sunDir = normalize(uSunDirection);

      // 1. High-Speed Flowing UV Scrolling (Elongated Vertical Ribbons)
      float flowV = vUv.y * 5.0 - uTime * uSpeed;
      float uCoord = vUv.x * 24.0;

      // Smooth flowing streams with harmonic wavy warping
      float streamWarp = sin(flowV * 1.8 + vUv.x * 10.0) * 0.45;
      float streamVal = sin((uCoord + streamWarp) * 3.14159);
      float streaks = smoothstep(0.25, 0.75, streamVal);

      // Fast fine foam threads
      float threadVal = sin((vUv.x * 48.0 - flowV * 2.5) * 3.14159);
      float fineThreads = smoothstep(0.45, 0.85, threadVal) * 0.4;

      // 2. Lip Overflow Foam (Top) and Splash Landing Foam (Bottom)
      float topFoam = smoothstep(0.12, 0.0, vUv.y);
      float btmFoam = smoothstep(0.84, 1.0, vUv.y);

      // Fast turbulent foam bursts along stream
      float turb = sin(flowV * 4.0 + uCoord * 0.7) * 0.5 + 0.5;
      float foamBursts = smoothstep(0.65, 0.95, turb * streaks) * 0.6;

      float totalFoam = clamp(topFoam * 1.2 + btmFoam * 1.4 + streaks * 0.45 + fineThreads + foamBursts, 0.0, 1.0);

      // 3. Cel Shaded Water Color & Foam
      vec3 col = mix(uWaterColor, uFoamColor, totalFoam);

      // Forward sun scatter translucency
      float sunDotView = max(0.0, dot(sunDir, -viewDir));
      col += uSunColor * pow(sunDotView, 2.5) * 0.35;

      // Specular highlight
      vec3 halfVec = normalize(sunDir + viewDir);
      float NdotH = max(0.0, dot(normal, halfVec));
      col += uSunColor * smoothstep(0.92, 0.98, NdotH) * 0.80;

      // 4. Alpha
      float alpha = mix(uOpacity * 0.65, 0.95, totalFoam);

      gl_FragColor = vec4(col, alpha);

      #include <fog_fragment>
    }
  `;

  const mergedUniforms = THREE.UniformsUtils.merge([
    THREE.UniformsLib.fog,
    uniforms,
  ]);

  const material = new THREE.ShaderMaterial({
    uniforms: mergedUniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    fog: true,
  });

  return material;
}

/**
 * AAA-Grade Stylized Water & Monumental Fountain Hydrodynamics Manager.
 * Orchestrates:
 * 1. Lower basin water surface with Trochoidal waves, Voronoi caustics, and Shoreline foam.
 * 2. Upper bowl cascading water surface.
 * 3. Vertical overflowing water cascade curtain falling between bowls.
 * 4. Lower cascade splash impact ring with bubbling froth.
 * 5. Central towering geyser spout.
 * 6. 8 Parabolic arched water jets arching from the pedestal into the lower pool.
 * 7. 8 Water jet splash impact ripple rings in the pool.
 */
export class StylizedWater {
  public readonly group = new THREE.Group();

  public readonly poolMaterial: THREE.ShaderMaterial;
  public readonly upperPoolMaterial: THREE.ShaderMaterial;
  public readonly cascadeMaterial: THREE.ShaderMaterial;
  public readonly jetMaterial: THREE.ShaderMaterial;

  private geometries: THREE.BufferGeometry[] = [];
  private materials: THREE.Material[] = [];

  private static readonly _tempSunDir = new THREE.Vector3();
  private totalTime = 0;

  constructor() {
    // 1. Create Core Shaders
    this.poolMaterial = this.trackMat(
      createStylizedWaterMaterial({
        shallowColor: 0x2dd4bf,
        deepColor: 0x0284c7,
        foamColor: 0xf0fdfa,
        causticColor: 0xfef08a,
        opacity: 0.88,
        innerRadius: 0.95,
        outerRadius: 4.05,
      })
    );

    this.upperPoolMaterial = this.trackMat(
      createStylizedWaterMaterial({
        shallowColor: 0x38bdf8,
        deepColor: 0x0284c7,
        foamColor: 0xf0fdfa,
        causticColor: 0xfef08a,
        opacity: 0.88,
        innerRadius: 0.05,
        outerRadius: 1.70,
      })
    );

    this.cascadeMaterial = this.trackMat(
      createStylizedWaterfallMaterial({
        speed: 3.2,
        opacity: 0.88,
      })
    );

    this.jetMaterial = this.trackMat(
      createStylizedWaterfallMaterial({
        speed: 4.5,
        opacity: 0.92,
      })
    );

    // 2. Build Hydrodynamic Meshes
    this.buildLowerPoolSurface();
    this.buildUpperPoolSurface();
    this.buildOverflowCascade();
    this.buildCentralGeyser();
    this.buildParabolicJets();
  }

  private trackGeo<T extends THREE.BufferGeometry>(geo: T): T {
    this.geometries.push(geo);
    return geo;
  }

  private trackMat<T extends THREE.Material>(mat: T): T {
    this.materials.push(mat);
    return mat;
  }

  /**
   * Lower Basin Annular Water Surface:
   * Subdivided annular ring between the center pedestal (r=0.95) and the outer stone coping (r=4.05).
   * Dense radial and angular tessellation for smooth wave displacement.
   */
  private buildLowerPoolSurface() {
    // Annular ring with 64 segments and 16 rings for smooth vertex waves
    const ringGeo = this.trackGeo(new THREE.RingGeometry(0.95, 4.05, 64, 16));
    ringGeo.rotateX(-Math.PI / 2);
    ringGeo.computeVertexNormals();

    const poolMesh = new THREE.Mesh(ringGeo, this.poolMaterial);
    poolMesh.position.set(0, 0.86, 0);
    poolMesh.renderOrder = 2; // Render after opaque geometries for proper blending
    this.group.add(poolMesh);
  }

  /**
   * Upper Bowl Circular Water Surface:
   */
  private buildUpperPoolSurface() {
    const diskGeo = this.trackGeo(new THREE.CircleGeometry(1.70, 48));
    diskGeo.rotateX(-Math.PI / 2);
    diskGeo.computeVertexNormals();

    const upperMesh = new THREE.Mesh(diskGeo, this.upperPoolMaterial);
    upperMesh.position.set(0, 2.92, 0);
    upperMesh.renderOrder = 2;
    this.group.add(upperMesh);
  }

  /**
   * Overflow Waterfall Cascade Curtain:
   * Falling water sheet from the upper bowl coping (r=1.85, y=2.92) to lower pool (r=2.08, y=0.88).
   */
  private buildOverflowCascade() {
    // Frustum cylinder representing the curtain of falling water
    const curtainGeo = this.trackGeo(
      new THREE.CylinderGeometry(1.85, 2.10, 2.04, 48, 16, true)
    );
    const curtainMesh = new THREE.Mesh(curtainGeo, this.cascadeMaterial);
    curtainMesh.position.set(0, 1.90, 0);
    curtainMesh.renderOrder = 3;
    this.group.add(curtainMesh);

    // Splash impact ring in the lower pool where the cascade lands
    const splashRingGeo = this.trackGeo(new THREE.RingGeometry(1.95, 2.30, 48));
    splashRingGeo.rotateX(-Math.PI / 2);
    splashRingGeo.computeVertexNormals();
    const splashMesh = new THREE.Mesh(splashRingGeo, this.cascadeMaterial);
    splashMesh.position.set(0, 0.875, 0);
    splashMesh.renderOrder = 4;
    this.group.add(splashMesh);
  }

  /**
   * Monumental Central Geyser Spout:
   * Vertical column shooting up from the center bowl with core jet and outer spray veil.
   */
  private buildCentralGeyser() {
    // 1. Core vertical jet
    const coreJetGeo = this.trackGeo(new THREE.CylinderGeometry(0.12, 0.28, 3.2, 16, 12, true));
    const coreJet = new THREE.Mesh(coreJetGeo, this.jetMaterial);
    coreJet.position.set(0, 4.45, 0);
    coreJet.renderOrder = 3;
    this.group.add(coreJet);

    // 2. Outer spray veil / flared plume
    const veilGeo = this.trackGeo(new THREE.CylinderGeometry(0.35, 0.15, 2.4, 16, 8, true));
    const veil = new THREE.Mesh(veilGeo, this.jetMaterial);
    veil.position.set(0, 4.10, 0);
    veil.renderOrder = 4;
    this.group.add(veil);

    // 3. Crest crown splash
    const crownGeo = this.trackGeo(new THREE.SphereGeometry(0.32, 12, 12));
    const crown = new THREE.Mesh(crownGeo, this.jetMaterial);
    crown.position.set(0, 6.05, 0);
    crown.scale.set(1.4, 0.8, 1.4);
    crown.renderOrder = 4;
    this.group.add(crown);
  }

  /**
   * 8 Stylized Parabolic Arched Water Jets:
   * Arcing outward from the pedestal (y=2.35) and landing gracefully into the lower pool (y=0.88, r=3.35).
   */
  private buildParabolicJets() {
    const numJets = 8;
    const innerR = 1.12;
    const startY = 2.35;
    const apexR = 2.30;
    const apexY = 3.35;
    const splashR = 3.35;
    const splashY = 0.875;

    for (let i = 0; i < numJets; i++) {
      const angle = (i / numJets) * Math.PI * 2;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);

      // Define 3D Parabolic Curve
      const p0 = new THREE.Vector3(innerR * cosA, startY, innerR * sinA);
      const p1 = new THREE.Vector3(apexR * cosA, apexY, apexR * sinA);
      const p2 = new THREE.Vector3(splashR * cosA, splashY, splashR * sinA);

      const curve = new THREE.QuadraticBezierCurve3(p0, p1, p2);
      const tubeGeo = this.trackGeo(new THREE.TubeGeometry(curve, 28, 0.048, 8, false));

      const jetMesh = new THREE.Mesh(tubeGeo, this.jetMaterial);
      jetMesh.renderOrder = 3;
      this.group.add(jetMesh);

      // Splash ripple ring at landing position
      const splashGeo = this.trackGeo(new THREE.RingGeometry(0.04, 0.32, 16));
      splashGeo.rotateX(-Math.PI / 2);
      splashGeo.computeVertexNormals();
      const splash = new THREE.Mesh(splashGeo, this.cascadeMaterial);
      splash.position.set(p2.x, splashY + 0.005, p2.z);
      splash.renderOrder = 4;
      this.group.add(splash);
    }
  }

  /**
   * Real-time update step for animated waves, caustics, cascades, and lighting.
   */
  public update(dt: number, sunDir?: THREE.Vector3) {
    this.totalTime += dt;

    // Update pool shaders
    this.poolMaterial.uniforms.uTime.value = this.totalTime;
    this.upperPoolMaterial.uniforms.uTime.value = this.totalTime;
    this.cascadeMaterial.uniforms.uTime.value = this.totalTime;
    this.jetMaterial.uniforms.uTime.value = this.totalTime;

    if (sunDir) {
      StylizedWater._tempSunDir.copy(sunDir).normalize();
      this.poolMaterial.uniforms.uSunDirection.value.copy(StylizedWater._tempSunDir);
      this.upperPoolMaterial.uniforms.uSunDirection.value.copy(StylizedWater._tempSunDir);
      this.cascadeMaterial.uniforms.uSunDirection.value.copy(StylizedWater._tempSunDir);
      this.jetMaterial.uniforms.uSunDirection.value.copy(StylizedWater._tempSunDir);
    }
  }

  /**
   * Complete zero-leak disposal of all geometries and materials.
   */
  public dispose() {
    for (const g of this.geometries) g.dispose();
    for (const m of this.materials) m.dispose();
    this.geometries = [];
    this.materials = [];
  }
}
