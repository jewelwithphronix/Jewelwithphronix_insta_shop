import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../utils/productStore.js";
import { SearchIcon } from "./Icons.jsx";
import { rs } from "../utils/format.js";
import { imgProps } from "../utils/img.js";

export default function SearchBar({ className = "mx-7 mb-5 max-w-3xl md:mx-auto" }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const products = useProducts();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search logic
  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      setShowDropdown(false);
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
    setShowDropdown(true);
  }, [query,products]);

  function handleInputChange(e) {
    setQuery(e.target.value);
  }

  function handleClear() {
    setQuery("");
    setResults([]);
    setShowDropdown(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setShowDropdown(false);
    }
  }

  function handleResultClick(productId) {
    navigate(`/product/${productId}`);
    setShowDropdown(false);
    setQuery("");
  }


  return (
    <div className={"relative " + className} ref={searchRef} role="search">
      <div className="flex h-[50px] items-center gap-2 rounded-full border border-gray-300 bg-white px-4">
        <span className="flex-shrink-0 text-gray-800" aria-hidden="true"><SearchIcon size={22} /></span>
        
        <input
          className="search-input flex-1 min-w-0 h-full px-2 text-base text-gray-900 bg-transparent placeholder:text-gray-600"
          type="search"
          placeholder="Search jewellery"
          aria-label="Search jewellery"
          aria-expanded={showDropdown && !!query}
          aria-controls="search-results"
          autoComplete="off"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setShowDropdown(true)}
        />
        
        {query && (
          <button
            type="button"
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100"
            onClick={handleClear}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
        
      </div>

      {showDropdown && query && (
        <div id="search-results" aria-live="polite" className="absolute top-[calc(100%+8px)] left-0 right-0 z-20 max-h-[320px] overflow-y-auto rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
          {results.length > 0 ? (
            results.map((product) => {
              const cover = product.images?.[0];
              return (
                <button
                  key={product.id}
                  type="button"
                  className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-gray-50"
                  onClick={() => handleResultClick(product.id)}
                >
                  {cover ? (
                    <img {...imgProps(cover, "48px")} alt="" className="h-12 w-12 flex-shrink-0 rounded-lg border border-gray-200 object-cover" />
                  ) : (
                    <span className="h-12 w-12 flex-shrink-0 rounded-lg" style={{ background: product.color }} aria-hidden="true" />
                  )}
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="truncate text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-700">{rs(product.price)}</p>
                  </div>
                </button>
              );
            })
          ) : (
            <p className="py-5 text-center text-sm text-gray-500">No products found</p>
          )}
        </div>
      )}
    </div>
  );
}