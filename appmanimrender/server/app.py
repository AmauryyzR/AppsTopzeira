import os
import sys
import threading
import uvicorn
from server import app

# Run uvicorn in background thread to serve FastAPI endpoints on port 7860
def run_server():
    uvicorn.run(app, host="0.0.0.0", port=7860, log_level="info")

server_thread = threading.Thread(target=run_server, daemon=True)
server_thread.start()

# Try importing Gradio for Gradio Space or fallback to simple HTML
try:
    import gradio as gr
    demo = gr.Interface(
        fn=lambda: "🟢 Motor Manim FastAPI rodando com sucesso na porta 7860!",
        inputs=[],
        outputs="text",
        title="Manim Backend API - AppsTopzeira"
    )
    if __name__ == "__main__":
        demo.launch(server_name="0.0.0.0", server_port=7860)
except Exception:
    if __name__ == "__main__":
        run_server()
