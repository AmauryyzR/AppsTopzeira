import React from 'react';
import { TabType } from '../types';
import { MathRenderApp } from '../apps/mathrender/App';
import SnakeApp from '../apps/snake/App';

interface AppViewProps {
  type: TabType;
  title: string;
}

export const AppView: React.FC<AppViewProps> = ({ type, title }) => {
  return (
    <div className="w-full h-[calc(100vh-3.5rem)] flex flex-col bg-slate-950 relative overflow-y-auto no-scrollbar">
      {type === 'mathrender' && (
        <div className="w-full min-h-full">
          <MathRenderApp />
        </div>
      )}

      {type === 'snake' && (
        <div className="w-full h-full">
          <SnakeApp />
        </div>
      )}
    </div>
  );
};
