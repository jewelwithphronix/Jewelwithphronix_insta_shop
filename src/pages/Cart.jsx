import { useState } from "react";
import { Link } from "react-router-dom";
import { BRAND } from "../config/brand.js";
import { rs } from "../utils/format.js";
import { useCart, setQty, removeFromCart } from "../utils/cart.js";
import { useAddress, saveAddress, addressComplete, detectLocation } from "../utils/address.js";
import { useAuth } from "../utils/auth.js";
import { supabase } from "../lib/supabase.js";
import AnnouncementBar from "../components/AnnouncementBar.jsx";
import Header from "../components/Header.jsx";
import BottomNav from "../components/BottomNav.jsx";
import Footer, { Newsletter } from "../components/Footer.jsx";
import FloatingWidgets from "../components/FloatingWidgets.jsx";

const FREE_SHIPPING_ABOVE = 5000;

export default function Cart() {
  const { lines, count, subtotal } = useCart();

  const addr = useAddress();
  const user = useAuth();
  const [err, setErr] = useState("");
  const [locating, setLocating] = useState(false);
  const [placing, setPlacing] = useState(false);

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

  async function orderOnWhatsApp() {
    const a = { ...addr, name: addr.name || user?.name || "" };
    if (!addressComplete(a)) {
      setErr("Please fill your name, 10-digit phone, full address, city and 6-digit pincode.");
      document.getElementById("ship-address")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setPlacing(true);
    const orderId = "JWP" + Date.now().toString(36).toUpperCase();

    // save the order (with address) so it is not lost, best effort
    if (supabase) {
      try {
        await supabase.from("orders").insert({
          id: orderId,
          customer_name: a.name.trim(),
          phone: a.phone.replace(/\D/g, "").slice(-10),
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
          subtotal: subtotal,
        });
      } catch { /* WhatsApp order still goes through */ }
    }

    const rows = lines.map(
      (l, i) => `${i + 1}. ${l.product.name} (Code ${l.product.productCode || l.product.id}) x ${l.qty} = ${rs(l.product.price * l.qty)}`
    );
    const addressText = [
      `Name: ${a.name.trim()}`,
      `Phone: ${a.phone.replace(/\D/g, "").slice(-10)}`,
      `Address: ${[a.line.trim(), a.city.trim(), a.state.trim(), a.pincode.trim()].filter(Boolean).join(", ")}`,
      a.mapLink ? `Location: ${a.mapLink}` : "",
    ].filter(Boolean).join("\n");
    const text = `Hi ${BRAND.name}, I would like to order (Order ${orderId}):\n\n${rows.join("\n")}\n\nTotal: ${rs(subtotal)}\n\nDelivery details:\n${addressText}`;
    const number = BRAND.whatsapp.replace(/\D/g, "");
    setPlacing(false);
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
              <b>{rs(subtotal)}</b>
            </p>
            <p className="cart__note">Taxes included. Shipping calculated at checkout.</p>

            <button type="button" className="cart-btn cart-btn--wa" onClick={orderOnWhatsApp} disabled={placing}>
              {placing ? "Placing order…" : "Order on WhatsApp"}
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