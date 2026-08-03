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
const BRASS = "#C08A3E";
const ACCENT = "#3F6E8C";
const SERIF = "'Newsreader',Georgia,'Times New Roman',serif";

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

/** A markdown chunk -> the inner HTML of a prose <td>. */
const renderChunk = (text) => md.render(text).trim();

/** A single line of text (quote, caption) -> inline HTML. */
const renderInline = (text) => md.renderInline(text).trim();

module.exports = { renderChunk, renderInline };
