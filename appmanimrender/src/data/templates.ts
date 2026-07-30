export interface Template {
  id: string;
  title: string;
  category: 'Calculus' | 'Linear Algebra' | 'Physics' | '3D Geometry' | 'Desmos Graph' | 'Computer Science';
  description: string;
  code: string;
  tags: string[];
  recommendedPreset?: {
    quality: 'qh' | 'qm' | 'ql' | 'qk';
    fps: number;
  };
}

export const MANIM_TEMPLATES: Template[] = [
  {
    id: 'desmos-style-graph',
    title: 'Desmos-Style Function & Tangent Line',
    category: 'Desmos Graph',
    description: 'Gráfico interativo no estilo Desmos mostrando a função f(x) = sin(x)*cos(x/2) e sua linha tangente em movimento.',
    tags: ['Desmos', 'Funções', 'Derivada', 'Gráfico 2D'],
    code: `from manim import *

class DesmosGraphScene(Scene):
    def construct(self):
        # Configuração dos Eixos estilo Desmos
        axes = Axes(
            x_range=[-4, 4, 1],
            y_range=[-3, 3, 1],
            x_length=9,
            y_length=6,
            axis_config={"color": BLUE_C, "include_numbers": True},
            tips=False
        )
        axes_labels = axes.get_axis_labels(x_label="x", y_label="f(x)")
        
        # Função f(x) = sin(x) * cos(x/2)
        func = lambda x: np.sin(x) * np.cos(x / 2)
        graph = axes.plot(func, color=YELLOW, x_range=[-3.5, 3.5])
        
        title = Text("f(x) = sin(x) * cos(x/2)", font_size=28, color=YELLOW)
        title.to_corner(UL)

        self.play(Create(axes), Write(axes_labels))
        self.play(Create(graph), Write(title), run_time=2)
        self.wait(1)

        # Ponto deslizante e Linha Tangente
        t_param = ValueTracker(-2.5)
        
        dot = always_redraw(lambda: Dot(
            axes.c2p(t_param.get_value(), func(t_param.get_value())),
            color=RED,
            radius=0.1
        ))

        def get_tangent():
            x0 = t_param.get_value()
            y0 = func(x0)
            h = 0.001
            slope = (func(x0 + h) - func(x0 - h)) / (2 * h)
            p1 = axes.c2p(x0 - 1.5, y0 - slope * 1.5)
            p2 = axes.c2p(x0 + 1.5, y0 + slope * 1.5)
            return Line(p1, p2, color=RED_A, stroke_width=3)

        tangent_line = always_redraw(get_tangent)

        tangent_label = always_redraw(lambda: Text(
            f"x0 = {t_param.get_value():.2f}",
            font_size=24,
            color=RED
        ).to_corner(UR))

        self.play(Create(dot), Create(tangent_line), Write(tangent_label))
        self.play(t_param.animate.set_value(2.5), run_time=4, rate_func=there_and_back)
        self.wait(1)
`
  },
  {
    id: 'fourier-series',
    title: 'Visualizador de Série de Fourier (Epiciclos)',
    category: 'Calculus',
    description: 'Decomposição de onda em epiciclos rotacionais com somatório de senos e cossenos.',
    tags: ['Fourier', 'Epiciclos', 'Cálculo', 'Matemática'],
    code: `from manim import *

class FourierSeriesScene(Scene):
    def construct(self):
        title = Text("Série de Fourier - Onda Quadrada", font_size=32, color=BLUE_B).to_edge(UP)
        self.add(title)

        axes = Axes(
            x_range=[0, 8, 1],
            y_range=[-2, 2, 1],
            x_length=8,
            y_length=4,
            axis_config={"color": GREY}
        ).shift(RIGHT * 1)
        
        self.play(Create(axes))
        
        # Aproximação da onda quadrada: f(x) = (4/pi) * sum(sin(n x)/n)
        def fourier_square(x, n_harmonics=5):
            val = 0
            for i in range(1, n_harmonics * 2, 2):
                val += (4 / (i * np.pi)) * np.sin(i * x)
            return val

        graph_1 = axes.plot(lambda x: fourier_square(x, 1), color=RED, x_range=[0, 7.5])
        label_1 = Text("N=1", font_size=24, color=RED).next_to(graph_1, UP)

        graph_5 = axes.plot(lambda x: fourier_square(x, 5), color=GREEN, x_range=[0, 7.5])
        label_5 = Text("N=5", font_size=24, color=GREEN).next_to(graph_5, UP)

        graph_20 = axes.plot(lambda x: fourier_square(x, 20), color=YELLOW, x_range=[0, 7.5])
        label_20 = Text("N=20", font_size=24, color=YELLOW).next_to(graph_20, UP)

        self.play(Create(graph_1), Write(label_1))
        self.wait(1)
        self.play(Transform(graph_1, graph_5), Transform(label_1, label_5))
        self.wait(1)
        self.play(Transform(graph_1, graph_20), Transform(label_1, label_20))
        self.wait(2)
`
  },
  {
    id: 'linear-algebra-matrix',
    title: 'Transformação Matricial de Álgebra Linear',
    category: 'Linear Algebra',
    description: 'Distorção do espaço 2D e vetores i-hat e j-hat aplicando uma matriz de transformação 2x2.',
    tags: ['Álgebra Linear', 'Matrizes', 'Espaço 2D', 'Vetores'],
    code: `from manim import *

class LinearTransformation2D(LinearTransformationScene):
    def __init__(self, **kwargs):
        LinearTransformationScene.__init__(
            self,
            show_coordinates=True,
            leave_ghost_vectors=True,
            **kwargs
        )

    def construct(self):
        matrix = [[2, 1], [-1, 1]]
        
        matrix_title = Text("Matriz A = [[2, 1], [-1, 1]]", font_size=24, color=YELLOW).to_corner(UL)
        self.add_foreground_mobject(matrix_title)
        
        vector = self.add_vector([1, 2], color=YELLOW)
        label = self.get_vector_label(vector, "v", color=YELLOW)
        self.add_foreground_mobject(label)

        self.wait(1)
        self.apply_matrix(matrix)
        self.wait(2)
`
  },
  {
    id: '3d-surface-plot',
    title: 'Superfície 3D e Campo Vetorial',
    category: '3D Geometry',
    description: 'Visualização tridimensional de uma função de duas variáveis f(x, y) = sin(x) * cos(y).',
    tags: ['3D', 'Superfície', 'Cálculo Multivariado'],
    code: `from manim import *

class Surface3DScene(ThreeDScene):
    def construct(self):
        axes = ThreeDAxes(
            x_range=[-3, 3, 1],
            y_range=[-3, 3, 1],
            z_range=[-2, 2, 1],
            x_length=6,
            y_length=6,
            z_length=4
        )
        
        surface = Surface(
            lambda u, v: axes.c2p(u, v, np.sin(u) * np.cos(v)),
            u_range=[-3, 3],
            v_range=[-3, 3],
            resolution=(30, 30),
            should_make_jagged=True
        )
        surface.set_style(fill_opacity=0.7, stroke_color=BLUE_A)
        surface.set_fill_by_value(axes=axes, colorscale=[BLUE, GREEN, YELLOW, RED])

        self.set_camera_orientation(phi=60 * DEGREES, theta=-45 * DEGREES)
        self.play(Create(axes), Create(surface), run_time=3)
        self.begin_ambient_camera_rotation(rate=0.2)
        self.wait(4)
`
  },
  {
    id: 'neural-network',
    title: 'Arquitetura de Rede Neural Artificial',
    category: 'Computer Science',
    description: 'Visualização interativa de camadas de entrada, oculta e saída com sinapses energizadas.',
    tags: ['IA', 'Rede Neural', 'Deep Learning', 'Grafos'],
    code: `from manim import *

class NeuralNetworkScene(Scene):
    def construct(self):
        title = Text("Rede Neural Artificial", font_size=36, color=TEAL).to_edge(UP)
        self.play(Write(title))

        layers = [3, 4, 2] # Entrada, Oculta, Saída
        nodes = []
        
        for l_idx, count in enumerate(layers):
            layer_nodes = []
            x = (l_idx - 1) * 3
            for n_idx in range(count):
                y = (n_idx - (count - 1) / 2) * 1.2
                dot = Circle(radius=0.35, color=WHITE, fill_color=TEAL_E, fill_opacity=0.8)
                dot.move_to([x, y, 0])
                layer_nodes.append(dot)
            nodes.append(layer_nodes)

        # Desenhar conexões
        lines = []
        for l in range(len(nodes) - 1):
            for n1 in nodes[l]:
                for n2 in nodes[l+1]:
                    line = Line(n1.get_center(), n2.get_center(), stroke_width=1.5, color=GREY_B)
                    lines.append(line)

        self.play(
            *[Create(n) for layer in nodes for n in layer],
            *[Create(l) for l in lines],
            run_time=2
        )
        self.wait(1)

        # Pulso de sinal
        pulses = [
            ShowPassingFlash(
                Line(n1.get_center(), n2.get_center(), stroke_width=4, color=YELLOW),
                time_width=0.4
            )
            for n1 in nodes[0] for n2 in nodes[1]
        ]
        self.play(*pulses, run_time=1.5)
        self.wait(1)
`
  }
];
