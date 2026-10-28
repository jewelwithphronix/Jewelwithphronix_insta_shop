import { useState } from "react";
import PageShell from "./PageShell.jsx";
import ProductCard from "./ProductCard.jsx";
import { useProducts, useProductsReady } from "../utils/productStore.js";
import SkeletonCards from "./SkeletonCards.jsx";

const SORTS = {
  newest: { label: "Newest first" },
  low: { label: "Price: low to high", fn: (a, b) => a.price - b.price },
  high: { label: "Price: high to low", fn: (a, b) => b.price - a.price },
  off: { label: "Biggest discount", fn: (a, b) => (b.mrp - b.price) / b.mrp - (a.mrp - a.price) / a.mrp },
};

// Shop All, Clearance ani Catalog ya teen pages hach component vaparatat.
// `filter` thrvto kon-te products dakhvaychet.
export default function ProductsPage({ title, subtitle, filter = () => true, emptyText, categories = false }) {
  const all = useProducts();
  const ready = useProductsReady();
  const [sort, setSort] = useState("newest");
  const [cat, setCat] = useState("All");

  const base = all.filter(filter);
  const cats = ["All", ...Array.from(new Set(base.map((p) => p.category).filter(Boolean)))];
  const inCat = base.filter((p) => cat === "All" || p.category === cat);
  const shown = sort === "newest" ? inCat.slice().reverse() : inCat.slice().sort(SORTS[sort].fn);

  return (
    <PageShell search>
      <main className="home">
        <h1 className="home__title font-serif text-2xl font-semibold sm:text-3xl">{title}</h1>
        {subtitle && <p className="page__sub">{subtitle}</p>}

        <div className="toolbar">
          {categories && (
            <div className="chips">
              {cats.map((c) => (
                <button key={c} type="button" className={"chip" + (c === cat ? " chip--on" : "")} onClick={() => setCat(c)}>
                  {c}
                </button>
              ))}
            </div>
          )}
          <label className="toolbar__sort">
            <span>{shown.length} products</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </label>
        </div>

        {!ready && !all.length ? (
          <div className="grid"><SkeletonCards /></div>
        ) : shown.length ? (
          <div className="grid">
            {shown.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <p className="page__empty">{emptyText || "No products found."}</p>
        )}
      </main>
    </PageShell>
  );
}