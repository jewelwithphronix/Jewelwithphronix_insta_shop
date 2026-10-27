import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import products from "../data/products.js";
import { useProducts } from "../utils/productStore.js";
import { SearchIcon, CameraIcon } from "./Icons.jsx";

// Words shown in the typing animation. Edit / add your own.
const PLACEHOLDER_WORDS = ["Kundan Necklace", "Heart Charm Bracelet", "Pearl Bracelet", "Jhumka Earrings"];
const PLACEHOLDER_PREFIX = "Search for ";
const TYPE_SPEED = 80; // ms per letter while typing
const DELETE_SPEED = 40; // ms per letter while deleting
const HOLD_FULL = 1600; // ms to keep the full text visible
const HOLD_EMPTY = 350; // ms pause before typing the next word

// Typewriter effect: types a word, holds it, deletes it, moves to the next.
function useTypewriter(words, active) {
  const [text, setText] = useState("");

  useEffect(() => {
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    // no animation for users who prefer reduced motion
    if (reduceMotion) {
      setText(words[0]);
      return;
    }
    if (!active) return;

    let wordIdx = 0;
    let charIdx = 0;
    let deleting = false;
    let timer;

    function tick() {
      const word = words[wordIdx];

      if (!deleting) {
        charIdx += 1;
        setText(word.slice(0, charIdx));
        if (charIdx === word.length) {
          deleting = true;
          timer = setTimeout(tick, HOLD_FULL);
          return;
        }
        timer = setTimeout(tick, TYPE_SPEED);
      } else {
        charIdx -= 1;
        setText(word.slice(0, charIdx));
        if (charIdx === 0) {
          deleting = false;
          wordIdx = (wordIdx + 1) % words.length;
          timer = setTimeout(tick, HOLD_EMPTY);
          return;
        }
        timer = setTimeout(tick, DELETE_SPEED);
      }
    }

    timer = setTimeout(tick, 400);
    return () => clearTimeout(timer);
  }, [words, active]);

  return text;
}

export default function SearchBar({ className = "mx-7 mb-5 max-w-3xl md:mx-auto" }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const typedWord = useTypewriter(PLACEHOLDER_WORDS, query === "");
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

  function handlePhotoSearch() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      // For now, just log the file - image recognition can be added later
      console.log("Photo search file selected:", file.name);
      alert("Photo search functionality coming soon!");
    }
  }

  return (
    <div className={"relative " + className} ref={searchRef}>
      <div className="flex h-[54px] items-center gap-2.5 rounded-full border border-gray-200 bg-white px-4 shadow-sm">
        <span className="flex-shrink-0 text-gray-800" aria-hidden="true"><SearchIcon size={22} /></span>
        
        <input
          type="text"
          className="flex-1 min-w-0 h-full px-3 text-base text-gray-700 outline-none bg-transparent placeholder:text-gray-500"
          placeholder={PLACEHOLDER_PREFIX + typedWord}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setShowDropdown(true)}
        />
        
        {query && (
          <button
            type="button"
            className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
            onClick={handleClear}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
        
        <button
          type="button"
          className="flex h-[42px] flex-shrink-0 items-center gap-2 rounded-full bg-[#fbe3df] px-3 sm:px-4 text-[13px] font-medium text-[#8e2646] whitespace-nowrap hover:bg-[#f8d3cd] transition-colors"
          onClick={handlePhotoSearch}
          aria-label="Photo search"
        >
          <CameraIcon size={16} />
          <span>Photo Search</span>
        </button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {showDropdown && query && (
        <div className="absolute top-[calc(100%+8px)] left-0 right-0 z-20 max-h-[320px] overflow-y-auto rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
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
                  <div
                    className="h-12 w-12 flex-shrink-0 rounded-lg border border-gray-200"
                    style={
                      cover
                        ? { backgroundImage: `url(${cover})`, backgroundSize: "cover", backgroundPosition: "center" }
                        : { background: product.color }
                    }
                  />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="truncate text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.creator}</p>
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