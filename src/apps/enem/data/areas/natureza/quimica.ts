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
            '**Pilha de Daniell** ($Zn / Zn^{2+} // Cu^{2+} / Cu$): O zinco metálico possui menor potencial de redução ($E^\\circ_{\\text{red}} = -0,76\\text{ V}$), logo tem maior tendência a oxidar (perder elétrons) $\\rightarrow$ atua como ÂNODO (polo negativo, sofre corrosão e perda de massa). O cobre possui maior potencial de redução ($E^\\circ_{\\text{red}} = +0,34\\text{ V}$) $\\rightarrow$ íons $Cu^{2+}$ reduzem (ganham elétrons) no CÁTODO (polo positivo, ganho de massa da placa).',
            '**Sentido dos Elétrons e Corrente**: Os elétrons fluem SEMPRE pelo fio condutor externo do Ânodo para o Cátodo ($A \\rightarrow C$). A corrente elétrica convencional flui em sentido oposto ($C \\rightarrow A$).',
            '**Ponte Salina**: Mantém a neutralidade elétrica das semicelas, permitindo a migração de ânions para a solução do ânodo (compensando o excesso de cátions formados) e de cátions para a solução do cátodo (compensando os cátions que se depositaram).',
            '**Diferença de Potencial Padrão** ($\\Delta E^\\circ$ ou $ddp$): Para qualquer pilha espontânea, $\\Delta E^\\circ > 0$.'
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
          enemWeight: 'Alta',
          summary: 'Mecanismos oxidativos de degradação de cascos de navios e tubulações de ferro e técnicas de proteção galvânica.',
          keyConcepts: [
            '**Corrosão do Ferro** (Ferrugem): Processo eletroquímico espontâneo que requer SIMULTANEAMENTE a presença de ferro ($Fe$), oxigênio ($O_2$) e água líquida ($H_2O$): $4Fe + 3O_2 + 2xH_2O \\rightarrow 2Fe_2O_3 \\cdot xH_2O$. A presença de íons dissolvidos (como água do mar com $Na^+$ e $Cl^-$) aumenta a condutividade iônica e acelera drasticamente a velocidade da corrosão.',
            '**Proteção Catódica por Metal de Sacrifício**: Para evitar que cascos de navios, oleodutos ou plataformas marítimas de ferro sofram corrosão, fixam-se blocos de um metal que possua MENOR potencial de redução (ou seja, MAIOR potencial de oxidação) que o ferro, como o Zinco ($Zn$) ou Magnésio ($Mg$). Esse metal oxida preferencialmente no lugar do ferro ("sacrifica-se"), transferindo elétrons e mantendo o ferro intacto na condição de cátodo protegido.',
            '**Galvanização**: Recobrimento de peças de ferro ou aço com uma fina camada aderente de zinco metálico, que além de fornecer barreira física protetora, atua como ânodo de sacrifício se houver ranhura no revestimento.'
          ],
          tips: [
            'Para escolher o metal de sacrifício correto em tabelas do ENEM: procure o elemento que tenha o valor de $E^\\circ_{\\text{red}}$ MAIS NEGATIVO (menor potencial de redução) do que o metal que se quer proteger. Exemplo: para proteger ferro ($E^\\circ_{\\text{red}} = -0,44\\text{ V}$), pode-se usar Zinco ($E^\\circ = -0,76\\text{ V}$) ou Magnésio ($E^\\circ = -2,37\\text{ V}$), mas JAMAIS Cobre ($E^\\circ = +0,34\\text{ V}$), pois o cobre aceleraria a ferrugem!'
          ]
        },
        {
          id: 'eletrolise-ignea-aquosa',
          title: 'Eletrólise Ígnea, Aquosa e Leis de Faraday',
          enemWeight: 'Média',
          summary: 'Reações redox forçadas não-espontâneas provocadas por gerador elétrico externo, refino eletrolítico e galvanoplastia.',
          keyConcepts: [
            '**Conceito Central da Eletrólise**: Processo não-espontâneo ($\\Delta G > 0$) em que energia elétrica de uma fonte externa é convertida em energia química. Inversão de polos em relação à pilha: o Ânodo é o polo POSITIVO (ligado ao polo positivo do gerador, atrai ânions para oxidar) e o Cátodo é o polo NEGATIVO (atrai cátions para reduzir).',
            '**Eletrólise Ígnea**: Realizada com o sal fundido (líquido) na ausência total de água. Exemplo do $NaCl$ fundido: no cátodo ocorre redução dos cátions sódio ($Na^+ + e^- \\rightarrow Na^0$), e no ânodo ocorre oxidação dos ânions cloreto ($2Cl^- \\rightarrow Cl_2 + 2e^-$), gerando gás cloro e sódio metálico.',
            '**Eletrólise Aquosa e Ordem de Descarga**: Em solução aquosa, os íons do soluto competem com os íons provenientes da autoionização da água ($H^+$ e $OH^-$). Regras de facilidade de descarga: 1) Cátions: Cátions de metais nobres ($Cu^{2+}, Ag^+, Au^{3+}, Pb^{2+}, Fe^{2+}$) descarregam antes do $H^+$; metais alcalinos ($Li^+, Na^+, K^+$), alcalinoterrosos ($Mg^{2+}, Ca^{2+}, Ba^{2+}$) e alumínio ($Al^{3+}$) NÃO descarregam em água (o $H^+$ descarrega primeiro, gerando gás $H_2$); 2) Ânions: Ânions não-oxigenados ($Cl^-, Br^-, I^-, S^{2-}$) descarregam antes da hidroxila ($OH^-$); ânions oxigenados ($SO_4^{2-}, NO_3^-, CO_3^{2-}$) e o fluoreto ($F^-$) NÃO descarregam (o $OH^-$ descarrega primeiro, gerando gás $O_2$).',
            '**Galvanoplastia**: Deposição eletrolítica de uma fina camada de metal nobre (douração, prateação, cromagem) sobre uma peça condutora, que deve ser conectada obrigatoriamente no CÁTODO (polo negativo onde ocorre redução).'
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
            '**Álcool vs. Fenol**: Álcool possui hidroxila ($-OH$) ligada a carbono saturado $sp^3$ (ex.: etanol); Fenol possui hidroxila ligada diretamente a anel aromático benzênico, conferindo caráter levemente ácido.',
            '**Compostos Carbonílicos**: Aldeído possui carbonila terminal ($-CHO$, ligada a hidrogênio); Cetona possui carbonila interna ligada a dois carbonos ($-CO-$).',
            '**Derivados de Ácido Carboxílico**: Ácido Carboxílico possui carboxila ($-COOH$); Éster possui grupo carboxilato ligado a radical orgânico ($-COO-R$, aromatizantes e essências); Éter possui oxigênio entre dois carbonos ($-O-$).',
            '**Funções Nitrogenadas**: Aminas derivam da amônia ($R-NH_2$, possuem caráter básico devido ao par de elétrons livres no nitrogênio); Amidas possuem nitrogênio vizinho a uma carbonila ($R-CO-NH_2$, base das ligações peptídicas em proteínas).',
            '**Forças Intermoleculares e Ponto de Ebulição**: Compostos que formam ligações de hidrogênio (ácidos carboxílicos e álcoois) possuem pontos de ebulição muito superiores aos que fazem apenas dipolo permanente (aldeídos, cetonas, ésteres) ou dipolo induzido/London (hidrocarbonetos). Cadeias ramificadas possuem menor área de contato e menor ponto de ebulição que cadeias lineares isoméricas.'
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
            '**Isomeria Plana**: Cadeia (aberta vs. fechada, normal vs. ramificada); Posição (posição de dupla ligação ou ramificação); Função (pares clássicos: Álcool e Éter; Aldeído e Cetona; Ácido Carboxílico e Éster); Tautomeria (equilíbrio dinâmico aldo-enólico e ceto-enólico).',
            '**Isomeria Geométrica** (Cis-Trans / Z-E): Ocorre em compostos com dupla ligação entre carbonos (ou ciclos) onde cada carbono da dupla possui dois ligantes diferentes entre si ($R_1 \\neq R_2$ e $R_3 \\neq R_4$). No isômero CIS, os ligantes de maior massa molecular situam-se do mesmo lado do plano; no TRANS, em lados opostos. O isômero CIS costuma ser mais polar e ter maior ponto de ebulição.',
            '**Isomeria Óptica e Carbono Assimétrico/Quiral** ($C^*$): Ocorre em moléculas que possuem pelo menos um carbono tetraédrico ligado a quatro grupos químicos inteiramente distintos entre si. A molécula não possui plano de simetria e é quiral (não sobreponível à sua imagem especular).',
            '**Enantiômeros e Desvio da Luz Polarizada**: Enantiômeros desviam o plano da luz polarizada em ângulos idênticos, mas sentidos opostos: Dextrogiro ($+$, para a direita) e Levogiro ($-$, para a esquerda). A mistura equimolar de 50% dextrogiro e 50% levogiro é a Mistura Racêmica (opticamente inativa por compensação externa).'
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
          id: 'reacoes-organicas-adicao-substituicao-eliminacao',
          title: 'Reações Orgânicas de Adição, Substituição Aromática e Eliminação',
          enemWeight: 'Muito Alta',
          summary: 'A quebra de ligações pi em alcenos (Markovnikov e Kharasch), a substituição eletrofílica no anel benzênico (nitração, sulfonação, Friedel-Crafts) e a desidratação de álcoois (Saytzeff).',
          keyConcepts: [
            '**Reações de Adição em Alcenos e Alcinos**: Ruptura da ligação pi ($\\pi$) com incorporação de novos átomos: 1) **Hidrogenação Catalítica**: adição de hidrogênio ($H_2$) com catalisadores aquecidos ($Ni, Pt, Pd$), convertendo ligações duplas em simples (base industrial da obtenção de **margarina** a partir da hidrogenação parcial de óleos vegetais poli-insaturados); 2) **Halogenação**: adição de halogênios ($Cl_2, Br_2$); a solução castanha de bromo em $CCl_4$ descolore instantaneamente na presença de compostos insaturados (teste analítico clássico de insaturação); 3) **Hidratação Catalítica**: adição de água ($H-OH$) em meio ácido ($H_2SO_4$) formando álcoois.',
            '**Regra de Markovnikov e o Efeito Kharasch (Anti-Markovnikov)**: Na adição de reagentes assimétricos ($H-X$ ou $H-OH$) a alcenos assimétricos, **o hidrogênio liga-se preferencialmente ao carbono da dupla que já possui o MAIOR número de hidrogênios** ("o rico fica mais rico"), originando o carbocátion intermediário mais estável (terciário $>$ secundário $>$ primário). Exceção: na presença de **peróxidos orgânicos** ($R-O-O-R$) exclusivamente com $HBr$, a reação segue mecanismo via radical livre (**Efeito Kharasch / Anti-Markovnikov**), ligando o bromo ao carbono mais hidrogenado.',
            '**Reações de Substituição em Alcanos**: Alcanos são saturados e pouco reativos (parafinas), sofrendo substituição de hidrogênios por halogênios sob luz ultravioleta ($h\\nu$) ou calor intenso. A reatividade do hidrogênio decresce na ordem: **carbono terciário $>$ carbono secundário $>$ carbono primário** (na cloração do propano, o 2-cloropropano é o produto majoritário).',
            '**Substituição Eletrofílica Aromática no Benzeno**: O anel aromático possui ressonância hiperestável de 6 elétrons $\\pi$, resistindo à adição e sofrendo substituição eletrofílica: 1) **Nitração**: reação com $HNO_3$ catalisada por $H_2SO_4$ formando **nitrobenzeno** (síntese de corantes e explosivos como o TNT); 2) **Sulfonação**: reação com $H_2SO_4$ fumegante gerando **ácido benzenossulfônico**, insumo crucial de **detergentes biodegradáveis tipo LAS**; 3) **Alquilação e Acilação de Friedel-Crafts**: introdução de radicais alquila ou acila no anel benzênico catalisada por $AlCl_3$.',
            '**Efeito Dirigente dos Substituintes no Anel**: 1) **Orto e Para-Dirigentes (Ativantes)**: possuem elétrons não compartilhados ou efeito indutivo positivo que doam densidade eletrônica ao anel, orientando novos grupos para as posições 1,2 (orto) e 1,4 (para) — ex: grupos $-OH, -NH_2, -OCH_3$ e alquilas; 2) **Meta-Dirigentes (Desativantes)**: atraem elétrons para fora do anel, desativando as posições orto/para e orientando a substituição na posição 1,3 (meta) — ex: $-NO_2, -COOH, -SO_3H, -CHO$.',
            '**Reações de Eliminação e Regra de Saytzeff**: Processo inverso à adição: 1) **Desidratação Intramolecular de Álcoois**: a ~170 °C com $H_2SO_4$ concentrado, uma molécula de álcool elimina água gerando um alceno; obedece à **Regra de Saytzeff**: o hidrogênio é eliminado preferencialmente do carbono vizinho **menos hidrogenado**, formando o alceno mais estável e substituído; 2) **Desidratação Intermolecular**: a ~140 °C, duas moléculas de álcool condensam com eliminação de uma água formando um **Éter** (ex: síntese do éter dietílico a partir do etanol).'
          ],
          tips: [
            'Pegadinha clássica do ENEM: O benzeno NÃO sofre reações de adição com facilidade porque isso destruiria sua nuvem aromática hiperestável por ressonância (energia de deslocalização aromática de 36 kcal/mol). Por isso, compostos aromáticos realizam predominantemente reações de SUBSTITUIÇÃO Eletrofílica, preservando intacto o anel!'
          ]
        },
        {
          id: 'reacoes-organicas-biocombustiveis',
          title: 'Reações Orgânicas: Esterificação, Saponificação, Oxidações e Biocombustíveis',
          enemWeight: 'Muito Alta',
          summary: 'A química da produção de ésteres de fragrância, sabões micelares, transesterificação do biodiesel, combustões completas/incompletas e oxidações de álcoois.',
          keyConcepts: [
            '**Esterificação de Fischer**: Reação em equilíbrio entre um Ácido Carboxílico e um Álcool em meio ácido catalisador ($H_2SO_4$), formando um Éster e Água: $\\text{Ácido} + \\text{Álcool} \\rightleftharpoons \\text{Éster} + H_2O$. Processo reversível (hidrólise ácida regenera os reagentes). Ésteres de cadeia curta possuem aroma característico de frutas e flores (flavorizantes alimentares).',
            '**Transesterificação (Produção Industrial de Biodiesel)**: Triglicerídeo (óleo vegetal virgem de soja/dendê ou óleo residual de fritura) reage com um álcool de cadeia curta (metanol ou etanol) na presença de catalisador básico ($NaOH$ ou $KOH$), produzindo uma mistura de Ésteres Metílicos/Etílicos de ácidos graxos (**Biodiesel**) e **Glicerol** (Glicerina como subproduto de alto valor agregado na indústria cosmética e farmacêutica).',
            '**Saponificação (Hidrólise Alcalina de Triglicerídeos)**: Gordura/Óleo + Base forte aquecida ($NaOH$) $\\rightarrow$ Sal de ácido graxo (**Sabão**) + Glicerol. A molécula de sabão é **ANFIPÁTICA (anfifílica)**: possui uma longa cauda apolar hidrofóbica lipofílica e uma cabeça polar hidrofílica carboxilato ($-COO^- Na^+$). Em meio aquoso, as caudas apolares interagem com gotas de gordura e as cabeças polares interagem com a água, formando **MICELAS** esféricas que emulsionam e removem a sujeira.',
            '**Combustão Completa versus Incompleta de Hidrocarbonetos**: 1) **Combustão Completa**: ocorre com excesso estequiométrico de oxigênio ($O_2$), gerando dióxido de carbono ($CO_2$) e água ($H_2O$), liberando a entalpia máxima de combustão com chama azulada; 2) **Combustão Incompleta**: ocorre quando o suprimento de $O_2$ é insuficiente em motores desregulados ou aquecedores defeituosos, gerando **monóxido de carbono** ($CO$, gás asfixiante insípido e inodoro que se liga irreversivelmente à hemoglobina) e/ou **fuligem** (cinzas de carbono amorfo $C_{(s)}$).',
            '**Oxidação de Álcoois**: Álcool primário sofre oxidação branda formando Aldeído, que por oxidação enérgica converte-se em Ácido Carboxílico; Álcool secundário oxida exclusivamente a Cetona; Álcool terciário NÃO sofre oxidação em condições normais (não possui hidrogênio ligado ao carbono da hidroxila).',
            '**Oxidação Branda (Reativo de Baeyer) e Ozonólise**: 1) A oxidação branda de alcenos com permanganato ($KMnO_4$) diluído em meio neutro/básico quebra apenas a ligação $\\pi$, formando **dióis vicinais (glicóis)** e descorando a cor violeta para precipitado castanho de $MnO_2$; 2) A **Ozonólise** com ozônio ($O_3$) e redução por $Zn/H_2O$ rompe totalmente a dupla ligação: carbonos insaturados secundários originam aldeídos, e terciários originam cetonas.'
          ],
          tips: [
            'O teste do bafômetro clássico utiliza a reação redox em que o etanol expirado pelo motorista oxida a ácido acético enquanto os íons dicromato alaranjados ($Cr_2O_7^{2-}$, cromo +6) reduzem a íons sulfato de cromo esverdeados ($Cr^{3+}$, cromo +3), mudando a cor do tubo.'
          ]
        },
        {
          id: 'bioquimica-polimeros-microplasticos',
          title: 'Bioquímica, Polímeros Sintéticos, Bioplásticos e Microplásticos',
          enemWeight: 'Muito Alta',
          summary: 'A estrutura química de biomoléculas (carboidratos, lipídios e proteínas), as reações de polimerização por adição e condensação, e o impacto ambiental dos microplásticos.',
          keyConcepts: [
            '**Biomoléculas e Ligações Peptídicas**: 1) **Carboidratos**: poli-hidroxialdeídos ou poli-hidroxicetonas; monossacarídeos como glicose e frutose ($C_6H_{12}O_6$) polimerizam-se por ligações glicosídicas formando polissacarídeos de reserva energética (**Amido** em vegetais e **Glicogênio** em animais) e estruturais (**Celulose** com ligações $\\beta-1,4$ insolúveis não digeridas por humanos); 2) **Proteínas**: polímeros lineares de L-aminoácidos unidos por **Ligações Peptídicas** (ligação amídica $-CO-NH-$ formada pela reação de condensação entre o grupo carboxila de um aminoácido e o grupo amina do seguinte, com liberação de uma molécula de água); 3) **Desnaturação Proteica**: rompimento das interações secundárias, terciárias e quaternárias (pontes de hidrogênio e dissulfeto) por calor excessivo ou variação extrema de pH, inativando a função biológica da proteína sem romper a sequência primária de aminoácidos.',
            '**Polímeros Sintéticos de Adição**: Formados pela quebra sucessiva da ligação dupla ($\pi$) de monômeros vinílicos sem eliminação de subprodutos: 1) **Polietileno (PE)**: monômero etileno/eteno ($CH_2=CH_2$), originando PEBD (baixa densidade, flexível, sacolas plásticas) e PEAD (alta densidade, rígido, frascos de xampu); 2) **Polipropileno (PP)**: monômero propeno (tampas de garrafa, seringas); 3) **Policloreto de Vinila (PVC)**: canos de esgoto e tubulações prediais; 4) **Politetrafluoretileno (PTFE / Teflon)**: monômero tetrafluoroeteno ($CF_2=CF_2$, resistente a calor e ácidos, antiaderente de panelas).',
            '**Polímeros de Condensação / Eliminação**: Formados pela reação entre monômeros bifuncionais distintos com eliminação concomitante de uma molécula pequena (geralmente água $H_2O$): 1) **Poliésteres (PET - Politereftalato de Etileno)**: reação entre ácido tereftálico e etilenoglicol gerando ligações éster; usado em garrafas de refrigerante e fibras têxteis; 2) **Poliamidas (Nylon 6,6)**: reação entre diamina e diácido carboxílico gerando ligações amida idênticas às peptídicas; 3) **Baquelite**: polímero termorrígido reticulado de fenol e formaldeído.',
            '**Termoplásticos versus Termofixos (Termorrígidos)**: Termoplásticos possuem cadeias lineares ou ramificadas mantidas por forças intermoleculares, amolecendo ao calor e podendo ser fundidos e moldados repetidas vezes (100% recicláveis mecanicamente: PET, PE, PP, PVC, PS); Termofixos possuem ligações cruzadas covalentes tridimensionais rígidas que não se fundem com o aquecimento, sofrendo degradação térmica irreversível e impossibilitando a reciclagem mecânica convencional (baquelite, epóxi, borracha vulcanizada de pneus).',
            '**Bioplásticos e a Crise dos Microplásticos**: Plásticos convencionais derivados do petróleo levam centenas de anos para degradar. Os **Bioplásticos Biodegradáveis** (como o PLA - Ácido Polilático, obtido da fermentação bacteriana do amido de milho ou cana) são degradados por micro-organismos em semanas sob compostagem industrial gerando $H_2O$ e $CO_2$. A fragmentação física e fotoquímica de plásticos descartados gera **Microplásticos** ($< 5\\text{ mm}$) e nanoplásticos, que adsorvem poluentes orgânicos persistentes (POPs) e pesticidas na água, são ingeridos por animais filtrantes e zooplâncton, sofrendo biomagnificação trófica até a alimentação humana.',
            '**Reciclagem Mecânica versus Química**: A reciclagem mecânica consiste em triagem, lavagem, moagem e reextrusão térmica dos termoplásticos; a reciclagem química despolimeriza o polímero de volta aos seus monômeros originais por hidrólise, pirólise ou gaseificação, permitindo o reaproveitamento com qualidade idêntica à da matéria-prima virgem.'
          ],
          tips: [
            'Diferença crucial no ENEM: Um plástico ser "de origem vegetal" (como o polietileno verde feito de etanol de cana-de-açúcar) NÃO significa que ele seja biodegradável! O PE verde tem estrutura química idêntica ao PE fóssil do petróleo e persiste no meio ambiente pelos mesmos séculos se descartado incorretamente. Já o PLA é verdadeiramente biodegradável.'
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
            '**Processos Endotérmicos vs. Exotérmicos**: Endotérmicos absorvem calor da vizinhança ($\Delta H > 0, H_{\\text{produtos}} > H_{\\text{reagentes}}$, resfriam o meio externo, ex.: fusão do gelo, fotossíntese); Exotérmicos liberam calor para a vizinhança ($\Delta H < 0, H_{\\text{produtos}} < H_{\\text{reagentes}}$, aquecem o meio externo, ex.: queima de carvão, condensação do vapor).',
            '**Lei de Hess**: A variação de entalpia ($\\Delta H$) de uma reação depende unicamente dos estados inicial e final, sendo independente do caminho ou do número de etapas intermediárias. Pode-se somar algebricamente equações termoquímicas (invertendo o sinal de $\\Delta H$ ao inverter uma equação, e multiplicando $\\Delta H$ ao multiplicar os coeficientes).',
            '**Cálculo por Energia de Ligação**: Quebrar ligações de reagentes sempre ABSORVE energia (processo endotérmico, $+ \\Sigma E_{\\text{quebra}}$); Formar novas ligações nos produtos sempre LIBERA energia (processo exotérmico, $- \\Sigma E_{\\text{formação}}$).'
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
          enemWeight: 'Alta',
          summary: 'Fatores que governam a velocidade das transformações materiais e o mecanismo de ação de catalisadores.',
          keyConcepts: [
            '**Teoria das Colisões e Complexo Ativado**: Para que ocorra reação química, é necessário que as moléculas colidam com orientação geométrica favorável e com energia cinética mínima suficiente para superar a barreira da Energia de Ativação ($E_a$), formando o estado intermediário instável e energético denominado complexo ativado.',
            '**Fatores que Aceleram Reações**: 1) Aumento da Concentração de reagentes (mais colisões por segundo); 2) Aumento da Temperatura (aumenta a energia cinética média das partículas e a fração de moléculas com energia $\\ge E_a$); 3) Aumento da Superfície de Contato em sólidos (comprimido efervescente triturado dissolve muito mais rápido que inteiro); 4) Presença de Catalisador.',
            '**Ação dos Catalisadores** (incluindo Enzimas biológicas): Substâncias que aceleram a velocidade da reação criando uma rota alternativa com MENOR Energia de Ativação ($E_a$). NÃO alteram o $\\Delta H$ da reação, NÃO deslocam o equilíbrio químico e NÃO aumentam o rendimento percentual final: apenas encurtam o tempo para atingir o equilíbrio, sendo regenerados intactos ao fim do processo.'
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
            '**Estado de Equilíbrio Químico**: Ocorre em sistemas fechados quando a velocidade da reação direta iguala-se à velocidade da reação inversa ($v_{\\text{direta}} = v_{\\text{inversa}}$). As concentrações molares de reagentes e produtos tornam-se constantes no tempo.',
            '**Princípio de Le Chatelier**: Se um sistema em equilíbrio for submetido a uma perturbação externa (tensão), ele se deslocará no sentido que minimize ou anule o efeito dessa perturbação: 1) Concentração: Adicionar substância desloca no sentido de consumi-la; retirar substância desloca no sentido de repô-la; 2) Pressão (apenas para gases): Aumentar a pressão total desloca o equilíbrio em direção ao lado de menor volume gasoso (menor número de mols de gás); diminuir a pressão desloca para o lado de maior volume gasoso; 3) Temperatura: Aumentar a temperatura favorece o sentido ENDOTÉRMICO (que absorve o calor injetado); diminuir a temperatura favorece o sentido EXOTÉRMICO.'
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
          enemWeight: 'Alta',
          summary: 'Autoionização da água, escala logarítmica de acidez e a resistência à variação de pH no sangue humano.',
          keyConcepts: [
            '**Autoionização da Água e Produto Iônico**: A $25^\\circ\\text{C}$, $K_w = [H^+][OH^-] = 10^{-14}$. Em água pura neutra, $[H^+] = [OH^-] = 10^{-7}\\text{ mol/L}$, resultando em $pH = pOH = 7$.',
            '**Escala de pH**: $pH < 7$ indica meio ácido ($[H^+] > [OH^-]$); $pH > 7$ indica meio básico/alcalino ($[H^+] < [OH^-]$). Como a escala é logarítmica de base 10, a diferença de 1 unidade de pH (ex.: de pH 6 para pH 5) representa um aumento de 10 VEZES na concentração de íons $H^+$; uma diferença de 2 unidades representa um aumento de 100 vezes!',
            '**Soluções Tampão**: Misturas que resistem a variações bruscas de pH quando pequenas quantidades de ácidos ou bases fortes são adicionadas. Exemplo vital: o Sistema Tampão Bicarbonato no sangue humano ($CO_{2(aq)} + H_2O \\rightleftharpoons H_2CO_{3(aq)} \\rightleftharpoons H^+ + HCO_3^-$), que mantém o pH plasmático rigorosamente em torno de 7,35 a 7,45.'
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
            '**Constante de Avogadro e Volume Molar**: $1\\text{ mol} = 6,02 \\times 10^{23}$ entidades. Nas CNTP (0 °C e 1 atm), $1\\text{ mol}$ de qualquer gás ideal ocupa o volume molar de $22,4\\text{ L}$.',
            '**Reagente Limitante e em Excesso**: O reagente limitante é aquele que é consumido primeiro e esgota-se por completo, determinando a quantidade máxima teórica de produto formado. Para identificá-lo, divide-se o número de mols de cada reagente pelo seu respectivo coeficiente estequiométrico; o menor quociente indica o reagente limitante.',
            '**Grau de Pureza**: Amostras industriais ou minérios contêm impurezas inertes. Apenas a fração pura do reagente reage estequiometricamente: $m_{\\text{pura}} = m_{\\text{amostra}} \\times (\\%\\text{pureza})$.',
            '**Rendimento da Reação**: Nem toda reação atinge 100% de conversão devido a perdas mecânicas ou equilíbrios: $\\text{Rendimento} = (\\text{massa real obtida} / \\text{massa teórica calculada}) \\times 100\\%$.'
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
            '**Concentração Comum ($C$) vs. Concentração Molar ($M$ ou $\\mathcal{M}$)**: Concentração comum expressa a massa de soluto por litro de solução ($g/L$); Concentração molar expressa a quantidade de matéria em mols de soluto por litro de solução ($mol/L$).',
            '**Partes por Milhão** (ppm): Unidade usada para soluções extremamente diluídas (análise de contaminantes na água potável ou poluentes no ar). $1\\text{ ppm} = 1\\text{ mg de soluto} / 1\\text{ L de solução aquosa} = 1\\text{ mg} / 1\\text{ kg}$.',
            '**Diluição de Soluções**: Adição de solvente puro à solução. A massa e os mols de soluto permanecem rigorosamente inalterados ($n_1 = n_2$); o volume aumenta e a concentração diminui proporcionalmente.',
            '**Mistura de Soluções com Reação Química**: Tratado por titulação estequiométrica (ponto de equivalência onde número de equivalentes de ácido iguala o de base).'
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
          enemWeight: 'Média',
          summary: 'Radiações ionizantes, cálculo de decaimento isotópico para datação arqueológica e matriz nuclear energética.',
          keyConcepts: [
            '**Emissões Radioativas Naturais**: Radiação Alfa ($\\alpha$, núcleo de hélio $^{4}_{2}\\alpha$ com 2 prótons e 2 nêutrons; baixa penetração, barrada por folha de papel); Radiação Beta ($\\beta$, elétron acelerado $^{0}_{-1}\\beta$ emitido pela desintegração de um nêutron $n \\rightarrow p^+ + \\beta^- + \\bar{\\nu}$; penetração intermediária); Radiação Gama ($\\gamma$, onda eletromagnética de altíssima energia $^{0}_{0}\\gamma$; altíssimo poder penetrante, exige paredes espessas de chumbo ou concreto).',
            '**Primeira e Segunda Leis da Radioatividade** (Soddy, Fajans e Russell): 1) Ao emitir uma partícula $\\alpha$, o átomo perde 4 unidades no número de massa ($A$) e 2 no número atômico ($Z$); 2) Ao emitir uma partícula $\\beta$, a massa $A$ não muda e o número atômico $Z$ aumenta em 1 unidade.',
            '**Tempo de Meia-Vida** ($t_{1/2}$ ou período de semidesintegração): Intervalo de tempo necessário para que metade dos átomos radioativos presentes em uma amostra se desintegre. Após $x$ meias-vidas, a massa remanescente é dada por $m = m_0 / 2^x$. Usado na datação por Carbono-14 ($t_{1/2} \\approx 5730\\text{ anos}$) para artefatos orgânicos fósseis.',
            '**Fissão Nuclear vs. Fusão Nuclear**: Fissão é a quebra de um núcleo pesado e instável (como $^{235}_{92}U$) bombardeado por um nêutron lento, gerando núcleos menores, 2 ou 3 nêutrons livres (reação em cadeia) e grande quantidade de calor (usinas termonucleares e bombas atômicas; produz lixo radioativo); Fusão é a união de núcleos leves (como isótopos de hidrogênio deutério e trítio) sob temperaturas e pressões extremas formando hélio (processo que abastece o Sol e estrelas; libera muito mais energia por grama e não produz resíduos radioativos de longa vida, mas requer contenção magnética de plasma ainda em desenvolvimento experimental).'
          ],
          tips: [
            'O acidente de 1987 em Goiânia envolveu o Césio-137 ($^{137}_{55}Cs$), um emissor beta e gama com meia-vida de 30 anos contido em um aparelho abandonado de radioterapia. Por ser cloreto de césio solúvel em água, contaminou solo, água e pessoas com radiação ionizante.'
          ]
        },
        {
          id: 'propriedades-coligativas',
          title: 'Propriedades Coligativas: Tonoscopia, Ebulioscopia, Crioscopia e Osmometria',
          enemWeight: 'Alta',
          summary: 'As alterações nas propriedades físicas de um solvente provocadas pela adição de um soluto não-volátil, dependentes unicamente da quantidade de partículas dissolvidas.',
          keyConcepts: [
            '**Natureza das Propriedades Coligativas**: São propriedades das soluções que dependem EXCLUSIVAMENTE do número total de partículas de soluto dispersas por unidade de volume, sendo completamente independentes da natureza química ou da massa individual dessas partículas.',
            '**Tonoscopia (Abaixamento da Pressão de Vapor)**: A adição de um soluto não-volátil dificulta o escape das moléculas de solvente para a fase gasosa na superfície do líquido, diminuindo a pressão máxima de vapor da solução em relação ao solvente puro ($p_{\\text{solução}} < p_{\\text{solvente}}$) a uma dada temperatura.',
            '**Ebulioscopia (Elevação da Temperatura de Ebulição)**: Como a pressão de vapor foi rebaixada, é necessário fornecer mais calor para que a pressão de vapor da solução iguale-se à pressão atmosférica externa. Logo, a solução ferve a uma temperatura SUPERIOR à do solvente puro (adicionar sal à água pura faz com que ela ferva a mais de 100 °C a 1 atm).',
            '**Crioscopia (Abaixamento da Temperatura de Congelamento)**: A presença das partículas de soluto desorganiza e dificulta o empacotamento das moléculas de solvente na rede cristalina sólida. Portanto, a solução congela a uma temperatura INFERIOR à do solvente puro. Aplicações no ENEM: 1) Mistura de sal grosso e álcool no gelo para resfriar bebidas rapidamente em caixas térmicas (o gelo derrete a temperaturas bem abaixo de 0 °C, resfriando as latas por contato líquido direto); 2) Espalhamento de sais ($NaCl$ ou $CaCl_2$) sobre rodovias cobertas de neve em países frios para derreter o gelo.',
            '**Osmometria e Pressão Osmótica**: Passagem espontânea do solvente puro através de uma membrana semipermeável em direção à solução mais concentrada (hipertônica) até atingir o equilíbrio de potenciais químicos. A **Pressão Osmótica** ($\\pi$) é a contrapressão mecânica mínima necessária para impedir esse influxo espontâneo. Aplicação histórica na conservação de carnes pela salga (charque e bacalhau) e frutas em calda de açúcar hiperconcentrada: os micro-organismos decompositores perdem água por osmose, desidratam-se e morrem.',
            '**Fator de Correção de van \'t Hoff ($i$)**: Solutos moleculares (glicose, sacarose, ureia) não se dissociam nem ionizam em água ($i = 1$). Já os solutos eletrolíticos iônicos ($NaCl \\rightarrow Na^+ + Cl^-$: $i \\approx 2$; $CaCl_2 \\rightarrow Ca^{2+} + 2Cl^-$: $i \\approx 3$; $Al_2(SO_4)_3$: $i \\approx 5$) dissociam-se em múltiplos íons livres por fórmula, gerando um efeito coligativo 2, 3 ou 5 vezes mais intenso para a mesma concentração molar!'
          ],
          formulas: [
            {
              id: 'pressao-osmotica-formula',
              name: 'Equação de van \'t Hoff para Pressão Osmótica',
              latex: '\\pi = M \\cdot R \\cdot T \\cdot i',
              description: 'Onde M é a concentração em mol/L, R é a constante dos gases (0,082 atm L/mol K), T é a temperatura absoluta em Kelvin e i é o fator de van \'t Hoff.',
              variables: [
                { symbol: '\\pi', meaning: 'Pressão osmótica', unit: 'atm' },
                { symbol: 'M', meaning: 'Molaridade da solução', unit: 'mol/L' },
                { symbol: 'R', meaning: 'Constante universal dos gases perfeitos', unit: 'atm·L/(mol·K)' },
                { symbol: 'T', meaning: 'Temperatura absoluta', unit: 'K' },
                { symbol: 'i', meaning: 'Fator de correção de van \'t Hoff', unit: '-' }
              ]
            }
          ],
          tips: [
            'Comparação campeã em provas: Se você comparar soluções aquosas de mesma concentração $0,1\\text{ mol/L}$ de Glicose ($i=1$), $NaCl$ ($i=2$) e $CaCl_2$ ($i=3$), a solução de $CaCl_2$ apresentará a menor temperatura de congelamento (maior efeito crioscópico), a maior temperatura de ebulição (maior efeito ebulioscópico) e a maior pressão osmótica, porque gera três vezes mais partículas livres em solução!'
          ]
        }
      ]
    },
    {
      id: 'quimica-geral-inorganica-ambiental',
      title: 'Química Geral, Interações Moleculares e Meio Ambiente',
      description: 'Modelos atômicos, ligações e geometria, separação de misturas, forças intermoleculares, chuva ácida e tratamento de água.',
      subtopics: [
        {
          id: 'atomistica-tabela-ligacoes-geometria',
          title: 'Atomística, Tabela Periódica, Ligações Químicas e Geometria Molecular',
          enemWeight: 'Muito Alta',
          summary: 'Evolução dos modelos atômicos, periodicidade química, ligações iônicas, metálicas e covalentes, e determinação da geometria e polaridade.',
          keyConcepts: [
            '**Evolução dos Modelos Atômicos**: 1) **Dalton** (1808, "Bola de Bilhar"): átomo maciço, indivisível, indestrutível e esférico; 2) **Thomson** (1897, "Pudim de Passas"): descoberta do elétron via raios catódicos; massa esférica positiva com elétrons incrustados, eletricamente neutro; 3) **Rutherford** (1911, "Modelo Planetário"): dispersão alfa em folha de ouro; núcleo atômico minúsculo, denso e positivo, com elétrons girando na imensa eletrosfera vazia; 4) **Bohr** (1913): órbitas circulares quantizadas; saltos quânticos de elétrons excitados que, ao retornarem ao estado fundamental, **emitem fótons de luz visível** com comprimento de onda específico (fogos de artifício e ensaio de chama).',
            '**Propriedades Periódicas dos Elementos**: 1) **Raio Atômico**: cresce para a esquerda nos períodos e para baixo nas famílias; o cátion é sempre menor que seu átomo neutro e o ânion é maior; 2) **Eletronegatividade**: atração exercida sobre elétrons em ligações covalentes; cresce para a direita e para cima (ordem: $\\text{F} > \\text{O} > \\text{N} > \\text{Cl} > \\text{Br} > \\text{I} > \\text{S} > \\text{C} > \\text{P} > \\text{H}$); 3) **Energia de Ionização**: energia mínima para retirar um elétron no estado gasoso fundamental; varia no mesmo sentido da eletronegatividade.',
            '**Ligações Químicas Fundamentais**: 1) **Ligação Iônica**: atração eletrostática entre cátions metálicos e ânions ametais; forma retículos cristalinos sólidos duros e quebradiços com altos pontos de fusão/ebulição e condução elétrica fundidos ou em água; 2) **Ligação Covalente**: compartilhamento de pares eletrônicos entre ametais ou com hidrogênio; 3) **Ligação Metálica**: retículo de cátions imersos em um mar de elétrons livres deslocalizados, propiciando alta condutividade térmica e elétrica, ductilidade e maleabilidade.',
            '**Geometria Molecular e Polaridade (VSEPR)**: 1) **Linear**: 2 nuvens eletrônicas ($BeH_2, CO_2$: $\\mu = 0$, apolar); 2) **Angular**: 3 ou 4 nuvens com pares livres no átomo central ($H_2O, SO_2$: $\\mu \\neq 0$, polar); 3) **Trigonal Plana**: 3 nuvens sem pares livres ($BF_3, SO_3$: apolar com ligantes iguais); 4) **Piramidal**: 4 nuvens com um par livre ($NH_3$: fortemente polar); 5) **Tetraédrica**: 4 nuvens sem pares livres no centro ($CH_4, CCl_4$: apolar com ligantes iguais).'
          ],
          tips: [
            'Dica de ouro no ENEM para polaridade: A molécula de água ($H_2O$) é angular e polar porque o oxigênio possui dois pares de elétrons não compartilhados que empurram as ligações $O-H$ para baixo, gerando momento dipolar permanente diferente de zero. Já o gás carbônico ($CO_2$) é linear e apolar porque os dois dipolos em sentidos opostos anulam-se mutuamente.'
          ]
        },
        {
          id: 'separacao-misturas-forcas-poluicao',
          title: 'Separação de Misturas, Forças Intermoleculares e Química Ambiental',
          enemWeight: 'Muito Alta',
          summary: 'Processos físicos de fracionamento de misturas, forças de atração intermolecular, chuva ácida e etapas completas da ETA.',
          keyConcepts: [
            '**Separação de Misturas Heterogêneas**: 1) **Decantação**: sedimentação espontânea pela gravidade por diferença de densidade (água e areia; ou no funil de decantação para água e óleo); 2) **Filtração**: retenção mecânica de sólidos suspensos por meio poroso; 3) **Flotação**: injeção de microbolhas de ar que agregam partículas e as fazem flutuar (mineração e tratamento de efluentes); 4) **Levigação**: corrente de água arrasta a fase menos densa (bateia no garimpo de ouro com mercúrio).',
            '**Separação de Misturas Homogêneas (Soluções)**: 1) **Destilação Simples**: separação entre sólido dissolvido e líquido com pontos de ebulição distantes (dessalinização de água); 2) **Destilação Fracionada**: separação de líquidos miscíveis com temperaturas de ebulição próximas com coluna de fracionamento (refino de frações do petróleo).',
            '**Hierarquia das Forças Intermoleculares**: 1) **Dipolo Induzido / London**: atração fraca entre dipolos instantâneos em moléculas apolares ($O_2, N_2, CH_4$, hidrocarbonetos); 2) **Dipolo Permanente**: atração entre dipolos em moléculas polares ($HCl, SO_2$); 3) **Ligações de Hidrogênio**: atração fortíssima quando o hidrogênio está ligado a átomos de pequeno raio e altíssima eletronegatividade ($F, O, N$ em $H_2O, HF, NH_3$ e no DNA).',
            '**Química da Chuva Ácida**: A chuva natural é levemente ácida ($pH \\approx 5,6$) por causa do $CO_2$ dissolvido. A **Chuva Ácida nociva** ($pH < 5,0$) é provocada por óxidos de enxofre e nitrogênio da queima fóssil: $SO_3 + H_2O \\rightarrow H_2SO_4$ (ácido sulfúrico) e $2NO_2 + H_2O \\rightarrow HNO_3 + HNO_2$ (ácido nítrico), corroendo estátuas de calcário ($CaCO_3$) e acidificando mananciais.',
            '**Estação de Tratamento de Água (ETA)**: 1) **Coagulação**: adição de sulfato de alumínio $Al_2(SO_4)_3$ e cal virgem $CaO$ para neutralizar cargas coloidais; 2) **Floculação**: agitação lenta para agregar a sujeira em flocos densos; 3) **Decantação**: repouso e sedimentação dos flocos no fundo dos tanques; 4) **Filtração**: leito de carvão ativado (adsorção de odores e corantes), areia e cascalho; 5) **Desinfecção / Cloração**: adição de $Cl_2$ ou $NaClO$ bactericida; 6) **Fluoretação**: combate preventivo à cárie dentária; 7) **Correção de pH**: alcalinização suave para evitar corrosão na tubulação.'
          ],
          tips: [
            'Tema campeão do ENEM: O carvão ativado utilizado nos filtros domésticos e na ETA atua pelo fenômeno físico de ADSORÇÃO de superfície em seus microporos, retendo impurezas orgânicas por forças de van der Waals sem reagir quimicamente.'
          ]
        },
        {
          id: 'funcoes-inorganicas-chuva-acida-calagem',
          title: 'Química Inorgânica: Óxidos, Ácidos, Bases e Aplicações Ambientais (Chuva Ácida e Calagem)',
          enemWeight: 'Muito Alta',
          summary: 'A classificação das quatro funções inorgânicas fundamentais, comportamento dos óxidos, reações de neutralização, hidrólise salina e química da calagem agrícola.',
          keyConcepts: [
            '**Classificação Clássica de Arrhenius**: 1) **Ácidos**: substâncias que em solução aquosa sofrem ionização liberando como único cátion o hidrogênio ($H^+$ ou hidrônio $H_3O^+$); 2) **Bases (Hidróxidos)**: substâncias que em solução sofrem dissociação liberando como único ânion a hidroxila ($OH^-$); 3) **Sais**: compostos iônicos formados por cátion diferente de $H^+$ e ânion diferente de $OH^-$, produtos da neutralização ácido-base; 4) **Óxidos**: compostos binários onde o oxigênio é o elemento mais eletronegativo (excluem-se os fluoretos de oxigênio).',
            '**Classificação Estratégica dos Óxidos no ENEM**: 1) **Óxidos Ácidos (Anidridos)**: formados por ametais com elevado número de oxidação ($SO_2, SO_3, CO_2, NO_2$). Reagem com água formando ácidos ($SO_3 + H_2O \\rightarrow H_2SO_4$) e reagem com bases formando sal e água; 2) **Óxidos Básicos**: formados por metais alcalinos e alcalino-terrosos com baixo nox ($CaO, Na_2O, BaO$). Reagem com água formando bases fortes ($CaO + H_2O \\rightarrow Ca(OH)_2$) e neutralizam ácidos; 3) **Óxidos Neutros (Indiferentes)**: ametais com baixo nox que NÃO reagem com água, ácidos nem bases ($CO$, $NO$, $N_2O$); 4) **Óxidos Anfóteros**: comportam-se como ácidos perante bases fortes e como bases perante ácidos fortes ($Al_2O_3, ZnO$).',
            '**Reações de Neutralização e Hidrólise Salina**: A neutralização total ocorre quando mols de $H^+$ igualam mols de $OH^-$: $\\text{Ácido} + \\text{Base} \\rightarrow \\text{Sal} + H_2O$. No entanto, o pH final da solução salina depende da força relativa dos precursores: sal de ácido forte com base fraca sofre hidrólise do cátion gerando **pH ácido** (ex: $NH_4Cl$); sal de ácido fraco com base forte sofre hidrólise do ânion gerando **pH básico** (ex: bicarbonato de sódio $NaHCO_3$, carbonato de sódio $Na_2CO_3$ e acetato de sódio); sal de ácido forte com base forte **não sofre hidrólise apreciável**, mantendo pH neutro ($NaCl$).',
            '**Química da Calagem Agrícola e Correção de Solos**: O cerrado brasileiro possui solos naturalmente muito ácidos ($pH < 5$) e com elevada toxidade por íons alumínio ($Al^{3+}$), que inibem o desenvolvimento radicular das plantas. A **Calagem** consiste na adição de calcário agrícola moído ($CaCO_3$ e $MgCO_3$) ou cal virgem ($CaO$): $CaCO_3 \\rightarrow Ca^{2+} + CO_3^{2-}$; os ânions carbonato reagem com a água e com a acidez do solo ($CO_3^{2-} + 2H^+ \\rightarrow H_2O + CO_2$), neutralizando os prótons livres, elevando o pH e precipitando o alumínio tóxico na forma de hidróxido de alumínio insolúvel e inofensivo: $Al^{3+} + 3OH^- \\rightarrow Al(OH)_3 \\downarrow$.'
          ],
          tips: [
            'Dica clássica de prova: O monóxido de carbono ($CO$) é um óxido neutro e gás asfixiante tóxico (liga-se à hemoglobina formando carboxiemoglobina irreversível), mas NÃO provoca chuva ácida, pois não reage com a água das nuvens. Quem provoca a chuva ácida são os óxidos ácidos $SO_2$, $SO_3$ e $NO_x$!'
          ]
        }
      ]
    }
  ]
};
