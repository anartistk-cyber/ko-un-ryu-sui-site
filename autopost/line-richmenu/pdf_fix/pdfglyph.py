"""Helpers: decode CID text in a PDF content stream via ToUnicode maps (PyMuPDF)."""
import re
import pymupdf

def parse_tounicode(doc, xref):
    s = doc.xref_stream(xref).decode('latin1')
    m = {}
    for blk in re.findall(r'beginbfchar(.*?)endbfchar', s, re.S):
        for a, b in re.findall(r'<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>', blk):
            m[int(a, 16)] = bytes.fromhex(b).decode('utf-16-be', 'replace')
    for blk in re.findall(r'beginbfrange(.*?)endbfrange', s, re.S):
        for a, b, c in re.findall(r'<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>', blk):
            a, b = int(a, 16), int(b, 16)
            base = int(c, 16)
            for i in range(a, b + 1):
                m[i] = chr(base + i - a)
    return m

def page_fonts(doc, page, resources_xref=None):
    """return {resname: (xref, basefont, cid->char)}"""
    out = {}
    for f in page.get_fonts(full=True):
        xref, _, _, base, res, enc, _ = f[:7]
        tu = doc.xref_get_key(xref, 'ToUnicode')
        cmap = {}
        if tu[0] == 'xref':
            cmap = parse_tounicode(doc, int(tu[1].split()[0]))
        out[res] = (xref, base, cmap)
    return out

TOK = re.compile(r'/(\S+)\s+([\d.\-]+)\s+Tf|<([0-9A-Fa-f]*)>\s*Tj|\[(.*?)\]\s*TJ', re.S)

def decode_runs(stream, fonts):
    """yield (start, end, resname, [cids], text) for each shown string, tracking Tf"""
    cur = None
    runs = []
    for m in TOK.finditer(stream):
        if m.group(1):
            cur = m.group(1)
        elif m.group(3) is not None:
            h = m.group(3)
            cids = [int(h[i:i + 4], 16) for i in range(0, len(h), 4)]
            cm = fonts.get(cur, (None, None, {}))[2]
            runs.append((m.start(), m.end(), cur, cids, ''.join((cm.get(c) if cm else cid2uni(c)) or '?' for c in cids)))
        elif m.group(4) is not None:
            arr = m.group(4)
            cids = []
            for h in re.findall(r'<([0-9A-Fa-f]*)>', arr):
                cids += [int(h[i:i + 4], 16) for i in range(0, len(h), 4)]
            cm = fonts.get(cur, (None, None, {}))[2]
            runs.append((m.start(), m.end(), cur, cids, ''.join((cm.get(c) if cm else cid2uni(c)) or '?' for c in cids)))
    return runs


# ---- CFF charset (which CIDs exist in a subset font) and Adobe-Japan1 maps ----
import io
from pdfminer.cmapdb import CMapDB
from fontTools.cffLib import CFFFontSet
_UM = CMapDB.get_unicode_map('Adobe-Japan1', vertical=False)

def cid2uni(cid):
    try:
        return _UM.get_unichr(cid)
    except Exception:
        return '?'

_uni2cid = None
def uni2cids(ch):
    global _uni2cid
    if _uni2cid is None:
        _uni2cid = {}
        for cid in range(0, 23061):
            try:
                u = _UM.get_unichr(cid)
            except Exception:
                continue
            _uni2cid.setdefault(u, []).append(cid)
    return _uni2cid.get(ch, [])

def font_desc_xref(doc, fxref):
    k = doc.xref_get_key(fxref, 'DescendantFonts')
    s = k[1]
    if k[0] == 'xref':
        s = doc.xref_object(int(s.split()[0]))
    m = re.search(r'(\d+)\s+0\s+R', s)
    return int(m.group(1))

def font_cids(doc, fxref):
    """set of CIDs present in the embedded CFF subset (None if not CID-keyed CFF)"""
    dx = font_desc_xref(doc, fxref)
    fd = doc.xref_get_key(dx, 'FontDescriptor')
    fdx = int(fd[1].split()[0])
    ff = doc.xref_get_key(fdx, 'FontFile3')
    if ff[0] != 'xref':
        return None
    data = doc.xref_stream(int(ff[1].split()[0]))
    cff = CFFFontSet()
    cff.decompile(io.BytesIO(data), None)
    top = cff[cff.fontNames[0]]
    cs = top.charset
    out = set()
    for nm in cs:
        if nm.startswith('cid'):
            out.add(int(nm[3:]))
    return out

def font_widths(doc, fxref):
    """parse /W of descendant font -> dict cid->width, plus DW"""
    dx = font_desc_xref(doc, fxref)
    dw = doc.xref_get_key(dx, 'DW')
    DW = float(dw[1]) if dw[0] != 'null' else 1000.0
    wk = doc.xref_get_key(dx, 'W')
    W = {}
    if wk[0] == 'null':
        return W, DW
    s = wk[1]
    if wk[0] == 'xref':
        s = doc.xref_object(int(wk[1].split()[0]))
    toks = re.findall(r'\[|\]|[\d.\-]+', s)
    i = 0
    # skip outer bracket
    arr = toks[1:-1] if toks and toks[0] == '[' else toks
    i = 0
    while i < len(arr):
        c1 = int(float(arr[i])); i += 1
        if arr[i] == '[':
            i += 1
            c = c1
            while arr[i] != ']':
                W[c] = float(arr[i]); c += 1; i += 1
            i += 1
        else:
            c2 = int(float(arr[i])); i += 1
            w = float(arr[i]); i += 1
            for c in range(c1, c2 + 1):
                W[c] = w
    return W, DW


# ---- generic object (page or form xobject) traversal ----
def _font_map_of(doc, xref):
    """resname -> font xref for object xref (page or form)"""
    out = {}
    k = doc.xref_get_key(xref, 'Resources')
    if k[0] == 'null':
        return out
    base = 'Resources'
    if k[0] == 'xref':
        rx = int(k[1].split()[0])
        fk = doc.xref_get_key(rx, 'Font')
        src = (rx, 'Font')
    else:
        fk = doc.xref_get_key(xref, 'Resources/Font')
        src = (xref, 'Resources/Font')
    if fk[0] == 'null':
        return out
    s = fk[1]
    if fk[0] == 'xref':
        s = doc.xref_object(int(fk[1].split()[0]))
    for nm, x in re.findall(r'/(\S+?)\s+(\d+)\s+0\s+R', s):
        out[nm] = int(x)
    return out

def _xobj_map_of(doc, xref):
    out = {}
    k = doc.xref_get_key(xref, 'Resources')
    if k[0] == 'null':
        return out
    if k[0] == 'xref':
        rx = int(k[1].split()[0])
        xk = doc.xref_get_key(rx, 'XObject')
    else:
        xk = doc.xref_get_key(xref, 'Resources/XObject')
    if xk[0] == 'null':
        return out
    s = xk[1]
    if xk[0] == 'xref':
        s = doc.xref_object(int(xk[1].split()[0]))
    for nm, x in re.findall(r'/(\S+?)\s+(\d+)\s+0\s+R', s):
        out[nm] = int(x)
    return out

def walk(doc, page):
    """yield (stream_xref, fonts{res:(fxref,base,cmap)}) for page content + all nested form xobjects"""
    seen = set()
    def mkfonts(owner):
        fm = _font_map_of(doc, owner)
        r = {}
        for nm, fx in fm.items():
            base = doc.xref_get_key(fx, 'BaseFont')[1]
            tu = doc.xref_get_key(fx, 'ToUnicode')
            cmap = parse_tounicode(doc, int(tu[1].split()[0])) if tu[0] == 'xref' else {}
            r[nm] = (fx, base, cmap)
        return r
    def rec(owner, streams):
        fonts = mkfonts(owner)
        for sx in streams:
            if sx in seen:
                continue
            seen.add(sx)
            yield sx, fonts
        for nm, fx in _xobj_map_of(doc, owner).items():
            if fx in seen:
                continue
            st = doc.xref_get_key(fx, 'Subtype')[1]
            if st == '/Form':
                yield from rec(fx, [fx])
    yield from rec(page.xref, page.get_contents())
