/**
 * Formats a Unix-epoch timestamp into a short, human-readable time string
 * (e.g. "9:15 AM").
 */
export const formatTime = (timestamp: number): string =>
  new Date(timestamp).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
