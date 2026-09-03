"""
=============================================================================
AAA VERDINHO (LEON BRAWLER) GENERATOR FOR BLENDER 4.5 LTS / 4.x / 5.x
=============================================================================
Gera o modelo completo do "Verdinho" (Leon estilo Brawl Stars) diretamente no
Blender usando malhas quad com Subdivision Surface, modificadores e materiais PBR.

Compatível com execução direta no Blender (Text Editor -> Run Script) e via CLI.
Totalmente calibrado para Blender 4.5 LTS (não usa contextos frágeis e não apaga o Text Editor).
=============================================================================
"""

import bpy
import math
import os

def reset_scene():
    """Remove objetos existentes da cena de forma segura sem fechar o Text Editor."""
    for obj in list(bpy.context.scene.objects):
        bpy.data.objects.remove(obj, do_unlink=True)
    # Garante que a Collection principal existe
    if "Collection" not in bpy.data.collections:
        col = bpy.data.collections.new("Collection")
        bpy.context.scene.collection.children.link(col)

def get_active():
    """Retorna o objeto ativo de forma 100% segura e independente do contexto da UI."""
    return bpy.context.view_layer.objects.active

def create_material(name, base_color, roughness=0.6, metalness=0.0, subsurface=0.0):
    """Cria material Principled BSDF compatível com Blender 4.0 a 4.5 LTS e 5.x."""
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    
    if bsdf:
        if "Base Color" in bsdf.inputs:
            bsdf.inputs["Base Color"].default_value = base_color
        if "Roughness" in bsdf.inputs:
            bsdf.inputs["Roughness"].default_value = roughness
        if "Metallic" in bsdf.inputs:
            bsdf.inputs["Metallic"].default_value = metalness
        if "Subsurface Weight" in bsdf.inputs and subsurface > 0:
            bsdf.inputs["Subsurface Weight"].default_value = subsurface
        elif "Subsurface" in bsdf.inputs and subsurface > 0:
            bsdf.inputs["Subsurface"].default_value = subsurface
        if "Specular IOR Level" in bsdf.inputs:
            bsdf.inputs["Specular IOR Level"].default_value = 0.5
            
    return mat

def set_parent(child, parent):
    """Parenting oficial com preservação absoluta de coordenadas no espaço mundial."""
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

def add_cube(name, size, location, scale=(1, 1, 1), rotation=(0, 0, 0), mat=None):
    bpy.ops.mesh.primitive_cube_add(size=size, location=location, rotation=rotation)
    obj = get_active()
    obj.name = name
    obj.scale = scale
    if mat:
        obj.data.materials.append(mat)
    return obj

def add_sphere(name, radius, location, scale=(1, 1, 1), mat=None):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=radius, location=location)
    obj = get_active()
    obj.name = name
    obj.scale = scale
    if mat:
        obj.data.materials.append(mat)
    return obj

def add_cylinder(name, radius, depth, location, scale=(1, 1, 1), rotation=(0, 0, 0), mat=None):
    bpy.ops.mesh.primitive_cylinder_add(radius=radius, depth=depth, location=location, rotation=rotation)
    obj = get_active()
    obj.name = name
    obj.scale = scale
    if mat:
        obj.data.materials.append(mat)
    return obj

def add_torus(name, major_radius, minor_radius, location, rotation=(0, 0, 0), mat=None):
    bpy.ops.mesh.primitive_torus_add(major_radius=major_radius, minor_radius=minor_radius, location=location, rotation=rotation)
    obj = get_active()
    obj.name = name
    if mat:
        obj.data.materials.append(mat)
    return obj

def build_verdinho_character():
    reset_scene()
    
    # -------------------------------------------------------------
    # 1. PALETA DE MATERIAIS DO VERDINHO (Leon Brawler PBR)
    # -------------------------------------------------------------
    mat_green = create_material("M_HoodieGreen", (0.06, 0.72, 0.50, 1.0), roughness=0.55)
    mat_dark_green = create_material("M_HoodTrim", (0.02, 0.45, 0.32, 1.0), roughness=0.60)
    mat_pocket_blue = create_material("M_PocketBlue", (0.12, 0.38, 0.92, 1.0), roughness=0.58, metalness=0.05)
    mat_zipper_yellow = create_material("M_GoldZipper", (0.98, 0.75, 0.14, 1.0), roughness=0.30, metalness=0.70)
    mat_white = create_material("M_PureWhite", (0.98, 0.98, 0.98, 1.0), roughness=0.35)
    mat_lollipop_pink = create_material("M_LollipopPink", (0.95, 0.25, 0.37, 1.0), roughness=0.40)
    mat_skin = create_material("M_SkinTone", (1.0, 0.85, 0.74, 1.0), roughness=0.60, subsurface=0.15)
    mat_face_shadow = create_material("M_FaceShadow", (0.01, 0.12, 0.09, 1.0), roughness=0.85)
    mat_shorts = create_material("M_ShortsIndigo", (0.08, 0.12, 0.20, 1.0), roughness=0.75)
    mat_sneaker_red = create_material("M_SneakerRed", (0.90, 0.15, 0.15, 1.0), roughness=0.48)
    mat_black = create_material("M_DarkGroove", (0.05, 0.05, 0.08, 1.0), roughness=0.60)

    # Olhos de Camaleão (Topo do Capuz)
    mat_cham_yellow = create_material("M_ChamEyeYellow", (0.98, 0.80, 0.08, 1.0), roughness=0.20)
    mat_cham_pupil = create_material("M_ChamEyePupil", (0.04, 0.04, 0.06, 1.0), roughness=0.30)
    mat_cham_hl = create_material("M_ChamEyeHighlight", (1.0, 1.0, 1.0, 1.0), roughness=0.10)

    # Olhos Heróicos Ciano (Dentro do Capuz)
    mat_hero_cyan = create_material("M_HeroEyeCyan", (0.22, 0.74, 0.97, 1.0), roughness=0.20)

    # -------------------------------------------------------------
    # 2. TORSO (Corpo do Moletom com Capuz)
    # -------------------------------------------------------------
    torso = add_cube("Torso", size=0.64, location=(0, 0, 0.86), scale=(1.06, 0.88, 1.05), mat=mat_green)
    add_subsurf(torso, levels=2)
    smooth_mesh(torso)

    # Bolso Canguru Azul Royal na Frente
    pouch = add_cube("Kangaroo_Pouch", size=0.40, location=(0, 0.26, 0.72), scale=(1.15, 0.25, 0.65), mat=mat_pocket_blue)
    add_subsurf(pouch, levels=1)
    smooth_mesh(pouch)
    set_parent(pouch, torso)

    # Zíper Frontal Dourado
    zipper = add_cube("Zipper", size=0.05, location=(0, 0.30, 0.88), scale=(0.8, 0.2, 10.5), mat=mat_zipper_yellow)
    set_parent(zipper, torso)

    # Cordinhas do Capuz com Pontas de Ouro
    for x_sign in [-1, 1]:
      cord = add_cylinder(f"Cord_{x_sign}", radius=0.012, depth=0.22, location=(x_sign * 0.10, 0.30, 0.98), rotation=(0, 0, x_sign * -0.15), mat=mat_white)
      smooth_mesh(cord)
      set_parent(cord, torso)

      tip = add_cylinder(f"Tip_{x_sign}", radius=0.02, depth=0.04, location=(x_sign * 0.12, 0.31, 0.86), mat=mat_zipper_yellow)
      smooth_mesh(tip)
      set_parent(tip, torso)

    # -------------------------------------------------------------
    # 3. CAUDA DO CAMALEÃO (Traseira do Moletom)
    # -------------------------------------------------------------
    tail_root = add_sphere("Tail_0", radius=0.12, location=(0, -0.28, 0.60), scale=(1.0, 0.85, 1.25), mat=mat_green)
    add_subsurf(tail_root, levels=1)
    smooth_mesh(tail_root)
    set_parent(tail_root, torso)

    prev_tail = tail_root
    for t in range(1, 4):
        r = 0.12 - t * 0.022
        seg = add_sphere(f"Tail_{t}", radius=r, location=(0, -0.28 - t * 0.12, 0.60 - t * 0.08), scale=(1.0, 0.85, 1.25), mat=mat_pocket_blue if t % 2 == 1 else mat_green)
        add_subsurf(seg, levels=1)
        smooth_mesh(seg)
        set_parent(seg, prev_tail)
        prev_tail = seg

    # -------------------------------------------------------------
    # 4. CABEÇA & CAPUZ DO CAMALEÃO
    # -------------------------------------------------------------
    head = add_cube("Head", size=0.74, location=(0, 0, 1.48), scale=(1.06, 0.96, 1.05), mat=mat_green)
    add_subsurf(head, levels=2)
    smooth_mesh(head)
    set_parent(head, torso)

    # Abertura Facial Sombreada no Capuz
    face_mask = add_cube("Face_Opening", size=0.36, location=(0, 0.28, 1.42), scale=(1.1, 0.3, 0.7), mat=mat_face_shadow)
    add_subsurf(face_mask, levels=2)
    smooth_mesh(face_mask)
    set_parent(face_mask, head)

    # Rosto de Pele Pêssego Espreitando no Capuz
    face_skin = add_cube("Face_Skin", size=0.28, location=(0, 0.30, 1.40), scale=(1.0, 0.25, 0.6), mat=mat_skin)
    add_subsurf(face_skin, levels=2)
    smooth_mesh(face_skin)
    set_parent(face_skin, head)

    # Aba do Capuz (Visor)
    visor = add_cube("Hood_Visor", size=0.38, location=(0, 0.33, 1.54), scale=(1.1, 0.35, 0.18), rotation=(-0.25, 0, 0), mat=mat_dark_green)
    add_subsurf(visor, levels=1)
    smooth_mesh(visor)
    set_parent(visor, head)

    # Dentes Brancos em Zigue-Zague
    for i in range(-3, 4):
        angle = (i / 3.0) * 0.42
        tx = math.sin(angle) * 0.22
        ty = 0.34 + math.cos(angle) * 0.08
        tz = 1.50 - abs(i) * 0.012
        tooth = add_cube(f"Tooth_{i}", size=0.04, location=(tx, ty, tz), scale=(0.8, 0.4, 1.0), rotation=(0.25, 0, -i * 0.1), mat=mat_white)
        set_parent(tooth, head)

    # Pirulito Rosa na Boca
    tongue = add_cylinder("Lollipop_Candy", radius=0.04, depth=0.12, location=(0.06, 0.38, 1.34), rotation=(math.pi / 2, 0.2, -0.15), mat=mat_lollipop_pink)
    add_bevel(tongue, width=0.01, segments=2)
    smooth_mesh(tongue)
    set_parent(tongue, head)

    stick = add_cylinder("Lollipop_Stick", radius=0.01, depth=0.12, location=(-0.02, 0.36, 1.35), rotation=(math.pi / 2, 0.2, -0.15), mat=mat_white)
    smooth_mesh(stick)
    set_parent(stick, tongue)

    # Olhos Heróicos Ciano Brilhando no Capuz
    for side, x_sign in [("L", -1), ("R", 1)]:
        eye_cyan = add_cube(f"Hero_Eye_{side}", size=0.08, location=(x_sign * 0.12, 0.34, 1.44), scale=(1.0, 0.2, 0.5), rotation=(0, 0, x_sign * -0.18), mat=mat_hero_cyan)
        add_subsurf(eye_cyan, levels=1)
        smooth_mesh(eye_cyan)
        set_parent(eye_cyan, head)

        sparkle = add_sphere(f"Hero_Sparkle_{side}", radius=0.016, location=(x_sign * 0.13, 0.35, 1.45), mat=mat_white)
        smooth_mesh(sparkle)
        set_parent(sparkle, eye_cyan)

    # -------------------------------------------------------------
    # 5. OLHOS DE CAMALEÃO NO TOPO DO CAPUZ (O Ícone do Leon)
    # -------------------------------------------------------------
    for side, x_sign in [("L", -1), ("R", 1)]:
        tx = x_sign * 0.26
        ty = 0.12
        tz = 1.82

        # Cúpula Verde do Olho
        turret = add_sphere(f"Cham_Turret_{side}", radius=0.15, location=(tx, ty, tz), scale=(1.0, 1.0, 1.0), mat=mat_green)
        add_subsurf(turret, levels=1)
        smooth_mesh(turret)
        set_parent(turret, head)

        # Esfera Amarela do Olho
        eye_y = add_sphere(f"Cham_Iris_{side}", radius=0.12, location=(tx, ty + 0.06, tz), scale=(1.0, 0.7, 1.0), mat=mat_cham_yellow)
        smooth_mesh(eye_y)
        set_parent(eye_y, turret)

        # Pupila Preta
        pupil = add_cylinder(f"Cham_Pupil_{side}", radius=0.035, depth=0.03, location=(tx, ty + 0.13, tz), rotation=(math.pi / 2, 0, 0), mat=mat_cham_pupil)
        smooth_mesh(pupil)
        set_parent(pupil, eye_y)

        # Brilho Branco Especular
        hl = add_sphere(f"Cham_HL_{side}", radius=0.03, location=(tx + x_sign * 0.035, ty + 0.13, tz + 0.035), mat=mat_cham_hl)
        smooth_mesh(hl)
        set_parent(hl, eye_y)

    # Cristas Azuis na Traseira do Capuz
    for r in range(4):
        spike = add_cube(f"Crest_{r}", size=0.10, location=(0, -0.32 - r * 0.05, 1.78 - r * 0.12), scale=(0.4, 1.2, 0.8), rotation=(0.4 + r * 0.15, 0, 0), mat=mat_pocket_blue)
        add_subsurf(spike, levels=1)
        smooth_mesh(spike)
        set_parent(spike, head)

    # -------------------------------------------------------------
    # 6. BRAÇOS & MÃOS CARTOON
    # -------------------------------------------------------------
    for side, x_sign in [("L", -1), ("R", 1)]:
        ax = x_sign * 0.40

        # Ombro Arredondado
        shoulder = add_sphere(f"Shoulder_{side}", radius=0.16, location=(ax, 0, 1.10), mat=mat_green)
        smooth_mesh(shoulder)
        set_parent(shoulder, torso)

        # Manga Verde
        sleeve = add_cylinder(f"Arm_{side}", radius=0.13, depth=0.28, location=(ax, 0, 0.92), mat=mat_green)
        smooth_mesh(sleeve)
        set_parent(sleeve, shoulder)

        # Punho Azul
        cuff = add_torus(f"Cuff_{side}", major_radius=0.13, minor_radius=0.03, location=(ax, 0, 0.78), mat=mat_pocket_blue)
        smooth_mesh(cuff)
        set_parent(cuff, sleeve)

        # Mãozinha Cartoon com Pele Pêssego
        fist = add_cube(f"Hand_{side}", size=0.18, location=(ax, 0.02, 0.62), scale=(1.0, 0.85, 0.85), mat=mat_skin)
        add_subsurf(fist, levels=2)
        smooth_mesh(fist)
        set_parent(fist, sleeve)

        thumb = add_cube(f"Thumb_{side}", size=0.08, location=(ax + x_sign * -0.06, 0.06, 0.64), rotation=(-0.3, 0, x_sign * -0.5), mat=mat_skin)
        add_subsurf(thumb, levels=1)
        smooth_mesh(thumb)
        set_parent(thumb, fist)

    # -------------------------------------------------------------
    # 7. PERNAS & TÊNIS CHUNKY BRAWL STARS
    # -------------------------------------------------------------
    for side, x_sign in [("L", -1), ("R", 1)]:
        lx = x_sign * 0.18

        # Bermuda Índigo
        short = add_cylinder(f"Short_{side}", radius=0.16, depth=0.22, location=(lx, 0, 0.48), mat=mat_shorts)
        smooth_mesh(short)
        set_parent(short, torso)

        # Perna Exposta
        leg = add_cylinder(f"Leg_{side}", radius=0.11, depth=0.20, location=(lx, 0, 0.32), mat=mat_skin)
        smooth_mesh(leg)
        set_parent(leg, short)

        # Tênis Brawler Chunky
        # Sola Grossa Branca
        sole = add_cube(f"Sole_{side}", size=1.0, location=(lx, 0.08, 0.05), scale=(0.28, 0.48, 0.10), mat=mat_white)
        add_bevel(sole, width=0.02, segments=2)
        smooth_mesh(sole)
        set_parent(sole, leg)

        # Friso Escuro na Sola
        stripe = add_cube(f"Stripe_{side}", size=1.0, location=(lx, 0.08, 0.05), scale=(0.285, 0.46, 0.02), mat=mat_black)
        smooth_mesh(stripe)
        set_parent(stripe, sole)

        # Corpo Vermelho do Tênis
        sneaker = add_cube(f"Sneaker_{side}", size=1.0, location=(lx, 0.06, 0.16), scale=(0.26, 0.42, 0.16), mat=mat_sneaker_red)
        add_subsurf(sneaker, levels=2)
        smooth_mesh(sneaker)
        set_parent(sneaker, sole)

        # Biqueira Branca Arredondada
        toe = add_sphere(f"Toe_{side}", radius=0.14, location=(lx, 0.24, 0.12), scale=(0.95, 0.8, 0.65), mat=mat_white)
        smooth_mesh(toe)
        set_parent(toe, sneaker)

        # Cadarços Brancos
        for l in range(3):
            lace = add_cube(f"Lace_{side}_{l}", size=0.12, location=(lx, 0.12 + l * 0.04, 0.23 + l * 0.02), scale=(1.0, 0.15, 0.25), mat=mat_white)
            set_parent(lace, sneaker)

    # -------------------------------------------------------------
    # 8. CÂMERA & ILUMINAÇÃO DE ESTÚDIO
    # -------------------------------------------------------------
    bpy.ops.object.camera_add(location=(0, 4.5, 1.15), rotation=(math.radians(86), 0, math.radians(180)))
    cam = get_active()
    bpy.context.scene.camera = cam

    bpy.ops.object.light_add(type='SUN', location=(4, 4, 6))
    sun = get_active()
    sun.data.energy = 4.5
    sun.data.color = (1.0, 0.95, 0.88)

    bpy.ops.object.light_add(type='SUN', location=(-4, 2, 4))
    fill = get_active()
    fill.data.energy = 2.0
    fill.data.color = (0.75, 0.88, 1.0)

    bpy.ops.object.light_add(type='SUN', location=(0, -4, 4))
    rim = get_active()
    rim.data.energy = 3.0
    rim.data.color = (1.0, 0.92, 0.80)

    # -------------------------------------------------------------
    # 9. SALVAR .BLEND, RENDERIZAR PREVIEW E EXPORTAR GLB
    # -------------------------------------------------------------
    os.makedirs("public/3dgame", exist_ok=True)
    os.makedirs("artifacts", exist_ok=True)

    blend_path = os.path.abspath("artifacts/brawler_character.blend")
    glb_path = os.path.abspath("public/3dgame/character.glb")
    render_path = os.path.abspath("artifacts/blender_render_preview.png")

    bpy.context.scene.render.resolution_x = 1280
    bpy.context.scene.render.resolution_y = 720
    bpy.context.scene.render.filepath = render_path
    bpy.ops.render.render(write_still=True)
    print(f"[BLENDER] Render de estudio salvo em: {render_path}")

    bpy.ops.wm.save_as_mainfile(filepath=blend_path)
    print(f"[BLENDER] Cena salva em: {blend_path}")

    bpy.ops.export_scene.gltf(
        filepath=glb_path,
        export_format='GLB',
        use_selection=False,
        export_apply=True,
        export_yup=True
    )
    print(f"[BLENDER] GLB exportado com sucesso em: {glb_path}")
    print("[BLENDER] SUCCESS: Verdinho Brawler Model Generated Perfectly!")

if __name__ == "__main__":
    build_verdinho_character()
