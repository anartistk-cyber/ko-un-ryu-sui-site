# glow ブログ自動投稿 RUNBOOK
1. glow-site/autopost/FACTS.md だけを事実の根拠にする。検索で得た一般知識は「髪・ヘアケアの一般論」に限り、効果の断定・医療的表現・他店比較は禁止。
2. 週2回（水・土）1本。テーマは 泉大津/和泉/高石/堺/岸和田などの地域×悩み（朝ラク・カラー・パーマ・髪質改善・ヘッドスパ・ショート）。1500〜2500字、h2を3〜5個、末尾で予約導線。
3. glow-site/data.json の posts に追加（slug, type=ブログ|お知らせ, date, title, desc, image(uploads相対: 2026/04/glow_img-08.jpg 等), alt, body[{p|h2|ul}]）。画像は既存の glow_img-05/08/10, staff_3 のみ使う。
4. cd glow-site && node build.mjs（出力 glow-site/site）→ manifest.json 再生成:
   cd site && find . -type f ! -name manifest.json | sed 's|^\./||' | sort | while read f; do printf '%s\t%s\n' "$f" "$(sha256sum "$f"|cut -d' ' -f1)"; done | python3 -c "import sys,json;print(json.dumps({'files':[dict(zip(('path','sha256'),l.rstrip('\n').split('\t'))) for l in sys.stdin]},ensure_ascii=False,indent=1))" > manifest.json
5. git commit & push main。サーバー側 sync_gl.php が毎時取り込む（公開まで最大1時間）。
6. 毎週土曜は口コミ(★5)の追加抜粋、料金・営業の変更確認、リンク切れ確認を行う。
