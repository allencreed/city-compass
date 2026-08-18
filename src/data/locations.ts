export type LocationCategory = 'cafe' | 'restaurant' | 'bar' | 'retail' | 'attraction';

export interface CityLocation {
  id: string;
  name: string;
  category: LocationCategory;
  address: string;
  description: string;
  latitude: number;
  longitude: number;
  reward: string;
  rewardPoints: number;
}

/** How close (in meters) a user must be to a venue to be alerted and to check in. */
export const PROXIMITY_RADIUS_METERS = 5;

/** Center of the mock city (San Francisco). City switching arrives in v2. */
export const CITY_CENTER = {
  latitude: 37.7793,
  longitude: -122.4193,
};

export const CATEGORY_META: Record<LocationCategory, { label: string; emoji: string }> = {
  cafe: { label: 'Cafe', emoji: '☕' },
  restaurant: { label: 'Restaurant', emoji: '🍽️' },
  bar: { label: 'Bar', emoji: '🍻' },
  retail: { label: 'Shop', emoji: '🛍️' },
  attraction: { label: 'Attraction', emoji: '🏛️' },
};

/**
 * Mock venues for the pilot city. Coordinates are approximate.
 * Later this dataset gets replaced by Google Places API results.
 */
export const LOCATIONS: CityLocation[] = [
  {
    id: 'sf-001',
    name: 'Blue Bottle Coffee',
    category: 'cafe',
    address: '66 Mint St, San Francisco',
    description: 'Third-wave coffee in a sunny Mint Plaza courtyard.',
    latitude: 37.7827,
    longitude: -122.4077,
    reward: '$2 off any drink',
    rewardPoints: 50,
  },
  {
    id: 'sf-002',
    name: 'Tartine Bakery',
    category: 'cafe',
    address: '600 Guerrero St, San Francisco',
    description: 'Legendary morning bun and open-faced sandwiches.',
    latitude: 37.7612,
    longitude: -122.424,
    reward: 'Free pastry with any coffee',
    rewardPoints: 40,
  },
  {
    id: 'sf-003',
    name: 'Sightglass Coffee',
    category: 'cafe',
    address: '270 7th St, San Francisco',
    description: 'Coffee roastery with an industrial loft space.',
    latitude: 37.777,
    longitude: -122.408,
    reward: 'Double reward points today',
    rewardPoints: 30,
  },
  {
    id: 'sf-004',
    name: 'Boba Guys',
    category: 'cafe',
    address: '429 Stockton St, San Francisco',
    description: 'Premium tea and milk teas near Union Square.',
    latitude: 37.7901,
    longitude: -122.4072,
    reward: 'Free topping upgrade',
    rewardPoints: 25,
  },
  {
    id: 'sf-005',
    name: 'La Taqueria',
    category: 'restaurant',
    address: '2889 Mission St, San Francisco',
    description: 'Mission burritos, widely considered the best in the city.',
    latitude: 37.751,
    longitude: -122.4185,
    reward: '10% off any burrito',
    rewardPoints: 60,
  },
  {
    id: 'sf-006',
    name: 'Burma Superstar',
    category: 'restaurant',
    address: '309 Clement St, San Francisco',
    description: 'Garlic noodles and tea leaf salad in the Inner Richmond.',
    latitude: 37.7829,
    longitude: -122.463,
    reward: 'Free appetizer with entree',
    rewardPoints: 55,
  },
  {
    id: 'sf-007',
    name: 'State Bird Provisions',
    category: 'restaurant',
    address: '1529 Fillmore St, San Francisco',
    description: 'Michelin-starred small plates, reservations needed.',
    latitude: 37.7834,
    longitude: -122.4331,
    reward: '$5 off tasting menu',
    rewardPoints: 80,
  },
  {
    id: 'sf-008',
    name: 'Zeitgeist',
    category: 'bar',
    address: '199 Valencia St, San Francisco',
    description: 'Beer garden with bikes out front.',
    latitude: 37.7692,
    longitude: -122.4218,
    reward: 'BOGO happy hour drink',
    rewardPoints: 45,
  },
  {
    id: 'sf-009',
    name: 'The Emporium',
    category: 'bar',
    address: '616 Divisadero St, San Francisco',
    description: 'Arcade bar with vintage games.',
    latitude: 37.7755,
    longitude: -122.4375,
    reward: 'Free game credit',
    rewardPoints: 35,
  },
  {
    id: 'sf-010',
    name: 'The Buena Vista',
    category: 'bar',
    address: '2765 Hyde St, San Francisco',
    description: 'Home of the Irish coffee, by the cable car turnaround.',
    latitude: 37.8059,
    longitude: -122.4199,
    reward: 'Irish coffee on the house',
    rewardPoints: 70,
  },
  {
    id: 'sf-011',
    name: 'City Lights Books',
    category: 'retail',
    address: '261 Columbus Ave, San Francisco',
    description: 'Beat-era independent bookstore in North Beach.',
    latitude: 37.7974,
    longitude: -122.4066,
    reward: '$5 off $25 purchase',
    rewardPoints: 50,
  },
  {
    id: 'sf-012',
    name: 'Amoeba Music',
    category: 'retail',
    address: '1855 Haight St, San Francisco',
    description: 'Independent record store in the Haight.',
    latitude: 37.7694,
    longitude: -122.4596,
    reward: '10% off vinyl',
    rewardPoints: 40,
  },
  {
    id: 'sf-013',
    name: 'Ferry Building Marketplace',
    category: 'attraction',
    address: '1 Ferry Building, San Francisco',
    description: 'Food hall and farmers market on the Embarcadero.',
    latitude: 37.7955,
    longitude: -122.3937,
    reward: 'Free coffee tasting',
    rewardPoints: 30,
  },
  {
    id: 'sf-014',
    name: 'Salesforce Park',
    category: 'attraction',
    address: '425 Mission St, San Francisco',
    description: 'Elevated rooftop park with gardens.',
    latitude: 37.7897,
    longitude: -122.3942,
    reward: '2x points on next check-in',
    rewardPoints: 20,
  },
  {
    id: 'sf-015',
    name: 'Alamo Square',
    category: 'attraction',
    address: 'Hayes St & Steiner St, San Francisco',
    description: 'Postcard views of the Painted Ladies.',
    latitude: 37.7764,
    longitude: -122.4346,
    reward: '3x points on next check-in',
    rewardPoints: 20,
  },
];

/** Deterministic pseudo-rating (4.1–4.8) so mock venues feel real. */
export function pseudoRating(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) % 1000;
  return (4.1 + (hash % 8) / 10).toFixed(1);
}

/** Great-circle distance between two coordinates, in meters. */
export function haversineMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000; // Earth radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}
