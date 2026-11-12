/* Queen's Bakery — "The Crown Box" interactions (own code). */
(function(){
  "use strict";

  /* header state */
  var header=document.getElementById("siteHeader");
  if(header){
    var onScroll=function(){ header.classList.toggle("header--scrolled", window.scrollY>30); };
    window.addEventListener("scroll",onScroll,{passive:true}); onScroll();
  }

  /* mobile menu */
  var toggle=document.getElementById("menuToggle"), menu=document.getElementById("mobileMenu");
  if(toggle&&menu){
    toggle.addEventListener("click",function(){
      var open=menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded",open?"true":"false");
      toggle.textContent=open?"✕":"☰";
    });
    menu.querySelectorAll("a").forEach(function(a){ a.addEventListener("click",function(){ menu.classList.remove("is-open"); toggle.textContent="☰"; }); });
  }

  /* hero rotating treat */
  var words=["rice puffs","almond cookies","shortcakes","cream puffs","mooncakes"];
  var rot=document.getElementById("rotWord"), wi=0;
  if(rot){
    setInterval(function(){
      if(document.hidden) return;
      rot.classList.add("out");
      setTimeout(function(){
        wi=(wi+1)%words.length; rot.textContent=words[wi];
        rot.classList.remove("out");
      },480);
    },2900);
  }

  /* hero photo — the lid lifts as you start to scroll */
  var heroImg=document.getElementById("heroImg");
  if(heroImg){
    var ticking=false;
    window.addEventListener("scroll",function(){
      if(ticking) return; ticking=true;
      requestAnimationFrame(function(){
        var y=Math.min(window.scrollY,window.innerHeight);
        var p=y/window.innerHeight;
        heroImg.style.transform="scale("+(1.12-p*.1)+") translateY("+(p*26)+"px)";
        ticking=false;
      });
    },{passive:true});
  }

  /* famous four — expanding bands */
  var bands=document.querySelectorAll("[data-band]");
  bands.forEach(function(b){
    var act=function(){ bands.forEach(function(x){x.classList.remove("is-active")}); b.classList.add("is-active"); };
    b.addEventListener("mouseenter",act);
    b.addEventListener("click",act);
    b.addEventListener("focus",act);
  });

  /* chapter ghost words — drift with scroll */
  var ghosts=document.querySelectorAll("[data-ghost]");
  if(ghosts.length){
    var gt=false;
    var move=function(){
      ghosts.forEach(function(g){
        var r=g.parentElement.getBoundingClientRect();
        var p=(r.top-window.innerHeight)/(window.innerHeight+r.height);
        g.style.transform="translateX("+(p*120-40)+"px)";
      });
      gt=false;
    };
    window.addEventListener("scroll",function(){ if(!gt){ gt=true; requestAnimationFrame(move); } },{passive:true});
    move();
  }

  /* reveals + fan + counters */
  var io=("IntersectionObserver" in window)?new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add("is-in"); io.unobserve(e.target); } });
  },{threshold:.16}):null;
  document.querySelectorAll("[data-reveal],[data-fan]").forEach(function(el){
    if(io) io.observe(el); else el.classList.add("is-in");
  });

  var counted=false;
  var counters=document.querySelectorAll("[data-count]");
  if(counters.length){
    var cio=("IntersectionObserver" in window)?new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(!e.isIntersecting||counted) return; counted=true;
        counters.forEach(function(c){
          var end=parseFloat(c.getAttribute("data-count")), dec=parseInt(c.getAttribute("data-dec")||"0",10), t0=null;
          var step=function(ts){
            if(!t0) t0=ts;
            var p=Math.min((ts-t0)/1400,1), ease=1-Math.pow(1-p,3);
            c.textContent=(end*ease).toFixed(dec);
            if(p<1) requestAnimationFrame(step); else c.textContent=end.toFixed(dec).replace(/\.0$/,"");
          };
          requestAnimationFrame(step);
        });
        cio.disconnect();
      });
    },{threshold:.4}):null;
    if(cio) cio.observe(counters[0]); else counters.forEach(function(c){ c.textContent=c.getAttribute("data-count"); });
  }

  /* the shelf — drag to scroll */
  var shelf=document.getElementById("shelfRow");
  if(shelf){
    var down=false,sx=0,sl=0,moved=false;
    shelf.addEventListener("pointerdown",function(e){ down=true; moved=false; sx=e.clientX; sl=shelf.scrollLeft; });
    window.addEventListener("pointermove",function(e){ if(!down) return; var dx=e.clientX-sx; if(Math.abs(dx)>4) moved=true; shelf.scrollLeft=sl-dx; });
    window.addEventListener("pointerup",function(){ down=false; });
    shelf.addEventListener("click",function(e){ if(moved){ e.preventDefault(); e.stopPropagation(); } },true);
  }

  /* FAQ tickets */
  document.querySelectorAll(".ticket").forEach(function(t){
    var q=t.querySelector(".ticket__q");
    if(!q) return;
    q.addEventListener("click",function(){
      var was=t.classList.contains("is-open");
      document.querySelectorAll(".ticket.is-open").forEach(function(o){ o.classList.remove("is-open"); o.querySelector(".ticket__q").setAttribute("aria-expanded","false"); });
      if(!was){ t.classList.add("is-open"); q.setAttribute("aria-expanded","true"); }
    });
  });
})();
