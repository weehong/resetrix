/* ============================================================================
   RESETRIX — js/main.js  (classic script, globals: anime, ResetrixJourney)

   Everything that is NOT the pinned lifecycle:
     1. Intro screen entrance animation (anime.js, plays once on load)
     2. Fixed-chrome navigation (logo / contact / scroll cue)
     3. Finale reveal animation (IntersectionObserver -> anime.js)
     4. Contact form: validation + mailto fallback

   EDIT EMAIL: change CONTACT_EMAIL below (and the visible address in
   index.html, search "EDIT EMAIL").
   ============================================================================ */

(function () {
  "use strict";

  var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* EDIT EMAIL — used for the mailto fallback in the contact form */
  var CONTACT_EMAIL = "hello@resetrix.sg";

  /* --------------------------------------------------------------------------
     1. Intro entrance — staggered char reveal, then tagline / sub / cue.
        Skipped if the page loads already scrolled (e.g. refresh mid-journey).
     -------------------------------------------------------------------------- */
  function initIntro() {
    var title = document.querySelector(".intro__title");
    if (!title) return;

    var chars = Array.prototype.slice.call(title.querySelectorAll(".char"));
    var spirit = title.querySelector(".intro__spirit-dot");

    function startSpiritWave() {
      if (REDUCED || !window.anime || !spirit || spirit.dataset.waveStarted) return;
      spirit.dataset.waveStarted = "true";

      anime({
        targets: spirit.querySelector(".spirit-tail"),
        keyframes: [
          { d: "M39 48C29 39 24 29 31 18C38 7 54 2 68 9C56 14 49 21 53 29C58 38 53 46 45 50Z", duration: 520 },
          { d: "M39 48C38 39 40 30 48 23C56 15 67 13 73 20C62 17 56 23 59 31C62 39 55 47 45 50Z", duration: 620 },
          { d: "M39 48C31 38 31 27 38 18C46 8 58 5 68 11C58 12 53 18 55 25C58 33 55 42 45 50Z", duration: 540 },
        ],
        easing: "easeInOutSine",
        loop: true,
      });

      anime({
        targets: spirit.querySelector(".spirit-tail-highlight"),
        keyframes: [
          { d: "M41 40C31 31 34 17 47 10", duration: 520 },
          { d: "M41 40C45 32 52 26 63 24", duration: 620 },
          { d: "M41 40C38 31 42 20 52 15", duration: 540 },
        ],
        easing: "easeInOutSine",
        loop: true,
      });
    }

    var alreadyScrolled = (window.scrollY || 0) > 40;

    if (REDUCED || alreadyScrolled || !window.anime) {
      // Final visible state, no animation
      if (spirit) spirit.classList.add("is-alive");
      startSpiritWave();
      document.querySelectorAll(".intro__tagline, .intro__sub, .intro__cue")
        .forEach(function (el) { el.style.opacity = "1"; });
      return;
    }

    var tl = anime.timeline({ easing: "easeOutExpo" });
    tl.add({
      targets: chars,
      opacity: [0, 1],
      translateY: ["0.7em", "0em"],
      rotate: ["4deg", "0deg"],
      duration: 900,
      delay: anime.stagger(55),
    })
    .add({
      targets: spirit,
      opacity: [0, 1],
      scale: [0.18, 1.22, 1],
      rotate: ["-20deg", "8deg", "0deg"],
      duration: 820,
      easing: "easeOutElastic(1, .55)",
      complete: function () {
        if (spirit) spirit.classList.add("is-alive");
        startSpiritWave();
      },
    }, 330)
    .add({
      targets: ".intro__tagline",
      opacity: [0, 1],
      translateY: [18, 0],
      duration: 600,
    }, "-=450")
    .add({
      targets: ".intro__sub",
      opacity: [0, 1],
      translateY: [14, 0],
      duration: 550,
    }, "-=400")
    .add({
      targets: ".intro__cue",
      opacity: [0, 1],
      duration: 500,
    }, "-=250");

    // Gentle pulsing loop on the scroll cue arrow
    anime({
      targets: ".intro__cue-arrow",
      scaleY: [1, 0.55],
      opacity: [1, 0.5],
      direction: "alternate",
      loop: true,
      duration: 900,
      easing: "easeInOutSine",
      delay: 1600,
    });
  }

  /* --------------------------------------------------------------------------
     2. Chrome navigation — data-scroll attributes declared in index.html
     -------------------------------------------------------------------------- */
  function initChromeNav() {
    document.querySelectorAll("[data-scroll]").forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        var target = el.dataset.scroll;
        if (target === "top") {
          window.scrollTo({ top: 0, behavior: REDUCED ? "auto" : "smooth" });
        } else if (target === "journey") {
          // Opening chapter of the scroll story
          if (window.ResetrixJourney) window.ResetrixJourney.goToChapter(0);
        } else if (target === "finale") {
          var finale = document.getElementById("finale");
          if (finale) finale.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth" });
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     3. Finale reveal — plays once when the contact screen scrolls into view
     -------------------------------------------------------------------------- */
  function initFinaleReveal() {
    var inner = document.querySelector(".finale__inner");
    if (!inner) return;

    if (REDUCED || !window.anime || !("IntersectionObserver" in window)) return;

    var targets = inner.querySelectorAll(
      ".finale__title, .finale__sub, .contact, .finale__alt"
    );
    targets.forEach(function (el) { el.style.opacity = "0"; });

    var played = false;
    var io = new IntersectionObserver(function (entries) {
      if (played || !entries[0].isIntersecting) return;
      played = true;
      io.disconnect();
      anime({
        targets: targets,
        opacity: [0, 1],
        translateY: [26, 0],
        duration: 750,
        delay: anime.stagger(110),
        easing: "easeOutCubic",
      });
    }, { threshold: 0.25 });

    io.observe(inner);
  }

  /* --------------------------------------------------------------------------
     4. Contact form — client-side validation + mailto fallback.

     API HOOK: to send to a real backend (Formspree, your own endpoint...),
     replace the buildMailto()+redirect block in onSubmit with a fetch():

       await fetch("https://formspree.io/f/YOUR_ID", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(data),
       });
     -------------------------------------------------------------------------- */
  function initContactForm() {
    var form = document.getElementById("contact-form");
    if (!form) return;
    var status = form.querySelector(".contact__status");

    function setStatus(msg, ok) {
      status.textContent = msg;
      status.classList.toggle("is-error", !ok);
      status.classList.toggle("is-ok", ok);
    }

    function markValidity(field, valid) {
      field.closest(".contact__field").classList.toggle("is-invalid", !valid);
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = form.elements.name;
      var email = form.elements.email;
      var message = form.elements.message;

      // Simple, transparent validation
      var okName = name.value.trim().length > 0;
      var okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
      var okMsg = message.value.trim().length > 0;
      markValidity(name, okName);
      markValidity(email, okEmail);
      markValidity(message, okMsg);

      if (!(okName && okEmail && okMsg)) {
        setStatus("Please fill in all fields with a valid email.", false);
        if (window.anime && !REDUCED) {
          anime({ targets: form, translateX: [0, -7, 7, -4, 4, 0], duration: 380, easing: "easeInOutQuad" });
        }
        return;
      }

      // mailto fallback: open the visitor's email client pre-filled
      var subject = "Project enquiry — " + name.value.trim();
      var body =
        "Name: " + name.value.trim() + "\n" +
        "Email: " + email.value.trim() + "\n\n" +
        message.value.trim();
      var href = "mailto:" + CONTACT_EMAIL +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      setStatus("Opening your email client… or write to us at " + CONTACT_EMAIL, true);
      if (window.anime && !REDUCED) {
        anime({
          targets: ".contact__submit",
          scale: [1, 0.96, 1],
          duration: 420,
          easing: "easeOutQuad",
        });
      }
      window.location.href = href;
      form.reset();
    });

    // Clear the invalid highlight as the user types
    form.addEventListener("input", function (e) {
      var field = e.target.closest(".contact__field");
      if (field) field.classList.remove("is-invalid");
    });
  }

  /* --------------------------------------------------------------------------
     Boot (script is deferred — DOM is ready)
     -------------------------------------------------------------------------- */
  initIntro();
  initChromeNav();
  initFinaleReveal();
  initContactForm();
})();
