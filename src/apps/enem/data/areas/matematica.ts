import { KnowledgeArea } from '../../types/curriculum';

export const matematica: KnowledgeArea = {
  id: 'matematica',
  name: 'Matemática e suas Tecnologias',
  code: 'MT',
  description: 'Raciocínio lógico-dedutivo, modelagem de situações reais, geometria plana e espacial, trigonometria, geometria analítica, cálculo algébrico, combinatória e estatística.',
  disciplines: [
    {
      id: 'matematica-geral',
      name: 'Matemática',
      description: 'Competências quantitativas, interpretação de gráficos, geometria espacial, probabilidade e matemática aplicada.',
      topics: [
        {
          id: 'matematica-basica-proporcao',
          title: 'Matemática Básica e Proporcionalidade',
          description: 'O bloco com o maior número de questões no ENEM, responsável pela base de pontuação do TRI.',
          subtopics: [
            {
              id: 'conjuntos-numericos-aritmetica-mmc-mdc',
              title: 'Conjuntos Numéricos, Frações, Notação Científica, MMC e MDC',
              enemWeight: 'Muito Alta',
              summary: 'Operações fundamentais com frações, decimais, potências de 10, critérios de divisibilidade e resolução de problemas práticos de ciclos coincidentes (MMC) e divisão em partes iguais máximas (MDC).',
              keyConcepts: [
                '**Conjuntos Numéricos**: Naturais ($\mathbb{N}$), Inteiros ($\mathbb{Z}$), Racionais ($\mathbb{Q}$, representados como fração $a/b$ com $b \\neq 0$, englobando dízimas periódicas) e Reais ($\mathbb{R}$, união de racionais e irracionais como $\\pi$ e $\\sqrt{2}$).',
                '**Frações e Decimais**: Adição e subtração exigem mesmo denominador; na multiplicação, multiplica-se numerador por numerador e denominador por denominador; na divisão, multiplica-se a primeira pelo inverso da segunda.',
                '**Notação Científica e Ordem de Grandeza**: Expressão na forma $N = a \\cdot 10^k$, com $1 \\le a < 10$ e $k \\in \\mathbb{Z}$. A ordem de grandeza é $10^k$ se $a < \\sqrt{10} \\approx 3{,}16$, e $10^{k+1}$ se $a \\ge 3{,}16$.',
                '**Mínimo Múltiplo Comum** (MMC): Menor múltiplo positivo compartilhado por dois ou mais números. Aplicação típica no ENEM: problemas de eventos periódicos independentes que coincidem no futuro (ex.: dois remédios tomados em intervalos diferentes ou cometas que passam pela Terra periodicamente).',
                '**Máximo Divisor Comum** (MDC): Maior número que divide simultaneamente todos os termos. Aplicação típica no ENEM: cortar fitas, dividir turmas ou empacotar mercadorias em lotes iguais com a maior quantidade possível sem sobras.'
              ],
              formulas: [
                {
                  id: 'notacao-cientifica-formula',
                  name: 'Notação Científica e Dízima Periódica',
                  latex: 'N = a \\cdot 10^k \\; (1 \\le a < 10), \\quad 0{,}a_1 a_2 a_2... = \\frac{\\text{Período}}{99...}',
                  description: 'Padronização de medidas astronômicas ou microscópicas e fração geratriz.'
                },
                {
                  id: 'propriedade-mmc-mdc',
                  name: 'Produto entre MMC e MDC',
                  latex: '\\text{MMC}(a, b) \\cdot \\text{MDC}(a, b) = a \\cdot b',
                  description: 'Relação direta entre dois números inteiros positivos e seus múltiplos e divisores comuns.'
                }
              ],
              tips: [
                'Dica de ouro para o ENEM: Palavras-chave no enunciado! Se o texto fala em "de quanto em quanto tempo voltarão a se encontrar juntos?", use MMC. Se fala em "dividir em pedaços do maior tamanho possível sem desperdício", use MDC.'
              ]
            },
            {
              id: 'teoria-dos-conjuntos-diagramas-venn',
              title: 'Teoria dos Conjuntos, Operações e Diagramas de Venn em Pesquisas de Mercado',
              enemWeight: 'Alta',
              summary: 'As operações de união, interseção, diferença, complementar e o princípio da inclusão-exclusão aplicados à resolução de pesquisas amostrais.',
              keyConcepts: [
                '**Conjuntos e Relações Fundamentais**: Relação de pertinência liga elemento a conjunto ($x \\in A$); relação de inclusão liga subconjunto a conjunto ($A \\subset B$). O conjunto das partes $\\mathcal{P}(A)$ de um conjunto com $n$ elementos possui exatamente $2^n$ subconjuntos.',
                '**Operações Fundamentais com Conjuntos**: 1) **União ($A \\cup B$)**: reúne os elementos que pertencem a $A$ OU a $B$ (conectivo lógico disjuntivo); 2) **Interseção ($A \\cap B$)**: elementos que pertencem simultaneamente a $A$ E a $B$ (conectivo lógico conjuntivo); conjuntos sem elementos comuns ($A \\cap B = \\emptyset$) são chamados de **disjuntos**; 3) **Diferença ($A - B$)**: elementos que pertencem EXCLUSIVAMENTE a $A$ e não pertencem a $B$; 4) **Conjunto Complementar ($A^c$ ou $\\complement_U A$)**: elementos do universo pesquisado $U$ que não pertencem ao conjunto $A$ ($U - A$).',
                '**Princípio da Inclusão-Exclusão para Dois Conjuntos**: Ao calcular o número total de elementos na união de dois grupos, somam-se os totais de cada grupo e desconta-se a interseção contada duas vezes: $n(A \\cup B) = n(A) + n(B) - n(A \\cap B)$.',
                '**Princípio da Inclusão-Exclusão para Três Conjuntos**: $n(A \\cup B \\cup C) = n(A) + n(B) + n(C) - [n(A \\cap B) + n(A \\cap C) + n(B \\cap C)] + n(A \\cap B \\cap C)$.',
                '**Método do Preenchimento de Dentro para Fora no Diagrama de Venn**: Para resolver sem erros questões de pesquisas de audiência ou preferências de consumo: **1º Passo**: preencha sempre a região central da interseção tripla ($A \\cap B \\cap C$); **2º Passo**: preencha as regiões de duas opções subtraindo a tripla central já anotada; **3º Passo**: preencha as regiões de preferência exclusiva subtraindo todas as interseções correspondentes; **4º Passo**: lembre-se de contabilizar os entrevistados que não escolheram nenhuma opção fora dos círculos.'
              ],
              formulas: [
                {
                  id: 'inclusao-exclusao-dois-formula',
                  name: 'Princípio da Inclusão-Exclusão para Dois Conjuntos',
                  latex: 'n(A \\cup B) = n(A) + n(B) - n(A \\cap B)',
                  description: 'Evita a contagem duplicada da interseção de elementos que pertencem a ambos os grupos.',
                  variables: [
                    { symbol: 'n(A \\cup B)', meaning: 'Número de elementos na união', unit: '-' },
                    { symbol: 'n(A)', meaning: 'Total de elementos no conjunto A', unit: '-' },
                    { symbol: 'n(B)', meaning: 'Total de elementos no conjunto B', unit: '-' },
                    { symbol: 'n(A \\cap B)', meaning: 'Total de elementos simultâneos em A e B', unit: '-' }
                  ]
                },
                {
                  id: 'inclusao-exclusao-tres-formula',
                  name: 'Princípio da Inclusão-Exclusão para Três Conjuntos',
                  latex: 'n(A \\cup B \\cup C) = n(A) + n(B) + n(C) - [n(A \\cap B) + n(B \\cap C) + n(A \\cap C)] + n(A \\cap B \\cap C)',
                  description: 'Fórmula completa para contagem em pesquisas com três opções simultâneas.'
                }
              ],
              tips: [
                'Cuidado com as pegadinhas semânticas do ENEM: Há uma diferença colossal entre "120 pessoas leem o jornal A" e "120 pessoas leem APENAS o jornal A". No primeiro caso, os 120 englobam quem lê outros jornais juntos; no segundo caso, trata-se de um valor exclusivo que não sofre subtração das interseções!'
              ]
            },
            {
              id: 'razoes-proporcoes-regra-tres',
              title: 'Razão, Proporção e Regra de Três Simples e Composta',
              enemWeight: 'Muito Alta',
              summary: 'O conceito de razão como quociente entre duas grandezas de mesma ou de naturezas distintas (como velocidade média, densidade demográfica e consumo específico). A proporção estabelece a igualdade entre duas razões e fundamenta regras de três diretas e inversas.',
              keyConcepts: [
                '**Grandezas Diretamente Proporcionais**: Quando o aumento de uma acarreta o aumento da outra na mesma razão ($y/x = k$).',
                '**Grandezas Inversamente Proporcionais**: Quando o aumento de uma provoca a diminuição da outra na proporção inversa, mantendo constante o seu produto ($x \\cdot y = k$).',
                '**Propriedade Fundamental das Proporções**: Em toda proporção, o produto dos extremos é rigorosamente igual ao produto dos meios ($a/b = c/d \\iff a \\cdot d = b \\cdot c$).',
                '**Divisão em Partes Proporcionais**: Repartição de um valor total em parcelas diretamente ou inversamente proporcionais a coeficientes ponderados.'
              ],
              formulas: [
                {
                  id: 'proporcao-fundamental',
                  name: 'Propriedade Fundamental das Proporções',
                  latex: '\\frac{a}{b} = \\frac{c}{d} \\iff a \\cdot d = b \\cdot c',
                  description: 'Igualdade entre o produto dos extremos e o produto dos meios.'
                },
                {
                  id: 'densidade-demografica',
                  name: 'Razões Cotidianas Frequentes',
                  latex: 'D_{\\text{demográfica}} = \\frac{\\text{População}}{\\text{Área}}, \\quad C_{\\text{médio}} = \\frac{\\text{Distância (km)}}{\\text{Volume de Combustível (L)}}',
                  description: 'Modelagem direta de problemas práticos de geografia e economia através de razões.'
                }
              ],
              tips: [
                'Na Regra de Três Composta, identifique sempre a grandeza incógnita como referência e avalie individualmente se cada uma das outras grandezas é direta ou inversamente proporcional a ela antes de montar a equação.'
              ]
            },
            {
              id: 'porcentagem-financeira',
              title: 'Porcentagem, Acréscimos, Descontos e Juros',
              enemWeight: 'Muito Alta',
              summary: 'Cálculo ágil de variações percentuais através de fatores multiplicativos, reajustes sucessivos e a distinção entre regimes de juros simples e juros compostos.',
              keyConcepts: [
                '**Fator Multiplicativo**: Um aumento de $i\\%$ corresponde a multiplicar o valor inicial por $(1 + i)$; um desconto de $i\\%$ corresponde a multiplicar por $(1 - i)$.',
                '**Aumentos e Descontos Sucessivos**: Multiplicam-se os fatores sucessivos; dois aumentos seguidos de $10\\%$ não equivalem a $20\\%$, mas sim a $(1{,}10) \\times (1{,}10) = 1{,}21$ (aumento real de $21\\%$)!',
                '**Juros Simples**: A taxa de juros incide sempre e unicamente sobre o capital principal inicial ($J = C \\cdot i \\cdot t$), gerando crescimento estritamente linear.',
                '**Juros Compostos**: Os juros de cada período são incorporados ao saldo, e a taxa incide sobre o montante acumulado anterior ("juros sobre juros"), gerando crescimento estritamente exponencial ($M = C \\cdot (1 + i)^t$).'
              ],
              formulas: [
                {
                  id: 'fator-multiplicativo-formula',
                  name: 'Fator de Atualização Percentual',
                  latex: 'V_{\\text{final}} = V_{\\text{inicial}} \\cdot (1 \\pm i)',
                  description: 'Cálculo direto de acréscimo (+i) ou desconto (-i) sem necessidade de regras de três intermediárias.'
                },
                {
                  id: 'juros-simples-formula',
                  name: 'Regime de Juros Simples',
                  latex: 'J = C \\cdot i \\cdot t, \\quad M = C + J = C \\cdot (1 + i \\cdot t)',
                  description: 'Rendimento linear proporcional ao tempo decorrido.',
                  variables: [
                    { symbol: 'J', meaning: 'Juros acumulados', unit: 'R$' },
                    { symbol: 'C', meaning: 'Capital inicial aplicado', unit: 'R$' },
                    { symbol: 'i', meaning: 'Taxa periódica decimal', unit: '-' },
                    { symbol: 't', meaning: 'Número de períodos de tempo', unit: '-' }
                  ]
                },
                {
                  id: 'juros-compostos-formula',
                  name: 'Montante em Juros Compostos',
                  latex: 'M = C \\cdot (1 + i)^t',
                  description: 'Cálculo de capitalização exponencial com juros compostos periódicos.',
                  variables: [
                    { symbol: 'M', meaning: 'Montante final acumulado', unit: 'R$' },
                    { symbol: 'C', meaning: 'Capital inicial', unit: 'R$' },
                    { symbol: 'i', meaning: 'Taxa periódica decimal', unit: '-' },
                    { symbol: 't', meaning: 'Tempo de aplicação na mesma unidade da taxa', unit: '-' }
                  ]
                }
              ],
              tips: [
                'Para converter porcentagem para decimal: $15\\% = 0{,}15$; $3{,}5\\% = 0{,}035$. Cuidado para não errar a vírgula!',
                'Sempre certifique-se de que a taxa de juros $i$ e o tempo $t$ estejam expressos na MESMA unidade temporal (ambos ao mês ou ambos ao ano).'
              ]
            },
            {
              id: 'matematica-financeira-amortizacao',
              title: 'Matemática Financeira: Sistemas de Amortização (SAC e Price) e Inflação',
              enemWeight: 'Alta',
              summary: 'A composição das parcelas em empréstimos bancários, comparação dinâmica entre as tabelas SAC e Price, e cálculo da taxa real de juros descontada a inflação.',
              keyConcepts: [
                '**Estrutura Básica da Prestação de Financiamento**: Em qualquer sistema de amortização, cada prestação periódica ($P$) é composta pela soma de duas parcelas fundamentais: a **Amortização** ($A$, restituição efetiva do capital principal emprestado que reduz o saldo devedor) e os **Juros** ($J$, remuneração do banco calculada sobre o saldo devedor remanescente do período anterior): $P_k = A_k + J_k$.',
                '**Sistema de Amortização Constante (SAC)**: O valor da amortização do principal é RIGOROSAMENTE IDÊNTICO em todas as $n$ parcelas: $A = \\frac{C}{n}$. Como a cada mês o saldo devedor diminui em uma quantia fixa, os juros incidentes sobre o saldo diminuem mês a mês. Consequência: as **prestações são estritamente DECRESCENTES** ao longo do tempo (a primeira parcela é a mais alta e a última é a mais barata). É o sistema padrão utilizado em financiamentos imobiliários habitacionais de longo prazo no Brasil.',
                '**Sistema Francês de Amortização (Tabela Price)**: Caracterizado por **prestações periódicas RIGOROSAMENTE IGUAIS e constantes** ($P_1 = P_2 = \\dots = P_n$). Na primeira parcela, o saldo devedor é máximo, logo a maior parte do valor pago é consumida por juros e a cota de amortização do principal é minúscula. Ao longo dos meses, os juros decrescem e a amortização cresce exponencialmente. Muito utilizado no comércio, crediários de lojas e financiamento de veículos automotores.',
                '**Inflação, Valor Nominal e Poder de Compra**: A inflação é o aumento generalizado e contínuo no nível de preços de uma economia, provocando a perda do poder aquisitivo da moeda. O **Valor Nominal** expressa o valor de face numérico em reais; o **Valor Real** expressa a quantidade concreta de bens e serviços que esse dinheiro compra, descontada a inflação acumulada.',
                '**Taxa Real de Juros (Equação de Fisher)**: Se uma aplicação rende taxa aparente nominal $i_{\\text{aparente}}$ e a inflação do período foi $I_{\\text{inflação}}$, o rendimento real ganho $i_{\\text{real}}$ NÃO é a simples subtração $(i_{\\text{aparente}} - I_{\\text{inflação}})$, mas sim a relação exata: $(1 + i_{\\text{aparente}}) = (1 + i_{\\text{real}}) \\cdot (1 + I_{\\text{inflação}})$.'
              ],
              formulas: [
                {
                  id: 'sac-prestacao-formula',
                  name: 'Amortização e Prestação no Sistema SAC',
                  latex: 'A = \\frac{C}{n}, \\quad J_k = i \\cdot S_{k-1}, \\quad P_k = A + J_k',
                  description: 'No SAC a amortização é fixa e a prestação Pk diminui linearmente a cada mês k.',
                  variables: [
                    { symbol: 'A', meaning: 'Cota de amortização fixa mensal', unit: 'R$' },
                    { symbol: 'C', meaning: 'Capital inicial financiado', unit: 'R$' },
                    { symbol: 'n', meaning: 'Número total de meses/parcelas', unit: '-' },
                    { symbol: 'J_k', meaning: 'Juros cobrados na parcela k', unit: 'R$' },
                    { symbol: 'S_{k-1}', meaning: 'Saldo devedor do mês imediatamente anterior', unit: 'R$' },
                    { symbol: 'P_k', meaning: 'Valor total da prestação k', unit: 'R$' }
                  ]
                },
                {
                  id: 'fisher-taxa-real',
                  name: 'Equação de Fisher para Taxa Real de Juros',
                  latex: '1 + i_{\\text{real}} = \\frac{1 + i_{\\text{aparente}}}{1 + I_{\\text{inflação}}}',
                  description: 'Cálculo do ganho de poder de compra real descontando a inflação.'
                }
              ],
              tips: [
                'Comparação clássica no ENEM: Em um mesmo prazo e taxa de juros, o SAC tem parcelas iniciais mais pesadas, mas amortiza a dívida mais depressa, resultando em um MONTANTE TOTAL DE JUROS MENOR pago ao final do contrato em comparação com a Tabela Price.'
              ]
            },
            {
              id: 'escalas-conversao',
              title: 'Escalas Cartográficas e Conversão de Unidades Métricas',
              enemWeight: 'Muito Alta',
              summary: 'A razão de semelhança entre comprimentos no mapa e no mundo real, e a propagação de potências para conversão de áreas e volumes.',
              keyConcepts: [
                '**Escala Linear** ($E$): Razão adimensional dada por $E = \\frac{d}{D}$, onde $d$ é a distância no desenho e $D$ é a distância real medida na mesma unidade.',
                '**Escala de Áreas** ($E^2$): A relação entre a área na planta e a área real corresponde ao quadrado da escala linear: $\\frac{A_{\\text{mapa}}}{A_{\\text{real}}} = E^2 = \\left( \\frac{d}{D} \\right)^2$.',
                '**Escala de Volumes** ($E^3$): A relação entre o volume em uma maquete e o volume real corresponde ao cubo da escala: $\\frac{V_{\\text{maquete}}}{V_{\\text{real}}} = E^3$.',
                '**Conversão de Capacidade e Volume**: $1 \\text{ m}^3 = 1000 \\text{ L}$, $1 \\text{ dm}^3 = 1 \\text{ L}$ e $1 \\text{ cm}^3 = 1 \\text{ mL}$.'
              ],
              formulas: [
                {
                  id: 'escala-linear',
                  name: 'Escala Cartográfica Linear',
                  latex: 'E = \\frac{d}{D} = \\frac{\\text{distância no mapa}}{\\text{distância no terreno real}}',
                  description: 'Ambas as medidas devem obrigatoriamente estar convertidas para a mesma unidade (geralmente centímetros).'
                },
                {
                  id: 'escala-potencias',
                  name: 'Escala para Áreas e Volumes',
                  latex: '\\frac{A_{\\text{desenho}}}{A_{\\text{real}}} = E^2, \\quad \\frac{V_{\\text{modelo}}}{V_{\\text{real}}} = E^3',
                  description: 'Ajuste de proporcionalidade dimensional para superfícies bidimensionais e sólidos tridimensionais.'
                }
              ],
              tips: [
                'Pegadinha campeã no ENEM: Se um mapa tem escala $1:50.000$, $1 \\text{ cm}$ no mapa representa $50.000 \\text{ cm} = 500 \\text{ m} = 0{,}5 \\text{ km}$. Uma área de $2 \\text{ cm}^2$ no mapa representará $2 \\times (500 \\text{ m})^2 = 2 \\times 250.000 \\text{ m}^2 = 500.000 \\text{ m}^2 = 0{,}5 \\text{ km}^2$. Nunca multiplique a área pela escala simples linear!'
              ]
            }
          ]
        },
        {
          id: 'funcoes-algebra',
          title: 'Álgebra, Funções e Sequências',
          description: 'Modelagem de comportamentos por funções polinomiais, exponenciais, logarítmicas e progressões.',
          subtopics: [
            {
              id: 'funcao-afim',
              title: 'Função Afim (1º Grau) e Taxa de Variação',
              enemWeight: 'Muito Alta',
              summary: 'Modela situações de crescimento ou decrescimento a uma taxa constante, gerando gráficos de linhas retas no plano cartesiano.',
              keyConcepts: [
                '**Lei de Formação**: $f(x) = a \\cdot x + b$, onde $a$ é o coeficiente angular (declividade da reta) e $b$ é o coeficiente linear (ponto em que a reta intercepta o eixo $y$, quando $x=0$).',
                '**Interpretação Econômica**: Em planos de telefonia ou corridas de táxi, $b$ representa a taxa fixa (bandeirada) e $a$ representa o custo variável por quilômetro rodado ou minuto consumido.',
                '**Crescimento e Decrescimento**: Se $a > 0$, a função é estritamente crescente; se $a < 0$, a função é estritamente decrescente; se $a = 0$, a função é constante.',
                '**Zero ou Raiz da Função**: Valor de $x$ que anula a função ($f(x) = 0$), dado por $x_0 = -\\frac{b}{a}$.'
              ],
              formulas: [
                {
                  id: 'eq-funcao-afim',
                  name: 'Lei Geral da Função Afim',
                  latex: 'f(x) = a \\cdot x + b, \\quad a = \\frac{\\Delta y}{\\Delta x} = \\frac{y_2 - y_1}{x_2 - x_1}',
                  description: 'Equação da reta onde a taxa de variação linear média é constante em qualquer intervalo.'
                }
              ],
              tips: [
                'Para descobrir a lei da função afim a partir de dois pontos do gráfico $(x_1, y_1)$ e $(x_2, y_2)$, determine primeiro a inclinação $a = \\frac{y_2 - y_1}{x_2 - x_1}$ e depois substitua um dos pontos para achar $b$.'
              ]
            },
            {
              id: 'funcao-quadratica',
              title: 'Função Quadrática (2º Grau) e Vértice da Parábola',
              enemWeight: 'Muito Alta',
              summary: 'Modela trajetórias parabólicas de projéteis e problemas clássicos de otimização de custo mínimo ou lucro máximo.',
              keyConcepts: [
                '**Lei de Formação**: $f(x) = a \\cdot x^2 + b \\cdot x + c$, com $a \\neq 0$. Seu gráfico é uma parábola de eixo vertical.',
                '**Concavidade**: Se $a > 0$, concavidade voltada para cima (a função possui ponto de MÍNIMO); se $a < 0$, concavidade voltada para baixo (a função possui ponto de MÁXIMO).',
                '**Discriminante Delta** ($\\Delta = b^2 - 4ac$): Se $\\Delta > 0$, duas raízes reais distintas; se $\\Delta = 0$, uma raiz real dupla tangenciando o eixo $x$; se $\\Delta < 0$, nenhuma raiz real.',
                '**Vértice da Parábola** ($x_v, y_v$): O $x_v = -\\frac{b}{2a}$ indica a quantidade que gera o valor ótimo (ex.: "quantas peças produzir para maximizar o lucro"); o $y_v = -\\frac{\\Delta}{4a}$ fornece o próprio valor extremo ótimo alcançado (ex.: "qual é o lucro máximo obtido").'
              ],
              formulas: [
                {
                  id: 'formula-bhaskara',
                  name: 'Fórmula de Bhaskara para Raízes',
                  latex: 'x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}, \\quad \\Delta = b^2 - 4 \\cdot a \\cdot c',
                  description: 'Determina os pontos de interseção da parábola com o eixo horizontal das abscissas.'
                },
                {
                  id: 'coordenadas-vertice',
                  name: 'Coordenadas do Vértice da Parábola (Ponto Crítico)',
                  latex: 'x_v = -\\frac{b}{2a}, \\quad y_v = -\\frac{\\Delta}{4a} = f(x_v)',
                  description: 'Ponto culminante de máximo (a < 0) ou de mínimo (a > 0).'
                }
              ],
              tips: [
                'Atenção ao enunciado da questão: Se ele perguntar "quantos produtos devem ser vendidos para o lucro ser máximo?", a resposta é $x_v$. Se ele perguntar "qual é o valor do lucro máximo atingido?", a resposta é $y_v$.'
              ]
            },
            {
              id: 'exponencial-logaritmos',
              title: 'Função Exponencial e Propriedades dos Logaritmos',
              enemWeight: 'Alta',
              summary: 'Descreve processos de crescimento descontrolado (bactérias, contágio viral, juros) ou decaimento radioativo e escalas sismológicas (Richter) e acústicas (Decibéis).',
              keyConcepts: [
                '**Função Exponencial**: $f(x) = a^x$ (com $a > 0$ e $a \\neq 1$). Se $a > 1$, crescimento exponencial acelerado; se $0 < a < 1$, decaimento exponencial.',
                '**Definição de Logaritmo**: $\\log_b(a) = x \\iff b^x = a$, onde $a > 0$ (logaritmando) e $b > 0, b \\neq 1$ (base).',
                '**Propriedades Operatórias**: Logaritmo do produto vira soma ($\\log(x \\cdot y) = \\log x + \\log y$); logaritmo da divisão vira subtração ($\\log(x/y) = \\log x - \\log y$); regra da potência/tombo ($\\log(x^k) = k \\cdot \\log x$).',
                '**Mudança de Base**: $\\log_b(a) = \\frac{\\log_c(a)}{\\log_c(b)}$, permitindo calcular logaritmos em qualquer base na base decimal.'
              ],
              formulas: [
                {
                  id: 'definicao-log',
                  name: 'Definição e Mudança de Base do Logaritmo',
                  latex: '\\log_b(a) = c \\iff b^c = a, \\quad \\log_b(a) = \\frac{\\log_{10}(a)}{\\log_{10}(b)}',
                  description: 'Operação inversa da exponenciação.'
                },
                {
                  id: 'propriedades-log',
                  name: 'Propriedades Operatórias dos Logaritmos',
                  latex: '\\log(u \\cdot v) = \\log u + \\log v, \\quad \\log\\left(\\frac{u}{v}\\right) = \\log u - \\log v, \\quad \\log(u^k) = k \\cdot \\log u',
                  description: 'Regras fundamentais para simplificação de equações logarítmicas e exponenciais.'
                }
              ],
              tips: [
                'O ENEM costuma fornecer valores aproximados nos dados da questão como $\\log 2 \\approx 0{,}30$ e $\\log 3 \\approx 0{,}48$. Para calcular $\\log 5$, use a identidade $\\log 5 = \\log(10/2) = \\log 10 - \\log 2 = 1 - 0{,}30 = 0{,}70$.'
              ]
            },
            {
              id: 'progressoes-pa-pg',
              title: 'Progressão Aritmética (PA) e Progressão Geométrica (PG)',
              enemWeight: 'Média',
              summary: 'Sequências numéricas com taxa de incremento aditiva constante (PA) ou multiplicativa constante (PG).',
              keyConcepts: [
                '**Progressão Aritmética** (PA): Cada termo após o primeiro é igual ao anterior somado a uma razão constante $r$ ($a_n = a_{n-1} + r$).',
                '**Termo Geral da PA**: $a_n = a_1 + (n - 1) \\cdot r$.',
                '**Soma dos Termos da PA**: A soma dos $n$ primeiros termos é obtida pelo emparelhamento dos extremos (fórmula de Gauss): $S_n = \\frac{(a_1 + a_n) \\cdot n}{2}$.',
                '**Progressão Geométrica** (PG): Cada termo é obtido multiplicando o anterior por uma razão constante $q$ ($a_n = a_1 \\cdot q^{n-1}$).',
                '**Soma de PG Infinita Convergente**: Se a razão estiver entre $-1 < q < 1$, a soma de infinitos termos converge para um valor finito: $S_{\\infty} = \\frac{a_1}{1 - q}$.'
              ],
              formulas: [
                {
                  id: 'formulas-pa',
                  name: 'Termo Geral e Soma da PA',
                  latex: 'a_n = a_1 + (n - 1) \\cdot r, \\quad S_n = \\frac{(a_1 + a_n) \\cdot n}{2}',
                  description: 'Cálculo de termos e somatório de sequências com razão aritmética.'
                },
                {
                  id: 'formulas-pg',
                  name: 'Termo Geral e Soma Infinita da PG',
                  latex: 'a_n = a_1 \\cdot q^{n-1}, \\quad S_n = \\frac{a_1(q^n - 1)}{q - 1}, \\quad S_{\\infty} = \\frac{a_1}{1 - q} \\; (|q| < 1)',
                  description: 'Expressões gerais para sequências geométricas finitas e infinitas.'
                }
              ],
              tips: [
                'Em problemas que envolvam três termos consecutivos em PA, é conveniente representá-los como $(x - r, x, x + r)$, pois sua soma anula a razão: $(x - r) + x + (x + r) = 3x$.'
              ]
            }
          ]
        },
        {
          id: 'trigonometria-geometria-analitica',
          title: 'Trigonometria e Geometria Analítica',
          description: 'Razões trigonométricas no triângulo, leis dos senos e cossenos, funções periódicas, distância entre pontos e circunferências.',
          subtopics: [
            {
              id: 'trigonometria-triangulo-leis',
              title: 'Trigonometria: Triângulo Retângulo, Ângulos Notáveis, Leis dos Senos e Cossenos',
              enemWeight: 'Alta',
              summary: 'Determinação de alturas inacessíveis, triangulação de distâncias e cálculo de lados e ângulos em triângulos quaisquer.',
              keyConcepts: [
                '**Razões no Triângulo Retângulo**: Seno ($\\sin\\theta = \\frac{\\text{Cateto Oposto}}{\\text{Hipotenusa}}$), Cosseno ($\\cos\\theta = \\frac{\\text{Cateto Adjacente}}{\\text{Hipotenusa}}$) e Tangente ($\\tan\\theta = \\frac{\\text{Cateto Oposto}}{\\text{Cateto Adjacente}}$).',
                '**Ângulos Notáveis**: $30^\\circ$ ($\nobreak\\sin = 1/2, \\cos = \\sqrt{3}/2, \\tan = \\sqrt{3}/3$), $45^\\circ$ ($\nobreak\\sin = \\cos = \\sqrt{2}/2, \\tan = 1$) e $60^\\circ$ ($\nobreak\\sin = \\sqrt{3}/2, \\cos = 1/2, \\tan = \\sqrt{3}$).',
                '**Lei dos Cossenos**: Generalização do Teorema de Pitágoras para triângulos quaisquer: $a^2 = b^2 + c^2 - 2 \\cdot b \\cdot c \\cdot \\cos\\hat{A}$. Usada quando conhecemos dois lados e o ângulo formado entre eles.',
                '**Lei dos Senos**: Proporcionalidade entre os lados e os senos dos ângulos opostos, igual ao diâmetro da circunferência circunscrita: $\\frac{a}{\\sin\\hat{A}} = \\frac{b}{\\sin\\hat{B}} = \\frac{c}{\\sin\\hat{C}} = 2R$.'
              ],
              formulas: [
                {
                  id: 'lei-dos-cossenos',
                  name: 'Lei dos Cossenos',
                  latex: 'a^2 = b^2 + c^2 - 2 \\cdot b \\cdot c \\cdot \\cos\\hat{A}',
                  description: 'Permite calcular o terceiro lado de qualquer triângulo a partir de dois lados e o ângulo entre eles.'
                },
                {
                  id: 'lei-dos-senos',
                  name: 'Lei dos Senos',
                  latex: '\\frac{a}{\\sin\\hat{A}} = \\frac{b}{\\sin\\hat{B}} = \\frac{c}{\\sin\\hat{C}} = 2R',
                  description: 'Relação entre os lados de um triângulo e o raio R da circunferência que o circunscreve.'
                }
              ],
              tips: [
                'Regra prática para saber qual lei aplicar: Se o problema fornecer DOIS LADOS e UM ÂNGULO intermediário e pedir o terceiro lado $\\rightarrow$ Lei dos Cossenos. Se fornecer DOIS ÂNGULOS e pedir uma relação entre lados $\\rightarrow$ Lei dos Senos.'
              ]
            },
            {
              id: 'funcoes-trigonometricas-periodicas',
              title: 'Funções Trigonométricas Periódicas e Modelagem de Fenômenos Cíclicos',
              enemWeight: 'Média',
              summary: 'Interpretação de funções senoidais e cossenoidais aplicadas a marés, temperatura climática e respiração biológica.',
              keyConcepts: [
                '**Forma Padrão da Função Senoidal**: $f(x) = a + b \\cdot \\sin(c \\cdot x + d)$.',
                '**Parâmetro $a$** (Eixo Central / Média): Deslocamento vertical. A linha média oscilatória é $y = a$.',
                '**Parâmetro $|b|$** (Amplitude): A oscilação máxima para cima e para baixo em torno do eixo médio. O valor MÁXIMO da função é $y_{\\text{máx}} = a + |b|$ e o MÍNIMO é $y_{\\text{mín}} = a - |b|$.',
                '**Parâmetro $c$** (Frequência e Período): O período $T$ (tempo ou distância para completar um ciclo completo de oscilação) é inversamente proporcional a $c$: $T = \\frac{2\\pi}{|c|}$.'
              ],
              formulas: [
                {
                  id: 'periodo-trigonometrico',
                  name: 'Período da Função Seno/Cosseno',
                  latex: 'T = \\frac{2\\pi}{|c|}, \\quad f(x) = a + b \\cdot \\sin(c \\cdot x + d)',
                  description: 'Determina a duração temporal ou espacial de um ciclo oscilatório completo.'
                }
              ],
              tips: [
                'Se uma questão de marés informar que a maré alta ocorre às 3h e a maré baixa ocorre às 9h, o meio-ciclo dura 6 horas, logo o período completo $T$ vale 12 horas. Com isso, $c = \\frac{2\\pi}{12} = \\frac{\\pi}{6}$.'
              ]
            },
            {
              id: 'geometria-analitica-reta-circunferencia',
              title: 'Geometria Analítica: Distância, Ponto Médio, Equação da Reta e Circunferência',
              enemWeight: 'Média',
              summary: 'Mapeamento de coordenadas cartesianas, inclinação de retas, alcance de antenas de transmissão e áreas de cobertura.',
              keyConcepts: [
                '**Vetores no Plano Cartesiano**: Um vetor orientado $\\vec{v} = (x, y)$ determinado por dois pontos $A(x_1, y_1)$ e $B(x_2, y_2)$ é expresso por $\\vec{AB} = B - A = (x_2 - x_1, y_2 - y_1)$. Seu comprimento ou módulo é dado pela norma euclidiana: $|\\vec{v}| = \\sqrt{x^2 + y^2}$. O produto escalar de dois vetores $\\vec{u}$ e $\\vec{v}$ vale $\\vec{u} \\cdot \\vec{v} = |\\vec{u}| \\cdot |\\vec{v}| \\cdot \\cos\\theta = x_u \\cdot x_v + y_u \\cdot y_v$. Dois vetores não nulos são perpendiculares se e somente se seu produto escalar for nulo ($\\vec{u} \\cdot \\vec{v} = 0$).',
                '**Distância entre Dois Pontos**: Aplicação direta do Teorema de Pitágoras no plano cartesiano: $d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$. O ponto médio do segmento é $M = \\left( \\frac{x_1 + x_2}{2}, \\frac{y_1 + y_2}{2} \\right)$.',
                '**Equação Fundamental da Reta**: $y - y_0 = m \\cdot (x - x_0)$, onde $m = \\frac{y_2 - y_1}{x_2 - x_1} = \\tan\\alpha$ é o coeficiente angular.',
                '**Paralelismo e Perpendicularismo**: Duas retas são paralelas se têm a mesma inclinação ($m_1 = m_2$); são perpendiculares se o produto dos seus coeficientes angulares for igual a $-1$ ($m_1 \\cdot m_2 = -1 \\implies m_2 = -\\frac{1}{m_1}$).',
                '**Equação Reduzida da Circunferência**: Descreve o conjunto de todos os pontos $(x, y)$ a uma distância fixa $R$ de um centro $C(a, b)$: $(x - a)^2 + (y - b)^2 = R^2$. Frequentemente aplicada no ENEM para representar o alcance de radares, torres de telefonia móvel e epicentros de abalos sísmicos.'
              ],
              formulas: [
                {
                  id: 'vetor-modulo-cartesiano',
                  name: 'Vetor entre Dois Pontos e Módulo',
                  latex: '\\vec{AB} = (x_B - x_A, y_B - y_A), \\quad |\\vec{AB}| = \\sqrt{(x_B - x_A)^2 + (y_B - y_A)^2}',
                  description: 'Componentes algébricas e módulo (comprimento) do vetor ligando o ponto A ao ponto B.'
                },
                {
                  id: 'distancia-pontos-cartesiano',
                  name: 'Distância entre Dois Pontos no Plano',
                  latex: 'd(A, B) = \\sqrt{(x_B - x_A)^2 + (y_B - y_A)^2}',
                  description: 'Comprimento do segmento que liga o ponto A(xA, yA) ao ponto B(xB, yB).'
                },
                {
                  id: 'eq-circunferencia-analitica',
                  name: 'Equação Reduzida da Circunferência',
                  latex: '(x - a)^2 + (y - b)^2 = R^2',
                  description: 'Circunferência de centro no ponto C(a, b) e raio R.'
                }
              ],
              tips: [
                'Para verificar se um ponto $(x_0, y_0)$ está dentro da área de cobertura de uma antena celular dada por $(x - a)^2 + (y - b)^2 = R^2$, basta substituir as coordenadas do ponto na expressão: se o resultado for MENOR que $R^2$, o ponto está no interior da cobertura.'
              ]
            }
          ]
        },
        {
          id: 'geometria-plana-espacial',
          title: 'Geometria Plana, Espacial e Projeções',
          description: 'Cálculo de superfícies, volumes de sólidos geométricos e visualização tridimensional.',
          subtopics: [
            {
              id: 'areas-figuras-planas',
              title: 'Áreas de Figuras Planas e Teorema de Pitágoras',
              enemWeight: 'Muito Alta',
              summary: 'Cálculo de áreas de triângulos, quadriláteros e círculos para problemas de pavimentação, loteamentos e plantio agrícola.',
              keyConcepts: [
                '**Teorema de Pitágoras**: Em qualquer triângulo retângulo, $a^2 = b^2 + c^2$ (hipotenusa ao quadrado igual à soma dos quadrados dos catetos). Triângulos pitagóricos notáveis: $3-4-5$ e $5-12-13$.',
                '**Área do Triângulo**: Fórmula tradicional ($A = \\frac{b \\cdot h}{2}$), fórmula trigonométrica ($A = \\frac{a \\cdot b \\cdot \\sin \\theta}{2}$) e triângulo equilátero de lado $L$ ($A = \\frac{L^2 \\sqrt{3}}{4}$).',
                '**Círculo e Setor Circular**: Área total $A = \\pi \\cdot r^2$; Comprimento da circunferência $C = 2 \\cdot \\pi \\cdot r$; Área do setor proporcional ao ângulo central $\\alpha$: $A_{\\text{setor}} = \\frac{\\alpha}{360^\\circ} \\cdot \\pi r^2$.',
                '**Trapézio e Losango**: Área do trapézio $A = \\frac{(B + b) \\cdot h}{2}$; Área do losango $A = \\frac{D \\cdot d}{2}$.'
              ],
              formulas: [
                {
                  id: 'teorema-pitagoras',
                  name: 'Teorema de Pitágoras',
                  latex: 'a^2 = b^2 + c^2',
                  description: 'Relação métrica fundamental no triângulo retângulo.'
                },
                {
                  id: 'areas-planas-resumo',
                  name: 'Áreas Fundamentais',
                  latex: 'A_{\\text{círculo}} = \\pi \\cdot r^2, \\quad A_{\\Delta \\text{equilátero}} = \\frac{L^2 \\sqrt{3}}{4}, \\quad A_{\\text{trapézio}} = \\frac{(B + b) \\cdot h}{2}',
                  description: 'Formulário padrão de áreas de maior ocorrência na prova.'
                }
              ],
              tips: [
                'Adote rigorosamente a aproximação de $\\pi$ fornecida no enunciado da questão (frequentemente $\\pi = 3$ ou $\\pi = 3{,}1$ ou $\\pi = 3{,}14$). Não use valores decimais não solicitados.'
              ]
            },
            {
              id: 'geometria-espacial-solidos',
              title: 'Geometria Espacial: Prismas, Cilindros, Pirâmides, Cones, Troncos e Esferas',
              enemWeight: 'Muito Alta',
              summary: 'Cálculo de capacidade volumétrica e áreas superficiais de sólidos geométricos, troncos de cone e pirâmide, copos, reservatórios cônicos e corpos esféricos.',
              keyConcepts: [
                '**Prismas e Cilindros (Sólidos com Seções Transversais Congruentes)**: O volume de qualquer prisma reto ou oblíquo e de qualquer cilindro é dado pelo produto da área da base pela altura: $V = A_{\\text{base}} \\cdot h$. No cilindro circular reto de raio da base $r$ e altura $h$: volume $V = \\pi \\cdot r^2 \\cdot h$, área lateral planificada retangular $A_L = 2\\pi \\cdot r \\cdot h$ e área total $A_T = 2\\pi r (h + r)$. Relações de conversão obrigatórias no ENEM: $1\\text{ m}^3 = 1.000\\text{ litros}$, $1\\text{ dm}^3 = 1\\text{ litro}$ e $1\\text{ cm}^3 = 1\\text{ mL}$.',
                '**Pirâmides e Cones Retos (Sólidos Pontiagudos de Vértice Único)**: O volume corresponde a exatamente um terço do prisma ou cilindro de mesma base e altura: $V = \\frac{1}{3} A_{\\text{base}} \\cdot h$. No cone circular reto: $V = \\frac{1}{3} \\pi \\cdot r^2 \\cdot h$. A geratriz ($g$), o raio da base ($r$) e a altura perpendicular ($h$) formam um triângulo retângulo e obedecem a relação pitagórica: $g^2 = h^2 + r^2$. A planificação da superfície lateral do cone é um **setor circular** de raio $g$ e comprimento de arco $2\\pi r$, cujo ângulo central é $\\theta = 360^\\circ \\cdot \\frac{r}{g}$.',
                '**Tronco de Cone e Tronco de Pirâmide (Copos, Baldes, Vasos e Silos)**: Obtidos ao seccionar o sólido original por um plano paralelo à base e descartar o cone/pirâmide superior menor: 1) **Tronco de Cone Reto**: com raio da base maior $R$, raio da base menor $r$ e altura do tronco $h$, possui volume expresso por $V_{\\text{tronco}} = \\frac{\\pi \\cdot h}{3} (R^2 + R \\cdot r + r^2)$; 2) **Tronco de Pirâmide Regular**: de altura $h$ entre a área da base maior $A_B$ e menor $A_b$, possui volume $V_{\\text{tronco}} = \\frac{h}{3} (A_B + \\sqrt{A_B \\cdot A_b} + A_b)$; 3) **Método por Semelhança de Triângulos**: pode-se também subtrair o volume do sólido superior retirado do total ($V_{\\text{tronco}} = V_{\\text{total}} - V_{\\text{topo}}$), sabendo que a razão de volumes é o cubo da razão de alturas $\\frac{V_{\\text{topo}}}{V_{\\text{total}}} = \\left(\\frac{h_{\\text{topo}}}{H_{\\text{total}}}\\right)^3 = k^3$.',
                '**Esfera e Corpos Esféricos**: Sólido de revolução perfeitamente simétrico de raio $R$. O volume da esfera é $V = \\frac{4}{3} \\pi \\cdot R^3$ e a área da superfície esférica é $A = 4 \\pi \\cdot R^2$. Em uma esfera inscrita em um cubo de aresta $a$, o raio da esfera é $R = a/2$; se a esfera estiver circunscrita ao cubo, o diâmetro da esfera é igual à diagonal principal do cubo ($2R = a\\sqrt{3}$).'
              ],
              formulas: [
                {
                  id: 'volume-cilindro-prisma',
                  name: 'Volume de Cilindros e Prismas Retos',
                  latex: 'V_{\\text{cilindro}} = \\pi \\cdot r^2 \\cdot h, \\quad V_{\\text{prisma}} = A_{\\text{base}} \\cdot h',
                  description: 'Capacidade volumétrica de sólidos de seção transversal uniforme ao longo da altura.',
                  variables: [
                    { symbol: 'V', meaning: 'Volume do sólido geométrico', unit: 'm³ ou L' },
                    { symbol: 'r', meaning: 'Raio circular da base do cilindro', unit: 'm' },
                    { symbol: 'h', meaning: 'Altura perpendicular do sólido', unit: 'm' },
                    { symbol: 'A_{\\text{base}}', meaning: 'Área da superfície da base poligonal', unit: 'm²' }
                  ]
                },
                {
                  id: 'volume-cone-piramide',
                  name: 'Volume do Cone e Relação Pitagórica da Geratriz',
                  latex: 'V = \\frac{1}{3} \\pi \\cdot r^2 \\cdot h, \\quad g^2 = h^2 + r^2',
                  description: 'Fórmula de volume e triângulo retângulo gerador do cone circular reto.',
                  variables: [
                    { symbol: 'V', meaning: 'Volume do cone reto', unit: 'm³ ou L' },
                    { symbol: 'r', meaning: 'Raio da base circular', unit: 'm' },
                    { symbol: 'h', meaning: 'Altura perpendicular do vértice à base', unit: 'm' },
                    { symbol: 'g', meaning: 'Geratriz do cone (hipotenusa)', unit: 'm' }
                  ]
                },
                {
                  id: 'volume-tronco-cone',
                  name: 'Volume do Tronco de Cone Reto de Bases Paralelas',
                  latex: 'V_{\\text{tronco}} = \\frac{\\pi \\cdot h}{3} \\left( R^2 + R \\cdot r + r^2 \\right)',
                  description: 'Cálculo direto da capacidade volumétrica de copos, baldes e vasos de plantas troncocônicos.',
                  variables: [
                    { symbol: 'V_{\\text{tronco}}', meaning: 'Volume do tronco de cone', unit: 'm³ ou L' },
                    { symbol: 'h', meaning: 'Altura perpendicular do tronco', unit: 'm' },
                    { symbol: 'R', meaning: 'Raio da base circular maior', unit: 'm' },
                    { symbol: 'r', meaning: 'Raio da base circular menor', unit: 'm' }
                  ]
                },
                {
                  id: 'volume-esfera-superficie',
                  name: 'Volume e Área da Superfície da Esfera',
                  latex: 'V_{\\text{esfera}} = \\frac{4}{3} \\pi \\cdot R^3, \\quad A_{\\text{superfície}} = 4 \\pi \\cdot R^2',
                  description: 'Volume e área superficial total de corpos esféricos em função de seu raio.',
                  variables: [
                    { symbol: 'V_{\\text{esfera}}', meaning: 'Volume da esfera tridimensional', unit: 'm³' },
                    { symbol: 'A_{\\text{superfície}}', meaning: 'Área da casca esférica', unit: 'm²' },
                    { symbol: 'R', meaning: 'Raio da esfera', unit: 'm' }
                  ]
                }
              ],
              tips: [
                'Atenção com a diferença entre Raio e Diâmetro! O enunciado costuma informar o diâmetro da caixa d\'água ou do poço (ex.: $4 \\text{ m}$), mas as fórmulas de volume usam o raio ($r = d/2 = 2 \\text{ m}$). Lembre-se também da conversão universal: $1\\text{ m}^3 = 1.000\\text{ litros}$ e $1\\text{ cm}^3 = 1\\text{ mL}$.'
              ],
              deepSections: [
                {
                  title: 'Dedução Algébrica e Geométrica do Volume do Tronco de Pirâmide e de Cone',
                  explanation: 'No nível FUVEST e vestibulares paulistas, a memorização mecânica é insuficiente: exige-se compreender a gênese da fórmula do tronco a partir da semelhança espacial e da álgebra de polinômios. Considere um sólido original de altura total $H$ seccionado por um plano paralelo à base a uma distância $h$. A ponta retirada possui altura $h_1 = H - h$ e área da base menor $A_b$, enquanto a base maior possui área $A_B$.',
                  bullets: [
                    '**Razão Homóloga Quadrática**: Pela semelhança tridimensional, a razão entre as áreas das seções transversais é proporcional ao quadrado da razão de suas distâncias ao vértice: $\\frac{A_b}{A_B} = \\left(\\frac{h_1}{H}\\right)^2 \\implies \\frac{\\sqrt{A_b}}{\\sqrt{A_B}} = \\frac{h_1}{h_1 + h}$. Isolando a altura $h_1$ da pirâmide superior: $h_1 = \\frac{h\\sqrt{A_b}}{\\sqrt{A_B} - \\sqrt{A_b}}$ e a altura total $H = \\frac{h\\sqrt{A_B}}{\\sqrt{A_B} - \\sqrt{A_b}}$.',
                    '**Diferença de Volumes e Fatoração de Produtos Notáveis**: O volume do tronco é a subtração do sólido original pelo topo retirado: $V_{\\text{tronco}} = \\frac{1}{3} A_B H - \\frac{1}{3} A_b h_1 = \\frac{h}{3} \\cdot \\frac{A_B\\sqrt{A_B} - A_b\\sqrt{A_b}}{\\sqrt{A_B} - \\sqrt{A_b}}$. Fazendo $x = \\sqrt{A_B}$ e $y = \\sqrt{A_b}$, o numerador torna-se a diferença de cubos $x^3 - y^3 = (x - y)(x^2 + xy + y^2)$. Cancelando o fator $(x - y)$ do denominador, obtém-se com precisão analítica irrevogável: $V = \\frac{h}{3}(A_B + \\sqrt{A_B A_b} + A_b)$.',
                    '**Especialização para o Cone Reto**: Para corpos de revolução circulares com $A_B = \\pi R^2$ e $A_b = \\pi r^2$, o termo intermediário geométrico $\\sqrt{A_B \\cdot A_b} = \\sqrt{\\pi^2 R^2 r^2} = \\pi R r$, gerando a expressão consagrada: $V_{\\text{tronco}} = \\frac{\\pi h}{3}(R^2 + Rr + r^2)$.'
                  ]
                },
                {
                  title: 'Problema Canônico da FUVEST: O Nível de Líquido em Recipientes Cônicos e Esféricos',
                  explanation: 'Questões discursivas e de múltipla escolha da FUVEST exploram com frequência a não linearidade na subida de nível de líquidos em vasos cônicos com vértice para baixo alimentados por vazão constante ($Q = \\frac{\\Delta V}{\\Delta t}$).',
                  bullets: [
                    '**Variação Não-Linear de Volume**: Como o volume ocupado até a altura instantânea $h$ é proporcional a $h^3$ ($V(h) = V_{\\text{total}} \\cdot \\left(\\frac{h}{H}\\right)^3$), quando o recipiente atinge a METADE de sua capacidade total ($V = V_{\\text{total}}/2$), a altura correspondente do líquido é $h = \\frac{H}{\\sqrt[3]{2}} \\approx 0{,}794 \\cdot H$. Ou seja, com metade do volume, o líquido já ocupa quase $80\\%$ da altura do cone!',
                    '**Esfera Inscrita e Circunscrita ao Cubo**: Se uma esfera de raio $R$ está perfeitamente inscrita em um cubo de aresta $a$, o diâmetro da esfera coincide com a aresta: $2R = a \\implies R = a/2$. Se a esfera circunscreve o cubo (passando por seus 8 vértices), o diâmetro da esfera é igual à diagonal espacial do cubo: $2R = a\\sqrt{3} \\implies R = \\frac{a\\sqrt{3}}{2}$.'
                  ]
                }
              ]
            },
            {
              id: 'semelhanca-triangulos-tales',
              title: 'Semelhança de Triângulos, Teorema de Tales e Homotetia',
              enemWeight: 'Alta',
              summary: 'Proporcionalidade geométrica direta entre segmentos homólogos gerados por feixes de retas paralelas e triângulos de ângulos iguais, com destaque para cálculo de alturas por projeção de sombras.',
              keyConcepts: [
                '**Teorema de Tales**: Um feixe de retas paralelas determina sobre duas retas transversais quaisquer segmentos correspondentes estritamente proporcionais: $\\frac{AB}{BC} = \\frac{A\'B\'}{B\'C\'}$.',
                '**Critérios de Semelhança de Triângulos**: Dois triângulos são semelhantes se possuem dois ângulos congruentes (Critério AA), lados proporcionais e ângulo intermediário congruente (LAL) ou todos os três lados proporcionais (LLL).',
                '**Razão de Semelhança Linear ($k$)**: A relação entre quaisquer comprimentos homólogos (lados, alturas, perímetros, raios) é constante: $\\frac{L_1}{L_2} = \\frac{h_1}{h_2} = \\frac{P_1}{P_2} = k$.',
                '**Propagação para Áreas e Volumes**: Se a razão linear entre duas figuras semelhantes for $k$, a razão entre suas áreas será $k^2$ e a razão entre seus volumes será $k^3$.',
                '**Aplicação Prática em Sombras**: Determinação da altura de edifícios ou postes comparando a sombra projetada pelo objeto com a sombra de uma estaca de altura conhecida no mesmo instante de radiação solar.'
              ],
              formulas: [
                {
                  id: 'razao-semelhanca-geometria',
                  name: 'Razões de Semelhança Linear, Superficial e Volumétrica',
                  latex: '\\frac{L_1}{L_2} = k \\implies \\frac{A_1}{A_2} = k^2, \\quad \\frac{V_1}{V_2} = k^3',
                  description: 'Variação dimensional exponencial entre figuras geometricamente semelhantes.'
                },
                {
                  id: 'teorema-tales-formula',
                  name: 'Proporcionalidade de Tales',
                  latex: '\\frac{a}{b} = \\frac{c}{d} \\iff a \\cdot d = b \\cdot c',
                  description: 'Igualdade entre razões formadas por segmentos de retas cortadas por feixe paralelo.'
                }
              ],
              tips: [
                'Cuidado ao calcular o tronco de cone ou pirâmide: se a altura for reduzida pela metade ($k = 1/2$), o volume da ponta retirada será $(1/2)^3 = 1/8$ do volume original, significando que o tronco restante contém $7/8$ do volume total!'
              ]
            },
            {
              id: 'projecoes-ortogonais',
              title: 'Projeções Ortogonais e Vistas Espaciais',
              enemWeight: 'Muito Alta',
              summary: 'A capacidade de mapear a sombra perpendicular de um objeto ou trajetória tridimensional sobre planos bidimensionais (vistas superior, frontal e lateral).',
              keyConcepts: [
                '**Projeção Ortogonal no Plano**: Feixe de raios projetantes perpendiculares ($90^\\circ$) ao plano de projeção.',
                '**Sombra de Trajetórias**: A projeção ortogonal de uma hélice cilíndrica (espiral de escada) sobre o solo (plano horizontal) é uma circunferência plana perfeita.',
                '**Vistas Técnicas Ortogonais**: Vista Superior (olhando de cima para baixo), Vista Frontal e Vistas Laterais de sólidos poliédricos montados com blocos.'
              ],
              tips: [
                'Visualize mentalmente uma fonte de luz pontual posicionada no infinito exatamente acima do objeto (para vista superior) ou exatamente em frente (para vista frontal) e desenhe a silhueta da sombra projetada.'
              ]
            }
          ]
        },
        {
          id: 'estatistica-probabilidade-matrizes',
          title: 'Estatística, Combinatória, Probabilidade e Matrizes',
          description: 'Tratamento de dados estatísticos, contagem combinatória, probabilidades de eventos e tabelas matriciais.',
          subtopics: [
            {
              id: 'estatistica-grafica-histogramas-boxplot',
              title: 'Interpretação Gráfica: Histogramas, Séries Temporais, Dispersão e Boxplot',
              enemWeight: 'Muito Alta',
              summary: 'Decodificação visual e analítica de distribuições de frequência em colunas contíguas (histogramas), tendências temporais, correlações bivariadas e diagramas de cinco números (boxplot).',
              keyConcepts: [
                '**Histograma de Frequências**: Gráfico de colunas adjacentes sem espaçamento onde o eixo horizontal representa classes intervalares contínuas (ex.: faixas etárias ou salariais) e a área/altura representa a frequência absoluta ou relativa daquela classe.',
                '**Gráficos de Linha e Séries Temporais**: Avaliação de taxas de crescimento, aceleração, estabilização e pontos de inflexão em séries históricas ao longo de meses ou anos.',
                '**Gráficos de Dispersão (Scatter Plot)**: Identificação visual de correlação linear positiva (quando uma variável sobe e a outra também sobe), negativa (quando uma sobe e a outra desce) ou ausência de correlação entre duas variáveis amostrais.',
                '**Diagrama de Caixa (Boxplot)**: Representação visual dos cinco números da estatística: Valor Mínimo, Primeiro Quartil ($Q_1$, $25\\%$ dos dados), Mediana ou Segundo Quartil ($Q_2$, $50\\%$ dos dados), Terceiro Quartil ($Q_3$, $75\\%$ dos dados) e Valor Máximo. A largura da caixa central é a Amplitude Interquartil ($IQR = Q_3 - Q_1$). Valores além de $1{,}5 \\times IQR$ dos limites dos quartis são classificados como *outliers* (pontos discrepantes).'
              ],
              formulas: [
                {
                  id: 'iqr-boxplot-formula',
                  name: 'Amplitude Interquartil (IQR)',
                  latex: 'IQR = Q_3 - Q_1, \\quad \\text{Limite Inferior} = Q_1 - 1{,}5 \\cdot IQR, \\quad \\text{Limite Superior} = Q_3 + 1{,}5 \\cdot IQR',
                  description: 'Parâmetro de dispersão dos 50% de dados centrais e critério de detecção de pontos atípicos (outliers).'
                }
              ],
              tips: [
                'No Boxplot, a linha interior à caixa indica a Mediana ($Q_2$). Se a linha não estiver centralizada dentro da caixa, a distribuição é assimétrica. O ENEM adora comparar dois boxplots lado a lado para perguntar qual grupo tem maior mediana ou menor dispersão no intervalo interquartil!'
              ]
            },
            {
              id: 'estatistica-tendencia-central',
              title: 'Estatística: Média, Mediana, Moda e Medidas de Dispersão',
              enemWeight: 'Muito Alta',
              summary: 'Interpretação e cálculo das medidas centrais e do grau de consistência/regularidade de dados amostrais.',
              keyConcepts: [
                '**Média Aritmética Simples**: Somatório de todos os valores dividido pela quantidade total de dados ($n$).',
                '**Média Ponderada**: Somatório dos produtos de cada valor pelo seu respectivo peso, dividido pela soma de todos os pesos.',
                '**Mediana**: O elemento central que divide o conjunto de dados rigorosamente em duas metades (50% inferiores e 50% superiores). OBRIGATÓRIO colocar todos os dados em ordem crescente (rol) antes de localizá-la! Se o número de termos for par, a mediana é a média aritmética dos dois valores centrais.',
                '**Moda**: O valor que ocorre com a maior frequência no conjunto (pode ser amodal, unimodal ou bimodal).',
                '**Desvio-Padrão e Regularidade**: Quanto MENOR o desvio-padrão ou a variância, mais HOMOGÊNEO, consistente e regular é o desempenho do competidor ou máquina.'
              ],
              formulas: [
                {
                  id: 'media-ponderada-formula',
                  name: 'Média Aritmética Ponderada',
                  latex: '\\bar{x}_p = \\frac{\\sum_{i=1}^n x_i \\cdot p_i}{\\sum_{i=1}^n p_i} = \\frac{x_1 \\cdot p_1 + x_2 \\cdot p_2 + \\dots + x_n \\cdot p_n}{p_1 + p_2 + \\dots + p_n}',
                  description: 'Média onde cada observação possui um peso de importância relativa.'
                },
                {
                  id: 'desvio-padrao-formula',
                  name: 'Variância e Desvio-Padrão Amostral',
                  latex: 's^2 = \\frac{1}{n} \\sum_{i=1}^n (x_i - \\bar{x})^2, \\quad s = \\sqrt{s^2}',
                  description: 'Mede a dispersão dos dados em relação à média central calculada.'
                }
              ],
              tips: [
                'Em questões que perguntam "qual aluno foi o mais regular?", você deve escolher o candidato com MENOR variância ou desvio-padrão, pois menor dispersão significa menor oscilação de notas.'
              ]
            },
            {
              id: 'analise-combinatoria',
              title: 'Análise Combinatória: Permutação, Arranjo e Combinação',
              enemWeight: 'Alta',
              summary: 'Técnicas de contagem sem necessidade de listar exaustivamente todas as possibilidades de agrupamento.',
              keyConcepts: [
                '**Princípio Fundamental da Contagem** (PFC): Se uma decisão $D_1$ pode ser tomada de $n_1$ maneiras e uma decisão $D_2$ pode ser tomada de $n_2$ maneiras, a sucessão de decisões ocorre de $n_1 \\times n_2$ maneiras distintas.',
                '**Permutação Simples**: Mudança de ordem de todos os $n$ elementos disponíveis: $P_n = n!$. Se houver repetição de elementos: $P_n^{\\alpha, \\beta} = \\frac{n!}{\\alpha! \\cdot \\beta!}$ (clássico em anagramas como MATEMÁTICA).',
                '**Combinação Simples** (A Ordem NÃO Importa): Escolha de $p$ elementos dentre $n$ onde a inversão da ordem dos escolhidos forma o mesmo grupo (ex.: comissão de pessoas, escolha de ingredientes de uma pizza): $C_{n,p} = \\frac{n!}{p!(n-p)!}$.',
                '**Arranjo Simples** (A Ordem IMPORTA): A ordem dos escolhidos altera o resultado (ex.: senhas de banco, pódio com 1º, 2º e 3º lugares): $A_{n,p} = \\frac{n!}{(n-p)!}$.'
              ],
              formulas: [
                {
                  id: 'combinacao-simples-formula',
                  name: 'Combinação Simples',
                  latex: 'C_{n, p} = \\binom{n}{p} = \\frac{n!}{p! \\cdot (n - p)!}',
                  description: 'Agrupamento de p elementos distintos tomados de um universo de n elementos, sem distinção de ordem.'
                },
                {
                  id: 'arranjo-permutacao-formula',
                  name: 'Arranjo Simples e Permutação',
                  latex: 'A_{n, p} = \\frac{n!}{(n - p)!}, \\quad P_n = n!, \\quad P_n^k = \\frac{n!}{k!}',
                  description: 'Agrupamentos onde a posição e a ordem relativa dos elementos alteram a natureza do grupo formado.'
                }
              ],
              tips: [
                'Faça sempre a "pergunta de ouro" para decidir entre Combinação e Arranjo: "Se eu trocar a ordem dos elementos escolhidos, o grupo formado muda?". Se NÃO muda -> Combinação. Se MUDA -> Arranjo/PFC.'
              ]
            },
            {
              id: 'probabilidade-eventos',
              title: 'Probabilidade: Espaço Amostral, União e Condicional',
              enemWeight: 'Muito Alta',
              summary: 'Quantificação numérica das chances de ocorrência de eventos aleatórios equiprováveis.',
              keyConcepts: [
                '**Definição Clássica de Laplace**: Razão entre o número de casos favoráveis e o número total de casos possíveis do espaço amostral: $P(A) = \\frac{n(A)}{n(\\Omega)}$.',
                '**Regra do "OU"** (Probabilidade da União): $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$. Se os eventos forem mutuamente exclusivos (não puderem ocorrer simultaneamente), $P(A \\cap B) = 0$.',
                '**Regra do "E"** (Probabilidade da Interseção): $P(A \\cap B) = P(A) \\cdot P(B|A)$. Se os eventos forem independentes: $P(A \\cap B) = P(A) \\cdot P(B)$.',
                '**Probabilidade Complementar**: Em problemas com enunciados do tipo "pelo menos um", é muito mais rápido calcular a probabilidade do evento NÃO acontecer e subtrair de 1: $P(A) = 1 - P(\\bar{A})$.'
              ],
              formulas: [
                {
                  id: 'probabilidade-laplace-formula',
                  name: 'Probabilidade de Laplace',
                  latex: 'P(A) = \\frac{n(A)}{n(\\Omega)} = \\frac{\\text{Casos Favoráveis}}{\\text{Casos Totais Possíveis}}',
                  description: 'Cálculo de chances para espaços amostrais finitos e equiprováveis ($0 \\le P(A) \\le 1$).'
                },
                {
                  id: 'probabilidade-condicional-formula',
                  name: 'Probabilidade Condicional',
                  latex: 'P(A | B) = \\frac{P(A \\cap B)}{P(B)} = \\frac{n(A \\cap B)}{n(B)}',
                  description: 'Probabilidade de ocorrer o evento A sabendo com certeza prévia que o evento B já ocorreu (redução do espaço amostral para B).'
                }
              ],
              tips: [
                'Na probabilidade condicional ("sabendo que o sorteado é do sexo feminino"), o espaço amostral deixa de ser a população inteira e passa a ser apenas o subconjunto das mulheres!'
              ]
            },
            {
              id: 'matrizes-sistemas-lineares',
              title: 'Matrizes, Operações em Tabelas e Resolução de Sistemas Lineares',
              enemWeight: 'Baixa',
              summary: 'Interpretação matricial de estoques, custos de rotas de transporte e resolução de sistemas em problemas de compras.',
              keyConcepts: [
                '**Interpretação de Matrizes**: Tabelas de dados organizados em $m$ linhas e $n$ colunas. No ENEM, uma linha pode representar um produto e cada coluna o seu preço em diferentes lojas, ou uma matriz de rotas onde $a_{ij} = 1$ se há voo direto da cidade $i$ para a cidade $j$.',
                '**Multiplicação de Matrizes**: O produto $A_{m \\times k} \\times B_{k \\times n} = C_{m \\times n}$ só é possível se o número de colunas da primeira matriz for igual ao número de linhas da segunda. Cada elemento $c_{ij}$ é a soma dos produtos da linha $i$ de $A$ pelos elementos correspondentes da coluna $j$ de $B$ (ex.: cálculo do custo total de múltiplos insumos).',
                '**Sistemas Lineares no ENEM**: Modelagem de situações reais com 2 ou 3 incógnitas (ex.: quantidade de moedas, ingressos inteiros vs meia-entrada, mistura de ligas metálicas). Métodos de resolução por Substituição, Adição ou Escalonamento.'
              ],
              formulas: [
                {
                  id: 'produto-matrizes',
                  name: 'Termo Geral da Multiplicação de Matrizes',
                  latex: 'c_{ij} = \\sum_{k=1}^p a_{ik} \\cdot b_{kj}',
                  description: 'Cálculo de cada elemento do produto matricial por linha versus coluna.'
                }
              ],
              tips: [
                'Atenção: A multiplicação de matrizes NÃO é comutativa ($A \\cdot B \\neq B \\cdot A$). No ENEM, mantenha rigorosamente a ordem indicada pelo enunciado (por exemplo: Matriz de Quantidades compradas vezes Matriz de Preços unitários).'
              ]
            }
          ]
        }
      ]
    }
  ]
};
