(()=>{'use strict';


const dlg=document.querySelector('#rv-installs'),open=document.querySelector('[data-rv-installs]');if(!dlg||!open)return;
let list=[];try{list=JSON.parse(dlg.dataset.photos)}catch(e){return}
const img=dlg.querySelector('[data-rv-lb-img]'),cap=dlg.querySelector('[data-rv-lb-cap]'),count=dlg.querySelector('[data-rv-lb-count]');let i=0,x0=null;
const show=k=>{i=(k+list.length)%list.length;img.src=list[i].src;img.alt=list[i].alt;cap.textContent=list[i].alt;count.textContent=(i+1)+' / '+list.length;
 const n=new Image();n.src=list[(i+1)%list.length].src};
open.addEventListener('click',()=>{show(0);if(dlg.showModal)dlg.showModal();else dlg.setAttribute('open','')});
dlg.querySelectorAll('[data-rv-lb]').forEach(b=>b.addEventListener('click',()=>show(i+ +b.dataset.rvLb)));
dlg.querySelector('[data-rv-lb-close]').addEventListener('click',()=>dlg.close());
dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});
dlg.addEventListener('keydown',e=>{if(e.key==='ArrowRight')show(i+1);else if(e.key==='ArrowLeft')show(i-1)});
dlg.addEventListener('touchstart',e=>{x0=e.touches[0].clientX},{passive:true});
dlg.addEventListener('touchend',e=>{if(x0===null)return;const dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>40)show(i+(dx<0?1:-1));x0=null},{passive:true});
})();
