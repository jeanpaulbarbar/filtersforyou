(()=>{'use strict';
const root=document.getElementById('wh-page');if(!root)return;
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches,phoneMQ=matchMedia('(max-width:859px)');
const $=(s,r=root)=>r.querySelector(s),$$=(s,r=root)=>[...r.querySelectorAll(s)];
const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n)),easeOut=x=>1-Math.pow(1-x,3);
let DATA={};try{DATA=JSON.parse(document.getElementById('wh-offers').textContent)}catch(e){}
const OFFERS=DATA.offers||{},DELUXE=DATA.deluxe||{},INSTALLS=DATA.installs||{},ASK=DATA.ask||{},CARE=DATA.care||{};
const track=(n,p)=>{try{window.ffyTrack&&window.ffyTrack(n,p)}catch(e){}};

let lenis=null;
if(!reduce&&innerWidth>=860&&matchMedia('(pointer:fine)').matches&&window.Lenis){lenis=new Lenis({duration:1.35,smoothWheel:true,syncTouch:false});requestAnimationFrame(function raf(t){lenis.raf(t);requestAnimationFrame(raf)})}
const sc=window.ScrollCraft&&window.ScrollCraft.mount?window.ScrollCraft.mount(root):null;
const relayout=()=>{try{sc&&sc.layout&&sc.layout()}catch(e){}};

const hero=$('.hero');
if(hero&&window.gsap&&!reduce){const h=hero.querySelector('h1');h.setAttribute('aria-label',h.textContent);const walk=document.createTreeWalker(h,NodeFilter.SHOW_TEXT),nodes=[];while(walk.nextNode())nodes.push(walk.currentNode);
 nodes.forEach(t=>{const frag=document.createDocumentFragment();t.textContent.split(/(\s+)/).forEach(word=>{if(!word.trim()){frag.append(word);return}const w=document.createElement('span');w.className='hw';w.setAttribute('aria-hidden','true');[...word].forEach(c=>{const s=document.createElement('span');s.className='hch';s.textContent=c;w.append(s)});frag.append(w)});t.replaceWith(frag)});
 hero.classList.add('pp-animated');gsap.to(hero.querySelectorAll('.hch'),{opacity:1,y:0,duration:.55,ease:'power3.out',stagger:.018,delay:.5})}

const rmq=$('#rmq'),reviewPause=$('.sg-review-pause');
if(rmq&&!reduce){document.documentElement.classList.add('sg-review-motion');if(reviewPause)reviewPause.hidden=false;let paused=false,visible=false;
 const lanes=$$('.rrow',rmq).map(row=>{const orig=[...row.children];orig.forEach(el=>{const c=el.cloneNode(true);c.inert=true;c.setAttribute('aria-hidden','true');row.append(c)});return{el:row,first:orig[0],copy:row.children[orig.length],dir:Number(row.dataset.dir),x:0,width:0}});
 const size=()=>lanes.forEach(l=>{l.width=l.copy.offsetLeft-l.first.offsetLeft;if(l.dir>0&&l.x===0)l.x=-l.width});new ResizeObserver(size).observe(rmq);size();
 if(reviewPause)reviewPause.onclick=()=>{paused=!paused;reviewPause.textContent=paused?'Play reviews':'Pause reviews'};
 new IntersectionObserver(es=>{visible=es[0].isIntersecting}).observe(rmq);
 let last=performance.now(),lastY=scrollY,v=0;(function tick(t){const dt=Math.min((t-last)/1000,.05);last=t;const dy=scrollY-lastY;lastY=scrollY;v+=(phoneMQ.matches?0:clamp(dy/Math.max(dt,.001)/900,-1,1)-v)*Math.min(1,dt*6);
  if(visible&&!paused&&!document.hidden)lanes.forEach(l=>{if(!l.width)return;l.x+=l.dir*(30+Math.abs(v)*260)*dt;if(l.x<=-l.width)l.x+=l.width;if(l.x>0)l.x-=l.width;l.el.style.transform='translateX('+l.x+'px) skewX('+(-v*4)+'deg)'});requestAnimationFrame(tick)})(last)}

function goTo(el){if(!el)return;if(lenis){lenis.scrollTo(el,{offset:-8});return}const y=el.getBoundingClientRect().top+scrollY-8;scrollTo({top:y,behavior:reduce?'auto':'smooth'})}
root.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a||!root.contains(a))return;const id=a.getAttribute('href').slice(1);const el=id&&document.getElementById(id);if(!el)return;e.preventDefault();if(el.tagName==='DETAILS'&&!el.open)openDetails(el);goTo(el)});

const whenSeen=(el,fn,at=.45)=>{if(!el)return;let done=false;const go=()=>{if(done)return;done=true;fn()};
 if(!('IntersectionObserver' in window)){go();return}
 const io=new IntersectionObserver(es=>{if(es[0].isIntersecting){io.disconnect();go()}},{threshold:at});io.observe(el);
 const past=()=>{if(done)return;if(el.getBoundingClientRect().bottom<0){io.disconnect();go()}};addEventListener('scroll',past,{passive:true})};
const stagger=(box,sel,gap,at=.35,after)=>{if(!box)return;box.classList.add('rv-anim');whenSeen(box,()=>{const items=$$(sel,box);items.forEach((x,i)=>setTimeout(()=>{x.classList.add('on');if(after)after(x,i)},i*gap))},at)};

const gauge=$('[data-wh-gauge]'),mgl=$('[data-wh-count]');
if(gauge&&mgl&&!reduce){const num=mgl.querySelector('[data-wh-num]'),fill=gauge.querySelector('.wh-gauge__fill'),line=gauge.querySelector('.wh-gauge__line'),band=gauge.querySelector('.wh-gauge__band'),end=+mgl.dataset.whCount,scaleMax=1.4;
 gauge.classList.add('wh-anim');mgl.classList.add('wh-anim');fill.style.width='0%';
 whenSeen(mgl,()=>{mgl.classList.add('on');const t0=performance.now(),D=1900;(function step(t){const k=clamp((t-t0)/D),v=end*easeOut(k);num.textContent=v.toFixed(2);fill.style.width=(v/scaleMax*100)+'%';
  if(v>=.5)line.classList.add('on');if(v>=.72)band.classList.add('on');if(k<1)requestAnimationFrame(step);else{num.textContent=end.toFixed(2);gauge.classList.add('done')}})(t0)},.55)}

const legend=$$('[data-wh-legend] li');
if(!reduce){const cut=$('.wh-cut__calls');if(cut)stagger(cut,'.rv-callout',320,.4,(x,i)=>{if(legend[i])legend[i].classList.add('on')});if(legend.length){$('[data-wh-legend]').classList.add('wh-anim')}
 $$('.rv-seals').forEach(b=>stagger(b,':scope>li',110));
 const dbody=$('.wh-deluxe__kit'),kits=$$('[data-wh-deluxe-kit] .rv-kit');if(dbody&&kits.length){kits.forEach(k=>k.classList.add('rv-anim'));whenSeen(dbody,()=>kits.forEach(k=>$$(':scope>li',k).forEach((x,i)=>setTimeout(()=>x.classList.add('on'),i*110))),.3)}
 $$('.wh-dev__calls').forEach(b=>stagger(b,'.rv-callout',260));
 const yrs=$('[data-wh-years]');if(yrs)stagger(yrs,':scope>li',220,.5);
 $$('.wh-deluxe__photo .rv-callouts').forEach(b=>stagger(b,'.rv-callout',260))}

const year=$('[data-wh-year]');
if(year&&!reduce){year.classList.add('wh-anim');const nums=$$('b',year);
 whenSeen(year,()=>{year.classList.add('on');const finals=nums.map(b=>b.dataset.final||b.textContent);const t0=performance.now(),D=1500;(function step(t){const k=clamp((t-t0)/D),e=easeOut(k);nums.forEach((b,i)=>{if(b.dataset.lock)return;const n=+finals[i].replace(/[^0-9]/g,'');b.textContent='$'+Math.round(n*e).toLocaleString('en-AU')});if(k<1)requestAnimationFrame(step);else nums.forEach(b=>{if(!b.dataset.lock)b.textContent=b.dataset.final||b.textContent})})(t0)},.45)}

const fade=(img,src,alt)=>{if(!img)return Promise.resolve();if(img.getAttribute('src')===src){if(alt!=null)img.alt=alt;return Promise.resolve()}
 const next=new Image();next.src=src;const p=next.decode?next.decode().catch(()=>{}):Promise.resolve();
 return p.then(()=>{if(reduce||!img.parentElement){img.src=src;if(alt!=null)img.alt=alt;return}const layer=next;layer.className='wh-fade';layer.alt='';layer.setAttribute('aria-hidden','true');img.parentElement.querySelectorAll('.wh-fade').forEach(x=>x.remove());img.parentElement.append(layer);
  requestAnimationFrame(()=>layer.classList.add('on'));setTimeout(()=>{img.src=src;if(alt!=null)img.alt=alt;layer.remove()},300)})};

let current=Object.keys(OFFERS).find(k=>OFFERS[k].default)||Object.keys(OFFERS)[0];let project=false;
const want=new URLSearchParams(location.search).get('system');if(want&&OFFERS[want])current=want;
const opts=$$('.wh-opt'),card=$('[data-wh-offer]');
const q=$('[data-qform]'),form=q?q.querySelector('form'):null;
const addon=$('[data-wh-addon]'),upgrade=$('[data-wh-upgrade]');

function hidden(n,v){if(!form)return;let x=form.querySelector('[name="'+n+'"]');if(!x){x=document.createElement('input');x.type='hidden';x.name=n;form.append(x)}x.value=v}
function chosenKey(){const o=OFFERS[current];if(o&&o.upgrade&&addon&&addon.checked)return o.upgrade;return current}
function renderForm(){const k=chosenKey(),o=OFFERS[k];if(!o)return;
 const set=(sel,v,html)=>{const el=$(sel);if(el){if(html)el.innerHTML=v;else el.textContent=v}};
 set('[data-wh-form-price]',o.formPrice,true);set('[data-wh-form-name]',o.name);set('[data-wh-form-note]',o.formNote);
 const th=$('[data-wh-form-thumb]');if(th)th.src=o.thumb;
 set('[data-wh-bar-name]',o.name);const bt=$('[data-wh-bar-thumb]');if(bt)bt.src=o.thumb;
 hidden('system',o.name);hidden('message',summary());}
function summary(timing){const o=OFFERS[chosenKey()];if(!o)return'';let s=o.name+' installation request.';const t=timing!=null?timing:choice;if(t)s+=' Timing: '+t+'.';if(o.includes)s+=' '+o.includes;if(project)s+=' Duplex or new development enquiry.';return s}

function setOffer(key,opts2={}){const o=OFFERS[key];if(!o)return;const prev=current;current=key;
 opts.forEach(b=>{const on=b.dataset.offer===key;b.setAttribute('aria-checked',String(on));b.tabIndex=on?0:-1;b.classList.toggle('on',on)});
 $$('.wh-change__list [data-offer]').forEach(b=>{const on=b.dataset.offer===key;b.setAttribute('aria-checked',String(on));b.classList.toggle('on',on)});
 if(card){card.dataset.tier=o.tier;fade($('[data-wh-o-img]',card),o.card,o.alt);
  $('[data-wh-o-name]',card).textContent=o.name;$('[data-wh-o-note]',card).textContent=o.note;$('[data-wh-o-price]',card).textContent=o.price;
  $('[data-wh-o-slabel]',card).textContent=o.serviceLabel;$('[data-wh-o-sval]',card).innerHTML=o.serviceValue;
  
  const link=$('[data-wh-o-link]',card);if(link){link.href=o.link[0];link.textContent=o.link[1]}
  const ins=INSTALLS[o.cab]||[];const txt=$('[data-wh-o-installs]',card);if(txt)txt.textContent=ins.length+' photos from Sydney homes';
  $$('.rv-installs__thumbs img',card).forEach((im,i)=>{if(ins[i])im.src=ins[i].thumb||ins[i].src})}
 if(upgrade){const up=o.upgrade&&OFFERS[o.upgrade];upgrade.hidden=!up;if(addon){addon.checked=false}
  if(up){$('[data-wh-addon-name]').textContent='Upgrade to the '+up.name;$('[data-wh-addon-line]').textContent=up.price.replace('$','From $')+' installed, first year of servicing free'}}
 const ap=$('[data-wh-ask-photo]');if(ap&&ASK[o.cab])fade(ap,ASK[o.cab].src,ASK[o.cab].alt);
 const cp=$('[data-wh-care-photo]');if(cp&&CARE[o.cab])fade(cp,CARE[o.cab].src,CARE[o.cab].alt);
 if(o.tier==='deluxe'||!opts2.keepDeluxe)setDeluxeCab(o.cab,true);
 renderForm();if(opts2.user&&prev!==key)track('system_select',{system:o.name});}

opts.forEach((b,i)=>{b.addEventListener('click',()=>setOffer(b.dataset.offer,{user:true}));
 b.addEventListener('keydown',e=>{const k={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1}[e.key];if(!k)return;e.preventDefault();const n=opts[(i+k+opts.length)%opts.length];n.focus();setOffer(n.dataset.offer,{user:true})})});

const segs=$$('[data-wh-deluxe-cab]');let deluxeCab='stainless';
function setDeluxeCab(cab,quiet){const d=DELUXE[cab];if(!d)return;deluxeCab=cab;
 segs.forEach(b=>{const on=b.dataset.whDeluxeCab===cab;b.classList.toggle('on',on);b.setAttribute('aria-checked',String(on));b.tabIndex=on?0:-1});
 $$('[data-wh-deluxe-photo]').forEach(f=>{const on=f.dataset.whDeluxePhoto===cab;f.classList.toggle('on',on);f.setAttribute('aria-hidden',String(!on))});
 $$('[data-wh-deluxe-kit]').forEach(k=>{k.hidden=k.dataset.whDeluxeKit!==cab});
 const pr=$('[data-wh-deluxe-price]');if(pr)pr.textContent='From '+d.price;
 const yr=$('[data-wh-deluxe-yearly]');if(yr){yr.textContent=d.yearly;yr.dataset.final=d.yearly}
 const bar=$('[data-wh-deluxe-bar]');if(bar)bar.style.setProperty('--w',d.bar);
 const go=$('[data-wh-deluxe-go]');if(go)go.dataset.offer=d.key}
segs.forEach((b,i)=>{b.addEventListener('click',()=>setDeluxeCab(b.dataset.whDeluxeCab));
 b.addEventListener('keydown',e=>{const k={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1}[e.key];if(!k)return;e.preventDefault();const n=segs[(i+k+segs.length)%segs.length];n.focus();setDeluxeCab(n.dataset.whDeluxeCab)})});
const dgo=$('[data-wh-deluxe-go]');if(dgo)dgo.addEventListener('click',()=>{const d=DELUXE[deluxeCab];if(d)setOffer(d.key,{user:true});track('quote_open',{system:OFFERS[current].name,label:'Choose Deluxe'})});
$$('[data-wh-request]').forEach(a=>a.addEventListener('click',()=>track('quote_open',{system:OFFERS[chosenKey()].name,label:(a.textContent||'').trim().slice(0,40)})));
$$('[data-wh-project]').forEach(a=>a.addEventListener('click',()=>{project=true;const n=$('[data-wh-project-note]');if(n)n.hidden=false;choose('Planning ahead');track('quote_open',{system:OFFERS[chosenKey()].name,label:'Talk to us at frame stage'})}));

$$('.wh-change__list [data-offer]').forEach(b=>b.addEventListener('click',()=>{setOffer(b.dataset.offer,{user:true});const d=b.closest('details');if(d)setTimeout(()=>closeDetails(d),160)}));
if(addon)addon.addEventListener('change',()=>{renderForm()});

let step=0,choice='';const steps=form?$$('[data-step]',form):[],back=form?form.querySelector('[data-back]'):null,nextLbl=form?form.querySelector('[data-nextlabel]'):null,error=q?q.querySelector('.sh-error'):null;
function choose(v){choice=v;hidden('installation_preference',v);hidden('message',summary(v));if(form)$$('.sysopt',form).forEach(x=>{const on=x.dataset.v===v;x.classList.toggle('on',on);x.setAttribute('aria-pressed',String(on))})}
function render(focus=true){steps.forEach((x,i)=>x.hidden=i!==step);if(back)back.hidden=!step;if(nextLbl)nextLbl.textContent=step===2?'Request my installation date':'Next';$$('.steps i',q).forEach((x,i)=>x.classList.toggle('on',i<=step));if(error)error.hidden=true;if(focus){const f=steps[step].querySelector('input,button');if(f)f.focus({preventScroll:true})}relayout()}
if(form){$$('.sysopt',form).forEach(x=>x.addEventListener('click',()=>choose(x.dataset.v)));if(back)back.addEventListener('click',()=>{step=Math.max(0,step-1);render()});
 form.addEventListener('submit',async e=>{e.preventDefault();if(error)error.hidden=true;for(const x of steps[step].querySelectorAll('input:not([type=checkbox])')){if(!x.checkValidity()){x.reportValidity();return}}
  if(step===1&&!choice){error.textContent='Please choose when you would like it installed.';error.hidden=false;return}
  if(step<2){step++;render();return}
  const submit=form.querySelector('[data-next]');submit.disabled=true;nextLbl.textContent='Sending…';const o=OFFERS[chosenKey()];
  try{hidden('_subject',o.name+' installation request');hidden('system',o.name);hidden('message',summary());if(project)hidden('project_type','Duplex or new development');
   if(window.ffyStampForm)window.ffyStampForm(form);
   const r=await fetch(form.action,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}});if(!r.ok)throw Error('send');
   q.classList.add('sent');if(window.ffyLeadSuccess)window.ffyLeadSuccess(form,{system:o.name});const done=q.querySelector('.done');done.setAttribute('tabindex','-1');done.focus()}
  catch(err){error.textContent='Your enquiry could not be sent. Please try again or call 0430 546 749.';error.hidden=false}
  finally{submit.disabled=false;nextLbl.textContent='Request my installation date';relayout()}});
 render(false)}

const dlg=$('#rv-installs'),openBtn=$('[data-rv-installs]');
if(dlg&&openBtn){const img=dlg.querySelector('[data-rv-lb-img]'),cap=dlg.querySelector('[data-rv-lb-cap]'),count=dlg.querySelector('[data-rv-lb-count]');let i=0,x0=null,list=[];
 const show=k=>{i=(k+list.length)%list.length;img.src=list[i].src;img.alt=list[i].alt;cap.textContent=list[i].alt;count.textContent=(i+1)+' / '+list.length;const n=new Image();n.src=list[(i+1)%list.length].src};
 openBtn.addEventListener('click',()=>{list=INSTALLS[OFFERS[current].cab]||[];if(!list.length)return;dlg.setAttribute('aria-label',OFFERS[current].cab==='colour'?'Real Pure Home Reserve installations':'Real Pure Home installations');show(0);if(dlg.showModal)dlg.showModal();else dlg.setAttribute('open','')});
 $$('[data-rv-lb]',dlg).forEach(b=>b.addEventListener('click',()=>show(i+ +b.dataset.rvLb)));dlg.querySelector('[data-rv-lb-close]').addEventListener('click',()=>dlg.close());
 dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});dlg.addEventListener('keydown',e=>{if(e.key==='ArrowRight')show(i+1);else if(e.key==='ArrowLeft')show(i-1)});
 dlg.addEventListener('touchstart',e=>{x0=e.touches[0].clientX},{passive:true});dlg.addEventListener('touchend',e=>{if(x0===null)return;const dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>40)show(i+(dx<0?1:-1));x0=null},{passive:true})}

const anims=new WeakMap();
function closedH(d){const s=d.querySelector('summary'),cs=getComputedStyle(d);return s.offsetHeight+parseFloat(cs.paddingTop)+parseFloat(cs.paddingBottom)+parseFloat(cs.borderTopWidth)+parseFloat(cs.borderBottomWidth)}
function animate(d,from,to,end){const prev=anims.get(d);if(prev)prev.cancel();d.style.overflow='hidden';const a=d.animate({height:[from+'px',to+'px']},{duration:420,easing:'cubic-bezier(.22,1,.36,1)'});anims.set(d,a);
 a.onfinish=()=>{anims.delete(d);d.style.overflow='';if(end)end();relayout()};a.oncancel=()=>{d.style.overflow=''}}
function openDetails(d){if(reduce){d.open=true;d.classList.add('is-open');return}const from=d.offsetHeight;d.dataset.closing='';d.open=true;d.classList.add('is-open');animate(d,from,d.offsetHeight)}
function closeDetails(d){if(!d.open)return;if(reduce){d.open=false;d.classList.remove('is-open');return}const from=d.offsetHeight;d.dataset.closing='1';d.classList.remove('is-open');animate(d,from,closedH(d),()=>{if(d.dataset.closing==='1'){d.open=false;d.dataset.closing=''}})}
$$('details').forEach(d=>{const s=d.querySelector('summary');if(!s)return;if(d.open)d.classList.add('is-open');
 s.addEventListener('click',e=>{e.preventDefault();if(d.open&&d.dataset.closing!=='1')closeDetails(d);else openDetails(d)})});

const bar=$('#rv-bar'),foot=document.querySelector('footer.foot'),water=$('#water'),ask=$('#ask'),ctas=$$('.btn').filter(x=>!x.closest('#rv-bar'));
if(bar&&water&&ask){bar.hidden=false;bar.classList.add('off');let queued=false;
 const onScreen=el=>{if(!el)return false;const r=el.getBoundingClientRect();return r.top<innerHeight&&r.bottom>0};
 const check=()=>{queued=false;const h=innerHeight,w=water.getBoundingClientRect(),a=ask.getBoundingClientRect();
  const show=w.top<h*.5&&(a.top>h*.9||a.bottom<0)&&!(foot&&foot.getBoundingClientRect().top<h)&&!ctas.some(onScreen);bar.classList.toggle('off',!show)};
 addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(check)}},{passive:true});addEventListener('resize',check);check()}

setOffer(current);
document.fonts&&document.fonts.ready.then(relayout);addEventListener('load',relayout);
})();
