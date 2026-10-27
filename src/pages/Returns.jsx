import PageShell from "../components/PageShell.jsx";
import { BRAND } from "../config/brand.js";

export default function Returns() {
  const formUrl = (BRAND.returnFormUrl || "").trim();
  const wa = BRAND.whatsapp.replace(/\D/g, "");
  // Google Form link nasel tar button WhatsApp ughadto
  const href = formUrl || `https://wa.me/${wa}?text=${encodeURIComponent("Hi, I would like to return / exchange my order.")}`;

  return (
    <PageShell>
      <main className="page">
        <h1 className="font-serif text-2xl font-semibold sm:text-3xl">Returns &amp; Exchanges</h1>
        <p className="page__sub">If something isn't right, we'll make it right.</p>
        <ul className="page__list">
          <li>Returns and exchanges are accepted within <b>14 days</b> of delivery.</li>
          <li>The item must be unused, with original packaging.</li>
          <li>For damaged items, share an <b>unboxing video and photos</b> within 48 hours.</li>
          <li>Refunds go to your original payment method after we check the product.</li>
        </ul>
        <a className="cart-btn page__cta" href={href} target="_blank" rel="noopener noreferrer">
          {formUrl ? "Fill the return form" : "Request a return on WhatsApp"}
        </a>
      </main>
    </PageShell>
  );
}