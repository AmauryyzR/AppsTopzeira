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

  // Filter curriculum when searching
  const filteredCurriculum = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return curriculum;

    return curriculum
      .map((area) => {
        const matchingDisciplines = area.disciplines
          .map((disc) => {
            const matchingTopics = disc.topics
              .map((topic) => {
                const matchingSubtopics = topic.subtopics.filter((sub) =>
                  sub.title.toLowerCase().includes(term) ||
                  sub.summary?.toLowerCase().includes(term) ||
                  sub.keyConcepts?.some((k) => k.toLowerCase().includes(term))
                );

                const topicMatches = topic.title.toLowerCase().includes(term);
                if (topicMatches || matchingSubtopics.length > 0) {
                  return {
                    ...topic,
                    subtopics: matchingSubtopics.length > 0 ? matchingSubtopics : topic.subtopics,
                  };
                }
                return null;
              })
              .filter(Boolean) as TopicItem[];

            const discMatches = disc.name.toLowerCase().includes(term);
            if (discMatches || matchingTopics.length > 0) {
              return {
                ...disc,
                topics: matchingTopics.length > 0 ? matchingTopics : disc.topics,
              };
            }
            return null;
          })
          .filter(Boolean) as DisciplineItem[];

        const areaMatches = area.name.toLowerCase().includes(term);
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

  return (
    <>
      {/* Backdrop overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-neutral-950/20 backdrop-blur-xs transition-opacity duration-200"
          aria-hidden="true"
        />
      )}

      {/* Drawer panel sliding from right */}
      <aside
        id="curriculum-sidebar-drawer"
        aria-label="Sumário Curricular do ENEM"
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md md:max-w-lg flex-col border-l border-neutral-200 bg-white shadow-2xl transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header - Book Table of Contents style */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-5 bg-white">
          <div className="flex items-center gap-2.5">
            <BookOpen className="h-4 w-4 text-neutral-800" />
            <h2 className="text-base font-serif font-medium text-neutral-950">
              Sumário de Conteúdos
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
            title="Fechar sumário"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Minimal Search Bar */}
        <div className="border-b border-neutral-200 px-6 py-3 bg-neutral-50/50">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-neutral-400" />
            <input
              type="text"
              placeholder="Pesquisar tópico ou assunto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded border border-neutral-200 bg-white py-1.5 pl-9 pr-3 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none transition-colors font-sans"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2 text-xs text-neutral-400 hover:text-neutral-600"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Classic Topic Tree (No folders, pure clean outline) */}
        <div className="flex-1 overflow-y-auto px-6 py-6 font-sans text-xs">
          {filteredCurriculum.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-500 font-serif">
              Nenhum conteúdo encontrado para &quot;{searchTerm}&quot;.
            </div>
          ) : (
            <div className="space-y-6">
              {filteredCurriculum.map((area) => {
                const isAreaExpanded = !!expandedAreas[area.id];

                return (
                  <div key={area.id} className="space-y-2">
                    {/* Area Level (Ciências da Natureza, etc.) */}
                    <button
                      onClick={() => toggleArea(area.id)}
                      className="flex w-full items-center justify-between text-left py-1 text-xs font-semibold uppercase tracking-wider text-neutral-900 hover:text-neutral-700 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        {isAreaExpanded ? (
                          <ChevronDown className="h-3.5 w-3.5 text-neutral-500 shrink-0" />
                        ) : (
                          <ChevronRight className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                        )}
                        <span>{area.name}</span>
                      </span>
                      <span className="font-mono text-[10px] text-neutral-600 px-1.5 py-0.5 rounded bg-neutral-100">
                        {area.code}
                      </span>
                    </button>

                    {/* Disciplines Level (Física, Biologia, Química, etc.) */}
                    {isAreaExpanded && (
                      <div className="pl-4 space-y-3 border-l border-neutral-200 ml-1.5">
                        {area.disciplines.map((discipline) => {
                          const isDiscExpanded = !!expandedDisciplines[discipline.id];

                          return (
                            <div key={discipline.id} className="space-y-1.5">
                              {/* Discipline Button */}
                              <button
                                onClick={() => toggleDiscipline(discipline.id)}
                                className="flex w-full items-center justify-between py-1 text-left text-xs font-medium text-neutral-800 hover:text-neutral-950 transition-colors cursor-pointer"
                              >
                                <span className="flex items-center gap-1.5">
                                  {isDiscExpanded ? (
                                    <ChevronDown className="h-3 w-3 text-neutral-400 shrink-0" />
                                  ) : (
                                    <ChevronRight className="h-3 w-3 text-neutral-400 shrink-0" />
                                  )}
                                  <span className="font-serif text-sm font-semibold text-neutral-900">{discipline.name}</span>
                                </span>
                                <span className="text-[10px] text-neutral-600 font-mono">
                                  {discipline.topics.reduce((acc, t) => acc + t.subtopics.length, 0)} tópicos
                                </span>
                              </button>

                              {/* Topics & Subtopics Outline */}
                              {isDiscExpanded && (
                                <div className="pl-4 space-y-3 border-l border-neutral-100 ml-1 mt-1">
                                  {discipline.topics.map((topic) => {
                                    const isTopicExpanded = !!expandedTopics[topic.id];

                                    return (
                                      <div key={topic.id} className="space-y-1">
                                        {/* Topic Header */}
                                        <button
                                          onClick={() => toggleTopic(topic.id)}
                                          className="flex w-full items-center justify-between py-1 text-left text-xs text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
                                        >
                                          <span className="flex items-center gap-1.5 font-medium text-neutral-700">
                                            {isTopicExpanded ? (
                                              <span className="text-neutral-400 font-mono text-[10px]">—</span>
                                            ) : (
                                              <span className="text-neutral-400 font-mono text-[10px]">+</span>
                                            )}
                                            <span>{topic.title}</span>
                                          </span>
                                        </button>

                                        {/* Direct Subtopics Clickable Items */}
                                        {isTopicExpanded && (
                                          <ul className="pl-4 space-y-1">
                                            {topic.subtopics.map((sub) => {
                                              const isCurrent = activePath?.subtopic?.id === sub.id;

                                              return (
                                                <li key={sub.id}>
                                                  <button
                                                    onClick={() => {
                                                      onSelect(area, discipline, topic, sub);
                                                      onClose();
                                                    }}
                                                    className={`w-full text-left py-1 px-2 rounded text-xs transition-colors cursor-pointer flex items-baseline justify-between gap-2 ${
                                                      isCurrent
                                                        ? 'bg-neutral-900 text-white font-medium'
                                                        : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
                                                    }`}
                                                  >
                                                    <span className="truncate">{sub.title}</span>
                                                    {sub.enemWeight && (
                                                      <span
                                                        className={`shrink-0 text-[9px] font-mono uppercase ${
                                                          isCurrent ? 'text-neutral-300' : 'text-neutral-400'
                                                        }`}
                                                      >
                                                        {sub.enemWeight}
                                                      </span>
                                                    )}
                                                  </button>
                                                </li>
                                              );
                                            })}
                                          </ul>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
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
