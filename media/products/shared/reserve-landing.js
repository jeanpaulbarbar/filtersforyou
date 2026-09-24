(()=>{'use strict';
const root=document.querySelector('#pure-plus-page[data-landing="reserve"]');if(!root)return;
const picker=root.querySelector('#reserve-colours'),list=[...picker.querySelectorAll('.rc-swatch')],all=[...root.querySelectorAll('.rc-swatch')];
const photo=root.querySelector('#rc-image'),frame=photo.parentElement,nameEl=root.querySelector('#rc-name'),count=root.querySelector('.rc-count');
const input=root.querySelector('[name=colour_preference]'),names=[...root.querySelectorAll('[data-rv-name]')],dots=[...root.querySelectorAll('[data-rv-dot]')];
const addon=root.querySelector('[data-rv-addon]'),price=root.querySelector('[data-rv-price]'),basePrice=price?price.innerHTML:'';
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const find=n=>list.find(b=>b.dataset.finish===n);
let current=list[0].dataset.finish,ticket=0,warmed=false;
function warm(){if(warmed)return;warmed=true;list.forEach(b=>{const i=new Image();i.src=b.dataset.src})}
async function show(n){const t=++ticket,src=find(n).dataset.src,img=new Image();img.src=src;try{await img.decode()}catch{}if(t!==ticket)return;
 if(reduce){photo.src=src;photo.alt='Pure Home Reserve in '+n;return}
 const layer=img;layer.className='rv-fade';layer.alt='';layer.setAttribute('aria-hidden','true');frame.querySelectorAll('.rv-fade').forEach(x=>x.remove());frame.append(layer);
 requestAnimationFrame(()=>layer.classList.add('on'));
 setTimeout(()=>{if(t!==ticket)return;photo.src=src;photo.alt='Pure Home Reserve in '+n;layer.remove()},300)}
function set(n,swap=true){const b=find(n);if(!b)return;current=n;window.reserveColour=n;
 all.forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.finish===n)));
 names.forEach(x=>x.textContent=n);dots.forEach(x=>x.style.background=b.style.getPropertyValue('--finish'));
 nameEl.textContent=n;count.textContent=String(list.indexOf(b)+1).padStart(2,'0')+' / 22';
 if(input){input.value=n;input.setAttribute('value',n)}
 root.querySelectorAll('[data-rv-photo]').forEach(x=>{x.src=b.dataset.src;x.alt='Pure Home Reserve in '+n});
 root.querySelectorAll('[data-rv-thumb]').forEach(x=>x.src=b.dataset.src);
 if(swap)show(n)}
all.forEach(b=>b.addEventListener('click',()=>{warm();set(b.dataset.finish)}));
picker.addEventListener('pointerenter',warm,{once:true});picker.addEventListener('touchstart',warm,{once:true,passive:true});
list.forEach((b,i)=>b.addEventListener('keydown',e=>{let n;if(e.key==='ArrowRight'||e.key==='ArrowDown')n=(i+1)%list.length;else if(e.key==='ArrowLeft'||e.key==='ArrowUp')n=(i+list.length-1)%list.length;else return;e.preventDefault();warm();list[n].focus();set(list[n].dataset.finish)}));

const wanted=new URLSearchParams(location.search).get('colour');
if(wanted){const b=list.find(x=>x.dataset.finish.toLowerCase().replace(/ /g,'-')===wanted.toLowerCase());if(b)set(b.dataset.finish)}else set(current,false);

window.reservePackage=()=>addon&&addon.checked?'Deluxe Home Reserve':'Pure Home Reserve';
window.reserveSummary=timing=>{const pk=window.reservePackage();return pk+' installation request. Colour: '+current+'.'+(timing?' Timing: '+timing+'.':'')+(pk==='Deluxe Home Reserve'?' Includes Pure Luxe reverse osmosis and a three way mixer.':'')};
function priceLine(){if(!price)return;price.innerHTML=addon&&addon.checked?'Deluxe Home Reserve from <b>$8,640</b> installed · first year of servicing free':basePrice}
if(addon)addon.addEventListener('change',priceLine);
root.querySelectorAll('[data-rv-deluxe]').forEach(a=>a.addEventListener('click',()=>{if(addon){addon.checked=true;priceLine()}}));

const formColour=root.querySelector('.rv-form-colour');
if(formColour)formColour.querySelectorAll('.rc-swatch').forEach(b=>b.addEventListener('click',()=>setTimeout(()=>formColour.open=false,180)));

const bar=root.querySelector('#rv-bar'),colours=root.querySelector('#colours'),ask=root.querySelector('#ask'),foot=document.querySelector('footer.foot'),offerCta=root.querySelector('.rv-offer__cta');
if(bar&&colours&&ask){bar.hidden=false;bar.classList.add('off');let queued=false;
 const check=()=>{queued=false;const c=colours.getBoundingClientRect(),a=ask.getBoundingClientRect(),h=innerHeight;bar.classList.toggle('off',!(c.bottom<h*.35&&(a.top>h*.9||a.bottom<0)&&!(foot&&foot.getBoundingClientRect().top<h)&&!(offerCta&&(()=>{const o=offerCta.getBoundingClientRect();return o.top<h&&o.bottom>0})())))};
 addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(check)}},{passive:true});addEventListener('resize',check);check()}

const pins=[...root.querySelectorAll('.rv-pin')],hover=matchMedia('(hover:hover) and (pointer:fine)');
const popOf=p=>root.querySelector('#'+p.getAttribute('aria-controls'));
function openPin(p,open=true){pins.forEach(x=>{const on=x===p&&open;x.setAttribute('aria-expanded',String(on));const pop=popOf(x);if(pop)pop.hidden=!on})}
function closePins(){openPin(null,false)}
pins.forEach(p=>{const pop=popOf(p);let t;
 const enter=()=>{if(!hover.matches)return;clearTimeout(t);openPin(p)},leave=()=>{if(!hover.matches)return;clearTimeout(t);t=setTimeout(()=>{if(p.getAttribute('aria-expanded')==='true')closePins()},160)};
 p.addEventListener('pointerenter',enter);p.addEventListener('pointerleave',leave);
 if(pop){pop.addEventListener('pointerenter',()=>clearTimeout(t));pop.addEventListener('pointerleave',leave)}
 p.addEventListener('focus',()=>{if(hover.matches)openPin(p)});
 p.addEventListener('click',e=>{e.stopPropagation();const open=p.getAttribute('aria-expanded')==='true';openPin(p,hover.matches?true:!open)})});
document.addEventListener('click',()=>closePins());document.addEventListener('keydown',e=>{if(e.key==='Escape')closePins()});

const whenSeen=(el,fn,at=.45)=>{let done=false;const go=()=>{if(done)return;done=true;fn()};
 new IntersectionObserver((es,o)=>{if(es[0].isIntersecting){o.disconnect();go()}},{threshold:at}).observe(el);
 const past=()=>{if(!done&&el.getBoundingClientRect().bottom<0)go()};addEventListener('scroll',past,{passive:true})};

const why=root.querySelector('.rv-why'),micron=root.querySelector('[data-rv-micron]'),scale=root.querySelector('[data-rv-scale]');
if(why&&micron&&scale&&!reduce&&'IntersectionObserver' in window){const num=micron.querySelector('[data-rv-count]'),fill=scale.querySelector('.rv-scale__fill'),items=[...scale.querySelectorAll('.rv-scale__item')],end=88.6;
 const caught=[...why.querySelectorAll('.rv-caught li')],pct=[...why.querySelectorAll('[data-rv-pct]')];
 scale.classList.add('rv-anim');why.classList.add('rv-anim');num.textContent='70';fill.style.width='0%';
 const stats=why.querySelector('.rv-stats');let tallied=false;
 const tally=()=>{if(tallied)return;tallied=true;caught.forEach((li,i)=>setTimeout(()=>li.classList.add('on'),i*90))};
 
 const count99=()=>{stats.classList.add('on');const t0=performance.now();(function step(t){const k=Math.min(1,(t-t0)/1500);pct.forEach(el=>el.textContent=Math.round(99*(1-Math.pow(1-k,3))));if(k<1)requestAnimationFrame(step)})(t0)};
 const run=()=>{count99();const t0=performance.now(),D=1900,ease=x=>1-Math.pow(1-x,3);
  (function step(t){const k=Math.min(1,(t-t0)/D),e=ease(k),um=Math.pow(10,Math.log10(70)+(Math.log10(0.22)-Math.log10(70))*e);
   num.textContent=um>=10?um.toFixed(0):um>=1?um.toFixed(1):um.toFixed(2);fill.style.width=(end*e)+'%';
   items.forEach(li=>li.classList.toggle('caught',um<=parseFloat(li.dataset.um)));
   if(k>.7)tally();
   if(k<1)requestAnimationFrame(step);else num.textContent='0.22'})(t0)};
 whenSeen(micron,run,.6)}


const flow=root.querySelector('[data-rv-flow]');
if(flow&&!reduce&&'IntersectionObserver' in window){const stage=flow.querySelector('.rv-flow__stage'),st=[...flow.querySelectorAll('.rv-stage')],phone=matchMedia('(max-width:859px)');
 flow.classList.add('rv-anim');let marks=[],ran=false,queued=false;
 const measure=()=>{const r=stage.getBoundingClientRect();marks=st.map(li=>{const i=li.querySelector('.rv-stage__img').getBoundingClientRect();return phone.matches?(i.top+i.height/2-r.top)/r.height:(i.left+i.width/2-r.left)/r.width})};
 const paint=v=>{stage.style.setProperty('--p',v.toFixed(4));st.forEach((li,k)=>li.classList.toggle('lit',v>=marks[k]-.015))};
 const follow=()=>{queued=false;if(!phone.matches)return;const r=stage.getBoundingClientRect();paint(Math.min(1,Math.max(0,(innerHeight*.6-r.top)/r.height)))};
 const run=()=>{if(ran||phone.matches)return;ran=true;const t0=performance.now(),D=2600,ease=x=>x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2;(function step(t){const k=Math.min(1,(t-t0)/D);paint(ease(k));if(k<1)requestAnimationFrame(step)})(t0)};
 measure();paint(0);follow();
 addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(follow)}},{passive:true});
 addEventListener('resize',()=>{measure();if(phone.matches)follow();else if(ran)paint(1);else{const r=stage.getBoundingClientRect();if(r.top<innerHeight&&r.bottom>0)run()}});
 whenSeen(stage,run,.4)}

const stagger=(box,sel,gap)=>{box.classList.add('rv-anim');whenSeen(box,()=>[...box.querySelectorAll(sel)].forEach((x,i)=>setTimeout(()=>x.classList.add('on'),i*gap)),.35)};
if(!reduce&&'IntersectionObserver' in window){
 root.querySelectorAll('.rv-seals,.rv-kit').forEach(b=>stagger(b,':scope>li',110));
 const cw=root.querySelector('.rv-callouts');if(cw)stagger(cw,'.rv-callout',260);
 const specs=root.querySelector('.rv-specs');
 if(specs){const nums=[...specs.querySelectorAll('[data-rv-to]')];stagger(specs,':scope>li',80);
  whenSeen(specs,()=>{const t0=performance.now();(function step(t){const k=Math.min(1,(t-t0)/1400),e=1-Math.pow(1-k,3);nums.forEach(n=>n.textContent=Math.round(+n.dataset.rvTo*e));if(k<1)requestAnimationFrame(step)})(t0)},.35)}}
})();
