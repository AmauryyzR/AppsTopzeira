import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { KnowledgeArea, DisciplineItem } from '../types/curriculum';

interface AprofundadoHomeViewProps {
  curriculum: KnowledgeArea[];
  onSelectDiscipline: (area: KnowledgeArea, discipline: DisciplineItem) => void;
  onBackToHome: () => void;
}

interface DisciplineCardData {
  id: string;
  name: string;
  discipline: DisciplineItem;
  area: KnowledgeArea;
}

export const AprofundadoHomeView: React.FC<AprofundadoHomeViewProps> = ({
  curriculum,
  onSelectDiscipline,
  onBackToHome,
}) => {
  // Extract all individual disciplines across the 4 areas
  const disciplineCards: DisciplineCardData[] = [];

  curriculum.forEach((area) => {
    area.disciplines.forEach((disc) => {
      let displayName = disc.name;
      // In minimal style, shorten "Língua Portuguesa e Literatura" to "Literatura & Português" or keep clean
      if (disc.id === 'lingua-portuguesa-literatura') {
        displayName = 'Literatura';
      }
      disciplineCards.push({
        id: disc.id,
        name: displayName,
        discipline: disc,
        area,
      });
    });
  });

  // Desired order for canonical study:
  // Matemática, Física, Química, Biologia, História, Geografia, Filosofia, Sociologia, Literatura
  const priorityOrder = [
    'matematica-geral',
    'fisica',
    'quimica',
    'biologia',
    'historia',
    'geografia',
    'filosofia',
    'sociologia',
    'lingua-portuguesa-literatura',
  ];

  disciplineCards.sort((a, b) => {
    const idxA = priorityOrder.indexOf(a.id);
    const idxB = priorityOrder.indexOf(b.id);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="w-full max-w-full overflow-x-hidden min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 sm:px-10 py-8 md:py-16 select-none bg-[#f5f5f7]">
      <div className="w-full max-w-5xl mx-auto">
        {/* Top Minimalist Back Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-xs font-medium text-[#1d1d1f] shadow-[0_2px_10px_rgba(0,0,0,0.11),0_1px_3px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.18)] hover:scale-[1.02] transition-all cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform text-[#6e6e73]" />
            <span>Voltar ao Início</span>
          </button>
        </div>

        {/* 9 Minimalist Discipline Widgets in 3x3 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 w-full">
          {disciplineCards.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => onSelectDiscipline(item.area, item.discipline)}
              className="group cursor-pointer w-full"
            >
              <div
                className="w-full aspect-[16/10] sm:aspect-[16/9] rounded-[22px] p-6 sm:p-8 flex items-center justify-center text-center
                  bg-white
                  shadow-[0_8px_24px_rgba(0,0,0,0.12),0_2px_6px_rgba(0,0,0,0.06)]
                  hover:shadow-[0_18px_42px_rgba(0,0,0,0.22),0_6px_14px_rgba(0,0,0,0.09)]
                  hover:scale-[1.02]
                  transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
              >
                {/* Title Only - Clean Apple Typography */}
                <h2 className="font-sans font-semibold text-xl sm:text-2xl text-[#1d1d1f] tracking-tight leading-snug group-hover:text-black transition-colors">
                  {item.name}
                </h2>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
