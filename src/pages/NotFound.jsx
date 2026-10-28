import { Link } from "react-router-dom";
import PageShell from "../components/PageShell.jsx";

// chukicha link / kadhun takla gela product
export default function NotFound({ title = "Page not found", text = "This page doesn't exist or has moved." }) {
  return (
    <PageShell>
      <main className="cart-empty">
        <h1>{title}</h1>
        <p>{text}</p>
        <Link to="/shop" className="cart-btn" style={{ marginTop: 28 }}>Browse all jewellery</Link>
      </main>
    </PageShell>
  );
}
