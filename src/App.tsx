import React, { useState } from 'react';
import { CoverPage } from './components/CoverPage';
import { TabBar } from './components/TabBar';
import { AppView } from './components/AppView';
import { TabItem, TabType } from './types';

export function App() {
  const [tabs, setTabs] = useState<TabItem[]>([
    {
      id: 'tab-cover',
      type: 'cover',
      title: 'Home',
      iconName: 'home',
      active: true,
      closable: false,
    },
    {
      id: 'tab-mathrender',
      type: 'mathrender',
      title: 'MathRender',
      iconName: 'calculator',
      active: false,
      closable: true,
    },
    {
      id: 'tab-snake',
      type: 'snake',
      title: 'Snake Game',
      iconName: 'gamepad',
      active: false,
      closable: true,
    },
  ]);

  const [activeTabId, setActiveTabId] = useState<string>('tab-cover');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Switch to an existing tab or open a new one
  const handleSelectTab = (tabId: string) => {
    setActiveTabId(tabId);
    setTabs((prev) =>
      prev.map((t) => ({
        ...t,
        active: t.id === tabId,
      }))
    );
  };

  // Open a tab by type (e.g. from Cover Page 16:9 buttons)
  const handleOpenTabType = (type: TabType) => {
    const existingTab = tabs.find((t) => t.type === type);
    if (existingTab) {
      handleSelectTab(existingTab.id);
    } else {
      const newId = `tab-${type}-${Date.now()}`;
      const newTab: TabItem = {
        id: newId,
        type: type,
        title: type === 'mathrender' ? 'MathRender' : 'Snake Game',
        iconName: type === 'mathrender' ? 'calculator' : 'gamepad',
        active: true,
        closable: true,
      };
      setTabs((prev) => [...prev, newTab]);
      setActiveTabId(newId);
    }
  };

  // Close a tab
  const handleCloseTab = (tabId: string) => {
    const tabToClose = tabs.find((t) => t.id === tabId);
    if (!tabToClose || !tabToClose.closable) return;

    const remainingTabs = tabs.filter((t) => t.id !== tabId);
    setTabs(remainingTabs);

    if (activeTabId === tabId) {
      const fallbackTab = remainingTabs[remainingTabs.length - 1] || remainingTabs[0];
      if (fallbackTab) {
        handleSelectTab(fallbackTab.id);
      }
    }
  };

  // Toggle fullscreen mode
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const currentTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#06080d] text-slate-100 selection:bg-cyan-500 selection:text-black">
      
      {/* Top Window Tab Bar */}
      <TabBar
        tabs={tabs}
        activeTabId={activeTabId}
        onSelectTab={handleSelectTab}
        onCloseTab={handleCloseTab}
        onOpenNewTab={handleOpenTabType}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
      />

      {/* Tab Content Area */}
      <main className="flex-1 w-full relative">
        {currentTab.type === 'cover' ? (
          <CoverPage onOpenTab={handleOpenTabType} />
        ) : (
          <AppView type={currentTab.type} title={currentTab.title} />
        )}
      </main>

    </div>
  );
}

export default App;

