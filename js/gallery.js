/* ==========================================================================
   GALLERY.JS — lightbox with prev/next navigation
   ========================================================================== */

const Gallery = (() => {
  function init(root = document) {
    const items = Array.from(root.querySelectorAll('.gallery-item'));
    const lightbox = root.querySelector('.lightbox');
    if (!items.length || !lightbox) return;

    const img = lightbox.querySelector('.lightbox__img');
    const closeBtn = lightbox.querySelector('.lightbox__close');
    const prevBtn = lightbox.querySelector('.lightbox__nav--prev');
    const nextBtn = lightbox.querySelector('.lightbox__nav--next');
    let index = 0;

    function open(i) {
      index = i;
      const src = items[index].querySelector('img')?.src;
      if (src) img.src = src;
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
    }
    function step(dir) {
      index = (index + dir + items.length) % items.length;
      open(index);
    }

    items.forEach((item, i) => item.addEventListener('click', () => open(i)));
    closeBtn?.addEventListener('click', close);
    prevBtn?.addEventListener('click', () => step(-1));
    nextBtn?.addEventListener('click', () => step(1));
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    });
  }
  return { init };
})();
