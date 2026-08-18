import * as Location from 'expo-location';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type LocationPermissionState = 'undetermined' | 'granted' | 'denied';

export interface UserCoords {
  latitude: number;
  longitude: number;
  accuracy: number | null;
}

interface LocationContextValue {
  coords: UserCoords | null;
  permission: LocationPermissionState;
  error: string | null;
  requestPermission: () => Promise<boolean>;
}

const LocationContext = createContext<LocationContextValue | null>(null);

/**
 * Single app-wide location source. One watcher is started here instead of per
 * screen so pushed screens (business detail, etc.) share the same position
 * stream and we never spawn duplicate GPS listeners.
 */
export function LocationProvider({ children }: { children: ReactNode }) {
  const [coords, setCoords] = useState<UserCoords | null>(null);
  const [permission, setPermission] = useState<LocationPermissionState>('undetermined');
  const [error, setError] = useState<string | null>(null);

  const requestPermission = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setPermission(status === 'granted' ? 'granted' : 'denied');
    return status === 'granted';
  }, []);

  useEffect(() => {
    let watcher: Location.LocationSubscription | null = null;
    let active = true;

    (async () => {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (!active) return;
      if (status !== 'granted') {
        setPermission(status === 'denied' ? 'denied' : 'undetermined');
        return;
      }
      setPermission('granted');
      try {
        const last = await Location.getLastKnownPositionAsync();
        if (last && active) {
          setCoords({
            latitude: last.coords.latitude,
            longitude: last.coords.longitude,
            accuracy: last.coords.accuracy ?? null,
          });
        }
        watcher = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 1000,
            distanceInterval: 1,
          },
          (loc) => {
            if (!active) return;
            setCoords({
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
              accuracy: loc.coords.accuracy ?? null,
            });
          },
        );
      } catch (e) {
        if (active) {
          setError(e instanceof Error ? e.message : 'Failed to read your location.');
        }
      }
    })();

    return () => {
      active = false;
      watcher?.remove();
    };
  }, []);

  const value = useMemo(
    () => ({ coords, permission, error, requestPermission }),
    [coords, permission, error, requestPermission],
  );

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useLocation(): LocationContextValue {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocation must be used inside <LocationProvider>');
  return ctx;
}
