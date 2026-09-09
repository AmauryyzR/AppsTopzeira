import { Discipline } from '../../../types/curriculum';

export const quimica: Discipline = {
  id: 'quimica',
  name: 'Química',
  description: 'Estrutura atômica, estequiometria, físico-química, eletroquímica, química orgânica e ambiental.',
  topics: [
    {
      id: 'eletroquimica-pilhas-eletrolise',
      title: 'Eletroquímica: Pilhas, Corrosão e Eletrólise',
      description: 'Transferência de elétrons em reações redox espontâneas e não espontâneas, proteção de metais e síntese industrial.',
      subtopics: [
        {
          id: 'pilhas-galvanicas-daniell',
          title: 'Pilhas Galvânicas, Potenciais Padrão e Cálculo de ddp',
          enemWeight: 'Muito Alta',
          summary: 'Conversão de energia química em energia elétrica via reação espontânea de oxirredução ($\\Delta G < 0, \\Delta E^\\circ > 0$).',
          keyConcepts: [
            'Pilha de Daniell ($Zn / Zn^{2+} // Cu^{2+} / Cu$): O zinco metálico possui menor potencial de redução ($E^\\circ_{\\text{red}} = -0,76\\text{ V}$), logo tem maior tendência a oxidar (perder elétrons) $\\rightarrow$ atua como ÂNODO (polo negativo, sofre corrosão e perda de massa). O cobre possui maior potencial de redução ($E^\\circ_{\\text{red}} = +0,34\\text{ V}$) $\\rightarrow$ íons $Cu^{2+}$ reduzem (ganham elétrons) no CÁTODO (polo positivo, ganho de massa da placa).',
            'Sentido dos Elétrons e Corrente: Os elétrons fluem SEMPRE pelo fio condutor externo do Ânodo para o Cátodo ($A \\rightarrow C$). A corrente elétrica convencional flui em sentido oposto ($C \\rightarrow A$).',
            'Ponte Salina: Mantém a neutralidade elétrica das semicelas, permitindo a migração de ânions para a solução do ânodo (compensando o excesso de cátions formados) e de cátions para a solução do cátodo (compensando os cátions que se depositaram).',
            'Diferença de Potencial Padrão ($\\Delta E^\\circ$ ou $ddp$): Para qualquer pilha espontânea, $\\Delta E^\\circ > 0$.'
          ],
          formulas: [
            {
              id: 'ddp-pilha',
              name: 'Força Eletromotriz Padrão (ddp)',
              latex: '\\Delta E^\\circ = E^\\circ_{\\text{red(maior)}} - E^\\circ_{\\text{red(menor)}} = E^\\circ_{\\text{cátodo}} - E^\\circ_{\\text{ânodo}}',
              description: 'Cálculo da voltagem nominal teórica gerada por uma célula galvânica em condições padrão (25 °C, 1 atm, 1 mol/L).',
              variables: [
                { symbol: '\\Delta E^\\circ', meaning: 'Diferença de potencial padrão', unit: 'V' },
                { symbol: 'E^\\circ_{\\text{cátodo}}', meaning: 'Potencial de redução da espécie que sofre redução', unit: 'V' },
                { symbol: 'E^\\circ_{\\text{ânodo}}', meaning: 'Potencial de redução da espécie que sofre oxidação', unit: 'V' }
              ]
            }
          ],
          tips: [
            'Mnemônico infalível para pilhas: **CRAO** (Cátodo Reduz, Ânodo Oxida). As vogais andam juntas (Ânodo = Oxidação = Polo Negativo) e as consoantes andam juntas (Cátodo = Redução = Polo Positivo).'
          ]
        },
        {
          id: 'corrosao-metal-sacrificio',
          title: 'Corrosão Metálica e Proteção Catódica (Metal de Sacrifício)',
          enemWeight: 'Muito Alta',
          summary: 'Mecanismos oxidativos de degradação de cascos de navios e tubulações de ferro e técnicas de proteção galvânica.',
          keyConcepts: [
            'Corrosão do Ferro (Ferrugem): Processo eletroquímico espontâneo que requer SIMULTANEAMENTE a presença de ferro ($Fe$), oxigênio ($O_2$) e água líquida ($H_2O$): $4Fe + 3O_2 + 2xH_2O \\rightarrow 2Fe_2O_3 \\cdot xH_2O$. A presença de íons dissolvidos (como água do mar com $Na^+$ e $Cl^-$) aumenta a condutividade iônica e acelera drasticamente a velocidade da corrosão.',
            'Proteção Catódica por Metal de Sacrifício: Para evitar que cascos de navios, oleodutos ou plataformas marítimas de ferro sofram corrosão, fixam-se blocos de um metal que possua MENOR potencial de redução (ou seja, MAIOR potencial de oxidação) que o ferro, como o Zinco ($Zn$) ou Magnésio ($Mg$). Esse metal oxida preferencialmente no lugar do ferro ("sacrifica-se"), transferindo elétrons e mantendo o ferro intacto na condição de cátodo protegido.',
            'Galvanização: Recobrimento de peças de ferro ou aço com uma fina camada aderente de zinco metálico, que além de fornecer barreira física protetora, atua como ânodo de sacrifício se houver ranhura no revestimento.'
          ],
          tips: [
            'Para escolher o metal de sacrifício correto em tabelas do ENEM: procure o elemento que tenha o valor de $E^\\circ_{\\text{red}}$ MAIS NEGATIVO (menor potencial de redução) do que o metal que se quer proteger. Exemplo: para proteger ferro ($E^\\circ_{\\text{red}} = -0,44\\text{ V}$), pode-se usar Zinco ($E^\\circ = -0,76\\text{ V}$) ou Magnésio ($E^\\circ = -2,37\\text{ V}$), mas JAMAIS Cobre ($E^\\circ = +0,34\\text{ V}$), pois o cobre aceleraria a ferrugem!'
          ]
        },
        {
          id: 'eletrolise-ignea-aquosa',
          title: 'Eletrólise Ígnea, Aquosa e Leis de Faraday',
          enemWeight: 'Alta',
          summary: 'Reações redox forçadas não-espontâneas provocadas por gerador elétrico externo, refino eletrolítico e galvanoplastia.',
          keyConcepts: [
            'Conceito Central da Eletrólise: Processo não-espontâneo ($\\Delta G > 0$) em que energia elétrica de uma fonte externa é convertida em energia química. Inversão de polos em relação à pilha: o Ânodo é o polo POSITIVO (ligado ao polo positivo do gerador, atrai ânions para oxidar) e o Cátodo é o polo NEGATIVO (atrai cátions para reduzir).',
            'Eletrólise Ígnea: Realizada com o sal fundido (líquido) na ausência total de água. Exemplo do $NaCl$ fundido: no cátodo ocorre redução dos cátions sódio ($Na^+ + e^- \\rightarrow Na^0$), e no ânodo ocorre oxidação dos ânions cloreto ($2Cl^- \\rightarrow Cl_2 + 2e^-$), gerando gás cloro e sódio metálico.',
            'Eletrólise Aquosa e Ordem de Descarga: Em solução aquosa, os íons do soluto competem com os íons provenientes da autoionização da água ($H^+$ e $OH^-$). Regras de facilidade de descarga: 1) Cátions: Cátions de metais nobres ($Cu^{2+}, Ag^+, Au^{3+}, Pb^{2+}, Fe^{2+}$) descarregam antes do $H^+$; metais alcalinos ($Li^+, Na^+, K^+$), alcalinoterrosos ($Mg^{2+}, Ca^{2+}, Ba^{2+}$) e alumínio ($Al^{3+}$) NÃO descarregam em água (o $H^+$ descarrega primeiro, gerando gás $H_2$); 2) Ânions: Ânions não-oxigenados ($Cl^-, Br^-, I^-, S^{2-}$) descarregam antes da hidroxila ($OH^-$); ânions oxigenados ($SO_4^{2-}, NO_3^-, CO_3^{2-}$) e o fluoreto ($F^-$) NÃO descarregam (o $OH^-$ descarrega primeiro, gerando gás $O_2$).',
            'Galvanoplastia: Deposição eletrolítica de uma fina camada de metal nobre (douração, prateação, cromagem) sobre uma peça condutora, que deve ser conectada obrigatoriamente no CÁTODO (polo negativo onde ocorre redução).'
          ],
          formulas: [
            {
              id: 'faraday-carga',
              name: 'Primeira Lei de Faraday da Eletrólise',
              latex: 'Q = I \\cdot t = n_e \\cdot F',
              description: 'A quantidade de carga elétrica transferida é proporcional à corrente elétrica aplicada e ao tempo de eletrólise.',
              variables: [
                { symbol: 'Q', meaning: 'Carga elétrica total', unit: 'C (Coulombs)' },
                { symbol: 'I', meaning: 'Intensidade da corrente elétrica contínua', unit: 'A (Amperes)' },
                { symbol: 't', meaning: 'Tempo de aplicação', unit: 's (segundos)' },
                { symbol: 'F', meaning: 'Constante de Faraday (\\approx 96.500 C/mol de e^-)', unit: 'C/mol' }
              ]
            }
          ],
          tips: [
            'Na eletrólise de salmoura aquosa ($NaCl + H_2O$): no ânodo descarrega o $Cl^-$ gerando gás cloro ($Cl_2$); no cátodo descarrega o $H^+$ gerando gás hidrogênio ($H_2$). Sobram na solução íons $Na^+$ e $OH^-$, restando uma solução fortemente básica de soda cáustica ($NaOH$), o que eleva o pH do meio!'
          ]
        }
      ]
    },
    {
      id: 'quimica-organica-reacoes',
      title: 'Química Orgânica e Biocombustíveis',
      description: 'Funções orgânicas, isomeria óptica e conformacional, reações de esterificação, saponificação e combustíveis sustentáveis.',
      subtopics: [
        {
          id: 'funcoes-organicas-oxigenadas-nitrogenadas',
          title: 'Identificação de Funções Orgânicas e Propriedades Físicas',
          enemWeight: 'Muito Alta',
          summary: 'Reconhecimento molecular de álcoois, fenóis, aldeídos, cetonas, ácidos carboxílicos, ésteres, aminas e amidas, e correlação com solubilidade e pontos de ebulição.',
          keyConcepts: [
            'Álcool vs. Fenol: Álcool possui hidroxila ($-OH$) ligada a carbono saturado $sp^3$ (ex.: etanol); Fenol possui hidroxila ligada diretamente a anel aromático benzênico, conferindo caráter levemente ácido.',
            'Compostos Carbonílicos: Aldeído possui carbonila terminal ($-CHO$, ligada a hidrogênio); Cetona possui carbonila interna ligada a dois carbonos ($-CO-$).',
            'Derivados de Ácido Carboxílico: Ácido Carboxílico possui carboxila ($-COOH$); Éster possui grupo carboxilato ligado a radical orgânico ($-COO-R$, aromatizantes e essências); Éter possui oxigênio entre dois carbonos ($-O-$).',
            'Funções Nitrogenadas: Aminas derivam da amônia ($R-NH_2$, possuem caráter básico devido ao par de elétrons livres no nitrogênio); Amidas possuem nitrogênio vizinho a uma carbonila ($R-CO-NH_2$, base das ligações peptídicas em proteínas).',
            'Forças Intermoleculares e Ponto de Ebulição: Compostos que formam ligações de hidrogênio (ácidos carboxílicos e álcoois) possuem pontos de ebulição muito superiores aos que fazem apenas dipolo permanente (aldeídos, cetonas, ésteres) ou dipolo induzido/London (hidrocarbonetos). Cadeias ramificadas possuem menor área de contato e menor ponto de ebulição que cadeias lineares isoméricas.'
          ],
          tips: [
            'Diferença crucial de acidez: Ácidos carboxílicos são os mais ácidos da química orgânica, seguidos pelos fenóis. Álcoois são praticamente neutros em água.'
          ]
        },
        {
          id: 'isomeria-plana-espacial-quiralidade',
          title: 'Isomeria Plana, Geométrica (Cis-Trans) e Óptica (Carbono Quiral)',
          enemWeight: 'Alta',
          summary: 'Mesma fórmula molecular com arranjos tridimensionais distintos e a importância biológica dos enantiômeros na farmacologia.',
          keyConcepts: [
            'Isomeria Plana: Cadeia (aberta vs. fechada, normal vs. ramificada); Posição (posição de dupla ligação ou ramificação); Função (pares clássicos: Álcool e Éter; Aldeído e Cetona; Ácido Carboxílico e Éster); Tautomeria (equilíbrio dinâmico aldo-enólico e ceto-enólico).',
            'Isomeria Geométrica (Cis-Trans / Z-E): Ocorre em compostos com dupla ligação entre carbonos (ou ciclos) onde cada carbono da dupla possui dois ligantes diferentes entre si ($R_1 \\neq R_2$ e $R_3 \\neq R_4$). No isômero CIS, os ligantes de maior massa molecular situam-se do mesmo lado do plano; no TRANS, em lados opostos. O isômero CIS costuma ser mais polar e ter maior ponto de ebulição.',
            'Isomeria Óptica e Carbono Assimétrico/Quiral ($C^*$): Ocorre em moléculas que possuem pelo menos um carbono tetraédrico ligado a quatro grupos químicos inteiramente distintos entre si. A molécula não possui plano de simetria e é quiral (não sobreponível à sua imagem especular).',
            'Enantiômeros e Desvio da Luz Polarizada: Enantiômeros desviam o plano da luz polarizada em ângulos idênticos, mas sentidos opostos: Dextrogiro ($+$, para a direita) e Levogiro ($-$, para a esquerda). A mistura equimolar de 50% dextrogiro e 50% levogiro é a Mistura Racêmica (opticamente inativa por compensação externa).'
          ],
          formulas: [
            {
              id: 'numero-isomeros-opticos',
              name: 'Regra de van \'t Hoff para Isômeros Ópticos',
              latex: 'N = 2^n',
              description: 'Número máximo de isômeros opticamente ativos (enantiômeros), onde n é o número de carbonos quirais assimétricos distintos na molécula.'
            }
          ],
          tips: [
            'Caso histórico clássico da Talidomida: O enantiômero dextrogiro possuía efeito sedativo e calmante contra enjoos em gestantes, mas o enantiômero levogiro era teratogênico, provocando má-formação congênita nos membros dos bebês. Isso ressalta por que a indústria farmacêutica precisa controlar a quiralidade de medicamentos!'
          ]
        },
        {
          id: 'reacoes-organicas-biocombustiveis',
          title: 'Reações Orgânicas: Esterificação, Saponificação e Biodiesel',
          enemWeight: 'Muito Alta',
          summary: 'A química da produção de ésteres de fragrância, sabões detergentes e transesterificação de óleos vegetais em biocombustíveis.',
          keyConcepts: [
            'Esterificação de Fischer: Reação em equilíbrio entre um Ácido Carboxílico e um Álcool em meio ácido catalisador ($H_2SO_4$), formando um Éster e Água: $\\text{Ácido} + \\text{Álcool} \\rightleftharpoons \\text{Éster} + H_2O$. Processo reversível (hidrólise ácida regenera os reagentes).',
            'Transesterificação (Produção Industrial de Biodiesel): Triglicerídeo (óleo de soja, dendê ou gordura animal residual) reage com um álcool de cadeia curta (metanol ou etanol) na presença de catalisador básico ($NaOH$ ou $KOH$), produzindo uma mistura de Ésteres Metílicos/Etílicos de ácidos graxos (Biodiesel) e Glicerol (Glicerina como subproduto de alto valor agregado).',
            'Saponificação (Hidrólise Alcalina de Triglicerídeos): Gordura/Óleo + Base forte aquecida ($NaOH$) $\\rightarrow$ Sal de ácido graxo (Sabão) + Glicerol. A molécula de sabão é ANFIPÁTICA (anfifílica): possui uma longa cauda apolar hidrofóbica lipofílica e uma cabeça polar hidrofílica carboxilato ($-COO^- Na^+$). Em água, as caudas apolares interagem com gotas de gordura e as cabeças polares interagem com a água, formando MICELAS esféricas que emulsionam e removem a sujeira.',
            'Oxidação de Álcoois: Álcool primário sofre oxidação branda formando Aldeído, que por oxidação enérgica converte-se em Ácido Carboxílico; Álcool secundário oxida exclusivamente a Cetona; Álcool terciário NÃO sofre oxidação em condições normais (não possui hidrogênio ligado ao carbono da hidroxila).'
          ],
          tips: [
            'O teste do bafômetro clássico utiliza a reação redox em que o etanol expirado pelo motorista oxida a ácido acético enquanto os íons dicromato alaranjados ($Cr_2O_7^{2-}$, cromo +6) reduzem a íons sulfato de cromo esverdeados ($Cr^{3+}$, cromo +3), mudando a cor do tubo.'
          ]
        }
      ]
    },
    {
      id: 'termoquimica-cinetica-equilibrio',
      title: 'Termoquímica, Cinética e Equilíbrio Químico',
      description: 'Trocas térmicas, velocidades de reação, catalisadores industriais, Princípio de Le Chatelier e cálculo de pH.',
      subtopics: [
        {
          id: 'termoquimica-calores-lei-hess',
          title: 'Termoquímica: Entalpia, Lei de Hess e Energia de Ligação',
          enemWeight: 'Muito Alta',
          summary: 'Balanço energético de processos exotérmicos e endotérmicos e cálculos do calor de combustão de combustíveis.',
          keyConcepts: [
            'Processos Endotérmicos vs. Exotérmicos: Endotérmicos absorvem calor da vizinhança ($\Delta H > 0, H_{\\text{produtos}} > H_{\\text{reagentes}}$, resfriam o meio externo, ex.: fusão do gelo, fotossíntese); Exotérmicos liberam calor para a vizinhança ($\Delta H < 0, H_{\\text{produtos}} < H_{\\text{reagentes}}$, aquecem o meio externo, ex.: queima de carvão, condensação do vapor).',
            'Lei de Hess: A variação de entalpia ($\\Delta H$) de uma reação depende unicamente dos estados inicial e final, sendo independente do caminho ou do número de etapas intermediárias. Pode-se somar algebricamente equações termoquímicas (invertendo o sinal de $\\Delta H$ ao inverter uma equação, e multiplicando $\\Delta H$ ao multiplicar os coeficientes).',
            'Cálculo por Energia de Ligação: Quebrar ligações de reagentes sempre ABSORVE energia (processo endotérmico, $+ \\Sigma E_{\\text{quebra}}$); Formar novas ligações nos produtos sempre LIBERA energia (processo exotérmico, $- \\Sigma E_{\\text{formação}}$).'
          ],
          formulas: [
            {
              id: 'delta-h-entalpia',
              name: 'Variação de Entalpia Padrão',
              latex: '\\Delta H^\\circ = \\sum \\Delta H_f^\\circ(\\text{produtos}) - \\sum \\Delta H_f^\\circ(\\text{reagentes})',
              description: 'A entalpia de formação de substâncias simples no estado padrão mais estável é zero por convenção (ex.: O2(g), C(grafite) = 0).'
            },
            {
              id: 'delta-h-ligacao',
              name: 'Entalpia por Energia de Ligação',
              latex: '\\Delta H = \\sum E_{\\text{ligações rompidas (reagentes)}} - \\sum E_{\\text{ligações formadas (produtos)}}',
              description: 'Lembrar que o rompimento é positivo e a formação é negativa.'
            }
          ],
          tips: [
            'O hidrogênio gasoso ($H_2$) possui o maior poder calorífico por grama de combustível entre todos, liberando apenas vapor d\'água como resíduo de combustão. Por outro lado, o carvão mineral emite muito mais $CO_2$ por Joule gerado do que o gás natural ($CH_4$).'
          ]
        },
        {
          id: 'cinetica-quimica-catalisadores',
          title: 'Cinética Química: Teoria das Colisões e Papel dos Catalisadores',
          enemWeight: 'Muito Alta',
          summary: 'Fatores que governam a velocidade das transformações materiais e o mecanismo de ação de catalisadores.',
          keyConcepts: [
            'Teoria das Colisões e Complexo Ativado: Para que ocorra reação química, é necessário que as moléculas colidam com orientação geométrica favorável e com energia cinética mínima suficiente para superar a barreira da Energia de Ativação ($E_a$), formando o estado intermediário instável e energético denominado complexo ativado.',
            'Fatores que Aceleram Reações: 1) Aumento da Concentração de reagentes (mais colisões por segundo); 2) Aumento da Temperatura (aumenta a energia cinética média das partículas e a fração de moléculas com energia $\\ge E_a$); 3) Aumento da Superfície de Contato em sólidos (comprimido efervescente triturado dissolve muito mais rápido que inteiro); 4) Presença de Catalisador.',
            'Ação dos Catalisadores (incluindo Enzimas biológicas): Substâncias que aceleram a velocidade da reação criando uma rota alternativa com MENOR Energia de Ativação ($E_a$). NÃO alteram o $\\Delta H$ da reação, NÃO deslocam o equilíbrio químico e NÃO aumentam o rendimento percentual final: apenas encurtam o tempo para atingir o equilíbrio, sendo regenerados intactos ao fim do processo.'
          ],
          tips: [
            'Pegadinha perigosa no ENEM: Catalisadores NUNCA aumentam a quantidade final de produtos produzidos nem alteram a entalpia ($\\Delta H$). Eles apenas fazem a mesma quantidade de produto ser obtida em menor tempo!'
          ]
        },
        {
          id: 'equilibrio-quimico-le-chatelier',
          title: 'Equilíbrio Químico e Princípio de Le Chatelier',
          enemWeight: 'Muito Alta',
          summary: 'A dinâmica das reações reversíveis e o deslocamento de equilíbrios por perturbações de concentração, pressão e temperatura.',
          keyConcepts: [
            'Estado de Equilíbrio Químico: Ocorre em sistemas fechados quando a velocidade da reação direta iguala-se à velocidade da reação inversa ($v_{\\text{direta}} = v_{\\text{inversa}}$). As concentrações molares de reagentes e produtos tornam-se constantes no tempo.',
            'Princípio de Le Chatelier: Se um sistema em equilíbrio for submetido a uma perturbação externa (tensão), ele se deslocará no sentido que minimize ou anule o efeito dessa perturbação: 1) Concentração: Adicionar substância desloca no sentido de consumi-la; retirar substância desloca no sentido de repô-la; 2) Pressão (apenas para gases): Aumentar a pressão total desloca o equilíbrio em direção ao lado de menor volume gasoso (menor número de mols de gás); diminuir a pressão desloca para o lado de maior volume gasoso; 3) Temperatura: Aumentar a temperatura favorece o sentido ENDOTÉRMICO (que absorve o calor injetado); diminuir a temperatura favorece o sentido EXOTÉRMICO.'
          ],
          formulas: [
            {
              id: 'constante-equilibrio-kc',
              name: 'Constante de Equilíbrio em Concentração (Kc)',
              latex: 'aA + bB \\rightleftharpoons cC + dD \\implies K_c = \\frac{[C]^c [D]^d}{[A]^a [B]^b}',
              description: 'Apenas espécies em solução aquosa e gases participam da expressão de Kc; sólidos e solventes líquidos puros não entram na fórmula.'
            }
          ],
          tips: [
            'A síntese industrial de Haber-Bosch para produção de amônia ($N_{2(g)} + 3H_{2(g)} \\rightleftharpoons 2NH_{3(g)}, \\Delta H < 0$) é favorecida termodinamicamente por ALTAS PRESSÕES (desloca para o lado de 2 mols de gás contra 4 mols de reagentes) e BAIXAS TEMPERATURAS (favorece o lado exotérmico).'
          ]
        },
        {
          id: 'equilibrio-ionico-ph-poh',
          title: 'Equilíbrio Iônico: Cálculo de pH, pOH e Soluções Tampão',
          enemWeight: 'Muito Alta',
          summary: 'Autoionização da água, escala logarítmica de acidez e a resistência à variação de pH no sangue humano.',
          keyConcepts: [
            'Autoionização da Água e Produto Iônico: A $25^\\circ\\text{C}$, $K_w = [H^+][OH^-] = 10^{-14}$. Em água pura neutra, $[H^+] = [OH^-] = 10^{-7}\\text{ mol/L}$, resultando em $pH = pOH = 7$.',
            'Escala de pH: $pH < 7$ indica meio ácido ($[H^+] > [OH^-]$); $pH > 7$ indica meio básico/alcalino ($[H^+] < [OH^-]$). Como a escala é logarítmica de base 10, a diferença de 1 unidade de pH (ex.: de pH 6 para pH 5) representa um aumento de 10 VEZES na concentração de íons $H^+$; uma diferença de 2 unidades representa um aumento de 100 vezes!',
            'Soluções Tampão: Misturas que resistem a variações bruscas de pH quando pequenas quantidades de ácidos ou bases fortes são adicionadas. Exemplo vital: o Sistema Tampão Bicarbonato no sangue humano ($CO_{2(aq)} + H_2O \\rightleftharpoons H_2CO_{3(aq)} \\rightleftharpoons H^+ + HCO_3^-$), que mantém o pH plasmático rigorosamente em torno de 7,35 a 7,45.'
          ],
          formulas: [
            {
              id: 'formula-ph',
              name: 'Definição Logarítmica de pH e pOH',
              latex: 'pH = -\\log_{10}[H^+], \\quad pOH = -\\log_{10}[OH^-], \\quad pH + pOH = 14',
              description: 'Válido rigorosamente a 25 graus Celsius.'
            }
          ],
          tips: [
            'Se um suco gástrico tem $[H^+] = 10^{-2}\\text{ mol/L}$, seu $pH = 2$. Ao ser diluído 10 vezes em água pura, a concentração cai para $10^{-3}\\text{ mol/L}$ e seu novo $pH = 3$.'
          ]
        }
      ]
    },
    {
      id: 'estequiometria-solucoes-radioatividade',
      title: 'Estequiometria, Soluções e Química Nuclear',
      description: 'Cálculos estequiométricos com pureza e rendimento, unidades de concentração, diluição e decaimento radioativo.',
      subtopics: [
        {
          id: 'calculos-estequiometricos-rendimento',
          title: 'Cálculos Estequiométricos: Mol, Pureza, Rendimento e Reagente Limitante',
          enemWeight: 'Muito Alta',
          summary: 'Relações ponderais e volumétricas entre reagentes e produtos em reações balanceadas.',
          keyConcepts: [
            'Constante de Avogadro e Volume Molar: $1\\text{ mol} = 6,02 \\times 10^{23}$ entidades. Nas CNTP (0 °C e 1 atm), $1\\text{ mol}$ de qualquer gás ideal ocupa o volume molar de $22,4\\text{ L}$.',
            'Reagente Limitante e em Excesso: O reagente limitante é aquele que é consumido primeiro e esgota-se por completo, determinando a quantidade máxima teórica de produto formado. Para identificá-lo, divide-se o número de mols de cada reagente pelo seu respectivo coeficiente estequiométrico; o menor quociente indica o reagente limitante.',
            'Grau de Pureza: Amostras industriais ou minérios contêm impurezas inertes. Apenas a fração pura do reagente reage estequiometricamente: $m_{\\text{pura}} = m_{\\text{amostra}} \\times (\\%\\text{pureza})$.',
            'Rendimento da Reação: Nem toda reação atinge 100% de conversão devido a perdas mecânicas ou equilíbrios: $\\text{Rendimento} = (\\text{massa real obtida} / \\text{massa teórica calculada}) \\times 100\\%$.'
          ],
          formulas: [
            {
              id: 'numero-mols',
              name: 'Relação Fundamental de Quantidade de Matéria',
              latex: 'n = \\frac{m}{M} = \\frac{N}{N_A} = \\frac{V}{V_{\\text{molar}}}',
              description: 'Onde m é massa em gramas, M é massa molar (g/mol), N é número de partículas e V é volume de gás.'
            }
          ],
          tips: [
            'Passo a passo no ENEM: 1) Escreva a equação química e confira se está perfeitamente balanceada; 2) Desconte a impureza dos reagentes antes de calcular; 3) Verifique se há reagente em excesso; 4) Aplique o rendimento sobre a quantidade final de produto obtido.'
          ]
        },
        {
          id: 'solucoes-concentracao-diluicao',
          title: 'Soluções: Molaridade, Título, Partes por Milhão (ppm) e Diluição',
          enemWeight: 'Muito Alta',
          summary: 'Cálculo de teores de poluentes, preparo de reagentes laboratoriais e formulações farmacêuticas.',
          keyConcepts: [
            'Concentração Comum ($C$) vs. Concentração Molar ($M$ ou $\\mathcal{M}$): Concentração comum expressa a massa de soluto por litro de solução ($g/L$); Concentração molar expressa a quantidade de matéria em mols de soluto por litro de solução ($mol/L$).',
            'Partes por Milhão (ppm): Unidade usada para soluções extremamente diluídas (análise de contaminantes na água potável ou poluentes no ar). $1\\text{ ppm} = 1\\text{ mg de soluto} / 1\\text{ L de solução aquosa} = 1\\text{ mg} / 1\\text{ kg}$.',
            'Diluição de Soluções: Adição de solvente puro à solução. A massa e os mols de soluto permanecem rigorosamente inalterados ($n_1 = n_2$); o volume aumenta e a concentração diminui proporcionalmente.',
            'Mistura de Soluções com Reação Química: Tratado por titulação estequiométrica (ponto de equivalência onde número de equivalentes de ácido iguala o de base).'
          ],
          formulas: [
            {
              id: 'diluicao-formula',
              name: 'Equação Fundamental da Diluição',
              latex: 'C_1 \\cdot V_1 = C_2 \\cdot V_2 \\quad \\text{ou} \\quad M_1 \\cdot V_1 = M_2 \\cdot V_2',
              description: 'O produto da concentração pelo volume inicial iguala o produto final após acréscimo de solvente.'
            },
            {
              id: 'relacao-concentracoes',
              name: 'Conversão entre Concentrações',
              latex: 'C = M \\cdot M_1 = 1000 \\cdot d \\cdot T',
              description: 'Onde d é densidade da solução (g/mL), T é título em massa e M1 é a massa molar do soluto.'
            }
          ],
          tips: [
            'Se um laudo ambiental indica que um lago possui concentração de chumbo de $0,05\\text{ ppm}$, significa que há $0,05\\text{ mg}$ de íons $Pb^{2+}$ dissolvidos para cada $1\\text{ L}$ de água daquele lago.'
          ]
        },
        {
          id: 'radioatividade-meia-vida-fissao',
          title: 'Radioatividade: Decaimento, Meia-Vida, Fissão e Fusão Nuclear',
          enemWeight: 'Alta',
          summary: 'Radiações ionizantes, cálculo de decaimento isotópico para datação arqueológica e matriz nuclear energética.',
          keyConcepts: [
            'Emissões Radioativas Naturais: Radiação Alfa ($\\alpha$, núcleo de hélio $^{4}_{2}\\alpha$ com 2 prótons e 2 nêutrons; baixa penetração, barrada por folha de papel); Radiação Beta ($\\beta$, elétron acelerado $^{0}_{-1}\\beta$ emitido pela desintegração de um nêutron $n \\rightarrow p^+ + \\beta^- + \\bar{\\nu}$; penetração intermediária); Radiação Gama ($\\gamma$, onda eletromagnética de altíssima energia $^{0}_{0}\\gamma$; altíssimo poder penetrante, exige paredes espessas de chumbo ou concreto).',
            'Primeira e Segunda Leis da Radioatividade (Soddy, Fajans e Russell): 1) Ao emitir uma partícula $\\alpha$, o átomo perde 4 unidades no número de massa ($A$) e 2 no número atômico ($Z$); 2) Ao emitir uma partícula $\\beta$, a massa $A$ não muda e o número atômico $Z$ aumenta em 1 unidade.',
            'Tempo de Meia-Vida ($t_{1/2}$ ou período de semidesintegração): Intervalo de tempo necessário para que metade dos átomos radioativos presentes em uma amostra se desintegre. Após $x$ meias-vidas, a massa remanescente é dada por $m = m_0 / 2^x$. Usado na datação por Carbono-14 ($t_{1/2} \\approx 5730\\text{ anos}$) para artefatos orgânicos fósseis.',
            'Fissão Nuclear vs. Fusão Nuclear: Fissão é a quebra de um núcleo pesado e instável (como $^{235}_{92}U$) bombardeado por um nêutron lento, gerando núcleos menores, 2 ou 3 nêutrons livres (reação em cadeia) e grande quantidade de calor (usinas termonucleares e bombas atômicas; produz lixo radioativo); Fusão é a união de núcleos leves (como isótopos de hidrogênio deutério e trítio) sob temperaturas e pressões extremas formando hélio (processo que abastece o Sol e estrelas; libera muito mais energia por grama e não produz resíduos radioativos de longa vida, mas requer contenção magnética de plasma ainda em desenvolvimento experimental).'
          ],
          tips: [
            'O acidente de 1987 em Goiânia envolveu o Césio-137 ($^{137}_{55}Cs$), um emissor beta e gama com meia-vida de 30 anos contido em um aparelho abandonado de radioterapia. Por ser cloreto de césio solúvel em água, contaminou solo, água e pessoas com radiação ionizante.'
          ]
        }
      ]
    }
  ]
};
