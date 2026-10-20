(function(){
  var toc = document.querySelector('#lg .lg-toc'); if (!toc) return;
  var phone = matchMedia('(max-width:959px)');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function fit(){ if (phone.matches) toc.removeAttribute('open'); else toc.setAttribute('open', ''); }
  fit(); phone.addEventListener('change', fit);
  var links = [].slice.call(toc.querySelectorAll('a'));
  var secs = links.map(function(a){ return document.getElementById(a.getAttribute('href').slice(1)); });
  toc.addEventListener('click', function(e){
    var a = e.target.closest('a'); if (!a) return;
    var el = document.getElementById(a.getAttribute('href').slice(1)); if (!el) return;
    e.preventDefault();
    if (phone.matches) toc.removeAttribute('open');
    var y = el.getBoundingClientRect().top + scrollY - 88, l = window.__ffyLenis;
    if (l && l.scrollTo && !reduce) l.scrollTo(y, {duration: 1.1});
    else scrollTo({top: y, behavior: reduce ? 'auto' : 'smooth'});
    history.replaceState(null, '', '#' + el.id);
  });
  var on = null;
  function mark(){
    var line = innerHeight * .3, i = 0;
    for (var k = 0; k < secs.length; k++){ if (secs[k] && secs[k].getBoundingClientRect().top < line) i = k; }
    var a = links[i];
    if (a !== on){ if (on) on.classList.remove('is-on'); a.classList.add('is-on'); on = a; }
  }
  addEventListener('scroll', mark, {passive: true}); mark();
})();
