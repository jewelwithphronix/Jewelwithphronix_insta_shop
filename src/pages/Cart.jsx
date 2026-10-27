import { Link } from "react-router-dom";
import { BRAND } from "../config/brand.js";
import { rs } from "../utils/format.js";
import { useCart, setQty, removeFromCart } from "../utils/cart.js";
import AnnouncementBar from "../components/AnnouncementBar.jsx";
import Header from "../components/Header.jsx";
import BottomNav from "../components/BottomNav.jsx";
import Footer, { Newsletter } from "../components/Footer.jsx";
import FloatingWidgets from "../components/FloatingWidgets.jsx";

const FREE_SHIPPING_ABOVE = 5000;

export default function Cart() {
  const { lines, count, subtotal } = useCart();

  function orderOnWhatsApp() {
    const rows = lines.map(
      (l, i) => `${i + 1}. ${l.product.name} (Code ${l.product.productCode || l.product.id}) x ${l.qty} = ${rs(l.product.price * l.qty)}`
    );
    const text = `Hi ${BRAND.name}, I would like to order:\n\n${rows.join("\n")}\n\nTotal: ${rs(subtotal)}`;
    const number = BRAND.whatsapp.replace(/\D/g, "");
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  }

  const remaining = Math.max(0, FREE_SHIPPING_ABOVE - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_ABOVE) * 100);

  return (
    <>
      <AnnouncementBar />
      <Header />

      {lines.length === 0 ? (
        <section className="cart-empty">
          <h1>Your cart is empty</h1>
          <Link to="/" className="cart-btn">Continue shopping</Link>
          <h2>Have an account?</h2>
          <p>
            <Link to="/login">Log in</Link> to check out faster.
          </p>
        </section>
      ) : (
        <section className="cart">
          <div className="cart__head">
            <h1>Your cart</h1>
            <Link to="/">Continue shopping</Link>
          </div>

          <ul className="cart__list">
            {lines.map(({ product, qty }) => (
              <li key={product.id} className="cart__item">
                <Link to={`/product/${product.id}`} className="cart__img">
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.name} />
                  ) : (
                    <span style={{ background: product.color }} />
                  )}
                </Link>

                <div className="cart__info">
                  <Link to={`/product/${product.id}`} className="cart__name">{product.name}</Link>
                  {product.productCode && <p className="cart__meta">Code: {product.productCode}</p>}
                  <p className="cart__meta">
                    <s>{rs(product.mrp)}</s> <b>{rs(product.price)}</b>
                  </p>

                  <div className="cart__row">
                    <div className="stepper">
                      <button type="button" onClick={() => setQty(product.id, qty - 1)} aria-label="Decrease quantity">−</button>
                      <span>{qty}</span>
                      <button type="button" onClick={() => setQty(product.id, qty + 1)} aria-label="Increase quantity">+</button>
                    </div>
                    <button type="button" className="cart__remove" onClick={() => removeFromCart(product.id)}>
                      Remove
                    </button>
                  </div>
                </div>

                <p className="cart__line-total">{rs(product.price * qty)}</p>
              </li>
            ))}
          </ul>

          <aside className="cart__summary">
            <div className="cart__ship">
              <p>
                {remaining > 0
                  ? <>Add <b>{rs(remaining)}</b> more for <b>free shipping</b></>
                  : <>🎉 You get <b>free shipping</b></>}
              </p>
              <div className="cart__bar"><span style={{ width: `${progress}%` }} /></div>
            </div>

            <p className="cart__sub">
              <span>Subtotal ({count} {count === 1 ? "item" : "items"})</span>
              <b>{rs(subtotal)}</b>
            </p>
            <p className="cart__note">Taxes included. Shipping calculated at checkout.</p>

            <button type="button" className="cart-btn cart-btn--wa" onClick={orderOnWhatsApp}>
              Order on WhatsApp
            </button>
          </aside>
        </section>
      )}

      <Newsletter />
      <Footer />
      <FloatingWidgets />
      <BottomNav />
    </>
  );
}