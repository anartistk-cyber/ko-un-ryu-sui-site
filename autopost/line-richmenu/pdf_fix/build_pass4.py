"""pass 4 (2026-11-12 01:21 user request), applied on the previous final PDF:
 p23 「第1次募集 5/1〜8/末 ※体験会参加者のみ限定」→「第1次募集 5/1〜10/末 ※要相談」 (CID swap, all glyphs exist in the subset)
 p4  沿革 「2025年4月 年中無休開始」を消す → その行に「あゆな 入社」を置き、下の2行（2026年4月…）を43pt上げる
 p25 HPのQR（ベクター）を ko-un-ryu-sui.com（UTMつき）のQRに差し替え、リンクも更新
"""
import io
import pymupdf, qrcode
SP = '/path/to/work'
SRC = SP + '/pdfedit/final_v3.pdf'
OUT = SP + '/pdfedit/final_v4.pdf'
NEW_URL = 'https://ko-un-ryu-sui.com/?utm_source=company_guide&utm_medium=qr'
OLD_URL = 'https://www.flowcloud.net/'
DY = 43.0   # = row pitch 2024->2025 (40.828) ... see note: 2026 block moves up by DY

d = pymupdf.open(SRC)

def rep_stream(page, pairs):
    (sx,) = page.get_contents()
    s = d.xref_stream(sx).decode('latin1')
    for old, new in pairs:
        assert s.count(old) == 1, (page.number + 1, s.count(old), old[:70])
        s = s.replace(old, new)
    d.update_stream(sx, s.encode('latin1'))

# ---- p23 ----
rep_stream(d[22], [(
    "[<0B48001208CD0E37094202790016001000120299001900100EA400010001000102DE0B2E07670571088005430900>60 <0377>50 <038807760C06>]TJ",
    "[<0B48001208CD0E3709420279001600100012029900120011" "0010" "0EA4" "000100010001" "02DE" "0F410AEC0B8A>]TJ")])

# ---- p4 ----
def sh(v, dy=DY):
    return ('%.4f' % (v + dy)).rstrip('0').rstrip('.')
rep_stream(d[3], [
    ("/C0_7 16 Tf\n-26.782 -40.828 Td\n<0CE5>Tj\n1 0 0 1 214.8615 155.6635 Tm\n<0BA40EC106730589089D>Tj\n/C0_8 17 Tf\n-1.286 Tc -15.009 -43.035 Td\n<034B038F037302790CD608FE>Tj",
     "/C0_8 17 Tf\n-1.286 Tc 1 0 0 1 199.852 155.6635 Tm\n<034B038F037302790CD608FE>Tj"),
    ("1 0 0 1 8.175293 -109.7199707 cm", "1 0 0 1 8.175293 %s cm" % sh(-109.7199707)),
    ("59.245 71.847 Td", "59.245 %s Td" % sh(71.847)),
    ("2 Tr 201.1 74.179 Td", "2 Tr 201.1 %s Td" % sh(74.179)),
    ("1 0 0 1 226.5523 74.1793 Tm", "1 0 0 1 226.5523 %s Tm" % sh(74.1793)),
    ("199.852 28.428 Td", "199.852 %s Td" % sh(28.428)),
    ("1 0 0 1 215.5665 28.4281 Tm", "1 0 0 1 215.5665 %s Tm" % sh(28.4281)),
])

# ---- p25: HP QR ----
pg = d[24]
links = [l for l in pg.get_links() if l.get('uri') == OLD_URL]
assert len(links) == 1, links
lk = links[0]
R = lk['from']
print('HP QR rect', R)
q = qrcode.QRCode(version=None, error_correction=qrcode.constants.ERROR_CORRECT_M, box_size=1, border=0)
q.add_data(NEW_URL); q.make(fit=True)
M = q.get_matrix(); n = len(M)
side = min(R.width, R.height)
x0 = R.x0 + (R.width - side) / 2; y0 = R.y0 + (R.height - side) / 2
mod = side / n
white = pymupdf.Rect(R.x0 - 2, R.y0 - 2, R.x1 + 2, R.y1 + 2)
sh_ = pg.new_shape()
sh_.draw_rect(white); sh_.finish(color=None, fill=(1, 1, 1)); sh_.commit()
sh2 = pg.new_shape()
for r in range(n):
    c = 0
    while c < n:
        if M[r][c]:
            c2 = c
            while c2 + 1 < n and M[r][c2 + 1]:
                c2 += 1
            sh2.draw_rect(pymupdf.Rect(x0 + c * mod, y0 + r * mod, x0 + (c2 + 1) * mod, y0 + (r + 1) * mod))
            c = c2 + 1
        else:
            c += 1
sh2.finish(color=None, fill=(0, 0, 0)); sh2.commit()
lk['uri'] = NEW_URL
pg.update_link(lk)
print('QR version', q.version, 'modules', n, 'module pt', round(mod, 2))
d.save(OUT, garbage=3, deflate=True)
print('saved', OUT)
