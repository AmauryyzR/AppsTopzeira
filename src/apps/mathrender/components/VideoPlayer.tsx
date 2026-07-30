import React, { useRef, useState, useEffect } from 'react';
import { Download, Play, Pause, RotateCcw, SkipForward, SkipBack, Film, Sparkles, Clock, HardDrive, CheckCircle2, Maximize2, X } from 'lucide-react';
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
  const theaterVideoRef = useRef<HTMLVideoElement | null>(null);
  
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isTheaterOpen, setIsTheaterOpen] = useState<boolean>(false);

  // Reset player time when render changes
  useEffect(() => {
    setCurrentTime(0);
    setDuration(currentRender?.durationSec || 0);
  }, [currentRender?.videoUrl]);

  // Handle ESC key to exit theater mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isTheaterOpen) {
        setIsTheaterOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTheaterOpen]);

  const togglePlay = () => {
    const targetVideo = isTheaterOpen ? theaterVideoRef.current : videoRef.current;
    if (!targetVideo) return;
    if (isPlaying) {
      targetVideo.pause();
      setIsPlaying(false);
    } else {
      targetVideo.play();
      setIsPlaying(true);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) videoRef.current.playbackRate = speed;
    if (theaterVideoRef.current) theaterVideoRef.current.playbackRate = speed;
  };

  const handleFrameStep = (frames: number) => {
    const targetVideo = isTheaterOpen ? theaterVideoRef.current : videoRef.current;
    if (!targetVideo) return;
    targetVideo.pause();
    setIsPlaying(false);
    const fps = currentRender?.fps || 60;
    const nextTime = Math.max(0, Math.min(targetVideo.duration || 0, targetVideo.currentTime + frames / fps));
    targetVideo.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextTime = parseFloat(e.target.value);
    setCurrentTime(nextTime);
    if (videoRef.current) videoRef.current.currentTime = nextTime;
    if (theaterVideoRef.current) theaterVideoRef.current.currentTime = nextTime;
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

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    return `${pad(mins)}:${pad(secs)}`;
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="flex flex-col gap-4 h-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-md">
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
      <div className="relative bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center h-[340px] sm:h-[420px] lg:h-[460px] max-h-[480px] p-2 group">
        {currentRender ? (
          ['gif', 'png', 'jpg', 'jpeg'].includes(currentRender.format.toLowerCase()) ? (
            <img
              src={currentRender.videoUrl}
              alt="Manim Render Output"
              className="max-h-full max-w-full object-contain rounded-lg"
            />
          ) : (
            <>
              <video
                ref={videoRef}
                src={currentRender.videoUrl}
                loop={isLooping}
                autoPlay
                onTimeUpdate={() => {
                  if (videoRef.current) {
                    setCurrentTime(videoRef.current.currentTime);
                  }
                }}
                onLoadedMetadata={() => {
                  if (videoRef.current) {
                    setDuration(videoRef.current.duration || currentRender.durationSec || 0);
                  }
                }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                className="max-h-full max-w-full object-contain rounded-lg cursor-pointer shadow-2xl"
                onClick={togglePlay}
              />
              <button
                onClick={() => setIsTheaterOpen(true)}
                className="absolute top-3 right-3 z-10 p-2.5 bg-slate-900/80 hover:bg-sky-500 text-slate-300 hover:text-white rounded-xl backdrop-blur-md border border-slate-700 transition-all opacity-80 hover:opacity-100 shadow-lg flex items-center gap-1.5 text-xs font-semibold"
                title="Modo Teatro (~75% da Tela)"
              >
                <Maximize2 className="w-4 h-4 stroke-[2.5]" />
                <span className="hidden sm:inline">Modo Teatro</span>
              </button>
            </>
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

      {/* Primary Download & Theater Action Buttons */}
      {currentRender && (
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownload}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold py-3 px-5 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Download className="w-5 h-5 stroke-[2.5]" />
            Baixar Mídia {currentRender.format.toUpperCase()}
          </button>

          <button
            onClick={() => setIsTheaterOpen(true)}
            className="bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 font-bold py-3 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
            title="Expandir Vídeo para Modo Teatro (~75% da Tela)"
          >
            <Maximize2 className="w-5 h-5 stroke-[2.5]" />
            <span className="hidden sm:inline">Modo Teatro</span>
          </button>
        </div>
      )}

      {/* Interactive Video Timeline & Scrub Bar */}
      {currentRender && !['gif', 'png', 'jpg', 'jpeg'].includes(currentRender.format.toLowerCase()) && (
        <div className="bg-slate-950/90 rounded-xl p-3 border border-slate-800 flex flex-col gap-2.5">
          {/* Interactive Seek Bar */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-semibold text-sky-400 min-w-[42px]">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              step="0.05"
              value={currentTime}
              onChange={handleSeekChange}
              className="w-full accent-sky-500 bg-slate-800 rounded-lg cursor-pointer h-2 flex-1"
            />
            <span className="text-xs font-mono font-semibold text-slate-400 min-w-[42px] text-right">
              {formatTime(duration)}
            </span>
          </div>

          {/* Playback Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="p-2 bg-sky-500 hover:bg-sky-400 rounded-xl text-white transition-all shadow-md shadow-sky-500/20"
                title={isPlaying ? "Pausar" : "Reproduzir"}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              </button>
              <button
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = 0;
                    setCurrentTime(0);
                  }
                }}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 transition-all border border-slate-700"
                title="Reiniciar Vídeo do Início"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleFrameStep(-1)}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 transition-all border border-slate-700"
                title="Voltar 1 Frame"
              >
                <SkipBack className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleFrameStep(1)}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 transition-all border border-slate-700"
                title="Avançar 1 Frame"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              {/* Speed selector */}
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1">
                {[0.5, 1.0, 1.5, 2.0].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSpeedChange(s)}
                    className={`text-[11px] font-mono px-2 py-0.5 rounded-lg transition-all ${
                      playbackSpeed === s ? 'bg-sky-500 text-white font-bold shadow-sm' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsLooping(!isLooping)}
                className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all ${
                  isLooping
                    ? 'bg-sky-500/10 border-sky-500/30 text-sky-400'
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
                title="Alternar Repetição Contínua (Loop)"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Loop
              </button>
            </div>
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

      {/* Theater Mode Modal Overlay (~75% Screen Width, 5% Margins, Blurred Background, Close X Button & Full Video Controls) */}
      {isTheaterOpen && currentRender && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setIsTheaterOpen(false)}
        >
          <div
            className="relative w-[78vw] max-w-6xl h-[85vh] max-h-[850px] min-w-[300px] bg-slate-900 border-2 border-sky-500/40 rounded-3xl p-4 sm:p-6 shadow-2xl shadow-sky-500/20 flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header bar with scene title & Close X button */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-sky-400">
                <Film className="w-5 h-5" />
                <h3 className="font-bold text-white text-base truncate">{currentRender.sceneName} - Modo Teatro</h3>
              </div>
              <button
                onClick={() => setIsTheaterOpen(false)}
                className="p-2 bg-slate-800 hover:bg-rose-500 text-slate-300 hover:text-white rounded-full transition-all shadow-md"
                title="Fechar (ESC ou Clicar Fora)"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {/* Main Video Viewport in Theater Modal */}
            <div className="relative flex-1 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center my-3 p-2">
              <video
                ref={theaterVideoRef}
                src={currentRender.videoUrl}
                loop={isLooping}
                autoPlay
                onTimeUpdate={() => {
                  if (theaterVideoRef.current) {
                    setCurrentTime(theaterVideoRef.current.currentTime);
                  }
                }}
                onLoadedMetadata={() => {
                  if (theaterVideoRef.current) {
                    setDuration(theaterVideoRef.current.duration || currentRender.durationSec || 0);
                  }
                }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                className="max-h-full max-w-full object-contain rounded-xl cursor-pointer shadow-2xl"
                onClick={togglePlay}
              />
            </div>

            {/* Video Controls Timeline & Seekbar inside Theater Modal */}
            {!['gif', 'png', 'jpg', 'jpeg'].includes(currentRender.format.toLowerCase()) && (
              <div className="bg-slate-950/90 rounded-2xl p-3 sm:p-4 border border-slate-800 flex flex-col gap-3">
                {/* Seekbar */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-semibold text-sky-400 min-w-[42px]">
                    {formatTime(currentTime)}
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    step="0.05"
                    value={currentTime}
                    onChange={handleSeekChange}
                    className="w-full accent-sky-500 bg-slate-800 rounded-lg cursor-pointer h-2.5 flex-1"
                  />
                  <span className="text-xs font-mono font-semibold text-slate-400 min-w-[42px] text-right">
                    {formatTime(duration)}
                  </span>
                </div>

                {/* Control Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={togglePlay}
                      className="p-2.5 bg-sky-500 hover:bg-sky-400 rounded-xl text-white transition-all shadow-md shadow-sky-500/20"
                      title={isPlaying ? "Pausar" : "Reproduzir"}
                    >
                      {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                    </button>
                    <button
                      onClick={() => {
                        const target = theaterVideoRef.current || videoRef.current;
                        if (target) {
                          target.currentTime = 0;
                          setCurrentTime(0);
                        }
                      }}
                      className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 transition-all border border-slate-700"
                      title="Reiniciar Vídeo"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleFrameStep(-1)}
                      className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 transition-all border border-slate-700"
                      title="Voltar 1 Frame"
                    >
                      <SkipBack className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleFrameStep(1)}
                      className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 transition-all border border-slate-700"
                      title="Avançar 1 Frame"
                    >
                      <SkipForward className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1">
                      {[0.5, 1.0, 1.5, 2.0].map((s) => (
                        <button
                          key={s}
                          onClick={() => handleSpeedChange(s)}
                          className={`text-xs font-mono px-2.5 py-1 rounded-lg transition-all ${
                            playbackSpeed === s ? 'bg-sky-500 text-white font-bold shadow-sm' : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {s}x
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setIsLooping(!isLooping)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        isLooping
                          ? 'bg-sky-500/10 border-sky-500/30 text-sky-400'
                          : 'bg-slate-900 border-slate-800 text-slate-500'
                      }`}
                    >
                      <RotateCcw className="w-4 h-4" /> Loop
                    </button>

                    <button
                      onClick={handleDownload}
                      className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                    >
                      <Download className="w-4 h-4 stroke-[2.5]" /> Baixar Vídeo
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
