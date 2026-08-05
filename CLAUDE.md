# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

**On Purpose** — a weekly essay newsletter by Tim (Hobart, Tasmania). This repo
is the website plus the machinery that turns one markdown file into both a web
page and a paste-ready email. Sending is manual; there is no API integration.

`README.md` is written for Tim, who is not a developer. Keep it that way — plain
English, no jargon, no assumed memory of any conversation.

## Commands

```
npm start              dev server with live reload (localhost:8080)
npm run build          clean build of the website into _site/
npm run email -- 001   writes dist/email/001.html, paste-ready for Buttondown
```

`npm run email` with no argument builds the newest essay.

## Stack

Eleventy 3 + Nunjucks. Node and npm, nothing else — no bundler, no CSS
framework, no preprocessor. Four dependencies: `@11ty/eleventy`, `markdown-it`,
`gray-matter`, `nunjucks`. Netlify deploys from a push to the default branch.

Do not substitute a framework, add a build step, or introduce dependencies
without a concrete reason. Every dependency is one Tim will have to update.

## Structure

```
content/essays/*.md    THE source of truth. One file per essay.
content/site.json      everything about the site that isn't an essay
lib/                   shared: block parser, web renderer, email renderer
src/_includes/         layouts, partials, and the email template
src/css/style.css      the design, lifted from the signed-off mockup
scripts/build-email.js the email builder
```

Everything Tim touches weekly lives in `content/`. He should never need to open
anything in `src/`. Adding an essay must stay a one-file change.

## The design is finished

`src/css/style.css` came from a signed-off mockup and is the specification, not
a starting point. Do not propose alternative palettes, typefaces, layouts or
components. Do not add stock photography or illustration — the absence of
images is a deliberate constraint.

Everything is verbatim except the changes marked `ADAPTED`, each of which
carries its reason inline:

- the archive filters became real links rather than buttons (two rules)
- the footer is held to the bottom of short pages, which the mockup had none of

Home, archive and archive-by-topic render pixel-identical to the mockup at
1200px. If you touch the stylesheet, re-check that they still do — screenshot
both and compare, don't eyeball it.

## The email has rules that were learned the hard way

Read the header comment in `src/_includes/email/head.njk` before changing
anything on the email side. The short version:

> Buttondown's free plan strips the `<head>`, so the `<style>` block never
> reaches the inbox and every tested client force-inverts the email. **Encode
> meaning with hue and rules, never with light-versus-dark.** Brass (`#C08A3E`)
> and hairline borders survive inversion. Ink (`#26241F`) and paper (`#F1EFEA`)
> both collapse toward the same mid grey.

Consequences that must not be reverted:

- The active 2×2 cell is **brass** in the email and **dark ink** on the website.
  This is not a style preference.
- The subscribe panel keeps its dark fill *and* a 2px brass border.
- The outer `#F1EFEA` background stays, seam and all. The trade-off is
  documented inline at that line.
- The `<style>` block stays even though it is currently stripped.
- Table-based layout with inline styles throughout. **Do not refactor to divs
  and classes.** It looks like 2004 because that is what renders in Outlook.
- `{{ unsubscribe_url }}` appears exactly once. Buttondown requires it.
- The website has a drop cap on the first paragraph. The email deliberately
  does not. Don't add one.

`dist/email/001.html` should stay within a hairline of the tested v2 template
apart from URL substitution. If you change the email renderer, diff against it.

## Other invariants

- Topics are fixed at five: `work`, `coaching`, `career`, `fathering`,
  `offclock`. Do not make them extensible.
- Archive topic filtering must work with JavaScript disabled — real pages, real
  links.
- No absolute URL may be hard-coded outside `content/site.json`. There is no
  domain yet; `baseUrl` must stay the single place it lives.
- Essay text is finished writing. Convert it, don't edit it — no rewording, no
  "fixing" Australian spellings or em-dash style.
- Out of scope: Buttondown API, analytics, comments, search, RSS, paid
  subscriptions.
