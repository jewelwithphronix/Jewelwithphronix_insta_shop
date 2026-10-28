import { lazy, Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { BRAND } from "./config/brand.js";
import { useAuth } from "./utils/auth.js";
import { supabase } from "./lib/supabase.js";
import Home from "./pages/Home.jsx";
import ProductListing from "./pages/ProductListing.jsx";

// Home + product page load straight away; every other page downloads only when opened
// (shoppers no longer download the admin panel).
const SearchResults = lazy(() => import("./pages/SearchResults.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Wishlist = lazy(() => import("./pages/Wishlist.jsx"));
const Cart = lazy(() => import("./pages/Cart.jsx"));
const Shop = lazy(() => import("./pages/Shop.jsx"));
const Catalog = lazy(() => import("./pages/Catalog.jsx"));
const Returns = lazy(() => import("./pages/Returns.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));
const Faq = lazy(() => import("./pages/Faq.jsx"));
const Admin = lazy(() => import("./admin/Admin.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));

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
    <Suspense fallback={<div className="page-loading" role="status" aria-label="Loading" />}>
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
      <Route path="*" element={<NotFound />} />
    </Routes>
    </Suspense>
    </>
  );
}