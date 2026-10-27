import { StoreIcon, TruckIcon, ReturnIcon } from "./Icons.jsx";

const items = [
  { icon: <StoreIcon />, title: "Store Pickup", sub: "Available" },
  { icon: <TruckIcon />, title: "Priority Shipping", sub: "Available" },
  { icon: <ReturnIcon />, title: "24 Hours", sub: "Easy Return" },
];

export default function TrustStrip() {
  return (
    <div className="trust">
      {items.map((it) => (
        <div key={it.title} className="trust__item">
          <span className="trust__icon">{it.icon}</span>
          <p className="trust__title">{it.title}</p>
          <p className="trust__sub">{it.sub}</p>
        </div>
      ))}
    </div>
  );
}