import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronRight, FileText } from 'lucide-react';
import { KnowledgeArea, DisciplineItem, TopicItem, SubtopicItem } from '../types/curriculum';

interface SearchPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  curriculum: KnowledgeArea[];
  onSelect: (area: KnowledgeArea, discipline: DisciplineItem, topic: TopicItem, subtopic: SubtopicItem) => void;
}

interface FlatSearchResult {
  area: KnowledgeArea;
  discipline: DisciplineItem;
  topic: TopicItem;
  subtopic: SubtopicItem;
}

/**
 * Normalizes text removing accents, diacritics and casing
 * e.g., "Cinemática" -> "cinematica", "cínèmá" -> "cinema"
 */
function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export const SearchPalette: React.FC<SearchPaletteProps> = ({
  isOpen,
  onClose,
  curriculum,
  onSelect,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Flatten all subtopics for lightning fast search with accent-insensitivity
  const results: FlatSearchResult[] = React.useMemo(() => {
    const q = normalizeText(query);
    if (!q) return [];

    const matches: FlatSearchResult[] = [];
    for (const area of curriculum) {
      for (const disc of area.disciplines) {
        for (const topic of disc.topics) {
          for (const sub of topic.subtopics) {
            const normSubTitle = normalizeText(sub.title);
            const normTopicTitle = normalizeText(topic.title);
            const normDiscName = normalizeText(disc.name);
            const normSummary = normalizeText(sub.summary || '');
            const normKeyConcepts = (sub.keyConcepts || []).map(normalizeText);

            if (
              normSubTitle.includes(q) ||
              normTopicTitle.includes(q) ||
              normDiscName.includes(q) ||
              normSummary.includes(q) ||
              normKeyConcepts.some((k) => k.includes(q))
            ) {
              matches.push({
                area,
                discipline: disc,
                topic,
                subtopic: sub,
              });
              if (matches.length >= 25) break;
            }
          }
        }
      }
    }
    return matches;
  }, [curriculum, query]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 p-4 bg-black/25 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      <div 
        className="flex w-full max-w-xl flex-col rounded-[22px] bg-white text-[#1d1d1f] shadow-[0_24px_60px_-10px_rgba(0,0,0,0.20),0_8px_24px_rgba(0,0,0,0.10)] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input Bar */}
        <div className="flex items-center border-b border-black/[0.05] px-4 py-3.5 bg-white">
          <Search className="h-4 w-4 text-[#86868b] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar matéria, tópico ou fórmula..."
            className="w-full bg-transparent px-3 text-sm text-[#1d1d1f] placeholder:text-[#86868b] focus:outline-none font-normal"
          />
          <button
            onClick={onClose}
            className="text-[#86868b] hover:text-[#1d1d1f] p-1 rounded-full hover:bg-[#f5f5f7] transition-colors cursor-pointer"
            aria-label="Fechar busca"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2">
          {query.trim() === '' ? (
            <div className="py-8 text-center text-xs text-[#86868b]">
              Digite o nome de uma matéria, tópico ou fórmula para buscar...
            </div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#86868b]">
              Nenhum resultado encontrado para &quot;{query}&quot;.
            </div>
          ) : (
            <div className="space-y-0.5">
              {results.map((item, idx) => (
                <button
                  key={`${item.subtopic.id}-${idx}`}
                  onClick={() => {
                    onSelect(item.area, item.discipline, item.topic, item.subtopic);
                    onClose();
                  }}
                  className="flex w-full items-center justify-between rounded-xl p-3 text-left text-xs hover:bg-[#f5f5f7] transition-colors cursor-pointer group"
                >
                  <div className="flex items-start gap-3 truncate">
                    <FileText className="h-4 w-4 text-[#86868b] shrink-0 mt-0.5 group-hover:text-[#1d1d1f] transition-colors" />
                    <div className="truncate">
                      <div className="font-medium text-[#1d1d1f] text-sm truncate">
                        {item.subtopic.title}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-[#86868b] truncate mt-0.5">
                        <span>{item.discipline.name}</span>
                        <span>•</span>
                        <span>{item.topic.title}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-[#86868b] group-hover:text-[#1d1d1f] shrink-0 ml-2 transition-transform group-hover:translate-x-0.5" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
