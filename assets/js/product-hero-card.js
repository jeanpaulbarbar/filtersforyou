/* Keep the mobile heading above the actual card, including every RO selection. */
(()=>{
  const card=document.querySelector('[data-product-card]');
  if(!card)return;
  const hero=card.closest('.hero');
  const fit=()=>hero.style.setProperty('--product-card-height',card.offsetHeight+'px');
  fit();new ResizeObserver(fit).observe(card);
})();
