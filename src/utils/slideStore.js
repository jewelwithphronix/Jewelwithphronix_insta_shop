import { useSyncExternalStore } from "react";
import { supabase } from "../lib/supabase.js";

// Home page slider. Admin panel madhun add / edit / delete / reorder kele ki customers la lagech disate.
// Supabase madhe ek pan slide nasel tar khalche default slides dakhavto.
export const DEFAULT_SLIDES = [
  { id: "d1", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&h=600&fit=crop", title: "New Collection", subtitle: "Discover our latest handcrafted pieces" },
  { id: "d2", image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=1200&h=600&fit=crop", title: "Festive Collection", subtitle: "Timeless jewellery for every celebration" },
  { id: "d3", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200&h=600&fit=crop", title: "Bridal Collection", subtitle: "Elegance crafted for your special day" },
  { id: "d4", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1200&h=600&fit=crop", title: "Classic Pieces", subtitle: "Timeless designs that never go out of style" },
];

const CACHE = "slidesCache";

const fromRow = (r) => ({
  id: r.id,
  image: r.image,
  title: r.title || "",
  subtitle: r.subtitle || "",
  sort: Number(r.sort_order) || 0,
});

function initial() {
  if (!supabase) return [];
  try {
    const c = JSON.parse(localStorage.getItem(CACHE) || "null");
    if (Array.isArray(c)) return c;
  } catch { /* ignore */ }
  return [];
}

let list = initial();
const listeners = new Set();
const subscribe = (l) => (listeners.add(l), () => listeners.delete(l));
function setList(next) {
  list = next;
  try { localStorage.setItem(CACHE, JSON.stringify(next)); } catch { /* ignore */ }
  listeners.forEach((l) => l());
}

export async function refreshSlides() {
  if (!supabase) return;
  const { data, error } = await supabase
    .from("slides").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: true });
  if (error) return console.error("Slides load error:", error.message);
  setList(data.map(fromRow));
}

if (supabase && typeof window !== "undefined") {
  refreshSlides();
  supabase
    .channel("slides-live")
    .on("postgres_changes", { event: "*", schema: "public", table: "slides" }, () => refreshSlides())
    .subscribe();
}

export const useSlides = () => useSyncExternalStore(subscribe, () => list);

function need() {
  if (!supabase) throw new Error("Supabase connect nahi. .env file tapasa.");
}
function check(error) {
  if (error) throw new Error(error.message);
}

export async function addSlide({ image, title = "", subtitle = "" }) {
  need();
  const sort_order = list.reduce((m, s) => Math.max(m, s.sort), 0) + 1;
  const row = { id: "s" + Date.now().toString(36), image, title, subtitle, sort_order };
  check((await supabase.from("slides").insert(row)).error);
  await refreshSlides();
}

export async function updateSlide(id, { image, title, subtitle }) {
  need();
  check((await supabase.from("slides").update({ image, title, subtitle }).eq("id", id)).error);
  await refreshSlides();
}

export async function deleteSlide(id) {
  need();
  check((await supabase.from("slides").delete().eq("id", id)).error);
  setList(list.filter((s) => s.id !== id));
}

// dir = -1 (var) kinva +1 (khali)
export async function moveSlide(id, dir) {
  need();
  const i = list.findIndex((s) => s.id === id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= list.length) return;
  const a = list[i], b = list[j];
  check((await supabase.from("slides").update({ sort_order: b.sort }).eq("id", a.id)).error);
  check((await supabase.from("slides").update({ sort_order: a.sort }).eq("id", b.id)).error);
  await refreshSlides();
}