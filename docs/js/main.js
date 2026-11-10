/**
 * Closing Desk — Main Application Script
 * ---------------------------------------------------------------------------
 * CHECKOUT CONFIGURATION:
 * Replace `checkoutUrl` below with your actual digital product checkout link
 * (e.g., Gumroad, Lemon Squeezy, Stripe Payment Link, or ThriveCart).
 * Leave as '' while testing locally; clicking any CTA will display an
 * informative setup preview modal instead of navigating to a dead link.
 */
import { initNavigation } from './navigation.js';
import { initFaq } from './faq.js';

export const CLOSING_DESK_CONFIG = {
  checkoutUrl: '',
  openInNewTab: false,
};

/**
 * Sample deadline row sets used by the Ready-Made Deadline Sets preview.
 * Day offsets reflect editable example timelines for demonstration only.
 */
const DEADLINE_SETS_DATA = {
  'buyer-financed': [
    { offset: 'Day +3', name: 'Earnest Money Deposit', category: 'Escrow & Funds' },
    { offset: 'Day +10', name: 'Inspection & Objection Due', category: 'Due Diligence' },
    { offset: 'Day +21', name: 'Loan Commitment Deadline', category: 'Financing' },
    { offset: 'Day +30', name: 'Final Walkthrough & Closing', category: 'Closing' },
  ],
  'buyer-cash': [
    { offset: 'Day +2', name: 'Proof of Funds Verification', category: 'Financials' },
    { offset: 'Day +3', name: 'Earnest Money Deposit', category: 'Escrow & Funds' },
    { offset: 'Day +7', name: 'Inspection Contingency Window', category: 'Due Diligence' },
    { offset: 'Day +14', name: 'Title Review & Cash Closing', category: 'Closing' },
  ],
  seller: [
    { offset: 'Day -5', name: 'Listing Photos & Disclosure Prep', category: 'Pre-Listing' },
    { offset: 'Day +2', name: 'Seller Property Disclosures', category: 'Compliance' },
    { offset: 'Day +12', name: 'Inspection Repair Response', category: 'Negotiation' },
    { offset: 'Day +30', name: 'Deed Prep & Payoff Statement', category: 'Closing' },
  ],
  rental: [
    { offset: 'Day +1', name: 'Application & Screening Review', category: 'Qualification' },
    { offset: 'Day +3', name: 'Lease Execution & Deposit', category: 'Lease Signing' },
    { offset: 'Day +7', name: 'Move-In Walkthrough Checklist', category: 'Handover' },
    { offset: 'Month +10', name: 'Lease Renewal Notice Window', category: 'Retention' },
  ],
};

/**
 * Check optional placeholder <img> elements so supplied assets appear seamlessly
 * in their natural container while missing placeholder files never show broken icons.
 */
function initOptionalImages() {
  const optionalImages = document.querySelectorAll('[data-optional-img]');

  function markLoaded(img) {
    img.classList.add('is-loaded');
    const wrapper = img.closest('[data-asset-wrapper]');
    if (wrapper) {
      wrapper.classList.add('has-real-asset');
    }
  }

  function markMissing(img) {
    img.classList.remove('is-loaded');
    img.hidden = true;
    const wrapper = img.closest('[data-asset-wrapper]');
    if (wrapper) {
      wrapper.classList.remove('has-real-asset');
    }
  }

  optionalImages.forEach((img) => {
    // Skip zero-length or placeholder unset sources gracefully
    if (!img.getAttribute('src')) {
      markMissing(img);
      return;
    }

    if (img.complete) {
      if (img.naturalWidth > 0) {
        markLoaded(img);
      } else {
        markMissing(img);
      }
      return;
    }

    img.addEventListener('load', () => {
      if (img.naturalWidth > 0) {
        markLoaded(img);
      }
    });

    img.addEventListener('error', () => {
      markMissing(img);
    });
  });
}

/**
 * Wire every "Get Closing Desk" CTA button to CLOSING_DESK_CONFIG.checkoutUrl.
 */
function initCheckoutCtas(openModal) {
  const ctaElements = document.querySelectorAll('[data-checkout-cta]');
  const configuredUrl = (CLOSING_DESK_CONFIG.checkoutUrl || '').trim();
  const hasRealUrl = configuredUrl.length > 0 && configuredUrl !== '#';

  ctaElements.forEach((cta) => {
    if (hasRealUrl) {
      cta.setAttribute('href', configuredUrl);
      if (CLOSING_DESK_CONFIG.openInNewTab) {
        cta.setAttribute('target', '_blank');
        cta.setAttribute('rel', 'noopener noreferrer');
      }
    } else {
      cta.addEventListener('click', (event) => {
        event.preventDefault();
        openModal('checkout');
      });
    }
  });
}

/**
 * Accessible modal system for Checkout Placeholder and Legal (Privacy/Terms) notes.
 */
function initModals() {
  const backdrop = document.getElementById('info-modal');
  const titleEl = document.getElementById('modal-title');
  const bodyEl = document.getElementById('modal-body');
  const closeBtn = document.getElementById('modal-close');
  const doneBtn = document.getElementById('modal-done');
  let lastFocusedEl = null;

  const MODAL_CONTENT = {
    checkout: {
      title: 'Checkout Link Placeholder',
      paragraphs: [
        'Closing Desk is a digital Notion workspace with instant access upon purchase. Once your checkout URL is connected, clicking "Get Closing Desk" takes buyers straight to checkout.',
        'To connect your live payment link, open js/main.js and set CLOSING_DESK_CONFIG.checkoutUrl to your hosted checkout page URL.',
      ],
      codeHint: "export const CLOSING_DESK_CONFIG = { checkoutUrl: 'https://your-checkout-link.example' };",
    },
    privacy: {
      title: 'Privacy Policy (Placeholder)',
      paragraphs: [
        'This static landing page does not collect personal data or run tracking cookies by default. Replace this placeholder modal with your published Privacy Policy URL or full legal text prior to launch.',
        'Note: When customers purchase Closing Desk through your chosen digital checkout platform and duplicate the workspace into Notion, client data remains strictly inside their personal Notion account.',
      ],
      codeHint: '',
    },
    terms: {
      title: 'Terms of Use & Digital Product Notice (Placeholder)',
      paragraphs: [
        'Closing Desk is provided as a digital Notion template with instant access. Because digital downloads cannot be returned once duplicated, all sales are final and non-refundable, subject to the selling platform\'s applicable refund policy.',
        'All preloaded day counts, commission splits, expense rows, and estimated tax reserve percentages inside the workspace are editable examples only and do not constitute legal, brokerage, or tax advice. Legal and tax requirements vary by country and state.',
      ],
      codeHint: '',
    },
  };

  function closeModal() {
    if (!backdrop) return;
    backdrop.classList.remove('is-open');
    backdrop.setAttribute('aria-hidden', 'true');
    if (lastFocusedEl && typeof lastFocusedEl.focus === 'function') {
      lastFocusedEl.focus();
    }
  }

  function openModal(type) {
    if (!backdrop || !titleEl || !bodyEl) return;
    const content = MODAL_CONTENT[type] || MODAL_CONTENT.checkout;
    lastFocusedEl = document.activeElement;

    titleEl.textContent = content.title;
    bodyEl.textContent = '';

    content.paragraphs.forEach((text) => {
      const p = document.createElement('p');
      p.textContent = text;
      bodyEl.appendChild(p);
    });

    if (content.codeHint) {
      const codeBox = document.createElement('div');
      codeBox.className = 'modal-code-box';
      codeBox.textContent = content.codeHint;
      bodyEl.appendChild(codeBox);
    }

    backdrop.classList.add('is-open');
    backdrop.setAttribute('aria-hidden', 'false');
    if (closeBtn) closeBtn.focus();
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (doneBtn) doneBtn.addEventListener('click', closeModal);

  if (backdrop) {
    backdrop.addEventListener('click', (event) => {
      if (event.target === backdrop) closeModal();
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && backdrop && backdrop.classList.contains('is-open')) {
      closeModal();
    }
  });

  document.querySelectorAll('[data-modal-trigger]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const type = trigger.getAttribute('data-modal-trigger');
      openModal(type);
    });
  });

  return openModal;
}

/**
 * Hero Notion Mockup Filter Tabs (All Deadlines / Urgent Alerts / Cleared)
 */
function initHeroFilterTabs() {
  const tabs = document.querySelectorAll('[data-hero-filter]');
  const rows = document.querySelectorAll('[data-hero-row]');
  if (!tabs.length || !rows.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const filter = tab.getAttribute('data-hero-filter');

      tabs.forEach((t) => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');

      rows.forEach((row) => {
        const group = row.getAttribute('data-hero-row');
        const show = filter === 'all' || group === filter;
        row.classList.toggle('is-hidden-row', !show);
      });
    });
  });
}

/**
 * Ready-Made Deadline Sets Switcher (Buyer Financed / Buyer Cash / Seller / Rental)
 */
function initDeadlineSetsSwitcher() {
  const setTabs = document.querySelectorAll('[data-set-key]');
  const container = document.getElementById('deadline-set-grid');
  if (!setTabs.length || !container) return;

  function renderSet(key) {
    const items = DEADLINE_SETS_DATA[key] || DEADLINE_SETS_DATA['buyer-financed'];
    container.textContent = '';

    items.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'set-row-card';

      const offsetEl = document.createElement('span');
      offsetEl.className = 'set-row-card__offset';
      offsetEl.textContent = item.offset;

      const nameEl = document.createElement('div');
      nameEl.className = 'set-row-card__name';
      nameEl.textContent = item.name;

      const metaEl = document.createElement('div');
      metaEl.className = 'set-row-card__meta';
      metaEl.textContent = item.category;

      card.appendChild(offsetEl);
      card.appendChild(nameEl);
      card.appendChild(metaEl);
      container.appendChild(card);
    });
  }

  setTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const key = tab.getAttribute('data-set-key');
      setTabs.forEach((t) => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      renderSet(key);
    });
  });

  renderSet('buyer-financed');
}

/**
 * Interactive Take-Home Commission Calculator Preview
 */
function initCommissionCalculator() {
  const priceInput = document.getElementById('calc-price');
  const rateInput = document.getElementById('calc-rate');
  const splitInput = document.getElementById('calc-split');
  const taxInput = document.getElementById('calc-tax');
  const expenseInput = document.getElementById('calc-expenses');

  const grossOut = document.getElementById('calc-out-gross');
  const brokerageOut = document.getElementById('calc-out-brokerage');
  const expenseOut = document.getElementById('calc-out-expenses');
  const taxOut = document.getElementById('calc-out-tax');
  const netOut = document.getElementById('calc-out-net');

  if (!priceInput || !grossOut || !netOut) return;

  const currency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

  function sanitizeNumber(el, min, max) {
    const val = parseFloat(el.value);
    if (Number.isNaN(val)) return 0;
    return Math.min(max, Math.max(min, val));
  }

  function updateCalculation() {
    const price = sanitizeNumber(priceInput, 0, 50000000);
    const rate = sanitizeNumber(rateInput, 0, 25);
    const agentSplitPct = sanitizeNumber(splitInput, 0, 100);
    const taxReservePct = sanitizeNumber(taxInput, 0, 60);
    const expenses = sanitizeNumber(expenseInput, 0, 500000);

    const grossCommission = price * (rate / 100);
    const brokerageShare = grossCommission * ((100 - agentSplitPct) / 100);
    const preTaxNet = Math.max(0, grossCommission - brokerageShare - expenses);
    const estimatedTaxes = preTaxNet * (taxReservePct / 100);
    const realTakeHome = preTaxNet - estimatedTaxes;

    grossOut.textContent = currency.format(grossCommission);
    if (brokerageOut) brokerageOut.textContent = `-${currency.format(brokerageShare)}`;
    if (expenseOut) expenseOut.textContent = `-${currency.format(expenses)}`;
    if (taxOut) taxOut.textContent = `-${currency.format(estimatedTaxes)}`;
    netOut.textContent = currency.format(realTakeHome);
  }

  [priceInput, rateInput, splitInput, taxInput, expenseInput].forEach((input) => {
    if (input) input.addEventListener('input', updateCalculation);
  });

  updateCalculation();
}

/**
 * Full Product Preview Interactive Workspace Tabs
 */
function initWorkspacePreviewTabs() {
  const tabBtns = document.querySelectorAll('[data-workspace-tab]');
  const panels = document.querySelectorAll('[data-workspace-panel]');
  const activeCrumb = document.getElementById('workspace-active-crumb');
  if (!tabBtns.length || !panels.length) return;

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetKey = btn.getAttribute('data-workspace-tab');
      const targetLabel = btn.getAttribute('data-crumb-label') || 'Workspace';

      tabBtns.forEach((b) => {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');

      panels.forEach((panel) => {
        const matches = panel.getAttribute('data-workspace-panel') === targetKey;
        panel.classList.toggle('is-active', matches);
        panel.hidden = !matches;
      });

      if (activeCrumb) {
        activeCrumb.textContent = targetLabel;
      }
    });
  });
}

/**
 * Subtle Viewport Reveal Animations
 */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (!revealEls.length) return;

  const prefersReduced =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  document.documentElement.classList.add('js-ready');

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -48px 0px', threshold: 0.08 }
  );

  revealEls.forEach((el) => observer.observe(el));
}

/* Bootstrap on DOM ready */
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initFaq();
  initOptionalImages();
  const openModal = initModals();
  initCheckoutCtas(openModal);
  initHeroFilterTabs();
  initDeadlineSetsSwitcher();
  initCommissionCalculator();
  initWorkspacePreviewTabs();
  initScrollReveal();

  const yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
});
