/* Queen's Bakery — own code. Motion values from the reference spec:
   reveals .55s cubic-bezier(.65,0,.25,1), hero fade-up .8s stagger .11s,
   word rotation .55s, FAQ .45s, header hide .3s, postcard hover handled in CSS. */
(function(){
  "use strict";
  document.documentElement.classList.add("is-enhanced");

  /* --- petals (hero) --- */
  document.querySelectorAll("[data-petals]").forEach(function(box){
    var n = 14, frag = document.createDocumentFragment();
    for (var i=0;i<n;i++){
      var p = document.createElement("span");
      p.className = "petal";
      var size = 9 + Math.random()*10;
      p.style.width = size+"px"; p.style.height = (size*.75)+"px";
      p.style.left = (Math.random()*100)+"%";
      p.style.setProperty("--dur",(9+Math.random()*8)+"s");
      p.style.setProperty("--delay",(-Math.random()*12)+"s");
      p.style.setProperty("--drift",((Math.random()*160)-60)+"px");
      if (Math.random()>.5) p.style.background = "#efa9bf";
      frag.appendChild(p);
    }
    box.appendChild(frag);
  });

  /* --- hero entrance --- */
  var hero = document.getElementById("hero");
  if (hero){ requestAnimationFrame(function(){ setTimeout(function(){ hero.classList.add("is-playing"); },60); }); }

  /* --- hero rotating word (reference: word mask slide .55s + accent-in 1.2s) --- */
  var sets = [
    {w:"mornings", a:"sweet."},
    {w:"birthdays", a:"royal."},
    {w:"tea time", a:"golden."}
  ];
  var wordEl = document.getElementById("rotWord");
  var accEl = document.getElementById("rotAccent");
  if (wordEl && accEl){
    var idx = 0, busy = false;
    setInterval(function(){
      if (busy || document.hidden) return; busy = true;
      idx = (idx+1) % sets.length;
      wordEl.classList.add("is-out");
      setTimeout(function(){
        wordEl.classList.add("is-below"); wordEl.classList.remove("is-out");
        wordEl.textContent = sets[idx].w;
        accEl.textContent = sets[idx].a;
        accEl.classList.remove("hero-title__accent-text--entering"); void accEl.offsetWidth;
        accEl.classList.add("hero-title__accent-text--entering");
        requestAnimationFrame(function(){ requestAnimationFrame(function(){
          wordEl.classList.remove("is-below"); busy = false;
        });});
      }, 560);
    }, 3000);
  }

  /* --- header: scrolled pill + hide on scroll down (reference .3s) --- */
  var header = document.getElementById("siteHeader");
  var lastY = 0;
  if (header){
    window.addEventListener("scroll", function(){
      var y = window.scrollY;
      header.classList.toggle("header--scrolled", y > 40);
      if (y > 420 && y > lastY + 4) header.classList.add("header--hidden");
      else if (y < lastY - 4 || y <= 420) header.classList.remove("header--hidden");
      lastY = y;
    }, {passive:true});
  }

  /* --- mobile menu --- */
  var toggle = document.getElementById("menuToggle");
  var mobileMenu = document.getElementById("mobileMenu");
  if (toggle && mobileMenu){
    toggle.addEventListener("click", function(){
      var open = mobileMenu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.textContent = open ? "✕" : "☰";
    });
    mobileMenu.querySelectorAll("a").forEach(function(a){
      a.addEventListener("click", function(){ mobileMenu.classList.remove("is-open"); toggle.textContent = "☰"; });
    });
  }

  /* --- reveals on scroll (reference data-reveal + work items) --- */
  if ("IntersectionObserver" in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting){ e.target.classList.add("is-revealed"); io.unobserve(e.target); }
      });
    }, {threshold:.18});
    document.querySelectorAll("[data-reveal], .home-work__item").forEach(function(el){ io.observe(el); });
  } else {
    document.querySelectorAll("[data-reveal], .home-work__item").forEach(function(el){ el.classList.add("is-revealed"); });
  }

  /* --- FAQ accordion (reference: grid-rows .45s, one open at a time) --- */
  document.querySelectorAll(".faq__item").forEach(function(item){
    var btn = item.querySelector(".faq__question");
    if (!btn) return;
    btn.addEventListener("click", function(){
      var wasOpen = item.classList.contains("is-open");
      document.querySelectorAll(".faq__item.is-open").forEach(function(o){
        o.classList.remove("is-open");
        var b = o.querySelector(".faq__question"); if (b) b.setAttribute("aria-expanded","false");
      });
      if (!wasOpen){ item.classList.add("is-open"); btn.setAttribute("aria-expanded","true"); }
    });
  });

  /* --- custom cursor (reference 60px circle) --- */
  var cursor = document.getElementById("customCursor");
  if (cursor && window.matchMedia("(hover:hover)").matches){
    var cx = -100, cy = -100, tx = -100, ty = -100;
    document.addEventListener("mousemove", function(e){ tx = e.clientX; ty = e.clientY; });
    (function loop(){
      cx += (tx-cx)*.22; cy += (ty-cy)*.22;
      var half = cursor.offsetWidth/2;
      cursor.style.transform = "translate("+(cx-half)+"px,"+(cy-half)+"px)";
      requestAnimationFrame(loop);
    })();
    var label = cursor.querySelector("span");
    document.querySelectorAll("[data-cursor]").forEach(function(el){
      el.addEventListener("mouseenter", function(){ label.textContent = el.getAttribute("data-cursor"); cursor.classList.add("is-active"); });
      el.addEventListener("mouseleave", function(){ cursor.classList.remove("is-active"); });
    });
  }
})();
