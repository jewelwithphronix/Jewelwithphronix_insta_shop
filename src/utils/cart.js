import { useSyncExternalStore } from "react";
// import products from "../data/products.js";
import { useProducts } from "./productStore.js";
// Shared cart store, saved in localStorage so it survives a refresh.
const KEY = "cartItems"; // [{ id, qty }]
const MAX_QTY = 9;

function load() {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

let items = load();
const listeners = new Set();

function commit(next) {
  items = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* storage blocked: keep working in memory */
  }
  listeners.forEach((l) => l());
}

function subscribe(l) {
  listeners.add(l);
  return () => listeners.delete(l);
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) {
      items = load();
      listeners.forEach((l) => l());
    }
  });
}

export function addToCart(product, qty = 1) {
  const found = items.find((i) => i.id === product.id);
  if (found) {
    commit(items.map((i) => (i.id === product.id ? { ...i, qty: Math.min(MAX_QTY, i.qty + qty) } : i)));
  } else {
    commit([...items, { id: product.id, qty: Math.min(MAX_QTY, qty) }]);
  }
}

export function setQty(id, qty) {
  if (qty < 1) return removeFromCart(id);
  commit(items.map((i) => (i.id === id ? { ...i, qty: Math.min(MAX_QTY, qty) } : i)));
}

export const removeFromCart = (id) => commit(items.filter((i) => i.id !== id));
export const clearCart = () => commit([]);

// React hook: cart lines (with product details), item count and subtotal
export function useCart() {
  const raw = useSyncExternalStore(subscribe, () => items);
  const products = useProducts();
  const lines = raw
    .map((i) => ({ ...i, product: products.find((p) => p.id === i.id) }))
    .filter((l) => l.product);
  return {
    lines,
    count: lines.reduce((n, l) => n + l.qty, 0),
    subtotal: lines.reduce((sum, l) => sum + l.product.price * l.qty, 0),
  };
}