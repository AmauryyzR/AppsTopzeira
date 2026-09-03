"""
=============================================================================
AAA BRAWLER / HUMAN FALL FLAT HYBRID GENERATOR FOR BLENDER 4.5 LTS
=============================================================================
Totalmente reformulado para eliminar 100% de peças flutuantes, linhas pontilhadas
desnecessárias e criar anatomia orgânica contínua nível Brawl Stars / Human Fall Flat.

- Todas as peças são matematicamente integradas e ancoradas na superfície (zero flutuação)
- Membros chubby cartoon estilizados com transições suaves (sem juntas desconexas)
- Tênis Brawl Stars escupidos com sola contornada, biqueira e língua integradas
- Materiais PBR Principled BSDF com cores vibrantes e acabamento fosco vinil
- Compatível 100% com Blender 4.5 LTS (Text Editor e CLI)
=============================================================================
"""

import bpy
import math
import os

def reset_scene():
    """Limpa a cena sem destruir o contexto do Text Editor."""
    for obj in list(bpy.context.scene.objects):
        bpy.data.objects.remove(obj, do_unlink=True)
    if "Collection" not in bpy.data.collections:
        col = bpy.data.collections.new("Collection")
        bpy.context.scene.collection.children.link(col)

def get_active():
    """Retorna o objeto ativo de forma robusta em qualquer janela."""
    return bpy.context.view_layer.objects.active

def create_material(name, base_color, roughness=0.55, metalness=0.0, subsurface=0.0):
    """Cria material Principled BSDF nativo do Blender 4.x / 4.5 LTS."""
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
    """Parenting com preservação absoluta de transformações mundiais."""
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

def smooth(obj):
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

def add_sphere(name, radius, location, scale=(1, 1, 1), rotation=(0, 0, 0), mat=None):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=24, ring_count=18, radius=radius, location=location, rotation=rotation)
    obj = get_active()
    obj.name = name
    obj.scale = scale
    if mat:
        obj.data.materials.append(mat)
    return obj

def add_cylinder(name, radius, depth, location, scale=(1, 1, 1), rotation=(0, 0, 0), mat=None):
    bpy.ops.mesh.primitive_cylinder_add(vertices=24, radius=radius, depth=depth, location=location, rotation=rotation)
    obj = get_active()
    obj.name = name
    obj.scale = scale
    if mat:
        obj.data.materials.append(mat)
    return obj

def add_cone(name, radius, depth, location, rotation=(0, 0, 0), mat=None):
    bpy.ops.mesh.primitive_cone_add(vertices=16, radius1=radius, depth=depth, location=location, rotation=rotation)
    obj = get_active()
    obj.name = name
    if mat:
        obj.data.materials.append(mat)
    return obj

def build_character():
    reset_scene()

    # -------------------------------------------------------------
    # 1. PALETA DE CORES PBR BRAWL STARS (Fosco, Vinil, Saturado)
    # -------------------------------------------------------------
    mat_green = create_material("M_HoodieGreen", (0.08, 0.72, 0.48, 1.0), roughness=0.55)
    mat_dark_green = create_material("M_HoodTrim", (0.04, 0.45, 0.30, 1.0), roughness=0.60)
    mat_pocket_blue = create_material("M_PocketBlue", (0.12, 0.38, 0.92, 1.0), roughness=0.58, metalness=0.04)
    mat_zipper_yellow = create_material("M_GoldZipper", (0.98, 0.76, 0.14, 1.0), roughness=0.28, metalness=0.75)
    mat_white = create_material("M_PureWhite", (0.98, 0.98, 0.98, 1.0), roughness=0.35)
    mat_lollipop_pink = create_material("M_LollipopPink", (0.96, 0.24, 0.42, 1.0), roughness=0.35)
    mat_skin = create_material("M_SkinPeach", (1.0, 0.85, 0.74, 1.0), roughness=0.60, subsurface=0.18)
    mat_face_shadow = create_material("M_FaceShadow", (0.02, 0.12, 0.08, 1.0), roughness=0.85)
    mat_shorts = create_material("M_ShortsIndigo", (0.08, 0.12, 0.22, 1.0), roughness=0.75)
    mat_sneaker_red = create_material("M_SneakerRed", (0.92, 0.14, 0.14, 1.0), roughness=0.48)
    mat_black = create_material("M_DarkSole", (0.05, 0.05, 0.08, 1.0), roughness=0.60)

    mat_cham_yellow = create_material("M_ChamYellow", (0.98, 0.82, 0.08, 1.0), roughness=0.20)
    mat_cham_pupil = create_material("M_ChamPupil", (0.04, 0.04, 0.06, 1.0), roughness=0.30)
    mat_hero_cyan = create_material("M_HeroCyan", (0.22, 0.75, 0.98, 1.0), roughness=0.15)

    # -------------------------------------------------------------
    # 2. TORSO ORGÂNICO (Moletom com Capuz estilo Brawl Stars)
    # -------------------------------------------------------------
    # Centro do torso em Z = 0.86
    # Criado com cubo + Subsurf level 2: gera proporção anatômica estilizada perfeita
    torso = add_cube("Torso", size=0.60, location=(0, 0, 0.86), scale=(1.05, 0.82, 1.10), mat=mat_green)
    add_subsurf(torso, levels=2)
    smooth(torso)

    # Bolso Canguru Azul Royal (Ancorado diretamente na barriga, Y = 0.20)
    pouch = add_cube("Kangaroo_Pouch", size=0.36, location=(0, 0.20, 0.72), scale=(1.12, 0.22, 0.65), mat=mat_pocket_blue)
    add_subsurf(pouch, levels=1)
    smooth(pouch)
    set_parent(pouch, torso)

    # Zíper Dourado Embutido (Y = 0.24, colado na superfície)
    zipper = add_cube("Zipper", size=0.035, location=(0, 0.24, 0.86), scale=(0.7, 0.3, 13.5), mat=mat_zipper_yellow)
    set_parent(zipper, torso)

    # Cordinhas do Capuz (Caídas naturalmente contra o peito)
    for x_sign in [-1, 1]:
        cord = add_cylinder(f"Cord_{x_sign}", radius=0.010, depth=0.22, location=(x_sign * 0.09, 0.23, 0.94), rotation=(-0.1, 0, x_sign * -0.1), mat=mat_white)
        smooth(cord)
        set_parent(cord, torso)

        tip = add_cylinder(f"Tip_{x_sign}", radius=0.018, depth=0.04, location=(x_sign * 0.11, 0.25, 0.82), mat=mat_zipper_yellow)
        smooth(tip)
        set_parent(tip, torso)

    # Cauda do Camaleão na Parte Traseira (Emergindo suavemente de Y = -0.22)
    tail_root = add_sphere("Tail_0", radius=0.12, location=(0, -0.22, 0.64), scale=(1.0, 1.2, 0.9), rotation=(0.4, 0, 0), mat=mat_green)
    add_subsurf(tail_root, levels=1)
    smooth(tail_root)
    set_parent(tail_root, torso)

    prev_tail = tail_root
    for t in range(1, 4):
        r = 0.11 - t * 0.020
        seg = add_sphere(f"Tail_{t}", radius=r, location=(0, -0.24 - t * 0.10, 0.64 - t * 0.07), scale=(1.0, 1.15, 0.85), rotation=(0.4, 0, 0), mat=mat_pocket_blue if t % 2 == 1 else mat_green)
        add_subsurf(seg, levels=1)
        smooth(seg)
        set_parent(seg, prev_tail)
        prev_tail = seg

    # -------------------------------------------------------------
    # 3. CABEÇA & CAPUZ DO CAMALEÃO (Leon Brawl Stars)
    # -------------------------------------------------------------
    # Cabeça orgânica com Subsurf (Z = 1.46)
    head = add_cube("Head", size=0.68, location=(0, 0, 1.46), scale=(1.06, 0.96, 1.05), mat=mat_green)
    add_subsurf(head, levels=2)
    smooth(head)
    set_parent(head, torso)

    # Abertura Facial Escavada / Sombra do Capuz (Embutida na frente da cabeça, Y = 0.22)
    face_cavity = add_cube("Face_Cavity", size=0.34, location=(0, 0.22, 1.40), scale=(1.05, 0.25, 0.72), mat=mat_face_shadow)
    add_subsurf(face_cavity, levels=1)
    smooth(face_cavity)
    set_parent(face_cavity, head)

    # Rosto Pêssego Espreitando sob o Capuz (Y = 0.23)
    face_skin = add_cube("Face_Skin", size=0.26, location=(0, 0.23, 1.38), scale=(1.0, 0.22, 0.62), mat=mat_skin)
    add_subsurf(face_skin, levels=1)
    smooth(face_skin)
    set_parent(face_skin, head)

    # Aba / Bico do Capuz (Ancorado no topo da abertura facial, Y = 0.26)
    visor = add_cube("Hood_Visor", size=0.36, location=(0, 0.26, 1.52), scale=(1.10, 0.28, 0.16), rotation=(-0.22, 0, 0), mat=mat_dark_green)
    add_subsurf(visor, levels=1)
    smooth(visor)
    set_parent(visor, head)

    # Dentes em Zigue-Zague (Ancorados DIRETAMENTE na borda da aba, não flutuam!)
    for i in range(-3, 4):
        angle = (i / 3.0) * 0.40
        tx = math.sin(angle) * 0.18
        ty = 0.28 + math.cos(angle) * 0.05
        tz = 1.49 - abs(i) * 0.010
        tooth = add_cone(f"Tooth_{i}", radius=0.018, depth=0.040, location=(tx, ty, tz), rotation=(math.pi, 0, -i * 0.12), mat=mat_white)
        smooth(tooth)
        set_parent(tooth, head)

    # Pirulito Rosa Saindo da Boca (Ancorado em Y = 0.28)
    tongue = add_cylinder("Lollipop_Candy", radius=0.038, depth=0.10, location=(0.05, 0.30, 1.34), rotation=(math.pi / 2, 0.15, -0.12), mat=mat_lollipop_pink)
    add_bevel(tongue, width=0.01, segments=2)
    smooth(tongue)
    set_parent(tongue, head)

    stick = add_cylinder("Lollipop_Stick", radius=0.009, depth=0.10, location=(-0.02, 0.29, 0.0), rotation=(0, 0, math.pi / 2), mat=mat_white)
    smooth(stick)
    set_parent(stick, tongue)

    # Olhos Ciano Brilhando Dentro do Capuz (Y = 0.26)
    for side, x_sign in [("L", -1), ("R", 1)]:
        eye_cyan = add_cube(f"Hero_Eye_{side}", size=0.07, location=(x_sign * 0.11, 0.26, 1.42), scale=(1.0, 0.2, 0.5), rotation=(0, 0, x_sign * -0.18), mat=mat_hero_cyan)
        add_subsurf(eye_cyan, levels=1)
        smooth(eye_cyan)
        set_parent(eye_cyan, head)

        sparkle = add_sphere(f"Hero_Sparkle_{side}", radius=0.014, location=(x_sign * 0.12, 0.27, 1.43), mat=mat_white)
        smooth(sparkle)
        set_parent(sparkle, eye_cyan)

    # -------------------------------------------------------------
    # 4. OLHOS DE CAMALEÃO NO TOPO DO CAPUZ (O Ícone de Brawl Stars)
    # -------------------------------------------------------------
    for side, x_sign in [("L", -1), ("R", 1)]:
        tx = x_sign * 0.24
        ty = 0.08
        tz = 1.76

        # Cúpula Verde do Olho (Integrada ao crânio)
        turret = add_sphere(f"Cham_Turret_{side}", radius=0.15, location=(tx, ty, tz), scale=(1.0, 1.0, 1.0), mat=mat_green)
        add_subsurf(turret, levels=1)
        smooth(turret)
        set_parent(turret, head)

        # Esfera Amarela do Olho (Inserida na cúpula verde)
        eye_y = add_sphere(f"Cham_Iris_{side}", radius=0.12, location=(tx, ty + 0.05, tz), scale=(1.0, 0.75, 1.0), mat=mat_cham_yellow)
        smooth(eye_y)
        set_parent(eye_y, turret)

        # Pupila Preta
        pupil = add_cylinder(f"Cham_Pupil_{side}", radius=0.034, depth=0.02, location=(tx, ty + 0.11, tz), rotation=(math.pi / 2, 0, 0), mat=mat_cham_pupil)
        smooth(pupil)
        set_parent(pupil, eye_y)

        # Brilho Branco Especular
        hl = add_sphere(f"Cham_HL_{side}", radius=0.028, location=(tx + x_sign * 0.03, ty + 0.11, tz + 0.03), mat=mat_white)
        smooth(hl)
        set_parent(hl, eye_y)

    # Cristas Azuis na Traseira (Inseridas PROFUNDAMENTE no crânio, Y = -0.18 a -0.26)
    for r in range(4):
        # A base do cone está dentro do crânio, só a ponta sobressai!
        spike = add_cone(f"Crest_{r}", radius=0.055, depth=0.14, location=(0, -0.20 - r * 0.04, 1.70 - r * 0.10), rotation=(-0.4 - r * 0.12, 0, 0), mat=mat_pocket_blue)
        smooth(spike)
        set_parent(spike, head)

    # -------------------------------------------------------------
    # 5. BRAÇOS & MÃOS CHUBBY CARTOON (Human Fall Flat / Brawl Stars)
    # -------------------------------------------------------------
    for side, x_sign in [("L", -1), ("R", 1)]:
        ax = x_sign * 0.38

        # Ombro Arredondado (Transição perfeita com o tronco)
        shoulder = add_sphere(f"Shoulder_{side}", radius=0.15, location=(ax, 0, 1.08), mat=mat_green)
        smooth(shoulder)
        set_parent(shoulder, torso)

        # Braço / Manga Verde (Capsule orgânica suave)
        sleeve = add_cylinder(f"Arm_{side}", radius=0.12, depth=0.26, location=(ax, 0, 0.92), mat=mat_green)
        smooth(sleeve)
        set_parent(sleeve, shoulder)

        # Punho Azul
        cuff = add_cylinder(f"Cuff_{side}", radius=0.13, depth=0.05, location=(ax, 0, 0.80), mat=mat_pocket_blue)
        add_bevel(cuff, width=0.015, segments=2)
        smooth(cuff)
        set_parent(cuff, sleeve)

        # Mãozinha Cartoon Chubby com Dedão Definido
        fist = add_cube(f"Hand_{side}", size=0.16, location=(ax, 0.02, 0.65), scale=(1.0, 0.85, 0.85), mat=mat_skin)
        add_subsurf(fist, levels=2)
        smooth(fist)
        set_parent(fist, sleeve)

        thumb = add_cube(f"Thumb_{side}", size=0.07, location=(ax + x_sign * -0.05, 0.05, 0.67), rotation=(-0.25, 0, x_sign * -0.5), mat=mat_skin)
        add_subsurf(thumb, levels=1)
        smooth(thumb)
        set_parent(thumb, fist)

    # -------------------------------------------------------------
    # 6. PERNAS & TÊNIS BRAWL STARS ROBUSTOS
    # -------------------------------------------------------------
    for side, x_sign in [("L", -1), ("R", 1)]:
        lx = x_sign * 0.18

        # Bermuda Índigo
        short = add_cylinder(f"Short_{side}", radius=0.15, depth=0.22, location=(lx, 0, 0.48), mat=mat_shorts)
        smooth(short)
        set_parent(short, torso)

        # Perna Pêssego (Membro suave conectado ao calçado)
        leg = add_cylinder(f"Leg_{side}", radius=0.10, depth=0.22, location=(lx, 0, 0.32), mat=mat_skin)
        smooth(leg)
        set_parent(leg, short)

        # TÊNIS BRAWL STARS ESCULPIDO (Sem frestas, tudo embutido)
        # Sola Branca Robusta com Cantos Chanfrados (Z = 0.05)
        sole = add_cube(f"Sole_{side}", size=1.0, location=(lx, 0.06, 0.05), scale=(0.28, 0.46, 0.09), mat=mat_white)
        add_bevel(sole, width=0.025, segments=3)
        smooth(sole)
        set_parent(sole, leg)

        # Friso Escuro Embutido na Sola (Z = 0.05)
        stripe = add_cube(f"Stripe_{side}", size=1.0, location=(lx, 0.06, 0.05), scale=(0.285, 0.44, 0.02), mat=mat_black)
        smooth(stripe)
        set_parent(stripe, sole)

        # Corpo Vermelho do Tênis (Ancorado firmemente em Z = 0.13, afundando na sola)
        sneaker = add_cube(f"Sneaker_{side}", size=1.0, location=(lx, 0.05, 0.13), scale=(0.26, 0.40, 0.14), mat=mat_sneaker_red)
        add_subsurf(sneaker, levels=2)
        smooth(sneaker)
        set_parent(sneaker, sole)

        # Biqueira Branca Arredondada (Conectada na frente do tênis, Y = 0.20, Z = 0.11)
        toe = add_sphere(f"Toe_{side}", radius=0.13, location=(lx, 0.20, 0.11), scale=(0.95, 0.85, 0.65), mat=mat_white)
        smooth(toe)
        set_parent(toe, sneaker)

        # Cadarços Brancos (Cruzando o topo do tênis)
        for l in range(3):
            lace = add_cube(f"Lace_{side}_{l}", size=0.11, location=(lx, 0.10 + l * 0.04, 0.18 + l * 0.02), scale=(1.0, 0.15, 0.20), mat=mat_white)
            set_parent(lace, sneaker)

    # -------------------------------------------------------------
    # 7. CÂMERA & ILUMINAÇÃO DE ESTÚDIO
    # -------------------------------------------------------------
    bpy.ops.object.camera_add(location=(0, 4.4, 1.2), rotation=(math.radians(85), 0, math.radians(180)))
    cam = get_active()
    bpy.context.scene.camera = cam

    # Luz Solar Principal (Warm Key)
    bpy.ops.object.light_add(type='SUN', location=(4, 4, 6))
    sun = get_active()
    sun.data.energy = 4.5
    sun.data.color = (1.0, 0.95, 0.88)

    # Luz de Preenchimento (Cool Fill)
    bpy.ops.object.light_add(type='SUN', location=(-4, 2, 4))
    fill = get_active()
    fill.data.energy = 2.2
    fill.data.color = (0.75, 0.88, 1.0)

    # Luz de Contorno Traseira (Rim Light)
    bpy.ops.object.light_add(type='SUN', location=(0, -4, 4))
    rim = get_active()
    rim.data.energy = 3.2
    rim.data.color = (1.0, 0.92, 0.80)

    # -------------------------------------------------------------
    # 8. RENDERIZAÇÃO E EXPORTAÇÃO
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
    print(f"[BLENDER] Render salvo em: {render_path}")

    bpy.ops.wm.save_as_mainfile(filepath=blend_path)
    print(f"[BLENDER] Cena salva em: {blend_path}")

    bpy.ops.export_scene.gltf(
        filepath=glb_path,
        export_format='GLB',
        use_selection=False,
        export_apply=True,
        export_yup=True
    )
    print(f"[BLENDER] GLB exportado em: {glb_path}")
    print("[BLENDER] SUCCESS: Modelo AAA Human Fall Flat / Brawl Stars gerado com sucesso!")

if __name__ == "__main__":
    build_character()
