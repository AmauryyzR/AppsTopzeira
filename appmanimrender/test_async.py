import asyncio
import sys

async def run():
    print(f"sys.executable is: {sys.executable}")
    cmd = [sys.executable, "-m", "manim", "--version"]
    process = await asyncio.create_subprocess_exec(
        *cmd,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.STDOUT
    )
    while True:
        line = await process.stdout.readline()
        if not line:
            break
        print("LINE:", line.decode())
    await process.wait()
    print("RETURN CODE:", process.returncode)

if __name__ == "__main__":
    asyncio.run(run())
