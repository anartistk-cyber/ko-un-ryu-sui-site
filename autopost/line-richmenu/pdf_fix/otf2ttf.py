import sys
from fontTools.ttLib import TTFont, newTable
from fontTools.pens.cu2quPen import Cu2QuPen
from fontTools.pens.ttGlyphPen import TTGlyphPen

def convert(src, dst):
    f = TTFont(src)
    assert f.sfntVersion == 'OTTO'
    gs = f.getGlyphSet()
    order = f.getGlyphOrder()
    glyphs = {}
    for g in order:
        pen = TTGlyphPen(gs)
        gs[g].draw(Cu2QuPen(pen, 1.0, reverse_direction=True))
        glyphs[g] = pen.glyph()
    f['loca'] = newTable('loca')
    f['glyf'] = glyf = newTable('glyf')
    glyf.glyphOrder = order
    glyf.glyphs = glyphs
    del f['CFF ']
    if 'VORG' in f: del f['VORG']
    glyf.compile(f)
    # hmtx lsb from glyf
    hmtx = f['hmtx']
    for g in order:
        adv, lsb = hmtx[g]
        gl = glyf[g]
        xmin = getattr(gl, 'xMin', 0) if gl.numberOfContours else 0
        hmtx[g] = (adv, xmin)
    maxp = f['maxp']
    maxp.tableVersion = 0x00010000
    for a in ('maxZones','maxTwilightPoints','maxStorage','maxFunctionDefs','maxInstructionDefs','maxStackElements','maxSizeOfInstructions','maxComponentElements'):
        setattr(maxp, a, 0)
    maxp.maxZones = 1
    maxp.maxPoints = maxp.maxContours = maxp.maxCompositePoints = maxp.maxCompositeContours = maxp.maxComponentDepth = 0
    f['post'].formatType = 2.0
    f['post'].extraNames = []
    f['post'].mapping = {}
    f['post'].glyphOrder = order
    f.sfntVersion = '\x00\x01\x00\x00'
    f.save(dst)

for w in ('Bold', 'Medium'):
    convert(f'fonts/NotoJP-{w}-sub.otf', f'fonts/NotoJP-{w}-sub.ttf')
    print('ok', w)
