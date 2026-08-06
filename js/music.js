/* ==========================================================================
   MUSIC.JS — background music toggle.
   Auto-detects the song file so a missing/renamed placeholder can never
   silently break playback: just drop your file in assets/music/ named
   "song.<mp3|m4a|wav|ogg>" and it will be found automatically. You can
   still hardcode an exact filename below if you prefer.

   If no file is found, the toggle button gets a `.music-toggle--missing`
   class (dimmed, no bars animating) so it's visually obvious this is a
   "no file uploaded" situation, not a broken button.
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

  function probeOne(candidate) {
    return new Promise((resolve) => {
      const probe = new Audio();
      let settled = false;
      const finish = (ok) => {
        if (settled) return;
        settled = true;
        probe.removeEventListener('loadedmetadata', onOk);
        probe.removeEventListener('error', onFail);
        resolve(ok ? candidate : null);
      };
      const onOk = () => finish(true);
      const onFail = () => finish(false);
      probe.addEventListener('loadedmetadata', onOk, { once: true });
      probe.addEventListener('error', onFail, { once: true });
      probe.src = candidate;
      probe.load();
      // Safety net: some browsers never fire either event for a 404 in odd setups.
      setTimeout(() => finish(false), 4000);
    });
  }

  async function findWorkingSrc() {
    for (const candidate of CANDIDATES) {
      const found = await probeOne(candidate);
      if (found) return found;
    }
    return null;
  }

  function init() {
    const btn = document.getElementById('music-toggle');
    const audio = document.getElementById('bg-music');
    if (!btn || !audio) return;

    audio.volume = 0.35;
    let trackFound = false;

    function syncButton() {
      btn.classList.toggle('paused', audio.paused || !trackFound);
    }

    findWorkingSrc().then((src) => {
      if (src) {
        trackFound = true;
        audio.src = src;
        console.info('[Music] Track found at', src);
      } else {
        btn.classList.add('music-toggle--missing');
        console.warn('[Music] No background track found. Add a file at assets/music/song.mp3 (exact name, case-sensitive) — see CANDIDATES in js/music.js to use a different filename.');
      }
      syncButton();
    });

    btn.addEventListener('click', () => {
      if (!trackFound) {
        console.warn('[Music] No track loaded yet — add assets/music/song.mp3.');
        return;
      }
      if (audio.paused) {
        audio.play().catch((err) => {
          console.warn('[Music] Playback blocked:', err && err.message);
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
