import bpy
import traceback
import sys

print("Python sys.path:")
for p in sys.path:
    print("  ", p)

try:
    import blender_mcp
    print("Direct import SUCCESS!")
except Exception as e:
    print("Direct import FAILED:")
    traceback.print_exc()

try:
    bpy.ops.preferences.addon_enable(module='blender_mcp')
    print("bpy.ops.preferences.addon_enable SUCCESS!")
except Exception as e:
    print("bpy.ops.preferences.addon_enable FAILED:")
    traceback.print_exc()
