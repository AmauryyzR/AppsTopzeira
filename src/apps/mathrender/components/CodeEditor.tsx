import { useRef, useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Code2, Wand2, Trash2, Smartphone, Monitor } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  onChange: (newCode: string) => void;
  onDetectScenes: (code: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, onDetectScenes }) => {
  const editorRef = useRef<any>(null);
  const [isFormatting, setIsFormatting] = useState<boolean>(false);
  const [useNativeMobileEditor, setUseNativeMobileEditor] = useState<boolean>(false);
  const debounceTimerRef = useRef<any>(null);

  // Auto-detect mobile screen on mount to default to ultra-fast native editor (prevents Chrome Aw Snap OOM crashes)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setUseNativeMobileEditor(true);
    }
  }, []);

  const handleTextChange = (nextCode: string) => {
    onChange(nextCode);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      onDetectScenes(nextCode);
    }, 400);
  };

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleClearAll = () => {
    onChange('');
    onDetectScenes('');
    if (editorRef.current) {
      editorRef.current.setValue('');
    }
  };

  const handleFormatCode = async () => {
    setIsFormatting(true);
    try {
      const res = await fetch('/api/format', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.code) {
          onChange(data.code);
          if (data.scenes) onDetectScenes(data.code);
        }
      }
    } catch {
      // Ignore format fallback
    } finally {
      setIsFormatting(false);
    }
  };

  // Compute line numbers for native mobile code area
  const lineCount = Math.max(1, code.split('\n').length);
  const lineNumbersArray = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div className="flex flex-col h-full bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-xl backdrop-blur-md">
      {/* Editor Header */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3">
        <div className="flex items-center gap-2 text-sky-400">
          <Code2 className="w-5 h-5 flex-shrink-0" />
          <h3 className="font-bold text-white text-sm sm:text-base">Editor de Código Python / Manim</h3>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Mobile / Monaco Editor Toggle */}
          <button
            onClick={() => setUseNativeMobileEditor(!useNativeMobileEditor)}
            className="text-[11px] sm:text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1.5 rounded-xl border border-slate-700 font-semibold flex items-center gap-1 transition-all"
            title={useNativeMobileEditor ? "Mudar para Monaco Editor" : "Mudar para Modo Leve Mobile (Sem travar)"}
          >
            {useNativeMobileEditor ? (
              <>
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Modo Leve Mobile ⚡</span>
              </>
            ) : (
              <>
                <Monitor className="w-3.5 h-3.5 text-sky-400" />
                <span>Monaco Editor 💻</span>
              </>
            )}
          </button>

          <button
            onClick={handleFormatCode}
            disabled={isFormatting}
            className="text-[11px] sm:text-xs bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 px-2.5 py-1.5 rounded-xl border border-sky-500/30 font-semibold flex items-center gap-1 transition-all"
            title="Corrigir indentação e formatar código automaticamente"
          >
            <Wand2 className={`w-3.5 h-3.5 ${isFormatting ? 'animate-spin' : ''}`} />
            Formatar
          </button>

          <button
            onClick={handleClearAll}
            className="text-[11px] sm:text-xs bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 px-2.5 py-1.5 rounded-xl border border-rose-500/30 font-semibold flex items-center gap-1 transition-all"
            title="Limpar todo o código do editor"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Limpar
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 min-h-[320px] sm:min-h-[380px] flex flex-col relative">
        {useNativeMobileEditor ? (
          /* Ultra-Fast Crash-Proof Native Mobile Textarea with Line Numbers */
          <div className="flex-1 flex bg-slate-950 font-mono text-xs text-sky-300 overflow-hidden relative">
            {/* Line numbers gutter */}
            <div className="bg-slate-900/60 border-r border-slate-800 text-slate-500 py-3 px-2 text-right select-none font-mono text-[11px] leading-5 min-w-[36px]">
              {lineNumbersArray.map((num) => (
                <div key={num}>{num}</div>
              ))}
            </div>
            {/* Native Input */}
            <textarea
              value={code}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="# Cole ou digite o código Python do Manim aqui..."
              spellCheck={false}
              autoCapitalize="none"
              autoCorrect="off"
              className="flex-1 bg-transparent p-3 text-slate-100 font-mono text-xs leading-5 focus:outline-none resize-none overflow-y-auto selection:bg-sky-500 selection:text-white"
            />
          </div>
        ) : (
          /* Full Monaco Editor Component for Desktop */
          <Editor
            height="100%"
            defaultLanguage="python"
            theme="vs-dark"
            value={code}
            onChange={(val) => handleTextChange(val || '')}
            onMount={(editor) => { editorRef.current = editor; }}
            options={{
              fontSize: 13,
              fontFamily: 'Fira Code, JetBrains Mono, monospace',
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              lineNumbers: 'on',
              padding: { top: 12, bottom: 12 },
              renderLineHighlight: 'none',
              tabSize: 4,
              wordWrap: 'on',
              folding: false,
              glyphMargin: false,
              selectionHighlight: false,
              occurrencesHighlight: false,
              quickSuggestions: false,
              suggestOnTriggerCharacters: false,
              snippetSuggestions: 'none',
            } as any}
          />
        )}
      </div>
    </div>
  );
};
