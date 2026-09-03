import * as THREE from 'three';

export interface SkyDomeOptions {
  radius?: number;
  horizonColor?: THREE.ColorRepresentation;
  zenithColor?: THREE.ColorRepresentation;
  cloudColor?: THREE.ColorRepresentation;
  cloudShadowColor?: THREE.ColorRepresentation;
  sunColor?: THREE.ColorRepresentation;
  sunPosition?: THREE.Vector3;
}

const vertexShader = /* glsl */ `
varying vec3 vWorldPosition;

void main() {
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPos.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

const fragmentShader = /* glsl */ `
varying vec3 vWorldPosition;

uniform float uTime;
uniform vec3 uSunPosition;
uniform vec3 uHorizonColor;
uniform vec3 uZenithColor;
uniform vec3 uCloudColor;
uniform vec3 uCloudShadowColor;
uniform vec3 uSunColor;

// 2D Simplex Noise
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187,
                      0.366025403784439,
                     -0.577350269189626,
                      0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v -   i + dot(i, C.xx);

  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));

  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// 2D Cellular / Worley Noise for billowy Ghibli cumulus puffs
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

vec2 hash2(vec2 p) {
  return vec2(
    hash(p),
    hash(p + vec2(43.12, 87.65))
  );
}

float worley2D(vec2 p) {
  vec2 i_pos = floor(p);
  vec2 f_pos = fract(p);
  float minDist = 1.0;
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 neighbor = vec2(float(x), float(y));
      vec2 point = hash2(i_pos + neighbor);
      vec2 diff = neighbor + point - f_pos;
      minDist = min(minDist, length(diff));
    }
  }
  return minDist;
}

// Multi-octave FBM for organic whisps
float fbm(vec2 p) {
  float total = 0.0;
  total += 0.5000 * (snoise(p) * 0.5 + 0.5); p = p * 2.02 + vec2(1.7, 3.2);
  total += 0.2800 * (snoise(p) * 0.5 + 0.5); p = p * 2.03 + vec2(8.3, 2.1);
  total += 0.1400 * (snoise(p) * 0.5 + 0.5); p = p * 2.01 + vec2(2.4, 5.7);
  total += 0.0800 * (snoise(p) * 0.5 + 0.5);
  return total;
}

// Composite Ghibli cloud density function
float getCloudDensity(vec2 p) {
  // Domain warp with centered offset
  vec2 warp = vec2(
    snoise(p * 0.8 + vec2(1.7, 9.2)),
    snoise(p * 0.8 + vec2(8.3, 2.8))
  ) * 0.35;

  vec2 wp = p + warp;

  // Billow puffy foundation (Worley inverted)
  float billow = 1.0 - worley2D(wp * 1.4);
  billow = smoothstep(0.15, 0.85, billow);

  // Wispy organic variation
  float detail = fbm(wp * 2.0);

  // Composite: rounded cloud masses with rich hand-painted detail
  return billow * 0.65 + detail * 0.35;
}

void main() {
  vec3 viewDir = normalize(vWorldPosition - cameraPosition);
  vec3 sunDir = normalize(uSunPosition);

  // -------------------------------------------------------------
  // 1. ANIME SKY GRADIENT (Genshin Impact / BoTW Atmosphere)
  // -------------------------------------------------------------
  float h = clamp(viewDir.y, 0.0, 1.0);
  float skyCurve = pow(h, 0.60);
  vec3 sky = mix(uHorizonColor, uZenithColor, skyCurve);

  // Atmospheric sun haze at lower sky
  float sunAtmosphere = pow(max(0.0, dot(viewDir, sunDir)), 3.0) * 0.30;
  sky = mix(sky, uSunColor, sunAtmosphere * (1.0 - skyCurve * 0.75));

  // Below horizon blend (smoothly matching terrain / fog #c7e4fa)
  if (viewDir.y < 0.0) {
    float belowH = clamp(-viewDir.y * 3.5, 0.0, 1.0);
    sky = mix(uHorizonColor, uHorizonColor * 0.94, belowH);
  }

  // -------------------------------------------------------------
  // 2. STYLIZED SUN & CORONA
  // -------------------------------------------------------------
  float sunCos = dot(viewDir, sunDir);
  // Crisp anime sun disk
  float sunDisk = smoothstep(0.9982, 0.9992, sunCos);
  // Warm intense corona & outer bloom
  float innerCorona = pow(max(0.0, sunCos), 96.0) * 0.85;
  float outerCorona = pow(max(0.0, sunCos), 16.0) * 0.35;
  float sunAura = pow(max(0.0, sunCos), 5.0) * 0.15;
  vec3 sun = uSunColor * (sunDisk * 3.2 + innerCorona + outerCorona + sunAura);

  // -------------------------------------------------------------
  // 3. FLUFFY ANIME CUMULUS CLOUDS (Studio Ghibli / Cel-shaded)
  // -------------------------------------------------------------
  // Perspective dome projection
  vec2 cloudUV = viewDir.xz / (max(viewDir.y, 0.04) + 0.32);

  // Gentle wind motion
  vec2 wind = vec2(0.007, 0.003) * uTime;
  vec2 cloudCoord = cloudUV * 0.38 + wind;

  // Evaluate cloud density
  float density = getCloudDensity(cloudCoord);

  // Hand-painted cloud contour threshold
  float cloudMask = smoothstep(0.48, 0.56, density);

  // Directional lighting across the cloud mass towards sun
  vec2 sun2D = normalize(sunDir.xz + vec2(0.0001));
  float lightShift = getCloudDensity(cloudCoord - sun2D * 0.08);
  float directionalLight = clamp((density - lightShift) * 3.2 + 0.55, 0.0, 1.0);

  // Vertical billow puff shading (top facing sky lit, underside shaded)
  float verticalShade = clamp(density * 1.5 - 0.25, 0.0, 1.0);
  float totalShade = clamp(directionalLight * 0.60 + verticalShade * 0.40, 0.0, 1.0);

  // Cel-shaded 2-band / 3-band anime stepping
  float shadowBand = smoothstep(0.35, 0.42, totalShade);
  float highlightBand = smoothstep(0.65, 0.72, totalShade);

  vec3 cloudRgb = mix(
    uCloudShadowColor,
    uCloudColor,
    shadowBand * 0.65 + highlightBand * 0.35
  );

  // Silver lining / rim glow when facing towards sun
  float sunRim = pow(max(0.0, sunCos), 8.0) * 0.45 * highlightBand;
  cloudRgb += uSunColor * sunRim;

  // Atmospheric horizon fade: clouds gently dissolve into horizon haze
  float horizonFade = smoothstep(0.03, 0.24, viewDir.y);
  float finalCloudAlpha = cloudMask * horizonFade * 0.96;

  // -------------------------------------------------------------
  // 4. FINAL COMPOSITION
  // -------------------------------------------------------------
  vec3 skyWithSun = sky + sun;
  vec3 finalColor = mix(skyWithSun, cloudRgb, finalCloudAlpha);

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

export class SkyDome {
  public readonly mesh: THREE.Mesh<THREE.SphereGeometry, THREE.ShaderMaterial>;
  public readonly geometry: THREE.SphereGeometry;
  public readonly material: THREE.ShaderMaterial;
  private elapsedTime = 0;

  constructor(options?: SkyDomeOptions) {
    const radius = options?.radius ?? 350;

    // Hemisphere/Sphere geometry with radius ~350
    this.geometry = new THREE.SphereGeometry(radius, 64, 32);

    const initialSunPos = options?.sunPosition
      ? options.sunPosition.clone().normalize()
      : new THREE.Vector3(45, 65, 35).normalize();

    this.material = new THREE.ShaderMaterial({
      name: 'AnimeSkyDomeMaterial',
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uSunPosition: { value: initialSunPos },
        uHorizonColor: { value: new THREE.Color(options?.horizonColor ?? 0xdbeafe) },
        uZenithColor: { value: new THREE.Color(options?.zenithColor ?? 0x1d4ed8) },
        uCloudColor: { value: new THREE.Color(options?.cloudColor ?? 0xffffff) },
        uCloudShadowColor: { value: new THREE.Color(options?.cloudShadowColor ?? 0x93c5fd) },
        uSunColor: { value: new THREE.Color(options?.sunColor ?? 0xfffbeb) },
      },
      side: THREE.BackSide,
      depthWrite: false,
      depthTest: true,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.name = 'AnimeSkyDome';
    this.mesh.renderOrder = -1000;
    this.mesh.frustumCulled = false;
  }

  public update(dt: number, sunPosition?: THREE.Vector3, cameraPosition?: THREE.Vector3): void {
    this.elapsedTime += dt;
    this.material.uniforms.uTime.value = this.elapsedTime;

    if (sunPosition) {
      this.material.uniforms.uSunPosition.value.copy(sunPosition).normalize();
    }

    if (cameraPosition) {
      this.mesh.position.copy(cameraPosition);
    }
  }

  public dispose(): void {
    if (this.mesh.parent) {
      this.mesh.parent.remove(this.mesh);
    }
    this.geometry.dispose();
    this.material.dispose();
  }
}
