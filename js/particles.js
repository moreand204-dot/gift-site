/* ==========================================================================
   PARTICLES.JS — lightweight canvas starfield / golden dust / meteor shower
   Custom, dependency-free implementation (keeps bundle small; Particles.js
   is not required for this effect).
   ========================================================================== */

const ParticleField = (() => {
  let canvas, ctx, w, h;
  let stars = [];
  let meteors = [];
  let raf;

  const STAR_COUNT = 140;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function makeStar() {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.4 + 0.2,
      baseAlpha: Math.random() * 0.6 + 0.2,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      phase: Math.random() * Math.PI * 2,
      color: Math.random() < 0.15 ? '255,216,107' : '255,255,255',
    };
  }

  function maybeSpawnMeteor() {
    if (Math.random() < 0.0025 && meteors.length < 2) {
      meteors.push({
        x: Math.random() * w * 0.6 + w * 0.2,
        y: -20,
        vx: -4 - Math.random() * 2,
        vy: 5 + Math.random() * 2,
        life: 1,
      });
    }
  }

  function draw(t) {
    ctx.clearRect(0, 0, w, h);

    // Stars
    for (const s of stars) {
      const alpha = s.baseAlpha + Math.sin(t * s.twinkleSpeed + s.phase) * 0.25;
      ctx.beginPath();
      ctx.fillStyle = `rgba(${s.color},${Math.max(alpha, 0)})`;
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Meteors
    maybeSpawnMeteor();
    meteors.forEach((m) => {
      ctx.save();
      ctx.strokeStyle = `rgba(255,216,107,${m.life})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(m.x - m.vx * 8, m.y - m.vy * 8);
      ctx.stroke();
      ctx.restore();
      m.x += m.vx;
      m.y += m.vy;
      m.life -= 0.012;
    });
    meteors = meteors.filter((m) => m.life > 0 && m.y < h + 50);

    raf = requestAnimationFrame(draw);
  }

  function init() {
    canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resize();
    stars = Array.from({ length: STAR_COUNT }, makeStar);
    window.addEventListener('resize', resize);
    raf = requestAnimationFrame(draw);
  }

  function destroy() {
    cancelAnimationFrame(raf);
  }

  return { init, destroy };
})();

/* ---- Golden dust: small DOM-based drifting particles, cheaper than canvas
       for a low-density ambient accent layered above the starfield ---- */
const GoldenDust = (() => {
  function spawn(host, count = 22) {
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('span');
      const size = Math.random() * 3 + 1;
      dot.style.cssText = `
        position:absolute;
        width:${size}px;height:${size}px;
        left:${Math.random() * 100}%;
        top:${Math.random() * 100}%;
        border-radius:50%;
        background:radial-gradient(circle, rgba(255,216,107,0.9), transparent 70%);
        --dx:${(Math.random() - 0.5) * 40}px;
        --dy:${(Math.random() - 0.5) * 40}px;
        animation: drift ${8 + Math.random() * 10}s ease-in-out ${Math.random() * 4}s infinite;
      `;
      host.appendChild(dot);
    }
  }

  function init() {
    const host = document.getElementById('golden-dust');
    if (host) spawn(host);
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => {
  ParticleField.init();
  GoldenDust.init();
});
