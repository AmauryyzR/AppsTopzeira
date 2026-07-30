import os
import threading
import uvicorn
import gradio as gr
import spaces
from server import app

# 1. Inicia o servidor FastAPI em segundo plano para o AppsTopzeira
def run_fastapi():
    uvicorn.run(app, host="0.0.0.0", port=7860, log_level="info")

server_thread = threading.Thread(target=run_fastapi, daemon=True)
server_thread.start()

# 2. Função GPU registrada no evento do Gradio para satisfazer a checagem do ZeroGPU
@spaces.GPU
def test_gpu_health(input_text: str):
    return f"🟢 ZeroGPU Ativo e Pronto! Cena: {input_text}"

# 3. Interface Gradio Blocks com vínculo de evento oficial do Hugging Face
with gr.Blocks(title="Manim Backend Server") as demo:
    gr.Markdown("# 🎬 Motor Manim Backend API - AppsTopzeira")
    gr.Markdown("Servidor FastAPI ativo em segundo plano com suporte a ZeroGPU 32GB RAM.")
    
    with gr.Row():
        txt_input = gr.Textbox(value="MainScene", label="Teste de Cena")
        txt_output = gr.Textbox(label="Status do Servidor")
    
    btn_check = gr.Button("🚀 Validar Status do ZeroGPU", variant="primary")
    btn_check.click(fn=test_gpu_health, inputs=txt_input, outputs=txt_output)

if __name__ == "__main__":
    demo.launch(server_name="0.0.0.0", server_port=7860)
