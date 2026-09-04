import React, { useState } from 'react';
import { Activity, ChevronDown, ChevronUp, Maximize2 } from 'lucide-react';
import { ModelDefinition, ModelStats } from '../engine/types';

interface ModelInspectorProps {
  model: ModelDefinition;
  stats: ModelStats | null;
}

export const ModelInspector: React.FC<ModelInspectorProps> = ({ model, stats }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="absolute bottom-4 left-4 z-20 pointer-events-auto max-w-sm w-[calc(100vw-2rem)] sm:w-80">
      <div className="bg-[#1e2025]/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden transition-all duration-300">
        {/* Header */}
        <div
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="px-4 py-3 flex items-center justify-between cursor-pointer select-none hover:bg-white/5 transition-colors border-b border-white/5"
        >
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-white tracking-wider uppercase font-mono">
              Inspetor de Malha
            </span>
          </div>
          <button
            type="button"
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Content Body */}
        {!isCollapsed && (
          <div className="p-4 space-y-3 text-xs">
            {/* Model Name & Category */}
            <div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Categoria: {model.category}</span>
                <span className="text-cyan-400 font-mono">ID: {model.id}</span>
              </div>
              <div className="text-sm font-semibold text-white mt-0.5">{model.name}</div>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{model.description}</p>
            </div>

            <div className="h-[1px] bg-white/5" />

            {/* Geometry Stats Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#15171b] p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] text-slate-400 font-mono uppercase block">Vértices</span>
                <span className="text-sm font-bold font-mono text-cyan-300">
                  {stats ? stats.vertices.toLocaleString() : '---'}
                </span>
              </div>

              <div className="bg-[#15171b] p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] text-slate-400 font-mono uppercase block">Triângulos</span>
                <span className="text-sm font-bold font-mono text-emerald-300">
                  {stats ? stats.triangles.toLocaleString() : '---'}
                </span>
              </div>

              <div className="bg-[#15171b] p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] text-slate-400 font-mono uppercase block">Sub-Malhas</span>
                <span className="text-sm font-bold font-mono text-purple-300">
                  {stats ? stats.meshCount : '---'}
                </span>
              </div>

              <div className="bg-[#15171b] p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] text-slate-400 font-mono uppercase block">Altura (Y)</span>
                <span className="text-sm font-bold font-mono text-amber-300">
                  {stats ? `${stats.dimensions.height} m` : '---'}
                </span>
              </div>
            </div>

            {/* Bounding Dimensions */}
            {stats && (
              <div className="bg-[#15171b] p-2.5 rounded-xl border border-white/5 flex items-center justify-between font-mono text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Dimensões (L × A × P):</span>
                </div>
                <span className="text-slate-200 font-semibold">
                  {stats.dimensions.width} × {stats.dimensions.height} × {stats.dimensions.depth} m
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
