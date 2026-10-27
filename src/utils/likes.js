import { useSyncExternalStore } from "react";

// One shared "likes / wishlist" store. Same localStorage keys as before, so old likes keep working.
const LIKED_KEY = "likedProducts";
const COUNT_KEY = "productLikeCounts";

function load() {
  try {
    return {
      liked: JSON.parse(localStorage.getItem(LIKED_KEY) || "{}"),
      counts: JSON.parse(localStorage.getItem(COUNT_KEY) || "{}"),
    };
  } catch {
    return { liked: {}, counts: {} };
  }
}

let state = load();
const listeners = new Set();

function commit(next) {
  state = next;
  try {
    localStorage.setItem(LIKED_KEY, JSON.stringify(state.liked));
    localStorage.setItem(COUNT_KEY, JSON.stringify(state.counts));
  } catch {
    /* storage full / blocked: keep working in memory */
  }
  listeners.forEach((l) => l());
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// keep other browser tabs in sync
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === LIKED_KEY || e.key === COUNT_KEY) {
      state = load();
      listeners.forEach((l) => l());
    }
  });
}

function setLike(product, value) {
  const wasLiked = !!state.liked[product.id];
  if (wasLiked === value) return;
  const base = state.counts[product.id] ?? product.likes ?? 0;
  commit({
    liked: { ...state.liked, [product.id]: value },
    counts: { ...state.counts, [product.id]: Math.max(0, base + (value ? 1 : -1)) },
  });
}

export const likeProduct = (product) => setLike(product, true);
export const unlikeProduct = (product) => setLike(product, false);
export const toggleLike = (product) => setLike(product, !state.liked[product.id]);

// React hook: re-renders whenever any product is liked / unliked
export function useLikes() {
  const s = useSyncExternalStore(subscribe, () => state);
  const likedIds = Object.keys(s.liked).filter((id) => s.liked[id]);
  return {
    isLiked: (id) => !!s.liked[id],
    likeCount: (product) => s.counts[product.id] ?? product.likes ?? 0,
    likedIds,
    total: likedIds.length,
  };
}