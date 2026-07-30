import React, { useRef, useEffect } from 'react';
import { Terminal, AlertCircle, Trash2, StopCircle } from 'lucide-react';

interface RenderConsoleProps {
  logs: string[];
  progressPercent: number;
  isRendering: boolean;
  errorMessage: string | null;
  onClearLogs: () => void;
  onCancelRender?: () => void;
}

export const RenderConsole: React.FC<RenderConsoleProps> = ({
  logs,
  progressPercent,
  isRendering,
  errorMessage,
  onClearLogs,
  onCancelRender,
}) => {
  const logContainerRef = useRef<HTMLDivElement | null>(null);

  // Fix: Scroll ONLY the internal console div to bottom (prevents locking main window scroll!)
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col gap-3">
      {/* Console Header & Progress */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-300">
          <Terminal className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-bold uppercase tracking-wider">Console de Renderização Manim</span>
          {isRendering && (
            <span className="ml-2 text-[11px] text-sky-400 font-mono font-semibold animate-pulse">
              Renderizando... ({progressPercent}%)
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isRendering && onCancelRender && (
            <button
              onClick={onCancelRender}
              className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
              title="Cancelar processo de renderização em andamento"
            >
              <StopCircle className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              Cancelar Renderização
            </button>
          )}

          <button
            onClick={onClearLogs}
            className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-900 rounded-lg text-xs flex items-center gap-1 transition-all"
            title="Limpar Console"
          >
            <Trash2 className="w-3.5 h-3.5" /> Limpar
          </button>
        </div>
      </div>

      {/* Progress bar */}
      {isRendering && (
        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-sky-500 to-blue-600 h-full transition-all duration-300 rounded-full"
            style={{ width: `${Math.max(5, progressPercent)}%` }}
          />
        </div>
      )}

      {/* Error Alert Box */}
      {errorMessage && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3 flex items-start gap-2.5 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Falha na Renderização:</p>
            <p className="font-mono text-[11px] mt-0.5 leading-relaxed">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Log Output Stream */}
      <div
        ref={logContainerRef}
        className="bg-slate-900/90 rounded-xl p-3 border border-slate-800/80 font-mono text-xs text-slate-300 max-h-48 overflow-y-auto space-y-1 scrollbar-thin"
      >
        {logs.length === 0 ? (
          <p className="text-slate-600 text-[11px] italic">Aguardando comando de renderização...</p>
        ) : (
          logs.map((line, idx) => (
            <div
              key={idx}
              className={`leading-relaxed whitespace-pre-wrap ${
                line.includes('Error') || line.includes('Traceback') || line.includes('Exception')
                  ? 'text-rose-400 font-semibold'
                  : line.includes('✅') || line.includes('successfully')
                  ? 'text-emerald-400 font-semibold'
                  : line.includes('🚀') || line.includes('⚙️')
                  ? 'text-sky-300 font-semibold'
                  : line.includes('⛔')
                  ? 'text-amber-400 font-semibold'
                  : 'text-slate-400'
              }`}
            >
              {line}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
