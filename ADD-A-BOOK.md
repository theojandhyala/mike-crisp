# How to add a new book 📖

You don't need to know any code. Adding a book takes about two minutes.

There is **one file** to edit: `data/books.js`

---

## Step 1 — Add the cover image

1. Save your cover picture (a `.jpg` or `.png`) into the folder
   **`assets/covers/`**.
2. Give it a simple name with no spaces, e.g. `the-shadow-helix.jpg`.

> No cover yet? Skip this step — you can use the built-in placeholder for now.

---

## Step 2 — Open `data/books.js`

Open the file `data/books.js` in any text editor (even Notepad works).

You'll see blocks that look like this, one for each book:

```js
{
  title: "What Can't Be Unseen",
  series: "A James Harland Thriller — Book 1",
  status: "out-now",
  featured: true,
  releaseText: "Out now — published 15 June 2026",
  cover: "assets/covers/what-cant-be-unseen.svg",
  tagline: "A debut medical thriller...",
  blurb: "Dr James Harland is a brilliant NHS physician...",
  quote: "What if someone discovered a painkiller...",
  buyLinks: [
    { label: "Buy on Amazon", url: "https://..." },
    { label: "Foreshore Publishing", url: "https://..." }
  ]
},
```

---

## Step 3 — Copy a block and change the words

1. Highlight one whole block — from the `{` down to the matching `},` —
   and **copy/paste it** to make a new one.
2. Change the text **between the quotation marks** to your new book's details.
3. Make sure the `cover:` line points to your image from Step 1, e.g.
   `cover: "assets/covers/the-shadow-helix.jpg",`

### What each line means

| Line | What to put |
|------|-------------|
| `title` | The book's title |
| `series` | e.g. `"A James Harland Thriller — Book 2"` (or leave empty `""`) |
| `status` | `"out-now"` if people can buy it, or `"coming-soon"` |
| `featured` | `true` for the **one** book shown big at the top. Set all others to `false`. |
| `releaseText` | Free text, e.g. `"Out now"` or `"Coming Spring 2027"` |
| `cover` | The path to your cover image |
| `tagline` | One short, punchy line |
| `blurb` | The back-cover description |
| `quote` | An optional hook/quote (leave as `""` if none) |
| `buyLinks` | Where to buy it. Use `buyLinks: []` if there's nowhere to buy yet. |

---

## Step 4 — Save, and you're done ✅

Save the file. The website updates itself — the new book appears in the
**Books** section automatically.

If you want the new book to be the big featured one at the top, set its
`featured` to `true` **and** set the old featured book's `featured` to `false`.

---

## A few golden rules

- Keep every `"`, `,` and `}` exactly where they are — they hold the structure together.
- Always have a comma `,` **between** book blocks, but **not** after the very last one.
- If something looks broken after editing, undo your change (Ctrl+Z) and try again.

Need anything else changed (the About text, photo, links)? See `README.md`.
