"""Build the corrected 会社案内2027 (light) PDF.
pass 1: content-stream glyph edits (same fonts as the original -> identical look)
pass 2: small overlays (火 glyph that is missing from every embedded subset, salary notes) + QR/link on p25
"""
import sys, re, io
sys.path.insert(0, '/path/to/work/pdftools')
import pymupdf, pdfglyph as G

SP = '/path/to/work'
SRC = SP + '/pdf/koun_kaishaannai_2027_light.pdf'
PASS1 = SP + '/pdfedit/pass1.pdf'
OUT = SP + '/pdfedit/koun_kaishaannai_2027_light_v2.pdf'
FB = SP + '/pdftools/fonts/NotoJP-Bold-sub.otf'
FM = SP + '/pdftools/fonts/NotoJP-Medium-sub.otf'
INK = (0.137, 0.094, 0.082)

d = pymupdf.open(SRC)

def rep(xref, old, new, count=1):
    s = d.xref_stream(xref).decode('latin1')
    n = s.count(old)
    assert n == count, ('replace count', xref, old[:60].replace('\n', '\\n'), n)
    s = s.replace(old, new)
    d.update_stream(xref, s.encode('latin1'))

def cut(xref, start_marker, end_marker, new):
    """replace the text from start_marker up to (not including) end_marker"""
    s = d.xref_stream(xref).decode('latin1')
    a = s.find(start_marker); assert a >= 0 and s.count(start_marker) == 1, ('start', xref, start_marker[:50])
    b = s.find(end_marker, a); assert b > a, ('end', xref, end_marker[:50])
    s = s[:a] + new + s[b:]
    d.update_stream(xref, s.encode('latin1'))

# ---------------- p21: （19:00最終受付）→ 18:00 ----------------
rep(1316,
    "/C0_2 17.059 Tf\n-3.411 Tc <001A>Tj\n/C0_1 17.059 Tf\n-3.412 Tc <027F>Tj\n0.853 Tc <001100110837",
    "-3.411 Tc <0019>Tj\n-3.412 Tc <027F>Tj\n0.853 Tc <001100110837")

# ---------------- p22: 営業時間 19:00最終受付 → 18:00 ----------------
rep(1330,
    "/C0_3 8.935 Tf\n-2.03 Tc 2 Tr 20.016 0 Td\n<001A>Tj\n/C0_0 8.935 Tf\n-2.029 Tc 0 Tr 3.2 0 Td\n<027F>Tj",
    "/C0_0 8.935 Tf\n-2.03 Tc 0 Tr 20.016 0 Td\n<0019>Tj\n-2.029 Tc 3.2 0 Td\n<027F>Tj")

# ---------------- p22: 年中無休 → 月・火が定休 (火 = placeholder, drawn in pass 2) ----------------
rep(1330,
    "/C0_3 8 Tf\n-0.644 Tc 2 Tr <0CE50BA40EC1>Tj\n0.071 Tc <0673>Tj\n/C0_0 8.935 Tf\n0.17 Tc 0 Tr <037003620355>Tj\n-5.009 Tc <027A>Tj",
    "/C0_0 8.935 Tf\n0.17 Tc 0 Tr <0744027E027903550C0606730370>Tj\n-5.009 Tc <027A>Tj")

# ---------------- p20: 年中無休 (不定休) → 月・火 (不定休あり) ----------------
rep(1311,
    "/C0_4 15.634 Tf\n-0.156 Tc 0.223 -20.369 Td\n<0CE5>Tj\n1 0 0 1 152.8092 440.2284 Tm\n<0BA4>Tj\n1 0 0 1 168.2872 440.2284 Tm\n<0EC1>Tj\n1 0 0 1 183.7652 440.2284 Tm\n<0673>Tj\n/C0_1 15.634 Tf\n0.782 Tc 0 Tr 1 0 0 1 199.2432 440.2284 Tm\n<027900090DC60C060673000A>Tj",
    "/C0_1 15.634 Tf\n-0.156 Tc 0 Tr 0.223 -20.369 Td\n<0744>Tj\n1 0 0 1 152.8092 440.2284 Tm\n<027E>Tj\n1 0 0 1 168.2872 440.2284 Tm\n<0279>Tj\n0.782 Tc 1 0 0 1 183.7652 440.2284 Tm\n<027900090DC60C060673034B0393000A>Tj")

# ---------------- p8: 正社員4名→5名, アルバイト6名→8名 ----------------
rep(1128, "2 Tr 26.344 0 Td\n<0015>Tj", "2 Tr 26.344 0 Td\n<0016>Tj")
rep(1128, "/C0_2 9.756 Tf\n2 Tr 7.62 -0.019 Td\n<0017>Tj", "/C0_1 9.756 Tf\n2 Tr 7.62 -0.019 Td\n<0019>Tj")

# ---------------- p12: ￥270,000 → 27万円 (and nudge the line up a little to make room for the note) ----------------
cut(671, "/C0_1 23 Tf\n2 Tr <0279>Tj\n/C0_0 23 Tf\n0 Tr <02C70013>Tj", "0 Tr [<001100110011000102990001000C",
    "/C0_0 23 Tf\n0 Tr <0279001300180EAA0501>Tj\n")
rep(671, "0 Tr [<001100110011000102990001000C", "0 Tr [<02990001000C")
rep(671, "0 Tc 0 Tw 48.595 635.028 Td\n<02D7>Tj", "0 Tc 0 Tw 48.595 639.028 Td\n<02D7>Tj")

# ---------------- p19: 月給¥270,000〜 → 月給27万円〜 ----------------
rep(1293,
    "-1.815 Tc <068502C7>Tj\n0 Tc <0013>Tj\n/C0_3 18.151 Tf\n2 Tr <0018>Tj\n/C0_2 18.151 Tf\n0 Tr <0011000D0011001100110299>Tj",
    "-1.815 Tc <0685>Tj\n0 Tc <001300180EAA05010299>Tj")

# ---------------- p15: make room under 初任給27万円〜 for the note ----------------
rep(1243, "-135.515 -26.917 Td\n<07A6>Tj", "-135.515 -37.417 Td\n<07A6>Tj")
s = d.xref_stream(1243).decode('latin1')
assert s.count('304.069') == 5, s.count('304.069')
d.update_stream(1243, s.replace('304.069', '293.569').encode('latin1'))

d.save(PASS1, garbage=3, deflate=True)
print('pass1 saved')
