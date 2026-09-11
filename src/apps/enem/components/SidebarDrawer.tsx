import React, { useState, useMemo } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Search,
  X,
  BookOpen
} from 'lucide-react';
import {
  KnowledgeArea,
  DisciplineItem,
  TopicItem,
  SubtopicItem,
  BreadcrumbPath,
} from '../types/curriculum';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  curriculum: KnowledgeArea[];
  activePath: BreadcrumbPath | null;
  onSelect: (area: KnowledgeArea, discipline: DisciplineItem, topic: TopicItem, subtopic?: SubtopicItem) => void;
}

/**
 * Normalizes text removing accents, diacritics and casing
 */
function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function formatAreaTitle(name: string): string {
  if (name.toLowerCase().includes('natureza')) return 'Ciências da Natureza';
  if (name.toLowerCase().includes('matemática')) return 'Matemática';
  if (name.toLowerCase().includes('humanas')) return 'Ciências Humanas';
  if (name.toLowerCase().includes('linguagens')) return 'Linguagens';
  return name;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  isOpen,
  onClose,
  curriculum,
  activePath,
  onSelect,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Expanded state map
  const [expandedAreas, setExpandedAreas] = useState<Record<string, boolean>>({
    'ciencias-natureza': true,
    'matematica': false,
    'ciencias-humanas': false,
    'linguagens': false,
  });

  const [expandedDisciplines, setExpandedDisciplines] = useState<Record<string, boolean>>({
    'fisica': true,
    'quimica': false,
    'biologia': false,
  });

  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({
    'mecanica': true,
  });

  const toggleArea = (areaId: string) => {
    setExpandedAreas((prev) => ({
      ...prev,
      [areaId]: !prev[areaId],
    }));
  };

  const toggleDiscipline = (discId: string) => {
    setExpandedDisciplines((prev) => ({
      ...prev,
      [discId]: !prev[discId],
    }));
  };

  const toggleTopic = (topicId: string) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topicId]: !prev[topicId],
    }));
  };

  // Filter curriculum when searching (accent-insensitive)
  const filteredCurriculum = useMemo(() => {
    const term = normalizeText(searchTerm);
    if (!term) return curriculum;

    return curriculum
      .map((area) => {
        const matchingDisciplines = area.disciplines
          .map((disc) => {
            const matchingTopics = disc.topics
              .map((topic) => {
                const matchingSubtopics = topic.subtopics.filter((sub) =>
                  normalizeText(sub.title).includes(term) ||
                  normalizeText(sub.summary || '').includes(term) ||
                  (sub.keyConcepts || []).some((k) => normalizeText(k).includes(term))
                );

                const topicMatches = normalizeText(topic.title).includes(term);
                if (topicMatches || matchingSubtopics.length > 0) {
                  return {
                    ...topic,
                    subtopics: matchingSubtopics.length > 0 ? matchingSubtopics : topic.subtopics,
                  };
                }
                return null;
              })
              .filter(Boolean) as TopicItem[];

            const discMatches = normalizeText(disc.name).includes(term);
            if (discMatches || matchingTopics.length > 0) {
              return {
                ...disc,
                topics: matchingTopics.length > 0 ? matchingTopics : disc.topics,
              };
            }
            return null;
          })
          .filter(Boolean) as DisciplineItem[];

        const areaMatches = normalizeText(area.name).includes(term);
        if (areaMatches || matchingDisciplines.length > 0) {
          return {
            ...area,
            disciplines: matchingDisciplines.length > 0 ? matchingDisciplines : area.disciplines,
          };
        }
        return null;
      })
      .filter(Boolean) as KnowledgeArea[];
  }, [curriculum, searchTerm]);

  // When searching, auto-expand matching nodes
  React.useEffect(() => {
    if (searchTerm.trim().length > 1) {
      const areas: Record<string, boolean> = {};
      const discs: Record<string, boolean> = {};
      const topics: Record<string, boolean> = {};

      filteredCurriculum.forEach((a) => {
        areas[a.id] = true;
        a.disciplines.forEach((d) => {
          discs[d.id] = true;
          d.topics.forEach((t) => {
            topics[t.id] = true;
          });
        });
      });

      setExpandedAreas(areas);
      setExpandedDisciplines(discs);
      setExpandedTopics(topics);
    }
  }, [searchTerm, filteredCurriculum]);

  // Helper to render topic items
  const renderTopic = (area: KnowledgeArea, disc: DisciplineItem, topic: TopicItem) => {
    const isTopicExpanded = !!expandedTopics[topic.id];

    return (
      <div key={topic.id} className="space-y-1">
        <button
          onClick={() => toggleTopic(topic.id)}
          className="flex w-full items-center justify-between text-left py-1 text-xs text-[#515154] hover:text-[#1d1d1f] transition-colors cursor-pointer"
        >
          <span className="font-medium leading-snug">
            {topic.title}
          </span>
          {topic.subtopics.length > 0 && (
            <span className="text-[#86868b] ml-1 shrink-0">
              {isTopicExpanded ? (
                <ChevronDown className="h-2.5 w-2.5" />
              ) : (
                <ChevronRight className="h-2.5 w-2.5" />
              )}
            </span>
          )}
        </button>

        {/* Subtopics List (No numbers) */}
        {isTopicExpanded && (
          <ul className="pl-3 space-y-1 pt-0.5 border-l border-black/[0.04] ml-0.5">
            {topic.subtopics.map((sub) => {
              const isSubActive = activePath?.subtopic?.id === sub.id;

              return (
                <li key={sub.id}>
                  <button
                    onClick={() => onSelect(area, disc, topic, sub)}
                    className={`w-full text-left py-1 px-2.5 rounded-lg text-[11px] leading-snug transition-colors cursor-pointer block ${
                      isSubActive
                        ? 'bg-[#1d1d1f] text-white font-medium shadow-[0_2px_6px_rgba(0,0,0,0.15)]'
                        : 'text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-[#f5f5f7]'
                    }`}
                  >
                    {sub.title}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Backdrop overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/25 backdrop-blur-xs transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Drawer panel sliding from LEFT */}
      <aside
        id="curriculum-sidebar-drawer"
        aria-label="Sumário Curricular do ENEM"
        className={`fixed inset-y-0 left-0 z-50 flex w-full max-w-md md:max-w-lg flex-col bg-white text-[#1d1d1f] shadow-[16px_0_48px_rgba(0,0,0,0.12)] transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0 opacity-100 visible pointer-events-auto' : '-translate-x-full opacity-0 invisible pointer-events-none'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-black/[0.05] px-6 py-5 bg-white">
          <div className="flex items-center gap-2.5">
            <BookOpen className="h-4 w-4 text-[#1d1d1f]" />
            <h2 className="text-base font-sans font-semibold text-[#1d1d1f]">
              Sumário de Conteúdos
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-[#f5f5f7] transition-colors cursor-pointer"
            title="Fechar sumário"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Minimal Search Bar */}
        <div className="border-b border-black/[0.05] px-6 py-3 bg-[#f5f5f7]/80">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#86868b]" />
            <input
              type="text"
              placeholder="Pesquisar matéria, tópico ou assunto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl bg-white py-2 pl-9 pr-3 text-xs text-[#1d1d1f] placeholder:text-[#86868b] shadow-[0_1px_4px_rgba(0,0,0,0.06)] focus:outline-none transition-shadow font-sans"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2 text-xs text-[#86868b] hover:text-[#1d1d1f]"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Outline Tree (Pure clean outline, NO numbers, NO redundant discipline) */}
        <div className="flex-1 overflow-y-auto px-6 py-6 font-sans text-xs">
          {filteredCurriculum.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#86868b]">
              Nenhum conteúdo encontrado para &quot;{searchTerm}&quot;.
            </div>
          ) : (
            <div className="space-y-6">
              {filteredCurriculum.map((area) => {
                const isAreaExpanded = !!expandedAreas[area.id];
                const cleanAreaName = formatAreaTitle(area.name);
                const hasSingleDiscipline = area.disciplines.length === 1;

                return (
                  <div key={area.id} className="space-y-2">
                    {/* Area Title Heading - Clean, NO acronym badge (no MT, CH, LC) */}
                    <button
                      onClick={() => toggleArea(area.id)}
                      className="flex w-full items-center justify-between py-1.5 text-left font-semibold text-xs tracking-wider uppercase text-[#1d1d1f] hover:text-[#0066cc] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span>{cleanAreaName}</span>
                      </div>
                      <div className="text-[#86868b]">
                        {isAreaExpanded ? (
                          <ChevronDown className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronRight className="h-3.5 w-3.5" />
                        )}
                      </div>
                    </button>

                    {/* Disciplines / Topics Container */}
                    {isAreaExpanded && (
                      <div className="pl-2 space-y-4 border-l border-black/[0.06] ml-1 mt-1">
                        {hasSingleDiscipline ? (
                          /* If single discipline (like Matemática), do NOT show redundant discipline button! Render topics directly! */
                          <div className="pl-2 space-y-3 pt-1">
                            {area.disciplines[0].topics.map((topic) =>
                              renderTopic(area, area.disciplines[0], topic)
                            )}
                          </div>
                        ) : (
                          /* If multiple disciplines (Física, Química, Biologia), render discipline collapsibles */
                          area.disciplines.map((disc) => {
                            const isDiscExpanded = !!expandedDisciplines[disc.id];

                            return (
                              <div key={disc.id} className="space-y-1.5">
                                {/* Discipline Label */}
                                <button
                                  onClick={() => toggleDiscipline(disc.id)}
                                  className="flex w-full items-center justify-between py-1 text-left font-medium text-xs text-[#515154] hover:text-[#1d1d1f] transition-colors cursor-pointer group"
                                >
                                  <span className="group-hover:translate-x-0.5 transition-transform">
                                    {disc.name}
                                  </span>
                                  <span className="text-[#86868b]">
                                    {isDiscExpanded ? (
                                      <ChevronDown className="h-3 w-3" />
                                    ) : (
                                      <ChevronRight className="h-3 w-3" />
                                    )}
                                  </span>
                                </button>

                                {/* Topics List */}
                                {isDiscExpanded && (
                                  <div className="pl-3 space-y-3 pt-1">
                                    {disc.topics.map((topic) =>
                                      renderTopic(area, disc, topic)
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
