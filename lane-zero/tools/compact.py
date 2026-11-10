import json,sys
S=sys.argv[1]
d=json.load(open(S+'/layout.json'))
def style(i):
    sz=i['sz'];r=i['fam']
    if r=='Display': return 'Display/XL 136' if sz>100 else 'Display/L 72' if sz>50 else 'Display/M 28' if sz>=25 else 'Display/S 22'
    if r=='Mono': return 'Label/M 13' if sz>=13 else 'Label/S 11' if sz>=11 else 'Label/XS 10'
    if i['wt']>=600:
        if sz>=75: return 'Title/H1 84'
        if sz>=55: return 'Title/H2 60'
        if sz>=38: return 'Title/H3 42'
        if sz>=30: return 'Title/H4 32'
        if sz>=19: return 'Title/H5 21'
        if sz>=16: return 'Title/H6 18'
        return 'Title/Button 12'
    return 'Body/Lede 17' if sz>=16.5 else 'Body/Regular 15' if sz>=14.5 else 'Body/Small 13' if sz>=13 else 'Body/XS 12'
for s in d:
    its=[]
    for i in s['items']:
        if i['x']>=s['w'] or i['y']>=s['h'] or i['x']+i['w']<=0: continue
        t=i['t']
        if t=='rect': its.append(['r',i['x'],i['y'],i['w'],i['h'],i['c'],round(i['o'],2)])
        elif t=='img': its.append(['i',i['x'],i['y'],i['w'],i['h'],i['alt']])
        elif t=='wm': its.append(['w',i['x'],i['y'],i['h'],i['light']])
        elif t=='icon': its.append(['c',i['x'],i['y'],i['w'],i['h']])
        elif t=='svg': its.append(['s',i['x'],i['y'],i['w'],i['h'],i['svg']])
        else:
            if not i['s']: continue
            txt=i['s'].upper() if i['up'] else i['s']
            txt=txt.replace(' — ',', ').replace('—',',').replace('–','-')
            sp=[[x['s'].upper() if i['up'] else x['s'],x['c']] for x in i['spans']]
            its.append(['t',i['x'],i['y'],i['w'],i['h'],txt,style(i),i['c'],1 if i['al'] in('right','end') else 0,sp,i['one']])
    js=json.dumps({'n':s['name'],'y':s['y'],'h':s['h'],'bg':s['bg'],'it':its},separators=(',',':'),ensure_ascii=False)
    open(f"{S}/sec-{s['name'].replace(' ','_')}.json",'w').write(js);print(s['name'],len(js))
