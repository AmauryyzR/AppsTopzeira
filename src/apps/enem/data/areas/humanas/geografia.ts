import { Discipline } from '../../../types/curriculum';

export const geografia: Discipline = {
  id: 'geografia',
  name: 'Geografia',
  description: 'Organização do espaço geográfico, dinâmicas demográficas, agrárias, urbanas, geopolítica global, climatologia, biomas e matrizes energéticas.',
  topics: [
    {
      id: 'geografia-fisica-ambiental',
      title: 'Geografia Física: Relevo, Geologia, Domínios Morfoclimáticos e Águas',
      description: 'Estrutura da Terra, agentes do relevo, biomas brasileiros de Aziz Ab\'Sáber e gestão estratégica das bacias hidrográficas.',
      subtopics: [
        {
          id: 'dominios-morfoclimaticos-biomas',
          title: 'Domínios Morfoclimáticos e Biomas do Brasil (Aziz Ab\'Sáber)',
          enemWeight: 'Muito Alta',
          summary: 'A interação entre relevo, clima, solo e vegetação que define os seis grandes domínios paisagísticos brasileiros e suas faixas de transição.',
          keyConcepts: [
            '**O Conceito de Domínio Morfoclimático**: Formulado pelo geógrafo Aziz Ab\'Sáber, o domínio morfoclimático compreende uma macroárea integrada onde feições de relevo, tipos de solo, dinâmicas climáticas e formações vegetais interagem de maneira homogênea e harmônica, margeadas por zonas ecológicas de contato denominadas **faixas de transição**.',
            '**Domínio Amazônico**: Relevo de planícies e baixos platôs, clima equatorial úmido e quente com chuvas diárias abundantes. A vegetação estratifica-se em mata de igapó (permanentemente inundada com vitórias-régias), mata de várzea (inundada sazonalmente) e mata de terra firme (a mais extensa, nunca inundada, com árvores de grande porte como a castanheira). O solo é predominantemente pobre e arenoso, sustentado pela ciclagem contínua de nutrientes promovida pela camada de matéria orgânica superficial (**serrapilheira**).',
            '**Domínio do Cerrado (Savana Brasileira)**: Localizado no Planalto Central, caracteriza-se pelo clima tropical semiúmido (verões chuvosos e invernos secos). A vegetação apresenta árvores de caules tortuosos, casca espessa e cortiçosa para resistir ao fogo natural e raízes pivotantes profundas para alcançar o lençol freático durante as secas. É considerado um **hotspot mundial de biodiversidade** e a "caixa d\'água do Brasil" (abriga as nascentes de importantes bacias). Seus solos são naturalmente ácidos e com alta concentração de alumínio, sendo corrigidos pela prática agrícola da **calagem** (aplicação de calcário moído).',
            '**Domínio da Caatinga**: Único bioma restrito exclusivamente ao território nacional, submetido ao clima semiárido com baixos índices pluviométricos e secas prolongadas. A vegetação exibe expressivo **xerofitismo**: plantas caducifólias (que perdem as folhas na estação seca para reduzir a perda d\'água por transpiração), caules carnosos que armazenam água e folhas modificadas em espinhos (como os cactos mandacaru e xique-xique). O solo é raso, pedregoso e rico em minerais, porém vulnerável a processos acelerados de **desertificação** causados pelo sobrepastoreio e desmatamento.',
            '**Domínio dos Mares de Morros (Faixa Atlântica)**: Relevo de morros convexos e arredondados ("meia-laranja") moldados por intenso intemperismo químico ao longo de milhões de anos. Abriga a **Mata Atlântica**, um dos biomas mais ricos e ameaçados do planeta (restam menos de 12% da vegetação nativa), historicamente desmatada pelos ciclos econômicos do pau-brasil, cana, café e pela intensa urbanização da costa brasileira. Apresenta alta vulnerabilidade a **deslizamentos de encostas** e movimentos de massa nos verões chuvosos.',
            '**Domínios das Araucárias e Pradarias**: O domínio das Araucárias (Planalto Meridional) desenvolve-se sob clima subtropical, dominado pelo pinheiro-do-paraná (*Araucaria angustifolia*) sobre solos férteis de terra roxa, intensamente devastado pela indústria madeireira e agropecuária. O domínio das Pradarias (Pampa Gaúcho) é marcado por relevo suave ondulado ("coxilhas") recoberto por vegetação rasteira de gramíneas, historicamente utilizado na pecuária extensiva e atualmente ameaçado pelo processo de **arenização** do solo.',
            '**Faixas de Transição Ecológica**: Áreas de contato que mesclam características de domínios vizinhos. Destacam-se o **Pantanal Mato-Grossense** (maior planície alagável contínua do globo, alternando cheias e vazantes sazonais), a **Mata dos Cocais** (no Meio-Norte, dominada pelas palmeiras de babaçu e carnaúba, fontes de renda para quebradeiras tradicionais) e o **Agreste Nordestino** (transição úmida-seca entre a Zona da Mata e o Sertão).'
          ],
          tips: [
            'Diferença crucial entre desertificação e arenização no ENEM: A **desertificação** ocorre em climas áridos e semiáridos (como na Caatinga), onde o solo perde matéria orgânica e umidade até esterilizar-se; a **arenização** ocorre em climas úmidos (como nos Pampas do RS), onde a remoção da cobertura de gramíneas expõe bancos de areia eólicos que invadem as pastagens.'
          ]
        },
        {
          id: 'geologia-relevo-bacias-hidrograficas',
          title: 'Geologia do Brasil, Dinâmica do Relevo e Bacias Hidrográficas',
          enemWeight: 'Alta',
          summary: 'A estrutura geológica antiga e estável do território brasileiro, as formas de relevo segundo Jurandyr Ross e o imenso patrimônio hídrico das bacias hidrográficas.',
          keyConcepts: [
            '**Estrutura Geológica Brasileira**: O Brasil assenta-se no centro da Placa Tectônica Sul-Americana, longe de zonas ativas de convergência de placas, o que explica a ausência de vulcões ativos e de abalos sísmicos de alta magnitude, bem como a inexistência de dobramentos modernos (como Andes ou Himalaia). O substrato divide-se em: **Escudos Cristalinos / Crátons** (estruturas rochosas antiquíssimas da era Pré-Cambriana, ricas em minerais metálicos como ferro, manganês e bauxita no Quadrilátero Ferrífero e na Serra dos Carajás) e **Bacias Sedimentares** (que recobrem mais de 60% do país, acumulando sedimentos fossilizados onde se formaram combustíveis fósseis como petróleo no Pré-Sal, gás natural e carvão mineral).',
            '**Classificação do Relevo de Jurandyr Ross**: Baseada em critérios morfoclimáticos, morfogenéticos e morfoestruturais pelo projeto RadamBrasil, divide o país em: 1) **Planaltos** (áreas onde os processos de erosão superam a sedimentação, com chapadas e serras); 2) **Depressões** (áreas rebaixadas em relação aos terrenos circundantes pelo trabalho erosivo, como a Depressão Sertaneja e Periférica Paulista); e 3) **Planícies** (superfícies planas onde a deposição e sedimentação superam a erosão, como as planícies fluviais do Amazonas e do Pantanal e a planície litorânea).',
            '**A Bacia Hidrográfica Amazônica**: A maior bacia hidrográfica do mundo em volume hídrico e extensão territorial. Embora seja predominantemente uma bacia de planície para navegação, seus afluentes que descem dos planaltos das Guianas e Central detêm formidável potencial hidroelétrico, aproveitado em usinas de fio d\'água controversas sob o ponto de vista socioambiental (como Belo Monte no Rio Xingu e Jirau/Santo Antônio no Rio Madeira).',
            '**A Bacia do Rio Paraná e a Bacia do São Francisco**: A **Bacia do Paraná** situa-se próxima ao coração econômico e demográfico do país, possuindo a maior capacidade instalada de geração elétrica do Brasil (destaque para a Usina Binacional de **Itaipu**) e a hidrovia Tietê-Paraná para escoamento de grãos. A **Bacia do Rio São Francisco** ("o Rio da Integração Nacional") nasce na Serra da Canastra (MG) e deságua entre AL e SE, sendo vital para geração de eletricidade (Sobradinho, Xingó), irrigação de fruticultura tropical no Vale do Submédio São Francisco (Petrolina/Juazeiro) e para o projeto federal de **Transposição das Águas**, que leva segurança hídrica aos canais do semiárido nordestino.'
          ],
          tips: [
            'O solo de **Terra Roxa** (comum no interior de SP e norte do PR) não tem essa cor por ser vermelha na gíria brasileira, mas porque os imigrantes italianos a chamavam de "rossa" (vermelha em italiano). Trata-se de um solo vulcânico extremamente fértil resultante do intemperismo de rochas ígneas extrusivas (**basalto**) derramadas na Era Mesozoica.'
          ]
        },
        {
          id: 'impactos-ambientais-conferencias-clima',
          title: 'Impactos Ambientais Globais, Conferências do Clima e Sustentabilidade',
          enemWeight: 'Muito Alta',
          summary: 'O aquecimento global antropogênico, a pegada ecológica, os marcos das conferências da ONU (Rio 92, Paris) e os crimes ambientais no Brasil.',
          keyConcepts: [
            '**O Aquecimento Global e a Pegada de Carbono**: Intensificação anômala do efeito estufa pela emissão massiva de gases de efeito estufa (GEE), principalmente o dióxido de carbono ($CO_2$, oriundo da queima de combustíveis fósseis e desmatamento/queimadas) e o metano ($CH_4$, oriundo da digestão entérica do gado bovino, decomposição anaeróbia em lixões e plantios inundados de arroz). A **Pegada Ecológica** e a Pegada de Carbono quantificam o impacto do consumo de recursos naturais e da geração de resíduos por pessoa ou nação.',
            '**Marcos Históricos das Conferências Ambientais da ONU**: 1) **Estocolmo 1972**: Primeiro grande encontro global sobre o meio ambiente, marcado pelo embate entre países desenvolvidos ("Desenvolvimento Zero" para frear a poluição) e países em desenvolvimento como o Brasil da Ditadura Militar ("Desenvolver primeiro e pagar o custo ambiental depois"); 2) **Rio 92 / Eco-92**: Consagrou internacionalmente o conceito de **Desenvolvimento Sustentável** formulado pelo Relatório Brundtland (*Nosso Futuro Comum*, 1987) — satisfazer as necessidades da geração atual sem comprometer a capacidade das futuras gerações de suprirem suas próprias necessidades; originou a **Agenda 21**, a Convenção da Biodiversidade e a Convenção do Clima; 3) **Protocolo de Quioto (1997)**: Estabeleceu metas compulsórias de redução de emissões para países industrializados e criou o mercado de créditos de carbono; 4) **Acordo de Paris (2015)**: Substituiu Quioto com um tratado universal vinculante no qual todos os países apresentam metas nacionais voluntárias (**NDCs**) com o objetivo de limitar o aumento da temperatura média global a no máximo $1,5^\circ\text{C}$ acima dos níveis pré-industriais.',
            '**Grandes Desastres Socioambientais e Crimes Corporativos no Brasil**: O rompimento da barragem de rejeitos de mineração de ferro de Fundão em **Mariana (MG, 2015)** operada pela Samarco/Vale despejou mais de 40 milhões de metros cúbicos de lama tóxica na Bacia do Rio Doce, destruindo distritos inteiros (Bento Rodrigues), matando 19 pessoas e inviabilizando a pesca artesanal e o abastecimento de dezenas de cidades até o litoral do Espírito Santo. Em **Brumadinho (MG, 2019)**, o rompimento da barragem da Mina Córrego do Feijão (Vale) soterrou e assassinou 272 pessoas, devastando o ecossistema do Rio Paraopeba e escancarando a negligência corporativa na fiscalização de barragens a montante.',
            '**Política Nacional de Resíduos Sólidos (PNRS - Lei nº 12.305/2010)**: Marco legal brasileiro que determina a erradicação definitiva dos lixões a céu aberto, a substituição por aterros sanitários controlados, o princípio da responsabilidade compartilhada pelo ciclo de vida dos produtos e a implantação da **Logística Reversa** (obrigatoriedade de fabricantes, distribuidores e importadores de pilhas, baterias, pneus, óleos lubrificantes, eletrônicos e agrotóxicos recolherem e reciclarem as embalagens e produtos pós-consumo).'
          ],
          tips: [
            'O ENEM nunca analisa desastres como Mariana e Brumadinho como "acidentes naturais inevitáveis": trata-se de tragédias sociotécnicas e crimes corporativos previsíveis gerados pela busca de redução de custos na manutenção de barragens de alteamento a montante.'
          ]
        }
      ]
    },
    {
      id: 'climatologia-cartografia',
      title: 'Climatologia, Dinâmica Atmosférica e Cartografia',
      description: 'Massas de ar, tipos de chuvas, fenômenos climáticos urbanos, projeções cartográficas e fusos horários.',
      subtopics: [
        {
          id: 'climas-brasil-massas-ar-impactos',
          title: 'Dinâmica das Massas de Ar, Climas do Brasil e Impactos Atmosféricos',
          enemWeight: 'Alta',
          summary: 'A atuação termodinâmica das massas de ar no país, a gênese das precipitações, El Niño/La Niña e os desequilíbrios microclimáticos urbanos.',
          keyConcepts: [
            '**As Cinco Massas de Ar Atuantes no Brasil**: 1) **Massa Equatorial Continental (mEc)**: quente e instável, originada na Amazônia; excepcionalmente úmida para uma massa continental devido à portentosa evapotranspiração da floresta equatorial ("Rios Voadores"), expandindo chuvas torrenciais de verão pelo Sudeste e Centro-Oeste; 2) **Massa Polar Atlântica (mPa)**: fria e úmida, vinda da Antártica; durante o inverno avança pelo litoral provocando chuvas frontais e sobe pelo interior causando geadas no Sul e a queda brusca de temperatura no norte ("Friagem"); 3) **Massa Tropical Atlântica (mTa)**: quente e úmida, causadora de chuvas orográficas na Serra do Mar; 4) **Massa Tropical Continental (mTc)**: quente e seca, originada na depressão do Chaco paraguaio; 5) **Massa Equatorial Atlântica (mEa)**: quente e úmida.',
            '**Classificação dos Climas Brasileiros**: 1) **Equatorial**: quente e chuvoso o ano inteiro, com baixíssima amplitude térmica anual; 2) **Tropical Típico / Semiúmido**: duas estações pluviométricas nítidas (verão chuvoso e inverno marcadamente seco); 3) **Semiárido**: temperaturas médias elevadas, chuvas escassas, irregulares e sujeitas à seca crônica provocada pelo bloqueio orográfico do Planalto da Borborema; 4) **Subtropical**: clima do Sul do país, chuvas bem distribuídas o ano todo, quatro estações definidas e grande amplitude térmica com risco de geadas e neve.',
            '**Tipos de Chuvas e Fenômenos Climáticos Globais**: **Chuvas Convectivas** (chuvas de verão, rápidas e torrenciais, resultantes da forte evaporação superficial e ascensão de ar quente); **Chuvas Orográficas ou de Relevo** (ocorrem quando massas de ar úmidas colidem com serras, elevam-se, resfriam-se e condensam na encosta a barlavento, deixando o lado a sotavento seco); e **Chuvas Frontais** (encontro de massas de ar quente e ar frio). Fenômeno **El Niño**: aquecimento anômalo das águas superficiais do Oceano Pacífico Equatorial, provocando secas severas no Norte/Nordeste e chuvas volumosas e enchentes no Sul do Brasil; **La Niña**: resfriamento anormal das águas do Pacífico, com efeitos meteorológicos inversos.',
            '**Problemas Atmosféricos Urbanos**: A **Inversão Térmica** ocorre comumente nas madrugadas frias de inverno: o resfriamento rápido do solo cria uma camada de ar frio sob uma camada de ar quente sobreposta, impedindo a convecção vertical normal da atmosfera. A poluição particulada e os gases tóxicos dos escapamentos e fábricas ficam retidos na altura do solo, agravando doenças respiratórias crônicas. As **Ilhas de Calor** representam a elevação anormal das temperaturas nos centros hiperurbanizados devido ao asfalto escuro (baixo albedo), concretagem maciça, escassez de cobertura vegetal e liberação de calor residual por aparelhos de ar-condicionado e veículos.'
          ],
          tips: [
            'Os **Rios Voadores** da Amazônia exportam diariamente para a atmosfera o equivalente a trilhões de litros de vapor d\'água via evapotranspiração vegetal. Esse fluxo aéreo de umidade desloca-se para oeste até bater na barreira intransponível da Cordilheira dos Andes, sendo defletido para o sul e irrigando as lavouras do Centro-Oeste e as represas do Sudeste brasileiro.'
          ]
        },
        {
          id: 'projecoes-cartograficas-fusos',
          title: 'Cartografia: Projeções Cilíndricas, Escalas e Fusos Horários',
          enemWeight: 'Média',
          summary: 'A intencionalidade ideológica das representações cartográficas e as regras matemáticas de escala e fusos horários.',
          keyConcepts: [
            '**Natureza Crítica das Projeções Cartográficas**: Transferir uma esfera geodésica tridimensional para um plano bidimensional acarreta inevitavelmente deformações matemáticas de ângulos, áreas ou distâncias. Nenhum mapa é politicamente neutro: a escolha da projeção reflete visões geopolíticas de poder de sua época.',
            '**Projeção Conforme de Mercator (1569)**: Preserva rigorosamente as formas dos continentes e os ângulos das rotas de navegação (projeção conforme), mas distorce gravemente o tamanho relativo das massas territoriais à medida que nos aproximamos dos polos. É uma representação abertamente eurocêntrica: projeta a Europa e a Groenlândia desproporcionalmente gigantescas em comparação com a África e a América do Sul.',
            '**Projeção Equivalente de Peters (1973)**: Preserva com precisão a proporção real das áreas territoriais em relação ao globo (projeção equivalente), embora deforme e alongue verticalmente a silhueta dos continentes. Conhecida como a "projeção do Terceiro Mundo", Peters colocou os países do Sul Global em seu devido protagonismo dimensional na época das lutas anticoloniais.',
            '**Cálculo de Escalas Cartográficas**: A escala expressa a relação matemática entre a dimensão no mapa ($d$) e a dimensão real no terreno ($D$): $E = d / D$. Escala Grande (ex: $1:5.000$) cobre área geográfica pequena com altíssimo nível de detalhamento (plantas urbanas e bairros); Escala Pequena (ex: $1:25.000.000$) cobre áreas territoriais imensas com baixo nível de detalhe (mapamúndis e mapas continentais).',
            '**Fusos Horários e Horário Brasileiro**: A rotação da Terra ($360^\circ$ em 24h) estabelece que cada fuso horário possui $15^\circ$ de longitude. Para leste somam-se horas ($+1\text{ h}/15^\circ$); para oeste subtraem-se horas ($-1\text{ h}/15^\circ$). O Brasil possui quatro fusos oficiais a oeste de Greenwich: 1) Fuso $-2\text{ h}$ (ilhas oceânicas: Noronha); 2) Fuso $-3\text{ h}$ (Horário Oficial de Brasília, cobrindo o Litoral, Nordeste, Sudeste, Sul, DF e partes de Norte/Centro-Oeste); 3) Fuso $-4\text{ h}$ (MT, MS, RO, RR e leste do AM); 4) Fuso $-5\text{ h}$ (Acre e extremo oeste do AM).'
          ],
          tips: [
            'Dica mnemônica clássica para o ENEM: Escala é como uma fração! Quanto maior o denominador (ex: $1:50.000.000$), menor é a fração e menor é a escala (pouco detalhe, mapa múndi). Quanto menor o denominador (ex: $1:1.000$), maior é a fração e maior é a escala (muito detalhe, planta de rua).'
          ]
        }
      ]
    },
    {
      id: 'geografia-humana-agraria',
      title: 'Espaço Agrário, Conflitos no Campo e Matrizes Energéticas',
      description: 'Concentração fundiária, agronegócio de commodities, agricultura familiar camponesa e transição energética global.',
      subtopics: [
        {
          id: 'estrutura-fundiaria-agronegocio',
          title: 'Estrutura Fundiária, Agronegócio de Exportação e Agricultura Familiar',
          enemWeight: 'Muito Alta',
          summary: 'A histórica concentração de terras do Brasil, o avanço da fronteira agrícola sobre o Cerrado e a Amazônia e os conflitos socioambientais no campo.',
          keyConcepts: [
            '**Concentração Fundiária Histórica e o Índice de Gini**: O Brasil ostenta um dos maiores índices de concentração fundiária do planeta (Índice de Gini agrário superior a 0,85). Essa estrutura remonta às sesmarias hereditárias e à Lei de Terras de 1850: os latifúndios (propriedades com mais de 1.000 hectares), que equivalem a menos de 1% do total de estabelecimentos rurais, concentram quase metade de todas as terras agricultáveis do país.',
            '**Agronegócio (Agribusiness) e a Fronteira Agrícola**: Setor altamente tecnificado, capitalizado e integrado a cadeias agroindustriais globais, fundamentado em monoculturas extensivas de sementes transgênicas, adubos sintéticos, maquinário autônomo com GPS e defensivos agrícolas (agrotóxicos). Focado em **commodities** primárias para exportação (soja, milho, carne e celulose). A expansão da fronteira agrícola avançou do Centro-Oeste para a região do **Matopiba** (Maranhão, Tocantins, Piauí e Bahia) e para o "Arco do Desmatamento" na Amazônia meridional.',
            '**A Agricultura Familiar Camponesa e a Soberania Alimentar**: Caracterizada pelo uso predominante de mão de obra da própria família em propriedades menores e diversificadas (policultura). É responsável por empregar a imensa maioria dos trabalhadores rurais e por produzir cerca de 70% dos alimentos básicos consumidos diariamente pelos brasileiros (arroz, feijão, hortaliças, leite, mandioca, ovos e frutas). Sofre historicamente com carência de assistência técnica e linhas de crédito governamentais em comparação com o agronegócio exportador.',
            '**Conflitos Socioambientais no Campo e Grilagem**: O avanço predatório da agropecuária e do garimpo ilegal sobre terras públicas devolutas, reservas extrativistas, áreas de proteção ambiental e territórios indígenas demarcados desata violentos conflitos de terra. A prática da **grilagem** (apropriação fraudulenta de terras públicas com documentos forjados e envelhecidos artificialmente com grilos em caixas) alimenta a violência contra lideranças camponesas, quilombolas e defensores dos direitos humanos, denunciada por entidades como a Comissão Pastoral da Terra (CPT) e o Movimento dos Trabalhadores Rurais Sem Terra (MST).'
          ],
          tips: [
            'O ENEM cobra constantemente a dialética do campo: O agronegócio alavanca o superávit comercial da balança de pagamentos do Brasil, mas a agricultura familiar camponesa é quem garante a soberania alimentar da mesa popular e a fixação sustentável do trabalhador na terra.'
          ]
        },
        {
          id: 'fontes-energia-matriz-brasileira-global',
          title: 'Fontes de Energia, Matriz Energética Brasileira e Transição Sustentável',
          enemWeight: 'Muito Alta',
          summary: 'A comparação crucial entre a matriz energética (toda a energia) e elétrica (geração de eletricidade), e a transição para descarbonização.',
          keyConcepts: [
            '**Diferença Crucial: Matriz Energética vs. Matriz Elétrica**: A matriz energética contabiliza todas as fontes primárias utilizadas no país para mover veículos, movimentar fábricas, aquecer fornos e produzir eletricidade. A matriz elétrica refere-se unicamente ao conjunto de usinas que geram a energia elétrica que abastece a rede de transmissão e as tomadas residenciais.',
            '**A Matriz Elétrica Brasileira (Predominantemente Renovável, >80%)**: Uma das mais limpas do mundo, dominada pela hidroeletricidade (~60%), seguida pelo crescimento vertiginoso da **energia eólica** (especialmente nos parques do litoral e sertão nordestinos, beneficiados pelos ventos alísios constantes), da **energia solar fotovoltaica** e da biomassa (queima do bagaço da cana-de-açúcar e resíduos agrícolas). A vulnerabilidade hidrológica decorrente de secas climáticas severas obriga o acionamento emergencial de usinas termoelétricas fósseis, encarecendo a tarifa por meio de bandeiras tarifárias e emitindo mais gases estufa.',
            '**A Matriz Energética Global (Altamente Fóssil, ~80%)**: O modelo econômico planetário permanece refém dos combustíveis fósseis poluentes e não-renováveis: **Petróleo** (combustível automotivo e petroquímica), **Carvão Mineral** (responsável por grande parte da geração elétrica na China, Índia e EUA, o maior emissor de $CO_2$ por gigawatt gerado) e Gás Natural.',
            '**Transição Energética e Descarbonização**: O imperativo internacional de zerar as emissões líquidas de gases estufa até 2050 para conter o aquecimento global abaixo de $1,5^\circ\text{C}$ (Acordo de Paris) impulsiona o fechamento de termoelétricas a carvão, a eletrificação da frota automotiva com baterias de lítio e investimentos estratégicos na cadeia do **Hidrogênio Verde** ($H_2$ gerado por eletrólise da água utilizando energia solar ou eólica).'
          ],
          tips: [
            'Pegadinha recorrente no ENEM: A matriz ELÉTRICA do Brasil é limpa e verde (>80% renovável). No entanto, a matriz ENERGÉTICA total do Brasil ainda depende de quase 50% de fontes não-renováveis devido ao predomínio absoluto do diesel e da gasolina no transporte rodoviário de cargas e passageiros!'
          ]
        }
      ]
    },
    {
      id: 'geografia-urbana-geopolitica',
      title: 'Espaço Urbano, Demografia e Geopolítica Mundial',
      description: 'Metropolização, segregação socioespacial, pirâmides etárias, modelos de produção e a ordem geopolítica multipolar.',
      subtopics: [
        {
          id: 'urbanizacao-segregacao-socioespacial',
          title: 'Urbanização Brasileira, Macrocefalia e Segregação Socioespacial',
          enemWeight: 'Muito Alta',
          summary: 'O crescimento desordenado das cidades pelo êxodo rural acelerado, conurbação, gentrificação e as contradições do espaço urbano.',
          keyConcepts: [
            '**A Urbanização Vertiginosa no Brasil**: O modelo industrial concentrado no Sudeste a partir da década de 1950, articulado à mecanização do campo que expulsou camponeses sem-terra, desatou um êxodo rural maciço. Em poucas décadas, o Brasil transformou-se de país rural em urbano (hoje mais de 85% dos brasileiros vivem em cidades). Essa rapidez sem planejamento habitacional e de transporte gerou o fenômeno da **Macrocefalia Urbana** (hipertrofia desordenada de serviços, favelas e carência de saneamento básico em torno das capitais).',
            '**Conurbação e Regiões Metropolitanas**: A **Conurbação** ocorre quando os perímetros urbanos de dois ou mais municípios vizinhos expandem-se até se unirem fisicamente em uma mancha contínua, fazendo com que o cidadão transite de uma cidade para outra sem perceber a fronteira física. Exige governança integrada em **Regiões Metropolitanas** para solucionar problemas conjuntos de transporte coletivo metropolitano, descarte de resíduos sólidos em aterros sanitários e proteção de mananciais hídricos.',
            '**Segregação Socioespacial e o Direito à Cidade**: A lógica especulativa do mercado imobiliário privatiza o solo urbanizado provido de saneamento, praças, hospitais e transporte rápido para as classes abastadas, empurrando as populações de baixa renda para periferias desprovidas de infraestrutura e para áreas de risco geológico (encostas íngremes suscetíveis a deslizamentos e várzeas sujeitas a inundações). O trabalhador periférico perde horas diárias em transportes coletivos precários no fenômeno da **migração pendular**.',
            '**Gentrificação**: Intervenções estéticas ou de revitalização urbanística promovidas por parcerias público-privadas em bairros históricos ou degradados. Embora renovem a infraestrutura com parques e comércio sofisticado, provocam o encarecimento brutal dos aluguéis, dos serviços e do IPTU, forçando a expulsão social indireta dos moradores e comerciantes tradicionais de menor renda, que são substituídos por consumidores das classes mais altas.'
          ],
          tips: [
            'No ENEM, "gentrificação" nunca é sinônimo de benefício universal: a questão invariavelmente problematiza como a valorização do solo expulsa a população periférica que construiu historicamente a identidade do bairro.'
          ]
        },
        {
          id: 'modelos-produtivos-revolucoes-industriais',
          title: 'Modelos Produtivos (Taylorismo, Fordismo, Toyotismo) e Desconcentração Industrial no Brasil',
          enemWeight: 'Muito Alta',
          summary: 'A evolução da divisão técnica do trabalho, a transição da linha de montagem rígida para o just-in-time e a migração espacial das fábricas no território brasileiro.',
          keyConcepts: [
            '**As Quatro Revoluções Industriais**: 1ª Revolução (século XVIII, Inglaterra: carvão mineral, metalurgia do ferro e máquina a vapor têxtil); 2ª Revolução (final do século XIX, EUA e Alemanha: petróleo, eletricidade, motor a combustão interna e indústria química pesada); 3ª Revolução ou Revolução Técnico-Científica-Informacional (segunda metade do século XX: microeletrônica, robótica, informática, telecomunicações e biotecnologia); 4ª Revolução / Indústria 4.0 (século XXI: inteligência artificial, internet das coisas / IoT, big data, computação em nuvem e manufatura aditiva 3D).',
            '**Modelos de Organização do Trabalho Fabril**: 1) **Taylorismo** (Frederick Taylor): separação rigorosa entre planejamento gerencial e execução manual na fábrica, fragmentação extrema das tarefas operárias e controle cronometrado minucioso dos tempos e movimentos dos trabalhadores para eliminar pausas e tempos mortos; 2) **Fordismo** (Henry Ford): incorporação da esteira rolante mecanizada que dita o ritmo do trabalho levando a peça até o operário fixo, fabricação em massa padronizada e seriada de produtos homogêneos, formação de estoques gigantescos de segurança e concessão de salários relativamente mais elevados para transformar os próprios operários em consumidores dos produtos fabricados; 3) **Toyotismo / Pós-Fordismo** (Taiichi Ohno no Japão pós-1945): resposta à escassez de espaço e matérias-primas e à diversificação da demanda; produção flexível puxada pelo consumo sob o sistema **Just-in-Time** (produzir apenas o que foi encomendado, no momento exato e na quantidade requerida, operando com **estoque zero**), trabalhadores polivalentes/multifuncionais que operam múltiplas máquinas simultaneamente, e programas de Controle de Qualidade Total com Círculos de Controle de Qualidade (CCQ).',
            '**A Industrialização Tardia Brasileira e a Concentração no Sudeste**: O processo de industrialização acelerou-se a partir de 1930 com Getúlio Vargas (substituição de importações e indústria pesada de base) e JK (Plano de Metas e indústria automobilística transnacional). Os investimentos concentraram-se desproporcionalmente na Região Metropolitana de São Paulo (ABCD paulista), beneficiada pela infraestrutura herdada do complexo cafeeiro (portos, ferrovias, capitais bancários e densa rede de energia e mercado consumidor).',
            '**O Processo de Desconcentração Industrial**: A partir da década de 1990, os altos custos de produção na Grande São Paulo (congestionamentos no trânsito, terrenos caríssimos, impostos elevados e forte combatividade dos sindicatos de metalúrgicos) estimularam a migração de fábricas para cidades médias do interior paulista (eixo Campinas-São José dos Campos-Ribeirão Preto) e para outras regiões do país (Sul e Nordeste). Esse movimento foi alimentado pela **Guerra Fiscal** (concorrência predatória entre governos estaduais e prefeituras oferecendo isenções tributárias, doação gratuita de terrenos e obras de infraestrutura), combinada à oferta de mão de obra mais barata e sindicatos menos organizados.'
          ],
          tips: [
            'Conexão certeira no ENEM: O Toyotismo gera flexibilidade produtiva para a empresa capitalista, mas impõe maior instabilidade existencial para o trabalhador: exige polivalência sem oferecer estabilidade empregatícia, abrindo caminho para a precarização dos contratos de trabalho contemporâneos.'
          ]
        },
        {
          id: 'transicao-demografica-envelhecimento',
          title: 'Demografia: Teorias Populacionais, Transição Demográfica e Migrações',
          enemWeight: 'Alta',
          summary: 'A evolução das teorias demográficas de Malthus aos reformistas, a queda da fecundidade brasileira e a dinâmica dos fluxos migratórios.',
          keyConcepts: [
            '**As Grandes Teorias Demográficas**: 1) **Teoria Malthusiana** (Thomas Malthus, séc. XVIII): sustentava que a população crescia em progressão geométrica (PG: 2, 4, 8, 16...) enquanto a produção de alimentos crescia em progressão aritmética (PA: 2, 4, 6, 8...), prevendo fome e miséria planetárias a menos que se praticasse a abstinência sexual; errou ao ignorar o impacto da tecnologia agrícola moderna; 2) **Teoria Neomalthusiana** (pós-Segunda Guerra): culpava a alta natalidade nos países subdesenvolvidos como a causa da pobreza, defendendo o controle compulsório de natalidade; 3) **Teoria Reformista ou Marxista**: inverte a lógica neomalthusiana, demonstrando que a alta taxa de natalidade é CONSEQUÊNCIA da pobreza e da falta de acesso à educação, saúde e métodos contraceptivos; defendem que a melhoria das condições socioeconômicas reduz naturalmente o tamanho das famílias.',
            '**A Transição Demográfica no Brasil**: O país atravessou quatro estágios históricos: 1º Estágio (até 1940: altas taxas de natalidade e mortalidade, crescimento lento); 2º Estágio (1940 a 1970: forte queda da mortalidade graças ao saneamento e vacinas, natalidade elevada, explosão demográfica); 3º Estágio (a partir de 1970: queda acelerada da taxa de fecundidade, que caiu de 6,2 filhos por mulher para menos de 1,6 na atualidade, impulsionada pela urbanização, anticoncepcionais e inserção feminina no mercado de trabalho); 4º Estágio (baixa natalidade e baixa mortalidade, resultando em estabilização e futuro decrescimento populacional).',
            '**Bônus Demográfico e o Envelhecimento Populacional**: O Brasil viveu nas últimas décadas a sua "janela demográfica" ou bônus demográfico, quando a População em Idade Ativa (PIA, entre 15 e 64 anos) superou a soma de dependentes (crianças e idosos). A transição rápida culmina no estreitamento da base da pirâmide etária e alargamento de seu topo (envelhecimento acelerado), pressionando a sustentabilidade financeira da Previdência Social e demandando expansão de cuidados geriátricos na saúde pública.',
            '**Dinâmica das Migrações Internas no Brasil**: No século XX, o fluxo migratório predominante partiu do Nordeste e de regiões rurais em direção ao Sudeste (São Paulo e Rio de Janeiro), motivado pelo dinamismo industrial e pela seca. Na segunda metade do século, a construção de Brasília e a abertura da fronteira agrícola atraíram contingentes significativos para o Centro-Oeste e Norte. No século XXI, observa-se a desaceleração das migrações para as grandes metrópoles, o fortalecimento da **migração de retorno** de nordestinos para suas cidades natais e a atração de migrantes por cidades médias do interior.'
          ],
          tips: [
            'A taxa de fecundidade brasileira (1,57 filho por mulher) está bem abaixo da taxa de reposição biológica populacional (2,1 filhos por mulher). Isso significa que em poucas décadas a população brasileira entrará em declínio vegetativo absoluto.'
          ]
        },
        {
          id: 'globalizacao-redes-milton-santos',
          title: 'Globalização, Meio Técnico-Científico-Informacional (Milton Santos) e Blocos Econômicos',
          enemWeight: 'Alta',
          summary: 'A aceleração dos fluxos materiais e imateriais, as cidades globais, a teoria crítica de Milton Santos e os principais blocos comerciais mundiais.',
          keyConcepts: [
            '**O Meio Técnico-Científico-Informacional de Milton Santos**: A evolução do espaço geográfico segundo o geógrafo Milton Santos passou pelo Meio Natural (quando a humanidade dependia passivamente dos ritmos da natureza), pelo Meio Técnico (marcado pela mecanização mecânica da Revolução Industrial) e atingiu o **Meio Técnico-Científico-Informacional** contemporâneo, no qual a ciência e a tecnologia fundiram-se para transformar o espaço em uma teia global de cabos de fibra óptica, satélites de comunicação e redes de computadores onde a informação circula em tempo real.',
            '**As Três Dimensões da Globalização (Milton Santos)**: Em seu ensaio *Por uma Outra Globalização*, Milton Santos distingue: 1) **O mundo como nos fazem vê-lo (Globalização como Fábula)**: a propaganda ideológica que vende a ilusão de uma "aldeia global" harmoniosa, democrática e instantaneamente conectada, onde todos compartilhariam das mesmas oportunidades de consumo; 2) **O mundo como ele é (Globalização como Perversidade)**: a realidade concreta de agravamento das disparidades socioeconômicas entre países ricos e pobres, desemprego estrutural pela automação, precarização do trabalho, fome endêmica e homogeneização cultural massificadora; 3) **O mundo como ele pode ser (Uma Outra Globalização)**: a possibilidade concreta de construção de uma globalização alternativa humanitária e solidária, erguida a partir da sabedoria e resistência das classes populares e dos povos do Sul Global.',
            '**Cidades Globais e Redes Urbanas**: Centros urbanos estratégicos onde se concentram o poder decisório e os fluxos imateriais do capitalismo transnacional: sedes de corporações globais, grandes consultorias jurídicas e financeiras, bolsas de valores mundiais e nós centrais de tráfego de telecomunicações (como Nova York, Londres, Tóquio, e São Paulo como a principal cidade global da América do Sul).',
            '**Tipologia dos Blocos Econômicos Regionais**: 1) **Zona de Livre Comércio**: eliminação ou redução de tarifas alfandegárias para o comércio interno entre os países-membros (ex.: USMCA — antigo NAFTA); 2) **União Aduaneira**: além do livre comércio interno, adota uma **Tarifa Externa Comum (TEC)** padronizada cobrada sobre mercadorias importadas de países fora do bloco (ex.: **Mercosul**); 3) **Mercado Comum**: soma os estágios anteriores à livre circulação de capitais, serviços, mercadorias e PESSOAS/trabalhadores; 4) **União Econômica e Monetária**: estágio mais avançado de integração, com mercado comum, harmonização de políticas fiscais e moeda única gerida por um Banco Central supranacional (ex.: **União Europeia** com a Zona do Euro).'
          ],
          tips: [
            'Pegadinha recorrente sobre o Mercosul: O Mercosul é formalmente uma **União Aduaneira incompleta** (devido à TEC), e NÃO um Mercado Comum pleno, pois ainda existem restrições burocráticas e não há moeda única compartilhada.'
          ]
        },
        {
          id: 'geopolitica-ordem-multipolar',
          title: 'Geopolítica Global, Nova Ordem Mundial Multipolar e Conflitos Contemporâneos',
          enemWeight: 'Alta',
          summary: 'A reorganização do poder global após o fim da Guerra Fria, a ascensão da China, a expansão dos BRICS e as tensões territoriais e comerciais contemporâneas.',
          keyConcepts: [
            '**Da Ordem Bipolar à Nova Ordem Multipolar**: Com o desmantelamento da União Soviética em 1991, o mundo transitou de uma ordem bipolar militar para uma ordem multipolar geoeconômica. Embora os Estados Unidos mantenham supremacia bélica global (unipolaridade militar), o poder econômico, produtivo e tecnológico desconcentrou-se com a emergência de múltiplos polos globais: a União Europeia, o Japão e, sobretudo, a espetacular ascensão econômica e geopolítica da República Popular da China.',
            '**A Ascensão da China e a Disputa Hegemônica**: A China transformou-se na "fábrica do mundo" após as reformas de abertura econômica de Deng Xiaoping no final dos anos 1970 ("socialismo de mercado"), avançando para a liderança global em tecnologias de ponta como 5G, semicondutores, inteligência artificial e baterias para veículos elétricos. O ambicioso projeto geopolítico da **Nova Rota da Seda** (*Belt and Road Initiative*) financia estradas, portos, ferrovias e redes energéticas em dezenas de países da Ásia, África, Europa e América Latina, desafiando a hegemonia histórica do dólar e do sistema financeiro de Bretton Woods comandado por Washington.',
            '**Os BRICS e o Protagonismo do Sul Global**: Bloco originalmente composto por Brasil, Rússia, Índia, China e África do Sul, e recentemente expandido para incluir economias emergentes da Ásia, África e Oriente Médio. O grupo defende uma ordem internacional mais equilibrada, o fortalecimento do multilateralismo nas Nações Unidas, a reforma do Fundo Monetário Internacional (FMI) e do Banco Mundial e o comércio bilateral em moedas locais para diminuir a dependência cambial do dólar norte-americano através do Novo Banco de Desenvolvimento (NBD).',
            '**Focos de Conflito Geopolítico no Século XXI**: O conflito no Leste Europeu deflagrado pela invasão russa da Ucrânia em 2022, motivado pela expansão da aliança militar ocidental da OTAN em direção às fronteiras históricas da Rússia e por disputas territoriais estratégicas no Mar Negro; a histórica e não resolvida **Questão Palestina** no Oriente Médio, marcada pela ocupação territorial israelense na Cisjordânia, o cerco à Faixa de Gaza e confrontos crônicos com o grupo Hamas; e as tensões no Indo-Pacífico, centradas no controle de rotas marítimas no Mar do Sul da China e na questão da soberania da ilha de Taiwan.'
          ],
          tips: [
            'No ENEM, temas geopolíticos contemporâneos são avaliados à luz da soberania territorial, dos direitos humanos e do direito internacional humanitário, contrapondo os interesses das grandes potências globais às tragédias humanas dos refugiados e populações civis apátridas.'
          ]
        }
      ]
    }
  ]
};
