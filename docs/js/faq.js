/**
 * Closing Desk — Accessible FAQ Accordion
 * Supports single-click expansion, dynamic height measurement for smooth
 * CSS transitions, keyboard focus, and resize height recalculation.
 */
export function initFaq() {
  const faqItems = Array.from(document.querySelectorAll('.faq-item'));
  if (!faqItems.length) return;

  function closeItem(item) {
    const button = item.querySelector('.faq-question');
    const panel = item.querySelector('.faq-answer-wrap');
    if (!button || !panel) return;

    item.classList.remove('is-open');
    button.setAttribute('aria-expanded', 'false');
    panel.style.maxHeight = '0px';
  }

  function openItem(item) {
    const button = item.querySelector('.faq-question');
    const panel = item.querySelector('.faq-answer-wrap');
    if (!button || !panel) return;

    item.classList.add('is-open');
    button.setAttribute('aria-expanded', 'true');
    panel.style.maxHeight = `${panel.scrollHeight}px`;
  }

  faqItems.forEach((item) => {
    const button = item.querySelector('.faq-question');
    const panel = item.querySelector('.faq-answer-wrap');
    if (!button || !panel) return;

    // Ensure initial closed height unless pre-marked open
    if (item.classList.contains('is-open')) {
      panel.style.maxHeight = `${panel.scrollHeight}px`;
    } else {
      panel.style.maxHeight = '0px';
    }

    button.addEventListener('click', () => {
      const isCurrentlyOpen = button.getAttribute('aria-expanded') === 'true';

      // Close sibling items for tidy vertical rhythm
      faqItems.forEach((other) => {
        if (other !== item && other.classList.contains('is-open')) {
          closeItem(other);
        }
      });

      if (isCurrentlyOpen) {
        closeItem(item);
      } else {
        openItem(item);
      }
    });
  });

  // Recalculate max-height if viewport width changes while an answer is open
  window.addEventListener('resize', () => {
    faqItems.forEach((item) => {
      if (!item.classList.contains('is-open')) return;
      const panel = item.querySelector('.faq-answer-wrap');
      if (panel) {
        panel.style.maxHeight = `${panel.scrollHeight}px`;
      }
    });
  });
}
