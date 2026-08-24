import { GraphicsEngine } from './graphics/GraphicsEngine';
import { InputController } from './input/InputController';
import { FixedStepLoop } from './loop/FixedStepLoop';
import { GameSimulation } from './simulation/GameSimulation';
import { GraphicsCapabilities, GraphicsDiagnosticsSnapshot, GraphicsState, WorldDefinitionData } from './types';
import { generateWorldDefinition, SEED_CONSTANT } from './world/WorldDefinition';

export interface RuntimeOptions {
  onReady?: (caps: GraphicsCapabilities) => void;
  onStateChange?: (state: GraphicsState, diag: GraphicsDiagnosticsSnapshot) => void;
}

export class JogoTopRuntime {
  public readonly worldData: WorldDefinitionData;
  public readonly simulation: GameSimulation;
  public readonly graphics: GraphicsEngine;
  public readonly input: InputController;
  public readonly loop: FixedStepLoop;

  private dustTimer = 0;
  private isDisposed = false;
  private onReady?: (caps: GraphicsCapabilities) => void;
  private onStateChange?: (state: GraphicsState, diag: GraphicsDiagnosticsSnapshot) => void;

  constructor(container: HTMLElement, options?: RuntimeOptions) {
    this.onReady = options?.onReady;
    this.onStateChange = options?.onStateChange;

    // 1. Generate deterministic world data
    this.worldData = generateWorldDefinition(SEED_CONSTANT);

    // 2. Instantiate decoupled subsystems
    this.simulation = new GameSimulation(this.worldData);
    this.graphics = new GraphicsEngine(this.worldData);
    this.input = new InputController();

    // 3. Setup fixed-step simulation loop with render interpolation
    this.loop = new FixedStepLoop(
      (fixedDt) => this.onSimulationStep(fixedDt),
      (alpha, frameDelta) => this.onRenderFrame(alpha, frameDelta)
    );

    // 4. Initialize input & graphics
    this.input.attach();
    this.graphics.initialize(container).then(
      (caps) => {
        if (this.isDisposed) return;
        this.loop.start();
        this.onReady?.(caps);
        this.onStateChange?.('ready', this.graphics.getDiagnostics());
      },
      (err) => {
        console.error('Failed to initialize GraphicsEngine:', err);
        if (this.isDisposed) return;
        this.onStateChange?.('unsupported', this.graphics.getDiagnostics());
      }
    );
  }

  private onSimulationStep(fixedDt: number) {
    const gameplayInput = this.input.update();
    const cameraYaw = this.graphics.cameraRig?.yaw || 0;

    // Advance pure math physics simulation
    this.simulation.step(fixedDt, gameplayInput, cameraYaw);

    // Process simulation events (jump takeoff, landing impact, dust emission)
    const events = this.simulation.consumeEvents();
    for (const ev of events) {
      if (ev.type === 'jump') {
        this.graphics.effectsView?.spawn(ev.x, ev.z, 2);
        this.graphics.playerView?.takeoff();
      } else if (ev.type === 'land') {
        const impact = ev.impact || 0.5;
        this.graphics.playerView?.land(impact);
        this.graphics.effectsView?.spawn(ev.x, ev.z, 2 + Math.round(impact * 3));
      }
    }

    // Continuous running dust
    this.dustTimer -= fixedDt;
    if (this.simulation.grounded && this.simulation.speedRatio > 0.4 && this.dustTimer <= 0) {
      this.graphics.effectsView?.spawn(this.simulation.x, this.simulation.z, 1);
      this.dustTimer = 0.12;
    }
  }

  private onRenderFrame(alpha: number, frameDelta: number) {
    const { previous, current } = this.simulation.getSnapshots();
    this.graphics.render(previous, current, alpha, frameDelta);
  }

  public getDiagnostics(): GraphicsDiagnosticsSnapshot {
    return this.graphics.getDiagnostics();
  }

  public dispose() {
    if (this.isDisposed) return;
    this.isDisposed = true;

    this.loop.stop();
    this.input.dispose();
    this.graphics.dispose();
  }
}
