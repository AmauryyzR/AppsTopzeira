import React, { useState } from 'react';
import { MANIM_TEMPLATES } from '../data/templates';
import type { Template } from '../data/templates';
import { Play, Edit3, Sparkles, Code2 } from 'lucide-react';

interface TemplatesGalleryProps {
  onSelectTemplate: (template: Template, autoRender?: boolean) => void;
}

export const TemplatesGallery: React.FC<TemplatesGalleryProps> = ({ onSelectTemplate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Calculus', 'Linear Algebra', '3D Geometry', 'Desmos Graph', 'Computer Science'];

  const filteredTemplates = selectedCategory === 'All'
    ? MANIM_TEMPLATES
    : MANIM_TEMPLATES.filter(t => t.category === selectedCategory);

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-[calc(100vh-5rem)]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2.5 text-sky-400 mb-1">
            <Sparkles className="w-6 h-6" />
            <h2 className="text-2xl font-bold text-white tracking-tight">Galeria de Templates & Animações</h2>
          </div>
          <p className="text-slate-400 text-sm">
            Explore animações Manim pré-configuradas cobrindo Cálculo, Álgebra Linear, 3D, Desmos e Redes Neurais.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cat === 'All' ? 'Todos os Templates' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="flex flex-col bg-slate-900/90 border border-slate-800 hover:border-sky-500/50 rounded-2xl p-5 shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-sky-500/10 group backdrop-blur-md"
          >
            {/* Category badge */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2.5 py-1 rounded-lg">
                {template.category}
              </span>
              <span className="text-xs text-slate-500 font-mono">Python 3.12</span>
            </div>

            <h3 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors mb-2">
              {template.title}
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed mb-4 flex-1">
              {template.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {template.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700/60"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Code Snippet Box */}
            <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 mb-5 relative group/code">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                  <Code2 className="w-3.0 h-3.0 text-sky-400" /> Manim Scene Code
                </span>
              </div>
              <pre className="text-[11px] font-mono text-slate-300 max-h-24 overflow-hidden text-ellipsis opacity-85">
                {template.code.slice(0, 180)}...
              </pre>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2 mt-auto">
              <button
                onClick={() => onSelectTemplate(template, false)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2.5 px-3 rounded-xl border border-slate-700 text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <Edit3 className="w-3.5 h-3.5 text-sky-400" />
                Editar Código
              </button>

              <button
                onClick={() => onSelectTemplate(template, true)}
                className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold py-2.5 px-3 rounded-xl text-xs shadow-md shadow-sky-500/20 flex items-center justify-center gap-1.5 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Renderizar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
