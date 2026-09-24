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

const pins=[...root.querySelectorAll('.rv-pin')];
function closePins(except){pins.forEach(p=>{if(p===except)return;p.setAttribute('aria-expanded','false');const pop=root.querySelector('#'+p.getAttribute('aria-controls'));if(pop)pop.hidden=true})}
pins.forEach(p=>{const pop=root.querySelector('#'+p.getAttribute('aria-controls')),x=parseFloat(p.style.left),y=parseFloat(p.style.top);
 if(pop){if(y<32)pop.classList.add('rv-pop--low');if(x<30)pop.classList.add('rv-pop--right');else if(x>60)pop.classList.add('rv-pop--left')}
 p.addEventListener('click',e=>{e.stopPropagation();const open=p.getAttribute('aria-expanded')==='true';closePins(p);p.setAttribute('aria-expanded',String(!open));if(pop)pop.hidden=open})});
document.addEventListener('click',()=>closePins());document.addEventListener('keydown',e=>{if(e.key==='Escape')closePins()});

const micron=root.querySelector('[data-rv-micron]'),scale=root.querySelector('[data-rv-scale]');
if(micron&&scale&&!reduce&&'IntersectionObserver' in window){const num=micron.querySelector('[data-rv-count]'),fill=scale.querySelector('.rv-scale__fill'),items=[...scale.querySelectorAll('.rv-scale__item')],end=88.6;
 scale.classList.add('rv-anim');num.textContent='70';fill.style.width='0%';
 const run=()=>{const t0=performance.now(),D=1900,ease=x=>1-Math.pow(1-x,3);
  (function step(t){const k=Math.min(1,(t-t0)/D),e=ease(k),um=Math.pow(10,Math.log10(70)+(Math.log10(0.22)-Math.log10(70))*e);
   num.textContent=um>=10?um.toFixed(0):um>=1?um.toFixed(1):um.toFixed(2);fill.style.width=(end*e)+'%';
   items.forEach(li=>li.classList.toggle('caught',um<=parseFloat(li.dataset.um)));
   if(k<1)requestAnimationFrame(step);else{num.textContent='0.22'}})(t0)};
 new IntersectionObserver((es,o)=>{if(es[0].isIntersecting){o.disconnect();run()}},{threshold:.45}).observe(scale)}
})();
