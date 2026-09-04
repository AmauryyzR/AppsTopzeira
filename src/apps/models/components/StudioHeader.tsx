import React from 'react';
import { Box, Eye, Layers, RotateCcw, Play, Pause, Grid, Sun, HelpCircle, Download } from 'lucide-react';
import { ModelDefinition, ShadingMode } from '../engine/types';

interface StudioHeaderProps {
  models: ModelDefinition[];
  selectedModelId: string;
  onSelectModel: (id: string) => void;
  shadingMode: ShadingMode;
  onSelectShadingMode: (mode: ShadingMode) => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  showShadows: boolean;
  onToggleShadows: () => void;
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
  onResetCamera: () => void;
  onOpenHelp: () => void;
  onExportGLB: () => void;
  isExporting?: boolean;
}

export const StudioHeader: React.FC<StudioHeaderProps> = ({
  models,
  selectedModelId,
  onSelectModel,
  shadingMode,
  onSelectShadingMode,
  showGrid,
  onToggleGrid,
  showShadows,
  onToggleShadows,
  autoRotate,
  onToggleAutoRotate,
  onResetCamera,
  onOpenHelp,
  onExportGLB,
  isExporting = false,
}) => {
  return (
    <header className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
      {/* Left: Branding & Model Selector */}
      <div className="flex items-center gap-3 bg-[#1e2025]/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 shadow-2xl pointer-events-auto">
        <div className="flex items-center gap-2 pr-3 border-r border-white/10">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Box className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-mono tracking-widest text-cyan-400 font-bold uppercase">3D STUDIO</div>
            <div className="text-sm font-bold text-white tracking-tight">/models</div>
          </div>
        </div>

        {/* Model dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="model-select" className="text-xs text-slate-400 font-medium hidden sm:inline">
            Modelo:
          </label>
          <select
            id="model-select"
            value={selectedModelId}
            onChange={(e) => onSelectModel(e.target.value)}
            className="bg-[#292c33] hover:bg-[#32363f] text-slate-100 text-xs font-medium py-1.5 px-3 rounded-xl border border-white/10 focus:outline-none focus:border-cyan-500 transition-all cursor-pointer"
          >
            {models.map((m) => (
              <option key={m.id} value={m.id} className="bg-[#1e2025] text-white">
                {m.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Center/Right: Viewport, Shading & Export Controls */}
      <div className="flex items-center gap-2 bg-[#1e2025]/90 backdrop-blur-md px-3 py-2 rounded-2xl border border-white/10 shadow-2xl pointer-events-auto">
        {/* Shading mode switch */}
        <div className="flex items-center bg-[#131417] p-1 rounded-xl border border-white/5">
          <button
            type="button"
            title="Modo Material (Cores e Texturas PBR)"
            onClick={() => onSelectShadingMode('material')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              shadingMode === 'material'
                ? 'bg-cyan-500 text-black font-semibold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Material</span>
          </button>

          <button
            type="button"
            title="Modo Sólido / Clay (Estilo Blender Clay)"
            onClick={() => onSelectShadingMode('clay')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              shadingMode === 'clay'
                ? 'bg-cyan-500 text-black font-semibold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Clay</span>
          </button>

          <button
            type="button"
            title="Modo Wireframe (Aramado de Polígonos)"
            onClick={() => onSelectShadingMode('wireframe')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              shadingMode === 'wireframe'
                ? 'bg-cyan-500 text-black font-semibold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Wireframe</span>
          </button>
        </div>

        <div className="h-5 w-[1px] bg-white/10 mx-1" />

        {/* Grid Toggle */}
        <button
          type="button"
          onClick={onToggleGrid}
          title={showGrid ? 'Ocultar Grade' : 'Mostrar Grade'}
          className={`p-2 rounded-xl text-xs font-medium border transition-all ${
            showGrid
              ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
              : 'bg-[#292c33] border-white/5 text-slate-400 hover:text-white'
          }`}
        >
          <Grid className="w-4 h-4" />
        </button>

        {/* Shadows Toggle */}
        <button
          type="button"
          onClick={onToggleShadows}
          title={showShadows ? 'Desativar Sombras' : 'Ativar Sombras'}
          className={`p-2 rounded-xl text-xs font-medium border transition-all ${
            showShadows
              ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
              : 'bg-[#292c33] border-white/5 text-slate-400 hover:text-white'
          }`}
        >
          <Sun className="w-4 h-4" />
        </button>

        {/* Auto-Rotate Toggle */}
        <button
          type="button"
          onClick={onToggleAutoRotate}
          title={autoRotate ? 'Pausar Auto-Rotação' : 'Iniciar Auto-Rotação 360°'}
          className={`p-2 rounded-xl text-xs font-medium border transition-all ${
            autoRotate
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
              : 'bg-[#292c33] border-white/5 text-slate-400 hover:text-white'
          }`}
        >
          {autoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        {/* Reset Camera Button */}
        <button
          type="button"
          onClick={onResetCamera}
          title="Centralizar Câmera no Modelo [F]"
          className="p-2 rounded-xl text-xs font-medium bg-[#292c33] border border-white/5 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/30 transition-all flex items-center gap-1.5"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden lg:inline text-[11px] font-mono">Foco [F]</span>
        </button>

        {/* Export GLB Button */}
        <button
          type="button"
          onClick={onExportGLB}
          disabled={isExporting}
          title="Exportar Modelo 3D (.GLB para Jogos)"
          className="px-3 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">{isExporting ? 'Exportando...' : 'Baixar .GLB'}</span>
        </button>

        {/* Help button */}
        <button
          type="button"
          onClick={onOpenHelp}
          title="Ajuda de Navegação"
          className="p-2 rounded-xl text-xs font-medium bg-[#292c33] border border-white/5 text-slate-400 hover:text-white transition-all"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
