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
    <div className="w-full h-full overflow-y-auto overflow-x-hidden bg-slate-950 relative custom-scrollbar flex flex-col items-center py-20 pb-36 md:py-6 md:pb-6 justify-start md:justify-center">
      {/* Top Header Bar (Mobile only) */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-900/50 flex items-center justify-between px-6 z-30 md:hidden">
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

      <div className="z-10 flex flex-col items-center max-w-4xl w-full">
        {/* Title */}
        <div className="mb-12 text-center hidden md:block">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-500 drop-shadow-sm mb-2">
            SNAKE ARCADE
          </h1>
          <p className="text-slate-400 tracking-[0.3em] text-sm md:text-base font-medium">PREMIUM EXPERIENCE</p>
        </div>

        {/* Stats bar */}
        <div className="flex gap-8 mb-12 bg-slate-900/50 p-4 rounded-2xl border border-slate-800/50 backdrop-blur-md">
          <div className="flex flex-col items-center">
            <span className="text-slate-500 text-xs font-bold tracking-wider">COINS</span>
            <span className="text-amber-400 font-mono text-xl font-bold">{coins.toLocaleString()}</span>
          </div>
          <div className="w-px bg-slate-800" />
          <div className="flex flex-col items-center">
            <span className="text-slate-500 text-xs font-bold tracking-wider">SKINS</span>
            <span className="text-sky-400 font-mono text-xl font-bold">{data.unlockedSkins.length}</span>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="w-full max-w-2xl mb-12">
          <h2 className="text-slate-400 text-sm font-bold tracking-wider mb-4 px-2">SELECT MODE</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MODES.map(mode => {
              const isSelected = selectedMode === mode.id;
              const highScore = data.highScores[mode.id] || 0;
              return (
                <button
                  key={mode.id}
                  onClick={() => { audioManager.playClick(); onSelectMode(mode.id); }}
                  className={cn(
                    "relative flex flex-col items-start p-5 rounded-2xl text-left transition-all duration-300 border-2 overflow-hidden group",
                    isSelected
                      ? "bg-slate-800/80 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.15)] transform scale-105"
                      : "bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50"
                  )}
                >
                  {isSelected && <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent pointer-events-none" />}
                  <span className="text-3xl mb-3">{mode.icon}</span>
                  <h3 className={cn("font-bold text-lg mb-1", isSelected ? "text-white" : "text-slate-200")}>{mode.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4 flex-grow">{mode.description}</p>
                  <div className="mt-auto pt-3 border-t border-slate-800/50 w-full flex justify-between items-center">
                    <span className="text-[10px] text-slate-500 font-bold">BEST</span>
                    <span className="text-sm font-mono font-bold text-slate-300">{highScore}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 w-full max-w-lg px-4 md:px-0">
          <button
            onClick={handleStart}
            className="fixed bottom-6 left-6 z-20 py-4 px-8 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-lg tracking-wider rounded-2xl transition-all shadow-[0_4px_20px_rgba(16,185,129,0.3)] md:relative md:bottom-auto md:left-auto md:z-0 md:flex-1 md:py-4 md:px-0 md:shadow-none w-[calc(50%-1.5rem)] max-w-[200px] md:w-auto md:max-w-none text-center cursor-pointer"
          >
            PLAY NOW
          </button>
          <div className="grid grid-cols-2 gap-4 w-full md:flex md:w-auto">
            <button
              onClick={() => handleNav(GameState.STORE)}
              className="py-4 px-6 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-colors border border-slate-700 flex items-center justify-center gap-2 w-full md:w-auto md:px-6 cursor-pointer"
            >
              <span>🎨</span> SKINS
            </button>
            <button
              onClick={() => handleNav(GameState.ACHIEVEMENTS)}
              className="py-4 px-6 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-colors border border-slate-700 flex items-center justify-center gap-2 w-full md:w-auto md:px-6 cursor-pointer"
            >
              <span>🏆</span> <span className="md:hidden">ACHIEVEMENTS</span>
            </button>
            <button
              onClick={() => handleNav(GameState.STATS)}
              className="py-4 px-6 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-colors border border-slate-700 flex items-center justify-center gap-2 w-full md:w-auto md:px-6 cursor-pointer"
            >
              <span>📊</span> <span className="md:hidden">STATS</span>
            </button>
            <button
              onClick={() => handleNav(GameState.SETTINGS)}
              className="py-4 px-6 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-colors border border-slate-700 flex items-center justify-center gap-2 w-full md:w-auto md:px-6 cursor-pointer"
            >
              <span>⚙️</span> <span className="md:hidden">SETTINGS</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
