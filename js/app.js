import { initEnvelope }      from './envelope.js';
import { initCountdown }     from './countdown.js';
import { initMusic }         from './music.js';
import { initGallery }       from './gallery.js';
import { initScrollEffects } from './scroll-effects.js';
import CONFIG                from './config.js';

document.addEventListener('DOMContentLoaded', () => {
  // If already authenticated, boot app immediately
  if (sessionStorage.getItem('wedding_auth') === 'true') {
    initApp();
  } else {
    // Wait for successful password entry
    document.addEventListener('wedding:auth', initApp, { once: true });
  }

  // Always init envelope (handles both cases internally)
  initEnvelope();
});

function initApp() {
  initScrollEffects();
  initCountdown();
  initMusic();
  initGallery();
  initCopyAlias();
  initToast();
  initSmoothScroll();
  initRSVP();
}

function initCopyAlias() {
  const btn = document.getElementById('copy-alias-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const alias = CONFIG.gift.alias;
    navigator.clipboard
      ? navigator.clipboard.writeText(alias).then(() => showToast('Alias copiado ✓')).catch(() => fallbackCopy(alias))
      : fallbackCopy(alias);
  });
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); showToast('Alias copiado ✓'); } catch (_) {}
  document.body.removeChild(ta);
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('toast-visible');
  setTimeout(() => toast.classList.remove('toast-visible'), 2800);
}

function initToast() {
  if (document.getElementById('toast')) return;
  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  document.body.appendChild(toast);
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

function initRSVP() {
  const btn = document.getElementById('rsvp-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    window.open(CONFIG.rsvp.formUrl, '_blank', 'noopener,noreferrer');
  });
}
