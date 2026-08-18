import { useCallback, useEffect, useRef, useState } from 'react';
import {
  PROXIMITY_RADIUS_METERS,
  haversineMeters,
  type CityLocation,
} from '../data/locations';
import type { UserCoords } from './useUserLocation';

/**
 * Fires an alert once when the user gets within PROXIMITY_RADIUS_METERS of a
 * venue, and re-arms when they move well clear of it (3x the radius), so
 * walking past again alerts again.
 */
export function useProximityAlerts(locations: CityLocation[], coords: UserCoords | null) {
  const [nearby, setNearby] = useState<CityLocation | null>(null);
  const alertedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!coords) return;

    let nearest: CityLocation | null = null;
    let nearestDistance = Infinity;

    for (const location of locations) {
      const distance = haversineMeters(
        coords.latitude,
        coords.longitude,
        location.latitude,
        location.longitude,
      );
      if (distance <= PROXIMITY_RADIUS_METERS && distance < nearestDistance) {
        nearest = location;
        nearestDistance = distance;
      }
      if (distance > PROXIMITY_RADIUS_METERS * 3) {
        alertedRef.current.delete(location.id);
      }
    }

    if (nearest && !alertedRef.current.has(nearest.id)) {
      alertedRef.current.add(nearest.id);
      setNearby(nearest);
    }
  }, [coords, locations]);

  const dismiss = useCallback(() => setNearby(null), []);

  return { nearby, dismiss };
}
