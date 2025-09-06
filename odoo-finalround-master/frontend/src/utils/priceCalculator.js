export function formatCurrency(amount) {
  return `₹${Number(amount || 0).toFixed(2)}`;
}


