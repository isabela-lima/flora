"""Gera theme.css a partir de src/flora.css, embutindo assets/ como data URIs.

O Obsidian carrega o tema como um único arquivo, sem resolver caminhos
relativos; por isso fontes e SVGs vão embutidos. Uso: python3 build.py
"""

import base64
import re
import urllib.parse
from pathlib import Path

ROOT = Path(__file__).parent
MIME = {".woff2": "font/woff2", ".svg": "image/svg+xml"}


def data_uri(match: re.Match) -> str:
    path = ROOT / match.group(1)
    if path.suffix == ".svg":
        svg = " ".join(path.read_text().split())
        return f'url("data:image/svg+xml,{urllib.parse.quote(svg, safe=" =:/,;")}")'
    encoded = base64.b64encode(path.read_bytes()).decode()
    return f'url("data:{MIME[path.suffix]};base64,{encoded}")'


source = (ROOT / "src" / "flora.css").read_text()
header = "/* GERADO por build.py — edite src/flora.css. */\n"
(ROOT / "theme.css").write_text(header + re.sub(r'url\("(assets/[^"]+)"\)', data_uri, source))
print(f"theme.css: {(ROOT / 'theme.css').stat().st_size // 1024} KB")
