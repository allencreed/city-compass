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

const STORAGE_KEY = 'city-compass/session/v1';

export interface UserProfile {
  name: string;
  email: string;
}

interface SessionContextValue {
  /** True once persisted state has been read (drives the splash). */
  loaded: boolean;
  /** User profile, null until registration completes. */
  profile: UserProfile | null;
  /** True once the user has unlocked their city passport. */
  onboarded: boolean;
  /** Mock login — accepts any email, no backend yet. */
  login: (email: string) => void;
  /** Clears the session back to the login screen. */
  logout: () => void;
  completeRegistration: (profile: UserProfile) => void;
  completeOnboarding: () => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

interface PersistedSession {
  profile: UserProfile | null;
  onboarded: boolean;
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [loaded, setLoaded] = useState(false);
  const [session, setSession] = useState<PersistedSession>({ profile: null, onboarded: false });

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setSession(JSON.parse(raw) as PersistedSession);
      } catch {
        // Corrupt or absent storage — start fresh.
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(session)).catch(() => {});
  }, [session, loaded]);

  const login = useCallback((email: string) => {
    const raw = email.split('@')[0] || '';
    const pretty = raw
      .replace(/[._-]+/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .trim();
    setSession({ profile: { name: pretty || 'Explorer', email }, onboarded: true });
  }, []);

  const logout = useCallback(() => {
    setSession({ profile: null, onboarded: false });
  }, []);

  const completeRegistration = useCallback((profile: UserProfile) => {
    setSession((prev) => ({ ...prev, profile }));
  }, []);

  const completeOnboarding = useCallback(() => {
    setSession((prev) => ({ ...prev, onboarded: true }));
  }, []);

  const value = useMemo(
    () => ({
      loaded,
      profile: session.profile,
      onboarded: session.onboarded,
      login,
      logout,
      completeRegistration,
      completeOnboarding,
    }),
    [loaded, session, login, logout, completeRegistration, completeOnboarding],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used inside <SessionProvider>');
  return ctx;
}
