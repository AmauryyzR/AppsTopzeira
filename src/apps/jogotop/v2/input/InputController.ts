import { GameplayInput } from '../types';

export class InputController {
  public moveX = 0;
  public moveZ = 0;

  private keys = new Set<string>();
  private touchVector = { x: 0, z: 0 };
  private jumpQueued = false;
  private touchJumpHeld = false;
  private interactQueued = false;
  private touchInteractHeld = false;

  private attached = false;

  public setTouchVector(x: number, y: number) {
    this.touchVector.x = x;
    this.touchVector.z = y;
  }

  public requestJump() {
    this.jumpQueued = true;
  }

  public setTouchJump(held: boolean) {
    this.touchJumpHeld = held;
  }

  public requestInteract() {
    this.interactQueued = true;
  }

  public setTouchInteract(held: boolean) {
    this.touchInteractHeld = held;
  }

  public isJumpHeld(): boolean {
    return this.keys.has('Space') || this.touchJumpHeld;
  }

  public consumeJump(): boolean {
    const j = this.jumpQueued;
    this.jumpQueued = false;
    return j;
  }

  public consumeInteract(): boolean {
    const i = this.interactQueued || this.touchInteractHeld;
    this.interactQueued = false;
    return i;
  }

  public update(): GameplayInput {
    let kx = 0;
    let kz = 0;

    if (this.keys.has('KeyW') || this.keys.has('ArrowUp')) kz -= 1;
    if (this.keys.has('KeyS') || this.keys.has('ArrowDown')) kz += 1;
    if (this.keys.has('KeyA') || this.keys.has('ArrowLeft')) kx -= 1;
    if (this.keys.has('KeyD') || this.keys.has('ArrowRight')) kx += 1;

    let x = kx + this.touchVector.x;
    let z = kz + this.touchVector.z;
    const len = Math.hypot(x, z);
    if (len > 1) {
      x /= len;
      z /= len;
    }

    this.moveX = x;
    this.moveZ = z;

    const jumpPressed = this.consumeJump();
    const jumpHeld = this.isJumpHeld();
    const interactPressed = this.consumeInteract();

    return {
      moveX: this.moveX,
      moveZ: this.moveZ,
      jumpPressed,
      jumpHeld,
      interactPressed,
    };
  }

  public attach() {
    if (this.attached || typeof window === 'undefined') return;
    this.attached = true;
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('blur', this.onBlur);
  }

  public dispose() {
    if (!this.attached || typeof window === 'undefined') return;
    this.attached = false;
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('blur', this.onBlur);
    this.keys.clear();
  }

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
    this.touchVector.x = 0;
    this.touchVector.z = 0;
    this.touchJumpHeld = false;
  };
}
