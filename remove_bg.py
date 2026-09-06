import sys
import os
import argparse
from PIL import Image
import numpy as np
from scipy import ndimage

def parse_hex_color(hex_str):
    hex_str = hex_str.lstrip("#")
    if len(hex_str) == 6:
        return [int(hex_str[i:i+2], 16) for i in (0, 2, 4)]
    raise ValueError(f"Formato hexadecimal invalido: {hex_str}")

def auto_detect_bg_color(img_arr, border_width=10):
    """
    Detecta automaticamente a cor de fundo amostrando as bordas da imagem.
    """
    h, w, _ = img_arr.shape
    top = img_arr[:border_width, :]
    bottom = img_arr[-border_width:, :]
    left = img_arr[:, :border_width]
    right = img_arr[:, -border_width:]
    
    border_pixels = np.concatenate([
        top.reshape(-1, 3),
        bottom.reshape(-1, 3),
        left.reshape(-1, 3),
        right.reshape(-1, 3)
    ], axis=0)
    
    return np.median(border_pixels, axis=0)

def despill_green(rgb_arr, amount=1.0):
    """
    Remove reflexos esverdeados indesejados nas bordas e vidros (Green Spill Suppression).
    """
    r = rgb_arr[:, :, 0]
    g = rgb_arr[:, :, 1]
    b = rgb_arr[:, :, 2]
    
    # Media neutra entre canais vermelho e azul
    rb_limit = (r + b) * 0.5
    excess_green = np.maximum(0.0, g - rb_limit)
    
    new_g = g - (excess_green * amount)
    result = rgb_arr.copy()
    result[:, :, 1] = np.clip(new_g, 0, 255)
    return result

def remove_background(
    input_path: str,
    output_path: str = None,
    mode: str = "auto",       # "chroma_green", "color", "auto"
    target_color = None,
    tolerance: float = 40.0,
    feather: float = 1.0,
    despill: bool = True
):
    """
    Recorta o fundo da imagem e gera PNG com transparencia pura,
    incluindo suporte a materiais transparentes (vidro/PET) via Alpha Matting.
    """
    if not os.path.exists(input_path):
        raise FileNotFoundError(f"Arquivo nao encontrado: {input_path}")
        
    if output_path is None:
        base, _ = os.path.splitext(input_path)
        output_path = f"{base}_sem_fundo.png"
        
    img = Image.open(input_path).convert("RGB")
    arr = np.array(img, dtype=np.float32)
    h, w, _ = arr.shape
    
    # 1. Detectar cor de fundo
    sample_bg = auto_detect_bg_color(arr)
    is_chroma = (mode == "chroma_green") or (
        mode == "auto" and sample_bg[1] > (sample_bg[0] + 35) and sample_bg[1] > (sample_bg[2] + 35)
    )
    
    if is_chroma:
        print(f"[+] Modo detectado: CHROMA KEY INTELIGENTE (Tratamento de Plastico/Vidro + Despill)")
        r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
        
        # Calculo de dominancia do verde
        green_excess = np.maximum(0.0, g - np.maximum(r, b))
        
        # Alpha Matting: partes com fundo verde viram transparentes de forma proporcional,
        # tornando vidros e plasticos translúcidos reais em vez de opacos manchados
        min_thresh = 12.0
        max_thresh = 95.0
        alpha_float = 1.0 - np.clip((green_excess - min_thresh) / (max_thresh - min_thresh), 0.0, 1.0)
        
        # Suavizacao sutil se desejada
        if feather > 0:
            alpha_float = ndimage.gaussian_filter(alpha_float, sigma=feather * 0.5)
            
        alpha = np.clip(alpha_float * 255.0, 0, 255.0)
        
        # Aplicar despill para neutralizar qualquer vazamento verde no plastico
        clean_rgb = arr.copy()
        if despill:
            clean_rgb = despill_green(clean_rgb, amount=1.0)
            
    else:
        # Modo por Cor Solida Especifica ou Auto-Detectada
        if target_color is not None:
            if isinstance(target_color, str):
                bg_color = np.array(parse_hex_color(target_color), dtype=np.float32)
            else:
                bg_color = np.array(target_color, dtype=np.float32)
            print(f"[+] Usando cor alvo definida: {bg_color.astype(int).tolist()}")
        else:
            bg_color = sample_bg
            print(f"[+] Cor de fundo detectada: {bg_color.astype(int).tolist()}")
            
        dist = np.linalg.norm(arr - bg_color, axis=-1)
        bg_candidate = dist < tolerance
        
        # Conectar apenas o fundo que toca as bordas
        labeled, num_features = ndimage.label(bg_candidate)
        border_mask = np.zeros((h, w), dtype=bool)
        border_mask[0, :] = True
        border_mask[-1, :] = True
        border_mask[:, 0] = True
        border_mask[:, -1] = True
        
        border_labels = set(np.unique(labeled[border_mask]))
        border_labels.discard(0)
        bg_mask = np.isin(labeled, list(border_labels))
        
        fg_mask = (~bg_mask).astype(np.float32)
        if feather > 0:
            fg_mask = ndimage.gaussian_filter(fg_mask, sigma=feather)
        alpha = np.clip(fg_mask * 255.0, 0, 255.0)
        clean_rgb = arr.copy()
    
    # Criar e salvar imagem RGBA
    rgba_arr = np.dstack([clean_rgb.astype(np.uint8), alpha.astype(np.uint8)])
    result_img = Image.fromarray(rgba_arr, mode="RGBA")
    result_img.save(output_path, "PNG")
    print(f"[OK] Recorte com transparencia profissional salvo em: {output_path}")
    return output_path

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Remocao inteligente de fundo solido / chroma key com transparencia de vidro.")
    parser.add_argument("input", help="Caminho da imagem de entrada (JPG/PNG)")
    parser.add_argument("output", nargs="?", default=None, help="Caminho da imagem de saida (PNG)")
    parser.add_argument("--color", default=None, help="Cor especifica em Hexadecimal (ex: #00FF00)")
    parser.add_argument("--mode", default="auto", choices=["auto", "chroma_green", "color"], help="Modo de operacao")
    parser.add_argument("--tolerance", type=float, default=40.0, help="Tolerancia de cor")
    parser.add_argument("--feather", type=float, default=1.0, help="Suavizacao das bordas")
    
    args = parser.parse_args()
    remove_background(
        input_path=args.input,
        output_path=args.output,
        mode=args.mode,
        target_color=args.color,
        tolerance=args.tolerance,
        feather=args.feather
    )
