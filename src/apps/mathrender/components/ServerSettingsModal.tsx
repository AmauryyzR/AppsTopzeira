import React, { useState } from 'react';
import { Server, X, CheckCircle2, AlertCircle, RefreshCw, Globe, Terminal, Cloud, Copy, Check } from 'lucide-react';

interface ServerSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  backendOnline: boolean;
  backendChecking: boolean;
  customBackendUrl: string;
  onSaveBackendUrl: (url: string) => void;
  onCheckStatus: () => void;
}

export const ServerSettingsModal: React.FC<ServerSettingsModalProps> = ({
  isOpen,
  onClose,
  backendOnline,
  backendChecking,
  customBackendUrl,
  onSaveBackendUrl,
  onCheckStatus,
}) => {
  const [urlInput, setUrlInput] = useState(customBackendUrl);
  const [copiedCmd, setCopiedCmd] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveBackendUrl(urlInput.trim());
    onCheckStatus();
  };

  const copyLocalCommand = () => {
    navigator.clipboard.writeText('python appmanimrender/server/server.py');
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const DEFAULT_URL = 'https://appstopzeira.onrender.com';
  const LOCAL_URL = 'http://127.0.0.1:8000';

  const handleSetDefault = () => {
    setUrlInput(DEFAULT_URL);
    onSaveBackendUrl(DEFAULT_URL);
    onCheckStatus();
  };

  const handleSetLocal = () => {
    setUrlInput(LOCAL_URL);
    onSaveBackendUrl(LOCAL_URL);
    onCheckStatus();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-syne font-bold text-lg text-white">Configuração do Servidor Manim</h2>
              <p className="text-xs text-slate-400 font-jakarta">Gerencie a conexão e hospedagem do motor de renderização Python</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">

          {/* Current Status Box */}
          <div className={`p-4 rounded-2xl border flex items-center justify-between ${
            backendOnline
              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
              : 'bg-amber-950/30 border-amber-500/40 text-amber-300'
          }`}>
            <div className="flex items-center gap-3">
              {backendOnline ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-6 h-6 text-amber-400 flex-shrink-0" />
              )}
              <div>
                <h4 className="font-bold text-sm">
                  {backendOnline ? 'Servidor Python Conectado' : 'Servidor Backend Desconectado'}
                </h4>
                <p className="opacity-80">
                  {backendOnline
                    ? 'O motor Manim (Python + FFmpeg) está pronto para compilar animações.'
                    : 'A hospedagem estática não executa Python nativamente. Conecte ao servidor na nuvem ou local.'}
                </p>
              </div>
            </div>

            <button
              onClick={onCheckStatus}
              disabled={backendChecking}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold flex items-center gap-2 border border-slate-700 transition-all flex-shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${backendChecking ? 'animate-spin' : ''}`} />
              Testar Conexão
            </button>
          </div>

          {/* URL Settings Form & Quick Preset Buttons */}
          <form onSubmit={handleSave} className="space-y-3 p-4 bg-slate-950/80 border border-slate-800 rounded-2xl">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-200 text-xs flex items-center gap-2">
                <Globe className="w-4 h-4 text-sky-400" />
                URL do Servidor Backend (Remoto ou Local)
              </label>
            </div>

            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="ex: https://appstopzeira.onrender.com ou http://127.0.0.1:8000"
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 font-mono text-xs focus:outline-none focus:border-sky-500 transition-colors"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold transition-all shadow-md shadow-sky-500/20"
              >
                Salvar URL
              </button>
            </div>

            {/* Quick Presets row */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] text-slate-400 font-medium mr-1">Atalhos rápidos:</span>
              <button
                type="button"
                onClick={handleSetDefault}
                className="px-3.5 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
              >
                ⚡ Usar Servidor Padrão (Nuvem)
              </button>

              <button
                type="button"
                onClick={handleSetLocal}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                💻 Usar Servidor Local
              </button>
            </div>

            <p className="text-[11px] text-slate-400 pt-1">
              Servidor Padrão em uso: <code className="text-sky-300 font-mono">{urlInput || DEFAULT_URL}</code>
            </p>
          </form>

          {/* Guide Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Option A: Run Locally */}
            <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-sky-400 font-bold">
                <Terminal className="w-4 h-4" />
                <span>1. Executar Localmente</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Abra o terminal no computador e inicie o backend Python que já está incluído no projeto:
              </p>
              <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl p-2.5 font-mono text-[11px] text-amber-300">
                <span className="truncate">python appmanimrender/server/server.py</span>
                <button
                  onClick={copyLocalCommand}
                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  title="Copiar Comando"
                >
                  {copiedCmd ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Option B: Cloud Hosting */}
            <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-purple-400 font-bold">
                <Cloud className="w-4 h-4" />
                <span>2. Hospedar na Nuvem (Grátis)</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Para o site funcionar online para qualquer pessoa, hospede o servidor Python usando o <code className="text-purple-300 font-mono">Dockerfile</code> fornecido:
              </p>
              <ul className="list-disc list-inside text-slate-400 space-y-1">
                <li><strong className="text-slate-200">Render.com / Railway:</strong> Crie um Web Service a partir do repositório.</li>
                <li>Cole a URL gerada no campo acima e pronto!</li>
              </ul>
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
