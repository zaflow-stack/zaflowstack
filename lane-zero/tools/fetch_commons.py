import hashlib,urllib.parse,subprocess,sys,time,os
items=[l.split('|') for l in sys.stdin.read().strip().splitlines()]
for slug,name in items:
    out=f"{slug}.jpg"
    if os.path.exists(out) and os.path.getsize(out)>20000: continue
    n=name.replace(' ','_');h=hashlib.md5(n.encode()).hexdigest();q=urllib.parse.quote(n)
    for w in ("1280","960"):
        url=f"https://upload.wikimedia.org/wikipedia/commons/thumb/{h[0]}/{h[:2]}/{q}/{w}px-{q}"
        code=subprocess.run(["curl","-s","-o",out,"-w","%{http_code}","-A","Mozilla/5.0 (X11; Linux x86_64) student-design-project/1.0",url],capture_output=True,text=True).stdout
        if code=="200": break
        time.sleep(15)
    print(slug,code,os.path.getsize(out) if os.path.exists(out) else 0,flush=True)
    time.sleep(12)
