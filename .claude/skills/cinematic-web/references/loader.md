# Cinematic loader (count-up → curtain wipe)

Plays once on load: a mark animates, a number counts 0→100 with a progress bar and a
scan sweep, then the overlay wipes up to reveal the page. Has a CSS-only safety net so it
can never trap the page if JS fails, and is skipped entirely under `prefers-reduced-motion`.

## HTML (first element in `<body>`)
```html
<div class="intro" id="intro" aria-hidden="true">
  <span class="intro__scan"></span>
  <div class="intro__center">
    <p class="intro__word">BRAND NAME</p>
    <p class="intro__sub">Tagline or product</p>
  </div>
  <div class="intro__count"><span id="intro-count">0</span><i>%</i></div>
  <div class="intro__bar"><span class="intro__fill" id="intro-fill"></span></div>
</div>
```
Add a `<noscript><style>.intro{display:none!important}</style></noscript>` in `<head>`.

## CSS
```css
.intro { position: fixed; inset: 0; z-index: 1000; overflow: hidden;
  background: radial-gradient(70% 70% at 50% 42%, #16241c, var(--ink) 78%);
  transition: transform .8s cubic-bezier(.7,0,.2,1);
  animation: introFailsafe 0s linear 6s forwards; }   /* safety net */
.intro--out { transform: translateY(-100%); }
body.intro-done .intro { display: none; }
@keyframes introFailsafe { to { opacity: 0; visibility: hidden; pointer-events: none; } }
.intro__center { position: absolute; inset: 0; display: grid; place-content: center; justify-items: center; gap: 1.3rem; }
.intro__word { font-family: var(--display); font-weight: 700; font-size: 1.7rem; color: var(--text); margin: 0;
  opacity: 0; animation: fadeUp .8s var(--ease) .65s forwards; }
.intro__sub { font-family: var(--mono); font-size: .72rem; letter-spacing: .32em; text-transform: uppercase;
  color: var(--accent); margin: 0; opacity: 0; animation: fadeUp .8s var(--ease) .9s forwards; }
.intro__count { position: absolute; right: 6vw; bottom: 6vh; font-family: var(--display); font-weight: 800;
  font-size: clamp(3rem,12vw,8rem); line-height: 1; color: var(--text); letter-spacing: -.03em; }
.intro__count i { font-style: normal; color: var(--accent); font-size: .35em; vertical-align: super; }
.intro__bar { position: absolute; left: 0; bottom: 0; width: 100%; height: 3px; background: rgba(255,255,255,.07); }
.intro__fill { display: block; height: 100%; width: 0; background: linear-gradient(90deg, var(--accent), #c2f57a); box-shadow: 0 0 12px rgba(132,194,58,.8); }
.intro__scan { position: absolute; left: 0; right: 0; top: 0; height: 2px; pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(132,194,58,.85), transparent); filter: blur(1px);
  animation: introScan 2.1s var(--ease) infinite; }
@keyframes introScan { 0%{top:0;opacity:0} 12%{opacity:1} 88%{opacity:1} 100%{top:100%;opacity:0} }
@keyframes fadeUp { from { opacity:0; transform: translateY(12px) } to { opacity:1; transform:none } }
@media (prefers-reduced-motion: reduce) { .intro { display: none; } }
```

## JS
```js
(function () {
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var el = document.getElementById("intro");
  var done = function () { document.body.classList.add("intro-done"); };
  if (!el || reduce) { done(); return; }
  var count = document.getElementById("intro-count"), fill = document.getElementById("intro-fill");
  var start = null, dur = 1900, wiped = false;
  function wipe() { if (wiped) return; wiped = true; el.classList.add("intro--out"); setTimeout(done, 850); }
  (function step(ts) { if (start == null) start = ts; var p = Math.min(1, (ts - start) / dur), v = Math.round(p * 100);
    if (count) count.textContent = v; if (fill) fill.style.width = v + "%";
    if (p < 1) requestAnimationFrame(step); else setTimeout(wipe, 280); })(performance.now());
  el.addEventListener("click", wipe); // let an impatient visitor skip
})();
```
