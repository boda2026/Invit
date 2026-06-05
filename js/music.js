import CONFIG from './config.js';

export function initMusic() {
  const btn   = document.getElementById('music-btn');
  const audio = document.getElementById('music-audio');
  if (!btn || !audio) return;

  audio.src    = CONFIG.music.src;
  audio.loop   = true;
  audio.volume = 0;

  let playing = false;
  let fadeRaf  = null;

  function fadeTo(targetVol, duration, onDone) {
    if (fadeRaf) cancelAnimationFrame(fadeRaf);
    const start     = performance.now();
    const startVol  = audio.volume;
    const delta     = targetVol - startVol;

    function step(now) {
      const t = Math.min((now - start) / duration, 1);
      audio.volume = Math.max(0, Math.min(1, startVol + delta * t));
      if (t < 1) {
        fadeRaf = requestAnimationFrame(step);
      } else {
        fadeRaf = null;
        if (onDone) onDone();
      }
    }
    fadeRaf = requestAnimationFrame(step);
  }

  function play() {
    audio.play().then(() => {
      fadeTo(0.65, CONFIG.music.fadeTime);
      btn.classList.add('is-playing');
      btn.setAttribute('aria-label', 'Pausar música');
      playing = true;
    }).catch(() => {});
  }

  function pause() {
    fadeTo(0, CONFIG.music.fadeTime, () => { audio.pause(); });
    btn.classList.remove('is-playing');
    btn.setAttribute('aria-label', 'Reproducir música');
    playing = false;
  }

  btn.addEventListener('click', () => { playing ? pause() : play(); });
  btn.setAttribute('aria-label', 'Reproducir música');

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && playing) pause();
  });
  // Reproducir automáticamente cuando se ingresa la contraseña correcta
  document.addEventListener('wedding:auth', () => {
    setTimeout(() => {
      play();
    }, 500); // Pequeño delay para que se complete la transición
  });
}
