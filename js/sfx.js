/* ==========================================================================
   SFX.JS — every sound effect is SYNTHESIZED in code with the Web Audio
   API. No external mp3 files are required for these, so nothing can be
   "missing" on deploy. Background music + the real voice note still use
   normal <audio> elements (see index.html / sections/11-letters.html).
   ========================================================================== */

const Sfx = (() => {
  let ctx;
  function getCtx() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) ctx = new AC();
    }
    if (ctx && ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone(freq, { duration = 0.15, type = 'sine', gain = 0.2, glideTo, delay = 0 } = {}) {
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
    osc.connect(g).connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + duration + 0.05);
  }

  function noiseBurst({ duration = 0.3, gain = 0.15, delay = 0, filterFreq = 1200, type = 'lowpass' } = {}) {
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

    noise.connect(filter).connect(g).connect(c.destination);
    noise.start(t0);
    noise.stop(t0 + duration + 0.05);
  }

  return {
    // Two soft low thumps, like a heartbeat.
    heartbeat() {
      tone(70, { duration: 0.14, type: 'sine', gain: 0.35 });
      tone(65, { duration: 0.16, type: 'sine', gain: 0.28, delay: 0.22 });
    },
    // Quick rising scratch — a pen touching paper.
    penDraw() {
      noiseBurst({ duration: 0.5, gain: 0.05, filterFreq: 2600, type: 'highpass' });
    },
    // Soft paper flip: short filtered noise sweep.
    pageFlip() {
      noiseBurst({ duration: 0.22, gain: 0.12, filterFreq: 1800 });
    },
    // Bright ascending chime — a gift being opened.
    giftOpen() {
      [523, 659, 784, 1046].forEach((f, i) => tone(f, { duration: 0.3, type: 'triangle', gain: 0.18, delay: i * 0.09 }));
    },
    // Light falling flutter for a rose petal.
    roseFall() {
      tone(900, { duration: 0.4, type: 'sine', gain: 0.06, glideTo: 400 });
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
      g.gain.exponentialRampToValueAtTime(0.05, c.currentTime + 1);
      noise.connect(filter).connect(g).connect(c.destination);
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
      noiseBurst({ duration: 1.1, gain: 0.22, filterFreq: 300 });
      tone(55, { duration: 0.9, type: 'sawtooth', gain: 0.15, delay: 0.05 });
    },
  };
})();
