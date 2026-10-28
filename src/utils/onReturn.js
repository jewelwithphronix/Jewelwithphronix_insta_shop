// Runs fn when the customer comes back to the tab (at most once a minute),
// instead of keeping a live database connection open for every visitor.
export function onReturn(fn, minGapMs = 60_000) {
  if (typeof document === "undefined") return;
  let last = Date.now();
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState !== "visible" || Date.now() - last < minGapMs) return;
    last = Date.now();
    fn();
  });
}
