import React, { useEffect, useRef, useState } from 'react';
import { GameEngine } from './engine/GameEngine';
import { InputManager } from './input/InputManager';
import { RobloxJoystick } from './components/RobloxJoystick';
import { MobileJumpButton } from './components/MobileJumpButton';

export default function App3DGame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [input] = useState(() => new InputManager());
  const engineRef = useRef<GameEngine | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const prevTitle = document.title;
    document.title = '3D Game · Parque';

    input.attach();

    if (containerRef.current) {
      engineRef.current = new GameEngine(containerRef.current, input, () => {
        setReady(true);
      });
    }

    return () => {
      engineRef.current?.dispose();
      engineRef.current = null;
      input.dispose();
      document.title = prevTitle;
    };
  }, [input]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleRespawn = () => {
    engineRef.current?.respawnPlayer();
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#7dc5f5] select-none touch-none">
      {/* Hide mobile controls when fine mouse pointer is used */}
      <style>{`
        @media (hover: hover) and (pointer: fine) {
          .tg-mobile-controls { display: none !important; }
        }
      `}</style>

      {/* 3D WebGL Canvas Viewport */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />

      {/* Top-Left Game Badge */}
      <div
        className="absolute top-3 left-3 rounded-full bg-black/45 px-3.5 py-1.5 text-[11px] font-black tracking-[0.2em] text-white backdrop-blur-md shadow-lg pointer-events-none z-20 flex items-center gap-1.5 border border-white/10"
        style={{
          top: 'max(0.75rem, env(safe-area-inset-top))',
          left: 'max(0.75rem, env(safe-area-inset-left))',
        }}
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span>3DGAME · PARQUE</span>
      </div>

      {/* Top-Right Action Controls */}
      <div
        className="absolute top-3 right-3 flex items-center gap-2 z-30 pointer-events-auto"
        style={{
          top: 'max(0.75rem, env(safe-area-inset-top))',
          right: 'max(0.75rem, env(safe-area-inset-right))',
        }}
      >
        {/* Reset / Respawn Button */}
        <button
          onClick={handleRespawn}
          className="h-8 px-3 rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md shadow-lg active:scale-95 transition-transform flex items-center gap-1.5 text-xs font-bold"
          title="Respawn Player"
        >
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-white stroke-2">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          <span>RESPAWN</span>
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="h-8 w-8 rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md shadow-lg active:scale-95 transition-transform flex items-center justify-center"
          title="Tela Cheia"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-white stroke-2">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
          </svg>
        </button>
      </div>

      {/* Mobile Touch Controls Layer */}
      <div className="tg-mobile-controls">
        <RobloxJoystick input={input} />
        <MobileJumpButton input={input} />
      </div>

      {/* Loading Overlay */}
      {!ready && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-sky-400 to-emerald-400 text-slate-900 z-50 transition-opacity duration-500">
          <div className="text-3xl font-black italic tracking-wider text-slate-900 drop-shadow-sm">3D GAME</div>
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-900/20 border-t-slate-900" />
          <div className="text-xs font-bold text-slate-800">Carregando o parque...</div>
        </div>
      )}
    </div>
  );
}
