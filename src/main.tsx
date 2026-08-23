import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const JogoTopApp = lazy(() => import('./apps/jogotop/App'));

const route = window.location.pathname.replace(/\/+$/, '').toLowerCase();
const isJogoTop = route === '/jogotop';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {isJogoTop ? (
      <Suspense fallback={null}>
        <JogoTopApp />
      </Suspense>
    ) : (
      <App />
    )}
  </React.StrictMode>
);
