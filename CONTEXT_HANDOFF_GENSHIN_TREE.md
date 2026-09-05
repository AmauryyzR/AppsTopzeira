# RESUMO EXECUTIVO E CONTEXTO COMPLETO PARA A NOVA CONVERSA
## Projeto: Árvore Low-Poly Nível Genshin Impact / Studio Ghibli (Modular 3D)

> **Data de Gravação:** 04/09/2026  
> **Comando de Origem:** `/learn` e `/gauntlet-loop`  
> **Status do Servidor Local:** Vite ativo na porta `5000` (`http://localhost:5000/models` e `http://localhost:5000/3dgame`).  
> **Build Status:** `npm run build` passa com código `0` (`tsc -b && vite build`).

---

### 1. O Que Foi Aprendido e Correções Cruciais do Usuário (Regras de Ouro)

1. **A Regra da Modularidade Singular (Erro Fundamental Corrigido):**
   - *Feedback do Usuário:* *"Acho que seu erro do início foi fazer vários galhos juntos como um elemento só. Vc deveria ter feito apenas um galho por vez."*
   - *Regra Fixada:* **NÃO** tente gerar a copa inteira ou 5 galhos simultaneamente em uma malha acoplada. Construa, ajuste e aperfeiçoe **UM ÚNICO GALHO MESTRE MODULAR** (`LowPolyBranch.ts`). Quando esse galho isolado estiver perfeito (formato sinuoso, colar de encaixe, 2 ramificações secundárias limpas e buquês de folhas nas pontas sem nenhum graveto exposto), a árvore completa (`LowPolyTree.ts`) será apenas a montagem desse mesmo galho instanciado e rotacionado nos soquetes do tronco!

2. **Remoção de Raízes / Base Elegante Limpa:**
   - *Feedback do Usuário:* *"raizes estao feias, remova as raizes."*
   - As raízes separadas (spurs/runners) pareciam "tentáculos", "cascas de banana" ou lâminas cortadas sobre o chão.
   - Foram completamente removidas do modelo. O tronco agora usa uma base afunilada em sino (*grounded bell flare*) contínua que pousa suavemente no chão a $y=0$, limpa e sem ruído visual.

3. **Eliminação dos Gravetos Furando as Folhas (Efeito "Porco-Espinho"):**
   - Na visão aérea (top-down), gravetos marrons estavam atravessando e furando as pontas das folhas porque os cilindros de suporte tinham comprimento maior que o leque de folhas.
   - *Correção:* A haste de suporte de madeira deve parar no máximo a 25% a 35% da base do tufo foliar. As folhas do topo formam uma cúpula verde contínua em leque protetor. **Zero gravetos visíveis de cima.**

4. **Fechamento do Undercanopy (Soffit Foliar):**
   - Ao olhar de baixo para cima, não podem existir "buracos negros" ou tetos ocos. Cada cacho foliar possui folhas inferiores (*soffit*) inclinadas para baixo e para dentro, vedando o fundo do tufo foliar e criando sombra densa e folhas verdes abraçando os galhos.

5. **Continuidade Matemática de Galhos (Splines 3D vs Eulers Ad-hoc):**
   - Somar vetores e ângulos de Euler soltos causava quinas duras, tubos se cruzando de forma feia e juntas desconectadas.
   - A geometria de galho agora usa curvas Catmull-Rom 3D com frames de Frenet, colar de base afunilado (que entra para dentro da madeira pai) e afilamento orgânico até a ponta.

6. **Auditoria Visual Rápida em Múltiplos Ângulos (Scripts vs Browser):**
   - Manipular o browser manualmente em tarefas de julgamento 3D foi lento e perdeu detalhes críticos.
   - O script automatizado Playwright `scripts/capture-all-gauntlet-angles.mjs` captura instantaneamente os 12 ângulos vitais em alta resolução (Elevações N/S/L/O, Aérea, Undercanopy, Juntas, Raízes, Clay Mode e Wireframe), tornando as avaliações do Gauntlet rápidas, frias e sem ilusões.

---

### 2. Estado Atual dos Arquivos Principais

- **`src/apps/models/models/lowpoly/LowPolyTrunk.ts`:**
  - Raízes separadas removidas por completo.
  - Base elegante e alargada pousando em $y=0$.
  - Perfil flautado de 24 segmentos com leve torção espiral e curva em S orgânica.
  - 5 pontos de soquetes escalonados ao longo do topo do tronco (não mais um prato plano horizontal).

- **`src/apps/models/models/lowpoly/LowPolyBranch.ts`:**
  - Suporta extrusão 3D contínua por splines Catmull-Rom (`createSplineBranchGeometry`).
  - Colar de base alargado para encaixe sem costura na madeira-mãe.
  - Contém `createModularBranchGroup()` para exibição no `/models`.

- **`src/apps/models/models/lowpoly/LowPolyLeaf.ts`:**
  - Folha 3D individual com vinco diedro em V no centro, cel-shading em 3 bandas, SSS (translucidez de clorofila) e rim light branco finíssimo.
  - `createLeafSprig`: ramalhete sem gravetos expostos.
  - `createFoliageCloudCluster`: cúpula cumulonimbus volumétrica fechada (sem vazados).

- **`src/apps/models/models/lowpoly/LowPolyTree.ts`:**
  - Montagem da árvore conectando os galhos ao tronco e distribuindo as cúpulas foliares nos 3 tons cel-shaded (`sunlit` topo, `meadow` meio, `jade` base).

- **`scripts/capture-all-gauntlet-angles.mjs`:**
  - Script Playwright de captura imediata dos 12 ângulos para inspeção do Gauntlet Loop.

---

### 3. Próximo Passo Imediato para a Nova Conversa

1. **Focar exclusivamente em aperfeiçoar O GALHO MESTRE ÚNICO (`LowPolyBranch.ts`):**
   - Abrir no `/models` na opção *"Galho Mestre com Ramificações (Módulo)"*.
   - Torná-lo impecável: formato, curvatura natural, bifurcações elegantes e os ramalhetes de folhas se integrando sem corte seco.
2. **Replicar esse galho modular perfeito nos soquetes do tronco:**
   - Fazer o `LowPolyTree.ts` apenas instanciar esse galho mestre único nos soquetes com escala e rotação harmônicas.
3. **Verificar os 12 ângulos via `node scripts/capture-all-gauntlet-angles.mjs`:**
   - Garantir que a árvore inteira atinja visual 100% indistinguível de Genshin Impact / Studio Ghibli.
