import * as THREE from 'three';
import { GeometryValidator } from './GeometryValidator';
import { ResourceRegistry } from './ResourceRegistry';

export class GeometryCatalog {
  private static readonly SUN_DIR = new THREE.Vector3(38, 60, 24).normalize();

  // Primitives
  public readonly unitBox: THREE.BoxGeometry;
  public readonly unitCylinder: THREE.CylinderGeometry;
  public readonly unitCylinder8: THREE.CylinderGeometry;
  public readonly unitSphere: THREE.SphereGeometry;
  public readonly unitIcosahedron: THREE.IcosahedronGeometry;
  public readonly unitDodecahedron: THREE.DodecahedronGeometry;
  public readonly unitCone: THREE.ConeGeometry;

  constructor(private registry: ResourceRegistry) {
    this.unitBox = registry.trackGeometry(new THREE.BoxGeometry(1, 1, 1));
    this.unitCylinder = registry.trackGeometry(new THREE.CylinderGeometry(1, 1, 1, 14));
    this.unitCylinder8 = registry.trackGeometry(new THREE.CylinderGeometry(1, 1, 1, 8));
    this.unitSphere = registry.trackGeometry(new THREE.SphereGeometry(1, 14, 10));
    this.unitIcosahedron = registry.trackGeometry(new THREE.IcosahedronGeometry(1, 1));
    this.unitDodecahedron = registry.trackGeometry(new THREE.DodecahedronGeometry(1, 0));
    this.unitCone = registry.trackGeometry(new THREE.ConeGeometry(1, 1, 10));
  }

  /**
   * Applies CPU-side low-poly vertex shading to bake lighting into vertex colors.
   * This gives crisp, performant 3D depth using simple unlit MeshBasicMaterial!
   */
  public applyVertexShading(
    sourceGeo: THREE.BufferGeometry,
    baseColorHex: number,
    flatShaded = true,
    minIntensity = 0.62,
    maxIntensity = 1.0
  ): THREE.BufferGeometry {
    // If flat shading is requested and geometry is indexed, convert to non-indexed
    let geo = sourceGeo;
    if (flatShaded && geo.index) {
      geo = geo.toNonIndexed();
    } else {
      geo = geo.clone();
    }

    if (!geo.attributes.normal) {
      geo.computeVertexNormals();
    }

    const posCount = geo.attributes.position.count;
    const normals = geo.attributes.normal.array;
    const colors = new Float32Array(posCount * 3);

    const baseColor = new THREE.Color(baseColorHex);
    const normal = new THREE.Vector3();

    const range = maxIntensity - minIntensity;

    for (let i = 0; i < posCount; i++) {
      normal.set(normals[i * 3], normals[i * 3 + 1], normals[i * 3 + 2]);
      const dot = Math.max(0, normal.dot(GeometryCatalog.SUN_DIR));
      const intensity = minIntensity + dot * range;

      colors[i * 3] = baseColor.r * intensity;
      colors[i * 3 + 1] = baseColor.g * intensity;
      colors[i * 3 + 2] = baseColor.b * intensity;
    }

    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    GeometryValidator.assertValid(geo, `VertexShadedGeo(0x${baseColorHex.toString(16)})`, 140);
    this.registry.trackGeometry(geo);
    return geo;
  }
}
