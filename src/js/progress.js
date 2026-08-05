/* Reading progress bar. Essay pages only — the element isn't in the
   markup anywhere else, so this exits quietly on every other page. */
(function () {
  var bar = document.getElementById("progress");
  if (!bar) return;

  function update() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + "%";
  }

  addEventListener("scroll", update, { passive: true });
  addEventListener("resize", update, { passive: true });
  update();
})();
