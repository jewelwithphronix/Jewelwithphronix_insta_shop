import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import products from "../data/products.js";
import { useProducts, useProductsReady } from "../utils/productStore.js";
import PageShell from "../components/PageShell.jsx";
import NotFound from "./NotFound.jsx";
import AccordionRow from "../components/AccordionRow.jsx";
import ProductCard from "../components/ProductCard.jsx";
import Reviews from "../components/Reviews.jsx";
import BottomNav from "../components/BottomNav.jsx";
import Header from "../components/Header.jsx";
import Price from "../components/Price.jsx";
import Footer from "../components/Footer.jsx";
import FloatingWidgets from "../components/FloatingWidgets.jsx";
import { BRAND } from "../config/brand.js";
import { rs } from "../utils/format.js";
import { HeartIcon } from "../components/Icons.jsx";
import { useLikes, toggleLike, likeProduct } from "../utils/likes.js";
import { addToCart } from "../utils/cart.js";
import { imgProps } from "../utils/img.js";

export default function ProductListing() {
  const products = useProducts();
  const ready = useProductsReady();
  const { id } = useParams();
  const selected = products.find((p) => p.id === id);

  if (!selected) {
    if (!ready) return <PageShell><main className="cart-empty" aria-busy="true"><p>Loading…</p></main></PageShell>;
    return <NotFound title="Product not found" text="This piece may have sold out or been removed." />;
  }
  return <ProductPage key={selected.id} selected={selected} products={products} />;
}

function ProductPage({ selected, products }) {
  const navigate = useNavigate();

  const { isLiked } = useLikes();
  const wished = isLiked(selected.id);
  const soldOut = selected.inStock === false;
  const [activeImage, setActiveImage] = useState(selected.images?.[0]);
  const [quantity, setQuantity] = useState(1);
  const [confirmation, setConfirmation] = useState("");
  const [hearts, setHearts] = useState([]);   // floating hearts
  const [bigHeart, setBigHeart] = useState(0); // double-tap heart (counter restarts animation)

  // timers cleared when leaving the page (no setState after unmount)
  const timers = useRef(new Set());
  const later = (fn, ms) => {
    const t = window.setTimeout(() => { timers.current.delete(t); fn(); }, ms);
    timers.current.add(t);
    return t;
  };
  const confirmTimer = useRef(0);
  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  const imgCount = selected.images?.length || 0;
  const imgIndex = Math.max(0, selected.images?.indexOf(activeImage) ?? 0);
  const related = products.filter((p) => p.id !== selected.id).slice(0, 4);

  const touchStartX = useRef(null);

  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e) {
    if (touchStartX.current === null || !selected.images) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const threshold = 40; // minimum swipe distance in px

    if (Math.abs(deltaX) > threshold) {
      const currentIndex = selected.images.indexOf(activeImage);
      let nextIndex;
      if (deltaX < 0) {
        // swiped left → next image
        nextIndex = (currentIndex + 1) % selected.images.length;
      } else {
        // swiped right → previous image
        nextIndex = (currentIndex - 1 + selected.images.length) % selected.images.length;
      }
      setActiveImage(selected.images[nextIndex]);
    }
    touchStartX.current = null;
  }

  // Instagram-style: several hearts float up from the bottom-right of the photo
  function burstHearts(count = 8) {
    const stamp = Date.now();
    const batch = Array.from({ length: count }, (_, i) => ({
      id: `${stamp}-${i}-${Math.random()}`,
      dx: Math.round((Math.random() - 0.5) * 90), // sideways drift
      rise: 170 + Math.round(Math.random() * 120), // how high it floats (px)
      size: 16 + Math.round(Math.random() * 18),
      delay: i * 0.09,
      dur: 1.5 + Math.random() * 0.8,
      right: 14 + Math.round(Math.random() * 30),
    }));
    setHearts((h) => [...h, ...batch]);
    later(() => setHearts((h) => h.filter((x) => !batch.includes(x))), 3200);
  }

  function handleWishClick(e) {
    e.stopPropagation();
    if (!wished) burstHearts(8);
    toggleLike(selected);
  }

  // double-tap / double-click on the photo = like (like Instagram)
  function handleDoubleLike() {
    likeProduct(selected);
    setBigHeart((n) => n + 1);
    burstHearts(10);
  }

  function showConfirmation(message) {
    setConfirmation(message);
    window.clearTimeout(confirmTimer.current);
    confirmTimer.current = later(() => setConfirmation(""), 2200);
  }

  return (
    <>
      <Header />

      <main className="pdp">
        <div
          className="pdp__hero"
          style={activeImage ? undefined : { background: selected.color }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onDoubleClick={handleDoubleLike}
        >
          {activeImage && (
            <img
              {...imgProps(activeImage, "(min-width: 1024px) 600px, 100vw")}
              alt={`${selected.name}${imgCount > 1 ? `, photo ${imgIndex + 1} of ${imgCount}` : ""}`}
            />
          )}
          <button
            type="button"
            className={"pdp__hero-wish" + (wished ? " pdp__hero-wish--active" : "")}
            aria-label={`Save ${selected.name} to wishlist`}
            aria-pressed={wished}
            onClick={handleWishClick}
            onDoubleClick={(e) => e.stopPropagation()}
          >
            <HeartIcon size={20} filled={wished} />
          </button>

          {/* big heart in the middle on double-tap */}
          {bigHeart > 0 && (
            <span key={bigHeart} className="big-heart" aria-hidden="true">
              <HeartIcon size={96} filled />
            </span>
          )}

          {/* floating hearts */}
          {hearts.map((h) => (
            <span
              key={h.id}
              className="float-heart"
              aria-hidden="true"
              style={{
                "--dx": `${h.dx}px`,
                "--rise": `${h.rise}px`,
                "--dur": `${h.dur}s`,
                right: `${h.right}px`,
                animationDelay: `${h.delay}s`,
              }}
            >
              <HeartIcon size={h.size} filled />
            </span>
          ))}
        </div>

        {imgCount > 1 && (
          <div className="pdp__gallery" role="group" aria-label="Product photos">
            {selected.images.map((src, i) => (
              <button
                key={src}
                type="button"
                className={
                  "pdp__thumb-btn" + (src === activeImage ? " pdp__thumb-btn--active" : "")
                }
                onClick={() => setActiveImage(src)}
                aria-label={`Show photo ${i + 1} of ${imgCount}`}
                aria-current={src === activeImage}
              >
                <img {...imgProps(src, "80px")} alt="" loading="lazy" className="pdp__thumb" />
              </button>
            ))}
          </div>
        )}

        <section className="pdp__info">
          <h1 className="pdp__name">{selected.name}</h1>
          <p className="pdp__caption">{selected.caption}</p>

          <Price product={selected} className="pdp__price-min" />
          <p className="pdp__taxes">Taxes included · Free shipping above {rs(BRAND.freeShippingAbove)}</p>

          <div className="pdp__field">
            <p className="pdp__field-label">Colour</p>
            <span className="pill pill--selected">{selected.colour}</span>
          </div>

          <div className="pdp__field">
            <p className="pdp__field-label">Quantity</p>
            <div className="stepper">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span aria-live="polite" aria-label={`Quantity ${quantity}`}>{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(9, q + 1))}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {soldOut && <p className="pdp__soldout">Sold out — message us on WhatsApp to know when it's back.</p>}
          <div className="pdp__actions">
            <button
              type="button"
              disabled={soldOut}
              className="btn btn--outline"
              onClick={() => { addToCart(selected, quantity); showConfirmation(`Added ${quantity} to your cart ✓`); }}
            >
              Add to cart
            </button>
            <button
              type="button"
              disabled={soldOut}
              className="btn btn--solid"
              onClick={() => { addToCart(selected, quantity); navigate("/cart"); }}
            >
              Buy it now
            </button>
          </div>
          <p className="pdp__confirmation" role="status">{confirmation}</p>

          <div className="accordion-list">
            <AccordionRow title="Shipping & delivery">
              Orders dispatch within 2 business days and arrive in 5–7 days across India.
              Shipping is free above {rs(BRAND.freeShippingAbove)}; below that we confirm the
              charge on WhatsApp.
            </AccordionRow>
            <AccordionRow title="Returns & exchanges">
              Unused items in original packaging can be returned or exchanged within
              14 days of delivery.
            </AccordionRow>
            <AccordionRow title="Jewellery care">
              Keep away from water and perfume. Store flat in the pouch
              provided to protect the finish between wears.
            </AccordionRow>
            <AccordionRow title="Support">
              Questions about sizing or an order? Reach us any time and we'll
              get back to you within a day.
            </AccordionRow>
          </div>
        </section>

        <Reviews productId={selected.id} />

        <section className="related">
          <h2 className="related__title">You may also like</h2>
          <div className="grid">
            {related.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <FloatingWidgets />
      <BottomNav />
    </>
  );
}