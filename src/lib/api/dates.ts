/**
 * Zuri Date Parsing & Formatting Utility
 *
 * Handles the backend's custom non-ISO date format ("YYYY/MM/DD HH:MM:SS UTC" or "YYYY/MM/DD")
 * as well as standard ISO 8601 timestamps, Unix epoch numbers, and Date objects.
 */

/**
 * Parses a Zuri backend date representation into a JavaScript Date object.
 *
 * Supported formats:
 * 1. Custom Zuri UTC timestamp: "2026/10/12 12:15:00 UTC" or "2026/10/12 12:15:00"
 * 2. Custom Zuri date only: "2026/10/12"
 * 3. ISO 8601 strings: "2026-10-10T17:20:00.000Z" or "2026-10-10"
 * 4. Unix epoch timestamps (seconds or milliseconds)
 * 5. Existing Date objects
 *
 * Returns `null` if the input is null, undefined, empty, or unparseable.
 */
export function parseZuriDate(value: string | number | Date | null | undefined): Date | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === 'number') {
    if (isNaN(value)) return null;
    // Unix timestamp in seconds (standard for X-RateLimit-Reset and JWT claims) vs milliseconds
    const ms = value < 1e11 ? value * 1000 : value;
    const date = new Date(ms);
    return isNaN(date.getTime()) ? null : date;
  }

  const str = value.trim();

  // Pattern 1: "YYYY/MM/DD HH:MM:SS UTC" or "YYYY/MM/DD HH:MM:SS"
  const slashDateTimeMatch = str.match(
    /^(\d{4})\/(\d{1,2})\/(\d{1,2})\s+(\d{1,2}):(\d{1,2}):(\d{1,2})(?:\s*UTC)?$/i
  );
  if (slashDateTimeMatch) {
    const [, year, month, day, hour, minute, second] = slashDateTimeMatch;
    const date = new Date(
      Date.UTC(
        parseInt(year, 10),
        parseInt(month, 10) - 1,
        parseInt(day, 10),
        parseInt(hour, 10),
        parseInt(minute, 10),
        parseInt(second, 10)
      )
    );
    return isNaN(date.getTime()) ? null : date;
  }

  // Pattern 2: "YYYY/MM/DD"
  const slashDateMatch = str.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/);
  if (slashDateMatch) {
    const [, year, month, day] = slashDateMatch;
    const date = new Date(
      Date.UTC(
        parseInt(year, 10),
        parseInt(month, 10) - 1,
        parseInt(day, 10),
        0,
        0,
        0
      )
    );
    return isNaN(date.getTime()) ? null : date;
  }

  // Fallback: standard ISO 8601 or RFC 2822
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    return parsed;
  }

  return null;
}

/**
 * Formats a Date object into the Zuri backend custom UTC string format ("YYYY/MM/DD HH:MM:SS UTC").
 */
export function formatZuriDate(date: Date | null | undefined): string {
  if (!date || isNaN(date.getTime())) {
    return '';
  }
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds} UTC`;
}
