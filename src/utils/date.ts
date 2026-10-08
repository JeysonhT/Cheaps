/**
 * Formatea una cadena de fecha ISO (YYYY-MM-DD) a un formato legible en español (ej. "15 Ene, 2026").
 */
export const formatDate = (isoString: string): string => {
  if (!isoString) return "";
  try {
    const parts = isoString.split("-");
    if (parts.length === 3) {
      const year = parts[0];
      const months = [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
      ];
      const monthIndex = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      if (monthIndex >= 0 && monthIndex < 12) {
        return `${day} ${months[monthIndex]}, ${year}`;
      }
    }
    return isoString;
  } catch (e) {
    return isoString;
  }
};
