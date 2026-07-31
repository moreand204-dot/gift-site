/* ==========================================================================
   MAIN.JS — orchestrates gate → preloader → chapter reveal → per-chapter fx
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

    // Background music starts automatically once she's inside (still user-mutable via the toggle)
    const bg = document.getElementById('bg-music');
    if (bg) bg.play().catch(() => { /* browser may block autoplay until first interaction */ });

    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }

  function handleChapterShown(e) {
    const name = e.detail.name;

    if (name === 'problems') {
      const inner = document.querySelector('#chapter-problems .section--problems');
      Storm.start(inner);
    } else {
      const inner = document.querySelector('#chapter-problems .section--problems');
      Storm.calm(inner);
    }

    if (name === 'reconciliation') {
      const host = document.getElementById('reconciliation-roses');
      if (host && !host.dataset.done) {
        FallingRoses.init(host, 16);
        host.dataset.done = '1';
      }
    }

    if (name === 'ending') runEndingSequence();
  }

  function runEndingSequence() {
    const ending = document.getElementById('chapter-ending');
    if (!ending || ending.dataset.done) return;
    ending.dataset.done = '1';

    const wordHost = ending.querySelector('.ending__word-target');
    const words = ['{{HER_NAME}}', '{{NICKNAME}}', 'بحبك', 'قلبي', 'روحي', 'مراتي', 'أجمل هدية'];
    const sky = ending.querySelector('.ending__sky');
    const rosesHost = ending.querySelector('.falling-roses');
    const finalMsg = ending.querySelector('.ending__final-message');

    const cycleHandle = WordCycle.run(wordHost, words, { interval: 1500 });
    setTimeout(() => clearInterval(cycleHandle), words.length * 1500 + 500);
    setTimeout(() => sky?.classList.add('is-sunrise'), words.length * 1500);
    setTimeout(() => FallingRoses.init(rosesHost), words.length * 1500);
    setTimeout(() => finalMsg?.classList.add('is-visible'), words.length * 1500 + 800);
  }

  function initChapterModules() {
    ScrollReveal.init();
    Timeline.init();
    PoemBook.init();
    Gallery.init();
    document.addEventListener('chapter:shown', handleChapterShown);
  }

  document.addEventListener('DOMContentLoaded', () => {
    ScrollProgress?.init?.();

    document.addEventListener('gate:unlocked', () => {
      const penCanvas = document.getElementById('pen-canvas');
      PenDraw.run(penCanvas, { duration: 2400 });
    }, { once: true });

    const cta = document.getElementById('start-journey');
    cta?.addEventListener('click', startJourney);
  });

  document.addEventListener('sections:loaded', initChapterModules);
})();
