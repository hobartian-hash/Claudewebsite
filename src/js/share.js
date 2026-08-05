/* "Copy the link" — essay pages only. Without JS, or without the clipboard
   API, the element is a plain anchor to the essay's own URL, so it degrades
   to a harmless self-link rather than doing nothing. */
(function () {
  var link = document.querySelector(".copylink");
  if (!link || !navigator.clipboard) return;

  var label = link.dataset.label || link.textContent;

  link.addEventListener("click", function (e) {
    e.preventDefault();
    navigator.clipboard.writeText(link.dataset.url).then(function () {
      link.textContent = "Copied";
      setTimeout(function () {
        link.textContent = label;
      }, 2000);
    });
  });
})();
