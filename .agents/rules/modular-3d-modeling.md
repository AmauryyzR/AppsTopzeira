# Regras de Modelagem 3D Modular & Procedural (Padrão Anime / Genshin Impact)

Regras aprendidas e consolidadas para criação de modelos 3D estilizados e assets modulares:

## 1. Modularidade Singular Prévia (The Single Module Rule)
- **Nunca** tente gerar múltiplos galhos acoplados ou a copa inteira diretamente na montagem antes de isolar e aperfeiçoar **uma única peça modular mestre**.
- Em árvores e vegetação, o fluxo obrigatório é:
  1. 1 folha individual 3D estilizada (`module-leaf`).
  2. 1 ramalhete/buquê denso (`module-sprig`).
  3. 1 galho mestre único com ramificações e folhagem perfeitas (`module-branch`).
  4. 1 tronco limpo com soquetes bem posicionados (`module-trunk`).
- A árvore completa (`tree-lowpoly`) deve ser exclusivamente a montagem e instanciação harmônica desse galho mestre nos soquetes do tronco.

## 2. Higiene de Envelope Foliar e Silhueta
- **Zero Gravetos Expostos no Topo:** As hastes internas de madeira devem terminar estritamente no terço inferior do tufo foliar (máximo 30% da altura). As folhas do topo devem formar um leque contínuo, impedindo qualquer haste marrom de furar as folhas ("efeito porco-espinho").
- **Fechamento de Undercanopy (Soffit Foliar):** Todo cacho de folhagem volumétrico deve possuir folhas inferiores inclinadas para baixo e para dentro, vedando a base do cacho para eliminar vazados e furos negros ao visualizar de baixo para cima.
- **Base do Tronco sem Raízes Poluídas:** O tronco deve pousar no solo através de um alargamento contínuo em sino (*grounded bell flare*) no próprio corpo da malha. Evite gerar apêndices ou runners de raiz soltos sobre o terreno que pareçam tentáculos ou cascas de banana.

## 3. Continuidade Matemática de Junções
- Galhos e bifurcações devem ser gerados ao longo de splines 3D contínuas (ex: Catmull-Rom com frames de Frenet) com colar de base alargado que penetra na madeira-mãe.
- Evite somas ad-hoc de ângulos de Euler e cilindros secos que geram quinas quebradas e frestas visíveis.

## 4. Auditoria Visual com Pacote de 12 Ângulos via Scripts
- Em ciclos do Gauntlet Loop para 3D, priorize scripts headless determinísticos (Playwright) para capturar o conjunto completo de inspeção:
  - 4 Elevações Cardeais (Frente, Trás, Direita, Esquerda)
  - Vista Aérea Top-Down
  - Vista de Baixo para Cima (Undercanopy)
  - Close-up de Juntas e Soquetes
  - Modo Clay (Shading neutro para expor a silhueta)
  - Modo Wireframe (Topologia e detecção de sobreposição)
- Avalie todas as imagens friamente antes de assumir conformidade.
