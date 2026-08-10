# On Purpose

The website and email machinery for **On Purpose** — one short essay every
Sunday, by Tim, in Hobart.

You write one file. The website and the email both come out of it.

---

## The two commands

Everything you do each week is one of these two.

```
npm run build              builds the website
npm run email -- 005       writes the email for issue 005
```

There's a third one for when you're writing:

```
npm start                  opens the site on your own machine so you can look at it
```

`npm start` prints a web address (usually `http://localhost:8080`). Open it in
a browser. Leave it running while you write — it reloads by itself every time
you save. Press `Ctrl + C` in the terminal to stop it.

---

## Publishing an essay, start to finish

### 1. Write the essay

Make a new file in `content/essays/`. Name it with the issue number and the
slug, like the ones already there:

```
content/essays/005-the-thing-i-noticed.md
```

Copy an existing essay to start from — that's the easiest way to get the top
part right. The top part looks like this:

```yaml
---
title:       "The thing I noticed"
slug:        "the-thing-i-noticed"
number:      5
topic:       "coaching"
date:        2026-09-06
hook:        "The one-line version, as it appears on the website."
emailHook:   "The shorter one-line version, for the top of the email."
previewText: "The grey line that shows next to your subject line in the inbox."
---
```

What each line does:

| Field | What it is |
|---|---|
| `title` | The headline. Used everywhere, including as the email subject. |
| `slug` | The web address. Lowercase words joined by hyphens, no spaces. |
| `number` | The issue number. Shows as "Issue No. 005". |
| `topic` | One of five, exactly: `work`, `coaching`, `career`, `fathering`, `offclock` |
| `date` | Year-month-day. The newest date becomes the lead story on the home page. |
| `hook` | The one-liner on the website. Can run a bit long. |
| `emailHook` | The trimmed version for the email. Leave it out and it uses `hook`. |
| `previewText` | The inbox preview line. **Write this one properly** — it does more for whether people open the email than anything else. Leave it out and it uses `emailHook`. |
| `readTime` | Optional. Leave it out and it's worked out from the word count. Add it to set your own number instead. |

Below that, write the essay. Plain writing, a blank line between paragraphs.

- A subheading is a line starting with `## `
- *Italics* are `*words between single stars*`
- **Bold** is `**words between double stars**`
- A link is `[the words you see](https://the-address.com)`
- A bulleted list is lines starting with `- `

Keep paragraphs short. Two to four sentences is the house style, on the
website as well as in the email.

### 2. Two special blocks

**A pull quote:**

```
{% quote %}I have no current issues with the system.{% endquote %}
```

**A 2×2 figure**, for models and squares:

```
{% figure title="The apprenticeship square", active=2,
   caption="Five months in, we should have been at step three. I was back at two." %}
I do, you watch
I do, you help
You do, I help
You do, I watch
{% endfigure %}
```

Exactly four lines between the tags, one per cell, reading left to right then
top to bottom. `active` is which cell gets highlighted — `1` is the first cell,
`4` is the last. `title` and `caption` are both optional.

### 3. Check it on the website

Run `npm start` and look at it. The essay appears on the home page, in the
archive, under its topic, and at its own address.

### 4. Put it live

Save your work to GitHub — commit and push. Netlify notices the push, rebuilds
the site by itself, and it's live in about a minute. There is nothing to click.

### 5. Make the email

```
npm run email -- 005
```

That writes `dist/email/005.html` and prints your subject line and preview text
back at you.

1. Open `dist/email/005.html` in a browser and read it through.
2. Select all (`Cmd + A`), copy (`Cmd + C`).
3. In Buttondown, make a new email, switch the editor to HTML mode, and paste.
4. Paste the subject line and the preview text into their boxes.
5. Send yourself a test first. Always. Check it on your phone.

If you leave the number off — just `npm run email` — it does the newest essay,
which is usually the one you want.

---

## Things you'll want to change eventually

All of these live in **`content/site.json`**. That file and the `content/essays/`
folder are the only two things you ever need to open.

### Letting Google find the site

Until you're ready to launch, the site asks search engines not to list it:

```json
"hideFromSearch": true
```

Anyone you send the link to can still read everything — this only affects
whether the site turns up in search results.

On launch day, change it to `false` and push. That's the whole job.

A word on how this works, so it isn't a mystery: search engines find sites by
following links from other sites. Nothing links to yours yet, so nobody was
going to stumble on it anyway. This setting is the belt to that braces, and it
matters from the moment you first post the link anywhere.

### Connecting the subscribe forms

Right now the forms on the site don't go anywhere. If someone types their
address in, the page tells them plainly that nothing was sent — it never
pretends to have worked.

To connect them: in Buttondown, find the embeddable form and copy the web
address out of its `action="..."`. Paste that into `subscribeEndpoint`:

```json
"subscribeEndpoint": "https://buttondown.com/api/emails/embed-subscribe/your-name"
```

Push, and the forms start working.

Once someone signs up they stay on your site, and a short line appears under
the box. You can change what it says:

```json
"subscribeNote": "Almost there — check your inbox to confirm."
```

Word it to match your Buttondown setting. If you have confirmation emails
switched **on** (Buttondown's default), the wording above is right — they still
have to click a link in an email before they're really on the list. If you've
switched confirmation **off**, something like `"You're on the list. See you
Sunday."` is more accurate.

### The welcome page

When someone clicks the confirm link in Buttondown's email, they land on
`/welcome/` — a short page that says they're in, sets expectations, and points
them at three essays to read now. It has no subscribe box on it, deliberately.

To make Buttondown send them there, set its confirmation redirect to:

```
https://on-purpose-tim.netlify.app/welcome/
```

In Buttondown that's under **Settings → Subscribing**. If there's no field for
it on that screen, the setting is called `subscription_confirmation_redirect_url`
and Buttondown's support will set it for you.

The wording on the page lives in the `welcome` section of this file — heading,
the line underneath, and the two paragraphs in the panel. Change it freely.

The page stays out of search results permanently, even after launch, because it
only makes sense to someone arriving from that email.

### Swapping in a real domain

When you have a domain, change one line in `content/site.json`:

```json
"baseUrl": "https://onpurpose.com.au"
```

That's the whole job. Every link in the email that points back at the website
picks it up. Point the domain at Netlify in their control panel and you're done.
No file anywhere else has the address written into it.

### Adding your photo

Put the image file in `src/static/` — say `tim.jpg` — and set:

```json
"photo": "/tim.jpg"
```

Leave it empty and you get the lettered circle, which is what the design was
built for. It is not a placeholder.

### Other things in that file

`readerCount` ("Read by 400+ consultants") shows on the home page once you set
it, and stays hidden while it's empty. `socials`, `about`, `aboutMore` and
`topicNotes` are all plain text you can edit freely.

---

## If something goes wrong

The build tells you what's wrong in a whole sentence, and names the file. For
example:

```
content/essays/005-the-thing.md: front matter is missing "previewText".
content/essays/005-the-thing.md: topic "leadership" isn't one of work, coaching, career, fathering, offclock.
content/essays/005-the-thing.md: a {% figure %} needs exactly four lines, one per cell — found 3.
```

Fix the file it names and run the command again. Nothing gets published while
a build is failing, so a mistake here can't reach the website.

---

## What's in this folder

You only ever need `content/`. The rest is here so you know what it's for.

```
content/
  essays/        one markdown file per essay — the source of truth
  site.json      everything about the site that isn't an essay
src/
  _includes/     the page templates, and the email template
  css/           the design, as one stylesheet
  js/            the reading progress bar, and the subscribe forms
  static/        images, if you ever add one
lib/             shared code: reads the essays, turns them into web and email
scripts/         the email builder
.eleventy.js     build settings
netlify.toml     deploy settings
```

Built files go to `_site/` (the website) and `dist/email/` (the emails). Both
are rebuilt from scratch every time, so there's never any reason to edit them —
edit the essay and run the command again.

---

## A few decisions worth knowing about

**The email code looks like it's from 2004.** Tables and inline styles, on
purpose. Outlook renders email using Microsoft Word's engine and ignores most
modern web code. If someone offers to tidy it up, say no.

**The highlighted cell in the 2×2 is brass in the email, dark on the website.**
Not a slip. Buttondown's free plan strips out the part of the email that
controls colour, so mail apps invert the whole thing. A dark cell inverts to
roughly the same grey as the light cells and the highlight vanishes. Brass is a
mid-tone and survives. The website controls its own colours, so it keeps the
dark fill.

**There are no photographs anywhere.** That's the design, not an unfinished
job. The only image the site will ever want is your face.

**The archive's topic buttons are real links to real pages.** They work with
JavaScript switched off, and search engines can read them.
