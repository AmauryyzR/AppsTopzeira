import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const JogoTopApp = lazy(() => import('./apps/jogotop/App'));
const Game3DApp = lazy(() => import('./apps/3dgame/App'));
const ModelsApp = lazy(() => import('./apps/models/App'));
const EnemApp = lazy(() => import('./apps/enem/App'));

const route = window.location.pathname.replace(/\/+$/, '').toLowerCase();
const isJogoTop = route === '/jogotop';
const is3DGame = route === '/3dgame';
const isModels = route === '/models';
const isEnem = route === '/enem';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {isEnem ? (
      <Suspense fallback={null}>
        <EnemApp />
      </Suspense>
    ) : isModels ? (
      <Suspense fallback={null}>
        <ModelsApp />
      </Suspense>
    ) : is3DGame ? (
      <Suspense fallback={null}>
        <Game3DApp />
      </Suspense>
    ) : isJogoTop ? (
      <Suspense fallback={null}>
        <JogoTopApp />
      </Suspense>
    ) : (
      <App />
    )}
  </React.StrictMode>
);
