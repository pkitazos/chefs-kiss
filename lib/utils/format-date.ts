const formatter = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatDate(date: Date): string {
  return formatter.format(new Date(date));
}
