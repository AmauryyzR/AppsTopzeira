import { Discipline } from '../../../types/curriculum';

export const filosofia: Discipline = {
  id: 'filosofia',
  name: 'Filosofia',
  description: 'Ética, epistemologia, filosofia política clássica e moderna, teoria crítica e a questão da justiça e dos direitos humanos.',
  topics: [
    {
      id: 'filosofia-antiga-etica',
      title: 'Filosofia Antiga: Da Mitologia à Ética Clássica',
      description: 'A passagem do mito ao logos, a busca pela verdade em Sócrates e Platão e a ética teleológica aristotélica.',
      subtopics: [
        {
          id: 'socrates-platao-aristoteles',
          title: 'A Tríade Clássica: Sócrates, Platão e Aristóteles',
          enemWeight: 'Muito Alta',
          summary: 'Os pilares do pensamento ocidental sobre virtude, conhecimento verdadeiro, mundo das ideias e organização da pólis grega.',
          keyConcepts: [
            'Sócrates e o Método Dialético: "Só sei que nada sei". Ironia socrática (desconstruir falsas certezas e preconceitos do interlocutor) seguida pela Maiêutica ("dar à luz novas ideias", auxiliando o cidadão a descobrir a virtude e o conhecimento racional dentro de si próprio). Preocupação primordial com a ética e a conduta justa na cidade.',
            'Platão e a Teoria das Ideias (Dualismo Ontológico): Divisão entre Mundo Sensível (material, imperfeito, ilusório e mutável, acessado pelos sentidos corporais) e Mundo Inteligível (onde residem as essências eternas, perfeitas e imutáveis das coisas, acessadas apenas pela razão pura). Mito da Caverna: alegoria da libertação da ignorância das sombras rumo à luz do Bem e da verdade filosófica. Projeto político: a República governada pelo Rei-Filósofo (sofocracia).',
            'Aristóteles e a Ética da Mediania (Eudaimonia): Crítica ao dualismo platônico; o conhecimento começa na observação empírica do mundo real. O fim supremo da vida humana é a Eudaimonia (felicidade plena realizada pelo cultivo da virtude racional). Teoria do Meio-Termo / Justa Medida (*Aurea Mediocritas*): a virtude moral reside no equilíbrio equidistante entre o excesso e a falta (ex.: a coragem é a justa medida entre a covardia e a temeridade imprudente). Definição do ser humano como *Zoon Politikon* (animal político que só atinge sua plenitude participando da vida comunitária na pólis).'
          ],
          tips: [
            'Questão recorrente no ENEM: A ética aristotélica da justa medida é prática e adquirida pelo HÁBITO e pela repetição de ações equilibradas na convivência com os demais cidadãos da comunidade, e não apenas por teorização abstrata.'
          ]
        },
        {
          id: 'helenismo-epicurismo-estoicismo',
          title: 'Filosofia Helenística: Estoicismo, Epicurismo e Ceticismo',
          enemWeight: 'Alta',
          summary: 'A busca pela tranquilidade interior da alma (ataraxia) após a crise e perda de autonomia da pólis grega.',
          keyConcepts: [
            'Contexto Helenístico: Após a conquista da Grécia pelo Império Macedônio de Alexandre, o Grande, o cidadão perdeu a participação política direta na pólis. A filosofia voltou-se para a ética pessoal e a busca pela paz de espírito e felicidade individual.',
            'Epicurismo (Epicuro de Samos): A busca do prazer comedido e natural (*hedoné*) como ausência de dor física e perturbação da alma (*aponia* e *ataraxia*). Diferenciação de prazeres: os naturais e necessários (amizade, água, alimento simples) devem ser cultivados; os ilusórios e desnecessários (riqueza excessiva, poder político e fama) geram ansiedade e sofrimento. Superação do medo dos deuses e da morte ("a morte nada é para nós, pois quando existimos ela não está, e quando ela chega nós já não existimos").',
            'Estoicismo (Zenão de Cítio, Sêneca, Epicteto e Marco Aurélio): A virtude consiste em viver em harmonia com a Razão Cósmica universal (Logos). Distinção crucial entre aquilo que está sob nosso controle direto (nossas opiniões, desejos e reações) e aquilo que não depende de nós (o destino, a riqueza, a saúde dos outros). Cultivo da impassibilidade serena diante das adversidades (*apatheia*).',
            'Ceticismo Pirrônico (Pirro de Élis): Como não podemos ter certeza definitiva sobre a essência real das coisas, deve-se praticar a suspensão de juízo (*epoché*), atingindo a tranquilidade da alma pela recusa em emitir dogmas absolutos.'
          ],
          tips: [
            'No estoicismo para o ENEM: O sábio estoico não tenta controlar os acontecimentos externos do destino, mas sim a sua própria ATITUDE e postura moral perante as adversidades inevitáveis da vida.'
          ]
        }
      ]
    },
    {
      id: 'filosofia-politica-moderna-critica',
      title: 'Filosofia Política Moderna e Pensamento Crítico Contemporâneo',
      description: 'O contratualismo social, a ética do dever de Kant, a Teoria Crítica e a biopolítica contemporânea.',
      subtopics: [
        {
          id: 'contratualismo-hobbes-locke-rousseau',
          title: 'Os Contratualistas: Thomas Hobbes, John Locke e Jean-Jacques Rousseau',
          enemWeight: 'Muito Alta',
          summary: 'A transição do Estado de Natureza para a Sociedade Civil e a legitimação racional da soberania política e dos direitos humanos.',
          keyConcepts: [
            'Thomas Hobbes (*O Leviatã*): No estado de natureza pré-social, o ser humano é movido pelo medo e egoísmo ("o homem é o lobo do próprio homem" - *homo homini lupus*), vivendo em uma "guerra de todos contra todos". Para garantir a preservação da própria vida e a paz, os indivíduos celebram um pacto de submissão voluntária, transferindo todo o monopólio da força para um soberano absoluto inquestionável (o Estado Leviatã).',
            'John Locke (*Segundo Tratado sobre o Governo Civil* - Pai do Liberalismo Político): No estado de natureza, os indivíduos já possuem Direitos Naturais inalienáveis dados pela razão divina: direito à Vida, à Liberdade e à Propriedade Privada (fruto do trabalho individual). O Estado civil surge através de um contrato de consentimento mútuo unicamente para atuar como árbitro imparcial que protege e garante esses direitos pré-existentes. Se o governante violar esses direitos, o povo tem o legítimo Direito de Resistência e rebelião.',
            'Jean-Jacques Rousseau (*Do Contrato Social*): No estado de natureza original, o ser humano era livre, íntegro e pacífico ("o bom selvagem"), guiado pela autopreservação e pela piedade. A desigualdade e a corrupção moral surgiram no momento em que alguém cercou um pedaço de terra e disse "isto é meu" (instituição da propriedade privada). A solução é um novo Contrato Social baseado na Soberania Popular e na Vontade Geral coletiva, onde a lei expressa o bem comum e a liberdade política é a obediência à lei que nós mesmos prescrevemos.'
          ],
          tips: [
            'Quadro resumo para o ENEM: Hobbes fundamenta o Absolutismo para salvar o homem de si mesmo; Locke fundamenta o Liberalismo e a proteção da propriedade privada; Rousseau fundamenta a Democracia Direta e a Soberania Popular orientada pelo bem comum.'
          ]
        },
        {
          id: 'etica-kant-imperativo-categorico',
          title: 'Ética Deontológica de Immanuel Kant e o Imperativo Categórico',
          enemWeight: 'Muito Alta',
          summary: 'A moral baseada estritamente no dever racional puro e na dignidade humana inegociável.',
          keyConcepts: [
            'Deontologia Kantiana (Moral do Dever): Uma ação só possui genuíno valor moral se for praticada por puro dever e respeito à lei moral racional, e não por interesse egoísta, medo de punição ou busca de recompensa/vantagem pessoal.',
            'Imperativo Categórico (Lei Moral Universal): Mandamento moral incondicional que orienta a razão prática. Primeira Formulação: "Age apenas segundo uma máxima tal que possas ao mesmo tempo querer que ela se torne uma lei universal". Se a ação não puder ser universalizada sem gerar contradição lógica (ex.: mentir para se livrar de um problema), ela é moralmente reprovável.',
            'Segunda Formulação do Imperativo Categórico (O Princípio da Dignidade Humana): "Age de tal maneira que uses a humanidade, tanto na tua pessoa como na pessoa de qualquer outro, sempre e simultaneamente como um FIM em si mesmo, e NUNCA simplesmente como um meio/instrumento para satisfazer interesses particulares". Base filosófica dos Direitos Humanos universais.',
            'Esclarecimento (*Aufklärung*) e Maioridade Intelectual: A coragem de pensar por si mesmo (*Sapere Aude!*), superando a menoridade tutelada onde outros decidem e pensam pelo indivíduo.'
          ],
          tips: [
            'Kant opõe-se frontalmente ao Utilitarismo (de Bentham e Stuart Mill): para os utilitaristas, o valor moral de uma ação mede-se pelas consequências úteis (a maior felicidade para o maior número de pessoas); para Kant, a ação deve ser justa por princípio incondicional, mesmo que suas consequências sejam difíceis.'
          ]
        },
        {
          id: 'filosofia-contemporanea-arendt-foucault-habermas',
          title: 'Filosofia Contemporânea: Hannah Arendt, Foucault e Habermas',
          enemWeight: 'Muito Alta',
          summary: 'O totalitarismo e a banalidade do mal, a microfísica das relações de poder e a ética do discurso comunicativo.',
          keyConcepts: [
            'Hannah Arendt e a "Banalidade do Mal" (*Eichmann em Jerusalém*): Ao cobrir o julgamento do burocrata nazista Adolf Eichmann, Arendt constatou que os piores crimes contra a humanidade não foram cometidos apenas por sádicos ou monstros demoníacos, mas por funcionários burocráticos ordinários que simplesmente abdicaram da capacidade crítica de pensar e julgar moralmente suas ordens, operando como meras engrenagens cegas da máquina estatal totalitária.',
            'Michel Foucault: Microfísica do Poder e Sociedade Disciplinar: O poder não está apenas concentrado no topo do Estado; ele é capilar, difuso e circula por toda a rede de instituições cotidianas (escolas, prisões, hospitais, fábricas e quartéis). Utiliza o modelo arquitetônico do Panóptico de Bentham (vigilância constante e invisível que induz o indivíduo a policiar a si próprio). Conceito de Biopolítica e Biopoder: a gestão e o controle governamental dos corpos, taxas de natalidade, longevidade e saúde de populações inteiras ("fazer viver e deixar morrer").',
            'Jürgen Habermas e a Teoria da Ação Comunicativa: Crítica à razão puramente instrumental que reduz tudo a cálculo técnico e lucro. Defesa da Razão Dialógica e Comunicativa: o consenso político legítimo e as normas sociais justas devem nascer do debate público livre de coação na Esfera Pública, onde vence não a força física ou a autoridade hierárquica, mas unicamente a força do melhor argumento racional fundamentado.'
          ],
          tips: [
            'A "Banalidade do Mal" de Hannah Arendt é tema recorrente no ENEM e excelente repertório sociocultural para a Redação: evidencia como a falta de reflexão crítica individual e o conformismo cego a regras institucionais conduzem à conivência com a violência sistêmica.'
          ]
        }
      ]
    }
  ]
};
