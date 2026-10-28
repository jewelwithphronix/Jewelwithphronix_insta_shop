import { Link } from "react-router-dom";
import { BRAND } from "../config/brand.js";
import { LogoMark, InstagramIcon, ArrowRight } from "./Icons.jsx";

const help = [
  { label: "FAQs", to: "/faq" },
  // { label: "Track Your Order" },   // kadhlele
  { label: "Returns & Exchanges", to: "/returns" },
  { label: "Contact Us", to: "/contact" },
];

const company = [
  "Shipping Policy",
  "Return & Exchange Policy",
  "RTO Policy",
  "Order Modification and Cancellation Policy",
  "Damage & Product Variation Policy",
  "Privacy Policy",
  "Terms & Conditions",
];
const legal = ["Return and refund policy", "Privacy policy", "Terms of service", "Contact information"];

export function Newsletter() {
  return (
    <section className="news">
      <h2 className="news__title">Sign up and save</h2>
      <p className="news__text">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
      <form className="news__form" onSubmit={(e) => e.preventDefault()}>
        <input type="email" placeholder="Email" aria-label="Email" />
        <button type="submit" aria-label="Subscribe"><ArrowRight size={22} /></button>
      </form>
    </section>
  );
}

const Links = ({ items }) => (
  <ul className="foot__links">
    {items.map((l) =>
      typeof l === "string" ? (
        <li key={l}><a href="#" onClick={(e) => e.preventDefault()}>{l}</a></li>
      ) : (
        <li key={l.label}><Link to={l.to}>{l.label}</Link></li>
      )
    )}
  </ul>
);

export default function Footer() {
  return (
    <footer className="foot">
      <div className="foot__inner">
        <div className="foot__grid">
          <div>
            <Link to="/" className="foot__logo" aria-label={BRAND.name}>
              <LogoMark size={110} letter={BRAND.initial} />
            </Link>
            <p className="foot__name">{BRAND.name}</p>
            <p className="foot__tagline">{BRAND.tagline}</p>
            <div className="foot__social">
              <a href={BRAND.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><InstagramIcon size={24} /></a>
            </div>
          </div>
          <div>
            <h3 className="foot__title">NEED HELP</h3>
            <Links items={help} />
          </div>
          <div>
            <h3 className="foot__title">COMPANY</h3>
            <Links items={company} />
          </div>
        </div>

        <div className="foot__grid foot__grid--two">
          <div>
            <h3 className="foot__title foot__title--plain">EU Legal Policies</h3>
            <Links items={legal} />
          </div>
          <div>
            <h3 className="foot__title">CONTACT US</h3>
            <p className="foot__contact"><b>WhatsApp Us Here:</b></p>
            <p className="foot__contact"><a href="#" onClick={(e) => e.preventDefault()}>{BRAND.whatsapp}</a></p>
            <p className="foot__contact">
              <b>Note:</b> This number is for WhatsApp messages only. Voice calls to this number are not available.
            </p>
            <p className="foot__contact"><b>Email Us:</b><br /><a href={`mailto:${BRAND.email}`}>{BRAND.email}</a></p>
            <p className="foot__contact"><b>GST Registration Number:</b> {BRAND.gst}</p>
          </div>
        </div>

        <div className="foot__bottom">
          <span className="foot__pay" aria-label="PayPal">PayPal</span>
          <p>© {new Date().getFullYear()}, {BRAND.name}</p>
        </div>
      </div>
    </footer>
  );
}