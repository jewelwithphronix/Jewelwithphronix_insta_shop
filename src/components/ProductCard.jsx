import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Price from "./Price.jsx";
import { imgProps } from "../utils/img.js";
import { HeartIcon } from "./Icons.jsx";
import { useLikes, toggleLike, likeProduct } from "../utils/likes.js";
import { discountPercent } from "../utils/productStore.js";

export default function ProductCard({ product, variant = "default" }) {
  const boxed = variant === "boxed";
  const { isLiked } = useLikes();
  const liked = isLiked(product.id);
  const [bigHeart, setBigHeart] = useState(0); // double-click heart (counter restarts the animation)
  const [hearts, setHearts] = useState([]); // floating hearts
  const timers = useRef(new Set());
  useEffect(() => () => timers.current.forEach(window.clearTimeout), []); // clear on unmount
  const cover = product.images?.[0];
  const off = discountPercent(product);

  // Instagram-style: several hearts float up from the bottom-right of the photo
  function burstHearts(count = 6) {
    const stamp = Date.now();
    const batch = Array.from({ length: count }, (_, i) => ({
      id: `${stamp}-${i}-${Math.random()}`,
      dx: Math.round((Math.random() - 0.5) * 60),
      rise: 90 + Math.round(Math.random() * 90),
      size: 12 + Math.round(Math.random() * 14),
      delay: i * 0.08,
      dur: 1.3 + Math.random() * 0.7,
      right: 10 + Math.round(Math.random() * 24),
    }));
    setHearts((h) => [...h, ...batch]);
    const t = window.setTimeout(() => {
      timers.current.delete(t);
      setHearts((h) => h.filter((x) => !batch.includes(x)));
    }, 2800);
    timers.current.add(t);
  }

  function handleLike(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!liked) burstHearts(6);
    toggleLike(product);
  }

  function handleDoubleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    likeProduct(product); // only likes if not already liked
    setBigHeart((n) => n + 1);
    burstHearts(8);
  }

  const to = `/product/${product.id}`;
  return (
    // article + separate link/button: a button inside a link confuses keyboards and screen readers
    <article className={"card" + (boxed ? " card--boxed" : "")}>
      <div className="card__image" onDoubleClick={handleDoubleClick}>
        <Link to={to} className="card__media" tabIndex={-1} aria-hidden="true">
          {cover ? (
            <img {...imgProps(cover)} alt="" decoding="async" />
          ) : (
            <span className="card__swatch" style={{ background: product.color }} />
          )}
        </Link>
        {product.inStock === false ? (
          <span className="discount-badge discount-badge--soldout">Sold out</span>
        ) : off > 0 && <span className="discount-badge">{off}% off</span>}
        <button
          type="button"
          className={`card__wish ${liked ? "card__wish--liked" : ""}`}
          aria-label={`Save ${product.name} to wishlist`}
          aria-pressed={liked}
          onClick={handleLike}
        >
          <HeartIcon size={boxed ? 26 : 18} filled={liked} />
        </button>

        {/* big heart on double-click */}
        {bigHeart > 0 && (
          <span key={bigHeart} className="big-heart" aria-hidden="true">
            <HeartIcon size={72} filled />
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
              bottom: "10px",
              animationDelay: `${h.delay}s`,
            }}
          >
            <HeartIcon size={h.size} filled />
          </span>
        ))}
      </div>
      <div className="card__body">
        <h3 className="card__name">
          <Link to={to} className="card__link">{product.name}</Link>
        </h3>
        <Price product={product} className="card__price" />
      </div>
    </article>
  );
}
