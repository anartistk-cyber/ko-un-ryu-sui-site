import pikepdf, hashlib, sys
src,dst=sys.argv[1],sys.argv[2]
p=pikepdf.open(src)
def sig(o):
    d={k:str(v) for k,v in o.items() if k!='/Length'}
    return hashlib.md5(o.read_raw_bytes()).hexdigest()+repr(sorted(d.items()))
canon={}; remap={}
for o in p.objects:
    if isinstance(o,pikepdf.Stream):
        try: s=sig(o)
        except Exception: continue
        if any(isinstance(v,pikepdf.Object) and v.is_indirect for v in o.values()): 
            continue   # skip streams whose dict holds references (e.g. SMask) to stay safe
        if s in canon: remap[o.objgen]=canon[s]
        else: canon[s]=o.objgen
print('duplicates to merge:',len(remap))
seen=set()
def walk(o):
    if o.is_indirect:
        if o.objgen in seen: return
        seen.add(o.objgen)
    if isinstance(o,pikepdf.Dictionary) or isinstance(o,pikepdf.Stream):
        for k in list(o.keys()):
            v=o[k]
            if isinstance(v,pikepdf.Object) and v.is_indirect and v.objgen in remap:
                o[k]=p.get_object(remap[v.objgen])
            else:
                if isinstance(v,(pikepdf.Dictionary,pikepdf.Array,pikepdf.Stream)): walk(v)
    elif isinstance(o,pikepdf.Array):
        for i in range(len(o)):
            v=o[i]
            if isinstance(v,pikepdf.Object) and v.is_indirect and v.objgen in remap:
                o[i]=p.get_object(remap[v.objgen])
            elif isinstance(v,(pikepdf.Dictionary,pikepdf.Array,pikepdf.Stream)): walk(v)
walk(p.Root); walk(p.trailer) if False else None
p.remove_unreferenced_resources()
p.save(dst,object_stream_mode=pikepdf.ObjectStreamMode.generate,compress_streams=True,recompress_flate=True,stream_decode_level=pikepdf.StreamDecodeLevel.none)
print('saved',dst)
