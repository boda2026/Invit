export function initScrollEffects() {
  initParallax();
  initRevealOnScroll();
  initParticles();
}

function initParallax() {
  const hero = document.getElementById('hero');
  if (!hero) return;

  const heroImg = hero.querySelector('.hero-bg');
  if (!heroImg) return;

  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        if (scrollY < window.innerHeight * 1.5) {
          heroImg.style.transform = `translate3d(0, ${scrollY * 0.45}px, 0)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
}

function initRevealOnScroll() {
  const targets = document.querySelectorAll('[data-reveal]');
  if (!targets.length) return;

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, Number(delay));
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach((el) => obs.observe(el));
}

function initParticles() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.min(50, Math.floor(W / 20));
    for (let i = 0; i < count; i++) {
      particles.push({
        x:    Math.random() * W,
        y:    Math.random() * H,
        r:    0.5 + Math.random() * 2.5,
        dx:   (Math.random() - 0.5) * 0.35,
        dy:   -0.15 - Math.random() * 0.4,
        alpha: 0.15 + Math.random() * 0.5,
        color: Math.random() > 0.5 ? '#DABD9D' : '#ffffff',
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();

      p.x += p.dx;
      p.y += p.dy;

      if (p.y < -10) p.y = H + 10;
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  const ro = new ResizeObserver(() => {
    resize();
    createParticles();
  });
  ro.observe(canvas);

  resize();
  createParticles();
  draw();
}
