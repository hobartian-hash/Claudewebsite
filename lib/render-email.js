/* =========================================================
   EMAIL RENDERER — markdown side

   Turns a markdown chunk into inline-styled HTML that can sit
   inside one of the email's <td> cells. The table scaffolding
   around it lives in src/_includes/email/, where it can be
   diffed against the tested v2 template.

   Everything is inline styles because Buttondown's free plan
   strips the <head>. See the header comment in the email
   template for the full story. Do not "tidy this up" into
   classes — it stops rendering in Outlook if you do.
   ========================================================= */

const MarkdownIt = require("markdown-it");

const INK = "#26241F";
const SOFT = "#6B665D";
const LINE = "#DDD8CF";
const BRASS = "#C08A3E";
const ACCENT = "#3F6E8C";
const SERIF = "'Newsreader',Georgia,'Times New Roman',serif";
const UI = "'Plus Jakarta Sans',Helvetica,Arial,sans-serif";

const md = new MarkdownIt({
  html: true,
  linkify: false,
  typographer: false,
});

/* Loose lists wrap each item's text in <p>. Inside our list markup that
   would nest a <p> in a <p>. Mark those paragraphs hidden so the rules
   below skip them, exactly as markdown-it already does for tight lists. */
md.core.ruler.push("email_flatten_list_paragraphs", (state) => {
  let depth = 0;
  for (const token of state.tokens) {
    if (token.type === "list_item_open") depth++;
    else if (token.type === "list_item_close") depth--;
    else if (depth > 0 && (token.type === "paragraph_open" || token.type === "paragraph_close")) {
      token.hidden = true;
    }
  }
});

md.renderer.rules.paragraph_open = (tokens, idx) =>
  tokens[idx].hidden ? "" : `<p style="margin:0 0 24px 0;">`;
md.renderer.rules.paragraph_close = (tokens, idx) => (tokens[idx].hidden ? "" : `</p>`);

// Note the shorter font stack: v2's subheadings drop 'Times New Roman'
// where the body copy keeps it. Matched deliberately, not an oversight.
md.renderer.rules.heading_open = () =>
  `<h2 style="margin:38px 0 18px 0; font-family:'Newsreader',Georgia,serif; font-weight:600;` +
  ` font-size:23px; line-height:1.3; color:${INK};">`;
md.renderer.rules.heading_close = () => `</h2>`;

md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  tokens[idx].attrSet("style", `color:${ACCENT};`);
  return self.renderToken(tokens, idx, options);
};

/* Bullets. No essay uses one yet, but the block type shouldn't be a
   landmine mid-write. Plain paragraph rows with a brass bullet — no <ul>,
   because list indentation is one of the things Outlook gets wrong. */
md.renderer.rules.bullet_list_open = () => "";
md.renderer.rules.bullet_list_close = () => "";
md.renderer.rules.ordered_list_open = () => "";
md.renderer.rules.ordered_list_close = () => "";
md.renderer.rules.list_item_open = () =>
  `<p style="margin:0 0 14px 0;"><span style="color:${BRASS};">&bull;</span>&nbsp;&nbsp;`;
md.renderer.rules.list_item_close = () => `</p>`;

/* Tables. Cells carry no fill at all, and the header row is told apart by
   brass uppercase type rather than by being darker — a fill would collapse
   toward the cell beside it the moment a client force-inverts the email.
   Borders are the hairline, which survives inversion in every client tested.
   Explicit cellpadding/cellspacing/border attributes are for Outlook, which
   ignores border-collapse and draws its own 3D border without them. */
/* Which column a cell is in. markdown-it emits cells in document order, so
   counting from the row that opened them is enough, and it keeps the column
   rule off the first column's left edge. */
const columnOf = (tokens, idx) => {
  let column = 0;
  for (let i = idx - 1; i >= 0; i--) {
    if (tokens[i].type === "tr_open") break;
    if (tokens[i].type === "th_open" || tokens[i].type === "td_open") column++;
  }
  return column;
};

const cellRule = (tokens, idx) =>
  columnOf(tokens, idx) > 0 ? ` border-left:1px solid ${LINE};` : "";

md.renderer.rules.table_open = () =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"` +
  ` style="width:100%; margin:0 0 24px 0; border-collapse:collapse;` +
  ` font-family:${UI}; font-size:15px; line-height:1.45; color:${INK};">`;
md.renderer.rules.table_close = () => `</table>`;

md.renderer.rules.th_open = (tokens, idx) =>
  `<th align="left" width="50%" style="padding:0 14px 10px 14px;` +
  ` border-bottom:1px solid ${LINE};${cellRule(tokens, idx)}` +
  ` font-family:${UI}; font-size:11px; font-weight:700; letter-spacing:1.5px;` +
  ` text-transform:uppercase; color:${SOFT}; text-align:left;">`;
md.renderer.rules.th_close = () => `</th>`;

md.renderer.rules.td_open = (tokens, idx) =>
  `<td align="left" valign="top" width="50%" style="padding:14px;` +
  ` border-bottom:1px solid ${LINE};${cellRule(tokens, idx)}` +
  ` font-family:${UI}; font-size:15px; line-height:1.45; color:${INK}; text-align:left;">`;
md.renderer.rules.td_close = () => `</td>`;

/* Inside a table cell the bold lead-in is a label sitting above its line, so
   it gets a hard break after it — not display:block, which Word's engine
   ignores on an inline element. Everywhere else bold stays inline, which is
   what an essay means by it. Rendering is synchronous, so a flag is enough to
   tell the two cases apart. */
let inCell = false;
const setCell = (open) => (rule) => (...args) => {
  inCell = open;
  return rule(...args);
};
md.renderer.rules.td_open = setCell(true)(md.renderer.rules.td_open);
md.renderer.rules.td_close = setCell(false)(md.renderer.rules.td_close);

md.renderer.rules.strong_open = () => (inCell ? `<strong style="color:${INK};">` : "<strong>");
md.renderer.rules.strong_close = () => (inCell ? "</strong><br />" : "</strong>");

/** A markdown chunk -> the inner HTML of a prose <td>. */
const renderChunk = (text) => md.render(text).trim();

/** A single line of text (quote, caption) -> inline HTML. */
const renderInline = (text) => md.renderInline(text).trim();

module.exports = { renderChunk, renderInline };
