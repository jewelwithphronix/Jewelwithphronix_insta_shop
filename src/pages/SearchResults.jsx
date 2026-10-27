import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import BottomNav from "../components/BottomNav.jsx";
import Header from "../components/Header.jsx";
import SearchBar from "../components/SearchBar.jsx";
import AnnouncementBar from "../components/AnnouncementBar.jsx";
// import products from "../data/products.js";
import { useProducts } from "../utils/productStore.js";

export default function SearchResults() {
  const products = useProducts(); 
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    const searchTerms = query.toLowerCase().split(" ").filter(Boolean);
    
    const filtered = products.filter((product) => {
      const searchableText = [
        product.name,
        product.creator,
        product.caption,
        product.colour,
      ].join(" ").toLowerCase();

      return searchTerms.every((term) => searchableText.includes(term));
    });

    setResults(filtered);
  }, [query,products]);

  return (
    <>
      <AnnouncementBar />
      <Header />
      <div className="search-mobile-only"><SearchBar /></div>
      <main className="home">
        <h1 className="home__title">
          {query ? `Search results for "${query}"` : "Search"}
        </h1>
        {results.length > 0 ? (
          <div className="grid">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="py-5 text-center text-sm text-gray-500">
            {query ? "No products found" : "Enter a search term to find products"}
          </p>
        )}
      </main>
      <BottomNav />
    </>
  );
}