import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronRight, FileText, BookOpen } from 'lucide-react';
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

  // Flatten all subtopics for lightning fast search
  const results: FlatSearchResult[] = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const matches: FlatSearchResult[] = [];
    for (const area of curriculum) {
      for (const disc of area.disciplines) {
        for (const topic of disc.topics) {
          for (const sub of topic.subtopics) {
            if (
              sub.title.toLowerCase().includes(q) ||
              topic.title.toLowerCase().includes(q) ||
              disc.name.toLowerCase().includes(q) ||
              sub.summary?.toLowerCase().includes(q)
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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-neutral-950/30 backdrop-blur-xs">
      <div className="flex w-full max-w-xl flex-col rounded-lg border border-neutral-200 bg-white shadow-2xl overflow-hidden">
        {/* Input Bar */}
        <div className="flex items-center border-b border-neutral-200 px-4 py-3 bg-white">
          <Search className="h-4 w-4 text-neutral-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar tópico do ENEM (ex: Cinemática, Redação, Clapeyron)..."
            className="w-full bg-transparent px-3 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-900 p-1 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2">
          {query.trim() === '' ? (
            <div className="py-8 text-center text-xs text-neutral-400">
              Digite o nome de uma matéria, tópico ou fórmula para buscar...
            </div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-500">
              Nenhum resultado encontrado para &quot;{query}&quot;.
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((item, idx) => (
                <button
                  key={`${item.subtopic.id}-${idx}`}
                  onClick={() => {
                    onSelect(item.area, item.discipline, item.topic, item.subtopic);
                    onClose();
                  }}
                  className="flex w-full items-center justify-between rounded-md p-2.5 text-left text-xs hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-2.5 truncate">
                    <FileText className="h-4 w-4 text-neutral-400 shrink-0 mt-0.5" />
                    <div className="truncate">
                      <div className="font-medium text-neutral-900 truncate">
                        {item.subtopic.title}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-neutral-500 truncate">
                        <span>{item.discipline.name}</span>
                        <span>•</span>
                        <span>{item.topic.title}</span>
                      </div>
                    </div>
                  </div>
                  <span className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[10px] text-neutral-600 shrink-0 ml-2">
                    {item.area.code}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-100 px-4 py-2 bg-neutral-50 flex items-center justify-between text-[11px] text-neutral-400">
          <span>{results.length} resultados encontrados</span>
          <span>Pressione ESC para fechar</span>
        </div>
      </div>
    </div>
  );
};
