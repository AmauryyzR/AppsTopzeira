import React, { useRef } from 'react';
import { InputManager } from '../input/InputManager';

interface RobloxJoystickProps {
  input: InputManager;
}

export function RobloxJoystick({ input }: RobloxJoystickProps) {
  const baseRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const activePointerId = useRef<number | null>(null);
  const RADIUS = 48;

  const setKnob = (dx: number, dy: number) => {
    if (knobRef.current) {
      knobRef.current.style.transform = `translate(${dx}px, ${dy}px)`;
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    activePointerId.current = e.pointerId;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    handlePointerMove(e);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (activePointerId.current !== e.pointerId || !baseRef.current) return;
    const rect = baseRef.current.getBoundingClientRect();
    let dx = e.clientX - (rect.left + rect.width / 2);
    let dy = e.clientY - (rect.top + rect.height / 2);

    const len = Math.hypot(dx, dy);
    if (len > RADIUS) {
      dx = (dx / len) * RADIUS;
      dy = (dy / len) * RADIUS;
    }

    setKnob(dx, dy);
    input.setTouchMove(dx / RADIUS, dy / RADIUS);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (activePointerId.current !== e.pointerId) return;
    activePointerId.current = null;
    setKnob(0, 0);
    input.setTouchMove(0, 0);
  };

  return (
    <div
      ref={baseRef}
      className="pointer-events-auto absolute bottom-6 left-6 h-32 w-32 touch-none select-none rounded-full border-2 border-white/40 bg-black/35 shadow-2xl backdrop-blur-md flex items-center justify-center z-30"
      style={{
        left: 'max(1.25rem, env(safe-area-inset-left))',
        bottom: 'max(1.25rem, env(safe-area-inset-bottom))',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Inner guide ring */}
      <div className="h-16 w-16 rounded-full border border-white/25 pointer-events-none" />

      {/* Roblox Inner Knob */}
      <div
        ref={knobRef}
        className="absolute h-14 w-14 rounded-full border-2 border-white/90 bg-gradient-to-b from-white/95 to-white/60 shadow-lg pointer-events-none transition-transform duration-75"
      />
    </div>
  );
}
