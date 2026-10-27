import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BRAND } from "../config/brand.js";
import SearchBar from "./SearchBar.jsx";
import { useLikes } from "../utils/likes.js";
import { useCart } from "../utils/cart.js";
import {
  SearchIcon, UserIcon, HeartIcon, BagIcon, MenuIcon, CloseIcon, ChevronDown, LogoMark,
} from "./Icons.jsx";

const NAV = [
  { label: "Home", to: "/" },
  { label: "Shop All", to: "/shop" },
  { label: "Stock clearance Sale", to: "/clearance" },
  { label: "Catalog", to: "/catalog" },
  // { label: "Necklaces", chevron: true },
  // { label: "Types", chevron: true },
  // { label: "Track Your Order" },
  { label: "Returns & Exchanges", to: "/returns" },
  { label: "Contact Us", to: "/contact" },
  { label: "FAQs", to: "/faq" },
];

function NavItem({ item, onClick }) {
  const content = (
    <>
      {item.label}
      {item.chevron && <ChevronDown size={16} />}
    </>
  );
  return item.to ? (
    <Link to={item.to} className="hdr__link" onClick={onClick}>{content}</Link>
  ) : (
    <button type="button" className="hdr__link" onClick={onClick}>{content}</button>
  );
}

export default function Header({ showSearch = false }) {
  const [open, setOpen] = useState(false);
  const { total } = useLikes();
  const { count: cartCount } = useCart();

  // Esc key closes the menu, and the page behind doesn't scroll while it is open
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <header className="hdr">
        <div className="hdr__main">
          <button type="button" className="hdr__burger" aria-label="Open menu" onClick={() => setOpen(true)}>
            <MenuIcon size={30} />
          </button>

          <Link to="/" className="hdr__logo">
            <LogoMark size={44} letter={BRAND.initial} />
            <span className="hdr__logo-name">{BRAND.name}</span>
          </Link>

          {/* Desktop: search bar sits in the header row, right of the logo */}
          <div className="hdr__desk-search">
            <SearchBar className="w-full" />
          </div>

          <nav className="hdr__nav" aria-label="Main">
            {NAV.map((item) => (
              <NavItem key={item.label} item={item} />
            ))}
          </nav>

          <div className="hdr__icons">
            <Link to="/search" className="hdr__icon hdr__icon--desk" aria-label="Search"><SearchIcon size={28} /></Link>
            <Link to="/login" className="hdr__icon hdr__icon--desk" aria-label="Account"><UserIcon size={28} /></Link>
            <Link to="/wishlist" className="hdr__icon hdr__icon--badge" aria-label="Wishlist">
              <HeartIcon size={28} />
              {total > 0 && <span className="hdr__badge">{total}</span>}
            </Link>
            <Link to="/cart" className="hdr__icon hdr__icon--badge" aria-label="Cart">
              <BagIcon size={28} />
              {cartCount > 0 && <span className="hdr__badge">{cartCount}</span>}
            </Link>
          </div>
        </div>

        {/* Mobile / tablet: search bar sits under the header row */}
        {showSearch && (
          <div className="hdr__search">
            <SearchBar className="w-full" />
          </div>
        )}
      </header>

      {/* Menu drawer (mobile + desktop) */}
      {open && (
        <div className="drawer" role="dialog" aria-modal="true">
          <div className="drawer__overlay" onClick={() => setOpen(false)} />
          <aside className="drawer__panel">
            <div className="drawer__top">
              <span className="hdr__logo-name">{BRAND.name}</span>
              <button type="button" aria-label="Close menu" onClick={() => setOpen(false)}>
                <CloseIcon size={26} />
              </button>
            </div>
            <nav className="drawer__nav">
              {NAV.map((item) => (
                <NavItem key={item.label} item={item} onClick={() => setOpen(false)} />
              ))}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}