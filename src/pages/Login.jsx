import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BRAND } from "../config/brand.js";
import { useAuth, signIn, signOut, signInWithGoogle } from "../utils/auth.js";
import { LogoMark, ArrowRight } from "../components/Icons.jsx";

const GoogleG = () => (
  <svg width="22" height="22" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z" />
    <path fill="#FBBC05" d="M10.5 28.7A14.5 14.5 0 019.5 24c0-1.6.3-3.2.8-4.7l-7.9-6.1A24 24 0 000 24c0 3.9.9 7.5 2.6 10.8l7.9-6.1z" />
    <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
  </svg>
);

export default function Login() {
  const user = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [news, setNews] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Google varun parat aalyavar, customer jithe hota tithe pathva
  useEffect(() => {
    const dest = sessionStorage.getItem("afterLogin");
    if (user && dest) {
      sessionStorage.removeItem("afterLogin");
      navigate(dest, { replace: true });
    }
  }, [user, navigate]);

  // Google/Supabase ne error sobat parat pathavla tar (?error=... kinva #error=...) te dakhva
  useEffect(() => {
    const params = new URLSearchParams(window.location.search + "&" + window.location.hash.slice(1));
    const msg = params.get("error_description") || params.get("error");
    if (!msg) return;
    sessionStorage.removeItem("afterLogin");
    setError(
      /provider is not enabled|Unsupported provider/i.test(msg)
        ? "Google login ajun Supabase madhe chalu kela nahi."
        : "Google sign-in failed: " + msg.replace(/\+/g, " ")
    );
    window.history.replaceState(null, "", window.location.pathname);
  }, []);

  async function handleGoogle() {
    setError("");
    setBusy(true);
    try {
      sessionStorage.setItem("afterLogin", from);
      await signInWithGoogle(); // Google chya page var jato
    } catch (e) {
      sessionStorage.removeItem("afterLogin");
      setError(
        /provider is not enabled|Unsupported provider/i.test(e.message)
          ? "Google login ajun Supabase madhe chalu kela nahi."
          : e.message
      );
      setBusy(false);
    }
  }

  function handleEmail(e) {
    e.preventDefault();
    if (!name.trim()) return setError("Please enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError("Please enter a valid email address.");
    setError("");
    signIn({ name: name.trim(), email: email.trim(), news });
    navigate(from, { replace: true });
  }

  if (user) {
    return (
      <main className="login">
        <Link to="/" className="login__logo" aria-label={`${BRAND.name} home`}>
          <LogoMark size={64} letter={BRAND.initial} />
        </Link>
        <section className="login__box">
          <h1 className="login__title">Hi, {user.name || "there"}!</h1>
          <p className="login__sub">You are signed in as {user.email}</p>
          <Link to="/" className="login__btn login__btn--shop" style={{ textDecoration: "none" }}>Continue shopping</Link>
          <button type="button" className="login__btn login__btn--google" onClick={signOut}>Sign out</button>
        </section>
      </main>
    );
  }

  return (
    <main className="login">
      <Link to="/" className="login__logo" aria-label={`${BRAND.name} home`}>
        <LogoMark size={64} letter={BRAND.initial} />
      </Link>

      <section className="login__box">
        <h1 className="login__title">Sign in</h1>
        <p className="login__sub">Sign in or create an account</p>

        <button type="button" className="login__btn login__btn--google" onClick={handleGoogle} disabled={busy}>
          <GoogleG />
          {busy ? "Opening Google…" : "Continue with Google"}
        </button>

        <div className="login__or"><span>or</span></div>

        <form onSubmit={handleEmail} noValidate>
          <div className="login__field" style={{ marginBottom: 10 }}>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              aria-label="Name"
            />
          </div>
          <div className={"login__field" + (error ? " login__field--error" : "")}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              aria-label="Email"
            />
            <button type="submit" aria-label="Continue">
              <ArrowRight size={22} />
            </button>
          </div>

          {error && <p className="login__error" role="alert">{error}</p>}

          <label className="login__check">
            <input type="checkbox" checked={news} onChange={(e) => setNews(e.target.checked)} />
            <span>Email me with news and offers</span>
          </label>
        </form>

        <p className="login__terms">
          By continuing, you agree to our <a href="#terms">Terms of service</a>
        </p>
      </section>

      <a href="#privacy" className="login__privacy">Privacy policy</a>
    </main>
  );
}