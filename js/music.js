/* ==========================================================================
   MUSIC.JS — background music toggle.
   Auto-detects the song file so a missing/renamed placeholder can never
   silently break playback: just drop your file in assets/music/ named
   "song.<mp3|m4a|wav|ogg>" and it will be found automatically. You can
   still hardcode an exact filename below if you prefer.
   ========================================================================== */

const Music = (() => {
  // If you know your exact filename, put it first here (e.g. 'assets/music/our-song.mp3').
  const CANDIDATES = [
    'assets/music/song.mp3',
    'assets/music/song.m4a',
    'assets/music/song.wav',
    'assets/music/song.ogg',
    'assets/music/background.mp3',
    'assets/music/music.mp3',
  ];

  function findWorkingSrc(audio) {
    return new Promise((resolve) => {
      let i = 0;
      function tryNext() {
        if (i >= CANDIDATES.length) { resolve(null); return; }
        const candidate = CANDIDATES[i++];
        const probe = new Audio();
        const cleanup = () => {
          probe.removeEventListener('loadedmetadata', onOk);
          probe.removeEventListener('error', onFail);
        };
        const onOk = () => { cleanup(); resolve(candidate); };
        const onFail = () => { cleanup(); tryNext(); };
        probe.addEventListener('loadedmetadata', onOk, { once: true });
        probe.addEventListener('error', onFail, { once: true });
        probe.src = candidate;
      }
      tryNext();
    });
  }

  function init() {
    const btn = document.getElementById('music-toggle');
    const audio = document.getElementById('bg-music');
    if (!btn || !audio) return;

    audio.volume = 0.35;

    function syncButton() {
      btn.classList.toggle('paused', audio.paused);
    }

    findWorkingSrc(audio).then((src) => {
      if (src) {
        audio.src = src;
      } else {
        console.warn('[Music] No background track found. Add a file at assets/music/song.mp3 (or edit CANDIDATES in js/music.js to match your filename).');
      }
    });

    btn.addEventListener('click', () => {
      if (audio.paused) {
        audio.play().catch(() => {
          console.warn('[Music] Playback blocked or file missing — check assets/music/.');
        });
      } else {
        audio.pause();
      }
    });

    audio.addEventListener('play', syncButton);
    audio.addEventListener('pause', syncButton);
    syncButton();
  }
  return { init };
})();

document.addEventListener('DOMContentLoaded', Music.init);
