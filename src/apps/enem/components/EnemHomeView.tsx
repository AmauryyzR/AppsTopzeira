import React from 'react';
import { motion } from 'framer-motion';
import { KnowledgeArea } from '../types/curriculum';

interface EnemHomeViewProps {
  curriculum: KnowledgeArea[];
  onSelectArea: (area: KnowledgeArea) => void;
}

function formatAreaTitle(name: string): string {
  if (name.toLowerCase().includes('natureza')) return 'Ciências da Natureza';
  if (name.toLowerCase().includes('matemática')) return 'Matemática';
  if (name.toLowerCase().includes('humanas')) return 'Ciências Humanas';
  if (name.toLowerCase().includes('linguagens')) return 'Linguagens';
  return name;
}

export const EnemHomeView: React.FC<EnemHomeViewProps> = ({ curriculum, onSelectArea }) => {
  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 sm:px-10 py-12 md:py-20 select-none bg-[#f5f5f7]">
      {/* 4 Large Widgets in 2x2 Grid - 30% Stronger Shadow Elevation */}
      <div className="w-full max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {curriculum.map((area, index) => {
            const title = formatAreaTitle(area.name);

            return (
              <motion.div
                key={area.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => onSelectArea(area)}
                className="group cursor-pointer w-full"
              >
                <div
                  className="w-full aspect-[16/10] sm:aspect-video rounded-[24px] p-8 sm:p-12 flex items-center justify-center text-center
                    bg-white
                    shadow-[0_8px_28px_rgba(0,0,0,0.15),0_2px_6px_rgba(0,0,0,0.08)]
                    hover:shadow-[0_20px_48px_rgba(0,0,0,0.26),0_6px_16px_rgba(0,0,0,0.11)]
                    hover:scale-[1.018]
                    transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                >
                  {/* Title Only - Clean Apple Typography */}
                  <h2 className="font-sans font-semibold text-2xl sm:text-3xl text-[#1d1d1f] tracking-tight leading-snug group-hover:text-black transition-colors">
                    {title}
                  </h2>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
