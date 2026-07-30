import os
import uvicorn
import spaces
from server import app

@spaces.GPU
def init_gpu():
    """Dummy GPU function required by Hugging Face ZeroGPU runtime"""
    return "ZeroGPU Ready"

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 7860))
    uvicorn.run(app, host="0.0.0.0", port=port)
