document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. MOBILE MENU (supports both old and new IDs)
  // ==========================================
  const menuToggle = document.getElementById('menu-toggle') || document.querySelector('.hamburger-btn');
  const mobileDrawer = document.getElementById('mobile-drawer') || document.getElementById('mobile-menu-drawer');
  const drawerClose = document.getElementById('drawer-close') || document.getElementById('mobile-menu-close');

  if (menuToggle && mobileDrawer && drawerClose) {
    const openMenu = () => {
      mobileDrawer.classList.add('open');
      if (menuToggle.hasAttribute('aria-expanded')) {
        menuToggle.setAttribute('aria-expanded', 'true');
      }
      document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
      mobileDrawer.classList.remove('open');
      if (menuToggle.hasAttribute('aria-expanded')) {
        menuToggle.setAttribute('aria-expanded', 'false');
      }
      document.body.style.overflow = '';
    };

    menuToggle.addEventListener('click', openMenu);
    drawerClose.addEventListener('click', closeMenu);

    mobileDrawer.addEventListener('click', (e) => {
      if (e.target === mobileDrawer) closeMenu();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        closeMenu();
      }
    });
  }

  // ==========================================
  // 2. NAVBAR SCROLL EFFECT — disabled (no color change on scroll)
  // ==========================================

  // ==========================================
  // 3. SCROLL REVEAL ANIMATIONS (Intersection Observer)
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal, .fade-in-on-scroll');

  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -6% 0px',
      threshold: 0.1
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // ==========================================
  // 4. COUNTER ANIMATION
  // ==========================================
  const counters = document.querySelectorAll('.counter');

  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const targetVal = parseInt(counter.getAttribute('data-target'), 10);
          animateCounter(counter, 0, targetVal, 2000);
          counterObserver.unobserve(counter);
        }
      });
    }, {
      root: null,
      threshold: 0.3,
      rootMargin: '0px 0px -40px 0px'
    });

    counters.forEach(counter => counterObserver.observe(counter));
  }

  function animateCounter(el, start, end, duration) {
    let startTimestamp = null;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      // Ease-out quad curve
      const eased = progress * (2 - progress);
      const current = Math.floor(eased * (end - start) + start);

      el.textContent = end >= 1000
        ? current.toLocaleString()
        : current;

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = end.toLocaleString();
      }
    };

    window.requestAnimationFrame(step);
  }

  // ==========================================
  // 5. FOUNDER PHOTO CAROUSEL — Crossfade
  // ==========================================
  const founderCarousel = document.getElementById('founder-carousel');
  if (founderCarousel) {
    const slides = founderCarousel.querySelectorAll('.founder-carousel-slide');
    const dots = document.querySelectorAll('.founder-dot');
    let currentSlide = 0;
    let isTransitioning = false;
    const totalSlides = slides.length;
    let carouselInterval = null;
    const FADE_DURATION = 1400; // ms, matches CSS transition

    function goToSlide(index) {
      if (isTransitioning || index === currentSlide) return;
      isTransitioning = true;

      const prevSlide = slides[currentSlide];
      const nextSlideEl = slides[index];

      // Start fading out the old slide
      prevSlide.classList.remove('active');
      prevSlide.classList.add('leaving');

      // Start fading in the new slide
      nextSlideEl.classList.add('active');

      // Update dots
      dots.forEach(d => d.classList.remove('active'));
      dots[index].classList.add('active');

      currentSlide = index;

      // After transition completes, clean up
      setTimeout(() => {
        prevSlide.classList.remove('leaving');
        isTransitioning = false;
      }, FADE_DURATION);
    }

    function nextSlide() {
      goToSlide((currentSlide + 1) % totalSlides);
    }

    function startCarousel() {
      stopCarousel();
      carouselInterval = setInterval(nextSlide, 5000);
    }

    function stopCarousel() {
      if (carouselInterval) {
        clearInterval(carouselInterval);
        carouselInterval = null;
      }
    }

    // Click dots
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.dataset.index, 10);
        goToSlide(idx);
        startCarousel(); // reset timer
      });
    });

    // Pause on hover / touch
    const container = document.querySelector('.founder-image-wrap');
    container.addEventListener('mouseenter', stopCarousel);
    container.addEventListener('mouseleave', startCarousel);
    container.addEventListener('touchstart', stopCarousel, { passive: true });
    container.addEventListener('touchend', startCarousel);

    // Start
    startCarousel();
  }

  // ==========================================
  // 6. HERO CAROUSEL — Masked Image Rotator
  // ==========================================
  const heroSlides = document.querySelectorAll('.hero-slide');
  if (heroSlides.length > 1) {
    let heroIndex = 0;
    let heroInterval = null;
    const HERO_DELAY = 5500;

    function showHeroSlide(index) {
      heroSlides.forEach(s => s.classList.remove('active'));
      heroSlides[index].classList.add('active');
      heroIndex = index;
    }

    function nextHeroSlide() {
      showHeroSlide((heroIndex + 1) % heroSlides.length);
    }

    function startHeroCarousel() {
      stopHeroCarousel();
      heroInterval = setInterval(nextHeroSlide, HERO_DELAY);
    }

    function stopHeroCarousel() {
      if (heroInterval) {
        clearInterval(heroInterval);
        heroInterval = null;
      }
    }

    const heroWrapper = document.querySelector('.hero-carousel-wrapper');
    heroWrapper.addEventListener('mouseenter', stopHeroCarousel);
    heroWrapper.addEventListener('mouseleave', startHeroCarousel);
    heroWrapper.addEventListener('touchstart', stopHeroCarousel, { passive: true });
    heroWrapper.addEventListener('touchend', startHeroCarousel);

    startHeroCarousel();
  }

  // ==========================================
  // 7. TESTIMONIALS CAROUSEL
  // ==========================================
  const carousel = document.getElementById('testimonial-carousel');
  const track = document.getElementById('testimonial-track');
  const dotsContainer = document.getElementById('testimonial-dots');

  if (carousel && track && dotsContainer) {
    const slides = Array.from(track.children);
    const slideCount = slides.length;
    let currentIndex = 0;
    let intervalId = null;
    let isPaused = false;
    const autoAdvanceMs = 4500;

    // Get visible slides count based on viewport
    function getVisibleCount() {
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 768) return 2;
      return 1;
    }

    let visibleCount = getVisibleCount();
    const maxIndex = slideCount - visibleCount;

    // Build dots
    function buildDots() {
      dotsContainer.innerHTML = '';
      visibleCount = getVisibleCount();
      const dotCount = slideCount - visibleCount + 1;
      for (let i = 0; i < dotCount; i++) {
        const dot = document.createElement('button');
        dot.className = 'testimonial-dot';
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      }
      updateDots();
    }

    function updateDots() {
      const dots = dotsContainer.querySelectorAll('.testimonial-dot');
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    function goToSlide(index) {
      currentIndex = Math.max(0, Math.min(index, maxIndex));
      const slideWidth = slides[0].getBoundingClientRect().width;
      track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
      updateDots();
    }

    function nextSlide() {
      if (currentIndex >= maxIndex) {
        goToSlide(0);
      } else {
        goToSlide(currentIndex + 1);
      }
    }

    function startAutoPlay() {
      stopAutoPlay();
      intervalId = setInterval(nextSlide, autoAdvanceMs);
    }

    function stopAutoPlay() {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }

    // Pause on hover
    carousel.addEventListener('mouseenter', () => {
      isPaused = true;
      stopAutoPlay();
    });

    carousel.addEventListener('mouseleave', () => {
      isPaused = false;
      startAutoPlay();
    });

    // Pause on touch
    carousel.addEventListener('touchstart', () => {
      isPaused = true;
      stopAutoPlay();
    }, { passive: true });

    carousel.addEventListener('touchend', () => {
      isPaused = false;
      startAutoPlay();
    });

    // Handle resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        buildDots();
        goToSlide(Math.min(currentIndex, maxIndex));
      }, 250);
    });

    // Initialize
    buildDots();
    startAutoPlay();
    goToSlide(0);
  }

  // ==========================================
  // 8. ACTIVE PAGE IN NAVIGATION
  // ==========================================
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.navbar-links a, .mobile-menu-links a, .navbar-menu-desktop a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    // Skip external links and CTAs
    if (href.startsWith('http') || href.startsWith('#')) return;

    const isHome = currentPath === '/' ||
                   currentPath === '/index.html' ||
                   currentPath.endsWith('/index.html') ||
                   currentPath === '';

    const linkIsHome = href === 'index.html' ||
                       href === '/index.html' ||
                       href === '/';

    if ((isHome && linkIsHome) || (!linkIsHome && currentPath.includes(href.replace(/^\//, '')))) {
      link.classList.add('active');
    }
  });

});
