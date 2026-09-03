import React, { useEffect, useRef, useState } from 'react';
import { GameEngine } from './engine/GameEngine';
import { InputManager } from './input/InputManager';
import { RobloxJoystick } from './components/RobloxJoystick';
import { MobileJumpButton } from './components/MobileJumpButton';
import { MobileFullscreenButton } from './components/MobileFullscreenButton';

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

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#c7e4fa] select-none touch-none">
      {/* Global CSS for full-screen WebGL canvas and mobile controls */}
      <style>{`
        canvas {
          width: 100% !important;
          height: 100% !important;
          display: block !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          touch-action: none !important;
        }
        @media (hover: hover) and (pointer: fine) {
          .tg-mobile-controls { display: none !important; }
        }
      `}</style>

      {/* 3D WebGL Canvas Viewport */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden" />

      {/* Mobile Touch Controls Layer */}
      <div className="tg-mobile-controls">
        <MobileFullscreenButton />
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
