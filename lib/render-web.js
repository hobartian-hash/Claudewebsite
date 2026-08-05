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

/* Every link opens in a new tab, so a reader mid-essay never loses their
   place. rel="noopener noreferrer" is the required companion to target
   _blank — without it the opened page can reach back at this one. */
md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  tokens[idx].attrSet("target", "_blank");
  tokens[idx].attrSet("rel", "noopener noreferrer");
  return self.renderToken(tokens, idx, options);
};

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

/**
 * @param {Array<object>} blocks from lib/blocks.js
 * @returns {string} the inner HTML of the essay's .prose container
 */
function renderWeb(blocks) {
  return blocks
    .map((block) => {
      if (block.type === "markdown") return md.render(block.text).trim();
      if (block.type === "quote") return quote(block);
      if (block.type === "figure") return figure(block);
      return "";
    })
    .filter(Boolean)
    .join("\n");
}

module.exports = { renderWeb, md };
