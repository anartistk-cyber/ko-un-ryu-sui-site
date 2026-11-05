#!/usr/bin/env python3
"""分析レポートのPDFを1つにする：Docs「行雲流水 3サイト 分析レポート」をPDFで書き出したもの（docs.pdf）の
『今月のまとめ（1ページ）』の直後に、グラフのページ（charts.pdf）を差し込み、そのあとに詳しい分析を続ける。
使い方: python3 merge_report.py docs.pdf charts.pdf out.pdf
  charts.pdf は `CHARTS_ONLY=1 bash render.sh <データのフォルダ> charts.pdf` で作る。
  差し込み位置は、Docsに入れてある一文「ここから下は、詳しい分析です。」を含むページの直後。見つからなければ先頭の2ページの後ろ。"""
import subprocess, sys
docs, charts, out = sys.argv[1:4]
def pages(f):
    for l in subprocess.run(['pdfinfo', f], capture_output=True, text=True).stdout.splitlines():
        if l.startswith('Pages:'): return int(l.split()[1])
n = pages(docs)
mk = None
for i in range(1, n + 1):
    t = subprocess.run(['pdftotext', '-f', str(i), '-l', str(i), '-layout', docs, '-'], capture_output=True, text=True).stdout
    if 'ここから下は、詳しい分析です' in t:
        mk = i; break
mk = mk or min(2, n)
args = ['qpdf', '--empty', '--pages', docs, f'1-{mk}', charts, '1-z']
if mk < n: args += [docs, f'{mk+1}-z']
subprocess.run(args + ['--', out], check=True)
print(f'wrote {out}（{mk}ページ目の後ろにグラフを差し込み）')
