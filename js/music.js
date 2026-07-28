/* ==========================================================================
   MUSIC.JS — background music toggle
   ========================================================================== */

const Music = (() => {
  function init() {
    const btn = document.getElementById('music-toggle');
    const audio = document.getElementById('bg-music');
    if (!btn || !audio) return;

    audio.volume = 0.35;
    let playing = false;

    btn.addEventListener('click', () => {
      if (playing) {
        audio.pause();
        btn.classList.add('paused');
      } else {
        audio.play().catch(() => {
          console.warn('[Music] Add a track at assets/music/{{BACKGROUND_MUSIC}}.mp3 for playback to work.');
        });
        btn.classList.remove('paused');
      }
      playing = !playing;
    });

    btn.classList.add('paused'); // starts muted until the visitor opts in
  }
  return { init };
})();

document.addEventListener('DOMContentLoaded', Music.init);
