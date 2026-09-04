import * as THREE from 'three';

export interface ToonMaterialOptions {
  color: THREE.ColorRepresentation;
  gradientBands?: 3 | 4 | 5 | number;
  gradientMap?: THREE.Texture;
  map?: THREE.Texture | null;
  bumpMap?: THREE.Texture | null;
  bumpScale?: number;
  normalMap?: THREE.Texture | null;
  rimColor?: THREE.ColorRepresentation;
  rimPower?: number;
  rimIntensity?: number;
  fineGlowColor?: THREE.ColorRepresentation;
  fineGlowIntensity?: number;
  fineGlowPower?: number;
  fineGlowMin?: number;
  fineGlowMax?: number;
  enableWindSway?: boolean;
  windStrength?: number;
  enableSSS?: boolean;
  sssColor?: THREE.ColorRepresentation;
  sssIntensity?: number;
  specularIntensity?: number;
  specularRoughness?: number;
  specularColor?: THREE.ColorRepresentation;
  shadowColor?: THREE.ColorRepresentation;
  shadowIntensity?: number;
  emissive?: THREE.ColorRepresentation;
  emissiveIntensity?: number;
  transparent?: boolean;
  opacity?: number;
  side?: THREE.Side;
  depthWrite?: boolean;
}

// Cached gradient textures to avoid redundant GPU memory allocations
const gradientTextureCache = new Map<number, THREE.DataTexture>();

/**
 * Dynamically generates a discrete stepped gradient map (1D DataTexture)
 * with NearestFilter for authentic Zelda: Breath of the Wild & Genshin Impact cel-shading bands.
 */
export function getDiscreteGradientMap(bands: number = 4): THREE.DataTexture {
  const clampedBands = Math.max(2, Math.min(8, Math.round(bands)));
  if (gradientTextureCache.has(clampedBands)) {
    return gradientTextureCache.get(clampedBands)!;
  }

  const width = 256;
  const data = new Uint8Array(width);

  // Smooth antialiased cel-shading steps (Brawl Stars / Genshin / BotW style)
  for (let i = 0; i < width; i++) {
    const u = i / (width - 1);
    const bandStep = u * clampedBands;
    const bandIndex = Math.min(clampedBands - 1, Math.floor(bandStep));
    const bandFrac = bandStep - bandIndex;

    // Silky smoothstep transition over boundary to eliminate banding/faceting
    const edge = THREE.MathUtils.smoothstep(bandFrac, 0.70, 1.0);
    const currLuma = (bandIndex + 1) / clampedBands;
    const nextLuma = Math.min(clampedBands, bandIndex + 2) / clampedBands;
    const lumaRatio = THREE.MathUtils.lerp(currLuma, nextLuma, edge);

    const val = Math.round(Math.pow(lumaRatio, 0.95) * 255);
    data[i] = Math.max(35, Math.min(255, val));
  }

  const texture = new THREE.DataTexture(
    data,
    width,
    1,
    THREE.RedFormat,
    THREE.UnsignedByteType
  );
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;

  gradientTextureCache.set(clampedBands, texture);
  return texture;
}

export type ToonPresetName =
  | 'grass'
  | 'stone'
  | 'sandstone'
  | 'wood'
  | 'iron'
  | 'foliage'
  | 'foliagePine'
  | 'cherryBlossom'
  | 'water'
  | 'amber';

/**
 * Curated Ghibli / Zelda: Breath of the Wild / Genshin Impact color palettes.
 * Features stylized shadows (soft sky-lavender tints) and edge rim highlights.
 */
export const TOON_PRESETS: Record<ToonPresetName, ToonMaterialOptions> = {
  // 1. Grass: Lush emerald green, warm sunlight rim, harmonious deep jade shadow
  grass: {
    color: 0x4db848,
    gradientBands: 4,
    rimColor: 0xe0f2fe, // Soft morning sky rim
    rimPower: 3.5,
    rimIntensity: 0.45,
    shadowColor: 0x226b48, // Forest green anime shadow (no dirty black)
    shadowIntensity: 0.50,
  },

  // 2. Stone: Polished marble/granite with soft sky diffuse bounce and pearl rim
  stone: {
    color: 0x94a3b8, // Clean slate-granite grey (Genshin / BotW stone)
    gradientBands: 4,
    rimColor: 0xe2e8f0, // Subtle soft specular rim at grazing angles
    rimPower: 4.2,
    rimIntensity: 0.25,
    specularIntensity: 0.22, // Photon Shaders polished stone sheen
    specularRoughness: 36.0,
    specularColor: 0xe2e8f0,
    shadowColor: 0x475569, // Rich slate blue anime shadow
    shadowIntensity: 0.50,
  },

  // 3. Sandstone: Welcoming sun-warmed path stone (Gerudo/Hyrule style)
  sandstone: {
    color: 0xd4b483, // Warm golden sandstone path
    gradientBands: 4,
    rimColor: 0xfef3c7,
    rimPower: 4.0,
    rimIntensity: 0.20,
    specularIntensity: 0.16, // Subtle warm path glint
    specularRoughness: 26.0,
    specularColor: 0xfef3c7,
    shadowColor: 0x92613b, // Warm terracotta shadow
    shadowIntensity: 0.45,
  },

  // 4. Wood: Rich cedar wood with visible warm chamfer edge rim
  wood: {
    color: 0x935b37, // Polished warm cedar
    gradientBands: 3,
    rimColor: 0xfde68a, // Sun catch rim on wooden edges
    rimPower: 3.6,
    rimIntensity: 0.42,
    specularIntensity: 0.26, // Polished cedar satin gloss
    specularRoughness: 42.0,
    specularColor: 0xfde68a,
    shadowColor: 0x542c19, // Deep umber shadow
    shadowIntensity: 0.55,
  },

  // 5. Iron: Satin wrought iron with stark silver rim
  iron: {
    color: 0x27303f, // Deep gunmetal slate
    gradientBands: 4,
    rimColor: 0xe2e8f0, // Crisp silver edge highlight
    rimPower: 2.4,
    rimIntensity: 0.95,
    specularIntensity: 0.70, // Crisp metallic specular glint
    specularRoughness: 55.0,
    specularColor: 0xf1f5f9,
    shadowColor: 0x181f2a, // Deep midnight shadow
    shadowIntensity: 0.65,
  },

  // 6. Foliage: Vibrant broadleaf forest canopy cel-shaded
  foliage: {
    color: 0x2a9d56, // Lush Zelda BotW forest green
    gradientBands: 3,
    rimColor: 0x86efac, // Bright leaf translucency rim
    rimPower: 3.4,
    rimIntensity: 0.35,
    fineGlowColor: 0xffffff, // Crisp white Genshin glow rim (razor-thin edge)
    fineGlowIntensity: 0.70,
    fineGlowPower: 6.2,
    fineGlowMin: 0.86,
    fineGlowMax: 0.995,
    enableSSS: true, // Photon Shaders leaf translucency
    sssColor: 0xa7f3d0,
    sssIntensity: 0.42,
    shadowColor: 0x16532d, // Deep pine shadow
    shadowIntensity: 0.55,
  },

  // Pine / Evergreen variant
  foliagePine: {
    color: 0x1e7846, // Cool pine green
    gradientBands: 3,
    rimColor: 0xa7f3d0,
    rimPower: 3.5,
    rimIntensity: 0.30,
    fineGlowColor: 0xffffff,
    fineGlowIntensity: 0.60,
    fineGlowPower: 6.5,
    fineGlowMin: 0.88,
    fineGlowMax: 0.995,
    enableSSS: true,
    sssColor: 0x86efac,
    sssIntensity: 0.35,
    shadowColor: 0x0f3d23,
    shadowIntensity: 0.60,
  },

  // Cherry Blossom (Sakura)
  cherryBlossom: {
    color: 0xf472b6, // Vibrant sakura blossom pink
    gradientBands: 4,
    rimColor: 0xffedd5, // Soft peach blossom rim
    rimPower: 3.2,
    rimIntensity: 0.32,
    fineGlowColor: 0xffffff,
    fineGlowIntensity: 0.65,
    fineGlowPower: 6.0,
    fineGlowMin: 0.86,
    fineGlowMax: 0.995,
    enableSSS: true,
    sssColor: 0xfecdd3,
    sssIntensity: 0.45,
    shadowColor: 0xdb2777, // Rich magenta petal shadow
    shadowIntensity: 0.48,
  },

  // Water: Shimmering anime fountain pool
  water: {
    color: 0x38bdf8,
    gradientBands: 3,
    rimColor: 0xffffff,
    rimPower: 2.2,
    rimIntensity: 0.85,
    specularIntensity: 0.95,
    specularRoughness: 80.0,
    specularColor: 0xffffff,
    shadowColor: 0x0284c7,
    shadowIntensity: 0.40,
    transparent: true,
    opacity: 0.82,
  },

  // Amber / Playground Brights
  amber: {
    color: 0xf59e0b, // Warm anime obstacle amber
    gradientBands: 4,
    rimColor: 0xfef08a,
    rimPower: 3.0,
    rimIntensity: 0.55,
    shadowColor: 0xb45309,
    shadowIntensity: 0.50,
  },
};

/**
 * Creates an AAA-grade anime cel-shaded MeshToonMaterial with:
 * - Quantized gradient lighting (discrete cel bands)
 * - Stylized anime shadows (tinted with lavender/sky hues instead of dull black)
 * - Anime silhouette rim lighting (Fresnel glow that pops against the sky)
 */
export function createToonMaterial(options: ToonMaterialOptions): THREE.MeshToonMaterial {
  const bands = options.gradientBands || 4;
  const gradientMap = options.gradientMap || getDiscreteGradientMap(bands);

  const mat = new THREE.MeshToonMaterial({
    color: options.color,
    gradientMap,
    map: options.map ?? null,
    bumpMap: options.bumpMap ?? null,
    bumpScale: options.bumpScale !== undefined ? options.bumpScale : 1.0,
    normalMap: options.normalMap ?? null,
    emissive: options.emissive || 0x000000,
    emissiveIntensity: options.emissiveIntensity !== undefined ? options.emissiveIntensity : 1.0,
    transparent: options.transparent ?? false,
    opacity: options.opacity !== undefined ? options.opacity : 1.0,
    side: options.side ?? THREE.FrontSide,
    depthWrite: options.depthWrite ?? true,
    dithering: true,
  });

  const rimColor = new THREE.Color(options.rimColor !== undefined ? options.rimColor : 0xdbeafe);
  const rimPower = options.rimPower !== undefined ? options.rimPower : 3.2;
  const rimIntensity = options.rimIntensity !== undefined ? options.rimIntensity : 0.5;

  const shadowColor = new THREE.Color(options.shadowColor !== undefined ? options.shadowColor : 0x64748b);
  const shadowIntensity = options.shadowIntensity !== undefined ? options.shadowIntensity : 0.45;

  const fineGlowColor = new THREE.Color(options.fineGlowColor !== undefined ? options.fineGlowColor : 0xffffff);
  const fineGlowIntensity = options.fineGlowIntensity !== undefined ? options.fineGlowIntensity : 0.0;
  const fineGlowPower = options.fineGlowPower !== undefined ? options.fineGlowPower : 4.2;
  const fineGlowMin = options.fineGlowMin !== undefined ? options.fineGlowMin : 0.72;
  const fineGlowMax = options.fineGlowMax !== undefined ? options.fineGlowMax : 0.98;

  const enableWindSway = options.enableWindSway ?? false;
  const windStrength = options.windStrength !== undefined ? options.windStrength : 1.0;

  const enableSSS = options.enableSSS ?? false;
  const sssColor = new THREE.Color(options.sssColor !== undefined ? options.sssColor : 0xa7f3d0);
  const sssIntensity = options.sssIntensity !== undefined ? options.sssIntensity : (enableSSS ? 0.48 : 0.0);

  const specularIntensity = options.specularIntensity !== undefined ? options.specularIntensity : 0.0;
  const specularRoughness = options.specularRoughness !== undefined ? options.specularRoughness : 32.0;
  const specularColor = new THREE.Color(options.specularColor !== undefined ? options.specularColor : 0xffffff);

  mat.userData.rimColor = rimColor;
  mat.userData.rimPower = rimPower;
  mat.userData.rimIntensity = rimIntensity;
  mat.userData.fineGlowColor = fineGlowColor;
  mat.userData.fineGlowIntensity = fineGlowIntensity;
  mat.userData.fineGlowPower = fineGlowPower;
  mat.userData.fineGlowMin = fineGlowMin;
  mat.userData.fineGlowMax = fineGlowMax;
  mat.userData.shadowColor = shadowColor;
  mat.userData.shadowIntensity = shadowIntensity;
  mat.userData.enableWindSway = enableWindSway;
  mat.userData.windStrength = windStrength;
  mat.userData.enableSSS = enableSSS;
  mat.userData.sssColor = sssColor;
  mat.userData.sssIntensity = sssIntensity;
  mat.userData.specularIntensity = specularIntensity;
  mat.userData.specularRoughness = specularRoughness;
  mat.userData.specularColor = specularColor;

  mat.customProgramCacheKey = () => {
    return `ToonMat_b${bands}_m${options.map ? '1' : '0'}_fg${fineGlowIntensity > 0 ? '1' : '0'}_ws${enableWindSway ? '1' : '0'}_sss${sssIntensity > 0 ? '1' : '0'}_sp${specularIntensity > 0 ? '1' : '0'}`;
  };

  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uRimColor = { value: rimColor };
    shader.uniforms.uRimPower = { value: rimPower };
    shader.uniforms.uRimIntensity = { value: rimIntensity };
    shader.uniforms.uFineGlowColor = { value: fineGlowColor };
    shader.uniforms.uFineGlowIntensity = { value: fineGlowIntensity };
    shader.uniforms.uFineGlowPower = { value: fineGlowPower };
    shader.uniforms.uFineGlowMin = { value: fineGlowMin };
    shader.uniforms.uFineGlowMax = { value: fineGlowMax };
    shader.uniforms.uShadowColor = { value: shadowColor };
    shader.uniforms.uShadowIntensity = { value: shadowIntensity };
    shader.uniforms.uSSSColor = { value: sssColor };
    shader.uniforms.uSSSIntensity = { value: sssIntensity };
    shader.uniforms.uSpecularIntensity = { value: specularIntensity };
    shader.uniforms.uSpecularRoughness = { value: specularRoughness };
    shader.uniforms.uSpecularColor = { value: specularColor };

    if (enableWindSway) {
      shader.uniforms.uTime = { value: 0 };
      shader.uniforms.uWindStrength = { value: windStrength };

      shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        /* glsl */ `
        #include <common>
        uniform float uTime;
        uniform float uWindStrength;
        `
      );

      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        /* glsl */ `
        #include <begin_vertex>
        // Organic Genshin Foliage Wind Sway
        vec4 vWorld = modelMatrix * vec4(position, 1.0);
        float swayFactor = clamp(position.y * 0.16, 0.0, 1.0);
        float windWave = sin(uTime * 1.8 + vWorld.x * 0.28 + vWorld.z * 0.24) * 0.14
                       + cos(uTime * 3.1 + vWorld.z * 0.38) * 0.06;
        vec3 windDir = normalize(vec3(0.85, 0.12, 0.52));
        transformed += windDir * (windWave * swayFactor * uWindStrength);
        `
      );
    }

    // Inject high precision and uniforms into fragment shader
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <common>',
      /* glsl */ `
      #include <common>
      #ifdef GL_FRAGMENT_PRECISION_HIGH
        precision highp float;
      #else
        precision mediump float;
      #endif
      uniform vec3 uRimColor;
      uniform float uRimPower;
      uniform float uRimIntensity;
      uniform vec3 uFineGlowColor;
      uniform float uFineGlowIntensity;
      uniform float uFineGlowPower;
      uniform float uFineGlowMin;
      uniform float uFineGlowMax;
      uniform vec3 uShadowColor;
      uniform float uShadowIntensity;
      uniform vec3 uSSSColor;
      uniform float uSSSIntensity;
      uniform float uSpecularIntensity;
      uniform float uSpecularRoughness;
      uniform vec3 uSpecularColor;
      `
    );

    // Inject Stylized Shadows, Colored Rim Lighting, SSS, and Specular Sheen before final output
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <opaque_fragment>',
      /* glsl */ `
      // --- Cel-Shaded Anime Extensions (Genshin + Minecraft Photon Shaders) ---
      {
        // 1. Stylized Shadow Harmonization
        float directLevel = clamp(
          length(reflectedLight.directDiffuse) / (max(0.0001, length(diffuseColor.rgb) * 1.732)),
          0.0,
          1.0
        );
        float shadowFactor = 1.0 - smoothstep(0.01, 0.85, directLevel);

        outgoingLight = mix(
          outgoingLight,
          uShadowColor * diffuseColor.rgb * 1.35,
          shadowFactor * clamp(uShadowIntensity, 0.0, 1.0)
        );

        vec3 viewDir = normalize(vViewPosition);
        vec3 norm = normalize(normal);
        float NdotV = clamp(dot(norm, viewDir), 0.0, 1.0);
        float fresnel = 1.0 - NdotV;

        #if (NUM_DIR_LIGHTS > 0)
        vec3 lightDir = directionalLights[0].direction;

        // 2. Subsurface Scattering Translucency (Photon Shaders leaf backlight)
        if (uSSSIntensity > 0.001) {
          float eyeLightDot = max(0.0, dot(-viewDir, -lightDir));
          float backNormal = max(0.0, dot(-norm, lightDir));
          float sss = pow(eyeLightDot, 2.8) * backNormal * uSSSIntensity;
          outgoingLight += diffuseColor.rgb * uSSSColor * (sss * 2.5);
        }

        // 3. Micro-Specular Sheen (Photon Shaders stone/wood/metal glint)
        if (uSpecularIntensity > 0.001) {
          vec3 halfVec = normalize(lightDir + viewDir);
          float NdotH = max(0.0, dot(norm, halfVec));
          float spec = pow(NdotH, uSpecularRoughness) * uSpecularIntensity;
          outgoingLight += directionalLights[0].color * uSpecularColor * spec;
        }
        #endif

        // 4. Anime Fresnel Rim Lighting (Color Tone Rim)
        float rim = smoothstep(0.22, 0.85, pow(fresnel, uRimPower));
        outgoingLight += uRimColor * (rim * uRimIntensity);

        // 5. Crisp Fine White Glow Edge (Genshin Canopy & Silhouette Halo)
        if (uFineGlowIntensity > 0.001) {
          float fineRim = smoothstep(uFineGlowMin, uFineGlowMax, pow(fresnel, uFineGlowPower));
          outgoingLight += uFineGlowColor * (fineRim * uFineGlowIntensity);
        }
      }
      #include <opaque_fragment>
      `
    );

    mat.userData.shader = shader;
  };

  return mat;
}

/**
 * Convenience helper to instantiate a ToonMaterial using one of the anime presets.
 */
export function getToonPreset(
  name: ToonPresetName,
  overrides?: Partial<ToonMaterialOptions>
): THREE.MeshToonMaterial {
  const preset = TOON_PRESETS[name];
  if (!preset) {
    throw new Error(`ToonMaterial preset "${name}" not found.`);
  }
  return createToonMaterial({ ...preset, ...overrides });
}

/**
 * Free GPU memory for cached discrete gradient textures on teardown.
 */
export function disposeToonCache(): void {
  for (const texture of gradientTextureCache.values()) {
    texture.dispose();
  }
  gradientTextureCache.clear();
}
