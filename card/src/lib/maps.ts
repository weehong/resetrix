export function isIos(userAgent: string): boolean {
  if (/iP(hone|od|ad)/.test(userAgent)) return true;
  // iPadOS 13+ reports as Macintosh with touch support
  return (
    /Macintosh/.test(userAgent) &&
    typeof navigator !== "undefined" &&
    navigator.maxTouchPoints > 1
  );
}

export function buildMapsUrl(addressQuery: string, userAgent: string): string {
  const q = encodeURIComponent(addressQuery);
  if (isIos(userAgent)) {
    return `https://maps.apple.com/?q=${q}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}
