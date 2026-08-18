import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

const STORAGE_KEY = 'city-compass/check-ins/v1';

interface CheckInsContextValue {
  /** locationId -> ISO timestamp of check-in */
  checkIns: Record<string, string>;
  checkIn: (locationId: string) => void;
  hasCheckedIn: (locationId: string) => boolean;
}

const CheckInsContext = createContext<CheckInsContextValue | null>(null);

export function CheckInsProvider({ children }: { children: ReactNode }) {
  const [checkIns, setCheckIns] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);

  // Load persisted check-ins once on launch.
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setCheckIns(JSON.parse(raw) as Record<string, string>);
      } catch {
        // Corrupt or absent storage — start fresh.
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  // Persist every change, but only after the initial load has finished so we
  // never clobber stored data with the empty initial state.
  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(checkIns)).catch(() => {});
  }, [checkIns, loaded]);

  const checkIn = useCallback((locationId: string) => {
    setCheckIns((prev) => {
      if (prev[locationId]) return prev; // already checked in
      return { ...prev, [locationId]: new Date().toISOString() };
    });
  }, []);

  const hasCheckedIn = useCallback(
    (locationId: string) => Boolean(checkIns[locationId]),
    [checkIns],
  );

  const value = useMemo(
    () => ({ checkIns, checkIn, hasCheckedIn }),
    [checkIns, checkIn, hasCheckedIn],
  );

  return <CheckInsContext.Provider value={value}>{children}</CheckInsContext.Provider>;
}

export function useCheckIns(): CheckInsContextValue {
  const ctx = useContext(CheckInsContext);
  if (!ctx) throw new Error('useCheckIns must be used inside <CheckInsProvider>');
  return ctx;
}
