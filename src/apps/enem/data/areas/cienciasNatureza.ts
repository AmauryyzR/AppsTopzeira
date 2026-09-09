import { KnowledgeArea } from '../../types/curriculum';
import { fisica } from './natureza/fisica';
import { quimica } from './natureza/quimica';
import { biologia } from './natureza/biologia';

export const cienciasNatureza: KnowledgeArea = {
  id: 'ciencias-natureza',
  name: 'Ciências da Natureza e suas Tecnologias',
  code: 'CN',
  description: 'Estudo dos princípios físicos, químicos e biológicos com enfoque investigativo, fenomenológico e socioambiental para o ENEM.',
  disciplines: [
    fisica,
    quimica,
    biologia
  ]
};
