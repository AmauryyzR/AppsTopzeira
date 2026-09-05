import * as THREE from 'three';

export interface GrassFieldOptions {
  count?: number;
  radius?: number;
  rootColor?: THREE.ColorRepresentation;
  midColor?: THREE.ColorRepresentation;
  tipColor?: THREE.ColorRepresentation;
  shadowColor?: THREE.ColorRepresentation;
  sunColor?: THREE.ColorRepresentation;
  skyColor?: THREE.ColorRepresentation;
  windSpeed?: number;
}

/**
 * AAA-Grade Cel-Shaded Living Instanced Grass Field (Genshin Impact & Zelda: Breath of the Wild style).
 * - Rendered with THREE.InstancedMesh in a single high-performance WebGL2 draw call.
 * - Double-blade tapered tufts with 4 height segments for organic bending curves.
 * - Procedural traveling wind wave simulation with harmonic flutter and broad gusts.
 * - Real-time Player Character interaction: grass parts and bends smoothly away from the player.
 * - 3-stop vertical anime gradient (deep emerald root -> vibrant meadow -> sunny golden lime tip).
 * - Cel-shading lighting, translucent backlighting bounce, rim lighting, and traveling wind specular sheen.
 * - Strict zero-leak memory management (tracked geometries, instanced attributes, and materials).
 */
export class GrassField {
  public readonly mesh: THREE.InstancedMesh;
  public readonly geometry: THREE.BufferGeometry;
  public readonly material: THREE.ShaderMaterial;

  private uniforms: {
    uTime: { value: number };
    uPlayerPosition: { value: THREE.Vector3 };
    uWindDirection: { value: THREE.Vector2 };
    uWindSpeed: { value: number };
    uRootColor: { value: THREE.Color };
    uMidColor: { value: THREE.Color };
    uTipColor: { value: THREE.Color };
    uShadowColor: { value: THREE.Color };
    uSunColor: { value: THREE.Color };
    uSunDirection: { value: THREE.Vector3 };
    uSkyColor: { value: THREE.Color };
  };

  private totalTime = 0;

  constructor(options: GrassFieldOptions = {}) {
    const targetCount = options.count ?? 78000;
    const parkRadius = options.radius ?? 68;

    // 1. Build Tapered Stylized Tuft Geometry (3 crossed blades with 4 vertical segments for lush density)
    this.geometry = this.createTuftGeometry();

    // 2. Setup Custom GLSL Shader Material with Wind & Interaction
    this.uniforms = {
      uTime: { value: 0 },
      uPlayerPosition: { value: new THREE.Vector3(0, -999, 0) },
      uWindDirection: { value: new THREE.Vector2(0.85, 0.52).normalize() },
      uWindSpeed: { value: options.windSpeed ?? 1.35 },
      uRootColor: { value: new THREE.Color(options.rootColor ?? 0x14532d) }, // Deep emerald / jade root (#14532d)
      uMidColor: { value: new THREE.Color(options.midColor ?? 0x22c55e) },   // Vibrant anime meadow green
      uTipColor: { value: new THREE.Color(options.tipColor ?? 0xa3e635) },   // Sunny golden lime tip (#a3e635 / #86efac)
      uShadowColor: { value: new THREE.Color(options.shadowColor ?? 0x14422b) }, // Rich foliage shadow tone
      uSunColor: { value: new THREE.Color(options.sunColor ?? 0xfff6e6) },   // Warm sun light
      uSunDirection: { value: new THREE.Vector3(45, 65, 35).normalize() },
      uSkyColor: { value: new THREE.Color(options.skyColor ?? 0xdbeafe) },   // Sky ambient reflection
    };

    this.material = this.createShaderMaterial();

    // 3. Intelligent Distribution & Instance Matrix Setup
    const positions = this.generateGrassPositions(targetCount, parkRadius);
    const actualCount = positions.length;

    this.mesh = new THREE.InstancedMesh(this.geometry, this.material, actualCount);
    this.mesh.frustumCulled = false; // Prevent culling when looking across the wide field

    const windPhases = new Float32Array(actualCount);
    const variations = new Float32Array(actualCount);

    const dummy = new THREE.Object3D();

    for (let i = 0; i < actualCount; i++) {
      const [x, z] = positions[i];

      // Random yaw rotation (0 to 2pi) + natural micro-lean pitch/roll
      const yaw = Math.random() * Math.PI * 2;
      const pitch = (Math.random() - 0.5) * 0.16;
      const roll = (Math.random() - 0.5) * 0.16;

      // Natural height and width scale variation (0.72 to 1.25)
      const baseScale = 0.72 + Math.random() * 0.53;
      const scaleY = baseScale * (0.88 + Math.random() * 0.24);
      const scaleXZ = baseScale * (0.92 + Math.random() * 0.16);

      dummy.position.set(x, 0, z);
      dummy.rotation.set(pitch, yaw, roll, 'YXZ');
      dummy.scale.set(scaleXZ, scaleY, scaleXZ);
      dummy.updateMatrix();

      this.mesh.setMatrixAt(i, dummy.matrix);

      windPhases[i] = Math.random() * Math.PI * 2;
      variations[i] = Math.random();
    }

    this.geometry.setAttribute('aWindPhase', new THREE.InstancedBufferAttribute(windPhases, 1));
    this.geometry.setAttribute('aVariation', new THREE.InstancedBufferAttribute(variations, 1));
    this.mesh.instanceMatrix.needsUpdate = true;
  }

  /**
   * Builds stylized tuft geometry with 2 crossed curved tapered blades.
   * Each blade has 4 vertical segments (5 rows of vertices) allowing smooth bending.
   */
  private createTuftGeometry(): THREE.BufferGeometry {
    const vertices: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    const addBlade = (
      angleY: number,
      height: number,
      baseWidth: number,
      leanAmount: number,
      xOffset: number,
      zOffset: number
    ) => {
      const startIndex = vertices.length / 3;
      const cosA = Math.cos(angleY);
      const sinA = Math.sin(angleY);

      // 4 vertical segments -> 5 height rows (y factor: 0.0, 0.22, 0.46, 0.72, 1.0)
      const rowFactors = [0.0, 0.22, 0.46, 0.72, 1.0];
      const widthFactors = [1.0, 0.86, 0.65, 0.38, 0.0];
      const leanFactors = [0.0, 0.12, 0.35, 0.68, 1.0];

      for (let r = 0; r < 5; r++) {
        const y = rowFactors[r] * height;
        const hw = (widthFactors[r] * baseWidth) / 2;
        const localZ = leanFactors[r] * leanAmount;
        const v = rowFactors[r];

        if (r === 4) {
          // Tip vertex (single point)
          const localX = 0;
          const wx = xOffset + localX * cosA - localZ * sinA;
          const wz = zOffset + localX * sinA + localZ * cosA;

          vertices.push(wx, y, wz);
          normals.push(sinA * 0.3, 0.4, cosA * 0.3);
          uvs.push(0.5, 1.0);
        } else {
          // Left and Right vertices
          // Left (-hw)
          const lx = -hw;
          const wlx = xOffset + lx * cosA - localZ * sinA;
          const wlz = zOffset + lx * sinA + localZ * cosA;
          vertices.push(wlx, y, wlz);
          normals.push(sinA * 0.2, 0.2, cosA * 0.9);
          uvs.push(0.0, v);

          // Right (+hw)
          const rx = hw;
          const wrx = xOffset + rx * cosA - localZ * sinA;
          const wrz = zOffset + rx * sinA + localZ * cosA;
          vertices.push(wrx, y, wrz);
          normals.push(sinA * 0.2, 0.2, cosA * 0.9);
          uvs.push(1.0, v);
        }
      }

      // Quads from row 0 to row 3:
      // Row r left = startIndex + r * 2, right = startIndex + r * 2 + 1
      for (let r = 0; r < 3; r++) {
        const bL = startIndex + r * 2;
        const bR = bL + 1;
        const tL = bL + 2;
        const tR = bL + 3;

        indices.push(bL, bR, tL);
        indices.push(bR, tR, tL);
      }

      // Top triangle to tip (row 3 to row 4 tip)
      const row3L = startIndex + 6;
      const row3R = startIndex + 7;
      const tipIndex = startIndex + 8;
      indices.push(row3L, row3R, tipIndex);
    };

    // Blade 1: Main tall blade
    addBlade(0, 0.74, 0.15, 0.13, 0, 0);

    // Blade 2: Secondary crossed blade angled at ~56 degrees
    addBlade(0.98, 0.62, 0.13, 0.11, 0.02, -0.01);

    // Blade 3: Tertiary crossed blade angled at ~-62 degrees for lush 3D volume
    addBlade(-1.08, 0.52, 0.12, 0.10, -0.02, 0.015);

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();

    return geo;
  }

  /**
   * Generates candidate positions across the park with intelligent exclusion
   * of the central plaza, stone paths, running ring, obstacle course, trees, and benches.
   */
  private generateGrassPositions(targetCount: number, radius: number): [number, number][] {
    const positions: [number, number][] = [];

    // 28 Sculpted Tree Trunks (Oak, Sakura, Pine) across park
    const treePositions: [number, number][] = [
      // Quadrant 1 (North-East)
      [16, 16], [28, 12], [22, 26], [34, 30], [12, 34],
      // Quadrant 2 (North-West)
      [-16, 18], [-26, 14], [-20, 28], [-32, 26], [-14, 36],
      // Quadrant 3 (South-East)
      [18, -16], [26, -22], [14, -30], [30, -32], [36, -14],
      // Quadrant 4 (South-West)
      [-18, -18], [-28, -20], [-16, -32], [-32, -30], [-34, -14],
      // Outer perimeter groves
      [48, 7], [-48, 7], [7, 48], [-7, -48],
      [45, 45], [-45, 45], [45, -45], [-45, -45],
    ];

    // Lamp posts to exclude (radius ~0.8m)
    const lampPositions: [number, number][] = [
      [8, 8], [-8, 8], [8, -8], [-8, -8],
      [2.4, 28], [-2.4, -28], [26, 2.4], [-24, 2.4],
    ];

    // Stepping Stones (Tobi-Ishi) leading to Zen Garden
    const zenSteppingStones: [number, number, number][] = [
      [18 - 5.5, 20 + 4.2, 0.95],
      [18 - 4.2, 20 + 5.8, 1.00],
      [18 - 2.6, 20 + 6.9, 0.98],
      [18 - 0.8, 20 + 7.5, 1.05],
      [18 + 1.2, 20 + 7.8, 1.00],
      [18 + 3.1, 20 + 7.2, 0.96],
      [18 + 4.8, 20 + 6.0, 1.05],
      [18 + 6.2, 20 + 4.4, 1.00],
    ];

    const isExcluded = (x: number, z: number): boolean => {
      const distCenter = Math.hypot(x, z);

      // 1. Outside park boundary
      if (distCenter > radius) return true;

      // 2. Central Stone Plaza (radius ~15.2m with stone curb chamfers)
      if (distCenter < 15.2) return true;

      // 3. North-South Sandstone Path & Stone Curbs
      if (Math.abs(x) < 2.65 && Math.abs(z) <= 61.0) return true;

      // 4. East-West Sandstone Path & Stone Curbs
      if (Math.abs(z) < 2.65 && Math.abs(x) <= 61.0) return true;

      // 5. Outer Circular Jogging Ring (radius 37.4m to 43.6m)
      if (distCenter >= 37.4 && distCenter <= 43.6) return true;

      // 6. Authentic Zen Rock Garden (Karesansui) & Stepping Pillars:
      // Sand bed + curbs (enlarged Zen Garden): X in [13.0, 31.0], Z in [14.0, 26.0]
      if (x >= 13.0 && x <= 31.0 && z >= 14.0 && z <= 26.0) return true;

      // 7. Stepping Stones (Tobi-Ishi) around Zen Garden
      for (let i = 0; i < zenSteppingStones.length; i++) {
        const [sx, sz, sr] = zenSteppingStones[i];
        if (Math.hypot(x - sx, z - sz) < sr) return true;
      }

      // 8. Obstacle Course: Wooden Walkway Bridge in South-West
      if (x >= -26.5 && x <= -21.5 && z >= -32.0 && z <= -16.0) return true;

      // 9. West Scenic Canal & Taiko Bashi Arched Bridge (x ~ -34m, z ~ -17m to +17m)
      // Completely excludes grass from growing inside water canal and stone embankments
      if (x >= -38.5 && x <= -29.5 && Math.abs(z) <= 17.5) return true;

      // 10. East Zen Pagoda Gazebo Platform (x = 36m, z = 0m, radius 4.8m)
      if (Math.hypot(x - 36, z) < 4.8) return true;

      // 11. South Torii Gate Apron & Flanking Lanterns (z = 42m, x = 0m)
      if (Math.abs(x) < 4.6 && Math.abs(z - 42) < 3.2) return true;

      // 12. Tree trunks & root flares
      for (let i = 0; i < treePositions.length; i++) {
        const [tx, tz] = treePositions[i];
        if (Math.hypot(x - tx, z - tz) < 1.20) return true;
      }

      // 13. Street Lamps
      for (let i = 0; i < lampPositions.length; i++) {
        const [lx, lz] = lampPositions[i];
        if (Math.hypot(x - lx, z - lz) < 0.8) return true;
      }

      return false;
    };

    // Stratified jittered grid sampling for even, ultra-dense natural distribution
    const gridSize = 380;
    const step = (radius * 2) / gridSize;

    for (let ix = 0; ix < gridSize; ix++) {
      for (let iz = 0; iz < gridSize; iz++) {
        const jitterX = (Math.random() - 0.5) * 0.88 * step;
        const jitterZ = (Math.random() - 0.5) * 0.88 * step;
        const x = -radius + (ix + 0.5) * step + jitterX;
        const z = -radius + (iz + 0.5) * step + jitterZ;

        if (!isExcluded(x, z)) {
          positions.push([x, z]);
        }
      }
    }

    // Adjust to exact target count
    if (positions.length > targetCount) {
      // Shuffle slightly and slice to target
      for (let i = positions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = positions[i];
        positions[i] = positions[j];
        positions[j] = temp;
      }
      return positions.slice(0, targetCount);
    }

    // If slightly fewer, add additional random samples in valid regions
    let attempts = 0;
    while (positions.length < targetCount && attempts < 100000) {
      attempts++;
      const angle = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * radius;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      if (!isExcluded(x, z)) {
        positions.push([x, z]);
      }
    }

    return positions;
  }

  private createShaderMaterial(): THREE.ShaderMaterial {
    const vertexShader = /* glsl */ `
      uniform float uTime;
      uniform vec3 uPlayerPosition;
      uniform vec2 uWindDirection;
      uniform float uWindSpeed;

      attribute float aWindPhase;
      attribute float aVariation;

      varying vec3 vWorldPosition;
      varying vec3 vNormal;
      varying vec2 vUv;
      varying float vHeightFactor;
      varying float vWindIntensity;
      varying float vVariation;

      #include <fog_pars_vertex>

      void main() {
        vUv = uv;
        vHeightFactor = clamp(uv.y, 0.0, 1.0);
        vVariation = aVariation;

        // 1. Instance and root world positions
        #ifdef USE_INSTANCING
          vec4 instancePos = instanceMatrix * vec4(position, 1.0);
          vec4 rootLocal = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
        #else
          vec4 instancePos = vec4(position, 1.0);
          vec4 rootLocal = vec4(0.0, 0.0, 0.0, 1.0);
        #endif

        vec4 worldPos = modelMatrix * instancePos;
        vec3 worldRoot = (modelMatrix * rootLocal).xyz;

        // 2. Procedural Traveling Wind Wave Simulation
        // Deformation weighted by vertex height: pow(heightFactor, 1.4) keeps roots firmly planted
        float bendWeight = pow(vHeightFactor, 1.4);

        vec2 windDir = normalize(uWindDirection);

        // Traveling waves across terrain
        float waveCoord1 = dot(worldRoot.xz, windDir * 0.11) - uTime * (uWindSpeed * 1.8);
        float waveCoord2 = dot(worldRoot.xz, vec2(-windDir.y, windDir.x) * 0.16) - uTime * (uWindSpeed * 2.5) + aWindPhase;

        float wave1 = sin(waveCoord1);
        float wave2 = sin(waveCoord2);

        // Broad rolling gust wave
        float gustCoord = dot(worldRoot.xz, windDir * 0.038) - uTime * (uWindSpeed * 0.9);
        float gust = smoothstep(-0.25, 0.75, sin(gustCoord));

        float windStrength = (wave1 * 0.65 + wave2 * 0.25 + 0.30) * (0.65 + gust * 0.55);
        vWindIntensity = windStrength;

        // Primary wind displacement along wind vector with natural downward tip dip
        vec3 windDisplacement = vec3(windDir.x, -0.24, windDir.y) * (windStrength * 0.36 * bendWeight);

        // 3. Real-Time Player Interaction
        // When player walks through the grass, blades smoothly part and bend away from the player
        vec2 toBlade = worldPos.xz - uPlayerPosition.xz;
        float distToPlayer = length(toBlade);
        float pushRadius = 2.2;
        vec3 playerDisplacement = vec3(0.0);

        if (distToPlayer < pushRadius) {
          float pushFactor = 1.0 - smoothstep(0.0, pushRadius, distToPlayer);
          pushFactor = pushFactor * pushFactor; // Smooth non-linear spring push
          float vertDistY = abs(worldPos.y - uPlayerPosition.y);
          float heightAtten = 1.0 - smoothstep(0.4, 2.2, vertDistY);
          float finalPush = pushFactor * heightAtten;
          // Soft normalization within the player foot core (0.42m) eliminates opposite-direction vertex tearing,
          // preventing blades underfoot from expanding into abnormally giant polygons while preserving full distortion outside.
          vec2 pushDir = toBlade / max(distToPlayer, 0.42);
          playerDisplacement = vec3(pushDir.x * 0.88, -0.55, pushDir.y * 0.88) * (finalPush * bendWeight);
        }

        // Apply physics displacements to world position
        worldPos.xyz += windDisplacement + playerDisplacement;
        vWorldPosition = worldPos.xyz;

        // 4. World Normal Calculation with dynamic bend response
        #ifdef USE_INSTANCING
          vec3 transformedNormal = normalize((modelMatrix * instanceMatrix * vec4(normal, 0.0)).xyz);
        #else
          vec3 transformedNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
        #endif

        transformedNormal = normalize(transformedNormal + (windDisplacement + playerDisplacement) * 0.75);
        vNormal = transformedNormal;

        vec4 mvPosition = viewMatrix * worldPos;
        gl_Position = projectionMatrix * mvPosition;

        #include <fog_vertex>
      }
    `;

    const fragmentShader = /* glsl */ `
      uniform vec3 uRootColor;
      uniform vec3 uMidColor;
      uniform vec3 uTipColor;
      uniform vec3 uShadowColor;
      uniform vec3 uSunColor;
      uniform vec3 uSunDirection;
      uniform vec3 uSkyColor;

      varying vec3 vWorldPosition;
      varying vec3 vNormal;
      varying vec2 vUv;
      varying float vHeightFactor;
      varying float vWindIntensity;
      varying float vVariation;

      #include <fog_pars_fragment>

      void main() {
        // 1. 3-Stop Stylized Anime Vertical Gradient (Deep Forest Emerald -> Meadow Green -> Sunny Golden Lime)
        vec3 col = mix(uRootColor, uMidColor, smoothstep(0.0, 0.44, vHeightFactor));
        col = mix(col, uTipColor, smoothstep(0.38, 1.0, vHeightFactor));

        // Subtle per-instance hue variation across meadow
        col = mix(col, col * vec3(1.10, 1.06, 0.90), (vVariation - 0.5) * 0.40);

        // 2. Cel-Shaded Anime Lighting Pipeline
        vec3 N = normalize(vNormal);
        if (!gl_FrontFacing) {
          N = -N;
        }

        vec3 L = normalize(uSunDirection);
        vec3 V = normalize(cameraPosition - vWorldPosition);

        // Half-lambert diffuse
        float NdotL = dot(N, L);
        float halfLambert = clamp(NdotL * 0.5 + 0.5, 0.0, 1.0);

        // Translucent backlit glow (sunlight filtering through grass blades)
        float backlight = max(0.0, dot(-V, L)) * 0.45 * vHeightFactor;

        // Discrete stepped anime lighting bands
        float celBands = smoothstep(0.32, 0.38, halfLambert) * 0.45 + smoothstep(0.60, 0.68, halfLambert) * 0.55;

        // Sky ambient diffuse reflection on tips
        float skyBounce = max(0.0, N.y) * 0.26;

        // Compose final cel-shaded color with stylized shadow tint
        vec3 shadowTone = mix(col * uShadowColor, col * 0.72, 0.42);
        vec3 litTone = col * uSunColor;
        vec3 finalColor = mix(shadowTone, litTone, celBands);
        finalColor += col * uSkyColor * skyBounce;

        // Photon Shaders Subsurface Scattering (SSS) on grass blade tips
        float sunBacklight = pow(clamp(dot(-V, L) * 0.52 + 0.48, 0.0, 1.0), 3.4);
        float sssTranslucency = sunBacklight * smoothstep(0.28, 1.0, vHeightFactor) * 0.92;
        vec3 bladeSSSTint = mix(uTipColor, vec3(1.0, 0.96, 0.42), 0.55);
        finalColor += bladeSSSTint * (sssTranslucency * uSunColor * 1.6);

        // 3. Anime Rim Light (Fresnel edge glow with solar boost)
        float NdotV = max(0.0, dot(N, V));
        float rim = pow(1.0 - NdotV, 3.2) * (0.35 + 0.65 * max(0.0, dot(L, -V)));
        vec3 rimTone = vec3(0.96, 1.0, 0.80) * (0.50 * pow(vHeightFactor, 1.2));
        finalColor += rimTone * rim;

        // 4. Traveling Wind Specular Sheen & Sun Glint (Photon Shaders feature)
        vec3 H = normalize(L + V);
        float bladeSpec = pow(max(0.0, dot(N, H)), 28.0) * smoothstep(0.35, 1.0, vHeightFactor);
        finalColor += uSunColor * (bladeSpec * (0.35 + 0.45 * vWindIntensity));

        // Rolling wind gust crest shimmer across meadow
        float windSheen = smoothstep(0.42, 0.90, vWindIntensity) * pow(vHeightFactor, 1.4);
        vec3 sheenTone = mix(vec3(0.90, 1.0, 0.70), uSunColor, 0.45);
        finalColor += sheenTone * (windSheen * 0.28);

        // 5. GTAO-Inspired Contact Occlusion & Multi-Bounce Soil Anchoring (Photon Shaders GTAO)
        float gtaoCurve = pow(vHeightFactor, 0.72);
        float rootOcclusion = smoothstep(0.01, 0.46, vHeightFactor) * gtaoCurve;
        // Damp humus/emerald contact tint in the crevices between blade roots
        vec3 rootSoilTint = vec3(0.07, 0.20, 0.10);
        finalColor = mix(rootSoilTint * (col * 0.9), finalColor, mix(0.35, 1.0, rootOcclusion));

        // 6. Fine White Glow Rim on Grass Tips (Genshin Meadow Shimmer)
        float fineGrassRim = smoothstep(0.75, 0.99, pow(1.0 - NdotV, 4.2)) * pow(vHeightFactor, 1.5);
        finalColor += vec3(0.98, 1.0, 0.92) * (fineGrassRim * 0.35);

        gl_FragColor = vec4(finalColor, 1.0);

        #include <fog_fragment>
      }
    `;

    const mergedUniforms = THREE.UniformsUtils.merge([
      THREE.UniformsLib.fog,
      this.uniforms,
    ]);

    this.uniforms = mergedUniforms as any;

    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: mergedUniforms,
      side: THREE.DoubleSide,
      fog: true,
      depthWrite: true,
    });
  }

  /**
   * Updates grass field simulation with delta time and character coordinates.
   */
  public update(dt: number, playerPosition: THREE.Vector3, sunPosition?: THREE.Vector3) {
    this.totalTime += dt;
    this.uniforms.uTime.value = this.totalTime;
    this.uniforms.uPlayerPosition.value.copy(playerPosition);

    if (this.material && this.material.uniforms) {
      if (this.material.uniforms.uTime) {
        this.material.uniforms.uTime.value = this.totalTime;
      }
      if (this.material.uniforms.uPlayerPosition) {
        this.material.uniforms.uPlayerPosition.value.copy(playerPosition);
      }
      if (sunPosition && this.material.uniforms.uSunDirection) {
        this.material.uniforms.uSunDirection.value.copy(sunPosition).normalize();
      }
    }

    if (sunPosition) {
      this.uniforms.uSunDirection.value.copy(sunPosition).normalize();
    }
  }

  /**
   * Complete memory deallocation of geometry, instanced buffers, and materials.
   */
  public dispose() {
    this.geometry.dispose();
    this.material.dispose();
    if (this.mesh.instanceMatrix) {
      this.mesh.instanceMatrix.dispose?.();
    }
  }
}
