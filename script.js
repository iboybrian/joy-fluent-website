document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Logic
  const menuButton = document.querySelector('.hamburger-btn');
  const mobileDrawer = document.getElementById('mobile-menu-drawer');
  const closeButton = document.getElementById('mobile-menu-close');

  if (menuButton && mobileDrawer && closeButton) {
    // Open Mobile Menu
    menuButton.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
      document.body.style.overflow = 'hidden'; // Prevent page scroll
    });

    // Close Mobile Menu
    const closeMenu = () => {
      mobileDrawer.classList.remove('open');
      document.body.style.overflow = ''; // Restore page scroll
    };

    closeButton.addEventListener('click', closeMenu);

    // Close on clicking the backdrop overlay
    mobileDrawer.addEventListener('click', (e) => {
      if (e.target === mobileDrawer) {
        closeMenu();
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        closeMenu();
      }
    });
  }

  // FAQ Accordion Logic
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (trigger) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
          }
        });

        if (isActive) {
          item.classList.remove('active');
        } else {
          item.classList.add('active');
        }
      });
    }
  });

  // Track active page in navigation
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu-links a');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href) {
      const isHome = currentPath === '/' || currentPath === '/index.html' || currentPath.endsWith('index.html') || currentPath === '';
      const linkIsHome = href === '/' || href === '/index.html' || href === 'index.html';
      
      if (linkIsHome && isHome) {
        link.classList.add('active');
      } else if (!linkIsHome && href !== '#' && (currentPath.includes(href) || window.location.href.includes(href))) {
        link.classList.add('active');
      }
    }
  });

  // Scroll-Triggered Fade-In Animations (Intersection Observer)
  const observerOptions = {
    root: null, // viewport
    rootMargin: '0px 0px -8% 0px', // trigger slightly before entering fully
    threshold: 0.08
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // animate only once
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll('.fade-in-on-scroll');
  animatedElements.forEach(el => observer.observe(el));

  // Testimonials Infinite Horizontal Auto-Carousel
  const track = document.querySelector('.carousel-track');
  if (track) {
    const originalCards = Array.from(track.children);
    const cardCount = originalCards.length;
    
    if (cardCount > 0) {
      // Determine visible cards based on viewport
      const getVisibleCount = () => window.innerWidth >= 768 ? 2 : 1;
      
      // Infinite loop preparation: Clone first few cards and append to the end
      let visibleCount = getVisibleCount();
      for (let i = 0; i < visibleCount; i++) {
        const clone = originalCards[i].cloneNode(true);
        // Ensure clone also runs scroll animations or is immediately visible
        clone.classList.add('visible');
        track.appendChild(clone);
      }
      
      let currentIndex = 0;
      let isTransitioning = false;
      const slideDuration = 800; // ms (must match CSS transition duration)
      
      const slide = () => {
        if (isTransitioning) return;
        isTransitioning = true;
        
        currentIndex++;
        
        // Recalculate card width on every slide to support responsive resizes
        const cardWidth = track.firstElementChild.getBoundingClientRect().width;
        
        // Smooth slide transition
        track.style.transition = `transform ${slideDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        
        if (currentIndex === cardCount) {
          // Reset to beginning instantly after transition completes
          setTimeout(() => {
            track.style.transition = 'none';
            currentIndex = 0;
            track.style.transform = 'translateX(0)';
            isTransitioning = false;
          }, slideDuration);
        } else {
          setTimeout(() => {
            isTransitioning = false;
          }, slideDuration);
        }
      };
      
      // Auto-play interval (slow, elegant 4.5 seconds per slide)
      let slideInterval = setInterval(slide, 4500);
      
      // Handle window resizes: Recalculate layout and reset position if necessary
      window.addEventListener('resize', () => {
        clearInterval(slideInterval);
        
        // Remove old cloned nodes (anything past original cards)
        while (track.children.length > cardCount) {
          track.removeChild(track.lastChild);
        }
        
        // Re-clone based on new viewport width
        visibleCount = getVisibleCount();
        for (let i = 0; i < visibleCount; i++) {
          const clone = originalCards[i].cloneNode(true);
          clone.classList.add('visible');
          track.appendChild(clone);
        }
        
        // Reset track position
        track.style.transition = 'none';
        currentIndex = 0;
        track.style.transform = 'translateX(0)';
        isTransitioning = false;
        
        slideInterval = setInterval(slide, 4500);
      });
    }
  }

  // Counter Animation Engine (Ease-Out Deceleration)
  const counters = document.querySelectorAll('.counter');
  
  if (counters.length > 0) {
    const counterObserverOptions = {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const targetVal = parseInt(counter.getAttribute('data-target'), 10);
          animateValue(counter, 0, targetVal, 2000); // 2000ms duration (2 seconds)
          counterObserver.unobserve(counter);
        }
      });
    }, counterObserverOptions);
    
    counters.forEach(counter => counterObserver.observe(counter));
  }
  
  function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Deceleration curve (easeOutQuad)
      const easeProgress = progress * (2 - progress);
      const currentVal = Math.floor(easeProgress * (end - start) + start);
      
      // Format number with commas for values >= 1000
      if (end >= 1000) {
        obj.textContent = currentVal.toLocaleString();
      } else {
        obj.textContent = currentVal;
      }
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        // Ensure final value is exact and formatted
        obj.textContent = end.toLocaleString();
      }
    };
    window.requestAnimationFrame(step);
  }
});
