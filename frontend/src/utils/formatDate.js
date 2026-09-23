export const formatDate = (date) => {
  if (!date) return "—";
  try {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    });
  } catch { return "—"; }
};
export const formatDateShort = (date) => {
  if (!date) return "—";
  try { return new Date(date).toISOString().slice(0, 10); } catch { return "—"; }
};
