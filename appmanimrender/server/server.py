import os
import sys
import ast
import re
import asyncio
import shutil
import uuid
import time
import json
import logging
import traceback
import subprocess
from typing import Optional, List
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse
from pydantic import BaseModel

if sys.platform == "win32":
    try:
        asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
    except Exception:
        pass

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("manim_backend")

class SubprocessWrapper:
    """Fallback wrapper using subprocess.Popen and asyncio.to_thread when SelectorEventLoop is active on Windows."""
    def __init__(self, popen_obj: subprocess.Popen):
        self._popen = popen_obj
        self.stdout = self

    async def read(self, n: int = 512) -> bytes:
        return await asyncio.to_thread(self._popen.stdout.read, n)

    async def readline(self) -> bytes:
        return await asyncio.to_thread(self._popen.stdout.readline)

    async def wait(self) -> int:
        return await asyncio.to_thread(self._popen.wait)

    @property
    def returncode(self) -> Optional[int]:
        return self._popen.returncode

async def create_subprocess_safe(cmd: list, cwd: Optional[str] = None, env: Optional[dict] = None):
    try:
        return await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.STDOUT,
            cwd=cwd,
            env=env
        )
    except NotImplementedError:
        logger.warning("asyncio.create_subprocess_exec raised NotImplementedError. Using Popen fallback.")
        proc = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            cwd=cwd,
            env=env,
            bufsize=0
        )
        return SubprocessWrapper(proc)

app = FastAPI(title="AppManimRender Engine API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RENDERS_DIR = os.path.join(BASE_DIR, "temp_renders")
os.makedirs(RENDERS_DIR, exist_ok=True)

class RenderRequest(BaseModel):
    code: str
    scene_name: Optional[str] = None
    quality: str = "qh"  # ql (480p), qm (720p), qh (1080p), qk (4K)
    fps: int = 60
    resolution: str = "1920x1080" # widthxheight
    format: str = "mp4" # mp4, webm, gif
    bg_color: str = "#0f172a"
    transparent: bool = False
    disable_caching: bool = True

class FormatRequest(BaseModel):
    code: str
    scene_name: Optional[str] = "MainScene"

class InspectRequest(BaseModel):
    code: str

def fix_code_indentation(code: str, scene_name: str = "MainScene") -> str:
    """Normalizes and auto-corrects Python indentation for Manim scripts."""
    clean_code = code.strip()
    if not clean_code:
        return f"from manim import *\n\nclass {scene_name}(Scene):\n    def construct(self):\n        pass\n"

    # Step 1: Check if code already parses cleanly with AST as-is
    test_code = clean_code
    if "from manim import" not in test_code and "import manim" not in test_code:
        test_code = "from manim import *\n\n" + test_code

    try:
        ast.parse(test_code)
        return test_code
    except (SyntaxError, IndentationError):
        pass

    # Step 2: Check if code lacks class definition altogether
    if "class " not in clean_code:
        if "def construct" in clean_code:
            lines = clean_code.splitlines()
            indented = "\n".join("    " + l if l.strip() else "" for l in lines)
            wrapped = f"from manim import *\n\nclass {scene_name}(Scene):\n{indented}\n"
        else:
            lines = clean_code.splitlines()
            indented = "\n".join("        " + l if l.strip() else "" for l in lines)
            wrapped = f"from manim import *\n\nclass {scene_name}(Scene):\n    def construct(self):\n{indented}\n"

        try:
            ast.parse(wrapped)
            return wrapped
        except (SyntaxError, IndentationError):
            pass

    # Step 3: Structural line-by-line auto-indenter
    raw_lines = clean_code.splitlines()
    block_openers = re.compile(r':\s*(#.*)?$')
    dedent_keywords = re.compile(r'^\s*(elif|else|except|finally)\b')
    
    formatted_lines = []
    current_indent = 0
    indent_size = 4
    paren_depth = 0
    in_class = False
    in_construct = False

    for line in raw_lines:
        stripped = line.strip()
        if not stripped:
            formatted_lines.append('')
            continue

        if stripped.startswith("class ") or stripped.startswith("import ") or stripped.startswith("from "):
            indent_level = 0
            current_indent = 0
            if stripped.startswith("class "):
                in_class = True
        elif stripped.startswith("def construct"):
            indent_level = 1 if in_class else 0
            current_indent = indent_level
            in_construct = True
        elif stripped.startswith("def ") and in_construct:
            indent_level = 2
            current_indent = 2
        elif dedent_keywords.match(stripped):
            indent_level = max(0, current_indent - 1)
        else:
            indent_level = current_indent

        extra_paren_indent = 1 if paren_depth > 0 else 0
        indent_spaces = " " * ((indent_level + extra_paren_indent) * indent_size)
        formatted_lines.append(indent_spaces + stripped)

        paren_depth += stripped.count('(') + stripped.count('[') + stripped.count('{')
        paren_depth -= stripped.count(')') + stripped.count(']') + stripped.count('}')
        paren_depth = max(0, paren_depth)

        if (stripped.startswith("return ") or stripped == "return") and in_construct and paren_depth == 0:
            current_indent = 2
        elif block_openers.search(stripped) and paren_depth == 0:
            current_indent = indent_level + 1

    result = "\n".join(formatted_lines)
    if "from manim import" not in result and "import manim" not in result:
        result = "from manim import *\n\n" + result

    return result

def check_command_installed(cmd: str) -> bool:
    if cmd == "manim":
        try:
            res = os.system(f'"{sys.executable}" -m manim --version > nul 2>&1')
            return res == 0
        except Exception:
            return False
    return shutil.which(cmd) is not None

def detect_scene_classes(code: str) -> List[str]:
    """Uses Python AST to extract all Scene subclasses defined in code."""
    scenes = []
    try:
        tree = ast.parse(code)
        for node in ast.walk(tree):
            if isinstance(node, ast.ClassDef):
                for base in node.bases:
                    base_name = ""
                    if isinstance(base, ast.Name):
                        base_name = base.id
                    elif isinstance(base, ast.Attribute):
                        base_name = base.attr
                    
                    if "Scene" in base_name or base_name in ["Scene", "ThreeDScene", "MovingCameraScene", "VectorScene", "LinearTransformationScene"]:
                        scenes.append(node.name)
    except Exception as e:
        logger.warning(f"AST parsing failed: {e}")
        matches = re.findall(r'class\s+([A-Za-z0-9_]+)\s*\([^)]*Scene[^)]*\):', code)
        scenes.extend(matches)
    
    return list(dict.fromkeys(scenes))

@app.get("/api/status")
def get_status():
    manim_installed = check_command_installed("manim")
    ffmpeg_installed = check_command_installed("ffmpeg")
    latex_installed = check_command_installed("latex") or check_command_installed("pdflatex") or check_command_installed("xelatex")
    
    return {
        "status": "online",
        "python_version": sys.version.split(" ")[0],
        "manim_installed": manim_installed,
        "ffmpeg_installed": ffmpeg_installed,
        "latex_installed": latex_installed,
        "temp_dir": RENDERS_DIR
    }

@app.post("/api/install-manim")
async def install_manim():
    """Triggers pip install manim and streams progress."""
    async def event_generator():
        try:
            yield f"data: {json.dumps({'type': 'log', 'line': 'Starting pip install manim...'})}\n\n"
            env = os.environ.copy()
            env["PYTHONUNBUFFERED"] = "1"
            process = await create_subprocess_safe(
                [sys.executable, "-m", "pip", "install", "manim"],
                env=env
            )
            while True:
                line = await process.stdout.readline()
                if not line:
                    break
                text = line.decode('utf-8', errors='replace').rstrip()
                yield f"data: {json.dumps({'type': 'log', 'line': text})}\n\n"
            
            await process.wait()
            if process.returncode == 0:
                yield f"data: {json.dumps({'type': 'complete', 'message': 'Manim installed successfully!'})}\n\n"
            else:
                yield f"data: {json.dumps({'type': 'error', 'message': f'Installation failed with exit code {process.returncode}'})}\n\n"
        except Exception as ex:
            yield f"data: {json.dumps({'type': 'error', 'message': str(ex)})}\n\n"
            
    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "Connection": "keep-alive"}
    )

active_renders = {}

@app.post("/api/cancel")
async def cancel_render(req: dict):
    render_id = req.get("render_id")
    if render_id and render_id in active_renders:
        proc = active_renders.get(render_id)
        if proc:
            try:
                if hasattr(proc, "kill"):
                    proc.kill()
                elif hasattr(proc, "_popen"):
                    proc._popen.kill()
                logger.info(f"Render process {render_id} cancelled by user request.")
            except Exception as e:
                logger.warning(f"Error terminating process {render_id}: {e}")
        active_renders.pop(render_id, None)
        return {"status": "cancelled", "render_id": render_id}
    return {"status": "not_found"}

@app.post("/api/inspect")
def inspect_code(req: InspectRequest):
    scenes = detect_scene_classes(req.code)
    return {"scenes": scenes}

@app.post("/api/format")
def format_code(req: FormatRequest):
    formatted = fix_code_indentation(req.code, req.scene_name or "MainScene")
    scenes = detect_scene_classes(formatted)
    return {"code": formatted, "scenes": scenes}

@app.post("/api/render")
async def render_manim(req: RenderRequest):
    final_code = fix_code_indentation(req.code, req.scene_name or "MainScene")
    scenes = detect_scene_classes(final_code)
    scene_to_render = req.scene_name
    if not scene_to_render or scene_to_render not in scenes:
        if scenes:
            scene_to_render = scenes[0]
        else:
            scene_to_render = "MainScene"
    
    render_id = str(uuid.uuid4())[:8]
    work_dir = os.path.join(RENDERS_DIR, render_id)
    os.makedirs(work_dir, exist_ok=True)
    
    script_path = os.path.join(work_dir, "script.py")

    with open(script_path, "w", encoding="utf-8") as f:
        f.write(final_code)

    q = (req.quality or "").lower()
    if q.startswith("q"):
        q = q[1:]
    if q in ["l", "m", "h", "k"]:
        quality_flag = f"-q{q}"
    else:
        quality_flag = "-qh"
    
    res_args = []
    if "x" in req.resolution:
        w, h = req.resolution.split("x")
        res_args = ["-r", f"{w},{h}"]

    cmd = [
        sys.executable, "-m", "manim", "render",
        script_path,
        scene_to_render,
        quality_flag,
        "--fps", str(req.fps),
        "--media_dir", os.path.join(work_dir, "media")
    ]
    if res_args:
        cmd.extend(res_args)
    if req.format == "gif":
        cmd.append("--format=gif")
    elif req.format == "webm":
        cmd.append("--format=webm")

    if req.transparent:
        cmd.append("-t")
    if req.disable_caching:
        cmd.append("--disable_caching")

    logger.info(f"Executing render command: {' '.join(cmd)}")

    async def event_generator():
        process = None
        try:
            start_time = time.time()
            yield f"data: {json.dumps({'type': 'init', 'render_id': render_id, 'scene': scene_to_render})}\n\n"
            yield f"data: {json.dumps({'type': 'log', 'line': f'🚀 Starting Manim Render [Scene: {scene_to_render}]...' })}\n\n"
            yield f"data: {json.dumps({'type': 'log', 'line': f'⚙️ Command: manim render script.py {scene_to_render} {quality_flag} --fps {req.fps}' })}\n\n"
            
            env = os.environ.copy()
            env["PYTHONUNBUFFERED"] = "1"

            process = await create_subprocess_safe(
                cmd,
                cwd=work_dir,
                env=env
            )
            active_renders[render_id] = process

            buffer = ""
            curr_anim_idx = 0
            curr_anim_pct = 0
            last_progress = 0
            estimated_total = max(1, len(re.findall(r'self\.(play|wait)', req.code)))

            while True:
                chunk = await process.stdout.read(512)
                if not chunk:
                    break
                text_chunk = chunk.decode('utf-8', errors='replace')
                buffer += text_chunk

                lines = re.split(r'[\r\n]+', buffer)
                buffer = lines.pop() if lines else ""

                for line in lines:
                    line_str = line.strip()
                    if not line_str:
                        continue

                    anim_match = re.search(r'Animation\s+(\d+)', line_str)
                    if anim_match:
                        curr_anim_idx = int(anim_match.group(1))

                    pct_matches = re.findall(r'(\d+)%', line_str)
                    if pct_matches:
                        curr_anim_pct = int(pct_matches[-1])
                        overall_pct = min(99, int(((curr_anim_idx + (curr_anim_pct / 100.0)) / max(curr_anim_idx + 1, estimated_total)) * 100))
                        if overall_pct > last_progress:
                            last_progress = overall_pct
                            yield f"data: {json.dumps({'type': 'progress', 'percent': overall_pct})}\n\n"

                    yield f"data: {json.dumps({'type': 'log', 'line': line_str})}\n\n"

            if buffer.strip():
                yield f"data: {json.dumps({'type': 'log', 'line': buffer.strip()})}\n\n"

            await process.wait()
            elapsed = round(time.time() - start_time, 2)

            if process.returncode == 0:
                media_dir = os.path.join(work_dir, "media")
                found_file = None
                for root, dirs, files in os.walk(media_dir):
                    for file in files:
                        if file.endswith((".mp4", ".gif", ".webm")):
                            found_file = os.path.join(root, file)
                            break
                    if found_file:
                        break

                if not found_file:
                    for root, dirs, files in os.walk(media_dir):
                        for file in files:
                            if file.endswith((".png", ".jpg", ".jpeg")):
                                found_file = os.path.join(root, file)
                                break
                        if found_file:
                            break

                if found_file:
                    ext = os.path.splitext(found_file)[1]
                    target_output = os.path.join(work_dir, f"output{ext}")
                    try:
                        shutil.copy2(found_file, target_output)
                    except Exception:
                        shutil.copyfile(found_file, target_output)
                    file_size = os.path.getsize(target_output)
                    file_format = ext.lstrip(".").lower()

                    yield f"data: {json.dumps({'type': 'progress', 'percent': 100})}\n\n"
                    yield f"data: {json.dumps({'type': 'log', 'line': f'✅ Render completed successfully in {elapsed}s!'})}\n\n"
                    yield f"data: {json.dumps({\
                        'type': 'complete',\
                        'render_id': render_id,\
                        'video_url': f'/api/videos/{render_id}',\
                        'download_url': f'/api/videos/{render_id}/download',\
                        'file_name': f'{scene_to_render}{ext}',\
                        'file_size': file_size,\
                        'duration_sec': elapsed,\
                        'resolution': req.resolution,\
                        'fps': req.fps,\
                        'format': file_format\
                    })}\n\n"
                else:
                    yield f"data: {json.dumps({'type': 'error', 'message': 'Render process finished but output file was not found.'})}\n\n"
            else:
                yield f"data: {json.dumps({'type': 'error', 'message': f'Manim rendering failed with exit code {process.returncode}. Check logs above for Python traceback.'})}\n\n"
        except Exception as ex:
            tb = traceback.format_exc()
            logger.error(f"Render exception:\n{tb}")
            yield f"data: {json.dumps({'type': 'error', 'message': f'Python Error: {type(ex).__name__}: {str(ex)}\n{tb}'})}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "Connection": "keep-alive"}
    )

@app.get("/api/videos/{render_id}")
def get_video(render_id: str, request: Request):
    work_dir = os.path.join(RENDERS_DIR, render_id)
    if not os.path.exists(work_dir):
        raise HTTPException(status_code=404, detail="Render session not found")
    
    target_file = None
    for file in os.listdir(work_dir):
        if file.startswith("output."):
            target_file = os.path.join(work_dir, file)
            break
            
    if not target_file or not os.path.exists(target_file):
        raise HTTPException(status_code=404, detail="Video file not found")
    
    ext = os.path.splitext(target_file)[1].lower()
    media_type = "video/mp4"
    if ext == ".gif":
        media_type = "image/gif"
    elif ext == ".webm":
        media_type = "video/webm"
    elif ext == ".png":
        media_type = "image/png"
    elif ext in [".jpg", ".jpeg"]:
        media_type = "image/jpeg"

    return FileResponse(target_file, media_type=media_type)

@app.get("/api/videos/{render_id}/download")
def download_video(render_id: str):
    work_dir = os.path.join(RENDERS_DIR, render_id)
    if not os.path.exists(work_dir):
        raise HTTPException(status_code=404, detail="Render session not found")
    
    target_file = None
    for file in os.listdir(work_dir):
        if file.startswith("output."):
            target_file = os.path.join(work_dir, file)
            break
            
    if not target_file:
        raise HTTPException(status_code=404, detail="File not found")
        
    ext = os.path.splitext(target_file)[1]
    filename = f"manim_animation_{render_id}{ext}"
    return FileResponse(
        target_file,
        filename=filename,
        media_type="application/octet-stream",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)

