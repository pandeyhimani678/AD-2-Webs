// script.js - Interactivity for Wanderlust front-end

document.addEventListener('DOMContentLoaded', function () {
  // Elements
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');
  const header = document.getElementById('header');
  const hero = document.getElementById('hero');
  const heroVideo = document.getElementById('hero-video');
  const heroImage = document.getElementById('hero-image');
  const userBtn = document.querySelector('.user-btn');
  const loginModal = document.getElementById('login-modal');

  // Toggle mobile navigation
  hamburger.addEventListener('click', function () {
    const open = hamburger.classList.toggle('open');
    if (open) {
      navMenu.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
    } else {
      navMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });

  // Close mobile nav when a link is clicked
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // User / profile button opens login modal when present, otherwise navigate to login page
  if (userBtn) {
    userBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (loginModal) {
        loginModal.classList.add('open');
        loginModal.setAttribute('aria-hidden', 'false');
        // focus first input
        const first = loginModal.querySelector('input');
        if (first) first.focus();
      } else {
        // fallback to dedicated login page
        window.location.href = 'login.html';
      }
    });
  }

  // Modal close behavior (delegated)
  function closeLoginModal() {
    if (!loginModal) return;
    loginModal.classList.remove('open');
    loginModal.setAttribute('aria-hidden', 'true');
  }
  if (loginModal) {
    // close button
    const closeBtn = loginModal.querySelector('.login-close');
    if (closeBtn) closeBtn.addEventListener('click', closeLoginModal);
    // backdrop click
    const backdrop = loginModal.querySelector('.login-backdrop');
    if (backdrop) backdrop.addEventListener('click', closeLoginModal);
    // ESC key
    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape') closeLoginModal();
    });
    // submit handler - demo
    const loginForm = loginModal.querySelector('#login-form');
    if (loginForm) loginForm.addEventListener('submit', (ev) => {
      ev.preventDefault();
      // simple demo behavior
      alert('Signed in (demo)');
      closeLoginModal();
    });
  }

  // Header scroll effect: become more opaque after leaving hero
  const heroHeight = hero ? hero.offsetHeight : 500;
  function onScroll() {
    if (window.scrollY > heroHeight - 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Search on Enter key press and form submission
  function handleSearch() {
    const val = searchInput.value.trim();
    if (!val) {
      // simple shake animation via class
      searchInput.classList.add('input-error');
      setTimeout(() => searchInput.classList.remove('input-error'), 700);
      searchInput.focus();
      return;
    }
    // In real app, you'd submit or navigate to results
    alert('Searching for: ' + val);
  }

  // Handle form submission (Enter key)
  searchForm.addEventListener('submit', function (e) {
    e.preventDefault();
    handleSearch();
  });

  // Also handle Enter key press directly on input
  searchInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  });

  // IntersectionObserver for fade-in on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        // Optionally unobserve to avoid repeated triggers
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.destination-card, .benefit-card, .glass-card').forEach(el => {
    observer.observe(el);
  });

  // Hero video fallback/optimization
  function handleVideoFallback() {
    // If autoplay is not allowed or network is slow, hide video and keep image
    // Feature detection: check canPlayType and playing promise
    if (!heroVideo) return;

    // If user prefers reduced motion, don't autoplay video
    const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduce) {
      heroVideo.style.display = 'none';
      heroImage.style.display = 'block';
      return;
    }
    // Respect user's Save-Data preference and detect connection speed (when available)
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const saveData = connection && connection.saveData;
    const effectiveType = connection && connection.effectiveType; // e.g., '4g', '3g'

    // Only attempt autoplay if connection looks fast and save-data is not enabled
    const allowVideoAutoplay = !saveData && (!effectiveType || effectiveType === '4g');

    if (!allowVideoAutoplay) {
      heroVideo.style.display = 'none';
      heroImage.style.display = 'block';
      return;
    }

    // Try to play the video programmatically
    const playPromise = heroVideo.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        // playing OK
        heroVideo.style.display = 'block';
        heroImage.style.display = 'none';
      }).catch((err) => {
        // autoplay prevented or other issue
        heroVideo.style.display = 'none';
        heroImage.style.display = 'block';
      });
    } else {
      // Browser doesn't return a promise: keep video visible
      heroVideo.style.display = 'block';
      heroImage.style.display = 'none';
    }
  }
  handleVideoFallback();

  // Lazy-load larger images for cards when in view (progressive enhancement)
  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        const src = card.getAttribute('data-src');
        const img = card.querySelector('img');
        if (src && img && img.dataset.loaded !== 'true') {
          img.src = src;
          img.dataset.loaded = 'true';
        }
        imgObserver.unobserve(card);
      }
    });
  }, { rootMargin: '0px 0px 200px 0px', threshold: 0.05 });

  document.querySelectorAll('.destination-card').forEach(card => imgObserver.observe(card));

  // small helper: remove scrolled class when resizing maybe change hero height
  window.addEventListener('resize', () => {
    // recompute hero height threshold on resize
    // (no heavy work - acceptable here)
  });

});

// small CSS-invoked shake class style using appended style for the input error
(function injectInputErrorStyle(){
  const s = document.createElement('style');
  s.textContent = `
    .input-error{animation:shake 0.6s}
    @keyframes shake{0%{transform:translateX(0)}20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}100%{transform:translateX(0)}}
  `;
  document.head.appendChild(s);
})();
