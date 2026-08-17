/* =========================================================
   ELEVENTY CONFIG

   Deliberately small. The essays are loaded by src/_data/essays.js
   and rendered by lib/, so there is nothing clever happening here —
   just filters, a couple of copied folders, and the output paths.
   ========================================================= */

module.exports = function (eleventyConfig) {
  /* CSS and JS are copied straight through. No bundler, on purpose. */
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });
  eleventyConfig.addPassthroughCopy({ "src/static": "." });

  /* `npm start` doesn't watch content/ on its own, because the essays
     arrive via a data file rather than as templates. */
  eleventyConfig.addWatchTarget("./content/");
  eleventyConfig.addWatchTarget("./lib/");

  eleventyConfig.addGlobalData("buildYear", () => new Date().getFullYear());

  /* ---------- filters ---------- */

  // 1 -> "001"
  eleventyConfig.addFilter("pad", (n) => String(n).padStart(3, "0"));

  // "2026-08-09" -> "9 August 2026"
  eleventyConfig.addFilter("fmtDate", (iso) =>
    new Date(iso + "T00:00:00").toLocaleDateString("en-AU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  );

  // "2026-08-09" -> "9 Aug 2026"
  eleventyConfig.addFilter("fmtShort", (iso) =>
    new Date(iso + "T00:00:00").toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  );

  // "coaching" -> "Coaching"
  eleventyConfig.addFilter("topicName", (key, topics) => topics[key] || key);

  // Same topic first, then newest. Three at most.
  eleventyConfig.addFilter("related", (essays, current) =>
    essays
      .filter((e) => e.slug !== current.slug)
      .sort((a, b) => (b.topic === current.topic) - (a.topic === current.topic))
      .slice(0, 3)
  );

  // Kept for future reinstatement of topic filtering in the UI.
  eleventyConfig.addFilter("byTopic", (essays, topic) =>
    topic ? essays.filter((e) => e.topic === topic) : essays
  );

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    templateFormats: ["njk", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
