/**
 * Validation utilities for the Portfolio Builder MVP.
 * All functions are pure — no side effects, no DOM access.
 */

/**
 * Returns true if the string is a valid http or https URL.
 * Returns false for empty/whitespace strings or non-http(s) protocols.
 */
export function isValidUrl(value: string): boolean {
  if (!value || !value.trim()) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Returns true if the string matches a basic email pattern.
 */
export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/**
 * Returns true if the MIME type is one of the accepted image types:
 * image/jpeg, image/png, image/gif, image/webp, image/svg+xml
 */
export function isImageMimeType(mimeType: string): boolean {
  const accepted = new Set([
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
  ]);
  return accepted.has(mimeType);
}

/**
 * Returns true if the file size in bytes is within the 5 MB limit.
 */
export function isImageSizeOk(bytes: number): boolean {
  return bytes <= 5 * 1024 * 1024;
}
