import React from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Menu,
  ChevronRight,
} from 'lucide-react';
import { BreadcrumbPath, SubtopicItem, TopicItem, EnemWeight } from '../types/curriculum';
import { LatexRenderer, MathFormula } from './LatexRenderer';

interface TopicContentProps {
  activePath: BreadcrumbPath;
  onNavigateToSubtopic: (topic: TopicItem, subtopic: SubtopicItem) => void;
  onOpenSidebar: () => void;
  onBackToSummary?: (disciplineId?: string) => void;
}

function formatAreaTitle(name: string): string {
  if (name.toLowerCase().includes('natureza')) return 'Ciências da Natureza';
  if (name.toLowerCase().includes('matemática')) return 'Matemática';
  if (name.toLowerCase().includes('humanas')) return 'Ciências Humanas';
  if (name.toLowerCase().includes('linguagens')) return 'Linguagens';
  return name;
}

export const TopicContent: React.FC<TopicContentProps> = ({
  activePath,
  onNavigateToSubtopic,
  onOpenSidebar,
  onBackToSummary,
}) => {
  const { area, discipline, topic, subtopic } = activePath;

  const cleanAreaName = formatAreaTitle(area.name);
  const isSingleDiscipline =
    discipline.name.toLowerCase() === area.name.toLowerCase() ||
    discipline.name.toLowerCase() === cleanAreaName.toLowerCase();

  // Find previous and next subtopic in current topic list
  const currentIndex = topic.subtopics.findIndex((s) => s.id === subtopic?.id);
  const prevSubtopic = currentIndex > 0 ? topic.subtopics[currentIndex - 1] : null;
  const nextSubtopic =
    currentIndex >= 0 && currentIndex < topic.subtopics.length - 1
      ? topic.subtopics[currentIndex + 1]
      : null;

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-[#f5f5f7] py-6 sm:py-10 px-4 sm:px-8">
      {/* Top Breadcrumb & Chapter Navigation Bar */}
      <div className="max-w-4xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-3 select-none">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Back to Summary button with Apple Shadow +30% */}
          {onBackToSummary && (
            <button
              onClick={() => onBackToSummary(discipline.id)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-[#1d1d1f] shadow-[0_2px_10px_rgba(0,0,0,0.09),0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.16)] hover:scale-[1.02] transition-all cursor-pointer text-xs font-medium group"
              title={`Voltar ao sumário de ${discipline.name}`}
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform text-[#6e6e73]" />
              <span>Sumário</span>
            </button>
          )}

          {/* Elegant Apple Breadcrumb Trail */}
          <nav
            aria-label="Breadcrumb"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white shadow-[0_2px_10px_rgba(0,0,0,0.09),0_1px_3px_rgba(0,0,0,0.05)] text-xs font-sans"
          >
            <button
              onClick={() => onBackToSummary?.(discipline.id)}
              className="font-medium text-[#6e6e73] hover:text-[#1d1d1f] hover:underline transition-colors cursor-pointer"
              title={`Ver sumário de ${cleanAreaName}`}
            >
              {cleanAreaName}
            </button>

            {!isSingleDiscipline && (
              <>
                <ChevronRight className="w-3 h-3 text-[#86868b] shrink-0" />
                <button
                  onClick={() => onBackToSummary?.(discipline.id)}
                  className="font-medium text-[#6e6e73] hover:text-[#1d1d1f] hover:underline transition-colors cursor-pointer"
                  title={`Ir para sumário de ${discipline.name}`}
                >
                  {discipline.name}
                </button>
              </>
            )}

            <ChevronRight className="w-3 h-3 text-[#86868b] shrink-0" />
            <span className="text-[#1d1d1f] font-semibold truncate max-w-[200px] sm:max-w-[300px]">
              {topic.title}
            </span>
          </nav>
        </div>

        {/* General Sidebar Drawer Button with Apple Shadow +30% */}
        <button
          onClick={onOpenSidebar}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-xs font-medium text-[#1d1d1f] shadow-[0_2px_10px_rgba(0,0,0,0.09),0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.16)] hover:scale-[1.02] transition-all cursor-pointer shrink-0"
        >
          <Menu className="h-3.5 w-3.5 text-[#6e6e73]" />
          <span>Sumário Geral</span>
        </button>
      </div>

      {/* Main Content Reader Container (+30% Shadow) */}
      <article className="max-w-4xl mx-auto bg-white rounded-[28px] p-6 sm:p-12 md:p-16 shadow-[0_10px_34px_rgba(0,0,0,0.10),0_2px_8px_rgba(0,0,0,0.05)] text-neutral-900 font-serif">
        {/* Chapter Opening Header */}
        <header className="mb-12">
          <div className="flex items-center gap-2.5 text-xs font-sans text-neutral-500 uppercase tracking-wider mb-4">
            <span className="font-medium text-[#6e6e73]">{discipline.name}</span>
            <span className="text-neutral-300">•</span>
            <span>{topic.title}</span>
            {subtopic?.enemWeight && (
              <>
                <span className="text-neutral-300">•</span>
                <span className="text-neutral-700 font-semibold">
                  Incidência no ENEM: {subtopic.enemWeight}
                </span>
              </>
            )}
          </div>

          {/* Prominent Chapter Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal tracking-tight text-neutral-950 leading-tight">
            {subtopic ? subtopic.title : topic.title}
          </h1>

          {topic.description && (
            <p className="mt-4 text-base sm:text-lg text-neutral-600 font-serif italic leading-relaxed">
              {topic.description}
            </p>
          )}
        </header>

        {/* Section: Overview / Conceptual Foundation */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3 flex-wrap gap-2">
            <h2 className="text-xl sm:text-2xl font-serif font-semibold text-neutral-950">
              Conceitos Fundamentais
            </h2>
            <span className="text-[11px] font-sans tracking-wide text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full border border-neutral-200/70">
              Leitura Rápida & Aprofundamento
            </span>
          </div>

          {subtopic?.summary ? (
            <div className="text-base sm:text-lg leading-relaxed text-neutral-800 font-serif border-l-2 border-neutral-400/70 pl-4 py-1.5 italic bg-neutral-50/60 rounded-r-xl">
              <LatexRenderer content={subtopic.summary} />
            </div>
          ) : (
            <p className="text-base text-neutral-500 font-serif italic">
              Tópico integrante da matriz curricular oficial do ENEM.
            </p>
          )}

          {/* Key Concepts List (Classic Book bullet style) */}
          {subtopic?.keyConcepts && subtopic.keyConcepts.length > 0 && (
            <ul className="mt-6 space-y-4 pl-5 list-disc text-base sm:text-lg text-neutral-800 font-serif leading-relaxed marker:text-neutral-400">
              {subtopic.keyConcepts.map((concept, idx) => (
                <li key={idx} className="pl-1">
                  <LatexRenderer content={concept} />
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Section: Mathematical & Scientific Formulas */}
        {subtopic?.formulas && subtopic.formulas.length > 0 && (
          <section className="mt-14 space-y-8">
            <h2 className="text-xl sm:text-2xl font-serif font-semibold text-neutral-950 border-b border-neutral-100 pb-3">
              Formulário & Relações Matemáticas
            </h2>

            <div className="space-y-8">
              {subtopic.formulas.map((formula) => (
                <div
                  key={formula.id}
                  className="bg-[#f5f5f7] rounded-2xl p-6 sm:p-7 shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
                >
                  <div className="mb-2">
                    <h3 className="text-lg sm:text-xl font-serif font-medium text-neutral-900">
                      {formula.name}
                    </h3>
                    <p className="text-sm text-neutral-600 font-serif mt-1">
                      {formula.description}
                    </p>
                  </div>

                  {/* Centered Textbook Equation Display */}
                  <div className="my-6 py-4 text-center overflow-x-auto text-xl sm:text-2xl text-neutral-950 font-serif select-all">
                    <MathFormula latex={formula.latex} displayMode={true} />
                  </div>

                  {/* Concise Variable Explanations */}
                  {formula.variables && formula.variables.length > 0 && (
                    <div className="pt-3 border-t border-black/[0.05] text-sm font-serif text-neutral-700 space-y-1.5">
                      <span className="text-xs font-sans uppercase tracking-wider text-neutral-500 block mb-1">
                        Onde:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5">
                        {formula.variables.map((v, i) => (
                          <div key={i} className="flex items-baseline gap-2">
                            <span className="font-serif font-bold text-neutral-900">
                              <MathFormula latex={v.symbol} displayMode={false} />
                            </span>
                            <span className="text-neutral-700">— {v.meaning}</span>
                            {v.unit && (
                              <span className="text-neutral-400 text-xs font-mono">
                                ({v.unit})
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section: ENEM Insights / Book Editorial Notes */}
        {subtopic?.tips && subtopic.tips.length > 0 && (
          <section className="mt-14">
            <div className="bg-[#f5f5f7] rounded-2xl p-6 sm:p-7 shadow-[0_2px_8px_rgba(0,0,0,0.05)] border-l-4 border-neutral-900">
              <h3 className="text-xs font-sans uppercase tracking-widest font-semibold text-neutral-600 mb-3">
                Observações & Dicas para a Prova do ENEM
              </h3>
              <ul className="space-y-3 text-base sm:text-lg font-serif text-neutral-800 leading-relaxed italic">
                {subtopic.tips.map((tip, i) => (
                  <li key={i}>
                    <LatexRenderer content={tip} />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Chapter Footer Navigation */}
        <footer className="mt-16 pt-8 border-t border-neutral-100 flex items-center justify-between text-xs font-sans text-neutral-500">
          <div>
            {prevSubtopic && (
              <button
                onClick={() => onNavigateToSubtopic(topic, prevSubtopic)}
                className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white shadow-[0_2px_10px_rgba(0,0,0,0.09),0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_22px_rgba(0,0,0,0.16)] hover:scale-[1.01] transition-all cursor-pointer group text-left"
              >
                <ArrowLeft className="h-4 w-4 text-[#86868b] group-hover:text-[#1d1d1f] group-hover:-translate-x-0.5 transition-transform" />
                <div>
                  <span className="text-[10px] text-[#86868b] block uppercase tracking-wider">
                    Anterior
                  </span>
                  <span className="font-serif font-medium text-sm text-neutral-800 group-hover:text-neutral-950 truncate max-w-[200px] block">
                    {prevSubtopic.title}
                  </span>
                </div>
              </button>
            )}
          </div>

          <div>
            {nextSubtopic && (
              <button
                onClick={() => onNavigateToSubtopic(topic, nextSubtopic)}
                className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white shadow-[0_2px_10px_rgba(0,0,0,0.09),0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_22px_rgba(0,0,0,0.16)] hover:scale-[1.01] transition-all cursor-pointer group text-right"
              >
                <div>
                  <span className="text-[10px] text-[#86868b] block uppercase tracking-wider">
                    Próximo
                  </span>
                  <span className="font-serif font-medium text-sm text-neutral-800 group-hover:text-neutral-950 truncate max-w-[200px] block">
                    {nextSubtopic.title}
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 text-[#86868b] group-hover:text-[#1d1d1f] group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}
          </div>
        </footer>
      </article>
    </div>
  );
};
