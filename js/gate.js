/* ==========================================================================
   GATE.JS — "حطي كلمة السر" entry screen. Dispatches 'gate:unlocked' on
   success so main.js can start the preloader/cinematic sequence.
   ========================================================================== */

const Gate = (() => {
  // Accepted words — edit this list freely.
  const ALLOWED = [
    'اسكانور', 'عبدالرحمن', 'ايسو', 'جوزي', 'حياتي',
    'روحي', 'قلبي', 'ابني', 'سندي', 'عبدو', 'عبود', 'بودي', 'بودا',
  ];

  const GENTLE_MESSAGES = [
    'لأ مش هي... جربي تاني بحب',
    'قريبة بس لسه مش هي، حاولي مرة كمان',
    'هو أنتِ مين بجد؟ فكري شوية وجربي تاني',
  ];

  // Normalize Arabic input so hamza/alef variants and stray marks don't block a correct answer.
  function normalize(str) {
    return str
      .trim()
      .replace(/[\u064B-\u0652\u0670\u0640]/g, '')   // diacritics + tatweel
      .replace(/[إأآا]/g, 'ا')
      .replace(/[ىي]/g, 'ي')
      .replace(/ة/g, 'ه')
      .replace(/\s+/g, '');
  }

  const ALLOWED_NORMALIZED = ALLOWED.map(normalize);

  function init() {
    const gate = document.getElementById('gate');
    const form = document.getElementById('gate-form');
    const input = document.getElementById('gate-input');
    const panel = form;
    const hint = document.getElementById('gate-hint');
    if (!gate || !form || !input) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const guess = normalize(input.value);

      if (guess && ALLOWED_NORMALIZED.includes(guess)) {
        gate.classList.add('leaving');
        setTimeout(() => { gate.hidden = true; }, 1100);
        document.dispatchEvent(new CustomEvent('gate:unlocked'));
      } else {
        panel.classList.remove('is-shaking');
        void panel.offsetWidth;
        panel.classList.add('is-shaking');
        hint.textContent = GENTLE_MESSAGES[Math.floor(Math.random() * GENTLE_MESSAGES.length)];
        hint.classList.add('is-visible');
        input.value = '';
        input.focus();
      }
    });
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', Gate.init);
