# On Purpose — Design Review

*Written 17 August 2026, at Tim's request, as a client design review. The brief:
the site was modelled on Justin Welsh's blog and now feels like it copies him
too much. Review the site as if Tim were a new client, judge how the design
fits him, and propose a direction that a low-cost model can execute.*

*This document is the review and the recommendation. The executable tasks live
in `REDESIGN-PLAN.md`, which is gated on Tim approving the decision points at
the end of this file.*

---

## 1. The short version

You have already left Justin Welsh's house style. What you kept is his floor
plan.

Put the two sites side by side and nobody would call them siblings: his is
white, sans-serif, product-led, studded with subscriber counts and
testimonials; yours is warm paper, two serifs, a dateline, and not a single
number bragging about anything. The palette, the type, the stipple portrait,
the "Sunday edition" conceit — none of that is Welsh. It's yours, and it's
good.

What still reads as borrowed is the **structure** — and structure is what you
feel when a site reminds you of another one. Your home page is the standard
creator-newsletter landing template, the one Welsh popularised and every
beehiiv/ConvertKit site now ships by default:

1. Centred circular avatar
2. Eyebrow line ("A Sunday newsletter by Tim")
3. Slogan headline with one italicised accent word
4. One-line pitch
5. Email field + dark pill button + "No spam. Unsubscribe anytime."
6. Featured-post panel
7. Three-card grid of recent posts
8. About strip with face and "read more"
9. Full-width dark "Join the list" panel with a second subscribe form

That is the genre skeleton. The genre is what erases you — not the fonts.

## 2. The deeper finding: the structure sells, but the writing corresponds

This is the thing I'd push hardest on if you were sitting across the table.

Your essays are patient, self-implicating, and end on questions. Your welcome
page says *"one click to leave whenever you've had enough."* You wrote an
entire essay titled **"Letterbox, not lounge room"** about earning a place in
someone's inbox rather than performing for a crowd. That is the brand — you
already wrote it.

The layout, meanwhile, behaves like a funnel:

- The home page asks for the email address twice (hero form + dark CTA), and
  every other page asks again on the way out.
- The subscribe placeholder reads `you@company.com` — pure LinkedIn-creator
  DNA, on a site that is half about fathering.
- The buttons say "Subscribe free" and "Join the list" — growth copy, not
  correspondence copy.
- Rounded 1.25rem cards that lift on hover, pill-shaped topic tags, a dark
  featured panel — this is SaaS furniture. Your own CSS names the concept
  "Sunday Papers", and a Sunday paper has ruled columns and an index, not
  floating cards.
- The home page has **two** dark panels (lead story + CTA) competing to be the
  loudest thing on the page. The CSS's own stated intent is "one dark panel
  per page". In the paper metaphor, a dark panel is an advertisement — and the
  front page currently runs two ads and no front-page story.

None of this is a mistake — it converts, and it's the pattern you were
following. But it's the part that feels like someone else, because it *is*
someone else's move.

## 3. What is unmistakably yours — locked, and amplified

These survive any redesign untouched. Several become more prominent:

- **The palette and the three typefaces.** Warm paper, ink, slate, brass;
  DM Serif Display / Newsreader / Plus Jakarta Sans. Distinctive, signed off,
  self-hosted, and nothing like Welsh. Changing these would be redesigning the
  part that already works.
- **The edition conceit.** Masthead, dateline, issue numbers, "Sunday
  Edition", "Hobart, Tasmania". This is the single most differentiating idea
  on the site — currently used as decoration. The recommendation is to make it
  the organising principle.
- **The no-images constraint** and the duotone stipple portrait, with all its
  existing rules (circle only, navy stays navy).
- **The drop cap, the reading measure, the quiet sign-off.**
- **The writing voice.** "Drift is free" is a genuinely great line — the issue
  is only where the template makes it stand (as a centred slogan in the
  Welsh position).
- **The email.** Untouched. Every email rule in CLAUDE.md stands.

## 4. Three directions

**A. Finish the Sunday paper — recommended.** Keep palette and type wholesale.
Replace the creator-template skeleton with an edition front page: this week's
essay leads the page as editorial (light, ruled, big serif headline) instead
of sitting in a dark ad-panel; the card grids become a ruled index (the
paper's contents page); the furniture quietens (smaller radii, no hover-lift,
small-caps labels instead of pills); subscribing is written and placed as
correspondence — one ask per page, letterbox language. Mostly CSS and template
reshuffles, no new dependencies, email untouched, cheap to execute.

**B. The letterpress pamphlet.** A more radical strip-down: single column,
no panels at all, home page is simply the newest essay in full with an index
beneath it. Purest expression of the voice, but it's a rewrite, it buries the
archive, and it demands taste calls at every step — a poor fit for low-cost
execution, and it throws away signed-off work that isn't the problem.

**C. Change the clothes, keep the skeleton.** New palette and fonts on the
same layout. Recommended against explicitly: it replaces the part of the site
that is already yours and keeps the part that is borrowed. This is the trap
version of "make it less like Justin Welsh".

## 5. Direction A, page by page

**Home.** The masthead and dateline stay exactly as they are. Below the
dateline, the page opens with **this week's essay as the front-page lead**:
eyebrow ("This Sunday · Issue No. 005"), the essay title huge in DM Serif,
the hook as a standfirst in Newsreader italic, a byline row, "Read the essay".
Light paper, ruled top and bottom — a front page, not an ad. The motto and
portrait move down into a compact about/subscribe band. Below the lead: a
**ruled index** of the remaining essays (issue number in brass small caps,
serif title, hook, topic and read time on the meta line — hairline rules
between rows, no cards). One dark panel remains at the foot of the page: the
subscribe ask, rewritten in letterbox language.

**Archive.** Same ruled index replaces the card grid. Filters stay but as
small-caps text links with an underline for the active topic, not pill
buttons.

**Essay.** Almost untouched — it's the best page on the site. The "Read next"
cards at the foot become three index rows.

**About / Welcome.** Layout untouched; they inherit the furniture pass
(radii, labels) automatically.

**Furniture, everywhere.** Corner radius drops from 1.25rem to 0.4rem;
hover-lift animations removed (colour shifts remain); pill tags become
letter-spaced small-caps labels; `you@company.com` and the button/CTA copy
become Tim-authored strings (slots are flagged in the plan — the model must
not invent them).

**Untouched, permanently:** essay prose, the email pipeline, the palette,
the fonts, the portrait rules, the topics.

## 6. Decision points — Tim decides, nobody else

Recorded here so the executing model never has to guess. Answers go at the
top of `REDESIGN-PLAN.md` before any task runs.

- **D1 — What leads the home page?**
  (a) This week's essay as the front-page story, motto demoted — the
  recommendation, and what the plan specs. (b) Keep the motto hero, but
  compressed and left-aligned, with the essay lead directly under it.
- **D2 — How many subscribe asks on the home page?**
  (a) One: the dark panel at the foot; the hero form goes — recommended.
  (b) Two: keep a single-line quiet form in the opening band as well, if
  losing the above-the-fold form feels too risky for LinkedIn traffic.
- **D3 — Cards to ruled index everywhere?**
  (a) Everywhere (home, archive, read-next) — recommended.
  (b) Archive only, keep cards on home.
- **D4 — Subscribe copy.** The plan marks every string ("Subscribe free",
  "Join the list", `you@company.com`, the dark-panel headline). Tim writes
  the replacements — the letterbox essay is the obvious well to draw from.

---

*A note for future sessions: CLAUDE.md says "The design is finished. Do not
redesign it." That rule protected the design from drive-by tinkering; this
review was commissioned by Tim, the product owner, which is the one door that
rule leaves open. If Direction A ships, the executing tasks update CLAUDE.md
so the constitution and the site agree again.*
