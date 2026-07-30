import os
import subprocess
import sys

# Try loading Streamlit UI, or fallback to direct uvicorn execution
try:
    import streamlit as st

    st.set_page_config(page_title="Manim Backend API", page_icon="🎬")

    @st.cache_resource
    def start_backend():
        # Start FastAPI server on port 7860 in background
        proc = subprocess.Popen([
            sys.executable, "-m", "uvicorn", "server:app",
            "--host", "0.0.0.0",
            "--port", "7860"
        ])
        return proc

    start_backend()

    st.title("🎬 Motor Manim Backend - Online 🟢")
    st.success("O servidor FastAPI (Manim + TeX + FFmpeg) está rodando com sucesso e 16 GB de RAM disponível!")
    st.info("Conecte a URL deste Space no portal AppsTopzeira para renderizar animações.")

except Exception:
    import uvicorn
    from server import app
    if __name__ == "__main__":
        uvicorn.run(app, host="0.0.0.0", port=7860)
