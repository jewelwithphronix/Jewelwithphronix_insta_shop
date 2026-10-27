import { useSyncExternalStore } from "react";
const KEY = "deliveryAddress";
const EMPTY = { name: "", phone: "", line: "", city: "", state: "", pincode: "", mapLink: "" };

function load() {
  try {
    return { ...EMPTY, ...JSON.parse(localStorage.getItem(KEY) || "{}") };
  } catch {
    return { ...EMPTY };
  }
}
let addr = load();
const listeners = new Set();
const subscribe = (l) => (listeners.add(l), () => listeners.delete(l));

export function saveAddress(next) {
  addr = { ...addr, ...next };
  try { localStorage.setItem(KEY, JSON.stringify(addr)); } catch {}
  listeners.forEach((l) => l());
}
export const useAddress = () => useSyncExternalStore(subscribe, () => addr);

export const addressComplete = (a) =>
  a.name.trim() && /^\d{10}$/.test(a.phone.replace(/\D/g, "").slice(-10)) &&
  a.line.trim() && a.city.trim() && /^\d{6}$/.test(a.pincode.trim());

export function detectLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error("Location supported nahi."));
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude, longitude } = coords;
        const mapLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
        try {
          const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
          const d = await r.json();
          const a = d.address || {};
          resolve({
            line: [a.house_number, a.road, a.suburb || a.neighbourhood].filter(Boolean).join(", "),
            city: a.city || a.town || a.village || a.county || "",
            state: a.state || "",
            pincode: a.postcode || "",
            mapLink,
          });
        } catch {
          resolve({ mapLink });
        }
      },
      () => reject(new Error("Location milali nahi. Allow kara kinva address type kara.")),
      { enableHighAccuracy: true, timeout: 12000 }
    );
  });
}