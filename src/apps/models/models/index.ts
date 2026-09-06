import { ModelDefinition } from '../engine/types';
import { createOakTree, createSakuraTree, createPineTree } from './TreeModel';
import { createRealisticPBRTree } from './RealisticPBRTree';
import { createSingleLeafMesh, createLeafSprigMesh } from './lowpoly/LowPolyLeaf';
import { createModularBranchGroup } from './lowpoly/LowPolyBranch';
import { createLowPolyTrunkMesh } from './lowpoly/LowPolyTrunk';
import { createCompleteLowPolyTree } from './lowpoly/LowPolyTree';
import { createGemniDino, createDinoChibi } from './dino/DinoChibi';
import { createSharkAnimestyle } from './shark/SharkAnimestyle';
import { createSharkStreetwear } from './sharkStreetwear/Character';

export const AVAILABLE_MODELS: ModelDefinition[] = [
  {
    id: 'shark-streetwear',
    name: '🦈 Shark Streetwear · Novo',
    category: 'Personagens',
    description: 'Modelo independente com capuz ajustado, cabelo prateado, venda, roupa streetwear e rig articulado. Limite de 150.000 triângulos.',
    create: createSharkStreetwear,
  },
  {
    id: 'shark-animestyle',
    name: '🦈 SharkAnimestyle (Rigged)',
    category: 'Personagens',
    description: 'Personagem anime streetwear com capuz de tubarão azul ardósia, barbatanas dorsais e traseiras, dentes afiados, cabelo prateado, venda preta, calça jogger, tênis chunky e esqueleto para jogos com 30 ossos.',
    create: createSharkAnimestyle,
  },
  {
    id: 'sharkanimestyle',
    name: '🦈 SharkAnimestyle (Alias)',
    category: 'Personagens',
    description: 'Alias do modelo SharkAnimestyle.',
    create: createSharkAnimestyle,
  },
  {
    id: 'gemni-dino',
    name: '🦖 GemniDINO (Rigged)',
    category: 'Personagens',
    description: 'Personagem chibi com capuz de dinossauro inspirado na arte conceitual, com esqueleto articulado para jogos (30 ossos: braços, pernas, cabeça, cauda e sockets), animações completas e menos de 100.000 triângulos.',
    create: createGemniDino,
  },
  {
    id: 'dino-chibi',
    name: '🦖 GemniDINO (Legado)',
    category: 'Personagens',
    description: 'Alias de compatibilidade do GemniDINO.',
    create: createDinoChibi,
  },
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

export const DEFAULT_MODEL_ID = 'gemni-dino';
