from PIL import Image, ImageOps
import sys
R='raw/';O='img/'
P={ # name: (src, cx, cy, hfrac)
 'p-kerley':('kerley-2018',.55,.20,.80),
 'p-lyles':('lyles-gyulai',.465,.13,.62),
 'p-jacobs':('jacobs-portrait',.48,.26,1.0),
 'p-thompson':('thompson-2024',.55,.24,.75),
 'p-simbine':('simbine-2019',.36,.17,.70),
 'p-seville':('seville-oly',.47,.17,.55),
 'p-degrasse':('degrasse-2019',.43,.24,.72),
 'p-bolt':('bolt-osaka',.47,.13,.42),
}
for k,(s,cx,cy,hf) in P.items():
    im=Image.open(R+s+'.jpg').convert('RGB');W,H=im.size
    h=int(H*hf);w=int(h*0.8)
    if w>W: w=W;h=int(w/0.8)
    l=int(cx*W-w/2);t=int(cy*H-h*0.36)
    l=max(0,min(l,W-w));t=max(0,min(t,H-h))
    c=im.crop((l,t,l+w,t+h)).resize((800,1000),Image.LANCZOS)
    c.save(O+k+'.jpg',quality=84)
W={'hero-start':'rio-100m','hero-lyles':'lyles-100m','hero-thompson':'thompson-oly','hero-omanyala':'omanyala-au',
 'latest-bend':'lyles-oly','latest-400':'kerley-indoor','latest-60':'heats-2023','latest-jacobs':'jacobs-2021','latest-blocks':'omanyala-oly',
 'desk-60':'heats-2023','desk-100':'rio-100m','desk-200':'lyles-100m','desk-400':'kerley-indoor','desk-hr':'thompson-oly'}
for k,s in W.items():
    im=Image.open(R+s+'.jpg').convert('RGB');im.thumbnail((1600,1600));im.save(O+k+'.jpg',quality=82)
