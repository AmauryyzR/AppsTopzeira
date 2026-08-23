import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Gamepad2, ArrowRight } from 'lucide-react';
import { TabType } from '../types';

interface CoverPageProps {
  onOpenTab: (type: TabType) => void;
}

export const CoverPage: React.FC<CoverPageProps> = ({ onOpenTab }) => {
  const [isRevealed, setIsRevealed] = useState<boolean>(false);

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] w-full flex flex-col items-center justify-between px-4 py-8 md:py-14 overflow-hidden bg-grid-pattern">
      {/* Radial ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-cyan-600/15 via-purple-600/15 to-emerald-600/15 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-cyan-500/10 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-purple-500/10 blur-[100px] pointer-events-none rounded-full" />

      {/* Main Title Section */}
      <div className="w-full max-w-6xl text-center z-10 my-2 md:my-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="flex flex-col items-center justify-center leading-none tracking-tighter"
        >
          <h1 className="font-syne font-black text-[clamp(2.8rem,13vw,8.5rem)] uppercase text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-cyan-200 to-slate-300 drop-shadow-2xl select-none tracking-tight leading-none w-full text-center px-2">
            Apps
          </h1>
          <h1 className="font-syne font-black text-[clamp(2.1rem,10vw,6.5rem)] uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-fuchsia-500 glow-text-cyan animate-gradient select-none tracking-tight leading-none -mt-1 sm:-mt-3 md:-mt-4 w-full text-center px-2">
            topzeira
          </h1>
        </motion.div>
      </div>

      {/* 2 Rectangular Cards Container */}
      <div className="w-full max-w-4xl z-10 px-2 sm:px-4 my-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Card 1: MathRender */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="group cursor-pointer w-full"
            onClick={() => onOpenTab('mathrender')}
          >
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden glass-card p-6 border border-cyan-500/20 group-hover:border-cyan-400/80 transition-all duration-500 group-hover:shadow-[0_0_40px_rgba(6,182,212,0.35)] group-hover:-translate-y-2 flex flex-col justify-between">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/40 via-slate-950/80 to-purple-950/40 opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-space">
                  <Calculator className="w-3.5 h-3.5" />
                  <span>MANIM STUDIO</span>
                </div>
              </div>
              <div className="relative z-10 my-auto pt-2">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 mb-2 group-hover:scale-110 group-hover:bg-cyan-400 group-hover:text-black transition-all duration-300 shadow-lg shadow-cyan-950/50">
                  <Calculator className="w-5 h-5" />
                </div>
                <h3 className="font-syne font-extrabold text-2xl text-white group-hover:text-cyan-300 transition-colors">
                  MathRender
                </h3>
              </div>
              <div className="relative z-10 flex items-center justify-end pt-2 border-t border-white/5">
                <div className="w-9 h-9 rounded-full bg-cyan-500/20 text-cyan-300 group-hover:bg-cyan-400 group-hover:text-black flex items-center justify-center transition-all duration-300 shadow-md">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Snake Game */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="group cursor-pointer w-full"
            onClick={() => onOpenTab('snake')}
          >
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden glass-card p-6 border border-violet-500/20 group-hover:border-violet-400/80 transition-all duration-500 group-hover:shadow-[0_0_40px_rgba(168,85,247,0.35)] group-hover:-translate-y-2 flex flex-col justify-between">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-950/40 via-slate-950/80 to-pink-950/40 opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/40 text-purple-300 text-xs font-space">
                  <Gamepad2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>ARCADE GAME</span>
                </div>
              </div>
              <div className="relative z-10 my-auto pt-2">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-400/30 flex items-center justify-center text-purple-400 mb-2 group-hover:scale-110 group-hover:bg-purple-500 group-hover:text-black transition-all duration-300 shadow-lg shadow-purple-950/50">
                  <Gamepad2 className="w-5 h-5" />
                </div>
                <h3 className="font-syne font-extrabold text-2xl text-white group-hover:text-purple-300 transition-colors">
                  Snake Game
                </h3>
              </div>
              <div className="relative z-10 flex items-center justify-end pt-2 border-t border-white/5">
                <div className="w-9 h-9 rounded-full bg-purple-500/20 text-purple-300 group-hover:bg-purple-500 group-hover:text-black flex items-center justify-center transition-all duration-300 shadow-md">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-8 mb-2 z-10 flex items-center justify-center"
      >
        <div
          onClick={() => setIsRevealed(!isRevealed)}
          className="group relative inline-flex items-center justify-center px-6 py-2 rounded-xl bg-[#080d19] border border-slate-800/80 shadow-md hover:border-cyan-500/80 hover:shadow-[0_0_25px_rgba(6,182,212,0.35)] cursor-pointer transition-all duration-300 overflow-hidden"
        >
          <div className={`absolute inset-0 bg-[#080d19] transition-opacity duration-300 z-10 ${isRevealed ? 'opacity-0' : 'group-hover:opacity-0'}`} />
          <span className={`font-space font-bold tracking-widest text-xs text-cyan-400 glow-text-cyan relative z-0 transition-opacity duration-300 select-none ${isRevealed ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
            Amaury Roscoe
          </span>
        </div>
      </motion.div>
    </div>
  );
};
