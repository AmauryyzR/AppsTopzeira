import { Discipline } from '../../../types/curriculum';

export const filosofia: Discipline = {
  id: 'filosofia',
  name: 'Filosofia',
  description: 'Ética, epistemologia, teoria do conhecimento, filosofia política clássica e moderna, teoria crítica e existencialismo.',
  topics: [
    {
      id: 'filosofia-antiga-medieval',
      title: 'Filosofia Antiga e Medieval: Do Logos à Fé Racional',
      description: 'A passagem do mito ao logos, a busca da verdade em Sócrates e Platão, a ética aristotélica e a síntese fé-razão medieval.',
      subtopics: [
        {
          id: 'socrates-platao-aristoteles',
          title: 'A Tríade Clássica: Sócrates, Platão e Aristóteles',
          enemWeight: 'Muito Alta',
          summary: 'Os pilares do pensamento ocidental sobre ética, conhecimento verdadeiro, dualismo ontológico e a organização política da pólis.',
          keyConcepts: [
            '**Sócrates e o Método Dialético**: A filosofia socrática inaugurou o período antropológico voltado para a reflexão ética e o autoconhecimento ("conhece-te a ti mesmo"). Seu método dialético estrutura-se em duas etapas interdependentes: a **Ironia** (desconstrução das falsas certezas e preconceitos do interlocutor através de perguntas sucessivas até fazê-lo admitir a própria ignorância: "só sei que nada sei") e a **Maiêutica** (o parto das ideias, no qual o filósofo auxilia o cidadão a dar à luz conceitos éticos universais como a justiça, a coragem e a virtude que residem na própria alma racional).',
            '**Platão e a Teoria das Formas (Dualismo Ontológico)**: Divisão radical da realidade em duas instâncias: o **Mundo Sensível** (material, mutável, perecível e ilusório, apreendido pelos sentidos corporais) e o **Mundo Inteligível** (onde habitam as Formas ou Ideias perfeitas, eternas e imutáveis, acessíveis unicamente pelo intelecto puro). Na célebre **Alegoria da Caverna** (*A República*), Platão ilustra a jornada da alma humana que se liberta das correntes da ignorância e das sombras sensíveis em direção à contemplação da luz do Bem e da verdade. Na política, propôs a **Sofocracia**: a cidade ideal justa deve ser governada não por demagogos populistas, mas pelo **Rei-Filósofo**, cuja alma racional domina as paixões inferiores.',
            '**Aristóteles e a Ética da Justa Medida (Eudaimonia)**: Crítica ao idealismo platônico: a essência das coisas não reside em um mundo transcendente separado, mas na própria matéria concreta apreendida empiricamente pelos sentidos. Para Aristóteles, o objetivo supremo da existência humana é a **Eudaimonia** (felicidade plena alcançada pela excelência moral e racional). A virtude ética (*areté*) reside na **Justa Medida** (*Aurea Mediocritas*), o equilíbrio racional equidistante entre os vícios do excesso e da falta (por exemplo, a coragem é a justa medida entre a covardia e a temeridade imprudente), cultivada cotidianamente através do **hábito**. Definiu o ser humano como um **Zoon Politikon** (animal político), cuja plenitude ética só pode ser desenvolvida no interior da vida comunitária e das leis da pólis.'
          ],
          tips: [
            'Diferença clássica no ENEM: A ética platônica é intelectualista (conhecer o Bem leva necessariamente a praticá-lo); a ética aristotélica é prática e fundada no HÁBITO social (a virtude se aprende agindo virtuosamente na convivência cidadã repetida).'
          ]
        },
        {
          id: 'helenismo-epicurismo-estoicismo',
          title: 'Filosofia Helenística: Estoicismo, Epicurismo e Ceticismo',
          enemWeight: 'Média',
          summary: 'A busca pela tranquilidade interior da alma (ataraxia) diante da dissolução da autonomia política das pólis gregas.',
          keyConcepts: [
            '**Contexto de Ruptura Helenística**: Com a expansão do Império Macedônio de Alexandre, o Grande, os gregos deixaram de ser cidadãos deliberativos da pólis para tornarem-se súditos de um vasto império multicultural cosmopolita. A filosofia abandonou a reflexão coletiva da pólis para focar na ética do indivíduo e na busca pela paz de espírito e salvação interior.',
            '**O Estoicismo e o Controle da Vontade**: Fundado por Zenão de Cítio e consagrado por pensadores romanos como **Sêneca**, **Epicteto** e o imperador **Marco Aurélio**, defende que o universo é regido por uma Razão Cósmica imanente (**Logos**). A sabedoria reside em fazer uma rigorosa distinção ética entre aquilo que depende de nós (nossos julgamentos, desejos, caráter e atitudes morais) e aquilo que não depende de nós (a opinião dos outros, as riquezas, as enfermidades e a morte inevitável). Cultivam a impassibilidade serena perante as tempestades da vida (**apatheia**), alcançando a imperturbabilidade da alma (**ataraxia**).',
            '**O Epicurismo e o Prazer Moderado**: Epicuro de Samos propôs que o objetivo da vida é a conquista da felicidade terrena por meio da libertação da dor física (**aponia**) e da ausência de ansiedades e angústias existenciais (**ataraxia**). Classificou os desejos humanos em: naturais e necessários (amizade, água pura, alimento simples e filosofia); naturais e não-necessários (comidas refinadas e luxos); e não-naturais e desnecessários (sede de poder político, riqueza ilimitada e glória mundana, fontes certas de sofrimento). Combateu os dois maiores pavores humanos: o medo dos castigos dos deuses e o pavor da morte ("quando nós existimos, a morte não está presente; e quando a morte se faz presente, nós já não existimos").',
            '**O Ceticismo Pirrônico**: Fundado por Pirro de Élis, sustentava que os sentidos e a razão humana são incapazes de alcançar a verdade objetiva indubitável das coisas. Diante das infinitas contradições entre as doutrinas filosóficas rivais, o sábio cético pratica a suspensão radical de juízo (**epoché**), abstendo-se de afirmações dogmáticas e conquistando assim a serenidade mental.'
          ],
          tips: [
            'No ENEM, o estoicismo é frequentemente conectado a problemas de saúde mental contemporâneos (ansiedade e pressão social): o estoico ensina a não sofrer por antecipação por acontecimentos externos incontroláveis, concentrando a energia psíquica naquilo que está sob seu controle.'
          ]
        },
        {
          id: 'filosofia-medieval-agostinho-tomas',
          title: 'Filosofia Medieval: Patrística de Santo Agostinho e Escolástica de São Tomás de Aquino',
          enemWeight: 'Baixa',
          summary: 'A articulação entre a fé cristã revelada e a razão filosófica clássica greco-romana na Idade Média.',
          keyConcepts: [
            '**A Patrística e Santo Agostinho de Hipona**: Período de fundação e defesa teológica da Igreja cristã primitiva contra as heresias pagãs. Fortemente influenciado pelo platonismo, Agostinho postulou a íntima colaboração entre a fé e a razão ("creio para compreender e compreendo para crer"). Formulou a **Teoria da Iluminação Divina**: a mente humana finita só é capaz de apreender as verdades eternas universais porque é iluminada diretamente pela luz imaterial de Deus. Diante do problema da existência do mal em um mundo criado por um Deus sumamente bom, Agostinho solucionou a questão afirmando que **o mal não possui substância própria**: o mal é a mera ausência ou privação do bem, decorrente do mau uso do **livre-arbítrio** pelo ser humano.',
            '**A Escolástica e São Tomás de Aquino**: Desenvolvida nas primeiras universidades medievais no século XIII, a Escolástica representou o apogeu da reflexão teológico-filosófica cristã. Tomás de Aquino promoveu a monumental síntese entre a doutrina cristã e a filosofia racionalista de Aristóteles, afirmando que a razão natural e a fé sobrenatural não entram em contradição real, pois ambas emanam da mesma fonte divina. Em sua obra-prima (*Suma Teológica*), elaborou as célebres **Cinco Vias da Existência de Deus**: demonstrações lógicas *a posteriori* que partem da observação dos efeitos materiais no mundo sensível para provar a necessidade de uma causa primeira transcendente (Primeiro Motor Imóvel, Causa Primeira Eficiente, Ser Necessário, Graus de Perfeição e Causa Final/Ordem Teleológica do universo).'
          ],
          tips: [
            'Síntese mnemônica do ENEM: Santo Agostinho cristianizou **Platão** (iluminação divina, primazia da alma sobre o corpo); São Tomás de Aquino cristianizou **Aristóteles** (observação da natureza física para demonstrar a existência de Deus pelas Cinco Vias).'
          ]
        }
      ]
    },
    {
      id: 'teoria-do-conhecimento-moderna',
      title: 'Teoria do Conhecimento Moderna e Filosofia da Ciência',
      description: 'O embate entre Racionalismo e Empirismo, a dúvida metódica cartesiana, a síntese kantiana e a demarcação científica contemporânea.',
      subtopics: [
        {
          id: 'racionalismo-empirismo-cartesiano',
          title: 'A Gênese da Epistemologia Moderna: Racionalismo Cartesiano vs. Empirismo Inglês',
          enemWeight: 'Alta',
          summary: 'A busca pelo método científico seguro para fundamentar a ciência moderna na Idade da Razão.',
          keyConcepts: [
            '**René Descartes e o Racionalismo Dogmático**: Considerado o fundador da filosofia moderna, Descartes buscou um fundamento absolutamente seguro e indubitável para a ciência. Utilizou o método da **Dúvida Hiperbólica / Metódica**: duvidar sistematicamente de tudo o que possa suscitar a menor suspeita de incerteza (os dados enganosos dos sentidos corporais, a confusão entre o sonho e a vigília, e a hipótese do "Gênio Maligno"). Ao duvidar de tudo, percebeu que não podia duvidar do próprio ato de estar duvidando, isto é, de estar pensando. Daí a formulação da verdade primeira autoevidente: **"Penso, logo existo"** (*Cogito, ergo sum*). Postulou o dualismo de substâncias entre a mente pensante (*res cogitans*) e a matéria corpórea mecânica (*res extensa*), sustentando a existência de **ideias inatas** gravadas na mente por Deus.',
            '**O Empirismo Inglês (Locke, Bacon e Hume)**: Corrente filosófica que rejeita terminantemente as ideias inatas, asseverando que todo o conhecimento humano origina-se exclusivamente na experiência sensível e na experimentação concreta. **John Locke** comparou a mente humana ao nascer a uma folha em branco ou tábula rasa (*tabula rasa*), onde a experiência sensorial e a reflexão inscrevem gradativamente todas as ideias.',
            '**David Hume e o Ceticismo Causal**: Radicalizou o empirismo britânico ao demonstrar que as relações de causa e efeito não são verdades lógicas necessárias nem podem ser deduzidas a priori da natureza. Quando vemos uma bola de bilhar bater em outra, nossos olhos observam apenas uma sucessão temporal de dois movimentos contíguos no espaço, e não a força oculta da causalidade. Nossa crença inabalável de que o futuro sempre repetirá o passado (ex: que o Sol necessariamente nascerá amanhã) apoia-se unicamente no **hábito psicológico** e no costume da repetição constante.'
          ],
          tips: [
            'Contraste central no ENEM: Para os racionalistas (Descartes), a razão dedutiva pura é a fonte exclusiva da certeza universal; para os empiristas (Locke e Hume), nada existe na mente humana que não tenha passado previamente pelos sentidos corporais.'
          ]
        },
        {
          id: 'critica-kantiana-imperativo-categorico',
          title: 'Immanuel Kant: A Revolução Copernicana na Epistemologia e a Ética do Dever',
          enemWeight: 'Alta',
          summary: 'A superação crítica do racionalismo e empirismo com o Idealismo Transcendental e a universalidade moral do Imperativo Categórico.',
          keyConcepts: [
            '**O Idealismo Transcendental e a Síntese Crítica**: Diante da oposição estéril entre racionalistas e o ceticismo de Hume (que "o despertou de seu sono dogmático"), Kant realizou a **Revolução Copernicana na Filosofia**: em vez de o sujeito moldar passivamente o seu conhecimento ao objeto exterior, é o objeto que deve regular-se pelas estruturas cognitivas a priori da subjetividade humana. Formulou que "pensamentos sem conteúdo sensível são vazios; intuições sensíveis sem conceitos são cegas". O ser humano só conhece os fenômenos (a realidade filtrada pelas formas a priori da sensibilidade: espaço e tempo, e pelas categorias do entendimento), sendo vedado o acesso à coisa-em-si (**númeno**).',
            '**A Deontologia Kantiana (A Moral do Dever Puro)**: A ética kantiana é formal, racional e rigorosamente contrária a qualquer cálculo pragmático de utilidade ou consequência. Uma ação só possui legítimo valor moral se for praticada exclusivamente por **dever**, por puro respeito à lei moral racional, e não motivada por inclinações afetivas, simpatia, compaixão, medo de punições penais ou expectativa de recompensa.',
            '**As Formulações do Imperativo Categórico**: Mandamento ético universal incondicional da razão prática pura: 1) **Lei Universal**: *"Age apenas segundo uma máxima tal que possas ao mesmo tempo querer que ela se torne uma lei universal"*; se a ação não resistir ao teste da universalização lógica sem contradizer a si própria (exemplo: mentir para conseguir um empréstimo), ela é moralmente repudiável; 2) **Princípio da Dignidade Humana**: *"Age de tal maneira que trates a humanidade, tanto na tua pessoa como na de qualquer outro, sempre como um FIM em si mesmo e NUNCA apenas como um MEIO/instrumento"*. As coisas possuem preço no mercado, mas o ser humano possui **dignidade inegociável**.',
            '**O Esclarecimento (Aufklärung) e a Maioridade**: Em seu ensaio célebre, Kant define o Iluminismo como a saída da humanidade de seu estado de menoridade culpada. Menoridade é a incapacidade de servir-se do próprio entendimento sem a tutela autoritária de outrem (um padre, um médico, um livro sagrado). O lema emancipador da modernidade é **Sapere Aude!** (Ouse saber! Tenha a coragem de pensar por ti mesmo!).'
          ],
          tips: [
            'Kant contrapõe-se frontalmente ao Utilitarismo de Jeremy Bentham e John Stuart Mill: enquanto os utilitaristas pregam que a moralidade de uma ação reside em suas consequências úteis (a maior felicidade para o maior número de indivíduos), para Kant a dignidade humana não pode ser sacrificada em nome do bem-estar da maioria sob hipótese alguma.'
          ]
        },
        {
          id: 'filosofia-da-ciencia-popper-kuhn',
          title: 'Filosofia da Ciência: Karl Popper, Thomas Kuhn e o Estatuto da Verdade Científica',
          enemWeight: 'Alta',
          summary: 'O critério da falseabilidade contra o indutivismo, as revoluções científicas por mudança de paradigma e a crítica ao dogmatismo contemporâneo.',
          keyConcepts: [
            '**A Crítica ao Indutivismo e o Critério de Demarcação (Karl Popper)**: Popper demonstrou que nenhuma quantidade finita de observações empíricas pode provar definitivamente a verdade universal de uma lei científica (o famoso problema dos "cisnes brancos": mesmo que tenhamos observado um milhão de cisnes brancos, isso não garante a verdade de que "todos os cisnes são brancos", pois basta o avistamento de um único cisne negro para refutar a afirmação). Diante disso, Popper estabeleceu a **Falseabilidade (Refutabilidade)** como o verdadeiro critério de demarcação entre ciência legítima e pseudociência. Uma teoria só é genuinamente científica se for passível de ser testada e refutada por experimentos ou observações concretas; teorias que explicam tudo e são imunes a erros empíricos (como a astrologia) não são científicas.',
            '**O Conhecimento Científico como Conjectural e Provisório**: Para Popper, a ciência nunca atinge a posse absoluta ou dogmática da Verdade imutável. A ciência avança por **conjecturas e refutações**: propõe-se uma hipótese arrojada que é submetida a testes rigorosos de falseação; enquanto sobrevive aos testes, a teoria permanece como a melhor explicação provisória disponível.',
            '**Thomas Kuhn e a Estrutura das Revoluções Científicas**: Em contraposição à visão positivista de que a ciência progride de forma linear e cumulativa contínua, Kuhn introduziu o conceito de **Paradigma Científico**: o conjunto compartilhado de teorias, normas, métodos e valores metafísicos aceitos pela comunidade científica de uma época (como a mecânica newtoniana ou a teoria heliocêntrica). Durante o período de **Ciência Normal**, os cientistas dedicam-se a resolver quebra-cabeças sob as regras do paradigma hegemônico.',
            '**Anomalias, Crise de Paradigma e Incomensurabilidade**: Quando anomalias recorrentes e inexplicáveis se acumulam e não podem mais ser ignoradas, instala-se um estado de **Crise**. Emerge então uma **Revolução Científica**, marcada por uma **Mudança de Paradigma** (como a passagem da física clássica de Newton para a relatividade de Einstein e a mecânica quântica). Kuhn afirma que diferentes paradigmas são **incomensuráveis** (não partilham de uma régua comum neutra), pois cada um reconfigura o próprio modo como os cientistas enxergam o mundo.'
          ],
          tips: [
            'Aplicação direta no ENEM: A filosofia da ciência combate o dogmatismo e o negacionismo científico contemporâneo. A ciência não é dogmática nem é apenas uma "opinião qualquer": suas teorias passam por testes empíricos rigorosos e refutações sistemáticas que conferem confiabilidade epistemológica.'
          ]
        }
      ]
    },
    {
      id: 'filosofia-politica-contemporanea',
      title: 'Filosofia Política, Existencialismo e Teoria Crítica',
      description: 'Maquiavel e o poder do Estado, o contratualismo social, a crítica nietzschiana, o existencialismo e os pensadores contemporâneos.',
      subtopics: [
        {
          id: 'maquiavel-politica-moderna',
          title: 'Nicolau Maquiavel: Autonomia da Política, Virtù e Fortuna',
          enemWeight: 'Alta',
          summary: 'O nascimento da ciência política moderna: a separação entre moral cristã e poder de Estado, o realismo político e a estabilidade civil.',
          keyConcepts: [
            '**Rompimento com o Idealismo Clássico e a Veritá Effettuale**: Até Maquiavel, pensadores clássicos (Platão, Aristóteles, Santo Agostinho e São Tomás de Aquino) subordinavam a política à moral religiosa ou à busca ideal da Cidade Perfeita. Em *O Príncipe* (1513), Maquiavel opera uma revolução metodológica ao fundar a política moderna sobre a **"verdade efetiva das coisas"** (*veritá effettuale*), isto é, como a política e os homens realmente operam no mundo concreto e não como deveriam idealmente agir.',
            '**A Dialética entre Virtù e Fortuna**: A ação política eficaz resulta do equilíbrio dinâmico entre duas forças primordiais: a **Fortuna** (as circunstâncias imprevisíveis do destino, a sorte, o acaso ou as catástrofes históricas, comparada por Maquiavel a um rio impetuoso que inunda as planícies) e a **Virtù** (a sagacidade prática, coragem, flexibilidade tática, determinação e inteligência estratégica do governante para construir diques e canais preventivos antes que as águas transbordem). Ter *virtù* não significa ser um homem caridoso no sentido cristão, mas ter competência prática para antecipar crises e manter o controle da pólis.',
            '**A Autonomia da Esfera Política e a Razão de Estado**: A política possui suas próprias leis autônomas, distintas da moral privada e religiosa. Enquanto o cidadão comum deve prezar pela honestidade incondicional, o príncipe tem como dever supremo a **manutenção do poder** e a **preservação da paz e coesão da ordem social**. Se for indispensável mentir, romper alianças ou usar da força para evitar a destruição civil, o governante não pode hesitar. A célebre frase apócrifa "os fins justificam os meios" sintetiza a ideia de que o sucesso da preservação do Estado e do bem coletivo é o critério que legitima as medidas estatais duras.',
            '**Ser Amado versus Ser Temido**: Maquiavel adverte que o ideal seria ser simultaneamente amado e temido; porém, diante da natureza inconstante e ingrata dos seres humanos, que facilmente traem o afeto por interesse pessoal quando surge o perigo, **é infinitamente mais seguro ser temido do que amado**, desde que o príncipe evite a todo custo ser **odiado** (não confiscando os bens patrimoniais nem violando as famílias de seus súditos).'
          ],
          tips: [
            'Pegadinha recorrente no ENEM: Maquiavel NÃO faz apologia da crueldade sádica e gratuita. A força violenta só pode ser usada em doses precisas e imediatas para estancar o caos, pois a tirania cega que gera o ódio da população inevitavelmente precipita a ruína do próprio governante.'
          ]
        },
        {
          id: 'contratualismo-hobbes-locke-rousseau',
          title: 'Os Contratualistas: Thomas Hobbes, John Locke e Jean-Jacques Rousseau',
          enemWeight: 'Muito Alta',
          summary: 'A transição do Estado de Natureza para a Sociedade Política e a fundamentação racional da soberania estatal e dos direitos civis.',
          keyConcepts: [
            '**Thomas Hobbes e o Leviatã Absolutista**: Em sua obra *Leviatã*, Hobbes postula que no Estado de Natureza pré-social impera a igualdade de forças combinada à escassez de recursos e ao medo recíproco constante, resultando na *"guerra de todos contra todos"* (*bellum omnium contra omnes*) e na constatação antropológica de que *"o homem é o lobo do homem"* (*homo homini lupus*). A vida natural é "solitária, pobre, sórdida, embrutecida e curta". Para resguardar a própria vida biológica e a segurança física, os homens renunciam racionalmente a toda a sua liberdade irrestrita mediante um contrato de submissão, outorgando o monopólio exclusivo e irrevogável da força e da espada ao Estado Soberano (**Leviatã**).',
            '**John Locke e o Estado Liberal de Direito**: No *Segundo Tratado sobre o Governo Civil*, Locke assevera que no estado de natureza os indivíduos já desfrutam de **Direitos Naturais inalienáveis** outorgados por Deus: a vida, a liberdade corporal e a **propriedade privada** (legitimada e gerada pelo esforço e trabalho individual do homem sobre a terra). O contrato social nasce não para criar novos direitos, mas para instituir um governo civil imparcial capaz de arbitrar litígios e salvaguardar as liberdades e as propriedades contra invasões. Caso o governante abuse de suas prerrogativas e viole as leis naturais, a sociedade tem o legítimo **Direito de Resistência** para destituir o tirano.',
            '**Jean-Jacques Rousseau e a Soberania Popular**: Em *Do Contrato Social* e no *Discurso sobre a Origem da Desigualdade*, Rousseau formula o mito do **"bom selvagem"**: no estado natural original, o homem vivia em paz, harmonia com o meio e liberdade absoluta, guiado pela compaixão natural. A degeneração moral, os conflitos e a escravidão nasceram no instante fatídico em que o primeiro homem cercou um pedaço de terra comunal e afirmou: *"isto é meu"*, fundando a propriedade privada. Para refundar a sociedade em bases justas, propõe um pacto democrático onde cada cidadão se subordina integralmente à **Vontade Geral** coletiva, tornando a soberania popular inalienável e indivisível.'
          ],
          tips: [
            'Quadro comparativo definitivo do ENEM: Hobbes fundamenta a legitimidade do poder Absoluto contra a anarquia caótica; Locke concebe a doutrina do Estado Liberal limitado à proteção da propriedade e liberdades individuais; Rousseau fundamenta a Democracia Direta e a soberania inalienável do povo.'
          ]
        },
        {
          id: 'nietzsche-critica-moral-niilismo',
          title: 'Friedrich Nietzsche: Crítica à Metafísica Ocidental, Niilismo e Vontade de Poder',
          enemWeight: 'Média',
          summary: 'A demolição dos valores transcendentes, a genealogia da moral dos escravos, a morte de Deus e a afirmação radical da vida.',
          keyConcepts: [
            '**A Morte de Deus e o Diagnóstico do Niilismo**: Com a famosa proclamação "Deus está morto", Nietzsche não anuncia a morte física de uma entidade, mas constata o declínio histórico da crença na Metafísica, nos absolutos transcendentais e na moral cristã que sustentaram a civilização ocidental por dois milênios. O desmoronamento desses valores objetivos universais conduz ao **Niilismo**: a perda de sentido e desorientação existencial que acomete o homem moderno.',
            '**Genealogia da Moral: Senhores versus Escravos**: Nietzsche investiga a origem histórica dos valores morais, demonstrando que a moral socrático-cristã resultou de uma "rebelião de ressentimento dos escravos". A **Moral dos Senhores** (antiga nobreza guerreira pagã) celebrava a força física, a beleza, a coragem e a afirmação triunfal dos instintos vitais; a **Moral dos Escravos** (dos fracos e oprimidos), movida por ressentimento e impotência, inverteu esses valores, santificando a fraqueza, a humildade servil, o sofrimento e a resignação como "virtudes", castrando as potências criadoras do ser humano.',
            '**Apolo versus Dionísio e a Vontade de Poder**: A tragédia grega arcaica expressava a perfeição estética pela harmonia entre o princípio **Apolíneo** (da forma geométrica, ordem racional, equilíbrio e luz) e o princípio **Dionisíaco** (da embriaguez mística, pulsão vital instintiva, desmedida e caos criador). A filosofia de Sócrates assassinou a dimensão dionisíaca ao subordinar toda a vida à razão abstrata. Nietzsche propõe o resgate da **Vontade de Poder** (*Wille zur Macht*): a pulsão vital ontológica de superação, criação de novos valores e autoafirmação.',
            '**O Eterno Retorno, Amor Fati e o Além-do-Homem (Übermensch)**: O pensamento do **Eterno Retorno** opera como o teste ético definitivo: viver de tal modo que você desejaria reviver cada instante de sua vida infinitas vezes. O **Amor Fati** (amor ao destino) expressa a aceitação incondicional e jubiloso abraço a tudo o que acontece, inclusive às dores e tragédias constitutivas da existência. O **Übermensch** (Além-do-Homem) é o indivíduo emancipa-se das amarras do rebanho moralista, superando o niilismo e tornando-se legislador soberano de seus próprios valores.'
          ],
          tips: [
            'Atenção para não errar no ENEM: O conceito de "Übermensch" (Super-Homem ou Além-do-Homem) de Nietzsche NÃO possui conotação de superioridade racial biológica (como os nazistas deturparam grotescamente na Segunda Guerra); trata-se de um conceito puramente FILOSÓFICO e EXISTENCIAL de auto-superação moral e criativa.'
          ]
        },
        {
          id: 'existencialismo-sartre-beauvoir',
          title: 'Existencialismo e Condição Humana: Jean-Paul Sartre e Simone de Beauvoir',
          enemWeight: 'Alta',
          summary: 'A existência precede a essência, a condenação à liberdade radical, a crítica à má-fé e a desconstrução das normas de gênero.',
          keyConcepts: [
            '**A Existência Precede a Essência**: Ao contrário dos objetos manufaturados concebidos previamente com uma utilidade fixa (um abridor de garrafas existe a partir de uma essência funcional prévia desenhada pelo artesão), o ser humano surge no mundo sem qualquer determinação biológica, destino cósmico ou plano divino pré-estabelecido. O homem primeiro simplesmente existe, surge na história, e somente através de suas escolhas, atos e condutas é que ele define retrospectivamente sua própria essência: o ser humano nada mais é do que **aquilo que ele faz de si mesmo**.',
            '**Condenados à Liberdade e a Angústia Existencial**: A famosa tese de Sartre de que *"o homem está condenado a ser livre"* decorre da ausência de justificativas deterministas. Não há Deus, destino, natureza ou hereditariedade que tirem do indivíduo a responsabilidade integral por suas decisões. Essa constatação inescapável gera a **Angústia Existencial**: a vertigem perante a amplitude ilimitada das possibilidades e o peso de saber que, ao escolher para si, o homem engaja e escolhe uma imagem para a humanidade inteira.',
            '**A Má-Fé (Mauvaise Foi)**: É a atitude psicológica e ética na qual o indivíduo mente para si mesmo a fim de fugir da responsabilidade de sua liberdade radical. Acontece quando alguém se escuda em desculpas como "não tive escolha", "meus pais me obrigaram", "foi meu signo" ou reduz a si mesmo a um mero papel social engessado (o garçom que atua roboticamente para não assumir sua liberdade como sujeito consciente).',
            '**Simone de Beauvoir e O Segundo Sexo ("Não se nasce mulher, torna-se mulher")**: Beauvoir aplicou o princípio existencialista da precedência da existência sobre a essência para desconstruir o determinismo biológico do gênero feminino. Não existe uma "essência feminina" inata mística (ser passiva, materna, delicada); a feminilidade subordinada é uma **construção cultural e histórica** patriarcal imposta às mulheres desde a infância. O homem foi historicamente erigido como o Sujeito universal absoluto, enquanto a mulher foi relegada à condição de **"O Outro"**, dependente e secundária.'
          ],
          tips: [
            'Tema queridinho do ENEM (já foi questão de prova e tema de Redação): Simone de Beauvoir refuta qualquer determinismo biológico sobre papéis sociais. As desigualdades de gênero são produtos históricos, sociais e educacionais que demandam emancipação cívica e autonomia da mulher.'
          ]
        },
        {
          id: 'filosofia-contemporanea-arendt-foucault-habermas',
          title: 'Pensamento Contemporâneo: Hannah Arendt, Michel Foucault e a Escola de Frankfurt',
          enemWeight: 'Muito Alta',
          summary: 'A anatomia do totalitarismo e da banalidade do mal, a microfísica disciplinar do poder e a crítica à racionalidade instrumental.',
          keyConcepts: [
            '**A Escola de Frankfurt e a Indústria Cultural**: Theodor Adorno e Max Horkheimer publicaram em 1947 a *Dialética do Esclarecimento*, demonstrando como a promessa iluminista de emancipação pela razão transformou-se no século XX em **Razão Instrumental** (razão puramente técnica, utilitária e calculadora, desprovida de reflexão ética, empregada tanto para maximizar o lucro fabril quanto para gerenciar eficientemente os campos de extermínio nazistas). Cunharam o conceito fundamental de **Indústria Cultural**: a produção em massa e padronizada de bens culturais (filmes, músicas comerciais, propagandas) rebaixados à condição de mercadorias descartáveis, cujo objetivo real é alienar politicamente os trabalhadores, amortecer o pensamento crítico e fabricar conformismo social.',
            '**Hannah Arendt e a Banalidade do Mal**: Em sua cobertura do julgamento do coronel nazista Adolf Eichmann (*Eichmann em Jerusalém*), Arendt formulou a tese estarrecedora da **Banalidade do Mal**. Desmontou a crença simplista de que o Holocausto foi executado exclusivamente por monstros sádicos ou demônios fanáticos: Eichmann era um burocrata medíocre, zeloso e disciplinado que cometeu atrocidades inenarráveis simplesmente porque abdicou da capacidade crítica de pensar por si mesmo, normalizando o mal sob o pretexto cego de "estar apenas cumprindo o dever burocrático e as ordens da lei". Em *As Origens do Totalitarismo*, investigou como a solidão das massas despolitizadas permitiu a ascensão de regimes que destroem a própria condição humana.',
            '**Michel Foucault: Microfísica do Poder e Sociedade Disciplinar**: Rompendo com a visão jurídica tradicional que enxerga o poder unicamente sediado no Estado ou na polícia, Foucault demonstra que o poder é uma rede capilar, anônima e difusa que perpassa todo o corpo social. Na **Sociedade Disciplinar** (*Vigiar e Punir*), instituições modernas (escolas, fábricas, quartéis, hospitais psiquiátricos e prisões) utilizam a vigilância ininterrupta inspirada no modelo do **Panóptico** de Jeremy Bentham para adestrar, normatizar e produzir "corpos dóceis" e produtivos. Formulou ainda os conceitos de **Biopoder** e **Biopolítica**: a transição do poder soberano antigo ("fazer morrer e deixar viver") para a governamentalidade moderna voltada para o controle biológico, demográfico e estatístico de populações inteiras ("fazer viver e deixar morrer").',
            '**Jürgen Habermas e a Teoria da Ação Comunicativa**: Herdeiro crítico da Escola de Frankfurt, Habermas recusa o pessimismo paralisante de Adorno e resgata o potencial emancipador do Iluminismo através da **Razão Comunicativa**. Em oposição à ação instrumental voltada ao sucesso individual egoísta, propõe que a legitimidade política e as normas éticas universais devem ser construídas mediante o diálogo argumentativo livre de coerção na **Esfera Pública**. Em uma situação ideal de fala, todas as vozes têm igualdade de participação, vencendo unicamente a força racional do melhor argumento fundamentado.'
          ],
          tips: [
            'Conexão de ouro para Redação e Humanas no ENEM: A teoria da **Indústria Cultural** de Adorno é a ferramenta conceitual perfeita para analisar a influência dos algoritmos das redes sociais e a manipulação do comportamento do consumidor contemporâneo pela publicidade predatória.'
          ]
        },
        {
          id: 'etica-contemporanea-justica-rawls-jonas',
          title: 'Ética Contemporânea: Justiça como Equidade (John Rawls), Princípio da Responsabilidade (Hans Jonas) e Bioética',
          enemWeight: 'Alta',
          summary: 'A refundação do contrato social sob o véu da ignorância, a responsabilidade ecológica para com as futuras gerações e os dilemas morais da bioética.',
          keyConcepts: [
            '**John Rawls e a Teoria da Justiça como Equidade**: Rawls resgata a tradição contratualista para estabelecer critérios racionais e imparciais de justiça social distributiva. Propõe o experimento mental da **Posição Original** sob o **"Véu da Ignorância"**: legisladores hipotéticos devem conceber as regras básicas da sociedade sem saber previamente qual será sua própria posição social, classe, gênero, raça, talentos inatos ou religião. Nessa condição de incerteza ontológica, qualquer pessoa racional optará pela garantia das melhores condições para os mais vulneráveis (estratégia *maximin*).',
            '**Os Dois Princípios da Justiça de Rawls**: 1) **Princípio da Igualdade de Liberdades Básicas**: cada indivíduo deve ter direito igual ao sistema mais amplo de liberdades civis fundamentais (expressão, voto, locomoção e consciência) compatível com liberdade idêntica para todos; 2) **Princípio da Diferença e da Igualdade Equitativa de Oportunidades**: as desigualdades socioeconômicas só são eticamente justas e legítimas se satisfizerem duas condições: vincularem-se a cargos e posições acessíveis a todos em igualdade real de oportunidades e **gerarem o maior benefício possível para os membros menos favorecidos da sociedade** (justificando políticas públicas afirmativas e transferências de renda redistributivas).',
            '**Hans Jonas e o Princípio da Responsabilidade**: O filósofo alemão alerta que o formidável poder tecno-científico moderno (energia nuclear, desequilíbrio climático, engenharia genética) tem a capacidade inédita de destruir a integridade da biosfera e aniquilar a humanidade futura. A ética tradicional regulava apenas o presente imediato e as relações interpessoais. Jonas postula um imperativo ético ecológico: *"Age de tal modo que os efeitos de tua ação sejam compatíveis com a permanência de uma vida humana autêntica na Terra"*, defendendo o dever moral imperativo de proteger as **gerações futuras** e a natureza não humana.',
            '**A Heurística do Medo e a Bioética Principialista**: Diante do perigo de catástrofe irreversível, Jonas propõe a **Heurística do Medo** (na dúvida, o princípio da precaução deve prevalecer sobre o otimismo tecnológico desenfreado). Na **Bioética**, consolidaram-se os quatro princípios fundamentais (Beauchamp e Childress): 1) **Autonomia** (respeito à vontade consciente e ao consentimento livre e esclarecido do paciente); 2) **Não Maleficência** (dever de não causar dano intencional — *primum non nocere*); 3) **Beneficência** (dever de maximizar os benefícios em favor do outro); 4) **Justiça** (distribuição equânime de custos, riscos e recursos médicos escassos na saúde pública).'
          ],
          tips: [
            'Conexão impecável para temas de redação do ENEM sobre inteligência artificial, meio ambiente ou ações afirmativas: O Princípio da Responsabilidade de Hans Jonas fundamenta qualquer debate sobre sustentabilidade ecológica para gerações futuras; já o Princípio da Diferença de John Rawls é a justificativa filosófica basilar para cotas socioeconômicas e raciais em vestibulares e concursos públicos!'
          ]
        }
      ]
    }
  ]
};
