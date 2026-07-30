import React, { useState, useEffect, useRef } from 'react';
import { GameState } from '../types';
import { saveManager } from '../store/SaveManager';
import { audioManager } from '../audio/AudioManager';
import { cn } from '../utils';

interface SlotMachineProps {
  onBack: () => void;
  onNavigate: (state: GameState) => void;
}

// 7 Slot machine symbols
type SymbolType = 'coin' | 'apple' | 'juice' | 'dumbbell' | 'bird' | 'bone' | 'rainbow-coin';

const SYMBOLS: SymbolType[] = ['coin', 'apple', 'juice', 'dumbbell', 'bird', 'bone', 'rainbow-coin'];

// SVGs for the symbols
const SymbolIcon = ({ type }: { type: SymbolType }) => {
  switch (type) {
    case 'coin':
      return (
        <svg viewBox="0 0 24 24" className="w-12 h-12 md:w-16 md:h-16 text-amber-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)] animate-pulse" fill="currentColor">
          <circle cx="12" cy="12" r="10" stroke="#a16207" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="7.5" fill="#fde047" stroke="#eab308" strokeWidth="1" />
          <text x="12" y="16" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle" fill="#a16207">$</text>
        </svg>
      );
    case 'rainbow-coin':
      return (
        <svg viewBox="0 0 24 24" className="w-12 h-12 md:w-16 md:h-16 drop-shadow-[0_0_15px_rgba(168,85,247,0.85)]" fill="currentColor">
          <defs>
            <linearGradient id="rainbowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="20%" stopColor="#f97316" />
              <stop offset="40%" stopColor="#eab308" />
              <stop offset="60%" stopColor="#22c55e" />
              <stop offset="80%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
          <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5" fill="url(#rainbowGrad)" className="animate-spin-slow origin-center" />
          <circle cx="12" cy="12" r="7.5" fill="url(#rainbowGrad)" stroke="white" strokeWidth="0.8" />
          <text x="12" y="16.5" fontSize="13" fontWeight="black" fontFamily="monospace" textAnchor="middle" fill="white" stroke="#6b21a8" strokeWidth="0.3">$</text>
        </svg>
      );
    case 'apple':
      return (
        <svg viewBox="0 0 24 24" className="w-12 h-12 md:w-16 md:h-16 text-rose-500 drop-shadow-[0_0_6px_rgba(244,63,94,0.4)]" fill="currentColor">
          <path d="M12 2C11.5 2 10 3.2 10 4.2c0 .5.5.8 1 .8s1.5-1.2 2-2c.2-.4-.5-.8-1-.8zm-2.2 3.5c-1.8 0-3.3 1.3-3.3 3c0 .6.1 1.2.4 1.7.4.7 1.4 3.2 3.1 4.7.9.9 2.2 1.3 3.5 1.3s2.6-.4 3.5-1.3c1.7-1.5 2.7-4 3.1-4.7.3-.5.4-1.1.4-1.7 0-1.7-1.5-3-3-3-1 0-1.9.5-2.5 1.3-.6-.8-1.5-1.3-2.5-1.3z" />
        </svg>
      );
    case 'juice':
      return (
        <svg viewBox="0 0 24 24" className="w-12 h-12 md:w-16 md:h-16 text-orange-400 drop-shadow-[0_0_6px_rgba(251,146,60,0.4)]" fill="currentColor" stroke="currentColor" strokeWidth="0.5">
          <path d="M7 9h10l-1.5 12h-7L7 9z" fillOpacity="0.85" />
          <rect x="6" y="7" width="12" height="2" rx="0.5" fill="#f97316" />
          <line x1="12" y1="7" x2="16" y2="2" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'dumbbell':
      return (
        <svg viewBox="0 0 24 24" className="w-12 h-12 md:w-16 md:h-16 text-slate-400 drop-shadow-[0_0_6px_rgba(148,163,184,0.4)]" fill="currentColor">
          <rect x="2" y="7" width="3" height="10" rx="1" />
          <rect x="5" y="9" width="2" height="6" rx="0.5" />
          <rect x="7" y="11" width="10" height="2" />
          <rect x="17" y="9" width="2" height="6" rx="0.5" />
          <rect x="19" y="7" width="3" height="10" rx="1" />
        </svg>
      );
    case 'bird':
      return (
        <svg viewBox="0 0 24 24" className="w-12 h-12 md:w-16 md:h-16 text-sky-400 drop-shadow-[0_0_6px_rgba(56,189,248,0.4)]" fill="currentColor">
          <path d="M12 2C6.5 2 2 6.5 2 12c0 2 .6 3.9 1.6 5.5L2.1 21c-.2.6.3 1.2.9 1l3.5-1.5c1.6 1 3.5 1.5 5.5 1.5 5.5 0 10-4.5 10-10S17.5 2 12 2zm3 6c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1zm-6.5 8c-.8 0-1.5-.7-1.5-1.5S7.7 13 8.5 13s1.5.7 1.5 1.5S9.3 16 8.5 16z" />
        </svg>
      );
    case 'bone':
      return (
        <svg viewBox="0 0 24 24" className="w-12 h-12 md:w-16 md:h-16 text-stone-100 drop-shadow-[0_0_6px_rgba(244,244,245,0.4)]" fill="currentColor">
          <path d="M19.7 4.3c-1-1-2.7-1-3.7 0l-2.4 2.4c-.2.2-.4.3-.7.3h-.4c-.3 0-.5-.1-.7-.3L9.5 4.3c-1-1-2.7-1-3.7 0s-1 2.7 0 3.7l2.4 2.4c.2.2.3.4.3.7v.4c0 .3-.1.5-.3.7L5.8 14.6c-1 1-1 2.7 0 3.7s2.7 1 3.7 0l2.4-2.4c.2-.2.4-.3.7-.3h.4c.3 0 .5.1.7.3l2.4 2.4c1 1 2.7 1 3.7 0s1-2.7 0-3.7l-2.4-2.4c-.2-.2-.3-.4-.3-.7v-.4c0-.3.1-.5.3-.7l2.4-2.4c1-1 1-2.7 0-3.7z" />
        </svg>
      );
  }
};

const PokerChip = ({
  value,
  onClick,
  disabled,
  color
}: {
  value: string;
  onClick: () => void;
  disabled: boolean;
  color: 'red' | 'green' | 'blue' | 'black'
}) => {
  const bgClasses = {
    red: 'bg-rose-700 hover:bg-rose-600 text-white border-rose-500 shadow-[0_4px_10px_rgba(225,29,72,0.3)]',
    green: 'bg-emerald-700 hover:bg-emerald-600 text-white border-emerald-500 shadow-[0_4px_10px_rgba(16,185,129,0.3)]',
    blue: 'bg-sky-700 hover:bg-sky-600 text-white border-sky-500 shadow-[0_4px_10px_rgba(14,165,233,0.3)]',
    black: 'bg-slate-800 hover:bg-slate-700 text-white border-slate-600 shadow-[0_4px_10px_rgba(30,41,59,0.3)]'
  }[color];

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "w-12 h-12 md:w-16 md:h-16 rounded-full border-4 border-dashed flex flex-col items-center justify-center font-black text-[9px] md:text-[11px] tracking-tight transition-all active:scale-90 disabled:opacity-20 disabled:pointer-events-none cursor-pointer select-none",
        bgClasses
      )}
    >
      <span className="text-[7px] md:text-[8px] opacity-75 font-bold leading-none">{parseFloat(value) > 0 ? 'ADD' : 'SUB'}</span>
      <span className="font-mono mt-0.5 leading-none">{value}</span>
    </button>
  );
};

export default function SlotMachineView({ onBack, onNavigate }: SlotMachineProps) {
  const [bank, setBank] = useState(saveManager.data.coins);
  const [bet, setBet] = useState(10);
  const [spinning, setSpinning] = useState(false);
  const [showWinOverlay, setShowWinOverlay] = useState(false);
  const [showLossFeedback, setShowLossFeedback] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState(0);
  const [winType, setWinType] = useState<'rainbow' | 'jackpot' | 'matched'>('jackpot');

  // High score tracking (max coins won in one bet)
  const [bestPayout, setBestPayout] = useState((saveManager.data.highScores as Record<string, number>)['ALL_IN'] || 0);

  // Reels state: current visible symbol for each of the 3 reels
  const [reels, setReels] = useState<SymbolType[]>(['coin', 'coin', 'coin']);

  // Stored rolling strips of symbols populated during spins
  const [reelStrips, setReelStrips] = useState<SymbolType[][]>([
    ['coin'], ['coin'], ['coin']
  ]);

  // Lever pull state
  const [leverActive, setLeverActive] = useState(false);

  // Ref to target the canvas element for confetti explosion
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);

  // Synced save state
  useEffect(() => {
    return saveManager.subscribe(() => {
      setBank(saveManager.data.coins);
    });
  }, []);

  // Canvas physics-based confetti animation loop
  useEffect(() => {
    if (!showWinOverlay) return;

    const canvas = confettiCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High-DPI canvas buffer resolution scaling
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.resetTransform();
      ctx.scale(dpr, dpr);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const colors = ['#fde047', '#f97316', '#a855f7', '#3b82f6', '#10b981', '#ef4444', '#f43f5e'];
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      width: number;
      height: number;
      rotation: number;
      rotationSpeed: number;
    }> = [];

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Create 90 explosive confetti pieces shooting uniformly from the center
    for (let i = 0; i < 90; i++) {
      // Uniform upward cone (angle between 225 and 315 degrees)
      const angle = Math.PI * 1.25 + Math.random() * (Math.PI * 0.5);
      const speed = 20 + Math.random() * 30; // High initial velocity

      particles.push({
        x: centerX,
        y: centerY - 50,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 15, // High upward burst skew
        color: colors[Math.floor(Math.random() * colors.length)],
        width: 7 + Math.random() * 7,
        height: 11 + Math.random() * 11,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.8
      });
    }

    let animationFrameId: number;
    const gravity = 7.6; // High gravity pulls them downwards extremely quickly
    const friction = 0.99; // Very low drag so particles maintain their high speed
    const startTime = performance.now();
    const durationLimit = 3000; // Hard limit at exactly 2 seconds

    const update = () => {
      const elapsed = performance.now() - startTime;

      // Stop loop and clear canvas exactly at 2 seconds
      if (elapsed >= durationLimit) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        return;
      }

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // Kept at full 1.0 opacity
      ctx.globalAlpha = 1.0;

      let activeParticles = 0;

      particles.forEach(p => {
        // Natural boundary check: only process and draw if visible on screen
        if (p.y < window.innerHeight + 50 && p.x > -50 && p.x < window.innerWidth + 50) {
          activeParticles++;

          p.vx *= friction;
          p.vy *= friction;
          p.vy += gravity;
          p.x += p.vx;
          p.y += p.vy;
          p.rotation += p.rotationSpeed;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
          ctx.restore();
        }
      });

      // Continue animating until every particle exits the screen view
      if (activeParticles > 0) {
        animationFrameId = requestAnimationFrame(update);
      }
    };

    update();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [showWinOverlay]);

  const adjustBet = (amount: number) => {
    if (spinning) return;
    audioManager.playBet();
    setBet(prev => {
      const next = prev + amount;
      return Math.max(10, Math.min(bank, next));
    });
  };

  const handleAllIn = () => {
    if (spinning || bank <= 0) return;
    audioManager.playAllIn();
    setBet(bank);
  };

  const claimStarterPack = () => {
    audioManager.playPurchase();
    saveManager.addCoins(100);
  };

  const handleSpin = async () => {
    if (spinning || bet <= 0 || bank < bet) return;

    // Deduct coins
    setSpinning(true);
    setShowWinOverlay(false);
    setShowLossFeedback(false);
    saveManager.spendCoins(bet);
    audioManager.playSpin();

    // Pull the lever mechanically
    setLeverActive(true);
    setTimeout(() => setLeverActive(false), 300);

    // Check and consume forced roll multiplier cheat
    const forced = saveManager.forcedRoll;
    saveManager.forcedRoll = null; // consume cheat

    const getRandomSymbol = (rainbowChance = 0.05): SymbolType => {
      if (Math.random() < rainbowChance) {
        return 'rainbow-coin';
      }
      const standard: SymbolType[] = ['coin', 'apple', 'juice', 'dumbbell', 'bird', 'bone'];
      return standard[Math.floor(Math.random() * standard.length)];
    };

    const r = Math.random();
    let targetCombo: SymbolType[];
    let outcome: 'win_100x' | 'win_5x' | 'win_2x' | 'loss';

    if (forced === 100 || (forced === null && r < 0.01)) {
      targetCombo = ['rainbow-coin', 'rainbow-coin', 'rainbow-coin'];
      outcome = 'win_100x';
    } else if (forced === 5 || (forced === null && r < 0.152)) {
      targetCombo = ['coin', 'coin', 'coin'];
      outcome = 'win_5x';
    } else if (forced === 2 || (forced === null && r < 0.294)) {
      const nonCoinSymbols: SymbolType[] = ['apple', 'juice', 'dumbbell', 'bird', 'bone'];
      const sym = nonCoinSymbols[Math.floor(Math.random() * nonCoinSymbols.length)];
      targetCombo = [sym, sym, sym];
      outcome = 'win_2x';
    } else {
      let r1 = getRandomSymbol(0.05);
      let r2 = getRandomSymbol(0.05);
      let r3 = getRandomSymbol(0.05);
      while (r1 === r2 && r2 === r3) {
        r1 = getRandomSymbol(0.05);
        r2 = getRandomSymbol(0.05);
        r3 = getRandomSymbol(0.05);
      }
      targetCombo = [r1, r2, r3];
      outcome = 'loss';
    }

    // Generate rolling strips of length 24 for each reel.
    // Index 0 has the current symbol; index 23 has the target symbol.
    const newStrips = reels.map((currentSym, j) => {
      const strip: SymbolType[] = [currentSym];
      for (let i = 0; i < 22; i++) {
        strip.push(getRandomSymbol(0.05));
      }
      strip.push(targetCombo[j]);
      return strip;
    });

    setReelStrips(newStrips);

    // Staggered stop timers adjusted to complete the entire spin in exactly 2 seconds!
    // Reel 0: 1.3s, Reel 1: 1.65s, Reel 2: 2.0s
    // Timeout triggers exactly at 2.05s (2050ms) to resolve outcomes.
    setTimeout(() => {
      setReels(targetCombo);
      setReelStrips([[targetCombo[0]], [targetCombo[1]], [targetCombo[2]]]);
      setSpinning(false);

      // Evaluate payouts
      if (outcome === 'win_100x') {
        const winAmount = bet * 100;
        saveManager.addCoins(winAmount);
        setPayoutAmount(winAmount);
        setWinType('rainbow');
        setShowWinOverlay(true);
        audioManager.playSlotWin();
        // Play slot win sound again to emphasize the big victory
        setTimeout(() => audioManager.playSlotWin(), 300);

        if (winAmount > bestPayout) {
          saveManager.updateHighScore('ALL_IN' as any, winAmount);
          setBestPayout(winAmount);
        }
      } else if (outcome === 'win_5x') {
        const winAmount = bet * 5;
        saveManager.addCoins(winAmount);
        setPayoutAmount(winAmount);
        setWinType('jackpot');
        setShowWinOverlay(true);
        audioManager.playSlotWin();

        if (winAmount > bestPayout) {
          saveManager.updateHighScore('ALL_IN' as any, winAmount);
          setBestPayout(winAmount);
        }
      } else if (outcome === 'win_2x') {
        const winAmount = bet * 2;
        saveManager.addCoins(winAmount);
        setPayoutAmount(winAmount);
        setWinType('matched');
        setShowWinOverlay(true);
        audioManager.playSlotWin();

        if (winAmount > bestPayout) {
          saveManager.updateHighScore('ALL_IN' as any, winAmount);
          setBestPayout(winAmount);
        }
      } else {
        setShowLossFeedback(true);
        audioManager.playSlotLoss();
      }
    }, 2050);
  };

  // Reel roll animation durations, completing within 2 seconds
  const reelDuration = [1.3, 1.65, 2.0];

  return (
    <div className="w-full h-full relative overflow-y-auto overflow-x-hidden flex flex-col items-center bg-slate-950 px-4 py-6 pb-24 select-none custom-scrollbar">

      {/* Self-contained CSS stylesheet for the growing/glowing rainbow coin */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes grow-glow-rainbow {
          0% { transform: scale(1.1); filter: drop-shadow(0 0 15px rgba(168, 85, 247, 0.6)); }
          50% { transform: scale(1.45); filter: drop-shadow(0 0 35px rgba(236, 72, 153, 0.95)) drop-shadow(0 0 20px rgba(59, 130, 246, 0.8)); }
          100% { transform: scale(1.1); filter: drop-shadow(0 0 15px rgba(168, 85, 247, 0.6)); }
        }
        .animate-grow-glow-rainbow {
          animation: grow-glow-rainbow 1.8s infinite ease-in-out;
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }
      `}} />

      {/* Top Header */}
      <div className="w-full max-w-lg flex items-center justify-between mb-8 z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 font-bold hover:text-white transition-colors cursor-pointer"
        >
          <span>⬅</span> VOLTAR
        </button>
        <div className="text-right">
          <div className="text-[10px] text-slate-500 font-bold tracking-widest">BEST WIN</div>
          <div className="text-xl font-mono font-bold text-amber-500">${bestPayout.toLocaleString()}</div>
        </div>
      </div>

      {/* Main Board Container */}
      <div className="w-full max-w-lg bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 flex flex-col items-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative mb-6 z-10">

        {/* Neon light borders */}
        <div className="absolute inset-x-8 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent blur-sm animate-pulse" />
        <div className="absolute inset-x-8 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent blur-sm animate-pulse" />

        {/* Casino Machine Name */}
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-amber-400 via-yellow-300 to-orange-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.3)] animate-pulse">
            GOLDEN SLOTS
          </h1>
          <p className="text-[10px] text-slate-400 tracking-[0.4em] uppercase font-bold mt-1">ALL IN MODE</p>
        </div>

        {/* Machine Row: Reels & Lever */}
        <div className="w-full flex items-center justify-center gap-4 mb-6">

          {/* 3 Slot Reels Display Box */}
          <div className="flex-1 bg-slate-950 border-4 border-slate-800 rounded-2xl p-4 flex gap-3 shadow-inner relative overflow-hidden h-36 items-center justify-center">

            {/* Reel Dividers */}
            <div className="absolute top-0 bottom-0 left-1/3 w-[2px] bg-slate-900/80 border-r border-slate-800/30 z-10" />
            <div className="absolute top-0 bottom-0 left-2/3 w-[2px] bg-slate-900/80 border-r border-slate-800/30 z-10" />

            {/* Glass highlight overlay */}
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none z-10" />

            {/* Reel 1 */}
            <div className="flex-1 h-24 relative overflow-hidden flex items-center justify-center">
              <div
                className="absolute left-0 right-0 top-0 flex flex-col items-center"
                style={{
                  // translate3d forces GPU hardware acceleration for perfect 60/120fps fluid scrolling
                  transform: `translate3d(0, ${spinning ? -(reelStrips[0].length - 1) * 96 : 0}px, 0)`,
                  transition: spinning ? `transform ${reelDuration[0]}s cubic-bezier(0.1, 0.9, 0.15, 1.01)` : 'none',
                  filter: spinning ? 'blur(1.5px)' : 'none'
                }}
              >
                {reelStrips[0].map((sym, idx) => (
                  <div key={idx} className="h-24 flex items-center justify-center">
                    <SymbolIcon type={sym} />
                  </div>
                ))}
              </div>
            </div>

            {/* Reel 2 */}
            <div className="flex-1 h-24 relative overflow-hidden flex items-center justify-center">
              <div
                className="absolute left-0 right-0 top-0 flex flex-col items-center"
                style={{
                  transform: `translate3d(0, ${spinning ? -(reelStrips[1].length - 1) * 96 : 0}px, 0)`,
                  transition: spinning ? `transform ${reelDuration[1]}s cubic-bezier(0.1, 0.9, 0.15, 1.01)` : 'none',
                  filter: spinning ? 'blur(1.5px)' : 'none'
                }}
              >
                {reelStrips[1].map((sym, idx) => (
                  <div key={idx} className="h-24 flex items-center justify-center">
                    <SymbolIcon type={sym} />
                  </div>
                ))}
              </div>
            </div>

            {/* Reel 3 */}
            <div className="flex-1 h-24 relative overflow-hidden flex items-center justify-center">
              <div
                className="absolute left-0 right-0 top-0 flex flex-col items-center"
                style={{
                  transform: `translate3d(0, ${spinning ? -(reelStrips[2].length - 1) * 96 : 0}px, 0)`,
                  transition: spinning ? `transform ${reelDuration[2]}s cubic-bezier(0.1, 0.9, 0.15, 1.01)` : 'none',
                  filter: spinning ? 'blur(1.5px)' : 'none'
                }}
              >
                {reelStrips[2].map((sym, idx) => (
                  <div key={idx} className="h-24 flex items-center justify-center">
                    <SymbolIcon type={sym} />
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Animated Lever (Caça-níquel Handle) */}
          <div className="w-10 h-36 flex flex-col items-center justify-end relative pb-4">
            {/* Slot Guide Bar */}
            <div className="w-2 h-24 bg-slate-950 border border-slate-800 rounded-full" />

            {/* Lever Stick */}
            <div
              className={cn(
                "absolute top-0 bottom-4 w-1.5 bg-gradient-to-t from-slate-400 to-slate-200 origin-bottom transition-all duration-300 rounded-full",
                leverActive ? "h-12 translate-y-16 scale-y-50" : "h-24 translate-y-0"
              )}
              style={{ left: '17px' }}
            >
              {/* Ball Tip */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-red-600 rounded-full border border-red-500 shadow-[0_0_10px_rgba(220,38,38,0.5)] cursor-pointer hover:bg-red-500 transition-colors" />
            </div>
          </div>

        </div>

        {/* Dashboard Grid (Chips / Bets UI) */}
        <div className="w-full flex flex-col gap-4">

          {/* Bank & Bet HUD */}
          <div className="grid grid-cols-2 gap-4 w-full">

            {/* Bank Card */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center relative group">
              <div className="text-[10px] text-slate-500 font-bold tracking-wider mb-1">YOUR BANK</div>
              <div className="text-2xl md:text-3xl font-mono font-black text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]">
                ${bank.toLocaleString()}
              </div>
            </div>

            {/* Bet Card */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center relative">
              <div className="text-[10px] text-slate-500 font-bold tracking-wider mb-1">CURRENT BET</div>
              <div className="text-2xl md:text-3xl font-mono font-black text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]">
                ${bet.toLocaleString()}
              </div>
            </div>

          </div>

          {/* Bet Incrementor Chips Panel */}
          <div className="w-full bg-slate-950/40 p-4 border border-slate-800/50 rounded-2xl flex flex-col items-center">
            <div className="text-slate-500 text-[10px] font-bold text-center tracking-widest mb-4 uppercase">BET CONTROLS</div>

            <div className="flex flex-col gap-4 items-center w-full">
              {/* Positive Add Chips */}
              <div className="flex justify-center gap-3 w-full">
                <PokerChip
                  value="+10"
                  color="red"
                  onClick={() => adjustBet(10)}
                  disabled={spinning || bet + 10 > bank}
                />
                <PokerChip
                  value="+25"
                  color="green"
                  onClick={() => adjustBet(25)}
                  disabled={spinning || bet + 25 > bank}
                />
                <PokerChip
                  value="+50"
                  color="blue"
                  onClick={() => adjustBet(50)}
                  disabled={spinning || bet + 50 > bank}
                />
                <PokerChip
                  value="+100"
                  color="black"
                  onClick={() => adjustBet(100)}
                  disabled={spinning || bet + 100 > bank}
                />
              </div>

              {/* Negative Subtract Chips */}
              <div className="flex justify-center gap-3 w-full">
                <PokerChip
                  value="-10"
                  color="red"
                  onClick={() => adjustBet(-10)}
                  disabled={spinning || bet <= 10}
                />
                <PokerChip
                  value="-25"
                  color="green"
                  onClick={() => adjustBet(-25)}
                  disabled={spinning || bet <= 25}
                />
                <PokerChip
                  value="-50"
                  color="blue"
                  onClick={() => adjustBet(-50)}
                  disabled={spinning || bet <= 50}
                />
                <PokerChip
                  value="-100"
                  color="black"
                  onClick={() => adjustBet(-100)}
                  disabled={spinning || bet <= 100}
                />
              </div>
            </div>
          </div>

          {/* Action Station: ALL IN & SPIN */}
          <div className="flex gap-4 items-center">

            {/* Highlighted ALL IN Button */}
            <button
              disabled={spinning || bank <= 0}
              onClick={handleAllIn}
              className="py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-700 border border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)] disabled:opacity-30 disabled:pointer-events-none text-white font-black text-sm tracking-widest rounded-2xl transition-all active:scale-95 cursor-pointer text-center uppercase flex-1"
            >
              ALL IN
            </button>

            {/* Glowing SPIN Button */}
            <button
              disabled={spinning || bet <= 0 || bank < bet}
              onClick={handleSpin}
              className="py-4 px-8 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:from-slate-800 disabled:to-slate-850 disabled:text-slate-500 disabled:shadow-none text-slate-950 font-black text-lg tracking-widest rounded-2xl transition-all shadow-[0_4px_25px_rgba(16,185,129,0.4)] active:scale-95 flex-[1.5] cursor-pointer text-center uppercase"
            >
              {spinning ? 'SPINNING...' : 'SPIN'}
            </button>

          </div>

        </div>

      </div>

      {/* Out of cash starter pack claim */}
      {bank < 10 && !spinning && (
        <div className="w-full max-w-lg bg-slate-900/40 border border-amber-500/20 p-5 rounded-2xl text-center flex flex-col items-center justify-center gap-3 animate-bounce z-10">
          <div className="text-sm font-bold text-amber-400">🚨 BANKRUPT STIMULUS 🚨</div>
          <p className="text-xs text-slate-400">Claim 100 free coins starter pack to continue betting!</p>
          <button
            onClick={claimStarterPack}
            className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm rounded-xl cursor-pointer"
          >
            CLAIM 100 COINS
          </button>
        </div>
      )}

      {/* Loss Feedback Banner */}
      {showLossFeedback && (
        <div className="w-full max-w-lg bg-red-950/40 border border-red-500/20 p-4 rounded-2xl text-center text-red-400 text-sm font-bold animate-pulse z-10">
          ❌ NO MATCH! TRY AGAIN!
        </div>
      )}

      {/* Victory Overlay Modal */}
      {showWinOverlay && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 flex flex-col items-center justify-center p-6 animate-fade-in">

          {/* Confetti Physics Canvas Overlay */}
          <canvas
            ref={confettiCanvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-45"
          />

          {/* Glowing particle-like background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/20 blur-[120px] rounded-full pointer-events-none animate-pulse" />

          <div className="z-10 flex flex-col items-center text-center max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative">

            {winType === 'rainbow' ? (
              <div className="animate-grow-glow-rainbow mb-6 flex items-center justify-center">
                <SymbolIcon type="rainbow-coin" />
              </div>
            ) : (
              <div className="text-6xl mb-4 animate-bounce">
                {winType === 'jackpot' ? '👑' : '🏆'}
              </div>
            )}

            <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-500 tracking-wider mb-2">
              {winType === 'rainbow' ? 'RAINBOW JACKPOT!' : winType === 'jackpot' ? 'JACKPOT!' : 'MATCHED!'}
            </h2>
            <p className="text-xs text-slate-400 font-bold tracking-widest uppercase mb-6">
              {winType === 'rainbow' ? '3 RAINBOW COINS MATCHED! (100x Payout)' : winType === 'jackpot' ? '3 COINS MATCHED! (5x Payout)' : '3 ITEMS MATCHED! (2x Payout)'}
            </p>

            <div className="text-sm text-slate-400 font-medium mb-1">YOU WON</div>
            <div className="text-5xl font-mono font-black text-amber-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)] mb-8">
              +${payoutAmount.toLocaleString()}
            </div>

            <button
              onClick={() => setShowWinOverlay(false)}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-lg tracking-widest rounded-2xl transition-all shadow-[0_4px_20px_rgba(16,185,129,0.3)] active:scale-95 cursor-pointer uppercase z-50"
            >
              AWESOME!
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
