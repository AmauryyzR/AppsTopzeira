import { Discipline } from '../../../types/curriculum';

export const biologia: Discipline = {
  id: 'biologia',
  name: 'Biologia',
  description: 'Estruturas celulares, genética, evolução dos seres vivos, fisiologia animal e vegetal, botânica e ecologia sustentável.',
  topics: [
    {
      id: 'ecologia-biodiversidade',
      title: 'Ecologia e Meio Ambiente',
      description: 'Relações ecológicas, fluxo de matéria e energia, dinâmica populacional e conservação dos biomas brasileiros.',
      subtopics: [
        {
          id: 'cadeias-alimentares-biomagnificacao',
          title: 'Fluxo de Energia, Teias Alimentares e Bioacumulação',
          enemWeight: 'Muito Alta',
          summary: 'A energia solar é fixada pelos autótrofos fotossintetizantes e flui de forma estritamente unidirecional e decrescente através dos níveis tróficos, enquanto poluentes lipossolúveis sofrem biomagnificação no topo da cadeia.',
          keyConcepts: [
            '**Fluxo Unidirecional de Energia**: A cada nível trófico consecutivo (produtor $\\rightarrow$ consumidor primário $\\rightarrow$ secundário), cerca de 90% da energia é dissipada na forma de calor metabólico (segunda lei da termodinâmica); apenas ~10% converte-se em biomassa para o nível seguinte.',
            '**Pirâmides Ecológicas**: As pirâmides de energia são SEMPRE diretas (nunca invertidas). As de número e de biomassa podem se inverter (ex.: uma grande árvore sustentando milhares de pulgões; ou fitoplâncton marinho com biomassa instantânea menor que a do zooplâncton, devido à altíssima taxa reprodutiva do fitoplâncton).',
            '**Biomagnificação Trófica** (Bioacumulação): Metais pesados (mercúrio $Hg$, chumbo $Pb$) e pesticidas clorados organopersistentes (DDT) não são metabolizados nem excretados pelos organismos. Por serem lipossolúveis, acumulam-se em concentrações progressivamente maiores em cada nível trófico, atingindo a dose máxima letal nos carnívoros de topo (como aves de rapina e seres humanos).',
            '**Espécies-Chave** (*Keystone Species*): Organismos que desempenham papel regulador desproporcional à sua biomassa na manutenção da biodiversidade local (ex.: lontras marinhas controlando ouriços que devorariam as florestas de kelp).'
          ],
          formulas: [
            {
              id: 'rendimento-trofico',
              name: 'Eficiência Trófica Média',
              latex: 'E_{\\text{trófica}} \\approx \\frac{\\text{Energia no nível } n+1}{\\text{Energia no nível } n} \\times 100\\% \\approx 10\\%',
              description: 'Aproximação de Lindeman para a transferência percentual de energia de um nível trófico ao imediatamente superior.'
            }
          ],
          tips: [
            'Diferença crucial para o ENEM: A energia é estritamente unidirecional e degradada como calor (não se recicla). A matéria química (carbono, nitrogênio, fósforo), por outro lado, é totalmente reciclada e reutilizada indefinidamente graças aos decompositores (bactérias e fungos sapróbios).'
          ]
        },
        {
          id: 'ciclos-biogeoquimicos',
          title: 'Ciclos Biogeoquímicos e Eutrofização de Corpos Hídricos',
          enemWeight: 'Muito Alta',
          summary: 'O ciclo do nitrogênio, o ciclo do carbono e o processo artificial de eutrofização com depleção crítica de oxigênio dissolvido.',
          keyConcepts: [
            '**Ciclo do Nitrogênio**: 1) Fixação Biológica ($N_2 \\rightarrow NH_3$ ou $NH_4^+$ por bactérias como *Rhizobium* em nódulos de leguminosas e cianobactérias); 2) Nitrosação ($2NH_3 + 3O_2 \\rightarrow 2NO_2^- + 2H^+ + 2H_2O$ por *Nitrosomonas*); 3) Nitratação ($2NO_2^- + O_2 \\rightarrow 2NO_3^-$ por *Nitrobacter*); 4) Desnitrificação ($NO_3^- \\rightarrow N_2$ por bactérias anaeróbias *Pseudomonas denitrificans*, devolvendo o gás à atmosfera).',
            '**Ciclo do Carbono**: Balanço entre fotossíntese (sequestro de $CO_2$ atmosférico em compostos orgânicos) e respiração celular/queima de combustíveis fósseis (liberação de $CO_2$). O excesso de emissão antropogênica acarreta acidificação oceânica ($CO_2 + H_2O \\rightleftharpoons H_2CO_3 \\rightleftharpoons H^+ + HCO_3^-$), dissolvendo as conchas de carbonato de cálcio ($CaCO_3$) de moluscos e corais.',
            '**Eutrofização Artificial**: Despejo de efluentes ricos em fósforo e nitrogênio (esgoto não tratado ou fertilizantes NPK) $\\rightarrow$ Proliferação desordenada de microalgas superficiais (*bloom*) $\\rightarrow$ Formação de uma película verde que bloqueia a passagem da luz solar $\\rightarrow$ Morte da vegetação subaquática $\\rightarrow$ Explosão populacional de bactérias decompositoras aeróbias $\\rightarrow$ Esgotamento do oxigênio dissolvido ($OD \\rightarrow 0$) $\\rightarrow$ Morte de peixes por asfixia e proliferação de bactérias anaeróbias com liberação de gases sulfídricos fétidos ($H_2S$).'
          ],
          tips: [
            'A adubação verde e a rotação de culturas utilizando leguminosas (soja, feijão, ervilha) fixam nitrogênio naturalmente sem necessidade de fertilizantes químicos sintéticos derivados da reação industrial de Haber-Bosch, minimizando o risco de eutrofização por lixiviação.'
          ]
        },
        {
          id: 'biomas-brasileiros',
          title: 'Biomas Brasileiros e Adaptações Morfofisiológicas',
          enemWeight: 'Muito Alta',
          summary: 'As particularidades ecológicas e climáticas dos seis grandes biomas nacionais e a conservação da biodiversidade diante do desmatamento e queimadas.',
          keyConcepts: [
            '**Cerrado** (Savana Brasileira): Clima tropical típico com duas estações bem marcadas (inverno seco e verão chuvoso). Solos latossolos antigos, profundos, ácidos, ricos em alumínio tóxico e pobres em nutrientes essenciais. Vegetação com casca corticosa espessa (isolante térmico contra o fogo), gemas apicais protegidas, folhas coriáceas e raízes pivotantes profundas que acessam o lençol freático a dezenas de metros.',
            '**Caatinga**: Único bioma restrito ao território brasileiro. Clima semiárido com chuvas escassas e irregulares. Vegetação xerófila adaptada ao estresse hídrico: folhas reduzidas ou modificadas em espinhos (para diminuir a transpiração cuticular), caules fotossintetizantes verdes (cladódios), tecidos suculentos (parênquima aquífero) para armazenamento hídrico (mandacaru, xique-xique), cutícula cerosa grossa e raízes superficiais extensas para absorver chuvas rápidas.',
            '**Floresta Amazônica e Mata Atlântica**: Florestas ombrófilas densas tropicais com estratificação vertical (sub-bosque, dossel e árvores emergentes). Elevada precipitação pluvial e umidade do ar. O solo amazônico é naturalmente arenoso e pobre em nutrientes minerais, sustentando-se exclusivamente pela rápida reciclagem promovida pela serrapilheira (folhas e matéria orgânica em decomposição acelerada).',
            '**Pantanal**: Maior planície inundável do planeta. Dinâmica hidrológica anual com pulsos de cheia e vazante, abrigando mosaico fisionômico com elementos da Amazônia, Cerrado e Chaco.',
            '**Pampas** (Campos Sulinos): Predomínio de gramíneas herbáceas em relevo de coxilhas suaves, adaptadas a baixas temperaturas e geadas no inverno.'
          ],
          tips: [
            'Pegadinha recorrente no ENEM: As árvores do Cerrado têm galhos tortuosos NÃO por falta de água (já que suas raízes profundas encontram água abundante no lençol até na estiagem), mas sim pela toxidez do alumínio livre no solo ácido e pela queima periódica das gemas apicais pelo fogo natural.'
          ]
        },
        {
          id: 'relacoes-ecologicas-sucessao',
          title: 'Relações Ecológicas e Sucessão Ecológica',
          enemWeight: 'Alta',
          summary: 'Interações harmônicas e desarmônicas intraespecíficas e interespecíficas, e a evolução direcional das comunidades em direção ao clímax.',
          keyConcepts: [
            '**Relações Intraespecíficas**: Sociedades (divisão de trabalho cooperativa sem união física, ex.: abelhas, formigas) e Colônias (união anatômica com benefício mútuo, ex.: corais, caravela-portuguesa). Canibalismo e Competição intraespecífica são desarmônicas.',
            '**Relações Interespecíficas Harmônicas**: Mutualismo (+/+, associação obrigatória vital para a sobrevivência, ex.: líquens, micorrizas, bactérias no rúmen de bovinos); Protocooperação (+/+, cooperação facultativa não obrigatória, ex.: pássaro-palito e crocodilo); Comensalismo (+/0, obtenção de restos alimentares sem prejuízo, ex.: rêmora e tubarão); Inquilinismo/Epifitismo (+/0, uso como suporte físico, ex.: orquídeas e bromélias sobre galhos de árvores).',
            '**Relações Interespecíficas Desarmônicas**: Predatismo (+/-); Parasitismo (+/-); Amensalismo/Antibiose (-/0, secreção de substâncias que inibem o crescimento de outros seres, ex.: fungo *Penicillium* produzindo antibiótico, maré vermelha por dinoflagelados); Competição interespecífica (-/-, Princípio de Gause ou da Exclusão Competitiva: duas espécies que compartilham o mesmo nicho ecológico não coexistem indefinidamente).',
            '**Sucessão Ecológica Primária vs. Secundária**: Primária inicia-se em substratos estéreis onde nunca houve vida antes (rocha nua, lava vulcânica recém-resfriada) com espécies pioneiras (líquens, musgos); Secundária ocorre em áreas previamente habitadas que sofreram perturbação (área desmatada, queimada recente). Ao longo da sucessão: aumenta a biomassa total, a complexidade das teias tróficas e a biodiversidade; a produtividade primária líquida ($PPL = PPB - R$) diminui até atingir o clímax ($PPL \\approx 0$).'
          ],
          tips: [
            'No ecossistema clímax (como a Floresta Amazônica em equilíbrio maduro), quase toda a matéria orgânica produzida na fotossíntese ($PPB$) é consumida pela própria respiração celular dos vegetais e animais da floresta ($R$), logo $PPL \\approx 0$. A Amazônia não é o "pulmão do mundo" (esse papel pertence às algas marinhas e fitoplâncton).'
          ]
        }
      ]
    },
    {
      id: 'botanica-fisiologia-vegetal',
      title: 'Botânica, Morfologia e Fisiologia Vegetal Completa',
      description: 'Evolução dos grandes grupos vegetais, histologia, morfologia de órgãos, fotoperiodismo, mecanismos estomáticos e fitormônios.',
      subtopics: [
        {
          id: 'grupos-vegetais-evolucao',
          title: 'Evolução e Sistemática: Briófitas, Pteridófitas, Gimnospermas e Angiospermas',
          enemWeight: 'Alta',
          summary: 'A filogenia vegetal e as novidades evolutivas (sinapomorfias) que permitiram a conquista gradual e definitiva do ambiente terrestre.',
          keyConcepts: [
            '**Briófitas** (Musgos e Hepáticas): Avasculares / Não-traqueófitas (ausência de xilema e floema; o transporte de seiva ocorre de célula a célula por difusão lenta, restringindo o porte a poucos centímetros); Fase gametofítica haploide ($n$) é a dominante e fotossintetizante duradoura; o esporófito diploide ($2n$) é efêmero e nutricionalmente dependente do gametófito; necessitam obrigatoriamente de lâmina de água para que os anterozoides flagelados nadem até a oosfera.',
            '**Pteridófitas** (Samambaias e Avencas): Primeiras plantas vasculares (traqueófitas com xilema e floema com lignina), permitindo aumento expressivo de porte mecânico; Fase esporofítica ($2n$) passa a ser dominante e duradoura; gametófito ($n$, protalo) é reduzido e efêmero; ainda dependem de água líquida para fecundação; ausência de sementes (reprodução por esporos formados nos soros).',
            '**Gimnospermas** (Pinheiro-do-Paraná / *Araucaria*, Coníferas): Primeiras espermatófitas (possuem sementes, porém "nuas", desprovidas de fruto protetor ao redor); libertaram-se definitivamente da dependência de água para fecundação pela invenção do grão de pólen anemófilo (sifonogamia via tubo polínico até o óvulo); possuem estróbilos (pinhas) como estruturas reprodutivas.',
            '**Angiospermas** (Antófitas / Magnoliófitas): Grupo vegetal mais bem-sucedido e biodiverso do planeta. Invenções chave: FLORES verdadeiras com verticilos atrativos para polinização biológica (zoofilia por abelhas, aves, morcegos); FRUTO que protege a semente e atua na dispersão zoocórica; Dupla Fecundação originando o embrião diploide ($2n$) e o endosperma secundário triploide ($3n$). Divididas em Monocotiledôneas (1 cotilédone, raiz fasciculada/cabeleira, folhas com nervuras paralelas/paralelinérveas, flores trímeras) e Eudicotiledôneas (2 cotilédones, raiz pivotante/axial, folhas com nervuras reticuladas/peninérveas, flores tetrâmeras ou pentâmeras).'
          ],
          tips: [
            'Quadro comparativo essencial para o ENEM: Independência da água líquida para fecundação surgiu nas GIMNOSPERMAS com o grão de pólen e tubo polínico. O FRUTO surgiu apenas nas ANGIOSPERMAS como desenvolvimento das paredes do ovário da flor após a fecundação.'
          ]
        },
        {
          id: 'histologia-morfologia-vegetal',
          title: 'Histologia e Anatomia Vegetal: Meristemas e Tecidos Adultos',
          enemWeight: 'Baixa',
          summary: 'Organização celular dos tecidos vegetais de crescimento, revestimento, sustentação mecânica, preenchimento metabólico e condução vascular.',
          keyConcepts: [
            '**Meristemas** (Tecidos de Crescimento): Células indiferenciadas totipotentes com intensa atividade mitótica, paredes celulares finas e vacúolos diminutos. Meristemas Primários (apicais do caule e da raiz: protoderme, meristema fundamental e procâmbio) promovem crescimento em comprimento/altura. Meristemas Secundários (câmbio vascular e felogênio) promovem o crescimento secundário em espessura (tronco lenhoso).',
            '**Tecidos de Revestimento**: Epiderme (tecido vivo uniestratificado, revestido externamente pela cutícula lipídica impermeabilizante de cutina; contém estômatos, tricomas/pelos e acúleos) e Periderme (tecido protetor secundário das cascas lenhosas, formado pelo felogênio que produz o súber/cortiça rico em suberina morta para o exterior e feloderme viva para o interior).',
            '**Tecidos de Sustentação**: Colênquima (formado por células VIVAS com espessamentos desiguais de celulose nos cantos das paredes celulares; confere flexibilidade a órgãos jovens como caules verdes e pecíolos) vs. Esclerênquima (formado por células MORTAS revestidas por densa deposição de LIGNINA, conferindo rigidez extrema contra tensões mecânicas; compreende fibras esclerenquimáticas e esclereídes).',
            '**Tecidos de Preenchimento** (Parênquimas): Células vivas com grande vacúolo. Parênquima Clorofiliano (paliçádico e lacunoso nas folhas, centro ativo da fotossíntese); Parênquima Aquífero (reserva hídrica em cactáceas); Parênquima Aerífero / Aerênquima (câmaras de ar que propiciam flutuação e respiração em plantas aquáticas como vitória-régia); Parênquima Amiláceo (reserva de amido em tubérculos como batata e mandioca).',
            '**Tecidos Condutores**: Xilema / Lenho (células mortas lignificadas chamadas elementos de vaso e traqueídes; conduz a seiva bruta/inorgânica de água e sais minerais no sentido estritamente ascendente raiz $\\rightarrow$ folhas) vs. Floema / Líber (células vivas anucleadas chamadas elementos de tubo crivado associadas a células companheiras; conduz a seiva elaborada/orgânica de sacarose em fluxo bidirecional fonte $\\rightarrow$ dreno).'
          ],
          tips: [
            'Cuidado com a confusão entre Acúleo e Espinho: O espinho (presente nos cactos e laranjeiras) é uma modificação foliar ou caulinar profunda vascularizada conectada ao xilema e floema; o acúleo (presente na roseira) é uma simples projeção epidérmica externa não vascularizada, facilmente destacável.'
          ]
        },
        {
          id: 'transpiracao-mecanismo-estomatico',
          title: 'Mecanismo de Abertura e Fechamento dos Estômatos e Transpiração',
          enemWeight: 'Média',
          summary: 'A regulação biofísica das trocas gasosas foliares mediada pelo turgor das células-guarda, gradientes iônicos de potássio e o hormônio do estresse ácido abscísico (ABA).',
          keyConcepts: [
            '**Estrutura do Estômato**: Formado por duas células-guarda ou estomáticas reniformes que delimitam um poro central denominado ostíolo, cercadas por células subsidiárias. As células-guarda possuem paredes assimétricas (mais espessas e rígidas voltadas para o poro e mais delgadas voltadas para fora) e são as únicas células epidérmicas dotadas de cloroplastos funcionais.',
            '**Mecanismo de Abertura** (Células Túrgidas): Na presença de luz e baixa concentração interna de $CO_2$, bombas de prótons na membrana plasmática expulsam íons $H^+$, gerando gradiente eletroquímico que promove influxo maciço de íons potássio ($K^+$) e cloreto ($Cl^-$) para dentro das células-guarda $\\rightarrow$ o meio interno das células-guarda torna-se hipertônico $\\rightarrow$ água entra por osmose $\\rightarrow$ com o aumento da pressão de turgor, a parede delgada externa distende-se mais que a interna rígida, curvando as células e ABRINDO o ostíolo.',
            '**Mecanismo de Fechamento** (Células Flácidas / Murchas): No escuro, em altas concentrações de $CO_2$ ou sob estresse hídrico agudo (seca no solo), as raízes sintetizam Ácido Abscísico (ABA) que é transportado pelo xilema até as folhas $\\rightarrow$ o ABA promove efluxo rápido de íons $K^+$ para fora das células-guarda $\\rightarrow$ o interior torna-se hipotônico $\\rightarrow$ água sai por osmose $\\rightarrow$ as células-guarda perdem turgidez e murcham, FECHANDO o ostíolo para conter a desidratação.',
            '**Transpiração Estomática vs. Cuticular**: A transpiração cuticular é contínua e passiva (ocorre pela superfície cerosa da folha, respondendo por ~5 a 10% da perda de água); a estomática é ativamente regulada pela planta e responde por ~90 a 95% do vapor d\'água liberado.',
            '**Gutação / Sudação**: Perda de água líquida pelas bordas das folhas através de estruturas especiais chamadas hidatódios. Ocorre tipicamente durante noites com solo muito úmido e ar saturado de umidade (100% de umidade relativa), onde a pressão positiva da raiz empurra a seiva bruta sem que haja transpiração foliar.'
          ],
          tips: [
            'Dilema do estômato: O vegetal necessita abrir os estômatos para absorver $CO_2$ indispensável para a fotossíntese (Ciclo de Calvin), mas perde água por evaporação no processo. Se o solo secar, o fechamento estomático salva a planta da dessecação, mas paralisa o influxo de $CO_2$ e reduz a taxa fotossintética.'
          ]
        },
        {
          id: 'conducao-seivas-teorias',
          title: 'Condução de Seivas: Teoria de Dixon (Xilema) e Hipótese de Münch (Floema)',
          enemWeight: 'Baixa',
          summary: 'A física do transporte hidrostático a longas distâncias contra a gravidade em árvores gigantes e a distribuição de fotoassimilados.',
          keyConcepts: [
            '**Teoria da Coesão-Tensão-Transpiração de Dixon** (Xilema): Explica como árvores como sequoias de mais de 100 metros elevam água da raiz às folhas sem bombas mecânicas: 1) A transpiração nas folhas evapora água pelas câmaras subestomáticas, criando uma enorme pressão hidrostática negativa (sucção/tensão); 2) Devido às pontes de hidrogênio entre as moléculas de água (Coesão) e à interação com as paredes de celulose do vaso condutor (Adesão), forma-se uma coluna líquida contínua e ininterrupta que puxa a água desde as raízes.',
            '**Hipótese do Fluxo em Massa por Pressão de Münch** (Floema): 1) Nas folhas (fontes fotossintéticas), células do parênquima transferem ativamente sacarose para os tubos crivados do floema; 2) O aumento na concentração osmótica do floema atrai água do xilema vizinho por osmose, gerando alta pressão de turgor; 3) Nos órgãos de consumo ou reserva (raízes, frutos, gemas em crescimento - drenos), a sacarose é descarregada ativamente para ser consumida ou convertida em amido; 4) A água sai por osmose do floema de volta para o xilema; 5) A diferença de pressão hidrostática entre fonte (alta pressão) e dreno (baixa pressão) impulsiona o fluxo em massa da seiva elaborada.',
            '**Experimento do Anel de Malpighi**: A remoção de um anel completo de casca na base do tronco (que contém periderme, parênquima cortical e floema, mas preserva o xilema interno) interrompe o fluxo de seiva elaborada para as raízes. As raízes morrem por inanição energética (falta de glicose/sacarose), matando a planta após algumas semanas.'
          ],
          formulas: [
            {
              id: 'potencial-hidrico',
              name: 'Potencial Hídrico Vegetal',
              latex: '\\Psi_w = \\Psi_s + \\Psi_p',
              description: 'A água move-se espontaneamente de regiões com maior potencial hídrico (menos negativo) para regiões com menor potencial hídrico (mais negativo).',
              variables: [
                { symbol: '\\Psi_w', meaning: 'Potencial hídrico total', unit: 'MPa' },
                { symbol: '\\Psi_s', meaning: 'Potencial osmótico de solutos (sempre negativo ou nulo)', unit: 'MPa' },
                { symbol: '\\Psi_p', meaning: 'Potencial de pressão de turgor (positivo em células túrgidas)', unit: 'MPa' }
              ]
            }
          ],
          tips: [
            'Se um anel de casca (Anel de Malpighi) for retirado de apenas UM GALHO isolado frutífero, os frutos desse galho ficarão maiores e mais doces! Isso acontece porque a sacarose produzida pelas folhas daquele ramo não consegue descer para a raiz e acumula-se integralmente nos frutos do próprio galho.'
          ]
        },
        {
          id: 'fitormonios-movimentos-vegetais',
          title: 'Fitormônios Vegetais e Movimentos (Tropismos e Nastismos)',
          enemWeight: 'Média',
          summary: 'A sinalização bioquímica hormonal por auxinas, giberelinas, citocininas, etileno e ácido abscísico e o controle de tropismos.',
          keyConcepts: [
            '**Auxinas** (AIA - Ácido Indolilacético): Promove o alongamento e expansão celular. Responsável pela Dominância Apical (o meristema apical produz auxina em alta concentração que inibe o brotamento das gemas laterais; podar a gema apical retira a fonte inibidora e estimula a ramificação frondosa da copa). Estimula o enraizamento de estacas e o desenvolvimento do ovário em fruto (partenocarpia).',
            '**Citocininas**: Produzidas principalmente nas raízes e transportadas pelo xilema. Promovem divisão celular ativa (mitose), quebra da dominância apical e retardo do envelhecimento foliar (senescência). O balanço entre citocinina e auxina define a organogênese celular.',
            '**Giberelinas**: Produzidas em sementes e meristemas jovens. Promovem o alongamento extraordinário do caule, quebra da dormência de sementes e germinação (estimulam a síntese da enzima alfa-amilase que digere o amido do endosperma em glicose), e desenvolvimento de frutos sem sementes.',
            '**Etileno**: Único hormônio vegetal GASOSO ($C_2H_4$). Responsável direto pelo amadurecimento acelerado dos frutos climatéricos (conversão de amido em açúcares simples, degradação da clorofila e amolecimento da casca por digestão da parede celular) e pela abscisão (queda) de folhas senescentes e frutos maduros.',
            '**Ácido Abscísico** (ABA): O "hormônio do estresse e da sobrevivência". Inibe o crescimento, induz e mantém a dormência de sementes e gemas durante o inverno, e comanda o fechamento estomático imediato sob déficit hídrico.',
            '**Tropismos** (Movimentos Orientados com Direção de Crescimento): Fototropismo (o caule cresce curvando-se em direção à luz: a auxina degrada-se ou migra para o lado escuro, fazendo as células do lado sombreado alongarem-se mais que as do lado iluminado) e Gravitropismo/Geotropismo (o caule apresenta gravitropismo negativo - cresce para cima; a raiz apresenta gravitropismo positivo - cresce para baixo, pois na raiz altas concentrações de auxina inibem o alongamento celular).',
            '**Nastismos** (Movimentos Não-Orientados Independentes da Direção do Estímulo): Movimentos rápidos decorrentes de perda abrupta de turgor osmótico nas células do pulvino. Clássico na folha da dormideira (*Mimosa pudica*) ao ser tocada (sismonastia) e na abertura/fechamento das flores pelo calor ou luminosidade.'
          ],
          tips: [
            'Para amadurecer bananas ou abacates mais rapidamente em casa, costuma-se embrulhá-los em papel jornal ou colocá-los dentro de um saco plástico fechado com uma maçã madura: isso retém o gás etileno concentrado ao redor das frutas, acelerando as reações de maturação.'
          ]
        },
        {
          id: 'fotoperiodismo-fitocromos',
          title: 'Fotoperiodismo e Fitocromo na Floração e Germinação',
          enemWeight: 'Baixa',
          summary: 'A percepção da duração do dia e da noite mediada pelo pigmento proteico fitocromo e o controle da floração.',
          keyConcepts: [
            '**Fitocromo**: Pigmento fotorreceptor proteico existente em duas formas interconversíveis: 1) $F_v$ (Fitocromo Inativo / Vermelho): absorve luz vermelha curta (comprimento de onda ~660 nm) e converte-se rapidamente na forma $F_{ve}$; 2) $F_{ve}$ (Fitocromo Ativo / Vermelho Extremo): absorve luz vermelha longa (~730 nm) e converte-se na forma $F_v$. No escuro da noite, a forma ativa $F_{ve}$ reverte espontaneamente e lentamente para a forma inativa $F_v$.',
            '**Plantas de Dia Curto** (PDC): Florescem no outono/inverno, quando o fotoperíodo é curto. Na verdade, são plantas de NOITE LONGA: exigem um período de escuridão contínua igual ou SUPERIOR a um valor crítico para florescerem. Se a noite contínua for interrompida por um breve flash de luz vermelha curta, a floração é completamente abortada!',
            '**Plantas de Dia Longo** (PDL): Florescem na primavera/verão. Exigem um período de escuridão contínua INFERIOR ao período crítico (noites curtas). Se a noite longa for interrompida por um flash de luz, elas são induzidas a florescer.',
            '**Plantas Indiferentes / Neutras**: Florescem ao atingir maturidade fisiológica independentemente do fotoperíodo (ex.: tomate, milho, feijão).',
            '**Sementes Fotoblásticas Positivas**: Sementes que necessitam da presença de luz (forma ativa $F_{ve}$) para deflagrarem a germinação (como sementes pequenas de alface e plantas invasoras expostas à luz após o revolvimento do solo pelo arado).'
          ],
          tips: [
            'Atenção ao termo: O que controla rigorosamente a floração NÃO é o tempo de exposição à luz do dia, mas sim a DURAÇÃO CONTÍNUA DA NOITE ESCURA (nictoperíodo). Um pulso de luz no meio da noite reseta o relógio biológico da planta convertendo $F_v$ em $F_{ve}$.'
          ]
        },
        {
          id: 'reproducao-angiospermas-frutos',
          title: 'Morfologia Floral, Dupla Fecundação e Origem dos Frutos',
          enemWeight: 'Média',
          summary: 'A estrutura dos verticilos florais, a fecundação dupla exclusiva com endosperma triploide e a distinção botânica de frutos e pseudofrutos.',
          keyConcepts: [
            '**Verticilos Florais**: Cálice (conjunto de sépalas estéreis verdes), Corola (conjunto de pétalas coloridas), Androceu (órgão reprodutor masculino formado por estames com antera e filete) e Gineceu / Pistilo (órgão feminino formado por carpelos com estigma receptivo, estilete e ovário contendo óvulos).',
            '**Dupla Fecundação das Angiospermas**: O grão de pólen germina no estigma emitindo o tubo polínico com dois núcleos espermáticos ($n$). O primeiro núcleo espermático fecunda a Oosfera ($n$), formando o ZIGOTO diploide ($2n$) que originará o embrião da semente. O segundo núcleo espermático funde-se com os DOIS Núcleos Polares ($n + n$) do saco embrionário, gerando o Tecido Nutritivo ENDOSPERMA SECUNDÁRIO TRIPLOIDE ($3n$).',
            '**Destino das Estruturas Pós-Fecundação**: O óvulo fecundado e desenvolvido transforma-se na SEMENTE; a parede hipertrofiada do ovário transforma-se no FRUTO (pericarpo: epicarpo, mesocarpo e endocarpo).',
            '**Pseudofrutos**: Estruturas comestíveis onde a parte suculenta doce NÃO se desenvolveu a partir do ovário: 1) Maçã e Pera (desenvolvimento do receptáculo floral); 2) Caju (desenvolvimento do pedúnculo floral hipertrofiado; a castanha é o fruto verdadeiro!); 3) Morango (receptáculo floral carnoso hipertrofiado com pequenos pontinhos pretos que são os frutos verdadeiros do tipo aquênio).'
          ],
          tips: [
            'O endosperma das Gimnospermas é primário e HAPLOIDE ($n$, originado antes da fecundação do tecido gametofítico feminino). O endosperma das Angiospermas é secundário e TRIPLOIDE ($3n$, resultante da fusão do segundo núcleo espermático com os dois núcleos polares).'
          ]
        }
      ]
    },
    {
      id: 'citologia-genetica',
      title: 'Citologia, Biologia Molecular e Genética',
      description: 'Estrutura celular, bioenergética, dogma central da biologia, herança mendeliana e biotecnologia.',
      subtopics: [
        {
          id: 'citologia-membrana-organelas',
          title: 'Citologia Geral: Membrana Plasmática, Transportes e Organelas Citoplasmáticas',
          enemWeight: 'Muito Alta',
          summary: 'O modelo do mosaico fluido, os mecanismos de transporte ativo e passivo através da membrana e a compartimentalização e funções das organelas.',
          keyConcepts: [
            '**Arquitetura da Membrana Plasmática (Modelo do Mosaico Fluido)**: Descrito por Singer e Nicolson, consiste em uma bicamada contínua de **fosfolipídios anfipáticos** (cabeças polares hidrofílicas voltadas para o meio aquoso intra e extracelular e caudas apolares hidrofóbicas voltadas para o interior da bicamada). Nela encontram-se imersas **proteínas integrais e periféricas** dotadas de livre mobilidade lateral. Em células animais, o **colesterol** regula a fluidez da membrana, evitando excessiva rigidez no frio e liquefação no calor. Na face externa, lipídios e proteínas ligam-se a oligossacarídeos formando o **Glicocálix** (essencial no reconhecimento celular intercelular e na adesão tecidual).',
            '**Transporte Passivo (Sem Gasto de ATP)**: Ocorre a favor do gradiente eletroquímico: 1) **Difusão Simples** (passagem direta de pequenas moléculas e gases apolares como $O_2$ e $CO_2$ através da bicamada lipídica); 2) **Difusão Facilitada** (transporte de solutos polares como glicose e íons através de proteínas carreadoras permeases ou canais proteicos específicos); 3) **Osmose** (movimento espontâneo da água do meio hipotônico para o hipertônico através de canais de aquaporina até atingir o equilíbrio osmótico. Célula vegetal em meio hipertônico perde água e fica **plasmolisada**; em meio hipotônico absorve água e fica **túrgida**, sem romper devido à contrapressão da parede celular celulósica; já a hemácia animal sem parede sofre lise osmótica).',
            '**Transporte Ativo (Com Gasto de ATP)**: Ocorre contra o gradiente de concentração, mantendo assimetrias iônicas vitais. O exemplo clássico é a **Bomba de Sódio e Potássio** ($Na^+/K^+$ ATPase): quebra uma molécula de ATP para expulsar $3\\text{ Na}^+$ do citosol e internalizar $2\\text{ K}^+$ para o interior da célula. Esse processo é fundamental para a propagação do potencial de ação nos neurônios, contração muscular e osmorregulação.',
            '**Transporte em Massa (Vesicular)**: 1) **Endocitose**: Fagocitose (englobamento de partículas sólidas volumosas por emissão de pseudópodes, realizada por macrófagos e amebas) e Pinocitose (invaginação de pequenas gotículas contendo solutos dissolvidos); 2) **Exocitose / Clasmocitose**: fusão de vesículas com a membrana para eliminação de resíduos metabólicos ou secreção de hormônios e enzimas.',
            '**Fisiologia das Organelas Citoplasmáticas**: 1) **Retículo Endoplasmático Rugoso (RER)**: revestido de ribossomos, sintetiza proteínas destinadas à secreção externa, lisossomos ou membrana; 2) **Retículo Endoplasmático Liso (REL)**: sintetiza lipídios (colesterol e hormônios esteroides), atua na desintoxicação celular no fígado (inativando álcool e fármacos) e armazena cálcio no retículo sarcoplasmático muscular; 3) **Complexo Golgiense**: processa, empacota, endereça secreções em vesículas, sintetiza polissacarídeos e dá origem ao acrossomo do espermatozoide e aos lisossomos; 4) **Lisossomos**: vesículas com enzimas hidrolíticas ácidas (hidrolases com pH ~5) responsáveis pela digestão intracelular (heterofagia de antígenos fagocitados e autofagia de organelas velhas recicladas); 5) **Peroxissomos**: contêm a enzima catalase, que degrada o peróxido de hidrogênio tóxico ($2 H_2O_2 \\xrightarrow{\\text{catalase}} 2 H_2O + O_2$) gerado no metabolismo lipídico.'
          ],
          tips: [
            'Atenção aos experimentos de osmose no ENEM: Ao colocar uma salada de alface no sal ou tempero concentrado, as folhas murcham porque perdem água por osmose para o meio externo hipertônico. Para reidratá-las, basta mergulhá-las em água pura (meio hipotônico).'
          ]
        },
        {
          id: 'bioenergetica-celular',
          title: 'Bioenergética Celular: Fotossíntese, Respiração e Fermentação',
          enemWeight: 'Muito Alta',
          summary: 'Mecanismos de transdução de energia celular: síntese de ATP por gradiente quimiosmótico mitocondrial e fotofosforilação nos cloroplastos.',
          keyConcepts: [
            '**Fotossíntese - Fase Fotoquímica / Clara**: Ocorre nas membranas dos tilacoides dos cloroplastos. A luz excita a clorofila nos fotossistemas II e I $\\rightarrow$ ocorre a fotólise da água ($2H_2O \\rightarrow O_2 + 4H^+ + 4e^-$), liberando gás oxigênio livre para a atmosfera $\\rightarrow$ o fluxo de elétrons na cadeia de citocromos bombeia prótons gerando ATP e reduz $NADP^+$ a $NADPH$.',
            '**Fotossíntese - Fase Química / Ciclo de Calvin**: Ocorre no estroma. A enzima RuBisCO fixa moléculas de $CO_2$ atmosférico à ribulose 1,5-bisfosfato (RuBP), consumindo o ATP e o NADPH produzidos na fase clara para gerar trioses fosfatadas que formarão glicose e amido.',
            '**Respiração Celular Aeróbia**: Três etapas: 1) Glicólise (ocorre no citosol/hialoplasma, processo anaeróbio de quebra da glicose em 2 piruvatos, rendendo 2 ATP e 2 NADH); 2) Ciclo de Krebs (na matriz mitocondrial, descarboxilação com liberação de $CO_2$, produção de NADH, $FADH_2$ e ATP); 3) Cadeia Respiratória / Fosforilação Oxidativa (nas cristas mitocondriais, fluxo de elétrons impulsiona a ATP sintase por gradiente protônico quimiosmótico; o $O_2$ age como aceptor final de elétrons e prótons, formando água). Rendimento total de ~30 a 32 ATP.',
            '**Fermentação**: Quebra parcial da glicose no citosol na ausência de $O_2$, com rendimento de apenas 2 ATP (provenientes da glicólise). Fermentação Lática (produz ácido lático sem liberação de gás, realizada por lactobacilos e fibras musculares esqueléticas sob esforço anaeróbio intenso); Fermentação Alcoólica (produz etanol e libera gás carbônico $CO_2$, realizada por leveduras *Saccharomyces cerevisiae* na panificação e produção de cerveja/etanol combustível).'
          ],
          tips: [
            'O oxigênio liberado na fotossíntese provém exclusivamente da quebra da molécula de água ($H_2O$) na fase fotoquímica, e NÃO da molécula de gás carbônico ($CO_2$).'
          ]
        },
        {
          id: 'dna-sintese-proteica',
          title: 'Dogma Central: Replicação do DNA, Transcrição e Tradução',
          enemWeight: 'Muito Alta',
          summary: 'O fluxo de código genético do núcleo aos polirribossomos citoplasmáticos.',
          keyConcepts: [
            '**Replicação Semiconservativa**: Cada uma das duas fitas da dupla hélice de DNA serve de molde para uma fita-filha complementar, processo catalisado pela DNA polimerase no sentido $5\' \\rightarrow 3\'$.',
            '**Transcrição**: Síntese de RNAm precursor a partir de uma fita-molde de DNA nuclear pela RNA polimerase. Em eucariotos, ocorre o processamento (*splicing*): remoção dos íntrons (segmentos não codificantes) e união dos éxons (segmentos codificantes). O *splicing* alternativo permite que um único gene codifique múltiplas proteínas distintas.',
            '**Código Genético Universal e Degenerado**: 64 códons de trincas de bases para 20 aminoácidos. É "degenerado/redundante" porque diferentes códons sinônimos podem especificar o mesmo aminoácido (ex.: UUU e UUC codificam fenilalanina), o que protege o organismo de mutações silenciosas.',
            '**Tradução nos Ribossomos**: O códon de iniciação AUG (metionina) posiciona o complexo ribossomal; os RNAt trazem aminoácidos correspondentes aos anticódons complementares; a síntese estende-se até um códon de parada (UAA, UAG, UGA).'
          ],
          tips: [
            'Diferença básica de pareamento: No DNA, Adenina pareia com Timina ($A-T$) e Citosina com Guanina ($C-G$). No RNA, a Timina é substituída por Uracila ($A-U$).'
          ]
        },
        {
          id: 'genetica-mendeliana-grupos-sanguineos',
          title: 'Genética Mendeliana, Herança do Sexo e Grupos Sanguíneos (ABO e Rh)',
          enemWeight: 'Muito Alta',
          summary: 'As Leis de Mendel, interpretação de heredogramas, polialelia do sistema ABO, incompatibilidade do fator Rh (Eritroblastose Fetal) e herança ligada ao cromossomo X.',
          keyConcepts: [
            '**Primeira Lei de Mendel (Lei da Segregação dos Fatores)**: Cada característica biológica é determinada por um par de alelos que se separam na formação dos gametas durante a anáfase I da meiose. No cruzamento clássico entre heterozigotos ($Aa \\times Aa$), a proporção genotípica esperada na descendência é de $1\\text{ AA} : 2\\text{ Aa} : 1\\text{ aa}$ e a proporção fenotípica é de $3\\text{ dominantes} : 1\\text{ recessivo}$.',
            '**Segunda Lei de Mendel (Lei da Segregação Independente)**: Genes localizados em pares de cromossomos homólogos distintos segregam-se de forma independente na meiose. No di-hibridismo ($AaBb \\times AaBb$), a proporção fenotípica clássica é $9 : 3 : 3 : 1$. (Atenção: se os genes estiverem no mesmo cromossomo, temos **Linkage** ou ligação gênica, onde a proporção de gametas recombinantes depende da taxa de *crossing-over*).',
            '**Polialelia e o Sistema Sanguíneo ABO**: Determinado por três alelos múltiplos: $I^A$, $I^B$ e $i$. Os alelos $I^A$ e $I^B$ apresentam **codominância** entre si, e ambos dominam o alelo recessivo $i$: 1) Grupo A ($I^A I^A$ ou $I^A i$): aglutinogênio A na membrana das hemácias e aglutinina anti-B no plasma; 2) Grupo B ($I^B I^B$ ou $I^B i$): aglutinogênio B e anti-A; 3) Grupo AB ($I^A I^B$): aglutinogênios A e B, sem aglutininas plasmáticas (Receptor Universal de hemácias); 4) Grupo O ($ii$): sem aglutinogênios nas hemácias, com anti-A e anti-B no plasma (Doador Universal de hemácias).',
            '**Fator Rh e Eritroblastose Fetal (DHRN)**: Herança com dominância simples: $Rh^+$ ($R\\_$) e $Rh^-$ ($rr$). A **Doença Hemolítica do Recém-Nascido** ocorre quando uma **mãe $Rh^-$** gera um **feto $Rh^+$** (tendo o pai genótipo $Rh^+$): no primeiro parto, o contato com o sangue fetal sensibiliza a mãe a produzir anticorpos anti-Rh (IgG); em uma segunda gestação de feto $Rh^+$, esses anticorpos atravessam a barreira placentária e destroem as hemácias do concepto, causando anemia profunda, icterícia e eritroblastos na circulação. Profilaxia: injeção de soro com imunoglobulina anti-Rh na mãe $Rh^-$ até 72 horas após o primeiro parto.',
            '**Herança Ligada ao Sexo (Cromossomo X)**: Mutações recessivas localizadas na porção não homóloga do cromossomo X (como a **Hemofilia** e o **Daltonismo**) manifestam-se com muito mais frequência no sexo masculino ($X^d Y$), que necessita de apenas um alelo para expressar o fenótipo. Mulheres ($X^D X^d$) são portadoras normais assintomáticas e só manifestam a doença em homozigose recessiva ($X^d X^d$).'
          ],
          tips: [
            'Regra de ouro para interpretação de heredogramas no ENEM: Se dois pais fenotipicamente normais e iguais geram um filho(a) afetado, a característica é OBRIGATORIAMENTE RECESSIVA e os pais são heterozigotos ($Aa$). Se afetar predominantemente homens transmitido por mães normais, trata-se de herança recessiva ligada ao X.'
          ]
        },
        {
          id: 'linkage-interacao-genica-heranca-quantitativa',
          title: 'Genética Pós-Mendeliana: Linkage, Crossing-Over, Epistasia e Herança Quantitativa',
          enemWeight: 'Alta',
          summary: 'Ligação gênica (linkage), taxa de recombinação e mapa genético em morganídeos, arranjos cis e trans, epistasia dominante e recessiva, e herança quantitativa (poligenia com curva de Gauss).',
          keyConcepts: [
            '**Ligação Gênica (Linkage) versus Segunda Lei de Mendel**: Quando dois ou mais pares de alelos localizam-se no MESMO par de cromossomos homólogos, eles não sofrem segregação independente, tendendo a ser herdados juntos para o mesmo gameta. Essa exceção à 2ª Lei de Mendel divide-se em: 1) **Ligação Completa**: a distância entre os locos gênicos é tão íntima que nunca ocorre permutação, produzindo apenas dois tipos de gametas parentais ($50\\%$ e $50\\%$); 2) **Ligação Incompleta (Parcial)**: durante a prófase I da meiose (paquíteno), ocorre **crossing-over** (permutação) entre cromátides não-irmãs, gerando gametas recombinantes em frequência menor do que os parentais.',
            '**Configurações Cis e Trans no Duplo Heterozigoto ($AaBb$)**: 1) **Configuração Cis ($AB/ab$)**: os dois alelos dominantes estão situados no mesmo cromossomo e os dois recessivos no homólogo; os gametas parentais mais abundantes são $AB$ e $ab$, e os recombinantes mais raros são $Ab$ e $aB$; 2) **Configuração Trans ($Ab/aB$)**: um alelo dominante e um recessivo situam-se no mesmo cromossomo; os gametas parentais mais abundantes são $Ab$ e $aB$, enquanto os recombinantes são $AB$ e $ab$.',
            '**Taxa de Recombinação e Mapa Genético (Morganídeos / cM)**: A **Taxa de Recombinação (TR)** é a proporção percentual de gametas recombinantes formados: $\\text{TR} = (\\text{Gametas Recombinantes} / \\text{Total de Gametas}) \\times 100\\%$. Como a frequência de quebra mecânica entre dois locos é diretamente proporcional à distância física linear que os separa, $1\\%$ de taxa de recombinação equivale convencionalmente a **1 unidade de recombinação (UR)** ou **1 centimorgan (cM)**. A partir dessas distâncias aditivas, constroem-se os mapas genéticos lineares dos cromossomos. A taxa máxima teórica de recombinação observável entre dois locos gênicos é de $50\\%$.',
            '**Interação Gênica e Epistasia (Dominante vs. Recessiva)**: Ocorre quando dois ou mais pares de alelos independentes cooperam na expressão de uma única característica morfológica ou bioquímica. A **Epistasia** ocorre quando um alelo em um loco inibe a manifestação de alelos em outro loco independente: 1) **Epistasia Dominante** (proporção $12 : 3 : 1$ no di-hibridismo): basta um alelo dominante no loco epistático ($E\\_$) para suprimir a cor; 2) **Epistasia Recessiva** (proporção $9 : 3 : 4$, clássica na cor da pelagem de cães labradores): o alelo recessivo homozigoto $ee$ bloqueia a deposição de melanina nos pelos, gerando labradores amarelos/dourados independentemente dos alelos preto ($B\\_$) ou chocolate ($bb$).',
            '**Herança Quantitativa (Poligenia e Distribuição Gaussiana)**: Múltiplos pares de genes atuam em sinergia com efeito cumulativo aditivo na determinação de um fenótipo contínuo (como altura, peso corporal e tonalidade da cor da pele humana). Cada **alelo aditivo** (maiúsculo) adiciona uma dose incremental da substância ou tamanho. O cruzamento entre polímeros polihíbridos produz uma distribuição de frequências que assume a forma matemática de uma **Curva Normal de Gauss** (poucos indivíduos nos extremos recessivo e dominante, com concentração máxima no fenótipo intermediário mediano).'
          ],
          formulas: [
            {
              id: 'taxa-recombinacao-linkage',
              name: 'Taxa de Recombinação e Distância Gênica (Morganídeos)',
              latex: '\\text{TR} = \\frac{\\sum \\text{Recombinantes}}{\\text{Total de Descendentes}} \\times 100\\% \\iff 1\\% = 1\\text{ UR} = 1\\text{ cM}',
              description: 'Mede a distância física entre locos no mesmo cromossomo em centimorgans (cM).',
              variables: [
                { symbol: '\\text{TR}', meaning: 'Taxa de recombinação meiótica (frequência de permutação)', unit: '%' },
                { symbol: '\\text{UR / cM}', meaning: 'Unidade de Recombinação ou Centimorgan', unit: 'cM' }
              ]
            },
            {
              id: 'heranca-quantitativa-classes',
              name: 'Número de Classes Fenotípicas na Herança Quantitativa',
              latex: '\\text{Nº de Fenótipos} = 2n + 1',
              description: 'Onde n é o número de pares de genes poligiênicos envolvidos na característica contínua.',
              variables: [
                { symbol: 'n', meaning: 'Número de pares de alelos aditivos envolvidos na característica', unit: 'adimensional' },
                { symbol: '2n + 1', meaning: 'Total de variações fenotípicas observadas na população', unit: 'adimensional' }
              ]
            }
          ],
          tips: [
            'Dica de ouro no ENEM: Para diferenciar Segregação Independente de Linkage em cruzamento-teste ($AaBb \\times aabb$): se a prole apresentar 4 classes com frequências IDÊNTICAS ($25\\%$ cada), os genes estão em cromossomos diferentes (2ª Lei de Mendel). Se apresentar duas classes com frequências altas ($>25\\%$, parentais) e duas classes com frequências baixas ($<25\\%$, recombinantes), trata-se de LINKAGE!'
          ],
          deepSections: [
            {
              title: 'Mapeamento Cromossômico por Cruzamento-Teste de Três Pontos (Three-Point Testcross)',
              explanation: 'Problema clássico em segunda fase da FUVEST e vestibulares de alta seletividade: determinar a ordem linear e as distâncias físicas relativas entre três locos gênicos ligados ($A$, $B$ e $C$) a partir dos dados de frequência de descendentes em um cruzamento-teste ($AaBbCc \\times aabbcc$).',
              bullets: [
                '**Identificação das Classes Parentais e de Duplo Crossing-Over (DCO)**: Entre as 8 classes fenotípicas resultantes do cruzamento-teste: as duas classes mais frequentes correspondem aos **gametas parentais** (sem permuta); as duas classes com a menor frequência absoluta correspondem aos **duplos recombinantes (DCO)**, resultantes de quiasmas simultâneos nos dois intervalos adjacentes.',
                '**Determinação Inequívoca da Ordem Gênica**: O alelo do loco que troca de posição em relação aos outros dois nas classes de duplo recombinante quando comparado com as classes parentais é OBRIGATORIAMENTE o loco central (ex.: se os parentais são $ABC$ e $abc$ e os duplos recombinantes são $AbC$ e $aBc$, o gene $B$ foi o único a permutar isoladamente, comprovando que a ordem física linear no cromossomo é $A - B - C$).',
                '**Cálculo Rigoroso das Distâncias (cM / UR)**: A distância entre o gene inicial e o central é $d(A-B) = \\frac{\\text{SCO}_1 + \\text{DCO}}{\\text{Total}} \\times 100\\%$; a distância entre o central e o final é $d(B-C) = \\frac{\\text{SCO}_2 + \\text{DCO}}{\\text{Total}} \\times 100\\%$. Somando as distâncias parciais, obtém-se o mapa genético total $d(A-C) = d(A-B) + d(B-C)$.',
                '**Coeficiente de Coincidência ($c$) e Interferência ($I$)**: A frequência teórica esperada de duplos crossing-overs é o produto das probabilidades independentes dos dois intervalos: $\\text{DCO}_{\\text{esp}} = \\text{FR}(A-B) \\times \\text{FR}(B-C)$. O **Coeficiente de Coincidência** é $c = \\frac{\\text{DCO}_{\\text{obs}}}{\\text{DCO}_{\\text{esp}}}$. A **Interferência Cromossômica** é dada por $I = 1 - c$. Se $I > 0$ (interferência positiva), a formação física de um quiasma em um segmento inibe mecanicamente a ocorrência de outro quiasma na vizinhança imediata.'
              ]
            },
            {
              title: 'Fundamentos Bioquímicos de Epistasias e Dedução Algébrica da Herança Quantitativa',
              explanation: 'Compreensão aprofundada dos mecanismos enzimáticos que desviam as proporções mendelianas clássicas de $9:3:3:1$ e a dedução da distribuição binomial no Triângulo de Pascal.',
              bullets: [
                '**Vias Metabólicas Sequenciais e Epistasia Dupla Recessiva ($9:7$)**: Ocorre quando duas enzimas consecutivas codificadas por genes distintos são necessárias para sintetizar o produto final colorido: $\\text{Precursor incolor} \\xrightarrow{\\text{Enzima A}} \\text{Intermediário incolor} \\xrightarrow{\\text{Enzima B}} \\text{Pigmento ativo}$. Se o indivíduo for recessivo homozigoto para qualquer um dos locos ($aaB\\_$, $A\\_bb$ ou $aabb$), a via é bloqueada, gerando fenótipo albino/incolor. Assim, apenas a classe $A\\_B\\_$ ($9/16$) é pigmentada, enquanto as demais somam-se em $3 + 3 + 1 = 7/16$.',
                '**Dedução das Frequências Poligiênicas via Binômio de Newton**: Em uma herança quantitativa controlada por $n$ pares de alelos aditivos, a proporção esperada de cada classe com $k$ alelos aditivos (maiúsculos) na descendência de heterozigotos é calculada pelo termo binomial do Triângulo de Pascal: $P(k) = \\binom{2n}{k} \\left(\\frac{1}{2}\\right)^{2n} = \\frac{(2n)!}{k!(2n - k)!} \\cdot \\frac{1}{4^n}$. As classes extremas (máxima e mínima) surgem na frequência de $\\frac{1}{4^n}$, demonstrando por que características poligênicas complexas (como altura ou pigmentação com 3 pares) geram uma curva em sino gaussiana contínua.'
              ]
            }
          ]
        },
        {
          id: 'divisao-celular-genetica-populacoes',
          title: 'Mitose, Meiose, Aneuploidias e Teorema de Hardy-Weinberg',
          enemWeight: 'Média',
          summary: 'Os mecanismos citológicos de reprodução celular, a geração de variabilidade genética e a frequência alélica populacional.',
          keyConcepts: [
            '**Mitose**: Divisão equacional ($2n \\rightarrow 2n$) para crescimento somático e regeneração tecidual. Fases: Prófase, Metáfase (cromossomos em condensação máxima na placa equatorial), Anáfase (separação das cromátides-irmãs) e Telófase.',
            '**Meiose**: Divisão reducional ($2n \\rightarrow n$) para formação de gametas e esporos. Geração de variabilidade por: 1) *Crossing-over* ou permutação meiótica na prófase I (paquíteno); 2) Segregação independente dos cromossomos homólogos na anáfase I.',
            '**Não-Disjunções Cromossômicas**: Falha na separação dos homólogos (anáfase I) ou das cromátides (anáfase II) gerando gametas com aneuploidias: Síndrome de Down (Trissomia do cromossomo 21), Síndrome de Turner ($45,X0$) e Síndrome de Klinefelter ($47,XXY$).',
            '**Equilíbrio de Hardy-Weinberg**: Em uma população ideal panmítica (cruzamentos ao acaso), infinitamente grande, sem migrações, mutações ou ação da seleção natural, as frequências alélicas ($p + q = 1$) e genotípicas ($p^2 + 2pq + q^2 = 1$) permanecem constantes ao longo das gerações.'
          ],
          formulas: [
            {
              id: 'hardy-weinberg-formula',
              name: 'Equação do Equilíbrio de Hardy-Weinberg',
              latex: 'p + q = 1, \\quad p^2 + 2pq + q^2 = 1',
              description: 'Onde p é a frequência do alelo dominante (A) e q a do alelo recessivo (a).',
              variables: [
                { symbol: 'p^2', meaning: 'Frequência do genótipo homozigoto dominante (AA)', unit: '-' },
                { symbol: '2pq', meaning: 'Frequência do genótipo heterozigoto (Aa)', unit: '-' },
                { symbol: 'q^2', meaning: 'Frequência do genótipo homozigoto recessivo (aa)', unit: '-' }
              ]
            }
          ],
          tips: [
            'Em problemas de Hardy-Weinberg no ENEM: comece SEMPRE descobrindo a frequência do homozigoto recessivo ($q^2$), pois o fenótipo recessivo revela diretamente o genótipo ($aa$). Tire a raiz quadrada de $q^2$ para achar $q$, calcule $p = 1 - q$, e determine os heterozigotos por $2pq$.'
          ]
        },
        {
          id: 'biotecnologia-moderna',
          title: 'Biotecnologia: Transgênicos, CRISPR-Cas9, Clonagem e Teste de DNA',
          enemWeight: 'Muito Alta',
          summary: 'Engenharia genética molecular aplicada à agricultura, medicina e identificação forense.',
          keyConcepts: [
            '**Organismos Transgênicos**: Incorporam um gene de uma espécie exógena em seu genoma via plasmídeos bacterianos e enzimas de restrição (tesouras biológicas que cortam sequências palindrômicas). Exemplos: Soja transgênica resistente a herbicidas e Milho Bt (que produz a endotoxina inseticida de *Bacillus thuringiensis*).',
            '**Edição Genômica CRISPR-Cas9**: Sistema bacteriano adaptado para edição precisa in vivo. Um RNA-guia sintético conduz a endonuclease Cas9 a uma sequência específica do genoma do paciente para cortar, desativar ou reparar um gene com mutação deletéria.',
            '**Eletroforese e Teste de Paternidade** (DNA Fingerprint): Fragmentos de DNA gerados por enzimas de restrição (RFLP) ou repetições em tandem (STR) são separados em gel de agarose sob campo elétrico (o DNA tem carga líquida negativa devido aos grupamentos fosfato e migra para o polo positivo; fragmentos menores migram mais rápido). No teste de paternidade, todas as bandas do filho que não vieram da mãe biológica devem obrigatoriamente coincidir com as do pai biológico.'
          ],
          tips: [
            'Todo transgênico é um OGM (organismo geneticamente modificado), mas nem todo OGM é transgênico (caso de organismos que sofreram silenciamento gênico sem inserção de DNA de outra espécie).'
          ]
        }
      ]
    },
    {
      id: 'fisiologia-humana-saude',
      title: 'Fisiologia Humana e Saúde Coletiva',
      description: 'Integração funcional dos sistemas do corpo humano, regulação hormonal, imunologia e patologias.',
      subtopics: [
        {
          id: 'imunologia-vacinas-soros',
          title: 'Imunologia: Vacinas, Soros Terapêuticos e Resposta Imune',
          enemWeight: 'Muito Alta',
          summary: 'O tema biológico mais cobrado no ENEM: a diferença mecânica entre imunização ativa e passiva.',
          keyConcepts: [
            '**Vacina** (Imunização Ativa e Preventiva): Contém antígenos atenuados, inativados, toxoides ou RNAm mensageiro. Desencadeia uma resposta imune primária lenta no hospedeiro, estimulando a diferenciação de linfócitos B em plasmócitos (que produzem anticorpos próprios) e a formação de células de memória de longa duração. Em um segundo contato com o patógeno real, a resposta secundária é imediata e potente, evitando a instalação da doença.',
            '**Soro Terapêutico** (Imunização Passiva e Curativa): Contém anticorpos pré-formados purificados em animais hiperimunizados (como cavalos). Fornece alívio imediato contra toxinas letais de rápida ação (veneno de serpentes como jararaca e cascavel, picada de escorpião, tétano, raiva), não estimulando as células do indivíduo nem gerando memória imunológica.',
            '**Antígeno vs. Anticorpo**: Antígeno é qualquer corpo ou molécula estranha capaz de ser reconhecida e deflagrar resposta imune. Anticorpo (imunoglobulina) é a glicoproteína de defesa altamente específica produzida pelos plasmócitos para neutralizar o antígeno.'
          ],
          tips: [
            'Se a situação clínica do enunciado envolver PREVENÇÃO populacional duradoura: VACINA. Se envolver EMERGÊNCIA com risco iminente de morte após envenenamento peçonhento: SORO.'
          ]
        },
        {
          id: 'sistemas-digestorio-circulatorio-respiratorio',
          title: 'Sistemas Digestório, Circulatório e Respiratório Humano',
          enemWeight: 'Muito Alta',
          summary: 'Digestão química enzimática com controle hormonal, hematose pulmonar e circulação dupla fechada.',
          keyConcepts: [
            '**Digestão Química e Enzimas**: Boca (ptialina/amilase salivar quebra amido em pH neutro ~7); Estômago (pepsina quebra proteínas em meio fortemente ácido pH ~2 mantido pelo ácido clorídrico $HCl$); Intestino Delgado / Duodeno (o bicarbonato do suco pancreático neutraliza a acidez para pH alcalino ~8, permitindo a ação de tripsina, quimiotripsina, lipase pancreática e amilase pancreática; a bile, produzida pelo fígado e armazenada na vesícula biliar, NÃO possui enzimas, agindo como detergente emulsificante que divide as gorduras em gotículas microscópicas facilitando o ataque da lipase).',
            '**Regulação Hormonal da Digestão**: Gastrina (produzida pelo estômago, estimula secreção de $HCl$), Secretina (estimula o pâncreas a secretar suco rico em bicarbonato) e Colecistoquinina / CCK (estimula liberação de enzimas pancreáticas e contração da vesícula biliar para despejar bile).',
            '**Sistema Circulatório Humano**: Circulação dupla (passa duas vezes pelo coração), completa (não há mistura de sangue arterial oxigenado com sangue venoso desoxigenado) e fechada. Átrio direito recebe sangue venoso pelas veias cavas $\\rightarrow$ ventrículo direito bombeia sangue aos pulmões pela artéria pulmonar (Pequena Circulação / Pulmonar) $\\rightarrow$ sangue arterial retorna pelas veias pulmonares ao átrio esquerdo $\\rightarrow$ ventrículo esquerdo (com parede miocárdica espessa) bombeia sangue oxigenado para todo o organismo pela artéria aorta (Grande Circulação / Sistêmica).',
            '**Sistema Respiratório e Transporte de Gases**: Hematose nos alvéolos pulmonares por difusão simples. O oxigênio é transportado ligado à hemoglobina ($HbO_2$). A maior parte do gás carbônico ($CO_2$, ~70%) é transportada no plasma na forma dissolvida de ÍON BICARBONATO ($HCO_3^-$), catalisado pela enzima anidrase carbônica nas hemácias ($CO_2 + H_2O \\rightleftharpoons H_2CO_3 \\rightleftharpoons H^+ + HCO_3^-$).',
            '**Controle da Respiração pelo Bulbo**: O aumento de $CO_2$ no sangue acidifica o plasma (queda do pH sanguíneo). Quimiorreceptores no bulbo encefálico e nas artérias carótidas detectam essa acidose e enviam impulsos nervosos para acelerar os movimentos do diafragma e músculos intercostais (hiperventilação).'
          ],
          tips: [
            'A intoxicação por Monóxido de Carbono ($CO$) de motores ou queimadas é perigosa porque o $CO$ liga-se à hemoglobina formando carboxiemoglobina ($HbCO$) com afinidade cerca de 250 vezes superior à do oxigênio, em ligação estável e irreversível que bloqueia o transporte de $O_2$ e leva à asfixia celular.'
          ]
        },
        {
          id: 'sistema-excretor-osmorregulacao',
          title: 'Sistema Excretor Humano, Néfron e Regulação Osmótica (ADH e Aldosterona)',
          enemWeight: 'Alta',
          summary: 'Filtração glomerular, reabsorção tubular de nutrientes e os mecanismos endócrinos de balanço hidroeletrolítico.',
          keyConcepts: [
            '**Estrutura e Funcionamento do Néfron**: 1) Filtração Glomerular (no corpúsculo renal / Cápsula de Bowman: a alta pressão sanguínea empurra água, glicose, aminoácidos, sais e ureia para fora dos capilares do glomérulo, gerando o filtrado glomerular; proteínas e células sanguíneas não são filtradas); 2) Reabsorção Tubular (no túbulo contorcido proximal, 100% da glicose e aminoácidos são reabsorvidos ativamente de volta para o sangue; na alça de Henle e túbulo distal ocorre reabsorção hídrica e iônica); 3) Secreção Tubular (lançamento ativo de substâncias indesejáveis do sangue para a urina).',
            '**Hormônio Antidiurético** (ADH / Vasopressina): Produzido no hipotálamo e liberado pela neuro-hipófise. Quando o indivíduo bebe pouca água ou transpira muito, a osmolalidade plasmática aumenta $\\rightarrow$ o hipotálamo dispara a liberação de ADH $\\rightarrow$ o ADH atua nos ductos coletores renais aumentando a inserção de canais de aquaporina $\\rightarrow$ maior reabsorção de água para o sangue $\\rightarrow$ urina torna-se escassa e hiperconcentrada. O álcool etílico inibe a secreção de ADH, provocando diurese abundante e desidratação (ressaca).',
            '**Aldosterona** (Sistema Renina-Angiotensina-Aldosterona): Produzida pelo córtex da glândula adrenal em resposta a quedas de pressão arterial. Estimula a reabsorção ativa de íons sódio ($Na^+$) nos túbulos renais; o cloreto de sódio atrai água por osmose para a corrente sanguínea, elevando o volume plasmático e restabelecendo a pressão arterial normal.'
          ],
          tips: [
            'Diabetes Insipidus vs. Diabetes Mellitus: A Diabetes Insipidus decorre da deficiência de ADH (urina volumosa e diluída, sem glicosúria). A Diabetes Mellitus decorre da falta ou resistência à Insulina (hiperglicemia com presença de glicose na urina).'
          ]
        },
        {
          id: 'doencas-endemias-parasitoses',
          title: 'Doenças Infecciosas, Parasitoses Brasileiras e Saúde Pública',
          enemWeight: 'Muito Alta',
          summary: 'Ciclos de vida de patógenos, vetores intermediários, saneamento básico e profilaxia no Brasil.',
          keyConcepts: [
            '**Arboviroses Urbanas** (Dengue, Zika, Chikungunya e Febre Amarela Urbana): Doenças virais transmitidas pela picada da fêmea do mosquito vetor *Aedes aegypti*. Profilaxia prioritária: controle vetorial mediante eliminação de focos de água parada.',
            '**Doença de Chagas**: Causada pelo protozoário flagelado *Trypanosoma cruzi*. Transmitida pelas fezes infectadas do percevejo barbeiro (*Triatoma infestans*) que contaminam o orifício da picada quando o indivíduo coça a pele, ou pela ingestão oral de alimentos contaminados com o inseto moído (açaí e caldo de cana in natura sem pasteurização). Profilaxia: substituição de casas de pau-a-pique por alvenaria e uso de telas/mosquiteiros.',
            '**Esquistossomose** (Barriga d\'Água): Causada pelo helminto platelminto *Schistosoma mansoni*. Ciclo: Ovos nas fezes humanas eclodem na água doce originando miracídios $\\rightarrow$ penetram no caramujo *Biomphalaria* (hospedeiro intermediário) $\\rightarrow$ transformam-se em cercárias flageladas $\\rightarrow$ cercárias penetram ativamente pela pele humana intacta ao banhista em "lagoas de coceira". Causa hipertensão portal e hepatoesplenomegalia.',
            '**Teníase vs. Cisticercose**: 1) Teníase (humano como hospedeiro definitivo): ingestão de carne de boi (*Taenia saginata*) ou porco (*Taenia solium*) crua ou mal cozida com cisticercos; o verme adulto fixa-se no intestino delgado; 2) Cisticercose (humano como hospedeiro intermediário acidental): ingestão de água ou alimentos contaminados diretamente com OVOS de *Taenia solium*; os embriões caem na circulação e encistam-se no sistema nervoso central (neurocisticercose), com risco de convulsões graves.'
          ],
          tips: [
            'Profilaxia padrão de ouro para o ENEM: Saneamento básico integral (água encanada tratada e coleta/tratamento universal de esgoto) é a medida preventiva mais eficiente e duradoura para erradicar ascaridíase, ancilostomose (amarelão) e esquistossomose.'
          ]
        },
        {
          id: 'sistema-endocrino-glicemia',
          title: 'Sistema Endócrino Humano: Regulação Glicêmica, Tireoide e Eixo Hipotálamo-Hipófise',
          enemWeight: 'Muito Alta',
          summary: 'A regulação hormonal por retroalimentação negativa (feedback), o controle antagônico da glicemia por insulina e glucagon e as patologias tireoidianas.',
          keyConcepts: [
            '**Pâncreas Endócrino e Homeostase Glicêmica**: As Ilhotas de Langerhans possuem células endócrinas antagônicas que mantêm a glicemia plasmática em torno de 70 a 99 mg/dL: 1) **Células Beta** produzem **Insulina** (hormônio hipoglicemiante secretado em resposta à elevação de glicose pós-refeição; estimula a captação de glicose pelos tecidos muscular e adiposo e induz a glicogênese hepática); 2) **Células Alfa** produzem **Glucagon** (hormônio hiperglicemiante liberado no jejum; estimula a glicogenólise hepática e a gliconeogênese, convertendo glicogênio em glicose livre para o sangue).',
            '**Diabetes Mellitus Tipo 1 versus Tipo 2**: O **Tipo 1** é doença autoimune em que linfócitos atacam e destroem as células beta pancreáticas, gerando deficiência absoluta de insulina (início precoce em crianças/jovens, requer administração diária de insulina exógena); o **Tipo 2** decorre de **resistência periférica à insulina** associada a obesidade, sedentarismo e dieta hipercalórica, onde o pâncreas produz insulina mas os receptores celulares não respondem adequadamente (tratamento com reeducação alimentar, atividade física e hipoglicemiantes orais). Ambos provocam hiperglicemia, glicosúria (glicose na urina), poliúria (micção excessiva por osmose) e polidipsia (sede intensa).',
            '**Eixo Hipotálamo-Hipófise e Retroalimentação Negativa (Feedback)**: O hipotálamo secreta fatores de liberação (TRH, GnRH, CRH) que estimulam a **adeno-hipófise** a liberar hormônios tróficos (TSH, FSH, LH, ACTH). Estes estimulam glândulas-alvo periféricas (tireoide, gônadas, suprarrenais) a secretarem seus hormônios ($T_3/T_4$, estrógeno/testosterona, cortisol). Quando a concentração do hormônio periférico atinge o limiar no sangue, ele atua no hipotálamo e na adeno-hipófise inibindo novas secreções, mantendo o equilíbrio homeostático.',
            '**Tireoide, Iodo e Metabolismo Basal**: A tireoide capta iodo da dieta para sintetizar os hormônios **T3 (tri-iodotironina)** e **T4 (tiroxina)**, que controlam a taxa do metabolismo celular basal e o consumo de oxigênio. A deficiência nutricional de iodo impede a produção de $T_3/T_4$, cessando o feedback negativo; a adeno-hipófise dispara altos níveis de TSH, estimulando continuamente a glândula e provocando a hipertrofia compensatória da tireoide (**Bócio Endêmico** carancial). No Brasil, a adição obrigatória de iodato de potássio ao sal de cozinha é a política pública profilática preventiva mais bem-sucedida contra o bócio.',
            '**Regulação do Cálcio Plasmático (Calcitonina vs. Paratormônio)**: Hormônios com ações rigorosamente antagônicas sobre a calcemia: a **Calcitonina** (produzida pela tireoide) reduz o cálcio do sangue promovendo sua deposição na matriz óssea (estimula osteoblastos); o **Paratormônio / PTH** (produzido pelas glândulas paratireoides) eleva o cálcio no sangue estimulando a reabsorção óssea (osteoclastos), aumentando a reabsorção tubular renal de $Ca^{2+}$ e ativando a Vitamina D.',
            '**Glândulas Suprarrenais (Adrenais)**: Córtex Adrenal secreta **Cortisol** (glicocorticoide imunossupressor, eleva a glicemia em estresse crônico) e **Aldosterona** (mineralocorticoide que reabsorve sódio e água nos rins); Medula Adrenal secreta **Adrenalina (Epinefrina)** e **Noradrenalina**, desencadeando a resposta fisiológica de "luta ou fuga" perante perigo iminente (taquicardia, broncodilatação, midríase e desvio de fluxo sanguíneo para a musculatura esquelética).'
          ],
          tips: [
            'O sal de cozinha no Brasil é obrigatoriamente iodado por lei federal (Lei nº 6.150/1974): no ENEM, essa questão interdisciplinar de saúde pública aborda a garantia de micronutrientes para prevenir o bócio endêmico e o cretinismo congênito infantil nas populações interioranas distantes do litoral.'
          ]
        },
        {
          id: 'sistema-reprodutor-ciclo-menstrual-contracepcao',
          title: 'Sistema Reprodutor Humano, Ciclo Menstrual, Métodos Contraceptivos e ISTs',
          enemWeight: 'Muito Alta',
          summary: 'A dinâmica neuroendócrina do ciclo ovariano e uterino, o mecanismo de ação dos contraceptivos e a prevenção biológica de infecções sexualmente transmissíveis.',
          keyConcepts: [
            '**Gametogênese (Espermatogênese vs. Ovogênese)**: A espermatogênese ocorre nos túbulos seminíferos testiculares a partir da puberdade de forma contínua, gerando 4 espermatozoides funcionais ($n$) a partir de cada espermatócito I ($2n$). A ovogênese inicia-se ainda no período embrionário intrauterino, estacionando na prófase I da meiose até a puberdade; a cada ciclo menstrual, um ovócito I completa a meiose I gerando apenas 1 ovócito II maduro ($n$) e glóbulos polares degenerativos.',
            '**Dinâmica Hormonal do Ciclo Menstrual**: Dividido em três fases: 1) **Fase Folicular / Proliferativa**: a adeno-hipófise secreta **FSH** (hormônio folículo-estimulante), que promove o amadurecimento de um folículo ovariano; o folículo em crescimento secreta **Estrógeno**, que reconstrói e espessa a parede vascularizada interna do útero (endométrio); 2) **Fase Ovulatória**: o pico súbito de estrógeno desencadeia uma descarga maciça de **LH** (hormônio luteinizante) pela adeno-hipófise no 14º dia (em um ciclo padrão de 28 dias), provocando a **Ovulação** (ruptura do folículo e liberação do ovócito II na tuba uterina); 3) **Fase Lútea / Secretora**: o folículo rompido transforma-se no **Corpo Lúteo**, que secreta elevadas concentrações de **Progesterona** e estrógeno para manter o endométrio nutrido e acolhedor; se não houver fecundação, o corpo lúteo atrofia, os níveis de progesterona e estrógeno despencam abruptamente, provocando a descamação do endométrio vascularizado (**Menstruação**).',
            '**Gravidez e a Gonadotrofina Coriônica Humana (hCG)**: Caso ocorra fecundação e nidação na tuba/útero, o trofoblasto embrionário secreta **hCG**, que impede a degeneração do corpo lúteo, mantendo a secreção sustentada de progesterona para não ocorrer menstruação. O hCG é a molécula detectada nos testes laboratoriais e rápidos de urina de gravidez.',
            '**Métodos Contraceptivos e Mecanismos Biológicos**: 1) **Métodos Hormonais (Pílula Combinada, Injetáveis, Implantes)**: contêm doses contínuas de estrógeno e progestagênios sintéticos que, por retroalimentação negativa permanente, inibem a secreção hipofisária de FSH e LH, **impedindo o desenvolvimento folicular e a ovulação**; 2) **Dispositivos Intrauterinos (DIU)**: DIU de cobre (libera íons de cobre espermicidas que imobilizam os espermatozoides e geram reação inflamatória estéril no endométrio) e DIU hormonal (libera levonorgestrel, espessando o muco cervical e atrofiando o endométrio); 3) **Métodos Cirúrgicos Irreversíveis**: **Laqueadura Tubária** (seccionamento das tubas uterinas, impedindo o encontro físico do espermatozoide com o ovócito na tuba, sem afetar os ovários nem interromper a menstruação ou a produção de hormônios femininos) e **Vasectomia** (seccionamento dos ductos deferentes, impedindo a presença de espermatozoides no sêmen ejaculado, sem interferir na testosterona, ereção ou volume líquido produzido pela próstata e vesículas seminais); 4) **Métodos de Barreira**: Preservativo masculino e feminino.',
            '**Infecções Sexualmente Transmissíveis (ISTs)**: O **Preservativo (Camisinha)** é o ÚNICO método contraceptivo que simultaneamente previne a gravidez e confere proteção mecânica contra ISTs: 1) **HPV (Papilomavírus Humano)**: vírus causador de condilomas e principal fator etiológico do câncer de colo do útero (profilaxia: vacinação gratuita no SUS para meninas e meninos de 9 a 14 anos e realização de exame citopatológico Papanicolau); 2) **HIV / AIDS**: retrovírus que infecta linfócitos T CD4+, destruindo a imunidade adaptativa; 3) **Sífilis**: causada pela bactéria espiroqueta *Treponema pallidum*, cursando com cancro duro indolor e podendo evoluir para formas terciárias neurológicas graves ou transmissão vertical congênita transplacentária.'
          ],
          tips: [
            'Pegadinha campeã no ENEM sobre a Vasectomia: O homem vasectomizado CONTINUA ejaculando normalmente! O sêmen ejaculado é composto majoritariamente por secreções da próstata e das glândulas seminais; a cirurgia apenas impede a chegada dos espermatozoides que vinham dos testículos. Também não afeta a taxa de testosterona nem causa impotência.'
          ]
        },
        {
          id: 'sistema-nervoso-sentidos',
          title: 'Sistema Nervoso: Neurônios, Sinapses, Arco Reflexo e Divisão Autônoma',
          enemWeight: 'Alta',
          summary: 'A condução eletroquímica do potencial de ação ao longo da bainha de mielina, o arco reflexo involuntário e o balanço autonômico simpático versus parassimpático.',
          keyConcepts: [
            '**Arquitetura do Neurônio e Bainha de Mielina**: Formado por dendritos receptores, corpo celular (soma) com núcleo e axônio transmissor. Em axônios mielinizados (revestidos por células de Schwann no sistema periférico e oligodendrócitos no central), a bainha lipídica atua como isolante elétrico; a despolarização ocorre unicamente nos estrangulamentos desprovidos de bainha (**Nódulos de Ranvier**), gerando a **Condução Saltatória**, que eleva a velocidade do impulso nervoso de ~2 m/s para mais de 100 m/s.',
            '**Potencial de Repouso e Potencial de Ação**: No repouso ($-70\\text{ mV}$), a membrana plasmática é mantida polarizada pela **Bomba de Sódio e Potássio** ($Na^+/K^+$ ATPase), que mantém alta concentração de $Na^+$ no líquido extracelular e alta de $K^+$ no intracelular. Ao receber um estímulo acima do limiar excitatório: 1) **Despolarização**: canais de sódio voltagem-dependentes abrem-se, permitindo o influxo maciço passivo de íons $Na^+$ (o interior da célula inverte para carga positiva $+30\\text{ mV}$); 2) **Repolarização**: canais de sódio fecham-se e canais de potássio abrem-se, promovendo efluxo rápido de íons $K^+$; 3) **Restauração**: a bomba $Na^+/K^+$ restabelece o gradiente químico basal consumindo ATP.',
            '**Sinapse Química e Neurotransmissores**: A passagem do impulso elétrico entre a terminação axônica e a célula pós-sináptica é mediada por substâncias químicas. O potencial de ação despolariza o botão pré-sináptico $\\rightarrow$ abre canais de cálcio ($Ca^{2+}$) $\\rightarrow$ vesículas sinápticas fundem-se à membrana plasmática liberando neurotransmissores (como **Acetilcolina**, **Dopamina**, **Serotonina**, **GABA**) por exocitose na fenda sináptica $\\rightarrow$ os ligantes acoplam-se a receptores específicos na membrana pós-sináptica gerando novo estímulo.',
            '**Arco Reflexo Medular Involuntário**: Resposta motora de sobrevivência ultrarrápida que ocorre antes de qualquer conscientização pelo córtex cerebral. Circuito medular: 1) Receptor sensorial detecta estímulo nocivo (ex: picada ou queimadura na ponta do dedo); 2) **Neurônio Sensitivo / Aferente** conduz o estímulo até a medula espinhal pelas raízes dorsais; 3) **Interneurônio** na substância cinzenta medular processa a resposta e repassa imediatamente ao **Neurônio Motor / Eferente**; 4) O neurônio eferente envia comando contrátil ao efetuador muscular para retirar a mão do perigo instantaneamente. Só após a retirada do membro é que o impulso ascende ao encéfalo e a dor consciente é percebida.',
            '**Sistema Nervoso Autônomo (SNA): Simpático versus Parassimpático**: Regulam as funções vegetativas involuntárias com ações fisiológicas antagônicas: 1) **SNA Simpático** (mediado por Noradrenalina, origina-se na medula toracolombar): prepara o organismo para situações de estresse, alerta e **"luta ou fuga"** (aumento da frequência cardíaca, broncodilatação pulmonar para maior oxigenação, midríase pupilar, glicogenólise hepática e inibição das funções digestórias); 2) **SNA Parassimpático** (mediado por Acetilcolina, origina-se no tronco encefálico e medula sacral): estimula estados de **"repouso e digestão"** (redução da frequência cardíaca, broncoconstrição, miose pupilar, estímulo ao peristaltismo intestinal e secreção de enzimas digestórias).'
          ],
          tips: [
            'Em questões sobre reflexo patelar ou queimação no ENEM: o Arco Reflexo é medular e INVOLUNTÁRIO. O cérebro só "sabe" da dor milissegundos após o movimento mecânico de proteção já ter sido completado pela medula espinhal.'
          ]
        },
        {
          id: 'embriologia-animal-tecidos',
          title: 'Embriologia Animal: Clivagem, Gastrulação, Folhetos Embrionários e Anexos',
          enemWeight: 'Alta',
          summary: 'As etapas da ontogênese animal, os destinos teciduais da ectoderme, mesoderme e endoderme e os anexos embrionários adaptativos ao ambiente terrestre.',
          keyConcepts: [
            '**Fases do Desenvolvimento Embrionário**: 1) **Segmentação / Clivagem**: sucessivas divisões mitóticas rápidas do zigoto sem aumento no volume total da célula, formando uma esfera maciça de células denominada **Mórula**; a seguir, as células migram para a periferia formando uma esfera oca uniestratificada com cavidade interna cheia de líquido (**Blástula** com blastocele); 2) **Gastrulação**: invaginação celular com formação do arquêntero (intestino primitivo) e diferenciação dos folhetos embrionários; o orifício de entrada é o **Blastóporo**; 3) **Neurulação / Organogênese**: dobramento da ectoderme dorsal induzido pela notocorda formando o tubo neural (precursor do encéfalo e medula espinhal).',
            '**Protostômios versus Deuterostômios**: Critério filogenético basilar da zoologia: nos **Protostômios** (platelmintos, nematódeos, anelídeos, moluscos e artrópodes), o blastóporo dá origem primeiramente à BOCA do animal; nos **Deuterostômios** (exclusivamente **Equinodermos e Cordados**, unindo estrelas-do-mar e vertebrados humanos em um mesmo ramo evolutivo ancestral), o blastóporo dá origem primeiramente ao ÂNUS, surgindo a boca secundariamente.',
            '**Destino dos Três Folhetos Embrionários (Histogênese)**: 1) **Ectoderme**: origina a epiderme e seus anexos queratinizados (pelos, unhas, garras, glândulas sebáceas e sudoríparas), o esmalte dos dentes e TODO o **Sistema Nervoso** (encéfalo, medula, nervos cranianos e retina); 2) **Mesoderme**: origina a derme profunda da pele, sistema esquelético ósseo e cartilaginoso, musculatura (estriada esquelética, lisa e miocárdica), sistema cardiovascular (coração e vasos sanguíneos), sistema urogenital (rins, ureteres, gônadas e ductos); 3) **Endoderme**: origina o epitélio de revestimento interno do trato gastrointestinal, epitélio alveolar do sistema respiratório, além das glândulas associadas à digestão (**Fígado e Pâncreas**) e tireoide.',
            '**Anexos Embrionários em Répteis, Aves e Mamíferos**: Estruturas que permitiram a conquista definitiva do ambiente terrestre independente da água: 1) **Âmnio**: bolsa membranosa repleta de líquido amniótico que envolve o embrião, protegendo-o contra choques mecânicos e contra a dessecação; 2) **Córion**: membrana externa envolvente que atua nas trocas gasosas respiratórias; 3) **Saco Vitelínico**: armazena vitelo nutritivo (muito desenvolvido e hipertrofiado em répteis e aves; atrofiado e vestigial em mamíferos placentários humanos); 4) **Alantoide**: atua no armazenamento de excretas nitrogenadas insolúveis não tóxicas (**ácido úrico**) e na respiração através da casca porosa do ovo; 5) **Placenta e Cordão Umbilical**: em mamíferos eutérios, o córion e o alantoide fundem-se ao endométrio materno formando a placenta, responsável pela nutrição, oxigenação, excreção e produção hormonal gravídica.'
          ],
          tips: [
            'Parentesco evolutivo revelado pela embriologia no ENEM: Os Equinodermos (como a estrela-do-mar e ouriço-do-mar) são evolutivamente muito mais próximos dos Cordados humanos do que de artrópodes ou moluscos, pois compartilham a condição única de serem DEUTEROSTÔMIOS (blastóporo origina o ânus).'
          ]
        }
      ]
    },
    {
      id: 'evolucao-seres-vivos',
      title: 'Evolução Biológica e Diversidade da Vida',
      description: 'Teorias evolutivas clássicas e modernas, seleção natural, especiação e evidências anatômicas da evolução.',
      subtopics: [
        {
          id: 'evolucao-biologica-especies',
          title: 'Evolução Biológica: Teorias, Especiação e Evidências Evolutivas',
          enemWeight: 'Muito Alta',
          summary: 'O confronto entre Lamarckismo e Darwinismo, a síntese do Neodarwinismo, os tipos de seleção natural, a especiação alopátrica e as evidências de homologia e analogia.',
          keyConcepts: [
            '**Lamarckismo versus Darwinismo**: Jean-Baptiste Lamarck propôs a Lei do Uso e Desuso e a Lei da Herança dos Caracteres Adquiridos (o ambiente induziria o organismo a se modificar ativamente para se adaptar, e essa alteração somática passaria aos descendentes). Charles Darwin propôs a **Seleção Natural**: os indivíduos de uma população apresentam variações prévias naturais casuais; o meio ambiente não cria as características, mas atua como um filtro seletivo preservando os mais aptos e eliminando os menos adaptados.',
            '**A Teoria Sintética da Evolução (Neodarwinismo)**: Integra a seleção natural de Darwin às descobertas da Genética e Biologia Molecular. A **variabilidade genética** em uma população é gerada por dois mecanismos primordiais: as **Mutações Gênicas** (única fonte de novos alelos, casuais e espontâneas) e a **Recombinação Gênica** (pela segregação independente e pelo *crossing-over* na meiose). Sobre essa variabilidade pré-existente atuam fatores evolutivos direcionadores (Seleção Natural) e estocásticos (**Deriva Genética** em populações pequenas: Efeito Gargalo e Efeito Fundador).',
            '**Tipos de Seleção Natural**: 1) **Direcional**: favorece um dos fenótipos extremos (ex: resistência a antibióticos em bactérias e melanismo industrial em mariposas); 2) **Estabilizadora**: favorece os fenótipos médios/intermediários, eliminando os extremos (ex: peso médio de recém-nascidos humanos); 3) **Disruptiva / Diversificadora**: favorece simultaneamente ambos os extremos fenotípicos em detrimento da média intermediária.',
            '**Mecanismos de Especiação**: Especiação é a formação de novas espécies biológicas por meio da instalação do **isolamento reprodutivo**: 1) **Especiação Alopátrica** (Geográfica): uma população ancestral é fragmentada por uma barreira física geográfica (rio, cânion, cordilheira) $\\rightarrow$ as populações isoladas acumulam mutações e seleções divergentes $\\rightarrow$ com o tempo, desenvolve-se isolamento reprodutivo (pré-zigótico ou pós-zigótico); 2) **Especiação Simpátrica**: especiação que ocorre sem isolamento geográfico prévio, no mesmo habitat, frequentemente por poliploidia vegetal ou seleção sexual acentuada.',
            '**Evidências da Evolução: Homologia versus Analogia**: **Órgãos Homólogos** possuem a mesma origem embrionária anatômica ancestral, mesmo que desempenhem funções distintas no adulto (ex: braço humano, nadadeira de baleia, asa de morcego e pata de cavalo), sendo evidência irrefutável de **Divergência Evolutiva / Irradiação Adaptativa**. **Órgãos Análogos** desempenham a mesma função fisiológica, mas têm origens embrionárias completamente distintas (ex: asa de ave e asa de inseto; corpo hidrodinâmico de tubarão e golfinho), resultando de **Convergência Evolutiva** sob pressões seletivas ambientais semelhantes.'
          ],
          tips: [
            'Pegadinha predileta do ENEM: Dizer que "as bactérias se adaptaram ao antibiótico tornando-se resistentes" é lamarckista e ERRADO! A formulação darwinista correta é: "o antibiótico atuou como agente seletivo, eliminando as bactérias sensíveis e selecionando aquelas que JÁ POSSUÍAM mutações prévias casuais de resistência".'
          ]
        },
        {
          id: 'origem-vida-teoria-endossimbiotica',
          title: 'Origem da Vida, Evolução Celular e Teoria Endossimbiótica',
          enemWeight: 'Média',
          summary: 'O colapso da abiogênese com Pasteur, a hipótese heterotrófica pré-biótica de Oparin-Haldane/Miller-Urey e a teoria endossimbiótica de Lynn Margulis para mitocôndrias e cloroplastos.',
          keyConcepts: [
            '**Abiogênese versus Biogênese**: A **Abiogênese** (Geração Espontânea) sustentava que seres vivos surgiam da matéria inanimada por força vital. Essa teoria foi derrubada definitivamente pelo experimento clássico de **Louis Pasteur** com o frasco "pescoço de cisne": o caldo nutritivo fervido permaneceu estéril enquanto o pescoço curvado reteve as partículas e bactérias do ar, provando a **Biogênese** (a vida provém exclusivamente de outra vida pré-existente).',
            '**Hipótese Heterotrófica e o Experimento de Miller-Urey**: Aleksandr Oparin e J.B.S. Haldane propuseram que a Terra primitiva possuía atmosfera redutora ($CH_4$, $NH_3$, $H_2$ e vapor de $H_2O$), sem oxigênio livre ($O_2$) e sem camada de ozônio, sujeita a radiação UV intensa e descargas elétricas. Stanley Miller e Harold Urey simularam essas condições em laboratório e sintetizaram **aminoácidos** a partir de gases inorgânicos. A hipótese heterotrófica postula que os primeiros seres vivos eram anaeróbios e fermentadores; com o consumo do alimento pré-biótico, surgiram os organismos autotróficos fotossintetizantes, liberando $O_2$ na atmosfera (a "Grande Catástrofe do Oxigênio") e viabilizando a posterior evolução dos seres aeróbios.',
            '**Teoria Endossimbiótica de Lynn Margulis**: Explica a origem das organelas bioenergéticas eucarióticas (**Mitocôndrias e Cloroplastos**). Bactérias aeróbias ancestrais e cianobactérias fotossintetizantes foram fagocitadas por células protoeucarióticas maiores, estabelecendo uma simbiose mutualística permanente e hereditária.',
            '**Evidências Moleculares Irrefutáveis da Endossimbiose**: 1) **Dupla Membrana Lipídica** (a membrana interna possui composição bioquímica similar à de bactérias, e a externa deriva da vesícula de endocitose da célula hospedeira); 2) **DNA Próprio Circular** desprovido de histonas, exatamente como nos procariontes; 3) **Ribossomos Próprios do Tipo 70S** (menores do que os ribossomos 80S do citosol eucariótico); 4) **Autoduplicação Independente** por fissão binária, comandada pelo seu próprio material genético.'
          ],
          tips: [
            'Herança exclusivamente materna das mitocôndrias: No ser humano, o óvulo fornece praticamente todo o citoplasma e todas as organelas do zigoto. O espermatozoide introduz apenas seu núcleo haploide (suas mitocôndrias ficam na peça intermediária e são degradadas). Portanto, todas as suas mitocôndrias e o DNA mitocondrial foram herdados da sua mãe!'
          ]
        },
        {
          id: 'zoologia-vertebrados-artropodes',
          title: 'Zoologia Comparada: Artrópodes e Vertebrados na Transição Terrestre',
          enemWeight: 'Alta',
          summary: 'O sucesso adaptativo e ecológica dos Artrópodes e a conquista anatômica e fisiológica definitiva do ambiente terrestre pelos Vertebrados.',
          keyConcepts: [
            '**O Sucesso Evolutivo dos Artrópodes**: O filo mais numeroso do planeta Terra, caracterizado por: 1) **Exoesqueleto de Quitina** (polissacarídeo nitrogenado impermeável que evita a dessecação e fornece sustentação mecânica, exigindo o processo de **Ecdise ou Muda** mediado pelo hormônio ecdisona para permitir o crescimento corporal); 2) **Apêndices Articulados** com especialização funcional (antenas, quelíceras, patas e mandíbulas); 3) **Respiração Traqueal** nos insetos (tubos ramificados levam $O_2$ diretamente aos tecidos, tornando a circulação aberta/lacunar independente do transporte gasoso de hemoglobina); 4) **Excreção de Ácido Úrico** através de Túbulos de Malpighi (composto insolúvel atóxico que permite retenção hídrica máxima).',
            '**Metamorfose em Insetos e Importância Ecológico-Sanitária**: Dividem-se em **Ametábolos** (desenvolvimento direto, sem metamorfose, ex: traça), **Hemimetábolos** (metamorfose incompleta: ovo $\\rightarrow$ ninfa $\\rightarrow$ adulto, ex: baratas e percevejos como o barbeiro *Triatoma infestans*) e **Holometábolos** (metamorfose completa: ovo $\\rightarrow$ larva $\\rightarrow$ pupa/casulo $\\rightarrow$ adulto, ex: borboletas, moscas e mosquitos como o *Aedes aegypti*). Insetos holometábolos evitam a competição intraespecífica por alimento, já que larvas e adultos possuem nichos ecológicos distintos.',
            '**A Conquista do Meio Terrestre pelos Vertebrados**: 1) **Peixes**: amoniotélicos (excretam amônia muito tóxica e solúvel em água), circulação simples e completa (coração com 2 cavidades: 1 átrio e 1 ventrículo); 2) **Anfíbios**: conquistaram parcialmente a terra, mas permanecem estritamente dependentes de água para fecundação externa, desenvolvimento larval aquático com girinos e respiração cutânea complementar (pele fina, úmida e ricamente vascularizada), excretando ureia no adulto; 3) **Répteis**: **Conquista Definitiva da Terra** graças ao surgimento do **Ovo Amniótico com Casca Calcária Porosa**, pele recoberta por espessa camada de escamas córneas ricas em **queratina** (impermeável à perda d\'água), respiração exclusivamente pulmonar e excreção de **ácido úrico**.',
            '**Aves e Mamíferos: Endotermia e Metabolismo Acelerado**: Ambos adquiriram de forma convergente a **Endotermia / Homeotermia** (capacidade de manter a temperatura corpórea interna constante através da regulação metabólica e de isolamento térmico por penas ou pelos e panículo adiposo). Nas aves, destacam-se os **ossos pneumáticos** e os **sacos aéreos** (que diminuem a densidade e realizam ventilação pulmonar contínua para o voo batido). Em mamíferos, destacam-se a presença de **glândulas mamárias**, **pelos**, o músculo **diafragma** para ventilação torácica e a formação da **placenta** nos eutérios.',
            '**Ectotermia versus Endotermia no ENEM**: **Animais Ectotérmicos (Pecilotérmicos)** — anfíbios e répteis — dependem de fontes externas de calor (como banhar-se ao sol) para regular sua temperatura corporal; sua taxa metabólica varia diretamente com a temperatura ambiente. **Animais Endotérmicos (Homeotérmicos)** — aves e mamíferos — consomem muito mais alimento calórico para gerar calor interno contínuo por respiração celular, mantendo sua temperatura e atividade enzimática ótimas independentemente das variações térmicas ambientais.'
          ],
          tips: [
            'Relação entre excreção e evolução no ENEM: Animais de ambiente estritamente aquático excretam **amônia** (alta toxicidade, exige diluição abundante em água). Mamíferos e anfíbios adultos excretam **ureia** (toxicidade intermediária, gasta pouca água). Répteis, aves e insetos excretam **ácido úrico** (praticamente insolúvel, atóxico, eliminado na forma de pasta semi-sólida com retenção hídrica máxima, permitindo o desenvolvimento do embrião confinado dentro do ovo com casca sem intoxicação por amônia).'
          ]
        }
      ]
    }
  ]
};
