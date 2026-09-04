import React, { useState } from 'react';
import { InputManager } from '../input/InputManager';

interface MobileSprintButtonProps {
  input: InputManager;
}

export function MobileSprintButton({ input }: MobileSprintButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleStart = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsPressed(true);
    input.requestDash();
    input.setTouchSprint(true);
  };

  const handleEnd = () => {
    setIsPressed(false);
    input.setTouchSprint(false);
  };

  return (
    <button
      className={`pointer-events-auto absolute h-[68px] w-[68px] touch-none select-none rounded-full border-2 transition-all duration-150 flex items-center justify-center z-30 shadow-2xl backdrop-blur-md ${
        isPressed
          ? 'scale-90 bg-emerald-400/50 border-cyan-300 shadow-[0_0_24px_rgba(52,211,153,0.85)]'
          : 'bg-black/45 border-emerald-400/60 shadow-[0_0_14px_rgba(16,185,129,0.35)] active:scale-90'
      }`}
      style={{
        right: 'max(7.2rem, calc(env(safe-area-inset-right) + 5.8rem))',
        bottom: 'max(1.5rem, env(safe-area-inset-bottom))',
      }}
      onPointerDown={handleStart}
      onPointerUp={handleEnd}
      onPointerCancel={handleEnd}
      onPointerLeave={handleEnd}
      title="Sprint Boost (Shift no PC)"
      aria-label="Sprint Boost"
    >
      {/* Wind Dash / Speed Trail SVG Icon (Genshin Style) */}
      <svg
        viewBox="0 0 24 24"
        className={`w-8 h-8 pointer-events-none transition-transform duration-150 ${
          isPressed ? 'scale-110 text-cyan-200 drop-shadow-[0_0_8px_#38bdf8]' : 'text-emerald-300'
        }`}
        fill="currentColor"
      >
        {/* Aerodynamic triple wind streak / rush wings */}
        <path d="M4 6.5C4 6.5 8 6 12 7.5C14.5 8.5 17 10.5 17 10.5L14.5 11.2C14.5 11.2 12.5 9.8 10 9.2C7 8.5 4 8.5 4 8.5V6.5Z" />
        <path d="M2 11.5C2 11.5 7.5 11 13 12.5C17 13.5 21 17 21 17L18 17.8C18 17.8 15 15.2 11.5 14.5C7.5 13.7 2 13.5 2 13.5V11.5Z" />
        <path d="M5 16.5C5 16.5 8.5 16.2 12 17.2C14 17.8 16.5 19.2 16.5 19.2L14.2 19.8C14.2 19.8 12.5 18.7 10.5 18.2C8 17.6 5 17.8 5 17.8V16.5Z" />
      </svg>
    </button>
  );
}
