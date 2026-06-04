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

  // Toggle manual con el botón
  btn.addEventListener('click', () => { playing ? pause() : play(); });
  btn.setAttribute('aria-label', 'Reproducir música');

  // Pausar cuando se oculta la pestaña
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && playing) pause();
  });

  // ✅ NUEVA FUNCIONALIDAD: Reproducir automáticamente cuando el usuario ingresa
  // Escuchar el evento personalizado que se dispara en envelope.js
  document.addEventListener('wedding:auth', () => {
    // Esperar un pequeño delay para que la transición de la pantalla se complete
    setTimeout(() => {
      play();
    }, 800); // 800ms después de que comienza la transición
  });

  // ✅ ALTERNATIVA: Si CONFIG.music.autoplay está en true, también reproducir
  if (CONFIG.music.autoplay) {
    // Intentar reproducir si ya hay autenticación previa (sessionStorage)
    if (sessionStorage.getItem('wedding_auth') === 'true') {
      // Esperar a que el usuario interactúe con la página
      const startOnInteraction = () => {
        play();
        document.removeEventListener('click', startOnInteraction);
        document.removeEventListener('touchstart', startOnInteraction);
      };
      document.addEventListener('click', startOnInteraction, { once: true });
      document.addEventListener('touchstart', startOnInteraction, { once: true });
    }
  }