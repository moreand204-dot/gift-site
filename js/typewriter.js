/* ==========================================================================
   TYPEWRITER.JS — types out [data-typewriter] text node by node when it
   scrolls into view. Respects prefers-reduced-motion (shows text instantly).
   ========================================================================== */

const Typewriter = (() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function typeInto(el) {
    const full = el.dataset.typewriter || el.textContent;
    if (reduceMotion) { el.textContent = full; return; }

    el.textContent = '';
    const cursor = document.createElement('span');
    cursor.className = 'verse-card__cursor';
    cursor.textContent = '\u00A0';
    el.appendChild(cursor);

    let i = 0;
    const speed = 28;
    function step() {
      if (i < full.length) {
        cursor.insertAdjacentText('beforebegin', full[i]);
        i++;
        setTimeout(step, speed);
      } else {
        cursor.remove();
      }
    }
    step();
  }

  function init(root = document) {
    const targets = root.querySelectorAll('[data-typewriter]');
    if (!targets.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          typeInto(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    targets.forEach((t) => io.observe(t));
  }

  return { init };
})();
