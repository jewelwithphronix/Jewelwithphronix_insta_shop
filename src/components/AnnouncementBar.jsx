import { useState, useEffect } from "react";
import { BRAND } from "../config/brand.js";
import { ChevronLeft, ChevronRight, InstagramIcon } from "./Icons.jsx";

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export default function AnnouncementBar() {
  const messages = BRAND.announcements;
  const [i, setI] = useState(0);
  const [hold, setHold] = useState(false);

  // auto-rotate every 6s; stops on hover/focus and for "reduce motion" users
  useEffect(() => {
    if (messages.length < 2 || hold || prefersReducedMotion()) return;
    const t = setInterval(() => setI((n) => (n + 1) % messages.length), 6000);
    return () => clearInterval(t);
  }, [messages.length, hold]);

  const prev = () => setI((n) => (n - 1 + messages.length) % messages.length);
  const next = () => setI((n) => (n + 1) % messages.length);

  return (
    <div
      className="announce"
      role="region"
      aria-label="Offers"
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={() => setHold(false)}
    >
      <div className="announce__social">
        <a href={BRAND.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><InstagramIcon size={22} /></a>
      </div>
      <div className="announce__inner">
        <button type="button" className="announce__arrow" onClick={prev} aria-label="Previous announcement">
          <ChevronLeft size={20} />
        </button>
        <p className="announce__text">{messages[i]}</p>
        <button type="button" className="announce__arrow" onClick={next} aria-label="Next announcement">
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}