/**
 * Formats a date range intelligently using the native Intl API.
 * Automatically handles deduplication of months and years.
 */
export const formatDateRange = (
  startDate: Date,
  endDate: Date,
  options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  },
): string => {
  const formatter = new Intl.DateTimeFormat("en-GB", options);

  return formatter.formatRange(startDate, endDate);
};
