/* ==========================================================================
   EFFECTS.JS — the site's signature moments:
     - PenDraw: golden pen sketching a heart (intro + ending)
     - FloatingHearts: ambient hearts drifting upward
     - Storm: rain + lightning for the "problems" section
     - FallingRoses: rose petals for the ending
     - WordCycle: word-by-word ink reveal for the ending montage
   ========================================================================== */

/* ---------- Golden pen drawing a heart, stroke-by-stroke ---------- */
const PenDraw = (() => {
  function heartPath(cx, cy, scale) {
    // Parametric heart curve, sampled into points for progressive stroke draw
    const pts = [];
    for (let t = 0; t <= Math.PI * 2; t += 0.02) {
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      pts.push([cx + x * scale, cy + y * scale]);
    }
    return pts;
  }

  function run(canvas, { duration = 2200, onDone } = {}) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const cx = rect.width / 2;
    const cy = rect.height / 2.3;
    const scale = Math.min(rect.width, rect.height) / 40;
    const points = heartPath(cx, cy, scale);

    let start;
    function frame(ts) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const count = Math.floor(progress * points.length);

      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.strokeStyle = '#ffd86b';
      ctx.lineWidth = 2.4;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.shadowColor = 'rgba(255,216,107,0.8)';
      ctx.shadowBlur = 12;

      ctx.beginPath();
      points.slice(0, count).forEach(([x, y], i) => {
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Pen nib
      if (count > 0 && count < points.length) {
        const [nx, ny] = points[count - 1];
        ctx.beginPath();
        ctx.fillStyle = '#fff';
        ctx.arc(nx, ny, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      if (progress < 1) requestAnimationFrame(frame);
      else if (onDone) onDone();
    }
    requestAnimationFrame(frame);
  }

  return { run };
})();

/* ---------- Ambient floating hearts (SVG icons, no emoji) ---------- */
const FloatingHearts = (() => {
  let interval;
  const ICONS = ['heart', 'heart', 'sparkles'];

  function spawnOne(host) {
    const el = document.createElement('span');
    const icon = ICONS[Math.floor(Math.random() * ICONS.length)];
    el.innerHTML = `<i data-lucide="${icon}"></i>`;
    const size = Math.random() * 14 + 12;
    el.style.cssText = `
      position:absolute;
      left:${Math.random() * 100}%;
      bottom:-5%;
      width:${size}px; height:${size}px;
      color:${icon === 'sparkles' ? '#ffd86b' : '#ff5ea8'};
      --o:${Math.random() * 0.5 + 0.3};
      --s:${Math.random() * 0.6 + 0.6};
      --drift:${(Math.random() - 0.5) * 120}px;
      animation: floatUp ${10 + Math.random() * 8}s linear forwards;
    `;
    host.appendChild(el);
    if (window.lucide) lucide.createIcons();
    setTimeout(() => el.remove(), 19000);
  }

  function init() {
    const host = document.getElementById('floating-hearts');
    if (!host) return;
    interval = setInterval(() => spawnOne(host), 1400);
  }

  function stop() { clearInterval(interval); }

  return { init, stop };
})();

/* ---------- Shared sound-effect helper ---------- */
function playSfx(id, { loop = false } = {}) {
  const el = document.getElementById(id);
  if (!el) return null;
  try {
    el.loop = loop;
    el.currentTime = 0;
    el.play().catch(() => {});
  } catch (_) {}
  return el;
}
function stopSfx(id) {
  const el = document.getElementById(id);
  if (el) { el.pause(); el.currentTime = 0; }
}

/* ---------- Storm: rain canvas + lightning flash for "problems" section ---------- */
const Storm = (() => {
  let active = false;

  function buildRainCanvas(container) {
    const canvas = document.createElement('canvas');
    canvas.className = 'storm-rain';
    canvas.style.cssText = 'position:absolute;inset:0;pointer-events:none;';
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const resize = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const drops = Array.from({ length: 90 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      len: Math.random() * 18 + 10,
      speed: Math.random() * 6 + 8,
      opacity: Math.random() * 0.3 + 0.15,
    }));

    let raf;
    function draw() {
      if (!active) { cancelAnimationFrame(raf); return; }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(216,180,255,0.5)';
      ctx.lineWidth = 1;
      drops.forEach((d) => {
        ctx.globalAlpha = d.opacity;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 2, d.y + d.len);
        ctx.stroke();
        d.y += d.speed;
        if (d.y > canvas.height) { d.y = -20; d.x = Math.random() * canvas.width; }
      });
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);
  }

  function buildLightning(container) {
    const flash = document.createElement('div');
    flash.className = 'storm-lightning';
    flash.style.cssText = `
      position:absolute; inset:0; background:#fff; opacity:0;
      mix-blend-mode:overlay; pointer-events:none;
      animation: lightningFlash 7s ease-in-out infinite;
    `;
    container.appendChild(flash);
  }

  function start(container) {
    if (!container || active) return;
    active = true;
    container.style.position = 'relative';
    buildRainCanvas(container);
    buildLightning(container);
    container.classList.add('is-stormy');
    playSfx('sfx-rain', { loop: true });
    setTimeout(() => playSfx('sfx-thunder'), 900);
  }

  function calm(container) {
    active = false;
    if (container) container.classList.remove('is-stormy');
    stopSfx('sfx-rain');
  }

  return { start, calm };
})();

/* ---------- Falling roses for the ending (SVG shape, no emoji) ---------- */
const FallingRoses = (() => {
  const ROSE_SVG = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3c-2 1.5-2 4-0.5 5.2C13.5 9.4 15 8 15 6.2 15 8 13 9 12 9.5 11 9 9 8 9 6.2 9 8 10.5 9.4 12.5 8.2 14 7 14 4.5 12 3Z" fill="#ff2d55"/>
    <path d="M12 9.5c-1.4.9-2.4 2.4-2.4 4.1 0 2.4 1.9 4.4 4.3 4.6-.4-1.7-1-3.6-.9-5.6.05-1.2.5-2.3 1-3.1-.6.1-1.3-.1-2-0z" fill="#c81f42"/>
    <path d="M12 13v8" stroke="#3a7d44" stroke-width="1.4" stroke-linecap="round"/>
    <path d="M12 17c-1.4 0-2.6-.9-3-2.1M12 19c1.3-.1 2.4-1 2.8-2.2" stroke="#3a7d44" stroke-width="1.2" stroke-linecap="round"/>
  </svg>`;

  function init(container, count = 26) {
    if (!container) return;
    playSfx('sfx-rose-fall');
    for (let i = 0; i < count; i++) {
      const rose = document.createElement('span');
      rose.className = 'rose';
      rose.innerHTML = ROSE_SVG;
      rose.style.left = `${Math.random() * 100}%`;
      rose.style.animationDuration = `${6 + Math.random() * 6}s`;
      rose.style.animationDelay = `${Math.random() * 6}s`;
      container.appendChild(rose);
    }
  }
  return { init };
})();

/* ---------- Word-by-word ink cycle for the ending montage ---------- */
const WordCycle = (() => {
  function run(host, words, { interval = 1600 } = {}) {
    if (!host || !words?.length) return;
    let i = 0;
    function show() {
      host.textContent = words[i % words.length];
      host.classList.remove('ink-reveal');
      void host.offsetWidth; // restart animation
      host.classList.add('ink-reveal');
      i++;
    }
    show();
    return setInterval(show, interval);
  }
  return { run };
})();
