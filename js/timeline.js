/* ==========================================================================
   TIMELINE.JS — reveal each "رحلتنا" milestone as it scrolls into view
   ========================================================================== */

const Timeline = (() => {
  function init(root = document) {
    const items = root.querySelectorAll('.timeline__item');
    if (!items.length) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    items.forEach((item) => io.observe(item));
  }
  return { init };
})();
