import { useState, useEffect, useRef } from 'react';
import { Film, Sparkles, LayoutGrid, AlertTriangle, RefreshCw, Server, Settings } from 'lucide-react';
import { PresetControls } from './components/PresetControls';
import type { RenderPresets } from './components/PresetControls';
import { CodeEditor } from './components/CodeEditor';
import { VideoPlayer } from './components/VideoPlayer';
import type { RenderResult } from './components/VideoPlayer';
import { RenderConsole } from './components/RenderConsole';
import { DesmosStudio } from './components/DesmosStudio';
import { TemplatesGallery } from './components/TemplatesGallery';
import { ServerSettingsModal } from './components/ServerSettingsModal';
import { MANIM_TEMPLATES } from './data/templates';
import type { Template } from './data/templates';

const DEFAULT_BACKEND_URL = 'https://amauryyz-backendmanim.hf.space';

export function MathRenderApp() {
  const [activeTab, setActiveTab] = useState<'studio' | 'desmos' | 'gallery'>('studio');

  // Manim Editor state
  const [code, setCode] = useState<string>(MANIM_TEMPLATES[0].code);
  const [scenes, setScenes] = useState<string[]>(['GeoGebraGraphScene', 'DesmosGraphScene', 'MainScene']);
  const [selectedScene, setSelectedScene] = useState<string>('GeoGebraGraphScene');

  // Presets
  const [presets, setPresets] = useState<RenderPresets>({
    quality: 'qh',
    fps: 60,
    resolution: '1920x1080',
    format: 'mp4',
    aspectRatio: '16:9',
    bgColor: '#0f172a',
    transparent: false,
  });

  // Render & History state
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [currentRenderId, setCurrentRenderId] = useState<string | null>(null);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentRender, setCurrentRender] = useState<RenderResult | null>(() => {
    try {
      const saved = localStorage.getItem('manim_current_render');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [renderHistory, setRenderHistory] = useState<RenderResult[]>(() => {
    try {
      const saved = localStorage.getItem('manim_render_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist history & current render in localStorage
  useEffect(() => {
    try {
      localStorage.setItem('manim_render_history', JSON.stringify(renderHistory));
    } catch {}
  }, [renderHistory]);

  useEffect(() => {
    try {
      if (currentRender) {
        localStorage.setItem('manim_current_render', JSON.stringify(currentRender));
      }
    } catch {}
  }, [currentRender]);

  // Backend status & custom URL configuration (defaults to https://amauryyz-backendmanim.hf.space)
  const [backendOnline, setBackendOnline] = useState<boolean>(false);
  const [backendChecking, setBackendChecking] = useState<boolean>(true);
  const [customBackendUrl, setCustomBackendUrl] = useState<string>(() => {
    const saved = localStorage.getItem('manim_backend_url');
    return saved ? saved : DEFAULT_BACKEND_URL;
  });
  const [isServerModalOpen, setIsServerModalOpen] = useState<boolean>(false);

  // AbortController ref to cancel active fetch/SSE HTTP stream
  const abortControllerRef = useRef<AbortController | null>(null);

  // Check backend API on mount
  useEffect(() => {
    checkBackendStatus();
  }, [customBackendUrl]);

  const handleSaveBackendUrl = (url: string) => {
    setCustomBackendUrl(url);
    if (url) {
      localStorage.setItem('manim_backend_url', url);
    } else {
      localStorage.setItem('manim_backend_url', '');
    }
  };

  // Resilient fetch helper: tries customBackendUrl, Vite proxy (/api), and direct http://127.0.0.1:8000
  const smartFetch = async (endpoint: string, options?: RequestInit): Promise<Response> => {
    const activeUrl = customBackendUrl || DEFAULT_BACKEND_URL;
    if (activeUrl) {
      try {
        const cleanBase = activeUrl.replace(/\/+$/, '');
        const res = await fetch(`${cleanBase}${endpoint}`, options);
        if (res.status !== 404 && res.status !== 502 && res.status !== 504) {
          return res;
        }
      } catch (e) {
        if (options?.signal?.aborted) throw e;
      }
    }

    try {
      const res = await fetch(endpoint, options);
      if (res.status !== 404 && res.status !== 502 && res.status !== 504) {
        return res;
      }
    } catch (e) {
      if (options?.signal?.aborted) throw e;
    }

    const fallbackUrl = `http://127.0.0.1:8000${endpoint}`;
    return await fetch(fallbackUrl, options);
  };

  const checkBackendStatus = async () => {
    setBackendChecking(true);
    try {
      const res = await smartFetch('/api/status');
      if (res.ok) {
        setBackendOnline(true);
      } else {
        setBackendOnline(false);
      }
    } catch {
      setBackendOnline(false);
    }
    setBackendChecking(false);
  };

  // Fast local scene extraction without blocking network latency
  const getSceneNameFast = (currentCode: string): string => {
    if (selectedScene && currentCode.includes(`class ${selectedScene}`)) {
      return selectedScene;
    }
    const matches = Array.from(currentCode.matchAll(/class\s+([a-zA-Z0-9_]+)\s*\(\s*Scene\s*\)/g)).map(m => m[1]);
    if (matches.length > 0) {
      return matches[0];
    }
    return selectedScene || 'MainScene';
  };

  // Inspect python code to auto-detect scene class names
  const handleDetectScenes = async (currentCode: string): Promise<string[]> => {
    // Fast local regex first
    const matches = Array.from(currentCode.matchAll(/class\s+([a-zA-Z0-9_]+)\s*\(\s*Scene\s*\)/g)).map(m => m[1]);
    if (matches.length > 0) {
      setScenes(matches);
    }
    try {
      const res = await smartFetch('/api/inspect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: currentCode }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.scenes && data.scenes.length > 0) {
          setScenes(data.scenes);
          if (!data.scenes.includes(selectedScene)) {
            setSelectedScene(data.scenes[0]);
          }
          return data.scenes;
        }
      }
    } catch {
      // Fallback
    }
    return matches.length > 0 ? matches : [selectedScene];
  };

  // Start Manim SSE Render Stream (accepts overrideCode to IMMEDIATELY render new code without state delay)
  const handleStartRender = async (overrideCode?: string, customDisplayName?: string) => {
    const codeToRender = overrideCode !== undefined ? overrideCode : code;

    setIsRendering(true);
    setProgressPercent(0);
    setErrorMessage(null);
    setLogs(['🚀 Inicializando conexão com o servidor de renderização Manim...']);

    // Fast scene resolution without blocking UI on mobile latency
    const sceneToUse = getSceneNameFast(codeToRender);

    // Cancel any previous active request controller
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const payload = {
        code: codeToRender,
        scene_name: sceneToUse,
        quality: presets.quality,
        fps: presets.fps,
        resolution: presets.resolution,
        format: presets.format,
        bg_color: presets.bgColor,
        transparent: presets.transparent,
      };

      const res = await smartFetch('/api/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        let errDetail = `Servidor respondeu com status ${res.status}`;
        try {
          const errJson = await res.json();
          if (errJson.detail) errDetail = errJson.detail;
          else if (errJson.message) errDetail = errJson.message;
        } catch {}
        if (res.status === 404) {
          errDetail = "⚠️ Servidor Python Off-line (Status 404). Inicie o servidor localmente (python appmanimrender/server/server.py) ou configure a URL de hospedagem em nuvem nas configurações do servidor.";
        }
        throw new Error(errDetail);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const block of lines) {
          const trimmedBlock = block.trim();
          if (trimmedBlock.startsWith('data: ')) {
            const jsonStr = trimmedBlock.replace(/^data:\s*/, '');
            try {
              const event = JSON.parse(jsonStr);

              if (event.type === 'init') {
                setCurrentRenderId(event.render_id);
              } else if (event.type === 'log') {
                setLogs((prev) => [...prev, event.line]);
              } else if (event.type === 'progress') {
                setProgressPercent(event.percent);
              } else if (event.type === 'complete') {
                const activeBackendBase = (customBackendUrl || DEFAULT_BACKEND_URL).replace(/\/+$/, '');

                let friendlyName = customDisplayName;
                if (!friendlyName) {
                  if (sceneToUse === 'GeoGebraGraphScene') {
                    if (codeToRender.includes('ValueTracker') && codeToRender.includes('_tracker')) {
                      friendlyName = 'Animação Paramétrica';
                    } else if (codeToRender.includes('get_riemann_rectangles')) {
                      friendlyName = 'Integral de Riemann';
                    } else if (codeToRender.includes('tangent_line')) {
                      friendlyName = 'Reta Tangente';
                    } else {
                      friendlyName = 'Animação do Gráfico';
                    }
                  } else {
                    const knownNames: Record<string, string> = {
                      'FourierSeries': 'Série de Fourier',
                      'LinearTransformation2D': 'Transformação Linear 2D',
                      'PythagoreanTheorem': 'Teorema de Pitágoras',
                      'DoublePendulum': 'Pêndulo Duplo',
                      'VectorField2D': 'Campo Vetorial 2D',
                      'SineWave3D': 'Onda Senoidal 3D',
                      'PlanetaryOrbit': 'Órbita Planetária',
                      'BinarySearchTree': 'Árvore de Busca Binária',
                      'NormalDistribution': 'Distribuição Normal',
                      'ComplexAnalysis': 'Análise Complexa',
                    };
                    friendlyName = knownNames[sceneToUse] || sceneToUse.replace(/([A-Z])/g, ' $1').trim();
                  }
                }

                const newResult: RenderResult = {
                  renderId: event.render_id,
                  videoUrl: `${activeBackendBase}${event.video_url}`,
                  downloadUrl: `${activeBackendBase}${event.download_url}`,
                  fileName: event.file_name,
                  fileSize: event.file_size,
                  durationSec: event.duration_sec,
                  resolution: event.resolution,
                  fps: event.fps,
                  format: event.format,
                  sceneName: friendlyName,
                  createdAt: new Date().toLocaleTimeString(),
                };

                setCurrentRender(newResult);
                setRenderHistory((prev) => [newResult, ...prev]);
                setIsRendering(false);
                setProgressPercent(100);
              } else if (event.type === 'error') {
                setErrorMessage(event.message);
                setIsRendering(false);
              }
            } catch (err) {
              console.error('SSE parse error', err);
            }
          }
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setLogs((prev) => [...prev, '⛔ Renderização cancelada.']);
      } else {
        setErrorMessage(
          err.message || '⚠️ Conexão indisponível com o servidor de renderização Python. Clique no botão de Servidor para configurar a URL de hospedagem ou iniciar localmente.'
        );
      }
      setIsRendering(false);
    }
  };

  // Cancel render handler
  const handleCancelRender = async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    if (currentRenderId) {
      try {
        await smartFetch('/api/cancel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ render_id: currentRenderId }),
        });
      } catch {}
    }

    setIsRendering(false);
    setLogs((prev) => [...prev, '⛔ Renderização cancelada pelo usuário.']);
  };

  // Handle template selection from Gallery
  const handleSelectTemplate = (template: Template, autoRender: boolean = false) => {
    setCode(template.code);
    setActiveTab('studio');

    if (template.recommendedPreset) {
      setPresets((prev) => ({
        ...prev,
        quality: template.recommendedPreset?.quality || prev.quality,
        fps: template.recommendedPreset?.fps || prev.fps,
      }));
    }

    if (autoRender) {
      handleStartRender(template.code, template.title);
    }
  };

  // Handle code received from Desmos Studio
  const handleSendFromDesmos = (desmosCode: string, displayName?: string) => {
    setCode(desmosCode);
    setActiveTab('studio');
    handleStartRender(desmosCode, displayName || 'Animação do Gráfico'); // Directly render new code!
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-sky-500 selection:text-white flex flex-col">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-slate-900/95 border-b border-slate-800 backdrop-blur-md px-3 py-2.5 sm:px-6 sm:py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Left Side: Brand Logo + Title + Nav Tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 w-full md:w-auto">
          {/* Logo & Title */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/20 flex-shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm sm:text-lg text-white tracking-tight">
                AppManim Render
              </h1>
            </div>
          </div>

          {/* Navigation Tabs (In Middle / Left next to Brand) */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl sm:rounded-2xl border border-slate-800 shadow-inner w-full sm:w-auto overflow-x-auto no-scrollbar justify-between sm:justify-start">
            <button
              onClick={() => setActiveTab('studio')}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 transition-all flex-1 sm:flex-initial whitespace-nowrap ${
                activeTab === 'studio'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Film className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Estúdio Manim
            </button>

            <button
              onClick={() => setActiveTab('desmos')}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 transition-all flex-1 sm:flex-initial whitespace-nowrap ${
                activeTab === 'desmos'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Gráfico
            </button>

            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 transition-all flex-1 sm:flex-initial whitespace-nowrap ${
                activeTab === 'gallery'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Templates & Fórmulas
            </button>
          </div>
        </div>

        {/* Right Side: Backend Status Indicator & Config Button */}
        <div className="flex items-center justify-end w-full md:w-auto">
          <button
            onClick={() => setIsServerModalOpen(true)}
            className={`cursor-pointer px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl border text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm flex-shrink-0 ${
              backendOnline
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
            }`}
            title="Gerenciar conexão do servidor Python Manim"
          >
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${backendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className="hidden sm:inline">{backendOnline ? 'Servidor Python Conectado' : 'Servidor Python Off-line'}</span>
            <span className="sm:hidden">{backendOnline ? 'Conectado' : 'Off-line'}</span>
            <Settings className="w-3.5 h-3.5 ml-0.5 text-slate-400" />
          </button>
        </div>
      </header>

      {/* Backend Notice Banner if offline */}
      {!backendOnline && !backendChecking && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-3 py-2 sm:px-6 sm:py-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-amber-300 gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>
              O servidor backend de renderização em Python está off-line.
            </span>
          </div>
          <button
            onClick={() => setIsServerModalOpen(true)}
            className="text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 px-3 py-1 rounded-lg border border-amber-500/30 font-semibold flex items-center gap-1.5 transition-colors self-end sm:self-auto"
          >
            <Server className="w-3.5 h-3.5" />
            Configurar Servidor
          </button>
        </div>
      )}

      {/* Server Configuration Modal */}
      <ServerSettingsModal
        isOpen={isServerModalOpen}
        onClose={() => setIsServerModalOpen(false)}
        backendOnline={backendOnline}
        backendChecking={backendChecking}
        customBackendUrl={customBackendUrl}
        onSaveBackendUrl={handleSaveBackendUrl}
        onCheckStatus={checkBackendStatus}
      />

      {/* Main Workspace Layout */}
      <main className="flex-1 p-3 sm:p-6">
        {activeTab === 'studio' && (
          <div className="flex flex-col gap-6">
            {/* Presets Toolbar */}
            <PresetControls
              presets={presets}
              onPresetChange={setPresets}
              scenes={scenes}
              selectedScene={selectedScene}
              onSceneChange={setSelectedScene}
              isRendering={isRendering}
              onStartRender={() => handleStartRender()}
            />

            {/* Split Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[580px]">
              {/* Left Column: Python Code Editor */}
              <div className="lg:col-span-6 flex flex-col">
                <CodeEditor
                  code={code}
                  onChange={setCode}
                  onDetectScenes={handleDetectScenes}
                />
              </div>

              {/* Right Column: Video Preview & Render Console */}
              <div className="lg:col-span-6 flex flex-col gap-6">
                <div className="flex-1">
                  <VideoPlayer
                    currentRender={currentRender}
                    history={renderHistory}
                    onSelectFromHistory={setCurrentRender}
                  />
                </div>

                <RenderConsole
                  logs={logs}
                  progressPercent={progressPercent}
                  isRendering={isRendering}
                  errorMessage={errorMessage}
                  onClearLogs={() => setLogs([])}
                  onCancelRender={handleCancelRender}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'desmos' && (
          <DesmosStudio onSendToManim={handleSendFromDesmos} />
        )}

        {activeTab === 'gallery' && (
          <TemplatesGallery onSelectTemplate={handleSelectTemplate} />
        )}
      </main>
    </div>
  );
}
