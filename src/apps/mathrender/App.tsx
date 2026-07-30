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

const BACKEND_URL = '';

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
  const [currentRender, setCurrentRender] = useState<RenderResult | null>(null);
  const [renderHistory, setRenderHistory] = useState<RenderResult[]>([]);

  // Backend status & custom URL configuration
  const [backendOnline, setBackendOnline] = useState<boolean>(false);
  const [backendChecking, setBackendChecking] = useState<boolean>(true);
  const [customBackendUrl, setCustomBackendUrl] = useState<string>(() => {
    return localStorage.getItem('manim_backend_url') || '';
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
      localStorage.removeItem('manim_backend_url');
    }
  };

  // Resilient fetch helper: tries customBackendUrl, Vite proxy (/api), and direct http://127.0.0.1:8000
  const smartFetch = async (endpoint: string, options?: RequestInit): Promise<Response> => {
    if (customBackendUrl) {
      try {
        const cleanBase = customBackendUrl.replace(/\/+$/, '');
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

  // Inspect python code to auto-detect scene class names
  const handleDetectScenes = async (currentCode: string): Promise<string[]> => {
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
      // Fallback scene extraction
      const matches = Array.from(currentCode.matchAll(/class\s+([a-zA-Z0-9_]+)\s*\(\s*Scene\s*\)/g)).map(m => m[1]);
      if (matches.length > 0) {
        setScenes(matches);
        return matches;
      }
    }
    return [selectedScene];
  };

  // Start Manim SSE Render Stream (accepts overrideCode to IMMEDIATELY render new code without state delay)
  const handleStartRender = async (overrideCode?: string) => {
    const codeToRender = overrideCode !== undefined ? overrideCode : code;

    // Detect scenes for the code being rendered
    const detectedScenes = await handleDetectScenes(codeToRender);
    const sceneToUse = (detectedScenes && detectedScenes.length > 0) ? detectedScenes[0] : selectedScene;

    setIsRendering(true);
    setProgressPercent(0);
    setErrorMessage(null);
    setLogs(['🚀 Inicializando conexão com o servidor de renderização Manim...']);

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
                const newResult: RenderResult = {
                  renderId: event.render_id,
                  videoUrl: `${BACKEND_URL}${event.video_url}`,
                  downloadUrl: `${BACKEND_URL}${event.download_url}`,
                  fileName: event.file_name,
                  fileSize: event.file_size,
                  durationSec: event.duration_sec,
                  resolution: event.resolution,
                  fps: event.fps,
                  format: event.format,
                  sceneName: sceneToUse,
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
      handleStartRender(template.code);
    }
  };

  // Handle code received from Desmos Studio
  const handleSendFromDesmos = (desmosCode: string) => {
    setCode(desmosCode);
    setActiveTab('studio');
    handleStartRender(desmosCode); // Directly render new code!
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-sky-500 selection:text-white flex flex-col">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md px-6 py-3 flex items-center justify-between">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-white tracking-tight flex items-center gap-2">
              AppManim Render <span className="text-[10px] uppercase font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30 px-2 py-0.5 rounded-full">Studio Web</span>
            </h1>
            <p className="text-xs text-slate-400">Renderizador de Animações Matemáticas Manim em Vídeo HD/4K</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shadow-inner">
          <button
            onClick={() => setActiveTab('studio')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'studio'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Film className="w-4 h-4" />
            Estúdio Manim
          </button>

          <button
            onClick={() => setActiveTab('desmos')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'desmos'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Gráfico GeoGebra 2D
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'gallery'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            Templates & Fórmulas
          </button>
        </div>

        {/* Backend Status Indicator & Config Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsServerModalOpen(true)}
            className={`cursor-pointer px-3.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all shadow-sm ${
              backendOnline
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
            }`}
            title="Gerenciar conexão do servidor Python Manim"
          >
            <div className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            {backendOnline ? 'Servidor Python Conectado' : 'Servidor Python Off-line'}
            <Settings className="w-3.5 h-3.5 ml-1 text-slate-400" />
          </button>
        </div>
      </header>

      {/* Backend Notice Banner if offline */}
      {!backendOnline && !backendChecking && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-2.5 flex items-center justify-between text-xs text-amber-300">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>
              O servidor backend de renderização em Python está off-line. Inicie <code className="bg-slate-900 px-2 py-0.5 rounded text-amber-200 font-mono">python appmanimrender/server/server.py</code> localmente ou configure uma URL na nuvem.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsServerModalOpen(true)}
              className="text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 px-3 py-1 rounded-lg border border-amber-500/30 font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Server className="w-3.5 h-3.5" />
              Configurar Servidor / Hospedagem
            </button>
          </div>
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
      <main className="flex-1 p-6">
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
