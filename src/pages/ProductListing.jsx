import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import products from "../data/products.js";
import { useProducts } from "../utils/productStore.js";
import AccordionRow from "../components/AccordionRow.jsx";
import ProductCard from "../components/ProductCard.jsx";
import Reviews from "../components/Reviews.jsx";
import BottomNav from "../components/BottomNav.jsx";
// import AnnouncementBar from "../components/AnnouncementBar.jsx";
// import Header from "../components/Header.jsx";
import Footer, { Newsletter } from "../components/Footer.jsx";
import FloatingWidgets from "../components/FloatingWidgets.jsx";
import { rs } from "../utils/format.js";
import { HeartIcon } from "../components/Icons.jsx";
import { useLikes, toggleLike, likeProduct } from "../utils/likes.js";
import { addToCart } from "../utils/cart.js";

export default function ProductListing() {
  const products = useProducts(); 
  const { id } = useParams();
  const navigate = useNavigate();
  const selected = products.find((p) => p.id === id) ?? products[0];

  const { isLiked } = useLikes();
  const wished = isLiked(selected.id);
  const soldOut = selected.inStock === false;
  const [activeImage, setActiveImage] = useState(selected.images?.[0]);
  const [quantity, setQuantity] = useState(1);
  const [confirmation, setConfirmation] = useState("");
  const [hearts, setHearts] = useState([]);   // floating hearts
  const [bigHeart, setBigHeart] = useState(0); // double-tap heart (counter restarts animation)

  useEffect(() => {
    setActiveImage(selected.images?.[0]);
    setQuantity(1);
    setConfirmation("");
    setHearts([]);
  }, [selected.id]);

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
    window.setTimeout(() => setHearts((h) => h.filter((x) => !batch.includes(x))), 3200);
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
    window.clearTimeout(showConfirmation._t);
    showConfirmation._t = window.setTimeout(() => setConfirmation(""), 2200);
  }

  return (
    <>
      {/* <AnnouncementBar />
      <Header showSearch /> */}

      <main className="pdp">
        <div
          className="pdp__hero"
          style={
            activeImage
              ? { backgroundImage: `url(${activeImage})`, backgroundSize: "cover", backgroundPosition: "center" }
              : { background: selected.color }
          }
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onDoubleClick={handleDoubleLike}
        >
          <button
            type="button"
            className={"pdp__hero-wish" + (wished ? " pdp__hero-wish--active" : "")}
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
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

        {selected.images && selected.images.length > 1 && (
          <div className="pdp__gallery">
            {selected.images.map((src) => (
              <button
                key={src}
                type="button"
                className={
                  "pdp__thumb-btn" + (src === activeImage ? " pdp__thumb-btn--active" : "")
                }
                onClick={() => setActiveImage(src)}
                aria-label={`Show ${selected.name} photo`}
              >
                <img src={src} alt={selected.name} className="pdp__thumb" />
              </button>
            ))}
          </div>
        )}

        <section className="pdp__info">
          <p className="pdp__creator">{selected.creator}</p>
          <h1 className="pdp__name">{selected.name}</h1>
          <p className="pdp__caption">{selected.caption}</p>

          <div className="pdp__price-row">
            <span className="pdp__mrp">{rs(selected.mrp)}</span>
            <span className="pdp__price">{rs(selected.price)}</span>
          </div>
          <p className="pdp__taxes">Taxes included. Shipping calculated at checkout.</p>

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
              <span>{quantity}</span>
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
          {confirmation && <p className="pdp__confirmation">{confirmation}</p>}

          <p className="pdp__pickup">✓ Pickup available — usually ready in 24 hours</p>

          <div className="accordion-list">
            <AccordionRow title="About the product">
              {selected.caption} Every piece ships in recyclable packaging with a
              short care card inside.
            </AccordionRow>
            <AccordionRow title="Shipping & delivery">
              Orders dispatch within 2 business days. Standard shipping takes
              5–7 days; priority shipping is available at checkout.
            </AccordionRow>
            <AccordionRow title="Returns, refunds & exchanges">
              Unused items can be returned within 14 days of delivery for a
              full refund. Exchanges ship free.
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
      <Newsletter />
      <Footer />
      <FloatingWidgets />
      <BottomNav />
    </>
  );
}