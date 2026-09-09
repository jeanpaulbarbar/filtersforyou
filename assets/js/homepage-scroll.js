 
(() => {
 'use strict';
 const root=document.getElementById('hp-flow');if(!root)return;
 const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
 const phone=matchMedia('(max-width:859px)');
 const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
 const care=root.querySelector('#ledger'),finish=root.querySelector('#taps');
 const costs=[...care.querySelectorAll('[data-hp-cost]')];
 const carePics=[...care.querySelectorAll('[data-hp-care-photo]')],careDecoded=new Map();
 let carePhotoVersion=0;
 function decodeCare(i){
   if(!careDecoded.has(i)){const img=carePics[i].querySelector('img');img.loading='eager';careDecoded.set(i,img.decode().then(()=>true).catch(()=>{careDecoded.delete(i);return false}));}
   return careDecoded.get(i);
 }
 async function showCarePhoto(i){
   const ticket=++carePhotoVersion,loaded=await decodeCare(i);if(!loaded||ticket!==carePhotoVersion||i!==currentCare)return;
   carePics.forEach((el,n)=>{el.classList.toggle('on',n===i);el.setAttribute('aria-hidden',String(n!==i));});
 }
 const pics=[...finish.querySelectorAll('[data-hp-finish-photo]')];
 const names=[...finish.querySelectorAll('[data-hp-finish-name]')];
 const careNav=[...care.querySelectorAll('[data-hp-jump]')];
 const finishNav=[...finish.querySelectorAll('[data-hp-jump]')];
 let currentCare=-1,currentFinish=-1,wantedFinish=0,version=0,pending=false,ready=false;
 const decoded=new Map();
 function decodePhoto(i){
   if(!decoded.has(i)){
     const picture=pics[i],image=picture.querySelector('img');
     image.loading='eager';
     decoded.set(i,image.decode().then(()=>true).catch(()=>{decoded.delete(i);return false}));
   }
   return decoded.get(i);
 }
 function setCare(i){
   if(currentCare===i)return;currentCare=i;showCarePhoto(i);
   costs.forEach((el,n)=>{el.classList.toggle('on',n===i);if(!reduce){el.inert=n!==i;el.setAttribute('aria-hidden',String(n!==i));}});
   careNav.forEach((el,n)=>{el.classList.toggle('on',n===i);el.setAttribute('aria-current',String(n===i));});
   care.querySelector('[data-sc-stage]').dataset.scVerifyState='care-'+i;
 }
 async function setFinish(i){
   wantedFinish=i;if(currentFinish===i)return;
   const ticket=++version;
   const loaded=await decodePhoto(i);if(!loaded||ticket!==version||wantedFinish!==i)return;
   currentFinish=i;
   pics.forEach((el,n)=>{el.classList.toggle('on',n===i);el.setAttribute('aria-hidden',String(n!==i));});
   names.forEach((el,n)=>{el.classList.toggle('on',n===i);el.setAttribute('aria-hidden',String(n!==i));});
   finishNav.forEach((el,n)=>{el.classList.toggle('on',n===i);el.setAttribute('aria-current',String(n===i));});
   finish.querySelector('[data-sc-stage]').dataset.scVerifyState='finish-'+i;
 }
 function progress(el){const r=el.getBoundingClientRect();return clamp(-r.top/Math.max(1,r.height-innerHeight));}
 function drive(){
   pending=false;if(!ready||reduce)return;
   [care,finish].forEach((el,j)=>{
     const r=el.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;
     const p=progress(el),index=Math.min(4,Math.floor(p*5));
     el.style.setProperty('--hp-progress',p.toFixed(4));
     el.style.setProperty('--hp-zoom',(1+p*.045).toFixed(4));
     if(j===0){setCare(index);careNav.forEach((b,n)=>b.style.setProperty('--hp-fill',clamp(p*5-n).toFixed(3)));}
     else if(index!==wantedFinish||currentFinish!==index)setFinish(index);
   });
 }
 function request(){if(!pending){pending=true;requestAnimationFrame(drive);}}
 
 if(window.ScrollCraft){
   try{root.classList.add('hp-ready');window.ScrollCraft.mount(root);ready=true;}
   catch(_){root.classList.remove('hp-ready');[care,finish].forEach(el=>el.style.height='');}
 }
 if(!ready){careNav.forEach(b=>b.hidden=true);}
 setCare(0);setFinish(0);
 new IntersectionObserver(entries=>{if(entries[0].isIntersecting)carePics.forEach((_,i)=>decodeCare(i));},{rootMargin:'150% 0px'}).observe(care);
 new IntersectionObserver(entries=>{if(entries[0].isIntersecting)pics.forEach((_,i)=>decodePhoto(i));},{rootMargin:'150% 0px'}).observe(finish);
 function jump(el,i){
   if(reduce||!ready){if(el===finish)setFinish(i);return;}
   const top=el.getBoundingClientRect().top+scrollY,travel=el.offsetHeight-innerHeight;
   window.scrollTo({top:top+travel*((i+.45)/5),behavior:'smooth'});
 }
 careNav.forEach((b,i)=>b.addEventListener('click',()=>jump(care,i)));
 finishNav.forEach((b,i)=>b.addEventListener('click',()=>jump(finish,i)));
 addEventListener('scroll',request,{passive:true});addEventListener('resize',()=>{decoded.clear();careDecoded.clear();showCarePhoto(currentCare);request()});
 request();document.fonts.ready.then(request);

 
 
 const wrap=document.getElementById('rmq');if(!wrap)return;
 const rows=[...wrap.querySelectorAll('.rrow')];
 const lanes=rows.map(row=>{
   const originals=[...row.children];
   originals.forEach(card=>{const copy=card.cloneNode(true);copy.inert=true;copy.setAttribute('aria-hidden','true');row.append(copy)});
   return {el:row,first:originals[0],copy:row.children[originals.length],dir:parseInt(row.dataset.dir||'-1'),pos:0,half:0};
 });
 function measure(){lanes.forEach(l=>{l.half=l.copy.offsetLeft-l.first.offsetLeft;if(l.dir>0&&l.pos===0)l.pos=-l.half;});}
 measure();new ResizeObserver(measure).observe(wrap);
 if(reduce)return;
 let visible=false,last=0,vel=0,lastY=scrollY,raf=0;
 function step(t){
   if(!visible||document.hidden){raf=0;last=0;return;}
   if(last){
     const dt=Math.min((t-last)/1000,.05),dy=scrollY-lastY;lastY=scrollY;
     const target=phone.matches?0:clamp(dy/Math.max(dt,.001)/900,-1,1);
     vel+=(target-vel)*Math.min(1,dt*6);
     lanes.forEach(l=>{if(!l.half||l.el.offsetParent===null)return;l.pos+=l.dir*(30+Math.abs(vel)*260)*dt;if(l.pos<=-l.half)l.pos+=l.half;if(l.pos>0)l.pos-=l.half;l.el.style.transform=`translateX(${l.pos.toFixed(2)}px) skewX(${(-vel*4).toFixed(2)}deg)`;});
   }
   last=t;raf=requestAnimationFrame(step);
 }
 function sync(){cancelAnimationFrame(raf);raf=0;last=0;lastY=scrollY;if(visible&&!document.hidden)raf=requestAnimationFrame(step);}
 new IntersectionObserver(es=>{visible=es[0].isIntersecting;sync()},{rootMargin:'80px 0px'}).observe(wrap);
 document.addEventListener('visibilitychange',sync);
})();
