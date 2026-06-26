/* =================================================================
   Cinematic Web — motion module (vanilla, no deps)
   Drop in after your content. All effects gate on reduced-motion / touch.
   Markup hooks:
     .reveal                         -> staggered blur-in on scroll
     [data-tilt]   (parent: perspective) -> 3D pointer tilt
     [data-parallax="0.25"]          -> scroll parallax (decor only, not .reveal)
     [data-count="20"]               -> count-up when scrolled into view
     #progress                       -> scroll progress bar (width)
     #cursor-halo                    -> lagging cursor glow
     #flood                          -> opacity ramps with scroll (colour flood)
     #nav / #nav-toggle / #nav-links -> sticky + mobile menu
   ================================================================= */
(function () {
  "use strict";
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canHover = matchMedia("(hover: hover) and (pointer: fine)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return [].slice.call((c || document).querySelectorAll(s)); };
  var onScroll = function (fn) { var t = false;
    addEventListener("scroll", function () { if (!t) { t = true; requestAnimationFrame(function () { fn(); t = false; }); } }, { passive: true });
    addEventListener("resize", fn); fn(); };

  /* Reveals — staggered among siblings */
  (function () {
    var items = $$(".reveal");
    if (reduce || !("IntersectionObserver" in window)) { items.forEach(function (e) { e.classList.add("is-visible"); }); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); } });
    }, { threshold: .12, rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (el) {
      var sibs = [].filter.call(el.parentNode.children, function (c) { return c.classList && c.classList.contains("reveal"); });
      el.style.transitionDelay = Math.min(sibs.indexOf(el), 6) * 70 + "ms";
      io.observe(el);
    });
  })();

  /* 3D pointer tilt (parent supplies `perspective`) */
  $$("[data-tilt]").forEach(function (el) {
    if (reduce || !canHover) return; var max = 9;
    el.addEventListener("pointermove", function (e) {
      var r = el.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
      el.style.transition = "transform .08s linear";
      el.style.transform = "rotateY(" + (px * max).toFixed(2) + "deg) rotateX(" + (-py * max).toFixed(2) + "deg) translateZ(8px)";
    });
    el.addEventListener("pointerleave", function () { el.style.transition = "transform .5s var(--ease)"; el.style.transform = ""; });
  });

  /* Scroll parallax (decorative layers only) */
  (function () { if (reduce) return; var els = $$("[data-parallax]"); if (!els.length) return;
    onScroll(function () { var vh = innerHeight;
      els.forEach(function (el) { var r = el.getBoundingClientRect();
        var off = (r.top + r.height / 2 - vh / 2) / vh, f = parseFloat(el.getAttribute("data-parallax")) || .15;
        el.style.transform = "translate3d(0," + (off * f * -120).toFixed(1) + "px,0)"; });
    });
  })();

  /* Scroll progress bar */
  (function () { var bar = $("#progress"); if (!bar) return;
    onScroll(function () { var h = document.documentElement, m = h.scrollHeight - h.clientHeight;
      bar.style.width = (m > 0 ? Math.min(1, h.scrollTop / m) : 0) * 100 + "%"; });
  })();

  /* The brand colour floods the page as you scroll (#flood opacity) */
  (function () { var el = $("#flood"); if (!el) return;
    onScroll(function () { var h = document.documentElement, m = h.scrollHeight - h.clientHeight;
      el.style.opacity = Math.min(1, (m > 0 ? h.scrollTop / m : 0) / 0.55).toFixed(3); });
  })();

  /* Count-up */
  (function () { var nums = $$("[data-count]"); if (!nums.length) return;
    if (reduce || !("IntersectionObserver" in window)) { nums.forEach(function (n) { n.textContent = n.getAttribute("data-count"); }); return; }
    var run = function (el) { var target = parseInt(el.getAttribute("data-count"), 10) || 0, s = null;
      (function step(ts) { if (s == null) s = ts; var p = Math.min(1, (ts - s) / 1200);
        el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target); if (p < 1) requestAnimationFrame(step); })(performance.now()); };
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } }); }, { threshold: .5 });
    nums.forEach(function (n) { n.textContent = "0"; io.observe(n); });
  })();

  /* Lagging cursor halo */
  (function () { var el = $("#cursor-halo"); if (!el || reduce || !canHover) return;
    var tx = innerWidth / 2, ty = innerHeight / 2, x = tx, y = ty, raf = null;
    function loop() { x += (tx - x) * .12; y += (ty - y) * .12;
      el.style.transform = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px)";
      raf = (Math.abs(tx - x) > .5 || Math.abs(ty - y) > .5) ? requestAnimationFrame(loop) : null; }
    addEventListener("pointermove", function (e) { tx = e.clientX; ty = e.clientY; el.classList.add("is-on"); if (!raf) raf = requestAnimationFrame(loop); });
  })();

  /* Sticky + mobile nav */
  (function () { var nav = $("#nav"), tog = $("#nav-toggle"), links = $("#nav-links"); if (!nav) return;
    onScroll(function () { nav.classList.toggle("is-stuck", scrollY > 24); });
    if (tog && links) { var set = function (o) { links.classList.toggle("is-open", o); nav.classList.toggle("is-open", o); tog.setAttribute("aria-expanded", o); };
      tog.addEventListener("click", function () { set(!links.classList.contains("is-open")); });
      $$("a", links).forEach(function (a) { a.addEventListener("click", function () { set(false); }); }); }
  })();
})();
