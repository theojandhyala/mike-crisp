# Michael Crisp — author website

A modern, fast website for author **Michael Crisp** and his debut medical
thriller **_What Can't Be Unseen_** (a James Harland novel).

It's built as a plain, dependency-free website — just HTML, CSS and a little
JavaScript. There is **no build step and nothing to install**: you can open
`index.html` straight in a browser, and it can be hosted for free almost
anywhere.

> ✨ **Want to add a new book?** It's the most common job, so it has its own
> short guide: **[ADD-A-BOOK.md](ADD-A-BOOK.md)**. (Edit one file, no coding.)

---

## What's on the site

- An animated **book entrance** when the page loads, then a 3D book in the hero.
- **The Story** — the premise of _What Can't Be Unseen_.
- **Books** — every title, generated automatically from `data/books.js`.
  Click any cover for the full blurb and buy links.
- **About Michael** — the author bio.
- **Newsletter** sign-up and social links.
- Fully responsive (looks great on phones) and respects “reduce motion”
  accessibility settings.

---

## The files

```
index.html              The page itself (text/content lives here)
css/styles.css          All the styling and animation
js/main.js              Makes the page interactive (you rarely touch this)
data/books.js           ← THE BOOK LIST. Edit this to add/update books.
assets/covers/          Book cover images go here
assets/                 Favicon + author photo
ADD-A-BOOK.md           Step-by-step: how to add a book
```

**The two files you'll actually edit:**
1. `data/books.js` — to add or change **books**, social links and the newsletter.
2. `index.html` — to change the **About text**, the headings, or the wording.

---

## Common changes

### Add or edit a book
See **[ADD-A-BOOK.md](ADD-A-BOOK.md)**.

### Change the author photo
The current photo is `assets/michael-crisp.jpg`. To swap it, drop a new photo
into the `assets/` folder and, in `index.html`, change `assets/michael-crisp.jpg`
to your new file name.

### Change the About / bio text
In `index.html`, find the `<!-- ABOUT -->` section and edit the paragraphs.

### Newsletter sign-ups
Open `data/books.js` and look at the `SITE` block near the bottom:

- **Easiest (works now):** leave `newsletterAction` empty. When a visitor signs
  up, their email app opens with a pre-filled message to `contactEmail`.
- **Proper mailing list:** paste your Mailchimp / Substack / Beehiiv form
  address into `newsletterAction`, e.g.
  `newsletterAction: "https://your-name.us1.list-manage.com/subscribe/post"`.

### Social links
Also in the `SITE` block in `data/books.js` — add a URL to any platform to make
its link appear in the footer. Delete a line to hide it.

---

## Viewing it on your computer

Just double-click `index.html` to open it in your browser — that's enough to
see everything.

(If you prefer a local web server: from this folder run
`python3 -m http.server` and visit `http://localhost:8000`.)

---

## Putting it online (free options)

This is a static site, so any of these work — no server needed:

- **GitHub Pages:** push this repo to GitHub, then in the repo go to
  **Settings → Pages**, choose the branch, and save. Your site goes live at a
  `github.io` address. You can then point `michaelcrispbooks.uk` at it.
- **Cloudflare Pages** or **Netlify:** create a project, connect this repo,
  and leave the build command empty / output directory as the project root.

To use the custom domain **michaelcrispbooks.uk**, add it as a custom domain in
whichever host you choose and update the DNS as they instruct.

---

## Notes

- The site uses the **real book cover** (`assets/covers/what-cant-be-unseen.jpg`)
  and a **real author photo** (`assets/michael-crisp.jpg`). The whole colour
  scheme (toxic green + red danger accent) is drawn from the cover, so the brand
  stays consistent. _The Shadow Helix_ still uses a placeholder cover until its
  artwork exists — drop the real one into `assets/covers/` and update the path.
- The Amazon link in `data/books.js` currently points to an Amazon search for
  the title — swap it for the exact product page when you have the link.
- Book details were compiled from public information about the launch; please
  review the wording in `data/books.js` and `index.html` and adjust anything
  you'd like to phrase differently.
