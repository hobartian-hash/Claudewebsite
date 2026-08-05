/* Everything in content/site.json, made available to every template as
   `site`. The file is read from content/ rather than src/ so Tim only
   ever has one folder to edit. */

const path = require("path");
const { loadSite } = require("../../lib/site");

module.exports = () => loadSite(path.join(__dirname, "../../content/site.json"));
