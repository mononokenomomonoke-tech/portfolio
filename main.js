'use strict';

// 1. Hamburger menu
const hamburgerBtn = document.getElementById('hamburgerBtn');
const navLinks = document.getElementById('navLinks');
if (hamburgerBtn && navLinks) {
  hamburgerBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
    hamburgerBtn.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
  });
  navLinks.querySelectorAll('a').forEach(anchor => {
    anchor.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      hamburgerBtn.setAttribute('aria-label', 'メニューを開く');
    });
  });
}

// 2. Category filter
const filterButtons = document.querySelectorAll('.filter-btn');
const workCards = document.querySelectorAll('.work-card');
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');
    const filter = btn.dataset.f;
    workCards.forEach(card => {
      const show = (filter === 'all' || card.dataset.cat === filter);
      card.classList.toggle('hidden', !show);
    });
  });
});

// 3. IntersectionObserver reveal (with fallback)
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  workCards.forEach(card => observer.observe(card));
} else {
  workCards.forEach(card => card.classList.add('visible'));
}

// 4. Lightbox with focus management
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lbImg');
const lightboxClose = document.getElementById('lbClose');
let lightboxTrigger = null;

if (lightbox && lightboxImg && lightboxClose) {
  workCards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      if (!img) return;
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('open');
      lightboxTrigger = card;
      lightboxClose.focus();
    });
    card.addEventListener('keydown', evt => {
      if (evt.key === 'Enter' || evt.key === ' ') {
        evt.preventDefault();
        card.click();
      }
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightboxImg.src = '';
    lightboxImg.alt = '';
    if (lightboxTrigger) {
      lightboxTrigger.focus();
      lightboxTrigger = null;
    }
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', evt => { if (evt.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', evt => { if (evt.key === 'Escape') closeLightbox(); });
  lightbox.addEventListener('keydown', evt => {
    if (evt.key === 'Tab') { evt.preventDefault(); lightboxClose.focus(); }
  });
}
