/* ==========================================================================
   BOOK.JS — 3D flip-book for the "الشعر" section
   ========================================================================== */

const PoemBook = (() => {
  function init(root = document) {
    const shell = root.querySelector('.book-shell');
    if (!shell) return;

    const pages = Array.from(shell.querySelectorAll('.book__page'));
    const prevBtn = shell.querySelector('.book__nav-btn--prev');
    const nextBtn = shell.querySelector('.book__nav-btn--next');
    let current = 0;

    function render() {
      pages.forEach((page, i) => {
        page.classList.toggle('is-flipped', i < current);
        page.style.zIndex = i < current ? pages.length - i : pages.length - i;
      });
      if (prevBtn) prevBtn.disabled = current === 0;
      if (nextBtn) nextBtn.disabled = current === pages.length;
    }

    nextBtn?.addEventListener('click', () => {
      if (current < pages.length) { current++; render(); }
    });
    prevBtn?.addEventListener('click', () => {
      if (current > 0) { current--; render(); }
    });

    render();
  }
  return { init };
})();
