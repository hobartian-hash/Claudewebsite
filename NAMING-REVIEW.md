# On Purpose — Name, Taglines and Positioning Review

*Written 17 August 2026 at Tim's request, as the second half of the design
engagement. `DESIGN-REVIEW.md` covered how the site looks and is built. This
covers what it's called and what it says about who Tim is and why he writes.*

*Nothing in this document has been applied. Naming and authored copy are Tim's
alone. Decisions are gated at the end.*

---

## 1. The finding

**The site is named after the moral of the story. The essays are about the
drift.**

Read the five hooks in order — they are the best writing on the site, and they
are all doing the same thing:

| # | Hook | What it's actually about |
|---|---|---|
| 001 | "Five months in, I should have been at step three. I was back at two — and nobody was ever going to tell me." | Slid back without noticing |
| 002 | "Imprint is what you pass on anyway. A blessing is what you pass on on purpose." | What you hand over unintentionally |
| 003 | "His silence was meant to protect the relationship. It was producing the exact harm he was trying to avoid." | Intention inverted by effect |
| 004 | "I spent two months teaching people how to run their inbox, while quietly not running mine." | The gap between teaching and doing |
| 005 | "Every conversation I softened felt like kindness at the time. The bill arrived years later, and it didn't come to me." | A cost discovered far too late |

Every one is about the distance between what someone meant and what actually
happened, noticed afterwards, usually at somebody else's expense. That is the
territory. It is specific, uncomfortable and genuinely unusual.

"On Purpose" names the destination. The writing is about being lost — and it
is good *because* it doesn't lead with the lesson. The masthead does exactly
what the prose is careful never to do: it announces the moral before the story
starts.

Tim's own better line is already in the config, in `aboutMore` paragraph three:

> **Drift is free. Everything worth having has to be chosen out loud.**

That is the thesis. It names the tension rather than the resolution, and it is
currently buried in the third paragraph of a secondary page.

## 2. The name has a hard practical problem as well

"On Purpose" is occupied — and occupied specifically in Tim's lane.

- **[On Purpose with Jay Shetty](https://podcasts.apple.com/us/podcast/on-purpose-with-jay-shetty/id1450994021)** — one of the largest health and personal-growth podcasts in the world, two episodes a week. This alone owns the search term.
- **[On Purpose, by John Coleman](https://onpurpose.substack.com/)** — a Substack newsletter on *leadership and living with purpose*. Same name, same format, overlapping subject.
- **[On Purpose, by Melissa Cullens](https://onpurposeproject.substack.com/)** — a Substack of essays on work and living well. Same name, same format, overlapping subject.
- **[onpurpose.org](https://onpurpose.org/en/)** — a leadership-development social enterprise (London, Paris, Berlin) running coaching and leadership programmes since 2009.
- **[On Purpose Leadership](https://www.onpurposeleadership.co/)**, **[On Purpose Teams](https://onpurposeteams.com/)**, **[On Purpose Planning & Consulting](https://www.onpurposeplanningandconsulting.com/)** — coaching and consulting businesses.
- **[People on Purpose Tasmania](https://peopleonpurpose.com.au/)** — an HR and people consultancy **in Tim's own state**, near-identical name, adjacent market.

For a newsletter that grows by being forwarded and mentioned, an unsearchable
name is a permanent tax. Someone who hears "you should read Tim's thing, On
Purpose" will not find it. They will find a monk.

## 3. "Purpose" is also the wrong register

The word carries corporate-wellness freight: purpose-driven, find your
purpose, purpose-washing, the LinkedIn-inspirational genre. It signals exactly
the kind of writing Tim is not doing.

A reader arriving at *On Purpose · Essays by Tim* braces for affirmations.
What they actually get is a man explaining that he mishandled someone's career
for two and a half years and only understood it a decade later. The name
undersells and mis-sells at the same time: it promises the very thing his
writing is better than.

## 4. "Tim" is a mistake, and the cheapest one to fix

The site is first-name-only throughout: `author: "Tim"`, the strapline
"Essays by Tim", "About Tim", "Hello, I'm Tim.", "© 2026 Tim".

He is **Tim Hynes** — Sector Lead for Health, Aged Care and Not for Profit;
[2PM Services](https://2pm.com.au/team/tim-hynes/); teaching productivity
since 2014; the LinkedIn profile already linked in the footer. Traffic will
arrive from LinkedIn, where he is fully named and credentialled.

Three costs:

1. **Unsearchable.** A reader moved by an essay has nothing to type into
   Google. For a consultant and coach, the essays *are* the top of the
   funnel, however much the site refuses to behave like one.
2. **Reads as either a mononym or an anonymous blog**, and it isn't the first.
3. **It's inconsistent with the writing's own ethics.** The essays name real
   people generously — Daniel Sih, Fathering Adventures, Darren and Mel, Kate,
   Isla. The one person anonymised is the author. In 005 he goes out of his
   way to protect "Greg" by changing his name. Standing behind your own is the
   same instinct.

There is no upside to holding this back. It is a one-line config change.

## 5. The three top-level descriptions all say one abstract thing

- **Hero:** "Drift is free. Everything else you do on purpose."
- **Lede:** "One short essay every Sunday morning on work, fathering, and the things that never happen unless somebody decides they will."
- **Meta description:** "One short essay every Sunday about the things that only happen deliberately — at work, at home, and in the gap between the two."

Three restatements of *deliberateness*. The abstraction repeats; the
specificity never arrives. "The things that never happen unless somebody
decides they will" is twelve words that "Drift is free" says in three, better.

Nobody subscribes to deliberateness. They subscribe to the bill arriving years
later and going to someone else.

The one genuinely great phrase in the set — **"the gap between the two"** —
sits in third position in the meta description, where no reader ever sees it.

## 6. Line-by-line — every string, and what it's doing

Marked ✗ (replace), ~ (weak, worth revisiting), ✓ (keep).

| Where | Current | Verdict |
|---|---|---|
| `wordmark` | On Purpose | ✗ Crowded; names the moral (§1–3) |
| `strapline` | Essays by Tim | ✗ Dead weight — repeats the byline, wastes prime space, omits the surname |
| `author` | Tim | ✗ Should be Tim Hynes (§4) |
| Hero motto | Drift is free. Everything else you do on purpose. | ~ Great first half; second half restates the wordmark. The `aboutMore` version is stronger |
| Hero lede | …things that never happen unless somebody decides they will | ✗ Abstract; doesn't describe an actual essay |
| `description` | …things that only happen deliberately — at work, at home, and in the gap between the two | ~ Best phrase buried at the end |
| CTA heading | Something worth reading on a Sunday. | ✗ True of every newsletter ever written |
| CTA line | One essay a week. Free, and easy to leave. | ✓ Honest, specific, on-voice |
| Button | Subscribe free | ✗ Growth copy (already flagged, D4) |
| Placeholder | you@company.com | ✗ LinkedIn-creator DNA on a site half about fathering |
| `about` opening | I'm a consultant, a coach and a father, based in Hobart. | ~ A role list where the reason should be |
| `aboutMore` ¶2 | Teaching something for years doesn't stop you drifting. It mostly just makes it easier to notice. | ✓ **The best sentence on the site** — and it's buried |
| `aboutMore` ¶3 | Drift is free. Everything worth having has to be chosen out loud. | ✓ The actual thesis — also buried |
| Welcome lede | One essay, Sunday mornings. Nothing else, and one click to leave whenever you've had enough. | ✓ Perfect. This is the voice |
| `signoff` | Cheers, | ✓ |

**The pattern:** the further from the front page, the better the writing gets.
The best lines are all in `aboutMore` and `welcome`, where Tim was writing
prose. The weakest are in the hero and CTA, where he was writing *marketing*.
The fix is mostly promotion, not composition — he has already written the
words.

## 7. What I'd put on the front page instead

Drafts only. Tim writes the final strings; these exist to be reacted to.

**Strapline** — carry the person, since the dateline already carries the place:
> Tim Hynes · one essay, Sunday mornings

**Hero lede** — describe what actually happens in an essay:
> One short essay every Sunday, usually about something I only noticed
> afterwards — at work, at home, and in the gap between the two.

**Meta description** — same job, for search and share cards:
> One short essay every Sunday from Tim Hynes in Hobart, about the distance
> between what you meant and what actually happened.

**CTA heading** — make an actual claim, in the letterbox register:
> It arrives Sunday, and it doesn't ask you for anything.

**About opening** — lead with the reason, then the résumé:
> Teaching something for years doesn't stop you drifting. It mostly just makes
> it easier to notice. I'm a consultant, a coach and a father, based in
> Hobart…

(Every one of those sentences except the CTA is already Tim's, moved.)

## 8. If the name changes — the shortlist

All drawn from his own words, all collision-checked on 17 August 2026.

**A. Chosen Out Loud** — *recommended.*
From "Everything worth having has to be chosen out loud." Same idea as "On
Purpose" without the wellness freight; active rather than aspirational; a
phrase rather than a category. No collision found in newsletters, blogs or
podcasts. Risk: slightly abstract standing alone — needs the strapline to say
what it is.

**B. Letterbox** — *strongest on ethos.*
From essay 004. A letterbox is literally where the thing arrives, and the
essay's whole argument — earn the inbox, don't perform in the lounge room — is
the brand in one word. Short, plain, Australian. Risk: one small Substack
([Letterbox: Bookish & Filmish](https://helenwalsh.substack.com/)) in a
different genre; and it says nothing about the subject.

**C. The Gap Between** — from his own best buried phrase, and a literal
description of every essay. Risk: common construction; check carefully.

**D. Easier to Notice** — from the best sentence on the site. Names what he
actually does: notice late, and say so. Risk: soft, easy to mishear as a
productivity brand.

**E. Keep "On Purpose", fix everything around it** — the minimum-change path.
Add the surname, replace the strapline, rewrite the three descriptions. Solves
the voice problems (§4–7) and none of the discoverability ones (§2). Wholly
legitimate if Tim is attached to the name — but he should choose it knowingly,
not by default.

**Rejected: "Drift" / "Drift Is Free"** as a wordmark. Tempting, and it is the
thesis — but [The Drift](https://www.thedriftmag.com/) is an established
literary magazine with a Substack. Keep the line, don't take it as the name.

## 9. The timing argument — this is the cheap moment

`hideFromSearch` is `true`. There is no custom domain yet. The essay dates are
placeholders. `readerCount` is empty. **The site has not launched.**

A rename today is a change to about eight strings in one file
(`content/site.json`) and a favicon that doesn't reference the name anyway.
The same rename in three months means a domain already bought, subscribers who
signed up to something else, LinkedIn posts pointing at a dead wordmark, and
an archive of emails with the old masthead.

Whatever Tim decides, he should decide it **before** the domain is bought.
That is the fork in the road, and it is a month away.

## 10. Decisions — answered by Tim, 17 August 2026

**N1 — Chosen Out Loud** (option A). **N2 — yes, Tim Hynes everywhere.**
**N3 — "Tim Hynes · one essay, Sunday mornings."** **N4 — all three drafts
approved as written.** **N5 — (c): topics dropped for now**, archive goes
chronological, to be revisited when there is more to categorise.

Recorded here for the archive; the executable form lives in the decisions
table at the top of `REDESIGN-PLAN.md` (Tasks 4, 5 and 6).

One consequence worth noting, because it is a happy one: with the name coming
from *"everything worth having has to be chosen out loud"*, the hero motto
stops being a restatement of the wordmark and starts being its explanation.
The old second half — "everything else you do on purpose" — is replaced by the
sentence the name was taken from, so the masthead now justifies itself.

The original wording of the decisions follows.

### As originally put

- **N1 — The name.** Keep "On Purpose" (§8E), or change it (§8A–D)? If
  changing, check the final candidate for collisions and domain availability
  before committing.
- **N2 — The surname.** Recommendation: `author` becomes "Tim Hynes"
  everywhere. Any reason to hold it back?
- **N3 — The strapline.** Replace "Essays by Tim" with what?
- **N4 — The three descriptions.** Approve, edit or reject the §7 drafts.
- **N5 — The topics** (raised, not decided — CLAUDE.md says five topics are
  fixed and this is an open question, not a unilateral call). Work, Coaching
  and Career are three slices of one domain, and with five essays some topics
  hold a single item. More pointedly, the About page argues *"I've stopped
  trying to keep those separate, because the same thing is going on in both"* —
  while the nav insists there are five separate things. Worth a conversation:
  three topics, or none at all with the archive simply chronological?

---

*Implementation note for a future session: none of this is executable yet.
Once N1–N4 are answered, the work is small and belongs in Task 4 of
`REDESIGN-PLAN.md` (subscribe copy) plus a sibling task for the wordmark,
strapline, author and descriptions — all of it inside `content/site.json`,
except the hero and CTA strings currently hard-coded in `home.njk` and
`cta.njk`, which should move into config at the same time. Haiku 4.5 is
sufficient. No essay prose is touched.*
