import React from 'react';
import { saveManager } from '../store/SaveManager';
import { audioManager } from '../audio/AudioManager';
import { ACHIEVEMENTS } from '../data/achievements';
import { cn } from '../utils';

interface AchievementsProps {
  onBack: () => void;
}

export default function AchievementsView({ onBack }: AchievementsProps) {
  const unlocked = saveManager.data.unlockedAchievements;

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 p-4 md:p-8 relative overflow-hidden text-white">
      <button 
        onClick={() => { audioManager.playClick(); onBack(); }}
        className="absolute top-8 left-8 text-slate-400 hover:text-white flex items-center gap-2 font-bold transition-colors z-10"
      >
        ← BACK
      </button>

      <div className="mt-20 max-w-5xl w-full mx-auto flex-1 overflow-y-auto pb-24 custom-scrollbar px-4">
        <h2 className="text-4xl font-black mb-2 tracking-tight text-center">ACHIEVEMENTS</h2>
        <div className="text-center text-slate-400 font-mono mb-8 font-bold">
           {unlocked.length} / {ACHIEVEMENTS.length}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ACHIEVEMENTS.map(ach => {
            const isUnlocked = unlocked.includes(ach.id);
            return (
              <div 
                key={ach.id}
                className={cn(
                  "p-4 rounded-2xl border flex items-center gap-4 transition-all duration-300",
                  isUnlocked 
                    ? "bg-emerald-900/20 border-emerald-500/50" 
                    : "bg-slate-900 border-slate-800 opacity-60 grayscale"
                )}
              >
                <div className="text-4xl">{ach.icon}</div>
                <div>
                  <div className={cn("font-bold text-lg", isUnlocked ? "text-emerald-400" : "text-slate-300")}>
                    {ach.title}
                  </div>
                  <div className="text-sm text-slate-400">
                    {ach.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
