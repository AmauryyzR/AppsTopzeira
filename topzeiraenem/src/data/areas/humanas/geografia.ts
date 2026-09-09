import { Discipline } from '../../../types/curriculum';

export const geografia: Discipline = {
  id: 'geografia',
  name: 'Geografia',
  description: 'Organização do espaço geográfico, dinâmicas demográficas, agrárias, urbanas, geopolítica global, climatologia e matrizes energéticas.',
  topics: [
    {
      id: 'geografia-urbana-industrial',
      title: 'Geografia Urbana, Industrialização e Demografia',
      description: 'Crescimento das cidades, segregação socioespacial, reestruturação produtiva e transição demográfica.',
      subtopics: [
        {
          id: 'urbanizacao-segregacao-socioespacial',
          title: 'Urbanização Brasileira, Metropolização e Gentrificação',
          enemWeight: 'Muito Alta',
          summary: 'O processo acelerado de êxodo rural pós-1950, a formação de regiões metropolitanas e as contradições do espaço urbano.',
          keyConcepts: [
            'Urbanização Rápida e Desordenada: A industrialização concentrada no Sudeste e a mecanização do campo provocaram intenso êxodo rural no Brasil a partir dos anos 1950, transferindo dezenas de milhões de pessoas para as metrópoles sem infraestrutura prévia de moradia, transporte, saneamento ou saúde (Macrocefalia Urbana).',
            'Conurbação: Fenômeno geográfico em que os tecidos urbanos de dois ou mais municípios vizinhos se expandem fisicamente até se fundirem em uma única mancha urbana contínua, demandando políticas integradas de consórcios intermunicipais (transporte público unificado, coleta de lixo, mananciais de água).',
            'Segregação Socioespacial e Favelização: A lógica do mercado imobiliário e a especulação sobre terrenos urbanos dotados de infraestrutura expulsam as populações de menor renda para as periferias desprovidas de serviços e para encostas de morros e várzeas de rios (áreas de risco geológico e ambiental).',
            'Gentrificação: Processo de intervenção urbanística em bairros periféricos ou históricos deteriorados que, ao instalar melhorias cosméticas, shoppings e comércios de alto padrão, provoca a elevação abrupta do custo de vida e do IPTU, expulsando os antigos moradores tradicionais de baixa renda para regiões ainda mais distantes.'
          ],
          tips: [
            'No ENEM, "gentrificação" não é tratada como simples "revitalização" positiva: a banca quase sempre aborda o seu efeito colateral perverso de expulsão social indireta dos moradores originais menos abastados pelo aumento do custo do solo urbano.'
          ]
        },
        {
          id: 'modelos-produtivos-reestruturacao',
          title: 'Modelos de Produção Industrial: Taylorismo, Fordismo e Toyotismo',
          enemWeight: 'Muito Alta',
          summary: 'A evolução da organização do trabalho fabril, da produção rígida em massa à flexibilização e terceirização do mundo do trabalho contemporâneo.',
          keyConcepts: [
            'Taylorismo / Fordismo (Primeira Metade do Séc. XX): Produção em massa seriada e padronizada de mercadorias idênticas; linha de montagem com esteira rolante mecânica; operário ultraespecializado que repete um único movimento mecânico alienado (retratado no filme *Tempos Modernos* de Charles Chaplin); grandes estoques de segurança reguladores; política de salários que permitiam aos próprios operários consumirem o que produziam.',
            'Toyotismo / Acumulação Flexível (Pós-década de 1970): Nascido no Japão pós-guerra sob restrição de espaço e matérias-primas. Sistema *Just-in-Time* (produção puxada pela demanda real, sem estoques ociosos caros); controle de qualidade total com defeito zero; trabalhador multifuncional / polivalente que opera várias máquinas ao mesmo tempo e participa de círculos de controle de qualidade.',
            'Impactos no Mundo do Trabalho: Redução de postos formais de trabalho com carteira assinada, expansão da terceirização, pejotização, precarização e uberização (trabalho por plataformas digitais sob falsa promessa de empreendedorismo autônomo, sem garantias de previdência, férias ou jornada limite).'
          ],
          tips: [
            'Diferença crucial para o ENEM: O Fordismo estocava mercadorias aos milhões para baratear o custo unitário; o Toyotismo elimina totalmente os estoques, produzindo somente o que já está previamente encomendado e vendido (*Just-in-Time*).'
          ]
        },
        {
          id: 'transicao-demografica-envelhecimento',
          title: 'Demografia Brasileira: Transição Demográfica, Bônus e Envelhecimento',
          enemWeight: 'Muito Alta',
          summary: 'A dinâmica populacional brasileira, a redução drástica da taxa de fecundidade e o desafio previdenciário do envelhecimento.',
          keyConcepts: [
            'Fases da Transição Demográfica no Brasil: 1ª Fase (alta natalidade e alta mortalidade, crescimento lento); 2ª Fase (pós-1940: queda acentuada da mortalidade devido ao saneamento, antibióticos e vacinas, enquanto a natalidade permaneceu alta, gerando a "explosão demográfica"); 3ª Fase (a partir dos anos 1970: queda vertiginosa da taxa de fecundidade decorrente da urbanização, entrada maciça da mulher no mercado de trabalho assalariado e popularização de métodos contraceptivos como a pílula); 4ª Fase (estabilização com baixa natalidade e baixa mortalidade, rumo ao crescimento vegetativo nulo ou negativo).',
            'Bônus Demográfico (Janela de Oportunidade): Período em que a proporção de População em Idade Ativa (PIA, entre 15 e 64 anos) é superior à proporção de dependentes (crianças de 0 a 14 anos e idosos com mais de 65 anos). Momento ideal para investimentos pesados em educação de qualidade, ciência e infraestrutura.',
            'Envelhecimento Populacional e Pirâmide Etária: Estreitamento da base da pirâmide (menos crianças nascendo) e alargamento contínuo do topo (aumento da expectativa de vida para além dos 75 anos). Desafios: sustentabilidade financeira da Previdência Social e maior demanda por serviços geriátricos especializados do SUS.'
          ],
          tips: [
            'A taxa de fecundidade no Brasil caiu de mais de 6 filhos por mulher na década de 1960 para menos de 1,6 na atualidade, situando-se abaixo da taxa de reposição populacional mínima (que é de 2,1 filhos por mulher).'
          ]
        }
      ]
    },
    {
      id: 'geografia-agraria-energia',
      title: 'Espaço Agrário, Conflitos de Terra e Matrizes Energéticas',
      description: 'Estrutura fundiária no Brasil, agronegócio vs. agricultura familiar, e a transição global para fontes renováveis.',
      subtopics: [
        {
          id: 'estrutura-fundiaria-agronegocio',
          title: 'Estrutura Fundiária Brasileira, Agronegócio de Commodities e Agricultura Familiar',
          enemWeight: 'Muito Alta',
          summary: 'A histórica concentração de terras originária das sesmarias e da Lei de 1850, o avanço da fronteira agrícola sobre o Cerrado e a Amazônia e os conflitos no campo.',
          keyConcepts: [
            'Índice de Gini e Concentração de Terras: O Brasil possui uma das estruturas fundiárias mais desiguais do planeta: os latifúndios (propriedades com mais de 1.000 hectares), que representam menos de 1% do total de propriedades rurais, ocupam quase metade de toda a área agricultável do país.',
            'Agronegócio (*Agribusiness*): Modelo de alta intensidade de capital, altamente mecanizado e biotecnológico (sementes transgênicas, fertilizantes sintéticos, GPS agrícola e uso massivo de agrotóxicos/defensivos químicos). Focado em monoculturas de exportação (commodities como soja, milho, carne bovina e cana-de-açúcar) voltadas para a balança comercial e o mercado asiático/europeu.',
            'Agricultura Familiar e Camponesa: Menores propriedades policultoras que empregam a esmagadora maioria da mão de obra rural do país e são responsáveis pelo abastecimento direto de cerca de 70% dos alimentos frescos consumidos na mesa dos brasileiros (arroz, feijão, mandioca, leite, hortaliças, ovos e frutas).',
            'Conflitos no Campo e Fronteira Agrícola: O avanço do agronegócio na região do Matopiba (Maranhão, Tocantins, Piauí e Bahia) e no arco do desmatamento amazônico pressiona terras indígenas demarcadas, reservas extrativistas e territórios quilombolas tradicionais, gerando grilagem de terras públicas e violência contra defensores ambientais.'
          ],
          tips: [
            'Contraste chave no ENEM: O agronegócio gera superávits na balança comercial exportando grãos brutos não processados, mas a agricultura familiar é a verdadeira garantidora da soberania e segurança alimentar da população nas cidades brasileiras.'
          ]
        },
        {
          id: 'fontes-energia-matriz-brasileira-global',
          title: 'Fontes de Energia, Matriz Energética Brasileira e Transição Sustentável',
          enemWeight: 'Muito Alta',
          summary: 'A comparação crucial entre a matriz energética (toda a energia) e elétrica (geração de eletricidade), e a transição para descarbonização.',
          keyConcepts: [
            'Matriz Energética vs. Matriz Elétrica: A matriz energética engloba todos os usos de energia (transportes, indústrias, aquecimento e eletricidade); a matriz elétrica refere-se exclusivamente à eletricidade que chega na tomada.',
            'Matriz Elétrica Brasileira (Altamente Renovável, >80%): Predomínio das Usinas Hidrelétricas (~60%), seguida por energia eólica (parques no litoral do Nordeste com ventos constantes), biomassa (queima do bagaço da cana-de-açúcar) e energia solar fotovoltaica. Fragilidade: a dependência hídrica expõe o país a crises de abastecimento durante secas severas, exigindo o acionamento de usinas termoelétricas fósseis caras e poluentes (bandeiras tarifárias vermelhas na conta de luz).',
            'Matriz Energética Mundial (Altamente Fóssil, ~80%): Dependência crônica de combustíveis fósseis não renováveis e poluentes: Petróleo (transportes), Carvão Mineral (indústria e geração elétrica na China e Índia, o mais emissor de gases estufa) e Gás Natural.',
            'Transição Energética e Descarbonização: Compromisso global de substituição gradativa dos fósseis por fontes de emissão zero (eólica, solar, hidrogênio verde) para conter o aquecimento global abaixo de $1,5^\circ\text{C}$ conforme metas do Acordo de Paris.'
          ],
          tips: [
            'Cuidado para não confundir na prova: A matriz ELÉTRICA do Brasil é limpa e predominantemente renovável (graças aos rios de planalto caudalosos e vento nordestino). No entanto, a matriz ENERGÉTICA do Brasil ainda utiliza cerca de 50% de fontes não-renováveis devido ao consumo massivo de diesel e gasolina nos transportes rodoviários!'
          ]
        }
      ]
    },
    {
      id: 'cartografia-climatologia',
      title: 'Cartografia, Fusos Horários e Climatologia Dinâmica',
      description: 'Projeções cartográficas, coordenadas geográficas, fusos horários brasileiros e dinâmica das massas de ar.',
      subtopics: [
        {
          id: 'projecoes-cartograficas-fusos',
          title: 'Projeções Cartográficas, Escalas e Fusos Horários do Brasil',
          enemWeight: 'Alta',
          summary: 'A leitura ideológica das projeções cilíndricas e o cálculo de horários entre diferentes longitudes no território nacional.',
          keyConcepts: [
            'Toda Projeção Cartográfica é uma Deformação: É matematicamente impossível transferir uma superfície esférica tridimensional (a Terra) para um plano bidimensional (o mapa) sem distorcer ângulos, distâncias ou áreas.',
            'Projeção Conforme de Mercator (1569): Preserva fielmente as formas dos continentes e os ângulos para navegação marítima, mas distorce enormemente as áreas nas altas latitudes. Eurocêntrica: faz a Europa e a Groenlândia parecerem gigantescas em comparação com a África e o Brasil.',
            'Projeção Equivalente de Peters (1973): Preserva a proporção real das áreas territoriais relativas, embora deforme (alongue verticalmente) a forma dos continentes. Conhecida como projeção do "Terceiro Mundo" por dar o devido destaque visual aos países do Sul Global (África e América do Sul).',
            'Fusos Horários e Sistema GMT/UTC: A Terra gira $360^\\circ$ em 24 horas, portanto cada fuso horário possui $15^\\circ$ de longitude ($360 / 24 = 15^\\circ$). A LESTE as horas aumentam ($+1\\text{ h}$ a cada $15^\\circ$); a OESTE as horas diminuem ($-1\\text{ h}$).',
            'Os 4 Fusos Horários do Brasil (todos a oeste de Greenwich): 1) Fuso $-2\\text{ h}$ (Ilhas oceânicas: Fernando de Noronha, Atol das Rocas); 2) Fuso $-3\\text{ h}$ (Horário Oficial de Brasília: abrange as regiões Nordeste, Sudeste, Sul e partes do Norte e Centro-Oeste); 3) Fuso $-4\\text{ h}$ (Mato Grosso, Mato Grosso do Sul, Rondônia, Roraima e leste do Amazonas); 4) Fuso $-5\\text{ h}$ (Estado do Acre e oeste do Amazonas).'
          ],
          tips: [
            'Problema clássico de fuso no ENEM: Um avião parte de Brasília (fuso -3h) às 14h com destino a Rio Branco/Acre (fuso -5h), em um voo de 3 horas de duração. Que horas serão no Acre quando o avião pousar? Cálculo: $14\\text{ h} + 3\\text{ h (tempo de voo)} = 17\\text{ h no fuso de partida}$. Ajuste de fuso: o Acre está 2 horas ATRÁS de Brasília, logo $17\\text{ h} - 2\\text{ h} = 15\\text{ h}$ locais no Acre!'
          ]
        },
        {
          id: 'climas-brasil-massas-ar-impactos',
          title: 'Climas do Brasil, Dinâmica das Massas de Ar e Fenômenos Ambientais Urbanos',
          enemWeight: 'Muito Alta',
          summary: 'A atuação da mEc e mPa no território brasileiro, El Niño e os fenômenos de Inversão Térmica e Ilhas de Calor.',
          keyConcepts: [
            'Massas de Ar no Brasil: 1) Massa Equatorial Continental (mEc): quente e extremamente úmida (apesar de continental) originada na Amazônia devido à evapotranspiração da floresta ("Rios Voadores"); no verão espalha chuvas por quase todo o país; 2) Massa Polar Atlântica (mPa): fria e úmida, originada na Antártica; no inverno avança pelo interior provocando o fenômeno da Friagem na Amazônia Ocidental e geadas no Sul e Sudeste; 3) Massa Tropical Atlântica (mTa): quente e úmida, provoca chuvas orográficas nas serras do litoral.',
            'Climas Brasileiros: Equatorial (quente e chuvoso o ano todo, baixa amplitude térmica); Tropical Típico / Semiúmido (duas estações bem definidas: verão chuvoso e inverno seco); Semiárido (elevadas temperaturas e chuvas escassas e irregulares com estiagens prolongadas); Subtropical (chuvas bem distribuídas o ano todo e maior amplitude térmica anual, com invernos rigorosos).',
            'Inversão Térmica Urbana: Em madrugadas frias de inverno com pouco vento, o solo resfria rapidamente por irradiação, resfriando a camada de ar logo acima dele. Uma camada de ar quente fica sobreposta a essa camada de ar frio aprisionada no chão, impedindo a convecção vertical natural. Consequência: os poluentes atmosféricos (fumaça de carros e indústrias) ficam concentrados na altura das vias respiratórias da população, multiplicando internações por asma e bronquite.',
            'Ilhas de Calor: Fenômeno térmico em centros de grandes metrópoles onde as temperaturas médias são sensivelmente maiores (até 5 a 10 °C a mais) do que nas áreas rurais ou arborizadas vizinhas, devido à impermeabilização do solo por asfalto, concreto (baixo albedo e alta retenção de calor), escassez de vegetação e queima de combustíveis.'
          ],
          tips: [
            'Rios Voadores da Amazônia: A floresta amazônica bombeia para a atmosfera bilhões de litros diários de vapor d\'água através da evapotranspiração vegetal. Esse imenso fluxo de umidade é barrado a oeste pela Cordilheira dos Andes e desviado para o Centro-Oeste, Sudeste e Sul do Brasil, sendo o principal responsável pelas chuvas que abastecem reservatórios hidroelétricos e lavouras nessas regiões.'
          ]
        }
      ]
    }
  ]
};
