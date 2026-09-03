import bpy
import math

blend_path = "artifacts/brawler_character.blend"
bpy.ops.wm.open_mainfile(filepath=blend_path)

cam = bpy.context.scene.camera
bpy.context.scene.render.resolution_x = 960
bpy.context.scene.render.resolution_y = 720

# 1. Front View
cam.location = (0, 4.4, 1.2)
cam.rotation_euler = (math.radians(86), 0, math.radians(180))
bpy.context.scene.render.filepath = "artifacts/blender_front.png"
bpy.ops.render.render(write_still=True)

# 2. Side View
cam.location = (4.4, 0, 1.2)
cam.rotation_euler = (math.radians(90), 0, math.radians(90))
bpy.context.scene.render.filepath = "artifacts/blender_side.png"
bpy.ops.render.render(write_still=True)

# 3. 3/4 Hero View
cam.location = (3.2, 3.2, 1.3)
cam.rotation_euler = (math.radians(82), 0, math.radians(135))
bpy.context.scene.render.filepath = "artifacts/blender_3quarter.png"
bpy.ops.render.render(write_still=True)

print("Rendered all 3 angles from Blender!")
