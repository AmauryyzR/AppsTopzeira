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
            'Fluxo Unidirecional de Energia: A cada nível trófico consecutivo (produtor $\\rightarrow$ consumidor primário $\\rightarrow$ secundário), cerca de 90% da energia é dissipada na forma de calor metabólico (segunda lei da termodinâmica); apenas ~10% converte-se em biomassa para o nível seguinte.',
            'Pirâmides Ecológicas: As pirâmides de energia são SEMPRE diretas (nunca invertidas). As de número e de biomassa podem se inverter (ex.: uma grande árvore sustentando milhares de pulgões; ou fitoplâncton marinho com biomassa instantânea menor que a do zooplâncton, devido à altíssima taxa reprodutiva do fitoplâncton).',
            'Biomagnificação Trófica (Bioacumulação): Metais pesados (mercúrio $Hg$, chumbo $Pb$) e pesticidas clorados organopersistentes (DDT) não são metabolizados nem excretados pelos organismos. Por serem lipossolúveis, acumulam-se em concentrações progressivamente maiores em cada nível trófico, atingindo a dose máxima letal nos carnívoros de topo (como aves de rapina e seres humanos).',
            'Espécies-Chave (*Keystone Species*): Organismos que desempenham papel regulador desproporcional à sua biomassa na manutenção da biodiversidade local (ex.: lontras marinhas controlando ouriços que devorariam as florestas de kelp).'
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
            'Ciclo do Nitrogênio: 1) Fixação Biológica ($N_2 \\rightarrow NH_3$ ou $NH_4^+$ por bactérias como *Rhizobium* em nódulos de leguminosas e cianobactérias); 2) Nitrosação ($2NH_3 + 3O_2 \\rightarrow 2NO_2^- + 2H^+ + 2H_2O$ por *Nitrosomonas*); 3) Nitratação ($2NO_2^- + O_2 \\rightarrow 2NO_3^-$ por *Nitrobacter*); 4) Desnitrificação ($NO_3^- \\rightarrow N_2$ por bactérias anaeróbias *Pseudomonas denitrificans*, devolvendo o gás à atmosfera).',
            'Ciclo do Carbono: Balanço entre fotossíntese (sequestro de $CO_2$ atmosférico em compostos orgânicos) e respiração celular/queima de combustíveis fósseis (liberação de $CO_2$). O excesso de emissão antropogênica acarreta acidificação oceânica ($CO_2 + H_2O \\rightleftharpoons H_2CO_3 \\rightleftharpoons H^+ + HCO_3^-$), dissolvendo as conchas de carbonato de cálcio ($CaCO_3$) de moluscos e corais.',
            'Eutrofização Artificial: Despejo de efluentes ricos em fósforo e nitrogênio (esgoto não tratado ou fertilizantes NPK) $\\rightarrow$ Proliferação desordenada de microalgas superficiais (*bloom*) $\\rightarrow$ Formação de uma película verde que bloqueia a passagem da luz solar $\\rightarrow$ Morte da vegetação subaquática $\\rightarrow$ Explosão populacional de bactérias decompositoras aeróbias $\\rightarrow$ Esgotamento do oxigênio dissolvido ($OD \\rightarrow 0$) $\\rightarrow$ Morte de peixes por asfixia e proliferação de bactérias anaeróbias com liberação de gases sulfídricos fétidos ($H_2S$).'
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
            'Cerrado (Savana Brasileira): Clima tropical típico com duas estações bem marcadas (inverno seco e verão chuvoso). Solos latossolos antigos, profundos, ácidos, ricos em alumínio tóxico e pobres em nutrientes essenciais. Vegetação com casca corticosa espessa (isolante térmico contra o fogo), gemas apicais protegidas, folhas coriáceas e raízes pivotantes profundas que acessam o lençol freático a dezenas de metros.',
            'Caatinga: Único bioma restrito ao território brasileiro. Clima semiárido com chuvas escassas e irregulares. Vegetação xerófila adaptada ao estresse hídrico: folhas reduzidas ou modificadas em espinhos (para diminuir a transpiração cuticular), caules fotossintetizantes verdes (cladódios), tecidos suculentos (parênquima aquífero) para armazenamento hídrico (mandacaru, xique-xique), cutícula cerosa grossa e raízes superficiais extensas para absorver chuvas rápidas.',
            'Floresta Amazônica e Mata Atlântica: Florestas ombrófilas densas tropicais com estratificação vertical (sub-bosque, dossel e árvores emergentes). Elevada precipitação pluvial e umidade do ar. O solo amazônico é naturalmente arenoso e pobre em nutrientes minerais, sustentando-se exclusivamente pela rápida reciclagem promovida pela serrapilheira (folhas e matéria orgânica em decomposição acelerada).',
            'Pantanal: Maior planície inundável do planeta. Dinâmica hidrológica anual com pulsos de cheia e vazante, abrigando mosaico fisionômico com elementos da Amazônia, Cerrado e Chaco.',
            'Pampas (Campos Sulinos): Predomínio de gramíneas herbáceas em relevo de coxilhas suaves, adaptadas a baixas temperaturas e geadas no inverno.'
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
            'Relações Intraespecíficas: Sociedades (divisão de trabalho cooperativa sem união física, ex.: abelhas, formigas) e Colônias (união anatômica com benefício mútuo, ex.: corais, caravela-portuguesa). Canibalismo e Competição intraespecífica são desarmônicas.',
            'Relações Interespecíficas Harmônicas: Mutualismo (+/+, associação obrigatória vital para a sobrevivência, ex.: líquens, micorrizas, bactérias no rúmen de bovinos); Protocooperação (+/+, cooperação facultativa não obrigatória, ex.: pássaro-palito e crocodilo); Comensalismo (+/0, obtenção de restos alimentares sem prejuízo, ex.: rêmora e tubarão); Inquilinismo/Epifitismo (+/0, uso como suporte físico, ex.: orquídeas e bromélias sobre galhos de árvores).',
            'Relações Interespecíficas Desarmônicas: Predatismo (+/-); Parasitismo (+/-); Amensalismo/Antibiose (-/0, secreção de substâncias que inibem o crescimento de outros seres, ex.: fungo *Penicillium* produzindo antibiótico, maré vermelha por dinoflagelados); Competição interespecífica (-/-, Princípio de Gause ou da Exclusão Competitiva: duas espécies que compartilham o mesmo nicho ecológico não coexistem indefinidamente).',
            'Sucessão Ecológica Primária vs. Secundária: Primária inicia-se em substratos estéreis onde nunca houve vida antes (rocha nua, lava vulcânica recém-resfriada) com espécies pioneiras (líquens, musgos); Secundária ocorre em áreas previamente habitadas que sofreram perturbação (área desmatada, queimada recente). Ao longo da sucessão: aumenta a biomassa total, a complexidade das teias tróficas e a biodiversidade; a produtividade primária líquida ($PPL = PPB - R$) diminui até atingir o clímax ($PPL \\approx 0$).'
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
          enemWeight: 'Muito Alta',
          summary: 'A filogenia vegetal e as novidades evolutivas (sinapomorfias) que permitiram a conquista gradual e definitiva do ambiente terrestre.',
          keyConcepts: [
            'Briófitas (Musgos e Hepáticas): Avasculares / Não-traqueófitas (ausência de xilema e floema; o transporte de seiva ocorre de célula a célula por difusão lenta, restringindo o porte a poucos centímetros); Fase gametofítica haploide ($n$) é a dominante e fotossintetizante duradoura; o esporófito diploide ($2n$) é efêmero e nutricionalmente dependente do gametófito; necessitam obrigatoriamente de lâmina de água para que os anterozoides flagelados nadem até a oosfera.',
            'Pteridófitas (Samambaias e Avencas): Primeiras plantas vasculares (traqueófitas com xilema e floema com lignina), permitindo aumento expressivo de porte mecânico; Fase esporofítica ($2n$) passa a ser dominante e duradoura; gametófito ($n$, protalo) é reduzido e efêmero; ainda dependem de água líquida para fecundação; ausência de sementes (reprodução por esporos formados nos soros).',
            'Gimnospermas (Pinheiro-do-Paraná / *Araucaria*, Coníferas): Primeiras espermatófitas (possuem sementes, porém "nuas", desprovidas de fruto protetor ao redor); libertaram-se definitivamente da dependência de água para fecundação pela invenção do grão de pólen anemófilo (sifonogamia via tubo polínico até o óvulo); possuem estróbilos (pinhas) como estruturas reprodutivas.',
            'Angiospermas (Antófitas / Magnoliófitas): Grupo vegetal mais bem-sucedido e biodiverso do planeta. Invenções chave: FLORES verdadeiras com verticilos atrativos para polinização biológica (zoofilia por abelhas, aves, morcegos); FRUTO que protege a semente e atua na dispersão zoocórica; Dupla Fecundação originando o embrião diploide ($2n$) e o endosperma secundário triploide ($3n$). Divididas em Monocotiledôneas (1 cotilédone, raiz fasciculada/cabeleira, folhas com nervuras paralelas/paralelinérveas, flores trímeras) e Eudicotiledôneas (2 cotilédones, raiz pivotante/axial, folhas com nervuras reticuladas/peninérveas, flores tetrâmeras ou pentâmeras).'
          ],
          tips: [
            'Quadro comparativo essencial para o ENEM: Independência da água líquida para fecundação surgiu nas GIMNOSPERMAS com o grão de pólen e tubo polínico. O FRUTO surgiu apenas nas ANGIOSPERMAS como desenvolvimento das paredes do ovário da flor após a fecundação.'
          ]
        },
        {
          id: 'histologia-morfologia-vegetal',
          title: 'Histologia e Anatomia Vegetal: Meristemas e Tecidos Adultos',
          enemWeight: 'Muito Alta',
          summary: 'Organização celular dos tecidos vegetais de crescimento, revestimento, sustentação mecânica, preenchimento metabólico e condução vascular.',
          keyConcepts: [
            'Meristemas (Tecidos de Crescimento): Células indiferenciadas totipotentes com intensa atividade mitótica, paredes celulares finas e vacúolos diminutos. Meristemas Primários (apicais do caule e da raiz: protoderme, meristema fundamental e procâmbio) promovem crescimento em comprimento/altura. Meristemas Secundários (câmbio vascular e felogênio) promovem o crescimento secundário em espessura (tronco lenhoso).',
            'Tecidos de Revestimento: Epiderme (tecido vivo uniestratificado, revestido externamente pela cutícula lipídica impermeabilizante de cutina; contém estômatos, tricomas/pelos e acúleos) e Periderme (tecido protetor secundário das cascas lenhosas, formado pelo felogênio que produz o súber/cortiça rico em suberina morta para o exterior e feloderme viva para o interior).',
            'Tecidos de Sustentação: Colênquima (formado por células VIVAS com espessamentos desiguais de celulose nos cantos das paredes celulares; confere flexibilidade a órgãos jovens como caules verdes e pecíolos) vs. Esclerênquima (formado por células MORTAS revestidas por densa deposição de LIGNINA, conferindo rigidez extrema contra tensões mecânicas; compreende fibras esclerenquimáticas e esclereídes).',
            'Tecidos de Preenchimento (Parênquimas): Células vivas com grande vacúolo. Parênquima Clorofiliano (paliçádico e lacunoso nas folhas, centro ativo da fotossíntese); Parênquima Aquífero (reserva hídrica em cactáceas); Parênquima Aerífero / Aerênquima (câmaras de ar que propiciam flutuação e respiração em plantas aquáticas como vitória-régia); Parênquima Amiláceo (reserva de amido em tubérculos como batata e mandioca).',
            'Tecidos Condutores: Xilema / Lenho (células mortas lignificadas chamadas elementos de vaso e traqueídes; conduz a seiva bruta/inorgânica de água e sais minerais no sentido estritamente ascendente raiz $\\rightarrow$ folhas) vs. Floema / Líber (células vivas anucleadas chamadas elementos de tubo crivado associadas a células companheiras; conduz a seiva elaborada/orgânica de sacarose em fluxo bidirecional fonte $\\rightarrow$ dreno).'
          ],
          tips: [
            'Cuidado com a confusão entre Acúleo e Espinho: O espinho (presente nos cactos e laranjeiras) é uma modificação foliar ou caulinar profunda vascularizada conectada ao xilema e floema; o acúleo (presente na roseira) é uma simples projeção epidérmica externa não vascularizada, facilmente destacável.'
          ]
        },
        {
          id: 'transpiracao-mecanismo-estomatico',
          title: 'Mecanismo de Abertura e Fechamento dos Estômatos e Transpiração',
          enemWeight: 'Muito Alta',
          summary: 'A regulação biofísica das trocas gasosas foliares mediada pelo turgor das células-guarda, gradientes iônicos de potássio e o hormônio do estresse ácido abscísico (ABA).',
          keyConcepts: [
            'Estrutura do Estômato: Formado por duas células-guarda ou estomáticas reniformes que delimitam um poro central denominado ostíolo, cercadas por células subsidiárias. As células-guarda possuem paredes assimétricas (mais espessas e rígidas voltadas para o poro e mais delgadas voltadas para fora) e são as únicas células epidérmicas dotadas de cloroplastos funcionais.',
            'Mecanismo de Abertura (Células Túrgidas): Na presença de luz e baixa concentração interna de $CO_2$, bombas de prótons na membrana plasmática expulsam íons $H^+$, gerando gradiente eletroquímico que promove influxo maciço de íons potássio ($K^+$) e cloreto ($Cl^-$) para dentro das células-guarda $\\rightarrow$ o meio interno das células-guarda torna-se hipertônico $\\rightarrow$ água entra por osmose $\\rightarrow$ com o aumento da pressão de turgor, a parede delgada externa distende-se mais que a interna rígida, curvando as células e ABRINDO o ostíolo.',
            'Mecanismo de Fechamento (Células Flácidas / Murchas): No escuro, em altas concentrações de $CO_2$ ou sob estresse hídrico agudo (seca no solo), as raízes sintetizam Ácido Abscísico (ABA) que é transportado pelo xilema até as folhas $\\rightarrow$ o ABA promove efluxo rápido de íons $K^+$ para fora das células-guarda $\\rightarrow$ o interior torna-se hipotônico $\\rightarrow$ água sai por osmose $\\rightarrow$ as células-guarda perdem turgidez e murcham, FECHANDO o ostíolo para conter a desidratação.',
            'Transpiração Estomática vs. Cuticular: A transpiração cuticular é contínua e passiva (ocorre pela superfície cerosa da folha, respondendo por ~5 a 10% da perda de água); a estomática é ativamente regulada pela planta e responde por ~90 a 95% do vapor d\'água liberado.',
            'Gutação / Sudação: Perda de água líquida pelas bordas das folhas através de estruturas especiais chamadas hidatódios. Ocorre tipicamente durante noites com solo muito úmido e ar saturado de umidade (100% de umidade relativa), onde a pressão positiva da raiz empurra a seiva bruta sem que haja transpiração foliar.'
          ],
          tips: [
            'Dilema do estômato: O vegetal necessita abrir os estômatos para absorver $CO_2$ indispensável para a fotossíntese (Ciclo de Calvin), mas perde água por evaporação no processo. Se o solo secar, o fechamento estomático salva a planta da dessecação, mas paralisa o influxo de $CO_2$ e reduz a taxa fotossintética.'
          ]
        },
        {
          id: 'conducao-seivas-teorias',
          title: 'Condução de Seivas: Teoria de Dixon (Xilema) e Hipótese de Münch (Floema)',
          enemWeight: 'Muito Alta',
          summary: 'A física do transporte hidrostático a longas distâncias contra a gravidade em árvores gigantes e a distribuição de fotoassimilados.',
          keyConcepts: [
            'Teoria da Coesão-Tensão-Transpiração de Dixon (Xilema): Explica como árvores como sequoias de mais de 100 metros elevam água da raiz às folhas sem bombas mecânicas: 1) A transpiração nas folhas evapora água pelas câmaras subestomáticas, criando uma enorme pressão hidrostática negativa (sucção/tensão); 2) Devido às pontes de hidrogênio entre as moléculas de água (Coesão) e à interação com as paredes de celulose do vaso condutor (Adesão), forma-se uma coluna líquida contínua e ininterrupta que puxa a água desde as raízes.',
            'Hipótese do Fluxo em Massa por Pressão de Münch (Floema): 1) Nas folhas (fontes fotossintéticas), células do parênquima transferem ativamente sacarose para os tubos crivados do floema; 2) O aumento na concentração osmótica do floema atrai água do xilema vizinho por osmose, gerando alta pressão de turgor; 3) Nos órgãos de consumo ou reserva (raízes, frutos, gemas em crescimento - drenos), a sacarose é descarregada ativamente para ser consumida ou convertida em amido; 4) A água sai por osmose do floema de volta para o xilema; 5) A diferença de pressão hidrostática entre fonte (alta pressão) e dreno (baixa pressão) impulsiona o fluxo em massa da seiva elaborada.',
            'Experimento do Anel de Malpighi: A remoção de um anel completo de casca na base do tronco (que contém periderme, parênquima cortical e floema, mas preserva o xilema interno) interrompe o fluxo de seiva elaborada para as raízes. As raízes morrem por inanição energética (falta de glicose/sacarose), matando a planta após algumas semanas.'
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
          enemWeight: 'Muito Alta',
          summary: 'A sinalização bioquímica hormonal por auxinas, giberelinas, citocininas, etileno e ácido abscísico e o controle de tropismos.',
          keyConcepts: [
            'Auxinas (AIA - Ácido Indolilacético): Promove o alongamento e expansão celular. Responsável pela Dominância Apical (o meristema apical produz auxina em alta concentração que inibe o brotamento das gemas laterais; podar a gema apical retira a fonte inibidora e estimula a ramificação frondosa da copa). Estimula o enraizamento de estacas e o desenvolvimento do ovário em fruto (partenocarpia).',
            'Citocininas: Produzidas principalmente nas raízes e transportadas pelo xilema. Promovem divisão celular ativa (mitose), quebra da dominância apical e retardo do envelhecimento foliar (senescência). O balanço entre citocinina e auxina define a organogênese celular.',
            'Giberelinas: Produzidas em sementes e meristemas jovens. Promovem o alongamento extraordinário do caule, quebra da dormência de sementes e germinação (estimulam a síntese da enzima alfa-amilase que digere o amido do endosperma em glicose), e desenvolvimento de frutos sem sementes.',
            'Etileno: Único hormônio vegetal GASOSO ($C_2H_4$). Responsável direto pelo amadurecimento acelerado dos frutos climatéricos (conversão de amido em açúcares simples, degradação da clorofila e amolecimento da casca por digestão da parede celular) e pela abscisão (queda) de folhas senescentes e frutos maduros.',
            'Ácido Abscísico (ABA): O "hormônio do estresse e da sobrevivência". Inibe o crescimento, induz e mantém a dormência de sementes e gemas durante o inverno, e comanda o fechamento estomático imediato sob déficit hídrico.',
            'Tropismos (Movimentos Orientados com Direção de Crescimento): Fototropismo (o caule cresce curvando-se em direção à luz: a auxina degrada-se ou migra para o lado escuro, fazendo as células do lado sombreado alongarem-se mais que as do lado iluminado) e Gravitropismo/Geotropismo (o caule apresenta gravitropismo negativo - cresce para cima; a raiz apresenta gravitropismo positivo - cresce para baixo, pois na raiz altas concentrações de auxina inibem o alongamento celular).',
            'Nastismos (Movimentos Não-Orientados Independentes da Direção do Estímulo): Movimentos rápidos decorrentes de perda abrupta de turgor osmótico nas células do pulvino. Clássico na folha da dormideira (*Mimosa pudica*) ao ser tocada (sismonastia) e na abertura/fechamento das flores pelo calor ou luminosidade.'
          ],
          tips: [
            'Para amadurecer bananas ou abacates mais rapidamente em casa, costuma-se embrulhá-los em papel jornal ou colocá-los dentro de um saco plástico fechado com uma maçã madura: isso retém o gás etileno concentrado ao redor das frutas, acelerando as reações de maturação.'
          ]
        },
        {
          id: 'fotoperiodismo-fitocromos',
          title: 'Fotoperiodismo e Fitocromo na Floração e Germinação',
          enemWeight: 'Alta',
          summary: 'A percepção da duração do dia e da noite mediada pelo pigmento proteico fitocromo e o controle da floração.',
          keyConcepts: [
            'Fitocromo: Pigmento fotorreceptor proteico existente em duas formas interconversíveis: 1) $F_v$ (Fitocromo Inativo / Vermelho): absorve luz vermelha curta (comprimento de onda ~660 nm) e converte-se rapidamente na forma $F_{ve}$; 2) $F_{ve}$ (Fitocromo Ativo / Vermelho Extremo): absorve luz vermelha longa (~730 nm) e converte-se na forma $F_v$. No escuro da noite, a forma ativa $F_{ve}$ reverte espontaneamente e lentamente para a forma inativa $F_v$.',
            'Plantas de Dia Curto (PDC): Florescem no outono/inverno, quando o fotoperíodo é curto. Na verdade, são plantas de NOITE LONGA: exigem um período de escuridão contínua igual ou SUPERIOR a um valor crítico para florescerem. Se a noite contínua for interrompida por um breve flash de luz vermelha curta, a floração é completamente abortada!',
            'Plantas de Dia Longo (PDL): Florescem na primavera/verão. Exigem um período de escuridão contínua INFERIOR ao período crítico (noites curtas). Se a noite longa for interrompida por um flash de luz, elas são induzidas a florescer.',
            'Plantas Indiferentes / Neutras: Florescem ao atingir maturidade fisiológica independentemente do fotoperíodo (ex.: tomate, milho, feijão).',
            'Sementes Fotoblásticas Positivas: Sementes que necessitam da presença de luz (forma ativa $F_{ve}$) para deflagrarem a germinação (como sementes pequenas de alface e plantas invasoras expostas à luz após o revolvimento do solo pelo arado).'
          ],
          tips: [
            'Atenção ao termo: O que controla rigorosamente a floração NÃO é o tempo de exposição à luz do dia, mas sim a DURAÇÃO CONTÍNUA DA NOITE ESCURA (nictoperíodo). Um pulso de luz no meio da noite reseta o relógio biológico da planta convertendo $F_v$ em $F_{ve}$.'
          ]
        },
        {
          id: 'reproducao-angiospermas-frutos',
          title: 'Morfologia Floral, Dupla Fecundação e Origem dos Frutos',
          enemWeight: 'Alta',
          summary: 'A estrutura dos verticilos florais, a fecundação dupla exclusiva com endosperma triploide e a distinção botânica de frutos e pseudofrutos.',
          keyConcepts: [
            'Verticilos Florais: Cálice (conjunto de sépalas estéreis verdes), Corola (conjunto de pétalas coloridas), Androceu (órgão reprodutor masculino formado por estames com antera e filete) e Gineceu / Pistilo (órgão feminino formado por carpelos com estigma receptivo, estilete e ovário contendo óvulos).',
            'Dupla Fecundação das Angiospermas: O grão de pólen germina no estigma emitindo o tubo polínico com dois núcleos espermáticos ($n$). O primeiro núcleo espermático fecunda a Oosfera ($n$), formando o ZIGOTO diploide ($2n$) que originará o embrião da semente. O segundo núcleo espermático funde-se com os DOIS Núcleos Polares ($n + n$) do saco embrionário, gerando o Tecido Nutritivo ENDOSPERMA SECUNDÁRIO TRIPLOIDE ($3n$).',
            'Destino das Estruturas Pós-Fecundação: O óvulo fecundado e desenvolvido transforma-se na SEMENTE; a parede hipertrofiada do ovário transforma-se no FRUTO (pericarpo: epicarpo, mesocarpo e endocarpo).',
            'Pseudofrutos: Estruturas comestíveis onde a parte suculenta doce NÃO se desenvolveu a partir do ovário: 1) Maçã e Pera (desenvolvimento do receptáculo floral); 2) Caju (desenvolvimento do pedúnculo floral hipertrofiado; a castanha é o fruto verdadeiro!); 3) Morango (receptáculo floral carnoso hipertrofiado com pequenos pontinhos pretos que são os frutos verdadeiros do tipo aquênio).'
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
      description: 'Metabolismo bioenergético, dogma central da biologia, herança mendeliana e biotecnologia.',
      subtopics: [
        {
          id: 'bioenergetica-celular',
          title: 'Bioenergética Celular: Fotossíntese, Respiração e Fermentação',
          enemWeight: 'Muito Alta',
          summary: 'Mecanismos de transdução de energia celular: síntese de ATP por gradiente quimiosmótico mitocondrial e fotofosforilação nos cloroplastos.',
          keyConcepts: [
            'Fotossíntese - Fase Fotoquímica / Clara: Ocorre nas membranas dos tilacoides dos cloroplastos. A luz excita a clorofila nos fotossistemas II e I $\\rightarrow$ ocorre a fotólise da água ($2H_2O \\rightarrow O_2 + 4H^+ + 4e^-$), liberando gás oxigênio livre para a atmosfera $\\rightarrow$ o fluxo de elétrons na cadeia de citocromos bombeia prótons gerando ATP e reduz $NADP^+$ a $NADPH$.',
            'Fotossíntese - Fase Química / Ciclo de Calvin: Ocorre no estroma. A enzima RuBisCO fixa moléculas de $CO_2$ atmosférico à ribulose 1,5-bisfosfato (RuBP), consumindo o ATP e o NADPH produzidos na fase clara para gerar trioses fosfatadas que formarão glicose e amido.',
            'Respiração Celular Aeróbia: Três etapas: 1) Glicólise (ocorre no citosol/hialoplasma, processo anaeróbio de quebra da glicose em 2 piruvatos, rendendo 2 ATP e 2 NADH); 2) Ciclo de Krebs (na matriz mitocondrial, descarboxilação com liberação de $CO_2$, produção de NADH, $FADH_2$ e ATP); 3) Cadeia Respiratória / Fosforilação Oxidativa (nas cristas mitocondriais, fluxo de elétrons impulsiona a ATP sintase por gradiente protônico quimiosmótico; o $O_2$ age como aceptor final de elétrons e prótons, formando água). Rendimento total de ~30 a 32 ATP.',
            'Fermentação: Quebra parcial da glicose no citosol na ausência de $O_2$, com rendimento de apenas 2 ATP (provenientes da glicólise). Fermentação Lática (produz ácido lático sem liberação de gás, realizada por lactobacilos e fibras musculares esqueléticas sob esforço anaeróbio intenso); Fermentação Alcoólica (produz etanol e libera gás carbônico $CO_2$, realizada por leveduras *Saccharomyces cerevisiae* na panificação e produção de cerveja/etanol combustível).'
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
            'Replicação Semiconservativa: Cada uma das duas fitas da dupla hélice de DNA serve de molde para uma fita-filha complementar, processo catalisado pela DNA polimerase no sentido $5\' \\rightarrow 3\'$.',
            'Transcrição: Síntese de RNAm precursor a partir de uma fita-molde de DNA nuclear pela RNA polimerase. Em eucariotos, ocorre o processamento (*splicing*): remoção dos íntrons (segmentos não codificantes) e união dos éxons (segmentos codificantes). O *splicing* alternativo permite que um único gene codifique múltiplas proteínas distintas.',
            'Código Genético Universal e Degenerado: 64 códons de trincas de bases para 20 aminoácidos. É "degenerado/redundante" porque diferentes códons sinônimos podem especificar o mesmo aminoácido (ex.: UUU e UUC codificam fenilalanina), o que protege o organismo de mutações silenciosas.',
            'Tradução nos Ribossomos: O códon de iniciação AUG (metionina) posiciona o complexo ribossomal; os RNAt trazem aminoácidos correspondentes aos anticódons complementares; a síntese estende-se até um códon de parada (UAA, UAG, UGA).'
          ],
          tips: [
            'Diferença básica de pareamento: No DNA, Adenina pareia com Timina ($A-T$) e Citosina com Guanina ($C-G$). No RNA, a Timina é substituída por Uracila ($A-U$).'
          ]
        },
        {
          id: 'divisao-celular-genetica-populacoes',
          title: 'Mitose, Meiose, Aneuploidias e Teorema de Hardy-Weinberg',
          enemWeight: 'Alta',
          summary: 'Os mecanismos citológicos de reprodução celular, a geração de variabilidade genética e a frequência alélica populacional.',
          keyConcepts: [
            'Mitose: Divisão equacional ($2n \\rightarrow 2n$) para crescimento somático e regeneração tecidual. Fases: Prófase, Metáfase (cromossomos em condensação máxima na placa equatorial), Anáfase (separação das cromátides-irmãs) e Telófase.',
            'Meiose: Divisão reducional ($2n \\rightarrow n$) para formação de gametas e esporos. Geração de variabilidade por: 1) *Crossing-over* ou permutação meiótica na prófase I (paquíteno); 2) Segregação independente dos cromossomos homólogos na anáfase I.',
            'Não-Disjunções Cromossômicas: Falha na separação dos homólogos (anáfase I) ou das cromátides (anáfase II) gerando gametas com aneuploidias: Síndrome de Down (Trissomia do cromossomo 21), Síndrome de Turner ($45,X0$) e Síndrome de Klinefelter ($47,XXY$).',
            'Equilíbrio de Hardy-Weinberg: Em uma população ideal panmítica (cruzamentos ao acaso), infinitamente grande, sem migrações, mutações ou ação da seleção natural, as frequências alélicas ($p + q = 1$) e genotípicas ($p^2 + 2pq + q^2 = 1$) permanecem constantes ao longo das gerações.'
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
          enemWeight: 'Alta',
          summary: 'Engenharia genética molecular aplicada à agricultura, medicina e identificação forense.',
          keyConcepts: [
            'Organismos Transgênicos: Incorporam um gene de uma espécie exógena em seu genoma via plasmídeos bacterianos e enzimas de restrição (tesouras biológicas que cortam sequências palindrômicas). Exemplos: Soja transgênica resistente a herbicidas e Milho Bt (que produz a endotoxina inseticida de *Bacillus thuringiensis*).',
            'Edição Genômica CRISPR-Cas9: Sistema bacteriano adaptado para edição precisa in vivo. Um RNA-guia sintético conduz a endonuclease Cas9 a uma sequência específica do genoma do paciente para cortar, desativar ou reparar um gene com mutação deletéria.',
            'Eletroforese e Teste de Paternidade (DNA Fingerprint): Fragmentos de DNA gerados por enzimas de restrição (RFLP) ou repetições em tandem (STR) são separados em gel de agarose sob campo elétrico (o DNA tem carga líquida negativa devido aos grupamentos fosfato e migra para o polo positivo; fragmentos menores migram mais rápido). No teste de paternidade, todas as bandas do filho que não vieram da mãe biológica devem obrigatoriamente coincidir com as do pai biológico.'
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
            'Vacina (Imunização Ativa e Preventiva): Contém antígenos atenuados, inativados, toxoides ou RNAm mensageiro. Desencadeia uma resposta imune primária lenta no hospedeiro, estimulando a diferenciação de linfócitos B em plasmócitos (que produzem anticorpos próprios) e a formação de células de memória de longa duração. Em um segundo contato com o patógeno real, a resposta secundária é imediata e potente, evitando a instalação da doença.',
            'Soro Terapêutico (Imunização Passiva e Curativa): Contém anticorpos pré-formados purificados em animais hiperimunizados (como cavalos). Fornece alívio imediato contra toxinas letais de rápida ação (veneno de serpentes como jararaca e cascavel, picada de escorpião, tétano, raiva), não estimulando as células do indivíduo nem gerando memória imunológica.',
            'Antígeno vs. Anticorpo: Antígeno é qualquer corpo ou molécula estranha capaz de ser reconhecida e deflagrar resposta imune. Anticorpo (imunoglobulina) é a glicoproteína de defesa altamente específica produzida pelos plasmócitos para neutralizar o antígeno.'
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
            'Digestão Química e Enzimas: Boca (ptialina/amilase salivar quebra amido em pH neutro ~7); Estômago (pepsina quebra proteínas em meio fortemente ácido pH ~2 mantido pelo ácido clorídrico $HCl$); Intestino Delgado / Duodeno (o bicarbonato do suco pancreático neutraliza a acidez para pH alcalino ~8, permitindo a ação de tripsina, quimiotripsina, lipase pancreática e amilase pancreática; a bile, produzida pelo fígado e armazenada na vesícula biliar, NÃO possui enzimas, agindo como detergente emulsificante que divide as gorduras em gotículas microscópicas facilitando o ataque da lipase).',
            'Regulação Hormonal da Digestão: Gastrina (produzida pelo estômago, estimula secreção de $HCl$), Secretina (estimula o pâncreas a secretar suco rico em bicarbonato) e Colecistoquinina / CCK (estimula liberação de enzimas pancreáticas e contração da vesícula biliar para despejar bile).',
            'Sistema Circulatório Humano: Circulação dupla (passa duas vezes pelo coração), completa (não há mistura de sangue arterial oxigenado com sangue venoso desoxigenado) e fechada. Átrio direito recebe sangue venoso pelas veias cavas $\\rightarrow$ ventrículo direito bombeia sangue aos pulmões pela artéria pulmonar (Pequena Circulação / Pulmonar) $\\rightarrow$ sangue arterial retorna pelas veias pulmonares ao átrio esquerdo $\\rightarrow$ ventrículo esquerdo (com parede miocárdica espessa) bombeia sangue oxigenado para todo o organismo pela artéria aorta (Grande Circulação / Sistêmica).',
            'Sistema Respiratório e Transporte de Gases: Hematose nos alvéolos pulmonares por difusão simples. O oxigênio é transportado ligado à hemoglobina ($HbO_2$). A maior parte do gás carbônico ($CO_2$, ~70%) é transportada no plasma na forma dissolvida de ÍON BICARBONATO ($HCO_3^-$), catalisado pela enzima anidrase carbônica nas hemácias ($CO_2 + H_2O \\rightleftharpoons H_2CO_3 \\rightleftharpoons H^+ + HCO_3^-$).',
            'Controle da Respiração pelo Bulbo: O aumento de $CO_2$ no sangue acidifica o plasma (queda do pH sanguíneo). Quimiorreceptores no bulbo encefálico e nas artérias carótidas detectam essa acidose e enviam impulsos nervosos para acelerar os movimentos do diafragma e músculos intercostais (hiperventilação).'
          ],
          tips: [
            'A intoxicação por Monóxido de Carbono ($CO$) de motores ou queimadas é perigosa porque o $CO$ liga-se à hemoglobina formando carboxiemoglobina ($HbCO$) com afinidade cerca de 250 vezes superior à do oxigênio, em ligação estável e irreversível que bloqueia o transporte de $O_2$ e leva à asfixia celular.'
          ]
        },
        {
          id: 'sistema-excretor-osmorregulacao',
          title: 'Sistema Excretor Humano, Néfron e Regulação Osmótica (ADH e Aldosterona)',
          enemWeight: 'Muito Alta',
          summary: 'Filtração glomerular, reabsorção tubular de nutrientes e os mecanismos endócrinos de balanço hidroeletrolítico.',
          keyConcepts: [
            'Estrutura e Funcionamento do Néfron: 1) Filtração Glomerular (no corpúsculo renal / Cápsula de Bowman: a alta pressão sanguínea empurra água, glicose, aminoácidos, sais e ureia para fora dos capilares do glomérulo, gerando o filtrado glomerular; proteínas e células sanguíneas não são filtradas); 2) Reabsorção Tubular (no túbulo contorcido proximal, 100% da glicose e aminoácidos são reabsorvidos ativamente de volta para o sangue; na alça de Henle e túbulo distal ocorre reabsorção hídrica e iônica); 3) Secreção Tubular (lançamento ativo de substâncias indesejáveis do sangue para a urina).',
            'Hormônio Antidiurético (ADH / Vasopressina): Produzido no hipotálamo e liberado pela neuro-hipófise. Quando o indivíduo bebe pouca água ou transpira muito, a osmolalidade plasmática aumenta $\\rightarrow$ o hipotálamo dispara a liberação de ADH $\\rightarrow$ o ADH atua nos ductos coletores renais aumentando a inserção de canais de aquaporina $\\rightarrow$ maior reabsorção de água para o sangue $\\rightarrow$ urina torna-se escassa e hiperconcentrada. O álcool etílico inibe a secreção de ADH, provocando diurese abundante e desidratação (ressaca).',
            'Aldosterona (Sistema Renina-Angiotensina-Aldosterona): Produzida pelo córtex da glândula adrenal em resposta a quedas de pressão arterial. Estimula a reabsorção ativa de íons sódio ($Na^+$) nos túbulos renais; o cloreto de sódio atrai água por osmose para a corrente sanguínea, elevando o volume plasmático e restabelecendo a pressão arterial normal.'
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
            'Arboviroses Urbanas (Dengue, Zika, Chikungunya e Febre Amarela Urbana): Doenças virais transmitidas pela picada da fêmea do mosquito vetor *Aedes aegypti*. Profilaxia prioritária: controle vetorial mediante eliminação de focos de água parada.',
            'Doença de Chagas: Causada pelo protozoário flagelado *Trypanosoma cruzi*. Transmitida pelas fezes infectadas do percevejo barbeiro (*Triatoma infestans*) que contaminam o orifício da picada quando o indivíduo coça a pele, ou pela ingestão oral de alimentos contaminados com o inseto moído (açaí e caldo de cana in natura sem pasteurização). Profilaxia: substituição de casas de pau-a-pique por alvenaria e uso de telas/mosquiteiros.',
            'Esquistossomose (Barriga d\'Água): Causada pelo helminto platelminto *Schistosoma mansoni*. Ciclo: Ovos nas fezes humanas eclodem na água doce originando miracídios $\\rightarrow$ penetram no caramujo *Biomphalaria* (hospedeiro intermediário) $\\rightarrow$ transformam-se em cercárias flageladas $\\rightarrow$ cercárias penetram ativamente pela pele humana intacta ao banhista em "lagoas de coceira". Causa hipertensão portal e hepatoesplenomegalia.',
            'Teníase vs. Cisticercose: 1) Teníase (humano como hospedeiro definitivo): ingestão de carne de boi (*Taenia saginata*) ou porco (*Taenia solium*) crua ou mal cozida com cisticercos; o verme adulto fixa-se no intestino delgado; 2) Cisticercose (humano como hospedeiro intermediário acidental): ingestão de água ou alimentos contaminados diretamente com OVOS de *Taenia solium*; os embriões caem na circulação e encistam-se no sistema nervoso central (neurocisticercose), com risco de convulsões graves.'
          ],
          tips: [
            'Profilaxia padrão de ouro para o ENEM: Saneamento básico integral (água encanada tratada e coleta/tratamento universal de esgoto) é a medida preventiva mais eficiente e duradoura para erradicar ascaridíase, ancilostomose (amarelão) e esquistossomose.'
          ]
        }
      ]
    }
  ]
};
