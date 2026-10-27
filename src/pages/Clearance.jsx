import ProductsPage from "../components/ProductsPage.jsx";

// Fakt admin ne "Stock clearance" tick kelele products dakhavto
export default function Clearance() {
  return (
    <ProductsPage
      title="Stock Clearance Sale"
      subtitle="Last few pieces at special prices."
      filter={(p) => p.clearance}
      emptyText="No clearance products right now. Please check back soon!"
    />
  );
}