import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { BRAND } from "./config/brand.js";
import { useAuth } from "./utils/auth.js";
import { supabase } from "./lib/supabase.js";
import Home from "./pages/Home.jsx";
import ProductListing from "./pages/ProductListing.jsx";
import SearchResults from "./pages/SearchResults.jsx";
import Login from "./pages/Login.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import Cart from "./pages/Cart.jsx";
import Shop from "./pages/Shop.jsx";
import Catalog from "./pages/Catalog.jsx";
import Returns from "./pages/Returns.jsx";
import Contact from "./pages/Contact.jsx";
import Faq from "./pages/Faq.jsx";
import Admin from "./admin/Admin.jsx";

// Browsing is open to everyone. Only checkout (/cart) needs sign in.
// Not signed in -> /login, then back here after signing in (set requireLogin: false in brand.js to turn off).
function Protected({ children }) {
  const user = useAuth();
  const location = useLocation();
  // Supabase nasel tar Google sign-in shakya nahi, mhanun tevha login maagu naka
  if (BRAND.requireLogin && supabase && !user) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }
  return children;
}
const P = (el) => <Protected>{el}</Protected>;
const Open = (el) => el; // public pages

export default function App() {
  return (
    <>
    {/* first thing keyboard users reach on every page */}
    <a href="#main" className="skip-link">Skip to content</a>
    <Routes>
      <Route path="/" element={Open(<Home />)} />
      <Route path="/product/:id" element={Open(<ProductListing />)} />
      <Route path="/search" element={Open(<SearchResults />)} />
      <Route path="/shop" element={Open(<Shop />)} />
      <Route path="/catalog" element={Open(<Catalog />)} />
      <Route path="/returns" element={Open(<Returns />)} />
      <Route path="/contact" element={Open(<Contact />)} />
      <Route path="/faq" element={Open(<Faq />)} />
      <Route path="/wishlist" element={Open(<Wishlist />)} />
      <Route path="/cart" element={P(<Cart />)} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
    </>
  );
}