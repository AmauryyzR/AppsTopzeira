import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SidebarDrawer } from './components/SidebarDrawer';
import { TopicContent } from './components/TopicContent';
import { SearchPalette } from './components/SearchPalette';
import { ENEM_CURRICULUM } from './data/curriculumData';
import {
  KnowledgeArea,
  DisciplineItem,
  TopicItem,
  SubtopicItem,
  BreadcrumbPath,
} from './types/curriculum';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Initialize with Física -> Mecânica Clássica -> Cinemática Escalar e Vetorial as default
  const [activePath, setActivePath] = useState<BreadcrumbPath>(() => {
    const defaultArea = ENEM_CURRICULUM[0]; // Ciências da Natureza
    const defaultDiscipline = defaultArea.disciplines[0]; // Física
    const defaultTopic = defaultDiscipline.topics[0]; // Mecânica
    const defaultSubtopic = defaultTopic.subtopics[0]; // Cinemática

    return {
      area: defaultArea,
      discipline: defaultDiscipline,
      topic: defaultTopic,
      subtopic: defaultSubtopic,
    };
  });

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

  const handleSelectSubtopic = (
    area: KnowledgeArea,
    discipline: DisciplineItem,
    topic: TopicItem,
    subtopic?: SubtopicItem
  ) => {
    setActivePath({
      area,
      discipline,
      topic,
      subtopic: subtopic || topic.subtopics[0],
    });
    // Scroll to top of main content
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateSubtopic = (topic: TopicItem, subtopic: SubtopicItem) => {
    setActivePath((prev) => ({
      ...prev,
      topic,
      subtopic,
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col antialiased">
      {/* Top Header with Brand and Top-Right 3-Bars Hamburger Button */}
      <Header
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        activePath={activePath}
        onOpenSearch={() => setSearchOpen(true)}
      />

      {/* Main Dynamic Viewport */}
      <main className="flex-1 pb-16">
        <TopicContent
          activePath={activePath}
          onNavigateToSubtopic={handleNavigateSubtopic}
          onOpenSidebar={() => setSidebarOpen(true)}
        />
      </main>

      {/* Hierarchical Folder Sidebar Drawer (Opens from top-right 3 bars) */}
      <SidebarDrawer
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        curriculum={ENEM_CURRICULUM}
        activePath={activePath}
        onSelect={handleSelectSubtopic}
      />

      {/* Quick Search Palette (⌘K) */}
      <SearchPalette
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        curriculum={ENEM_CURRICULUM}
        onSelect={handleSelectSubtopic}
      />
    </div>
  );
}
