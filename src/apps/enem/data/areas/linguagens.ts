import { KnowledgeArea } from '../../types/curriculum';

export const linguagens: KnowledgeArea = {
  id: 'linguagens',
  name: 'Linguagens, Códigos e suas Tecnologias',
  code: 'LC',
  description: 'Comunicação verbal e multimodal, estudos literários, produção textual dissertativa-argumentativa, gramática reflexiva, artes visuais e línguas estrangeiras.',
  disciplines: [
    {
      id: 'lingua-portuguesa-literatura',
      name: 'Língua Portuguesa e Literatura',
      description: 'Gramática contextualizada, combate ao preconceito linguístico e análise estética das escolas literárias.',
      topics: [
        {
          id: 'lingua-portuguesa-funcional',
          title: 'Língua Portuguesa e Gramática Reflexiva',
          description: 'A língua como manifestação viva, dinâmica e heterogênea da identidade cultural brasileira.',
          subtopics: [
            {
              id: 'variacao-linguistica',
              title: 'Variação Linguística e Preconceito Linguístico',
              enemWeight: 'Muito Alta',
              summary: 'A compreensão científica de que todas as variedades linguísticas são sistemas gramaticais completos e legítimos, e a desconstrução da ideia elitista de "falar certo ou errado".',
              keyConcepts: [
                '**Variação Regional / Diatópica**: Diferenças no vocabulário, sotaque e construções sintáticas entre diferentes regiões do país (ex.: aipim, macaxeira e mandioca).',
                '**Variação Social / Diastrática**: Marcas de linguagem associadas à classe social, escolaridade, faixa etária e grupos profissionais (gírias juvenis, jargão médico, linguajar jurídico).',
                '**Variação Histórica / Diacrônica**: Transformação da língua com o passar dos séculos (ex.: a evolução de "Vossa Mercê" para "Vosmecê", "Você" e o coloquial "Cê").',
                '**Variação Situacional / Diafásica**: Adequação do registro ao contexto de comunicação: Norma-Padrão/Formal (entrevistas de emprego, redação do ENEM, artigos acadêmicos) vs. Coloquial/Informal (conversa com amigos no WhatsApp).',
                '**Preconceito Linguístico** (Marcos Bagno): Julgamento discriminatório negativo emitido contra falantes de variedades populares não hegemônicas, disfarçando na verdade um preconceito socioeconômico e regional.'
              ],
              tips: [
                'No ENEM, qualquer assertiva que rotule uma variante linguística regional ou popular como "deficiente", "ignorante", "incorreta" ou "empobrecimento da língua" está terminantemente errada. A ótica da prova é estritamente a da ADEQUAÇÃO CONTEXTUAL.'
              ]
            },
            {
              id: 'figuras-de-linguagem',
              title: 'Figuras de Linguagem e Recursos Expressivos',
              enemWeight: 'Muito Alta',
              summary: 'Recursos semânticos, sonoros e sintáticos utilizados para produzir efeitos de sentido, expressividade estética e ironia em poemas, canções e campanhas publicitárias.',
              keyConcepts: [
                '**Metáfora vs. Comparação**: Metáfora é uma comparação implícita sem conectivo explícito ("A vida é uma nuvem passageira"); a Comparação utiliza conectivos comparativos claros ("A vida é como uma nuvem passageira").',
                '**Metonímia**: Substituição lógica de um termo por outro correlato (o autor pela obra: "Li Machado de Assis"; a parte pelo todo: "Teto para morar"; o recipiente pelo conteúdo: "Bebi dois copos de suco").',
                '**Antítese vs. Paradoxo**: Antítese é a aproximação de ideias opostas sem contradição lógica ("Tristeza e alegria andam juntas"); Paradoxo/Oxímoro une conceitos contraditórios que desafiam a lógica racional ("Amor é fogo que arde sem se ver, é ferida que dói e não se sente").',
                '**Hipérbole e Eufemismo**: Hipérbole é o exagero dramático expressivo intencional ("Chorei rios de lágrimas"); Eufemismo é a suavização de uma expressão desagradável ou chocante ("Ele descansou para sempre").',
                '**Personificação / Prosopopeia**: Atribuição de sentimentos ou ações humanas a seres inanimados ou animais ("O vento uivava furioso pela fresta da porta").'
              ],
              tips: [
                'Atenção à Ironia: Dizer o oposto do que realmente se pensa para provocar efeito satírico ou crítico ("Ele foi tão educado que nem se deu ao trabalho de responder ao bom dia").'
              ]
            },
            {
              id: 'coesao-coerencia',
              title: 'Coesão Referencial, Operadores Argumentativos e Coerência',
              enemWeight: 'Muito Alta',
              summary: 'Mecanismos gramaticais que conectam partes do texto e orientam a leitura interpretativa e a redação dissertativa.',
              keyConcepts: [
                '**Coesão Referencial** (Anáfora e Catáfora): Anáfora retoma um termo já mencionado anteriormente para evitar repetições desnecessárias ("Pedro chegou; ele parecia cansado"); Catáfora antecipa um termo que ainda será expresso ("Só digo isto: não desista").',
                '**Operadores Argumentativos de Oposição / Concessão**: Conjunções adversativas ("mas, porém, contudo, no entanto") e concessivas ("embora, apesar de que, conquanto"). Note que a oração após a conjunção concessiva é atenuada, prevalecendo a força da oração principal!',
                '**Operadores de Conclusão e Causa/Consequência**: Conclusivos ("portanto, logo, por conseguinte, destarte") e causais ("visto que, já que, uma vez que").',
                '**Coerência Textual**: Harmonia global de sentidos, ausência de contradições internas e pertinência com o conhecimento de mundo partilhado.'
              ],
              tips: [
                'Dominar esses conectivos é decisivo tanto para acertar as questões de interpretação da prova de Linguagens quanto para garantir os 200 pontos da Competência 4 na Redação do ENEM.'
              ]
            },
            {
              id: 'concordancia-regencia-crase',
              title: 'Concordância, Regência Verbal e Emprego do Sinal de Crase',
              enemWeight: 'Média',
              summary: 'Regras da norma-padrão fundamentais para interpretação textual sem ambiguidade e para a Competência 1 da redação.',
              keyConcepts: [
                '**Verbos Impessoais de Concordância**: O verbo *Haver* no sentido de "existir", "ocorrer" ou indicando tempo transcorrido não possui sujeito e deve permanecer obrigatoriamente na 3ª pessoa do singular ("Havia muitos problemas na cidade", e nunca "Haviam"). O verbo *Fazer* indicando tempo ou clima também é impessoal ("Faz dez anos que não o vejo").',
                '**Partícula "Se" Apassivadora vs. Indeterminadora**: Com Verbo Transitivo Direto (VTD), o "se" é pronome apassivador e o verbo concorda com o sujeito paciente ("Vendem-se casas", "Alugam-se apartamentos"). Com Verbo Transitivo Indireto (VTI), o "se" é índice de indeterminação do sujeito e o verbo fica obrigatoriamente no singular ("Precisa-se de funcionários").',
                '**Regência Verbal Crucial**: Verbos com mudança de sentido conforme a preposição: *Assistir* no sentido de ver/presenciar exige preposição "a" ("Assisti ao filme"); no sentido de ajudar/prestar assistência é direto ("O médico assistiu o paciente"). *Aspirar* no sentido de desejar/almejar exige "a" ("Aspirava ao cargo público"); no sentido de inalar é direto ("Aspirou o ar puro").',
                '**Emprego da Crase** (Fusão da preposição "a" com o artigo feminino "a"): Casos proibidos fundamentais: antes de palavras masculinas ("andou a pé"), antes de verbos no infinitivo ("começou a cantar") e antes de pronomes de tratamento e indefinidos ("entregou a ela", "disse a todos"). Casos facultativos clássicos: antes de pronomes possessivos femininos singulares ("fui à/a minha casa"), antes de nomes próprios femininos ("dei o livro à/a Maria") e após a preposição *até*.'
              ],
              tips: [
                'Dica prática infalível para crase: Substitua a palavra feminina seguinte por uma palavra masculina similar. Se aparecer "ao" no masculino, haverá crase no feminino! Exemplo: "Fui à praia" -> "Fui ao clube" (houve "ao", logo usa crase). "Vi a praia" -> "Vi o clube" (não houve "ao", logo não usa crase).'
              ]
            }
          ]
        },
        {
          id: 'literatura-brasileira',
          title: 'Literatura Brasileira e Diálogos Culturais',
          description: 'A evolução dos movimentos estéticos, do período colonial às vozes contemporâneas e marginais.',
          subtopics: [
            {
              id: 'quinhentismo-literatura-colonial',
              title: 'Quinhentismo: Literatura de Informação e Produção Jesuítica',
              enemWeight: 'Baixa',
              summary: 'Os primeiros registros escritos sobre o território brasileiro no século XVI: os relatos de viajantes europeus para a metrópole e a catequização dos povos originários pela Companhia de Jesus.',
              keyConcepts: [
                '**Literatura de Informação / dos Viajantes**: Relatos descritivos de caráter documental e mercantilista sobre a fauna, flora e os costumes dos nativos para a Coroa portuguesa. O documento fundador é a *Carta de Pero Vaz de Caminha* (1500), marcada pelo encantamento ingênuo com a fertilidade da terra ("em se plantando, tudo dá") e pela visão etnocêntrica sobre os indígenas nus.',
                '**Literatura de Catequese / Jesuítica**: Produção pedagógica e doutrinária liderada pelo Padre José de Anchieta com o objetivo de converter as populações originárias ao catolicismo. Utilizava o teatro alegórico (Autos religiosos bilíngues ou em tupi), poesias devocionais em redondilhas e a primeira sistematização gramatical da língua tupi-guarani (*Arte de Gramática da Língua Mais Usada na Costa do Brasil*).'
              ],
              tips: [
                'No ENEM, os textos quinhentistas são frequentemente cobrados em questões interdisciplinares com História, exigindo que o aluno desconstrua o olhar eurocêntrico e a visão idealizada da "terra prometida" colonial.'
              ]
            },
            {
              id: 'barroco-arcadismo',
              title: 'Barroco e Arcadismo: Conflito Espiritual e o Ideal Bucólico Iluminista',
              enemWeight: 'Média',
              summary: 'A tensão religiosa da Contrarreforma no século XVII e a busca pela clareza racional e equilíbrio pastoral no século do ouro.',
              keyConcepts: [
                '**Barroco** (Século XVII): Dualismo e angústia existencial entre o sagrado e o profano (Antropocentrismo vs. Teocentrismo). Estilo Cultista / Gongórico (jogos sonoros e de palavras, hipérbatos sintáticos e linguagem rebuscada) e Conceptista / Quevediano (jogo de conceitos, ideias e lógica argumentativa).',
                '**Autores Centrais do Barroco**: Gregório de Matos ("Boca do Inferno" - sátira mordaz denunciando a corrupção de Salvador e da Igreja, poesia lírico-amorosa e religiosa marcada pela culpa e súplica de perdão divino) e Padre Antônio Vieira (Sermões de retórica conceptista afiada, como o *Sermão da Sexagésima* sobre a arte da pregação e o *Sermão de Santo Antônio aos Peixes* atacando a ganância dos colonos escravocratas).',
                '**Arcadismo / Neoclassicismo** (Século XVIII em Vila Rica/MG): Influência do Iluminismo e da mineração. Rejeição aos exageros barrocos em busca da simplicidade harmônica da natureza campestre. Os lemas latinos arcádicos: *Fugere Urbem* (fugir da cidade agitada), *Locus Amoenus* (lugar tranquilo e ameno na natureza bucólica), *Inutilia Truncat* (cortar os excessos inúteis da linguagem), *Carpe Diem* (aproveitar o momento presente efêmero) e *Aurea Mediocritas* (vida dourada e comedida sem ganância).',
                '**Autores Centrais do Arcadismo**: Tomás Antônio Gonzaga (*Marília de Dirceu* e as *Cartas Chilenas*, poemas satíricos em versos decassílabos denunciando os abusos do governador Fanfarrão Minésio) e Cláudio Manuel da Costa. Estreita ligação dos poetas árcades com a conspiração da Inconfidência Mineira de 1789.'
              ],
              tips: [
                'No Arcadismo, os poetas adotavam pseudônimos pastoris (Gonzaga era "Dirceu", Cláudio Manuel era "Glauceste Satúrnio") e fingiam ser humildes pastores que cuidavam de rebanhos, mesmo sendo advogados e juízes urbanos de Vila Rica!'
              ]
            },
            {
              id: 'romantismo-nacionalismo',
              title: 'Romantismo no Brasil: Três Gerações Poéticas e em Prosa',
              enemWeight: 'Alta',
              summary: 'O projeto literário pós-Independência de 1822 para forjar os símbolos da nacionalidade brasileira.',
              keyConcepts: [
                '**Primeira Geração** (Nacionalista e Indianista): Exaltação da natureza tropical e idealização do indígena como o autêntico cavaleiro medieval brasileiro (Gonçalves Dias em "Canção do Exílio" e José de Alencar em *O Guarani* e *Iracema*).',
                '**Segunda Geração** (Ultrarromântica / Mal do Século): Melancolia profunda, tédio da vida, egocentrismo, atração pela noite e fuga na morte ou na idealização virginal da mulher amada (Álvares de Azevedo em *Lira dos Vinte Anos* e *Noite na Taverna*).',
                '**Terceira Geração** (Condoreira ou Hugoriana): Poesia social, republicana e abolicionista grandiloquente (Castro Alves em *O Navio Negreiro*, denunciando a monstruosidade do tráfico e as dores da escravidão nos porões dos navios).'
              ],
              tips: [
                'Lembre-se do motivo pelo qual os românticos da 1ª Geração escolheram o Indígena (e não o negro escravizado) como herói: a elite imperial brasileira queria construir um símbolo nacional heroico que não entrasse em atrito com a manutenção da escravidão africana, da qual eram economicamente dependentes.'
              ]
            },
            {
              id: 'realismo-machado',
              title: 'Realismo e a Ironia de Machado de Assis',
              enemWeight: 'Muito Alta',
              summary: 'A crítica mordaz às aparências e convenções da sociedade burguesa do Segundo Reinado na segunda metade do século XIX.',
              keyConcepts: [
                '**Machado de Assis** (Fase Realista): Inicia-se em 1881 com *Memórias Póstumas de Brás Cubas*; inaugura o narrador-defunto não confiável que, liberto do julgamento social, expõe a hipocrisia, mediocridade e o parasitismo da elite patriarcal carioca.',
                '**Recursos Machadianos Notáveis**: Ironia fina e cáustica, digressões filosóficas dirigidas diretamente ao leitor ("Tu tens pressa de envelhecer, e o livro anda devagar..."), pessimismo quanto à natureza humana e ambiguidade psicológica magistral (*Dom Casmurro* e a dúvida perpétua de Bentinho sobre Capitu).',
                '**Realismo vs. Naturalismo**: O Realismo analisa a psicologia e as hipocrisias da alma humana; o Naturalismo (*O Cortiço* de Aluísio Azevedo) é cientificista, enxerga o homem como mero joguete dos instintos e do meio sob determinismo biológico e zoomorfização das massas populares.'
              ],
              tips: [
                'No ENEM, Capitu traiu ou não Bentinho não é a questão central! A questão é a CONSTRUÇÃO DA NARRATIVA: o leitor tem acesso apenas ao ponto de vista ciumento e doentio de Bentinho, um narrador em primeira pessoa comprometido e parcial.'
              ]
            },
            {
              id: 'parnasianismo-simbolismo-estetica',
              title: 'Parnasianismo e Simbolismo: Rigor Formal versus Hermetismo Musical',
              enemWeight: 'Média',
              summary: 'Duas correntes poéticas simultâneas do final do século XIX: a frieza impassível da métrica perfeita parnasiana contra a sugestão sinestésica e mística do simbolismo.',
              keyConcepts: [
                '**Parnasianismo** ("A Arte pela Arte"): Reação anti-romântica. Obsessão pela perfeição formal da métrica (versos decassílabos e alexandrinos), rimas ricas e raras, contenção das emoções subjetivas e temas greco-latinos ou descrições estáticas de vasos e esculturas. Tríade Parnasiana: Olavo Bilac (*Profissão de Fé*, "Ouvir Estrelas"), Raimundo Correia e Alberto de Oliveira.',
                '**Simbolismo**: Reação contra o cientificismo mecanicista e o materialismo realista. Valorização do inconsciente, espiritualidade, estados de alma intangíveis, misticismo e hermetismo poético.',
                '**Recursos Estéticos Simbolistas**: Intensa exploração da Musicalidade ("de la musique avant toute chose"), aliterações sonoras expressivas, assonâncias, sinestesias (cruzamento sensorial de estímulos: "aroma suave e azul") e uso frequente de iniciais Maiúsculas para dar peso mítico e metafísico aos conceitos.',
                '**Cruz e Sousa ("O Cisne Negro")**: Maior poeta simbolista brasileiro (*Broquéis*, *Faróis*); expôs a angústia da segregação racial e o sofrimento humano envoltos em um universo de metáforas de brancura, transparência de marfim, dor e transcendência cósmica.'
              ],
              tips: [
                'O Modernismo de 1922 elegeu o Parnasianismo como seu maior inimigo estético a ser destruído! Manuel Bandeira ironizou cruelmente os parnasianos no célebre poema "Os Sapos", lido sob vaias históricas na Semana de 22.'
              ]
            },
            {
              id: 'pre-modernismo-denuncia-social',
              title: 'Pré-Modernismo: Transição Estética e Denúncia das Chagas Sociais do Brasil',
              enemWeight: 'Muito Alta',
              summary: 'Fase de transição (1902 a 1922) que rompeu com a alienação acadêmica e expôs sem retoques as realidades esquecidas do sertão abandonado, dos subúrbios e das desigualdades do início da República Velha.',
              keyConcepts: [
                '**Caráter Heterogêneo de Transição**: Não forma uma escola literária rígida, mas um conjunto de autores que mantêm estruturas formais prévias enquanto introduzem temáticas sociais urgentes e a linguagem viva do povo.',
                '**Euclides da Cunha** (*Os Sertões*, 1902): Relato monumental sobre a Guerra de Canudos articulado na tríade determinista "A Terra, O Homem, A Luta". Denuncia o massacre militar promovido pelo Estado contra os sertanejos liderados por Antônio Conselheiro e cunha a célebre definição: "O sertanejo é, antes de tudo, um forte".',
                '**Lima Barreto** (*Triste Fim de Policarpo Quaresma*, 1915): Sátira trágica ao ufanismo nacionalista cego e denúncia contundente do autoritarismo republicano de Floriano Peixoto, da burocracia estatal e do preconceito racial contra negros e suburbanos no Rio de Janeiro.',
                '**Monteiro Lobato** (*Urupês*, 1918): Criação do personagem Jeca Tatu, símbolo do caboclo caipira marginalizado, indolente não por preguiça congênita, mas pelo descaso das políticas públicas de saneamento e saúde básica ("O Jeca não é assim: ele está assim").',
                '**Augusto dos Anjos** (*Eu e Outras Poesias*, 1912): Poeta único e inclassificável que une forma parnasiana, angústia metafísica simbolista e vocabulário cru e cientificista (átomos, micróbios, decomposição da matéria e podridão biológica).'
              ],
              tips: [
                'No ENEM, Lima Barreto é um dos autores mais recorrentes: analise como sua narrativa confere protagonismo aos bairros periféricos e subúrbios ferroviários, historicamente ignorados pela literatura da elite da Belle Époque carioca.'
              ]
            },
            {
              id: 'modernismo-brasileiro',
              title: 'Modernismo Brasileiro: Semana de 22 e as Três Fases',
              enemWeight: 'Muito Alta',
              summary: 'O movimento de maior peso no ENEM. A busca por uma identidade artística genuinamente brasileira liberta dos moldes parnasianos e academicistas europeus.',
              keyConcepts: [
                '**Semana de Arte Moderna de 1922**: Realizada no Teatro Municipal de São Paulo por Mário de Andrade, Oswald de Andrade, Anita Malfatti, Menotti Del Picchia e Heitor Villa-Lobos; ruptura radical com o parnasianismo.',
                '**Primeira Fase Modernista** (1922-1930 - Fase Heroica e Destrutiva): Iconoclastia, verso livre sem métrica, poema-piada, humor irreverente, valorização da fala cotidiana brasileira e Manifestos (Manifesto Pau-Brasil e Movimento Antropofágico: deglutir a cultura estrangeira e recriá-la sob perspectiva brasileira com *Abaporu* de Tarsila do Amaral).',
                '**Segunda Fase Modernista** (1930-1945 - Geração de 30): Amadurecimento e denúncia social. Poesia intimista e engajada de Carlos Drummond de Andrade (*Sentimento do Mundo*), Cecília Meireles e Vinicius de Moraes; Romance Regionalista de 30 denunciando as misérias do Nordeste e a seca com Graciliano Ramos (*Vidas Secas* - Fabiano e a cadela Baleia), Jorge Amado (*Capitães da Areia*) e Rachel de Queiroz (*O Quinze*).',
                '**Terceira Fase Modernista** (1945 em diante - Geração de 45): Inovação e sondagem existencial. Clarice Lispector (introspecção psicológica, fluxo de consciência e epifanias no cotidiano feminino em *A Hora da Estrela*); João Guimarães Rosa (recriação neológica da linguagem sertaneja universal em *Grande Sertão: Veredas*).'
              ],
              tips: [
                'Em *Vidas Secas*, Graciliano Ramos utiliza uma linguagem enxuta, seca e desprovida de adjetivos desnecessários para mimetizar estilisticamente a aridez do sertão e a desumanização (zoomorfização) dos retirantes retirados de sua dignidade.'
              ]
            },
            {
              id: 'literatura-contemporanea-marginal',
              title: 'Literatura Contemporânea, Poesia Marginal e Vozes Periféricas',
              enemWeight: 'Muito Alta',
              summary: 'A pluralidade de vozes na literatura recente, a poesia mimeografada da ditadura e as narrativas de autoras e autores negros e periféricos.',
              keyConcepts: [
                '**Poesia Marginal / Geração Mimeógrafo** (Anos 1970): Produzida à margem das grandes editoras comerciais e sob a censura da ditadura militar; distribuição direta em bares e universidades através de mimeógrafos. Linguagem coloquial, humor instantâneo, visualidade concisa e quebra da solenidade poética (Chacal, Cacaso, Ana Cristina Cesar e Paulo Leminski com seus poemas haicais).',
                '**Literatura Periférica e de Resistência**: Carolina Maria de Jesus (*Quarto de Despejo: Diário de uma Favelada*, 1960: relato autobiográfico contundente da fome, miséria e luta pela sobrevivência na favela do Canindé em SP); Conceição Evaristo e a criação do conceito de "Escrevivência" (a escrita literária fundamentada nas vivências históricas e subjetivas das mulheres afro-brasileiras, como em *Ponciá Vicêncio* e *Olhos d\'Água*).',
                '**Poesia de Slam e Hip-Hop como Literatura Oral**: As batalhas de slam (poesia falada performática de intervenção urbana) e as letras dos Racionais MC\'s (*Sobrevivendo no Inferno*), hoje consagradas como obras literárias nos vestibulares e no ENEM pelo retrato cru das violências e da resistência da juventude negra periférica.'
              ],
              tips: [
                'O conceito de "Escrevivência" de Conceição Evaristo é repertório excepcional para o ENEM: significa que a experiência vivida de opressão e superação do povo negro se transforma no próprio motor estético e narrativo da obra literária.'
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'interpretacao-textual',
      name: 'Interpretação e Gêneros Textuais',
      description: 'Competência leitora crítica, decodificação de elementos comunicativos e análise multimodal.',
      topics: [
        {
          id: 'generos-discurso',
          title: 'Gêneros do Discurso e Comunicação',
          description: 'Tipologia textual, funções da linguagem e intertextualidade.',
          subtopics: [
            {
              id: 'funcoes-da-linguagem',
              title: 'As 6 Funções da Linguagem de Roman Jakobson',
              enemWeight: 'Muito Alta',
              summary: 'A linguagem varia em função do foco comunicativo predominante no ato interlocutivo.',
              keyConcepts: [
                '**Função Emotiva / Expressiva** (Foco no Emissor): Expressão de sentimentos subjetivos, opiniões em primeira pessoa ("eu"), interjeições e pontuação enfática (diários íntimos, poemas confessionais).',
                '**Função Conativa / Apelativa** (Foco no Receptor): Intenção de persuadir, orientar ou ordenar o interlocutor, com verbos no imperativo, pronomes de tratamento e vocativos (anúncios publicitários, manuais de instrução, discursos eleitorais).',
                '**Função Referencial / Denotativa** (Foco no Referente/Contexto): Transmissão neutra, objetiva e direta de informações verídicas, em 3ª pessoa e linguagem denotativa (reportagens jornalísticas, artigos científicos, livros didáticos).',
                '**Função Metalinguística** (Foco no Código): O código linguístico explicando o seu próprio código (o dicionário definindo palavras, um poema sobre o ato de escrever poesia, um filme sobre cinema).',
                '**Função Fática** (Foco no Canal): Manutenção, teste ou encerramento do contato comunicativo ("Alô?", "Entendeu?", "Boa tarde", acenos de cabeça).',
                '**Função Poética** (Foco na Mensagem): Trabalho estético e criativo com a forma, sonoridade, ritmo, rimas e arranjo das palavras.'
              ],
              tips: [
                'Textos publicitários combinam tipicamente a Função CONATIVA (para induzir a compra ou adoção de comportamento) com a Função POÉTICA (slogans com rimas e jogos visuais de palavras).'
              ]
            },
            {
              id: 'generos-digitais-jornalisticos',
              title: 'Gêneros Digitais, Tiras, Charges e Multimodalidade',
              enemWeight: 'Muito Alta',
              summary: 'A interpretação combinada da linguagem verbal e não verbal em charges políticas, tirinhas humorísticas, memes e infográficos estatísticos.',
              keyConcepts: [
                '**Charge vs. Cartum**: A Charge critica um acontecimento político-social pontual e passageiro da atualidade noticiosa; o Cartum aborda temas humanos universais e atemporais com humor.',
                '**Multimodalidade**: A construção do sentido depende obrigatoriamente da relação dialógica entre a imagem visual (expressões faciais, gestos, cores, metáforas gráficas) e as falas nos balões.',
                '**Intertextualidade Explícita e Implícita**: O diálogo intencional de um texto com outras obras culturais prévias (paródia desconstruindo com humor, paráfrase reafirmando com outras palavras, e alusão).'
              ],
              tips: [
                'Nunca analise a fala da tirinha de forma isolada do desenho! Muitas vezes o humor ou a crítica reside exatamente na ironia entre o que o personagem fala e o que a sua expressão corporal contradiz.'
              ]
            },
            {
              id: 'tecnologias-digitais-letramento-desinformacao',
              title: 'Tecnologias Digitais da Informação, Multiletramentos e Desinformação',
              enemWeight: 'Muito Alta',
              summary: 'A leitura crítica na era da hipermídia, a estrutura dos algoritmos de recomendação, as bolhas informacionais e o combate às notícias fraudulentas (fake news).',
              keyConcepts: [
                '**Letramento Digital e Multiletramentos** (Rojo): Capacidade não apenas de operar dispositivos técnicos, mas de decodificar criticamente textos multimodais, avaliar a confiabilidade de fontes na web e produzir conteúdo ético e responsável.',
                '**Hipertexto e Não Linearidade**: O texto digital estruturado em blocos interconectados por hiperlinks, permitindo que cada leitor trace um itinerário de leitura único, descentralizado e fragmentado.',
                '**Algoritmos de Recomendação e Bolhas Ideológicas**: Plataformas digitais programadas para maximizar o tempo de retenção e o engajamento através de conteúdos que confirmam os vieses cognitivos prévios do usuário, criando "câmaras de eco" que polarizam o debate público.',
                '**Desinformação (*Fake News*) e Pós-Verdade**: Circulação massiva de conteúdos fabricados que apelam para emoções imediatas e preconceitos em detrimento de fatos verificados; o papel das agências profissionais de checagem de fatos (*fact-checking*).',
                '**Inteligência Artificial e Linguagem**: Desafios éticos de autoria, reprodução de preconceitos algorítmicos em modelos de linguagem e a necessidade do senso crítico humano na curadoria das respostas automatizadas.'
              ],
              tips: [
                'No ENEM, questões sobre letramento digital nunca focam em aspectos operacionais (como "como abrir um navegador"), mas sim nas consequências SOCIAIS e COGNITIVAS do uso das redes: polarização, vigilância de dados e democratização do saber.'
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'redacao-enem',
      name: 'Redação Dissertativo-Argumentativa',
      description: 'Guia definitivo e operacional para alcançar a nota 1000 nas cinco competências avaliadas pelo INEP.',
      topics: [
        {
          id: 'competencias-redacao',
          title: 'Estrutura Completa e as 5 Competências do ENEM',
          description: 'A matriz oficial de avaliação e o passo a passo da tese à proposta de intervenção.',
          subtopics: [
            {
              id: 'proposta-intervencao-completa',
              title: 'Proposta de Intervenção Nota Máxima (Competência 5)',
              enemWeight: 'Muito Alta',
              summary: 'A Competência 5 avalia a capacidade do participante de propor uma solução prática, exequível e cidadã para o problema discutido, respeitando rigorosamente os direitos humanos.',
              keyConcepts: [
                '**Elemento 1**: AGENTE (Quem executará a ação?): Deve ser um órgão específico e competente, evitando generalizações vagas como "as pessoas" ou "a sociedade". Exemplos legítimos: "Ministério da Educação (MEC)", "Ministério da Saúde", "Poder Legislativo", "Secretarias Municipais de Educação", "Conselhos Tutelares".',
                '**Elemento 2**: AÇÃO (O que deve ser feito?): Proposta concreta e prática, expressa por verbo de ação no infinitivo (ex.: "instituir núcleos de apoio psicossocial", "ampliar a fiscalização das empresas poluidoras"). Ações puramente vagas como "devemos nos conscientizar" não pontuam!',
                '**Elemento 3**: MODO / MEIO (Como ou por meio de quê a ação será executada?): O mecanismo operacional da medida, introduzido por expressões conectivas obrigatórias ("por intermédio de...", "mediante a alocação de verbas orçamentárias...", "através de parcerias público-privadas...").',
                '**Elemento 4**: EFEITO / FINALIDADE (Para que a ação serve?): A consequência esperada que resolve ou atenua o problema tese, introduzida por conectivos de finalidade ("com o fito de...", "a fim de mitigar a exclusão social...", "com o objetivo de consolidar a dignidade cidadã...").',
                '**Elemento 5**: DETALHAMENTO (Aprofundamento de um dos quatro elementos anteriores): Adição de uma explicação técnica, exemplo pontual ou justificativa sobre o agente, a ação, o meio ou o efeito (ex.: detalhar o meio explicando a origem das verbas: "mediante convênios com universidades federais — instituições de excelência científica na formação docente —...").'
              ],
              tips: [
                'Para garantir os 200 pontos da C5 com segurança: estruture a proposta no último parágrafo de forma nítida, com todos os 5 elementos grafados com clareza. Você precisa de apenas UMA proposta completa com os 5 elementos para gabaritar a competência!'
              ]
            },
            {
              id: 'repertorio-sociocultural',
              title: 'Repertório Sociocultural Legitimado, Pertinente e Produtivo (Competência 2)',
              enemWeight: 'Muito Alta',
              summary: 'O uso de áreas do conhecimento humano (filosofia, sociologia, história, literatura e dados estatísticos) para respaldar e validar os argumentos desenvolvidos.',
              keyConcepts: [
                '**Legitimação**: O repertório deve provir de áreas consolidadas do saber científico ou cultural (nomes reconhecidos como Zygmunt Bauman, Gilberto Dimenstein, Constituição Federal de 1988, IBGE, filósofos clássicos).',
                '**Pertinência Temática**: O repertório precisa guardar relação direta com pelo menos uma das palavras-chave do tema da redação.',
                '**Produtividade Argumentativa**: O repertório NÃO pode ficar solto ou jogado como mero enfeite! O autor DEVE explicar e conectar o conceito teórico explicitamente à tese e ao problema contemporâneo abordado no parágrafo.'
              ],
              tips: [
                'Coringas clássicos de alta produtividade: Artigo 6º ou 225 da Constituição de 1988 (direitos sociais e meio ambiente); o conceito de "Cidadão de Papel" de Gilberto Dimenstein (leis perfeitas na teoria que não se cumprem na prática); a "Modernidade Líquida" de Zygmunt Bauman (fragilização dos laços e instituições).'
              ]
            },
            {
              id: 'projeto-de-texto-conectivos',
              title: 'Projeto de Texto e Coesão Interparágrafos (Competências 3 e 4)',
              enemWeight: 'Muito Alta',
              summary: 'A articulação estratégica do texto em 4 parágrafos equilibrados e o encadeamento formal através de operadores argumentativos.',
              keyConcepts: [
                '**Estrutura em 4 Parágrafos Padrão**: 1) Introdução (contextualização com repertório + tese com Argumento 1 e Argumento 2 explicitados); 2) D1 (desenvolvimento focado exclusivamente no Argumento 1 com repertório e desfecho crítico); 3) D2 (desenvolvimento do Argumento 2, preferencialmente mostrando a conivência estatal ou raiz histórica); 4) Conclusão (proposta de intervenção completa com os 5 elementos + frase de fechamento reflexiva retomando o repertório inicial).',
                '**Coesão Interparágrafos Obrigatória** (C4): É obrigatório iniciar os parágrafos D1, D2 e Conclusão com operadores argumentativos interparágrafos (ex.: no D2: "Ademais,", "Outrossim,", "Sob esse prisma,"; na Conclusão: "Portanto,", "Infere-se, destarte, que...").',
                '**Coesão Intraparágrafos**: Diversidade de conectivos dentro dos próprios períodos de cada parágrafo, evitando repetição enfadonha das mesmas palavras.'
              ],
              tips: [
                'Se você não colocar conectivo interparágrafo no início do D2 e no início da Conclusão, a sua nota na Competência 4 fica travada no teto máximo de 120 ou 160 pontos, mesmo que o restante do texto esteja bem redigido!'
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'artes-educacao-fisica',
      name: 'Artes e Educação Física',
      description: 'História da arte, movimentos de vanguarda e a cultura corporal de movimento.',
      topics: [
        {
          id: 'vanguardas-cultura-corporal',
          title: 'Artes Visuais e Práticas Corporais',
          description: 'Rupturas estéticas modernas e a dimensão sociopolítica do corpo humano.',
          subtopics: [
            {
              id: 'vanguardas-europeias',
              title: 'Vanguardas Artísticas Europeias do Início do Século XX',
              enemWeight: 'Alta',
              summary: 'Movimentos de vanguarda que romperam definitivamente com a arte mimética e acadêmica no contexto da Primeira Guerra Mundial e da industrialização.',
              keyConcepts: [
                '**Cubismo** (Pablo Picasso): Decomposição dos planos geométricos e exibição simultânea de múltiplos pontos de vista de um mesmo objeto em uma tela plana.',
                '**Futurismo** (Filippo Marinetti): Exaltação da velocidade, da máquina, da tecnologia industrial e do dinamismo acelerado.',
                '**Expressionismo** (Edvard Munch em *O Grito*): Deformação deliberada da realidade visual para expressar a angústia existencial e as dores da alma humana.',
                '**Dadaísmo** (Marcel Duchamp): O ápice do niilismo antiarte como repúdio ao horror irracional da Primeira Guerra; invenção do *Ready-made* (deslocamento de objetos industriais utilitários, como um mictório em *A Fonte*, para o espaço de museu, questionando a essência da arte).',
                '**Surrealismo** (Salvador Dalí e René Magritte): Exploração do inconsciente, dos sonhos, do delírio e da psicanálise de Freud através de imagens oníricas e justaposições ilógicas.'
              ],
              tips: [
                'As vanguardas europeias forneceram o arsenal estético que foi antropofagicamente deglutido pelos modernistas brasileiros na Semana de 22.'
              ]
            },
            {
              id: 'arte-brasileira-patrimonio-tropicalismo',
              title: 'Arte Brasileira: Modernismo, Patrimônio Cultural e Tropicália',
              enemWeight: 'Alta',
              summary: 'A busca pela visualidade nacional com Tarsila e Portinari, a proteção do patrimônio histórico-cultural e a revolução sensorial dos Parangolés nos anos 1960.',
              keyConcepts: [
                '**Modernismo nas Artes Plásticas**: A ruptura com o academicismo na Semana de 22. Tarsila do Amaral (*Abaporu*, *Antropofagia*, *Operários* - denúncia da exploração fabril e diversidade étnica da massa trabalhadora); Candido Portinari (*Os Retirantes*, retratando com paleta terrosa e traços expressionistas a dor e a fome dos migrantes nordestinos; painéis *Guerra e Paz* na sede da ONU).',
                '**Patrimônio Material vs. Imaterial** (IPHAN): Patrimônio Material compreende bens tangíveis tombados (cidades históricas como Ouro Preto, igrejas barrocas de Aleijadinho, o plano piloto de Brasília); Patrimônio Imaterial compreende saberes, celebrações e formas de expressão registradas (frevo, ofício das baianas de acarajé, literatura de cordel, maracatu e capoeira).',
                '**Neoconcretismo e Arte Participativa** (Anos 1950/60): Ruptura com o quadro estático de parede. Lygia Clark (esculturas dobráveis articuladas pelos espectadores chamadas *Bichos*) e Hélio Oiticica (*Parangolés* - capas de tecido colorido feitas para serem vestidas e movimentadas pelo corpo do passista de samba).',
                '**Movimento Tropicalista** (1967-1968): Movimento de contracultura durante a ditadura militar que fundiu a estética pop, a guitarra elétrica do rock e a tradição brasileira (Caetano Veloso, Gilberto Gil, Gal Costa, Torquato Neto e Tom Zé).'
              ],
              tips: [
                'No ENEM, patrimônio imaterial é uma das temáticas mais certas em Artes: lembre-se de que ele não pode ser "tombado" como um prédio de pedra, mas sim "registrado" em livros de salvaguarda cultural, pois sua existência depende da transmissão oral e da prática continuada da comunidade!'
              ]
            },
            {
              id: 'educacao-fisica-saude-padroes',
              title: 'Educação Física: Padrões Corporais, Esporte e Inclusão Social',
              enemWeight: 'Alta',
              summary: 'A crítica à mercantilização dos corpos pela mídia e a potência do esporte na promoção dos direitos humanos.',
              keyConcepts: [
                '**Padrões Inatingíveis de Beleza e Vigorexia**: A construção midiática do corpo ideal musculoso ou excessivamente magro, gerando transtornos alimentares (anorexia, bulimia) e uso prejudicial de anabolizantes sintéticos.',
                '**Esporte de Rendimento vs. Esporte Cidadão**: A diferença entre o esporte profissional voltado ao lucro financeiro e à competição extrema versus o esporte educacional e comunitário voltado à cooperação e saúde integral.',
                '**Paradesporto e Inclusão**: A superação de barreiras arquitetônicas e preconceitos através de modalidades paralímpicas adaptadas.'
              ],
              tips: [
                'O ENEM aborda as práticas corporais e danças (como o frevo, maracatu e capoeira) como patrimônio imaterial identitário, e não meramente como queima calórica ou condicionamento físico cardiovascular.'
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'lingua-estrangeira',
      name: 'Língua Estrangeira Moderna (Inglês e Espanhol)',
      description: 'Competências de leitura instrumental, inferência de sentido e análise discursiva crítica.',
      topics: [
        {
          id: 'lingua-inglesa-enem',
          title: 'Língua Inglesa Instrumental',
          description: 'Técnicas de leitura e decodificação crítica de textos autênticos em língua inglesa.',
          subtopics: [
            {
              id: 'ingles-estrategias-leitura',
              title: 'Estratégias de Leitura: Skimming, Scanning e Falsos Cognatos',
              enemWeight: 'Muito Alta',
              summary: 'Leitura objetiva voltada à resolução das 5 questões do ENEM sem necessidade de tradução literal de cada vocábulo.',
              keyConcepts: [
                '**Skimming**: Leitura panorâmica inicial rápida (título, subtítulo, primeira linha de cada parágrafo e imagem) para captar a ideia central e o objetivo discursivo do texto.',
                '**Scanning**: Busca visual direcionada por termos específicos solicitados pelo enunciado da questão (nomes próprios, números, datas, palavras-chave).',
                '**Falsos Cognatos** (*False Friends*): Palavras com grafia semelhante ao português, mas com significados totalmente distintos. Exemplos clássicos: *Actually* (na verdade/realmente, e NÃO atualmente); *Pretend* (fingir, e NÃO pretender); *Intend* (pretender); *Attend* (assistir/comparecer a uma reunião, e NÃO atender); *Notice* (notar/perceber, e NÃO notícia); *Push* (empurrar, e NÃO puxar); *Pull* (puxar).',
                '**Operadores Discursivos Críticos**: *However, Nevertheless* (no entanto); *Although, Even though* (embora); *Therefore, Thus* (portanto); *In addition, Furthermore* (além disso); *Whereas, While* (enquanto que / contraste).'
              ],
              tips: [
                'Leia SEMPRE o enunciado e as alternativas em português ANTES de ler o texto em inglês! Isso orienta seu cérebro a fazer o scanning com uma meta precisa de busca no texto.'
              ]
            },
            {
              id: 'ingles-generos-tiras',
              title: 'Interpretação de Tiras, Charges e Letras de Música em Inglês',
              enemWeight: 'Alta',
              summary: 'Identificação de humor, ironia e crítica social expressa em produções culturais da esfera de língua inglesa.',
              keyConcepts: [
                '**Duplo Sentido e Trocadilhos** (*Puns*): Palavras polissêmicas exploradas para criar surpresa e riso no desfecho de tirinhas (como *Calvin and Hobbes* ou *Garfield*).',
                '**Voz Passiva e Linguagem Formal**: Construções impessoais em notícias de divulgação científica da *BBC* ou *The Guardian* (*"It is believed that...", "A new study has shown..."*).'
              ],
              tips: [
                'Atenção ao tom do autor: identifique se o autor está concordando, criticando satiricamente ou mantendo neutralidade em relação ao fato apresentado.'
              ]
            }
          ]
        },
        {
          id: 'lingua-espanhola-enem',
          title: 'Língua Espanhola Instrumental',
          description: 'Decodificação e inferência crítica em textos jornalísticos e literários do mundo hispânico.',
          subtopics: [
            {
              id: 'espanhol-heterossemanticos',
              title: 'Heterossemânticos (Falsos Amigos) e Marcadores Discursivos',
              enemWeight: 'Muito Alta',
              summary: 'As armadilhas semânticas mais perigosas da prova de espanhol do ENEM que induzem o estudante ao erro por semelhança ilusória com o português.',
              keyConcepts: [
                '**Heterossemânticos Principais**: *Embarazada* = grávida (NÃO envergonhada); *Exquisito* = saboroso/delicioso (NÃO esquisito); *Rato* = pequeno momento/instante (NÃO o animal roedor, que é *ratón*); *Apellido* = sobrenome (NÃO apelido, que é *apodo*); *Propina* = gorjeta dada ao garçom (NÃO propina de corrupção); *Largo* = comprido (NÃO largo, que é *ancho*); *Cuello* = pescoço; *Taller* = oficina mecânica ou ateliê.',
                '**Heterogenéricos** (Mesma palavra com gênero gramatical invertido): *La costumbre* (a tradição/costume - feminino em espanhol, masculino em português); *La leche* (o leite); *La sangre* (o sangue); *El viaje* (a viagem - masculino em espanhol, feminino em português); *El color* (a cor); *El árbol* (a árvore).',
                '**Conectivos Discursivos**: *Sin embargo* (no entanto); *Por lo tanto* (portanto); *Mientras* (enquanto); *A pesar de* (apesar de); *Além disso* (*Además*).'
              ],
              tips: [
                'Cuidado extremo com o "Portunhol": a maior causa de erros no espanhol do ENEM é a falsa sensação de facilidade. Se uma palavra parecer idêntica ao português mas o sentido no contexto soar estranho, desconfie de imediato de um falso cognato.'
              ]
            },
            {
              id: 'espanhol-artigos-opiniao',
              title: 'Textos de Opinião e Manifestações Culturais da América Latina',
              enemWeight: 'Alta',
              summary: 'Análise de artigos opinativos de jornais ibero-americanos (*El País, Clarín*) e valorização da identidade dos povos originários e afro-latino-americanos.',
              keyConcepts: [
                '**Marcadores de Subjetividade**: Expressões que revelam a opinião do autor (*"A mi juicio", "Desde mi perspectiva", "Resulta imprescindible"*).',
                '**Crítica Social nas Tiras Hispânicas**: Tiras consagradas como *Mafalda* (de Quino) articulando críticas agudas ao consumismo capitalista, à guerra e à apatia política.'
              ],
              tips: [
                'Em tirinhas como as da Mafalda, a resposta correta quase sempre envolve uma reflexão crítica sobre a ingenuidade das crianças revelando as contradições e hipocrisias do mundo dos adultos.'
              ]
            }
          ]
        }
      ]
    }
  ]
};
