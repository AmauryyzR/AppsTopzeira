export const FIXED_DT = 1 / 60; // 16.666 ms
export const MAX_DELTA = 0.05; // 50 ms max frame delta to prevent spiral of death
export const MAX_SUB_STEPS = 4; // Maximum simulation updates per animation frame

export type StepCallback = (fixedDt: number) => void;
export type RenderCallback = (alpha: number, frameDelta: number) => void;

export class FixedStepLoop {
  private running = false;
  private rafId = 0;
  private lastTime = 0;
  private accumulator = 0;

  private onStep: StepCallback;
  private onRender: RenderCallback;

  constructor(onStep: StepCallback, onRender: RenderCallback) {
    this.onStep = onStep;
    this.onRender = onRender;
  }

  public start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.accumulator = 0;
    this.tick(this.lastTime);
  }

  public stop() {
    this.running = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = 0;
    }
  }

  public isRunning(): boolean {
    return this.running;
  }

  public reset() {
    this.accumulator = 0;
    this.lastTime = performance.now();
  }

  private tick = (currentTime: number) => {
    if (!this.running) return;
    this.rafId = requestAnimationFrame(this.tick);

    let frameDelta = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    // Clamp frameDelta to avoid large jumps if tab was unfocused or throttled
    if (frameDelta > MAX_DELTA) {
      frameDelta = MAX_DELTA;
    }
    if (frameDelta < 0) {
      frameDelta = 0;
    }

    this.accumulator += frameDelta;

    // Execute fixed simulation steps
    let steps = 0;
    while (this.accumulator >= FIXED_DT && steps < MAX_SUB_STEPS) {
      this.onStep(FIXED_DT);
      this.accumulator -= FIXED_DT;
      steps++;
    }

    // If still overloaded after MAX_SUB_STEPS, discard remaining accumulator
    if (this.accumulator >= FIXED_DT) {
      this.accumulator = 0;
    }

    // Alpha interpolation factor between previous and current state [0..1]
    const alpha = Math.min(1, Math.max(0, this.accumulator / FIXED_DT));

    this.onRender(alpha, frameDelta);
  };
}
