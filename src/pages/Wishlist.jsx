import { Link } from "react-router-dom";
  // import products from "../data/products.js";
import { useProducts } from "../utils/productStore.js";
import { useLikes } from "../utils/likes.js";
import ProductCard from "../components/ProductCard.jsx";
import AnnouncementBar from "../components/AnnouncementBar.jsx";
import Header from "../components/Header.jsx";
import BottomNav from "../components/BottomNav.jsx";
import Footer from "../components/Footer.jsx";
import FloatingWidgets from "../components/FloatingWidgets.jsx";
import { HeartIcon } from "../components/Icons.jsx";

export default function Wishlist() {
  const products = useProducts();  
  const { isLiked, total } = useLikes();
  const liked = products.filter((p) => isLiked(p.id));

  return (
    <>
      <AnnouncementBar />
      <Header />

      <main className="mx-auto max-w-[1200px] px-6 pb-10 pt-6 md:px-8 md:pt-8">
        <h1 className="font-serif text-2xl font-semibold text-gray-900 sm:text-3xl">
          My Wishlist {total > 0 && <span className="text-lg font-normal text-gray-500">({total})</span>}
        </h1>

        {liked.length > 0 ? (
          <div className="grid mt-6">
            {liked.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="wl-empty">
            <HeartIcon size={56} />
            <h2>Your wishlist is empty</h2>
            <p>Tap the heart on any product to save it here.</p>
            <Link to="/" className="wl-empty__btn">Continue shopping</Link>
          </div>
        )}
      </main>

      <Footer />
      <FloatingWidgets />
      <BottomNav />
    </>
  );
}