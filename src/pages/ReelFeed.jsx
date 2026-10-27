import products from "../data/products.js";
import ReelCard from "../components/ReelCard.jsx";

export default function ReelFeed() {
  return (
    <main className="feed" aria-label="Product reel feed">
      {products.map((product) => (
        <ReelCard key={product.id} product={product} />
      ))}
    </main>
  );
}
