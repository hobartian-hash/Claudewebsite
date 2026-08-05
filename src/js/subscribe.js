/* Subscribe forms.

   THE PROBLEM
   Buttondown's embed endpoint doesn't allow JavaScript to post to it
   directly (no CORS), so the usual "send it in the background and show a
   message" approach isn't available. A plain form post works, but it
   navigates the reader away to Buttondown's own confirmation page.

   THE FIX
   Point the form at a hidden iframe. The post is a completely ordinary
   form submission — exactly what Buttondown expects — but the reply lands
   in the iframe instead of the window, so the reader stays put. When the
   iframe finishes loading, Buttondown has answered.

   WHAT WE CAN AND CAN'T KNOW
   The iframe is on Buttondown's domain, so we can't read what came back.
   We know the request completed; we don't know what it said. The message
   below therefore points at the confirmation email rather than claiming
   the subscription is finished. Change the wording with
   "subscribeNote" in content/site.json.

   WITH JAVASCRIPT OFF
   The iframe and the target are both added by this script, so none of it
   exists. The form posts normally and Buttondown's page answers. Uglier,
   but it works, and an address is never silently swallowed. */
(function () {
  var forms = document.querySelectorAll("form[data-sub]");
  if (!forms.length) return;

  var FRAME_NAME = "buttondown-response";
  var frame = null;

  function makeFrame() {
    var el = document.createElement("iframe");
    el.name = FRAME_NAME;
    el.title = "Subscribe response";
    el.setAttribute("aria-hidden", "true");
    el.setAttribute("tabindex", "-1");
    el.style.cssText = "position:absolute;left:-9999px;width:1px;height:1px;border:0";
    document.body.appendChild(el);
    return el;
  }

  Array.prototype.forEach.call(forms, function (f) {
    var note = f.nextElementSibling;
    var email = f.querySelector('input[name="email"]');
    var button = f.querySelector('button[type="submit"]');
    var endpoint = f.getAttribute("action");
    var buttonLabel = button ? button.textContent : "";

    function say(text) {
      note.hidden = false;
      note.textContent = text;
    }

    // The frame has to exist before the form is submitted, or the browser
    // treats the target name as a request for a new window.
    if (endpoint) {
      if (!frame) frame = makeFrame();
      f.setAttribute("target", FRAME_NAME);
    }

    f.addEventListener("submit", function (ev) {
      if (!email.value || !email.checkValidity()) {
        ev.preventDefault();
        say("Enter a valid email address to subscribe.");
        email.focus();
        return;
      }

      if (!endpoint) {
        ev.preventDefault();
        say(
          "Not connected yet — " +
            email.value +
            " wasn't sent anywhere. Add your Buttondown form address to " +
            '"subscribeEndpoint" in content/site.json.'
        );
        f.reset();
        return;
      }

      // Let the submission go ahead — into the iframe.
      say("Signing you up…");
      if (button) {
        button.disabled = true;
        button.textContent = "Sending…";
      }

      var finished = false;
      function finish() {
        if (finished) return;
        finished = true;
        if (button) {
          button.disabled = false;
          button.textContent = buttonLabel;
        }
        say(f.getAttribute("data-note") || "Almost there — check your inbox to confirm.");
        f.reset();
      }

      frame.addEventListener("load", finish, { once: true });
      setTimeout(finish, 8000); // in case the load event never arrives
    });
  });
})();
