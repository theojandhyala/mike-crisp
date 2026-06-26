# Deploy a zero-build static site (GitHub Pages)

Static `index.html` at the repo root → free hosting, instant rebuilds on push.

## Prep
- **Relative asset paths** (`css/styles.css`, `assets/…`) — never leading `/` — so it works
  under a project subpath (`user.github.io/repo/`).
- Add an empty **`.nojekyll`** file at the root (stop Jekyll from touching the files).
- Verify with screenshots first (see quality-checklist.md).

## ⚠️ The gotcha that wastes the most time
**An automated agent / `GITHUB_TOKEN` cannot turn Pages ON.** Attempting it fails with
`Resource not accessible by integration` or `Get Pages site failed: Not Found`. Enabling
Pages is a one-time **human** action in the repo UI. So: build + push everything, then ask the
owner to flip the switch, then trigger/confirm the deploy. Don't loop on re-runs expecting it
to self-enable.

### Owner's one-time step (pick one)
- **GitHub Actions source (use with the workflow below):** Settings → Pages → Build and
  deployment → **Source: GitHub Actions**. Then re-run the workflow (`workflow_dispatch`).
- **Branch source (no workflow needed):** Settings → Pages → Source: **Deploy from a branch**
  → pick the branch + `/(root)` → Save. Serves the repo root directly. A green
  "✓ Your site is live at…" box confirms it.

Both auto-republish on future pushes. The site lives at `https://<owner>.github.io/<repo>/`.

## Workflow (`.github/workflows/deploy.yml`) for the GitHub-Actions source
```yaml
name: Deploy site to GitHub Pages
on:
  push: { branches: [ "YOUR_BRANCH" ] }
  workflow_dispatch:
permissions: { contents: read, pages: write, id-token: write }
concurrency: { group: "pages", cancel-in-progress: true }
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: { name: github-pages, url: "${{ steps.deployment.outputs.page_url }}" }
    steps:
      - uses: actions/checkout@v4
      - run: |                       # assemble only the site files (keeps .git/.github private)
          mkdir -p _site
          cp index.html .nojekyll _site/
          cp -r css js data assets _site/
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with: { path: "_site" }
      - id: deployment
        uses: actions/deploy-pages@v4
```
Note: writing a workflow file via the API/git may require the token to hold the `workflow`
scope; the GitHub MCP `create_or_update_file` usually can. Confirm a run's
`conclusion: success` before telling the owner it's live.

## Alternatives
- **Cloudflare Pages / Netlify:** new project → connect repo → empty build command, output =
  repo root. Same relative-path + `.nojekyll` rules apply.
- **Custom domain:** add it in the host's Pages/domain settings and update DNS as instructed.
