import CONFIG from './config.js';

export function initMusic() {
  const btn = document.getElementById('music-btn');
  if (!btn) return;

  // Create audio element fresh to avoid stale state
  const audio = document.createElement('audio');
  audio.loop    = true;
  audio.preload = 'none';
  audio.volume  = 0;
  audio.setAttribute('aria-hidden', 'true');

  // Set source with both a <source> child and .src fallback
  const source = document.createElement('source');
  source.src  = CONFIG.music.src;
  source.type = 'audio/mpeg';
  audio.appendChild(source);
  audio.src = CONFIG.music.src;

  document.body.appendChild(audio);

  // Remove any old placeholder audio element from HTML
  const oldAudio = document.getElementById('music-audio');
  if (oldAudio) oldAudio.remove();

  let playing  = false;
  let fadeRaf  = null;

  function fadeTo(targetVol, duration, onDone) {
    if (fadeRaf) cancelAnimationFrame(fadeRaf);
    const start    = performance.now();
    const startVol = audio.volume;
    const delta    = targetVol - startVol;

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
    // load() resets the element so .play() works reliably after src set
    audio.load();
    const promise = audio.play();
    if (promise !== undefined) {
      promise.then(() => {
        fadeTo(0.65, CONFIG.music.fadeTime);
        btn.classList.add('is-playing');
        btn.setAttribute('aria-label', 'Pausar música');
        playing = true;
      }).catch((err) => {
        console.warn('Audio play blocked:', err);
      });
    }
  }

  function pause() {
    fadeTo(0, CONFIG.music.fadeTime / 2, () => { audio.pause(); });
    btn.classList.remove('is-playing');
    btn.setAttribute('aria-label', 'Reproducir música');
    playing = false;
  }

  btn.addEventListener('click', () => { playing ? pause() : play(); });
  btn.setAttribute('aria-label', 'Reproducir música');

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && playing) pause();
  });
}
