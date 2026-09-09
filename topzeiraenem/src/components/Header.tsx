import React from 'react';
import { Menu, X, BookOpen, Search } from 'lucide-react';
import { BreadcrumbPath } from '../types/curriculum';

interface HeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  activePath: BreadcrumbPath | null;
  onOpenSearch?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  sidebarOpen,
  onToggleSidebar,
  activePath,
  onOpenSearch,
}) => {
  return (
    <header
      id="top-header"
      className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-neutral-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8"
    >
      {/* Left: Brand Identity & Active Breadcrumb */}
      <div className="flex items-center gap-3 md:gap-6 overflow-hidden">
        <a
          href="#"
          className="flex items-center gap-2.5 text-neutral-900 group shrink-0"
          title="TopzeiraEnem - Início"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded border border-neutral-300 bg-neutral-100 text-neutral-800 transition-colors group-hover:bg-neutral-200">
            <BookOpen className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold tracking-tight text-neutral-900 text-base leading-none">
              Topzeira<span className="text-neutral-500 font-normal">Enem</span>
            </span>
            <span className="text-[10px] uppercase tracking-wider text-neutral-600 mt-0.5">
              Edital & Fórmulas
            </span>
          </div>
        </a>

        {/* Dynamic Context Breadcrumb */}
        {activePath && (
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-neutral-500 border-l border-neutral-200 pl-4 truncate">
            <span className="text-neutral-400 font-mono text-[11px] px-1 py-0.5 rounded bg-neutral-100">
              {activePath.area.code}
            </span>
            <span className="text-neutral-400">/</span>
            <span className="text-neutral-600 truncate">{activePath.discipline.name}</span>
            <span className="text-neutral-400">/</span>
            <span className="text-neutral-600 truncate">{activePath.topic.title}</span>
            {activePath.subtopic && (
              <>
                <span className="text-neutral-400">/</span>
                <span className="font-medium text-neutral-900 truncate">
                  {activePath.subtopic.title}
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Right Controls: Search and 3-Bars Hamburger Button */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search trigger button */}
        <button
          id="btn-quick-search-trigger"
          onClick={onOpenSearch}
          className="flex items-center gap-2 rounded border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-500 hover:border-neutral-300 hover:bg-white hover:text-neutral-800 transition-colors cursor-pointer"
          title="Buscar tópico ou disciplina"
        >
          <Search className="h-3.5 w-3.5 text-neutral-400" />
          <span className="hidden md:inline">Buscar tópicos...</span>
          <kbd className="hidden md:inline-block rounded border border-neutral-300 bg-white px-1.5 text-[10px] text-neutral-400 font-mono">
            ⌘K
          </kbd>
        </button>

        {/* 3 BARRINHAS NO CANTO SUPERIOR DIREITO (User prompt exact requirement) */}
        <button
          id="btn-sidebar-hamburger"
          onClick={onToggleSidebar}
          aria-label={sidebarOpen ? 'Fechar menu de tópicos' : 'Abrir menu de tópicos do ENEM'}
          aria-expanded={sidebarOpen}
          className={`flex h-9 w-9 items-center justify-center rounded border transition-all cursor-pointer ${
            sidebarOpen
              ? 'border-neutral-900 bg-neutral-900 text-white'
              : 'border-neutral-300 bg-white text-neutral-800 hover:border-neutral-400 hover:bg-neutral-50'
          }`}
          title={sidebarOpen ? 'Recolher menu lateral' : 'Abrir menu de matérias do ENEM'}
        >
          {sidebarOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </button>
      </div>
    </header>
  );
};
