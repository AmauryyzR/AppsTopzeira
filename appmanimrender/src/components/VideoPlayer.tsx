import React, { useRef, useState } from 'react';
import { Download, Play, Pause, RotateCcw, SkipForward, SkipBack, Film, Sparkles, Clock, HardDrive, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export interface RenderResult {
  renderId: string;
  videoUrl: string;
  downloadUrl: string;
  fileName: string;
  fileSize: number;
  durationSec: number;
  resolution: string;
  fps: number;
  format: string;
  sceneName: string;
  createdAt: string;
}

interface VideoPlayerProps {
  currentRender: RenderResult | null;
  history: RenderResult[];
  onSelectFromHistory: (render: RenderResult) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  currentRender,
  history,
  onSelectFromHistory,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isLooping, setIsLooping] = useState<boolean>(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const handleFrameStep = (frames: number) => {
    if (!videoRef.current) return;
    videoRef.current.pause();
    setIsPlaying(false);
    const fps = currentRender?.fps || 60;
    videoRef.current.currentTime += frames / fps;
  };

  const handleDownload = () => {
    if (!currentRender) return;
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 }
    });
    const link = document.createElement('a');
    link.href = currentRender.downloadUrl;
    link.download = currentRender.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="flex flex-col gap-4 h-full bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sky-400">
          <Film className="w-5 h-5" />
          <h3 className="font-bold text-white text-base">Visualização & Download do Vídeo</h3>
        </div>
        {currentRender && (
          <span className="text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Prontinho para Download
          </span>
        )}
      </div>

      {/* Main Video Viewport */}
      <div className="relative flex-1 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center min-h-[300px] group">
        {currentRender ? (
          ['gif', 'png', 'jpg', 'jpeg'].includes(currentRender.format.toLowerCase()) ? (
            <img
              src={currentRender.videoUrl}
              alt="Manim Render Output"
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <video
              ref={videoRef}
              src={currentRender.videoUrl}
              loop={isLooping}
              autoPlay
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="max-h-full max-w-full object-contain cursor-pointer"
              onClick={togglePlay}
            />
          )
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600">
              <Film className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-300">Nenhum vídeo renderizado ainda</p>
              <p className="text-xs text-slate-500 max-w-xs mt-1">
                Clique no botão <span className="text-sky-400 font-semibold">"Renderizar Vídeo"</span> no editor para processar sua animação Manim.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Primary Download CTA Button */}
      {currentRender && (
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownload}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold py-3 px-5 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Download className="w-5 h-5 stroke-[2.5]" />
            Baixar Mídia {currentRender.format.toUpperCase()}
          </button>
        </div>
      )}

      {/* Video Player Control Toolbar */}
      {currentRender && !['gif', 'png', 'jpg', 'jpeg'].includes(currentRender.format.toLowerCase()) && (
        <div className="bg-slate-950/80 rounded-xl p-2.5 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="p-2 bg-sky-500 hover:bg-sky-400 rounded-lg text-white transition-all"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            </button>
            <button
              onClick={() => handleFrameStep(-1)}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300"
              title="Voltar 1 Frame"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleFrameStep(1)}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300"
              title="Avançar 1 Frame"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Speed selector */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
              {[0.5, 1.0, 1.5, 2.0].map((s) => (
                <button
                  key={s}
                  onClick={() => handleSpeedChange(s)}
                  className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                    playbackSpeed === s ? 'bg-sky-500 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsLooping(!isLooping)}
              className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1 ${
                isLooping
                  ? 'bg-sky-500/10 border-sky-500/30 text-sky-400'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
              title="Alternar Loop"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Loop
            </button>
          </div>
        </div>
      )}

      {/* Metadata Badges */}
      {currentRender && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <div>
              <p className="text-[10px] text-slate-500 uppercase">Resolução</p>
              <p className="text-xs font-mono font-bold text-slate-200">{currentRender.resolution}</p>
            </div>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <div>
              <p className="text-[10px] text-slate-500 uppercase">Tempo Render</p>
              <p className="text-xs font-mono font-bold text-slate-200">{currentRender.durationSec}s</p>
            </div>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-purple-400" />
            <div>
              <p className="text-[10px] text-slate-500 uppercase">Tamanho</p>
              <p className="text-xs font-mono font-bold text-slate-200">{formatBytes(currentRender.fileSize)}</p>
            </div>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2">
            <Film className="w-4 h-4 text-amber-400" />
            <div>
              <p className="text-[10px] text-slate-500 uppercase">FPS</p>
              <p className="text-xs font-mono font-bold text-slate-200">{currentRender.fps} fps</p>
            </div>
          </div>
        </div>
      )}

      {/* Session Render History */}
      {history.length > 0 && (
        <div className="border-t border-slate-800 pt-4 flex flex-col gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Histórico da Sessão ({history.length})
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {history.map((item) => (
              <button
                key={item.renderId}
                onClick={() => onSelectFromHistory(item)}
                className={`flex-shrink-0 bg-slate-950 border px-3 py-2 rounded-xl text-left hover:border-sky-500 transition-all ${
                  currentRender?.renderId === item.renderId
                    ? 'border-sky-500 bg-sky-500/10'
                    : 'border-slate-800 text-slate-400'
                }`}
              >
                <p className="text-xs font-bold text-slate-200 font-mono truncate max-w-[120px]">{item.sceneName}</p>
                <p className="text-[10px] text-slate-500">{item.resolution} • {item.format.toUpperCase()}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
