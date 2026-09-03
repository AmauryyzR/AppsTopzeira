import bpy

try:
    bpy.ops.preferences.addon_enable(module='blender_mcp')
    bpy.ops.wm.save_userpref()
    print("SUCCESS: blender_mcp enabled and saved to user preferences!")
except Exception as e:
    print("Error saving preferences:", e)
