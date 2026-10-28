import { rs } from "../utils/format.js";

// Sale price first, original price struck through; screen readers hear both clearly.
export default function Price({ product, className = "" }) {
  const onSale = product.mrp > product.price;
  return (
    <p className={"price " + className}>
      <span className="price__now">
        <span className="sr-only">{onSale ? "Sale price " : "Price "}</span>
        {rs(product.price)}
      </span>
      {onSale && (
        <s className="price__was">
          <span className="sr-only">Original price </span>
          {rs(product.mrp)}
        </s>
      )}
    </p>
  );
}
