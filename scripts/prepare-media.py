"""Create small local MP4 demos from the existing GIF assets."""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parent.parent
DEMOS = {
    'wall-climbing': 'wall-climbing-landscape.gif',
    'grasping': 'grasping.gif',
    'table-tennis': 'rl-juggle-catch.gif',
    'athenazero': 'rai-robot.gif',
    'flint-feedback': 'flint_feedback.gif',
    'uav': 'uav_reconfig.gif',
    'p-wheel': 'p-wheel.gif',
    'ftc-2023': 'ftc-2023.gif',
    'ftc-2022': 'ftc-2022.gif',
    'ftc-2021': 'ftc-2021.gif',
    'ftc-2020': 'ftc-2020.gif',
}

def convert(item):
    name, source = item
    output = ROOT / 'assets/videos' / (name + '.mp4')
    if output.exists():
        return f'{name}: already prepared'
    subprocess.run([
        'ffmpeg', '-hide_banner', '-loglevel', 'error', '-i',
        str(ROOT / 'assets/gifs' / source), '-an', '-vf',
        'fps=24,scale=960:600:force_original_aspect_ratio=decrease:force_divisible_by=2',
        '-c:v', 'libx264', '-threads', '2', '-preset', 'fast', '-crf', '25',
        '-pix_fmt', 'yuv420p', '-movflags', '+faststart', str(output),
    ], check=True)
    return f'{name}: {output.stat().st_size // 1024} KB'

if __name__ == '__main__':
    (ROOT / 'assets/videos').mkdir(parents=True, exist_ok=True)
    with ThreadPoolExecutor(max_workers=3) as pool:
        for message in pool.map(convert, DEMOS.items()):
            print(message, flush=True)
