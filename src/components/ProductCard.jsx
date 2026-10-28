import { useState } from "react";
import { Link } from "react-router-dom";
import { rs } from "../utils/format.js";
import { HeartIcon } from "./Icons.jsx";
import { useLikes, toggleLike, likeProduct } from "../utils/likes.js";
import { discountPercent } from "../utils/productStore.js";

export default function ProductCard({ product, variant = "default" }) {
  const boxed = variant === "boxed";
  const { isLiked } = useLikes();
  const liked = isLiked(product.id);
  const [bigHeart, setBigHeart] = useState(0); // double-click heart (counter restarts the animation)
  const [hearts, setHearts] = useState([]); // floating hearts
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
    window.setTimeout(() => setHearts((h) => h.filter((x) => !batch.includes(x))), 2800);
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

  return (
    <Link to={`/product/${product.id}`} className={"card" + (boxed ? " card--boxed" : "")}>
      <div
        className="card__image"
        style={
          cover
            ? { backgroundImage: `url(${cover})`, backgroundSize: "cover", backgroundPosition: "center" }
            : { background: product.color }
        }
        onDoubleClick={handleDoubleClick}
      >
        {product.inStock === false ? (
          <span className="discount-badge discount-badge--soldout">Sold out</span>
        ) : off > 0 && <span className="discount-badge">{off}% OFF</span>}
        <button
          type="button"
          className={`card__wish ${liked ? 'card__wish--liked' : ''}`}
          aria-label={liked ? "Unlike" : "Like"}
          onClick={handleLike}
        >
          <HeartIcon size={boxed ? 26 : 17} filled={liked} />
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
        <p className="card__name">{product.name}</p>
        <p className="card__price">
          <span className="card__mrp">{rs(product.mrp)}</span>
          <span className="card__sale">{rs(product.price)}</span>
        </p>
      </div>
    </Link>
  );
}