export interface InputState {
  moveX: number; // -1 (left) to 1 (right)
  moveZ: number; // -1 (forward) to 1 (backward)
  isJumping: boolean;
  isSprinting: boolean;
  isDashTriggered: boolean;
}

export class InputManager {
  private keys = new Set<string>();
  private touchMoveX = 0;
  private touchMoveZ = 0;
  private touchJump = false;
  private jumpRequested = false;
  private touchSprint = false;
  private dashRequested = false;

  private onKeyDown = (e: KeyboardEvent) => {
    // Prevent default scrolling on space and arrow keys
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
      if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
      }
    }
    if ((e.code === 'ShiftLeft' || e.code === 'ShiftRight') && !this.keys.has(e.code)) {
      this.dashRequested = true;
    }
    this.keys.add(e.code);
    if (e.code === 'Space') {
      this.jumpRequested = true;
    }
  };

  private onKeyUp = (e: KeyboardEvent) => {
    this.keys.delete(e.code);
  };

  private onBlur = () => {
    this.keys.clear();
    this.jumpRequested = false;
    this.dashRequested = false;
  };

  public attach() {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('blur', this.onBlur);
  }

  public dispose() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('blur', this.onBlur);
    this.keys.clear();
  }

  public setTouchMove(x: number, z: number) {
    this.touchMoveX = Math.max(-1, Math.min(1, x));
    this.touchMoveZ = Math.max(-1, Math.min(1, z));
  }

  public setTouchJump(jumping: boolean) {
    this.touchJump = jumping;
    if (jumping) {
      this.jumpRequested = true;
    }
  }

  public setTouchSprint(sprinting: boolean) {
    this.touchSprint = sprinting;
    if (sprinting) {
      this.dashRequested = true;
    }
  }

  public requestDash() {
    this.dashRequested = true;
  }

  public requestJump() {
    this.jumpRequested = true;
  }

  public sampleInput(): InputState {
    let keyX = 0;
    let keyZ = 0;

    if (this.keys.has('KeyW') || this.keys.has('ArrowUp')) keyZ -= 1;
    if (this.keys.has('KeyS') || this.keys.has('ArrowDown')) keyZ += 1;
    if (this.keys.has('KeyA') || this.keys.has('ArrowLeft')) keyX -= 1;
    if (this.keys.has('KeyD') || this.keys.has('ArrowRight')) keyX += 1;

    // Normalize diagonal keyboard movement
    const keyLen = Math.hypot(keyX, keyZ);
    if (keyLen > 0) {
      keyX /= keyLen;
      keyZ /= keyLen;
    }

    // Combine keyboard and touch inputs
    let moveX = keyX + this.touchMoveX;
    let moveZ = keyZ + this.touchMoveZ;

    const totalLen = Math.hypot(moveX, moveZ);
    if (totalLen > 1) {
      moveX /= totalLen;
      moveZ /= totalLen;
    }

    const isJumping = this.jumpRequested || this.touchJump || this.keys.has('Space');
    // Consume single-frame jump impulse
    this.jumpRequested = false;

    const isSprinting = this.keys.has('ShiftLeft') || this.keys.has('ShiftRight') || this.touchSprint;
    const isDashTriggered = this.dashRequested;
    this.dashRequested = false;

    return {
      moveX,
      moveZ,
      isJumping,
      isSprinting,
      isDashTriggered,
    };
  }
}
