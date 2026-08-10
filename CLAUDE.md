# CLAUDE.md

Project memory for **On Purpose** — a weekly essay newsletter by Tim, Hobart.
One essay every Sunday, published to a website and sent by email.

> This file holds **decisions**, not facts about the code. The facts section at
> the bottom is filled in by reading the repo. If code and this file disagree,
> ask — don't silently pick a side.

---

## Prime directive

The site exists to get one essay published every Sunday with as little friction
as possible. Publishing friction is the only thing that will kill this project.

When trading off, rank in this order:

1. Does it keep the weekly publish working?
2. Does it reduce friction in the weekly loop?
3. Is it a reader-facing bug?
4. Everything else — probably not now.

Tim is not a developer. He is the product owner. Favour boring, stable, few
moving parts over anything clever. Every dependency is something he will one
day have to update alone.

---

## The design is finished. Do not redesign it.

The palette, typography and layout were worked through carefully and signed off.
Treat them as fixed constraints, not suggestions. If something looks like a
mistake, ask before changing it.

**Palette**

| Role | Hex |
|---|---|
| Background (paper) | `#F1EFEA` |
| Raised surfaces | `#FAF8F4` |
| Ink | `#26241F` |
| Secondary text | `#6B665D` |
| Hairlines | `#DDD8CF` |
| Accent (slate) | `#3F6E8C` |
| Brass (emphasis only) | `#C08A3E` |
| Panel fill (email quote / sponsor) | `#E7E3DB` |

**Type** — DM Serif Display for titles, Newsreader for essay body at 19px/1.75,
Plus Jakarta Sans for interface. Reading column capped at 36rem.

**No images.** This is a deliberate constraint, not an oversight. The only photo
anywhere is Tim's face, now set (`site.photo` → `/tim.jpg`), with a
lettered-circle fallback that must keep working — clearing `photo` must always
put the `T` circle back. Setting it turns the face on in four places, not just
the masthead: the masthead avatar on every page, the home hero, the home about
strip and the About page lead. Colour comes from type, rules and dark panels.
Never add stock photography or illustration. The second sanctioned use of the
photo is the favicon set (`src/static/favicon.ico`, `icon-192.png`,
`icon-512.png`, `apple-touch-icon.png`), derived from `tim.jpg` — square
crops, no circular masking, no recolouring.

**Signature elements** — the weekend-edition dateline under the masthead; a drop
cap opening each essay **on the website only**; the newest essay in a dark lead
panel on the home page, chosen by date; the reusable 2×2 figure block.

**Topics are fixed at five**: Work, Coaching, Career, Fathering, Off the Clock.
Do not make them extensible.

---

## Email rules — learned by testing, not by preference

The email template is table-based with inline styles. **It looks like 2004 on
purpose.** Outlook renders email with Word's engine and ignores modern CSS.
Never refactor it to divs and classes.

Buttondown's free plan strips the `<head>`, so the `<style>` block and the
colour-scheme meta tags never reach the inbox. Every client tested — iOS Gmail,
iOS Outlook, iPad Gmail — force-inverts the email in dark mode.

> **Encode meaning with hue and rules, never with light-versus-dark.**
> Inversion remaps lightness and mostly leaves hue alone. Brass (`#C08A3E`) and
> hairline borders survive everywhere. Ink and paper sit at opposite extremes
> and both collapse toward the same mid grey, so anything relying on the
> contrast between those two disappears.

Consequences that must not be reverted:

- Active 2×2 cell in the email: **brass fill**, not dark fill. (Dark fill was
  tested and made the highlight vanish entirely.)
- Subscribe panel: dark fill **plus** a 2px brass border, so it still reads as a
  panel once the fill inverts.
- The outer `#F1EFEA` background stays, despite a faint seam against
  Buttondown's wrapper in dark mode. Losing the warm paper in light mode is the
  worse trade.
- The `<style>` block stays even though it's currently stripped. It costs
  nothing and works if Tim moves to Naked mode or another provider.
- `{{ unsubscribe_url }}` appears exactly once. Buttondown requires it.
- **No drop cap in the email.** Website only. Decided deliberately.

Buttondown overrides link colour globally via the tint colour in Settings →
General → Branding, currently `#26241F`. Don't fight it in the template.

---

## Content rules

- **Essay text is finished writing.** Convert and render it; never reword, never
  "fix" Australian spellings or em-dash style, never touch a typo without asking.
- **Paragraphing house style is short** — the email's rhythm, applied to both
  site and email. One source file, one paragraphing.
- `hook` is the site version. `emailHook` is the trimmed version for the email
  subtitle, falling back to `hook` if absent.
- `previewText` is the inbox preview line and is always authored by hand. It
  matters more for opens than anything else in the email. Never auto-generate it.
- 2×2 figure `active` is **1-indexed** in the authoring format.

---

## Working conventions

- **Small, single-purpose pull requests.** One backlog item per task. A large PR
  is not reviewable by a non-developer, which defeats the point.
- Explain changes in plain English in the PR description. Assume no memory of
  any previous session.
- No new dependencies without asking first.
- Absolute URLs live behind a single config value. A domain is coming in a month
  or so; swapping it must be a config change, not a find-and-replace.
- Don't hard-code the `netlify.app` URL anywhere outside that config.

---

## Open questions — do not decide these unilaterally

- Whether the `list` block type is kept or dropped. No essay uses one yet.
- Whether `readTime` should be calculated rather than authored by hand.

---

## Repo facts

*Read from the repo. Facts, not decisions — if these drift from the code, the
code is right and this section is stale.*

### Stack

Eleventy 3.1.6 with Nunjucks templates. No bundler, no CSS framework, no
preprocessor, no test runner, no dev dependencies.

Four runtime dependencies, all direct:

| Package | Version | Used for |
|---|---|---|
| `@11ty/eleventy` | ^3.1.6 | the site build |
| `markdown-it` | ^15.0.0 | markdown → HTML, twice: once plain for the web, once with overridden renderer rules for the email |
| `gray-matter` | ^4.0.3 | essay front matter |
| `nunjucks` | ^3.2.4 | used directly by the email builder, which runs outside Eleventy |

`package.json` declares `engines.node >= 18`; Netlify is pinned to Node 22.

Eleventy config (`.eleventy.js`): input `src`, includes `src/_includes`, data
`src/_data`, output `_site`. `templateFormats` is `["njk", "html"]` — **markdown
is deliberately not a template format.** Essays are loaded as *data* by
`src/_data/essays.js`, not rendered as templates, which is what lets the same
parser feed both the website and the email.

Filters registered: `pad` (1 → `001`), `fmtDate` (`9 August 2026`), `fmtShort`
(`9 Aug 2026`, both `en-AU`), `topicName`, `related`, `byTopic`. Global data:
`buildYear`. Passthrough: `src/css` → `/css`, `src/js` → `/js`, `src/static` →
site root. Extra watch targets: `content/` and `lib/`.

### Commands

| Command | What it does |
|---|---|
| `npm start` | `eleventy --serve` — dev server on localhost:8080, live reload, watching `src/`, `content/` and `lib/` |
| `npm run clean` | deletes `_site/` via a Node one-liner (works on any OS) |
| `npm run build` | `clean` then `eleventy` — a full rebuild into `_site/`. This is what Netlify runs |
| `npm run email -- 001` | `node scripts/build-email.js 001` → writes `dist/email/001.html` |

`npm run email` accepts an issue number (padded or not) or a slug. With no
argument it builds the newest essay by date. It prints the subject line and
preview text ready to paste, and warns if `baseUrl` is still a placeholder.

### Folder layout

```
content/
  essays/*.md            source of truth, one file per essay
  site.json              everything that isn't an essay
lib/                     shared by the website and the email builder
  blocks.js              splits an essay body into markdown / quote / figure blocks
  essays.js              reads + validates essays, sorts newest first by date
  site.js                reads + validates site.json, strips trailing slash off baseUrl
  render-web.js          blocks → website HTML (no inline styles)
  render-email.js        markdown → inline-styled email HTML
scripts/build-email.js   the email builder — runs outside Eleventy
src/
  _data/site.js          exposes site.json to templates as `site`
  _data/essays.js        exposes essays as `essays`, body pre-rendered to web HTML
  _includes/layouts/     base, home, archive, essay, about, welcome
  _includes/partials/    masthead, dateline, card, lead, cta, subform, face, footer
  _includes/email/       head.njk, blocks.njk, foot.njk
  css/style.css          the design
  js/progress.js         reading progress bar, essay pages only
  js/subscribe.js        subscribe form: validation, and keeping the reader on the page
  static/                copied to the site root — where a photo would go
  *.njk                  one file per URL, mostly empty; front matter only
.eleventy.js
netlify.toml
```

Build outputs `_site/` (website) and `dist/email/` (emails). Both are gitignored
and rebuilt from scratch.

### URLs

| URL | Built by | Notes |
|---|---|---|
| `/` | `src/index.njk` | |
| `/archive/` | `src/archive.njk` | |
| `/archive/<topic>/` | `src/archive-topic.njk` | one real page per topic, paginated over `site.topics` |
| `/essays/<slug>/` | `src/essays.njk` | paginated over the essays data file |
| `/about/` | `src/about.njk` | |
| `/welcome/` | `src/welcome.njk` | post-confirmation landing; permanently `noindex` |
| `/404.html` | `src/404.njk` | Netlify serves it for unknown URLs |
| `/_headers` | `src/headers.njk` | generated Netlify headers file |
| `/feed.xml` | `src/feed.njk` | hand-written Atom feed over the essays data |

14 HTML pages at present.

### Essays and their front matter

One file per essay in `content/essays/`, named `NNN-slug.md`. **The filename is
never parsed** — order comes from `date`, numbering from `number`, the URL from
`slug`. Adding an essay is a one-file change; nothing else needs editing.

| Field | Required | Type | Notes |
|---|---|---|---|
| `title` | yes | string | headline, and the email subject the builder prints |
| `slug` | yes | string | becomes the URL; must be lowercase words joined by hyphens, and unique across essays — both enforced |
| `number` | yes | number | displayed zero-padded to three digits |
| `topic` | yes | string | must be a key of `site.topics` — enforced |
| `date` | yes | `YYYY-MM-DD` | drives all ordering: lead panel, dateline, archive, "newest" |
| `readTime` | yes | number | authored by hand |
| `hook` | yes | string | the site one-liner |
| `emailHook` | no | string | falls back to `hook` |
| `previewText` | no | string | falls back to `emailHook`, then `hook` |

Body is markdown, plus two custom block tags parsed by `lib/blocks.js`:

```
{% quote %}One line.{% endquote %}

{% figure title="…", active=2, caption="…" %}
cell one
cell two
cell three
cell four
{% endfigure %}
```

`active` is 1-indexed when authored and converted to 0-indexed internally. A
figure must have exactly four cells; anything else fails the build. Bullet lists
(`- `) render on both sides — `<ul>` on the web, brass-bullet paragraph rows in
the email.

Validation failures name the file and state the fix in a sentence, and stop the
build rather than shipping a page reading "undefined".

### How the email is produced

`scripts/build-email.js` runs outside Eleventy but shares all of `lib/`, so the
two outputs cannot drift on what a block means.

1. Load `content/site.json` and every essay through the same loaders the site uses.
2. Pick the essay by number, slug, or default to newest.
3. Split the body into blocks; each becomes one table row — prose, quote or figure.
4. Markdown chunks go through `lib/render-email.js`: markdown-it with
   `paragraph_open`, `heading_open`, `link_open` and the list rules overridden to
   emit inline styles.
5. Top padding per row — 40px for the opening prose run, 32px for prose after a
   quote or figure, 14px for a figure, 8px for a quote. These come from the
   tested v2 template.
6. The sign-off is appended inside the final prose cell, unless the essay ends on
   a quote or figure, in which case it gets a cell of its own so it stays last.
7. Nunjucks assembles `email/head.njk` + the rows (via macros in
   `email/blocks.njk`) + `email/foot.njk`.
8. Writes `dist/email/NNN.html` — a complete standalone document that opens in a
   browser.

`{{ unsubscribe_url }}` is emitted literally via `{% raw %}` for Buttondown to
substitute at send time.

### Deploys

Netlify, configured entirely by `netlify.toml` — build `npm run build`, publish
`_site`, `NODE_VERSION = "22"`. Nothing to set in their web interface.

It deploys on a push to the repo's **default branch, currently
`claude/basic-setup-2rcyo5`** — not `main`. Live at
`https://on-purpose-tim.netlify.app`.

No redirect rules: every page is a real file. `_site/_headers` is generated by
`src/headers.njk` — while `hideFromSearch` is true it sends
`X-Robots-Tag: noindex, nofollow` for `/*`, and `/welcome/*` always gets it.

Subscribe forms post straight to Buttondown's embed endpoint (in
`site.subscribeEndpoint`). Buttondown sends no CORS headers, so `subscribe.js`
targets a hidden iframe to keep the reader on the page; with JavaScript off the
form posts normally and Buttondown's own page answers.

### Where things contradict the decisions above

Listed, not fixed.

1. **A hard-coded `netlify.app` URL exists outside the config.** `README.md`
   prints `https://on-purpose-tim.netlify.app/welcome/` in the instructions for
   Buttondown's confirmation redirect. Contradicts "Don't hard-code the
   `netlify.app` URL anywhere outside that config." A domain swap would need this
   line changed by hand.

2. **`previewText` is optional and falls back silently.** `lib/essays.js` does
   `previewText: data.previewText || data.emailHook || data.hook`, and
   `previewText` is not in the required list. Contradicts "always authored by
   hand … Never auto-generate it." All four essays do set it, but in 002, 003 and
   004 it is byte-identical to `hook`, so the intent isn't being met in the
   content either.

3. **Topics are extensible by config.** `src/archive-topic.njk` paginates over
   `site.topics`, so adding a sixth key to `content/site.json` silently produces a
   sixth archive page and makes that topic valid in front matter. "Do not make
   them extensible" is documented but not enforced.

4. **The drop cap is not essay-only.** `.prose > p:first-of-type::first-letter`
   matches any `.prose` container, and the About page uses one — so About opens
   with a drop cap too. The decisions describe it as "opening each essay". This
   matches the signed-off mockup, so it may well be deliberate.

Softer observations, not contradictions:

5. **All four essays are dated in the future** — 9, 16, 23 and 30 August 2026.
   Every "newest" behaviour reads the latest date, so the dateline and lead panel
   currently advertise an edition dated after today, while all four are already
   readable. Nothing records whether these dates are a real schedule or sample
   data carried over from the mockup.

6. **The tested v2 email template is not committed.** The email rules were
   derived from it and it is the stated reference for checking the renderer, but
   there is no copy in the repo to diff against.

7. **`markdownTemplateEngine: "njk"` in `.eleventy.js` is inert**, because `.md`
   is not in `templateFormats`. Harmless, but misleading to read as live config.

8. Both open questions are still open in the code: `readTime` is authored by hand
   and required; the `list` block type is fully implemented on both sides and used
   by no essay.
