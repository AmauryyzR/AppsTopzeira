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
              id: 'razoes-proporcoes-regra-tres',
              title: 'Razão, Proporção e Regra de Três Simples e Composta',
              enemWeight: 'Muito Alta',
              summary: 'O conceito de razão como quociente entre duas grandezas de mesma ou de naturezas distintas (como velocidade média, densidade demográfica e consumo específico). A proporção estabelece a igualdade entre duas razões e fundamenta regras de três diretas e inversas.',
              keyConcepts: [
                'Grandezas Diretamente Proporcionais: Quando o aumento de uma acarreta o aumento da outra na mesma razão ($y/x = k$).',
                'Grandezas Inversamente Proporcionais: Quando o aumento de uma provoca a diminuição da outra na proporção inversa, mantendo constante o seu produto ($x \\cdot y = k$).',
                'Propriedade Fundamental das Proporções: Em toda proporção, o produto dos extremos é rigorosamente igual ao produto dos meios ($a/b = c/d \\iff a \\cdot d = b \\cdot c$).',
                'Divisão em Partes Proporcionais: Repartição de um valor total em parcelas diretamente ou inversamente proporcionais a coeficientes ponderados.'
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
                'Fator Multiplicativo: Um aumento de $i\\%$ corresponde a multiplicar o valor inicial por $(1 + i)$; um desconto de $i\\%$ corresponde a multiplicar por $(1 - i)$.',
                'Aumentos e Descontos Sucessivos: Multiplicam-se os fatores sucessivos; dois aumentos seguidos de $10\\%$ não equivalem a $20\\%$, mas sim a $(1{,}10) \\times (1{,}10) = 1{,}21$ (aumento real de $21\\%$)!',
                'Juros Simples: A taxa de juros incide sempre e unicamente sobre o capital principal inicial ($J = C \\cdot i \\cdot t$), gerando crescimento estritamente linear.',
                'Juros Compostos: Os juros de cada período são incorporados ao saldo, e a taxa incide sobre o montante acumulado anterior ("juros sobre juros"), gerando crescimento estritamente exponencial ($M = C \\cdot (1 + i)^t$).'
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
              id: 'escalas-conversao',
              title: 'Escalas Cartográficas e Conversão de Unidades Métricas',
              enemWeight: 'Muito Alta',
              summary: 'A razão de semelhança entre comprimentos no mapa e no mundo real, e a propagação de potências para conversão de áreas e volumes.',
              keyConcepts: [
                'Escala Linear ($E$): Razão adimensional dada por $E = \\frac{d}{D}$, onde $d$ é a distância no desenho e $D$ é a distância real medida na mesma unidade.',
                'Escala de Áreas ($E^2$): A relação entre a área na planta e a área real corresponde ao quadrado da escala linear: $\\frac{A_{\\text{mapa}}}{A_{\\text{real}}} = E^2 = \\left( \\frac{d}{D} \\right)^2$.',
                'Escala de Volumes ($E^3$): A relação entre o volume em uma maquete e o volume real corresponde ao cubo da escala: $\\frac{V_{\\text{maquete}}}{V_{\\text{real}}} = E^3$.',
                'Conversão de Capacidade e Volume: $1 \\text{ m}^3 = 1000 \\text{ L}$, $1 \\text{ dm}^3 = 1 \\text{ L}$ e $1 \\text{ cm}^3 = 1 \\text{ mL}$.'
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
                'Lei de Formação: $f(x) = a \\cdot x + b$, onde $a$ é o coeficiente angular (declividade da reta) e $b$ é o coeficiente linear (ponto em que a reta intercepta o eixo $y$, quando $x=0$).',
                'Interpretação Econômica: Em planos de telefonia ou corridas de táxi, $b$ representa a taxa fixa (bandeirada) e $a$ representa o custo variável por quilômetro rodado ou minuto consumido.',
                'Crescimento e Decrescimento: Se $a > 0$, a função é estritamente crescente; se $a < 0$, a função é estritamente decrescente; se $a = 0$, a função é constante.',
                'Zero ou Raiz da Função: Valor de $x$ que anula a função ($f(x) = 0$), dado por $x_0 = -\\frac{b}{a}$.'
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
                'Lei de Formação: $f(x) = a \\cdot x^2 + b \\cdot x + c$, com $a \\neq 0$. Seu gráfico é uma parábola de eixo vertical.',
                'Concavidade: Se $a > 0$, concavidade voltada para cima (a função possui ponto de MÍNIMO); se $a < 0$, concavidade voltada para baixo (a função possui ponto de MÁXIMO).',
                'Discriminante Delta ($\\Delta = b^2 - 4ac$): Se $\\Delta > 0$, duas raízes reais distintas; se $\\Delta = 0$, uma raiz real dupla tangenciando o eixo $x$; se $\\Delta < 0$, nenhuma raiz real.',
                'Vértice da Parábola ($x_v, y_v$): O $x_v = -\\frac{b}{2a}$ indica a quantidade que gera o valor ótimo (ex.: "quantas peças produzir para maximizar o lucro"); o $y_v = -\\frac{\\Delta}{4a}$ fornece o próprio valor extremo ótimo alcançado (ex.: "qual é o lucro máximo obtido").'
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
                'Função Exponencial: $f(x) = a^x$ (com $a > 0$ e $a \\neq 1$). Se $a > 1$, crescimento exponencial acelerado; se $0 < a < 1$, decaimento exponencial.',
                'Definição de Logaritmo: $\\log_b(a) = x \\iff b^x = a$, onde $a > 0$ (logaritmando) e $b > 0, b \\neq 1$ (base).',
                'Propriedades Operatórias: Logaritmo do produto vira soma ($\\log(x \\cdot y) = \\log x + \\log y$); logaritmo da divisão vira subtração ($\\log(x/y) = \\log x - \\log y$); regra da potência/tombo ($\\log(x^k) = k \\cdot \\log x$).',
                'Mudança de Base: $\\log_b(a) = \\frac{\\log_c(a)}{\\log_c(b)}$, permitindo calcular logaritmos em qualquer base na base decimal.'
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
              enemWeight: 'Alta',
              summary: 'Sequências numéricas com taxa de incremento aditiva constante (PA) ou multiplicativa constante (PG).',
              keyConcepts: [
                'Progressão Aritmética (PA): Cada termo após o primeiro é igual ao anterior somado a uma razão constante $r$ ($a_n = a_{n-1} + r$).',
                'Termo Geral da PA: $a_n = a_1 + (n - 1) \\cdot r$.',
                'Soma dos Termos da PA: A soma dos $n$ primeiros termos é obtida pelo emparelhamento dos extremos (fórmula de Gauss): $S_n = \\frac{(a_1 + a_n) \\cdot n}{2}$.',
                'Progressão Geométrica (PG): Cada termo é obtido multiplicando o anterior por uma razão constante $q$ ($a_n = a_1 \\cdot q^{n-1}$).',
                'Soma de PG Infinita Convergente: Se a razão estiver entre $-1 < q < 1$, a soma de infinitos termos converge para um valor finito: $S_{\\infty} = \\frac{a_1}{1 - q}$.'
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
              enemWeight: 'Muito Alta',
              summary: 'Determinação de alturas inacessíveis, triangulação de distâncias e cálculo de lados e ângulos em triângulos quaisquer.',
              keyConcepts: [
                'Razões no Triângulo Retângulo: Seno ($\\sin\\theta = \\frac{\\text{Cateto Oposto}}{\\text{Hipotenusa}}$), Cosseno ($\\cos\\theta = \\frac{\\text{Cateto Adjacente}}{\\text{Hipotenusa}}$) e Tangente ($\\tan\\theta = \\frac{\\text{Cateto Oposto}}{\\text{Cateto Adjacente}}$).',
                'Ângulos Notáveis: $30^\\circ$ ($\nobreak\\sin = 1/2, \\cos = \\sqrt{3}/2, \\tan = \\sqrt{3}/3$), $45^\\circ$ ($\nobreak\\sin = \\cos = \\sqrt{2}/2, \\tan = 1$) e $60^\\circ$ ($\nobreak\\sin = \\sqrt{3}/2, \\cos = 1/2, \\tan = \\sqrt{3}$).',
                'Lei dos Cossenos: Generalização do Teorema de Pitágoras para triângulos quaisquer: $a^2 = b^2 + c^2 - 2 \\cdot b \\cdot c \\cdot \\cos\\hat{A}$. Usada quando conhecemos dois lados e o ângulo formado entre eles.',
                'Lei dos Senos: Proporcionalidade entre os lados e os senos dos ângulos opostos, igual ao diâmetro da circunferência circunscrita: $\\frac{a}{\\sin\\hat{A}} = \\frac{b}{\\sin\\hat{B}} = \\frac{c}{\\sin\\hat{C}} = 2R$.'
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
              enemWeight: 'Alta',
              summary: 'Interpretação de funções senoidais e cossenoidais aplicadas a marés, temperatura climática e respiração biológica.',
              keyConcepts: [
                'Forma Padrão da Função Senoidal: $f(x) = a + b \\cdot \\sin(c \\cdot x + d)$.',
                'Parâmetro $a$ (Eixo Central / Média): Deslocamento vertical. A linha média oscilatória é $y = a$.',
                'Parâmetro $|b|$ (Amplitude): A oscilação máxima para cima e para baixo em torno do eixo médio. O valor MÁXIMO da função é $y_{\\text{máx}} = a + |b|$ e o MÍNIMO é $y_{\\text{mín}} = a - |b|$.',
                'Parâmetro $c$ (Frequência e Período): O período $T$ (tempo ou distância para completar um ciclo completo de oscilação) é inversamente proporcional a $c$: $T = \\frac{2\\pi}{|c|}$.'
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
              enemWeight: 'Alta',
              summary: 'Mapeamento de coordenadas cartesianas, inclinação de retas, alcance de antenas de transmissão e áreas de cobertura.',
              keyConcepts: [
                'Distância entre Dois Pontos: Aplicação direta do Teorema de Pitágoras no plano cartesiano: $d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$. O ponto médio do segmento é $M = \\left( \\frac{x_1 + x_2}{2}, \\frac{y_1 + y_2}{2} \\right)$.',
                'Equação Fundamental da Reta: $y - y_0 = m \\cdot (x - x_0)$, onde $m = \\frac{y_2 - y_1}{x_2 - x_1} = \\tan\\alpha$ é o coeficiente angular.',
                'Paralelismo e Perpendicularismo: Duas retas são paralelas se têm a mesma inclinação ($m_1 = m_2$); são perpendiculares se o produto dos seus coeficientes angulares for igual a $-1$ ($m_1 \\cdot m_2 = -1 \\implies m_2 = -\\frac{1}{m_1}$).',
                'Equação Reduzida da Circunferência: Descreve o conjunto de todos os pontos $(x, y)$ a uma distância fixa $R$ de um centro $C(a, b)$: $(x - a)^2 + (y - b)^2 = R^2$. Frequentemente aplicada no ENEM para representar o alcance de radares, torres de telefonia móvel e epicentros de abalos sísmicos.'
              ],
              formulas: [
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
                'Teorema de Pitágoras: Em qualquer triângulo retângulo, $a^2 = b^2 + c^2$ (hipotenusa ao quadrado igual à soma dos quadrados dos catetos). Triângulos pitagóricos notáveis: $3-4-5$ e $5-12-13$.',
                'Área do Triângulo: Fórmula tradicional ($A = \\frac{b \\cdot h}{2}$), fórmula trigonométrica ($A = \\frac{a \\cdot b \\cdot \\sin \\theta}{2}$) e triângulo equilátero de lado $L$ ($A = \\frac{L^2 \\sqrt{3}}{4}$).',
                'Círculo e Setor Circular: Área total $A = \\pi \\cdot r^2$; Comprimento da circunferência $C = 2 \\cdot \\pi \\cdot r$; Área do setor proporcional ao ângulo central $\\alpha$: $A_{\\text{setor}} = \\frac{\\alpha}{360^\\circ} \\cdot \\pi r^2$.',
                'Trapézio e Losango: Área do trapézio $A = \\frac{(B + b) \\cdot h}{2}$; Área do losango $A = \\frac{D \\cdot d}{2}$.'
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
              title: 'Geometria Espacial: Prismas, Cilindros, Pirâmides e Cones',
              enemWeight: 'Muito Alta',
              summary: 'Cálculo de capacidade volumétrica de reservatórios, caixas d\'água, silos e latas cilíndricas.',
              keyConcepts: [
                'Prismas e Cilindros (Sólidos de seções paralelas congruentes): O volume é sempre igual ao produto da área da base pela altura: $V = A_{\\text{base}} \\cdot h$. Para o cilindro reto de raio $r$: $V = \\pi \\cdot r^2 \\cdot h$.',
                'Pirâmides e Cones (Sólidos pontiagudos com vértice único): O volume é sempre igual a um terço do produto da área da base pela altura perpendicular: $V = \\frac{1}{3} A_{\\text{base}} \\cdot h$. Para o cone reto: $V = \\frac{1}{3} \\pi \\cdot r^2 \\cdot h$.',
                'Esfera: Volume $V = \\frac{4}{3} \\pi \\cdot r^3$ e Área superficial $A = 4 \\pi \\cdot r^2$.',
                'Área da Superfície Lateral do Cilindro: Planificada em um retângulo de base $2\\pi r$ e altura $h$: $A_L = 2 \\cdot \\pi \\cdot r \\cdot h$.'
              ],
              formulas: [
                {
                  id: 'volume-cilindro-formula',
                  name: 'Volume do Cilindro e Prisma',
                  latex: 'V_{\\text{cilindro}} = \\pi \\cdot r^2 \\cdot h, \\quad V_{\\text{prisma}} = A_{\\text{base}} \\cdot h',
                  description: 'Capacidade volumétrica de corpos com seções transversais uniformes ao longo da altura.'
                },
                {
                  id: 'volume-cone-esfera',
                  name: 'Volume do Cone e da Esfera',
                  latex: 'V_{\\text{cone}} = \\frac{1}{3} \\pi \\cdot r^2 \\cdot h, \\quad V_{\\text{esfera}} = \\frac{4}{3} \\pi \\cdot r^3',
                  description: 'Fórmulas para sólidos com conicidade e corpos de revolução esféricos.'
                }
              ],
              tips: [
                'Atenção com a diferença entre Raio e Diâmetro! O enunciado costuma informar o diâmetro da caixa d\'água (ex.: $4 \\text{ m}$), mas as fórmulas de volume usam o raio ($r = d/2 = 2 \\text{ m}$). Esse é um dos maiores distratores do ENEM.'
              ]
            },
            {
              id: 'projecoes-ortogonais',
              title: 'Projeções Ortogonais e Vistas Espaciais',
              enemWeight: 'Muito Alta',
              summary: 'A capacidade de mapear a sombra perpendicular de um objeto ou trajetória tridimensional sobre planos bidimensionais (vistas superior, frontal e lateral).',
              keyConcepts: [
                'Projeção Ortogonal no Plano: Feixe de raios projetantes perpendiculares ($90^\\circ$) ao plano de projeção.',
                'Sombra de Trajetórias: A projeção ortogonal de uma hélice cilíndrica (espiral de escada) sobre o solo (plano horizontal) é uma circunferência plana perfeita.',
                'Vistas Técnicas Ortogonais: Vista Superior (olhando de cima para baixo), Vista Frontal e Vistas Laterais de sólidos poliédricos montados com blocos.'
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
              id: 'estatistica-tendencia-central',
              title: 'Estatística: Média, Mediana, Moda e Medidas de Dispersão',
              enemWeight: 'Muito Alta',
              summary: 'Interpretação e cálculo das medidas centrais e do grau de consistência/regularidade de dados amostrais.',
              keyConcepts: [
                'Média Aritmética Simples: Somatório de todos os valores dividido pela quantidade total de dados ($n$).',
                'Média Ponderada: Somatório dos produtos de cada valor pelo seu respectivo peso, dividido pela soma de todos os pesos.',
                'Mediana: O elemento central que divide o conjunto de dados rigorosamente em duas metades (50% inferiores e 50% superiores). OBRIGATÓRIO colocar todos os dados em ordem crescente (rol) antes de localizá-la! Se o número de termos for par, a mediana é a média aritmética dos dois valores centrais.',
                'Moda: O valor que ocorre com a maior frequência no conjunto (pode ser amodal, unimodal ou bimodal).',
                'Desvio-Padrão e Regularidade: Quanto MENOR o desvio-padrão ou a variância, mais HOMOGÊNEO, consistente e regular é o desempenho do competidor ou máquina.'
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
                'Princípio Fundamental da Contagem (PFC): Se uma decisão $D_1$ pode ser tomada de $n_1$ maneiras e uma decisão $D_2$ pode ser tomada de $n_2$ maneiras, a sucessão de decisões ocorre de $n_1 \\times n_2$ maneiras distintas.',
                'Permutação Simples: Mudança de ordem de todos os $n$ elementos disponíveis: $P_n = n!$. Se houver repetição de elementos: $P_n^{\\alpha, \\beta} = \\frac{n!}{\\alpha! \\cdot \\beta!}$ (clássico em anagramas como MATEMÁTICA).',
                'Combinação Simples (A Ordem NÃO Importa): Escolha de $p$ elementos dentre $n$ onde a inversão da ordem dos escolhidos forma o mesmo grupo (ex.: comissão de pessoas, escolha de ingredientes de uma pizza): $C_{n,p} = \\frac{n!}{p!(n-p)!}$.',
                'Arranjo Simples (A Ordem IMPORTA): A ordem dos escolhidos altera o resultado (ex.: senhas de banco, pódio com 1º, 2º e 3º lugares): $A_{n,p} = \\frac{n!}{(n-p)!}$.'
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
                'Definição Clássica de Laplace: Razão entre o número de casos favoráveis e o número total de casos possíveis do espaço amostral: $P(A) = \\frac{n(A)}{n(\\Omega)}$.',
                'Regra do "OU" (Probabilidade da União): $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$. Se os eventos forem mutuamente exclusivos (não puderem ocorrer simultaneamente), $P(A \\cap B) = 0$.',
                'Regra do "E" (Probabilidade da Interseção): $P(A \\cap B) = P(A) \\cdot P(B|A)$. Se os eventos forem independentes: $P(A \\cap B) = P(A) \\cdot P(B)$.',
                'Probabilidade Complementar: Em problemas com enunciados do tipo "pelo menos um", é muito mais rápido calcular a probabilidade do evento NÃO acontecer e subtrair de 1: $P(A) = 1 - P(\\bar{A})$.'
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
              enemWeight: 'Média',
              summary: 'Interpretação matricial de estoques, custos de rotas de transporte e resolução de sistemas em problemas de compras.',
              keyConcepts: [
                'Interpretação de Matrizes: Tabelas de dados organizados em $m$ linhas e $n$ colunas. No ENEM, uma linha pode representar um produto e cada coluna o seu preço em diferentes lojas, ou uma matriz de rotas onde $a_{ij} = 1$ se há voo direto da cidade $i$ para a cidade $j$.',
                'Multiplicação de Matrizes: O produto $A_{m \\times k} \\times B_{k \\times n} = C_{m \\times n}$ só é possível se o número de colunas da primeira matriz for igual ao número de linhas da segunda. Cada elemento $c_{ij}$ é a soma dos produtos da linha $i$ de $A$ pelos elementos correspondentes da coluna $j$ de $B$ (ex.: cálculo do custo total de múltiplos insumos).',
                'Sistemas Lineares no ENEM: Modelagem de situações reais com 2 ou 3 incógnitas (ex.: quantidade de moedas, ingressos inteiros vs meia-entrada, mistura de ligas metálicas). Métodos de resolução por Substituição, Adição ou Escalonamento.'
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
