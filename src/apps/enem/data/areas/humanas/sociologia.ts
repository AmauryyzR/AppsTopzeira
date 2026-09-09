import { Discipline } from '../../../types/curriculum';

export const sociologia: Discipline = {
  id: 'sociologia',
  name: 'Sociologia',
  description: 'Teorias clássicas e contemporâneas, estruturas de poder, movimentos sociais, cidadania, desigualdades e pensamento social brasileiro.',
  topics: [
    {
      id: 'sociologia-classica',
      title: 'A Tríade Clássica da Sociologia: Durkheim, Marx e Weber',
      description: 'Métodos sociológicos fundadores, fatos sociais, luta de classes, mais-valia e tipos de ação e dominação social.',
      subtopics: [
        {
          id: 'durkheim-fato-social-solidariedade',
          title: 'Émile Durkheim: O Fato Social, Coesão e Anomia',
          enemWeight: 'Muito Alta',
          summary: 'O método positivista que analisa os fatos sociais "como coisas", as modalidades de solidariedade social e as patologias da anomia.',
          keyConcepts: [
            '**A Regra Fundamental do Método Sociológico**: Durkheim propôs que a Sociologia deve tratar os **fatos sociais como coisas**, analisando-os com neutralidade científica e rigor empírico semelhante às ciências naturais, afastando prenoções, preconceitos e paixões pessoais do pesquisador.',
            '**As Três Características do Fato Social**: Um fenômeno só é um fato social genuíno se possuir simultaneamente: 1) **Coercitividade** (impõe-se aos indivíduos de maneira imperativa, exercendo pressão ou constrangimento social através de leis, normas morais, sanções jurídicas ou ridicularização pública caso seja violado); 2) **Exterioridade** (existe de modo autônomo, antes e fora da consciência do indivíduo, sendo introjetado desde a infância pelas instituições socializadoras como a família, a escola e a religião); 3) **Generalidade** (manifesta-se de forma coletiva, difusa e repetida por todos ou pela grande maioria dos membros de uma determinada sociedade).',
            '**Solidariedade Mecânica versus Solidariedade Orgânica**: A **Solidariedade Mecânica** predomina nas sociedades tradicionais e pré-capitalistas, onde há baixa divisão social do trabalho; a coesão funda-se na semelhança mútua de crenças e costumes, com uma **Consciência Coletiva** onipresente e direito repressivo severo. A **Solidariedade Orgânica** consolida-se nas sociedades industriais modernas complexas, marcadas por intensa especialização e divisão técnica do trabalho; a coesão nasce da mútua **interdependência funcional** entre indivíduos que desempenham papéis complementares (como os diferentes órgãos especializados de um corpo biológico vivo), sob o amparo de um direito restitutivo.',
            '**O Conceito de Anomia Social**: Estado patológico em que o tecido social se esgarça devido ao enfraquecimento, ausência ou rápido descompasso das regras morais reguladoras em momentos de crise econômica, guerras ou profundas revoluções tecnológicas. Sem limites institucionais claros sobre seus desejos e expectativas, os indivíduos caem em desorientação existencial, culminando no aumento de índices de criminalidade e do que Durkheim classificou em seu estudo pioneiro como **suicídio anômico**.'
          ],
          tips: [
            'Postura teórica fundamental de Durkheim para o ENEM: O todo social PREVALECE sobre o indivíduo isolado. A sociedade não é a simples soma matemática das partes individuais, mas uma realidade sui generis com leis e dinâmicas próprias que moldam a conduta humana.'
          ]
        },
        {
          id: 'karl-marx-luta-classes-alienacao',
          title: 'Karl Marx: Materialismo Histórico, Mais-Valia e Alienação',
          enemWeight: 'Muito Alta',
          summary: 'A crítica radical da economia política capitalista, a exploração do proletariado e a luta de classes como força motriz da história humana.',
          keyConcepts: [
            '**O Materialismo Histórico-Dialético**: Método de análise que postula que as condições materiais e as relações econômicas concretas de produção (**infraestrutura**) determinam historicamente as instituições jurídicas, políticas, religiosas e as ideologias dominantes de uma época (**superestrutura**). A história de todas as sociedades até hoje é a **história da luta de classes**: o antagonismo inconciliável entre classes opressoras e exploradas (senhores e escravizados na Antiguidade, senhores feudais e servos na Idade Média, burgueses detentores dos meios de produção e proletários vendedores de força de trabalho no Capitalismo).',
            '**A Teoria da Mais-Valia e o Lucro Capitalista**: A mais-valia corresponde à quantidade de trabalho excedente realizado pelo operário que **não lhe é remunerada no salário**, sendo apropriada privadamente pelo proprietário dos meios de produção sob a forma de lucro ou acumulação de capital. Apresenta-se em duas formas: **Mais-Valia Absoluta** (quando o capitalista prolonga fisicamente as horas da jornada diária de trabalho sem pagar aumento correspondente de salário) e **Mais-Valia Relativa** (quando o capitalista introduz maquinários mais rápidos, tecnologias e automação fabril que aumentam a produtividade, barateiam as mercadorias de subsistência e reduzem o tempo de trabalho necessário para pagar o salário do operário).',
            '**A Alienação do Trabalho no Modo Capitalista**: Sob o jugo da maquinofatura e da esteira rolante, o trabalhador perde o controle cognitivo e prático sobre a totalidade do processo produtivo, executando tarefas mecânicas repetitivas e hipersubdivididas. O trabalhador **aliena-se de quatro formas**: aliena-se do produto de seu labor (que não lhe pertence), aliena-se do ato produtivo (que vira sofrimento tortuoso), aliena-se de sua essência genérica humana criativa (*Gattungswesen*) e aliena-se dos outros seres humanos, tratados como concorrentes no mercado.',
            '**Ideologia e Fetichismo da Mercadoria**: A **Ideologia** opera como um sistema ilusório e falseado de representação da realidade construído pela classe dominante, cuja função social é naturalizar a desigualdade e apresentar os interesses particulares da burguesia como se fossem o "interesse universal de toda a nação". O **Fetichismo da Mercadoria** faz com que as mercadorias pareçam possuir propriedades mágicas e valor autônomo conferido pelas forças cegas do mercado, ocultando as relações sociais reais de exploração e suor humano que tornaram possível a sua fabricação física.'
          ],
          tips: [
            'Diferença clássica no ENEM: A mais-valia absoluta intensifica o tempo de trabalho (mais horas de fábrica); a mais-valia relativa revoluciona a TECNOLOGIA e a velocidade de produção, extraindo mais riqueza do operário no mesmo número de horas.'
          ]
        },
        {
          id: 'max-weber-acao-social-dominacao',
          title: 'Max Weber: Ação Social, Tipos de Dominação e Ética Protestante',
          enemWeight: 'Muito Alta',
          summary: 'A sociologia compreensiva orientada pelo sentido subjetivo da ação social, os tipos ideais de dominação e o desencantamento racional do mundo moderno.',
          keyConcepts: [
            '**A Sociologia Compreensiva e a Ação Social**: Diferentemente de Durkheim, Weber afirma que o ponto de partida da sociologia deve ser a **Ação Social**: a conduta humana dotada de um sentido subjetivo conferido pelo próprio agente e orientada para a ação de outros indivíduos. Para sistematizar a infinita complexidade da realidade histórica, Weber concebeu a ferramenta metodológica dos **Tipos Ideais** (modelos conceituais abstratos que servem de régua comparativa para a realidade concreta).',
            '**Os Quatro Tipos Ideais de Ação Social**: 1) **Ação Racional com Relação a Fins**: orientada pelo cálculo instrumental rigoroso de meios e custos para atingir um objetivo prático deliberado (ex: o investimento financeiro para maximizar lucros); 2) **Ação Racional com Relação a Valores**: motivada pela convicção ética inegociável em um princípio moral, religioso, estético ou político supremo, independentemente das consequências adversas (ex: o ativista que se recusa a trair seus ideais sob risco de prisão); 3) **Ação Afetiva ou Emocional**: desencadeada por impulsos imediatos, paixões, ira ou afeto; 4) **Ação Tradicional**: ditada pelo hábito arraigado, pela rotina consuetudinária e pelos costumes milenares repetidos sem questionamento reflexivo.',
            '**Os Três Tipos Puros de Dominação Legítima**: O poder converte-se em dominação quando encontra obediência voluntária justificada pela crença na legitimidade: 1) **Dominação Tradicional**: baseada na reverência sagrada à autoridade costumeira herdada do passado (como os monarcas absolutistas, patriarcas familiares e líderes clânicos); 2) **Dominação Carismática**: assentada na devoção cega às qualidades extraordinárias, mágicas ou heroicas de uma personalidade fascinante (como líderes messiânicos, profetas religiosos e caudilhos políticos populistas); 3) **Dominação Racional-Legal / Burocrática**: baseada na obediência a um conjunto impessoal e abstrato de leis escritas, estatutos e normas técnicas formalmente promulgadas, modelo hegemônico do Estado moderno e das grandes corporações geridas por funcionários especializados.',
            '**A Ética Protestante e o Espírito do Capitalismo**: Weber investigou a afinidade eletiva entre a teologia calvinista e o florescimento do capitalismo moderno. A crença na predestinação divina levou os fiéis a buscarem na dedicação incansável à sua profissão terrena (**vocação**) e no sucesso econômico os sinais visíveis da bênção de Deus. A disciplina metódica aliada à recusa puritana da ostentação fútil gerou poupança continuada e reinvestimento produtivo do lucro. Denunciou que o avanço da racionalidade instrumental culminou no **Desencantamento do Mundo** (expulsão da magia e do mistério pela técnica) e na perda da liberdade humana na **"Gaiola de Ferro"** da burocracia e do cálculo contábil.'
          ],
          tips: [
            'Contraste metodológico indispensável: Durkheim estuda o indivíduo coagido de fora para dentro pelo Fato Social objetivo; Weber estuda a sociedade construída de dentro para fora a partir do sentido subjetivo que os próprios agentes atribuem às suas Ações Sociais.'
          ]
        }
      ]
    },
    {
      id: 'cultura-identidade-cidadania',
      title: 'Cultura, Antropologia, Movimentos Sociais e Cidadania',
      description: 'Etnocentrismo, relativismo cultural, patrimônio cultural, os três pilares da cidadania de Marshall e as lutas sociais contemporâneas.',
      subtopics: [
        {
          id: 'antropologia-cultura-etnocentrismo-patrimonio',
          title: 'Antropologia Cultural: Etnocentrismo, Relativismo e Patrimônio',
          enemWeight: 'Muito Alta',
          summary: 'A crítica antropológica à hierarquização racista de culturas, o respeito à diversidade identitária e a preservação do patrimônio material e imaterial.',
          keyConcepts: [
            '**Etnocentrismo e Violência Simbólica**: Visão de mundo preconceituosa que toma a cultura do próprio grupo social ou civilização como padrão universal supremo de beleza, moralidade e racionalidade, julgando e desqualificando os costumes do "outro" como inferiores, selvagens, exóticos ou primitivos. O etnocentrismo serviu de fundamento ideológico ao colonialismo europeu, à escravidão negra e ao genocídio dos povos indígenas nas Américas sob o falso pretexto da "missão civilizadora".',
            '**O Relativismo Cultural de Franz Boas**: Corrente fundadora da antropologia moderna que rejeita a escala evolucionista unilinear (selvageria-barbárie-civilização). Postula que nenhuma cultura é intrinsecamente superior ou inferior a outra: cada sociedade desenvolve respostas singulares, ricas e coerentes aos desafios da existência no tempo e no espaço, devendo seus valores e cosmovisões ser compreendidos unicamente no interior de seus próprios termos e contextos históricos específicos.',
            '**Cultura Popular, Erudita e de Massa**: A **Cultura Erudita** associa-se historicamente às elites dominantes detentoras do capital econômico e escolar (ópera, belas-artes, filosofia clássica); a **Cultura Popular** emana espontaneamente da sabedoria comunitária das classes trabalhadoras, expressando memórias e tradições orais coletivas (cordel, maracatu, carimbó, reisado); a **Cultura de Massa** é fabricada pela indústria midiática transnacional como produto descartável e padronizado para consumo passivo nas telas.',
            '**Patrimônio Cultural Material e Imaterial (IPHAN)**: O patrimônio cultural de uma nação divide-se juridicamente em: **Patrimônio Material** (bens tangíveis edificados de relevância arquitetônica, arqueológica ou artística, como os casarios barrocos de Ouro Preto e Paraty e o plano piloto de Brasília) e **Patrimônio Imaterial** (bens intangíveis constituídos por saberes ancestrais, tradições orais, práticas culinárias, festas e celebrações comunitárias, como o frevo pernambucano, a capoeira, o ofício das paneleiras de Goiabeiras, o Círio de Nazaré e o modo artesanal de fazer Queijo Minas).'
          ],
          tips: [
            'Conexão certeira no ENEM: O tombamento de um bem como patrimônio imaterial pelo IPHAN protege a memória viva de grupos historicamente subalternizados (como as baianas de acarajé ou os mestres de capoeira), legitimando o protagonismo popular na identidade nacional brasileira.'
          ]
        },
        {
          id: 'cidadania-movimentos-sociais-direitos',
          title: 'Cidadania, Direitos de Marshall e Movimentos Sociais Contemporâneos',
          enemWeight: 'Alta',
          summary: 'A conquista histórica dos direitos civis, políticos e sociais, e a atuação dos movimentos negro, indígena, feminista e camponês na ampliação democrática.',
          keyConcepts: [
            '**A Teoria da Cidadania de T.H. Marshall**: O sociólogo britânico formulou a trajetória histórica ocidental de conquista progressiva da cidadania em três dimensões cumulativas: 1) **Direitos Civis** (século XVIII: liberdade de locomoção, de expressão, de pensamento, de propriedade e direito à ampla defesa perante tribunais imparciais); 2) **Direitos Políticos** (século XIX: sufrágio universal, direito de votar e ser votado e liberdade de fundar agremiações partidárias); 3) **Direitos Sociais** (século XX: acesso público e gratuito à educação básica, saúde universal, previdência, moradia digna e trabalho com garantias mínimas, viabilizados pelo Estado de Bem-Estar Social).',
            '**A Cidadania Invertida no Brasil (José Murilo de Carvalho)**: No livro *Cidadãos e Bestializados*, o historiador demonstra que, no Brasil, a sequência de Marshall foi profundamente subvertida: os direitos sociais foram concedidos paternalisticamente pelo Estado autoritário de Getúlio Vargas na década de 1930 antes que os trabalhadores conquistassem de fato os direitos políticos plenos ou os direitos civis mais básicos, gerando um modelo de "cidadania tutelada" e concedida de cima para baixo.',
            '**O Movimento Negro e as Políticas de Ações Afirmativas**: Historicamente articulado em frentes como o Teatro Experimental do Negro (TEN) de Abdias Nascimento e o Movimento Negro Unificado (MNU em 1978), o movimento antirracista brasileiro conquistou marcos jurídicos estruturais: a tipificação do racismo como crime inafiançável e imprescritível na Constituição de 1988, a obrigatoriedade do ensino de História e Cultura Afro-Brasileira nas escolas (Lei nº 10.639/2003) e o sistema de **Cotas Raciais e Sociais nas Universidades Federais** (Lei nº 12.711/2012), fundamentadas na teoria da **Justiça Restaurativa** e na reparação de séculos de desvantagem socioeconômica estrutural.',
            '**Movimentos Indígena, Feminista e Sem-Terra (MST)**: O **Movimento Indígena** (articulado na APIB) luta pela demarcação e proteção das terras tradicionalmente ocupadas contra a tese inconstitucional do Marco Temporal; o **Movimento Feminista** combate a violência doméstica (Lei Maria da Penha e Lei do Feminicídio), denuncia a dupla jornada de trabalho feminina e a desigualdade salarial nas empresas; e o **Movimento dos Trabalhadores Rurais Sem Terra (MST)** mobiliza-se pela efetivação da **função social da terra** consagrada pela Constituição de 1988 por meio da reforma agrária popular, cooperativismo camponês e produção agroecológica de alimentos sem agrotóxicos.'
          ],
          tips: [
            'Dica de ouro para o ENEM: O conceito de cidadania ativa não se resume ao ato de depositar um voto na urna eleitoral de dois em dois anos: ela implica a constante mobilização social, a fiscalização orçamentária dos poderes públicos e a defesa intransigente dos direitos humanos e das minorias.'
          ]
        },
        {
          id: 'mundo-trabalho-precarizacao-uberizacao',
          title: 'Mundo do Trabalho Contemporâneo: Flexibilização, Precarização e Uberização',
          enemWeight: 'Alta',
          summary: 'A transição do modelo fordista para a acumulação flexível, o impacto dos algoritmos nas relações de trabalho e a sociedade do cansaço.',
          keyConcepts: [
            '**Da Rigidez Fordista à Acumulação Flexível Toyotista**: A reestruturação produtiva do capitalismo global a partir dos anos 1970 desmontou os postos de trabalho vitalícios com garantias sindicais do fordismo. O modelo de acumulação flexível impôs contratos temporários, jornadas intermitentes, terceirização irrestrita de atividades-fim e a desregulamentação das leis de proteção trabalhista (como na Reforma Trabalhista brasileira de 2017).',
            '**O Fenômeno da Uberização e o Trabalho Plataformizado**: Termo cunhado por sociólogos do trabalho (como Ricardo Antunes) para designar a nova morfologia da exploração da classe trabalhadora: a gestão algorítmica subordinada a aplicativos transnacionais (entregadores de refeição, motoristas por aplicativo e trabalhadores de microtarefas digitais). Sob o falso discurso ideológico do "empreendedorismo independente" e do "seja seu próprio patrão", esconde-se a transferência integral de todos os custos e riscos operacionais (veículo, celular, combustível, manutenção, alimentação e acidentes) para o trabalhador desprovido de qualquer amparo previdenciário, descanso remunerado ou jornada limite.',
            '**A "Sociedade do Cansaço" de Byung-Chul Han**: O filósofo contemporâneo sul-coreano diagnostica que a sociedade disciplinar de Foucault (baseada na proibição externa e no dever) foi substituída pela **Sociedade do Desempenho** (baseada no imperativo da autoeficácia e da produtividade ilimitada sob o slogan *"Yes, we can"*). O sujeito moderno tornou-se algoz e prisioneiro de si mesmo: ele se autoexplora voluntariamente na ilusão de estar conquistando a sua liberdade pessoal, culminando em epidemias crônicas de depressão, ansiedade, insônia e na síndrome de **Burnout**.'
          ],
          tips: [
            'A "Uberização" e a "Sociedade do Cansaço" são repertórios sociológicos de ponta para temas de redação que versem sobre precarização laboral, saúde mental dos trabalhadores ou o impacto das novas tecnologias no cotidiano contemporâneo.'
          ]
        },
        {
          id: 'estado-moderno-poder-democracia',
          title: 'O Estado Moderno, Poder e Democracia: De Weber aos Regimes Contemporâneos',
          enemWeight: 'Alta',
          summary: 'O monopólio do uso legítimo da força física, a soberania política, as formas de governo e os desafios da democracia participativa.',
          keyConcepts: [
            '**A Definição Weberiana do Estado Moderno**: Para Max Weber, o Estado não se define pelos seus fins, mas pelo seu meio específico e exclusivo: o **monopólio do uso legítimo da força física** (da violência legítima) no interior de um determinado território delimitado. Sem a capacidade soberana de fazer valer as suas leis pelas armas da polícia e do judiciário contra a anarquia privada, a própria instituição estatal se desintegra.',
            '**Poder versus Dominação (Herrschaft)**: Enquanto o **Poder** consiste na probabilidade de impor a própria vontade em uma relação social mesmo contra resistências (pela mera coação física ou ameaça), a **Dominação** implica a probabilidade de encontrar obediência a um mandato específico fundamentada na crença dos dominados em sua legitimidade (racional-legal, tradicional ou carismática).',
            '**Democracia Representativa, Participativa e Deliberativa**: Na **Democracia Representativa**, os cidadãos transferem periodicamente a tomada de decisões políticas a parlamentares e governantes eleitos pelo sufrágio universal. Na **Democracia Participativa**, a sociedade civil intervém diretamente nas decisões estatais através de instrumentos constitucionais (plebiscitos, referendos, iniciativa popular de leis, conselhos municipais e orçamentos participativos). Na **Democracia Deliberativa** (Habermas), a legitimidade das decisões públicas emana do debate livre, racional e transparente entre cidadãos informados na esfera pública.',
            '**Regimes Políticos: Democracia, Autoritarismo e Totalitarismo**: A **Democracia** assenta-se na alternância pacífica do poder, no pluripartidarismo, no Estado de Direito e no respeito irrestrito às liberdades individuais e minorias. O **Autoritarismo** suprime eleições livres ou cerceia as oposições, governando pela coerção militar ou policial, mas ainda permite certas esferas de vida privada ou religiosa não subordinadas ao líder. O **Totalitarismo** (nazismo, stalinismo) vai muito além: destrói completamente qualquer fronteira entre Estado e vida privada, exigindo a mobilização ideológica fanática de toda a população através do terror policial e do culto ao líder supremo.'
          ],
          tips: [
            'Destaque no ENEM: A Constituição Cidadã de 1988 consagrou o Brasil como um Estado Democrático de Direito e combinou mecanismos representativos (voto periódico) com instrumentos participativos diretos (plebiscito, referendo e ação popular).'
          ]
        }
      ]
    },
    {
      id: 'pensamento-social-brasileiro-contemporaneo',
      title: 'Pensamento Social Brasileiro, Estratificação e Teoria Crítica',
      description: 'Os grandes intérpretes da formação nacional, a estratificação social, o racismo estrutural e a modernidade líquida.',
      subtopics: [
        {
          id: 'interpretes-brasil-racismo-estrutural',
          title: 'Intérpretes da Formação Brasileira: Freyre, Sérgio Buarque, Florestan e Lélia Gonzalez',
          enemWeight: 'Alta',
          summary: 'A desmontagem sociológica do mito da cordialidade e da democracia racial e a consolidação do feminismo negro interseccional.',
          keyConcepts: [
            '**Gilberto Freyre e o Mito da Democracia Racial**: Em *Casa-Grande & Senzala* (1933), Freyre inovou ao afastar o determinismo racial biológico eurocêntrico, afirmando que a força e a plasticidade do Brasil residiam na mestiçagem cultural entre portugueses, indígenas e africanos. Todavia, sua narrativa romantizou as relações de dominação escravista no Nordeste açucareiro, servindo de base ideológica para a formulação do **Mito da Democracia Racial**: a crença falaciosa de que o Brasil desfrutava de uma convivência étnica harmoniosa, fraterna e desprovida do ódio e da segregação racial aberta vista nos EUA ou no apartheid sul-africano.',
            '**Sérgio Buarque de Holanda e o "Homem Cordial"**: Em *Raízes do Brasil* (1936), o historiador analisa os legados da colonização portuguesa na formação de nossa subjetividade política. O conceito sociológico de **Homem Cordial** (derivado do latim *cor, cordis*, coração) designa a incapacidade crônica de o indivíduo brasileiro operar segundo a impessoalidade burocrática abstrata das leis modernas: o homem cordial rege todas as suas relações públicas pelo afeto, pela intimidade familiar e pelo compadrio. Isso gera o **patrimonialismo** (a indistinção perversa entre o patrimônio público do Estado e os interesses privados dos governantes) e a naturalização do nepotismo e do "jeitinho".',
            '**Florestan Fernandes e o Racismo Estrutural**: Em *A Integração do Negro na Sociedade de Classes* (1965), Fernandes demoliu cientificamente o mito da democracia racial com sólida pesquisa empírica na metrópole paulistana. Demonstrou que a abolição da escravidão em 1888 não integrou o ex-escravizado como cidadão pleno, mas o abandonou às margens da economia de mercado sem terras, moradia ou instrução escolar, ao mesmo tempo em que o Estado financiava a imigração europeia branca ("ideologia do branqueamento"). Assim, o racismo no Brasil opera como uma engrenagem de dominação de classe que perpetua a miséria e a violência policial concentradas sobre a população negra.',
            '**Lélia Gonzalez e a Interseccionalidade na Améfrica Ladina**: Intelectual fundamental do feminismo negro brasileiro, formulou o conceito de **Améfrica Ladina** para combater a colonização eurocêntrica do saber acadêmico e resgatar o protagonismo da linguagem e da cultura afro-ameríndia no cotidiano do povo brasileiro (o "pretuguês"). Denunciou que as mulheres negras ocupam a base mais vulnerável da pirâmide social brasileira, sofrendo a violência combinada (**interseccional**) do racismo, do machismo e da exploração econômica de classe.'
          ],
          tips: [
            'Cuidado com a pegadinha clássica do ENEM: O "Homem Cordial" de Sérgio Buarque NÃO significa homem bonzinho ou educado! Significa que suas decisões são governadas pelas emoções e pelo coração, podendo ir da amabilidade acolhedora à violência assassina mais passional sem passar pelo crivo da razão cívica impessoal.'
          ]
        },
        {
          id: 'estratificacao-desigualdades-mobilidade',
          title: 'Estratificação Social, Desigualdades e Mobilidade: Castas, Estamentos e Classes',
          enemWeight: 'Alta',
          summary: 'Os modelos históricos de diferenciação social, a mobilidade social vertical e horizontal, e as dimensões socioeconômicas e interseccionais.',
          keyConcepts: [
            '**Modelos Históricos de Estratificação Social**: Estratificação é a forma como os indivíduos e grupos sociais são classificados e hierarquizados em uma sociedade. Divide-se historicamente em três sistemas fundamentais: 1) **Castas** (sociedade rigidamente fechada, fundamentada na religião tradicional, pureza ritual e hereditariedade biológica intransponível, como na Índia védica tradicional; a posição é definitiva ao nascer e a endogamia impede casamentos entre castas); 2) **Estamentos ou Ordens** (típico do feudalismo medieval e do Antigo Regime europeu; a posição de nobre, clérigo ou servo é fixada juridicamente pelo nascimento ou ordenação religiosa, com mobilidade restrita); 3) **Classes Sociais** (próprio das sociedades capitalistas modernas; fundamentado na posição socioeconômica, na posse de riqueza, propriedade e na ocupação no mercado de trabalho; sistema teoricamente aberto que prevê mobilidade social legal).',
            '**Mobilidade Social: Vertical e Horizontal**: A **Mobilidade Vertical** ocorre quando o indivíduo altera sua posição na pirâmide socioeconômica, podendo ser **Ascendente** (quando sobe de classe ou estrato de renda) ou **Descendente** (quando empobrece ou perde status). A **Mobilidade Horizontal** ocorre quando o indivíduo muda de ocupação, cargo ou cidade sem alterar sua posição de classe (ex: mudar de uma profissão para outra que oferece a mesma faixa salarial e prestígio). Pode ser analisada como **Intrageracional** (durante o curso da própria vida do sujeito) ou **Intergeracional** (comparando a posição do indivíduo com a de seus pais).',
            '**Métricas de Desigualdade e Coeficiente de Gini**: A desigualdade na distribuição de renda é quantificada internacionalmente pelo **Coeficiente de Gini**, que varia de 0 (igualdade matemática perfeita, onde todos recebem a mesma renda) a 1 (desigualdade máxima, onde um único indivíduo concentra toda a riqueza). O Brasil historicamente figura entre os países com maior índice de Gini do planeta, reflexo da concentração fundiária arcaica, do passado colonial escravista e de um sistema tributário regressivo que tributa proporcionalmente mais o consumo dos pobres do que a renda e o patrimônio dos super-ricos.',
            '**Interseccionalidade e Desigualdades Estruturais**: As desigualdades contemporâneas não são unicamente de classe econômica. O conceito de **Interseccionalidade** (desenvolvido por juristas e sociólogas como Kimberlé Crenshaw e Lélia Gonzalez) demonstra como marcadores sociais de opressão — **classe, raça, gênero, orientação sexual e território periférico** — operam de maneira entrelaçada e simultânea, potencializando a vulnerabilidade de populações marginalizadas.'
          ],
          tips: [
            'No ENEM, questões sobre desigualdade frequentemente abordam a falácia da meritocracia irrestrita: sem igualdade real de pontos de partida (educação pública de qualidade, saneamento, nutrição básica e estabilidade familiar), a mobilidade social ascendente torna-se uma exceção estatística e não uma regra geral.'
          ]
        },
        {
          id: 'industria-cultural-modernidade-liquida',
          title: 'Teoria Crítica e Modernidade Líquida: Adorno, Bauman e Pierre Bourdieu',
          enemWeight: 'Alta',
          summary: 'A alienação estética na Indústria Cultural, os laços humanos descartáveis no hiperconsumismo e a reprodução do capital simbólico.',
          keyConcepts: [
            '**A Indústria Cultural de Theodor Adorno e Max Horkheimer**: Os filósofos da Escola de Frankfurt denunciam como a cultura contemporânea foi sequestrada pela lógica de mercado: obras de arte e manifestações culturais transformaram-se em **produtos de consumo estandardizados** e pasteurizados para saciar o mercado e garantir lucro financeiro. O objetivo social da indústria do entretenimento fácil e repetitivo é adormecer o pensamento crítico emancipador, promovendo o conformismo social e a submissão voluntária dos trabalhadores à rotina opressiva das fábricas e escritórios.',
            '**A "Modernidade Líquida" de Zygmunt Bauman**: O sociólogo polonês diagnostica a transição contemporânea da fase "sólida" da modernidade (estruturada em empregos estáveis de longo prazo, casamentos duradouros e partidos políticos sólidos) para a fase "líquida", caracterizada pela volatilidade, incerteza crônica, privatização do medo e pela fragilidade dos vínculos afetivos e comunitários. Em uma cultura de consumo descartável e acelerado, os indivíduos tratam as amizades, os relacionamentos amorosos e os próprios seres humanos como mercadorias obsolescentes que podem ser descartadas e substituídas ao menor sinal de aborrecimento.',
            '**Pierre Bourdieu: Violência Simbólica e os Quatro Capitais**: O sociólogo francês desmonta o mito da meritocracia escolar e social ao formular os conceitos de: **Capital Econômico** (dinheiro, patrimônio, renda), **Capital Social** (rede influente de contatos pessoais e profissionais de prestígio), **Capital Cultural** (diplomas acadêmicos, erudição literária, fluência em idiomas estrangeiros e domínio da norma culta) e **Capital Simbólico** (prestígio, renome e honra social). A escola republicana tradicional comete **Violência Simbólica**: ela não é neutra, pois valoriza e recompensa o capital cultural herdado naturalmente pelos filhos das classes dominantes em suas famílias ricas, disfarçando o privilégio de classe sob a ilusão do "mérito ou talento individual".'
          ],
          tips: [
            'Conceito coringa para redações nota 1000 no ENEM: A **Violência Simbólica** de Bourdieu é exercida sem coerção física direta, operando com a cumplicidade involuntária do próprio dominado, que internalizou as regras e juízos dos grupos dominantes como se fossem a ordem "natural" das coisas.'
          ]
        }
      ]
    }
  ]
};
