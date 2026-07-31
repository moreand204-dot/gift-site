/* ==========================================================================
   CHAPTERS.JS — book-style navigation: one chapter on screen at a time,
   with a "pen draws a random word" transition between chapters.
   ========================================================================== */

const Chapters = (() => {
  const ORDER = [
    'beginning', 'memories', 'problems', 'reconciliation',
    'laughter', 'jokes', 'teasing', 'jealousy',
    'poetry-book', 'poems', 'letters', 'dreams',
    'future', 'ending',
  ];

  const TRANSITION_WORDS = [
    'بحبك', 'اسمها', 'اسم دلعها', 'قلبي', 'روحي',
    'أجمل بنت', 'أميرتي', 'مراتي', 'ضحكتي', 'دنيتي',
  ];

  let current = 0;
  let dotsHost;

  function playSfx(id) {
    const el = document.getElementById(id);
    if (!el) return;
    try { el.currentTime = 0; el.play().catch(() => {}); } catch (_) {}
  }

  function buildDots() {
    dotsHost = document.createElement('div');
    dotsHost.className = 'chapter-dots';
    ORDER.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.className = 'chapter-dots__dot';
      dotsHost.appendChild(dot);
    });
    document.body.appendChild(dotsHost);
    updateDots();
  }

  function updateDots() {
    if (!dotsHost) return;
    Array.from(dotsHost.children).forEach((dot, i) => {
      dot.classList.toggle('is-current', i === current);
    });
  }

  function showChapter(index) {
    ORDER.forEach((name, i) => {
      const el = document.getElementById(`chapter-${name}`);
      if (el) el.classList.toggle('is-active', i === index);
    });
    current = index;
    updateDots();
    window.scrollTo(0, 0);
    if (window.ScrollTrigger) ScrollTrigger.refresh();
    document.dispatchEvent(new CustomEvent('chapter:shown', { detail: { name: ORDER[index] } }));
  }

  function runTransition(onReady) {
    const overlay = document.getElementById('chapter-transition');
    const wordEl = document.getElementById('chapter-transition-word');
    const nextBtn = document.getElementById('chapter-transition-next');
    const penCanvas = document.getElementById('chapter-pen-canvas');
    overlay.classList.add('is-active');
    nextBtn.classList.remove('is-ready');

    wordEl.textContent = '';
    wordEl.classList.remove('ink-reveal');
    playSfx('sfx-heartbeat');

    if (window.PenDraw && penCanvas) {
      playSfx('sfx-pen');
      PenDraw.run(penCanvas, {
        duration: 1000,
        onDone() {
          wordEl.textContent = TRANSITION_WORDS[Math.floor(Math.random() * TRANSITION_WORDS.length)];
          void wordEl.offsetWidth;
          wordEl.classList.add('ink-reveal');
        },
      });
    } else {
      setTimeout(() => {
        wordEl.textContent = TRANSITION_WORDS[Math.floor(Math.random() * TRANSITION_WORDS.length)];
        void wordEl.offsetWidth;
        wordEl.classList.add('ink-reveal');
      }, 400);
    }

    setTimeout(() => nextBtn.classList.add('is-ready'), 1900);

    nextBtn.onclick = () => {
      overlay.classList.remove('is-active');
      onReady();
    };
  }

  function goToNext() {
    if (current >= ORDER.length - 1) return;
    runTransition(() => showChapter(current + 1));
  }

  function init() {
    buildDots();
    showChapter(0);

    document.body.addEventListener('click', (e) => {
      if (e.target.closest('[data-chapter-next]')) goToNext();
    });
  }

  return { init, goToNext, get currentName() { return ORDER[current]; } };
})();

document.addEventListener('sections:loaded', Chapters.init);
