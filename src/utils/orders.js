import { supabase } from "../lib/supabase.js";
import { BRAND } from "../config/brand.js";

// Orders: pratyek order aadhi ya browser madhe save hoto, mag Supabase la pathavto.
// Supabase fail jhala tar order "pending" rahato ani pudhchya veli parat pathavto — order haravat nahi.
const KEY = "myOrders";

function load() {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}
function save(list) {
  try { localStorage.setItem(KEY, JSON.stringify(list.slice(-50))); } catch { /* storage blocked */ }
}

// cart totals: subtotal, bulk offer discount, shipping, total
export function priceCart(subtotal) {
  const offer = BRAND.bulkOffer;
  const discount = offer && subtotal >= offer.above ? Math.round((subtotal * offer.percent) / 100) : 0;
  const freeShipping = subtotal >= BRAND.freeShippingAbove;
  const shipping = freeShipping ? 0 : BRAND.shippingFee; // null = not known yet
  const total = subtotal - discount + (shipping || 0);
  return { subtotal, discount, freeShipping, shipping, total };
}

async function upload(row) {
  if (!supabase) return false;
  const { error } = await supabase.from("orders").insert(row);
  // 23505 = same id already saved (an earlier retry got through)
  if (error && error.code !== "23505") {
    console.error("Order save failed:", error.message);
    return false;
  }
  return true;
}

// Keeps the order locally right away, then saves it to Supabase in the background.
export function recordOrder(row) {
  save([...load(), { row, synced: false }]);
  upload(row).then((ok) => ok && markSynced(row.id));
}

function markSynced(id) {
  save(load().map((o) => (o.row.id === id ? { ...o, synced: true } : o)));
}

// Retry any orders that did not reach Supabase earlier.
export function retryPendingOrders() {
  for (const o of load()) {
    if (!o.synced) upload(o.row).then((ok) => ok && markSynced(o.row.id));
  }
}
