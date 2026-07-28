/* ==========================================================================
   LOADER.JS — fetches section partials into the page, runs preloader sequence
   ========================================================================== */

const Loader = (() => {

  const SECTIONS = [
    { id: 'section-intro',     src: 'sections/intro.html'     },
    { id: 'section-story',     src: 'sections/story.html'     },
    { id: 'section-memories',  src: 'sections/memories.html'  },
    { id: 'section-problems', src: 'sections/problems.html'   },
    { id: 'section-poems',     src: 'sections/poems.html'     },
    { id: 'section-gallery',   src: 'sections/gallery.html'   },
    { id: 'section-future',    src: 'sections/future.html'    },
    { id: 'section-ending',    src: 'sections/ending.html'    },
  ];

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

    setTimeout(() => {
      if (cta) {
        cta.hidden = false;
      }
    }, delay + 300);
  }

  async function init() {
    await injectSections();
    runPenSequence();
    document.dispatchEvent(new CustomEvent('sections:loaded'));
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', Loader.init);
