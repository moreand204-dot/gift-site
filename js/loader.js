/* ==========================================================================
   LOADER.JS — fetches all 14 chapter partials, and starts the preloader's
   pen sequence once the password gate has been unlocked.
   ========================================================================== */

const Loader = (() => {

  const SECTIONS = [
    { id: 'chapter-beginning',      src: 'sections/01-beginning.html'      },
    { id: 'chapter-memories',       src: 'sections/02-memories.html'       },
    { id: 'chapter-problems',       src: 'sections/03-problems.html'       },
    { id: 'chapter-reconciliation', src: 'sections/04-reconciliation.html' },
    { id: 'chapter-laughter',       src: 'sections/05-laughter.html'       },
    { id: 'chapter-jokes',          src: 'sections/06-jokes.html'          },
    { id: 'chapter-teasing',        src: 'sections/07-teasing.html'        },
    { id: 'chapter-jealousy',       src: 'sections/08-jealousy.html'       },
    { id: 'chapter-poetry-book',    src: 'sections/09-poetry-book.html'    },
    { id: 'chapter-poems',          src: 'sections/10-poems.html'          },
    { id: 'chapter-letters',        src: 'sections/11-letters.html'        },
    { id: 'chapter-dreams',         src: 'sections/12-dreams.html'         },
    { id: 'chapter-future',         src: 'sections/13-future.html'         },
    { id: 'chapter-ending',         src: 'sections/14-ending.html'         },
  ];

  let sectionsReady;

  async function injectSections() {
    const results = await Promise.allSettled(
      SECTIONS.map(async (s) => {
        const res = await fetch(s.src);
        if (!res.ok) throw new Error(`Failed to load ${s.src}`);
        const html = await res.text();
        const host = document.getElementById(s.id);
        if (host) host.innerHTML = html;
      })
    );
    results.forEach((r, i) => {
      if (r.status === 'rejected') {
        console.warn(`[Loader] Could not load ${SECTIONS[i].src}. If you're opening this file directly in a browser, run a local server instead (e.g. "python -m http.server") — fetch() requires http:// not file://.`);
      }
    });
    if (window.lucide) lucide.createIcons();
    document.dispatchEvent(new CustomEvent('sections:loaded'));
  }

  // Reveal the pen-written lines one at a time, in sync with the SVG drawing
  function runPenSequence() {
    const lines = Array.from(document.querySelectorAll('.pen-line'));
    const cta = document.getElementById('start-journey');
    let delay = 600;
    const perLine = 1400;

    lines.forEach((line) => {
      setTimeout(() => line.classList.add('is-written'), delay);
      delay += perLine;
    });

    setTimeout(() => { if (cta) cta.hidden = false; }, delay + 300);
  }

  function startPreloader() {
    const gift = document.getElementById('sfx-gift-open');
    if (gift) gift.play().catch(() => {});
    const preloader = document.getElementById('preloader');
    if (preloader) preloader.hidden = false;
    runPenSequence();
  }

  function init() {
    // Prefetch chapter content immediately so it's ready the moment the gate unlocks.
    sectionsReady = injectSections();
    document.addEventListener('gate:unlocked', startPreloader, { once: true });
  }

  return { init, get ready() { return sectionsReady; } };
})();

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();
  Loader.init();
});
