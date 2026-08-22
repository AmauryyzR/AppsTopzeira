import React, { useEffect, useRef, useState } from 'react';
import { GameMode, GameState } from '../types';
import { GameEngine } from '../engine/GameEngine';
import { Renderer } from '../engine/Renderer';
import { InputManager } from '../engine/InputManager';
import { saveManager } from '../store/SaveManager';
import { audioManager } from '../audio/AudioManager';
import { cn } from '../utils';
import SlotMachineView from './SlotMachineView';

interface GameProps {
  mode: GameMode;
  onStateChange: (state: GameState, finalScore?: number) => void;
}

const BASE_TICK_RATE = 120; // ms per move
const SCORE_ACCELERATION_FACTOR = 0.7; // 30% gentler speed growth

export default function GameView({ mode, onStateChange }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(mode === GameMode.TIME_ATTACK ? 60 : 0);
  const [multiplier, setMultiplier] = useState(1);
  const [survivalTime, setSurvivalTime] = useState(0);
  const [coinValue, setCoinValue] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(isPaused);
  const [gridSize] = useState(saveManager.data.settings.gridSize || 20);

  // Engine refs to avoid re-renders
  const engineRef = useRef<GameEngine | null>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const inputRef = useRef<InputManager | null>(null);
  const rafRef = useRef<number>(0);
  const lastTickRef = useRef<number>(0);
  const lastTimeTickRef = useRef<number>(0);
  const gameOverTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // Initialize
    engineRef.current = new GameEngine(gridSize, gridSize, mode);
    rendererRef.current = new Renderer(canvasRef.current, gridSize);
    inputRef.current = new InputManager();

    // Resize observer
    const resizeObserver = new ResizeObserver(() => {
      if (rendererRef.current) {
        rendererRef.current.resize(gridSize);
      }
    });
    resizeObserver.observe(containerRef.current);

    // Start music
    audioManager.startMusic();

    let lastFrameTime = performance.now();

    const loop = (time: number) => {
      const dt = (time - lastFrameTime) / 1000;
      lastFrameTime = time;

      if (!engineRef.current || !rendererRef.current || !inputRef.current) return;

      const engine = engineRef.current;

      if (!isPausedRef.current && !engine.state.gameOver) {
        // Handle logic ticks
        const difficulty = saveManager.data.settings.difficulty || 'medium';
        let baseTickRate = BASE_TICK_RATE;
        let speedScale = 1000;

        if (difficulty === 'very_easy') {
          baseTickRate = 160;
          speedScale = 8000;
        } else if (difficulty === 'easy') {
          baseTickRate = 140;
          speedScale = 2000;
        } else if (difficulty === 'hard') {
          baseTickRate = 90;
          speedScale = 500;
        }

        const currentTickSpeed = baseTickRate / Math.max(
          1,
          1 + (engine.state.score / speedScale) * SCORE_ACCELERATION_FACTOR,
        );

        if (time - lastTickRef.current > currentTickSpeed) {
          lastTickRef.current += currentTickSpeed;
          // If we lagged severely (tabbed out), reset to avoid fast-forwarding multiple ticks at once
          if (time - lastTickRef.current > currentTickSpeed * 2) {
            lastTickRef.current = time;
          }

          const direction = inputRef.current.getDirection();
          engine.update(direction);

          // Sync react state
          setScore(engine.state.score);
          setMultiplier(engine.state.multiplier);
          setCoinValue(engine.getCoinValue());
        }

        // Handle time ticks (1 second)
        if (time - lastTimeTickRef.current > 1000) {
          lastTimeTickRef.current = time;
          engine.tickTime();
          setTimeLeft(engine.state.timeLeft);
          setSurvivalTime(engine.state.survivalTime);
        }

        // Update interpolation progress
        engine.interpolationProgress = Math.min(1, (time - lastTickRef.current) / currentTickSpeed);

        // Update particles
        engine.particleSystem.update(dt);
      } else if (engine.state.gameOver) {
        // Still update particles during game over animation
        engine.particleSystem.update(dt);
      }

      rendererRef.current.render(engine);

      if (engine.state.gameOver) {
        if (gameOverTimeoutRef.current === null) {
          audioManager.stopMusic();
          gameOverTimeoutRef.current = window.setTimeout(() => {
            onStateChange(GameState.GAME_OVER, engine.state.score);
          }, 300);
        }
      } else {
        gameOverTimeoutRef.current = null;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      if (gameOverTimeoutRef.current !== null) {
        clearTimeout(gameOverTimeoutRef.current);
      }
      resizeObserver.disconnect();
      inputRef.current?.cleanup();
      audioManager.stopMusic();
    };
  }, [mode]);

  // Keep isPausedRef in sync with state
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // Pause handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'p') {
        setIsPaused(p => !p);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Pause/resume game music and reset timing refs to prevent lag jumps
  useEffect(() => {
    if (isPaused) {
      audioManager.stopMusic();
    } else {
      lastTickRef.current = performance.now();
      lastTimeTickRef.current = performance.now();
      if (engineRef.current && !engineRef.current.state.gameOver) {
        audioManager.startMusic();
      }
    }
  }, [isPaused]);

  if (mode === GameMode.ALL_IN) {
    return (
      <SlotMachineView
        onBack={() => onStateChange(GameState.MENU)}
        onNavigate={onStateChange}
      />
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-slate-950 p-2 sm:p-4 overflow-hidden" ref={containerRef}>

      {/* HUD */}
      <div className="absolute top-2 left-3 right-3 sm:top-3 sm:left-4 sm:right-4 flex justify-between items-start text-white pointer-events-none z-10">
        <div className="flex flex-col gap-0.5 bg-slate-900/60 backdrop-blur-md p-2 px-3 rounded-xl border border-slate-700/50">
          <div className="text-[10px] sm:text-xs text-slate-400 font-medium tracking-wider">SCORE</div>
          <div className="text-xl sm:text-3xl font-bold font-mono tracking-tighter text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">
            {score.toLocaleString()}
          </div>
          {multiplier > 1 && (
            <div className="text-amber-400 font-bold text-[10px] sm:text-xs animate-pulse">
              {multiplier}x COMBO
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-1.5">
          {mode === GameMode.TIME_ATTACK && (
            <div className={cn(
              "bg-slate-900/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/50 text-lg sm:text-2xl font-mono font-bold",
              timeLeft <= 10 ? "text-red-500 animate-pulse" : "text-sky-400"
            )}>
              {timeLeft}s
            </div>
          )}

          {mode === GameMode.COIN_FEVER && (
            <div className="flex flex-col items-end gap-1 animate-in slide-in-from-top duration-300">
              <div className="bg-slate-900/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/50 text-lg sm:text-2xl font-mono font-bold text-sky-400">
                {survivalTime}s
              </div>
              <div className="bg-slate-900/60 backdrop-blur-md px-2.5 py-1 rounded-xl border border-amber-500/30 text-[10px] sm:text-xs font-bold text-amber-400 animate-pulse tracking-wider">
                COIN VALUE: {coinValue}x
              </div>
            </div>
          )}

          <button
            onClick={() => setIsPaused(!isPaused)}
            className="pointer-events-auto bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-lg transition-colors border border-slate-700 cursor-pointer"
          >
            {isPaused ? '▶' : '⏸'}
          </button>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 w-full min-h-0 flex items-center justify-center mt-12 sm:mt-14 mb-4 pb-2 px-2 sm:px-4">
        <div 
          className="relative rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] ring-1 ring-slate-800 bg-slate-900 flex items-center justify-center" 
          style={{ width: '100%', maxWidth: '750px', aspectRatio: '1/1', maxHeight: 'calc(100% - 64px)' }}
        >
          <canvas ref={canvasRef} className="block w-full h-full" />

          {isPaused && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center">
              <h2 className="text-4xl font-bold text-white tracking-widest mb-8">PAUSED</h2>
              <button
                onClick={() => setIsPaused(false)}
                className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-full transition-all hover:scale-105 mb-4"
              >
                RESUME
              </button>
              <button
                onClick={() => onStateChange(GameState.MENU)}
                className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-full transition-all"
              >
                QUIT TO MENU
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile controls hint */}
      <div className="absolute bottom-3 text-slate-500 text-xs md:hidden pointer-events-none">
        Swipe to move
      </div>
    </div>
  );
}
