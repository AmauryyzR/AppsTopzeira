export interface GameplayInput {
  moveX: number;
  moveZ: number;
  jumpPressed: boolean;
  jumpHeld: boolean;
  interactPressed?: boolean;
}

export interface CameraInput {
  yawDelta: number;
  pitchDelta: number;
  zoomDelta: number;
}

export interface PlayerSnapshot {
  position: [number, number, number];
  yaw: number;
  verticalVelocity: number;
  grounded: boolean;
  speedRatio: number;
  animationTime: number;
  isSitting?: boolean;
}

export type GraphicsProfileType = 'mobile-low' | 'mobile' | 'desktop';

export interface GraphicsProfileConfig {
  name: GraphicsProfileType;
  maxDpr: number;
  flowerCount: number;
  tuftCount: number;
  butterflyCount: number;
  targetFps: number;
  maxDrawCalls: number;
  maxTriangles: number;
}

export interface GraphicsCapabilities {
  isWebGL2: boolean;
  profile: GraphicsProfileType;
  dpr: number;
  width: number;
  height: number;
}

export type GraphicsState = 'booting' | 'ready' | 'context-lost' | 'restoring' | 'unsupported' | 'fatal';

export interface GraphicsDiagnosticsSnapshot {
  state: GraphicsState;
  fps: number;
  frameTimeMs: number;
  drawCalls: number;
  triangles: number;
  geometries: number;
  textures: number;
  contextLossCount: number;
  invalidTransformCount: number;
  profile: GraphicsProfileType;
  dpr: number;
  viewport: { width: number; height: number };
}

export interface Collider {
  x: number;
  z: number;
  r: number;
}

export interface TreeDescriptor {
  x: number;
  z: number;
  scale: number;
  yaw: number;
  trunkColor: number;
  mainLeafColor: number;
  secLeafColor: number;
  hasFruit: boolean;
  fruitColor?: number;
}

export interface BushDescriptor {
  x: number;
  z: number;
  scale: number;
  color: number;
  yaw: number;
  hasBerries: boolean;
  berryColor?: number;
}

export interface RockDescriptor {
  x: number;
  z: number;
  scale: number;
  color: number;
  rx: number;
  ry: number;
  rz: number;
}

export interface BenchDescriptor {
  x: number;
  z: number;
  yaw: number;
}

export interface FlowerDescriptor {
  x: number;
  z: number;
  height: number;
  scale: number;
  rx: number;
  ry: number;
  rz: number;
  color: number;
}

export interface TuftDescriptor {
  x: number;
  z: number;
  scale: number;
  rx: number;
  ry: number;
  rz: number;
  color: number;
}

export interface LampDescriptor {
  x: number;
  z: number;
}

export interface ButterflyDescriptor {
  startX: number;
  startZ: number;
  speed: number;
  color: number;
}

export interface LilyPadDescriptor {
  x: number;
  z: number;
  scale: number;
  phase: number;
  hasFlower: boolean;
  flowerColor?: number;
}

export interface ShoreRockDescriptor {
  x: number;
  z: number;
  scale: number;
  color: number;
  rx: number;
  ry: number;
}

export interface ReedDescriptor {
  x: number;
  z: number;
  height: number;
  rz: number;
  hasHead: boolean;
}

export interface PerimeterFenceDescriptor {
  radius: number;
  postCount: number;
}

export interface WorldDefinitionData {
  seed: number;
  bounds: number;
  spawnPosition: [number, number, number];
  spawnYaw: number;
  plaza: { x: number; z: number; radius: number };
  pond: { x: number; z: number; radius: number };
  bridge: { x: number; z: number; yaw: number; radius: number };
  pathPoints: [number, number][];
  colliders: Collider[];
  trees: TreeDescriptor[];
  bushes: BushDescriptor[];
  rocks: RockDescriptor[];
  benches: BenchDescriptor[];
  flowers: FlowerDescriptor[];
  tufts: TuftDescriptor[];
  lamps: LampDescriptor[];
  butterflies: ButterflyDescriptor[];
  lilyPads: LilyPadDescriptor[];
  shoreRocks: ShoreRockDescriptor[];
  reeds: ReedDescriptor[];
  fence: PerimeterFenceDescriptor;
}
