#!/bin/bash
# dist を site/ に出力し、manifest.json（各ファイルのパスとsha256）を作る。Xserver側のsync.phpがこれを見て差分だけ取り込む。
set -e
rm -rf site && mkdir -p site && cp -r dist/. site/
rm -f site/contact.php; find site -name "*.mp4" -delete
(cd site && find . -type f ! -name manifest.json | sed 's|^\./||' | sort | while read f; do printf '%s\t%s\n' "$f" "$(sha256sum "$f" | cut -d' ' -f1)"; done) | python3 -c "
import sys,json
print(json.dumps({'files':[dict(zip(('path','sha256'),l.rstrip('\n').split('\t'))) for l in sys.stdin]},ensure_ascii=False,indent=1))" > site/manifest.json
echo "exported $(grep -c '"path"' site/manifest.json) files"
