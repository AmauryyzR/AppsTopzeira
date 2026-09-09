import { Discipline } from '../../../types/curriculum';

export const historia: Discipline = {
  id: 'historia',
  name: 'História',
  description: 'Construção da memória coletiva, conflitos sociais, formação do Estado e da sociedade brasileira e conjuntura geopolítica mundial.',
  topics: [
    {
      id: 'historia-brasil',
      title: 'História do Brasil',
      description: 'Da colônia mercantilista aos desafios da consolidação democrática contemporânea.',
      subtopics: [
        {
          id: 'brasil-colonia-sociedade',
          title: 'Brasil Colônia: Economia Açucareira, Ciclo do Ouro e Escravidão',
          enemWeight: 'Muito Alta',
          summary: 'Estruturação colonial no modelo de plantation agroexportador escravocrata, a transição para a sociedade urbana mineradora no século XVIII e as revoltas emancipacionistas.',
          keyConcepts: [
            'Tráfico Negreiro e Escravidão como Instituição: A mercantilização de vidas humanas de diferentes etnias africanas sustentou a produção colonial e financiou o comércio metropolitano; formas de resistência ativa (Quilombo dos Palmares, sublevações) e cotidiana (sincretismo religioso, preservação de tradições orais e capoeira).',
            'Economia Açucareira vs. Sociedade Mineradora: O açúcar no Nordeste formou uma sociedade rural, patriarcal e estamentalizada ao redor do Engenho; o ciclo do ouro em Minas Gerais gerou dinamismo urbano, proliferação de serviços, crescimento da classe média letrada e integração do comércio interno por meio dos tropeiros.',
            'Movimentos Emancipacionistas: Inconfidência Mineira (1789: liderada pela elite proprietária devedora da Coroa, influenciada pela Independência dos EUA, sem consenso sobre o fim da escravidão) versus Conjuração Baiana / Revolta dos Alfaiates (1798: de base popular negra, livre e escravizada, abertamente abolicionista e defensora da igualdade racial irrestrita).'
          ],
          tips: [
            'Comparação clássica no ENEM: A Inconfidência Mineira tinha recorte social elitista e não pretendia abolir a escravidão; a Conjuração Baiana tinha base popular e exigia a abolição imediata da escravidão e o fim do preconceito racial.'
          ]
        },
        {
          id: 'brasil-imperio-processos',
          title: 'Brasil Império: Independência, Regências, Segundo Reinado e Abolição',
          enemWeight: 'Muito Alta',
          summary: 'A consolidação do Estado monárquico centralizado, a política externa, a expansão da cafeicultura e o processo gradual e excludente de abolição.',
          keyConcepts: [
            'Constituição Outorgada de 1824: Criação do Poder Moderador privativo do Imperador D. Pedro I (intervenção sobre Executivo, Legislativo e Judiciário), voto censitário baseado em renda e controle da Igreja pelo Estado (regime do padroado).',
            'Período Regencial (1831–1840): Instabilidade política com disputas entre liberais e conservadores e eclosão de revoltas provinciais (Cabanagem no Pará, Balaiada no Maranhão, Farroupilha no Rio Grande do Sul e Revolta dos Malês em Salvador com escravizados muçulmanos letrados).',
            'Economia Cafeeira e Lei de Terras de 1850: O café no Vale do Paraíba (escravista e predatório) e no Oeste Paulista (terra roxa fértil e introdução da mão de obra imigrante assalariada). A Lei de Terras de 1850 determinou que terras públicas só poderiam ser adquiridas por compra em leilão, barrando o acesso à posse para imigrantes e futuros libertos.',
            'Abolicionismo Tardio e Sem Reparação: Leis paliativas para adiar a ruptura sob pressão britânica (Bill Aberdeen, Lei Eusébio de Queirós em 1850, Ventre Livre em 1871, Sexagenários em 1885 e Lei Áurea em 1888). A abolição não concedeu terras, indenização, educação ou direitos de cidadania aos libertos, consolidando a exclusão socioespacial nas favelas e cortiços.'
          ],
          tips: [
            'A Lei de Terras de 1850 e a Lei Eusébio de Queirós foram aprovadas no mesmo ano: o fim do tráfico negreiro transferiu capitais para a imigração europeia, e a Lei de Terras garantiu que esses trabalhadores estrangeiros fossem forçados a vender sua força de trabalho nas fazendas sem poder se tornarem proprietários autônomos.'
          ]
        },
        {
          id: 'republica-oligarquica-revoltas',
          title: 'República Oligárquica (1889–1930): Coronelismo, Café com Leite e Conflitos Sociais',
          enemWeight: 'Muito Alta',
          summary: 'O domínio político das oligarquias agrárias paulista e mineira, o controle eleitoral do coronelismo e as revoltas messiânicas e urbanas.',
          keyConcepts: [
            'Estrutura de Dominação Política: Coronelismo (poder privado do latifundiário local apoiado no voto de cabresto fraudulento e desprovido de sigilo), Política dos Governadores de Campos Sales (apoio mútuo entre o Presidente da República e os governadores estaduais) e Política do Café com Leite (alternância no poder central entre os estados mais ricos, São Paulo e Minas Gerais).',
            'Mecanismos de Proteção ao Café: Convênio de Taubaté (1906: os governos estaduais compravam e estocavam o excedente da produção cafeeira com empréstimos externos para manter artificialmente os preços internacionais elevados, socializando os prejuízos dos cafeicultores com toda a população).',
            'Revoltas Rurais e Messiânicas: Guerra de Canudos (1896-1897: sertão da Bahia, liderada por Antônio Conselheiro em busca de vida comunitária justa e autônoma, massacrada pelo exército republicano) e Guerra do Contestado (1912-1916: entre SC e PR, pequenos posseiros expulsos pela ferrovia da Brazil Railway Company e madeireiras estrangeiras, liderados pelo monge José Maria).',
            'Revoltas Urbanas no Rio de Janeiro: Revolta da Vacina (1904: reação popular à reforma urbana higienista de Pereira Passos que demoliu cortiços e expulsou os pobres para os morros, somada à obrigatoriedade violenta da vacina contra a varíola coordenada por Oswaldo Cruz) e Revolta da Chibata (1910: marinheiros negros liderados por João Cândido rebelaram-se contra os castigos físicos e chibatadas herdados da época da escravidão na Marinha).',
            'Crise das Oligarquias: Movimento Tenentista dos anos 1920 (defesa do voto secreto e moralização política), Semana de Arte Moderna de 1922 e a Revolução de 1930 que colocou Getúlio Vargas no poder.'
          ],
          tips: [
            'A Revolta da Vacina de 1904 NÃO foi um movimento anti-ciência por ignorância do povo: foi a gota d\'água de uma população excluída que acabara de ser expulsa de suas moradias no "Bota-Abaixo" higienista e teve sua intimidade doméstica invadida à força por agentes sanitários armados.'
          ]
        },
        {
          id: 'era-vargas-nacionalismo',
          title: 'Era Vargas (1930–1945) e Estado Novo',
          enemWeight: 'Muito Alta',
          summary: 'A transição de uma economia agroexportadora para urbano-industrial, a legislação trabalhista, o controle corporativista e a propaganda política autoritária.',
          keyConcepts: [
            'Governo Provisório e Revolução Constitucionalista de 1932: A elite paulista derrotada em 1930 exigia nova Constituição, resultando na Carta de 1934 (voto secreto, voto feminino facultativo e direitos trabalhistas iniciais).',
            'Radicalização Ideológica nos Anos 1930: Ação Integralista Brasileira (AIB: fascismo brasileiro de Plínio Salgado) versus Aliança Nacional Libertadora (ANL: antifascista e socialista de Luís Carlos Prestes).',
            'Estado Novo (1937–1945): Ditadura imposta por Vargas após o forjado Plano Cohen (farsa de suposta insurreição comunista). Fechamento do Congresso, censura prévia de imprensa e rádio pelo DIP (Departamento de Imprensa e Propaganda) e exaltação do nacionalismo cívico.',
            'Trabalhismo e Consolidação das Leis do Trabalho (CLT de 1943): Criação do salário mínimo, férias remuneradas, previdência e jornada diária de 8 horas, articulada à tutela estatal sobre os sindicatos (peleguismo, proibição de greves e criminalização de sindicatos independentes). Industrialização de base com a Companhia Siderúrgica Nacional (CSN) e Vale do Rio Doce.'
          ],
          tips: [
            'No ENEM, Vargas é compreendido pela dialética do "Pai dos Pobres" e "Mãe dos Ricos": ao mesmo tempo em que concedeu direitos reais que melhoraram a vida dos operários urbanos, desmobilizou o potencial revolucionário da classe trabalhadora atrelando-a aos órgãos do Estado autoritário.'
          ]
        },
        {
          id: 'periodo-democratico-populismo',
          title: 'República Populista / Democrática (1945–1964): De Dutra a Jango',
          enemWeight: 'Muito Alta',
          summary: 'A disputa entre o projeto nacional-desenvolvimentista e o liberalismo associado ao capital externo, a construção de Brasília e a crise das Reformas de Base.',
          keyConcepts: [
            'Governo Dutra (1946–1951): Constituição democrática de 1946, alinhamento automático incondicional aos Estados Unidos na Guerra Fria, cassação do Partido Comunista Brasileiro (PCB) e queima de reservas cambiais em importações supérfluas.',
            'Segundo Governo Vargas (1951–1954): Retorno democrático pelo voto popular; nacionalismo econômico estratégico ("O Petróleo é Nosso" e criação da Petrobras em 1953 com monopólio estatal da exploração); intensa oposição midiática da UDN liderada por Carlos Lacerda culminando no atentado da Rua Toneleros e no suicídio de Vargas em agosto de 1954 com sua célebre Carta-Testamento.',
            'Governo Juscelino Kubitschek / JK (1956–1961): Plano de Metas ("50 anos de progresso em 5 de governo"); entrada maciça de multinacionais montadoras de automóveis e priorização do modal rodoviário em detrimento das ferrovias; construção da nova capital federal, Brasília, no Planalto Central; explosão da dívida externa e aceleração da inflação.',
            'Governo João Goulart / Jango (1961–1964): Campanha da Legalidade liderada por Leonel Brizola; breve intervalo parlamentarista (1961-1963); proposta das Reformas de Base (reforma agrária para democratizar a terra, reforma tributária progressiva, bancária e educacional com o método Paulo Freire); reação conservadora das Forças Armadas, empresariado (IPES/IBAD), Igreja e apoio dos EUA (Operação Brother Sam), culminando no Golpe Civil-Militar de 31 de março de 1964.'
          ],
          tips: [
            'O modelo de desenvolvimento rodoviarista de JK atendeu diretamente aos interesses da indústria automobilística transnacional recém-instalada no ABC paulista, o que gerou a dependência crônica do Brasil do transporte de cargas por caminhões e o abandono de linhas férreas ecológicas.'
          ]
        },
        {
          id: 'ditadura-militar-resistencia',
          title: 'Ditadura Civil-Militar (1964–1985) e Redemocratização',
          enemWeight: 'Muito Alta',
          summary: 'A Doutrina de Segurança Nacional, os Atos Institucionais (AI-5), o Milagre Econômico, manifestações artísticas de resistência e a anistia.',
          keyConcepts: [
            'Endurecimento do Regime e AI-5 (1968): Suspensão de garantias constitucionais, cassação de mandatos parlamentares, fechamento do Congresso, institucionalização da tortura política nos órgãos de repressão (DOI-CODI, OBAN) e censura prévia nas redações, teatro e música.',
            'Milagre Econômico (1968–1973): Altas taxas de crescimento anual do PIB impulsionadas por grandes obras faraônicas (Ponte Rio-Niterói, Rodovia Transamazônica, Usina de Itaipu) financiadas por pesados empréstimos de bancos estrangeiros. O ministro Delfim Netto aplicou a política do "fazer o bolo crescer para depois dividir", resultando em arrocho salarial e aumento histórico da desigualdade de renda.',
            'Resistência Cultural e Movimentos Sociais: A Tropicália (Caetano, Gil), músicas de protesto com linguagem conotativa e metáforas para driblar os censores (Chico Buarque com "Cálice" e "Apesar de Você"), movimento estudantil (UNE) e as históricas greves operárias do ABC Paulista no final dos anos 1970 lideradas pelo sindicalismo autônomo.',
            'Transição Negociada e Constituição de 1988: Lei da Anistia de 1979 (anistia mútua aos opositores e agentes estatais da tortura), Campanha das Diretas Já (1984 com comícios de milhões de pessoas exigindo eleições presidenciais diretas) e a eleição indireta de Tancredo Neves. A Constituição Cidadã de 1988 consolidou o Estado Democrático de Direito, o SUS, os direitos dos povos indígenas e a punição ao racismo.'
          ],
          tips: [
            'A palavra "Cálice" na canção de Chico Buarque e Gilberto Gil é um jogo sonoro homófono com a ordem imperativa "Cale-se!", demonstrando como os artistas utilizavam a polissemia da língua portuguesa para denunciar a censura imposta pela ditadura militar.'
          ]
        }
      ]
    },
    {
      id: 'historia-geral',
      title: 'História Geral e Relações Internacionais',
      description: 'Revoluções sociopolíticas, colonialismo, conflitos mundiais do século XX e ordem geopolítica contemporânea.',
      subtopics: [
        {
          id: 'iluminismo-revolucoes-burguesas',
          title: 'Iluminismo, Revolução Industrial e Revolução Francesa',
          enemWeight: 'Muito Alta',
          summary: 'A emergência da modernidade política burguesa, a crítica ao Absolutismo de direito divino e a reestruturação das relações de trabalho pelo maquinofadismo.',
          keyConcepts: [
            'Pensamento Iluminista: Montesquieu (separação tripartite dos poderes Executivo, Legislativo e Judiciário para evitar a tirania), Voltaire (liberdade irrestrita de expressão e tolerância religiosa), Rousseau (Soberania Popular, contrato social e crítica à propriedade privada como fonte da desigualdade) e John Locke (direitos naturais inalienáveis à vida, liberdade e propriedade).',
            'Primeira Revolução Industrial (Inglaterra, séc. XVIII): Máquina a vapor de Newcomen/Watt, tear mecânico e queima de carvão mineral; êxodo rural acelerado pelos cercamentos de terras comuns (*enclosure acts*); surgimento da classe operária proletária submetida a jornadas de 14 a 16 horas sem direitos, trabalho infantil e péssimas condições insalubres de moradia.',
            'Revolução Francesa (1789): Queda da Bastilha, abolição dos privilégios feudais da nobreza e do clero; Declaração dos Direitos do Homem e do Cidadão (liberdade, igualdade perante a lei e direito de resistência à opressão); fases Girondina (alta burguesia moderada) e Jacobina / Terror (radicalismo popular com Robespierre e guilhotina).'
          ],
          tips: [
            'O lema iluminista "Liberdade, Igualdade e Fraternidade" da Revolução Francesa deve ser lido criticamente no ENEM: a igualdade pregada pela burguesia era estritamente JURÍDICA (todos iguais perante a lei), mas convivia deliberadamente com uma profunda desigualdade MATERIAL de classes econômicas.'
          ]
        },
        {
          id: 'imperialismo-guerras-mundiais',
          title: 'Neocolonialismo, Primeira Guerra e Ascensão do Fascismo e Nazismo',
          enemWeight: 'Muito Alta',
          summary: 'A partilha da África e da Ásia justificada pelo darwinismo social racista, o colapso dos impérios na Primeira Guerra e a tragédia do Holocausto.',
          keyConcepts: [
            'Imperialismo / Neocolonialismo (século XIX): Conferência de Berlim (1884-1885) com a partilha arbitrária do continente africano pelas potências europeias em busca de matérias-primas (petróleo, borracha, ferro, carvão) e mercados consumidores para seu excedente industrial. Justificativa ideológica pseudocientífica: "Fardo do Homem Branco" de Rudyard Kipling e o "Darwinismo Social" (ideia falsa de que a civilização branca europeia era biologicamente superior e tinha o dever de civilizar os povos de outras etnias).',
            'Primeira Guerra Mundial (1914–1918): Rivalidades interimperialistas, corrida armamentista da Paz Armada e sistema de alianças secretas (Tríplice Entente vs. Tríplice Aliança); Guerra de Trincheiras com uso de gás venenoso, metralhadoras e tanques; Tratado de Versalhes (1919) que impôs humilhação territorial e pesadíssimas indenizações financeiras à Alemanha, nutrindo o revanchismo que alimentou o nazismo.',
            'Crise de 1929 e Totalitarismos: A Grande Depressão do capitalismo liberal após a quebra da Bolsa de Nova York acelerou a descrença na democracia liberal; ascensão do Fascismo na Itália (Mussolini) e do Nazismo na Alemanha (Hitler): ultranacionalismo exacerbado, culto à personalidade do líder incontestável, militarismo, partido único, anticomunismo virulento e antissemitismo de Estado com o Holocausto (Shoah) que assassinou seis milhões de judeus, ciganos e dissidentes em campos de extermínio industrializados.',
            'Segunda Guerra Mundial (1939–1945): Expansão do Eixo (Alemanha, Itália, Japão); Batalha de Stalingrado como virada definitiva na frente oriental soviética; Dia D na Normandia; término com o lançamento das bombas atômicas dos EUA sobre Hiroshima e Nagasaki em agosto de 1945.'
          ],
          tips: [
            'No ENEM, o conceito de "Fardo do Homem Branco" e o racismo pseudocientífico do século XIX são frequentemente cobrados em contraponto com o princípio contemporâneo dos Direitos Humanos universais e a autonomia dos povos.'
          ]
        },
        {
          id: 'guerra-fria-descolonizacao',
          title: 'Guerra Fria (1947–1991), Bipolaridade e Descolonização da África e Ásia',
          enemWeight: 'Muito Alta',
          summary: 'A divisão ideológica, militar e tecnológica do mundo entre o bloco capitalista e o socialista soviético, e as lutas de libertação nacional.',
          keyConcepts: [
            'Bipolaridade e Dissuasão Nuclear: Disputa hegemônica indireta entre os Estados Unidos (EUA) e a União Soviética (URSS). Doutrina Truman de contenção do comunismo e Plano Marshall de ajuda financeira à reconstrução europeia capitalista; criação da OTAN (aliança militar ocidental) e do Pacto de Varsóvia (bloco soviético). O medo da Destruição Mútua Assegurada (MAD) evitou o confronto militar direto entre as superpotências.',
            'Conflitos Periféricos por Procuração: Guerra da Coreia (1950-1953: divisão no Paralelo 38° em Coreia do Norte comunista e Coreia do Sul capitalista); Guerra do Vietnã (1959-1975: vitória dos guerrilheiros vietcongues e unificação socialista); Crise dos Mísseis em Cuba (1962: o momento mais tenso de iminência de guerra nuclear). Corrida Espacial (satélite Sputnik, cadela Laika, Iuri Gagarin no espaço pela URSS e pouso da Apollo 11 na Lua pelos EUA em 1969).',
            'Descolonização Afro-Asiática: Movimentos de independência nacional após o enfraquecimento das metrópoles europeias no pós-Segunda Guerra. Conferência de Bandung (1955 na Indonésia): nascimento do Movimento dos Países Não-Alinhados ("Terceiro Mundo"), condenação do colonialismo e do racismo. Independência da Índia pela resistência pacífica e não-violência ativa (*Satyagraha*) de Mahatma Gandhi; Guerras violentas de libertação na Argélia contra a França e em Angola e Moçambique contra Portugal.',
            'Fim da União Soviética: Crise econômica gerada pelos gastos militares excessivos; reformas da Glasnost (abertura política e liberdade de imprensa) e Perestroika (reestruturação econômica descentralizada) promovidas por Mikhail Gorbachev; Queda do Muro de Berlim (1989) e desintegração oficial da URSS em dezembro de 1991, inaugurando a Nova Ordem Mundial multipolar.'
          ],
          tips: [
            'A Conferência de Bandung (1955) é um marco no ENEM: representou a tomada de consciência coletiva dos países do Sul Global, que recusaram submeter-se como meros satélites subalternos de Washington ou de Moscou.'
          ]
        }
      ]
    }
  ]
};
