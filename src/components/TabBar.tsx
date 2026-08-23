import React from 'react';
import { Home, Calculator, Gamepad2, X, Maximize2, Minimize2 } from 'lucide-react';
import { TabItem, TabType } from '../types';

interface TabBarProps {
  tabs: TabItem[];
  activeTabId: string;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
  onOpenNewTab: (type: TabType) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  isFullscreen,
  onToggleFullscreen,
}) => {
  const renderIcon = (type: TabType) => {
    switch (type) {
      case 'cover':
        return <Home className="w-3.5 h-3.5 text-cyan-400" />;
      case 'mathrender':
        return <Calculator className="w-3.5 h-3.5 text-cyan-400" />;
      case 'snake':
        return <Gamepad2 className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  return (
    <header className="w-full h-14 bg-[#090d16]/90 backdrop-blur-md border-b border-slate-800/60 px-3 flex items-center justify-between select-none z-50 sticky top-0">
      {/* Left: App Branding */}
      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-2 cursor-pointer group px-2 py-1 rounded-lg hover:bg-slate-800/40 transition-colors"
          onClick={() => onSelectTab('tab-cover')}
        >
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center text-black font-syne font-black text-xs shadow-md shadow-cyan-950">
            T
          </div>
          <span className="font-syne font-bold text-sm tracking-tight text-slate-200 group-hover:text-cyan-400 transition-colors hidden md:inline-block">
            Apps <span className="text-cyan-400">topzeira</span>
          </span>
        </div>
      </div>

      {/* Center: Scrollable Tab List */}
      <div className="flex-1 max-w-3xl mx-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`group relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all duration-200 min-w-[120px] max-w-[200px] border ${
                isActive
                  ? 'bg-slate-800/90 text-white border-slate-700 shadow-md shadow-slate-950/50'
                  : 'bg-slate-900/40 text-slate-400 border-transparent hover:bg-slate-800/40 hover:text-slate-200'
              }`}
            >
              {/* Active Indicator Bar */}
              {isActive && (
                <div className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-gradient-to-r from-cyan-400 to-violet-400" />
              )}

              {renderIcon(tab.type)}

              <span className="truncate flex-1 font-jakarta">{tab.title}</span>

              {/* Close Button if Closable */}
              {tab.closable && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseTab(tab.id);
                  }}
                  className="w-4 h-4 rounded-md flex items-center justify-center text-slate-500 hover:text-slate-200 hover:bg-slate-700/60 transition-all opacity-60 group-hover:opacity-100"
                  title="Fechar Aba"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Right: Action items */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleFullscreen}
          className="w-8 h-8 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-100 flex items-center justify-center border border-slate-800 transition-colors"
          title={isFullscreen ? 'Sair da Tela Cheia' : 'Tela Cheia'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
