export function formatPriceCFA(value: number, type: "SALE" | "RENT") {
  const formatted = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    maximumFractionDigits: 0,
  }).format(value);
  return type === "RENT" ? `${formatted} / mois` : formatted;
}
