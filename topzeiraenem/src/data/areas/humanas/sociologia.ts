import { Discipline } from '../../../types/curriculum';

export const sociologia: Discipline = {
  id: 'sociologia',
  name: 'Sociologia',
  description: 'Teorias clássicas e contemporâneas, estruturas de poder, movimentos sociais, desigualdades e a formação social brasileira.',
  topics: [
    {
      id: 'sociologia-classica',
      title: 'A Tríade Clássica da Sociologia: Durkheim, Marx e Weber',
      description: 'Métodos sociológicos fundamentais, o fato social, a luta de classes e os tipos ideais de ação social.',
      subtopics: [
        {
          id: 'durkheim-fato-social-solidariedade',
          title: 'Émile Durkheim: O Fato Social e a Coesão Social',
          enemWeight: 'Muito Alta',
          summary: 'O método positivista que trata os fatos sociais "como coisas", as formas de solidariedade mecânica e orgânica e o conceito de anomia.',
          keyConcepts: [
            'As Três Características do Fato Social: 1) Coercitividade (impõe-se aos indivíduos através de sanções legais, morais ou de constrangimento social); 2) Exterioridade (existe antes e fora da consciência individual do sujeito, sendo transmitido pela educação e socialização); 3) Generalidade (é comum e repetido por todos ou pela grande maioria dos membros do grupo).',
            'Solidariedade Mecânica vs. Orgânica: Solidariedade Mecânica ocorre em sociedades pré-capitalistas tradicionais, com pouca divisão social do trabalho, onde os indivíduos são unidos pela semelhança de crenças e a consciência coletiva é forte e repressiva; Solidariedade Orgânica ocorre nas sociedades industriais modernas complexas, com altíssima especialização e divisão do trabalho, onde os indivíduos são interdependentes uns dos outros pelas suas funções complementares (como os órgãos de um corpo biológico).',
            'Anomia Social: Estado patológico de ausência, enfraquecimento ou descompasso das regras e normas sociais reguladoras em momentos de crise econômica ou rápidas transformações, gerando desorientação moral dos indivíduos e desintegração do tecido social.'
          ],
          tips: [
            'Para Durkheim, a sociedade PREVALECE sobre o indivíduo: as regras sociais determinam a conduta dos sujeitos desde o nascimento através das instituições socializadoras (família, escola, religião).'
          ]
        },
        {
          id: 'karl-marx-luta-classes-alienacao',
          title: 'Karl Marx: Materialismo Histórico, Mais-Valia e Alienação',
          enemWeight: 'Muito Alta',
          summary: 'A crítica da economia política capitalista, a exploração do proletariado e a luta de classes como força motriz da história.',
          keyConcepts: [
            'Materialismo Histórico-Dialético: A base econômica material da sociedade (infraestrutura: forças produtivas e relações de produção) condiciona as formas políticas, jurídicas e ideológicas de pensamento (superestrutura). A história da humanidade é a história da LUTA DE CLASSES (senhores vs. escravos na antiguidade; nobres feudais vs. servos na Idade Média; burgueses proprietários dos meios de produção vs. proletários desprovidos que vendem sua força de trabalho no capitalismo).',
            'Mais-Valia (Teoria do Valor-Trabalho): A riqueza excedente produzida pelo trabalho do operário que NÃO lhe é paga no salário e é apropriada privadamente pelo capitalista como lucro. Pode ser Absoluta (aumento da jornada diária de trabalho sem aumento proporcional de salário) ou Relativa (aumento da produtividade mediante introdução de maquinários e tecnologias que barateiam o custo de vida e encurtam o tempo de trabalho necessário).',
            'Alienação do Trabalho: O trabalhador não se reconhece mais no produto de sua atividade (que pertence ao patrão), perde o controle sobre o processo produtivo fragmentado e passa a ser tratado como mera mercadoria descartável.',
            'Fetichismo da Mercadoria e Ideologia: A mercadoria parece ter vida e valor próprios mágicos no mercado, ocultando as relações sociais reais de exploração humana que a fabricaram. A Ideologia da classe dominante apresenta seus próprios interesses particulares como se fossem o "interesse universal de todos".'
          ],
          tips: [
            'Atenção ao conceito de Mais-Valia Relativa: ela não exige que o trabalhador fique mais horas na fábrica; basta comprar uma máquina mais veloz que dobre a produção no mesmo período de tempo!'
          ]
        },
        {
          id: 'max-weber-acao-social-dominacao',
          title: 'Max Weber: Ação Social, Tipos de Dominação e Ética Protestante',
          enemWeight: 'Muito Alta',
          summary: 'A sociologia compreensiva orientada pelo sentido subjetivo da ação dos indivíduos e a racionalização burocrática do mundo moderno.',
          keyConcepts: [
            'Sociologia Compreensiva e Ação Social: O objeto da sociologia é compreender o sentido subjetivo que o indivíduo atribui à sua própria ação em relação aos outros. Quatro Tipos Ideais de Ação Social: 1) Ação Racional com Relação a Fins (cálculo instrumental de custo-benefício para alcançar uma meta prática); 2) Ação Racional com Relação a Valores (guiada pela fidelidade a um princípio ético, religioso ou político, sem visar vantagem imediata); 3) Ação Afetiva (movida por paixões e emoções impulsivas); 4) Ação Tradicional (ditada pelo hábito arraigado e pelos costumes culturais ancestrais).',
            'Os Três Tipos Puros de Dominação Legítima: 1) Dominação Tradicional (baseada no respeito à santidade dos costumes transmitidos desde tempos imemoriais, como a autoridade patriarcal ou a nobreza monárquica); 2) Dominação Carismática (baseada na devoção emocional às qualidades extraordinárias e proféticas de um líder, como Gandhi, Mandela ou líderes messiânicos); 3) Dominação Racional-Legal / Burocrática (baseada na obediência a leis impessoais, estatutos jurídicos abstratos e cargos formais da administração pública contemporânea).',
            '*A Ética Protestante e o Espírito do Capitalismo*: Weber demonstrou como a doutrina calvinista da predestinação divina e a ascese intramundana (trabalho disciplinado, vida metódica e poupança de recursos sem luxos ostentatórios) forneceram a afinidade eletiva psicológica e a base moral que impulsionaram o nascimento do capitalismo industrial moderno.',
            'O Desencantamento do Mundo: O avanço progressivo da racionalização técnico-científica elimina as explicações mágicas e místicas da realidade, aprisionando o ser humano em uma "gaiola de ferro" de burocracia e pragmatismo.'
          ],
          tips: [
            'Diferença crucial entre Durkheim e Weber: Durkheim estuda o Fato Social como algo exterior que coagirá o indivíduo de fora para dentro; Weber estuda a Ação Social a partir do sentido e da motivação subjetiva que o próprio indivíduo projeta para fora.'
          ]
        }
      ]
    },
    {
      id: 'cultura-poder-interpretes-brasil',
      title: 'Cultura, Sociedade Contemporânea e Intérpretes do Brasil',
      description: 'Indústria cultural, modernidade líquida, dominação simbólica e as teses formadoras da sociedade brasileira.',
      subtopics: [
        {
          id: 'industria-cultural-modernidade-liquida',
          title: 'Teoria Crítica e Sociedade Contemporânea: Adorno, Bauman e Bourdieu',
          enemWeight: 'Muito Alta',
          summary: 'A mercantilização da cultura de massas, as relações sociais efêmeras no hiperconsumismo e a reprodução simbólica das desigualdades.',
          keyConcepts: [
            'Theodor Adorno e Max Horkheimer: Indústria Cultural (*Kulturindustrie*): A transformação da arte e da cultura em mercadorias de consumo padronizadas, produzidas em série para gerar lucro fácil. O entretenimento fácil e repetitivo age como entorpecente psíquico que anestesia a sensibilidade estética e neutraliza o senso crítico contestador das massas proletárias.',
            'Zygmunt Bauman e a "Modernidade Líquida": Transição de uma modernidade sólida (instituições duradouras, empregos para a vida toda, compromissos comunitários estáveis) para uma fase líquida e volátil, caracterizada pela incerteza, flexibilidade extrema, descarte rápido de mercadorias e de laços afetivos ("relações de clique, conexões fáceis de desfazer"). O cidadão foi substituído pelo consumidor compulsivo.',
            'Pierre Bourdieu: Violência Simbólica e Tipos de Capital: As classes dominantes impõem sua própria cultura como se fosse a única legítima e universal, sem necessidade de coerção física direta. Conceito de *Habitus* (esquemas internalizados de percepção e ação) e tipos de capital: Econômico (renda, bens), Social (redes de contatos de prestígio) e Cultural (diplomas, erudição, domínio da norma-culta da língua). A escola formal muitas vezes reproduz e legitima a desigualdade ao valorizar apenas o capital cultural herdado pelas elites.'
          ],
          tips: [
            'Excelente repertório para Redação: O conceito de "Modernidade Líquida" de Bauman encaixa-se com perfeição em temas que tratam de efemeridade nas redes sociais, consumo desenfreado de eletrônicos ou fragilidade de compromissos coletivos.'
          ]
        },
        {
          id: 'interpretes-brasil-racismo-estrutural',
          title: 'Pensamento Social Brasileiro: Freyre, Sérgio Buarque, Florestan e Lélia Gonzalez',
          enemWeight: 'Muito Alta',
          summary: 'A crítica ao mito da cordialidade e da democracia racial, e a denúncia do racismo estrutural na formação do país.',
          keyConcepts: [
            'Gilberto Freyre (*Casa-Grande & Senzala*, 1933): Destacou a miscigenação biológica e cultural entre indígenas, africanos e portugueses como o elemento definidor da identidade brasileira. No entanto, sua obra deu origem à leitura equivocada do "Mito da Democracia Racial" — a falsa crença de que as relações raciais no Brasil teriam sido harmoniosas, benevolentes e desprovidas da segregação violenta vista nos Estados Unidos ou África do Sul.',
            'Sérgio Buarque de Holanda (*Raízes do Brasil*, 1936): O conceito do "Homem Cordial". Atenção: "cordial" provém do latim *cor, cordis* (coração), significando o agir movido pelo afeto, pela intimidade e pela emoção em vez da impessoalidade da lei abstrata. Isso resulta na incapacidade histórica de separar a esfera pública (o bem comum) da esfera privada (interesses da família e amigos), alimentando o patrimonialismo, nepotismo e o jeitinho brasileiro.',
            'Florestan Fernandes (*A Integração do Negro na Sociedade de Classes*, 1965): Demoliu cientificamente o mito da democracia racial. Demonstrou que a abolição inconclusa de 1888 abandonou os libertos à própria sorte, reservando-lhes as ocupações mais precárias do subproletariado urbano enquanto o Estado subsidiava a vinda de imigrantes brancos europeus ("política de branqueamento"), perpetuando o abismo socioeconômico racial.',
            'Lélia Gonzalez e o Racismo Estrutural Interseccional: Intelectual pioneira do feminismo negro brasileiro. Formulou o conceito de "Améfrica Ladina" para valorizar a presença cultural e linguística afro-indígena contra o eurocentrismo. Denunciou a dupla opressão (interseccionalidade) sofrida pelas mulheres negras no Brasil, vitimadas simultaneamente pelo machismo e pelo racismo institucional.'
          ],
          tips: [
            'Cuidado com a pegadinha clássica sobre o "Homem Cordial" de Sérgio Buarque de Holanda no ENEM: "cordial" NÃO quer dizer que o brasileiro seja necessariamente educado, pacífico ou gentil. Significa que ele age com a emoção e com o coração, podendo ir do afeto extremo à violência impulsiva mais cruel em segundos!'
          ]
        }
      ]
    }
  ]
};
