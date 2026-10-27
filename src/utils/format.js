// 5899 -> "Rs. 5,899.00"
export function rs(amount) {
  const n = Number(amount) || 0;
  return (
    "Rs. " +
    n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  );
}

// Rough EMI shown in the EMI box (price / 28.5)
export function emiPerMonth(price) {
  return Math.ceil((Number(price) || 0) / 28.5);
}