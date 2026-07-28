/* ==========================================================================
   CURSOR.JS — custom glowing cursor (dot + trailing ring)
   ========================================================================== */

const CustomCursor = (() => {
  let dot, ring;
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  function onMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%,-50%)`;
  }

  function loop() {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  }

  function bindHoverTargets() {
    document.body.addEventListener('mouseover', (e) => {
      if (e.target.closest('a, button, .gallery-item, .timeline__card, [data-cursor-hover]')) {
        ring.style.width = '52px';
        ring.style.height = '52px';
        ring.style.borderColor = 'rgba(255,94,168,0.85)';
      }
    });
    document.body.addEventListener('mouseout', (e) => {
      if (e.target.closest('a, button, .gallery-item, .timeline__card, [data-cursor-hover]')) {
        ring.style.width = '32px';
        ring.style.height = '32px';
        ring.style.borderColor = 'rgba(255,216,107,0.6)';
      }
    });
  }

  function init() {
    dot = document.getElementById('cursor-dot');
    ring = document.getElementById('cursor-ring');
    if (!dot || !ring || matchMedia('(hover: none)').matches) return;
    window.addEventListener('mousemove', onMove);
    bindHoverTargets();
    requestAnimationFrame(loop);
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', CustomCursor.init);
