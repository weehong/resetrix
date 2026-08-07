/* ============================================================================
   RESETRIX — js/main.js  (classic script, globals: anime, ResetrixJourney)

   Everything that is NOT the pinned lifecycle:
     1. Intro screen entrance animation (anime.js, plays once on load)
     2. Fixed-chrome navigation (logo / contact / scroll cue)
     3. Finale reveal animation (IntersectionObserver -> anime.js)
     4. Interactive brand, capability, comparison, and FAQ sections
     5. Contact form: validation + mailto fallback

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
    var spiritVideo = title.querySelector(".intro__wisp-video");

    function startSpiritWave() {
      if (!spiritVideo || spirit.dataset.waveStarted) return;
      spirit.dataset.waveStarted = "true";
      if (REDUCED) {
        spiritVideo.pause();
        return;
      }
      spiritVideo.play().catch(function () {
        // The muted first frame remains visible if autoplay is restricted.
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

  function initHeroArchitecture() {
    var intro = document.getElementById("intro");
    if (!intro) return;
    var scheduled = false;

    function update() {
      scheduled = false;
      var progress = Math.max(0, Math.min(1, (window.scrollY || 0) / Math.max(1, intro.offsetHeight * 0.82)));
      var fade = 1 - progress * progress;
      intro.style.setProperty("--architecture-scroll-fade", fade.toFixed(3));
    }

    function requestUpdate() {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(update);
    }

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    update();
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
        } else {
          var section = document.getElementById(target);
          if (section) section.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth" });
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     3. Supporting interactive sections
     -------------------------------------------------------------------------- */
  function initSectionReveals() {
    var sections = document.querySelectorAll(".section-reveal");
    if (REDUCED || !("IntersectionObserver" in window)) {
      sections.forEach(function (section) { section.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.14 });
    sections.forEach(function (section) { observer.observe(section); });
  }

  function initPositioning() {
    var section = document.querySelector(".positioning");
    var journey = document.getElementById("journey");
    if (!section || !journey) return;
    var nodes = Array.prototype.slice.call(section.querySelectorAll(".matrix__node"));
    var scheduled = false;

    function clamp(value) { return Math.max(0, Math.min(1, value)); }
    function update() {
      scheduled = false;
      var range = Math.max(1, section.offsetHeight - window.innerHeight);
      var progress = REDUCED ? 1 : clamp((window.scrollY - section.offsetTop) / range);
      var eased = progress * progress * (3 - 2 * progress);
      section.style.setProperty("--matrix-progress", eased.toFixed(3));

      nodes.forEach(function (node) {
        var fromX = parseFloat(node.style.getPropertyValue("--x"));
        var fromY = parseFloat(node.style.getPropertyValue("--y"));
        var toX = parseFloat(node.style.getPropertyValue("--tx"));
        var toY = parseFloat(node.style.getPropertyValue("--ty"));
        node.style.left = (fromX + (toX - fromX) * eased).toFixed(2) + "%";
        node.style.top = (fromY + (toY - fromY) * eased).toFixed(2) + "%";
      });

      document.body.classList.toggle(
        "is-prejourney",
        window.scrollY < journey.offsetTop - window.innerHeight * 0.35
      );
    }

    function requestUpdate() {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(update);
    }
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    update();
  }

  var CAPABILITIES = {
    product: {
      signal: "PRODUCT",
      title: "Products people can rely on.",
      description: "Purpose-built web, Android, and iOS applications designed around real workflows, clear journeys, and long-term scale.",
      outcome: "One consistent product experience, wherever your customers or teams work."
    },
    systems: {
      signal: "SYSTEMS",
      title: "A dependable operational core.",
      description: "Secure backend services and data foundations that turn business rules into maintainable, observable systems.",
      outcome: "Reliable operations with a foundation that can grow without becoming fragile."
    },
    integrations: {
      signal: "CONNECTION",
      title: "Make every system speak.",
      description: "Maintainable APIs and integrations that connect tools, automate handoffs, and keep information moving safely.",
      outcome: "Less duplicate work, fewer disconnected records, and faster information flow."
    },
    experience: {
      signal: "EXPERIENCE",
      title: "Complex work, made clear.",
      description: "Research-led journeys and interfaces shaped around how customers and teams actually think and work.",
      outcome: "Software that feels understandable from the first interaction."
    },
    cloud: {
      signal: "DELIVERY",
      title: "Ship with confidence.",
      description: "Cloud architecture, automated delivery pipelines, and deployment foundations designed for secure, repeatable releases.",
      outcome: "A smoother path from approved change to dependable production software."
    },
    evolution: {
      signal: "EVOLUTION",
      title: "Keep the system moving.",
      description: "Technical consultancy, monitoring, maintenance, and iterative improvements that continue beyond launch.",
      outcome: "A product that evolves alongside the business instead of standing still."
    }
  };

  function initCapabilities() {
    var consoleElement = document.querySelector(".capability-console");
    if (!consoleElement) return;
    var tabs = Array.prototype.slice.call(consoleElement.querySelectorAll(".capability-tab"));
    var detail = consoleElement.querySelector(".capability-detail");
    var signal = consoleElement.querySelector(".capability-console__readout span");

    function select(tab) {
      var content = CAPABILITIES[tab.dataset.capability];
      if (!content) return;
      tabs.forEach(function (item) {
        var active = item === tab;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-selected", String(active));
        item.tabIndex = active ? 0 : -1;
      });

      function render() {
        detail.querySelector(".capability-detail__index").textContent = "Capability " + tab.dataset.index;
        detail.querySelector(".capability-detail__title").textContent = content.title;
        detail.querySelector(".capability-detail__description").textContent = content.description;
        detail.querySelector(".capability-detail__outcome").innerHTML = "<span>Outcome</span>" + content.outcome;
        signal.textContent = content.signal;
      }

      if (!REDUCED && window.anime) {
        anime.remove(detail);
        anime({
          targets: detail,
          opacity: [1, 0],
          translateY: [0, 10],
          duration: 160,
          easing: "easeInQuad",
          complete: function () {
            render();
            anime({ targets: detail, opacity: [0, 1], translateY: [10, 0], duration: 380, easing: "easeOutCubic" });
          }
        });
      } else render();
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () { select(tab); });
      tab.addEventListener("keydown", function (event) {
        if (event.key !== "ArrowDown" && event.key !== "ArrowRight" && event.key !== "ArrowUp" && event.key !== "ArrowLeft") return;
        event.preventDefault();
        var direction = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1;
        var next = tabs[(index + direction + tabs.length) % tabs.length];
        select(next);
        next.focus();
      });
    });
  }

  var FIT_MODELS = {
    saas: {
      name: "Off-the-shelf SaaS",
      title: "Built for a common pattern.",
      status: "STANDARDIZED",
      rows: [["Starting point", "A predefined product"], ["Change model", "Vendor roadmap"], ["Best suited to", "Standard workflows"], ["After launch", "Product-level support"]]
    },
    agency: {
      name: "Large agency",
      title: "Built through an enterprise process.",
      status: "STRUCTURED",
      rows: [["Starting point", "A formal project scope"], ["Change model", "Managed change requests"], ["Best suited to", "Large programmes"], ["After launch", "Contracted service model"]]
    },
    resetrix: {
      name: "Resetrix",
      title: "Built around your operation.",
      status: "ADAPTIVE",
      rows: [["Starting point", "Your workflows and goals"], ["Change model", "Collaborative iteration"], ["Best suited to", "SMEs with specific needs"], ["After launch", "Continued product partnership"]]
    }
  };

  function initFitLab() {
    var lab = document.querySelector(".fit-lab");
    if (!lab) return;
    var options = Array.prototype.slice.call(lab.querySelectorAll(".fit-option"));
    var detail = lab.querySelector(".fit-detail");
    var status = lab.querySelector(".fit-visual strong");

    function select(option) {
      var key = option.dataset.fit;
      var model = FIT_MODELS[key];
      lab.dataset.fit = key;
      options.forEach(function (item) {
        var active = item === option;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-selected", String(active));
        item.tabIndex = active ? 0 : -1;
      });
      detail.querySelector(".fit-detail__eyebrow").textContent = "Selected model / " + model.name;
      detail.querySelector("h3").textContent = model.title;
      detail.querySelector("dl").innerHTML = model.rows.map(function (row) {
        return "<div><dt>" + row[0] + "</dt><dd>" + row[1] + "</dd></div>";
      }).join("");
      status.textContent = model.status;
      if (!REDUCED && window.anime) {
        anime({ targets: [detail, ".fit-visual__frame"], opacity: [0.35, 1], scale: [0.985, 1], duration: 420, easing: "easeOutCubic" });
      }
    }

    options.forEach(function (option, index) {
      option.addEventListener("click", function () { select(option); });
      option.addEventListener("keydown", function (event) {
        if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
        event.preventDefault();
        var next = options[(index + (event.key === "ArrowRight" ? 1 : -1) + options.length) % options.length];
        select(next);
        next.focus();
      });
    });
    lab.dataset.fit = "resetrix";
  }

  function initFaq() {
    var items = Array.prototype.slice.call(document.querySelectorAll(".faq__item"));
    items.forEach(function (item) {
      item.addEventListener("toggle", function () {
        if (!item.open) return;
        items.forEach(function (other) {
          if (other !== item) other.open = false;
        });
      });
    });
  }

  /* --------------------------------------------------------------------------
     4. Finale reveal — plays once when the contact screen scrolls into view
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
     5. Contact form — client-side validation + mailto fallback.

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
      field.setAttribute("aria-invalid", valid ? "false" : "true");
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
        var firstInvalid = !okName ? name : !okEmail ? email : message;
        firstInvalid.focus();
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
      e.target.removeAttribute("aria-invalid");
    });
  }

  /* --------------------------------------------------------------------------
     Boot (script is deferred — DOM is ready)
     -------------------------------------------------------------------------- */
  initIntro();
  initHeroArchitecture();
  initChromeNav();
  initSectionReveals();
  initPositioning();
  initCapabilities();
  initFitLab();
  initFaq();
  initFinaleReveal();
  initContactForm();
})();
