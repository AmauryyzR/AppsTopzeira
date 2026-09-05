import * as THREE from 'three';
import { createSingleLeafGeometry, mergeBufferGeometriesFast, TieredFoliageData } from './LowPolyLeaf';

/** Deterministic shingled foliage. Each crown has an inner skirt and an irregular outer shell. */
export function createCanopyCrown(radius: THREE.Vector3, seed: number): TieredFoliageData {
  let state = seed;
  const random = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
  const tiers: THREE.BufferGeometry[][] = [[], [], []];
  const blade = createSingleLeafGeometry(.53, .34);
  for (let shell = 0; shell < 2; shell++) {
    const inset = shell === 0 ? .76 : 1;
    const rows = shell === 0 ? 7 : 15;
    for (let row = 0; row < rows; row++) {
      const latitude = -.91 + row / (rows - 1) * 2.40;
      const ring = Math.cos(latitude);
      const count = Math.max(7, Math.round(2 * Math.PI * radius.x * ring * inset / .19));
      for (let i = 0; i < count; i++) {
        const angle = i / count * Math.PI * 2 + row * 2.399963 + random() * .16;
        const lat = latitude + (random() - .5) * .19;
        const billow = 1 + .045 * Math.sin(angle * 5 + lat * 4) + .03 * Math.cos(angle * 3 - lat * 7);
        const leaf = blade.clone();
        const scale = .80 + random() * .42;
        const color = leaf.getAttribute('color');
        const warmth = random();
        for (let v = 0; v < color.count; v++) {
          const tip = Math.floor(v / 3) / 9;
          const fold = v % 3 === 1 ? 1.03 : v % 3 === 0 ? .91 : .98;
          const light = (.84 + warmth * .22 + tip * .08) * fold;
          color.setXYZ(v, light, light, light * (.90 + warmth * .08));
        }
        leaf.scale(scale * (.85 + random() * .28), scale, scale);
        leaf.rotateZ((random() - .5) * .38);
        // Upper leaves spread across the dome; lower leaves drape over its shoulder.
        leaf.rotateX(.76 - lat * .69 + (random() - .5) * .18);
        leaf.rotateY(Math.PI / 2 - angle);
        leaf.translate(
          Math.cos(angle) * Math.cos(lat) * radius.x * inset * billow,
          Math.sin(lat) * radius.y * inset,
          Math.sin(angle) * Math.cos(lat) * radius.z * inset * billow,
        );
        const tier = shell === 0 || lat < -.25 ? 2 : lat > .62 + random() * .24 ? 0 : 1;
        tiers[tier].push(leaf);
      }
    }
  }
  blade.dispose();
  return {sunlit: mergeBufferGeometriesFast(tiers[0]), meadow: mergeBufferGeometriesFast(tiers[1]), jade: mergeBufferGeometriesFast(tiers[2])};
}
