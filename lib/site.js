/* Loads content/site.json. Shared by Eleventy (src/_data/site.js) and by
   the email builder, so the two can never disagree about the base URL. */

const fs = require("fs");

const REQUIRED = ["baseUrl", "author", "wordmark", "place", "publishDay", "topics"];

function loadSite(file) {
  const site = JSON.parse(fs.readFileSync(file, "utf8"));

  for (const key of REQUIRED) {
    if (site[key] === undefined) {
      throw new Error(`content/site.json is missing "${key}".`);
    }
  }

  // One trailing slash here would double up in every absolute URL in the email.
  site.baseUrl = String(site.baseUrl).replace(/\/+$/, "");
  site.socials = site.socials || [];
  site.aboutMore = site.aboutMore || [];
  site.subscribeEndpoint = site.subscribeEndpoint || "";
  site.readerCount = site.readerCount || "";
  site.photo = site.photo || "";

  return site;
}

module.exports = { loadSite };
