#!/usr/bin/env node
/* =========================================================
   npm run email -- 001

   Reads content/essays/001-*.md and writes dist/email/001.html:
   one complete, paste-ready document. Open it in a browser to
   check it, then select all, copy, and paste into Buttondown.

   The email step ends with a file on disk. There is deliberately
   no API integration — nothing here can send anything.
   ========================================================= */

const fs = require("fs");
const path = require("path");
const nunjucks = require("nunjucks");

const { loadSite } = require("../lib/site");
const { loadEssays } = require("../lib/essays");
const { renderChunk, renderInline } = require("../lib/render-email");

const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "dist", "email");

const pad3 = (n) => String(n).padStart(3, "0");

/* ---------- pick the essay ---------- */

function pickEssay(essays, argument) {
  if (!argument) return essays[0]; // newest — the usual case on a Sunday

  const wanted = String(argument).trim();
  const byNumber = essays.find((e) => pad3(e.number) === pad3(wanted));
  if (byNumber) return byNumber;

  const bySlug = essays.find((e) => e.slug === wanted);
  if (bySlug) return bySlug;

  const available = essays.map((e) => `${pad3(e.number)}  ${e.title}`).join("\n  ");
  throw new Error(
    `No essay matches "${wanted}".\n\nEssays available:\n  ${available}\n\n` +
      `Use the issue number, e.g. npm run email -- ${pad3(essays[0].number)}`
  );
}

/* ---------- turn blocks into table rows ---------- */

function buildRows(essay) {
  const rows = [];

  for (const block of essay.blocks) {
    if (block.type === "markdown") {
      // 40px under the divider for the opening run, 32px after a figure
      // or a quote. Both numbers come from the tested v2 template.
      rows.push({ type: "prose", html: renderChunk(block.text), pad: rows.length ? 32 : 40 });
    } else if (block.type === "quote") {
      rows.push({ type: "quote", html: renderInline(block.text) });
    } else {
      rows.push({
        type: "figure",
        title: block.title,
        cells: block.cells,
        active: block.active,
        caption: block.caption ? renderInline(block.caption) : "",
      });
    }
  }

  return rows;
}

/* ---------- render ---------- */

const BODY_TEMPLATE = `{% from "email/blocks.njk" import prose, quote, figure %}
{%- for row in rows %}
{% if row.type == 'prose' %}{{ prose(row.html, row.pad, row.signoff) }}
{%- elif row.type == 'quote' %}{{ quote(row.html) }}
{%- elif row.type == 'figure' %}{{ figure(row.title, row.cells, row.active, row.caption) }}
{%- endif %}
{%- endfor %}`;

function build(argument) {
  const site = loadSite(path.join(ROOT, "content/site.json"));
  const essays = loadEssays(path.join(ROOT, "content/essays"), site.topics);
  const essay = pickEssay(essays, argument);

  const rows = buildRows(essay);

  // The sign-off lives inside the final prose cell, not in a row of its own —
  // but only if prose is what the essay actually ends with. An essay ending on
  // a quote or a figure gets a cell of its own, so the sign-off stays last.
  const signoff = `${site.signoff} ${site.author}`.trim();
  const last = rows[rows.length - 1];
  if (last && last.type === "prose") last.signoff = signoff;
  else rows.push({ type: "prose", html: "", pad: 32, signoff });

  const env = new nunjucks.Environment(
    new nunjucks.FileSystemLoader(path.join(ROOT, "src/_includes")),
    { autoescape: true, trimBlocks: false, lstripBlocks: false }
  );

  const context = {
    site,
    essay,
    essayUrl: `${site.baseUrl}/essays/${essay.slug}/`,
    rows,
  };

  const html =
    env.render("email/head.njk", context) +
    env.renderString(BODY_TEMPLATE, context) +
    "\n" +
    env.render("email/foot.njk", context);

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const outFile = path.join(OUT_DIR, `${pad3(essay.number)}.html`);
  fs.writeFileSync(outFile, html, "utf8");

  return { essay, outFile, html };
}

/* ---------- run ---------- */

try {
  const { essay, outFile, html } = build(process.argv[2]);
  const rel = path.relative(process.cwd(), outFile);

  console.log(`\n  Issue ${pad3(essay.number)} — ${essay.title}`);
  console.log(`  Written to ${rel}  (${(html.length / 1024).toFixed(1)} KB)\n`);
  console.log(`  1. Open ${rel} in a browser and read it through.`);
  console.log(`  2. Select all, copy, and paste into Buttondown's editor.`);
  console.log(`  3. Subject line:  ${essay.title}`);
  console.log(`     Preview text:  ${essay.previewText}\n`);

  if (/SUBDOMAIN\.netlify\.app/.test(html)) {
    console.log(`  Heads up: links still point at the placeholder domain.`);
    console.log(`  Set "baseUrl" in content/site.json before you send.\n`);
  }
} catch (error) {
  console.error(`\n  ${error.message}\n`);
  process.exit(1);
}
