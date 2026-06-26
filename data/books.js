/* ============================================================================
 *  BOOKS  —  the only file you need to edit to add or update a book.
 * ============================================================================
 *
 *  HOW TO ADD A NEW BOOK (no coding needed):
 *
 *  1.  Copy one whole block below — from the "{" down to the "}," —
 *      and paste it as a new entry inside the [ square brackets ].
 *  2.  Change the text between the quotation marks "like this".
 *  3.  Put the book-cover image in the  assets/covers/  folder and point
 *      "cover" at it, e.g.  "cover": "assets/covers/my-new-book.jpg"
 *      (If you don't have a cover yet, use "assets/covers/placeholder.svg".)
 *  4.  Save the file. That's it — the website updates itself.
 *
 *  A full step-by-step walkthrough lives in  ADD-A-BOOK.md
 *
 *  Field reference:
 *    title        – the book's title
 *    series       – e.g. "A James Harland Thriller" (or leave as "")
 *    status       – "out-now"  OR  "coming-soon"
 *    featured     – true on the ONE book you want shown big in the hero.
 *                   Set every other book to false.
 *    releaseText  – free text shown to readers, e.g. "Out now" or "Spring 2027"
 *    cover        – path to the cover image inside assets/covers/
 *    tagline      – one punchy line shown under the title
 *    blurb        – the back-cover description (the main paragraph)
 *    quote        – an optional short pull-quote / hook (or "")
 *    buyLinks     – list of places to buy it. Add or remove as needed.
 *                   Leave the list empty  ( "buyLinks": []  )  for
 *                   coming-soon titles with nowhere to buy yet.
 * ========================================================================== */

window.BOOKS = [

  {
    title: "What Can't Be Unseen",
    series: "A James Harland Thriller — Book 1",
    status: "out-now",
    featured: true,
    releaseText: "Out now — published 15 June 2026",
    cover: "assets/covers/what-cant-be-unseen.jpg",
    tagline: "What if the cure was more dangerous than the disease?",
    blurb:
      "Dr James Harland is a brilliant NHS physician, until the night he fails to save a " +
      "young migrant woman in a London emergency department. When toxicology results reveal " +
      "an unknown pharmaceutical compound in her blood, the alarm bells start to ring — and " +
      "Harland is pulled into a world of organised crime, illegal drug testing and political " +
      "conspiracy. The deeper he looks, the more he understands why some things, once seen, " +
      "can never be unseen.",
    quote:
      "What if someone discovered a painkiller that worked perfectly — no addiction, no side " +
      "effects? And what would they do to the people in the way of making it?",
    buyLinks: [
      // Replace the "#" with the real product links when you have them.
      { label: "Buy on Amazon", url: "https://www.amazon.co.uk/s?k=What+Can%27t+Be+Unseen+Michael+Crisp" },
      { label: "Foreshore Publishing", url: "https://foreshorepublishing.com/" }
    ]
  },

  {
    title: "The Shadow Helix",
    series: "Michael Crisp",
    status: "coming-soon",
    featured: false,
    releaseText: "In progress — coming soon",
    cover: "assets/covers/the-shadow-helix.svg",
    tagline: "The next novel from Michael Crisp.",
    blurb:
      "Michael's next novel is already taking shape. More details — and a cover — will be " +
      "revealed here soon. Join the mailing list below to be the first to hear.",
    quote: "",
    buyLinks: []
  }

  // ── To add another book, copy a block above and paste it here ──
  // ,{
  //   title: "Your New Book",
  //   series: "A James Harland Thriller — Book 2",
  //   status: "coming-soon",
  //   featured: false,
  //   releaseText: "Coming 2027",
  //   cover: "assets/covers/placeholder.svg",
  //   tagline: "One line to hook the reader.",
  //   blurb: "The back-cover description goes here.",
  //   quote: "",
  //   buyLinks: []
  // }

];

/* ============================================================================
 *  SITE SETTINGS  —  small bits used across the page. Edit freely.
 * ========================================================================== */
window.SITE = {
  authorName: "Michael Crisp",

  // The mailing-list form. Two easy options:
  //   1. Leave this as "" and the form will open the visitor's email app
  //      addressed to the address in `contactEmail` below (works instantly).
  //   2. Paste a Mailchimp / Substack / Beehiiv form "action" URL here to
  //      collect addresses properly. (See README.md → Newsletter.)
  newsletterAction: "",

  // Used for the email-app fallback above and the "Get in touch" link.
  contactEmail: "hello@michaelcrispbooks.uk",

  // Social / external links. Delete a line to hide that icon, or change the url.
  social: [
    { label: "Instagram", url: "" },
    { label: "Facebook",  url: "" },
    { label: "X",         url: "" },
    { label: "Goodreads", url: "" }
  ]
};
