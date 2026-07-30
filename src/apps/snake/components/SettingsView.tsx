import React, { useState } from 'react';
import { saveManager } from '../store/SaveManager';
import { audioManager } from '../audio/AudioManager';
import { cn } from '../utils';
import { GameMode } from '../types';

interface SettingsProps {
  onBack: () => void;
}

export default function SettingsView({ onBack }: SettingsProps) {
  const [settings, setSettings] = useState(saveManager.data.settings);
  const [cmdInput, setCmdInput] = useState('');
  const [cmdFeedback, setCmdFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [feedbackTimeout, setFeedbackTimeout] = useState<number | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showVeryEasyConfirm, setShowVeryEasyConfirm] = useState(false);

  const handleDifficultyChange = (val: 'very_easy' | 'easy' | 'medium' | 'hard') => {
    if (val === 'very_easy') {
      setShowVeryEasyConfirm(true);
      audioManager.playClick();
    } else {
      updateSetting('difficulty', val);
    }
  };

  const handleConfirmVeryEasy = () => {
    setShowVeryEasyConfirm(false);
    updateSetting('difficulty', 'very_easy');
  };

  const updateSetting = (key: keyof typeof settings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    saveManager.data.settings = newSettings;
    saveManager.save();
    audioManager.updateVolumes();
    audioManager.playClick();
  };

  const showFeedback = (text: string, type: 'success' | 'error') => {
    if (feedbackTimeout) window.clearTimeout(feedbackTimeout);
    setCmdFeedback({ text, type });
    const timer = window.setTimeout(() => {
      setCmdFeedback(null);
    }, 3000);
    setFeedbackTimeout(timer);
  };

  const handleCommandSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const command = cmdInput.trim();
      if (!command) return;

      setCmdInput('');
      setCmdFeedback(null);

      if (command.startsWith('/give coin ')) {
        const amountStr = command.replace('/give coin ', '').trim();
        const amount = parseInt(amountStr, 10);
        if (isNaN(amount) || amount < 0) {
          showFeedback('Invalid amount', 'error');
          audioManager.playError();
        } else {
          saveManager.addCoins(amount);
          showFeedback(`Gave ${amount} coins`, 'success');
        }
      } else if (command.startsWith('/set roll ')) {
        const valStr = command.replace('/set roll ', '').trim();
        const val = parseInt(valStr, 10);
        if (val === 2 || val === 5 || val === 100) {
          saveManager.forcedRoll = val;
          showFeedback(`Next roll forced to ${val}x payout`, 'success');
          audioManager.playClick();
        } else {
          showFeedback('Invalid roll multiplier (must be 2, 5, or 100)', 'error');
          audioManager.playError();
        }
      } else if (command === '/reset skins') {
        saveManager.data.unlockedSkins = ['default'];
        saveManager.data.selectedSkin = 'default';
        saveManager.save();
        showFeedback('Skins reset to default', 'success');
        audioManager.playClick();
      } else if (command === '/reset coins') {
        saveManager.data.coins = 0;
        saveManager.save();
        showFeedback('Coins reset to 0', 'success');
        audioManager.playClick();
      } else if (command === '/reset all') {
        setShowResetConfirm(true);
        audioManager.playClick();
      } else {
        showFeedback('Unknown command', 'error');
        audioManager.playError();
      }
    }
  };

  const handleConfirmResetAll = () => {
    setShowResetConfirm(false);
    if (feedbackTimeout) window.clearTimeout(feedbackTimeout);

    const defaultSettings = {
      masterVolume: 1.0,
      musicVolume: 0.7,
      sfxVolume: 1.0,
      particles: true,
      screenShake: true,
      glow: true,
      gridSize: 20,
      difficulty: 'medium' as const
    };

    saveManager.data.coins = 0;
    saveManager.data.highScores = {
      [GameMode.CLASSIC]: 0,
      [GameMode.NO_WALLS]: 0,
      [GameMode.TIME_ATTACK]: 0,
      [GameMode.COIN_FEVER]: 0,
      [GameMode.ALL_IN]: 0,
    };
    saveManager.data.unlockedSkins = ['default', 'neon_blue'];
    saveManager.data.selectedSkin = 'default';
    saveManager.data.stats = {
      gamesPlayed: 0,
      totalScore: 0,
      foodEaten: 0,
      maxLength: 0
    };
    saveManager.data.unlockedAchievements = [];
    saveManager.data.settings = defaultSettings;
    saveManager.save();

    setSettings(defaultSettings);
    audioManager.updateVolumes();

    showFeedback('All data reset successfully', 'success');
    audioManager.playClick();
  };

  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden flex flex-col items-center justify-start md:justify-center bg-slate-950 py-20 px-6 relative custom-scrollbar">
      <button
        onClick={() => { audioManager.playClick(); onBack(); }}
        className="absolute top-8 left-8 text-slate-400 hover:text-white flex items-center gap-2 font-bold transition-colors"
      >
        ← BACK
      </button>

      <div className="max-w-xl w-full bg-slate-900/50 p-8 rounded-3xl border border-slate-800 backdrop-blur-md">
        <h2 className="text-3xl font-black text-white mb-8 tracking-tight text-center">SETTINGS</h2>

        <div className="space-y-8">
          {/* Audio Settings */}
          <div>
            <h3 className="text-slate-500 text-xs font-bold tracking-widest mb-4">AUDIO</h3>
            <div className="space-y-4">
              <SliderRow
                label="Master Volume"
                value={settings.masterVolume}
                onChange={(v) => updateSetting('masterVolume', v)}
              />
              <SliderRow
                label="Music"
                value={settings.musicVolume}
                onChange={(v) => updateSetting('musicVolume', v)}
              />
              <SliderRow
                label="SFX"
                value={settings.sfxVolume}
                onChange={(v) => updateSetting('sfxVolume', v)}
              />
            </div>
          </div>

          <div className="h-px bg-slate-800 w-full" />

          {/* Gameplay Settings */}
          <div>
            <h3 className="text-slate-500 text-xs font-bold tracking-widest mb-4">GAMEPLAY</h3>
            <div className="space-y-4">
              <SelectRow
                label="Grid Size"
                value={settings.gridSize || 20}
                options={[
                  { label: '12 x 12', value: 12 },
                  { label: '16 x 16', value: 16 },
                  { label: '20 x 20', value: 20 }
                ]}
                onChange={(v) => updateSetting('gridSize', v)}
              />
              <SelectRowStr
                label="Difficulty"
                value={settings.difficulty || 'medium'}
                options={[
                  { label: 'Very Easy', value: 'very_easy' },
                  { label: 'Easy', value: 'easy' },
                  { label: 'Medium', value: 'medium' },
                  { label: 'Hard', value: 'hard' }
                ]}
                onChange={handleDifficultyChange}
              />
            </div>
          </div>

          <div className="h-px bg-slate-800 w-full" />

          {/* Visual Settings */}
          <div>
            <h3 className="text-slate-500 text-xs font-bold tracking-widest mb-4">VISUALS</h3>
            <div className="space-y-4">
              <ToggleRow
                label="Particle Effects"
                checked={settings.particles}
                onChange={(v) => updateSetting('particles', v)}
              />
              <ToggleRow
                label="Neon Glow"
                checked={settings.glow}
                onChange={(v) => updateSetting('glow', v)}
              />
              <ToggleRow
                label="Screen Shake"
                checked={settings.screenShake}
                onChange={(v) => updateSetting('screenShake', v)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Dev Console Bar */}
      <div className="w-full max-w-xl mt-6 bg-slate-900/50 p-4 rounded-2xl border border-slate-800 flex items-center gap-3 backdrop-blur-md">
        <span className="text-emerald-500 font-mono font-bold text-sm select-none">&gt;</span>
        <input
          type="text"
          value={cmdInput}
          onChange={(e) => setCmdInput(e.target.value)}
          onKeyDown={handleCommandSubmit}
          placeholder="Dev commands:"
          className="flex-1 bg-transparent border-none outline-none font-mono text-sm text-slate-200 placeholder-slate-600 focus:ring-0"
        />
        {cmdFeedback && (
          <span className={cn(
            "text-xs font-mono px-2.5 py-1 rounded-md border",
            cmdFeedback.type === 'success'
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : "bg-red-500/10 text-red-400 border-red-500/20"
          )}>
            {cmdFeedback.text}
          </span>
        )}
      </div>

      {/* Confirmation Modal */}
      {showResetConfirm && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-red-500/30 p-8 rounded-3xl max-w-sm w-full mx-4 text-center shadow-[0_0_50px_rgba(239,68,68,0.1)]">
            <span className="text-5xl mb-4 block">⚠️</span>
            <h3 className="text-xl font-black text-white mb-2">RESET ALL DATA?</h3>
            <p className="text-sm text-slate-400 mb-6">This will permanently delete all your highscores, coins, stats, and unlocked skins. This action cannot be undone.</p>
            <div className="flex gap-4">
              <button
                onClick={handleConfirmResetAll}
                className="flex-1 py-3 bg-red-500 hover:bg-red-400 text-slate-950 font-bold rounded-xl transition-all cursor-pointer"
              >
                YES, RESET
              </button>
              <button
                onClick={() => { audioManager.playClick(); setShowResetConfirm(false); }}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all cursor-pointer"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Very Easy Confirmation Modal */}
      {showVeryEasyConfirm && (
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-slate-900 border border-amber-500/30 p-6 rounded-3xl max-w-sm w-full mx-4 text-center flex flex-col items-center shadow-[0_0_50px_rgba(245,158,11,0.15)] animate-scale-up">
            <h3 className="text-2xl font-black text-amber-400 mb-4 tracking-wide font-mono">ARE YOU REALLY A BABY?</h3>

            <div className="w-full max-h-80 overflow-hidden rounded-2xl border border-slate-800 mb-6 flex items-center justify-center bg-slate-950">
              <img
                src="/baby.jpg"
                alt="Baby Cry"
                className="object-contain w-full h-full max-h-72"
              />
            </div>

            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={handleConfirmVeryEasy}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl transition-all cursor-pointer text-sm"
              >
                YES, IM CRY CRY BABY
              </button>
              <button
                onClick={() => { audioManager.playClick(); setShowVeryEasyConfirm(false); }}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all cursor-pointer text-sm"
              >
                NO SOWWY
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SelectRowStr({ label, value, options, onChange }: { label: string, value: string, options: { label: string, value: string }[], onChange: (v: any) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-300 font-medium">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-slate-800 text-white rounded-lg px-3 py-1 outline-none border border-slate-700 focus:border-emerald-500 cursor-pointer text-sm font-medium"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

function SliderRow({ label, value, onChange }: { label: string, value: number, onChange: (v: number) => void }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-slate-300 font-medium w-32">{label}</span>
      <input
        type="range"
        min="0" max="1" step="0.05"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="flex-1 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
      />
      <span className="text-slate-400 font-mono text-sm w-12 text-right">{Math.round(value * 100)}%</span>
    </div>
  );
}

function ToggleRow({ label, checked, onChange }: { label: string, checked: boolean, onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-300 font-medium">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={cn(
          "w-12 h-6 rounded-full transition-colors relative",
          checked ? "bg-emerald-500" : "bg-slate-700"
        )}
      >
        <div className={cn(
          "w-4 h-4 bg-white rounded-full absolute top-1 transition-transform",
          checked ? "left-7" : "left-1"
        )} />
      </button>
    </div>
  );
}

function SelectRow({ label, value, options, onChange }: { label: string, value: number, options: { label: string, value: number }[], onChange: (v: number) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-300 font-medium">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="bg-slate-800 text-white rounded-lg px-3 py-1 outline-none border border-slate-700 focus:border-emerald-500 cursor-pointer"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
