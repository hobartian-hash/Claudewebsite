# On Purpose — Redesign Execution Plan ("Direction A: finish the Sunday paper")

*Companion to `DESIGN-REVIEW.md` (17 August 2026). That file is the reasoning;
this file is the work. Read `CLAUDE.md` in full before any task.*

## Gate — do not start until this block is filled in

Tim's answers to the decision points in DESIGN-REVIEW.md §6:

- D1 (what leads the home page): **PENDING**
- D2 (subscribe asks on home): **PENDING**
- D3 (index everywhere or archive only): **PENDING**
- D4 (subscribe copy — Tim's replacement strings): **PENDING**

If any line still says PENDING, stop and tell Tim the plan is waiting on him.
The task specs below assume the recommended answers (D1a, D2a, D3a); if Tim
picks a (b) option, the affected task notes the variation.

**Task 4 is additionally gated on `NAMING-REVIEW.md` (decisions N1–N4).** That
review recommends changes to the wordmark, strapline, author name and the
three site descriptions. Since Task 4 rewrites the subscribe copy in the same
config file, doing it before the naming call is settled means writing those
strings twice — and possibly around a wordmark that is about to change. If
N1–N4 are unanswered, run Tasks 1, 2, 3 and 5 and leave Task 4 until they are.

## Executing model

**Haiku 4.5 (`claude-haiku-4-5-20251001`) for every task.** The judgment calls
are already made and the new markup/CSS is included verbatim below — the work
is transcription, wiring and verification. Escalate to Sonnet only if the repo
has drifted from what this plan quotes (check `git log` — if files named here
changed after 17 Aug 2026, re-read them before editing).

## Hard guardrails — identical to OPTIMISATION-PLAN.md, plus one

1. Never touch essay prose, hooks, preview lines, or any authored text. Copy
   slots in Task 4 are wired empty-or-current, never invented.
2. No new npm dependencies. No build tooling.
3. **The palette and the three typefaces are locked.** This redesign changes
   layout and furniture only. If a task seems to need a new colour or font,
   the task is being misread — stop.
4. Do not touch `lib/render-email.js`, `scripts/build-email.js`, or anything
   in `src/_includes/email/`. The email is exempt from this redesign entirely.
5. One task per session, one task per PR, plain-English PR descriptions.
6. After every task: `npm run build` must pass; run `npm run email` once and
   confirm it still writes `dist/email/*.html` unchanged (no `lib/` files are
   in scope, so any email diff means a task overreached).

---

## Task 1 — Furniture pass (CSS only)

**Goal.** Quieten the SaaS furniture: smaller radii, no hover-lift, topic
pills become small-caps labels, archive filters become text links.

**File.** `src/css/style.css` only.

**Steps.**

1. In `:root`, change `--r:1.25rem` to `--r:.4rem`.
2. `.card:hover` — delete `transform:translateY(-2px)` (keep the border-colour
   change). `.card` — remove `transform .18s` from the transition list.
3. `.lead:hover` — delete the whole rule (transform + box-shadow).
   `.lead` — remove the `transition` declaration. (The panel itself is
   replaced in Task 3; this just stops the lift meanwhile.)
4. Replace the `.pill` rule with:

   ```css
   .pill{
     display:inline-block;font-size:.6875rem;font-weight:600;letter-spacing:.14em;
     text-transform:uppercase;color:var(--soft);
   }
   ```

   Then delete the now-dead pill overrides: the `.lead .pill` rule, and the
   `.pill{...}` line inside the `prefers-color-scheme:dark` block.
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

   Also update `.filters` to `gap:.25rem` and delete the
   `.filter{...}` / `.filter[aria-current]{...}` lines inside the dark-mode
   block (the new rules need no dark override).

**Accept when.** Build passes; no element moves on hover anywhere; topic
labels render as bare small caps (no bubble); the active archive filter shows
a brass underline; `grep -n "translateY(-2px)" src/css/style.css` is empty.

**CLAUDE.md update.** In the design section, note: corner radius is .4rem,
hover states change colour only, topic labels are small-caps text (decided in
DESIGN-REVIEW.md, approved by Tim).

---

## Task 2 — Cards become a ruled index

**Goal.** Replace the floating card grid with a newspaper contents list.
Applies to home "More essays", the archive, and essay "Read next" (D3a).

**Files.** New `src/_includes/partials/row.njk`; edit
`src/_includes/layouts/home.njk`, `archive.njk`, `essay.njk`;
`src/css/style.css`.

**Steps.**

1. Create `src/_includes/partials/row.njk`:

   ```njk
   {# One line of the essay index. Replaces the old card grid. #}
   {% macro row(e, site) -%}
   <a class="idxrow" href="/essays/{{ e.slug }}/">
     <span class="no">No. {{ e.number | pad }}</span>
     <span class="t">
       <span class="h">{{ e.title }}</span>
       <span class="d">{{ e.hook }}</span>
     </span>
     <span class="meta">{{ e.topic | topicName(site.topics) }} &middot; {{ e.readTime }} min</span>
   </a>
   {%- endmacro %}
   ```

2. Add to `style.css`, replacing nothing yet (the `.card`/`.grid` rules are
   removed in step 4):

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
   `<section class="index"> … row(e, site) … </section>`. In `home.njk` the
   loop stays `essays.slice(1, 4)`; change it to `essays.slice(1, 5)` so the
   index shows four rows (index rows are cheaper than cards; four fills the
   page better). Archive and essay loops are unchanged.
4. Delete from `style.css`: the `.grid` rule, all `.card` rules (base, hover,
   h3, p, metaline), and the `.card…` lines inside the dark-mode block.
   Delete `src/_includes/partials/card.njk` and its imports — after step 3,
   `grep -rn "card(" src/_includes` must return nothing.

**Accept when.** Build passes; home, archive and essay pages show hairline-
ruled rows with brass issue numbers; no `.card` markup in `_site`
(`grep -rn "class=\"card\"" _site` empty); the phone width stacks each row
into three lines without horizontal scroll.

**If Tim chose D3b:** apply steps only to `archive.njk`; leave `card.njk` and
home/essay untouched, and keep the `.card` CSS.

**CLAUDE.md update.** Folder layout: `card.njk` → `row.njk`; design section
gains "essays list as a ruled index, not cards".

---

## Task 3 — The home page becomes a front page

**Goal.** This week's essay leads the page as editorial (D1a); the slogan
hero and its subscribe form go (D2a); one dark panel remains (the CTA).

**Files.** `src/_includes/partials/lead.njk`, `src/_includes/layouts/home.njk`,
`src/css/style.css`.

**Steps.**

1. Replace the body of `lead.njk` with a light front-page lead (keep the
   macro name `lead` so imports don't change):

   ```njk
   {# The front-page story: always the newest essay, chosen by date.
      Light and ruled — editorial, not an ad panel. #}
   {% macro lead(e, site) -%}
   <section class="frontpage">
     <span class="eyebrow">This {{ site.publishDay }} &middot; Issue No. {{ e.number | pad }}</span>
     <h1><a href="/essays/{{ e.slug }}/">{{ e.title }}</a></h1>
     <p class="standfirst">{{ e.hook }}</p>
     <p class="fpmeta">By {{ site.author }} &middot; {{ e.date | fmtDate }} &middot; {{ e.readTime }} min read &middot; {{ e.topic | topicName(site.topics) }}</p>
     <a class="backlink" style="margin:0" href="/essays/{{ e.slug }}/">Read the essay &rarr;</a>
   </section>
   {%- endmacro %}
   ```

2. In `home.njk`: delete the entire `<section class="hero">…</section>` block
   and the `subform` import; delete the `secline` line above the lead ("This
   week" — the eyebrow now carries it); keep the order: lead → "More essays"
   secline + index → about strip → `cta`. The about strip is unchanged — the
   portrait and the motto live there and in the masthead.
3. In the about strip, add the motto as its opening line: inside
   `<div class="t">`, before the existing `<p>{{ site.about }}</p>`, insert
   `<p class="motto">Drift is free. Everything else you do <em>on purpose</em>.</p>`
   — this is the one existing authored string that moves; it is quoted here
   verbatim from the old hero and must not be reworded.
4. Add CSS (and delete the whole `.hero` block plus `.lead` rules and the
   `.lead…` lines in the dark-mode block):

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

**If Tim chose D1b:** keep the hero but left-align it (`text-align:left`,
remove the face from it) above the frontpage section. **If D2b:** keep
`subform` in the about strip under the motto instead of deleting it from the
page.

**Accept when.** Build passes; the home page opens (under the dateline) with
the newest essay's title as the largest thing on the page; exactly one dark
panel remains on home (`grep -c "class=\"cta\"" _site/index.html` → 1, and no
`class="lead"`/`class="hero"` in `_site/index.html`); the motto text appears
once, verbatim; every page still has exactly one `<h1>`.

**CLAUDE.md update.** Rewrite the "Signature elements" line: the newest essay
now leads the home page as a light front-page story (was: dark lead panel);
the hero is gone; note the decision reference (DESIGN-REVIEW.md, approved by
Tim).

---

## Task 4 — Subscribe as correspondence (copy slots, Tim's words)

**Goal.** All subscribe-related copy moves into `content/site.json` so Tim
owns it in one place; the funnel defaults are replaced by *his* strings from
gate item D4. The model wires slots; it never writes copy.

**Files.** `content/site.json`, `src/_includes/partials/subform.njk`,
`src/_includes/partials/cta.njk`, `lib/site.js` (validation only).

**Steps.**

1. Add to `site.json` a `subscribe` object with keys `placeholder`, `button`,
   `eyebrow`, `heading`, `headingEm`, `line`, `reassurance` — values taken
   from D4 in the gate block. (`headingEm` is the italicised word; the
   current template italicises the publish day.) If D4 is still PENDING,
   this task cannot start.
2. `subform.njk`: `placeholder="{{ site.subscribe.placeholder }}"`, button
   label defaults to `site.subscribe.button`.
3. `cta.njk`: eyebrow, `<h2>{{ site.subscribe.heading }} <em>{{ site.subscribe.headingEm }}</em>.</h2>`,
   panel line and the `fine` reassurance line all read from `site.subscribe`.
4. `lib/site.js`: require the seven keys to be non-empty strings, failing the
   build with the usual plain-English message style.

**Accept when.** Build passes; `grep -rn "you@company.com\|Join the list\|Subscribe free" src lib` is empty (all live in `site.json` only); blanking one key fails the build with a sentence naming it (test, restore).

**CLAUDE.md update.** Content rules: subscribe copy lives in
`site.json → subscribe`, authored by Tim, enforced non-empty.

---

## Task 5 — Constitution update

**Goal.** Make CLAUDE.md agree with the shipped site again, in one sweep,
after Tasks 1–4 are merged.

**Steps.** Re-read CLAUDE.md top to bottom against the live code. Beyond the
per-task notes above: the "design is finished" section keeps its force but
gains one line — "Revised August 2026 via DESIGN-REVIEW.md at Tim's request;
the palette, typefaces, portrait rules and email rules carried over
unchanged." Verify the Email rules section needed no edits (it must not
have). Update the Repo facts section only where it now states stale facts
(partials list, home structure, pill/filter styling).

**Accept when.** A fresh read of CLAUDE.md contains no statement contradicted
by the code; `git diff` touches only `.md` files.

---

## Order

1 (furniture) → 2 (index) → 3 (front page) → 4 (subscribe copy) → 5 (docs).
1 and 2 are independent; 3 assumes 1's CSS deletions; 4 is independent; 5 is
last. Any stalled PR blocks only its dependents.
