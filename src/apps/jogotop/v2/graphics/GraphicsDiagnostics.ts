import * as THREE from 'three';
import { GraphicsDiagnosticsSnapshot, GraphicsProfileType, GraphicsState } from '../types';

export class GraphicsDiagnostics {
  public state: GraphicsState = 'booting';
  public profile: GraphicsProfileType = 'desktop';
  public dpr = 1;
  public width = 0;
  public height = 0;

  private frameCount = 0;
  private lastFpsUpdateTime = 0;
  private currentFps = 60;
  private currentFrameTimeMs = 16.6;
  private frameStartTime = 0;

  private drawCalls = 0;
  private triangles = 0;
  private geometries = 0;
  private textures = 0;

  private contextLossCount = 0;
  private invalidTransformCount = 0;

  constructor() {
    this.lastFpsUpdateTime = typeof performance !== 'undefined' ? performance.now() : 0;
  }

  public beginFrame() {
    this.frameStartTime = typeof performance !== 'undefined' ? performance.now() : 0;
  }

  public endFrame(renderer: THREE.WebGLRenderer) {
    const now = typeof performance !== 'undefined' ? performance.now() : 0;
    this.currentFrameTimeMs = now - this.frameStartTime;
    this.frameCount++;

    if (now - this.lastFpsUpdateTime >= 500) {
      const elapsedSec = (now - this.lastFpsUpdateTime) / 1000;
      this.currentFps = Math.round(this.frameCount / elapsedSec);
      this.frameCount = 0;
      this.lastFpsUpdateTime = now;
    }

    if (renderer && renderer.info) {
      this.drawCalls = renderer.info.render.calls;
      this.triangles = renderer.info.render.triangles;
      this.geometries = renderer.info.memory.geometries;
      this.textures = renderer.info.memory.textures;
    }
  }

  public recordContextLoss() {
    this.contextLossCount++;
    this.state = 'context-lost';
  }

  public recordContextRestored() {
    this.state = 'ready';
  }

  public recordInvalidTransform() {
    this.invalidTransformCount++;
  }

  public setState(state: GraphicsState) {
    this.state = state;
  }

  public setProfile(profile: GraphicsProfileType, dpr: number, width: number, height: number) {
    this.profile = profile;
    this.dpr = dpr;
    this.width = width;
    this.height = height;
  }

  public getSnapshot(): GraphicsDiagnosticsSnapshot {
    return {
      state: this.state,
      fps: this.currentFps,
      frameTimeMs: parseFloat(this.currentFrameTimeMs.toFixed(2)),
      drawCalls: this.drawCalls,
      triangles: this.triangles,
      geometries: this.geometries,
      textures: this.textures,
      contextLossCount: this.contextLossCount,
      invalidTransformCount: this.invalidTransformCount,
      profile: this.profile,
      dpr: this.dpr,
      viewport: { width: this.width, height: this.height },
    };
  }
}
