import * as THREE from 'three';

export interface LanternLightInstance {
  light: THREE.PointLight;
  glowMesh: THREE.Mesh;
  baseIntensity: number;
  flickerSpeed: number;
  flickerOffset: number;
}

/**
 * AAA-Grade Dynamic Lantern Illumination System (Loop 8)
 * Manages warm amber point lights for Japanese Stone Lanterns (Tōrō),
 * Pagoda Chōchin, and Plaza Lamps with realistic organic flame flickering.
 */
export class LanternLightingManager {
  public readonly group = new THREE.Group();
  private lanterns: LanternLightInstance[] = [];

  // Shared glow sphere geometry and material
  private glowGeo: THREE.SphereGeometry;
  private glowMat: THREE.MeshBasicMaterial;

  constructor() {
    this.glowGeo = new THREE.SphereGeometry(0.18, 12, 10);
    this.glowMat = new THREE.MeshBasicMaterial({
      color: 0xfde047,
      transparent: true,
      opacity: 0.90,
    });

    this.spawnLanternLights();
  }

  private spawnLanternLights() {
    // Key landmark illumination positions across the park
    const positions: Array<{ pos: THREE.Vector3; color: number; intensity: number; distance: number }> = [
      // 1. Torii Gate Flanking Stone Lanterns (South Entrance, z = 42m)
      { pos: new THREE.Vector3(-3.2, 1.45, 42.0), color: 0xf59e0b, intensity: 3.2, distance: 12.0 },
      { pos: new THREE.Vector3(3.2, 1.45, 42.0), color: 0xf59e0b, intensity: 3.2, distance: 12.0 },

      // 2. Pagoda Gazebo Hanging Chōchin (East Platform, x = 34m)
      { pos: new THREE.Vector3(34.0, 2.6, 2.4), color: 0xf97316, intensity: 3.6, distance: 14.0 },
      { pos: new THREE.Vector3(34.0, 2.6, -2.4), color: 0xf97316, intensity: 3.6, distance: 14.0 },

      // 3. Taiko Bashi Arched Bridge (West Creek, x = -34m)
      { pos: new THREE.Vector3(-34.0, 2.2, 0.0), color: 0xfbbf24, intensity: 3.4, distance: 13.0 },

      // 4. Central Plaza Street Lamps (surrounding the Grand Fountain)
      { pos: new THREE.Vector3(8.0, 4.12, 8.0), color: 0xfef08a, intensity: 2.8, distance: 12.0 },
      { pos: new THREE.Vector3(-8.0, 4.12, 8.0), color: 0xfef08a, intensity: 2.8, distance: 12.0 },
      { pos: new THREE.Vector3(8.0, 4.12, -8.0), color: 0xfef08a, intensity: 2.8, distance: 12.0 },
      { pos: new THREE.Vector3(-8.0, 4.12, -8.0), color: 0xfef08a, intensity: 2.8, distance: 12.0 },
    ];

    for (let i = 0; i < positions.length; i++) {
      const cfg = positions[i];

      const pLight = new THREE.PointLight(cfg.color, cfg.intensity, cfg.distance, 1.8);
      pLight.position.copy(cfg.pos);
      pLight.castShadow = false; // Soft ambient fill, high FPS
      this.group.add(pLight);

      // Emissive visual core sphere inside the lantern
      const core = new THREE.Mesh(this.glowGeo, this.glowMat);
      core.position.copy(cfg.pos);
      this.group.add(core);

      this.lanterns.push({
        light: pLight,
        glowMesh: core,
        baseIntensity: cfg.intensity,
        flickerSpeed: 4.5 + Math.random() * 3.5,
        flickerOffset: Math.random() * Math.PI * 2,
      });
    }
  }

  public update(timeSeconds: number) {
    // Animate organic firebox flame flicker
    for (let i = 0; i < this.lanterns.length; i++) {
      const l = this.lanterns[i];
      const t = timeSeconds * l.flickerSpeed + l.flickerOffset;

      // Compound harmonic wave simulating natural dancing flame
      const wave = Math.sin(t) * 0.10 + Math.sin(t * 2.3) * 0.05 + Math.cos(t * 0.7) * 0.04;
      const factor = THREE.MathUtils.clamp(1.0 + wave, 0.75, 1.25);

      l.light.intensity = l.baseIntensity * factor;
      const s = 0.95 + wave * 0.3;
      l.glowMesh.scale.set(s, s, s);
    }
  }

  public dispose() {
    this.glowGeo.dispose();
    this.glowMat.dispose();
    for (const l of this.lanterns) {
      l.light.dispose();
    }
    this.lanterns = [];
  }
}
