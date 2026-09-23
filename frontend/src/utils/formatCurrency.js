/**
 * Formats a numeric amount as currency.
 * Defaults to PKR; safe with null/undefined.
 */
export const formatCurrency = (amount, currency = "PKR") => {
  const n = Number(amount);
  if (Number.isNaN(n)) return currency + " 0";
  return currency + " " + n.toLocaleString("en-US");
};