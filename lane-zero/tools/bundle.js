// Bundle the rendered homepage into one self-contained HTML for html_to_figma.
// usage: node tools/bundle.js <out.html> [mobile] [grey]
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const root=path.resolve(__dirname,'..');const out=process.argv[2];const mobile=process.argv.includes('mobile');const grey=process.argv.includes('grey');
(async()=>{
 const b=await chromium.launch();const p=await b.newPage({viewport:{width:mobile?390:1440,height:900}});
 await p.goto('file://'+root+'/index.html');await p.waitForTimeout(800);
 const wm=fs.readFileSync(root+'/assets/wordmark.svg','utf8');const wmL=fs.readFileSync(root+'/assets/wordmark-light.svg','utf8');
 const imgDir=process.env.IMG_DIR||root+'/assets/img';const imgs={};for(const f of fs.readdirSync(imgDir)){imgs['assets/img/'+f]='data:image/jpeg;base64,'+fs.readFileSync(imgDir+'/'+f).toString('base64');}
 const css=fs.readFileSync(root+'/styles.css','utf8').replace(/@font-face[^}]+}/,'');
 const html=await p.evaluate(({wm,wmL,imgs,css,grey,mobile})=>{
   document.querySelectorAll('.reveal').forEach(e=>{e.classList.add('in');e.style.transitionDelay='0ms'});
   document.querySelectorAll('.bar').forEach(bar=>bar.querySelector('.bar__fill').style.height=`calc(${bar.dataset.h}% - 50px)`);
   document.querySelectorAll('.wordmark').forEach(w=>{const light=w.classList.contains('wordmark--light')||w.closest('.foot');const h=w.classList.contains('wordmark--xl')?52:26;w.innerHTML=(light?wmL:wm).replace(/width="[^"]+" height="[^"]+"/,`height="${h}" style="height:${h}px;width:auto;display:block"`);});
   const g=document.querySelector('.foot__giant');if(g)g.remove();
   document.querySelectorAll('img').forEach(i=>{const s=i.getAttribute('src');if(grey){i.removeAttribute('src');i.style.background='#C8C8C4';}else if(imgs[s])i.src=imgs[s];});
   document.querySelectorAll('script,link[rel=stylesheet],link[rel=preconnect]').forEach(s=>s.remove());
   const l=document.querySelector('.ticker__list');l.style.animation='none';
   document.querySelectorAll('.cover__bars span').forEach((s,i)=>{if(i===0){s.style.setProperty('--x','1')}});
   const st=document.createElement('style');
   let extra='.card h3 a{background:none!important}'+(mobile?'':'html,body{width:1440px!important;min-width:1440px}')+'.reveal{opacity:1!important;transform:none!important}.slide__img img{transform:none!important}.cover__bars [aria-selected=true] span::after{animation:none;transform:scaleX(.35)}.dot{animation:none}.lanes{display:none!important}html{scroll-behavior:auto}';
   if(grey) extra+='.slide__img,.card__img,.desk__img,.face{background:#C8C8C4!important}.slide__img::after{background:none}img{filter:none!important;opacity:0}.grid-wall,.lab{background:#3A3A37!important}';
   let c=css; if(mobile){c=c.replace(/@media \(max-width:(1180|820)px\)\{([\s\S]*?)\n\}/g,(m,w,body)=>body);}
   st.textContent=`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');`+c+extra;
   document.head.appendChild(st);
   return '<!doctype html>'+document.documentElement.outerHTML;
 },{wm,wmL,imgs,css,grey,mobile});
 fs.writeFileSync(out,html);console.log(out,(html.length/1e6).toFixed(2)+'MB');await b.close();
})();
