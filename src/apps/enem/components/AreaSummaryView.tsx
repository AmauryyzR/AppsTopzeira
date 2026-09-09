import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import {
  KnowledgeArea,
  DisciplineItem,
  TopicItem,
  SubtopicItem,
  EnemWeight,
} from '../types/curriculum';

interface AreaSummaryViewProps {
  area: KnowledgeArea;
  selectedDisciplineId?: string;
  onSelectDiscipline?: (disciplineId: string) => void;
  onBackToHome: () => void;
  onSelectSubtopic: (
    area: KnowledgeArea,
    discipline: DisciplineItem,
    topic: TopicItem,
    subtopic: SubtopicItem
  ) => void;
}

function formatAreaTitle(name: string): string {
  if (name.toLowerCase().includes('natureza')) return 'Ciências da Natureza';
  if (name.toLowerCase().includes('matemática')) return 'Matemática';
  if (name.toLowerCase().includes('humanas')) return 'Ciências Humanas';
  if (name.toLowerCase().includes('linguagens')) return 'Linguagens';
  return name;
}

export const AreaSummaryView: React.FC<AreaSummaryViewProps> = ({
  area,
  selectedDisciplineId: initialDisciplineId,
  onSelectDiscipline,
  onBackToHome,
  onSelectSubtopic,
}) => {
  const [selectedDisciplineId, setSelectedDisciplineId] = useState<string>(
    initialDisciplineId || area.disciplines[0]?.id || ''
  );

  useEffect(() => {
    if (initialDisciplineId) {
      setSelectedDisciplineId(initialDisciplineId);
    }
  }, [initialDisciplineId]);

  const activeDiscipline =
    area.disciplines.find((d) => d.id === selectedDisciplineId) || area.disciplines[0];

  const handleSelectDiscipline = (discId: string) => {
    setSelectedDisciplineId(discId);
    onSelectDiscipline?.(discId);
  };

  const cleanTitle = formatAreaTitle(area.name);

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-[#f5f5f7] text-[#1d1d1f] py-8 sm:py-12 px-4 sm:px-8 select-none">
      <div className="max-w-4xl mx-auto">
        {/* Top Back Navigation Bar */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-xs font-medium text-[#1d1d1f] shadow-[0_2px_10px_rgba(0,0,0,0.11),0_1px_3px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.18)] hover:scale-[1.02] transition-all cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform text-[#6e6e73]" />
            <span>Voltar às Áreas</span>
          </button>
        </div>

        {/* Disciplines Navigation Tabs (Apple Pills with +30% shadow) */}
        {area.disciplines.length > 1 && (
          <div className="flex items-center gap-2.5 mb-6 overflow-x-auto pb-1 no-scrollbar">
            {area.disciplines.map((disc) => {
              const isActive = disc.id === activeDiscipline?.id;
              return (
                <button
                  key={disc.id}
                  onClick={() => handleSelectDiscipline(disc.id)}
                  className={`px-5 py-2.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#1d1d1f] text-white shadow-[0_4px_18px_rgba(0,0,0,0.28)]'
                      : 'bg-white text-[#1d1d1f] hover:bg-[#eaeaea] shadow-[0_2px_10px_rgba(0,0,0,0.11)]'
                  }`}
                >
                  {disc.name}
                </button>
              );
            })}
          </div>
        )}

        {/* Book-Style Vertical Table of Contents (+30% Shadow Card) */}
        <div className="bg-white rounded-[28px] p-6 sm:p-12 md:p-14 shadow-[0_10px_34px_rgba(0,0,0,0.11),0_2px_8px_rgba(0,0,0,0.06)]">
          {/* Header inside the book index */}
          <div className="mb-8 pb-5 border-b border-black/[0.06] flex flex-wrap items-baseline justify-between gap-3">
            <div>
              <h1 className="font-sans font-semibold text-3xl sm:text-4xl text-[#1d1d1f] tracking-tight">
                {cleanTitle}
              </h1>
              {area.disciplines.length > 1 && activeDiscipline && (
                <p className="text-sm sm:text-base font-medium text-[#86868b] mt-1.5">
                  {activeDiscipline.name}
                </p>
              )}
            </div>
          </div>

          {/* Sequential Vertical Topics List (Book Table of Contents) */}
          {activeDiscipline && (
            <div className="space-y-10">
              {activeDiscipline.topics.map((topic) => (
                <section key={topic.id} className="space-y-2">
                  {/* Topic / Chapter Title (No numbers, no descriptions) */}
                  <div className="border-b border-black/[0.06] pb-2.5 mb-2">
                    <h2 className="font-sans font-semibold text-lg sm:text-xl text-[#1d1d1f] tracking-tight">
                      {topic.title}
                    </h2>
                  </div>

                  {/* Vertical Subtopics (Book style list, NO numbers) */}
                  <ul className="space-y-0.5">
                    {topic.subtopics.map((subtopic) => (
                      <li key={subtopic.id}>
                        <button
                          onClick={() =>
                            onSelectSubtopic(area, activeDiscipline, topic, subtopic)
                          }
                          className="w-full text-left flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-[#f5f5f7] transition-all cursor-pointer group"
                        >
                          <span className="text-sm sm:text-[15px] text-[#424245] group-hover:text-[#1d1d1f] leading-snug font-normal">
                            {subtopic.title}
                          </span>
                          <div className="flex items-center gap-2 shrink-0 ml-4">
                            {subtopic.enemWeight && (
                              <span className="text-[11px] text-[#86868b] hidden sm:inline">
                                {subtopic.enemWeight}
                              </span>
                            )}
                            <ChevronRight className="w-4 h-4 text-[#86868b] group-hover:text-[#1d1d1f] group-hover:translate-x-0.5 transition-all" />
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
