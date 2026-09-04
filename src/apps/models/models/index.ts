import { ModelDefinition } from '../engine/types';
import { createOakTree, createSakuraTree, createPineTree } from './TreeModel';
import { createRealisticPBRTree } from './RealisticPBRTree';

export const AVAILABLE_MODELS: ModelDefinition[] = [
  {
    id: 'tree-pbr',
    name: '🌳 Árvore Realista PBR (Toolkit)',
    category: 'PBR Avançado',
    description: 'Modelo gerado com casca PBR, Normal Maps via Sobel, UVs Triplanares, oclusão de contato e corte CSG.',
    create: () => createRealisticPBRTree(),
  },
  {
    id: 'tree-oak',
    name: 'Árvore (Carvalho)',
    category: 'Natureza',
    description: 'Árvore estilizada com tronco retorcido, raízes expostas e copa volumosa orgânica.',
    create: () => createOakTree(),
  },
  {
    id: 'tree-sakura',
    name: 'Árvore (Cerejeira / Sakura)',
    category: 'Natureza',
    description: 'Cerejeira japonesa com tronco sinuoso e flores rosadas delicadas.',
    create: () => createSakuraTree(),
  },
  {
    id: 'tree-pine',
    name: 'Árvore (Pinheiro)',
    category: 'Natureza',
    description: 'Pinheiro cônico esguio com múltiplas camadas de folhagem perene.',
    create: () => createPineTree(),
  },
];

export const DEFAULT_MODEL_ID = 'tree-pbr';
