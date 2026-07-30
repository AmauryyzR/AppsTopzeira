import React from 'react';
import { saveManager } from '../store/SaveManager';
import { audioManager } from '../audio/AudioManager';

interface StatsProps {
  onBack: () => void;
}

export default function StatsView({ onBack }: StatsProps) {
  const stats = saveManager.data.stats;

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 p-4 md:p-8 relative overflow-hidden text-white">
      <button 
        onClick={() => { audioManager.playClick(); onBack(); }}
        className="absolute top-8 left-8 text-slate-400 hover:text-white flex items-center gap-2 font-bold transition-colors"
      >
        ← BACK
      </button>

      <div className="mt-20 max-w-4xl w-full mx-auto flex-1 overflow-y-auto pb-24 custom-scrollbar">
        <h2 className="text-4xl font-black mb-8 tracking-tight text-center">STATISTICS</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatBox label="GAMES PLAYED" value={stats.gamesPlayed} color="text-sky-400" />
          <StatBox label="TOTAL SCORE" value={stats.totalScore} color="text-emerald-400" />
          <StatBox label="FOOD EATEN" value={stats.foodEaten} color="text-amber-400" />
          <StatBox label="MAX LENGTH" value={stats.maxLength} color="text-pink-400" />
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
      <div className="text-slate-500 text-xs font-bold tracking-widest mb-2">{label}</div>
      <div className={`text-4xl font-mono font-bold ${color}`}>{value.toLocaleString()}</div>
    </div>
  );
}
