import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { BRAND } from "./config/brand.js";
import { useAuth } from "./utils/auth.js";
import Home from "./pages/Home.jsx";
import ProductListing from "./pages/ProductListing.jsx";
import SearchResults from "./pages/SearchResults.jsx";
import Login from "./pages/Login.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import Cart from "./pages/Cart.jsx";
import Shop from "./pages/Shop.jsx";
import Clearance from "./pages/Clearance.jsx";
import Catalog from "./pages/Catalog.jsx";
import Returns from "./pages/Returns.jsx";
import Contact from "./pages/Contact.jsx";
import Faq from "./pages/Faq.jsx";
import Admin from "./admin/Admin.jsx";

// Sign in nasel tar /login var pathavto (brand.js madhe requireLogin: false kelyas band hoto)
function Protected({ children }) {
  const user = useAuth();
  const location = useLocation();
  if (BRAND.requireLogin && !user) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }
  return children;
}
const P = (el) => <Protected>{el}</Protected>;

export default function App() {
  return (
    <Routes>
      <Route path="/" element={P(<Home />)} />
      <Route path="/product/:id" element={P(<ProductListing />)} />
      <Route path="/search" element={P(<SearchResults />)} />
      <Route path="/shop" element={P(<Shop />)} />
      <Route path="/clearance" element={P(<Clearance />)} />
      <Route path="/catalog" element={P(<Catalog />)} />
      <Route path="/returns" element={P(<Returns />)} />
      <Route path="/contact" element={P(<Contact />)} />
      <Route path="/faq" element={P(<Faq />)} />
      <Route path="/wishlist" element={P(<Wishlist />)} />
      <Route path="/cart" element={P(<Cart />)} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}