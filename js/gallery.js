import CONFIG from './config.js';

export function initGallery() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  renderGrid(grid);
  initLightbox();
}

function renderGrid(grid) {
  CONFIG.galleryImages.forEach((img, idx) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', `Ver foto ${idx + 1}: ${img.alt}`);
    item.dataset.index = idx;

    const image = document.createElement('img');
    image.src     = img.src;
    image.alt     = img.alt;
    image.loading = 'lazy';
    image.decoding = 'async';

    const overlay = document.createElement('div');
    overlay.className = 'gallery-overlay';
    overlay.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0zM11 8v6M8 11h6"/></svg>`;

    item.appendChild(image);
    item.appendChild(overlay);
    grid.appendChild(item);

    item.addEventListener('click', () => openLightbox(idx));
    item.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') openLightbox(idx); });
  });
}

function initLightbox() {
  const lb = document.createElement('div');
  lb.id = 'lightbox';
  lb.className = 'lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-label', 'Galería de fotos');
  lb.innerHTML = `
    <div class="lb-backdrop" id="lb-backdrop"></div>
    <button class="lb-close" id="lb-close" aria-label="Cerrar">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
    </button>
    <button class="lb-nav lb-prev" id="lb-prev" aria-label="Foto anterior">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>
    </button>
    <button class="lb-nav lb-next" id="lb-next" aria-label="Siguiente foto">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>
    </button>
    <div class="lb-content">
      <div class="lb-img-wrap" id="lb-img-wrap">
        <img id="lb-img" src="" alt="" class="lb-img" draggable="false" />
        <div class="lb-spinner" id="lb-spinner" aria-hidden="true"></div>
      </div>
      <p class="lb-caption" id="lb-caption"></p>
      <div class="lb-dots" id="lb-dots"></div>
    </div>
  `;
  document.body.appendChild(lb);

  const images = CONFIG.galleryImages;
  let current = 0;
  let scale    = 1;
  let pinchDist = null;

  const lbEl     = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lb-img');
  const lbCap    = document.getElementById('lb-caption');
  const lbDots   = document.getElementById('lb-dots');
  const lbSpinner = document.getElementById('lb-spinner');
  const prevBtn  = document.getElementById('lb-prev');
  const nextBtn  = document.getElementById('lb-next');
  const closeBtn = document.getElementById('lb-close');
  const backdrop = document.getElementById('lb-backdrop');
  const imgWrap  = document.getElementById('lb-img-wrap');

  images.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'lb-dot';
    dot.setAttribute('aria-label', `Ir a foto ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    lbDots.appendChild(dot);
  });

  function updateDots() {
    document.querySelectorAll('.lb-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function goTo(idx) {
    scale = 1;
    imgWrap.style.transform = 'scale(1)';
    current = (idx + images.length) % images.length;
    lbImg.style.opacity = '0';
    lbSpinner.style.display = 'block';

    const newImg = new Image();
    newImg.onload = () => {
      lbImg.src = images[current].src;
      lbImg.alt = images[current].alt;
      lbCap.textContent = images[current].alt;
      lbSpinner.style.display = 'none';
      lbImg.style.opacity = '1';
    };
    newImg.onerror = () => {
      lbImg.src = '';
      lbSpinner.style.display = 'none';
      lbImg.style.opacity = '1';
    };
    newImg.src = images[current].src;
    updateDots();
  }

  function openLightbox(idx) {
    current = idx;
    lbEl.classList.add('lb-open');
    document.body.style.overflow = 'hidden';
    goTo(idx);
    closeBtn.focus();
  }

  function closeLightbox() {
    lbEl.classList.remove('lb-open');
    document.body.style.overflow = '';
    scale = 1;
    imgWrap.style.transform = 'scale(1)';
  }

  closeBtn.addEventListener('click', closeLightbox);
  backdrop.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  document.addEventListener('keydown', (e) => {
    if (!lbEl.classList.contains('lb-open')) return;
    if (e.key === 'ArrowLeft')  goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
    if (e.key === 'Escape')     closeLightbox();
  });

  // Zoom on double-click/double-tap
  let lastTap = 0;
  imgWrap.addEventListener('dblclick', () => {
    scale = scale === 1 ? 2 : 1;
    imgWrap.style.transform = `scale(${scale})`;
  });
  imgWrap.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTap < 300) {
      scale = scale === 1 ? 2 : 1;
      imgWrap.style.transform = `scale(${scale})`;
    }
    lastTap = now;
  });

  // Pinch zoom
  imgWrap.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
      pinchDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
    }
  }, { passive: true });

  imgWrap.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2 && pinchDist) {
      const newDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      scale = Math.min(3, Math.max(1, scale * (newDist / pinchDist)));
      imgWrap.style.transform = `scale(${scale})`;
      pinchDist = newDist;
    }
  }, { passive: true });

  imgWrap.addEventListener('touchend', () => { pinchDist = null; });

  // Swipe
  let swipeStartX = 0;
  lbEl.addEventListener('touchstart', (e) => {
    swipeStartX = e.touches[0].clientX;
  }, { passive: true });

  lbEl.addEventListener('touchend', (e) => {
    const diff = swipeStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50 && scale === 1) {
      diff > 0 ? goTo(current + 1) : goTo(current - 1);
    }
  });

  window.openLightbox = openLightbox;
}

window.openLightbox = window.openLightbox || (() => {});
