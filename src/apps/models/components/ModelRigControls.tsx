import { useState } from 'react';

interface Props {
  boneCount: number;
  onAnimation: (name: string) => void;
  onSkeleton: (visible: boolean) => void;
}

export function ModelRigControls({boneCount, onAnimation, onSkeleton}: Props) {
  const [animation, setAnimation] = useState('Rest');
  const [skeleton, setSkeleton] = useState(false);
  return <aside className="absolute bottom-4 right-4 z-20 w-48 rounded-2xl border border-white/10 bg-[#1e2025]/95 p-3 text-xs shadow-xl">
    <p className="mb-2 font-semibold text-cyan-300">Rig · {boneCount} ossos</p>
    <label className="mb-2 flex items-center gap-2 cursor-pointer">
      <input type="checkbox" checked={skeleton} onChange={event => {setSkeleton(event.target.checked); onSkeleton(event.target.checked);}} />
      Mostrar esqueleto
    </label>
    <label htmlFor="rig-animation" className="mb-1 block text-slate-400">Prévia de animação</label>
    <select id="rig-animation" value={animation} onChange={event => {setAnimation(event.target.value); onAnimation(event.target.value);}}
      className="w-full rounded-lg border border-white/10 bg-[#292c33] p-2">
      <option value="Rest">Repouso · A-pose</option>
      <option value="Idle">Respiração</option>
      <option value="Walk">Caminhada</option>
      <option value="Wave">Aceno</option>
    </select>
    <p className="mt-2 leading-relaxed text-[10px] text-slate-400">Braços, pernas, cabeça e cauda. GLB com skinning, juntas e 3 animações.</p>
  </aside>;
}
