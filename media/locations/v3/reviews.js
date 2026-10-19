(()=>{const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;const phone=matchMedia('(max-width:859px)');const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
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
