import { Position } from '../types';

export class InputManager {
  private buffer: Position[] = [];
  private currentDirection: Position = { x: 1, y: 0 };
  
  // Touch tracking
  private touchStartX = 0;
  private touchStartY = 0;

  constructor() {
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('touchstart', this.handleTouchStart, { passive: false });
    window.addEventListener('touchend', this.handleTouchEnd, { passive: false });
  }

  public cleanup() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('touchstart', this.handleTouchStart);
    window.removeEventListener('touchend', this.handleTouchEnd);
  }

  public reset(initialDirection: Position = { x: 1, y: 0 }) {
    this.currentDirection = initialDirection;
    this.buffer = [];
  }

  public getDirection(): Position {
    if (this.buffer.length > 0) {
      const nextDir = this.buffer.shift()!;
      this.currentDirection = nextDir;
    }
    return this.currentDirection;
  }

  private queueDirection(newDir: Position) {
    const lastDir = this.buffer.length > 0 ? this.buffer[this.buffer.length - 1] : this.currentDirection;
    
    // Prevent 180 degree turns
    if (lastDir.x !== 0 && newDir.x === -lastDir.x) return;
    if (lastDir.y !== 0 && newDir.y === -lastDir.y) return;

    // Buffer up to 2 moves to allow fast cornering
    if (this.buffer.length < 2) {
      this.buffer.push(newDir);
    }
  }

  private handleKeyDown(e: KeyboardEvent) {
    // Prevent default scrolling for arrow keys and WASD if in game context
    // We'll just prevent default for arrows
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();
    }

    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        this.queueDirection({ x: 0, y: -1 });
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        this.queueDirection({ x: 0, y: 1 });
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        this.queueDirection({ x: -1, y: 0 });
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        this.queueDirection({ x: 1, y: 0 });
        break;
    }
  }

  private handleTouchStart(e: TouchEvent) {
    if (e.target instanceof HTMLCanvasElement) {
      e.preventDefault(); // prevent scrolling while swiping on canvas
    }
    this.touchStartX = e.changedTouches[0].screenX;
    this.touchStartY = e.changedTouches[0].screenY;
  }

  private handleTouchEnd(e: TouchEvent) {
    if (e.target instanceof HTMLCanvasElement) {
      e.preventDefault();
    }
    const touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;
    
    const dx = touchEndX - this.touchStartX;
    const dy = touchEndY - this.touchStartY;
    
    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal swipe
      if (Math.abs(dx) > 30) {
        if (dx > 0) this.queueDirection({ x: 1, y: 0 });
        else this.queueDirection({ x: -1, y: 0 });
      }
    } else {
      // Vertical swipe
      if (Math.abs(dy) > 30) {
        if (dy > 0) this.queueDirection({ x: 0, y: 1 });
        else this.queueDirection({ x: 0, y: -1 });
      }
    }
  }
}
