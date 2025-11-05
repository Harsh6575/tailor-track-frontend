/**
 * Formats a date into a human-readable string like "05 Nov 2025".
 *
 * @param date - Date or string representation of a date
 * @returns Formatted date string in "dd MMM yyyy" format
 */
export function formatDate(date: string | Date): string {
  if (!date) return "-";

  try {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "-";
  }
}
