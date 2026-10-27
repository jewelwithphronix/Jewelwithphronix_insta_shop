import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import products from "../data/products.js";
import { BRAND } from "../config/brand.js";
import { rs } from "../utils/format.js";
import AnnouncementBar from "../components/AnnouncementBar.jsx";
import Header from "../components/Header.jsx";
import ProductGallery from "../components/ProductGallery.jsx";
import EmiBox from "../components/EmiBox.jsx";
import TrustStrip from "../components/TrustStrip.jsx";
import AccordionRow from "../components/AccordionRow.jsx";
import ProductCard from "../components/ProductCard.jsx";
import Footer, { Newsletter } from "../components/Footer.jsx";
import FloatingWidgets from "../components/FloatingWidgets.jsx";
import BottomNav from "../components/BottomNav.jsx";
import {
  HeartIcon, CheckIcon, ShareIcon,
  DocIcon, TruckSmall, RotateIcon, BoxIcon, ChatIcon,
} from "../components/Icons.jsx";

export default function ProductListing() {
  const { id } = useParams();
  const selected = products.find((p) => p.id === id) ?? products[0];

  const [quantity, setQuantity] = useState(1);
  const [wished, setWished] = useState(false);
  const [confirmation, setConfirmation] = useState("");

  // new product -> reset state and jump to top
  useEffect(() => {
    setQuantity(1);
    setWished(false);
    setConfirmation("");
    window.scrollTo(0, 0);
  }, [selected.id]);

  const related = products.filter((p) => p.id !== selected.id).slice(0, 5);

  function showConfirmation(message) {
    setConfirmation(message);
    window.clearTimeout(showConfirmation._t);
    showConfirmation._t = window.setTimeout(() => setConfirmation(""), 2200);
  }

  async function handleShare() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: selected.name, url });
      } else {
        await navigator.clipboard.writeText(url);
        showConfirmation("Link copied to clipboard");
      }
    } catch {
      /* user cancelled share sheet */
    }
  }

  return (
    <>
      <AnnouncementBar />
      <Header showSearch />

      <main className="pdp">
        <div className="pdp__main">
          <ProductGallery
            images={selected.images}
            alt={selected.name}
            fallbackColor={selected.color}
          />

          <section className="pdp__info">
            <p className="pdp__vendor">{BRAND.name}</p>
            <h1 className="pdp__name">{selected.name}</h1>
            {selected.productCode && (
              <p className="pdp__code">Product Code : {selected.productCode}</p>
            )}

            <div className="pdp__price-row">
              <span className="pdp__mrp">{rs(selected.mrp)}</span>
              <span className="pdp__price">{rs(selected.price)}</span>
            </div>
            <p className="pdp__taxes">
              Taxes included. <a href="#" onClick={(e) => e.preventDefault()}>Shipping</a> calculated at checkout.
            </p>

            <EmiBox price={selected.price} />

            <div className="pdp__field">
              <p className="pdp__label">Colour</p>
              <span className="pill">{selected.colour}</span>
            </div>

            <div className="pdp__field">
              <p className="pdp__label">Quantity</p>
              <div className="stepper">
                <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
                <span>{quantity}</span>
                <button type="button" onClick={() => setQuantity((q) => Math.min(9, q + 1))} aria-label="Increase quantity">+</button>
              </div>
            </div>

            <TrustStrip />

            <button
              type="button"
              className={"wishlist" + (wished ? " wishlist--on" : "")}
              onClick={() => setWished((w) => !w)}
            >
              <HeartIcon size={26} filled={wished} />
              {wished ? "Added to wishlist" : "Add to wishlist"}
            </button>

            <div className="pdp__actions">
              <button type="button" className="btn btn--outline" onClick={() => showConfirmation(`Added ${quantity} to your cart`)}>
                Add to cart
              </button>
              <button type="button" className="btn btn--solid" onClick={() => showConfirmation("Taking you to checkout…")}>
                Buy it now
              </button>
            </div>
            {confirmation && <p className="pdp__confirmation" role="status">{confirmation}</p>}

            <div className="pickup">
              <span className="pickup__tick"><CheckIcon size={18} /></span>
              <p>Pickup available at <b>{BRAND.pickupStore}</b></p>
              <p className="pickup__sub">Usually ready in 24 hours</p>
              <a href="#" className="pickup__link" onClick={(e) => e.preventDefault()}>View store information</a>
            </div>

            <div className="acc">
              <AccordionRow title="Product Details" icon={<DocIcon />}>
                {selected.caption} Every piece ships in recyclable packaging with a short care card inside.
              </AccordionRow>
              <AccordionRow title="Shipping & Delivery" icon={<TruckSmall />}>
                Orders dispatch within 2 business days. Standard shipping takes 5–7 days; priority shipping is available at checkout.
              </AccordionRow>
              <AccordionRow title="Returns & Exchanges" icon={<RotateIcon />}>
                Unused items can be returned within 24 hours of delivery. Exchanges ship free.
              </AccordionRow>
              <AccordionRow title="Jewellery Care" icon={<BoxIcon />}>
                Keep away from water and perfume. Store flat in the pouch provided to protect the finish between wears.
              </AccordionRow>
              <AccordionRow title="Support" icon={<ChatIcon />}>
                Questions about sizing or an order? Reach us any time and we'll get back to you within a day.
              </AccordionRow>
            </div>

            <button type="button" className="share" onClick={handleShare}>
              <ShareIcon size={18} /> Share
            </button>
          </section>
        </div>
      </main>

      <section className="reviews">
        <div className="reviews__inner">
          <h2 className="reviews__title">Customer Reviews</h2>
          <div className="reviews__body">
            <p>Be the first to write a review</p>
            <button type="button" className="reviews__btn">Write a review</button>
          </div>
        </div>
      </section>

      <section className="related">
        <h2 className="related__title">You may also like</h2>
        <div className="related__grid">
          {related.map((product) => (
            <ProductCard key={product.id} product={product} variant="boxed" />
          ))}
        </div>
      </section>

      <Newsletter />
      <Footer />
      <FloatingWidgets />
      <BottomNav />
    </>
  );
}