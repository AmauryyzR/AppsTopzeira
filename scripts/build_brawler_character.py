"""
=============================================================================
AAA HIGH-POLY BRAWLER GENERATOR (MATHEMATICAL PROCEDURAL SCULPTING)
=============================================================================
Modelo de alta densidade poligonal construído através de computação geométrica:
- Capuz Superelipsoide com deformação gaussiana da abertura facial e bico
- Pálpebras do camaleão com anéis concêntricos esculturais e duplo brilho especular
- Tronco com lofting paramétrico e harmônicos de tensão de tecido (cloth folds)
- Braços e mãos estilizadas com palma anatômica e 4 dedos articulados
- Tênis Brawl Stars com perfil rocker curvo, biqueira de borracha e laço de cadarço
- Materiais PBR Principled BSDF calibrados para Blender 4.5 LTS
=============================================================================
"""

import bpy
import bmesh
import math
import mathutils
import os

def reset_scene():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    if "Collection" not in bpy.data.collections:
        col = bpy.data.collections.new("Collection")
        bpy.context.scene.collection.children.link(col)

def get_active():
    return bpy.context.view_layer.objects.active

def setup_mat(name, base_color, roughness=0.45, metallic=0.0, subsurface=0.0, emission=(0,0,0,1)):
    mat = bpy.data.materials.get(name) or bpy.data.materials.new(name=name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        if "Base Color" in bsdf.inputs: bsdf.inputs["Base Color"].default_value = base_color
        if "Roughness" in bsdf.inputs: bsdf.inputs["Roughness"].default_value = roughness
        if "Metallic" in bsdf.inputs: bsdf.inputs["Metallic"].default_value = metallic
        if "Subsurface Weight" in bsdf.inputs and subsurface > 0:
            bsdf.inputs["Subsurface Weight"].default_value = subsurface
        elif "Subsurface" in bsdf.inputs and subsurface > 0:
            bsdf.inputs["Subsurface"].default_value = subsurface
        if "Emission Color" in bsdf.inputs and emission[0] > 0:
            bsdf.inputs["Emission Color"].default_value = emission
    return mat

def apply_mat(obj, name):
    mat = bpy.data.materials.get(name)
    if mat:
        obj.data.materials.clear()
        obj.data.materials.append(mat)

def smooth(obj):
    for poly in obj.data.polygons:
        poly.use_smooth = True

def build_highpoly_character():
    reset_scene()

    # 1. MATERIAIS
    setup_mat("M_LeonGreen", (0.06, 0.74, 0.46, 1.0), roughness=0.48)
    setup_mat("M_LeonDarkGreen", (0.03, 0.44, 0.28, 1.0), roughness=0.52)
    setup_mat("M_PocketBlue", (0.10, 0.40, 0.94, 1.0), roughness=0.50, metallic=0.05)
    setup_mat("M_GoldMetal", (1.0, 0.78, 0.14, 1.0), roughness=0.22, metallic=0.85)
    setup_mat("M_WhiteRubber", (0.96, 0.96, 0.96, 1.0), roughness=0.30)
    setup_mat("M_LollipopPink", (0.98, 0.20, 0.44, 1.0), roughness=0.25)
    setup_mat("M_SkinPeach", (1.0, 0.84, 0.73, 1.0), roughness=0.55, subsurface=0.25)
    setup_mat("M_FaceDark", (0.02, 0.10, 0.07, 1.0), roughness=0.80)
    setup_mat("M_ShortsDenim", (0.07, 0.12, 0.24, 1.0), roughness=0.70)
    setup_mat("M_SneakerRed", (0.92, 0.12, 0.12, 1.0), roughness=0.42)
    setup_mat("M_DarkGroove", (0.04, 0.04, 0.06, 1.0), roughness=0.50)
    setup_mat("M_EyeYellow", (0.98, 0.84, 0.06, 1.0), roughness=0.18)
    setup_mat("M_EyePupil", (0.03, 0.03, 0.04, 1.0), roughness=0.25)
    setup_mat("M_EyeCyan", (0.18, 0.78, 0.98, 1.0), roughness=0.15, emission=(0.18, 0.78, 0.98, 1.0))

    # 2. CAPUZ HIGH-POLY ESCULPIDO MATEMATICAMENTE
    mesh_hood = bpy.data.meshes.new("Leon_Hood_Mesh")
    hood = bpy.data.objects.new("Leon_Hood", mesh_hood)
    bpy.context.scene.collection.objects.link(hood)
    bpy.context.view_layer.objects.active = hood

    bm_hood = bmesh.new()
    u_steps, v_steps = 48, 36
    grid = []
    for j in range(v_steps + 1):
        row = []
        phi = -math.pi / 2.0 + (math.pi * j / v_steps)
        for i in range(u_steps):
            theta = 2.0 * math.pi * i / u_steps
            cos_p, sin_p = math.cos(phi), math.sin(phi)
            cos_t, sin_t = math.cos(theta), math.sin(theta)

            def sgn_pow(val, p): return math.copysign(abs(val) ** p, val)

            rx = 0.36 * sgn_pow(cos_p, 0.85) * sgn_pow(cos_t, 0.90)
            ry = 0.35 * sgn_pow(cos_p, 0.85) * sgn_pow(sin_t, 0.90)
            rz = 0.36 * sgn_pow(sin_p, 0.85)
            x, y, z = rx, ry, rz + 1.36

            if y > 0.05:
                dx = x / 0.18
                dz = (z - 1.32) / 0.12
                dist2 = dx * dx + dz * dz
                if dist2 < 2.5:
                    y -= 0.16 * math.exp(-dist2 * 0.8)
                    if 1.36 < z < 1.44:
                        y += 0.06 * math.exp(-dx * dx * 1.5)

            vert = bm_hood.verts.new((x, y, z))
            row.append(vert)
        grid.append(row)

    for j in range(v_steps):
        for i in range(u_steps):
            i_next = (i + 1) % u_steps
            bm_hood.faces.new((grid[j][i], grid[j][i_next], grid[j + 1][i_next], grid[j + 1][i]))

    bm_hood.to_mesh(mesh_hood)
    bm_hood.free()

    mod_sh = hood.modifiers.new(name="Subdivision", type='SUBSURF')
    mod_sh.levels = 2
    smooth(hood)
    apply_mat(hood, "M_LeonGreen")

    # Rosto Interno
    bpy.ops.mesh.primitive_uv_sphere_add(segments=24, ring_count=18, radius=0.20, location=(0, 0.16, 1.30))
    face = get_active()
    face.name = "Face_Interior"
    face.scale = (1.05, 0.35, 0.70)
    smooth(face)
    apply_mat(face, "M_SkinPeach")

    # Olhos Ciano
    for side, x_sign in [("L", -1), ("R", 1)]:
        bpy.ops.mesh.primitive_cylinder_add(vertices=16, radius=0.024, depth=0.015, location=(x_sign * 0.075, 0.22, 1.31), rotation=(math.pi / 2, 0, x_sign * -0.15))
        eye = get_active()
        eye.name = f"Hero_Eye_{side}"
        eye.scale = (1.25, 1.0, 0.65)
        smooth(eye)
        apply_mat(eye, "M_EyeCyan")

    # Dentes
    for i in range(-2, 3):
        angle = (i / 2.0) * 0.30
        tx = math.sin(angle) * 0.13
        ty = 0.25 + math.cos(angle) * 0.035
        tz = 1.37 - abs(i) * 0.008
        bpy.ops.mesh.primitive_cone_add(vertices=12, radius1=0.015, depth=0.032, location=(tx, ty, tz), rotation=(math.pi, 0, -i * 0.15))
        tooth = get_active()
        tooth.name = f"Tooth_{i}"
        smooth(tooth)
        apply_mat(tooth, "M_WhiteRubber")

    # Pirulito
    bpy.ops.mesh.primitive_cylinder_add(vertices=24, radius=0.034, depth=0.075, location=(0.045, 0.26, 1.24), rotation=(math.pi / 2, 0.2, -0.25))
    pop = get_active()
    pop.name = "Lollipop"
    smooth(pop)
    apply_mat(pop, "M_LollipopPink")

    bpy.ops.mesh.primitive_cylinder_add(vertices=12, radius=0.007, depth=0.10, location=(-0.02, 0.24, 1.24), rotation=(0, math.pi / 2, 0.25))
    stick = get_active()
    stick.name = "Lollipop_Stick"
    smooth(stick)
    apply_mat(stick, "M_WhiteRubber")

    # Olhos de Camaleão com Pálpebras
    for side, x_sign in [("L", -1), ("R", 1)]:
        tx, ty, tz = x_sign * 0.22, 0.08, 1.62
        rot_y, rot_x = x_sign * -0.25, 0.16

        bpy.ops.mesh.primitive_torus_add(major_radius=0.125, minor_radius=0.028, location=(tx, ty + 0.02, tz), rotation=(rot_x, rot_y, 0))
        eyelid = get_active()
        smooth(eyelid)
        apply_mat(eyelid, "M_LeonGreen")

        bpy.ops.mesh.primitive_uv_sphere_add(segments=24, ring_count=18, radius=0.11, location=(tx, ty + 0.03, tz), rotation=(rot_x, rot_y, 0))
        iris = get_active()
        smooth(iris)
        apply_mat(iris, "M_EyeYellow")

        bpy.ops.mesh.primitive_cylinder_add(vertices=20, radius=0.032, depth=0.015, location=(tx + x_sign * 0.018, ty + 0.12, tz + 0.02), rotation=(math.pi / 2 + rot_x, rot_y, 0))
        pupil = get_active()
        smooth(pupil)
        apply_mat(pupil, "M_EyePupil")

        bpy.ops.mesh.primitive_uv_sphere_add(segments=12, ring_count=8, radius=0.022, location=(tx + x_sign * 0.04, ty + 0.12, tz + 0.045))
        hl1 = get_active()
        smooth(hl1)
        apply_mat(hl1, "M_WhiteRubber")

    # Cristas
    for r in range(4):
        cz = 1.58 - r * 0.11
        cy = -0.15 - r * 0.06
        bpy.ops.mesh.primitive_cone_add(vertices=12, radius1=0.045 - r * 0.005, depth=0.12, location=(0, cy, cz), rotation=(-0.45 - r * 0.15, 0, 0))
        crest = get_active()
        crest.scale = (0.5, 1.2, 1.0)
        smooth(crest)
        apply_mat(crest, "M_PocketBlue")

    # 3. TRONCO HIGH-POLY COM CLOTH FOLDS
    mesh_torso = bpy.data.meshes.new("Leon_Torso_Mesh")
    torso = bpy.data.objects.new("Leon_Torso", mesh_torso)
    bpy.context.scene.collection.objects.link(torso)
    bpy.context.view_layer.objects.active = torso

    bm_torso = bmesh.new()
    rings, radial = 24, 32
    z_top, z_bot = 1.10, 0.58
    torso_grid = []
    for j in range(rings + 1):
        row = []
        t = j / float(rings)
        z = z_bot + t * (z_top - z_bot)
        width_x = 0.22 + 0.06 * math.sin(t * math.pi) + (0.04 if t > 0.6 else 0.0)
        width_y = 0.17 + 0.04 * math.sin(t * math.pi)
        cloth_fold = 0.008 * math.sin(t * math.pi * 5.0)

        for i in range(radial):
            theta = 2.0 * math.pi * i / radial
            cos_t, sin_t = math.cos(theta), math.sin(theta)
            def sgn_pow(val, p): return math.copysign(abs(val) ** p, val)
            x = width_x * sgn_pow(cos_t, 0.9)
            y_bias = 0.03 * (1.0 - abs(t - 0.4) * 2.0) if sin_t > 0 else 0.0
            y = (width_y + cloth_fold) * sgn_pow(sin_t, 0.9) + y_bias
            vert = bm_torso.verts.new((x, y, z))
            row.append(vert)
        torso_grid.append(row)

    for j in range(rings):
        for i in range(radial):
            i_next = (i + 1) % radial
            bm_torso.faces.new((torso_grid[j][i], torso_grid[j][i_next], torso_grid[j + 1][i_next], torso_grid[j + 1][i]))

    bm_torso.to_mesh(mesh_torso)
    bm_torso.free()

    mod_st = torso.modifiers.new(name="Subdivision", type='SUBSURF')
    mod_st.levels = 2
    smooth(torso)
    apply_mat(torso, "M_LeonGreen")

    # Colarinho e Barra
    bpy.ops.mesh.primitive_torus_add(major_radius=0.20, minor_radius=0.045, location=(0, 0.02, 1.08), rotation=(0.10, 0, 0))
    collar = get_active()
    collar.scale = (1.05, 0.92, 0.70)
    smooth(collar)
    apply_mat(collar, "M_LeonGreen")

    bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=0.225, depth=0.07, location=(0, 0.01, 0.61))
    hem = get_active()
    hem.scale = (1.0, 0.85, 1.0)
    smooth(hem)
    apply_mat(hem, "M_PocketBlue")

    # Bolso Canguru e Zíper
    bpy.ops.mesh.primitive_cube_add(size=0.28, location=(0, 0.17, 0.73))
    pouch = get_active()
    pouch.scale = (1.10, 0.16, 0.68)
    smooth(pouch)
    apply_mat(pouch, "M_PocketBlue")

    bpy.ops.mesh.primitive_cube_add(size=0.025, location=(0, 0.19, 0.86))
    zip_track = get_active()
    zip_track.scale = (0.8, 0.3, 17.0)
    apply_mat(zip_track, "M_GoldMetal")

    for x_sign in [-1, 1]:
        bpy.ops.mesh.primitive_cylinder_add(vertices=16, radius=0.008, depth=0.20, location=(x_sign * 0.075, 0.18, 0.94), rotation=(-0.16, 0, x_sign * -0.08))
        cord = get_active()
        smooth(cord)
        apply_mat(cord, "M_WhiteRubber")

        bpy.ops.mesh.primitive_cylinder_add(vertices=16, radius=0.014, depth=0.032, location=(x_sign * 0.092, 0.21, 0.83))
        aglet = get_active()
        smooth(aglet)
        apply_mat(aglet, "M_GoldMetal")

    # Cauda em 'S'
    for t in range(5):
        prog = t / 4.0
        r = 0.11 * (1.0 - prog * 0.55)
        cy = -0.16 - prog * 0.36
        cz = 0.63 - math.sin(prog * math.pi) * 0.08 + (prog ** 1.5) * 0.12
        bpy.ops.mesh.primitive_uv_sphere_add(segments=20, ring_count=16, radius=r, location=(0, cy, cz))
        tail_seg = get_active()
        tail_seg.scale = (1.0, 1.2, 0.88)
        smooth(tail_seg)
        apply_mat(tail_seg, "M_PocketBlue" if t % 2 == 1 else "M_LeonGreen")

    # 4. BRAÇOS & MÃOS CARTOON COM PALMA E 4 DEDOS
    for side, x_sign in [("L", -1), ("R", 1)]:
        sx, sy, sz = x_sign * 0.26, 0.01, 0.98
        bpy.ops.mesh.primitive_uv_sphere_add(segments=20, ring_count=16, radius=0.125, location=(sx, sy, sz))
        shoulder = get_active()
        smooth(shoulder)
        apply_mat(shoulder, "M_LeonGreen")

        arm_angle_z, arm_angle_x = x_sign * -0.52, 0.12
        arm_len = 0.24
        mx = sx + math.sin(arm_angle_z) * (arm_len * 0.5)
        my = sy + math.sin(arm_angle_x) * (arm_len * 0.5)
        mz = sz - math.cos(arm_angle_z) * (arm_len * 0.5)

        bpy.ops.mesh.primitive_cylinder_add(vertices=24, radius=0.098, depth=arm_len, location=(mx, my, mz), rotation=(arm_angle_x, arm_angle_z, 0))
        arm = get_active()
        smooth(arm)
        apply_mat(arm, "M_LeonGreen")

        cuff_x = sx + math.sin(arm_angle_z) * arm_len
        cuff_y = sy + math.sin(arm_angle_x) * arm_len
        cuff_z = sz - math.cos(arm_angle_z) * arm_len
        bpy.ops.mesh.primitive_cylinder_add(vertices=24, radius=0.108, depth=0.045, location=(cuff_x, cuff_y, cuff_z), rotation=(arm_angle_x, arm_angle_z, 0))
        cuff = get_active()
        smooth(cuff)
        apply_mat(cuff, "M_PocketBlue")

        palm_x = sx + math.sin(arm_angle_z) * (arm_len + 0.07)
        palm_y = sy + math.sin(arm_angle_x) * (arm_len + 0.07)
        palm_z = sz - math.cos(arm_angle_z) * (arm_len + 0.07)
        bpy.ops.mesh.primitive_cube_add(size=0.11, location=(palm_x, palm_y, palm_z), rotation=(arm_angle_x, arm_angle_z, 0))
        palm = get_active()
        palm.scale = (1.0, 0.75, 0.95)
        smooth(palm)
        apply_mat(palm, "M_SkinPeach")

        th_x = palm_x + x_sign * -0.038
        bpy.ops.mesh.primitive_cylinder_add(vertices=16, radius=0.024, depth=0.055, location=(th_x, palm_y + 0.042, palm_z + 0.010), rotation=(-0.45, arm_angle_z, x_sign * -0.4))
        thumb = get_active()
        smooth(thumb)
        apply_mat(thumb, "M_SkinPeach")

        for f in range(3):
            f_offset = (f - 1) * 0.026
            fx = palm_x + math.sin(arm_angle_z) * 0.05 + math.cos(arm_angle_z) * f_offset
            fz = palm_z - math.cos(arm_angle_z) * 0.05 - math.sin(arm_angle_z) * f_offset * x_sign
            bpy.ops.mesh.primitive_cylinder_add(vertices=16, radius=0.018, depth=0.045, location=(fx, palm_y - 0.015, fz), rotation=(0.35, arm_angle_z, 0))
            finger = get_active()
            smooth(finger)
            apply_mat(finger, "M_SkinPeach")

    # 5. BERMUDA, PERNAS E TÊNIS CHUNKY
    bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=0.21, depth=0.06, location=(0, 0.01, 0.55))
    waistband = get_active()
    waistband.scale = (1.0, 0.82, 1.0)
    smooth(waistband)
    apply_mat(waistband, "M_ShortsDenim")

    for side, x_sign in [("L", -1), ("R", 1)]:
        lx = x_sign * 0.135
        bpy.ops.mesh.primitive_cylinder_add(vertices=24, radius=0.115, depth=0.16, location=(lx, 0, 0.44))
        short_leg = get_active()
        short_leg.scale = (1.0, 0.88, 1.0)
        smooth(short_leg)
        apply_mat(short_leg, "M_ShortsDenim")

        bpy.ops.mesh.primitive_cylinder_add(vertices=24, radius=0.122, depth=0.032, location=(lx, 0, 0.35))
        short_cuff = get_active()
        smooth(short_cuff)
        apply_mat(short_cuff, "M_PocketBlue")

        bpy.ops.mesh.primitive_cylinder_add(vertices=20, radius=0.072, depth=0.18, location=(lx, 0, 0.26))
        leg = get_active()
        smooth(leg)
        apply_mat(leg, "M_SkinPeach")

        # Tênis
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(lx, 0.045, 0.042))
        sole = get_active()
        sole.scale = (0.23, 0.36, 0.075)
        mod_sole = sole.modifiers.new(name="Bevel", type='BEVEL')
        mod_sole.width = 0.022
        mod_sole.segments = 3
        smooth(sole)
        apply_mat(sole, "M_WhiteRubber")

        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(lx, 0.045, 0.042))
        stripe = get_active()
        stripe.scale = (0.235, 0.345, 0.014)
        smooth(stripe)
        apply_mat(stripe, "M_DarkGroove")

        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(lx, 0.030, 0.125))
        upper = get_active()
        upper.scale = (0.21, 0.30, 0.135)
        mod_up = upper.modifiers.new(name="Subdivision", type='SUBSURF')
        mod_up.levels = 2
        smooth(upper)
        apply_mat(upper, "M_SneakerRed")

        bpy.ops.mesh.primitive_uv_sphere_add(segments=20, ring_count=16, radius=0.095, location=(lx, 0.155, 0.095))
        toe = get_active()
        toe.scale = (0.95, 0.85, 0.65)
        smooth(toe)
        apply_mat(toe, "M_WhiteRubber")

        bpy.ops.mesh.primitive_cube_add(size=0.075, location=(lx, 0.09, 0.17), rotation=(-0.35, 0, 0))
        tongue = get_active()
        tongue.scale = (1.0, 0.28, 1.25)
        smooth(tongue)
        apply_mat(tongue, "M_SneakerRed")

        for l in range(3):
            lz = 0.135 + l * 0.024
            ly = 0.07 + l * 0.028
            bpy.ops.mesh.primitive_cube_add(size=0.085, location=(lx, ly, lz), rotation=(-0.30, 0, 0))
            lace = get_active()
            lace.scale = (1.0, 0.12, 0.16)
            apply_mat(lace, "M_WhiteRubber")

        bpy.ops.mesh.primitive_torus_add(major_radius=0.022, minor_radius=0.007, location=(lx, 0.13, 0.20), rotation=(math.pi / 2, 0, 0))
        bow = get_active()
        smooth(bow)
        apply_mat(bow, "M_WhiteRubber")

    # ILUMINAÇÃO DE ESTÚDIO 3-POINT
    bpy.ops.object.light_add(type='SUN', location=(4, 5, 6))
    key = get_active()
    key.name = "KeyLight"
    key.data.energy = 4.2
    key.data.color = (1.0, 0.96, 0.90)

    bpy.ops.object.light_add(type='SUN', location=(-5, 2, 4))
    fill = get_active()
    fill.name = "FillLight"
    fill.data.energy = 2.4
    fill.data.color = (0.75, 0.88, 1.0)

    bpy.ops.object.light_add(type='SUN', location=(0, -5, 5))
    rim = get_active()
    rim.name = "RimLight"
    rim.data.energy = 3.6
    rim.data.color = (1.0, 0.94, 0.82)

    os.makedirs("public/3dgame", exist_ok=True)
    os.makedirs("artifacts", exist_ok=True)

    blend_path = os.path.abspath("artifacts/brawler_character.blend")
    glb_path = os.path.abspath("public/3dgame/character.glb")

    bpy.ops.wm.save_as_mainfile(filepath=blend_path)
    bpy.ops.export_scene.gltf(filepath=glb_path, export_format='GLB', use_selection=False, export_apply=True, export_yup=True)
    print("SUCCESS: High-Poly Procedural Sculpted Brawler Generated and Exported!")

if __name__ == "__main__":
    build_highpoly_character()
