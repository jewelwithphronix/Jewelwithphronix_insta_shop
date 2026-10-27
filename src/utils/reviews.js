import { useSyncExternalStore } from "react";

// Reviews are saved in this browser (localStorage), grouped by product id.
// { p1: [{ id, name, rating, title, text, date }], p2: [...] }
const KEY = "productReviews";

function load() {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "{}");
    return v && typeof v === "object" ? v : {};
  } catch {
    return {};
  }
}

let state = load();
const listeners = new Set();

function commit(next) {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
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
      state = load();
      listeners.forEach((l) => l());
    }
  });
}

export function addReview(productId, review) {
  const entry = { id: Date.now().toString(36), date: new Date().toISOString(), ...review };
  commit({ ...state, [productId]: [entry, ...(state[productId] || [])] });
}

export function deleteReview(productId, reviewId) {
  commit({ ...state, [productId]: (state[productId] || []).filter((r) => r.id !== reviewId) });
}

export function useReviews(productId) {
  const s = useSyncExternalStore(subscribe, () => state);
  const list = s[productId] || [];
  const avg = list.length ? list.reduce((n, r) => n + r.rating, 0) / list.length : 0;
  return { list, count: list.length, avg };
}