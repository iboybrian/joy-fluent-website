document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Logic
  const menuButton = document.querySelector('button[aria-label="Open menu"]');
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
        // Toggle active class on clicked item
        const isActive = item.classList.contains('active');
        
        // Close other open FAQ items (optional, but premium feel)
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
  const navLinks = document.querySelectorAll('nav a, .mobile-menu-links a');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href) {
      // Check if current path ends with href or matches exactly
      const isHome = currentPath === '/' || currentPath === '/index.html';
      const linkIsHome = href === '/' || href === '/index.html' || href === 'index.html';
      
      if (linkIsHome && isHome) {
        link.classList.add('active');
        // Add borders/classes for original designs
        if (link.tagName === 'A' && !link.classList.contains('gold-gradient-bg')) {
          link.style.borderBottom = '2px solid hsl(var(--primary))';
          link.style.color = 'hsl(var(--foreground))';
        }
      } else if (!linkIsHome && href !== '#' && (currentPath.includes(href) || window.location.href.includes(href))) {
        link.classList.add('active');
        if (link.tagName === 'A' && !link.classList.contains('gold-gradient-bg')) {
          link.style.borderBottom = '2px solid hsl(var(--primary))';
          link.style.color = 'hsl(var(--foreground))';
        }
      }
    }
  });
});
