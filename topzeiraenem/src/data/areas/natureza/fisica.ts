import { Discipline } from '../../../types/curriculum';

export const fisica: Discipline = {
  id: 'fisica',
  name: 'Física',
  description: 'Mecânica clássica, fluidos, termodinâmica, óptica, ondas, eletromagnetismo e física moderna aplicados a situações cotidianas.',
  topics: [
    {
      id: 'mecanica-fluidos-gravitacao',
      title: 'Mecânica Clássica, Fluidos e Gravitação',
      description: 'Cinemática escalar, leis do movimento de Newton, trabalho e energia, hidrostática e dinâmica orbital.',
      subtopics: [
        {
          id: 'cinematica-graficos-movimento',
          title: 'Cinemática Escalar, Queda Livre e Interpretação Gráfica',
          enemWeight: 'Muito Alta',
          summary: 'Movimento retilíneo uniforme (MRU), uniformemente variado (MRUV), lançamentos verticais e análise dimensional e gráfica de dados.',
          keyConcepts: [
            'Movimento Uniforme (MRU): Velocidade constante ($a = 0$). Função horária da posição: $s = s_0 + v \\cdot t$. No gráfico $s \\times t$, a inclinação da reta representa a velocidade ($v = \\tan\\theta$).',
            'Movimento Uniformemente Variado (MRUV): Aceleração constante ($a \\neq 0$). A velocidade varia linearmente com o tempo ($v = v_0 + a \\cdot t$). No gráfico $v \\times t$: 1) A inclinação da reta fornece a aceleração escalar; 2) A ÁREA sob a curva entre dois instantes é numericamente igual ao deslocamento escalar ($\\Delta s$).',
            'Equação de Torricelli: Ferramenta essencial quando o tempo ($t$) não é fornecido no enunciado nem solicitado na resposta.',
            'Queda Livre e Lançamento Vertical: Na subida, o movimento é retardado pela gravidade ($a = -g$); no ponto mais alto da trajetória, a velocidade instantânea anula-se momentaneamente ($v = 0$), embora a aceleração continue sendo $g = 10\\text{ m/s}^2$ dirigida para baixo. O tempo de subida é rigorosamente igual ao tempo de descida para o mesmo nível.'
          ],
          formulas: [
            {
              id: 'torricelli',
              name: 'Equação de Torricelli',
              latex: 'v^2 = v_0^2 + 2 \\cdot a \\cdot \\Delta s',
              description: 'Permite calcular a velocidade final sem necessidade de conhecer o tempo de percurso.',
              variables: [
                { symbol: 'v', meaning: 'Velocidade final', unit: 'm/s' },
                { symbol: 'v_0', meaning: 'Velocidade inicial', unit: 'm/s' },
                { symbol: 'a', meaning: 'Aceleração escalar constante', unit: 'm/s²' },
                { symbol: '\\Delta s', meaning: 'Deslocamento escalar percorrido', unit: 'm' }
              ]
            },
            {
              id: 'posicao-mruv',
              name: 'Função Horária do Espaço (MRUV)',
              latex: 's = s_0 + v_0 \\cdot t + \\frac{1}{2} a \\cdot t^2',
              description: 'Descreve a posição em função do tempo; parábola no gráfico s x t.'
            }
          ],
          tips: [
            'Conversão instantânea de unidades: Para converter de quilômetros por hora ($km/h$) para metros por segundo ($m/s$), DIVIDA por 3,6. Para o sentido inverso ($m/s \\rightarrow km/h$), MULTIPLIQUE por 3,6.'
          ]
        },
        {
          id: 'leis-newton-atrito-energia',
          title: 'Dinâmica Newtoniana, Forças de Atrito e Conservação de Energia Mecânica',
          enemWeight: 'Muito Alta',
          summary: 'Força resultante, atrito estático versus cinético, trabalho de forças e conservação de energia em montanhas-russas e veículos.',
          keyConcepts: [
            'Três Leis de Newton: 1ª Lei (Inércia: se a força resultante é nula, o corpo permanece em repouso ou MRU); 2ª Lei (Princípio Fundamental: $\\vec{F}_{\\text{res}} = m \\cdot \\vec{a}$); 3ª Lei (Ação e Reação: para toda força aplicada existe outra de mesmo módulo, mesma direção e sentido oposto, atuando SEMPRE em corpos distintos, nunca se anulando mutuamente).',
            'Força de Atrito: O atrito estático atua enquanto não há deslizamento ($f_{at,e} \\le \\mu_e \\cdot N$); seu valor máximo é atingido na iminência do movimento. O atrito cinético atua durante o escorregamento relativo ($f_{at,c} = \\mu_c \\cdot N$). Como $\\mu_e > \\mu_c$, os freios ABS evitam o travamento das rodas, mantendo a frenagem sob atrito estático máximo e reduzindo a distância de parada.',
            'Trabalho de uma Força Constante: $\\tau = F \\cdot d \\cdot \\cos\\theta$. Se a força é perpendicular ao deslocamento (como a força centrípeta ou normal em pista plana), $\\cos(90^\\circ) = 0$ e o trabalho é nulo.',
            'Conservação da Energia Mecânica: Em sistemas isolados de forças dissipativas (sem atrito ou resistência do ar), a energia mecânica total permanece constante: $E_{m,\\text{inicial}} = E_{m,\\text{final}}$, onde $E_m = E_c + E_{pg} + E_{pe}$.'
          ],
          formulas: [
            {
              id: 'energia-mecanica-conservacao',
              name: 'Teorema da Conservação da Energia Mecânica',
              latex: 'E_m = \\frac{1}{2} m v^2 + m g h + \\frac{1}{2} k x^2 = \\text{constante}',
              description: 'Soma da energia cinética, potencial gravitacional e potencial elástica em ausência de forças não-conservativas.'
            },
            {
              id: 'potencia-mecanica',
              name: 'Potência Mecânica Média e Instantânea',
              latex: 'P = \\frac{\\tau}{\\Delta t} = F \\cdot v',
              description: 'Taxa temporal de realização de trabalho ou transferência de energia.',
              variables: [
                { symbol: 'P', meaning: 'Potência', unit: 'W (Watts = J/s)' },
                { symbol: '\\tau', meaning: 'Trabalho realizado', unit: 'J (Joules)' },
                { symbol: '\\Delta t', meaning: 'Intervalo de tempo', unit: 's' }
              ]
            }
          ],
          tips: [
            'Em colisões reais no trânsito: a quantidade de movimento ($Q = m \\cdot v$) é sempre conservada em sistemas isolados, mas a energia cinética é convertida em deformação plástica da lataria dos carros, som e calor térmico, aumentando o tempo de desaceleração para reduzir a força de impacto sobre os passageiros.'
          ]
        },
        {
          id: 'hidrostatica-pascal-arquimedes',
          title: 'Hidrostática: Teorema de Stevin, Princípio de Pascal e Empuxo de Arquimedes',
          enemWeight: 'Muito Alta',
          summary: 'Pressão hidrostática em profundidade, multiplicação de forças em prensas hidráulicas e equilíbrio de corpos flutuantes.',
          keyConcepts: [
            'Densidade e Pressão: Densidade ou massa específica $\\rho = m / V$. A pressão é a força normal dividida pela área: $p = F / A$. Quanto menor a área de contato (como o salto agulha ou a lâmina de uma faca afiada), maior a pressão exercida para uma mesma força aplicada.',
            'Teorema de Stevin (Pressão Hidrostática): A pressão no interior de um líquido homogêneo em repouso aumenta linearmente com a profundidade: $p = p_{\\text{atm}} + \\rho \\cdot g \\cdot h$. Pontos situados no mesmo nível horizontal de um mesmo líquido suportam a mesma pressão hidrostática (princípio dos vasos comunicantes). Para cada 10 metros de profundidade na água, a pressão hidrostática aumenta em cerca de $1\\text{ atm} \\approx 10^5\\text{ Pa}$.',
            'Princípio de Pascal: O acréscimo de pressão exercido em um ponto de um líquido incompressível em equilíbrio transmite-se integralmente a todos os pontos do líquido e às paredes do recipiente. Aplicação nas Prensas Hidráulicas e freios automotivos: $F_1 / A_1 = F_2 / A_2$. A força é multiplicada na mesma proporção em que a área do êmbolo é maior!',
            'Princípio de Arquimedes (Empuxo): Todo corpo imerso total ou parcialmente em um fluido sofre uma força vertical dirigida de baixo para cima igual ao PESO DO VOLUME DE FLUIDO DESLOCADO: $E = \\rho_{\\text{líquido}} \\cdot V_{\\text{submerso}} \\cdot g$.',
            'Condições de Flutuação: Se $P > E$ (densidade do corpo maior que a do líquido), o corpo afunda; Se $P < E$, o corpo sobe até a superfície; Se $P = E$ em flutuação parcial, a fração submersa é igual à razão das densidades: $V_{\\text{sub}} / V_{\\text{total}} = \\rho_{\\text{corpo}} / \\rho_{\\text{líquido}}$.'
          ],
          formulas: [
            {
              id: 'stevin-pressao',
              name: 'Teorema Fundamental da Hidrostática (Stevin)',
              latex: 'p = p_0 + \\rho \\cdot g \\cdot h \\implies \\Delta p = \\rho \\cdot g \\cdot \\Delta h',
              description: 'Calcula a pressão absoluta a uma profundidade h em um fluido de densidade rho.'
            },
            {
              id: 'empuxo-arquimedes',
              name: 'Força de Empuxo de Arquimedes',
              latex: 'E = \\rho_{\\text{fluido}} \\cdot V_{\\text{deslocado}} \\cdot g',
              description: 'A força de empuxo depende exclusivamente da densidade do fluido e do volume imerso, e não da massa do objeto.'
            }
          ],
          tips: [
            'Um bloco de gelo flutuando na água pura doce tem cerca de 90% do seu volume submerso e apenas 10% visível acima da superfície, pois a densidade do gelo é $\\approx 0,92\\text{ g/cm}^3$ e a da água é $1,0\\text{ g/cm}^3$. Quando esse gelo derrete completamente, o nível da água do copo NÃO transborda nem se altera!'
          ]
        },
        {
          id: 'gravitacao-kepler-newton',
          title: 'Gravitação Universal: Leis de Kepler, Satélites e Imponderabilidade',
          enemWeight: 'Alta',
          summary: 'A geometria das órbitas planetárias, a força gravitacional newtoniana e o movimento de satélites de comunicação.',
          keyConcepts: [
            '1ª Lei de Kepler (Lei das Órbitas): Os planetas descrevem órbitas elípticas em torno do Sol, com o Sol ocupando um dos focos da elipse.',
            '2ª Lei de Kepler (Lei das Áreas): O segmento de reta (raio vetor) que une o Sol ao planeta varre áreas iguais em intervalos de tempo iguais (velocidade areolar constante). Consequência: a velocidade de translação NÃO é constante ao longo da órbita; é MÁXIMA no Periélio (ponto de maior aproximação do Sol) e MÍNIMA no Afélio (ponto mais afastado).',
            '3ª Lei de Kepler (Lei dos Períodos): A razão entre o quadrado do período de translação ($T^2$) e o cubo do raio médio da órbita ($R^3$) é uma constante para todos os planetas do mesmo sistema: $T^2 / R^3 = k$. Quanto mais distante o planeta estiver da estrela central, mais longo será seu ano e menor será sua velocidade orbital média.',
            'Lei da Gravitação Universal de Newton: Dois corpos atraem-se com forças diretamente proporcionais ao produto de suas massas e inversamente proporcionais ao quadrado da distância entre seus centros: $F_g = G \\cdot (M \\cdot m) / d^2$.',
            'Satélites Geoestacionários: Satélites orbitando no plano equatorial da Terra com período orbital rigorosamente igual ao período de rotação da Terra ($T = 24\\text{ h}$). Permanecem aparentemente parados sobre o mesmo ponto geográfico na superfície, permitindo a operação contínua de antenas parabólicas e transmissões de TV e meteorologia.',
            'Sensação de Gravidade Zero (Imponderabilidade): Em uma estação espacial (ISS), a gravidade NÃO é zero (é cerca de 90% da gravidade na superfície!). Os astronautas "flutuam" porque a estação espacial e tudo dentro dela estão em constante queda livre em direção à Terra, com a velocidade orbital tangencial impedindo que colidam com a superfície.'
          ],
          formulas: [
            {
              id: 'newton-gravitacao',
              name: 'Lei da Gravitação Universal',
              latex: 'F_g = G \\cdot \\frac{M \\cdot m}{d^2}',
              description: 'Onde G é a constante de gravitação universal (~6,67 x 10^-11 N m²/kg²).'
            },
            {
              id: 'velocidade-orbital',
              name: 'Velocidade Orbital Circular de Satélites',
              latex: 'v_{\\text{orbital}} = \\sqrt{\\frac{G \\cdot M}{R}}',
              description: 'A velocidade necessária para orbitar não depende da massa do satélite, apenas da massa do astro central e do raio orbital.'
            }
          ],
          tips: [
            'Se a distância entre dois planetas for duplicada ($2d$), a força gravitacional entre eles é reduzida para a QUARTA PARTE ($F/4$), pois a dependência com a distância é quadrática inversa ($1/d^2$).'
          ]
        }
      ]
    },
    {
      id: 'termodinamica-optica-ondulatoria',
      title: 'Termodinâmica, Óptica e Ondulatória',
      description: 'Termologia, máquinas térmicas, propagação e refração da luz, espelhos e lentes, e fenômenos ondulatórios.',
      subtopics: [
        {
          id: 'calorimetria-termodinamica-carnot',
          title: 'Calorimetria, Leis da Termodinâmica e Ciclo de Carnot',
          enemWeight: 'Muito Alta',
          summary: 'Trocas térmicas sem e com mudança de estado, a equivalência trabalho-calor e o limite teórico de rendimento em motores térmicos.',
          keyConcepts: [
            'Calor Sensível vs. Calor Latente: Calor sensível provoca variação de temperatura sem mudar o estado físico ($Q = m \\cdot c \\cdot \\Delta T$); Calor latente provoca mudança de fase da matéria a temperatura rigorosamente constante ($Q = m \\cdot L$). A capacidade térmica ($C = m \\cdot c = Q / \\Delta T$) mede a inércia térmica do corpo; a água tem alto calor específico ($c = 1\\text{ cal/g}^\circ\\text{C}$), atuando como excelente moderador térmico do clima litorâneo (maritimidade).',
            'Primeira Lei da Termodinâmica: Princípio da conservação da energia para gases ideais: $\\Delta U = Q - W$. Onde $\\Delta U$ é a variação da energia interna (depende apenas da temperatura: $\\Delta U \\propto \\Delta T$), $Q$ é o calor trocado com o meio e $W$ é o trabalho realizado pelo gás ($W = p \\cdot \\Delta V$ a pressão constante). Em uma expansão gasosa ($W > 0$), o gás realiza trabalho sobre a vizinhança; em compressão ($W < 0$), recebe trabalho.',
            'Transformações Gasosas Notáveis: Isotérmica ($T = \\text{constante} \\implies \\Delta U = 0 \\implies Q = W$); Isobárica ($p = \\text{constante}$); Isocórica/Isovolumétrica ($V = \\text{constante} \\implies W = 0 \\implies \\Delta U = Q$); Adiabática (sem troca de calor com o meio, $Q = 0 \\implies \\Delta U = -W$, rápida descompressão resfria o gás bruscamente).',
            'Segunda Lei da Termodinâmica e Ciclo de Carnot: É impossível construir uma máquina térmica que, operando em ciclo, converta integralmente calor em trabalho útil (não existe máquina com rendimento de 100%). Uma máquina sempre rejeita calor para uma fonte fria. O Ciclo de Carnot estabelece o rendimento máximo teórico admissível entre duas temperaturas absolutas em Kelvin.'
          ],
          formulas: [
            {
              id: 'rendimento-carnot',
              name: 'Rendimento Máximo Teórico de Carnot',
              latex: '\\eta_{\\text{Carnot}} = 1 - \\frac{T_{\\text{fria}}}{T_{\\text{quente}}}',
              description: 'As temperaturas Tfria e Tquente devem ser obrigatoriamente expressas na escala absoluta Kelvin (K = °C + 273).'
            },
            {
              id: 'primeira-lei-termo',
              name: 'Primeira Lei da Termodinâmica',
              latex: '\\Delta U = Q - W',
              description: 'Balanço entre variação de energia interna, calor absorvido/cedido e trabalho mecânico realizado/recebido.'
            }
          ],
          tips: [
            'Cuidado fundamental na fórmula de Carnot no ENEM: JAMAIS insira temperaturas em graus Celsius! Converta sempre para Kelvin: $T(K) = \\theta(^\circ\\text{C}) + 273$. Por exemplo, operar entre 27 °C (300 K) e 327 °C (600 K) fornece rendimento máximo de $\\eta = 1 - 300/600 = 0,5 = 50\\%$.'
          ]
        },
        {
          id: 'ondulatoria-fenomenos-doppler',
          title: 'Ondulatória: Fenômenos Ondulatórios, Espectro Eletromagnético e Efeito Doppler',
          enemWeight: 'Muito Alta',
          summary: 'A equação fundamental da onda, reflexão, refração, difração, interferência, polarização e a frequência aparente observada.',
          keyConcepts: [
            'Equação Fundamental da Onda: $v = \\lambda \\cdot f$. A frequência ($f$) é determinada unicamente pela fonte emissora e NÃO se altera quando a onda muda de meio na refração. O que varia na refração são a velocidade ($v$) e o comprimento de onda ($\\lambda$), em proporção direta.',
            'Fenômenos Ondulatórios: 1) Reflexão (a onda bate e volta no mesmo meio, mantendo $v, \\lambda, f$ inalterados); 2) Refração (a onda passa para outro meio alterando sua velocidade); 3) Difração (capacidade da onda de contornar obstáculos ou fendas de dimensões comparáveis ao seu comprimento de onda $\\lambda$, permitindo ouvir sons atrás de muros); 4) Interferência (superposição de ondas em fase resultando em reforço construtivo, ou em oposição de fase resultando em anulação destrutiva; base dos fones com cancelamento de ruído); 5) Polarização (seleção de um único plano de vibração de uma onda transversal; ondas sonoras longitudinais NÃO podem ser polarizadas!).',
            'Efeito Doppler: Variação aparente da frequência percebida por um observador quando há movimento relativo de aproximação ou afastamento entre fonte e observador. Na APROXIMAÇÃO, as frentes de onda são comprimidas, o comprimento de onda aparente diminui e a frequência percebida AUMENTA (o som fica mais AGUDO). No AFASTAMENTO, o som percebido fica mais GRAVE (frequência aparente diminui). Usado em radares de velocidade e no desvio para o vermelho (*redshift*) astronômico da expansão do universo.'
          ],
          formulas: [
            {
              id: 'equacao-fundamental-onda',
              name: 'Equação Fundamental da Ondulatória',
              latex: 'v = \\lambda \\cdot f = \\frac{\\lambda}{T}',
              description: 'Relaciona a velocidade de propagação v com o comprimento de onda lambda e a frequência f.'
            }
          ],
          tips: [
            'No trânsito: quando a sirene de uma ambulância se aproxima de um pedestre parado, o som é percebido como mais agudo (frequência maior); logo após ultrapassar e começar a se afastar, o tom do som cai bruscamente, tornando-se mais grave.'
          ]
        },
        {
          id: 'optica-geometrica-olho-humano',
          title: 'Óptica Geométrica: Reflexão, Refração, Espelhos, Lentes e Visão Humana',
          enemWeight: 'Alta',
          summary: 'Formação de imagens em espelhos e lentes esféricas e a correção óptica de miopia e hipermetropia.',
          keyConcepts: [
            'Lei de Snell da Refração: $n_1 \\cdot \\sin\\theta_1 = n_2 \\cdot \\sin\\theta_2$. Ao passar de um meio menos refringente para um mais refringente ($n_2 > n_1$), a velocidade da luz diminui e o raio aproxima-se da normal ($\\theta_2 < \\theta_1$).',
            'Reflexão Total: Ocorre quando a luz tenta passar de um meio MAIS refringente para um MENOS refringente em ângulo de incidência maior que o ângulo limite ($\\sin\\theta_{\\text{limite}} = n_{\\text{menor}} / n_{\\text{maior}}$). Princípio operacional das FIBRAS ÓPTICAS de telecomunicações.',
            'Lentes Delgadas: Lentes Convergentes (bordas delgadas em ar; formam imagens reais, invertidas e projetáveis em telas ou sensores de câmeras; ou imagem virtual, direita e ampliada quando o objeto está entre o foco e a lente, funcionando como lupa) vs. Lentes Divergentes (bordas espessas em ar; formam SEMPRE imagens virtuais, direitas e menores que o objeto).',
            'Defeitos da Visão Humana: 1) Miopia (o globo ocular é excessivamente longo ou a córnea muito curva; a imagem focaliza ANTES da retina; a pessoa não enxerga bem de longe; correção com LENTES DIVERGENTES de vergência negativa); 2) Hipermetropia (globo ocular curto; a imagem focaliza DEPOIS da retina; dificuldade para enxergar de perto; correção com LENTES CONVERGENTES de vergência positiva); 3) Presbiopia ("vista cansada", perda de elasticidade do cristalino e dos músculos ciliares pelo envelhecimento, corrigida também por lentes convergentes).'
          ],
          formulas: [
            {
              id: 'equacao-gauss-lentes',
              name: 'Equação de Gauss dos Pontos Conjugados',
              latex: '\\frac{1}{f} = \\frac{1}{p} + \\frac{1}{p\'}',
              description: 'Onde f é a distância focal, p é a posição do objeto e p\' é a posição da imagem.'
            },
            {
              id: 'vergencia-grau',
              name: 'Vergência da Lente (Grau Óptico)',
              latex: 'V = \\frac{1}{f}',
              description: 'A distância focal f deve estar em metros para que a vergência V resulte em dioptrias (di ou graus).'
            }
          ],
          tips: [
            'Mnemônico da Miopia no ENEM: O míope tem a imagem formada antes da retina e precisa afastar o foco; afastar requer uma lente que DIVERGE os raios de luz (lente divergente, com grau negativo).'
          ]
        }
      ]
    },
    {
      id: 'eletricidade-magnetismo-moderna',
      title: 'Eletricidade, Eletromagnetismo e Física Moderna',
      description: 'Circuitos resistivos, cálculo de consumo de energia elétrica residencial, indução eletromagnética e efeito fotoelétrico.',
      subtopics: [
        {
          id: 'circuitos-eletricos-potencia-consumo',
          title: 'Circuitos Elétricos, Associação de Resistores e Consumo em kWh',
          enemWeight: 'Muito Alta',
          summary: 'A matéria de maior incidência física do ENEM: Leis de Ohm, circuitos residenciais em paralelo e economia de energia.',
          keyConcepts: [
            'Primeira e Segunda Leis de Ohm: 1ª Lei ($U = R \\cdot I$); 2ª Lei ($R = \\rho \\cdot L / A$: a resistência de um fio é diretamente proporcional ao seu comprimento $L$ e resistividade $\\rho$, e inversamente proporcional à área de sua seção transversal $A$; fios mais grossos e curtos oferecem menor resistência).',
            'Associação em Série vs. Paralelo: Em série, a corrente elétrica é idêntica para todos os elementos ($I_{\\text{total}} = I_1 = I_2$) e a resistência equivalente é a soma ($R_{\\text{eq}} = R_1 + R_2$); se uma lâmpada queimar, todo o circuito apaga. Em PARALELO (instalações elétricas residenciais), a tensão elétrica é a mesma para todas as tomadas e aparelhos ($U = 127\\text{ V}$ ou $220\\text{ V}$ constante), cada ramo opera independentemente, e $1/R_{\\text{eq}} = 1/R_1 + 1/R_2$ (a resistência equivalente total DIMINUI à medida que ligamos mais aparelhos, aumentando a corrente total na fiação e justificando o uso de disjuntores de proteção térmica).',
            'Potência Elétrica e Efeito Joule: $P = U \\cdot I = R \\cdot I^2 = U^2 / R$. Em um chuveiro elétrico ligado a uma ddp fixa ($127\\text{ V}$ ou $220\\text{ V}$), na posição "Inverno" (mais quente), a potência deve ser maior; para aumentar a potência $P = U^2 / R$, a chave seletora REDUZ o comprimento da resistência interna ($R$ menor).'
          ],
          formulas: [
            {
              id: 'energia-eletrica-kwh',
              name: 'Consumo de Energia Elétrica Residencial',
              latex: 'E_{\\text{consumida}} = P \\cdot \\Delta t = \\frac{P_{\\text{(Watts)}} \\cdot \\Delta t_{\\text{(horas)}}}{1000} \\quad [\\text{em kWh}]',
              description: 'Cálculo do valor na conta de luz: multiplica-se a energia em kWh pela tarifa da concessionária.'
            }
          ],
          tips: [
            'Cálculo do chuveiro no ENEM: Um chuveiro de $5500\\text{ W}$ ($5,5\\text{ kW}$) utilizado por 4 pessoas em banhos de 15 minutos diários cada (total de 1 hora/dia) consome $5,5\\text{ kW} \\times 1\\text{ h} = 5,5\\text{ kWh}$ por dia. Em um mês de 30 dias: $5,5 \\times 30 = 165\\text{ kWh}$!'
          ]
        },
        {
          id: 'eletromagnetismo-inducao-faraday',
          title: 'Eletromagnetismo: Força Magnética e Lei da Indução de Faraday-Lenz',
          enemWeight: 'Muito Alta',
          summary: 'O princípio operacional de usinas hidrelétricas, turbinas eólicas, transformadores e motores elétricos.',
          keyConcepts: [
            'Campo Magnético Criado por Correntes (Experimento de Oersted): Toda carga elétrica em movimento gera um campo magnético ao seu redor. Em um fio retilíneo longo: $B = (\\mu \\cdot I) / (2\\pi r)$, com sentido dado pela Regra da Mão Direita.',
            'Força Magnética sobre Cargas Móveis (Força de Lorentz): $F_m = |q| \\cdot v \\cdot B \\cdot \\sin\\theta$. A força magnética atua SEMPRE perpendicularmente ao vetor velocidade e ao campo magnético simultaneamente. Por ser sempre perpendicular à velocidade, a força magnética NÃO realiza trabalho mecânico sobre a partícula ($\tau = 0$) e NÃO altera o módulo de sua energia cinética, alterando apenas a trajetória (gerando movimento circular uniforme quando $\\theta = 90^\\circ$).',
            'Fluxo Magnético ($\\Phi$): Mede a quantidade de linhas de campo que atravessam uma espira de área $A$: $\\Phi = B \\cdot A \\cdot \\cos\\theta$.',
            'Lei da Indução de Faraday e Lei de Lenz: Uma corrente elétrica induzida surge em um circuito fechado SEMPRE E APENAS que houver VARIAÇÃO temporal do fluxo magnético através dele: $\\mathcal{E} = - \\Delta \\Phi / \\Delta t$. A Lei de Lenz (sinal negativo) estabelece que a corrente induzida possui sentido tal que seu próprio campo magnético OPÕE-SE à variação de fluxo que a originou (conservação de energia).'
          ],
          formulas: [
            {
              id: 'faraday-inducao',
              name: 'Lei da Indução Eletromagnética de Faraday-Lenz',
              latex: '\\mathcal{E} = - \\frac{\\Delta \\Phi}{\\Delta t} = - \\frac{\\Delta (B \\cdot A \\cdot \\cos\\theta)}{\\Delta t}',
              description: 'Base da geração de eletricidade em usinas hidrelétricas, eólicas, termoelétricas e usinas nucleares.'
            }
          ],
          tips: [
            'Transformadores de tensão elétrica funcionam EXCLUSIVAMENTE com Corrente Alternada (AC), pois a corrente que varia no tempo cria um fluxo magnético oscilante no núcleo de ferro que induz tensão na bobina secundária. Se for ligado a Corrente Contínua (DC) de bateria, o fluxo não varia e a tensão induzida de saída é ZERO!'
          ]
        },
        {
          id: 'fisica-moderna-efeito-fotoeletrico',
          title: 'Física Moderna: Efeito Fotoelétrico e Energia Solar Fotovoltaica',
          enemWeight: 'Alta',
          summary: 'A quantização da luz proposta por Einstein, a emissão de elétrons em placas metálicas e o funcionamento dos painéis solares.',
          keyConcepts: [
            'O Problema da Física Clássica: Pela teoria ondulatória clássica, qualquer luz com intensidade suficiente deveria ejetar elétrons após algum tempo. No entanto, experimentos mostraram que a ejeção de elétrons depende da FREQUÊNCIA da luz, ocorrendo de forma instantânea sem retardo temporal se a frequência for superior a um limiar mínimo.',
            'Quantização da Luz em Fótons (Albert Einstein, 1905): A luz comporta-se como um feixe de partículas elementares indivisíveis denominadas fótons. Cada fóton transporta uma quantidade discreta ("quantum") de energia diretamente proporcional à sua frequência: $E = h \\cdot f$, onde $h$ é a constante de Planck.',
            'Equação Fotoelétrica de Einstein: $E_{\\text{fóton}} = W_0 + E_{c,\\text{máx}}$, onde $W_0$ (função trabalho) é a energia mínima necessária para arrancar o elétron da rede cristalina do material. Se a frequência do fóton for menor que a frequência de corte ($f < f_0$), NENHUM elétron é ejetado, independentemente da intensidade ou brilho da luz.',
            'Painéis Solares Fotovoltaicos: Células semicondutoras de silício dopado (junção p-n). Fótons de luz solar com energia superior ao *bandgap* do semicondutor excitam elétrons da banda de valência para a banda de condução, gerando pares elétron-lacuna e estabelecendo uma corrente elétrica contínua limpa e renovável.'
          ],
          formulas: [
            {
              id: 'efeito-fotoeletrico',
              name: 'Equação do Efeito Fotoelétrico de Einstein',
              latex: 'h \\cdot f = W_0 + \\frac{1}{2} m v_{\\text{máx}}^2',
              description: 'A energia do fóton incidente é gasta para arrancar o elétron (função trabalho) e o excedente converte-se em energia cinética.'
            }
          ],
          tips: [
            'Aumentar o brilho (intensidade) da luz incidente de uma lâmpada NÃO aumenta a velocidade nem a energia cinética dos elétrons ejetados; aumenta apenas o NÚMERO de fótons por segundo, e consequentemente o número de elétrons ejetados por segundo (intensidade da corrente elétrica fotoelétrica).'
          ]
        }
      ]
    }
  ]
};
