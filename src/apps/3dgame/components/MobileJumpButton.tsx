import React from 'react';
import { InputManager } from '../input/InputManager';

interface MobileJumpButtonProps {
  input: InputManager;
}

export function MobileJumpButton({ input }: MobileJumpButtonProps) {
  return (
    <button
      className="pointer-events-auto absolute bottom-7 right-7 h-[74px] w-[74px] touch-none select-none rounded-full border-2 border-white/50 bg-black/40 text-white backdrop-blur-md shadow-2xl active:bg-white/40 active:scale-90 transition-transform flex items-center justify-center z-30"
      style={{
        right: 'max(1.5rem, env(safe-area-inset-right))',
        bottom: 'max(1.5rem, env(safe-area-inset-bottom))',
      }}
      onPointerDown={(e) => {
        e.preventDefault();
        input.requestJump();
        input.setTouchJump(true);
      }}
      onPointerUp={() => input.setTouchJump(false)}
      onPointerCancel={() => input.setTouchJump(false)}
      onPointerLeave={() => input.setTouchJump(false)}
      title="Pular (Espaço)"
    >
      {/* Upward Arrow (Roblox Jump Icon) */}
      <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white drop-shadow-md pointer-events-none">
        <path d="M12 4l-8 8h5v8h6v-8h5z" />
      </svg>
    </button>
  );
}
