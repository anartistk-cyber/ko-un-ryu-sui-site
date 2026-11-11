"""pass 3: p4 会社の歴史 「2026年3月」→「2026年4月」 (2026-11-12 user request)
'3' was drawn in KozMinPr6N (C0_9, fake-bold Tr 2, Tc 2.7); that font has no '4', so use the page's
TsukuARdGothicStd-B (C0_0, same face as the other rows). advance(3)=614*18/1000+2.7=13.752 -> Tc for '4' (600*18/1000=10.8) = 2.952
"""
import pymupdf
SP = '/path/to/work'
SRC = SP + '/pdfedit/final_prev.pdf'
OUT = SP + '/pdfedit/final_v3.pdf'
d = pymupdf.open(SRC)
pg = d[3]
(sx,) = pg.get_contents()
s = d.xref_stream(sx).decode('latin1')
old = "/C0_9 18 Tf\n2.7 Tc 2 Tr <0014>Tj\n/C0_0 18 Tf\n-1.8 Tc 0 Tr <074402790279>Tj"
new = "/C0_0 18 Tf\n2.952 Tc 0 Tr <0015>Tj\n-1.8 Tc <074402790279>Tj"
assert s.count(old) == 1, s.count(old)
d.update_stream(sx, s.replace(old, new).encode('latin1'))
d.save(OUT, garbage=3, deflate=True)
print('pass3 saved', OUT)
