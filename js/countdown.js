import CONFIG from './config.js';

export function initCountdown() {
  const section = document.getElementById('countdown');
  if (!section) return;

  const target = new Date(CONFIG.weddingDate).getTime();

  const daysEl    = document.getElementById('cd-days');
  const hoursEl   = document.getElementById('cd-hours');
  const minsEl    = document.getElementById('cd-mins');
  const secsEl    = document.getElementById('cd-secs');

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    const now  = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      return;
    }

    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000) / 60000);
    const secs  = Math.floor((diff % 60000) / 1000);

    if (daysEl.textContent !== String(days))   daysEl.textContent  = String(days);
    if (hoursEl.textContent !== pad(hours))    hoursEl.textContent = pad(hours);
    if (minsEl.textContent !== pad(mins))      minsEl.textContent  = pad(mins);
    if (secsEl.textContent !== pad(secs))      secsEl.textContent  = pad(secs);
  }

  tick();
  setInterval(tick, 1000);
}
