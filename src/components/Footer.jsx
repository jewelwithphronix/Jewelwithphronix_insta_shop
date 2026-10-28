import { Link } from "react-router-dom";
import { BRAND } from "../config/brand.js";
import { LogoMark, InstagramIcon, WhatsAppIcon } from "./Icons.jsx";

// Fakt chalnare links. Navin policy page banvla ki ithe { label, to } add kara.
const help = [
  { label: "Shop all", to: "/shop" },
  { label: "FAQs", to: "/faq" },
  { label: "Returns & Exchanges", to: "/returns" },
  { label: "Contact Us", to: "/contact" },
];

const waNumber = String(BRAND.whatsapp || "").replace(/\D/g, "");
// placeholder GST ("YOUR-GST-NUMBER") customers la dakhvu naka
const gst = /^your/i.test(BRAND.gst || "") ? "" : BRAND.gst;

export default function Footer() {
  return (
    <footer className="foot">
      <div className="foot__inner foot__inner--min">
        <div className="foot__brand">
          <Link to="/" className="foot__logo" aria-label={`${BRAND.name} home`}>
            <LogoMark size={56} letter={BRAND.initial} />
          </Link>
          <div>
            <p className="foot__name">{BRAND.name}</p>
            <p className="foot__tagline">{BRAND.tagline}</p>
          </div>
        </div>

        <nav aria-label="Help">
          <h2 className="foot__title">Help</h2>
          <ul className="foot__links">
            {help.map((l) => (
              <li key={l.to}><Link to={l.to}>{l.label}</Link></li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="foot__title">Contact</h2>
          <ul className="foot__links">
            <li>
              <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer" className="foot__icon-link">
                <WhatsAppIcon size={18} /> {BRAND.whatsapp} <span className="foot__muted">(messages only)</span>
              </a>
            </li>
            <li><a href={`mailto:${BRAND.email}`}>{BRAND.email}</a></li>
            {BRAND.instagram && (
              <li>
                <a href={BRAND.instagram} target="_blank" rel="noopener noreferrer" className="foot__icon-link">
                  <InstagramIcon size={18} /> Instagram
                </a>
              </li>
            )}
            <li className="foot__muted">{BRAND.storeAddress}</li>
          </ul>
        </div>
      </div>

      <div className="foot__bottom foot__bottom--min">
        <p>© {new Date().getFullYear()} {BRAND.name}</p>
        {gst && <p>GSTIN: {gst}</p>}
      </div>
    </footer>
  );
}
