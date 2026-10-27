import { BRAND } from "../config/brand.js";
import { IndiaFlag, ChevronDown, WhatsAppIcon } from "./Icons.jsx";

// Builds https://wa.me/91XXXXXXXXXX?text=...  (10-digit Indian numbers get 91 added)
function whatsappLink() {
  const digits = String(BRAND.whatsapp || "").replace(/\D/g, "");
  const phone = digits.length === 10 ? "91" + digits : digits;
  const text = encodeURIComponent("Hi! I'm interested in your jewellery.");
  return `https://wa.me/${phone}?text=${text}`;
}

// Currency picker (bottom-left) + WhatsApp chat button (bottom-right)
export default function FloatingWidgets() {
  return (
    <>
     
      <a
        href={whatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        className="fx-video fx-whatsapp"
        aria-label="Chat with us on WhatsApp"
      >
        <WhatsAppIcon size={34} />
      </a>
    </>
  );
}