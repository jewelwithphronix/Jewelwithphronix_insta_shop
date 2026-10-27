import { useState } from "react";
import { useReviews, addReview, deleteReview } from "../utils/reviews.js";

function Stars({ value, size = 20 }) {
  return (
    <span className="stars" style={{ fontSize: size }} aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= Math.round(value) ? "stars__on" : "stars__off"}>★</span>
      ))}
    </span>
  );
}

export default function Reviews({ productId }) {
  const { list, count, avg } = useReviews(productId);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [thanks, setThanks] = useState(false);

  function reset() {
    setRating(0); setHover(0); setName(""); setTitle(""); setText(""); setError("");
  }

  function submit(e) {
    e.preventDefault();
    if (!rating) return setError("Please select a star rating.");
    if (!name.trim()) return setError("Please enter your name.");
    if (text.trim().length < 5) return setError("Please write your review.");
    addReview(productId, { name: name.trim(), rating, title: title.trim(), text: text.trim() });
    reset();
    setOpen(false);
    setThanks(true);
    window.setTimeout(() => setThanks(false), 3500);
  }

  return (
    <section className="reviews">
      <h2 className="reviews__title">Customer reviews</h2>

      {count > 0 ? (
        <div className="reviews__summary">
          <Stars value={avg} size={22} />
          <span>{avg.toFixed(1)} out of 5 · {count} {count === 1 ? "review" : "reviews"}</span>
        </div>
      ) : (
        <p className="reviews__empty">Be the first to write a review</p>
      )}

      {thanks && <p className="reviews__thanks" role="status">Thank you! Your review has been posted ✓</p>}

      {!open && (
        <button type="button" className="btn btn--solid" onClick={() => { setOpen(true); setThanks(false); }}>
          Write a review
        </button>
      )}

      {open && (
        <form className="rform" onSubmit={submit} noValidate>
          <h3>Write a review</h3>

          <div className="rform__field">
            <label>Rating</label>
            <div className="rform__stars" onMouseLeave={() => setHover(0)}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  className={n <= (hover || rating) ? "on" : ""}
                  onMouseEnter={() => setHover(n)}
                  onClick={() => setRating(n)}
                  aria-label={`${n} star${n > 1 ? "s" : ""}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="rform__field">
            <label htmlFor="r-name">Name</label>
            <input id="r-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" maxLength={40} />
          </div>

          <div className="rform__field">
            <label htmlFor="r-title">Review title <span>(optional)</span></label>
            <input id="r-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Give your review a title" maxLength={80} />
          </div>

          <div className="rform__field">
            <label htmlFor="r-text">Review</label>
            <textarea id="r-text" rows={5} value={text} onChange={(e) => setText(e.target.value)} placeholder="Write your comments here" maxLength={1000} />
          </div>

          {error && <p className="rform__error" role="alert">{error}</p>}

          <div className="rform__actions">
            <button type="button" className="btn btn--outline" onClick={() => { reset(); setOpen(false); }}>
              Cancel
            </button>
            <button type="submit" className="btn btn--solid">Submit review</button>
          </div>
        </form>
      )}

      {count > 0 && (
        <ul className="rlist">
          {list.map((r) => (
            <li key={r.id} className="rlist__item">
              <div className="rlist__top">
                <Stars value={r.rating} size={16} />
                <time>{new Date(r.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</time>
              </div>
              {r.title && <p className="rlist__title">{r.title}</p>}
              <p className="rlist__text">{r.text}</p>
              <p className="rlist__by">
                {r.name}
                <button type="button" onClick={() => deleteReview(productId, r.id)}>Delete</button>
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}