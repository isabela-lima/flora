#!/usr/bin/env bash
# Gera dist/flora.zip: o vault pronto para abrir no Obsidian, com os plugins
# instalados e a pasta Private/ criada a partir de .flora/privado/.
set -euo pipefail

raiz="$(cd "$(dirname "$0")/.." && pwd)"
saida="$raiz/dist"
pasta="$saida/Flora"

# id do plugin | repositório | versão | licença
plugins=(
  "homepage|mirnovov/obsidian-homepage|4.6.0|MIT"
  "templater-obsidian|SilentVoid13/Templater|2.26.0|AGPL-3.0"
  "obsidian-icon-folder|FlorianWoelki/obsidian-iconize|2.14.7|MIT"
)

rm -rf "$saida"
mkdir -p "$pasta"

# Só o que está versionado no Git, sem ferramentas de desenvolvimento.
git -C "$raiz" archive HEAD | tar -x -C "$pasta"
rm -rf "$pasta/.github" "$pasta/.claude/settings.local.json" "$pasta/Tools/empacotar.sh"

# Private/ pronta para uso.
cp -R "$pasta/.flora/privado" "$pasta/Private"
find "$pasta/Private" -name .gitkeep -delete

for item in "${plugins[@]}"; do
  IFS="|" read -r id repo versao licenca <<<"$item"
  destino="$pasta/.obsidian/plugins/$id"
  mkdir -p "$destino"
  for arquivo in main.js manifest.json styles.css; do
    curl -fsSL "https://github.com/$repo/releases/download/$versao/$arquivo" -o "$destino/$arquivo"
  done
  # O nome do arquivo de licença varia (LICENSE, LICENSE.md, LICENSE.TXT); a API informa qual é.
  caminho="$(curl -fsSL "https://api.github.com/repos/$repo/license" | python3 -c 'import json,sys; print(json.load(sys.stdin)["path"])')"
  curl -fsSL "https://raw.githubusercontent.com/$repo/$versao/$caminho" -o "$destino/LICENSE" || {
    echo "Não consegui baixar a licença de $repo ($caminho na versão $versao)." >&2
    exit 1
  }
  printf '%s %s — %s — https://github.com/%s\n' "$id" "$versao" "$licenca" "$repo" >>"$pasta/.obsidian/plugins/CREDITOS.txt"
done

(cd "$saida" && zip -qr flora.zip Flora)
echo "Pronto: $saida/flora.zip"
