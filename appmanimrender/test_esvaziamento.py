from manim import *

config.pixel_width = 1080
config.pixel_height = 1920
config.frame_width = 9.0
config.frame_height = 16.0

class Esvaziamento(Scene):
    def construct(self):
        title_group = VGroup(
            Text("Cylinder vs Cone!", font_size=48),
            Text("Which empties first?", font_size=48)
        ).arrange(DOWN).to_edge(UP, buff=1)
        self.play(Write(title_group))
        self.wait(1)
