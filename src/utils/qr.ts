import { LOCATIONS } from '../data/locations';

/**
 * Venue QR codes encode a stable, namespaced payload so we can distinguish
 * City Compass codes from any other QR in the wild.
 */
const QR_PREFIX = 'CITYCOMPASS:STAMP:';

/** Build the QR payload for a venue (what the register displays). */
export function venueQrPayload(locationId: string): string {
  return `${QR_PREFIX}${locationId}`;
}

/**
 * Validate a scanned QR payload. Returns the venue id if it's a City Compass
 * venue code, otherwise null.
 */
export function parseVenueQr(data: string): string | null {
  const trimmed = data.trim();
  if (!trimmed.startsWith(QR_PREFIX)) return null;
  const id = trimmed.slice(QR_PREFIX.length);
  return LOCATIONS.some((l) => l.id === id) ? id : null;
}
