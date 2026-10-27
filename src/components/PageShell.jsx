import AnnouncementBar from "./AnnouncementBar.jsx";
import Header from "./Header.jsx";
import SearchBar from "./SearchBar.jsx";
import BottomNav from "./BottomNav.jsx";
import Footer, { Newsletter } from "./Footer.jsx";
import FloatingWidgets from "./FloatingWidgets.jsx";

// Pratyek navin page chi common frame: announcement bar, header, footer, bottom nav
export default function PageShell({ children, search = false }) {
  return (
    <>
      <AnnouncementBar />
      <Header />
      {search && <div className="search-mobile-only"><SearchBar /></div>}
      {children}
      <Newsletter />
      <Footer />
      <FloatingWidgets />
      <BottomNav />
    </>
  );
}