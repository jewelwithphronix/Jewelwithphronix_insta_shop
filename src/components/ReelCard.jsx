import { useNavigate } from "react-router-dom";

export default function ReelCard({ product }) {
  const navigate = useNavigate();

  return (
    <section className="reel" style={{ background: product.color }}>
      <div className="reel__scrim" />

      <div className="reel__side-actions">
        <button className="icon-btn" aria-label="Like">♥</button>
        <button className="icon-btn" aria-label="Comment">💬</button>
        <button className="icon-btn" aria-label="Share">↗</button>
      </div>

      <div className="reel__info">
        <p className="reel__creator">{product.creator}</p>
        <h2 className="reel__name">{product.name}</h2>
        <p className="reel__caption">{product.caption}</p>

        <div className="reel__cta-row">
          <span className="reel__price">${product.price}</span>
          <button
            className="order-btn"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            Order now
          </button>
        </div>
      </div>
    </section>
  );
}
