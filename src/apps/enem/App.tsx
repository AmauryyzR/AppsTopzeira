import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SidebarDrawer } from './components/SidebarDrawer';
import { TopicContent } from './components/TopicContent';
import { SearchPalette } from './components/SearchPalette';
import { EnemHomeView } from './components/EnemHomeView';
import { AprofundadoHomeView } from './components/AprofundadoHomeView';
import { AreaSummaryView } from './components/AreaSummaryView';
import { ENEM_CURRICULUM } from './data/curriculumData';
import {
  KnowledgeArea,
  DisciplineItem,
  TopicItem,
  SubtopicItem,
  BreadcrumbPath,
} from './types/curriculum';

export type EnemViewMode = 'home' | 'aprofundado-home' | 'summary' | 'topic';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [viewMode, setViewMode] = useState<EnemViewMode>('home');
  const [isAprofundado, setIsAprofundado] = useState<boolean>(false);
  const [selectedArea, setSelectedArea] = useState<KnowledgeArea | null>(null);
  const [selectedDisciplineId, setSelectedDisciplineId] = useState<string | null>(null);

  // Active path when viewing a topic
  const [activePath, setActivePath] = useState<BreadcrumbPath | null>(null);

  // Set body background to light theme for ENEM app
  useEffect(() => {
    const originalBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = '#f5f5f7';
    return () => {
      document.body.style.backgroundColor = originalBg;
    };
  }, []);

  // Handle global keyboard shortcuts (Ctrl+K / Cmd+K, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // When clicking an Area from standard Home (Ciências da Natureza, etc.)
  const handleSelectArea = (area: KnowledgeArea, disciplineId?: string) => {
    setIsAprofundado(false);
    setSelectedArea(area);
    setSelectedDisciplineId(disciplineId || area.disciplines[0]?.id || '');
    setViewMode('summary');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // When clicking the central "Aprofundado" widget from Home
  const handleOpenAprofundado = () => {
    setIsAprofundado(true);
    setViewMode('aprofundado-home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // When clicking an individual discipline in Aprofundado mode
  const handleSelectAprofundadoDiscipline = (
    area: KnowledgeArea,
    discipline: DisciplineItem
  ) => {
    setIsAprofundado(true);
    setSelectedArea(area);
    setSelectedDisciplineId(discipline.id);
    setViewMode('summary');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // When clicking a subtopic from the Area Summary (or from Search / Drawer)
  const handleSelectSubtopic = (
    area: KnowledgeArea,
    discipline: DisciplineItem,
    topic: TopicItem,
    subtopic?: SubtopicItem
  ) => {
    const sub = subtopic || topic.subtopics[0];
    setSelectedArea(area);
    setSelectedDisciplineId(discipline.id);
    setActivePath({
      area,
      discipline,
      topic,
      subtopic: sub,
      isAprofundado,
    });
    setViewMode('topic');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateSubtopic = (topic: TopicItem, subtopic: SubtopicItem) => {
    if (!activePath) return;
    setActivePath((prev) =>
      prev
        ? {
            ...prev,
            topic,
            subtopic,
            isAprofundado,
          }
        : null
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHome = () => {
    setIsAprofundado(false);
    setViewMode('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromSummary = () => {
    if (isAprofundado) {
      setViewMode('aprofundado-home');
    } else {
      setViewMode('home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoSummary = (disciplineId?: string) => {
    if (activePath?.area) {
      setSelectedArea(activePath.area);
    }
    const targetDiscId =
      disciplineId ||
      activePath?.discipline.id ||
      selectedDisciplineId ||
      selectedArea?.disciplines[0]?.id ||
      '';
    setSelectedDisciplineId(targetDiscId);
    setViewMode('summary');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#f5f5f7] text-[#1d1d1f] flex flex-col antialiased selection:bg-[#1d1d1f] selection:text-white">
      {/* Top Header */}
      <Header
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        activePath={activePath}
        selectedArea={selectedArea}
        viewMode={viewMode}
        onGoHome={handleGoHome}
        onGoSummary={handleGoSummary}
        onOpenSearch={() => setSearchOpen(true)}
      />

      {/* Main Dynamic Viewport */}
      <main className="flex-1 pb-16 w-full max-w-full overflow-x-hidden min-w-0">
        {viewMode === 'home' && (
          <EnemHomeView
            curriculum={ENEM_CURRICULUM}
            onSelectArea={handleSelectArea}
            onSelectAprofundado={handleOpenAprofundado}
          />
        )}

        {viewMode === 'aprofundado-home' && (
          <AprofundadoHomeView
            curriculum={ENEM_CURRICULUM}
            onSelectDiscipline={handleSelectAprofundadoDiscipline}
            onBackToHome={handleGoHome}
          />
        )}

        {viewMode === 'summary' && selectedArea && (
          <AreaSummaryView
            area={selectedArea}
            selectedDisciplineId={selectedDisciplineId || selectedArea.disciplines[0]?.id || ''}
            onSelectDiscipline={(discId) => setSelectedDisciplineId(discId)}
            onBackToHome={handleBackFromSummary}
            onSelectSubtopic={handleSelectSubtopic}
            isAprofundado={isAprofundado}
          />
        )}

        {viewMode === 'topic' && activePath && (
          <TopicContent
            activePath={activePath}
            onNavigateToSubtopic={handleNavigateSubtopic}
            onOpenSidebar={() => setSidebarOpen(true)}
            onBackToSummary={handleGoSummary}
          />
        )}
      </main>

      {/* Hierarchical Folder Sidebar Drawer (Opens from top-left hamburger) */}
      <SidebarDrawer
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        curriculum={ENEM_CURRICULUM}
        activePath={activePath}
        onSelect={(area, discipline, topic, subtopic) => {
          handleSelectSubtopic(area, discipline, topic, subtopic);
          setSidebarOpen(false);
        }}
      />

      {/* Quick Search Palette (⌘K) */}
      <SearchPalette
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        curriculum={ENEM_CURRICULUM}
        onSelect={(area, discipline, topic, subtopic) => {
          handleSelectSubtopic(area, discipline, topic, subtopic);
          setSearchOpen(false);
        }}
      />
    </div>
  );
}
