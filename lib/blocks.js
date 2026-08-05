/* =========================================================
   BLOCK PARSER

   Splits an essay body into an ordered list of blocks. This is
   the single source of truth for the two custom authoring tags,
   so the website and the email can never drift apart on what
   `{% quote %}` or `{% figure %}` mean.

   Block shapes:
     { type: "markdown", text }
     { type: "quote",    text }
     { type: "figure",   title, cells, active, caption }

   `active` is stored 0-indexed here. In the markdown it is
   written 1-indexed, because "the second cell" should be 2.
   ========================================================= */

// {% quote %} ... {% endquote %}  and  {% figure ...attrs %} ... {% endfigure %}
// The \1 backreference makes one pattern handle both tags and keeps
// an unclosed tag from swallowing the rest of the essay.
const BLOCK_RE = /\{%\s*(quote|figure)\b([\s\S]*?)%\}([\s\S]*?)\{%\s*end\1\s*%\}/g;

// name="value" | name='value' | name=bare
const ATTR_RE = /([A-Za-z_][\w-]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s,]+))/g;

function parseAttrs(source) {
  const out = {};
  let m;
  ATTR_RE.lastIndex = 0;
  while ((m = ATTR_RE.exec(source)) !== null) {
    out[m[1]] = m[2] !== undefined ? m[2] : m[3] !== undefined ? m[3] : m[4];
  }
  return out;
}

function fail(where, message) {
  throw new Error(`${where}: ${message}`);
}

function buildFigure(attrs, body, where) {
  const cells = body
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (cells.length !== 4) {
    fail(
      where,
      `a {% figure %} needs exactly four lines, one per cell — found ${cells.length}. ` +
        `The figure is a fixed 2x2; it has nowhere to put a fifth.`
    );
  }

  const active = attrs.active === undefined ? 0 : Number(attrs.active);
  if (attrs.active !== undefined && !(Number.isInteger(active) && active >= 1 && active <= 4)) {
    fail(where, `{% figure active="${attrs.active}" %} must be a whole number from 1 to 4.`);
  }

  return {
    type: "figure",
    title: attrs.title || "",
    caption: attrs.caption || "",
    cells,
    active: attrs.active === undefined ? -1 : active - 1, // -1 = no cell highlighted
  };
}

/**
 * @param {string} source  essay body, front matter already removed
 * @param {string} where   a filename, used in error messages
 * @returns {Array<object>} blocks in document order
 */
function parseBlocks(source, where = "essay") {
  const blocks = [];
  let cursor = 0;
  let m;

  BLOCK_RE.lastIndex = 0;
  while ((m = BLOCK_RE.exec(source)) !== null) {
    const [full, tag, attrSource, body] = m;

    const before = source.slice(cursor, m.index);
    if (before.trim()) blocks.push({ type: "markdown", text: before.trim() });
    cursor = m.index + full.length;

    if (tag === "quote") {
      const text = body.trim();
      if (!text) fail(where, "an empty {% quote %} block.");
      blocks.push({ type: "quote", text });
    } else {
      blocks.push(buildFigure(parseAttrs(attrSource), body, where));
    }
  }

  const tail = source.slice(cursor);
  if (tail.trim()) blocks.push({ type: "markdown", text: tail.trim() });

  // Catch a tag that was opened and never closed — the regex above would
  // silently leave it sitting in a markdown block, where it renders as
  // literal "{% quote %}" on the page.
  for (const block of blocks) {
    if (block.type !== "markdown") continue;
    const orphan = block.text.match(/\{%\s*(end)?(quote|figure)\b/);
    if (orphan) {
      fail(where, `unmatched {% ${orphan[1] || ""}${orphan[2]} %} tag — check it has a matching open and close.`);
    }
  }

  return blocks;
}

module.exports = { parseBlocks };
