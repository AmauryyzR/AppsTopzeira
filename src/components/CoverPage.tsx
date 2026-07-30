import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Gamepad2, ArrowRight, Sparkles, Cpu, Trophy, Terminal, Play, Zap } from 'lucide-react';
import { TabType } from '../types';

interface CoverPageProps {
  onOpenTab: (type: TabType) => void;
}

export const CoverPage: React.FC<CoverPageProps> = ({ onOpenTab }) => {
  const [hoveredCard, setHoveredCard] = useState<'mathrender' | 'snake' | null>(null);

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] w-full flex flex-col items-center justify-between px-4 py-8 md:py-16 overflow-hidden bg-grid-pattern">
      
      {/* Radial ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-cyan-600/15 via-purple-600/15 to-pink-600/15 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-cyan-500/10 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-purple-500/10 blur-[100px] pointer-events-none rounded-full" />

      {/* Main Title Section: "Apps" on line 1, "topzeira" on line 2 */}
      <div className="w-full max-w-6xl text-center z-10 my-4 md:my-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="flex flex-col items-center justify-center leading-none tracking-tighter"
        >
          {/* Line 1: Apps */}
          <h1 className="font-syne font-black text-[clamp(2.8rem,15vw,9.5rem)] uppercase text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-cyan-200 to-slate-300 drop-shadow-2xl select-none tracking-tight leading-none w-full text-center px-2">
            Apps
          </h1>
          
          {/* Line 2: topzeira */}
          <h1 className="font-syne font-black text-[clamp(2.1rem,11vw,7.2rem)] uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-500 glow-text-cyan animate-gradient select-none tracking-tight leading-none -mt-1 sm:-mt-3 md:-mt-5 w-full text-center px-2">
            topzeira
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="font-jakarta text-slate-400 text-sm sm:text-base md:text-xl max-w-2xl mx-auto mt-6 font-medium leading-relaxed"
        >
          Ecossistema interativo de nova geração. Escolha seu aplicativo abaixo para iniciar a sessão na janela dedicada.
        </motion.p>
      </div>

      {/* Considerable Spacing as requested */}
      <div className="w-full my-8 md:my-14" />

      {/* 2 Large Rectangular 16:9 Buttons Container */}
      <div className="w-full max-w-6xl z-10 px-2 sm:px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          
          {/* Card Button 1: MathRender (16:9 Aspect Ratio) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="group cursor-pointer w-full"
            onClick={() => onOpenTab('mathrender')}
            onMouseEnter={() => setHoveredCard('mathrender')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            {/* 16:9 Outer Container */}
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden glass-card p-6 md:p-8 border border-cyan-500/20 group-hover:border-cyan-400/80 transition-all duration-500 group-hover:shadow-[0_0_50px_rgba(6,182,212,0.35)] group-hover:-translate-y-2 flex flex-col justify-between">
              
              {/* Card Background Dynamic Visual Shader Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/40 via-slate-950/80 to-purple-950/40 opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Animated Manim Grid Visual inside 16:9 Card */}
              <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 400 225">
                  <path d="M 0,112.5 Q 100,20 200,112.5 T 400,112.5" fill="none" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
                  <circle cx="200" cy="112.5" r="40" fill="none" stroke="#a855f7" strokeWidth="1.5" />
                  <line x1="0" y1="112.5" x2="400" y2="112.5" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                  <line x1="200" y1="0" x2="200" y2="225" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                </svg>
              </div>

              {/* Top Content inside Card */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-space">
                  <Calculator className="w-3.5 h-3.5" />
                  <span>MANIM STUDIO</span>
                </div>
              </div>

              {/* Center Title & Graphic inside 16:9 Card */}
              <div className="relative z-10 my-auto pt-2">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 mb-3 group-hover:scale-110 group-hover:bg-cyan-400 group-hover:text-black transition-all duration-300 shadow-lg shadow-cyan-950/50">
                  <Calculator className="w-6 h-6" />
                </div>
                <h3 className="font-syne font-extrabold text-2xl sm:text-3xl md:text-4xl text-white group-hover:text-cyan-300 transition-colors">
                  MathRender
                </h3>
              </div>

              {/* Bottom Action Bar inside 16:9 Card */}
              <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/5">
                <span className="text-xs font-space text-slate-400 group-hover:text-slate-200 transition-colors flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  Acessar Aplicativo
                </span>
                
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-300 group-hover:bg-cyan-400 group-hover:text-black flex items-center justify-center transition-all duration-300 shadow-md">
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

            </div>
          </motion.div>

          {/* Card Button 2: Snake Game (16:9 Aspect Ratio) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="group cursor-pointer w-full"
            onClick={() => onOpenTab('snake')}
            onMouseEnter={() => setHoveredCard('snake')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            {/* 16:9 Outer Container */}
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden glass-card p-6 md:p-8 border border-violet-500/20 group-hover:border-violet-400/80 transition-all duration-500 group-hover:shadow-[0_0_50px_rgba(168,85,247,0.35)] group-hover:-translate-y-2 flex flex-col justify-between">
              
              {/* Card Background Dynamic Visual Shader Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-950/40 via-slate-950/80 to-emerald-950/40 opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Animated Cyberpunk Arcade Visual inside 16:9 Card */}
              <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 400 225">
                  <rect x="50" y="40" width="300" height="145" rx="8" fill="none" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="6 6" />
                  <path d="M 80,80 L 140,80 L 140,140 L 220,140 L 220,100" fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
                  <circle cx="220" cy="100" r="6" fill="#10b981" />
                  <circle cx="280" cy="140" r="8" fill="#ec4899" className="animate-ping" />
                </svg>
              </div>

              {/* Top Content inside Card */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/40 text-purple-300 text-xs font-space">
                  <Gamepad2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>ARCADE GAME</span>
                </div>
              </div>

              {/* Center Title & Graphic inside 16:9 Card */}
              <div className="relative z-10 my-auto pt-2">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-400/30 flex items-center justify-center text-purple-400 mb-3 group-hover:scale-110 group-hover:bg-purple-500 group-hover:text-black transition-all duration-300 shadow-lg shadow-purple-950/50">
                  <Gamepad2 className="w-6 h-6" />
                </div>
                <h3 className="font-syne font-extrabold text-2xl sm:text-3xl md:text-4xl text-white group-hover:text-purple-300 transition-colors">
                  Snake Game
                </h3>
              </div>

              {/* Bottom Action Bar inside 16:9 Card */}
              <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/5">
                <span className="text-xs font-space text-slate-400 group-hover:text-slate-200 transition-colors flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  Iniciar Partida
                </span>
                
                <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-300 group-hover:bg-purple-500 group-hover:text-black flex items-center justify-center transition-all duration-300 shadow-md">
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </div>

      {/* Footer Info - Dark Rectangle revealing 'Amaury Roscoe' on hover */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-16 md:mt-24 mb-4 z-10 flex items-center justify-center"
      >
        <div 
          className="group relative inline-flex items-center justify-center px-6 py-2 rounded-xl bg-[#080d19] border border-slate-800/80 shadow-md hover:border-cyan-500/80 hover:shadow-[0_0_25px_rgba(6,182,212,0.35)] cursor-pointer transition-all duration-300 overflow-hidden"
          title="Passe o mouse para revelar"
        >
          {/* Solid Dark Mask Layer */}
          <div className="absolute inset-0 bg-[#080d19] group-hover:opacity-0 transition-opacity duration-300 z-10" />

          {/* Secret Text revealed on hover */}
          <span className="font-space font-bold tracking-widest text-xs text-cyan-400 glow-text-cyan relative z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 select-none">
            Amaury Roscoe
          </span>
        </div>
      </motion.div>

    </div>
  );
};

