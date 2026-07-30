import React from 'react';
import { Play, Monitor, Layers, RefreshCw } from 'lucide-react';

export interface RenderPresets {
  quality: 'ql' | 'qm' | 'qh' | 'qk';
  fps: number;
  resolution: string;
  format: 'mp4' | 'webm' | 'gif';
  aspectRatio: '16:9' | '9:16' | '1:1' | '4:3';
  bgColor: string;
  transparent: boolean;
}

interface PresetControlsProps {
  presets: RenderPresets;
  onPresetChange: (newPresets: RenderPresets) => void;
  scenes: string[];
  selectedScene: string;
  onSceneChange: (scene: string) => void;
  isRendering: boolean;
  onStartRender: () => void;
}

export const PresetControls: React.FC<PresetControlsProps> = ({
  presets,
  onPresetChange,
  scenes,
  selectedScene,
  onSceneChange,
  isRendering,
  onStartRender,
}) => {
  const updatePreset = (key: keyof RenderPresets, value: any) => {
    const next = { ...presets, [key]: value };

    // Auto-update resolution string based on quality & aspect ratio
    if (key === 'quality' || key === 'aspectRatio') {
      const q = key === 'quality' ? value : presets.quality;
      const ar = key === 'aspectRatio' ? value : presets.aspectRatio;

      let baseW = 1920;
      let baseH = 1080;
      if (q === 'qk') { baseW = 3840; baseH = 2160; }
      else if (q === 'qh') { baseW = 1920; baseH = 1080; }
      else if (q === 'qm') { baseW = 1280; baseH = 720; }
      else if (q === 'ql') { baseW = 854; baseH = 480; }

      if (ar === '9:16') {
        next.resolution = `${baseH}x${baseW}`;
      } else if (ar === '1:1') {
        next.resolution = `${baseH}x${baseH}`;
      } else if (ar === '4:3') {
        next.resolution = `${Math.round((baseH * 4) / 3)}x${baseH}`;
      } else {
        next.resolution = `${baseW}x${baseH}`;
      }
    }

    onPresetChange(next);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
      {/* Scene Selector */}
      <div className="flex items-center gap-2">
        <div className="p-2 bg-sky-500/10 border border-sky-500/20 rounded-xl text-sky-400">
          <Layers className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cena Manim</span>
          <select
            value={selectedScene}
            onChange={(e) => onSceneChange(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-sky-300 font-semibold text-xs py-1.5 px-2.5 rounded-lg focus:outline-none focus:border-sky-500 cursor-pointer min-w-[140px]"
          >
            {scenes.length > 0 ? (
              scenes.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))
            ) : (
              <option value="MainScene">MainScene (Auto)</option>
            )}
          </select>
        </div>
      </div>

      {/* Resolution & Quality Presets */}
      <div className="flex items-center gap-2">
        <div className="p-2 bg-slate-800 rounded-xl text-slate-300">
          <Monitor className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Preset de Qualidade</span>
          <select
            value={presets.quality}
            onChange={(e) => updatePreset('quality', e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs py-1.5 px-2.5 rounded-lg focus:outline-none focus:border-sky-500 cursor-pointer"
          >
            <option value="qk">4K Ultra HD (2160p)</option>
            <option value="qh">Full HD (1080p60)</option>
            <option value="qm">HD (720p30)</option>
            <option value="ql">Rascunho (480p)</option>
          </select>
        </div>
      </div>

      {/* Frame Rate FPS */}
      <div className="flex items-center gap-2">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Taxa FPS</span>
          <select
            value={presets.fps}
            onChange={(e) => updatePreset('fps', parseInt(e.target.value))}
            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs py-1.5 px-2.5 rounded-lg focus:outline-none focus:border-sky-500 cursor-pointer"
          >
            <option value={60}>60 FPS</option>
            <option value={30}>30 FPS</option>
            <option value={24}>24 FPS</option>
            <option value={15}>15 FPS</option>
          </select>
        </div>
      </div>

      {/* Format (MP4 / WebM / GIF) */}
      <div className="flex items-center gap-2">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Formato</span>
          <select
            value={presets.format}
            onChange={(e) => updatePreset('format', e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs py-1.5 px-2.5 rounded-lg focus:outline-none focus:border-sky-500 cursor-pointer"
          >
            <option value="mp4">Vídeo MP4</option>
            <option value="webm">Vídeo WebM</option>
            <option value="gif">GIF Animado</option>
          </select>
        </div>
      </div>

      {/* Aspect Ratio */}
      <div className="flex items-center gap-2">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Proporção</span>
          <select
            value={presets.aspectRatio}
            onChange={(e) => updatePreset('aspectRatio', e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs py-1.5 px-2.5 rounded-lg focus:outline-none focus:border-sky-500 cursor-pointer"
          >
            <option value="16:9">16:9 (YouTube / Padrao)</option>
            <option value="9:16">9:16 (Shorts / Reels)</option>
            <option value="1:1">1:1 (Quadrado)</option>
            <option value="4:3">4:3 (Clássico)</option>
          </select>
        </div>
      </div>

      {/* Transparency / Color */}
      <div className="flex items-center gap-3 border-l border-slate-800 pl-3">
        <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={presets.transparent}
            onChange={(e) => updatePreset('transparent', e.target.checked)}
            className="w-4 h-4 rounded accent-sky-500"
          />
          Transparência
        </label>
      </div>

      {/* Render Action Button */}
      <button
        onClick={onStartRender}
        disabled={isRendering}
        className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg transition-all transform active:scale-95 ${
          isRendering
            ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
            : 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-sky-500/25 hover:-translate-y-0.5'
        }`}
      >
        {isRendering ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin text-sky-400" />
            Renderizando...
          </>
        ) : (
          <>
            <Play className="w-4 h-4 fill-current" />
            Renderizar Vídeo
          </>
        )}
      </button>
    </div>
  );
};
