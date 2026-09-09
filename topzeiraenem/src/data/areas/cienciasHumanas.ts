import { KnowledgeArea } from '../../types/curriculum';
import { historia } from './humanas/historia';
import { geografia } from './humanas/geografia';
import { filosofia } from './humanas/filosofia';
import { sociologia } from './humanas/sociologia';

export const cienciasHumanas: KnowledgeArea = {
  id: 'ciencias-humanas',
  name: 'Ciências Humanas e suas Tecnologias',
  code: 'CH',
  description: 'Análise crítica dos processos históricos, dinâmicas espaciais e socioambientais, reflexão ética, estruturas sociológicas e pensamento social brasileiro.',
  disciplines: [
    historia,
    geografia,
    filosofia,
    sociologia
  ]
};
