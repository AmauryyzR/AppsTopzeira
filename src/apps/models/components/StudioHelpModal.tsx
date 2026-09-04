import React from 'react';
import { X, MousePointer, Move, ZoomIn, RotateCcw } from 'lucide-react';

interface StudioHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudioHelpModal: React.FC<StudioHelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1e2025] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-white text-base">Controles de Navegação 3D</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs text-slate-300">
          <div className="flex items-start gap-3 p-2.5 rounded-xl bg-[#14161a] border border-white/5">
            <MousePointer className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-white">Orbitar / Girar Modelo</div>
              <div className="text-slate-400 mt-0.5">
                Clique com o <strong>Botão Esquerdo</strong> do mouse e arraste (ou toque com 1 dedo no celular).
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2.5 rounded-xl bg-[#14161a] border border-white/5">
            <Move className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-white">Mover / Panorâmica (Pan)</div>
              <div className="text-slate-400 mt-0.5">
                Clique com o <strong>Botão Direito</strong> (ou <strong>Shift + Botão Esquerdo</strong>) e arraste (ou toque com 2 dedos).
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2.5 rounded-xl bg-[#14161a] border border-white/5">
            <ZoomIn className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-white">Zoom Aproximar / Afastar</div>
              <div className="text-slate-400 mt-0.5">
                Gire a <strong>Roda do Mouse (Scroll)</strong> ou use movimento de pinça na tela de toque.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2.5 rounded-xl bg-[#14161a] border border-white/5">
            <RotateCcw className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-white">Recentralizar / Foco [F]</div>
              <div className="text-slate-400 mt-0.5">
                Pressione a tecla <strong>F</strong> no teclado ou clique no botão de foco para centralizar a câmera perfeitamente no modelo.
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-xl text-xs transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
