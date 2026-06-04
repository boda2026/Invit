import CONFIG from './config.js';

export function initEnvelope() {
  const screen = document.getElementById('envelope-screen');
  if (!screen) return;

  if (sessionStorage.getItem('wedding_auth') === 'true') {
    screen.style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
    return;
  }

  buildEnvelopeHTML(screen);
  bindEnvelopeEvents(screen);
}

function buildEnvelopeHTML(screen) {
  screen.innerHTML = `
    <div class="env-bg">
      <div class="env-particles" id="env-particles"></div>
      <div class="env-wrapper" id="env-wrapper">

        <div class="envelope-scene" id="envelope-scene" role="button" tabindex="0" aria-label="Abrir sobre de invitación">
          <div class="envelope" id="envelope">
            <div class="env-back"></div>
            <div class="env-left-wing"></div>
            <div class="env-right-wing"></div>
            <div class="env-bottom-wing"></div>
            <div class="env-front">
              <div class="env-seal" id="env-seal">
                <div class="env-seal-inner">
                  <span class="env-seal-letter">M&amp;P</span>
                </div>
              </div>
            </div>
            <div class="env-flap" id="env-flap"></div>
          </div>

          <div class="env-letter" id="env-letter" aria-hidden="true">
            <div class="env-letter-inner">
              <div class="env-letter-ornament top"></div>
              <p class="env-letter-subtitle">Te invitamos a celebrar</p>
              <h1 class="env-letter-bride">${CONFIG.names.bride}</h1>
              <div class="env-letter-amp">&amp;</div>
              <h1 class="env-letter-groom">${CONFIG.names.groom}</h1>
              <p class="env-letter-tagline">nuestro casamiento</p>
              <div class="env-letter-divider"></div>
              <div class="env-form" id="env-form">
                <label for="env-password" class="env-label">Clave de acceso</label>
                <input
                  type="password"
                  id="env-password"
                  class="env-input"
                  placeholder="••••••••"
                  autocomplete="current-password"
                  aria-label="Clave de acceso"
                  maxlength="32"
                />
                <button class="env-btn" id="env-submit" type="button">
                  <span>Ingresar</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
                <p class="env-error" id="env-error" role="alert" aria-live="polite"></p>
              </div>
              <div class="env-letter-ornament bottom"></div>
            </div>
          </div>
        </div>

        <p class="env-hint" id="env-hint">Tocá el sobre para abrirlo</p>
      </div>
    </div>
  `;

  spawnEnvParticles();
}

function spawnEnvParticles() {
  const container = document.getElementById('env-particles');
  if (!container) return;
  for (let i = 0; i < 28; i++) {
    const p = document.createElement('div');
    p.className = 'env-particle';
    p.style.cssText = `
      left:${Math.random() * 100}%;
      top:${Math.random() * 100}%;
      width:${2 + Math.random() * 3}px;
      height:${2 + Math.random() * 3}px;
      animation-delay:${Math.random() * 7}s;
      animation-duration:${7 + Math.random() * 9}s;
      opacity:${0.15 + Math.random() * 0.45};
    `;
    container.appendChild(p);
  }
}

function bindEnvelopeEvents(screen) {
  const scene     = document.getElementById('envelope-scene');
  const flap      = document.getElementById('env-flap');
  const seal      = document.getElementById('env-seal');
  const letter    = document.getElementById('env-letter');
  const hint      = document.getElementById('env-hint');
  const input     = document.getElementById('env-password');
  const submitBtn = document.getElementById('env-submit');
  const errorEl   = document.getElementById('env-error');

  let opened = false;

  function openEnvelope() {
    if (opened) return;
    opened = true;
    hint.style.opacity = '0';
    seal.classList.add('seal-break');
    setTimeout(() => flap.classList.add('flap-open'), 420);
    setTimeout(() => {
      letter.classList.add('letter-rise');
      scene.setAttribute('aria-label', 'Sobre abierto');
    }, 950);
    setTimeout(() => {
      letter.classList.add('letter-visible');
      letter.removeAttribute('aria-hidden');
      input.focus();
    }, 1350);
  }

  scene.addEventListener('click', (e) => {
    if (!opened) { openEnvelope(); return; }
  });

  scene.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && !opened) {
      e.preventDefault();
      openEnvelope();
    }
  });

  function attemptAccess() {
    const val = input.value.trim().toLowerCase();
    if (val === CONFIG.password) {
      errorEl.textContent = '';
      input.classList.remove('input-error');
      submitBtn.disabled = true;
      sessionStorage.setItem('wedding_auth', 'true');
      revealInvitation(screen);
    } else {
      input.classList.add('input-error');
      errorEl.textContent = 'Clave incorrecta. Intentá de nuevo.';
      shakeInput(input);
      if (navigator.vibrate) navigator.vibrate([80, 40, 80]);
      input.value = '';
      input.focus();
      setTimeout(() => input.classList.remove('input-error'), 650);
    }
  }

  submitBtn.addEventListener('click', attemptAccess);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') attemptAccess(); });
}

function shakeInput(el) {
  el.classList.remove('shake');
  void el.offsetWidth;
  el.classList.add('shake');
  el.addEventListener('animationend', () => el.classList.remove('shake'), { once: true });
}

function revealInvitation(screen) {
  screen.classList.add('screen-fadeout');
  screen.addEventListener('transitionend', () => {
    screen.style.display = 'none';
    const main = document.getElementById('main-content');
    main.style.display = 'block';
    requestAnimationFrame(() => {
      main.classList.add('content-fadein');
    });
    document.dispatchEvent(new CustomEvent('wedding:auth'));
  }, { once: true });
}
