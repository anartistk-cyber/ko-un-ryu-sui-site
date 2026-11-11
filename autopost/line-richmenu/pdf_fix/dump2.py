import sys
sys.path.insert(0,'/path/to/work/pdftools')
import pymupdf, pdfglyph as G
SP='/path/to/work'
d=pymupdf.open(SP+'/pdf/koun_kaishaannai_2027_light.pdf')
n=int(sys.argv[1]); keys=sys.argv[2:]
p=d[n-1]
for sx,fonts in G.walk(d,p):
    s=d.xref_stream(sx).decode('latin1')
    for (a,b,res,cids,txt) in G.decode_runs(s,fonts):
        if not keys or any(k in txt for k in keys):
            print(sx,a,res,fonts.get(res,(0,'?'))[1],repr(txt),' '.join('%04X'%c for c in cids))
