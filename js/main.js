/* ==========================================================================
   MAIN.JS — orchestrates preloader → site reveal → per-section wiring
   ========================================================================== */

(function () {

  function startJourney() {
    const preloader = document.getElementById('preloader');
    const site = document.getElementById('site');
    preloader.classList.add('leaving');
    setTimeout(() => { preloader.hidden = true; }, 1200);
    site.hidden = false;
    FloatingHearts.init();
    window.scrollTo(0, 0);
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }

  function wireProblemsStorm() {
    const section = document.getElementById('section-problems');
    if (!section) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) Storm.start(section);
        else Storm.calm(section);
      });
    }, { threshold: 0.3 });
    io.observe(section);
  }

  function wireEnding() {
    const ending = document.getElementById('section-ending');
    if (!ending) return;

    const wordHost = ending.querySelector('.ending__word-target');
    const words = ['❤️', '{{HER_NAME}}', '{{NICKNAME}}', 'بحبك', 'قلبي', 'روحي', 'مراتي', 'أجمل هدية'];
    const sky = ending.querySelector('.ending__sky');
    const rosesHost = ending.querySelector('.falling-roses');
    const finalMsg = ending.querySelector('.ending__final-message');

    let cycleHandle;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        io.unobserve(ending);

        cycleHandle = WordCycle.run(wordHost, words, { interval: 1500 });
        setTimeout(() => clearInterval(cycleHandle), words.length * 1500 + 500);

        setTimeout(() => sky?.classList.add('is-sunrise'), words.length * 1500);
        setTimeout(() => FallingRoses.init(rosesHost), words.length * 1500);
        setTimeout(() => finalMsg?.classList.add('is-visible'), words.length * 1500 + 800);
      });
    }, { threshold: 0.4 });
    io.observe(ending);
  }

  function initSectionModules() {
    ScrollReveal.init();
    Timeline.init();
    PoemBook.init();
    Gallery.init();
    wireProblemsStorm();
    wireEnding();
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Ambient systems that don't depend on section content
    SmoothScroll.init();
    ScrollProgress.init();

    const penCanvas = document.getElementById('pen-canvas');
    PenDraw.run(penCanvas, { duration: 2400 });

    const cta = document.getElementById('start-journey');
    cta?.addEventListener('click', startJourney);
  });

  document.addEventListener('sections:loaded', initSectionModules);
})();
