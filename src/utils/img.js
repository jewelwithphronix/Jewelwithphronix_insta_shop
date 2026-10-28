// Product photos in /public/products are 2–3 MB PNGs, and the products in Supabase point at them.
// Smaller JPEG copies sit next to them (name-560.jpg, name-1000.jpg); this swaps them in
// and lets the browser pick the right size. Any other URL (e.g. admin uploads) is used as is.
const LOCAL = /^\/products\/(.+)\.png$/;

export function imgProps(src, sizes = "(min-width: 1024px) 25vw, 50vw") {
  const m = src && src.match(LOCAL);
  if (!m) return { src };
  const base = `/products/${m[1]}`;
  return {
    src: `${base}-560.jpg`,
    srcSet: `${base}-560.jpg 560w, ${base}-1000.jpg 1000w`,
    sizes,
  };
}
