import { ModelDefinition } from '../engine/types';
import { createOakTree, createSakuraTree, createPineTree } from './TreeModel';
import { createRealisticPBRTree } from './RealisticPBRTree';
import { createSingleLeafMesh, createLeafSprigMesh } from './lowpoly/LowPolyLeaf';
import { createModularBranchGroup } from './lowpoly/LowPolyBranch';
import { createLowPolyTrunkMesh } from './lowpoly/LowPolyTrunk';
import { createCompleteLowPolyTree } from './lowpoly/LowPolyTree';

export const AVAILABLE_MODELS: ModelDefinition[] = [
  {
    id: 'tree-lowpoly',
    name: '🌳 Árvore Low-Poly Genshin (Completa)',
    category: 'Genshin Low Poly',
    description: 'Árvore ancestral montada modularmente com tronco esculpido, 5 instâncias do galho mestre com prateleiras sinuosas e cúpulas foliares cel-shaded.',
    create: () => createCompleteLowPolyTree(true),
  },
  {
    id: 'module-leaf',
    name: '🍃 Folha 3D Individual (Módulo)',
    category: 'Módulos Low Poly',
    description: 'Folha 3D estilizada com vinco diedro em V, curvatura dinâmica na ponta, haste de fixação e translucência solar (SSS).',
    create: () => createSingleLeafMesh(),
  },
  {
    id: 'module-sprig',
    name: '🌿 Ramalhete Foliar em Leque (Módulo)',
    category: 'Módulos Low Poly',
    description: 'Buquê denso de 14 folhas 3D distribuídas em espiral áurea sobre raminho de cedro com arqueamento natural.',
    create: () => createLeafSprigMesh(),
  },
  {
    id: 'module-branch',
    name: '🪵 Galho Mestre com Ramificações (Módulo)',
    category: 'Módulos Low Poly',
    description: 'Galho mestre modular sinuoso com curvas Catmull-Rom 3D, 2 ramificações secundárias contínuas e cúpulas foliares volumétricas em 3 tons cel-shaded.',
    create: () => createModularBranchGroup(),
  },
  {
    id: 'module-trunk',
    name: '🪵 Tronco Ancestral & Raízes (Módulo)',
    category: 'Módulos Low Poly',
    description: 'Tronco sinuoso de 8 faces com 5 raízes contrafortes espalhadas pelo solo e 5 pedestais de encaixe para a copa.',
    create: () => createLowPolyTrunkMesh().group,
  },
  {
    id: 'tree-pbr',
    name: 'Árvore Realista PBR (Anterior)',
    category: 'PBR Avançado',
    description: 'Modelo anterior com casca PBR e copa volumosa.',
    create: () => createRealisticPBRTree(),
  },
  {
    id: 'tree-oak',
    name: 'Árvore (Carvalho Stylized)',
    category: 'Natureza',
    description: 'Árvore estilizada com tronco retorcido.',
    create: () => createOakTree(),
  },
  {
    id: 'tree-sakura',
    name: 'Árvore (Cerejeira / Sakura)',
    category: 'Natureza',
    description: 'Cerejeira japonesa com tronco sinuoso e flores rosadas.',
    create: () => createSakuraTree(),
  },
  {
    id: 'tree-pine',
    name: 'Árvore (Pinheiro)',
    category: 'Natureza',
    description: 'Pinheiro cônico esguio com folhagem perene.',
    create: () => createPineTree(),
  },
];

export const DEFAULT_MODEL_ID = 'tree-lowpoly';

