// Queen's Bakery — interactions
// header: pill morph on scroll, hide on scroll down (reference behaviour)
(function(){
  var header=document.getElementById('siteHeader');
  var lastY=window.scrollY, ticking=false;
  function onScroll(){
    var y=window.scrollY;
    header.classList.toggle('header--scrolled', y>40);
    if(y>320 && y>lastY+4 && !document.body.classList.contains('menu-open')) header.classList.add('header--hidden');
    else if(y<lastY-4 || y<=320) header.classList.remove('header--hidden');
    lastY=y; ticking=false;
  }
  window.addEventListener('scroll',function(){ if(!ticking){ requestAnimationFrame(onScroll); ticking=true; } },{passive:true});
  onScroll();
})();

// mobile menu
(function(){
  var btn=document.getElementById('menuToggle'), menu=document.getElementById('mobileMenu');
  if(!btn||!menu) return;
  btn.addEventListener('click',function(){
    var open=menu.classList.toggle('is-open');
    document.body.classList.toggle('menu-open',open);
    btn.setAttribute('aria-expanded',open?'true':'false');
    btn.textContent=open?'✕':'☰';
  });
  menu.querySelectorAll('a').forEach(function(a){ a.addEventListener('click',function(){ menu.classList.remove('is-open'); document.body.classList.remove('menu-open'); btn.textContent='☰'; }); });
})();

// hero rotating word (reference: word swaps through a mask, .5s)
(function(){
  var el=document.getElementById('rotWord'); if(!el) return;
  var words=['rice puffs','almond cookies','custom cakes','cream puffs','shortcakes','mooncakes'];
  var i=0;
  setInterval(function(){
    el.classList.add('out');
    setTimeout(function(){ i=(i+1)%words.length; el.textContent=words[i]; el.classList.remove('out'); },480);
  },2900);
})();

// hero photo parallax — the "lid lifts" as you scroll away
(function(){
  var img=document.getElementById('heroImg'); if(!img) return;
  var ticking=false;
  window.addEventListener('scroll',function(){
    if(ticking) return; ticking=true;
    requestAnimationFrame(function(){
      var y=window.scrollY;
      if(y<window.innerHeight*1.2) img.style.transform='scale(1.12) translateY('+(y*-0.06)+'px)';
      ticking=false;
    });
  },{passive:true});
})();

// reveals + line-mask titles
(function(){
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('is-in'); io.unobserve(e.target); } });
  },{threshold:.18});
  document.querySelectorAll('[data-reveal],[data-lm]').forEach(function(el){ io.observe(el); });
})();

// famous four — expanding bands
(function(){
  var bands=document.querySelectorAll('[data-band]'); if(!bands.length) return;
  function activate(b){ bands.forEach(function(x){ x.classList.toggle('is-active',x===b); }); }
  bands.forEach(function(b){
    b.addEventListener('mouseenter',function(){ activate(b); });
    b.addEventListener('click',function(){ activate(b); });
    b.addEventListener('focus',function(){ activate(b); });
  });
})();

// poster stack — incoming poster rotates in, covered poster scales + tilts (reference transition)
(function(){
  var posters=[].slice.call(document.querySelectorAll('[data-poster]'));
  if(!posters.length || window.matchMedia('(max-width: 899px)').matches) return;
  var ticking=false;
  function frame(){
    var vh=window.innerHeight;
    posters.forEach(function(p,i){
      var r=p.getBoundingClientRect();
      var t='';
      if(i<posters.length-1){
        var n=posters[i+1].getBoundingClientRect();
        var cover=Math.min(1,Math.max(0,(vh-n.top)/vh));
        if(cover>0 && r.top<=0) t='scale('+(1-.05*cover)+') rotate('+(-1.3*cover)+'deg)';
        p.style.filter=cover>0&&r.top<=0 ? 'brightness('+(1-.14*cover)+')' : '';
      }
      if(r.top>0 && r.top<vh) t='rotate('+(-2*(r.top/vh))+'deg)';
      p.style.transform=t;
    });
    ticking=false;
  }
  window.addEventListener('scroll',function(){ if(!ticking){ requestAnimationFrame(frame); ticking=true; } },{passive:true});
  frame();
})();

// counters
(function(){
  var nums=document.querySelectorAll('[data-count]'); if(!nums.length) return;
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(!e.isIntersecting) return; io.unobserve(e.target);
      var el=e.target, end=parseFloat(el.dataset.count), dec=parseInt(el.dataset.dec||'0',10), t0=null;
      function step(ts){ if(!t0) t0=ts; var p=Math.min(1,(ts-t0)/1500); var v=end*(0.16+0.84*p*p*(3-2*p)); el.textContent=v.toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g,','); if(p<1) requestAnimationFrame(step); else el.textContent=end.toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g,','); }
      requestAnimationFrame(step);
    });
  },{threshold:.5});
  nums.forEach(function(n){ io.observe(n); });
})();

// faq tickets
(function(){
  document.querySelectorAll('.ticket__q').forEach(function(btn){
    btn.addEventListener('click',function(){
      var t=btn.closest('.ticket'), open=t.classList.toggle('is-open');
      btn.setAttribute('aria-expanded',open?'true':'false');
    });
  });
})();
