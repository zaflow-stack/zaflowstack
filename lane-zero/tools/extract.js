// Dump the rendered homepage (1440) as flat absolute items per section -> JSON for Figma rebuild.
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const root=path.resolve(__dirname,'..');const out=process.argv[2];
(async()=>{
 const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});
 await p.goto('file://'+root+'/index.html');await p.waitForTimeout(900);
 const data=await p.evaluate(()=>{
  document.documentElement.style.scrollBehavior='auto';
  document.querySelectorAll('.reveal').forEach(e=>{e.classList.add('in');e.style.transition='none'});
  document.querySelectorAll('.bar').forEach(bar=>{const f=bar.querySelector('.bar__fill');f.style.transition='none';f.style.height=`calc(${bar.dataset.h}% - 50px)`});
  document.querySelector('.ticker__list').style.animation='none';
  document.querySelectorAll('.slide__img img').forEach(i=>i.style.transform='none');
  const nav=document.querySelector('.nav');nav.style.position='relative';
  const hex=(c)=>{const m=c.match(/[\d.]+/g);if(!m)return null;const [r,g,b,a=1]=m.map(Number);return {h:'#'+[r,g,b].map(v=>Math.round(v).toString(16).padStart(2,'0')).join(''),a:+a}};
  const sy=window.scrollY;
  const box=e=>{const r=e.getBoundingClientRect();return {x:Math.round(r.left),y:Math.round(r.top+sy),w:Math.round(r.width),h:Math.round(r.height)}};
  const vis=e=>{for(let n=e;n&&n!==document.body;n=n.parentElement){const s=getComputedStyle(n);if(s.display==='none'||s.visibility==='hidden'||+s.opacity===0)return false;}return true;};
  const items=[];
  const inlineOnly=e=>[...e.childNodes].every(n=>n.nodeType===3||(n.nodeType===1&&['inline','inline-block'].includes(getComputedStyle(n).display)&&!n.querySelector('img,svg')&&n.tagName!=='IMG'&&n.tagName!=='SVG'&&n.tagName!=='BUTTON'));
  const walk=e=>{
   if(!vis(e))return;const s=getComputedStyle(e);const bx=box(e);if(bx.w<1||bx.h<1)return;
   const cls=e.className&&e.className.baseVal===undefined?e.className:'';
   if(e.classList.contains('wordmark')){items.push({t:'wm',...bx,light:e.closest('.foot,.lanes')?1:0});return;}
   if(e.classList.contains('foot__giant'))return;
   const bg=hex(s.backgroundColor);if(bg&&bg.a>0&&e!==document.body&&e!==document.documentElement)items.push({t:'rect',...bx,c:bg.h,o:bg.a,n:(e.className||e.tagName).toString().split(' ')[0]});
   for(const [side,dx] of [['Top'],['Bottom'],['Left'],['Right']]){const w=parseFloat(s['border'+side+'Width']);if(w>0&&s['border'+side+'Style']!=='none'){const c=hex(s['border'+side+'Color']);if(!c||c.a===0)continue;const r={t:'rect',c:c.h,o:c.a,n:'line'};if(side==='Top')Object.assign(r,{x:bx.x,y:bx.y,w:bx.w,h:w});if(side==='Bottom')Object.assign(r,{x:bx.x,y:bx.y+bx.h-w,w:bx.w,h:w});if(side==='Left')Object.assign(r,{x:bx.x,y:bx.y,w:w,h:bx.h});if(side==='Right')Object.assign(r,{x:bx.x+bx.w-w,y:bx.y,w:w,h:bx.h});items.push(r);}}
   if(e.tagName==='IMG'){const holder=e.parentElement;const hb=box(holder);items.push({t:'img',...(hb.w<bx.w?hb:bx),alt:e.alt,src:e.getAttribute('src')});return;}
   if(e.tagName==='svg'||e.tagName==='SVG'){if(e.closest('.icon-btn')){items.push({t:'icon',...bx});return;}
     const c=e.cloneNode(true);const orig=e.querySelectorAll('*');c.querySelectorAll('*').forEach((n,i)=>{const cs=getComputedStyle(orig[i]);['stroke','stroke-width','fill','stroke-dasharray','stroke-linecap','stroke-linejoin'].forEach(k=>{const v=cs.getPropertyValue(k);if(v)n.setAttribute(k,v)});if(n.tagName==='text'){n.setAttribute('font-family','JetBrains Mono');n.setAttribute('font-size','14')}});
     c.setAttribute('width',bx.w);c.setAttribute('height',bx.h);items.push({t:'svg',...bx,svg:c.outerHTML});return;}
   const disp=s.display;const flexy=/flex|grid/.test(disp);
   const txtItem=(node,bx2,st)=>{const c=hex(st.color);const fam=st.fontFamily.includes('Artavion')?'Display':st.fontFamily.includes('Mono')?'Mono':'Inter';
     const spans=node.nodeType===1?[...node.querySelectorAll('span,em,b,i,a')].filter(sp=>getComputedStyle(sp).color!==st.color&&sp.innerText.trim()).map(sp=>({s:sp.innerText,c:hex(getComputedStyle(sp).color).h})):[];
     const str=(node.nodeType===1?node.innerText:node.textContent).replace(/\u00a0/g,' ').replace(/\s*\n\s*/g,node.nodeType===1&&node.querySelector&&node.querySelector('br')?'\n':' ').trim();
     const lh=st.lineHeight==='normal'?parseFloat(st.fontSize)*1.2:parseFloat(st.lineHeight);
     items.push({t:'text',...bx2,s:str,fam,wt:+st.fontWeight,sz:parseFloat(st.fontSize),lh,ls:st.letterSpacing==='normal'?0:parseFloat(st.letterSpacing),up:st.textTransform==='uppercase'?1:0,c:c.h,o:c.a,al:st.textAlign,spans,one:bx2.h<lh*1.6?1:0});};
   const rangeBox=n=>{const r=document.createRange();r.selectNodeContents(n);const b=r.getBoundingClientRect();return {x:Math.round(b.left),y:Math.round(b.top+sy),w:Math.ceil(b.width),h:Math.round(b.height)}};
   const kids=[...e.childNodes];
   const mixed=kids.some(n=>n.nodeType===1&&(getComputedStyle(n).fontSize!==s.fontSize||getComputedStyle(n).fontFamily!==s.fontFamily));
   const hasText=kids.some(n=>n.nodeType===3&&n.textContent.trim());
   if(!flexy&&!mixed&&(hasText||(e.children.length&&inlineOnly(e)))&&e.innerText.trim()){
     const rb=rangeBox(e);txtItem(e,{x:Math.min(bx.x,rb.x),y:rb.y,w:Math.max(rb.w,1),h:rb.h},s);return;}
   if(flexy||mixed){for(const n of kids){if(n.nodeType===3&&n.textContent.trim()){txtItem(n,rangeBox(n),s);}else if(n.nodeType===1)walk(n);}return;}
   for(const ch of e.children)walk(ch);
  };
  const secs=[['Ticker','.ticker'],['Header','.nav'],['Cover','.cover'],['Latest','#latest'],['Race desk','#desk'],['The Grid','#grid'],['The Lab','#lab'],['Monday split','#split'],['Footer','.foot']];
  const res=[];for(const [name,sel] of secs){const el=document.querySelector(sel);const sb=box(el);items.length=0;walk(el);
    const bgc=hex(getComputedStyle(el).backgroundColor);
    res.push({name,...sb,bg:bgc&&bgc.a>0?bgc.h:'#F4F4F2',items:items.map(i=>({...i,x:i.x-sb.x,y:i.y-sb.y}))});}
  return res;
 });
 fs.writeFileSync(out,JSON.stringify(data));console.log(data.map(s=>`${s.name} y${s.y} h${s.h} items${s.items.length}`).join('\n'));await b.close();
})();
