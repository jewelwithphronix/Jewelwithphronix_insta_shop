import { NavLink } from "react-router-dom";
import { useLikes } from "../utils/likes.js";
import { useCart } from "../utils/cart.js";
import { HomeIcon, HeartIcon, SearchIcon, BagIcon, UserIcon } from "./Icons.jsx";


function TabInner({ tab }) {
  return (
    <>
      <span className="bnav__icon">
        {tab.icon}
        {tab.badge !== undefined && <span className="bnav__badge">{tab.badge}</span>}
      </span>
      {tab.label}
    </>
  );
}

export default function BottomNav() {
  const { total } = useLikes();
  const { count } = useCart();
  const tabs = [
    { label: "Home", icon: <HomeIcon size={28} />, to: "/" },
    { label: "Wishlist", icon: <HeartIcon size={28} />, badge: total, to: "/wishlist" },
    { label: "Search", icon: <SearchIcon size={28} />, to: "/search" },
    { label: "Cart", icon: <BagIcon size={28} />, badge: count, to: "/cart" },
    { label: "Account", icon: <UserIcon size={28} />, to: "/login" },
  ];

  return (
    <nav className="bnav" aria-label="Quick links">
      {tabs.map((tab) =>
        tab.to ? (
          <NavLink
            key={tab.label}
            to={tab.to}
            end
            className={({ isActive }) => "bnav__tab" + (isActive ? " bnav__tab--active" : "")}
          >
            <TabInner tab={tab} />
          </NavLink>
        ) : (
          <button key={tab.label} type="button" className="bnav__tab">
            <TabInner tab={tab} />
          </button>
        )
      )}
    </nav>
  );
}