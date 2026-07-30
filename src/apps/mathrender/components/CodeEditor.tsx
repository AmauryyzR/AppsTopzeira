import { useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { Code2, Wand2, Trash2 } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  onChange: (newCode: string) => void;
  onDetectScenes: (code: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, onDetectScenes }) => {
  const editorRef = useRef<any>(null);
  const [isFormatting, setIsFormatting] = useState<boolean>(false);

  const handleEditorChange = (value: string | undefined) => {
    const nextCode = value || '';
    onChange(nextCode);
    onDetectScenes(nextCode);
  };

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

  return (
    <div className="flex flex-col h-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md">
      {/* Editor Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 text-sky-400">
          <Code2 className="w-5 h-5" />
          <h3 className="font-bold text-white text-base">Editor de Código Python / Manim</h3>
        </div>

        {/* Action Buttons: Format & Clear All */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleFormatCode}
            disabled={isFormatting}
            className="text-xs bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 px-3 py-1.5 rounded-xl border border-sky-500/30 font-semibold flex items-center gap-1.5 transition-all"
            title="Corrigir indentação e formatar código automaticamente"
          >
            <Wand2 className={`w-3.5 h-3.5 ${isFormatting ? 'animate-spin' : ''}`} />
            Formatar / Indentar
          </button>

          <button
            onClick={handleClearAll}
            className="text-xs bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 px-3 py-1.5 rounded-xl border border-rose-500/30 font-semibold flex items-center gap-1.5 transition-all"
            title="Limpar todo o código do editor"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Limpar Tudo
          </button>
        </div>
      </div>

      {/* Monaco Editor Component */}
      <div className="flex-1 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 min-h-[350px]">
        <Editor
          height="100%"
          defaultLanguage="python"
          theme="vs-dark"
          value={code}
          onChange={handleEditorChange}
          onMount={(editor) => { editorRef.current = editor; }}
          options={{
            fontSize: 13,
            fontFamily: 'Fira Code, JetBrains Mono, monospace',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            lineNumbers: 'on',
            padding: { top: 12, bottom: 12 },
            renderLineHighlight: 'all',
            tabSize: 4,
          }}
        />
      </div>
    </div>
  );
};
