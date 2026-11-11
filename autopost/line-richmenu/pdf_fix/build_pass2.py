"""pass 2: overlays on top of pass1.pdf"""
import sys, io
sys.path.insert(0, '/path/to/work/pdftools')
import pymupdf

SP = '/path/to/work'
PASS1 = SP + '/pdfedit/pass1.pdf'
OUT = SP + '/pdfedit/pass2.pdf'
FB = SP + '/pdftools/fonts/NotoJP-Bold-sub.ttf'
FM = SP + '/pdftools/fonts/NotoJP-Medium-sub.ttf'
INK = (0.137, 0.094, 0.082)
NOTE = '（※固定残業代3万円(15時間分)含む）'

d = pymupdf.open(PASS1)
fb = pymupdf.Font(fontfile=FB)
fm = pymupdf.Font(fontfile=FM)

def put(page, x, y, text, size, font='b', color=INK, align='left'):
    f, path, nm = (fb, FB, 'NotoB') if font == 'b' else (fm, FM, 'NotoM')
    w = f.text_length(text, fontsize=size)
    if align == 'center':
        x = x - w / 2
    elif align == 'right':
        x = x - w
    page.insert_text((x, y), text, fontsize=size, fontname=nm, fontfile=path, color=color)
    return w

def find_placeholder(page, y_base, x_min, x_max, tol=1.5):
    """location (x, baseline y, size, color) of an ideographic-space char in the given baseline/x range"""
    raw = page.get_text('rawdict')
    for b in raw['blocks']:
        for l in b.get('lines', []):
            for s in l['spans']:
                for c in s['chars']:
                    if c['c'] == '　' and abs(c['origin'][1] - y_base) <= tol and x_min <= c['origin'][0] <= x_max:
                        return c['origin'], s['size'], s['color']
    return None

def col(i):
    return ((i >> 16 & 255) / 255, (i >> 8 & 255) / 255, (i & 255) / 255)

# ---- 火 (missing from every embedded subset) ----
# p22 FAQ: baseline y = 768-520.347 = 247.653 ; p20: baseline y = 768-440.2284 = 327.77
for pno, yb, xr in [(22, 247.653, (330, 500)), (20, 327.772, (150, 200))]:
    pg = d[pno - 1]
    r = find_placeholder(pg, yb, *xr)
    assert r, ('placeholder not found', pno)
    (ox, oy), size, color = r
    w = put(pg, ox, oy, '火', size, 'b', color=col(color))
    print('火 on p', pno, 'at', round(ox, 1), round(oy, 1), 'size', round(size, 2), 'w', round(w, 2))

# ---- notes ----
# p12: under "27万円〜" of the concierge line
pg = d[11]
put(pg, 297.5, 142.0, NOTE, 9.0, 'b')

# p15: between line 1 and line 2 of the 初任給 box (centered)
pg = d[14]
put(pg, 707.0, 453.5, NOTE, 7.6, 'b', align='center')

# p19: row 1, right after 月給27万円〜
pg = d[18]
hit = pg.search_for('月給27万円')
print('p19 hit', hit)
r = hit[0]
put(pg, r.x1 + 18.15 + 6.0, 156.0, NOTE, 12.5, 'b')

# p22: footnote just under the 初任給 FAQ card (card bottom 313.6, next bubble 323.6)
pg = d[21]
w = fb.text_length(NOTE, fontsize=7.0)
print('p22 note width', round(w, 1))
put(pg, 260.3, 321.0, NOTE, 7.0, 'b', align='center')

# ---- p25: LINE QR -> recruit LINE (lin.ee/Z0JP8sH) and the link annotation ----
import qrcode, numpy as np
from PIL import Image
NEW_URL = 'https://lin.ee/Z0JP8sH'
OLD_URL = 'https://lin.ee/HaJJW2y'
pg = d[24]
imgs = pg.get_images(full=True); assert len(imgs) == 1, imgs
IMG = imgs[0][0]
orig = pymupdf.Pixmap(d, IMG)
if orig.alpha or orig.n > 3:
    orig = pymupdf.Pixmap(pymupdf.csRGB, orig)
oim = Image.frombytes('RGB', (orig.width, orig.height), orig.samples)
logo = oim.crop((90, 88, 180, 174))
q = qrcode.QRCode(version=None, error_correction=qrcode.constants.ERROR_CORRECT_H, box_size=1, border=1)
q.add_data(NEW_URL); q.make(fit=True)
m = np.array(q.get_matrix(), dtype=np.uint8)
W, H = 1048, 1040
qim = Image.fromarray(np.where(m, 0, 255).astype(np.uint8), 'L').resize((W, H), Image.NEAREST).convert('RGB')
lw = int(W * 0.26); lh = int(lw * logo.height / logo.width)
logo2 = logo.resize((lw, lh), Image.LANCZOS)
qim.paste(logo2, ((W - lw) // 2, (H - lh) // 2))
qim.save(SP + '/pdfedit/qr_new.png')
buf = io.BytesIO(); qim.save(buf, 'PNG')
pg.replace_image(IMG, stream=buf.getvalue())
n_upd = 0
for lk in pg.get_links():
    if lk.get('uri') == OLD_URL:
        lk['uri'] = NEW_URL
        pg.update_link(lk)
        n_upd += 1
print('p25 link updated', n_upd, 'qr version', q.version)

d.save(OUT, garbage=3, deflate=True)
print('pass2 saved')
