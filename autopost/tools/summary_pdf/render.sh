#!/bin/bash
# 使い方: bash render.sh [データのフォルダ] [出力PDF]   （Chromium+Playwrightが入った環境で。日本語フォント: Noto Sans CJK JP）
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"
DATA="${1:-$HERE/data}"
OUT="${2:-summary.pdf}"
TMP="$(mktemp -d)"
python3 "$HERE/build.py" "$DATA" "$TMP/summary.html"
node -e "
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();
await p.goto('file://$TMP/summary.html');
await p.pdf({path:process.argv[1],format:'A4',printBackground:true,preferCSSPageSize:true});
await b.close();})()" "$OUT"
echo "wrote $OUT"
