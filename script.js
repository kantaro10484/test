/* ============================================================
   HERO SLIDER
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

document.getElementById('hero-next').addEventListener('click', () => {
  showSlide(current + 1);
  resetAutoPlay();
});
document.getElementById('hero-prev').addEventListener('click', () => {
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

/* ============================================================
   HEADER SCROLL BEHAVIOR
   ============================================================ */
const header = document.getElementById('site-header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

/* ============================================================
   MOBILE NAV TOGGLE
   ============================================================ */
const navToggle = document.getElementById('nav-toggle');
const globalNav = document.getElementById('global-nav');

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

/* ============================================================
   PAGE TOP BUTTON
   ============================================================ */
const pageTop = document.getElementById('page-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    pageTop.classList.add('visible');
  } else {
    pageTop.classList.remove('visible');
  }
});

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
   CONTACT FORM (フロントエンドのみ・送信処理はサーバー側で実装)
   ============================================================ */
document.getElementById('contact-form').addEventListener('submit', function(e) {
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
