import React, { useState, useEffect } from 'react';
import { GameMode, GameState } from '../types';
import { saveManager } from '../store/SaveManager';
import { audioManager } from '../audio/AudioManager';
import { MODES } from '../data/modes';
import { cn } from '../utils';

interface MainMenuProps {
  selectedMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  onStartGame: (mode: GameMode) => void;
  onNavigate: (state: GameState) => void;
}

export default function MainMenu({ selectedMode, onSelectMode, onStartGame, onNavigate }: MainMenuProps) {
  const [coins, setCoins] = useState(saveManager.data.coins);
  const data = saveManager.data;

  useEffect(() => {
    return saveManager.subscribe(() => {
      setCoins(saveManager.data.coins);
    });
  }, []);

  const handleStart = () => {
    audioManager.playClick();
    onStartGame(selectedMode);
  };

  const handleNav = (state: GameState) => {
    audioManager.playClick();
    onNavigate(state);
  };

  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden bg-slate-950 relative custom-scrollbar flex flex-col items-center py-6 px-4 pb-16 justify-start sm:justify-center">
      {/* Top Header Bar (Mobile only) */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-900/50 flex items-center justify-between px-6 z-30 sm:hidden">
        <h1 className="text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
          SNAKE ARCADE
        </h1>
        <div className="flex items-center gap-2 bg-slate-900/60 px-3 py-1 rounded-full border border-slate-800">
          <span className="text-[10px] text-slate-500 font-bold">COINS</span>
          <span className="text-amber-400 font-mono text-sm font-bold">{coins.toLocaleString()}</span>
        </div>
      </div>
      {/* Background decorations */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-sky-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="z-10 flex flex-col items-center max-w-4xl w-full my-auto">
        {/* Title */}
        <div className="mb-6 sm:mb-8 text-center mt-12 sm:mt-0">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-500 drop-shadow-sm mb-1">
            SNAKE ARCADE
          </h1>
          <p className="text-slate-400 tracking-[0.3em] text-xs sm:text-sm font-medium">PREMIUM EXPERIENCE</p>
        </div>

        {/* Stats bar */}
        <div className="flex gap-6 sm:gap-8 mb-6 sm:mb-8 bg-slate-900/50 px-6 py-3 rounded-2xl border border-slate-800/50 backdrop-blur-md">
          <div className="flex flex-col items-center">
            <span className="text-slate-500 text-[10px] sm:text-xs font-bold tracking-wider">COINS</span>
            <span className="text-amber-400 font-mono text-lg sm:text-xl font-bold">{coins.toLocaleString()}</span>
          </div>
          <div className="w-px bg-slate-800" />
          <div className="flex flex-col items-center">
            <span className="text-slate-500 text-[10px] sm:text-xs font-bold tracking-wider">SKINS</span>
            <span className="text-sky-400 font-mono text-lg sm:text-xl font-bold">{data.unlockedSkins.length}</span>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="w-full max-w-2xl mb-6 sm:mb-8">
          <h2 className="text-slate-400 text-xs sm:text-sm font-bold tracking-wider mb-3 px-2">SELECT MODE</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {MODES.map(mode => {
              const isSelected = selectedMode === mode.id;
              const highScore = data.highScores[mode.id] || 0;
              return (
                <button
                  key={mode.id}
                  onClick={() => { audioManager.playClick(); onSelectMode(mode.id); }}
                  className={cn(
                    "relative flex flex-col items-start p-4 sm:p-5 rounded-2xl text-left transition-all duration-300 border-2 overflow-hidden group cursor-pointer",
                    isSelected
                      ? "bg-slate-800/80 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.15)] transform scale-[1.02]"
                      : "bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50"
                  )}
                >
                  {isSelected && <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent pointer-events-none" />}
                  <span className="text-2xl sm:text-3xl mb-2 sm:mb-3">{mode.icon}</span>
                  <h3 className={cn("font-bold text-base sm:text-lg mb-1", isSelected ? "text-white" : "text-slate-200")}>{mode.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-3 flex-grow">{mode.description}</p>
                  <div className="mt-auto pt-2 border-t border-slate-800/50 w-full flex justify-between items-center">
                    <span className="text-[10px] text-slate-500 font-bold">BEST</span>
                    <span className="text-xs sm:text-sm font-mono font-bold text-slate-300">{highScore}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-2xl px-2">
          <button
            onClick={handleStart}
            className="w-full sm:w-auto sm:flex-1 py-3.5 px-8 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base sm:text-lg tracking-wider rounded-2xl transition-all shadow-[0_4px_20px_rgba(16,185,129,0.3)] hover:scale-[1.02] active:scale-[0.98] text-center cursor-pointer flex items-center justify-center gap-2"
          >
            <span>▶</span> PLAY NOW
          </button>

          <div className="grid grid-cols-2 sm:flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => handleNav(GameState.STORE)}
              className="py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-2xl transition-all border border-slate-800 hover:border-slate-700 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>🎨</span> SKINS
            </button>
            <button
              onClick={() => handleNav(GameState.ACHIEVEMENTS)}
              className="py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-2xl transition-all border border-slate-800 hover:border-slate-700 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>🏆</span> CONQUISTAS
            </button>
            <button
              onClick={() => handleNav(GameState.STATS)}
              className="py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-2xl transition-all border border-slate-800 hover:border-slate-700 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>📊</span> STATS
            </button>
            <button
              onClick={() => handleNav(GameState.SETTINGS)}
              className="py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-2xl transition-all border border-slate-800 hover:border-slate-700 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>⚙️</span> AJUSTES
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
