# Quality bar + polish loop + verification

## The 8 pillars — grade every section against these
1. **Point of view** — is the brand voice consistent and specific? One clear idea.
2. **Typography** — distinctive pairing, no generic system fonts; deliberate scale/weight.
3. **Hierarchy** — size and weight lead the eye; one focal point per section.
4. **Imagery** — real, on-brand assets (or tasteful generated/SVG placeholders that look intentional).
5. **Motion** — subtle, physical, cursor/parallax/lag; never noisy; honours reduced-motion.
6. **Mobile** — a *dedicated* pass: reorder/collapse for touch, not just a shrink.
7. **Invisible quality** — clean, fast, zero-dep, accessible (focus states, contrast, alt text, noscript).
8. **Copy** — restrained, sensory, the owner's real words. No AI fluff, no invented stats/testimonials.

## Iterative polish loop (don't fix one-by-one)
1. **Grade yourself:** "Where does this land against each of the 8 pillars?"
2. **Batch the fixes:** "The lower sections feel generic — not busier, just *more expensive*.
   Propose a batch of micro-interaction + spacing fixes." Apply them together.
3. **Refine intent, not just output:** if motion feels noisy, say "make it more subtle and add a
   lag to the halo" rather than deleting it.

## Verification — drive the real page, look at it
The cloud env ships Chromium; install `playwright-core` and point `executablePath` at it.
```js
const { chromium } = require('playwright-core');
const EXE = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'; // glob /opt/pw-browsers/chromium*/chrome-linux/chrome
// serve the folder over http (a tiny node static server), then:
const b = await chromium.launch({ executablePath: EXE, args: ['--no-sandbox'] });
const p = await (await b.newContext({ viewport: { width: 1366, height: 900 } })).newPage();
p.on('pageerror', e => console.log('PAGEERROR', e.message));
await p.goto('http://localhost:PORT/', { waitUntil: 'networkidle' });
await p.waitForTimeout(3500);                       // let the loader finish
await p.screenshot({ path: 'hero.png' });
await p.mouse.move(1080, 320);                       // trigger pointer tilt/halo
await p.screenshot({ path: 'hero-tilt.png' });
// scroll to each section id to trigger reveals (full-page shots don't fire IntersectionObserver):
for (const id of ['story','work','about','contact']) {
  await p.evaluate(i => document.getElementById(i).scrollIntoView({ block: 'start' }), id);
  await p.waitForTimeout(800); await p.screenshot({ path: `sec-${id}.png` });
}
// repeat at 390px width for mobile.
```
Read the screenshots. Check: no `PAGEERROR`; reveals actually showed; mobile reorders; modal opens.

Notes
- Google Fonts may be blocked inside the sandbox — local screenshots show fallback fonts; the
  real faces load on the deployed site. Don't be alarmed by fallback type in test shots.
- A full-page screenshot won't trigger scroll reveals — scroll to each section to verify content.
