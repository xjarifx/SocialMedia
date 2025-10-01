// Utility functions for consistent date/time formatting

export function formatDateDisplay(
  value: string | Date | undefined | null
): string {
  if (!value) return "Just now";
  const d = value instanceof Date ? value : new Date(value);
  if (isNaN(d.getTime())) return "Just now";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatRelativeTime(
  value: string | Date | undefined | null
): string {
  if (!value) return "just now";
  const d = value instanceof Date ? value : new Date(value);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  if (isNaN(diffMs)) return "just now";
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return "just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d`;
  const diffWeek = Math.floor(diffDay / 7);
  if (diffWeek < 4) return `${diffWeek}w`;
  return formatDateDisplay(d);
}

export function safeParseISO(value: any): string {
  if (!value) return new Date().toISOString();
  const d = new Date(value);
  if (isNaN(d.getTime())) return new Date().toISOString();
  return d.toISOString();
}
