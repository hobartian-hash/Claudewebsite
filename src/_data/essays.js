/* Every essay, newest first, with its body already rendered to web HTML.
   Available to every template as `essays`. */

const path = require("path");
const { loadSite } = require("../../lib/site");
const { loadEssays } = require("../../lib/essays");
const { renderWeb } = require("../../lib/render-web");

module.exports = () => {
  const root = path.join(__dirname, "../..");
  const site = loadSite(path.join(root, "content/site.json"));

  return loadEssays(path.join(root, "content/essays"), site.topics).map((essay) => ({
    ...essay,
    body: renderWeb(essay.blocks),
  }));
};
