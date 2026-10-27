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

## Continue with Google (Supabase Auth)

1. **Env keys** — copy `.env.example` to `.env` and fill in the Project URL and
   `anon` key from Supabase → Project Settings → API. Restart `npm run dev`.
2. **Google Cloud** — console.cloud.google.com → APIs & Services:
   - OAuth consent screen: External, app name, support email, then **Publish app**
     (in "Testing" mode only listed test users can sign in).
   - Credentials → Create credentials → OAuth client ID → **Web application**.
   - Authorized JavaScript origins: `http://localhost:5173` and your live domain.
   - Authorized redirect URIs: `https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback`
   - Copy the Client ID and Client secret.
3. **Supabase** → Authentication → Sign In / Providers → **Google**: enable it,
   paste Client ID + secret, save.
4. **Supabase** → Authentication → URL Configuration:
   - Site URL: your live domain (e.g. `https://jewelwithphronix.com`)
   - Redirect URLs: add `http://localhost:5173/login` and `https://YOUR-DOMAIN/login`
5. **Hosting** — the deploy must serve `index.html` for every path so `/login`
   works when Google sends the customer back. `vercel.json` (Vercel) and
   `public/_redirects` (Netlify) already do this; add the same env vars in the
   host's dashboard.

Replace the flat color swatches in `products.js` with real image or video
URLs (e.g. an `<img>`/`<video>` in `ReelCard`) once you have media assets.
