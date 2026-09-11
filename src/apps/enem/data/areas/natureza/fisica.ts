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
            '**Movimento Uniforme** (MRU): Velocidade constante ($a = 0$). Função horária da posição: $s = s_0 + v \\cdot t$. No gráfico $s \\times t$, a inclinação da reta representa a velocidade ($v = \\tan\\theta$).',
            '**Movimento Uniformemente Variado** (MRUV): Aceleração constante ($a \\neq 0$). A velocidade varia linearmente com o tempo ($v = v_0 + a \\cdot t$). No gráfico $v \\times t$: 1) A inclinação da reta fornece a aceleração escalar; 2) A ÁREA sob a curva entre dois instantes é numericamente igual ao deslocamento escalar ($\\Delta s$).',
            '**Equação de Torricelli**: Ferramenta essencial quando o tempo ($t$) não é fornecido no enunciado nem solicitado na resposta.',
            '**Queda Livre e Lançamento Vertical**: Na subida, o movimento é retardado pela gravidade ($a = -g$); no ponto mais alto da trajetória, a velocidade instantânea anula-se momentaneamente ($v = 0$), embora a aceleração continue sendo $g = 10\\text{ m/s}^2$ dirigida para baixo. O tempo de subida é rigorosamente igual ao tempo de descida para o mesmo nível.'
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
            '**Três Leis de Newton**: 1ª Lei (Inércia: se a força resultante é nula, $\\vec{F}_{\\text{res}} = \\vec{0}$, o corpo permanece em repouso ou MRU); 2ª Lei (Princípio Fundamental: $\\vec{F}_{\\text{res}} = m \\cdot \\vec{a}$); 3ª Lei (Ação e Reação: para toda força aplicada existe outra de mesmo módulo, mesma direção e sentido oposto, atuando SEMPRE em corpos distintos, nunca se anulando mutuamente).',
            '**Força de Atrito**: O atrito estático atua enquanto não há deslizamento ($f_{at,e} \\le \\mu_e \\cdot N$); seu valor máximo é atingido na iminência do movimento. O atrito cinético atua durante o escorregamento relativo ($f_{at,c} = \\mu_c \\cdot N$). Como $\\mu_e > \\mu_c$, os freios ABS evitam o travamento das rodas, mantendo a frenagem sob atrito estático máximo e reduzindo a distância de parada.',
            '**Trabalho de uma Força Constante**: $\\tau = F \\cdot d \\cdot \\cos\\theta$. Se a força é perpendicular ao deslocamento (como a força centrípeta ou normal em pista plana), $\\cos(90^\\circ) = 0$ e o trabalho é nulo.',
            '**Conservação da Energia Mecânica**: Em sistemas isolados de forças dissipativas (sem atrito ou resistência do ar), a energia mecânica total permanece constante: $E_{m,\\text{inicial}} = E_{m,\\text{final}}$, onde $E_m = E_c + E_{pg} + E_{pe}$.'
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
            'Em colisões reais no trânsito: o vetor quantidade de movimento ou momento linear ($\\vec{Q} = m \\cdot \\vec{v}$) é sempre conservado em sistemas isolados ($\\Delta \\vec{Q} = \\vec{0}$), sendo o impulso da força resultante $\\vec{I} = \\vec{F}_{\\text{res}} \\cdot \\Delta t = \\Delta \\vec{Q}$. A energia cinética converte-se em deformação plástica da lataria dos carros, som e calor térmico, aumentando o tempo de desaceleração para reduzir a força de impacto sobre os passageiros.'
          ]
        },
        {
          id: 'hidrostatica-pascal-arquimedes',
          title: 'Hidrostática: Teorema de Stevin, Princípio de Pascal e Empuxo de Arquimedes',
          enemWeight: 'Média',
          summary: 'Pressão hidrostática em profundidade, multiplicação de forças em prensas hidráulicas e equilíbrio de corpos flutuantes.',
          keyConcepts: [
            '**Densidade e Pressão**: Densidade ou massa específica $\\rho = m / V$. A pressão é a força normal dividida pela área: $p = F / A$. Quanto menor a área de contato (como o salto agulha ou a lâmina de uma faca afiada), maior a pressão exercida para uma mesma força aplicada.',
            '**Teorema de Stevin** (Pressão Hidrostática): A pressão no interior de um líquido homogêneo em repouso aumenta linearmente com a profundidade: $p = p_{\\text{atm}} + \\rho \\cdot g \\cdot h$. Pontos situados no mesmo nível horizontal de um mesmo líquido suportam a mesma pressão hidrostática (princípio dos vasos comunicantes). Para cada 10 metros de profundidade na água, a pressão hidrostática aumenta em cerca de $1\\text{ atm} \\approx 10^5\\text{ Pa}$.',
            '**Princípio de Pascal**: O acréscimo de pressão exercido em um ponto de um líquido incompressível em equilíbrio transmite-se integralmente a todos os pontos do líquido e às paredes do recipiente. Aplicação nas Prensas Hidráulicas e freios automotivos: $F_1 / A_1 = F_2 / A_2$. A força é multiplicada na mesma proporção em que a área do êmbolo é maior!',
            '**Princípio de Arquimedes** (Empuxo): Todo corpo imerso total ou parcialmente em um fluido sofre uma força vertical dirigida de baixo para cima igual ao PESO DO VOLUME DE FLUIDO DESLOCADO: $E = \\rho_{\\text{líquido}} \\cdot V_{\\text{submerso}} \\cdot g$.',
            '**Condições de Flutuação**: Se $P > E$ (densidade do corpo maior que a do líquido), o corpo afunda; Se $P < E$, o corpo sobe até a superfície; Se $P = E$ em flutuação parcial, a fração submersa é igual à razão das densidades: $V_{\\text{sub}} / V_{\\text{total}} = \\rho_{\\text{corpo}} / \\rho_{\\text{líquido}}$.'
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
          enemWeight: 'Baixa',
          summary: 'A geometria das órbitas planetárias, a força gravitacional newtoniana e o movimento de satélites de comunicação.',
          keyConcepts: [
            '**1ª Lei de Kepler** (Lei das Órbitas): Os planetas descrevem órbitas elípticas em torno do Sol, com o Sol ocupando um dos focos da elipse.',
            '**2ª Lei de Kepler** (Lei das Áreas): O segmento de reta (raio vetor) que une o Sol ao planeta varre áreas iguais em intervalos de tempo iguais (velocidade areolar constante). Consequência: a velocidade de translação NÃO é constante ao longo da órbita; é MÁXIMA no Periélio (ponto de maior aproximação do Sol) e MÍNIMA no Afélio (ponto mais afastado).',
            '**3ª Lei de Kepler** (Lei dos Períodos): A razão entre o quadrado do período de translação ($T^2$) e o cubo do raio médio da órbita ($R^3$) é uma constante para todos os planetas do mesmo sistema: $T^2 / R^3 = k$. Quanto mais distante o planeta estiver da estrela central, mais longo será seu ano e menor será sua velocidade orbital média.',
            '**Lei da Gravitação Universal de Newton**: Dois corpos atraem-se com forças diretamente proporcionais ao produto de suas massas e inversamente proporcionais ao quadrado da distância entre seus centros: $F_g = G \\cdot (M \\cdot m) / d^2$.',
            '**Satélites Geoestacionários**: Satélites orbitando no plano equatorial da Terra com período orbital rigorosamente igual ao período de rotação da Terra ($T = 24\\text{ h}$). Permanecem aparentemente parados sobre o mesmo ponto geográfico na superfície, permitindo a operação contínua de antenas parabólicas e transmissões de TV e meteorologia.',
            '**Sensação de Gravidade Zero** (Imponderabilidade): Em uma estação espacial (ISS), a gravidade NÃO é zero (é cerca de 90% da gravidade na superfície!). Os astronautas "flutuam" porque a estação espacial e tudo dentro dela estão em constante queda livre em direção à Terra, com a velocidade orbital tangencial impedindo que colidam com a superfície.'
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
        },
        {
          id: 'impulso-quantidade-movimento-colisoes',
          title: 'Impulso, Quantidade de Movimento e Colisões na Segurança Automotiva',
          enemWeight: 'Alta',
          summary: 'O teorema do impulso, a conservação do momento linear em sistemas isolados e os mecanismos de segurança veicular como airbags e zonas de deformação programada.',
          keyConcepts: [
            '**Quantidade de Movimento (Momento Linear $\\vec{Q}$)**: Grandeza vetorial que mensura a inércia de um corpo em movimento, dada pelo produto de sua massa escalar pela velocidade vetorial: $\\vec{Q} = m \\cdot \\vec{v}$, expressa em $\\text{kg}\\cdot\\text{m/s}$ ou $\\text{N}\\cdot\\text{s}$. Tem sempre a mesma direção e o mesmo sentido do vetor velocidade.',
            '**Teorema do Impulso ($\\vec{I} = \\Delta \\vec{Q}$)**: O impulso produzido por uma força resultante constante que atua durante um intervalo de tempo $\\Delta t$ é dado por $\\vec{I} = \\vec{F}_{\\text{méd}} \\cdot \\Delta t$. O Teorema do Impulso estabelece que o impulso da força resultante é rigorosamente igual à variação da quantidade de movimento do corpo: $\\vec{I} = \\Delta \\vec{Q} = m\\vec{v} - m\\vec{v}_0$. Em gráficos de Força versus Tempo [$F(t)$], a área sob a curva representa numericamente o impulso total.',
            '**Física da Segurança no Trânsito (Airbag e Zonas de Deformação)**: Em uma frenagem brusca ou colisão, a variação da quantidade de movimento do passageiro (de sua velocidade de cruzeiro até o repouso absoluto) é fixa ($\\Delta Q = \\text{constante}$). Como $F_{\\text{méd}} = \\Delta Q / \\Delta t$, para minimizar a força média de impacto destruidora sobre os ossos e órgãos vitais do motorista, a engenharia automotiva projeta recursos que **maximizam o tempo de desaceleração ($\\Delta t$)**: 1) O **Airbag** infla rapidamente e esvazia de forma controlada ao ser comprimido pelo corpo; 2) As **Zonas de Deformação Programada** amassam plasticamente a lataria dianteira; 3) O **Cinto de Segurança** possui elasticidade calibrada. Quanto maior $\\Delta t$, menor a força de impacto média $F_{\\text{méd}}$!',
            '**Conservação da Quantidade de Movimento em Sistemas Mecanicamente Isolados**: Quando a resultante das forças externas atuando sobre um sistema de corpos é nula ($\\Sigma \\vec{F}_{\\text{ext}} = \\vec{0}$), a quantidade de movimento vetorial total do sistema permanece rigorosamente constante: $\\Sigma \\vec{Q}_{\\text{antes}} = \\Sigma \\vec{Q}_{\\text{depois}}$. Aplica-se ao recuo de armas de fogo, propulsão de foguetes pelo escape de gases em alta velocidade e em todas as colisões mecânicas.',
            '**Classificação das Colisões Mecânicas**: 1) **Perfeitamente Elástica**: conserva tanto a quantidade de movimento quanto a energia cinética total do sistema ($E_{c,\\text{antes}} = E_{c,\\text{depois}}$, coeficiente de restituição $e=1$); 2) **Inelástica (Totalmente Inelástica)**: ocorre a perda MÁXIMA possível de energia cinética (dissipada em deformação plástica, calor térmico e som de impacto), sendo que os corpos colidem e passam a se mover **juntos com a mesma velocidade final** ($v_1\' = v_2\'$, $e=0$); 3) **Parcialmente Elástica**: os corpos se separam, mas há perda parcial de energia cinética ($0 < e < 1$).'
          ],
          formulas: [
            {
              id: 'teorema-impulso-formula',
              name: 'Teorema do Impulso e Quantidade de Movimento',
              latex: '\\vec{I} = \\vec{F}_{\\text{méd}} \\cdot \\Delta t = \\Delta \\vec{Q} = m\\vec{v} - m\\vec{v}_0',
              description: 'O impulso da força resultante é igual à variação da quantidade de movimento.',
              variables: [
                { symbol: '\\vec{I}', meaning: 'Impulso vetorial', unit: 'N·s ou kg·m/s' },
                { symbol: '\\vec{F}_{\\text{méd}}', meaning: 'Força média aplicada', unit: 'N (Newtons)' },
                { symbol: '\\Delta t', meaning: 'Intervalo de tempo do contato', unit: 's' },
                { symbol: '\\Delta \\vec{Q}', meaning: 'Variação do momento linear', unit: 'kg·m/s' }
              ]
            },
            {
              id: 'conservacao-momento-formula',
              name: 'Conservação da Quantidade de Movimento em Sistema Isolado',
              latex: 'm_1 \\vec{v}_1 + m_2 \\vec{v}_2 = m_1 \\vec{v}_1\' + m_2 \\vec{v}_2\'',
              description: 'A quantidade de movimento total inicial é igual à quantidade de movimento total final.'
            }
          ],
          tips: [
            'Pegadinha clássica do ENEM: Em QUALQUER colisão mecânica (seja ela perfeitamente elástica, inelástica ou parcialmente elástica), a quantidade de movimento total SEMPRE se conserva se o sistema for isolado de forças externas. O que se dissipa na colisão inelástica é unicamente a ENERGIA CINÉTICA, convertida em calor, deformação plástica e ondas sonoras!'
          ]
        },
        {
          id: 'estatica-torque-alavancas',
          title: 'Estática do Ponto Material e do Corpo Rígido: Torque e Equilíbrio de Alavancas',
          enemWeight: 'Alta',
          summary: 'As condições de equilíbrio translacional e rotacional, o cálculo do momento de uma força (torque) e a vantagem mecânica dos três tipos de alavancas no cotidiano.',
          keyConcepts: [
            '**Condições Fundamentais de Equilíbrio**: 1) **Equilíbrio Translacional (do Ponto Material)**: para que um corpo não acelere linearmente, a resultante de todas as forças vetoriais aplicadas deve ser nula: $\\Sigma \\vec{F} = \\vec{0}$ (implica aceleração linear $a = 0$, permanecendo em repouso estático ou em Movimento Retilíneo Uniforme); 2) **Equilíbrio Rotacional (do Corpo Rígido Extenso)**: para que um corpo extenso não gire ou altere sua velocidade angular, a soma algébrica de todos os momentos de força (torques) em relação a qualquer polo arbitrário deve ser nula: $\\Sigma \\vec{\\tau} = \\vec{0}$.',
            '**Momento de uma Força (Torque $\\tau$)**: Mede a tendência de uma força fazer um corpo girar em torno de um eixo ou ponto de apoio. É calculado pelo produto da intensidade da força pelo seu braço de alavanca (distância perpendicular da linha de ação da força até o polo de giro): $\\tau = F \\cdot d \\cdot \\sin\\theta$, medido em $\\text{N}\\cdot\\text{m}$. Quanto mais distante do ponto de apoio a força for aplicada (maior o braço $d$), menor será a força muscular necessária para produzir o mesmo efeito rotacional (ex: maçanetas na extremidade oposta às dobradiças da porta, chaves de boca com cabos longos para desapertar parafusos emperrados).',
            '**Princípio das Alavancas de Arquimedes**: Uma máquina simples que multiplica forças baseando-se na igualdade de momentos: $F_{\\text{potente}} \\cdot d_{\\text{potente}} = F_{\\text{resistente}} \\cdot d_{\\text{resistente}}$. A **Vantagem Mecânica** ($VM = F_R / F_P = d_P / d_R$) é maior que 1 sempre que o braço potente for mais longo que o braço resistente.',
            '**Classificação dos Três Tipos de Alavancas no Cotidiano**: 1) **Interfixa**: o Ponto de Apoio (Fixo) situa-se entre a Força Potente e a Força Resistente (ex: gangorra infantil, tesoura, alicate e a articulação da cabeça com a primeira vértebra cervical); 2) **Inter-resistente**: a Força Resistente situa-se entre o ponto fixo e a força potente; como o braço potente é sempre maior que o braço resistente ($d_P > d_R$), SEMPRE proporciona vantagem mecânica multiplicando a força humana (ex: carrinho de mão, quebra-nozes, abridor de garrafas e o movimento da panturrilha elevando o peso do corpo sobre a ponta dos pés); 3) **Interpotente**: a Força Potente situa-se entre o ponto fixo e a carga resistente; o braço potente é menor ($d_P < d_R$), exigindo mais força muscular, porém ampliando a velocidade e a amplitude angular do movimento (ex: pinça cirúrgica, cortador de unhas, vara de pesca e o músculo bíceps braquial flexionando o antebraço).'
          ],
          formulas: [
            {
              id: 'torque-momento-formula',
              name: 'Momento de uma Força (Torque)',
              latex: '\\tau = F \\cdot d \\cdot \\sin\\theta',
              description: 'Mede a tendência rotacional gerada pela força F em relação ao polo a uma distância d.',
              variables: [
                { symbol: '\\tau', meaning: 'Torque ou momento da força', unit: 'N·m' },
                { symbol: 'F', meaning: 'Intensidade da força', unit: 'N' },
                { symbol: 'd', meaning: 'Distância do ponto de aplicação ao eixo (braço)', unit: 'm' },
                { symbol: '\\theta', meaning: 'Ângulo entre a força e a linha do braço', unit: 'graus ou rad' }
              ]
            },
            {
              id: 'equilibrio-alavancas-formula',
              name: 'Equilíbrio de Alavancas de Arquimedes',
              latex: 'F_P \\cdot d_P = F_R \\cdot d_R',
              description: 'Igualdade dos momentos potente e resistente para o equilíbrio estático da alavanca.'
            }
          ],
          tips: [
            'Aplicação biomédica recorrente no ENEM: O antebraço humano funciona como uma alavanca INTERPOTENTE com o cotovelo como ponto fixo e a inserção do tendão do bíceps próxima à articulação. Como o braço potente é minúsculo comparado ao comprimento do antebraço até a mão, o bíceps precisa fazer uma força muscular MUITO MAIOR do que o peso do objeto segurado na mão, compensando esse esforço com enorme ganho de amplitude motora!'
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
            '**Calor Sensível vs. Calor Latente**: Calor sensível provoca variação de temperatura sem mudar o estado físico ($Q = m \\cdot c \\cdot \\Delta T$); Calor latente provoca mudança de fase da matéria a temperatura rigorosamente constante ($Q = m \\cdot L$). A capacidade térmica ($C = m \\cdot c = Q / \\Delta T$) mede a inércia térmica do corpo; a água tem alto calor específico ($c = 1\\text{ cal/g}^\circ\\text{C}$), atuando como excelente moderador térmico do clima litorâneo (maritimidade).',
            '**Primeira Lei da Termodinâmica**: Princípio da conservação da energia para gases ideais: $\\Delta U = Q - W$. Onde $\\Delta U$ é a variação da energia interna (depende apenas da temperatura: $\\Delta U \\propto \\Delta T$), $Q$ é o calor trocado com o meio e $W$ é o trabalho realizado pelo gás ($W = p \\cdot \\Delta V$ a pressão constante). Em uma expansão gasosa ($W > 0$), o gás realiza trabalho sobre a vizinhança; em compressão ($W < 0$), recebe trabalho.',
            '**Transformações Gasosas Notáveis**: Isotérmica ($T = \\text{constante} \\implies \\Delta U = 0 \\implies Q = W$); Isobárica ($p = \\text{constante}$); Isocórica/Isovolumétrica ($V = \\text{constante} \\implies W = 0 \\implies \\Delta U = Q$); Adiabática (sem troca de calor com o meio, $Q = 0 \\implies \\Delta U = -W$, rápida descompressão resfria o gás bruscamente).',
            '**Segunda Lei da Termodinâmica e Ciclo de Carnot**: É impossível construir uma máquina térmica que, operando em ciclo, converta integralmente calor em trabalho útil (não existe máquina com rendimento de 100%). Uma máquina sempre rejeita calor para uma fonte fria. O Ciclo de Carnot estabelece o rendimento máximo teórico admissível entre duas temperaturas absolutas em Kelvin.'
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
          id: 'dilatacao-termica-comportamento-agua',
          title: 'Dilatação Térmica dos Sólidos e Líquidos e Comportamento Anômalo da Água',
          enemWeight: 'Alta',
          summary: 'A variação dimensional de corpos sob aquecimento, dilatação aparente versus real de fluidos e a anomalia hidrológica essencial à vida.',
          keyConcepts: [
            '**Origem Microscópica da Dilatação**: O aumento de temperatura eleva a energia cinética média e a amplitude de oscilação dos átomos na rede cristalina; como a curva de energia potencial interatômica é assimétrica, a distância média entre os núcleos atômicos cresce, provocando a expansão macroscópica do material.',
            '**Dilatação Térmica dos Sólidos**: 1) **Linear** (predomínio de uma dimensão, como trilhos, fios e barras): $\\Delta L = L_0 \\cdot \\alpha \\cdot \\Delta T$; 2) **Superficial** (placas, chapas): $\\Delta A = A_0 \\cdot \\beta \\cdot \\Delta T$, com $\\beta = 2\\alpha$; 3) **Volumétrica** (blocos sólidos): $\\Delta V = V_0 \\cdot \\gamma \\cdot \\Delta T$, com $\\gamma = 3\\alpha$. Dilatação de orifícios/buracos: uma chapa perfurada comporta-se como se o orifício fosse feito do próprio material (o buraco aumenta exatamente na mesma proporção em que a chapa se dilata).',
            '**Aplicações Práticas de Engenharia**: 1) **Juntas de Dilatação**: espaçamentos intencionais deixados entre vãos de viadutos, pontes de concreto e trilhos de trens para evitar empenamento e colapso por tensões térmicas no verão; 2) **Lâminas Bimetálicas**: duas tiras de metais com coeficientes de dilatação linear diferentes ($\alpha_A > \alpha_B$) soldadas lado a lado; ao serem aquecidas, a lâmina curva-se em direção ao metal de menor coeficiente, abrindo ou fechando contatos elétricos em termostatos de ferros de passar e disjuntores.',
            '**Dilatação Térmica dos Líquidos**: Líquidos não possuem forma própria e requerem recipientes sólidos. Como o frasco de vidro também se dilata ao ser aquecido, o líquido extravasado corresponde apenas à **Dilatação Aparente**. A dilatação real do líquido é a soma vetorial escalar da dilatação aparente com a dilatação volumétrica do recipiente: $\\Delta V_{\\text{real}} = \\Delta V_{\\text{aparente}} + \\Delta V_{\\text{frasco}}$.',
            '**Comportamento Anômalo da Água (0 °C a 4 °C)**: A imensa maioria das substâncias dilata-se continuamente com o aquecimento. A água líquida apresenta um comportamento anômalo exclusivo entre $0^\circ\\text{C}$ e $4^\circ\\text{C}$: ao ser aquecida nessa faixa, suas pontes de hidrogênio colapsam em arranjos mais compactos e o seu volume DIMINUI (contração volumétrica), atingindo sua **DENSIDADE MÁXIMA a $4^\circ\\text{C}$** ($1{,}000\\text{ g/cm}^3$). Acima de $4^\circ\\text{C}$, ela passa a dilatar-se normalmente.',
            '**Importância Biológica da Anomalia da Água**: Em invernos rigorosos em lagos temperados e polares, a água da superfície resfria-se até $4^\circ\\text{C}$, tornando-se mais densa e afundando (correntes de convecção). Quando toda a coluna atinge $4^\circ\\text{C}$, a água superficial resfria até $0^\circ\\text{C}$ e congela. Como o gelo é menos denso ($0{,}92\\text{ g/cm}^3$), ele flutua na superfície, atuando como um formidável **isolante térmico** que impede que o calor do fundo escape. Com isso, o fundo do lago permanece líquido a $4^\circ\\text{C}$, preservando a sobrevivência de peixes, algas e ecossistemas aquáticos submersos.'
          ],
          formulas: [
            {
              id: 'dilatacao-linear-formula',
              name: 'Equações da Dilatação Térmica (Linear e Volumétrica)',
              latex: '\\Delta L = L_0 \\cdot \\alpha \\cdot \\Delta T, \\quad \\Delta V_{\\text{real}} = \\Delta V_{\\text{aparente}} + \\Delta V_{\\text{frasco}}',
              description: 'Onde alpha é o coeficiente de dilatação linear (°C^-1) e gamma é o volumétrico (gamma = 3 alpha).',
              variables: [
                { symbol: '\\Delta L', meaning: 'Variação no comprimento', unit: 'm' },
                { symbol: 'L_0', meaning: 'Comprimento inicial', unit: 'm' },
                { symbol: '\\alpha', meaning: 'Coeficiente de dilatação térmica linear', unit: '°C⁻¹ ou K⁻¹' },
                { symbol: '\\Delta T', meaning: 'Variação de temperatura', unit: '°C ou K' }
              ]
            }
          ],
          tips: [
            'Pegadinha recorrente no ENEM: Se uma arruela de metal com um furo central for aquecida no fogo, o furo central FICA MAIOR e não menor! O furo expande-se exatamente como se fosse um disco sólido de metal sofrendo dilatação térmica.'
          ]
        },
        {
          id: 'ondulatoria-fenomenos-doppler',
          title: 'Ondulatória: Fenômenos Ondulatórios, Espectro Eletromagnético e Efeito Doppler',
          enemWeight: 'Muito Alta',
          summary: 'A equação fundamental da onda, reflexão, refração, difração, interferência, polarização e a frequência aparente observada.',
          keyConcepts: [
            '**Equação Fundamental da Onda**: $v = \\lambda \\cdot f$. A frequência ($f$) é determinada unicamente pela fonte emissora e NÃO se altera quando a onda muda de meio na refração. O que varia na refração são a velocidade ($v$) e o comprimento de onda ($\\lambda$), em proporção direta.',
            '**Fenômenos Ondulatórios**: 1) Reflexão (a onda bate e volta no mesmo meio, mantendo $v, \\lambda, f$ inalterados); 2) Refração (a onda passa para outro meio alterando sua velocidade); 3) Difração (capacidade da onda de contornar obstáculos ou fendas de dimensões comparáveis ao seu comprimento de onda $\\lambda$, permitindo ouvir sons atrás de muros); 4) Interferência (superposição de ondas em fase resultando em reforço construtivo, ou em oposição de fase resultando em anulação destrutiva; base dos fones com cancelamento de ruído); 5) Polarização (seleção de um único plano de vibração de uma onda transversal; ondas sonoras longitudinais NÃO podem ser polarizadas!).',
            '**Efeito Doppler**: Variação aparente da frequência percebida por um observador quando há movimento relativo de aproximação ou afastamento entre fonte e observador. Na APROXIMAÇÃO, as frentes de onda são comprimidas, o comprimento de onda aparente diminui e a frequência percebida AUMENTA (o som fica mais AGUDO). No AFASTAMENTO, o som percebido fica mais GRAVE (frequência aparente diminui). Usado em radares de velocidade e no desvio para o vermelho (*redshift*) astronômico da expansão do universo.'
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
          id: 'acustica-qualidades-som-ressonancia',
          title: 'Acústica: Qualidades Fisiológicas do Som, Ressonância e Tubos Sonoros',
          enemWeight: 'Muito Alta',
          summary: 'A distinção entre altura, intensidade e timbre, a escala de decibéis, o fenômeno da ressonância mecânica e os harmônicos em cordas e colunas de ar.',
          keyConcepts: [
            '**Qualidades Fisiológicas do Som**: 1) **Altura**: associada unicamente à **frequência da onda**. Sons de alta frequência são agudos (altos); sons de baixa frequência são graves (baixos); 2) **Intensidade (Volume)**: associada à **amplitude da onda sonora** e à energia transportada por unidade de área. Sons de grande amplitude são fortes; sons de pequena amplitude são fracos; 3) **Timbre**: qualidade que permite distinguir fontes sonoras distintas emitindo a mesma nota musical na mesma frequência fundamental (ex: um violino e um piano tocando a nota Lá de 440 Hz), decorrente do formato complexo da onda gerado pelo conjunto específico de **harmônicos** sobrepostos.',
            '**Nível de Intensidade Sonora (Decibéis)**: A resposta auditiva humana aos estímulos de pressão sonora é logarítmica e não linear. O nível sonoro $\\beta$ é medido em decibéis ($dB$): $\\beta = 10 \\cdot \\log_{10}(I / I_0)$, onde $I_0 = 10^{-12}\\text{ W/m}^2$ é o limiar de audibilidade humana. Um aumento de 10 dB significa multiplicar a intensidade física por 10; um aumento de 20 dB multiplica a intensidade sonora por 100!',
            '**Fenômeno da Ressonância**: Ocorre quando um sistema oscilante é excitado por uma força periódica externa com frequência idêntica ou muito próxima a uma de suas frequências naturais de oscilação. Quando isso ocorre, o sistema absorve energia com eficiência máxima, provocando um **crescimento dramático na amplitude de vibração** (caso do cantor lírico que quebra uma taça de cristal com a voz, o colapso estrutural da ponte de Tacoma Narrows pelo vento, e o circuito sintonizador de rádios e TV).',
            '**Cordas Vibrantes e Tubos Sonoros**: 1) **Cordas e Tubos Abertos**: apresentam nós e ventres; as frequências dos harmônicos formam todos os múltiplos inteiros da frequência fundamental ($f_n = n \\cdot \\frac{v}{2L}$, com $n = 1, 2, 3...$); 2) **Tubos Sonoros Fechados**: uma das extremidades é fechada (formando obrigatoriamente um nó na parede fechada e um ventre na boca aberta); produzem unicamente **harmônicos ímpares** ($f_n = n \\cdot \\frac{v}{4L}$, com $n = 1, 3, 5...$).',
            '**Reflexão do Som: Eco e Reverberação**: O cérebro humano necessita de cerca de $0,1\\text{ s}$ para distinguir dois sons sucessivos como estímulos auditivos separados (persistência auditiva): se o som refletir em um obstáculo e retornar em $\\Delta t \\ge 0,1\\text{ s}$ (distância mínima de $\\approx 17\\text{ m}$ no ar a $340\\text{ m/s}$), ouvimos **Eco** distinto; se $\\Delta t < 0,1\\text{ s}$, os sons sobrepõem-se gerando **Reverberação**.'
          ],
          formulas: [
            {
              id: 'nivel-sonoro-decibeis',
              name: 'Nível de Intensidade Sonora em Decibéis (dB)',
              latex: '\\beta = 10 \\cdot \\log_{10}\\left(\\frac{I}{I_0}\\right)',
              description: 'Onde I é a intensidade em W/m² e I_0 é o limiar mínimo de audibilidade (10^-12 W/m²).'
            },
            {
              id: 'frequencia-cordas-tubos',
              name: 'Frequência dos Harmônicos em Tubo Aberto e Corda',
              latex: 'f_n = n \\cdot \\frac{v}{2L} \\quad (n = 1, 2, 3...)',
              description: 'Para tubo sonoro fechado: f_n = n * v / (4L), exclusivamente para harmônicos com n ímpar.'
            }
          ],
          tips: [
            'Atenção ao vocabulário diário versus a Física no ENEM: Dizer "abaixe o som da televisão" não significa mudar a frequência (altura) para um tom mais grave! Na linguagem física, você está pedindo para diminuir a INTENSIDADE sonora (amplitude da onda, volume).'
          ]
        },
        {
          id: 'optica-geometrica-olho-humano',
          title: 'Óptica Geométrica: Espelhos, Lentes, Defeitos da Visão (Ametropias) e Instrumentos Ópticos',
          enemWeight: 'Alta',
          summary: 'Propagação da luz, formação de imagens em espelhos e lentes, correção óptica de miopia, hipermetropia, astigmatismo e presbiopia, e instrumentos ópticos de ampliação.',
          keyConcepts: [
            '**Princípios da Óptica Geométrica e Espelhos**: 1) Propagação retilínea, independência e reversibilidade dos raios luminosos; 2) **Espelhos Planos**: formam imagens virtuais, direitas, de mesmo tamanho que o objeto e simétricas em relação ao plano do espelho (enantiomorfas / reversão lateral); 3) **Espelhos Côncavos**: convergem os raios e formam imagens reais (projetáveis) ou virtual/ampliada quando o objeto está entre o foco e o vértice (espelhos de maquiagem/dentista); 4) **Espelhos Convexos**: divergem os raios e formam SEMPRE imagens virtuais, direitas e menores, proporcionando maior campo visual (usados em retrovisores laterais e espelhos de segurança em ônibus e esquinas).',
            '**Lei de Snell-Descartes e Reflexão Interna Total**: Ao passar de um meio 1 para um meio 2 com índices de refração diferentes: $n_1 \\cdot \\sin\\theta_1 = n_2 \\cdot \\sin\\theta_2$. Se a luz passa para um meio mais refringente ($n_2 > n_1$), a velocidade diminui e o raio aproxima-se da reta normal. A **Reflexão Total** ocorre exclusivamente quando a luz parte de um meio MAIS refringente para um MENOS refringente em ângulo de incidência maior que o ângulo limite: $\\sin\\theta_{\\text{limite}} = n_{\\text{menor}} / n_{\\text{maior}}$. Esse é o princípio físico soberano das **fibras ópticas**, da endoscopia médica e do fenômeno das miragens em asfaltos quentes.',
            '**Lentes Esféricas Delgadas**: 1) **Lentes Convergentes** (bordas delgadas no ar, distância focal $f > 0$): concentram raios paralelos no foco principal imagem real; geram imagens reais e invertidas (para objetos além do foco, como no olho humano ou câmera fotográfica) ou imagem virtual, direita e maior (quando o objeto está entre o foco e a lente, atuando como lupa); 2) **Lentes Divergentes** (bordas espessas no ar, distância focal $f < 0$): espalham os raios incidentes; formam SEMPRE imagens virtuais, direitas e menores que o objeto.',
            '**Defeitos da Visão Humana (Ametropias) e Correção Óptica**: 1) **Miopia**: o bulbo ocular é excessivamente alongado ou a córnea/cristalino possui convergência excessiva; os raios paralelos convergem e focalizam ANTES da retina; o míope não enxerga nitidamente objetos distantes (seu Ponto Remoto é finito, $P_r < \\infty$); correção com **LENTES DIVERGENTES** de vergência negativa ($V < 0$) para afastar o foco em direção à retina ($f = -d_{\\text{máx}}$); 2) **Hipermetropia**: o bulbo ocular é excessivamente curto ou o sistema óptico pouco convergente; o foco forma-se TEORICAMENTE ATRÁS da retina; dificuldade acentuada para focar objetos próximos (Ponto Próximo recuado, $P_p > 25\\text{ cm}$); correção com **LENTES CONVERGENTES** de vergência positiva ($V > 0$); 3) **Astigmatismo**: assimetria ou irregularidade na curvatura da córnea, que apresenta raios desiguais em meridianos distintos; os raios de luz focalizam-se em planos diferentes, provocando deformação e visão borrada para perto e longe; correção com **LENTES CILÍNDRICAS**; 4) **Presbiopia ("Vista Cansada")**: perda fisiológica gradual da elasticidade do cristalino e fadiga progressiva dos músculos ciliares decorrente do envelhecimento (geralmente após os 40 anos); redução da amplitude de acomodação visual para leitura próxima; correção com lentes convergentes, bifocais ou multifocais.',
            '**Instrumentos Ópticos de Ampliação**: 1) **Lupa (Microscópio Simples)**: lente convergente simples de pequena distância focal; o objeto é posicionado entre o foco e o centro óptico ($0 < p < f$), produzindo imagem virtual, direita e ampliada; 2) **Microscópio Óptico Composto**: constituído por duas lentes convergentes associadas: a **Objetiva** (voltada para o espécime minúsculo, de distância focal milimétrica, produzindo imagem intermediária real, invertida e muito ampliada) e a **Ocular** (voltada para o olho do observador, que funciona como lupa captando a imagem da objetiva e formando uma imagem final virtual, invertida e com aumento angular extraordinário: $A_{\\text{total}} = A_{\\text{obj}} \\cdot A_{\\text{oc}}$); 3) **Luneta Astronômica**: utiliza uma objetiva de grande distância focal para capturar raios de astros no infinito e uma ocular para ampliação.'
          ],
          formulas: [
            {
              id: 'equacao-gauss-lentes',
              name: 'Equação de Gauss dos Pontos Conjugados',
              latex: '\\frac{1}{f} = \\frac{1}{p} + \\frac{1}{p\'}',
              description: 'Relaciona a distância focal da lente com as posições do objeto e da imagem.',
              variables: [
                { symbol: 'f', meaning: 'Distância focal da lente (positiva para convergente, negativa para divergente)', unit: 'm' },
                { symbol: 'p', meaning: 'Posição / distância do objeto ao centro óptico da lente', unit: 'm' },
                { symbol: 'p\'', meaning: 'Posição / distância da imagem ao centro óptico (positiva = real, negativa = virtual)', unit: 'm' }
              ]
            },
            {
              id: 'vergencia-grau',
              name: 'Vergência da Lente (Poder de Convergência / Grau Óptico)',
              latex: 'V = \\frac{1}{f}',
              description: 'Inverso da distância focal em metros. Vergência positiva para lentes convergentes e negativa para divergentes.',
              variables: [
                { symbol: 'V', meaning: 'Vergência óptica ("grau" da lente)', unit: 'di (dioptrias)' },
                { symbol: 'f', meaning: 'Distância focal da lente no Sistema Internacional', unit: 'm' }
              ]
            },
            {
              id: 'aumento-linear-transversal',
              name: 'Aumento Linear Transversal (Ampliação)',
              latex: 'A = \\frac{i}{o} = -\\frac{p\'}{p} = \\frac{f}{f - p}',
              description: 'Razão entre o tamanho da imagem e o tamanho do objeto; o sinal indica se a imagem é direita (A > 0) ou invertida (A < 0).',
              variables: [
                { symbol: 'A', meaning: 'Aumento linear transversal', unit: 'adimensional' },
                { symbol: 'i', meaning: 'Altura da imagem', unit: 'm' },
                { symbol: 'o', meaning: 'Altura do objeto', unit: 'm' }
              ]
            },
            {
              id: 'associacao-lentes-justapostas',
              name: 'Associação de Lentes Delgadas Justapostas',
              latex: 'V_{\\text{eq}} = V_1 + V_2 \\iff \\frac{1}{f_{\\text{eq}}} = \\frac{1}{f_1} + \\frac{1}{f_2}',
              description: 'A vergência equivalente de lentes justapostas finas é a soma algébrica das vergências individuais.',
              variables: [
                { symbol: 'V_{\\text{eq}}', meaning: 'Vergência do sistema óptico equivalente', unit: 'di' },
                { symbol: 'V_1, V_2', meaning: 'Vergências ópticas das lentes individuais acopladas', unit: 'di' }
              ]
            }
          ],
          tips: [
            'Mnemônico infalível para o ENEM: Na **MIOPIA**, a imagem cai antes da retina (foco adiantado); você precisa DIVERGIR os raios para mandá-los mais longe (lente divergente, sinal de grau negativo "-"). Na **HIPERMETROPIA**, a imagem quer se formar atrás da retina (falta convergência); você precisa CONVERGIR os raios mais rápido (lente convergente, grau positivo "+"). No **ASTIGMATISMO**, a córnea parece uma bola de futebol americano em vez de uma bola de futebol; a correção exige LENTES CILÍNDRICAS.'
          ]
        }
      ]
    },
    {
      id: 'eletricidade-magnetismo-moderna',
      title: 'Eletricidade, Eletromagnetismo e Física Moderna',
      description: 'Eletrostática, circuitos resistivos, consumo elétrico residencial, indução eletromagnética e física moderna.',
      subtopics: [
        {
          id: 'eletrostatica-processos-coulomb-blindagem',
          title: 'Eletrostática: Processos de Eletrização, Lei de Coulomb e Gaiola de Faraday',
          enemWeight: 'Alta',
          summary: 'Cargas elétricas, métodos de eletrização por atrito, contato e indução, força eletrostática, campo elétrico e o efeito de blindagem da Gaiola de Faraday.',
          keyConcepts: [
            '**Princípios Fundamentais da Carga Elétrica**: 1) **Princípio da Atração e Repulsão**: cargas de mesmo sinal elétrico se repelem mutuamente; cargas de sinais opostos se atraem; 2) **Princípio da Conservação das Cargas**: em um sistema eletricamente isolado, a soma algébrica das cargas elétricas permanece constante; 3) **Quantização da Carga**: $Q = n \\cdot e$, onde $e = 1,6 \\times 10^{-19}\\text{ C}$ é a carga elementar do elétron/próton.',
            '**Processos de Eletrização**: 1) **Por Atrito**: corpos de materiais distintos são friccionados; elétrons migram do corpo com menor afinidade para o de maior afinidade; adquirem **cargas de mesmo módulo e sinais OPOSTOS**; 2) **Por Contato**: condutores entram em contato direto; há redistribuição de elétrons; adquirem **cargas de MESMO SINAL** elétrico; 3) **Por Indução Eletrostática**: aproximação de condutor neutro por indutor (sem contato); aterra-se o induzido à Terra; corta-se a ligação e afasta-se o indutor; o induzido adquire **carga de sinal OPOSTO** ao do indutor.',
            '**Lei de Coulomb e Força Eletrostática**: A intensidade da força entre duas cargas pontiformes no vácuo é dada por $F_e = k_0 \\frac{|q_1 \\cdot q_2|}{d^2}$, com $k_0 = 9 \\times 10^9\\text{ N}\\cdot\\text{m}^2/\\text{C}^2$. A dependência com a distância é inversamente proporcional ao quadrado da distância ($1/d^2$).',
            '**Campo Elétrico e Potencial**: O campo elétrico $\\vec{E} = \\vec{F}_e / q$ representa a perturbação espacial gerada pela carga. O trabalho da força elétrica independe da trajetória percorrida (campo conservativo): $\\tau_{AB} = q \\cdot (V_A - V_B) = q \\cdot U$.',
            '**Equilíbrio Eletrostático e Gaiola de Faraday (Blindagem Eletrostática)**: Em um condutor em equilíbrio eletrostático: 1) O excesso de carga localiza-se **exclusivamente na superfície externa**; 2) O **campo elétrico no interior oco é RIGOROSAMENTE NULO** ($\\vec{E}_{\\text{interno}} = \\vec{0}$); 3) O potencial elétrico é constante. Essa propriedade (Gaiola de Faraday) faz com que a carcaça metálica de um automóvel ou de um avião proteja integralmente seus ocupantes contra descargas atmosféricas.'
          ],
          formulas: [
            {
              id: 'lei-coulomb',
              name: 'Lei de Coulomb da Força Eletrostática',
              latex: 'F_e = k_0 \\cdot \\frac{|q_1 \\cdot q_2|}{d^2}',
              description: 'Força eletrostática entre duas cargas puntiformes no vácuo (k0 = 9 x 10^9 N m²/C²).'
            },
            {
              id: 'campo-eletrico-uniforme',
              name: 'Relação em Campo Elétrico Uniforme (CEU)',
              latex: 'U = E \\cdot d \\quad \\text{e} \\quad \\tau = q \\cdot U',
              description: 'A diferença de potencial U entre duas placas paralelas distanciadas por d é o produto do campo elétrico pela distância.'
            }
          ],
          tips: [
            'Segurança em tempestades no ENEM: Se um raio atingir um carro durante uma tempestade, os pneus de borracha NÃO são o motivo principal da proteção. A proteção decorre da BLINDAGEM ELETROSTÁTICA da carroceria metálica (Gaiola de Faraday), que conduz a corrente elétrica pela superfície externa até o solo sem afetar a cabine.'
          ]
        },
        {
          id: 'circuitos-eletricos-potencia-consumo',
          title: 'Circuitos Elétricos, Associação de Resistores, Geradores Reais e Consumo em kWh',
          enemWeight: 'Muito Alta',
          summary: 'A matéria de maior incidência física do ENEM: Leis de Ohm, circuitos residenciais em paralelo, equação do gerador real, Lei de Pouillet e economia de energia elétrica.',
          keyConcepts: [
            '**Primeira e Segunda Leis de Ohm**: 1ª Lei ($U = R \\cdot I$); 2ª Lei ($R = \\rho \\cdot L / A$: a resistência de um condutor é diretamente proporcional ao seu comprimento $L$ e à sua resistividade elétrica $\\rho$, e inversamente proporcional à área de sua seção transversal $A$; fios mais grossos e mais curtos oferecem menor resistência elétrica, aquecendo menos e reduzindo perdas na rede de transmissão).',
            '**Associação em Série versus Paralelo**: Em SÉRIE, a corrente elétrica é idêntica para todos os elementos ($I_{\\text{total}} = I_1 = I_2 = \\dots$) e a resistência equivalente é a soma direta ($R_{\\text{eq}} = R_1 + R_2$); a tensão divide-se proporcionalmente e a queima de um dispositivo interrompe o fluxo no circuito inteiro. Em PARALELO (padrão universal das instalações elétricas residenciais), a tensão elétrica é a mesma para todas as tomadas e aparelhos ($U = 127\\text{ V}$ ou $220\\text{ V}$ constante), cada ramo opera de modo totalmente independente e a resistência equivalente diminui à medida que mais aparelhos são ligados ($1/R_{\\text{eq}} = \\sum 1/R_i$), elevando a corrente total na fiação principal e exigindo dimensionamento rigoroso dos condutores e disjuntores.',
            '**Potência Elétrica e Efeito Joule**: $P = U \\cdot I = R \\cdot I^2 = U^2 / R$. Em um chuveiro elétrico ligado a uma ddp fixa da rede domiciliar ($U$ constante), na posição "Inverno" (banho mais quente), a potência térmica precisa ser maior; pela relação $P = U^2 / R$, para aumentar a potência dissipada, a chave seletora diminui o comprimento do resistor interno ($R$ menor).',
            '**Geradores Elétricos Reais e Curva Característica**: Um gerador real (pilha, bateria química, alternador) converte energia química/mecânica em energia elétrica, possuindo uma força eletromotriz (fem $\\mathcal{E}$) e uma resistência interna dissipativa ($r$). A tensão útil $U$ entregue aos terminais externos é regida pela **Equação do Gerador**: $U = \\mathcal{E} - r \\cdot i$. Em circuito aberto ($i = 0$), não há corrente e a tensão útil é máxima, igual à fem ($U = \\mathcal{E}$). Em situação de curto-circuito ($U = 0$), a corrente atinge seu pico destrutivo: $i_{cc} = \\mathcal{E} / r$. A curva característica no gráfico $U \\times i$ é uma reta decrescente de coeficiente angular $-r$. O rendimento elétrico do gerador é $\\eta = U / \\mathcal{E} = P_{\\text{útil}} / P_{\\text{total}}$, atingindo potência útil máxima transferida à carga externa quando $R_{\\text{ext}} = r$ (Teorema da Máxima Transferência de Potência).',
            '**Receptores Elétricos Reais e a Lei de Pouillet**: Dispositivos que convertem energia elétrica em energia mecânica ou química (como motores elétricos e baterias durante o processo de recarga) possuem força contraeletromotriz (fcem $\\mathcal{E}\'$) e resistência interna $r\'$. A **Equação do Receptor** é $U\' = \\mathcal{E}\' + r\' \\cdot i$, com curva característica crescente no gráfico $U \\times i$. Em um circuito de malha fechada única contendo geradores, receptores e resistores ôhmicos externos, a intensidade da corrente elétrica é calculada diretamente pela **Lei de Pouillet**: $i = \\frac{\\sum \\mathcal{E} - \\sum \\mathcal{E}\'}{\\sum R + \\sum r + \\sum r\'}$.'
          ],
          formulas: [
            {
              id: 'energia-eletrica-kwh',
              name: 'Consumo de Energia Elétrica Residencial',
              latex: 'E_{\\text{consumida}} = P \\cdot \\Delta t = \\frac{P_{\\text{(Watts)}} \\cdot \\Delta t_{\\text{(horas)}}}{1000} \\quad [\\text{em kWh}]',
              description: 'Cálculo do valor monetário na conta de luz: multiplica-se a energia consumida em kWh pela tarifa cobrada pela distribuidora.',
              variables: [
                { symbol: 'E_{\\text{consumida}}', meaning: 'Energia elétrica consumida', unit: 'kWh' },
                { symbol: 'P', meaning: 'Potência nominal do aparelho elétrico', unit: 'W ou kW' },
                { symbol: '\\Delta t', meaning: 'Intervalo de tempo total de funcionamento', unit: 'h' }
              ]
            },
            {
              id: 'potencia-eletrica-geral',
              name: 'Expressões da Potência Elétrica Dissipada e Útil',
              latex: 'P = U \\cdot I = R \\cdot I^2 = \\frac{U^2}{R}',
              description: 'Cálculo da taxa temporal de transformação de energia elétrica em calor, luz ou trabalho mecânico.',
              variables: [
                { symbol: 'P', meaning: 'Potência elétrica', unit: 'W (Watts)' },
                { symbol: 'U', meaning: 'Diferença de potencial elétrico (tensão/ddp)', unit: 'V (Volts)' },
                { symbol: 'I', meaning: 'Intensidade da corrente elétrica', unit: 'A (Ampères)' },
                { symbol: 'R', meaning: 'Resistência elétrica do condutor', unit: '\\Omega (Ohms)' }
              ]
            },
            {
              id: 'equacao-gerador-real',
              name: 'Equação do Gerador Elétrico Real',
              latex: 'U = \\mathcal{E} - r \\cdot i \\quad \\text{com} \\quad i_{cc} = \\frac{\\mathcal{E}}{r}',
              description: 'Determina a tensão útil fornecida por uma pilha ou bateria real em função da corrente drenada.',
              variables: [
                { symbol: 'U', meaning: 'Tensão elétrica útil disponível nos terminais externos', unit: 'V' },
                { symbol: '\\mathcal{E}', meaning: 'Força eletromotriz total gerada (fem)', unit: 'V' },
                { symbol: 'r', meaning: 'Resistência elétrica interna dissipativa do gerador', unit: '\\Omega' },
                { symbol: 'i', meaning: 'Corrente elétrica total fornecida pelo gerador', unit: 'A' },
                { symbol: 'i_{cc}', meaning: 'Corrente máxima de curto-circuito', unit: 'A' }
              ]
            },
            {
              id: 'lei-pouillet',
              name: 'Lei de Pouillet para Circuito Simples',
              latex: 'i = \\frac{\\sum \\mathcal{E} - \\sum \\mathcal{E}\'}{\\sum R_{\\text{ext}} + \\sum r_{\\text{ger}} + \\sum r\'_{\\text{rec}}}',
              description: 'Permite calcular a corrente em circuitos de malha única com geradores, receptores e resistores.',
              variables: [
                { symbol: 'i', meaning: 'Corrente elétrica que percorre a malha única', unit: 'A' },
                { symbol: '\\sum \\mathcal{E}', meaning: 'Soma das forças eletromotrizes dos geradores', unit: 'V' },
                { symbol: '\\sum \\mathcal{E}\'', meaning: 'Soma das forças contraeletromotrizes dos receptores', unit: 'V' },
                { symbol: '\\sum R_{\\text{total}}', meaning: 'Soma de todas as resistências do circuito (internas e externas)', unit: '\\Omega' }
              ]
            }
          ],
          tips: [
            'Cálculo do chuveiro no ENEM: Um chuveiro de $5500\\text{ W}$ ($5,5\\text{ kW}$) utilizado por 4 pessoas em banhos de 15 minutos diários cada (total de 1 hora/dia) consome $5,5\\text{ kW} \\times 1\\text{ h} = 5,5\\text{ kWh}$ por dia. Em um mês de 30 dias: $5,5 \\times 30 = 165\\text{ kWh}$!'
          ],
          deepSections: [
            {
              title: 'Teorema da Máxima Transferência de Potência em Geradores Reais',
              explanation: 'Em provas avançadas como FUVEST, ITA e UNICAMP, frequentemente cobra-se a otimização de circuitos reais. Quando um gerador de fem $\\mathcal{E}$ e resistência interna $r$ é conectado a um resistor de carga externa regulável $R$, qual deve ser o valor de $R$ para que a potência útil consumida pela carga seja máxima?',
              bullets: [
                '**Dedução por Função Quadrática da Potência Útil**: A potência entregue ao circuito externo é dada por $P_{\\text{útil}}(i) = U \\cdot i = (\\mathcal{E} - r \\cdot i) \\cdot i = -r \\cdot i^2 + \\mathcal{E} \\cdot i$. Trata-se de uma parábola com concavidade voltada para baixo ($a = -r < 0$). O valor de corrente que maximiza a função é a coordenada do vértice da parábola: $i_{\\text{ótima}} = -\\frac{b}{2a} = \\frac{\\mathcal{E}}{2r} = \\frac{1}{2} i_{cc}$.',
                '**Casamento de Impedâncias Resistivas ($R = r$)**: Pela Lei de Pouillet, a corrente no circuito simples é $i = \\frac{\\mathcal{E}}{R + r}$. Igualando com $i_{\\text{ótima}} = \\frac{\\mathcal{E}}{2r}$, obtém-se imediatamente: $R + r = 2r \\implies R = r$. Portanto, a potência transferida ao resistor externo é MÁXIMA quando sua resistência é estritamente igual à resistência interna do gerador.',
                '**Valor Máximo e Eficiência no Vértice**: Substituindo $i = \\frac{\\mathcal{E}}{2r}$, a potência máxima fornecida é $P_{\\text{máx}} = \\frac{\\mathcal{E}^2}{4r}$. O rendimento do gerador nessa condição é $\\eta = \\frac{U}{\\mathcal{E}} = \\frac{\\mathcal{E} - r(\\mathcal{E}/2r)}{\\mathcal{E}} = 50\\%$. Isso significa que metade de toda a energia elétrica produzida é inevitavelmente dissipada internamente em calor pelo efeito Joule dentro do próprio gerador.'
              ]
            },
            {
              title: 'Análise Nodal e Equilíbrio da Ponte de Wheatstone',
              explanation: 'Em um circuito em ponte de quatro resistores alimentado por tensão contínua, a determinação de correntes exige a aplicação sistemática dos potenciais dos nós intermediários $V_C$ e $V_D$.',
              bullets: [
                '**Dedução do Equilíbrio Nodal**: Os ramos laterais formam dois divisores de tensão independentes. O potencial no nó $C$ é $V_C = U \\cdot \\frac{R_2}{R_1 + R_2}$ e no nó $D$ é $V_D = U \\cdot \\frac{R_4}{R_3 + R_4}$. Para que o galvanômetro central não registre corrente ($I_G = 0$), os potenciais devem ser iguais ($V_C = V_D$), o que conduz diretamente à igualdade algébrica dos produtos cruzados: $R_1 \\cdot R_4 = R_2 \\cdot R_3$.',
                '**Ponte em Desequilíbrio**: Se $R_1 \\cdot R_4 \\neq R_2 \\cdot R_3$, o galvanômetro é percorrido por corrente cujo sentido revela qual dos dois nós possui maior potencial elétrico, sendo essa assimetria a base dos sensores de deformação (*strain gauges*) em pontes e túneis civis.'
              ]
            }
          ]
        },
        {
          id: 'leis-kirchhoff-instrumentos-medicao',
          title: 'Leis de Kirchhoff, Ponte de Wheatstone e Instrumentos de Medição (Voltímetro e Amperímetro)',
          enemWeight: 'Alta',
          summary: 'Conservação da carga e da energia em malhas elétricas complexas, circuitos em ponte de Wheatstone e a conexão correta de aparelhos de medição ideais e dispositivos de segurança.',
          keyConcepts: [
            '**Primeira Lei de Kirchhoff (Lei dos Nós)**: Em qualquer ponto de ramificação (nó) de um circuito elétrico, a soma das intensidades das correntes elétricas que chegam é RIGOROSAMENTE IGUAL à soma das que saem: $\\sum I_{\\text{chega}} = \\sum I_{\\text{sai}}$. Essa lei é consequência direta do Princípio da Conservação da Carga Elétrica (a carga não se acumula nem é destruída no nó).',
            '**Segunda Lei de Kirchhoff (Lei das Malhas)**: Ao percorrer qualquer malha fechada de um circuito em um sentido pré-determinado, a soma algébrica de todas as diferenças de potencial elétrico (quedas de tensão resistivas e forças eletromotrizes de geradores e receptores) é NULA: $\\sum \\Delta V = 0$. Essa lei expressa o Princípio da Conservação da Energia mecânica e elétrica ao longo de um percurso fechado conservativo.',
            '**Ponte de Wheatstone em Equilíbrio**: Circuito formado por quatro resistores dispostos em losango interligados por um galvanômetro sensível central. Quando o produto das resistências dos braços opostos é igual ($R_1 \\cdot R_4 = R_2 \\cdot R_3$), a diferença de potencial entre os terminais centrais anula-se ($V_C - V_D = 0$), e a corrente no galvanômetro é NULA ($I_G = 0$). Aplicação tecnológica: medição de resistências desconhecidas com altíssima precisão e sensores industriais de deformação mecânica (*strain gauges*) em balanças digitais.',
            '**Voltímetro Ideal**: Instrumento destinado a medir a diferença de potencial (tensão/ddp) entre dois pontos de um circuito. Deve ser conectado SEMPRE em PARALELO com o componente a ser medido. Um voltímetro IDEAL possui **resistência interna infinitamente grande ($R_v \\to \\infty$)**, de modo a não desviar corrente elétrica do circuito original.',
            '**Amperímetro Ideal**: Instrumento destinado a medir a intensidade da corrente elétrica que atravessa um condutor. Deve ser inserido SEMPRE em SÉRIE com o ramo analisado (a corrente precisa passar por dentro dele). Um amperímetro IDEAL possui **resistência interna rigorosamente nula ($R_a \\to 0$)**, para não introduzir nenhuma resistência adicional nem provocar queda de tensão no circuito.',
            '**Curto-Circuito, Fusíveis e Disjuntores**: Um curto-circuito ocorre quando dois pontos de potenciais elétricos distintos são unidos por um condutor de resistência praticamente nula ($R \\to 0$). Pela 1ª Lei de Ohm ($I = U/R$), a corrente elétrica dispara para valores gigantescos ($I \\to \\infty$), provocando intenso superaquecimento por Efeito Joule e risco de incêndio. Para proteger as instalações, utilizam-se **Fusíveis** (fio calibrado com baixo ponto de fusão que se funde e quebra o circuito) e **Disjuntores Termomagnéticos** (chaves automáticas rearmáveis que desarmam por dilatação térmica de lâmina bimetálica ou por indução eletromagnética imediata).'
          ],
          formulas: [
            {
              id: 'leis-kirchhoff-formula',
              name: 'Leis de Kirchhoff dos Nós e das Malhas',
              latex: '\\sum I_{\\text{chega}} = \\sum I_{\\text{sai}}, \\quad \\sum \\mathcal{E} - \\sum (R \\cdot I) = 0',
              description: 'Conservação da carga em cada nó e conservação da energia em malhas fechadas.'
            },
            {
              id: 'ponte-wheatstone-formula',
              name: 'Condição de Equilíbrio da Ponte de Wheatstone',
              latex: 'R_1 \\cdot R_4 = R_2 \\cdot R_3 \\iff I_{\\text{galvanômetro}} = 0',
              description: 'O produto cruzado das resistências opostas é igual quando não há corrente no ramo intermediário.'
            }
          ],
          tips: [
            'Erros clássicos no laboratório e no ENEM: Se você ligar um AMPERÍMETRO em paralelo com uma lâmpada, como a resistência dele é quase zero ($R_a \\to 0$), ele criará um CURTO-CIRCUITO na lâmpada, apagando-a e podendo queimar o fusível do aparelho! Já se você ligar um VOLTÍMETRO em série por engano, como sua resistência é gigantesca ($R_v \\to \\infty$), ele praticamente interromperá a corrente do circuito, fazendo a lâmpada apagar.'
          ]
        },
        {
          id: 'eletromagnetismo-inducao-faraday',
          title: 'Eletromagnetismo: Força Magnética e Lei da Indução de Faraday-Lenz',
          enemWeight: 'Alta',
          summary: 'O princípio operacional de usinas hidrelétricas, turbinas eólicas, transformadores e motores elétricos.',
          keyConcepts: [
            '**Campo Magnético Criado por Correntes** (Experimento de Oersted): Toda carga elétrica em movimento gera um campo magnético ao seu redor. Em um fio retilíneo longo, o campo magnético tem intensidade $B = \\frac{\\mu \\cdot I}{2\\pi r}$, com sentido dado pela Regra da Mão Direita.',
            '**Força Magnética sobre Cargas Móveis** (Força de Lorentz): $\\vec{F}_m = q (\\vec{v} \\times \\vec{B})$, com intensidade escalar $F_m = |q| \\cdot v \\cdot B \\cdot \\sin\\theta$. A força magnética $\\vec{F}_m$ atua perpendicularmente ao plano formado pela velocidade $\\vec{v}$ e pelo campo $\\vec{B}$. Por ser sempre perpendicular à velocidade $\\vec{v}$, a força magnética NÃO realiza trabalho mecânico sobre a partícula ($\\tau = 0$) e NÃO altera o valor de sua energia cinética, modificando apenas a trajetória (gerando movimento circular uniforme quando $\\theta = 90^\\circ$).',
            '**Fluxo Magnético** ($\\Phi$): Mede a quantidade de linhas de campo que atravessam uma espira de área $A$: $\\Phi = B \\cdot A \\cdot \\cos\\theta$.',
            '**Lei da Indução de Faraday e Lei de Lenz**: Uma corrente elétrica induzida surge em um circuito fechado SEMPRE E APENAS que houver VARIAÇÃO temporal do fluxo magnético através dele: $\\mathcal{E} = - \\frac{\\Delta \\Phi}{\\Delta t}$. A Lei de Lenz (sinal negativo) estabelece que a corrente induzida possui sentido tal que seu próprio campo magnético induzido se opõe à variação de fluxo que a originou (conservação de energia).'
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
          enemWeight: 'Média',
          summary: 'A quantização da luz proposta por Einstein, a emissão de elétrons em placas metálicas e o funcionamento dos painéis solares.',
          keyConcepts: [
            '**O Problema da Física Clássica**: Pela teoria ondulatória clássica, qualquer luz com intensidade suficiente deveria ejetar elétrons após algum tempo. No entanto, experimentos mostraram que a ejeção de elétrons depende da FREQUÊNCIA da luz, ocorrendo de forma instantânea sem retardo temporal se a frequência for superior a um limiar mínimo.',
            '**Quantização da Luz em Fótons** (Albert Einstein, 1905): A luz comporta-se como um feixe de partículas elementares indivisíveis denominadas fótons. Cada fóton transporta uma quantidade discreta ("quantum") de energia diretamente proporcional à sua frequência: $E = h \\cdot f$, onde $h$ é a constante de Planck.',
            '**Equação Fotoelétrica de Einstein**: $E_{\\text{fóton}} = W_0 + E_{c,\\text{máx}}$, onde $W_0$ (função trabalho) é a energia mínima necessária para arrancar o elétron da rede cristalina do material. Se a frequência do fóton for menor que a frequência de corte ($f < f_0$), NENHUM elétron é ejetado, independentemente da intensidade ou brilho da luz.',
            '**Painéis Solares Fotovoltaicos**: Células semicondutoras de silício dopado (junção p-n). Fótons de luz solar com energia superior ao *bandgap* do semicondutor excitam elétrons da banda de valência para a banda de condução, gerando pares elétron-lacuna e estabelecendo uma corrente elétrica contínua limpa e renovável.'
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
