/* ============================================================
   HERO SLIDER（トップページのみ）
   ============================================================ */
const slides = document.querySelectorAll('.hero-slide');
const dots   = document.querySelectorAll('.dot');
let current  = 0;
let timer    = null;

function showSlide(index) {
  slides[current].classList.remove('active');
  dots[current].classList.remove('active');
  current = (index + slides.length) % slides.length;
  slides[current].classList.add('active');
  dots[current].classList.add('active');
}

function startAutoPlay() {
  timer = setInterval(() => showSlide(current + 1), 5000);
}

function resetAutoPlay() {
  clearInterval(timer);
  startAutoPlay();
}

const heroNext = document.getElementById('hero-next');
const heroPrev = document.getElementById('hero-prev');

if (slides.length > 0 && heroNext && heroPrev) {
  heroNext.addEventListener('click', () => {
    showSlide(current + 1);
    resetAutoPlay();
  });
  heroPrev.addEventListener('click', () => {
    showSlide(current - 1);
    resetAutoPlay();
  });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      showSlide(parseInt(dot.dataset.index));
      resetAutoPlay();
    });
  });

  startAutoPlay();
}

/* ============================================================
   HEADER SCROLL BEHAVIOR
   ============================================================ */
const header = document.getElementById('site-header');

if (header) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ============================================================
   MOBILE NAV TOGGLE
   ============================================================ */
const navToggle = document.getElementById('nav-toggle');
const globalNav = document.getElementById('global-nav');

if (navToggle && globalNav) {
  navToggle.addEventListener('click', () => {
    globalNav.classList.toggle('open');
    const isOpen = globalNav.classList.contains('open');
    navToggle.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
    const spans = navToggle.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    }
  });

  globalNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      globalNav.classList.remove('open');
      const spans = navToggle.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    });
  });
}

/* ============================================================
   PAGE TOP BUTTON
   ============================================================ */
const pageTop = document.getElementById('page-top');

if (pageTop) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      pageTop.classList.add('visible');
    } else {
      pageTop.classList.remove('visible');
    }
  });
}

/* ============================================================
   SCROLL ANIMATION (Intersection Observer)
   ============================================================ */
const animateTargets = document.querySelectorAll(
  '.feature-card, .shop-card, .event-card, .news-item, .concept-grid, .access-grid'
);

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity    = '1';
      entry.target.style.transform  = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

animateTargets.forEach((el, i) => {
  el.style.opacity    = '0';
  el.style.transform  = 'translateY(24px)';
  el.style.transition = `opacity 0.6s ease ${(i % 4) * 0.1}s, transform 0.6s ease ${(i % 4) * 0.1}s`;
  observer.observe(el);
});

/* ============================================================
   共通：アニメーション設定
   ============================================================ */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============================================================
   OPENING LOGO ANIMATION（トップページのみ・1セッション1回）
   ============================================================ */
const opening = document.getElementById('opening');

if (opening) {
  if (reduceMotion || sessionStorage.getItem('bp-opening-shown')) {
    opening.remove();
  } else {
    sessionStorage.setItem('bp-opening-shown', '1');
    const logoEl = opening.querySelector('.opening-logo');
    const text = logoEl.textContent;
    logoEl.textContent = '';
    [...text].forEach((ch, i) => {
      const span = document.createElement('span');
      span.textContent = ch === ' ' ? ' ' : ch;
      span.style.animationDelay = (0.07 * i) + 's';
      logoEl.appendChild(span);
    });
    document.body.classList.add('no-scroll');
    setTimeout(() => {
      opening.classList.add('opening-done');
      document.body.classList.remove('no-scroll');
      setTimeout(() => opening.remove(), 900);
    }, 2300);
  }
}

/* ============================================================
   SCROLL PARALLAX（ヒーロー画像・ページヒーロー）
   ============================================================ */
const heroSlider = document.getElementById('hero-slider');
const heroTexts  = document.querySelectorAll('.hero-text');
const pageHero   = document.querySelector('.page-hero');

if (!reduceMotion && (heroSlider || pageHero)) {
  let parallaxTicking = false;

  function applyParallax() {
    const y = window.scrollY;

    if (heroSlider && y <= window.innerHeight) {
      heroSlider.style.transform = 'translateY(' + (y * 0.35) + 'px)';
      heroTexts.forEach(t => {
        t.style.transform = 'translateY(' + (y * 0.18) + 'px)';
        t.style.opacity = Math.max(0, 1 - y / (window.innerHeight * 0.55));
      });
    }

    if (pageHero) {
      const rect = pageHero.getBoundingClientRect();
      if (rect.bottom > 0) {
        pageHero.style.backgroundPositionY = 'calc(50% + ' + (y * 0.3) + 'px)';
      }
    }

    parallaxTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (!parallaxTicking) {
      requestAnimationFrame(applyParallax);
      parallaxTicking = true;
    }
  }, { passive: true });

  applyParallax();
}

/* ============================================================
   CUSTOM CURSOR & MAGNETIC BUTTONS（マウス操作のPCのみ）
   ============================================================ */
const finePointer = window.matchMedia('(pointer: fine)').matches;

if (finePointer && !reduceMotion) {
  document.body.classList.add('custom-cursor-active');

  const cursorDot = document.createElement('div');
  cursorDot.className = 'cursor-dot';
  const cursorRing = document.createElement('div');
  cursorRing.className = 'cursor-ring';
  document.body.appendChild(cursorDot);
  document.body.appendChild(cursorRing);

  let mouseX = -100, mouseY = -100;
  let ringX = -100, ringY = -100;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.transform = 'translate(' + mouseX + 'px, ' + mouseY + 'px) rotate(-45deg)';
  });

  (function followCursor() {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    cursorRing.style.transform = 'translate(' + ringX + 'px, ' + ringY + 'px)';
    requestAnimationFrame(followCursor);
  })();

  // リンク・ボタンに乗るとリングが拡大
  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('cursor-ring-hover'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('cursor-ring-hover'));
  });

  // 磁石ボタン：カーソルに吸い寄せられる
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      btn.style.transform = 'translate(' + (dx * 0.25) + 'px, ' + (dy * 0.25) + 'px)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

/* ============================================================
   CONTACT FORM（トップページのみ・送信処理はサーバー側で実装）
   ============================================================ */
const contactForm = document.getElementById('contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = this.querySelector('button[type="submit"]');
    btn.textContent = '送信中...';
    btn.disabled = true;

    // ここにサーバーへの送信処理を実装してください (fetch / FormData など)
    setTimeout(() => {
      btn.textContent = '送信しました！';
      this.reset();
      setTimeout(() => {
        btn.textContent = '送信する';
        btn.disabled = false;
      }, 3000);
    }, 1000);
  });
}
