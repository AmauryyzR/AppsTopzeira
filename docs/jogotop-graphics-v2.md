# JogoTop Engine Gráfica V2 — Documentação Técnica & Manual de QA

## 1. Visão Geral da Arquitetura V2

A engine gráfica do **JogoTop** foi reconstruída do zero sobre uma arquitetura modular, previsível, estritamente determinística e compatível com GPUs móveis (tile-based GPUs / Adreno / Mali / Apple Silicon).

### Principais Pilares da V2:

1. **Separação Rigorosa Simulação / Renderização:**
   - A física de movimento, aceleração, pulo, gravidade, aterrissagem e resolução de colisão roda no módulo desacoplado `GameSimulation.ts`, livre de qualquer dependência com Three.js.
   - O loop de execução (`FixedStepLoop.ts`) opera com timestep fixo de 60 Hz (`1/60s`), executando no máximo 4 sub-steps por frame com clamp de segurança contra *spiral of death* (`delta <= 50ms`).
   - A renderização interpola o estado anterior e atual através do fator `alpha = accumulator / FIXED_DT`, garantindo fluidez absoluta tanto em telas de 60Hz quanto 120Hz/144Hz.

2. **Baseline Gráfica Imune a Driver Corruptions:**
   - **Shader & Materiais:** Uso exclusivo de `MeshBasicMaterial` com cores de vértice (`vertexColors: true`).
   - **Vertex Shading na CPU:** Profundidade e volumetria calculadas na CPU via iluminação direcional difusa bakeada diretamente nos buffers de cores (`color` Float32Array).
   - **Zero PBR / PMREM / Shadow Maps / IBL / Fog:** Eliminados completamente pipelines que induziam polígonos pretos ou distorções de matriz em drivers OpenGL ES / WebGL2 no Android.
   - **Envelope Visual Restrito:** Raio visual delimitado a 140 unidades (`CircleGeometry(64)` interno + `RingGeometry(64, 140)` externo). Câmera com `near=0.25` e `far=180`.
   - **Chunked Instancing (Decisão D8):** Instanciação espacialmente particionada em células de 16x16 metros, com limite máximo de 128 instâncias por chunk.

3. **Gerenciamento Seguro de Recursos & Validação Geométrica:**
   - `ResourceRegistry.ts` centraliza o ciclo de vida e descarte deduplicado de todas as geometrias e materiais.
   - `GeometryValidator.ts` assegura que nenhuma geometria com valores `NaN`, `Infinity`, índices corrompidos ou limites fora de envelope entre na cena.

---

## 2. Perfis Gráficos & Budgets

Os perfis mantêm **idênticos materiais e shaders**, variando apenas o DPR máximo e a densidade de decoração procedual.

| Perfil | Seleção Automática | DPR Máximo | Flores | Grama | Borboletas | Meta FPS | Max Draw Calls | Max Triângulos |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| `mobile-low` | Memória $\le$ 4GB ou viewport reduzido | 1.0 | 80 | 120 | 0 | 30 | 120 | 180.000 |
| `mobile` | Dispositivos touch / coarse pointer | 1.25 | 140 | 200 | 4 | 30 | 120 | 180.000 |
| `desktop` | Pointer fine / desktop | 1.5 | 260 | 360 | 7 | 55 | 180 | 300.000 |

### Parâmetros de Query Disponíveis (Desenvolvimento & Testes)

- `?quality=mobile-low|mobile|desktop`: força um perfil gráfico específico.
- `?debugGraphics=1`: exibe o HUD flutuante com telemetria em tempo real (FPS, frame time, draw calls, contagem de triângulos, geometrias ativas, perdas de contexto e contagem de erros).
- `?graphicsTest=minimal`: renderiza apenas o clear color e um cubo básico (isolamento de driver/contexto).
- `?graphicsTest=world`: renderiza o cenário do parque sem o personagem ou partículas.
- `?graphicsTest=player`: renderiza um piso simples com o personagem.
- `?graphicsTest=orbit`: ativa rotação orbital contínua de câmera para testes automatizados determinísticos.
- `?renderer=legacy`: ativa a engine antiga V1 para propósitos de comparação.

---

## 3. Roteiro de QA Física no Aparelho Afetado

> [!IMPORTANT]
> **Duração:** 3 minutos ininterruptos no dispositivo móvel de teste.

### Passos de Teste Manual:
1. Abrir a rota `/jogotop` em uma aba nova do navegador mobile.
2. **Movimentação (30s):** Caminhar continuamente pelo parque usando o joystick virtual.
3. **Câmera (30s):** Arrasar o dedo na tela orbitando a câmera em 360° ao redor do personagem.
4. **Combinação (30s):** Caminhar e rotacionar a câmera simultaneamente.
5. **Zoom (20s):** Fazer gesto de pinça (*pinch-to-zoom*) aproximando até o limite mínimo e afastando até o máximo.
6. **Pulos (20s):** Pressionar o botão de pulo repetidamente enquanto corre pela grama e caminhos.
7. **Fullscreen:** Alternar o botão de tela cheia (F11) no canto superior direito.
8. **Orientação:** Girar o celular (Portrait $\rightarrow$ Landscape $\rightarrow$ Portrait) e confirmar que o canvas cobre `100%` do viewport sem letterbox.
9. **Exploração de Pontos Críticos:** Visitar a praça central, fonte, margens do lago, ponte de madeira e a cerca perimetral.

### Critérios Obrigatórios de Aceitação:
- Zero triângulos ou retângulos pretos durante qualquer movimento ou rotação.
- Zero perda de contexto ou travamento.
- Câmera rigidamente sincronizada com o personagem, sem recortes ou z-fighting.
- HUD responsivo respeitando safe-area insets.
