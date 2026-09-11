import { useState } from 'react';

interface Props {
  boneCount: number;
  onAnimation: (name: string) => void;
  onSkeleton: (visible: boolean) => void;
  clips: string[];
  bindPose: string;
  defaultAnimation: string;
}

export function ModelRigControls({boneCount, onAnimation, onSkeleton, clips, bindPose, defaultAnimation}: Props) {
  const [animation, setAnimation] = useState(defaultAnimation);
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
      <option value="Rest">Rest · {bindPose}</option>
      {clips.map(name=><option key={name} value={name}>{name}</option>)}
    </select>
    <p className="mt-2 leading-relaxed text-[10px] text-slate-400">GLB · skinning · {clips.length} animations</p>
  </aside>;
}
