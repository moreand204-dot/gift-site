/* ==========================================================================
   MUSIC.JS — background music toggle. Uses the <audio> element's own
   .paused state as the single source of truth (autoplay may start it
   from main.js, so we don't track a separate "playing" flag here).
   ========================================================================== */

const Music = (() => {
  function init() {
    const btn = document.getElementById('music-toggle');
    const audio = document.getElementById('bg-music');
    if (!btn || !audio) return;

    audio.volume = 0.35;

    function syncButton() {
      btn.classList.toggle('paused', audio.paused);
    }

    btn.addEventListener('click', () => {
      if (audio.paused) {
        audio.play().catch(() => {
          console.warn('[Music] Add a track at assets/music/{{BACKGROUND_MUSIC}}.mp3 for playback to work.');
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
