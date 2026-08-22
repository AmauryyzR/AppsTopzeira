import React, { useState, useEffect } from 'react';
import { GameState } from '../types';
import { saveManager } from '../store/SaveManager';
import { audioManager } from '../audio/AudioManager';
import { SKINS } from '../data/skins';
import { cn } from '../utils';
import SkinPreviewCanvas from './SkinPreviewCanvas';

interface StoreProps {
  onBack: () => void;
}

export default function StoreView({ onBack }: StoreProps) {
  const [coins, setCoins] = useState(saveManager.data.coins);
  const [selectedSkin, setSelectedSkin] = useState(saveManager.data.selectedSkin);
  const [unlockedSkins, setUnlockedSkins] = useState<string[]>(saveManager.data.unlockedSkins);

  useEffect(() => {
    return saveManager.subscribe(() => {
      setCoins(saveManager.data.coins);
      setSelectedSkin(saveManager.data.selectedSkin);
      setUnlockedSkins([...saveManager.data.unlockedSkins]);
    });
  }, []);

  const handlePurchase = (skinId: string, price: number) => {
    if (unlockedSkins.includes(skinId)) {
      // Equip
      saveManager.data.selectedSkin = skinId;
      saveManager.save();
      audioManager.playClick();
    } else {
      // Buy
      if (saveManager.spendCoins(price)) {
        saveManager.unlockSkin(skinId);
        saveManager.data.selectedSkin = skinId;
        saveManager.save();
        audioManager.playPurchase();
      } else {
        audioManager.playError();
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 p-4 md:p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8">
        <div className="bg-slate-900/80 px-6 py-3 rounded-full border border-amber-500/30 flex items-center gap-3 backdrop-blur-md">
          <span className="text-slate-400 font-bold text-sm">BALANCE</span>
          <span className="text-amber-400 font-mono text-2xl font-bold">{coins.toLocaleString()}</span>
        </div>
      </div>

      <button 
        onClick={() => { audioManager.playClick(); onBack(); }}
        className="absolute top-8 left-8 text-slate-400 hover:text-white flex items-center gap-2 font-bold transition-colors"
      >
        ← BACK
      </button>

      <div className="mt-20 max-w-6xl w-full mx-auto flex-1 overflow-y-auto pb-24 pr-4 custom-scrollbar">
        <h2 className="text-4xl font-black text-white mb-8 tracking-tight text-center md:text-left">ARMORY</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {SKINS.map(skin => {
            const isUnlocked = unlockedSkins.includes(skin.id);
            const isSelected = selectedSkin === skin.id;
            const canAfford = coins >= skin.price;

            return (
              <div 
                key={skin.id}
                className={cn(
                  "flex flex-col bg-slate-900 border rounded-2xl overflow-hidden transition-all duration-300",
                  isSelected ? "border-emerald-500 ring-2 ring-emerald-500/20" : "border-slate-800 hover:border-slate-700"
                )}
              >
                {/* Preview Box */}
                <div className="h-32 w-full flex items-center justify-center bg-slate-950/50 relative">
                  <SkinPreviewCanvas skin={skin} />
                  {!isUnlocked && (
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] flex items-center justify-center">
                      <span className="text-2xl">🔒</span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-white font-bold text-sm mb-1">{skin.name}</h3>
                  <div className="flex gap-2 mb-4">
                    {skin.trail && <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded">TRAIL</span>}
                    {skin.particleType !== 'none' && <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded uppercase">{skin.particleType}</span>}
                  </div>

                  <div className="mt-auto">
                    {isUnlocked ? (
                      <button
                        onClick={() => handlePurchase(skin.id, skin.price)}
                        disabled={isSelected}
                        className={cn(
                          "w-full py-2 rounded-lg font-bold text-sm transition-colors",
                          isSelected 
                            ? "bg-emerald-500/20 text-emerald-400 cursor-default" 
                            : "bg-slate-800 hover:bg-slate-700 text-white"
                        )}
                      >
                        {isSelected ? 'EQUIPPED' : 'EQUIP'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePurchase(skin.id, skin.price)}
                        disabled={!canAfford}
                        className={cn(
                          "w-full py-2 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2",
                          canAfford 
                            ? "bg-amber-500 hover:bg-amber-400 text-slate-950" 
                            : "bg-slate-800 text-slate-500 cursor-not-allowed"
                        )}
                      >
                        <span>💎</span> {skin.price}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}</style>
    </div>
  );
}
