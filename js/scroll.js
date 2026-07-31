/* ==========================================================================
   SCROLL.JS — reveal-on-scroll utilities (chapter navigation itself lives
   in chapters.js; this file only handles fade-ins within a visible chapter)
   ========================================================================== */

const ScrollProgress = (() => {
  function init() {
    const fill = document.getElementById('scroll-progress-fill');
    if (!fill) return; // no global progress bar in the chapter-based layout
  }
  return { init };
})();

/* Generic [data-reveal] fade-up-on-scroll, using IntersectionObserver so it
   works even before content is wired into any other framework. */
const ScrollReveal = (() => {
  function init(root = document) {
    const targets = root.querySelectorAll('[data-reveal]');
    if (!targets.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    targets.forEach((t) => io.observe(t));
  }
  return { init };
})();
