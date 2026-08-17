# Chosen Out Loud — Redesign & Rename Execution Plan

*Companion to `DESIGN-REVIEW.md` and `NAMING-REVIEW.md` (17 August 2026).
Those files are the reasoning; this file is the work. Read `CLAUDE.md` in full
before any task.*

---

## Decisions — settled by Tim, 17 August 2026

The gate is **open**. All nine decisions are answered; no task is waiting on
anyone.

| # | Decision | Answer |
|---|---|---|
| N1 | The name | **Chosen Out Loud** (from "everything worth having has to be chosen out loud") |
| N2 | Surname | **Tim Hynes** everywhere |
| N3 | Strapline | **Tim Hynes · one essay, Sunday mornings** |
| N4 | The three descriptions | All three drafts approved as written (Task 4) |
| N5 | Topics | **Dropped for now** — archive goes chronological, reintroduce when there's more to categorise |
| D1 | Home page lead | **(a)** This week's essay as the front-page story |
| D2 | Subscribe asks on home | **One** — the dark panel at the foot |
| D3 | Ruled index | **(a)** Everywhere — home, archive, read-next |
| D4 | Subscribe copy | Panel heading approved; three remaining strings proposed in Task 5 |

**Two things Tim has not explicitly ruled on.** Both have a recommended
default recorded in the task; if he says nothing, the default ships.

1. *The "What I write about" list on the About page* (Task 6). It is the
   clearest statement of what the newsletter covers, and N4 leans on the About
   page for positioning. Default: **keep it as prose**, with the topic
   navigation removed from everywhere else.
2. *The Netlify subdomain* still reads `on-purpose-tim.netlify.app`. Default:
   **leave it** — it is temporary, `hideFromSearch` is on, and it gets replaced
   when the real domain arrives. Renaming the Netlify site now would also break
   any Buttondown confirmation redirect already pointed at it.

## Executing model

**Haiku 4.5 (`claude-haiku-4-5-20251001`) for every task.** The judgment is
spent and the new markup, CSS and strings are quoted verbatim below — the work
is transcription, wiring and verification. Escalate to Sonnet only if the repo
has drifted from what this plan quotes (check `git log`; if files named here
changed after 17 Aug 2026, re-read them before editing).

## Hard guardrails

1. **Never touch essay prose, hooks, preview lines, or any authored text.**
   Note essay 002's hook contains the phrase "on purpose" — it is the writer's
   sentence, not the old brand. Leave it alone.
2. No new npm dependencies. No build tooling.
3. **The palette and the three typefaces are locked.** This work changes
   layout, furniture and words only.
4. **Do not touch `lib/render-email.js`, `scripts/build-email.js`, or anything
   in `src/_includes/email/`.** Verified 17 Aug 2026: the email reads the brand
   from `site.wordmark` / `site.author`, so the rename reaches it with no edits.
   If a task seems to require an email-template change, it is being misread.
5. One task per session, one task per PR, plain-English PR descriptions.
6. After every task: `npm run build` must pass, and `npm run email` must still
   write `dist/email/*.html`. After Task 4, confirm the email masthead now
   reads "chosen out loud" — that is the one intended email change, and it
   comes from config, not from editing the template.

---

## Task 1 — Furniture pass (CSS only)

**Goal.** Quieten the SaaS furniture: smaller radii, no hover-lift, topic
pills become small-caps labels, archive filters become text links.

**File.** `src/css/style.css` only.

**Note.** Tasks 2 and 6 later delete the `.pill` and `.filter` rules entirely
(topics are going). Do them here anyway — this task must leave the site
coherent on its own, and the deletions are cleaner from a known state.

**Steps.**

1. In `:root`, change `--r:1.25rem` to `--r:.4rem`.
2. `.card:hover` — delete `transform:translateY(-2px)` (keep the border-colour
   change). `.card` — remove `transform .18s` from the transition list.
3. `.lead:hover` — delete the whole rule (transform + box-shadow).
   `.lead` — delete its `transition` declaration.
4. Replace the `.pill` rule with:

   ```css
   .pill{
     display:inline-block;font-size:.6875rem;font-weight:600;letter-spacing:.14em;
     text-transform:uppercase;color:var(--soft);
   }
   ```

   Then delete the now-dead overrides: the `.lead .pill` rule, and the `.pill`
   line inside the `prefers-color-scheme:dark` block.
5. Replace the three `.filter` rules (base, `:hover`, `[aria-pressed]/[aria-current]`) with:

   ```css
   .filter{
     font:600 .75rem var(--ui);letter-spacing:.1em;text-transform:uppercase;
     color:var(--soft);padding:.4em 0;display:inline-block;margin-right:1.25rem;
   }
   .filter:hover{color:var(--accent)}
   .filter[aria-pressed=true],
   .filter[aria-current]{color:var(--ink);border-bottom:2px solid var(--warm)}
   ```

   Set `.filters` to `gap:.25rem`, and delete the two `.filter` lines inside
   the dark-mode block.

**Accept when.** Build passes; nothing moves on hover anywhere; topic labels
render as bare small caps; the active archive filter shows a brass underline;
`grep -n "translateY(-2px)" src/css/style.css` is empty.

---

## Task 2 — Cards become a ruled index

**Goal.** Replace the floating card grid with a newspaper contents list, on
the home page, the archive and "Read next" (D3a).

**Files.** New `src/_includes/partials/row.njk`; edit
`src/_includes/layouts/home.njk`, `archive.njk`, `essay.njk`;
`src/css/style.css`.

**Steps.**

1. Create `src/_includes/partials/row.njk`. **The meta line carries date and
   read time, not topic** — topics are being removed in Task 6, and in a
   chronological archive the date is the more useful fact:

   ```njk
   {# One line of the essay index. Replaces the old card grid. #}
   {% macro row(e, site) -%}
   <a class="idxrow" href="/essays/{{ e.slug }}/">
     <span class="no">No. {{ e.number | pad }}</span>
     <span class="t">
       <span class="h">{{ e.title }}</span>
       <span class="d">{{ e.hook }}</span>
     </span>
     <span class="meta">{{ e.date | fmtShort }} &middot; {{ e.readTime }} min</span>
   </a>
   {%- endmacro %}
   ```

2. Add to `style.css`:

   ```css
   /* ---------- essay index — the paper's contents page ---------- */
   .index{border-top:1px solid var(--line)}
   .idxrow{
     display:grid;grid-template-columns:5.5rem 1fr auto;gap:1.25rem;
     align-items:baseline;padding:1.35rem 0;border-bottom:1px solid var(--line);
     transition:color .15s;
   }
   .idxrow .no{font:600 .6875rem var(--ui);letter-spacing:.14em;color:var(--warm);text-transform:uppercase}
   .idxrow .h{display:block;font-family:var(--display);font-weight:400;font-size:1.35rem;line-height:1.2}
   .idxrow:hover .h{color:var(--accent)}
   .idxrow .d{display:block;color:var(--soft);font-size:.9375rem;margin-top:.35rem;max-width:52ch}
   .idxrow .meta{font-size:.75rem;color:var(--soft);white-space:nowrap}
   @media (max-width:40rem){
     .idxrow{grid-template-columns:1fr;gap:.35rem}
     .idxrow .meta{white-space:normal}
   }
   ```

3. In the three layouts, import the macro
   (`{%- from "partials/row.njk" import row -%}`) and swap each
   `<section class="grid"> … card(e, site) … </section>` for
   `<section class="index"> … row(e, site) … </section>`. In `home.njk`
   change the slice from `essays.slice(1, 4)` to `essays.slice(1, 5)` — index
   rows are cheaper than cards, and four fills the page better. Archive and
   essay loops are unchanged.
4. Delete from `style.css`: the `.grid` rule, every `.card` rule, and the
   `.card…` lines in the dark-mode block. Delete
   `src/_includes/partials/card.njk`. Afterwards `grep -rn "card(" src/_includes`
   must return nothing.

**Accept when.** Build passes; home, archive and essay pages show hairline-
ruled rows with brass issue numbers; `grep -rn 'class="card"' _site` is empty;
at 390px each row stacks into three lines with no horizontal scroll.

---

## Task 3 — The home page becomes a front page

**Goal.** This week's essay leads as editorial (D1a); the slogan hero and its
subscribe form go (D2a); one dark panel remains.

**Files.** `src/_includes/partials/lead.njk`, `src/_includes/layouts/home.njk`,
`src/css/style.css`.

**Steps.**

1. Replace the body of `lead.njk` (keep the macro name `lead`). **No topic
   pill** — the eyebrow carries the edition instead:

   ```njk
   {# The front-page story: always the newest essay, chosen by date.
      Light and ruled — editorial, not an ad panel. #}
   {% macro lead(e, site) -%}
   <section class="frontpage">
     <span class="eyebrow">This {{ site.publishDay }} &middot; Issue No. {{ e.number | pad }}</span>
     <h1><a href="/essays/{{ e.slug }}/">{{ e.title }}</a></h1>
     <p class="standfirst">{{ e.hook }}</p>
     <p class="fpmeta">By {{ site.author }} &middot; {{ e.date | fmtDate }} &middot; {{ e.readTime }} min read</p>
     <a class="backlink" style="margin:0" href="/essays/{{ e.slug }}/">Read the essay &rarr;</a>
   </section>
   {%- endmacro %}
   ```

2. In `home.njk`: delete the whole `<section class="hero">…</section>` block
   and the `subform` import; delete the `secline` above the lead ("This week" —
   the eyebrow says it now). Final order: lead → "More essays" secline + index
   → about strip → `cta`.
3. The motto moves into the about strip — **and its wording changes with the
   rename**, in Task 4. For now insert the placeholder line inside
   `<div class="t">`, before `<p>{{ site.about }}</p>`:
   `<p class="motto">{{ site.motto | safe }}</p>` — Task 4 adds `site.motto`
   to config. If Task 4 has not run yet, the line renders empty and the build
   still passes; do not hard-code the old wording here.
4. Add CSS, and delete the whole `.hero` block, the `.lead` rules, and the
   `.lead…` lines in the dark-mode block:

   ```css
   /* ---------- front page lead ---------- */
   .frontpage{padding:clamp(2.5rem,6vw,4rem) 0 clamp(2rem,5vw,2.75rem);border-bottom:1px solid var(--line)}
   .frontpage h1{font-family:var(--display);font-weight:400;font-size:clamp(2.4rem,6.5vw,4.2rem);line-height:1.06;margin:.9rem 0 1rem;max-width:18ch}
   .frontpage h1 a:hover{color:var(--accent)}
   .frontpage .standfirst{font-family:var(--prose);font-style:italic;font-size:clamp(1.15rem,2.6vw,1.4rem);line-height:1.5;max-width:36ch;margin:0 0 1.1rem}
   .frontpage .fpmeta{font-size:.8125rem;color:var(--soft);margin:0 0 1.4rem}
   .motto{font-family:var(--display);font-size:1.2rem;margin:0 0 .75rem}
   .motto em{font-style:italic;color:var(--accent)}
   ```

**Accept when.** Build passes; the home page opens under the dateline with the
newest essay's title as the largest thing on it; exactly one dark panel
(`grep -c 'class="cta"' _site/index.html` → 1, and no `class="lead"` or
`class="hero"` in `_site/index.html`); every page still has exactly one `<h1>`.

---

## Task 4 — The rename: Chosen Out Loud

**Goal.** Retire "On Purpose". Apply N1, N2, N3 and N4 — the name, the
surname, the strapline and the three approved descriptions.

**Files.** `content/site.json`, `src/_includes/layouts/home.njk`,
`src/_includes/layouts/about.njk`, `README.md`, `package.json`, `CLAUDE.md`.
**No file under `src/_includes/email/` is touched.**

**Steps.**

1. In `content/site.json`:
   - `wordmark`: `"Chosen Out Loud"`
   - `author`: `"Tim Hynes"`
   - `strapline`: `"Tim Hynes · one essay, Sunday mornings"`
   - `description`: `"One short essay every Sunday from Tim Hynes in Hobart, about the distance between what you meant and what actually happened."`
   - add `motto`: `"Drift is free. Everything worth having has to be <em>chosen out loud</em>."`
     — the phrase the name comes from, so the masthead now explains itself.
     It contains markup, which is why Task 3 renders it through `| safe`.
   - add `lede`: `"One short essay every Sunday, usually about something I only noticed afterwards — at work, at home, and in the gap between the two."`
     (used by the about strip / any place the old hero lede was needed).
   - Leave `initials`, `photo`, `place`, `publishDay`, `signoff` alone.
2. `about.njk`: the About page opens with the promoted sentence, then the
   existing text. Add before the `site.about` paragraph:
   `<p>Teaching something for years doesn't stop you drifting. It mostly just makes it easier to notice.</p>`
   That sentence already exists in `aboutMore` paragraph two — **delete it
   from there** so it appears once, and leave the rest of that paragraph
   exactly as written.
3. `README.md` and `package.json`: replace the "On Purpose" name and
   description with the new ones. In README also fix the hard-coded
   `https://on-purpose-tim.netlify.app/welcome/` — replace with "your site URL
   (the `baseUrl` value in `content/site.json`) followed by `/welcome/`".
4. `CLAUDE.md`: retitle to Chosen Out Loud, update the opening line to name
   Tim Hynes, and add one line under the design section: *"Renamed from On
   Purpose, August 2026 — see NAMING-REVIEW.md. Palette, typefaces, portrait
   rules and email rules carried over unchanged."*
5. **Do not** change `baseUrl` — the Netlify subdomain stays until the real
   domain arrives (see the note in the decisions block).

**Accept when.** Build passes; `grep -rni "on purpose" src lib content README.md package.json CLAUDE.md` returns **only** essay 002's hook, the two incidental prose uses in `.eleventy.js` and `email/blocks.njk` comments, and README's "no photograph in it, on purpose"; `npm run email` regenerates with the masthead reading "chosen out loud · the sunday essay by tim hynes"; the About page shows the promoted sentence exactly once; **check the masthead at 390px** — "Chosen Out Loud" is longer than "On Purpose", so confirm the wordmark and nav do not wrap awkwardly, and if they do, reduce `.brand b` font-size at the existing `max-width:40rem` breakpoint only.

---

## Task 5 — Subscribe as correspondence

**Goal.** Move all subscribe copy into config, in Tim's register (D4).

**Files.** `content/site.json`, `src/_includes/partials/subform.njk`,
`src/_includes/partials/cta.njk`, `lib/site.js`.

**The strings.** Heading is Tim's pick; the other three are proposed and may
be overridden by him at any point before this task runs.

| Key | Value |
|---|---|
| `eyebrow` | The Sunday letter |
| `heading` | It arrives Sunday, and it doesn't ask you for anything. |
| `line` | One essay a week. Free, and easy to leave. |
| `button` | Get it Sunday |
| `placeholder` | your email address |
| `reassurance` | No spam. Unsubscribe anytime. |

**Steps.**

1. Add a `subscribe` object to `site.json` with those six keys.
2. `subform.njk`: `placeholder="{{ site.subscribe.placeholder }}"`; the macro's
   default label becomes `site.subscribe.button`.
3. `cta.njk`: eyebrow, heading, line and the `fine` reassurance all read from
   `site.subscribe`. **The heading no longer has an `<em>`** — the old markup
   italicised the publish day inside it; the new sentence doesn't want it, so
   drop the `<em>` and the `.cta h2 em` styling can stay unused or be deleted.
4. `lib/site.js`: require the six keys as non-empty strings, failing the build
   with the usual plain-English message.

**Accept when.** Build passes;
`grep -rn "you@company.com\|Join the list\|Subscribe free" src lib` is empty;
blanking one key fails the build with a sentence naming it (test, restore).

---

## Task 6 — Remove topic navigation (N5c)

**Goal.** The archive becomes chronological. **Reversibly** — this is "not
yet", not "never".

**Keep, deliberately:** the `topic` field in every essay's front matter, the
`topics` and `topicNotes` blocks in `site.json`, and the `related` filter
(which quietly orders "Read next" by same-topic-first and is invisible to the
reader). Keeping all three means reintroducing topics later is a UI change
only, with no content to reconstruct.

**Files.** Delete `src/archive-topic.njk`; edit
`src/_includes/layouts/archive.njk`, `essay.njk`, `about.njk`, `base.njk`,
`src/css/style.css`.

**Steps.**

1. Delete `src/archive-topic.njk` — this removes the five `/archive/<topic>/`
   pages, taking the site from 14 HTML pages to 9.
2. `archive.njk`: delete the whole `<div class="filters">…</div>` block, the
   `byTopic` filter call (`set list = essays`), the `{%- else %}` empty-state
   branch (it can no longer occur), and change the intro line to drop "Pick a
   topic if you're after something in particular." — replace with
   "Everything so far, newest first."
3. `essay.njk`: delete the topic `<span class="pill">` from the essay head.
   The byline already carries date, read time and issue number.
4. `about.njk`: **keep** the "What I write about" list (see the decisions
   block). Change it from a `site.topics` loop to plain prose so it no longer
   depends on the topic machinery — same five lines, same wording from
   `topicNotes`, just written out. If Tim would rather it went entirely,
   delete the section instead.
5. `base.njk`: simplify the archive `pageTitle` — drop the `topicLabel`
   branch, leaving `'Archive — ' + site.wordmark`.
6. `style.css`: delete the `.pill`, `.filters`, `.filter` and `.empty` rules
   (all now unused). Confirm with `grep -rn 'class="pill"\|class="filter' src`.
7. Leave `topicName` and `byTopic` in `.eleventy.js`. They are three lines,
   cost nothing, and are exactly what a future reinstatement needs. Add a
   one-line comment saying so.

**Accept when.** Build passes; `_site/archive/` has no topic sub-directories;
9 HTML pages build; no pills or filters anywhere; `npm run email` output is
byte-identical to before the task (the email never showed topics).

---

## Task 7 — Constitution and docs sweep

**Goal.** Make `CLAUDE.md` agree with the shipped site, after Tasks 1–6 merge.

**Steps.** Re-read `CLAUDE.md` against the live code and correct every stale
statement. At minimum: **Topics are no longer fixed at five and no longer
appear in the UI** — rewrite that rule to record the N5c decision and the
reversible approach; the signature-elements line (the newest essay now leads
as a light front page, not a dark panel); the folder layout (`card.njk` →
`row.njk`, `archive-topic.njk` gone); the URL table (9 pages, no topic
archives); the front-matter table (`topic` retained but unused by templates);
and the design notes for radius, hover and labels. Verify the Email rules
section still needed no edits. Also clear the now-resolved contradictions #2
(topics extensible) and #1 (hard-coded netlify URL, fixed in Task 4).

**Accept when.** No statement in `CLAUDE.md` is contradicted by the code;
`git diff` touches only `.md` files.

---

## Order

**1 → 2 → 4 → 3 → 5 → 6 → 7.**

Note that **4 comes before 3**, which is not the order the tasks are written
in. Task 3 renders `site.motto`, and Task 4 is what adds it to config. Running
3 first is legal — the line degrades to empty and the build still passes — but
since every merge deploys straight to the live site, doing 4 first means the
motto is never missing from the home page, even briefly.

Other dependencies: Task 3 assumes Task 1's CSS deletions. Task 6 removes
markup that Tasks 1–3 style, so it must come after them. Task 7 must be last,
because it documents the finished state.

Task 5 is independent of everything and can be pulled forward if a layout PR
stalls.

**Each pull request must be merged before the next session starts.** A session
begins by cloning the default branch; if the previous task is still unmerged,
the new session cannot see its work and will either duplicate it or fail its
acceptance checks.
