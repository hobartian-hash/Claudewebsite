/* Reads content/essays/*.md — the source of truth for the whole site.

   Every essay is validated as it loads, so a typo in the front matter
   fails the build with a sentence that says what to fix, rather than
   producing a page with "undefined" on it. */

const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const { parseBlocks } = require("./blocks");

const REQUIRED = ["title", "slug", "number", "topic", "date", "hook", "previewText"];

const WORDS_PER_MINUTE = 160;

/** Word count over the essay's blocks — markdown/quote text, figure cells joined. */
function countWords(blocks) {
  return blocks.reduce((total, block) => {
    const text = block.type === "figure" ? block.cells.join(" ") : block.text;
    const words = text.trim().split(/\s+/).filter(Boolean);
    return total + words.length;
  }, 0);
}

/** YAML turns a bare date into a Date at UTC midnight. We want "2026-08-09". */
function toISODate(value, where) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value.trim())) return value.trim();
  throw new Error(`${where}: date must be written as YYYY-MM-DD, e.g. 2026-08-09.`);
}

function loadEssay(dir, file, topics) {
  const where = `content/essays/${file}`;
  const { data, content } = matter(fs.readFileSync(path.join(dir, file), "utf8"));

  for (const key of REQUIRED) {
    if (data[key] === undefined || data[key] === "") {
      throw new Error(`${where}: front matter is missing "${key}".`);
    }
  }
  if (!Object.prototype.hasOwnProperty.call(topics, data.topic)) {
    throw new Error(
      `${where}: topic "${data.topic}" isn't one of ${Object.keys(topics).join(", ")}.`
    );
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) {
    throw new Error(`${where}: slug "${data.slug}" must be lowercase words joined by hyphens.`);
  }

  const blocks = parseBlocks(content, where);
  const readTime =
    data.readTime !== undefined
      ? Number(data.readTime)
      : Math.max(1, Math.round(countWords(blocks) / WORDS_PER_MINUTE));

  return {
    ...data,
    file,
    date: toISODate(data.date, where),
    number: Number(data.number),
    readTime,
    emailHook: data.emailHook || data.hook,
    previewText: data.previewText,
    blocks,
  };
}

/**
 * @returns {Array<object>} every essay, newest first by date
 */
function loadEssays(dir, topics) {
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md")).sort();
  if (!files.length) throw new Error(`No essays found in ${dir}.`);

  const essays = files.map((file) => loadEssay(dir, file, topics));

  const seen = new Map();
  for (const essay of essays) {
    if (seen.has(essay.slug)) {
      throw new Error(
        `Two essays share the slug "${essay.slug}": ${seen.get(essay.slug)} and ${essay.file}. ` +
          `Slugs become URLs, so they have to be unique.`
      );
    }
    seen.set(essay.slug, essay.file);
  }

  // Newest first. The home page's lead panel and the dateline both read [0].
  return essays.sort((a, b) => b.date.localeCompare(a.date));
}

module.exports = { loadEssays };
