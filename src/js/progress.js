/* The running head and its progress line. Essay pages only — the element
   isn't in the markup anywhere else, so this exits quietly on every other
   page.

   Two jobs, one scroll listener:
     1. Slide the running head in once the essay's headrule has scrolled
        away, so it takes over from the masthead rather than sitting on top
        of it.
     2. Report position as minutes read — "3 of 7 min" — rather than as a
        percentage. It's the same number the byline promises, counted down
        as you go, which reads more like pages than a loading bar does.

   Both measurements are taken fresh on every call rather than cached. The
   page is static, so this is one rect read per scroll event, and it means
   nothing goes stale when a font finishes loading and reflows the column. */
(function () {
  var head = document.getElementById("runhead");
  if (!head) return;

  var bar = document.getElementById("progress");
  var page = document.getElementById("rh-page");
  var mins = Number(head.getAttribute("data-mins")) || 0;
  var rule = document.querySelector(".headrule");
  var prose = document.querySelector(".prose");

  /* Where the reading ends. Measured to the foot of the essay itself, not to
     the foot of the document: the page carries issue navigation, three read-
     next rows, a subscribe panel and the footer after the essay, and counting
     those as reading meant the last paragraph of a short essay still reported
     "3 of 4 min" — the total only arrived once you were scrolling furniture.

     The essay is finished when its last line clears the bottom of the window,
     so that, not the bottom of the document, is 100%. An essay shorter than
     the window is entirely visible and therefore already complete. */
  function readingEnd() {
    if (!prose) return document.documentElement.scrollHeight - window.innerHeight;
    return prose.getBoundingClientRect().bottom + window.scrollY - window.innerHeight;
  }

  function update() {
    var end = readingEnd();
    var frac = end > 0 ? window.scrollY / end : 1;
    if (frac < 0) frac = 0;
    if (frac > 1) frac = 1;

    bar.style.width = frac * 100 + "%";

    /* Show the running head once the top of the page — headline, deck, byline
       and rule — is behind you. Falls back to roughly a screenful if the
       essay head is ever missing. */
    var trigger = rule ? rule.getBoundingClientRect().top + window.scrollY : 320;
    head.classList.toggle("on", window.scrollY > trigger);

    if (mins) {
      var at = Math.ceil(frac * mins);
      if (at < 1) at = 1;
      if (at > mins) at = mins;
      page.textContent = at + " of " + mins + " min";
    }
  }

  addEventListener("scroll", update, { passive: true });
  addEventListener("resize", update, { passive: true });
  update();
})();
