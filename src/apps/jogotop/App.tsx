import React, { useEffect, useRef, useState } from 'react';
import { GameEngine } from './engine/GameEngine';
import { InputManager } from './engine/InputManager';

function RobloxThumbstick({ input }: { input: InputManager }) {
  const baseRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const activeId = useRef<number | null>(null);
  const RADIUS = 46;

  const setKnob = (dx: number, dy: number) => {
    if (knobRef.current) knobRef.current.style.transform = `translate(${dx}px, ${dy}px)`;
  };

  const handleDown = (e: React.PointerEvent) => {
    activeId.current = e.pointerId;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    handleMove(e);
  };

  const handleMove = (e: React.PointerEvent) => {
    if (activeId.current !== e.pointerId || !baseRef.current) return;
    const rect = baseRef.current.getBoundingClientRect();
    let dx = e.clientX - (rect.left + rect.width / 2);
    let dy = e.clientY - (rect.top + rect.height / 2);
    const len = Math.hypot(dx, dy);
    if (len > RADIUS) {
      dx = (dx / len) * RADIUS;
      dy = (dy / len) * RADIUS;
    }
    setKnob(dx, dy);
    input.setTouchVector(dx / RADIUS, dy / RADIUS);
  };

  const handleUp = (e: React.PointerEvent) => {
    if (activeId.current !== e.pointerId) return;
    activeId.current = null;
    setKnob(0, 0);
    input.setTouchVector(0, 0);
  };

  return (
    <div
      ref={baseRef}
      className="jt-joystick absolute bottom-6 left-6 h-32 w-32 touch-none select-none rounded-full border-2 border-white/40 bg-black/30 shadow-2xl backdrop-blur-md flex items-center justify-center z-30"
      style={{
        left: 'max(1.5rem, env(safe-area-inset-left))',
        bottom: 'max(1.5rem, env(safe-area-inset-bottom))',
      }}
      onPointerDown={handleDown}
      onPointerMove={handleMove}
      onPointerUp={handleUp}
      onPointerCancel={handleUp}
    >
      {/* Inner guide ring */}
      <div className="h-16 w-16 rounded-full border border-white/20 pointer-events-none" />

      {/* Roblox Inner Knob */}
      <div
        ref={knobRef}
        className="absolute h-14 w-14 rounded-full border-2 border-white/80 bg-gradient-to-b from-white/90 to-white/50 shadow-md pointer-events-none transition-transform duration-75"
      />
    </div>
  );
}

export default function JogoTopApp() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [input] = useState(() => new InputManager());
  const [ready, setReady] = useState(false);
  const [hintVisible, setHintVisible] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const prevTitle = document.title;
    document.title = 'JogoTop · Parque';
    input.attach();

    const engine = new GameEngine(containerRef.current!, input, () => setReady(true));
    const timer = window.setTimeout(() => setHintVisible(false), 7000);

    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFsChange);
    document.addEventListener('webkitfullscreenchange', onFsChange);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('fullscreenchange', onFsChange);
      document.removeEventListener('webkitfullscreenchange', onFsChange);
      engine.dispose();
      input.dispose();
      document.title = prevTitle;
    };
  }, [input]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      const docEl = document.documentElement as unknown as {
        requestFullscreen?: () => Promise<void>;
        webkitRequestFullscreen?: () => Promise<void>;
      };
      if (docEl.requestFullscreen) {
        docEl.requestFullscreen().catch(() => {});
      } else if (docEl.webkitRequestFullscreen) {
        docEl.webkitRequestFullscreen().catch(() => {});
      }
    } else {
      const doc = document as unknown as {
        exitFullscreen?: () => Promise<void>;
        webkitExitFullscreen?: () => Promise<void>;
      };
      if (doc.exitFullscreen) {
        doc.exitFullscreen().catch(() => {});
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen().catch(() => {});
      }
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#7dc5f5] select-none touch-none">
      <style>{`
        @media (hover: hover) and (pointer: fine) {
          .jt-joystick, .jt-touchbtn { display: none !important; }
        }
      `}</style>

      {/* 3D Scene Viewport */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />

      {/* Minimal Header Badge */}
      <div
        className="absolute top-3 left-3 rounded-full bg-black/40 px-3.5 py-1.5 text-[11px] font-bold tracking-[0.2em] text-white backdrop-blur-md shadow-md pointer-events-none z-20"
        style={{
          top: 'max(0.75rem, env(safe-area-inset-top))',
          left: 'max(0.75rem, env(safe-area-inset-left))',
        }}
      >
        JOGOTOP · PARQUE
      </div>

      {/* Mobile Fullscreen (F11) Button on top-right */}
      <button
        onClick={toggleFullscreen}
        className="jt-fullscreen-btn absolute top-3 right-3 h-10 w-10 touch-none select-none rounded-full border border-white/40 bg-black/40 text-white backdrop-blur-md shadow-lg active:scale-90 transition-all flex items-center justify-center z-30"
        style={{
          top: 'max(0.75rem, env(safe-area-inset-top))',
          right: 'max(0.75rem, env(safe-area-inset-right))',
        }}
        title="Tela Cheia (F11)"
      >
        {isFullscreen ? (
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-white stroke-2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-white stroke-2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
          </svg>
        )}
      </button>

      {/* Context Hint */}
      <div
        className={`absolute top-3 right-16 rounded-full bg-black/40 px-3.5 py-1.5 text-[11px] font-semibold text-white/90 backdrop-blur-md shadow-md transition-opacity duration-700 pointer-events-none z-20 ${
          ready && hintVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          top: 'max(0.75rem, env(safe-area-inset-top))',
          right: 'calc(max(0.75rem, env(safe-area-inset-right)) + 3.2rem)',
        }}
      >
        Mova pelo analógico · Toque para pular · Arraste a tela para girar a câmera
      </div>

      {/* Clean Loading Screen */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-sky-400 to-emerald-300 transition-opacity duration-700 z-50 ${
          ready ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
      >
        <div className="font-syne text-4xl font-black tracking-tight text-emerald-950 drop-shadow-sm">JogoTop</div>
        <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-emerald-950/20 border-t-emerald-900" />
        <div className="text-xs font-semibold text-emerald-950/70">Carregando o parque...</div>
      </div>

      {/* Roblox-Style Mobile Jump Button */}
      <button
        className="jt-touchbtn absolute bottom-7 right-7 h-[74px] w-[74px] touch-none select-none rounded-full border-2 border-white/50 bg-black/35 text-white backdrop-blur-md shadow-2xl active:bg-white/40 active:scale-90 transition-transform flex items-center justify-center z-30"
        style={{
          right: 'max(1.75rem, env(safe-area-inset-right))',
          bottom: 'max(1.75rem, env(safe-area-inset-bottom))',
        }}
        onPointerDown={(e) => {
          e.preventDefault();
          input.requestJump();
          input.setTouchJump(true);
        }}
        onPointerUp={() => input.setTouchJump(false)}
        onPointerCancel={() => input.setTouchJump(false)}
        onPointerLeave={() => input.setTouchJump(false)}
      >
        {/* Crisp Upward Arrow (Roblox Jump Icon) */}
        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white drop-shadow-md pointer-events-none">
          <path d="M12 4l-8 8h5v8h6v-8h5z" />
        </svg>
      </button>

      {/* Roblox-Style Mobile Thumbstick */}
      <RobloxThumbstick input={input} />
    </div>
  );
}
