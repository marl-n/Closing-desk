# Closing Desk — Landing Page

Conversion-focused marketing landing page for **Closing Desk**, a Notion template workspace designed for solo real estate agents.

Built with pure semantic **HTML5**, modular **CSS3** (custom properties, zero external UI frameworks), and **Vanilla JavaScript** (ES modules).

---

## Project Structure

```text
closing-desk/
├── index.html                  # Semantic single-page landing layout
├── assets/
│   ├── fonts/                  # Optional self-hosted font directory
│   ├── icons/                  # Optional icon assets
│   └── other/                  # Favicon & supporting files
├── css/
│   ├── style.css               # Design tokens, typography, layout & Notion UI components
│   ├── responsive.css          # Tablet & mobile breakpoints
│   └── animations.css          # Scroll reveals, transitions & prefers-reduced-motion support
├── js/
│   ├── main.js                 # Checkout URL config, interactive previews, calculator & reveals
│   ├── navigation.js           # Sticky header, mobile drawer & active scroll spy
│   └── faq.js                  # Accessible FAQ accordion behaviour
├── img/
│   ├── logo/                   # Drop closing-desk-logo.svg here
│   ├── product/                # Drop WebP product screenshots here
│   └── general/                # Optional general assets
└── README.md
```

---

## Configuring the Checkout URL

Before deploying, connect your digital checkout link in `js/main.js`:

```js
export const CLOSING_DESK_CONFIG = {
  checkoutUrl: 'https://your-checkout-link.example',
  openInNewTab: false,
};
```

- Every **"Get Closing Desk"** button and link across the header, hero, setup callout, footer, and final CTA reads `[data-checkout-cta]` from this single configuration.
- While `checkoutUrl` is empty (`''`), clicking a CTA opens a clean setup preview modal rather than failing on a broken link.

---

## Adding Brand Logos & Product Screenshots

All image placeholders use normal `<img>` elements referencing relative paths inside `img/`. Until real files are added, the layout hides broken image icons automatically and displays either the typographic **Closing Desk** wordmark or the HTML/CSS Notion workspace previews.

To swap in supplied assets without changing layout code:

1. **Brand Logo:** Place `closing-desk-logo.svg` at `img/logo/closing-desk-logo.svg`. It preserves natural aspect ratio automatically (`height: 28px; width: auto;`).
2. **Product Screenshots (WebP):** Drop any of the following files into `img/product/` and they will automatically replace their corresponding CSS preview frame on load:
   - `img/product/hero-workspace-preview.webp`
   - `img/product/feature-deadline-tracker.webp`
   - `img/product/feature-commission-calculator.webp`
   - `img/product/dashboard-preview.webp`
3. **Favicon:** Place `favicon.ico` inside `assets/other/` (or update the `<link rel="icon">` path in `<head>`).

*Note: If serving the bundled production single-file build (`dist/index.html`) rather than the static folder directly, place supplied `img/` files into `public/img/` (or update paths) before running `npm run build` so Vite copies static media into `dist/`.*

---

## Running & Building Locally

Serve the project directory with any static web server or Vite dev server:

```bash
npm run dev
```

To build the bundled distribution output into `dist/index.html`:

```bash
npm run build
```

---

## Customising Legal Links & Footer Year

- Privacy Policy & Terms triggers inside `<footer>` currently open placeholder modals defined inside `initModals()` in `js/main.js`. Replace those buttons with links to your published legal pages when ready.
- Keep the digital product and legal/tax disclaimer visible in the footer and Good to Know panel: Notion cannot automatically generate deadline rows, and all day counts and percentage calculations are editable examples rather than legal or tax advice.
