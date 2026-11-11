import sys
sys.path.insert(0,'/path/to/work/pdftools')
import pymupdf, pdfglyph as G
SP='/path/to/work'
d=pymupdf.open(SP+'/pdf/koun_kaishaannai_2027_light.pdf')
def streams(p):
    out=[]
    for x in p.get_contents(): out.append((x,d.xref_stream(x).decode('latin1')))
    # form xobjects
    return out
if __name__=='__main__':
    n=int(sys.argv[1]); keys=sys.argv[2:]
    p=d[n-1]; fonts=G.page_fonts(d,p)
    for x,s in streams(p):
        for (a,b,res,cids,txt) in G.decode_runs(s,fonts):
            if not keys or any(k in txt for k in keys):
                print(x,a,res,fonts.get(res,(0,'?'))[1],repr(txt),' '.join('%04X'%c for c in cids))
