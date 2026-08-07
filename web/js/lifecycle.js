/* ============================================================================
   RESETRIX — js/lifecycle.js  (classic script, globals: gsap, ScrollTrigger,
   anime, ResetrixScene)

   Four independent scroll chapters tell one continuous eight-step story.
   CSS owns the sticky stages; ScrollTrigger measures each chapter's local
   progress; anime.js reveals its opening statement; Three.js receives the
   same continuous virtual phase used by the chapter transitions.
   ============================================================================ */

(function () {
  "use strict";

  var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var MOBILE = window.matchMedia("(max-width: 760px)").matches;
  if (REDUCED) document.documentElement.classList.add("reduced-motion");

  if (!window.gsap || !window.ScrollTrigger) {
    document.body.classList.remove("is-prejourney");
    document.documentElement.classList.add("reduced-motion");
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  var root = document.documentElement;
  var chapters = Array.prototype.slice.call(document.querySelectorAll(".story-chapter"));
  var railDots = Array.prototype.slice.call(document.querySelectorAll(".rail__dot"));
  var railFill = document.querySelector(".rail__fill");
  var counterCurrent = document.querySelector(".counter__current");
  var counterName = document.querySelector(".counter__name");
  var activeChapter = -1;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function smoothstep(value) {
    value = clamp(value, 0, 1);
    return value * value * (3 - 2 * value);
  }

  /** Wrap statement words so their entrance can be scrubbed independently. */
  function splitWords(element) {
    var text = element.textContent;
    element.textContent = "";
    var words = [];

    text.split(/(\s+)/).forEach(function (token) {
      if (/^\s+$/.test(token)) {
        element.appendChild(document.createTextNode(" "));
        return;
      }

      var word = document.createElement("span");
      word.className = "word";
      word.textContent = token;
      element.appendChild(word);
      words.push(word);
    });

    return words;
  }

  function buildChapterTimeline(chapter) {
    var words = splitWords(chapter.querySelector(".story-chapter__statement"));
    var timeline = anime.timeline({ autoplay: false, easing: "easeOutCubic" });

    timeline.add({
      targets: chapter.querySelector(".story-chapter__eyebrow"),
      opacity: [0, 1],
      translateY: [18, 0],
      duration: 260,
    }, 0)
    .add({
      targets: words,
      opacity: [0, 1],
      translateY: [42, 0],
      duration: 620,
      delay: anime.stagger(55),
    }, 60)
    .add({
      targets: chapter.querySelector(".story-chapter__bridge"),
      opacity: [0, 1],
      translateY: [18, 0],
      duration: 360,
    }, "-=280");

    return timeline;
  }

  var chapterTimelines = (!REDUCED && !MOBILE && window.anime)
    ? chapters.map(buildChapterTimeline)
    : [];

  var illustrationStates = chapters.map(function (chapter) {
    return {
      paths: Array.prototype.slice.call(chapter.querySelectorAll("[data-draw]")),
      reveals: Array.prototype.slice.call(
        chapter.querySelectorAll("[data-reveal]:not(.illustration-scanner)")
      ),
      scanner: chapter.querySelector(".illustration-scanner"),
    };
  });

  var chapterTriggers = chapters.map(function (chapter) {
    return ScrollTrigger.create({
      trigger: chapter,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
    });
  });

  /** Map page scroll to the original particle phases in the range -1..8. */
  function computeVirtualPhase() {
    var scrollY = window.scrollY || window.pageYOffset;
    var first = chapterTriggers[0];

    if (scrollY <= first.start) {
      return first.start === 0 ? 0 : -1 + clamp(scrollY / first.start, 0, 1);
    }

    for (var i = 0; i < chapters.length; i++) {
      var trigger = chapterTriggers[i];
      var from = Number(chapters[i].dataset.from);
      var to = Number(chapters[i].dataset.to);

      if (scrollY <= trigger.end) {
        return from + (to - from) * trigger.progress;
      }

      if (i < chapters.length - 1) {
        var nextTrigger = chapterTriggers[i + 1];
        if (scrollY < nextTrigger.start) {
          var gapProgress = clamp(
            (scrollY - trigger.end) / Math.max(1, nextTrigger.start - trigger.end),
            0,
            1
          );
          return to + (Number(chapters[i + 1].dataset.from) - to) * gapProgress;
        }
      }
    }

    var last = chapterTriggers[chapterTriggers.length - 1];
    return Math.min(8, 7 + (scrollY - last.end) / window.innerHeight);
  }

  function getActiveChapter(scrollY) {
    for (var i = 0; i < chapterTriggers.length; i++) {
      var trigger = chapterTriggers[i];
      var next = chapterTriggers[i + 1];
      var boundary = next ? trigger.end + (next.start - trigger.end) * 0.5 : Infinity;
      if (scrollY < boundary) return i;
    }
    return chapters.length - 1;
  }

  function rangeProgress(progress, element) {
    var start = Number(element.dataset.start || 0);
    var end = Number(element.dataset.end || 1);
    return smoothstep((progress - start) / Math.max(0.001, end - start));
  }

  function updateIllustration(index, progress) {
    var state = illustrationStates[index];

    state.paths.forEach(function (path) {
      var amount = rangeProgress(progress, path);
      path.style.strokeDashoffset = (1 - amount).toFixed(4);
    });

    state.reveals.forEach(function (element) {
      var amount = rangeProgress(progress, element);
      element.style.opacity = amount.toFixed(3);
      element.style.pointerEvents = amount > 0.8 ? "all" : "none";
    });

    if (state.scanner) {
      var start = Number(state.scanner.dataset.start || 0);
      var end = Number(state.scanner.dataset.end || 1);
      var scannerProgress = clamp((progress - start) / Math.max(0.001, end - start), 0, 1);
      state.scanner.style.opacity = Math.sin(scannerProgress * Math.PI).toFixed(3);
      state.scanner.style.transform = "translate3d(0," + ((scannerProgress - 0.5) * 180).toFixed(2) + "px,0)";
    }
  }

  /** Update each chapter independently; no chapter text shares a render layer. */
  function updateChapters() {
    chapters.forEach(function (chapter, i) {
      var progress = clamp(chapterTriggers[i].progress, 0, 1);
      var stage = chapter.querySelector(".story-chapter__stage");
      var track = chapter.querySelector(".story-beats__track");
      var number = chapter.querySelector(".story-chapter__number");

      stage.style.setProperty("--chapter-progress", (progress * 100).toFixed(2) + "%");

      if (REDUCED || MOBILE) return;

      updateIllustration(i, progress);

      var revealProgress = clamp(progress / 0.16, 0, 1);
      if (chapterTimelines[i]) {
        chapterTimelines[i].seek(revealProgress * chapterTimelines[i].duration);
      }

      // Exit beat one, hold on the empty column, then introduce beat two.
      var trackOffset = 0;
      if (progress >= 0.38 && progress < 0.46) {
        trackOffset = -33.333 * smoothstep((progress - 0.38) / 0.08);
      } else if (progress >= 0.46 && progress < 0.54) {
        trackOffset = -33.333;
      } else if (progress >= 0.54 && progress < 0.62) {
        trackOffset = -33.333 - 33.334 * smoothstep((progress - 0.54) / 0.08);
      } else if (progress >= 0.62) {
        trackOffset = -66.667;
      }
      track.style.transform = "translate3d(" + trackOffset.toFixed(3) + "%,0,0)";
      number.style.transform = "translate3d(0," + ((progress - 0.5) * 8).toFixed(2) + "%,0)";
    });
  }

  function initMobileChapters() {
    if (!MOBILE) return;

    if (REDUCED || !("IntersectionObserver" in window)) {
      chapters.forEach(function (chapter) { chapter.classList.add("is-mobile-visible"); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-mobile-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    chapters.forEach(function (chapter) { observer.observe(chapter); });
  }

  function updateChrome(virtualPhase) {
    var scrollY = window.scrollY || window.pageYOffset;
    var chapterIndex = getActiveChapter(scrollY);
    var phaseIndex = clamp(Math.round(virtualPhase), 0, 7);

    root.dataset.phase = String(phaseIndex);
    railFill.style.height = (clamp(virtualPhase / 7, 0, 1) * 100).toFixed(2) + "%";
    document.body.classList.toggle("is-finale", virtualPhase > 7.5);

    if (chapterIndex === activeChapter) return;
    activeChapter = chapterIndex;

    counterCurrent.textContent = ("0" + (chapterIndex + 1)).slice(-2);
    counterName.textContent = chapters[chapterIndex].dataset.short;
    railDots.forEach(function (dot, i) {
      var active = i === chapterIndex;
      dot.classList.toggle("is-active", active);
      if (active) dot.setAttribute("aria-current", "step");
      else dot.removeAttribute("aria-current");
    });

    if (!REDUCED && window.anime) {
      anime.remove(".counter");
      anime({
        targets: ".counter",
        translateY: [6, 0],
        opacity: [0.4, 1],
        duration: 380,
        easing: "easeOutQuad",
      });
    }
  }

  var sceneReady = false;
  var virtualTarget = -1;
  var virtualSmooth = -1;

  function whenSceneReady(callback) {
    if (window.ResetrixScene && window.ResetrixScene.ready) callback();
    else window.addEventListener("resetrix:scene-ready", callback, { once: true });
  }

  function tick() {
    virtualTarget = computeVirtualPhase();
    virtualSmooth += (virtualTarget - virtualSmooth) * (REDUCED ? 1 : 0.14);
    if (Math.abs(virtualTarget - virtualSmooth) < 0.0004) virtualSmooth = virtualTarget;

    updateChapters();
    updateChrome(virtualSmooth);
    if (sceneReady) {
      window.ResetrixScene.setVirtualPhase(virtualSmooth);
      if (window.ResetrixScene.setStoryFocus) {
        var storyFocus = clamp(Math.min(virtualSmooth + 1, 8 - virtualSmooth) * 1.5, 0, 1);
        window.ResetrixScene.setStoryFocus(storyFocus);
      }
    }

    requestAnimationFrame(tick);
  }

  function goToChapter(index) {
    index = clamp(index, 0, chapters.length - 1);
    window.scrollTo({
      top: chapterTriggers[index].start,
      behavior: REDUCED ? "auto" : "smooth",
    });
  }

  railDots.forEach(function (dot) {
    dot.addEventListener("click", function () {
      goToChapter(parseInt(dot.dataset.goto, 10));
    });
  });

  window.ResetrixJourney = {
    goToChapter: goToChapter,
    debug: function () {
      return {
        virtualTarget: +virtualTarget.toFixed(3),
        virtualSmooth: +virtualSmooth.toFixed(3),
        activeChapter: activeChapter,
      };
    },
  };

  whenSceneReady(function () { sceneReady = true; });
  initMobileChapters();
  var refreshTimer = null;
  window.addEventListener("resize", function () {
    if (refreshTimer) clearTimeout(refreshTimer);
    refreshTimer = setTimeout(function () { ScrollTrigger.refresh(); }, 200);
  });
  requestAnimationFrame(tick);
})();
