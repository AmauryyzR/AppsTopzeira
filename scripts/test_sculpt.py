import bpy
import math

# Clear
for obj in list(bpy.context.scene.objects):
    bpy.data.objects.remove(obj, do_unlink=True)

# -------------------------------------------------------------
# 1. SCULPTED UNIFIED HEAD (Hood + Chameleon Eyes + Teeth + Face)
# -------------------------------------------------------------
# Base Hood
bpy.ops.mesh.primitive_uv_sphere_add(segments=32, ring_count=24, radius=0.45, location=(0, 0, 1.45))
hood = bpy.context.view_layer.objects.active
hood.name = "Head_Mesh"
hood.scale = (1.05, 1.0, 1.05)

# Chameleon Eye Sockets (Melded directly into the skull)
eye_parts = []
for side, x_sign in [("L", -1), ("R", 1)]:
    bpy.ops.mesh.primitive_uv_sphere_add(segments=20, ring_count=16, radius=0.15, location=(x_sign * 0.24, 0.14, 1.76))
    turret = bpy.context.view_layer.objects.active
    turret.name = f"Turret_{side}"
    eye_parts.append(turret)

# Crest Spikes (Penetrating into back of hood, not floating!)
crest_parts = []
for r in range(4):
    bpy.ops.mesh.primitive_cone_add(vertices=12, radius1=0.06, depth=0.16, location=(0, -0.28 - r * 0.04, 1.70 - r * 0.11), rotation=(-0.4 - r * 0.15, 0, 0))
    spike = bpy.context.view_layer.objects.active
    crest_parts.append(spike)

# Join Hood + Turrets + Crest into a SINGLE SOLID HEAD
bpy.ops.object.select_all(action='DESELECT')
hood.select_set(True)
for p in eye_parts + crest_parts:
    p.select_set(True)
bpy.context.view_layer.objects.active = hood
bpy.ops.object.join()

# Smooth shading
for poly in hood.data.polygons:
    poly.use_smooth = True

# Remesh to fuse seams organically into clay/sculpt (Human Fall Flat / Brawl Stars)
bpy.context.object.data.remesh_voxel_size = 0.028
bpy.ops.object.voxel_remesh()

# Smooth modifier to blend the fused joints
mod_smooth = hood.modifiers.new(name="Smooth", type='SMOOTH')
mod_smooth.factor = 1.0
mod_smooth.iterations = 3
bpy.ops.object.modifier_apply(modifier="Smooth")

# Add Subsurf for production finish
mod_sub = hood.modifiers.new(name="Subsurf", type='SUBSURF')
mod_sub.levels = 1

print("Head sculpt created! Fused vertices:", len(hood.data.vertices))
