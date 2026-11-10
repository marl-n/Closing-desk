/**
 * Closing Desk — Navigation & Header Interactions
 * Handles sticky scroll state, mobile menu toggle, keyboard Escape,
 * and smooth section highlighting.
 */
export function initNavigation() {
  const header = document.getElementById('site-header');
  const toggleBtn = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const toggleIcon = toggleBtn ? toggleBtn.querySelector('i') : null;
  const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a, button') : [];
  const desktopNavLinks = document.querySelectorAll('.nav-links .nav-link');

  function setMenuOpen(isOpen) {
    if (!toggleBtn || !mobileMenu) return;
    mobileMenu.classList.toggle('is-open', isOpen);
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
    toggleBtn.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');

    if (toggleIcon) {
      toggleIcon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    }
  }

  if (toggleBtn && mobileMenu) {
    toggleBtn.addEventListener('click', () => {
      const currentlyOpen = toggleBtn.getAttribute('aria-expanded') === 'true';
      setMenuOpen(!currentlyOpen);
    });

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        setMenuOpen(false);
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
        setMenuOpen(false);
        toggleBtn.focus();
      }
    });

    document.addEventListener('click', (event) => {
      if (
        mobileMenu.classList.contains('is-open') &&
        !mobileMenu.contains(event.target) &&
        !toggleBtn.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    });
  }

  // Update sticky header appearance on scroll
  function handleScroll() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Highlight active section link in desktop navigation while scrolling
  const sections = Array.from(desktopNavLinks)
    .map((link) => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return null;
      const target = document.querySelector(href);
      return target ? { link, target } : null;
    })
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          desktopNavLinks.forEach((l) => l.classList.remove('is-active'));
          const matched = sections.find((item) => item.target === entry.target);
          if (matched) matched.link.classList.add('is-active');
        });
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: 0 }
    );

    sections.forEach((item) => spyObserver.observe(item.target));
  }
}
