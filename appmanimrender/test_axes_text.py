from manim import *

class TestAxes(Scene):
    def construct(self):
        axes = Axes(
            x_range=[-4, 4, 1],
            y_range=[-3, 3, 1],
            x_length=9,
            y_length=6,
            axis_config={
                "color": BLUE_C,
                "include_numbers": True,
                "number_mobject_factory": Text
            },
            tips=False
        )
        self.play(Create(axes))
        self.wait(1)
