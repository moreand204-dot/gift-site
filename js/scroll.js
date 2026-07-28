/* ==========================================================================
   SCROLL.JS — Lenis smooth scroll, scroll-progress bar, generic reveals
   ========================================================================== */

const SmoothScroll = (() => {
  let lenis;

  function init() {
    if (typeof Lenis === 'undefined') return;
    lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    if (window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }
  }

  return { init, get instance() { return lenis; } };
})();

const ScrollProgress = (() => {
  function init() {
    const fill = document.getElementById('scroll-progress-fill');
    if (!fill) return;
    window.addEventListener('scroll', () => {
      const h = document.documentElement;
      const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
      fill.style.width = `${scrolled}%`;
    });
  }
  return { init };
})();

/* Generic [data-reveal] fade-up-on-scroll, using IntersectionObserver so it
   works even before sections are wired into GSAP timelines individually. */
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
