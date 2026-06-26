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

  /* ---------- Intro overlay (animated book entrance) ---------- */
  function dismissIntro() { document.body.classList.add("intro-done"); }
  (function intro() {
    var el = $("#intro");
    if (!el || prefersReduced) { dismissIntro(); return; }
    // Remove from the DOM after the CSS animation has finished.
    setTimeout(dismissIntro, 3100);
    // Let an impatient visitor skip it.
    el.addEventListener("click", dismissIntro);
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

  /* ---------- Books grid ---------- */
  (function renderBooks() {
    var grid = $("#books-grid");
    if (!grid) return;
    if (!BOOKS.length) { grid.innerHTML = '<p style="color:var(--muted-dark)">Books coming soon.</p>'; return; }

    grid.innerHTML = BOOKS.map(function (b, i) {
      var soon = b.status === "coming-soon";
      return '' +
        '<article class="bookcard" tabindex="0" role="button" aria-label="More about ' + esc(b.title) + '" data-index="' + i + '">' +
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
    }).join("");

    $all(".bookcard", grid).forEach(function (card) {
      var open = function () { openModal(BOOKS[+card.getAttribute("data-index")]); };
      card.addEventListener("click", open);
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
      });
    });
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
    items.forEach(function (el) { io.observe(el); });
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

})();
