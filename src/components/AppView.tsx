import React, { Suspense, lazy } from 'react';
import { TabType } from '../types';
import { MathRenderApp } from '../apps/mathrender/App';
import SnakeApp from '../apps/snake/App';

const JogoTopApp = lazy(() => import('../apps/jogotop/App'));

interface AppViewProps {
  type: TabType;
  title: string;
}

export const AppView: React.FC<AppViewProps> = ({ type }) => {
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

      {type === 'jogotop' && (
        <div className="w-full h-full">
          <Suspense fallback={null}>
            <JogoTopApp />
          </Suspense>
        </div>
      )}
    </div>
  );
};
