import { useState } from "react";
import PageShell from "../components/PageShell.jsx";
import { BRAND } from "../config/brand.js";
import { WhatsAppIcon } from "../components/Icons.jsx";

export default function Contact() {
  const [f, setF] = useState({ name: "", email: "", message: "" });
  const [err, setErr] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const wa = BRAND.whatsapp.replace(/\D/g, "");

  function send(e) {
    e.preventDefault();
    if (!f.name.trim() || !f.message.trim()) return setErr("Please enter your name and message.");
    setErr("");
    const text = `Hi ${BRAND.name}, I'm ${f.name.trim()}${f.email ? ` (${f.email.trim()})` : ""}.\n\n${f.message.trim()}`;
    window.open(`https://wa.me/${wa}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  }

  return (
    <PageShell>
      <main className="page">
        <h1 className="font-serif text-2xl font-semibold sm:text-3xl">Contact us</h1>
        <p className="page__sub">We usually reply within a day.</p>
        <div className="contact">
          <div className="contact__info">
            <h2>Get in touch</h2>
            <p><b>WhatsApp</b><br /><a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer">{BRAND.whatsapp}</a></p>
            <p><b>Email</b><br /><a href={`mailto:${BRAND.email}`}>{BRAND.email}</a></p>
            <p><b>Address</b><br />{BRAND.storeAddress}</p>
            <p><b>Hours</b><br />{BRAND.hours}</p>
          </div>
          <form className="contact__form" onSubmit={send} noValidate>
            <h2>Send a message</h2>
            <label className="contact__label" htmlFor="c-name">Your name</label>
            <input id="c-name" autoComplete="name" value={f.name} onChange={set("name")} />
            <label className="contact__label" htmlFor="c-email">Email <span>(optional)</span></label>
            <input id="c-email" type="email" autoComplete="email" value={f.email} onChange={set("email")} />
            <label className="contact__label" htmlFor="c-msg">How can we help?</label>
            <textarea id="c-msg" rows={5} value={f.message} onChange={set("message")} />
            {err && <p className="login__error" role="alert">{err}</p>}
            <button type="submit" className="cart-btn cart-btn--wa"><WhatsAppIcon size={20} /> Send on WhatsApp</button>
          </form>
        </div>
      </main>
    </PageShell>
  );
}