/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GameState, GameMode } from './types';
import MainMenu from './components/MainMenu';
import GameView from './components/GameView';
import StoreView from './components/StoreView';
import SettingsView from './components/SettingsView';
import GameOverView from './components/GameOverView';
import StatsView from './components/StatsView';
import AchievementsView from './components/AchievementsView';
import { audioManager } from './audio/AudioManager';
import { saveManager } from './store/SaveManager';

export default function SnakeApp() {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [selectedMode, setSelectedMode] = useState<GameMode>(GameMode.CLASSIC);
  const [lastScore, setLastScore] = useState(0);

  useEffect(() => {
    // Initialize audio on first user interaction if not already initialized
    const handleInteraction = () => {
      audioManager.init();
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, []);

  const handleStartGame = (mode: GameMode) => {
    setSelectedMode(mode);
    setGameState(GameState.PLAYING);
  };

  const handleStateChange = (newState: GameState) => {
    // Hack to extract score before game over transition
    if (newState === GameState.GAME_OVER) {
      // Ideally the score would be passed up, but for simplicity we rely on the saveManager
      // We'll calculate score directly in GameView and pass it up if possible, or refactor.
      // For now, let's just transition and let GameOver read from store if needed.
      // Actually, passing score up is better. Let's fix GameView to pass score up, or just use this generic state change.
    }
    setGameState(newState);
  };

  return (
    <div className="w-full h-[100dvh] bg-slate-950 text-slate-200 overflow-hidden select-none relative">
      {gameState === GameState.MENU && (
        <MainMenu
          selectedMode={selectedMode}
          onSelectMode={setSelectedMode}
          onStartGame={handleStartGame}
          onNavigate={setGameState}
        />
      )}

      {gameState === GameState.STORE && (
        <StoreView
          onBack={() => setGameState(GameState.MENU)}
        />
      )}

      {gameState === GameState.SETTINGS && (
        <SettingsView
          onBack={() => setGameState(GameState.MENU)}
        />
      )}

      {gameState === GameState.STATS && (
        <StatsView
          onBack={() => setGameState(GameState.MENU)}
        />
      )}

      {gameState === GameState.ACHIEVEMENTS && (
        <AchievementsView
          onBack={() => setGameState(GameState.MENU)}
        />
      )}

      {gameState === GameState.PLAYING && (
        <GameView
          mode={selectedMode}
          onStateChange={(state, finalScore) => {
            if (state === GameState.GAME_OVER && finalScore !== undefined) {
              setLastScore(finalScore);
            }
            setGameState(state);
          }}
        />
      )}

      {gameState === GameState.GAME_OVER && (
        <GameOverView
          score={lastScore}
          mode={selectedMode}
          onRetry={() => setGameState(GameState.PLAYING)}
          onMenu={() => setGameState(GameState.MENU)}
        />
      )}

      {/* Optional CRT Overlay based on settings (assuming we add a CRT setting or just subtle scanlines) */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%] opacity-20 z-50 mix-blend-overlay" />
    </div>
  );
}
