# On Purpose — Optimisation Action Plan

*Written 8 August 2026 after a full review of the codebase. Every item below was
either confirmed as within the existing brief, or explicitly approved by Tim in
conversation on this date. The decisions are made; this document is for
execution.*

---

## How to use this document

- **One task per session, one task per pull request.** This is a hard project
  convention (see CLAUDE.md → Working conventions). Do not batch tasks.
- Read `CLAUDE.md` in full before starting any task. It is the project's
  constitution and overrides instinct.
- Each task below is self-contained: goal, files, steps, acceptance checks, and
  the CLAUDE.md lines to update when done. Assume no memory of any other task.
- Write each PR description in plain English for a non-developer.

### Recommended executing model

**Claude Sonnet 5 (`claude-sonnet-5`) for all tasks.** The tasks are fully
specified, but several (fonts, RSS, read-time) require verifying behaviour
across two render targets (website + email) and judgment when reality differs
slightly from the spec. Sonnet is the value sweet spot for that.
Tasks 5, 7 and 8 are mechanical enough for **Haiku 4.5
(`claude-haiku-4-5-20251001`)** if cost matters more than convenience.
Opus/Fable-class models are not needed — the thinking is done.

### Hard guardrails for every task

1. **Never touch essay prose, hooks, preview lines, or any authored text.** If
   a task seems to need new wording, stop and flag it for Tim instead.
2. **No new npm dependencies.** Everything below is achievable without one.
3. **Do not redesign anything.** Palette, type, layout are signed off and fixed.
4. **Do not refactor the email template** or `lib/render-email.js` styling
   decisions — they encode hard-won dark-mode testing (CLAUDE.md → Email rules).
5. Absolute URLs must come from `site.baseUrl` — never hard-code the
   `netlify.app` domain.
6. After each task, run `npm run build` and confirm it succeeds; for anything
   touching `lib/`, also run `npm run email` and eyeball `dist/email/*.html`.

---

## Task 1 — Self-host the fonts *(highest impact)*

**Approved by Tim: yes — self-host, typefaces unchanged.**

**Why.** Every page currently render-blocks on a Google Fonts stylesheet
declaring 30 font files across two extra origins. Self-hosting removes the
third-party dependency, speeds first render, and improves reader privacy. The
typefaces, weights and appearance must not change.

**What the design actually uses** (verified against `src/css/style.css`):

| Family | Styles needed |
|---|---|
| DM Serif Display | 400 roman + 400 italic |
| Newsreader | roman + italic (variable, optical size axis; body runs at 19px weight 400) |
| Plus Jakarta Sans | 400, 500, 600, 700 — roman only (italic is currently browser-synthesised; keep it that way) |

**Steps.**

1. Fetch Google's CSS with a modern browser User-Agent so it serves woff2:
   `curl -s "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Newsreader:ital,opsz,wght@0,6..72,300..600;1,6..72,300..500&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"`
2. From that CSS take **only the `latin` subset** `@font-face` blocks (skip
   latin-ext, vietnamese, etc. — the site is English). Download each latin
   woff2 file into `src/static/fonts/` with clear names, e.g.
   `dm-serif-display-italic.woff2`, `newsreader-roman.woff2`,
   `plus-jakarta-sans-600.woff2`. Expect roughly 8 files.
3. Add the corresponding `@font-face` rules at the **top** of
   `src/css/style.css`, copying Google's descriptors (`font-family`,
   `font-style`, `font-weight` ranges, `unicode-range`) exactly, changing only
   the `src` to `/fonts/<file>.woff2` and keeping `font-display: swap`.
   Family names must match the existing `--display`/`--ui`/`--prose` tokens
   verbatim so no other CSS changes.
4. In `src/_includes/layouts/base.njk`, delete the two `preconnect` links and
   the `fonts.googleapis.com` stylesheet link. Add instead a preload for the
   two above-the-fold files:
   `<link rel="preload" href="/fonts/<dm-serif-roman>.woff2" as="font" type="font/woff2" crossorigin>`
   and the same for the Plus Jakarta Sans 400 file.
5. Add long-lived caching in `src/headers.njk` (outside the `hideFromSearch`
   conditional): a `/fonts/*` block with
   `Cache-Control: public, max-age=31536000, immutable`. Fonts never change;
   if one ever must, it gets a new filename.

**Accept when:** `npm run build` passes; serving `_site` locally shows every
page renders with the correct three typefaces; the built HTML contains no
reference to `googleapis` or `gstatic` (`grep -r gstatic _site` is empty);
italic renders in the hero `em`, CTA `em` and essay sign-off; `_site/_headers`
contains the fonts cache block.

**CLAUDE.md updates:** in Repo facts, note fonts are self-hosted from
`/fonts/` and the folder layout gained `src/static/fonts/`.

---

## Task 2 — Favicon from Tim's photo

**Approved by Tim: yes — use the photo, not a lettermark.**

**Why.** No favicon exists: tabs show a blank icon and every visit logs a
failed `/favicon.ico` request.

**Steps.**

1. From `src/static/tim.jpg` (400×400) generate, using Python/PIL or
   ImageMagick in-session (do **not** add build-time tooling; commit the
   binaries):
   - `src/static/favicon.ico` — 32×32 (may embed 16×16 too), square crop.
   - `src/static/icon-192.png` and `src/static/icon-512.png` — square.
   - `src/static/apple-touch-icon.png` — 180×180, square, no rounding (iOS
     rounds corners itself).
   Keep the photo as-is otherwise: square crops, no circular masking, no
   borders, no recolouring.
2. In `base.njk` `<head>` add:
   `<link rel="icon" href="/favicon.ico" sizes="32x32">`,
   `<link rel="icon" href="/icon-192.png" type="image/png" sizes="192x192">`,
   `<link rel="apple-touch-icon" href="/apple-touch-icon.png">`.

**Accept when:** build passes; the four files land at the site root in
`_site/`; total added weight is under ~60KB; a local page shows the icon in
the tab.

**CLAUDE.md updates:** the "No images" paragraph should note the favicon set
(derived from `tim.jpg`) as the second sanctioned use of the photo.

---

## Task 3 — Social share (Open Graph) tags

**Approved by Tim: yes — include his photo in the card.**

**Why.** Essay links pasted into LinkedIn/WhatsApp/Slack currently show a bare
URL. For a newsletter that grows by forwarding, preview cards matter.

**Steps.** All in `src/_includes/layouts/base.njk` `<head>`, after the
canonical link:

1. Always: `og:site_name` = `site.wordmark`; `og:title` = the already-computed
   `pageTitle`; `og:description` = same value as the meta description
   (`pageDescription` else `site.description`); `og:url` =
   `{{ site.baseUrl }}{{ page.url }}`; `og:type` = `article` when
   `pageKind == 'essay'`, else `website`.
2. Image tags, only when `site.photo` is set (mirror the `face.njk` pattern —
   clearing `photo` must cleanly remove them): `og:image` =
   `{{ site.baseUrl }}{{ site.photo }}`, `og:image:width`/`height` = `400`,
   `og:image:alt` = `site.author`; `twitter:card` = `summary`.
3. Do not invent descriptions — every value above already exists in config or
   front matter.

**Accept when:** build passes; an essay page's HTML contains `og:` tags with
the essay title and hook and an **absolute** image URL; the welcome/404 pages
fall back to the site description; setting `"photo": ""` in `content/site.json`
and rebuilding removes all image/twitter tags (then restore it).

**CLAUDE.md updates:** none required beyond the facts section if it lists head
contents.

---

## Task 4 — RSS feed

**Approved by Tim: yes.** (This closes the "does the site need RSS" open
question in CLAUDE.md.)

**Steps.**

1. Create `src/feed.njk` — front matter `permalink: /feed.xml` and
   `eleventyExcludeFromCollections: true` — hand-writing an **Atom** feed over
   the `essays` data (no plugin; no new dependency). Structure:
   - Feed `title` = `site.wordmark`, `subtitle` = `site.description`,
     `id`/`link` from `site.baseUrl`, self link to `/feed.xml`, `updated` =
     newest essay date, author = `site.author`.
   - One `entry` per essay: title, `link`/`id` =
     `{{ site.baseUrl }}/essays/{{ slug }}/`,
     `published`/`updated` = the essay date with `T00:00:00Z` appended,
     `summary` = the hook, and full `content type="html"` = the pre-rendered
     `essay.body` (it is already HTML — escape it for XML, e.g. via the
     Nunjucks `e`/escape filter inside the content element).
   - Mind whitespace: the XML declaration must be the first bytes of the file.
2. Add `<link rel="alternate" type="application/atom+xml" title="{{ site.wordmark }}" href="/feed.xml">`
   to `base.njk` `<head>`.

**Accept when:** build passes; `_site/feed.xml` exists, starts with
`<?xml`, contains four entries newest-first with absolute URLs only, and
parses (e.g. `python3 -c "import xml.dom.minidom,sys;xml.dom.minidom.parse('_site/feed.xml')"`).

**CLAUDE.md updates:** remove the RSS line from Open questions; add `/feed.xml`
to the URLs table.

---

## Task 5 — Enforce hand-written `previewText`

**Approved by Tim: yes — the build should fail if it's missing.**

**Steps.**

1. In `lib/essays.js`: add `"previewText"` to `REQUIRED`, and change the
   mapping to `previewText: data.previewText` (delete the fallback chain).
   **Leave `emailHook: data.emailHook || data.hook` exactly as is** — that
   fallback is deliberate and documented.
2. All four current essays already carry `previewText`, so the build keeps
   passing. In three of them (002, 003, 004) it is byte-identical to `hook` —
   **do not rewrite these; flag them in the PR description** for Tim to author
   distinct preview lines himself. Authored text is his alone.
3. Verify the failure mode: temporarily blank `previewText` in one essay,
   confirm the build stops with a message naming the file and stating the fix
   in a sentence (match the tone of the existing validation errors), restore.

**Accept when:** build passes with current content; the temporary-removal test
produced a plain-English build failure; no essay file is otherwise modified.

**CLAUDE.md updates:** front-matter table — `previewText` becomes required
with no fallback; delete contradiction #2 under "Where things contradict the
decisions above".

---

## Task 6 — Calculate `readTime` from word count

**Approved by Tim: yes — calculated, hand-override allowed.**

**Steps.**

1. In `lib/essays.js`: remove `"readTime"` from `REQUIRED`. Compute a word
   count over the essay's blocks — markdown and quote blocks contribute
   `block.text`, figure blocks contribute their cells joined — splitting on
   whitespace. Then:
   `readTime = data.readTime !== undefined ? Number(data.readTime) : Math.max(1, Math.round(words / 160))`.
   160 wpm is deliberate — these are reflective essays, and 160 keeps the
   calculated values close to the numbers Tim was choosing by hand (verified:
   at 160 wpm the four essays compute to 4, 6, 6, 4 minutes against authored
   5, 6, 6, 5).
2. Delete the `readTime` line from the front matter of all four essays in
   `content/essays/` (front matter is config, not prose — this is allowed).
   Touch nothing else in those files.
3. The value flows through the shared loader, so the site pages
   (`essay.njk`, `card.njk`, `lead.njk`) and the email (`head.njk`) all pick
   it up with no template changes. Confirm via `npm run build` and
   `npm run email` that "min read" renders as a sane number everywhere.

**Accept when:** build and email build pass; essay pages show 4/6/6/4 min for
essays 001–004; adding `readTime: 9` to one essay's front matter overrides the
calculation (test, then remove).

**CLAUDE.md updates:** front-matter table — `readTime` becomes optional,
"calculated at 160 wpm from the body, hand-override wins"; remove the readTime
line from Open questions and observation #8.

---

## Task 7 — Lock the five topics in code

**No approval needed — CLAUDE.md already decides this ("Topics are fixed at
five. Do not make them extensible."); the code just doesn't enforce it.**

**Steps.**

1. In `lib/site.js`, after loading, validate that the keys of `site.topics`
   are exactly `work, coaching, career, fathering, offclock` — no more, no
   fewer, no renames. On mismatch, fail the build with a plain-English message
   stating which key is unexpected or missing and that the five topics are
   fixed by design.

**Accept when:** build passes; temporarily adding a sixth topic to
`content/site.json` fails the build with the message (then restore).

**CLAUDE.md updates:** delete contradiction #3.

---

## Task 8 — Housekeeping sweep *(one PR, several tiny fixes)*

1. **`.eleventy.js`:** delete the inert `markdownTemplateEngine: "njk"` line
   (markdown is deliberately not a template format; the setting is dead
   config). Removes CLAUDE.md observation #7.
2. **`README.md`:** replace the hard-coded
   `https://on-purpose-tim.netlify.app/welcome/` with wording like "your site
   URL (the `baseUrl` value in `content/site.json`) followed by `/welcome/`".
   Removes contradiction #1.
3. **`masthead.njk`:** change the two bare `aria-current` attributes to
   `aria-current="page"`. The CSS selector `[aria-current]` still matches;
   screen readers get the proper announcement.
4. **Essay dates:** the four essays are dated 9/16/23/30 August 2026 —
   **Tim has confirmed these are placeholders from the mockup, not a
   schedule.** Do not change them (dates are his to set), but add a short
   note to CLAUDE.md recording that they are placeholders awaiting real dates,
   replacing observation #5's uncertainty.

**Accept when:** build passes; site renders identically; `grep -r netlify.app`
outside `content/site.json` and CLAUDE.md returns nothing.

---

## Considered and deliberately rejected — do not do these

Recorded so a future session doesn't "helpfully" re-suggest them.

- **CSS/HTML/JS minification, bundling, critical-CSS inlining.** Total payload
  is ~25KB before compression; Netlify gzips. Savings would be imperceptible;
  every tool added is one Tim must maintain alone.
- **Converting `tim.jpg` to AVIF/WebP.** It is 23KB. Not worth a second format.
- **A service worker / offline support.** Pure moving-part liability here.
- **Date-based publish gating.** Considered because three essays were
  future-dated; Tim confirmed the dates are placeholders, so current
  behaviour (everything in the folder publishes) is correct.
- **Restructuring the email template or its inline styles.** Locked by tested
  dark-mode behaviour. See CLAUDE.md → Email rules.
- **Dropping or promoting the `list` block.** Still an open question; leave it.
- **Cache-busting fingerprints for CSS/JS.** Netlify's default ETag
  revalidation is the right amount of caching for files that change with
  deploys. Only the new `/fonts/*` (Task 1) get immutable caching.

---

## Suggested execution order

1 (fonts) → 2 (favicon) → 3 (share tags) → 4 (RSS) → 5 (previewText) →
6 (readTime) → 7 (topics) → 8 (housekeeping).

1–3 are reader-facing wins; 4 closes an open question; 5–7 harden the weekly
loop; 8 is cleanup. Tasks are independent — any order works if a PR stalls.
