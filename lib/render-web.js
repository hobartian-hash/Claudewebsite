/* =========================================================
   WEB RENDERER

   Blocks -> the markup the mockup produced. All styling lives
   in src/css/style.css; nothing here carries inline styles.
   ========================================================= */

const MarkdownIt = require("markdown-it");

const md = new MarkdownIt({
  html: true,
  linkify: false,
  typographer: false, // the essays are already typed with real em dashes
});

const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function quote(block) {
  return `<blockquote>${md.renderInline(block.text)}</blockquote>`;
}

function figure(block) {
  const cells = block.cells
    .map((cell, i) => {
      const cls = i === block.active ? ' class="active"' : "";
      return `<div${cls}><b>${i + 1}</b><span>${esc(cell)}</span></div>`;
    })
    .join("");

  return [
    `<figure class="gridfig">`,
    block.title ? `<div class="t">${esc(block.title)}</div>` : "",
    `<div class="fourbox">${cells}</div>`,
    block.caption ? `<figcaption>${esc(block.caption)}</figcaption>` : "",
    `</figure>`,
  ]
    .filter(Boolean)
    .join("\n");
}

/* An essay that opens on dialogue puts a quotation mark inside the drop cap,
   because ::first-letter always takes the punctuation in front of the letter
   with it. Marking that paragraph lets the stylesheet hang the mark out in
   the margin, so the capital still lines up with the column beneath it.
   Anything else and the cap is left exactly where it was. */
const OPENS_ON_QUOTE = /^<p>(?:&quot;|["'“‘])/;

function markQuoteOpening(html) {
  return OPENS_ON_QUOTE.test(html) ? html.replace("<p>", '<p class="dropquote">') : html;
}

/**
 * @param {Array<object>} blocks from lib/blocks.js
 * @returns {string} the inner HTML of the essay's .prose container
 */
function renderWeb(blocks) {
  let first = true;

  return blocks
    .map((block) => {
      if (block.type === "markdown") {
        const html = md.render(block.text).trim();
        const out = first ? markQuoteOpening(html) : html;
        first = false;
        return out;
      }
      first = false;
      if (block.type === "quote") return quote(block);
      if (block.type === "figure") return figure(block);
      return "";
    })
    .filter(Boolean)
    .join("\n");
}

module.exports = { renderWeb, md };
