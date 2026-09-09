import { KnowledgeArea } from '../types/curriculum';
import { cienciasNatureza } from './areas/cienciasNatureza';
import { matematica } from './areas/matematica';
import { cienciasHumanas } from './areas/cienciasHumanas';
import { linguagens } from './areas/linguagens';

export const ENEM_CURRICULUM: KnowledgeArea[] = [
  cienciasNatureza,
  matematica,
  cienciasHumanas,
  linguagens,
];
