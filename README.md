# Reelmart — reel feed to product listing

A React-only frontend demo: scroll a vertical, Instagram-Reels-style feed of
products. Tap **Order now** on any reel and the app routes to a product
listing page for that item, with a grid of the rest of the drop.

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

## How it's wired

- `src/pages/ReelFeed.jsx` — vertical snap-scroll feed, one `ReelCard` per product.
- `src/components/ReelCard.jsx` — the reel tile with caption, price, and the
  **Order now** button. Clicking it calls `navigate(/product/:id)`.
- `src/pages/ProductListing.jsx` — the page that opens: a hero for the
  tapped product plus a grid linking to every other product.
- `src/data/products.js` — swap this for a real API call when you're ready;
  every component reads from this one array.

Routing is handled by `react-router-dom` (`BrowserRouter` in `main.jsx`), so
"opening a page" is a real route change, not a modal — you get a shareable
URL per product (`/product/p1`, `/product/p2`, ...).

Replace the flat color swatches in `products.js` with real image or video
URLs (e.g. an `<img>`/`<video>` in `ReelCard`) once you have media assets.
