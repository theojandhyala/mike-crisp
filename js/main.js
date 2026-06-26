/* =================================================================
   Michael Crisp — author site
   All interactivity. Reads content from data/books.js.
   ================================================================= */
(function () {
  "use strict";

  var BOOKS = Array.isArray(window.BOOKS) ? window.BOOKS : [];
  var SITE  = window.SITE || {};
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  var canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* Pointer-driven 3D tilt for any [data-tilt] element (parent supplies perspective). */
  function attachTilt(el) {
    if (prefersReduced || !canHover) return;
    var max = 9;
    el.addEventListener("pointermove", function (e) {
      var r = el.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transition = "transform .08s linear";
      el.style.transform = "rotateY(" + (px * max).toFixed(2) + "deg) rotateX(" + (-py * max).toFixed(2) + "deg) translateZ(8px)";
    });
    el.addEventListener("pointerleave", function () {
      el.style.transition = "transform .5s var(--ease)";
      el.style.transform = "";
    });
  }

  /* ---------- Cinematic loader (count-up + curtain wipe) ---------- */
  function dismissIntro() { document.body.classList.add("intro-done"); }
  (function intro() {
    var el = $("#intro");
    if (!el || prefersReduced) { dismissIntro(); return; }
    var countEl = $("#intro-count"), fill = $("#intro-fill");
    var start = null, dur = 1900, done = false;

    function wipe() {
      if (done) return; done = true;
      el.classList.add("intro--out");
      setTimeout(dismissIntro, 850);
    }
    function step(ts) {
      if (start == null) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      var val = Math.round(p * 100);
      if (countEl) countEl.textContent = val;
      if (fill) fill.style.width = val + "%";
      if (p < 1) requestAnimationFrame(step);
      else setTimeout(wipe, 280);
    }
    requestAnimationFrame(step);
    el.addEventListener("click", wipe); // let an impatient visitor skip
  })();

  /* ---------- Hero: drive from the featured book ---------- */
  function featuredBook() {
    return BOOKS.filter(function (b) { return b.featured; })[0] ||
           BOOKS.filter(function (b) { return b.status === "out-now"; })[0] ||
           BOOKS[0];
  }
  function firstBuyUrl(book) {
    return book && book.buyLinks && book.buyLinks[0] ? book.buyLinks[0].url : null;
  }
  (function hero() {
    var b = featuredBook();
    if (!b) return;
    var set = function (id, val) { var n = $("#" + id); if (n && val) n.textContent = val; };
    set("hero-eyebrow", b.series);
    set("hero-title", b.title);
    set("hero-tagline", b.tagline);
    set("hero-meta", b.releaseText);
    var cover = $("#hero-cover");
    if (cover && b.cover) { cover.src = b.cover; cover.alt = "Cover of " + b.title + " by " + (SITE.authorName || "Michael Crisp"); }

    var url = firstBuyUrl(b);
    [$("#hero-buy"), $("#nav-buy")].forEach(function (btn) {
      if (!btn) return;
      if (url) { btn.href = url; btn.target = "_blank"; btn.rel = "noopener"; }
      else { btn.href = "#books"; }
    });
  })();

  /* ---------- Books ---------- */
  function bookCardHTML(b, i) {
    var soon = b.status === "coming-soon";
    return '' +
      '<article class="bookcard" tabindex="0" role="button" data-tilt aria-label="More about ' + esc(b.title) + '" data-index="' + i + '">' +
        '<div class="bookcard__art">' +
          '<span class="bookcard__badge' + (soon ? ' is-soon' : '') + '">' + (soon ? 'Coming soon' : 'Out now') + '</span>' +
          '<img src="' + esc(b.cover || 'assets/covers/placeholder.svg') + '" alt="Cover of ' + esc(b.title) + '" loading="lazy" />' +
        '</div>' +
        '<div class="bookcard__body">' +
          (b.series ? '<span class="bookcard__series">' + esc(b.series) + '</span>' : '') +
          '<h3 class="bookcard__title">' + esc(b.title) + '</h3>' +
          '<p class="bookcard__tagline">' + esc(b.tagline || '') + '</p>' +
          '<div class="bookcard__foot"><span class="bookcard__more">Details</span></div>' +
        '</div>' +
      '</article>';
  }

  function bookFeatureHTML(b) {
    var buys = (b.buyLinks || []).map(function (l) {
      return '<a class="btn btn--primary" href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) + '</a>';
    }).join("");
    return '' +
      '<div class="bookfeature">' +
        '<div class="bookfeature__cover" data-tilt><img src="' + esc(b.cover || 'assets/covers/placeholder.svg') + '" alt="Cover of ' + esc(b.title) + '" /></div>' +
        '<div class="bookfeature__info">' +
          (b.series ? '<p class="bookfeature__series">' + esc(b.series) + '</p>' : '') +
          '<h3 class="bookfeature__title">' + esc(b.title) + '</h3>' +
          (b.releaseText ? '<p class="bookfeature__release">' + esc(b.releaseText) + '</p>' : '') +
          (b.blurb ? '<p class="bookfeature__blurb">' + esc(b.blurb) + '</p>' : '') +
          '<div class="bookfeature__actions">' + buys +
            '<button class="btn btn--ghost" type="button" data-open>Full details</button>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  (function renderBooks() {
    var grid = $("#books-grid");
    if (!grid) return;
    if (!BOOKS.length) { grid.innerHTML = '<p style="color:var(--muted-dark)">Books coming soon.</p>'; return; }

    if (BOOKS.length === 1) {
      grid.classList.add("books__grid--single");
      grid.innerHTML = bookFeatureHTML(BOOKS[0]);
      var det = $("[data-open]", grid);
      if (det) det.addEventListener("click", function () { openModal(BOOKS[0]); });
    } else {
      grid.innerHTML = BOOKS.map(bookCardHTML).join("");
      $all(".bookcard", grid).forEach(function (card) {
        var open = function () { openModal(BOOKS[+card.getAttribute("data-index")]); };
        card.addEventListener("click", open);
        card.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
        });
      });
    }
    $all("[data-tilt]", grid).forEach(attachTilt);
  })();

  /* ---------- Book detail modal ---------- */
  var modal = $("#book-modal");
  var modalBody = $("#modal-body");
  var lastFocused = null;

  function openModal(b) {
    if (!b || !modal) return;
    lastFocused = document.activeElement;
    var buys = (b.buyLinks || []).map(function (l) {
      return '<a class="btn btn--primary btn--small" href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) + '</a>';
    }).join("");
    modalBody.innerHTML = '' +
      '<div><img src="' + esc(b.cover || 'assets/covers/placeholder.svg') + '" alt="Cover of ' + esc(b.title) + '" /></div>' +
      '<div>' +
        (b.series ? '<p class="modal__series">' + esc(b.series) + '</p>' : '') +
        '<h3 class="modal__title" id="modal-title">' + esc(b.title) + '</h3>' +
        (b.releaseText ? '<p class="modal__release">' + esc(b.releaseText) + '</p>' : '') +
        (b.blurb ? '<p class="modal__blurb">' + esc(b.blurb) + '</p>' : '') +
        (b.quote ? '<blockquote class="modal__quote">' + esc(b.quote) + '</blockquote>' : '') +
        (buys ? '<div class="modal__buys">' + buys + '</div>' : '<p class="modal__release">Available to buy soon.</p>') +
      '</div>';
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    var closeBtn = $(".modal__close", modal);
    if (closeBtn) closeBtn.focus();
  }
  function closeModal() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.style.overflow = "";
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }
  if (modal) {
    $all("[data-close]", modal).forEach(function (el) { el.addEventListener("click", closeModal); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModal(); });
  }

  /* ---------- Reveal on scroll ---------- */
  (function reveals() {
    var items = $all(".reveal");
    if (prefersReduced || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (el) {
      // Stagger siblings so groups animate in sequence, not all at once.
      var sibs = Array.prototype.filter.call(el.parentNode.children, function (c) {
        return c.classList && c.classList.contains("reveal");
      });
      el.style.transitionDelay = (Math.min(sibs.indexOf(el), 6) * 70) + "ms";
      io.observe(el);
    });
  })();

  /* ---------- Nav: sticky + mobile menu ---------- */
  (function nav() {
    var nav = $("#nav");
    var toggle = $("#nav-toggle");
    var links = $("#nav-links");
    var onScroll = function () { nav.classList.toggle("is-stuck", window.scrollY > 24); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if (toggle && links) {
      var setOpen = function (open) {
        links.classList.toggle("is-open", open);
        nav.classList.toggle("is-open", open);
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      };
      toggle.addEventListener("click", function () { setOpen(!links.classList.contains("is-open")); });
      $all("a", links).forEach(function (a) { a.addEventListener("click", function () { setOpen(false); }); });
    }
  })();

  /* ---------- Newsletter ---------- */
  (function newsletter() {
    var form = $("#newsletter-form");
    var status = $("#newsletter-status");
    var input = $("#email");
    if (!form) return;

    // If a provider form URL is configured, post straight to it in a new tab.
    if (SITE.newsletterAction) {
      form.action = SITE.newsletterAction;
      form.method = "post";
      form.target = "_blank";
      form.addEventListener("submit", function () {
        if (status) status.textContent = "Thanks! Check the new tab to confirm.";
      });
      return;
    }

    // Otherwise fall back to opening the visitor's email app.
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = (input && input.value || "").trim();
      if (!email || email.indexOf("@") < 1) { if (status) status.textContent = "Please enter a valid email address."; return; }
      var to = SITE.contactEmail || "hello@example.com";
      var subject = encodeURIComponent("Add me to the mailing list");
      var body = encodeURIComponent("Hi Michael,\n\nPlease add me to your mailing list: " + email + "\n\nThanks!");
      window.location.href = "mailto:" + to + "?subject=" + subject + "&body=" + body;
      if (status) status.textContent = "Opening your email app to finish signing up…";
      form.reset();
    });
  })();

  /* ---------- Footer social + year ---------- */
  (function footer() {
    var year = $("#year"); if (year) year.textContent = new Date().getFullYear();
    var wrap = $("#footer-social");
    if (wrap && Array.isArray(SITE.social)) {
      var links = SITE.social.filter(function (s) { return s && s.url; });
      if (links.length) {
        wrap.innerHTML = links.map(function (s) {
          return '<a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.label) + '</a>';
        }).join("");
      } else {
        wrap.innerHTML = '<a href="mailto:' + esc(SITE.contactEmail || "") + '">Get in touch</a>';
      }
    }
  })();

  /* ---------- Scroll progress bar ---------- */
  (function progress() {
    var bar = $("#progress");
    if (!bar) return;
    var update = function () {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var p = max > 0 ? h.scrollTop / max : 0;
      bar.style.width = (Math.max(0, Math.min(1, p)) * 100).toFixed(2) + "%";
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  })();

  /* ---------- Hero: pointer-reactive 3D book + parallax backdrop ---------- */
  (function heroFX() {
    var hero = $("#top");
    if (!hero || prefersReduced || !canHover) return;
    var inner = $("#hero-book .book3d__inner");
    var glow = $("#hero-glow");
    var grid = $("#hero-grid");
    if (!inner) return;

    var target = { rx: 4, ry: -24, gx: 0, gy: 0 };
    var cur = { rx: 4, ry: -24, gx: 0, gy: 0 };
    var raf = null, active = false;

    function loop() {
      cur.rx += (target.rx - cur.rx) * 0.08;
      cur.ry += (target.ry - cur.ry) * 0.08;
      cur.gx += (target.gx - cur.gx) * 0.08;
      cur.gy += (target.gy - cur.gy) * 0.08;
      inner.style.transform = "rotateY(" + cur.ry.toFixed(2) + "deg) rotateX(" + cur.rx.toFixed(2) + "deg)";
      if (glow) glow.style.transform = "translate(" + cur.gx.toFixed(1) + "px," + cur.gy.toFixed(1) + "px)";
      if (grid) grid.style.transform = "perspective(440px) rotateX(62deg) translateX(" + (cur.gx * 0.4).toFixed(1) + "px)";
      var settled = Math.abs(target.rx - cur.rx) < 0.01 && Math.abs(target.ry - cur.ry) < 0.01 &&
                    Math.abs(target.gx - cur.gx) < 0.1 && Math.abs(target.gy - cur.gy) < 0.1;
      raf = (settled && !active) ? null : requestAnimationFrame(loop);
    }
    function kick() { if (!raf) raf = requestAnimationFrame(loop); }

    // Take over the book transform once the entrance animation has finished.
    setTimeout(function () { inner.style.animation = "none"; }, 1750);

    hero.addEventListener("pointermove", function (e) {
      var r = hero.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      target.ry = -24 + px * 16;
      target.rx = 4 - py * 12;
      target.gx = -px * 26;
      target.gy = -py * 26;
      active = true; kick();
    });
    hero.addEventListener("pointerleave", function () {
      target.rx = 4; target.ry = -24; target.gx = 0; target.gy = 0;
      active = false; kick();
    });
  })();

  /* ---------- Cursor-following halo (with lag) ---------- */
  (function halo() {
    var el = $("#cursor-halo");
    if (!el || prefersReduced || !canHover) return;
    var tx = window.innerWidth / 2, ty = window.innerHeight / 2, x = tx, y = ty, raf = null;
    function loop() {
      x += (tx - x) * 0.12; y += (ty - y) * 0.12;
      el.style.transform = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px)";
      raf = (Math.abs(tx - x) > 0.5 || Math.abs(ty - y) > 0.5) ? requestAnimationFrame(loop) : null;
    }
    window.addEventListener("pointermove", function (e) {
      tx = e.clientX; ty = e.clientY;
      el.classList.add("is-on");
      if (!raf) raf = requestAnimationFrame(loop);
    });
  })();

  /* ---------- Scroll parallax (decorative layers) ---------- */
  (function parallax() {
    if (prefersReduced) return;
    var els = $all("[data-parallax]");
    if (!els.length) return;
    var ticking = false;
    function update() {
      var vh = window.innerHeight;
      els.forEach(function (el) {
        var r = el.getBoundingClientRect();
        var off = (r.top + r.height / 2 - vh / 2) / vh;
        var f = parseFloat(el.getAttribute("data-parallax")) || 0.15;
        el.style.transform = "translate3d(0," + (off * f * -120).toFixed(1) + "px,0)";
      });
      ticking = false;
    }
    window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener("resize", update);
    update();
  })();

  /* ---------- Hero lifts & fades on scroll ---------- */
  (function heroExit() {
    if (prefersReduced) return;
    var inner = $(".hero__inner");
    if (!inner) return;
    var ticking = false;
    function update() {
      var p = Math.min(1, window.scrollY / (window.innerHeight * 0.9));
      inner.style.transform = "translateY(" + (p * -60).toFixed(1) + "px)";
      inner.style.opacity = (1 - p * 0.9).toFixed(3);
      ticking = false;
    }
    window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  })();

  /* ---------- Stat count-up ---------- */
  (function counters() {
    var nums = $all("[data-count]");
    if (!nums.length) return;
    if (prefersReduced || !("IntersectionObserver" in window)) {
      nums.forEach(function (n) { n.textContent = n.getAttribute("data-count"); });
      return;
    }
    function run(el) {
      var target = parseInt(el.getAttribute("data-count"), 10) || 0;
      var dur = 1200, start = null;
      function step(ts) {
        if (start == null) start = ts;
        var p = Math.min(1, (ts - start) / dur);
        el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target);
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.5 });
    nums.forEach(function (n) { n.textContent = "0"; io.observe(n); });
  })();

})();
