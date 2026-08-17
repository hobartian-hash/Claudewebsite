/* The running head and its progress line. Essay pages only — the element
   isn't in the markup anywhere else, so this exits quietly on every other
   page.

   Two jobs, one scroll listener:
     1. Slide the running head in once the essay's headrule has scrolled
        away, so it takes over from the masthead rather than sitting on top
        of it.
     2. Report position as minutes read — "3 of 7 min" — rather than as a
        percentage. It's the same number the byline promises, counted down
        as you go, which reads more like pages than a loading bar does. */
(function () {
  var head = document.getElementById("runhead");
  if (!head) return;

  var bar = document.getElementById("progress");
  var page = document.getElementById("rh-page");
  var mins = Number(head.getAttribute("data-mins")) || 0;

  /* Show the running head once the top of the page — headline, deck, byline
     and rule — is behind you. Falls back to roughly a screenful if the essay
     head is ever missing. */
  var rule = document.querySelector(".headrule");
  var trigger = rule ? rule.getBoundingClientRect().top + window.scrollY : 320;

  function update() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    var frac = h > 0 ? window.scrollY / h : 0;
    if (frac < 0) frac = 0;
    if (frac > 1) frac = 1;

    bar.style.width = frac * 100 + "%";
    head.classList.toggle("on", window.scrollY > trigger);

    if (mins) {
      var at = Math.ceil(frac * mins);
      if (at < 1) at = 1;
      if (at > mins) at = mins;
      page.textContent = at + " of " + mins + " min";
    }
  }

  function remeasure() {
    if (rule) trigger = rule.getBoundingClientRect().top + window.scrollY;
    update();
  }

  addEventListener("scroll", update, { passive: true });
  addEventListener("resize", remeasure, { passive: true });
  update();
})();
