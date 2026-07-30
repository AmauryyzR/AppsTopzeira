import { useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { Code2, Wand2 } from 'lucide-react';

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

  const insertSnippet = (snippet: string) => {
    if (editorRef.current) {
      const editor = editorRef.current;
      const selection = editor.getSelection();
      editor.executeEdits('snippet', [{ range: selection, text: snippet, forceMoveMarkers: true }]);
    } else {
      onChange(code + '\n' + snippet);
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

        {/* Snippet Quick-Add & Format Bar */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={handleFormatCode}
            disabled={isFormatting}
            className="text-xs bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 px-2.5 py-1 rounded-lg border border-sky-500/30 font-semibold flex items-center gap-1 transition-all mr-2"
            title="Corrigir indentação e formatar código automaticamente"
          >
            <Wand2 className={`w-3.5 h-3.5 ${isFormatting ? 'animate-spin' : ''}`} />
            Formatar / Indentar
          </button>
          <span className="text-[10px] text-slate-500 font-semibold uppercase mr-1">Snippets:</span>
          <button
            onClick={() => insertSnippet('MathTex(r"e^{i\\pi} + 1 = 0", color=YELLOW)')}
            className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-lg border border-slate-700 font-mono"
          >
            + MathTex
          </button>
          <button
            onClick={() => insertSnippet('axes = Axes(x_range=[-3,3], y_range=[-2,2])\nself.play(Create(axes))')}
            className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-lg border border-slate-700 font-mono"
          >
            + Eixos 2D
          </button>
          <button
            onClick={() => insertSnippet('self.play(Transform(mobj1, mobj2), run_time=2)')}
            className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-lg border border-slate-700 font-mono"
          >
            + Transform
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
