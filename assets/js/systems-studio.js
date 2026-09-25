(()=>{'use strict';
const section=document.querySelector('.ts-studio#studio');
if(!section||section.dataset.tsReady)return;
section.dataset.tsReady='1';
const byId=id=>document.getElementById(id);
const $=s=>section.querySelector(s),$$=s=>Array.from(section.querySelectorAll(s));
const dialogs=['details-dialog','warranty-dialog','lightbox'].map(byId).filter(Boolean);
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const phoneMQ=matchMedia('(max-width:859px)');
const clamp=(v,a,b)=>v<a?a:(v>b?b:v);
const M='/media/';
const finishes={
  gold:{name:'Brushed gold',color:'#C2A26B',sw:'linear-gradient(145deg,#E2C27A,#B8923F)',scene:'brass'},
  black:{name:'Matte black',color:'#3A3D44',sw:'linear-gradient(145deg,#3A3D44,#15171B)',scene:'black'},
  stainless:{name:'Brushed stainless',color:'#A9B0B8',sw:'linear-gradient(145deg,#E9ECEF,#A9B0B8)',scene:'nickel'},
  gunmetal:{name:'Gunmetal',color:'#6B727B',sw:'linear-gradient(145deg,#7D838C,#464B53)',scene:'gunmetal'},
  copper:{name:'Brushed copper',color:'#C0805C',sw:'linear-gradient(145deg,#D99A73,#9E5A38)',scene:'copper'},
  chrome:{name:'Polished chrome',color:'#9AA6B2',sw:'linear-gradient(145deg,#F4F6F8,#8F9AA6 55%,#E6EBEF)',scene:null},
  brass:{name:'Brushed Brass',color:'#C2AC67',sw:'linear-gradient(145deg,#DDD09A,#A88D42)'},
  bronze:{name:'Brushed Bronze',color:'#9B6B45',sw:'linear-gradient(145deg,#BD926D,#794B2D)'},
  warmnickel:{name:'Warm Nickel',color:'#B8B3A5',sw:'linear-gradient(145deg,#D8D4C8,#A49F92)'},
  aurum:{name:'Aurum',color:'#B79A58',sw:'linear-gradient(145deg,#C9B17A,#8F773E)'},
  slate:{name:'Slate',color:'#595B58',sw:'linear-gradient(145deg,#797A70,#333632)'},
  steel:{name:'Steel',color:'#9EA19B',sw:'linear-gradient(145deg,#C4C7BC,#777C75)'}
};
const models={
  pullout:{label:'Premium pull out three way mixer',short:'Premium pull out mixer',kicker:'The premium mixer',title:'One beautiful tap.<br>Every kind of water.',description:'A concealed pull out hose gives you extra reach for rinsing and filling. Hot and cold use the main handle, with a separate lever for purified drinking water.',finishes:['gold','black','stainless','gunmetal','copper'],cut:f=>'3way-mixer-pullout-'+f,scene:true,price:'From <strong>$1,050</strong>',note:'Installed with your system',details:['Hot, cold and filtered water connections','Separate filtered water control','Concealed pull out hose']},
  classic:{label:'Classic three way mixer',short:'Classic three way mixer',kicker:'The everyday original',title:'A cleaner bench.<br>A classic curve.',description:'Replace your kitchen mixer with one tap for hot, cold and filtered water. The familiar gooseneck shape, with a little more going on inside.',finishes:['chrome','black'],cut:(f,shape)=>'3way-mixer-'+shape+'-'+(f==='chrome'?'stainless':f),scene:false,price:'From <strong>$500</strong>',note:'Installed with your system',details:['Classic fixed gooseneck spout','Hot, cold and filtered water','Your existing mixer is replaced']},
  deluxe:{label:'Deluxe three way mixer',short:'Deluxe mixer',kicker:'Deluxe',title:'Pure water.<br>With a simple twist.',description:'Twist the ribbed end of the spout to turn on filtered water, delivered through that spout. The side handle controls your everyday hot and cold water.',finishes:['chrome','warmnickel','black','brass','bronze','gunmetal'],price:'<strong>$680</strong>',note:'Installed with your system',details:['Twist the ribbed spout to turn filtered water on','Side handle controls normal hot and cold water','Warm Nickel has a subtle warm tone']},
  filter:{label:'Dedicated filtered water tap',short:'Dedicated filter tap',kicker:'The little finishing touch',title:'Your mixer stays.<br>Pure water joins it.',description:'A dedicated drinking tap beside your existing mixer. Chrome comes with your system. Or match your kitchen with a premium finish.',finishes:['chrome','gold','black','stainless','gunmetal','copper'],cut:f=>'filter-tap-'+({chrome:'chrome',gold:'brushed-gold',black:'matte-black',stainless:'brushed',gunmetal:'gunmetal',copper:'copper'}[f]),scene:false,price:'<strong>Included</strong>',note:'Chrome with your system',details:['Dedicated filtered water only','Your kitchen mixer stays in place','Separate sink or benchtop opening required']}
};
const premiumStyles={
  modern:{...models.pullout,label:'Premium Modern three way mixer',short:'Premium Modern mixer'},
  victorian:{...models.pullout,label:'Premium Victorian three way mixer',short:'Premium Victorian mixer',kicker:'The Victorian mixer',title:'Heritage detail.<br>Everyday freedom.',description:'A sculpted spout and turned handles bring a heritage touch to your kitchen. Pull the nozzle out for rinsing, with a separate handle for filtered drinking water.',finishes:['gold','black','stainless','chrome','copper'],price:'<strong>$1,150</strong>',details:['Turned handles and a sculpted swivel spout','Pull out nozzle for extra reach','Separate filtered water handle']},
  antique:{...models.pullout,label:'Premium Antique three way mixer',short:'Premium Antique mixer',kicker:'The Antique mixer',title:'Rich in texture.<br>Quietly distinctive.',description:'The depth of aged metal, in a beautifully textured finish. A pull out nozzle adds reach, while separate controls keep filtered drinking water at hand.',finishes:['bronze','aurum','slate','steel'],price:'<strong>$1,400</strong>',details:['A finely textured, antique metal finish','Swivel spout with a concealed pull out hose','Separate controls for filtered and everyday water']}
};
const filterStyles={classic:models.filter,premium:{...models.filter,label:'Premium dedicated filter tap',short:'Premium filter tap',kicker:'The premium filter tap',title:'A finer detail.<br>A fresh glass.',description:'A slender curved spout and a neat side paddle, dedicated to your filtered drinking water. Your kitchen mixer stays right where it is.',finishes:['gold','black','stainless','gunmetal','copper'],price:'<strong>$480</strong>',note:'Installed with your system',details:['Dedicated filtered drinking water','Side paddle control and swivel spout','Your existing hot and cold mixer stays']}};
let model='deluxe',finish='brass',shape='gooseneck',premiumStyle='modern',filterStyle='classic',lastFocus=null,lastKey='';
const current=()=>model==='pullout'?premiumStyles[premiumStyle]:model==='filter'?filterStyles[filterStyle]:models[model];
const namedFinish=k=>model==='pullout'&&premiumStyle==='antique'&&k==='bronze'?'Bronze':model==='deluxe'?({chrome:'Chrome',black:'Matte Black',gunmetal:'Gun Metal'}[k]||finishes[k].name):finishes[k].name;
const sceneSrc=(f,m)=>f==='gold'?M+'tap-studio/gold-callouts/premium-gold'+(m?'-m':'')+'.webp':M+'ro/tap-'+finishes[f].scene+(m?'-m':'')+'.webp';
const finishName=()=>namedFinish(finish);
const selection=()=>current().label+(model==='classic'?' ('+shape+')':'')+' · '+finishName();
const styleKey=()=>model==='pullout'?premiumStyle:model==='filter'?filterStyle:model==='classic'?shape:null;
const lifestyleSrc=(f=finish)=>model==='deluxe'?(f==='brass'?M+'tap-studio/gold-callouts/deluxe-brass.webp':M+'tap-studio/deluxe/deluxe-'+f+'.webp'):model==='pullout'?M+'tap-studio/ranges/'+premiumStyle+'-'+f+'.webp':model==='filter'&&filterStyle==='premium'?M+'tap-studio/filter-premium/filter-'+f+'.webp':M+'tap-studio/polish-nanopro/'+(model==='classic'?'classic-'+shape:model)+'-'+f+'.webp';
const usesScene=()=>model==='pullout'&&premiumStyle==='modern';
const stage=byId('product-stage');
const studioModels=$('.ts-models'),studioFinishes=byId('finish-controls'),studioPrice=$('.ts-price-line'),studioAction=$('.ts-action');
function arrangeStudio(){
  if(phoneMQ.matches){
    byId('mobile-models').append(studioModels);stage.append(byId('zoom'));
    byId('mobile-finishes').append(studioFinishes,studioPrice,studioAction);
  }else{
    byId('studioCard').prepend(studioModels);stage.append(byId('zoom'));
    $('.ts-quote-note').before(studioFinishes,studioPrice,studioAction);
  }
}
arrangeStudio();phoneMQ.addEventListener('change',arrangeStudio);
let imageRequest=0;
function showLifestyle(src){
  const request=++imageRequest;stage.setAttribute('aria-busy','true');
  const stack=byId('lifestyleStack');
  let pic=Array.from(stack.querySelectorAll('picture')).find(p=>p.dataset.src===src);
  if(!pic){pic=document.createElement('picture');pic.dataset.src=src;const source=document.createElement('source');source.media='(max-width:859px)';source.srcset=src.replace('.webp','-m.webp');const im=new Image();im.alt=selection();im.width=1200;im.height=1600;pic.append(source,im);stack.append(pic);im.src=src}
  pic.querySelector('img').decode().then(()=>{if(request!==imageRequest)return;stack.querySelectorAll('picture').forEach(p=>p.classList.toggle('on',p===pic));stage.setAttribute('aria-busy','false')}).catch(()=>{if(request===imageRequest)stage.setAttribute('aria-busy','false')});
}
const priceText=()=>byId('price-label').textContent.trim();
const shownImage=()=>usesScene()?sceneSrc(finish):lifestyleSrc();
const INCLUDED={model:'filter',style:'classic',finish:'chrome',label:'Classic chrome filter tap',price:'Included',image:M+'tap-studio/polish-nanopro/filter-chrome.webp'};
const isIncluded=()=>model==='filter'&&filterStyle==='classic'&&finish==='chrome';
function detail(){
  if(isIncluded())return {...INCLUDED};
  return {model,style:styleKey(),finish,label:current().short+(model==='classic'?' ('+shape+')':'')+', '+finishName(),price:priceText(),image:shownImage()};
}
window.ffyTapIncluded={...INCLUDED};
function update(animate=true){
  const m=current(),f=finishes[finish];
  section.dataset.tapModel=model;section.dataset.tapStyle=model==='pullout'?premiumStyle:model==='filter'?filterStyle:shape;
  byId('warranty-open').hidden=!(model==='deluxe'||model==='pullout'||model==='filter'&&filterStyle==='premium');
  [section,...dialogs].forEach(el=>{el.style.setProperty('--ts-metal',f.color);el.dataset.tapModel=model});
  byId('model-kicker').textContent=m.kicker;
  byId('model-title').innerHTML=model==='classic'&&shape==='square'?'A cleaner bench.<br>A sharper line.':m.title;
  byId('model-description').textContent=model==='classic'&&shape==='square'?'A square profile with hot, cold and filtered water in one mixer. Clean lines above the bench, your filtration system out of sight below.':m.description;
  byId('finish-name').textContent=finishName();
  byId('stageCap').textContent=finishName();
  stage.setAttribute('aria-label',selection());
  const scene=usesScene(),lifestyle=!scene;
  stage.classList.toggle('cut',!scene&&!lifestyle);
  stage.classList.toggle('lifestyle',lifestyle);
  byId('cutStage').hidden=scene||lifestyle;
  if(scene){imageRequest++;stage.setAttribute('aria-busy','false');byId('sceneStack').querySelectorAll('picture').forEach(p=>p.classList.toggle('on',p.dataset.f===finish))}
  else showLifestyle(lifestyleSrc());
  byId('stageTag').textContent='Explore the finish';
  const big=scene?sceneSrc(finish):lifestyleSrc().replace('.webp','-full.webp');
  const lbImg=byId('lightbox-image');if(lbImg){lbImg.src=big;lbImg.alt=selection()}
  const lbCap=byId('lightbox-caption');if(lbCap)lbCap.textContent=selection();
  byId('price-label').innerHTML=model==='deluxe'?'<strong>$'+(['brass','bronze','gunmetal'].includes(finish)?800:680)+'</strong>':model==='filter'&&filterStyle==='classic'?(finish==='chrome'?'<strong>Included</strong>':'<strong>$150</strong>'):model==='classic'?(finish==='black'?'From <strong>$550</strong>':m.price):m.price;
  byId('price-note').textContent=model==='filter'&&filterStyle==='classic'?(finish==='chrome'?'Chrome with your system':'Finish upgrade with your system'):m.note;
  const dn=byId('details-name');
  if(dn){dn.textContent=m.short;byId('details-description').textContent=byId('model-description').textContent;byId('details-finish').textContent=finishName();byId('details-price').textContent=byId('price-label').textContent;byId('details-list').replaceChildren(...m.details.map(t=>{const li=document.createElement('li');li.textContent=t;return li}))}
  $$('[data-model]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.model===model)));
  byId('classic-shapes').hidden=model!=='classic';byId('shape-summary').hidden=model!=='deluxe';byId('premium-styles').hidden=model!=='pullout';byId('filter-styles').hidden=model!=='filter';
  $$('[data-premium-style]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.premiumStyle===premiumStyle)));
  $$('[data-filter-style]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filterStyle===filterStyle)));
  byId('shape-summary').textContent=m.short;
  $$('[data-shape]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.shape===shape)));
  const focused=document.activeElement&&section.contains(document.activeElement)&&document.activeElement.dataset&&document.activeElement.dataset.finish;
  byId('finish-options').replaceChildren(...m.finishes.map(k=>{const b=document.createElement('button');b.type='button';b.className='sw'+(k===finish?' on':'');b.dataset.finish=k;const name=namedFinish(k);b.setAttribute('aria-label',name);b.setAttribute('aria-pressed',String(k===finish));b.title=name;b.style.setProperty('--f',finishes[k].sw);const i=document.createElement('i');b.append(i,document.createTextNode(name));b.addEventListener('click',()=>{finish=k;update()});return b}));
  if(focused){const b=section.querySelector(`[data-finish="${finish}"]`);b&&b.focus({preventScroll:true})}
  if(animate&&!reduce){stage.classList.remove('wipe-on');void stage.offsetWidth;stage.classList.add('wipe-on')}
  const key=[model,styleKey(),finish].join('|');
  if(lastKey&&key!==lastKey)document.dispatchEvent(new CustomEvent('ffy:tap-preview',{detail:detail()}));
  lastKey=key;
}
const warmImages=new Map();
function warmFamily(){
  if(usesScene())return;
  current().finishes.forEach(f=>{const src=lifestyleSrc(f).replace('.webp',(phoneMQ.matches?'-m':'')+'.webp');if(warmImages.has(src))return;const im=new Image();im.decoding='async';im.fetchPriority='low';im.src=src;warmImages.set(src,im)});
}
function setModel(m){if(!models[m])return;model=m;if(m==='filter')filterStyle='classic';if(m==='pullout')premiumStyle='modern';if(!current().finishes.includes(finish))finish=current().finishes[0];update();warmFamily()}
function setStyle(kind,value){if(kind==='premium')premiumStyle=value;else filterStyle=value;if(!current().finishes.includes(finish))finish=current().finishes[0];update();warmFamily()}
$$('[data-premium-style]').forEach(b=>b.addEventListener('click',()=>setStyle('premium',b.dataset.premiumStyle)));
$$('[data-filter-style]').forEach(b=>b.addEventListener('click',()=>setStyle('filter',b.dataset.filterStyle)));
$$('[data-shape]').forEach(b=>b.addEventListener('click',()=>{shape=b.dataset.shape;update();warmFamily()}));
$$('[data-model]').forEach(b=>b.addEventListener('click',()=>setModel(b.dataset.model)));
byId('finish-options').addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const a=current().finishes;let i=a.indexOf(finish);i=e.key==='Home'?0:e.key==='End'?a.length-1:(i+(e.key==='ArrowRight'?1:-1)+a.length)%a.length;finish=a[i];update();const b=section.querySelector(`[data-finish="${finish}"]`);b&&b.focus({preventScroll:true})});
byId('surprise').addEventListener('click',()=>{const a=current().finishes.filter(f=>f!==finish);finish=a[Math.floor(Math.random()*a.length)];update()});
stage.addEventListener('animationend',e=>{if(e.target===stage.querySelector('.ts-metal-wipe'))stage.classList.remove('wipe-on')});
function showDialog(d){if(!d)return;lastFocus=document.activeElement;if(window.lenis&&window.lenis.stop)window.lenis.stop();d.showModal()}
byId('details-toggle').addEventListener('click',()=>showDialog(byId('details-dialog')));
byId('warranty-open').addEventListener('click',()=>{
  if(!byId('warranty-dialog'))return;
  const deluxe=model==='deluxe';byId('deluxe-warranty').hidden=!deluxe;byId('premium-warranty').hidden=deluxe;byId('warranty-range').textContent=current().short;byId('warranty-selection').textContent=finishName();
  byId('warranty-finish-period').textContent=((model==='pullout'&&premiumStyle==='victorian'&&finish==='chrome')||(model==='filter'&&finish==='black')?2:15)+' years';
  showDialog(byId('warranty-dialog'));
});
byId('zoom').addEventListener('click',()=>{update(false);showDialog(byId('lightbox'))});
dialogs.forEach(d=>{const x=d.querySelector('[data-close]');x&&x.addEventListener('click',()=>d.close());d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}});d.addEventListener('close',()=>{if(window.lenis&&window.lenis.start)window.lenis.start();lastFocus&&lastFocus.focus&&lastFocus.focus({preventScroll:true})})});
const eGlide=t=>t<=0?0:(t>=1?1:-(Math.cos(Math.PI*t)-1)/2);
let tw=0,glideTimer=0,glideVersion=0;
function glide(y,dur){
  glideVersion++;const version=glideVersion;cancelAnimationFrame(tw);clearTimeout(glideTimer);
  y=Math.max(0,Math.round(y));
  const from=scrollY,dist=y-from,t0=performance.now();
  if(!dist||reduce||!dur){window.scrollTo({top:y,behavior:'instant'});return}
  if(window.lenis&&window.lenis.scrollTo){window.lenis.scrollTo(y,{duration:dur,easing:eGlide});return}
  let closed=false;const finishGlide=()=>{if(closed||version!==glideVersion)return;closed=true;clearTimeout(glideTimer);cancelAnimationFrame(tw);window.scrollTo({top:y,behavior:'instant'})};
  const step=now=>{if(version!==glideVersion)return;const k=Math.min(1,(now-t0)/(dur*1000));window.scrollTo({top:from+dist*eGlide(k),behavior:'instant'});if(k<1)tw=requestAnimationFrame(step);else finishGlide()};
  tw=requestAnimationFrame(step);glideTimer=setTimeout(finishGlide,dur*1000+260);
}
const glideTo=el=>{if(!el)return;const mph=phoneMQ.matches;glide(el.getBoundingClientRect().top+scrollY-(mph?80:96),mph?.8:1.2)};
studioAction.addEventListener('click',()=>{
  window.ffyTap=detail();
  document.dispatchEvent(new CustomEvent('ffy:tap',{detail:{...window.ffyTap}}));
  glideTo(document.getElementById('ask'));
});
const ALIAS={premium:'pullout'};
window.ffyTapStudio={
  select(m,f,opts={}){
    m=ALIAS[m]||m;if(!models[m])return null;
    model=m;
    if(m==='pullout')premiumStyle=premiumStyles[opts.style]?opts.style:'modern';
    if(m==='filter')filterStyle=filterStyles[opts.style]?opts.style:'classic';
    if(m==='classic'&&['gooseneck','square'].includes(opts.style||opts.shape))shape=opts.style||opts.shape;
    finish=current().finishes.includes(f)?f:(current().finishes.includes(finish)?finish:current().finishes[0]);
    update();warmFamily();
    if(opts.scroll)glideTo(byId('mixertapstudio'));
    return detail();
  },
  current:()=>detail()
};
const head=byId('mixertapstudio');
const revealEls=Array.from(section.querySelectorAll('[data-sc-in]'));
const reveal=el=>{el.classList.add('sc-in');const st=parseFloat(el.getAttribute('data-sc-stagger'));if(!isNaN(st))Array.from(el.children).forEach((kid,i)=>{kid.style.transitionDelay=(i*st)+'ms';kid.classList.add('sc-in')})};
if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;reveal(e.target);io.unobserve(e.target)}),{rootMargin:'0px 0px -12% 0px',threshold:0.01});revealEls.forEach(el=>io.observe(el))}
else revealEls.forEach(reveal);
let ticking=false;
function paint(){
  ticking=false;
  if(reduce)return;
  const sr=stage.getBoundingClientRect(),r=clamp((innerHeight-sr.top)/(innerHeight*.6),0,1);
  stage.style.clipPath=r>=1?'':`inset(0 ${((1-r)*6).toFixed(2)}% round ${Math.round(24+(1-r)*30)}px)`;
}
addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(paint);ticking=true}},{passive:true});
addEventListener('resize',paint,{passive:true});
update(false);paint();
addEventListener('load',()=>setTimeout(paint,200));
function landOnStudio(){
  if(!['#mixertapstudio','#studio'].includes(location.hash.toLowerCase()))return;
  requestAnimationFrame(()=>requestAnimationFrame(()=>{window.scrollTo({top:Math.round(head.getBoundingClientRect().top+scrollY-112),behavior:'instant'})}));
}
addEventListener('hashchange',landOnStudio);
if(document.readyState==='complete')document.fonts.ready.then(landOnStudio);
else addEventListener('load',()=>document.fonts.ready.then(landOnStudio),{once:true});
})();
