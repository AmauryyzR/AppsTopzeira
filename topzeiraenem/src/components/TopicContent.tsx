import React, { useState } from 'react';
import {
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  Menu,
} from 'lucide-react';
import { BreadcrumbPath, SubtopicItem, TopicItem } from '../types/curriculum';
import { LatexRenderer, MathFormula } from './LatexRenderer';

interface TopicContentProps {
  activePath: BreadcrumbPath;
  onNavigateToSubtopic: (topic: TopicItem, subtopic: SubtopicItem) => void;
  onOpenSidebar: () => void;
}

export const TopicContent: React.FC<TopicContentProps> = ({
  activePath,
  onNavigateToSubtopic,
  onOpenSidebar,
}) => {
  const { area, discipline, topic, subtopic } = activePath;
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyFormula = (latex: string, id: string) => {
    navigator.clipboard.writeText(latex);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Find previous and next subtopic in current topic list
  const currentIndex = topic.subtopics.findIndex((s) => s.id === subtopic?.id);
  const prevSubtopic = currentIndex > 0 ? topic.subtopics[currentIndex - 1] : null;
  const nextSubtopic =
    currentIndex >= 0 && currentIndex < topic.subtopics.length - 1
      ? topic.subtopics[currentIndex + 1]
      : null;

  return (
    <article className="mx-auto w-full max-w-3xl px-6 sm:px-10 py-10 sm:py-14 text-neutral-900 font-serif">
      {/* Top Breadcrumb & Chapter Navigation in Book Style */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-5 mb-10 text-xs font-sans text-neutral-500">
        <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1.5">
          <span className="font-semibold text-neutral-900 tracking-wide">
            {area.name}
          </span>
          <span className="text-neutral-400">/</span>
          <span className="text-neutral-700">{discipline.name}</span>
          <span className="text-neutral-400">/</span>
          <span className="text-neutral-500">{topic.title}</span>
        </nav>

        <button
          onClick={onOpenSidebar}
          className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer shrink-0 font-medium"
        >
          <Menu className="h-3.5 w-3.5" />
          <span>Sumário</span>
        </button>
      </div>

      {/* Book Chapter Opening */}
      <header className="mb-12">
        <div className="flex items-center gap-3 text-xs font-sans text-neutral-500 uppercase tracking-widest mb-3">
          <span>{discipline.name}</span>
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

        {/* Large Prominent Chapter Title */}
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
        <h2 className="text-xl sm:text-2xl font-serif font-semibold text-neutral-950 border-b border-neutral-200 pb-2">
          Conceitos Fundamentais
        </h2>

        {subtopic?.summary ? (
          <div className="text-base sm:text-lg leading-relaxed text-neutral-800 font-serif">
            <LatexRenderer content={subtopic.summary} />
          </div>
        ) : (
          <p className="text-base text-neutral-500 font-serif italic">
            Tópico integrante da matriz curricular oficial do ENEM.
          </p>
        )}

        {/* Key Concepts List (Book bulleted style, no boxes) */}
        {subtopic?.keyConcepts && subtopic.keyConcepts.length > 0 && (
          <ul className="mt-6 space-y-3.5 pl-5 list-disc text-base sm:text-lg text-neutral-800 font-serif leading-relaxed marker:text-neutral-400">
            {subtopic.keyConcepts.map((concept, idx) => (
              <li key={idx} className="pl-1">
                <LatexRenderer content={concept} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Section: Mathematical & Scientific Formulas (Pure textbook display, no card borders) */}
      {subtopic?.formulas && subtopic.formulas.length > 0 && (
        <section className="mt-14 space-y-8">
          <div className="border-b border-neutral-200 pb-2">
            <h2 className="text-xl sm:text-2xl font-serif font-semibold text-neutral-950">
              Formulário & Relações Matemáticas
            </h2>
          </div>

          <div className="space-y-12">
            {subtopic.formulas.map((formula) => (
              <div key={formula.id} className="pt-2">
                <div className="flex items-baseline justify-between gap-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-serif font-medium text-neutral-900">
                      {formula.name}
                    </h3>
                    <p className="text-sm text-neutral-600 font-serif mt-1">
                      {formula.description}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopyFormula(formula.latex, formula.id)}
                    className="text-xs font-sans text-neutral-400 hover:text-neutral-800 transition-colors cursor-pointer shrink-0"
                    title="Copiar código LaTeX"
                  >
                    {copiedId === formula.id ? (
                      <span className="inline-flex items-center gap-1 text-neutral-900 font-medium">
                        <Check className="h-3 w-3" />
                        Copiado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 hover:underline">
                        <Copy className="h-3 w-3" />
                        Copiar LaTeX
                      </span>
                    )}
                  </button>
                </div>

                {/* Centered Textbook Equation Display - completely free of card boxes */}
                <div className="my-6 py-5 text-center overflow-x-auto text-xl sm:text-2xl text-neutral-950 font-serif select-all">
                  <MathFormula latex={formula.latex} displayMode={true} />
                </div>

                {/* Concise Variable Explanations in Classic Style */}
                {formula.variables && formula.variables.length > 0 && (
                  <div className="pl-4 border-l-2 border-neutral-200 text-sm font-serif text-neutral-700 space-y-1.5 mt-3">
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

      {/* Section: ENEM Insights / Book Editorial Notes (Clean quotation style, no cards) */}
      {subtopic?.tips && subtopic.tips.length > 0 && (
        <section className="mt-14 pt-8 border-t border-neutral-200">
          <div className="border-l-2 border-neutral-900 pl-6 py-2">
            <h3 className="text-xs font-sans uppercase tracking-widest font-semibold text-neutral-600 mb-3">
              Observações & Dicas para a Prova do ENEM
            </h3>
            <ul className="space-y-3 text-base sm:text-lg font-serif text-neutral-800 leading-relaxed italic">
              {subtopic.tips.map((tip, idx) => (
                <li key={idx}>
                  <LatexRenderer content={tip} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Chapter Page Turn Navigation */}
      <footer className="mt-16 pt-8 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-xs text-neutral-600">
        {prevSubtopic ? (
          <button
            onClick={() => onNavigateToSubtopic(topic, prevSubtopic)}
            className="flex items-center gap-2 hover:text-neutral-950 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 text-neutral-400" />
            <div className="text-left">
              <span className="block text-[10px] uppercase text-neutral-400">Anterior</span>
              <span className="font-medium text-neutral-800 hover:underline">{prevSubtopic.title}</span>
            </div>
          </button>
        ) : (
          <div />
        )}

        {nextSubtopic ? (
          <button
            onClick={() => onNavigateToSubtopic(topic, nextSubtopic)}
            className="flex items-center gap-2 hover:text-neutral-950 transition-colors cursor-pointer text-right ml-auto"
          >
            <div className="text-right">
              <span className="block text-[10px] uppercase text-neutral-400">Próximo</span>
              <span className="font-medium text-neutral-800 hover:underline">{nextSubtopic.title}</span>
            </div>
            <ArrowRight className="h-4 w-4 text-neutral-400" />
          </button>
        ) : (
          <div />
        )}
      </footer>
    </article>
  );
};

