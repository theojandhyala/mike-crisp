---
name: cinematic-web
description: Build alive, modern, cinematic marketing / landing / author / product / portfolio websites as zero-build static sites (HTML + CSS + vanilla JS). Use whenever creating or restyling a brand, landing, hero, author, book, product or portfolio page that should feel premium and animated. Covers a design-token system, distinctive type pairings (no generic Inter), a motion toolkit (cinematic loader, staggered scroll reveals, 3D pointer-tilt, parallax, lag cursor-halo, scroll colour-flood), data-driven content you can extend by editing one file, an 8-pillar quality bar with an iterative polish loop, Playwright screenshot verification, and a GitHub Pages deploy recipe (including the "a bot can't enable Pages" gotcha).
---

# Cinematic Web

A repeatable recipe for building sites that feel **alive, modern and cinematic** — the
kind that look like a £10k design studio made them, not a template. Everything here is
**zero-build**: plain `index.html` + `css/styles.css` + `js/main.js`, deployable free on
GitHub Pages / Cloudflare Pages / Netlify and openable by double-clicking the file.

Use the `references/` files as ready-to-adapt building blocks — copy them in, then retune
the palette and copy to the brand.

## Operating principles

1. **Taste comes from constraint, not effects.** A tight token system + one strong type
   pairing + restrained motion beats a pile of animations. Decide the palette and fonts
   first; derive the accent colour from the brand's real asset (a book cover, logo,
   product shot), not a guess.
2. **No generic fonts.** Never ship Inter/Arial/system defaults as the brand voice. Pair a
   characterful display face with a clean body face and a mono for HUD labels. Good
   Google-Fonts picks: display = Bricolage Grotesque / Fraunces / Clash-style grotesques;
   body = Hanken Grotesk / Schibsted Grotesk; mono = Space Mono / IBM Plex Mono.
3. **Motion is subtle and physical.** Prefer cursor-follow + parallax + lag/lerp easing
   over loud entrances. Everything gates on `prefers-reduced-motion` and `(hover: hover)`.
4. **Content is data-driven.** Put the things that change (products, books, posts) in one
   well-commented data file (`window.DATA = [...]`) so a non-technical owner can extend it.
   Use a plain `.js` file assigning a global — works from `file://` with no server/build.
5. **Verify by screenshot, not by faith.** Drive the page with Playwright/Chromium and
   look at it (desktop + mobile + a scrolled section) before claiming it works.
6. **Ship it.** Wire a deploy and hand back a live URL.

## Workflow

1. **Gather the brand truth.** Real copy, real images, real colours. If the live site
   blocks scraping, search for the content or ask the owner to paste it — don't invent
   marketing fluff ("years on the wards", "written from the inside"). Owners notice.
2. **Lay tokens + type** from `references/design-system.css`. Derive `--accent` from the
   brand asset; set a dark base + one or two warm/contrast tones so it isn't miserable.
3. **Structure the page**: sticky translucent nav · hero (the one big moment) · 2–4 content
   sections · a data-driven grid · about · newsletter/CTA · footer. One idea per section.
4. **Layer motion** from `references/motion.js` and `references/loader.md`: loader →
   reveals → tilt → parallax → cursor-halo → optional scroll colour-flood.
5. **Grade and polish** against `references/quality-checklist.md` (the 8 pillars). Do a
   *batch* of "make it more expensive" fixes, not one-offs.
6. **Verify** with the Playwright recipe in the checklist file (desktop, mobile, a
   scrolled section, any modal).
7. **Deploy** with `references/deploy-github-pages.md`. Mind the gotcha: an automated agent
   **cannot flip the Pages "on" switch** — the repo owner must set Settings → Pages →
   Source once. Use relative asset paths and add `.nojekyll` so it serves under a subpath.

## Reference files

- `references/design-system.css` — tokens, reset, buttons, section primitives, reveals,
  responsive + reduced-motion. Start here.
- `references/motion.js` — the vanilla JS motion module: staggered blur reveals,
  pointer 3D tilt, scroll parallax, lag cursor-halo, scroll progress, count-up,
  scroll colour-flood, sticky/mobile nav. All guarded for reduced-motion / touch.
- `references/loader.md` — the cinematic count-up + curtain-wipe loader (HTML/CSS/JS),
  with a JS-failure safety net.
- `references/quality-checklist.md` — the 8-pillar bar, the iterative polish loop, and the
  Playwright screenshot-verification recipe (uses the pre-installed Chromium).
- `references/deploy-github-pages.md` — zero-build static deploy + the Pages-enable gotcha.

## Anti-patterns (don't)

- Don't add a framework/build step for a brochure site. Static wins on speed and longevity.
- Don't animate content that's then invisible without JS — add a `<noscript>` fallback that
  forces `.reveal { opacity: 1 }`.
- Don't fabricate copy, stats or testimonials. Use the owner's real words.
- Don't ship neon-on-white low-contrast text; keep body text ≥ 4.5:1.
- Don't forget the loader/overlay can trap the page — always give it a CSS-only timeout.
