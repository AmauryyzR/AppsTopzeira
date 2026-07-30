from manim import *

class DesmosGraphScene(Scene):
    def construct(self):
        axes = Axes(
            x_range=[-4, 4, 1],
            y_range=[-3, 3, 1],
            x_length=9,
            y_length=6,
            axis_config={"color": BLUE_C, "include_numbers": True},
            tips=False
        )
        axes_labels = axes.get_axis_labels(x_label="x", y_label="f(x)")
        
        func = lambda x: np.sin(x) * np.cos(x / 2)
        graph = axes.plot(func, color=YELLOW, x_range=[-3.5, 3.5])
        
        title = Text("f(x) = sin(x) * cos(x/2)", font_size=28, color=YELLOW)
        title.to_corner(UL)

        self.play(Create(axes), Write(axes_labels))
        self.play(Create(graph), Write(title), run_time=2)
        self.wait(1)

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
