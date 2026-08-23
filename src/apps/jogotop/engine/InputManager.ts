export class InputManager {
  readonly vector = { x: 0, z: 0 };
  private keys = new Set<string>();
  private touch = { x: 0, y: 0 };
  private jumpQueued = false;
  private touchJump = false;
  private interactQueued = false;
  private touchInteract = false;

  private onKeyDown = (e: KeyboardEvent) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
      e.preventDefault();
    }
    if (e.code === 'Space' && !e.repeat) {
      this.jumpQueued = true;
    }
    if ((e.code === 'KeyE' || e.code === 'KeyF' || e.code === 'Enter') && !e.repeat) {
      this.interactQueued = true;
    }
    this.keys.add(e.code);
  };

  private onKeyUp = (e: KeyboardEvent) => {
    this.keys.delete(e.code);
  };

  private onBlur = () => {
    this.keys.clear();
  };

  setTouchVector(x: number, y: number) {
    this.touch.x = x;
    this.touch.y = y;
  }

  requestJump() {
    this.jumpQueued = true;
  }

  requestInteract() {
    this.interactQueued = true;
  }

  setTouchJump(held: boolean) {
    this.touchJump = held;
  }

  setTouchInteract(held: boolean) {
    this.touchInteract = held;
  }

  isJumpHeld(): boolean {
    return this.keys.has('Space') || this.touchJump;
  }

  consumeJump(): boolean {
    const j = this.jumpQueued;
    this.jumpQueued = false;
    return j;
  }

  consumeInteract(): boolean {
    const i = this.interactQueued || this.touchInteract;
    this.interactQueued = false;
    this.touchInteract = false;
    return i;
  }

  update() {
    let x = 0;
    let z = 0;
    if (this.keys.has('KeyW') || this.keys.has('ArrowUp')) z -= 1;
    if (this.keys.has('KeyS') || this.keys.has('ArrowDown')) z += 1;
    if (this.keys.has('KeyA') || this.keys.has('ArrowLeft')) x -= 1;
    if (this.keys.has('KeyD') || this.keys.has('ArrowRight')) x += 1;
    x += this.touch.x;
    z += this.touch.y;
    const len = Math.hypot(x, z);
    if (len > 1) {
      x /= len;
      z /= len;
    }
    this.vector.x = x;
    this.vector.z = z;
  }

  attach() {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('blur', this.onBlur);
  }

  dispose() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('blur', this.onBlur);
    this.keys.clear();
  }
}
