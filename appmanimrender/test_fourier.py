from manim import *

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
