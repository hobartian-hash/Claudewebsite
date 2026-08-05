/* Subscribe forms.

   Two states, decided at build time by `subscribeEndpoint` in
   content/site.json:

   1. Endpoint set    — the form carries a real action/method in the
                        markup, so it posts even with JavaScript off.
                        This script only adds the friendlier validation
                        message before letting it go.
   2. Endpoint empty  — there is nowhere to post yet. The form tells
                        the reader plainly that nothing was sent. It
                        never pretends to have worked. */
(function () {
  var forms = document.querySelectorAll("form[data-sub]");

  Array.prototype.forEach.call(forms, function (f) {
    f.addEventListener("submit", function (ev) {
      var note = f.nextElementSibling;
      var email = f.querySelector('input[name="email"]');

      if (!email.value || !email.checkValidity()) {
        ev.preventDefault();
        note.hidden = false;
        note.textContent = "Enter a valid email address to subscribe.";
        email.focus();
        return;
      }

      if (f.getAttribute("action")) return; // a real endpoint — let it post

      ev.preventDefault();
      note.hidden = false;
      note.textContent =
        "Not connected yet — " +
        email.value +
        " wasn't sent anywhere. Add your Buttondown form address to " +
        '"subscribeEndpoint" in content/site.json.';
      f.reset();
    });
  });
})();
