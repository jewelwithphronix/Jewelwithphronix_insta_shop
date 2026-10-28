// Hides the splash screen from index.html once the shop has rendered.
// Stays at least MIN_MS so the logo animation doesn't flash by; only on the first page of a visit.
const MIN_MS = 1300;
const REDUCED_MS = 400;

export function hideSplash() {
  const el = document.getElementById("splash");
  if (!el || el.dataset.hiding) return;
  el.dataset.hiding = "1";
  try { sessionStorage.setItem("splashSeen", "1"); } catch { /* storage blocked */ }
  if (document.documentElement.classList.contains("splash-seen")) return el.remove();

  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const wait = Math.max(0, (reduce ? REDUCED_MS : MIN_MS) - performance.now());
  window.setTimeout(() => {
    el.classList.add("splash--out");
    el.addEventListener("transitionend", () => el.remove(), { once: true });
    window.setTimeout(() => el.remove(), 800); // fallback if no transition ran
  }, wait);
}
