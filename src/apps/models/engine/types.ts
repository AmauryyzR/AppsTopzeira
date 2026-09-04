import * as THREE from 'three';

export type ShadingMode = 'material' | 'clay' | 'wireframe';

export interface ModelStats {
  vertices: number;
  triangles: number;
  meshCount: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
}

export interface ModelStudioSettings {
  shadingMode: ShadingMode;
  showGrid: boolean;
  showShadows: boolean;
  autoRotate: boolean;
  backgroundColor: string;
}

export interface ModelDefinition {
  id: string;
  name: string;
  category: string;
  description: string;
  create: () => THREE.Object3D;
}
