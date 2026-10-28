import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../utils/auth.js";

/*
  Profile icon used in the header and the mobile bottom bar.
  - Signed in  : goes straight to the account page (/login shows "Hi, name").
  - Signed out : opens a small popup that nudges the customer to sign in.
  placement: "down" (header, popup opens below) | "up" (bottom bar, popup opens above)
*/
export default function AccountButton({
  children,
  wrapperClass = "",
  buttonClass = "",
  label = "Account",
  placement = "down",
}) {
  const user = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // close on outside click / Esc / page change
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  useEffect(() => setOpen(false), [location.pathname]);

  if (user) {
    return (
      <div className={wrapperClass}>
        <Link to="/login" className={buttonClass} aria-label={label}>{children}</Link>
      </div>
    );
  }

  const from = location.pathname + location.search;

  return (
    <div className={"acct " + wrapperClass} ref={ref}>
      <button
        type="button"
        className={buttonClass}
        aria-label={label}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((o) => !o)}
      >
        {children}
      </button>

      {open && (
        <div className={"acct__pop acct__pop--" + placement} role="dialog" aria-label="Sign in">
          <p className="acct__text">Sign in to order</p>
          <Link to="/login" state={{ from }} className="acct__btn" onClick={() => setOpen(false)}>
            Sign in
          </Link>
        </div>
      )}
    </div>
  );
}