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
          title: 'Relações Ecológicas, Sucessão, Dinâmica de Populações e Coevolução',
          enemWeight: 'Alta',
          summary: 'Interações harmônicas e desarmônicas intra e interespecíficas, relações ecológicas especiais (esclavagismo, parasitoidismo, foresia, alelopatia), mimetismo, modelo de Lotka-Volterra e a evolução direcional das comunidades em direção ao clímax.',
          keyConcepts: [
            '**Relações Intraespecíficas Harmônicas e Desarmônicas**: Sociedades (divisão de trabalho cooperativa sem união física anatômica, ex.: abelhas com rainha/operárias/zangões, formigas, cupins) e Colônias (união anatômica com benefício mútuo: isomorfas com indivíduos idênticos como corais, ou heteromorfas com divisão de funções vitais como a caravela-portuguesa). Canibalismo (+/-, predação de indivíduo da mesma espécie) e Competição intraespecífica (-/-, disputa por parceiros reprodutivos, alimento ou território) são desarmônicas.',
            '**Relações Interespecíficas Harmônicas Clássicas e Especiais**: 1) **Mutualismo** (+/+, associação íntima obrigatória essencial para a sobrevivência de ambas as espécies, ex.: líquens [fungo + cianobactéria/alga], micorrizas nas raízes vegetais, bactérias fixadoras *Rhizobium* em leguminosas e protozoários digestores de celulose no rúmen de bovinos); 2) **Protocooperação** (+/+, cooperação ecológica facultativa benéfica mas não obrigatória, ex.: pássaro-palito e jacaré, caranguejo-eremita e anêmona-do-mar); 3) **Comensalismo** (+/0, uma espécie obtém sobras alimentares sem beneficiar nem prejudicar o hospedeiro, ex.: rêmora aderida ao tubarão); 4) **Inquilinismo / Epifitismo** (+/0, uso de outra espécie como mero suporte físico sem parasitismo de seiva, ex.: orquídeas e bromélias sobre árvores); 5) **Foresia** (+/0, comensalismo de transporte: uma espécie utiliza outra exclusivamente para locomoção e dispersão espacial, ex.: pseudoescorpiões fixando-se às pernas de besouros ou ácaros em moscas).',
            '**Relações Interespecíficas Desarmônicas Clássicas e Especiais**: 1) **Predatismo** (+/-); 2) **Parasitismo** (+/-, o parasita espolia tecidos ou nutrientes do hospedeiro geralmente sem matá-lo de imediato: ectoparasitas externos como carrapatos e endoparasitas internos como lombrigas e tênias; holoparasitas vegetais que sugam seiva elaborada do floema como o cipó-chumbo vs. hemiparasitas que sugam apenas seiva bruta do xilema como a erva-de-passarinho); 3) **Parasitoidismo** (+/-, relação obrigatoriamente fatal: fêmeas de vespas ou moscas parasitoides depositam ovos dentro de lagartas hospedeiras; as larvas devoram o hospedeiro vivo de forma gradual, matando-o ao atingir o estágio pupal, base do **Controle Biológico de Pragas**); 4) **Esclavagismo / Sinfilia** (+/- ou +/+, exploração de trabalho ou produtos: formigas que protegem e "ordenham" pulgões para sugar a secreção açucarada, formigas escravagistas *Polyergus* que roubam casulos alheios, e o **Parasitismo de Ninho/Postura** do chupim e do cuco que põem ovos no ninho do tico-tico); 5) **Amensalismo / Antibiose / Alelopatia** (-/0, secreção de metabólitos químicos secundários que inibem ou aniquilam o desenvolvimento de competidores: fungo *Penicillium* produzindo penicilina, dinoflagelados causando Maré Vermelha tóxica, e nogueiras liberando a substância alelopática **juglona** no solo que impede a germinação de outras plantas); 6) **Competição Interespecífica** (-/-, Princípio de Gause ou da Exclusão Competitiva: espécies com nichos idênticos não coexistem indefinidamente no mesmo habitat).',
            '**Adaptações Evolutivas de Defesa e Coevolução**: 1) **Mimetismo Batesiano**: espécie inofensiva e palatável evolui para imitar o padrão visual conspícuo de uma espécie perigosa ou venenosa, enganando predadores (ex.: cobra falsa-coral imitando a coral-verdadeira; borboleta vice-rei imitando a borboleta-monarca impalatável); 2) **Mimetismo Mülleriano**: duas ou mais espécies venenosas ou repugnantes convergem para o mesmo padrão visual de advertência, reforçando a aversão dos predadores na comunidade; 3) **Aposematismo (Coloração de Advertência)**: padrão cromático contrastante vivo (vermelho, amarelo, preto) anunciado por animais tóxicos como sapos dendrobatídeos e vespas; 4) **Camuflagem**: semelhança morfológica ou de cor com o ambiente físico inanimado (homocromia e homotipia, como o bicho-pau e mariposas com padrão de casca de árvore).',
            '**Sucessão Ecológica Primária versus Secundária**: A sucessão primária ocorre em terrenos biologicamente estéreis (rochas vulcânicas recém-solidificadas, dunas de areia) colonizados por espécies pioneiras (líquens, musgos); a sucessão secundária ocorre em áreas perturbadas com solo pré-existente (clareiras florestais, campos abandonados). Ao longo da sucessão em direção ao ecossistema clímax maduro: a biomassa total ($B$), a biodiversidade e a complexidade das teias alimentares aumentam exponencialmente; a respiração total ($R$) aproxima-se da produtividade primária bruta ($PPB$), fazendo com que a produtividade primária líquida despenque até o equilíbrio estático ($PPL = PPB - R \\approx 0$).'
          ],
          tips: [
            'Diferença crucial no ENEM e FUVEST entre Parasitismo e Parasitoidismo: No parasitismo clássico, o parasita depende metabolicamente da sobrevida prolongada do hospedeiro para continuar reproduzindo-se. No PARASITOIDISMO (típico de vespas e moscas usadas no controle biológico agrícola), a morte do hospedeiro é um desfecho biológico obrigatório e inevitável para que a larva parasitoide complete sua metamorfose!'
          ],
          deepSections: [
            {
              title: 'Guia Sistemático e Bioquímica das Relações Harmônicas e Desarmônicas (Mecanismos FUVEST)',
              explanation: 'Em exames discursivos de alta seletividade da FUVEST e UNICAMP, as relações ecológicas não são tratadas como simples tabelas de memorização, mas sim como mecanismos funcionais bioenergéticos e evolutivos que regulam o fluxo de matéria e mantêm o equilíbrio das teias tróficas.',
              bullets: [
                '**Mutualismo Obrigatório (+/+) versus Protocooperação (+/+)**: A distinção conceitual indispensável reside na obrigatoriedade vital da associação: 1) No **Mutualismo Obrigatório (Simbiose Estrita)**, a separação anatômica ou fisiológica acarreta a morte de ambos os parceiros ou a perda de sua capacidade adaptativa: líquens (onde o fungo micobionte retém umidade e minerais e a alga/cianobactéria fotobionte doa glicose/nitrogênio fixado); micorrizas (as hifas fúngicas estendem a área superficial radicular em mais de 100 vezes, absorvendo fósforo e água em troca de fotoassimilados); nódulos radiculares de *Rhizobium* em leguminosas (onde a planta sintetiza a proteína **leg-hemoglobina** para sequestrar o oxigênio livre, impedindo a inativação da enzima bacteriana nitrogenase); e os protozoários flagelados celulolíticos (*Trichonympha*) no intestino de cupins comedores de madeira; 2) Na **Protocooperação (Mutualismo Facultativo)**, as espécies auferem vantagens ecológicas mútuas quando juntas, porém sobrevivem de forma independente e autônoma se separadas (ex.: o caranguejo-paguro que aloja anêmonas-do-mar urticantes em sua concha para camuflagem e defesa, enquanto as anêmonas aproveitam restos alimentares flutuantes).',
                '**Espectro do Comensalismo (+/0): Comensalismo Estrito, Inquilinismo, Epifitismo e Foresia**: 1) **Comensalismo Estrito**: obtenção de restos tróficos deixados por um animal maior sem prejudicá-lo nem beneficiá-lo (como as rêmoras ou peixes-piolho dotados de ventosa dorsal fixados à pele de tubarões); 2) **Inquilinismo**: procura por abrigo ou refúgio mecânico no corpo ou toca de outra espécie viva sem espoliação de tecidos (ex.: o peixe-agulha *Carapus*, que se esconde no interior da cavidade cloacal do pepino-do-mar quando ameaçado); 3) **Epifitismo**: especialização botânica de inquilinismo vegetal observada em orquídeas e bromélias na Floresta Tropical úmida; as epífitas fixam-se no alto da casca dos ramos da copa arbórea para acessar a luz solar necessária à fotossíntese, utilizando raízes com **velame** esponjoso que absorve a umidade do ar e chuvas, sem emitir haustórios e sem perfurar os vasos condutores da árvore hospedeira; 4) **Foresia**: forma especializada de comensalismo mecânico onde um organismo utiliza outro organismo exclusivamente como meio de transporte e dispersão espacial passiva (ex.: pseudoescorpiões microscópicos que se agarram firmemente às cerdas das pernas de grandes besouros serra-pau cerambicídeos para colonizar novos troncos caídos).',
                '**Parasitismo Vegetal FUVEST: Hemiparasitas versus Holoparasitas**: Um tema clássico de botânica ecológica nos vestibulares paulistas: 1) **Hemiparasitas** (como a **erva-de-passarinho** *Phoradendron* e *Struthanthus*): plantas verdes com clorofila funcional que realizam fotossíntese própria; contudo, emitem raízes sugadoras especializadas chamadas **haustórios** que perfuram o córtex até atingirem unicamente os vasos do **XILEMA (Lenho)** da árvore hospedeira, de onde roubam exclusivamente água e sais minerais (seiva bruta); 2) **Holoparasitas** (como o **cipó-chumbo** *Cuscuta*): plantas amarelas ou alaranjadas que perderam totalmente a clorofila e a capacidade fotossintética ao longo da evolução; seus haustórios penetram profundamente no córtex vegetal até atingirem os tubos crivados do **FLOEMA (Líber)**, de onde sugam ativamente a sacarose e aminoácidos (seiva elaborada), espoliando integralmente a planta hospedeira.'
              ]
            },
            {
              title: 'Parasitoidismo, Controle Biológico, Esclavagismo e a Corrida Armamentista Coevolutiva',
              explanation: 'A dinâmica coevolutiva e as estratégias comportamentais e bioquímicas refinadas que modelam as interações antagônicas na natureza.',
              bullets: [
                '**Parasitoidismo versus Parasitismo Clássico e o Controle Biológico**: A diferença biológica fulcral reside no desfecho vital do hospedeiro: no parasitismo verdadeiro (lombrigas, tênias, carrapatos), a seleção natural atua para preservar a vida do hospedeiro a longo prazo, pois a morte prematura dele extingue o habitat e a fonte nutricional do parasita. No **Parasitoidismo** (típico de vespas das famílias Ichneumonidae, Braconidae e moscas Tachinidae), a fêmea adulta inocula seus ovos dentro de larvas, ninfas ou ovos hospedeiros; as larvas do parasitoide desenvolvem-se internamente consumindo primeiro os tecidos não vitais (gordura e hemolinfa) e, ao final da fase larval, consomem os órgãos vitais e emergem para empupar, **matando obrigatoriamente o hospedeiro**. Essa letalidade estrita de 100% torna os parasitoides o principal agente do **Controle Biológico de Pragas** na agricultura (ex.: a vespa *Cotesia flavipes* utilizada em larga escala no Brasil para combater a broca-da-cana-de-açúcar *Diatraea saccharalis*, eliminando a necessidade de inseticidas químicos clorados persistentes).',
                '**Sinfilia, Esclavagismo e o Parasitismo de Ninho (Brood Parasitism)**: 1) **Sinfilia e Exploração por Formigas**: a associação entre formigas lava-pés e pulgões afídeos possui caráter ambíguo; enquanto as formigas protegem os pulgões contra o ataque predatório de larvas de joaninhas e os transportam para brotos vegetais novos, elas utilizam suas antenas para golpear o abdômen dos pulgões, forçando a liberação contínua de gotas de *honeydew* (exudato anal açucarado derivado da seiva do floema); em espécies escravagistas estritas (*Polyergus*), as operárias atacam ninhos de formigas do gênero *Formica*, matam a rainha local, sequestram as pupas e as criam em seu próprio ninho para realizarem todas as tarefas de coleta de comida e manutenção da colônia; 2) **Parasitismo de Ninho e Coevolução Armamentista (*Arms Race*)**: aves parasitas como o **chupim** (*Molothrus bonariensis*) no Brasil e o **cuco** (*Cuculus canorus*) na Europa não constroem ninhos nem incubam seus ovos; elas monitoram ninhos de aves hospedeiras (como o tico-tico *Zonotrichia capensis*) e aproveitam breves ausências para depositar seus ovos; os ovos do chupim desenvolveram mimetismo visual de coloração e casca mais espessa e resistente; os filhotes do parasita eclodem mais rápido, possuem boca com padrões de cores superestimulantes que desviam o alimento trazido pelos pais adotivos e comportamento inato de empurrar os ovos e filhotes legítimos para fora do ninho; por sua vez, a ave hospedeira desenvolve acuidade visual para identificar e ejetar ovos dissimilares, exemplificando a **Hipótese da Rainha Vermelha de Van Valen** (onde ambas as espécies precisam evoluir novidades adaptativas permanentemente apenas para manter suas aptidões relativas estáveis).',
                '**Alelopatia e Amensalismo Bioquímico no Reino Vegetal**: Fenômeno no qual uma espécie vegetal secreta metabólitos secundários químicos no ambiente (solo, água ou ar) que inibem seletivamente a germinação, o crescimento ou a sobrevivência de espécies concorrentes: 1) A nogueira-preta (*Juglans nigra*) produz a substância hidrojuglona nas folhas e raízes; quando lixiviada para o solo aerado, bactérias a oxidam no composto altamente tóxico **juglona** (5-hidroxi-1,4-naftoquinona), que bloqueia a fotofosforilação mitocondrial e paralisa a absorção de nutrientes por plantas sensíveis vizinhas (tomateiros, alfafa); 2) O **eucalipto** (*Eucalyptus*) libera no solo óleos essenciais terpênicos voláteis e compostos fenólicos hidrossolúveis que esterilizam o banco de sementes nativas e acidificam o perfil superficial, gerando os característicos desertos verdes de sub-bosque desprovido de vegetação rasteira.'
              ]
            },
            {
              title: 'Princípio de Gause, Teoria do Nicho de Connell e Dinâmica de Populações de Lotka-Volterra',
              explanation: 'Formalização biofísica e experimental da coexistência, exclusão competitiva e oscilações cíclicas acopladas entre espécies.',
              bullets: [
                '**Nicho Fundamental versus Nicho Realizado (O Histórico Experimento de Connell)**: Em 1961, o ecólogo Joseph Connell investigou a distribuição vertical de duas espécies de cracas sésseis nas zonas entremarés rochosas da Escócia: a craca menor *Chthamalus stellatus* ocupava estritamente a faixa superior (mais exposta ao ar), enquanto a craca maior e mais robusta *Semibalanus balanoides* dominava a faixa intermediária e inferior (mais submersa). Connell realizou experimentos pioneiros de remoção seletiva: 1) Ao remover manualmente a craca *Semibalanus*, as larvas de *Chthamalus* colonizaram com enorme sucesso toda a faixa inferior rochosa, demonstrando que o seu **Nicho Fundamental** (o espaço fisiológico potencial total que a espécie pode ocupar na ausência de competidores) abrange toda a zona entre-marés; contudo, na presença de *Semibalanus*, o seu **Nicho Realizado / Efetivo** (a fração restrita que a espécie realmente ocupa na natureza) ficava confinado à faixa superior devido à intensa **exclusão competitiva** por espaço físico; 2) Ao remover a craca *Chthamalus*, a *Semibalanus* continuou incapaz de colonizar a faixa superior, demonstrando que o seu limite físico superior era imposto não por competição, mas por estresse abiótico fisiológico de dessecação pelo ar e calor. Conclusão canônica da FUVEST: Nas comunidades biológicas, os limites superiores de zoneamento ecológico são tipicamente delimitados por fatores abióticos físicos, enquanto os limites inferiores são determinados por interações bióticas de competição e predação.',
                '**Princípio de Gause (Exclusão Competitiva) e Deslocamento de Caracteres**: Quando duas espécies apresentam sobreposição total de seus nichos ecológicos fundamentais no mesmo habitat geográfico, a espécie ecologicamente mais eficiente exclui a outra por inanição competitiva ou a força a uma diferenciação trófica ou espacial. Para viabilizar a coexistência estável em simpatria, as espécies sofrem seleção natural divergente resultando na **Partição de Recursos** e no **Deslocamento de Caracteres Morfológicos (*Character Displacement*)** (como demonstrado por Peter e Rosemary Grant nos tentilhões do gênero *Geospiza* no arquipélago de Galápagos: quando coexistem na mesma ilha, a seleção favorece tamanhos de bico amplamente divergentes para que uma espécie consuma sementes duras e volumosas e a outra consuma sementes pequenas e macias, eliminando o atrito da competição direta).',
                '**Modelagem Matemática de Lotka-Volterra para Sistemas Predador-Presa**: A interação dinâmica entre a densidade populacional de presas ($N$) e predadores ($P$) é regida pelo sistema de equações diferenciais não lineares: $\\frac{dN}{dt} = rN - aNP$ e $\\frac{dP}{dt} = -qP + faNP$, onde $r$ é a taxa de natalidade per capita da presa, $a$ é a taxa de ataque do predador, $q$ é a taxa de mortalidade do predador na ausência de alimento e $f$ a eficiência de conversão da biomassa de presas consumidas em novos predadores. As curvas populacionais no tempo produzem **oscilações sinusoidais acopladas com defasagem de fase temporal de um quarto de período ($\\pi/2$)**: o aumento das presas fornece superávit alimentar que faz a população de predadores crescer com um ligeiro atraso temporal; a superpopulação de predadores dizima as presas, cuja escassez provoca a queda subsequente dos predadores por inanição, reiniciando ciclicamente o equilíbrio dinâmico.'
              ]
            }
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
          title: 'Sistemas Reprodutores Masculino e Feminino, Ciclo Menstrual, Fecundação e Contracepção',
          enemWeight: 'Muito Alta',
          summary: 'Anatomia e fisiologia detalhadas dos sistemas reprodutores masculino e feminino, gametogênese comparada, dinâmica hormonal cíclica ovariana e uterina, nidação, métodos contraceptivos e profilaxia de ISTs.',
          keyConcepts: [
            '**Sistema Reprodutor Masculino: Anatomia e Vias Espermáticas**: 1) **Testículos**: gônadas pares alojadas na **bolsa escrotal (escroto)**, cuja posição externa mantém a temperatura testicular entre $2^\\circ\\text{C}$ e $3^\\circ\\text{C}$ abaixo da temperatura corpórea central, indispensável para a viabilidade da espermatogênese; 2) **Túbulos Seminíferos**: local de proliferação das espermatogônias e diferenciação meiótica, contendo **Células de Sertoli** (sustentação, fagocitose de citoplasma residual, barreira hematotesticular e secreção de ABP/inibina) e **Células Intersticiais de Leydig** no estroma circundante (síntese de testosterona estimulada por LH); 3) **Epidídimo**: túbulo altamente enovelado no topo do testículo onde os espermatozoides concluem sua maturação bioquímica, adquirem motilidade flagelar e ficam armazenados; 4) **Ductos Deferentes**: canais musculares que conduzem os espermatozoides do epidídimo até a cavidade pélvica circundando a bexiga (alvo da **vasectomia**); 5) **Uretra Peniana**: canal condutor terminal compartilhado tanto pelo sistema reprodutor quanto pelo sistema excretor urinário masculino.',
            '**Glândulas Anexas Masculinas e Composição do Sêmen (Esperma)**: O esperma ejaculado é composto por espermatozoides suspensos no líquido seminal: 1) **Vesículas (Glândulas) Seminais** (~60% a 70% do volume): secretam fluido viscoso e alcalino rico em **frutose** (combustível glicolítico direto para síntese de ATP flagelar) e prostaglandinas (indutoras de contrações peristálticas no trato feminino); 2) **Próstata** (~25% a 30% do volume): secreta fluido leitoso alcalino contendo citrato e enzimas proteolíticas (como o PSA) que neutralizam a acidez da uretra masculina e do muco vaginal, viabilizando a sobrevivência espermática; 3) **Glândulas Bulbouretrais (de Cowper)**: liberam muco alcalino lubrificante pré-ejaculatório transparente que neutraliza resíduos ácidos da urina na uretra antes da passagem do ejaculado.',
            '**Sistema Reprodutor Feminino: Anatomia e Fisiologia**: 1) **Ovários**: gônadas pélvicas pares que abrigam os folículos ovarianos, realizam a ovogênese e secretam os hormônios esteroides **estrógeno** e **progesterona**; 2) **Tubas Uterinas (Trompas de Falópio)**: dutos com extremidade alargada em funil dotada de **fímbrias** que captam o ovócito liberado na ovulação; seu epitélio interno ciliado e contrações musculares transportam o gameta em direção ao útero; **a fecundação ocorre tipicamente na ampola (terço distal) da tuba uterina**; 3) **Útero**: órgão muscular piriforme composto por **miométrio** (espessa camada de músculo liso sensível à ocitocina no parto) e **endométrio** (mucosa interna altamente vascularizada que prolifera e descama ciclicamente e onde se implanta o blastocisto na nidação); 4) **Colo do Útero (Cérvix)**: canal inferior glandular produtor de muco cervical que se torna fluido e alcalino no período ovulatório e denso/tampão na fase lútea; 5) **Vagina e Flora de Döderlein**: canal de cópula e parto revestido por mucosa cujo pH ácido protetor (~3,8 a 4,5) é mantido pelos **bacilos de Döderlein (Lactobacillus)**, que fermentam o glicogênio celular em ácido lático, inibindo infecções.',
            '**Gametogênese Comparada (Espermatogênese vs. Ovogênese)**: 1) **Espermatogênese**: processo contínuo iniciado na puberdade nos túbulos seminíferos; cada espermatócito I ($2n$) completa as duas divisões meióticas com citocinese simétrica, originando 4 espermatozoides haploides ($n$) móveis funcionais; dura cerca de 64 dias e produz centenas de milhões de gametas diariamente; 2) **Ovogênese**: processo descontínuo iniciado ainda na vida embrionária intrauterina, onde todas as ovogônias multiplicam-se e entram em prófase I (dictióteno), permanecendo em repouso até a puberdade; a cada ciclo menstrual, um ovócito I retoma a meiose sob estímulo do pico de LH; as divisões citoplasmáticas são extremamente assimétricas, gerando apenas 1 ovócito II volumoso dotado de todo o vitelo e citoplasma necessário para o futuro embrião e 3 corpúsculos polares degenerativos; a meiose II só é concluída se houver penetração de um espermatozoide.',
            '**Dinâmica Hormonal do Ciclo Menstrual (Ovariano e Uterino)**: 1) **Fase Folicular / Proliferativa (dias 1 a 13)**: a adeno-hipófise secreta **FSH**, que estimula o recrutamento e crescimento de folículos; as células foliculares produzem **Estrógeno**, que promove a reconstrução e hiperplasia do endométrio uterino; 2) **Fase Ovulatória (dia 14 em ciclo de 28 dias)**: o acúmulo sustentado de estrógeno atinge um limiar crítico, provocando uma inversão para feedback positivo na hipófise com consequente **Pico de LH ("LH surge")**; o pico de LH induz a digestão enzimática da parede folicular e a liberação do ovócito II na tuba (**Ovulação**); 3) **Fase Lútea / Secretora (dias 15 a 28)**: o folículo esvaziado reorganiza-se em **Corpo Lúteo (Amarelo)**, passando a secretar maciçamente **Progesterona** e estrógeno; a progesterona estimula glândulas endometriais a secretarem glicogênio e as artérias espiraladas a dilatarem-se; se não houver fertilização, o corpo lúteo involui em *Corpus albicans*, as concentrações hormonais desabam e ocorre a descamação hemorrágica do endométrio (**Menstruação**).',
            '**Fecundação, Nidação e o Papel do hCG**: Se houver encontro de gametas na tuba, ocorre a fecundação e início das clivagens mitóticas formando mórula e **blastocisto**. Por volta do 6º ao 7º dia pós-ovulação, o blastocisto adere e invade o endométrio secretor (**Nidação**). As células da camada externa embrionária (trofoblasto) passam a secretar o hormônio **hCG (Gonadotrofina Coriônica Humana)**, que atua como análogo do LH impedindo a atrofia do corpo lúteo ovariano. Dessa forma, a produção de progesterona é mantida nos primeiros meses gestacionais, impedindo a menstruação e assegurando a integridade gestacional até a placenta assumir a síntese hormonal.',
            '**Métodos Contraceptivos e Mecanismos Biológicos de Ação**: 1) **Métodos Hormonais (Pílula Combinada, Injetáveis, Implantes e Adesivos)**: fornecem doses diárias contínuas de estrógeno e progestina sintéticos que, por feedback negativo permanente no hipotálamo e hipófise, bloqueiam a secreção de FSH e LH, **impedindo a maturação folicular e a ovulação**; 2) **Dispositivos Intrauterinos (DIU)**: DIU de cobre (efeito espermicida citotóxico mediado por íons $Cu^{2+}$ e reação inflamatória endometrial estéril) e DIU hormonal (liberação intrauterina de levonorgestrel que atrofia o endométrio e espessa o muco cervical); 3) **Métodos Cirúrgicos Definitivos**: **Vasectomia** no homem (secção e ligadura dos ductos deferentes, impedindo a chegada de espermatozoides à uretra, sem alterar a ereção, a libido, a testosterona ou o volume do fluido ejaculado) e **Laqueadura Tubária** na mulher (secção e oclusão das tubas uterinas, impedindo a fecundação, mantendo intactos os ovários, os ciclos hormonais e a menstruação); 4) **Métodos de Barreira**: Preservativo masculino (camisinha externa) e feminino (camisinha interna).',
            '**Infecções Sexualmente Transmissíveis (ISTs) e Profilaxia**: Os **Preservativos** são os ÚNICOS métodos que conferem barreira física simultânea contra gravidez não planejada e transmissão de patógenos: 1) **HPV (Papilomavírus Humano)**: vírus oncogênico associado a verrugas genitais e responsável por mais de 90% dos casos de câncer de colo de útero (prevenção primária: vacina quadrivalente recombinante gratuita no SUS para adolescentes de 9 a 14 anos; prevenção secundária: exame citopatológico preventivo Papanicolau); 2) **HIV / AIDS**: retrovírus que ataca linfócitos T CD4+ auxiliares, destruindo a imunidade celular adaptativa (tratamento com antirretrovirais TARV, profilaxia pré-exposição PrEP e pós-exposição PEP); 3) **Sífilis**: infecção pela espiroqueta *Treponema pallidum*, cursando com cancro duro indolor na fase primária, erupções cutâneas na fase secundária e lesões neurológicas/cardiovasculares na terciária, com alto risco de transmissão transplacentária congênita.'
          ],
          tips: [
            'Pegadinha campeã no ENEM sobre a Vasectomia: O homem vasectomizado CONTINUA ejaculando normalmente! O sêmen ejaculado é composto majoritariamente por secreções da próstata e das glândulas seminais (~95% do volume líquido); a cirurgia apenas impede a presença dos espermatozoides vindos dos testículos (~5%). A vasectomia NÃO altera a taxa de testosterona plasmática nem causa disfunção erétil, pois os hormônios são lançados diretamente nos vasos sanguíneos testiculares.',
            'Diferença crucial na Laqueadura Tubária: A mulher laqueada CONTINUA ovulando e menstruando normalmente todos os meses! Os ovários continuam recebendo FSH e LH pelo sangue e secretando estrógeno e progesterona, que comandam o espessamento e a descamação do endométrio. O único bloqueio é mecânico na tuba, impedindo o encontro com o espermatozoide.'
          ],
          deepSections: [
            {
              title: 'Neuroendocrinologia Comparada dos Eixos Reprodutores Masculino e Feminino (Feedback Duplo vs. Feedback Positivo Pré-Ovulatório)',
              explanation: 'Em vestibulares concorridos como FUVEST, UNICAMP e provas médicas, exige-se a compreensão molecular dos circuitos de retroalimentação hormonal em ambos os sexos, os mecanismos celulares de esteroidogênese e as patologias associadas.',
              bullets: [
                '**O Eixo Masculino (Hipotálamo - Adeno-hipófise - Testículo)**: O hipotálamo secreta pulsos regulares do hormônio liberador de gonadotrofinas (GnRH) que estimula a adeno-hipófise a secretar LH (hormônio luteinizante ou ICSH) e FSH (hormônio folículo-estimulante): 1) O **LH** liga-se a receptores acoplados à proteína Gs nas **Células de Leydig**, ativando a via adenilato ciclase-AMPc-PKA para converter colesterol em **Testosterona**; a testosterona difunde-se para os túbulos seminíferos vizinhos e para a circulação sistêmica; 2) O **FSH** atua nas **Células de Sertoli**, estimulando a síntese da **Proteína Ligadora de Andrógenos (ABP)** e do hormônio glicoproteico **Inibina B**; a ABP sequestra a testosterona no lúmen seminífero mantendo uma concentração androgênica local até 100 vezes maior do que no plasma, condição estritamente indispensável para a espermatogênese.',
                '**Mecanismo de Duplo Feedback Negativo Masculino e Abuso de Esteroides Anabolizantes**: A testosterona circulante inibe tanto a liberação hipotalâmica de GnRH quanto a sensibilidade hipofisária ao GnRH (inibindo o LH). A Inibina B produzida pelas células de Sertoli exerce feedback negativo altamente seletivo sobre a secreção hipofisária de FSH. **Aplicação FUVEST**: Quando indivíduos utilizam esteroides anabolizantes sintéticos exógenos (doses suprafisiológicas de andrógenos), os altos níveis plasmáticos bloqueiam completamente a secreção de GnRH, LH e FSH; a ausência de LH silencia a síntese endógena de testosterona pelas células de Leydig, e a ausência de FSH provoca atrofia das células de Sertoli e dos túbulos seminíferos, resultando em atrofia testicular macroscópica severa e **azoospermia** (infertilidade por ausência de espermatozoides).',
                '**O Eixo Feminino e o Modelo das Duas Células - Duas Gonadotrofinas**: No ovário, a síntese de estrógeno depende da cooperação metabólica entre dois tipos celulares: 1) As **Células da Teca** expressam receptores para **LH** e convertem colesterol em andrógenos (androstenediona e testosterona); 2) Esses andrógenos atravessam a lâmina basal e entram nas **Células da Granulosa**, que expressam receptores para **FSH** e ativam a enzima **Aromatase**, que catalisa a aromatização dos andrógenos em **$17\\beta$-Estradiol (Estrógeno)**.',
                '**A Inversão para Feedback Positivo no Pico Pré-Ovulatório de LH**: Durante a primeira metade da fase folicular, níveis moderados de estrógeno inibem a hipófise (feedback negativo). Contudo, o folículo dominante de Graaf atinge maturação e passa a secretar taxas extraordinariamente elevadas de estrógeno ($> 200\\text{ pg/mL}$ mantidos por mais de 36 a 48 horas). Esse limiar crítico atua em neurônios kisspeptina no hipotálamo, provocando uma **INVERSÃO DA RESPOSTA PARA FEEDBACK POSITIVO**: a adeno-hipófise descarrega uma onda maciça e súbita de **LH ("LH surge")** e FSH. O pico de LH quebra o bloqueio meiótico do ovócito I (que retoma a meiose I até metáfase II), estimula a síntese de enzimas proteolíticas (colagenases e prostaglandinas) que degradam o estigma folicular e culmina na ruptura e extrusão do ovócito II (**Ovulação** cerca de 24 a 36 horas após o pico). Na fase lútea subsequente, as altas taxas conjuntas de progesterona e estrógeno restabelecem o mais potente feedback negativo inibitório do ciclo, impedindo qualquer nova onda folicular durante a gravidez potencial.'
              ]
            },
            {
              title: 'Bioquímica da Espermiogênese, Reação Acrossômica, Bloqueio da Poliespermia e Nidação FUVEST',
              explanation: 'Abordagem aprofundada dos eventos celulares que transformam as células germinativas em gametas funcionais, os passos moleculares da fertilização e o diálogo embrionário materno.',
              bullets: [
                '**Espermiogênese e Compactação Genômica por Protaminas**: A diferenciação da espermátide haploide redonda em espermatozoide aerodinâmico compreende: 1) Fusão das vesículas do complexo de Golgi para formar a vesícula acrossômica preenchida por enzimas hidrolíticas (acrossomo); 2) Migração dos centríolos para a base nuclear, onde o centríolo distal organiza o axonema flagelar com arranjo clássico de microtúbulos $9+2$ impulsionado por dineínas ATPase dependentes de $Mg^{2+}$; 3) Agrupamento helicoidal das mitocôndrias na peça intermediária para fornecimento imediato de ATP; 4) Descarte do citoplasma excedente em corpos residuais fagocitados pelas células de Sertoli; 5) **Substituição das histonas nucleares por Protaminas** (pequenas proteínas ricas em arginina e cisteína): pontes dissulfeto intermolecular compactam a cromatina até 6 vezes mais do que no núcleo somático, condensando o genoma em estado inerte e protegido contra espécies reativas de oxigênio durante a trajetória no trato genital feminino.',
                '**Capacitação Espermática no Trato Genital Feminino**: Os espermatozoides recém-ejaculados são metabolicamente incapazes de fecundar. O contato com os fluidos uterinos e tubários remove o colesterol da membrana espermática e glicoproteínas inibidoras, altera a permeabilidade a íons cálcio ($Ca^{2+}$) e bicarbonato ($HCO_3^-$), ativando a adenilato ciclase solúvel e disparando a motilidade hiperativada em chicotada do flagelo.',
                '**Reação Acrossômica e Penetração da Zona Pelúcida**: Ao alcançar a ampola tubária, o espermatozoide capacitado atravessa a camada gelatinosa externa de células foliculares (*Corona Radiata*) auxiliado pela enzima **hialuronidase**. Ao atingir a matriz glicoproteica extracelular da **Zona Pelúcida**, proteínas de membrana da cabeça espermática reconhecem e ligam-se estritamente aos receptores **ZP3** (Zona Pellucida Glycoprotein 3). Essa ligação dispara o influxo de $Ca^{2+}$ e a **Reação Acrossômica**: fusão da membrana externa do acrossomo com a membrana plasmática, liberando a enzima **acrosina** (uma serina protease) que abre uma fenda microscópica na zona pelúcida para permitir a penetração.',
                '**Bloqueio Rápido e Lento contra a Poliespermia**: A fecundação por mais de um espermatozoide (poliespermia) é letal ao embrião (gerando triploidias inviáveis), sendo bloqueada por duplo mecanismo: 1) **Bloqueio Rápido / Despolarização Elétrica**: no instante da fusão entre a membrana do espermatozoide e a membrana do ovócito, canais de sódio abrem-se na membrana ovocitária, gerando influxo massivo de $Na^+$; o potencial elétrico transmembrana salta imediatamente de $-70\\text{ mV}$ para cerca de $+20\\text{ mV}$ por 1 a 3 minutos, repelindo a fusão de outros espermatozoides; 2) **Bloqueio Lento / Reação Cortical**: a fusão desencadeia uma onda propagada de liberação intracelular de íons $Ca^{2+}$ a partir do retículo endoplasmático do ovócito; o cálcio induz a exocitose de milhares de **Grânulos Corticais** situados sob a membrana plasmática para o espaço perivitelínico; enzimas dos grânulos clivam os receptores ZP3 e hidrolisam ligações da zona pelúcida, enquanto mucopolissacarídeos atraem água por osmose, elevando e endurecendo permanentemente a zona pelúcida na chamada **Membrana de Fecundação** impenetrável.',
                '**Singamia e Nidação Embrionária**: A onda de cálcio ativa o metabolismo ovocitário, induzindo a finalização da meiose II com a extrusão do **segundo corpúsculo polar**. Os núcleos haploides condensam-se nos **pronúcleos masculino e feminino**, que migram um em direção ao outro e sofrem cariogamia (**Singamia / Anfimixia**), restabelecendo o cariótipo diploide ($2n = 46$). As clivagens mitóticas subsequentes convertem o zigoto em mórula e, por volta do 5º dia, em **blastocisto** (composto pela massa celular interna ou embrioblasto e pela camada periférica de trofoblasto). No 6º a 7º dia, o blastocisto realiza a **Nidação**: o trofoblasto secreta metaloproteinases que digerem o estroma do endométrio uterino secretor para implantar o concepto e passa a secretar **hCG**, mantendo o corpo lúteo viável e prevenindo a menstruação.'
              ]
            }
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
