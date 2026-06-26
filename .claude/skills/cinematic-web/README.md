# cinematic-web — install into your other apps

This is a portable Claude Code **skill** that carries the "alive, modern, cinematic"
website build approach across sessions and projects (Cast, Deadset, anything).

## Install it where it's useful

**Per project** (recommended — travels with the repo, works in cloud sessions):
```bash
# from the other app's repo root
mkdir -p .claude/skills
cp -R /path/to/cinematic-web .claude/skills/cinematic-web
git add .claude/skills/cinematic-web && git commit -m "Add cinematic-web skill"
```

**Globally for your machine** (available in every local Claude Code session):
```bash
mkdir -p ~/.claude/skills
cp -R /path/to/cinematic-web ~/.claude/skills/cinematic-web
```

Don't have the folder locally? Copy it out of the `mike-crisp` repo
(`.claude/skills/cinematic-web/`), or in a cloud session on that repo, zip and download it.

## Use it
Once installed, in a session for that app just ask for the work
("build a cinematic landing page", "restyle the hero, make it premium") — the skill is
matched by its description and pulls in the design system, motion module, loader,
quality checklist and deploy recipe. Or invoke it explicitly: `/cinematic-web`.

## What's inside
- `SKILL.md` — principles + workflow + when to use.
- `references/design-system.css` — tokens, type, buttons, sections, reveals, reduced-motion.
- `references/motion.js` — reveals, 3D tilt, parallax, cursor-halo, progress, count-up, colour-flood, nav.
- `references/loader.md` — cinematic count-up + curtain-wipe loader.
- `references/quality-checklist.md` — the 8-pillar bar, polish loop, Playwright verification.
- `references/deploy-github-pages.md` — zero-build deploy + the "a bot can't enable Pages" gotcha.
