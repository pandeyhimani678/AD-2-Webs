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

  // Simple form validation
  searchForm.addEventListener('submit', function (e) {
    e.preventDefault();
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
