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
    color: 0xd4d8e2, // Soft porcelain/marble grey with gentle cool tone
    gradientBands: 4,
    rimColor: 0xffffff, // Crisp pearl specular rim
    rimPower: 2.8,
    rimIntensity: 0.65,
    shadowColor: 0x64748b, // Slate blue anime shadow
    shadowIntensity: 0.55,
  },

  // 3. Sandstone: Welcoming sun-warmed path stone (Gerudo/Hyrule style)
  sandstone: {
    color: 0xedd3a1, // Burlywood golden sandstone
    gradientBands: 4,
    rimColor: 0xfef3c7, // Warm amber-sun rim
    rimPower: 3.2,
    rimIntensity: 0.50,
    shadowColor: 0xa8714b, // Warm terracotta shadow
    shadowIntensity: 0.45,
  },

  // 4. Wood: Rich cedar wood with visible warm chamfer edge rim
  wood: {
    color: 0x935b37, // Polished warm cedar
    gradientBands: 3,
    rimColor: 0xfde68a, // Sun catch rim on wooden edges
    rimPower: 3.6,
    rimIntensity: 0.42,
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
    shadowColor: 0x181f2a, // Deep midnight shadow
    shadowIntensity: 0.65,
  },

  // 6. Foliage: Vibrant broadleaf forest canopy cel-shaded
  foliage: {
    color: 0x2a9d56, // Lush Zelda BotW forest green
    gradientBands: 3,
    rimColor: 0x86efac, // Bright leaf translucency rim
    rimPower: 2.7,
    rimIntensity: 0.60,
    shadowColor: 0x16532d, // Deep pine shadow
    shadowIntensity: 0.55,
  },

  // Pine / Evergreen variant
  foliagePine: {
    color: 0x1e7846, // Cool pine green
    gradientBands: 3,
    rimColor: 0xa7f3d0,
    rimPower: 2.6,
    rimIntensity: 0.65,
    shadowColor: 0x0f3d23,
    shadowIntensity: 0.60,
  },

  // Cherry Blossom (Sakura)
  cherryBlossom: {
    color: 0xf472b6, // Vibrant sakura blossom pink
    gradientBands: 4,
    rimColor: 0xffedd5, // Soft peach blossom rim
    rimPower: 2.8,
    rimIntensity: 0.55,
    shadowColor: 0x9d174d, // Rich magenta petal shadow
    shadowIntensity: 0.48,
  },

  // Water: Shimmering anime fountain pool
  water: {
    color: 0x38bdf8,
    gradientBands: 3,
    rimColor: 0xffffff,
    rimPower: 2.2,
    rimIntensity: 0.85,
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

  mat.userData.rimColor = rimColor;
  mat.userData.rimPower = rimPower;
  mat.userData.rimIntensity = rimIntensity;
  mat.userData.shadowColor = shadowColor;
  mat.userData.shadowIntensity = shadowIntensity;

  mat.customProgramCacheKey = () => {
    return `ToonMat_b${bands}_m${options.map ? '1' : '0'}`;
  };

  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uRimColor = { value: rimColor };
    shader.uniforms.uRimPower = { value: rimPower };
    shader.uniforms.uRimIntensity = { value: rimIntensity };
    shader.uniforms.uShadowColor = { value: shadowColor };
    shader.uniforms.uShadowIntensity = { value: shadowIntensity };

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
      uniform vec3 uShadowColor;
      uniform float uShadowIntensity;
      `
    );

    // Inject Stylized Shadows & Rim Lighting before final output
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <opaque_fragment>',
      /* glsl */ `
      // --- Cel-Shaded Anime Extensions (BotW / Genshin) ---
      {
        // 1. Stylized Shadow Harmonization
        // Measure received direct illumination level
        float directLevel = clamp(
          length(reflectedLight.directDiffuse) / (max(0.0001, length(diffuseColor.rgb) * 1.732)),
          0.0,
          1.0
        );
        float shadowFactor = 1.0 - smoothstep(0.01, 0.85, directLevel);

        // Blend with artistic anime shadow hue (warm terracotta, soft lavender, or deep jade)
        outgoingLight = mix(
          outgoingLight,
          uShadowColor * diffuseColor.rgb * 1.35,
          shadowFactor * clamp(uShadowIntensity, 0.0, 1.0)
        );

        // 2. Anime Fresnel Rim Lighting
        vec3 viewDir = normalize(vViewPosition);
        vec3 norm = normalize(normal);
        float NdotV = clamp(dot(norm, viewDir), 0.0, 1.0);
        float fresnel = 1.0 - NdotV;
        float rim = smoothstep(0.20, 0.85, pow(fresnel, uRimPower));

        // Add bright crisp rim silhouette light
        outgoingLight += uRimColor * (rim * uRimIntensity);
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
