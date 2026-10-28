// import products from "../data/products.js";
import { useProducts } from "../utils/productStore.js";
import { useLikes } from "../utils/likes.js";
import ProductCard from "../components/ProductCard.jsx";
import AnnouncementBar from "../components/AnnouncementBar.jsx";
import Header from "../components/Header.jsx";
import SearchBar from "../components/SearchBar.jsx";
import CollectionCarousel from "../components/CollectionCarousel.jsx";
import BottomNav from "../components/BottomNav.jsx";
import Footer from "../components/Footer.jsx";
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

      <main className="mx-auto max-w-[1200px] px-5 pb-10 pt-6 md:px-8 md:pt-10">
        <h1 className="sr-only">Jewelwithphronix — handcrafted jewellery</h1>
        {total > 0 && (
          <section id="liked-section" className="mb-10">
            <h2 className="section-title">Liked by you</h2>
            <div className="grid mt-4">
              {likedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        <h2 className="section-title">New in this week</h2>
        <div className="grid mt-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
      <Footer />
      <FloatingWidgets />
      <BottomNav />
    </>
  );
}