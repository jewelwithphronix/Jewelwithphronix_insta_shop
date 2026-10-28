import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BRAND } from "../config/brand.js";
import { rs } from "../utils/format.js";
import { useCart, setQty, removeFromCart, clearCart } from "../utils/cart.js";
import { priceCart, recordOrder, retryPendingOrders } from "../utils/orders.js";
import { useAddress, saveAddress, addressComplete, detectLocation } from "../utils/address.js";
import { useAuth } from "../utils/auth.js";
import AnnouncementBar from "../components/AnnouncementBar.jsx";
import Header from "../components/Header.jsx";
import BottomNav from "../components/BottomNav.jsx";
import Footer from "../components/Footer.jsx";
import FloatingWidgets from "../components/FloatingWidgets.jsx";

const FREE_SHIPPING_ABOVE = BRAND.freeShippingAbove;

export default function Cart() {
  const { lines, count, subtotal } = useCart();

  const addr = useAddress();
  const user = useAuth();
  const [err, setErr] = useState("");
  const [locating, setLocating] = useState(false);
  const [placed, setPlaced] = useState(null); // { orderId, url } after ordering
  const price = priceCart(subtotal);
  const soldOut = lines.filter((l) => l.product.inStock === false);

  // aadhi save na jhalele orders parat Supabase la pathva
  useEffect(() => { retryPendingOrders(); }, []);

  const field = (key) => ({
    value: addr[key] || (key === "name" && user?.name ? user.name : ""),
    onChange: (e) => { setErr(""); saveAddress({ [key]: e.target.value }); },
  });

  async function useMyLocation() {
    setLocating(true);
    setErr("");
    try {
      const found = await detectLocation();
      saveAddress(found);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLocating(false);
    }
  }

  function orderOnWhatsApp() {
    const a = { ...addr, name: addr.name || user?.name || "" };
    if (soldOut.length) {
      setErr(`Sold out: ${soldOut.map((l) => l.product.name).join(", ")}. Please remove ${soldOut.length === 1 ? "it" : "them"} to order.`);
      return;
    }
    if (!addressComplete(a)) {
      setErr("Please fill your name, 10-digit phone, full address, city and 6-digit pincode.");
      document.getElementById("ship-address")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const orderId = "JWP" + Date.now().toString(36).toUpperCase();
    const phone = a.phone.replace(/\D/g, "").slice(-10);

    const rows = lines.map(
      (l, i) => `${i + 1}. ${l.product.name} (Code ${l.product.productCode || l.product.id}) x ${l.qty} = ${rs(l.product.price * l.qty)}`
    );
    const totals = [
      `Subtotal: ${rs(price.subtotal)}`,
      price.discount ? `Offer (${BRAND.bulkOffer.percent}% off): -${rs(price.discount)}` : "",
      `Shipping: ${price.freeShipping ? "Free" : price.shipping != null ? rs(price.shipping) : "to be confirmed"}`,
      `Total: ${rs(price.total)}${!price.freeShipping && price.shipping == null ? " + shipping" : ""}`,
    ].filter(Boolean).join("\n");
    const addressText = [
      `Name: ${a.name.trim()}`,
      `Phone: ${phone}`,
      `Address: ${[a.line.trim(), a.city.trim(), a.state.trim(), a.pincode.trim()].filter(Boolean).join(", ")}`,
      a.mapLink ? `Location: ${a.mapLink}` : "",
    ].filter(Boolean).join("\n");
    const text = `Hi ${BRAND.name}, I would like to order (Order ${orderId}):\n\n${rows.join("\n")}\n\n${totals}\n\nDelivery details:\n${addressText}`;
    const url = `https://wa.me/${BRAND.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;

    // WhatsApp lagech ughadto (await nantar ughadla tar iPhone Safari block karto)
    window.open(url, "_blank", "noopener");

    // order browser madhe + Supabase madhe save, fail jhala tar nantar parat try
    recordOrder({
      id: orderId,
      customer_name: a.name.trim(),
      phone,
      email: user?.email || "",
      address_line: a.line.trim(),
      city: a.city.trim(),
      state: a.state.trim(),
      pincode: a.pincode.trim(),
      map_link: a.mapLink || "",
      items: lines.map((l) => ({
        id: l.product.id, name: l.product.name, code: l.product.productCode || "",
        price: l.product.price, qty: l.qty,
      })),
      subtotal: price.subtotal,
    });

    clearCart();
    setPlaced({ orderId, url });
    window.scrollTo({ top: 0 });
  }

  const remaining = Math.max(0, FREE_SHIPPING_ABOVE - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_ABOVE) * 100);

  return (
    <>
      <AnnouncementBar />
      <Header />

      {placed ? (
        <section className="cart-empty">
          <h1>Thank you! 🎉</h1>
          <p>Your order <b>{placed.orderId}</b> is ready in WhatsApp.</p>
          <p className="cart-done__note">Tap <b>Send</b> in WhatsApp so we can confirm your order and share payment details.</p>
          <a href={placed.url} target="_blank" rel="noopener noreferrer" className="cart-btn cart-btn--wa cart-done__wa">
            WhatsApp didn't open? Tap here
          </a>
          <Link to="/" className="cart-btn" onClick={() => setPlaced(null)}>Continue shopping</Link>
        </section>
      ) : lines.length === 0 ? (
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
                  {product.inStock === false && <p className="cart__soldout">Sold out — please remove</p>}
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

          <section className="ship" id="ship-address">
            <h2 className="ship__title">Delivery address</h2>
            <button type="button" className="ship__loc" onClick={useMyLocation} disabled={locating}>
              {locating ? "Detecting location…" : "📍 Use my current location"}
            </button>
            <div className="ship__grid">
              <label>Full name<input type="text" autoComplete="name" {...field("name")} /></label>
              <label>Phone (10 digits)<input type="tel" inputMode="numeric" autoComplete="tel" maxLength={14} {...field("phone")} /></label>
              <label className="ship__wide">House / street / area<input type="text" autoComplete="street-address" {...field("line")} /></label>
              <label>City<input type="text" autoComplete="address-level2" {...field("city")} /></label>
              <label>State<input type="text" autoComplete="address-level1" {...field("state")} /></label>
              <label>Pincode<input type="text" inputMode="numeric" autoComplete="postal-code" maxLength={6} {...field("pincode")} /></label>
            </div>
            {err && <p className="ship__err">{err}</p>}
          </section>

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
              <b>{rs(price.subtotal)}</b>
            </p>
            {price.discount > 0 && (
              <p className="cart__sub cart__sub--offer">
                <span>Offer: {BRAND.bulkOffer.percent}% off</span>
                <b>−{rs(price.discount)}</b>
              </p>
            )}
            <p className="cart__sub">
              <span>Shipping</span>
              <b>{price.freeShipping ? "Free" : price.shipping != null ? rs(price.shipping) : "Confirmed on WhatsApp"}</b>
            </p>
            <p className="cart__sub cart__sub--total">
              <span>Total</span>
              <b>{rs(price.total)}</b>
            </p>
            <p className="cart__note">Taxes included.{!price.freeShipping && price.shipping == null ? " We'll confirm the shipping charge on WhatsApp." : ""}</p>
            {err && soldOut.length > 0 && <p className="ship__err" role="alert">{err}</p>}

            <button type="button" className="cart-btn cart-btn--wa" onClick={orderOnWhatsApp}>
              Order on WhatsApp
            </button>
          </aside>
        </section>
      )}

      <Footer />
      <FloatingWidgets />
      <BottomNav />
    </>
  );
}