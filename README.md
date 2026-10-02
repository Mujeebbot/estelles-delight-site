# Estelle's Delight

Website for Estelle's Delight, a West African snack and catering business in
Perth, Western Australia. Built with React, Vite, and Framer Motion.

## Getting started

```bash
npm install
npm run dev
```

This starts a local dev server (Vite will print the URL, usually
`http://localhost:5173`).

## Build for production

```bash
npm run build
```

Output goes to the `dist/` folder, ready to deploy to any static host
(Vercel, Netlify, Cloudflare Pages, GitHub Pages, etc.).

To preview the production build locally:

```bash
npm run preview
```

## Project structure

```
src/
  assets/images/   Product photos and graphics
  components/      One component per section (Hero, Flavours, Catering, ...)
  data/            Flavour list + copy used by the Flavours section
  App.jsx          Assembles all sections
  index.css        Global design system (colours, type, layout, animation)
  main.jsx         React entry point
index.html         Vite HTML entry (fonts + meta tags)
```

## Editing content

- **Text and prices**: edit the relevant component in `src/components/`.
- **Flavour list**: edit `src/data/flavours.js`.
- **Images**: swap files in `src/assets/images/` (keep the same filename, or
  update the `import` at the top of the component that uses it).
- **Colours / fonts**: CSS custom properties at the top of `src/index.css`
  (`--tangerine`, `--espresso`, `--gold`, etc.).
- **Contact details**: phone/email/social links are in
  `src/components/Footer.jsx` and `src/components/FinalCTA.jsx`.

## Notes

- Animations use [Framer Motion](https://www.framer.com/motion/) — section
  reveals fade up into view on scroll (`src/components/Reveal.jsx`), and the
  flavour image cross-fades when you switch tabs.
- No CSS framework (no Tailwind) — styling is a single hand-written
  stylesheet (`src/index.css`) that mirrors the class names used in the
  components, so it's easy to trace what styles what.

## Recent changes
- Hero is now a 6-slide crossfading carousel (Chin-Chin, Pies, Small Chops, Grills, Puff-Puff, Drinks). Edit copy, photos and prices in the `slides` array at the top of `src/components/Hero.jsx`.
- Menu is a compact "Shop Our Delights" rail. Edit the `items` array in `src/components/SignatureMenu.jsx`.
- Fan gallery uses width-based sizing and transform-only animation, so it can't shift the page.

## Round 2 changes
- `src/data/menu.js` holds every price, size and minimum order quantity (from the menu posters). Edit there and the order page and pack builder update.
- Order page is a 4-step wizard (Occasion, Items, Schedule, Confirm) in `OrderModal.jsx`. The Build Your Pack section shares the same cart.
- Newsletter: set `VITE_NEWSLETTER_ENDPOINT` (for example a Formspree URL) in a `.env` file to collect sign-ups. Without it the form opens an email to the shop.
- Icons are an inline SVG set in `Icon.jsx`; there are no emoji left in the site.

## Round 3 changes
- Pages: the home page and a Shop page (`#/shop`, `#/shop/pies`, ...). Every "Order" button goes to the shop; the cart icon opens the cart drawer; Checkout opens the order form.
- Cancel: the order form asks before closing. "Cancel order" clears the basket and every selection; "Save for later" keeps them.
- Hero ticker text is set per slide in `slides[].ticker` in `Hero.jsx`.
- Doodle background: add the class `doodled` to any section.

## Newsletter: how to actually receive sign-ups
Without setup, the form opens the visitor's email app addressed to estelledelight@gmail.com (you only get an email if they press Send; nobody gets a welcome email).
To collect sign-ups automatically:
1. Create a free form at formspree.io (or any service that accepts a JSON POST).
2. Create a `.env` file in the project root with: `VITE_NEWSLETTER_ENDPOINT=https://formspree.io/f/yourFormId`
3. Rebuild. Each sign-up now arrives in your inbox / Formspree dashboard.
For real campaigns and automatic welcome emails, use Mailchimp, MailerLite or Brevo and point the form at their hosted form URL.
