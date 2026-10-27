// import products from "../data/products.js";
import { useProducts } from "../utils/productStore.js";
import { useLikes } from "../utils/likes.js";
import ProductCard from "../components/ProductCard.jsx";
import AnnouncementBar from "../components/AnnouncementBar.jsx";
import Header from "../components/Header.jsx";
import SearchBar from "../components/SearchBar.jsx";
import CollectionCarousel from "../components/CollectionCarousel.jsx";
import BottomNav from "../components/BottomNav.jsx";
import Footer, { Newsletter } from "../components/Footer.jsx";
import FloatingWidgets from "../components/FloatingWidgets.jsx";

export default function Home() {
  const products = useProducts();   // ← hi navin line
  const { isLiked, total } = useLikes();
  const likedProducts = products.filter((p) => isLiked(p.id));

  return (
    <>
      <AnnouncementBar />
      <Header />
      <div className="search-mobile-only"><SearchBar /></div>
      
      <CollectionCarousel />

      <main className="mx-auto max-w-[1200px] px-6 pb-6 md:px-8 md:pt-4">
        {total > 0 && (
          <section id="liked-section" className="mb-10">
            <h1 className="font-serif text-2xl font-semibold text-gray-900 sm:text-3xl">
              Liked by you <span className="text-[#e8231f]">♥</span>
            </h1>
            <div className="grid mt-4">
              {likedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        <h1 className="font-serif text-2xl font-semibold text-gray-900 sm:text-3xl">
          New in this week
        </h1>
        <div className="grid mt-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
        <Newsletter />
      <Footer />
      <FloatingWidgets />
      <BottomNav />
    </>
  );
}