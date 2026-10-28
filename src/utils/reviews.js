import { useSyncExternalStore, useEffect } from "react";
import { supabase } from "../lib/supabase.js";

// Reviews Supabase chya "reviews" table madhe save hotat, mhanun sarva customers la distat.
// Supabase connect nasel tar junya sarkhe fakt ya browser madhe (localStorage) save hotat.
// { p1: [{ id, name, rating, title, text, date, userEmail }], p2: [...] }
const KEY = "productReviews";

function loadLocal() {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "{}");
    return v && typeof v === "object" ? v : {};
  } catch {
    return {};
  }
}

let state = supabase ? {} : loadLocal();
const fetched = new Set();
const listeners = new Set();

function commit(next) {
  state = next;
  if (!supabase) {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* storage blocked: keep working in memory */
    }
  }
  listeners.forEach((l) => l());
}

function subscribe(l) {
  listeners.add(l);
  return () => listeners.delete(l);
}

const fromRow = (r) => ({
  id: r.id,
  name: r.name,
  rating: r.rating,
  title: r.title || "",
  text: r.body,
  date: r.created_at,
  userEmail: r.user_email,
});

async function fetchReviews(productId) {
  const { data, error } = await supabase
    .from("reviews").select("*").eq("product_id", productId).order("created_at", { ascending: false });
  if (error) return console.error("Reviews load error:", error.message);
  commit({ ...state, [productId]: data.map(fromRow) });
}

// live updates fakt product page ughadla asel tevha (ek connection, page sodla ki band)
function watchReviews(productId) {
  const ch = supabase
    .channel("reviews-" + productId)
    .on("postgres_changes", { event: "*", schema: "public", table: "reviews", filter: `product_id=eq.${productId}` }, () => fetchReviews(productId))
    .subscribe();
  return () => supabase.removeChannel(ch);
}

if (!supabase && typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) commit(loadLocal());
  });
}

export async function addReview(productId, review) {
  if (!supabase) {
    const entry = { id: Date.now().toString(36), date: new Date().toISOString(), ...review };
    commit({ ...state, [productId]: [entry, ...(state[productId] || [])] });
    return;
  }
  const { error } = await supabase.from("reviews").insert({
    product_id: productId,
    name: review.name,
    rating: review.rating,
    title: review.title,
    body: review.text,
    user_email: review.userEmail,
  });
  if (error) throw new Error(error.message);
  await fetchReviews(productId);
}

export async function deleteReview(productId, reviewId) {
  if (supabase) {
    const { error } = await supabase.from("reviews").delete().eq("id", reviewId);
    if (error) throw new Error(error.message);
  }
  commit({ ...state, [productId]: (state[productId] || []).filter((r) => r.id !== reviewId) });
}

export function useReviews(productId) {
  const s = useSyncExternalStore(subscribe, () => state);
  useEffect(() => {
    if (!supabase) return;
    if (!fetched.has(productId)) {
      fetched.add(productId);
      fetchReviews(productId);
    }
    return watchReviews(productId);
  }, [productId]);
  const list = s[productId] || [];
  const avg = list.length ? list.reduce((n, r) => n + r.rating, 0) / list.length : 0;
  return { list, count: list.length, avg };
}
