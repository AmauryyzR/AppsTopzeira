import React from 'react';
import { GameMode, GameState } from '../types';
import { saveManager } from '../store/SaveManager';
import { audioManager } from '../audio/AudioManager';

interface GameOverProps {
  score: number;
  mode: GameMode;
  onRetry: () => void;
  onMenu: () => void;
}

export default function GameOverView({ score, mode, onRetry, onMenu }: GameOverProps) {
  const highScore = saveManager.data.highScores[mode] || 0;
  const isNewRecord = score > 0 && score >= highScore; // Simplistic check since it's already saved

  const handleRetry = () => {
    audioManager.playClick();
    onRetry();
  };

  const handleMenu = () => {
    audioManager.playClick();
    onMenu();
  };

  return (
    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center z-50 p-6 pb-20 overflow-y-auto custom-scrollbar">
      <div className="text-center mb-12 animate-in slide-in-from-bottom-8 duration-500 fade-in">
        <h2 className="text-6xl font-black text-red-500 tracking-widest mb-4 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">
          GAME OVER
        </h2>
        {isNewRecord && (
          <div className="text-amber-400 font-bold tracking-widest text-xl animate-pulse">
            ★ NEW HIGH SCORE ★
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-8 mb-12 w-full max-w-md animate-in slide-in-from-bottom-12 duration-700 fade-in">
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-center">
          <div className="text-slate-500 text-xs font-bold tracking-widest mb-2">SCORE</div>
          <div className="text-4xl font-mono font-bold text-white">{score.toLocaleString()}</div>
        </div>
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-center">
          <div className="text-slate-500 text-xs font-bold tracking-widest mb-2">BEST</div>
          <div className="text-4xl font-mono font-bold text-emerald-400">{highScore.toLocaleString()}</div>
        </div>
      </div>

      <div className="flex gap-4 animate-in slide-in-from-bottom-16 duration-1000 fade-in">
        <button 
          onClick={handleRetry}
          className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xl tracking-wider rounded-2xl transition-all hover:scale-105"
        >
          PLAY AGAIN
        </button>
        <button 
          onClick={handleMenu}
          className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold text-lg rounded-2xl transition-colors border border-slate-700"
        >
          MENU
        </button>
      </div>
    </div>
  );
}
