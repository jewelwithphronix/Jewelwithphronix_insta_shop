import { useSyncExternalStore } from "react";
import { supabase } from "../lib/supabase.js";
import baseProducts from "../data/products.js";

// Products aata Supabase database madhun yetat. Admin ne badalle ki sarva customers la disate.
// Supabase connect nasel tar data/products.js vaparto (junya sarkhe).
const CACHE = "productsCache";

const normalize = (p) => ({ category: "Bracelets", clearance: false, inStock: true, ...p });

const fromRow = (r) => ({
  id: r.id,
  name: r.name,
  productCode: r.product_code || "",
  category: r.category || "Bracelets",
  price: Number(r.price),
  mrp: Number(r.mrp),
  colour: r.colour || "",
  creator: r.creator || "",
  caption: r.caption || "",
  color: r.color || "#E8A377",
  images: r.images || [],
  likes: r.likes || 0,
  clearance: !!r.clearance,
  inStock: r.in_stock !== false,
});

const COLS = {
  name: "name", productCode: "product_code", category: "category", price: "price", mrp: "mrp",
  colour: "colour", creator: "creator", caption: "caption", color: "color", images: "images",
  likes: "likes", clearance: "clearance", inStock: "in_stock",
};
function toRow(fields) {
  const row = {};
  for (const [k, v] of Object.entries(fields)) if (COLS[k]) row[COLS[k]] = v;
  return row;
}

function initial() {
  if (!supabase) return baseProducts.map(normalize);
  try {
    const c = JSON.parse(localStorage.getItem(CACHE) || "null");
    if (Array.isArray(c)) return c;
  } catch { /* ignore */ }
  return baseProducts.map(normalize);
}

let list = initial();
const listeners = new Set();
const subscribe = (l) => (listeners.add(l), () => listeners.delete(l));
function setList(next) {
  list = next;
  try { localStorage.setItem(CACHE, JSON.stringify(next)); } catch { /* ignore */ }
  listeners.forEach((l) => l());
}

export async function refreshProducts() {
  if (!supabase) return;
  const { data, error } = await supabase
    .from("products").select("*").order("created_at", { ascending: true }).order("id", { ascending: true });
  if (error) return console.error("Products load error:", error.message);
  setList(data.map(fromRow));
}

if (supabase && typeof window !== "undefined") {
  refreshProducts();
  // admin ne kahi badalle ki customer chya screen var lagech update
  supabase
    .channel("products-live")
    .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => refreshProducts())
    .subscribe();
}

export const getProducts = () => list;
export const useProducts = () => useSyncExternalStore(subscribe, () => list);
export const backendConnected = !!supabase;

function need() {
  if (!supabase) throw new Error("Supabase connect nahi. .env file tapasa.");
}
function check(error) {
  if (error) throw new Error(error.message);
}

export async function updateProduct(id, fields) {
  need();
  check((await supabase.from("products").update(toRow(fields)).eq("id", id)).error);
  setList(list.map((p) => (p.id === id ? { ...p, ...fields } : p)));
}

export async function addProduct(fields) {
  need();
  const id = "c" + Date.now().toString(36);
  const row = { id, ...toRow({ likes: 0, images: [], ...fields }) };
  check((await supabase.from("products").insert(row)).error);
  await refreshProducts();
  return id;
}

export async function deleteProduct(id) {
  need();
  check((await supabase.from("products").delete().eq("id", id)).error);
  setList(list.filter((p) => p.id !== id));
}

// ---- helpers ----
export const discountPercent = (p) =>
  p.mrp > p.price && p.mrp > 0 ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;
export const priceFromDiscount = (mrp, pct) =>
  Math.max(0, Math.round(Number(mrp) * (1 - Math.min(100, Math.max(0, Number(pct))) / 100)));