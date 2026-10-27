import PageShell from "../components/PageShell.jsx";
import AccordionRow from "../components/AccordionRow.jsx";
import { Link } from "react-router-dom";
import { BRAND } from "../config/brand.js";

const FAQS = [
  { q: "How do I place an order?", a: "Add pieces to the cart, fill your delivery address and tap “Order on WhatsApp”. Our team will confirm and share payment details." },
  { q: "Which payment methods do you accept?", a: "UPI, bank transfer and major cards. Details are shared on WhatsApp after confirmation." },
  { q: "How long does delivery take?", a: "Orders dispatch within 2 business days. Standard delivery takes 5–7 days across India." },
  { q: "Is shipping free?", a: "Yes, on orders above ₹5,000. Below that, a small charge applies." },
  { q: "How can I check my order status?", a: `Message us on WhatsApp (${BRAND.whatsapp}) and we'll update you.` },
  { q: "Can I return or exchange a product?", a: "Yes, within 14 days of delivery if unused. Fill the form on the Returns & Exchanges page." },
  { q: "What if my product arrives damaged?", a: "Share an unboxing video and photos within 48 hours. We will replace or refund it." },
  { q: "What is the Stock Clearance Sale?", a: "Limited-quantity pieces at reduced prices. They sell out quickly." },
  { q: "How do I take care of my jewellery?", a: "Keep away from water and perfume. Store flat in the pouch provided." },
  { q: "Can I cancel or change my order?", a: "Yes, before it is dispatched. Message us on WhatsApp as soon as possible." },
];

export default function Faq() {
  return (
    <PageShell>
      <main className="page">
        <h1 className="font-serif text-2xl font-semibold sm:text-3xl">Frequently Asked Questions</h1>
        <p className="page__sub">Quick answers to common questions.</p>
        <div className="accordion-list faq">
          {FAQS.map((f) => <AccordionRow key={f.q} title={f.q}>{f.a}</AccordionRow>)}
        </div>
        <p className="page__sub" style={{ marginTop: 28 }}>
          Still need help? <Link to="/contact" className="page__link">Contact us</Link>
        </p>
      </main>
    </PageShell>
  );
}