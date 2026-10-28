// 5899 -> "₹5,899"   (paise shown only when there are any: 5899.5 -> "₹5,899.50")
export function rs(amount) {
  const n = Number(amount) || 0;
  const whole = Number.isInteger(n);
  return (
    "₹" +
    n.toLocaleString("en-IN", { minimumFractionDigits: whole ? 0 : 2, maximumFractionDigits: 2 })
  );
}

// Rough EMI shown in the EMI box (price / 28.5)
export function emiPerMonth(price) {
  return Math.ceil((Number(price) || 0) / 28.5);
}
