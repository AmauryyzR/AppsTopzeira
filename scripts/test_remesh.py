import bpy

# Wipe scene
for obj in list(bpy.context.scene.objects):
    bpy.data.objects.remove(obj, do_unlink=True)

# Test joining body parts and voxel remeshing into a seamless organic Human Fall Flat / Brawl Stars mesh
# Head
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.42, location=(0, 0, 1.42))
head = bpy.context.view_layer.objects.active

# Neck
bpy.ops.mesh.primitive_cylinder_add(radius=0.18, depth=0.25, location=(0, 0, 1.15))
neck = bpy.context.view_layer.objects.active

# Torso (Organic egg/capsule)
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.36, location=(0, 0, 0.90))
torso = bpy.context.view_layer.objects.active
torso.scale = (1.05, 0.90, 1.25)

# Select all and join
bpy.ops.object.select_all(action='DESELECT')
head.select_set(True)
neck.select_set(True)
torso.select_set(True)
bpy.context.view_layer.objects.active = torso
bpy.ops.object.join()

# Apply scale
bpy.ops.object.transform_apply(scale=True)

# Voxel remesh to fuse into seamless organic clay topology (Human Fall Flat style)
bpy.ops.object.modifier_add(type='REMESH')
remesh = torso.modifiers["Remesh"]
remesh.mode = 'VOXEL'
remesh.voxel_size = 0.035
remesh.adaptivity = 0
bpy.ops.object.modifier_apply(modifier="Remesh")

# Smooth modifier
bpy.ops.object.modifier_add(type='SMOOTH')
smooth = torso.modifiers["Smooth"]
smooth.factor = 1.2
smooth.iterations = 4
bpy.ops.object.modifier_apply(modifier="Smooth")

# Subdivision Surface
bpy.ops.object.modifier_add(type='SUBSURF')
subsurf = torso.modifiers["Subsurf"]
subsurf.levels = 1
bpy.ops.object.shade_smooth()

print("Seamless organic body generated! Vertices:", len(torso.data.vertices))
