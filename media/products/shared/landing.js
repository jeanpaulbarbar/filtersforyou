(()=>{'use strict';



const root=document.querySelector('#pure-plus-page[data-landing]');if(!root||root.dataset.landing==='reserve')return;
const NAME=root.dataset.productName||'';
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches,phoneMQ=matchMedia('(max-width:859px)');

const picker=root.querySelector('[data-rv-picker]');
const INCLUDED=picker?picker.dataset.included:'',LABEL=picker?picker.dataset.label:'';
let current=INCLUDED;
if(picker){
 const list=[...picker.querySelectorAll('.rc-swatch')],all=[...root.querySelectorAll('.rc-swatch')];
 const photo=root.querySelector('#rc-image'),frame=photo.closest('.rc-photo'),source=photo.parentElement.querySelector('source');
 const nameEl=root.querySelector('#rc-name'),count=root.querySelector('.rc-count'),input=root.querySelector('[name=tap_choice]');
 const names=[...root.querySelectorAll('[data-rv-name]')],dots=[...root.querySelectorAll('[data-rv-dot]')],notes=[...root.querySelectorAll('[data-rv-tapnote]')];
 const find=n=>list.find(b=>b.dataset.finish===n),srcOf=b=>phoneMQ.matches&&b.dataset.msrc?b.dataset.msrc:b.dataset.src;
 let ticket=0,warmed=false;
 const warm=()=>{if(warmed)return;warmed=true;list.forEach(b=>{const i=new Image();i.src=srcOf(b)})};
 
 const show=async n=>{const t=++ticket,b=find(n),src=srcOf(b),img=new Image();img.src=src;try{await img.decode()}catch{}if(t!==ticket)return;
  const commit=()=>{if(source)source.srcset=b.dataset.msrc||b.dataset.src;photo.src=b.dataset.src;photo.alt=b.getAttribute('aria-label')};
  if(reduce){commit();return}
  img.className='rv-fade';img.alt='';img.setAttribute('aria-hidden','true');frame.querySelectorAll('.rv-fade').forEach(x=>x.remove());frame.append(img);
  requestAnimationFrame(()=>img.classList.add('on'));
  setTimeout(()=>{if(t!==ticket)return;commit();photo.decode().catch(()=>{}).then(()=>{if(t===ticket)img.remove()})},300)};
 const set=(n,swap=true)=>{const b=find(n);if(!b)return;current=n;
  all.forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.finish===n)));
  names.forEach(x=>x.textContent=n);root.querySelectorAll('[data-rv-short]').forEach(x=>x.textContent=n.replace(' filtered','').replace(' mixer',''));dots.forEach(x=>x.style.background=b.style.getPropertyValue('--finish'));
  nameEl.textContent=n;count.textContent=String(list.indexOf(b)+1).padStart(2,'0')+' / '+String(list.length).padStart(2,'0');
  notes.forEach(x=>x.textContent=n===INCLUDED?'Included with '+NAME+'.':'An upgrade, quoted separately.');
  if(input){input.value=n;input.setAttribute('value',n)}
  root.querySelectorAll('[data-rv-thumb]').forEach(x=>x.src=b.dataset.src);
  if(swap)show(n)};
 all.forEach(b=>b.addEventListener('click',()=>{warm();set(b.dataset.finish)}));
 picker.addEventListener('pointerenter',warm,{once:true});picker.addEventListener('touchstart',warm,{once:true,passive:true});
 list.forEach((b,i)=>b.addEventListener('keydown',e=>{let k;if(e.key==='ArrowRight'||e.key==='ArrowDown')k=(i+1)%list.length;else if(e.key==='ArrowLeft'||e.key==='ArrowUp')k=(i+list.length-1)%list.length;else return;e.preventDefault();warm();list[k].focus();set(list[k].dataset.finish)}));
 
 const wanted=new URLSearchParams(location.search).get(picker.dataset.param||'choice');
 const hit=wanted&&list.find(x=>x.dataset.finish.toLowerCase().replace(/ /g,'-')===wanted.toLowerCase());
 if(hit)set(hit.dataset.finish);else set(current,false);
 const formPick=root.querySelector('.rv-form-colour');
 if(formPick)formPick.querySelectorAll('.rc-swatch').forEach(b=>b.addEventListener('click',()=>setTimeout(()=>formPick.open=false,180)));
}


const tapInput=root.querySelector('[name=tap_choice]');
let tap={label:'Chrome filtered tap',price:'Included',image:'/photos/landing/tap-chrome-m.webp'};
const setTap=t=>{if(!t||!t.label)return;tap=t;const inc=!t.price||/included/i.test(t.price);
 root.querySelectorAll('[data-rv-name]').forEach(x=>x.textContent=t.label);
 root.querySelectorAll('[data-rv-short]').forEach(x=>x.textContent=t.label.replace(/ filtered| filter| mixer|,.*$/gi,'').trim()||t.label);
 root.querySelectorAll('[data-rv-tapprice]').forEach(x=>x.textContent=inc?'Included':t.price+' upgrade, installed with your system');
 root.querySelectorAll('[data-rv-tapline]').forEach(x=>{x.hidden=inc;x.textContent=inc?'':'Tap upgrade: '+t.price+', installed with your system.'});
 if(t.image)root.querySelectorAll('[data-rv-thumb]').forEach(x=>x.src=t.image);
 if(tapInput){const v=t.label+(inc?' (included)':', '+t.price+' upgrade');tapInput.value=v;tapInput.setAttribute('value',v)}};
document.addEventListener('ffy:tap',e=>setTap(e.detail));
if(window.ffyTap)setTap(window.ffyTap);

const addon=root.querySelector('[data-rv-addon]'),price=root.querySelector('[data-rv-price]'),basePrice=price?price.innerHTML:'';
window.rvPackage=()=>addon&&addon.checked?addon.dataset.package:NAME;
window.rvSummary=timing=>{const pk=window.rvPackage();let s=pk+' installation request.';
 if(picker)s+=' '+LABEL+': '+current+(pk!==NAME?'':current===INCLUDED?' (included)':' (upgrade, quoted separately)')+'.';
 else if(tapInput)s+=' Tap: '+tapInput.value+'.';
 if(timing)s+=' Timing: '+timing+'.';if(pk!==NAME&&addon)s+=' '+addon.dataset.includes;return s};
const priceLine=()=>{if(price)price.innerHTML=addon&&addon.checked?addon.dataset.price:basePrice};
if(addon)addon.addEventListener('change',priceLine);
root.querySelectorAll('[data-rv-deluxe]').forEach(a=>a.addEventListener('click',()=>{if(addon){addon.checked=true;priceLine()}}));

const bar=root.querySelector('#rv-bar'),why=root.querySelector('#why'),ask=root.querySelector('#ask'),foot=document.querySelector('footer.foot'),offerCta=root.querySelector('.rv-offer__cta');
if(bar&&why&&ask){bar.hidden=false;bar.classList.add('off');let queued=false;
 const vis=el=>{if(!el)return false;const o=el.getBoundingClientRect();return o.top<innerHeight&&o.bottom>0};
 const check=()=>{queued=false;const w=why.getBoundingClientRect(),a=ask.getBoundingClientRect(),h=innerHeight;bar.classList.toggle('off',!(w.bottom<h*.35&&(a.top>h*.9||a.bottom<0)&&!(foot&&foot.getBoundingClientRect().top<h)&&!vis(offerCta)))};
 addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(check)}},{passive:true});addEventListener('resize',check);check()}

const pins=[...root.querySelectorAll('.rv-pin')],hover=matchMedia('(hover:hover) and (pointer:fine)');
const popOf=p=>root.querySelector('#'+p.getAttribute('aria-controls'));

const fit=pop=>{pop.style.marginLeft='0px';const r=pop.getBoundingClientRect(),W=document.documentElement.clientWidth;let dx=0;
 if(r.right>W-10)dx=W-10-r.right;if(r.left+dx<10)dx=10-r.left;pop.style.marginLeft=dx+'px'};
const openPin=(p,open=true)=>pins.forEach(x=>{const on=x===p&&open;x.setAttribute('aria-expanded',String(on));const pop=popOf(x);if(pop){pop.hidden=!on;if(on)fit(pop)}});
const closePins=()=>openPin(null,false);
pins.forEach(p=>{const pop=popOf(p);let t;
 const enter=()=>{if(!hover.matches)return;clearTimeout(t);openPin(p)},leave=()=>{if(!hover.matches)return;clearTimeout(t);t=setTimeout(()=>{if(p.getAttribute('aria-expanded')==='true')closePins()},160)};
 p.addEventListener('pointerenter',enter);p.addEventListener('pointerleave',leave);
 if(pop){pop.addEventListener('pointerenter',()=>clearTimeout(t));pop.addEventListener('pointerleave',leave)}
 p.addEventListener('focus',()=>{if(hover.matches)openPin(p)});
 p.addEventListener('click',e=>{e.stopPropagation();const open=p.getAttribute('aria-expanded')==='true';openPin(p,hover.matches?true:!open)})});
document.addEventListener('click',()=>closePins());document.addEventListener('keydown',e=>{if(e.key==='Escape')closePins()});
if(reduce||!('IntersectionObserver' in window))return;

const xp=root.querySelector('[data-rv-explode]');
if(xp&&!reduce&&'IntersectionObserver' in window){const img=xp.querySelector('.rv-x__img'),btn=xp.querySelector('[data-rv-x-toggle]'),dir=xp.dataset.rvExplode;
 const N=phoneMQ.matches?37:73,sfx=phoneMQ.matches?'-m':'',src=i=>dir+'/f'+String(i).padStart(2,'0')+sfx+'.webp';
 let pos=0,shown=-1,raf=0,open=false,ready=null;const keep=[];
 const load=()=>ready||(ready=Promise.all(Array.from({length:N},(_,i)=>{const im=new Image();im.decoding='async';im.src=src(i);keep.push(im);return(im.decode?im.decode():Promise.resolve()).catch(()=>{})})));
 const paint=v=>{const i=Math.round(v*(N-1));if(i!==shown){shown=i;img.src=src(i)}};
 const ease=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;
 const go=to=>{load().then(()=>{cancelAnimationFrame(raf);const from=pos,t0=performance.now(),D=1300;
  (function step(t){const k=Math.min(1,(t-t0)/D);pos=from+(to-from)*ease(k);paint(pos);if(k<1)raf=requestAnimationFrame(step);else xp.classList.toggle('rv-x-open',to===1)})(t0)})};
 const set=o=>{open=o;btn.setAttribute('aria-pressed',String(o));if(!o){xp.classList.remove('rv-x-open');closePins()}go(o?1:0)};
 xp.classList.remove('rv-x-open');img.src=src(0);shown=0;
 btn.addEventListener('click',e=>{e.stopPropagation();set(!open)});
 new IntersectionObserver((es,o)=>{if(es[0].isIntersecting){load();o.disconnect()}},{rootMargin:'120% 0px'}).observe(xp);
 new IntersectionObserver((es,o)=>{if(es[0].isIntersecting){o.disconnect();setTimeout(()=>{if(!open)set(true)},250)}},{threshold:.55}).observe(xp)}

const whenSeen=(el,fn,at=.45)=>{let done=false;const go=()=>{if(done)return;done=true;fn()};
 new IntersectionObserver((es,o)=>{if(es[0].isIntersecting){o.disconnect();go()}},{threshold:at}).observe(el);
 addEventListener('scroll',()=>{if(!done&&el.getBoundingClientRect().bottom<0)go()},{passive:true})};


const micron=root.querySelector('[data-rv-micron]'),whyEl=root.querySelector('.rv-why');
if(micron&&whyEl){const num=micron.querySelector('[data-rv-count]'),from=+micron.dataset.from,to=+micron.dataset.to,finalText=num.textContent;
 const scale=whyEl.querySelector('[data-rv-scale]'),grid=whyEl.querySelector('[data-rv-dots]'),stats=whyEl.querySelector('.rv-stats');
 const caught=[...whyEl.querySelectorAll('.rv-caught li')];
 whyEl.classList.add('rv-anim');num.textContent=String(from);
 let fill,items=[],end=0,dots=[],order=[];
 if(scale){scale.classList.add('rv-anim');fill=scale.querySelector('.rv-scale__fill');items=[...scale.querySelectorAll('.rv-scale__item')];end=+scale.dataset.end;fill.style.width='0%'}
 if(grid){grid.classList.add('rv-anim');dots=[...grid.children];order=dots.map((_,i)=>i).sort((a,b)=>((a*37)%100)-((b*37)%100));order.splice(order.indexOf(57),1)}
 let tallied=false;const tally=()=>{if(tallied)return;tallied=true;caught.forEach((li,i)=>setTimeout(()=>li.classList.add('on'),i*90))};
 const run=()=>{if(stats)stats.classList.add('on');const t0=performance.now(),D=1900,ease=x=>1-Math.pow(1-x,3);
  (function step(t){const k=Math.min(1,(t-t0)/D),e=ease(k);
   if(scale){const um=Math.pow(10,Math.log10(from)+(Math.log10(to)-Math.log10(from))*e);num.textContent=um>=10?um.toFixed(0):um>=1?um.toFixed(1):um.toFixed(2);
    fill.style.width=(end*e)+'%';items.forEach(li=>li.classList.toggle('caught',um<=parseFloat(li.dataset.um)))}
   else{const v=Math.round(from+(to-from)*e);num.textContent=String(v);order.forEach((d,i)=>dots[d].classList.toggle('on',i<v))}
   if(k>.7)tally();
   if(k<1)requestAnimationFrame(step);else num.textContent=finalText})(t0)};
 whenSeen(micron,run,.6)}


const flow=root.querySelector('[data-rv-flow]');
if(flow){const stage=flow.querySelector('.rv-flow__stage'),st=[...flow.querySelectorAll('.rv-stage')];
 flow.classList.add('rv-anim');let marks=[],ran=false,queued=false;
 const measure=()=>{const r=stage.getBoundingClientRect();marks=st.map(li=>{const i=li.querySelector('.rv-stage__img').getBoundingClientRect();return phoneMQ.matches?(i.top+i.height/2-r.top)/r.height:(i.left+i.width/2-r.left)/r.width})};
 const paint=v=>{stage.style.setProperty('--p',v.toFixed(4));st.forEach((li,k)=>li.classList.toggle('lit',v>=marks[k]-.015))};
 const follow=()=>{queued=false;if(!phoneMQ.matches)return;const r=stage.getBoundingClientRect();paint(Math.min(1,Math.max(0,(innerHeight*.6-r.top)/r.height)))};
 const run=()=>{if(ran||phoneMQ.matches)return;ran=true;const t0=performance.now(),D=2000+st.length*200,ease=x=>x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2;(function step(t){const k=Math.min(1,(t-t0)/D);paint(ease(k));if(k<1)requestAnimationFrame(step)})(t0)};
 measure();paint(0);follow();
 addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(follow)}},{passive:true});
 addEventListener('resize',()=>{measure();if(phoneMQ.matches)follow();else if(ran)paint(1);else{const r=stage.getBoundingClientRect();if(r.top<innerHeight&&r.bottom>0)run()}});
 addEventListener('load',measure);
 whenSeen(stage,run,.3)}

const stagger=(box,sel,gap)=>{box.classList.add('rv-anim');whenSeen(box,()=>[...box.querySelectorAll(sel)].forEach((x,i)=>setTimeout(()=>x.classList.add('on'),i*gap)),.35)};
root.querySelectorAll('.rv-seals,.rv-kit').forEach(b=>stagger(b,':scope>li',110));
const cw=root.querySelector('.rv-callouts');if(cw&&cw.children.length)stagger(cw,'.rv-callout',260);
const specs=root.querySelector('.rv-specs');
if(specs){const nums=[...specs.querySelectorAll('[data-rv-to]')];stagger(specs,':scope>li',80);
 whenSeen(specs,()=>{const t0=performance.now();(function step(t){const k=Math.min(1,(t-t0)/1400),e=1-Math.pow(1-k,3);nums.forEach(n=>n.textContent=Math.round(+n.dataset.rvTo*e));if(k<1)requestAnimationFrame(step)})(t0)},.35)}
})();
