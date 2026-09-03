import bpy

bpy.ops.wm.read_factory_settings(use_empty=True)
if "Collection" not in bpy.data.collections:
    col = bpy.data.collections.new("Collection")
    bpy.context.scene.collection.children.link(col)

bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0, 0))
obj = bpy.context.view_layer.objects.active
print("SUCCESS! Created object via view_layer:", obj.name if obj else "None")
