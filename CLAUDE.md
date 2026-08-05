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
anywhere is Tim's face in the masthead, currently unset, with a lettered-circle
fallback that must keep working. Colour comes from type, rules and dark panels.
Never add stock photography or illustration.

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
- Whether the site needs an RSS feed.

---

## Repo facts

<!-- TO BE FILLED IN BY THE FIRST SESSION.
     Read the repo and document: stack and version, folder layout, the commands
     and what each does, where essays live and their frontmatter schema, how the
     email output is produced, how deploys happen.
     Also list anything in the repo that contradicts the decisions above —
     but change nothing. Tim will say which were deliberate. -->
