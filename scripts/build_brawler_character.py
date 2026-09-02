"""
=============================================================================
AAA BRAWLER CHARACTER GENERATOR FOR BLENDER 4.5 LTS / 4.x / 5.x
=============================================================================
Generates a production-ready stylized 3D character (Brawl Stars / Archero aesthetic)
using native Blender subdivision surface quad modeling, bevels, and PBR Principled BSDF materials.

Compatible with Blender 4.0, 4.1, 4.2 LTS, 4.5 LTS, and 5.x.
Exports:
  - artifacts/brawler_character.blend (Complete editable Blender scene)
  - public/3dgame/character.glb (Optimized, uncompressed GLB for Three.js)
  - artifacts/blender_render_preview.png (Studio turnaround render from Blender)
=============================================================================
"""

import bpy
import math
import os

def reset_scene():
    """Wipe default cube/camera/light and prepare clean scene."""
    bpy.ops.wm.read_factory_settings(use_empty=True)
    if "Collection" not in bpy.data.collections:
        col = bpy.data.collections.new("Collection")
        bpy.context.scene.collection.children.link(col)

def create_material(name, base_color, roughness=0.6, metalness=0.0, subsurface=0.0):
    """
    Creates PBR Principled BSDF material compatible with Blender 4.0, 4.5 LTS, and 5.x.
    """
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    
    if bsdf:
        # Base Color
        if "Base Color" in bsdf.inputs:
            bsdf.inputs["Base Color"].default_value = base_color
        # Roughness
        if "Roughness" in bsdf.inputs:
            bsdf.inputs["Roughness"].default_value = roughness
        # Metallic
        if "Metallic" in bsdf.inputs:
            bsdf.inputs["Metallic"].default_value = metalness
        # Subsurface (Handles Blender 3.x "Subsurface" vs Blender 4.x/5.x "Subsurface Weight")
        if "Subsurface Weight" in bsdf.inputs and subsurface > 0:
            bsdf.inputs["Subsurface Weight"].default_value = subsurface
        elif "Subsurface" in bsdf.inputs and subsurface > 0:
            bsdf.inputs["Subsurface"].default_value = subsurface
        # Specular IOR Level (Blender 4+)
        if "Specular IOR Level" in bsdf.inputs:
            bsdf.inputs["Specular IOR Level"].default_value = 0.5
            
    return mat

def set_parent(child, parent):
    """
    Official Blender Python parenting: preserves exact world transforms
    by calculating matrix_parent_inverse. Prevents displacement or doubled transforms.
    """
    bpy.context.view_layer.update()
    child.parent = parent
    child.matrix_parent_inverse = parent.matrix_world.inverted()

def add_subsurf(obj, levels=2):
    mod = obj.modifiers.new(name="Subsurf", type='SUBSURF')
    mod.levels = levels
    mod.render_levels = levels
    return mod

def add_bevel(obj, width=0.02, segments=2):
    mod = obj.modifiers.new(name="Bevel", type='BEVEL')
    mod.width = width
    mod.segments = segments
    return mod

def smooth_mesh(obj):
    for poly in obj.data.polygons:
        poly.use_smooth = True

def build_character():
    reset_scene()
    
    # -------------------------------------------------------------
    # 1. PBR Color Palette (Brawl Stars Vibrant Vinyl Aesthetic)
    # -------------------------------------------------------------
    mat_skin = create_material("M_Skin", (1.0, 0.85, 0.73, 1.0), roughness=0.60, subsurface=0.15)
    mat_hair = create_material("M_Hair", (0.28, 0.13, 0.05, 1.0), roughness=0.70)
    mat_hair_hl = create_material("M_HairHL", (0.45, 0.22, 0.09, 1.0), roughness=0.62)
    mat_jacket = create_material("M_Jacket", (0.10, 0.38, 0.95, 1.0), roughness=0.55, metalness=0.04)
    mat_jacket_trim = create_material("M_JacketTrim", (0.06, 0.22, 0.72, 1.0), roughness=0.60)
    mat_shirt = create_material("M_Shirt", (0.96, 0.96, 0.97, 1.0), roughness=0.72)
    mat_gold = create_material("M_Gold", (0.98, 0.75, 0.14, 1.0), roughness=0.25, metalness=0.85)
    mat_belt = create_material("M_Belt", (0.24, 0.11, 0.05, 1.0), roughness=0.68)
    mat_pants = create_material("M_Pants", (0.07, 0.11, 0.18, 1.0), roughness=0.78)
    mat_sneaker_red = create_material("M_SneakerRed", (0.90, 0.13, 0.13, 1.0), roughness=0.48)
    mat_sneaker_white = create_material("M_SneakerWhite", (0.98, 0.98, 0.98, 1.0), roughness=0.32)
    mat_sneaker_black = create_material("M_SneakerBlack", (0.05, 0.05, 0.08, 1.0), roughness=0.60)
    mat_scarf = create_material("M_Scarf", (0.96, 0.62, 0.06, 1.0), roughness=0.55)
    
    # Face Materials
    mat_eye_white = create_material("M_EyeWhite", (1.0, 1.0, 1.0, 1.0), roughness=0.12)
    mat_eye_iris = create_material("M_EyeIris", (0.03, 0.68, 0.95, 1.0), roughness=0.15)
    mat_eye_pupil = create_material("M_EyePupil", (0.02, 0.02, 0.03, 1.0), roughness=0.20)
    mat_eye_highlight = create_material("M_EyeHighlight", (1.0, 1.0, 1.0, 1.0), roughness=0.08)
    mat_mouth = create_material("M_Mouth", (0.52, 0.07, 0.14, 1.0), roughness=0.55)
    mat_teeth = create_material("M_Teeth", (1.0, 1.0, 1.0, 1.0), roughness=0.20)

    # -------------------------------------------------------------
    # 2. TORSO (Core Parent Object for the Character)
    # -------------------------------------------------------------
    # Athletic brawler jacket body (z = 0.88)
    bpy.ops.mesh.primitive_cube_add(size=0.64, location=(0, 0, 0.88))
    torso = bpy.context.active_object
    torso.name = "Torso"
    torso.scale = (1.06, 0.84, 1.05)
    torso.data.materials.append(mat_jacket)
    add_subsurf(torso, levels=2)
    smooth_mesh(torso)

    # Cream Undershirt V-Panel
    bpy.ops.mesh.primitive_cube_add(size=0.34, location=(0, 0.23, 0.94))
    shirt = bpy.context.active_object
    shirt.name = "Shirt"
    shirt.scale = (0.7, 0.2, 1.0)
    shirt.data.materials.append(mat_shirt)
    add_subsurf(shirt, levels=1)
    smooth_mesh(shirt)
    set_parent(shirt, torso)

    # Jacket Lapels / Open Collar
    for side, x_sign in [("L", -1), ("R", 1)]:
        bpy.ops.mesh.primitive_cube_add(size=0.38, location=(x_sign * 0.16, 0.23, 0.92))
        collar = bpy.context.active_object
        collar.name = f"Collar_{side}"
        collar.scale = (0.24, 0.14, 0.85)
        collar.rotation_euler = (-0.2, x_sign * 0.2, x_sign * -0.15)
        collar.data.materials.append(mat_jacket_trim)
        add_subsurf(collar, levels=1)
        smooth_mesh(collar)
        set_parent(collar, torso)

    # Golden Star Sheriff Badge on Chest
    bpy.ops.mesh.primitive_cylinder_add(radius=0.08, depth=0.025, location=(-0.19, 0.27, 0.96))
    star = bpy.context.active_object
    star.name = "Star_Badge"
    star.rotation_euler = (math.pi / 2, 0, 0.3)
    star.data.materials.append(mat_gold)
    smooth_mesh(star)
    set_parent(star, torso)

    # Leather Adventurer Belt
    bpy.ops.mesh.primitive_cylinder_add(radius=0.34, depth=0.10, location=(0, 0, 0.60))
    belt = bpy.context.active_object
    belt.name = "Belt"
    belt.scale = (1.04, 0.82, 1.0)
    belt.data.materials.append(mat_belt)
    smooth_mesh(belt)
    set_parent(belt, torso)

    # Golden Belt Buckle
    bpy.ops.mesh.primitive_cube_add(size=0.15, location=(0, 0.29, 0.60))
    buckle = bpy.context.active_object
    buckle.name = "Belt_Buckle"
    buckle.scale = (1.0, 0.35, 0.8)
    buckle.data.materials.append(mat_gold)
    add_bevel(buckle, width=0.015, segments=2)
    smooth_mesh(buckle)
    set_parent(buckle, belt)

    # Flowing Golden Scarf Tails (Back of collar)
    for side, x_sign in [("L", -1), ("R", 1)]:
        bpy.ops.mesh.primitive_cube_add(size=0.22, location=(x_sign * 0.11, -0.27, 1.06))
        scarf = bpy.context.active_object
        scarf.name = f"Scarf_{side}"
        scarf.scale = (0.7, 0.12, 1.4)
        scarf.rotation_euler = (0.35, x_sign * 0.1, 0)
        scarf.data.materials.append(mat_scarf)
        add_subsurf(scarf, levels=2)
        smooth_mesh(scarf)
        set_parent(scarf, torso)

    # -------------------------------------------------------------
    # 3. HEAD & EXPRESSIVE FACE (Parented to Torso)
    # -------------------------------------------------------------
    # Organic Head Cube with Subsurf level 2 (z = 1.46)
    bpy.ops.mesh.primitive_cube_add(size=0.68, location=(0, 0, 1.46))
    head = bpy.context.active_object
    head.name = "Head"
    head.scale = (1.06, 0.96, 1.0)
    head.data.materials.append(mat_skin)
    add_subsurf(head, levels=2)
    smooth_mesh(head)
    set_parent(head, torso)

    # Ears
    for side, x in [("L", -0.38), ("R", 0.38)]:
        bpy.ops.mesh.primitive_cube_add(size=0.13, location=(x, -0.02, 1.46))
        ear = bpy.context.active_object
        ear.name = f"Ear_{side}"
        ear.scale = (0.5, 0.9, 1.2)
        ear.data.materials.append(mat_skin)
        add_subsurf(ear, levels=2)
        smooth_mesh(ear)
        set_parent(ear, head)

    # -------------------------------------------------------------
    # 4. VOLUMETRIC SCULPTED HAIR
    # -------------------------------------------------------------
    # Hair Cap Dome
    bpy.ops.mesh.primitive_cube_add(size=0.72, location=(0, -0.04, 1.54))
    hair_cap = bpy.context.active_object
    hair_cap.name = "Hair_Cap"
    hair_cap.scale = (1.05, 1.02, 0.92)
    hair_cap.data.materials.append(mat_hair)
    add_subsurf(hair_cap, levels=2)
    smooth_mesh(hair_cap)
    set_parent(hair_cap, head)

    # Stylized Pompadour Hair Locks
    locks = [
        ("Hair_Lock_Center", (0.0, 0.28, 1.74), (-0.7, 0.0, 0.0), (0.24, 0.18, 0.36), True),
        ("Hair_Lock_Left", (-0.18, 0.23, 1.68), (-0.6, 0.2, -0.3), (0.22, 0.16, 0.34), False),
        ("Hair_Lock_Right", (0.18, 0.23, 1.68), (-0.6, -0.2, 0.3), (0.22, 0.16, 0.34), False),
        ("Hair_Lock_Temple_L", (-0.32, 0.12, 1.56), (-0.3, 0.4, -0.5), (0.18, 0.14, 0.30), False),
        ("Hair_Lock_Temple_R", (0.32, 0.12, 1.56), (-0.3, -0.4, 0.5), (0.18, 0.14, 0.30), False),
        ("Hair_Lock_Side_L", (-0.36, -0.06, 1.44), (0.3, 0.2, -0.2), (0.16, 0.14, 0.28), False),
        ("Hair_Lock_Side_R", (0.36, -0.06, 1.44), (0.3, -0.2, 0.2), (0.16, 0.14, 0.28), False),
        ("Hair_Lock_Back", (0.0, -0.34, 1.56), (0.6, 0.0, 0.0), (0.32, 0.20, 0.34), True),
    ]
    for name, loc, rot, scl, is_hl in locks:
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=loc, rotation=rot)
        lock = bpy.context.active_object
        lock.name = name
        lock.scale = scl
        lock.data.materials.append(mat_hair_hl if is_hl else mat_hair)
        add_subsurf(lock, levels=2)
        smooth_mesh(lock)
        set_parent(lock, head)

    # -------------------------------------------------------------
    # 5. EYES & CONFIDENT CARTOON FACE
    # -------------------------------------------------------------
    for side, x_sign in [("L", -1), ("R", 1)]:
        ex = x_sign * 0.16
        ey = 0.31
        ez = 1.45

        # Eyeball Sclera
        bpy.ops.mesh.primitive_cube_add(size=0.15, location=(ex, ey, ez))
        eye_white = bpy.context.active_object
        eye_white.name = f"Eye_White_{side}"
        eye_white.scale = (1.1, 0.4, 1.1)
        eye_white.rotation_euler = (0, 0, x_sign * 0.12)
        eye_white.data.materials.append(mat_eye_white)
        add_subsurf(eye_white, levels=2)
        smooth_mesh(eye_white)
        set_parent(eye_white, head)

        # Iris
        bpy.ops.mesh.primitive_cylinder_add(radius=0.062, depth=0.015, location=(ex, ey + 0.022, ez))
        iris = bpy.context.active_object
        iris.name = f"Eye_Iris_{side}"
        iris.rotation_euler = (math.pi / 2, 0, 0)
        iris.data.materials.append(mat_eye_iris)
        smooth_mesh(iris)
        set_parent(iris, eye_white)

        # Pupil
        bpy.ops.mesh.primitive_cylinder_add(radius=0.038, depth=0.016, location=(ex, ey + 0.024, ez))
        pupil = bpy.context.active_object
        pupil.name = f"Eye_Pupil_{side}"
        pupil.rotation_euler = (math.pi / 2, 0, 0)
        pupil.data.materials.append(mat_eye_pupil)
        smooth_mesh(pupil)
        set_parent(pupil, eye_white)

        # Catchlight Dot
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.022, location=(ex + x_sign * 0.02, ey + 0.028, ez + 0.022))
        hl = bpy.context.active_object
        hl.name = f"Eye_Highlight_{side}"
        hl.data.materials.append(mat_eye_highlight)
        smooth_mesh(hl)
        set_parent(hl, eye_white)

        # Determined Eyebrow
        bpy.ops.mesh.primitive_cube_add(size=0.18, location=(ex, ey + 0.01, ez + 0.11))
        brow = bpy.context.active_object
        brow.name = f"Eyebrow_{side}"
        brow.scale = (1.0, 0.25, 0.22)
        brow.rotation_euler = (0, x_sign * -0.25, x_sign * -0.18)
        brow.data.materials.append(mat_hair)
        add_subsurf(brow, levels=1)
        smooth_mesh(brow)
        set_parent(brow, head)

    # Button Nose
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.046, location=(0, 0.34, 1.38))
    nose = bpy.context.active_object
    nose.name = "Nose"
    nose.scale = (1.1, 0.8, 0.8)
    nose.data.materials.append(mat_skin)
    smooth_mesh(nose)
    set_parent(nose, head)

    # Confident Smirk Mouth
    bpy.ops.mesh.primitive_cube_add(size=0.14, location=(0.03, 0.32, 1.29))
    mouth = bpy.context.active_object
    mouth.name = "Mouth"
    mouth.scale = (1.0, 0.2, 0.35)
    mouth.rotation_euler = (0, 0, 0.14)
    mouth.data.materials.append(mat_mouth)
    add_subsurf(mouth, levels=2)
    smooth_mesh(mouth)
    set_parent(mouth, head)

    # Teeth Highlight
    bpy.ops.mesh.primitive_cube_add(size=0.08, location=(0.03, 0.33, 1.30))
    teeth = bpy.context.active_object
    teeth.name = "Teeth"
    teeth.scale = (1.0, 0.1, 0.15)
    teeth.rotation_euler = (0, 0, 0.14)
    teeth.data.materials.append(mat_teeth)
    set_parent(teeth, mouth)

    # -------------------------------------------------------------
    # 6. ARMS & HANDS (Parented to Torso)
    # -------------------------------------------------------------
    for side, x_sign in [("L", -1), ("R", 1)]:
        ax = x_sign * 0.42

        # Shoulder
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.16, location=(ax, 0, 1.12))
        shoulder = bpy.context.active_object
        shoulder.name = f"Shoulder_{side}"
        shoulder.data.materials.append(mat_jacket)
        smooth_mesh(shoulder)
        set_parent(shoulder, torso)

        # Upper Arm
        bpy.ops.mesh.primitive_cylinder_add(radius=0.13, depth=0.28, location=(ax, 0, 0.94))
        arm = bpy.context.active_object
        arm.name = f"Arm_{side}"
        arm.data.materials.append(mat_jacket)
        smooth_mesh(arm)
        set_parent(arm, shoulder)

        # Cuff
        bpy.ops.mesh.primitive_torus_add(major_radius=0.13, minor_radius=0.03, location=(ax, 0, 0.80))
        cuff = bpy.context.active_object
        cuff.name = f"Cuff_{side}"
        cuff.data.materials.append(mat_jacket_trim)
        smooth_mesh(cuff)
        set_parent(cuff, arm)

        # Forearm
        bpy.ops.mesh.primitive_cylinder_add(radius=0.10, depth=0.20, location=(ax, 0, 0.69))
        forearm = bpy.context.active_object
        forearm.name = f"Forearm_{side}"
        forearm.data.materials.append(mat_skin)
        smooth_mesh(forearm)
        set_parent(forearm, arm)

        # Cartoon Fist
        bpy.ops.mesh.primitive_cube_add(size=0.18, location=(ax, 0.02, 0.54))
        fist = bpy.context.active_object
        fist.name = f"Hand_{side}"
        fist.scale = (1.0, 0.85, 0.85)
        fist.data.materials.append(mat_skin)
        add_subsurf(fist, levels=2)
        smooth_mesh(fist)
        set_parent(fist, forearm)

        # Thumb
        bpy.ops.mesh.primitive_cube_add(size=0.08, location=(ax + x_sign * -0.06, 0.06, 0.56))
        thumb = bpy.context.active_object
        thumb.name = f"Thumb_{side}"
        thumb.rotation_euler = (-0.3, 0, x_sign * -0.5)
        thumb.data.materials.append(mat_skin)
        add_subsurf(thumb, levels=1)
        smooth_mesh(thumb)
        set_parent(thumb, fist)

    # -------------------------------------------------------------
    # 7. LEGS & OVERSIZED CHUNKY SNEAKERS (Parented to Torso)
    # -------------------------------------------------------------
    for side, x_sign in [("L", -1), ("R", 1)]:
        lx = x_sign * 0.18

        # Denim Pants Leg
        bpy.ops.mesh.primitive_cylinder_add(radius=0.15, depth=0.34, location=(lx, 0, 0.44))
        leg = bpy.context.active_object
        leg.name = f"Leg_{side}"
        leg.data.materials.append(mat_pants)
        smooth_mesh(leg)
        set_parent(leg, torso)

        # Ankle Cuff
        bpy.ops.mesh.primitive_torus_add(major_radius=0.14, minor_radius=0.025, location=(lx, 0, 0.28))
        pant_cuff = bpy.context.active_object
        pant_cuff.name = f"PantCuff_{side}"
        pant_cuff.data.materials.append(mat_pants)
        smooth_mesh(pant_cuff)
        set_parent(pant_cuff, leg)

        # CHUNKY BRAWLER SNEAKER
        # Thick White Rubber Sole
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(lx, 0.08, 0.05))
        sole = bpy.context.active_object
        sole.name = f"Sole_{side}"
        sole.scale = (0.28, 0.48, 0.10)
        sole.data.materials.append(mat_sneaker_white)
        add_bevel(sole, width=0.02, segments=2)
        smooth_mesh(sole)
        set_parent(sole, leg)

        # Sole Accent Racing Stripe
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(lx, 0.08, 0.05))
        stripe = bpy.context.active_object
        stripe.name = f"SoleStripe_{side}"
        stripe.scale = (0.285, 0.46, 0.02)
        stripe.data.materials.append(mat_sneaker_black)
        smooth_mesh(stripe)
        set_parent(stripe, sole)

        # Red Sneaker Body
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(lx, 0.06, 0.16))
        sneaker = bpy.context.active_object
        sneaker.name = f"Sneaker_{side}"
        sneaker.scale = (0.26, 0.42, 0.16)
        sneaker.data.materials.append(mat_sneaker_red)
        add_subsurf(sneaker, levels=2)
        smooth_mesh(sneaker)
        set_parent(sneaker, sole)

        # Rounded White Rubber Shell Toe Cap
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.14, location=(lx, 0.24, 0.12))
        toe = bpy.context.active_object
        toe.name = f"Toe_{side}"
        toe.scale = (0.95, 0.8, 0.65)
        toe.data.materials.append(mat_sneaker_white)
        smooth_mesh(toe)
        set_parent(toe, sneaker)

        # Sneaker Laces
        for l in range(3):
            bpy.ops.mesh.primitive_cube_add(size=0.12, location=(lx, 0.12 + l * 0.04, 0.23 + l * 0.02))
            lace = bpy.context.active_object
            lace.name = f"Lace_{side}_{l}"
            lace.scale = (1.0, 0.15, 0.25)
            lace.data.materials.append(mat_sneaker_white)
            set_parent(lace, sneaker)

    # -------------------------------------------------------------
    # 8. STUDIO LIGHTING & CAMERA FOR DIRECT BLENDER RENDER
    # -------------------------------------------------------------
    # Camera
    bpy.ops.object.camera_add(location=(0, 3.4, 1.3), rotation=(math.radians(82), 0, math.radians(180)))
    cam = bpy.context.active_object
    bpy.context.scene.camera = cam

    # Key Light (Warm Sun)
    bpy.ops.object.light_add(type='SUN', location=(4, 4, 6))
    sun = bpy.context.active_object
    sun.data.energy = 4.5
    sun.data.color = (1.0, 0.95, 0.88)

    # Fill Light (Cool Sky)
    bpy.ops.object.light_add(type='SUN', location=(-4, 2, 4))
    fill = bpy.context.active_object
    fill.data.energy = 2.0
    fill.data.color = (0.75, 0.88, 1.0)

    # Rim Light (Backlight pop)
    bpy.ops.object.light_add(type='SUN', location=(0, -4, 4))
    rim = bpy.context.active_object
    rim.data.energy = 3.0
    rim.data.color = (1.0, 0.92, 0.80)

    # -------------------------------------------------------------
    # 9. RENDER, SAVE & EXPORT GLB
    # -------------------------------------------------------------
    os.makedirs("public/3dgame", exist_ok=True)
    os.makedirs("artifacts", exist_ok=True)

    blend_path = os.path.abspath("artifacts/brawler_character.blend")
    glb_path = os.path.abspath("public/3dgame/character.glb")
    render_path = os.path.abspath("artifacts/blender_render_preview.png")

    # Render direct preview image from Blender
    bpy.context.scene.render.resolution_x = 1280
    bpy.context.scene.render.resolution_y = 720
    bpy.context.scene.render.filepath = render_path
    bpy.ops.render.render(write_still=True)
    print(f"Direct Blender render saved to: {render_path}")

    # Save .blend
    bpy.ops.wm.save_as_mainfile(filepath=blend_path)
    print(f"Blender .blend scene saved to: {blend_path}")

    # Export pure, clean GLB with applied modifiers
    bpy.ops.export_scene.gltf(
        filepath=glb_path,
        export_format='GLB',
        use_selection=False,
        export_apply=True,
        export_yup=True
    )
    print(f"Exported GLB character model to: {glb_path}")
    print("SUCCESS: Blender AAA Brawler Model Generated Successfully!")

if __name__ == "__main__":
    build_character()
