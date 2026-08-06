/* ==========================================================================
   SFX.JS — every sound effect is SYNTHESIZED in code with the Web Audio
   API. No external mp3 files are required for these, so nothing can be
   "missing" on deploy. Background music + the real voice note still use
   normal <audio> elements (see index.html / sections/11-letters.html).

   Levels are boosted and heartbeat uses a layered thump (low sine + a
   short mid-frequency click) so it stays audible on small phone speakers,
   which usually roll off very low bass.
   ========================================================================== */

const Sfx = (() => {
  let ctx, master;

  function getCtx() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) {
        ctx = new AC();
        master = ctx.createGain();
        master.gain.value = 0.9;
        master.connect(ctx.destination);
      }
    }
    if (ctx && ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  // Call this on the very first user tap/click anywhere on the page to make
  // sure the AudioContext is unlocked as early as possible (helps iOS Safari).
  function unlock() {
    const c = getCtx();
    if (!c) return;
    if (c.state === 'suspended') c.resume();
    // Play a near-silent buffer once — the classic iOS unlock trick.
    try {
      const b = c.createBuffer(1, 1, 22050);
      const s = c.createBufferSource();
      s.buffer = b;
      s.connect(c.destination);
      s.start(0);
    } catch (_) {}
  }

  function tone(freq, { duration = 0.15, type = 'sine', gain = 0.3, glideTo, delay = 0 } = {}) {
    const c = getCtx();
    if (!c) return;
    const t0 = c.currentTime + delay;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, t0 + duration);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    osc.connect(g).connect(master);
    osc.start(t0);
    osc.stop(t0 + duration + 0.05);
  }

  function noiseBurst({ duration = 0.3, gain = 0.2, delay = 0, filterFreq = 1200, type = 'lowpass' } = {}) {
    const c = getCtx();
    if (!c) return;
    const t0 = c.currentTime + delay;
    const bufferSize = c.sampleRate * duration;
    const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = c.createBufferSource();
    noise.buffer = buffer;
    const filter = c.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = filterFreq;
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

    noise.connect(filter).connect(g).connect(master);
    noise.start(t0);
    noise.stop(t0 + duration + 0.05);
  }

  // A percussive "thump" built from a low sine + a short mid-range click,
  // so it reads as a heartbeat even on speakers that can't reproduce bass.
  function thump(delay = 0) {
    tone(55, { duration: 0.22, type: 'sine', gain: 0.55, delay });
    tone(150, { duration: 0.08, type: 'triangle', gain: 0.25, delay });
    noiseBurst({ duration: 0.06, gain: 0.15, delay, filterFreq: 220, type: 'lowpass' });
  }

  return {
    unlock,

    // Two thumps, like a heartbeat — loud enough for phone speakers.
    heartbeat() {
      thump(0);
      thump(0.32);
    },
    // Quick rising scratch — a pen touching paper.
    penDraw() {
      noiseBurst({ duration: 0.5, gain: 0.16, filterFreq: 2600, type: 'highpass' });
    },
    // Soft paper flip: short filtered noise sweep.
    pageFlip() {
      noiseBurst({ duration: 0.22, gain: 0.3, filterFreq: 1800 });
    },
    // Bright ascending chime — a gift being opened.
    giftOpen() {
      [523, 659, 784, 1046].forEach((f, i) => tone(f, { duration: 0.3, type: 'triangle', gain: 0.32, delay: i * 0.09 }));
    },
    // Light falling flutter for a rose petal.
    roseFall() {
      tone(900, { duration: 0.4, type: 'sine', gain: 0.16, glideTo: 400 });
    },
    // Continuous soft rain hiss. Returns a stop() function.
    rainStart() {
      const c = getCtx();
      if (!c) return () => {};
      const bufferSize = 2 * c.sampleRate;
      const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = c.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;
      const filter = c.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 3000;
      filter.Q.value = 0.6;
      const g = c.createGain();
      g.gain.setValueAtTime(0.0001, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.14, c.currentTime + 1);
      noise.connect(filter).connect(g).connect(master);
      noise.start();
      return () => {
        try {
          g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.6);
          setTimeout(() => noise.stop(), 700);
        } catch (_) {}
      };
    },
    // Low rumble + crack for thunder.
    thunder() {
      noiseBurst({ duration: 1.1, gain: 0.35, filterFreq: 300 });
      tone(55, { duration: 0.9, type: 'sawtooth', gain: 0.3, delay: 0.05 });
    },
  };
})();

// Unlock audio on the very first tap/click anywhere (covers the gate screen).
['pointerdown', 'click', 'touchstart'].forEach((evt) => {
  document.addEventListener(evt, () => Sfx.unlock(), { once: true, passive: true });
});
