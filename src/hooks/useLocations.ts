import { LOCATIONS, type CityLocation } from '../data/locations';

/**
 * Mock data source for venues.
 *
 * When we wire up the real backend, swap the body of this hook for a Google
 * Places API nearby-search fetch (Google Places API: Nearby Search) and keep
 * the same return shape — the rest of the app only depends on
 * `{ locations, loading }`.
 */
export function useLocations(): { locations: CityLocation[]; loading: boolean } {
  return { locations: LOCATIONS, loading: false };
}
