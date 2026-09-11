import React from 'react';
import { Menu, X, BookOpen, Search, ArrowLeft } from 'lucide-react';
import { BreadcrumbPath, KnowledgeArea } from '../types/curriculum';

interface HeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  activePath: BreadcrumbPath | null;
  selectedArea?: KnowledgeArea | null;
  viewMode?: 'home' | 'aprofundado-home' | 'summary' | 'topic';
  onGoHome?: () => void;
  onGoSummary?: () => void;
  onOpenSearch?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  sidebarOpen,
  onToggleSidebar,
  onGoHome,
  onOpenSearch,
}) => {
  return (
    <header
      id="top-header"
      className="sticky top-0 z-30 flex h-16 w-full items-center justify-between bg-white/90 px-4 backdrop-blur-md sm:px-6 lg:px-8 select-none text-[#1d1d1f] shadow-[0_2px_14px_rgba(0,0,0,0.07)] transition-all"
    >
      {/* Left: Hamburger + Brand Logo */}
      <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
        {/* 1. Hamburger Button (Apple Shadow +30%) */}
        <button
          id="btn-sidebar-hamburger"
          onClick={onToggleSidebar}
          aria-label={sidebarOpen ? 'Fechar menu de tópicos' : 'Abrir menu de tópicos do ENEM'}
          aria-expanded={sidebarOpen}
          className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 cursor-pointer shrink-0 ${
            sidebarOpen
              ? 'bg-[#1d1d1f] text-white shadow-[0_4px_14px_rgba(0,0,0,0.26)] scale-[1.02]'
              : 'bg-white text-[#1d1d1f] shadow-[0_2px_10px_rgba(0,0,0,0.11),0_1px_3px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.18)] hover:scale-[1.03]'
          }`}
          title={sidebarOpen ? 'Recolher menu lateral' : 'Abrir menu de matérias do ENEM'}
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>

        {/* 2. Brand Identity - Click to go Home */}
        <div
          onClick={onGoHome}
          className="flex items-center gap-2.5 text-[#1d1d1f] group shrink-0 cursor-pointer"
          title="Início do TopzeiraEnem"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#1d1d1f] shadow-[0_2px_10px_rgba(0,0,0,0.11),0_1px_3px_rgba(0,0,0,0.06)] group-hover:shadow-[0_4px_16px_rgba(0,0,0,0.18)] group-hover:scale-[1.03] transition-all duration-200">
            <BookOpen className="h-4 w-4" />
          </div>
          <span className="font-semibold tracking-tight text-[#1d1d1f] text-base leading-none">
            Topzeira<span className="text-[#86868b] font-normal">Enem</span>
          </span>
        </div>
      </div>

      {/* Right: Search & Apps Topzeira (Apple Shadow +30%) */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Search trigger button */}
        <button
          id="btn-quick-search-trigger"
          onClick={onOpenSearch}
          className="flex items-center gap-2 rounded-xl bg-white px-3.5 py-2 text-xs text-[#515154] shadow-[0_2px_10px_rgba(0,0,0,0.11),0_1px_3px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.18)] hover:text-[#1d1d1f] hover:scale-[1.02] transition-all duration-200 cursor-pointer"
          title="Buscar tópico ou disciplina"
        >
          <Search className="h-3.5 w-3.5 text-[#86868b]" />
          <span className="hidden md:inline">Buscar tópicos...</span>
          <kbd className="hidden md:inline-block rounded-md bg-[#f5f5f7] px-1.5 py-0.5 text-[10px] text-[#86868b] font-mono shadow-[0_1px_2px_rgba(0,0,0,0.07)]">
            ⌘K
          </kbd>
        </button>

        {/* Apps Topzeira Button */}
        <a
          href="/"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-[#1d1d1f] text-xs font-medium shadow-[0_2px_10px_rgba(0,0,0,0.11),0_1px_3px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.18)] hover:scale-[1.02] transition-all duration-200 group shrink-0"
          title="Voltar para Apps Topzeira"
        >
          <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform text-[#6e6e73]" />
          <span className="hidden sm:inline">Apps Topzeira</span>
        </a>
      </div>
    </header>
  );
};
