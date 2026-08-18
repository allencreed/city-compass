import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapPin from '../components/MapPin';
import ProximityBanner from '../components/ProximityBanner';
import { useCheckIns } from '../context/CheckInsContext';
import {
  CATEGORY_META,
  CITY_CENTER,
  haversineMeters,
  pseudoRating,
  type CityLocation,
} from '../data/locations';
import { useLocations } from '../hooks/useLocations';
import { useProximityAlerts } from '../hooks/useProximityAlerts';
import { useUserLocation } from '../hooks/useUserLocation';
import type { MainTabParamList, RootStackParamList } from '../navigation/types';
import { colors, fonts, radii, shadowElevated, spacing } from '../theme';

type MapNav = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Explore'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export default function MapScreen() {
  const navigation = useNavigation<MapNav>();
  const route = useRoute<RouteProp<MainTabParamList, 'Explore'>>();
  const { locations, loading } = useLocations();
  const { coords, permission, requestPermission, error } = useUserLocation();
  const { hasCheckedIn } = useCheckIns();
  const { nearby, dismiss } = useProximityAlerts(locations, coords);

  const [selected, setSelected] = useState<CityLocation | null>(null);
  const mapRef = useRef<MapView>(null);

  const centerOnUser = useCallback(() => {
    if (!coords) return;
    mapRef.current?.animateToRegion(
      {
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      500,
    );
  }, [coords]);

  // "View on map" from the Passport screen: select that venue's card.
  useEffect(() => {
    const id = route.params?.openLocationId;
    if (!id) return;
    navigation.setParams({ openLocationId: undefined });
    const location = locations.find((l) => l.id === id);
    if (location) setSelected(location);
  }, [route.params?.openLocationId, locations, navigation]);

  const openDetail = useCallback(
    (location: CityLocation) => {
      setSelected(null);
      navigation.navigate('BusinessDetail', { locationId: location.id });
    },
    [navigation],
  );

  const handleBannerView = useCallback(
    (location: CityLocation) => {
      dismiss();
      openDetail(location);
    },
    [dismiss, openDetail],
  );

  const distance = selected && coords
    ? haversineMeters(coords.latitude, coords.longitude, selected.latitude, selected.longitude)
    : null;

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={{ ...CITY_CENTER, latitudeDelta: 0.06, longitudeDelta: 0.06 }}
        showsUserLocation={permission === 'granted'}
        showsCompass
      >
        {locations.map((location) => (
          <Marker
            key={`${location.id}-${hasCheckedIn(location.id)}`}
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            anchor={{ x: 0.5, y: 1 }}
            tracksViewChanges={false}
            onPress={() => setSelected(location)}
          >
            <MapPin
              category={location.category}
              checked={hasCheckedIn(location.id)}
              onPress={() => setSelected(location)}
            />
          </Marker>
        ))}
      </MapView>

      {/* Top app bar */}
      <SafeAreaView style={styles.headerSafe} edges={['top']} pointerEvents="box-none">
        <View style={styles.header}>
          <View style={styles.headerSide}>
            <Text style={styles.headerIcon}>🗺️</Text>
          </View>
          <Text style={styles.headerTitle}>Explore Map</Text>
          <View style={[styles.headerSide, styles.headerSideRight]}>
            <Text style={styles.headerIcon}>🔔</Text>
          </View>
        </View>
      </SafeAreaView>

      {/* Bonus zone (decorative, mirrors the mockup) */}
      <View style={styles.bonusZone} pointerEvents="none">
        <View style={styles.bonusZoneLabel}>
          <Text style={styles.bonusZoneLabelText}>2x Points Zone</Text>
        </View>
      </View>

      {/* FABs */}
      <View style={styles.fabColumn}>
        <Pressable
          style={styles.fab}
          onPress={centerOnUser}
          disabled={permission !== 'granted' || !coords}
        >
          <Text style={styles.fabIcon}>📍</Text>
        </Pressable>
        <Pressable style={styles.fab}>
          <Text style={styles.fabIcon}>🗺️</Text>
        </Pressable>
      </View>

      {/* Permission states */}
      {permission === 'denied' && (
        <SafeAreaView style={styles.overlayTop} pointerEvents="box-none">
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Location access needed</Text>
            <Text style={styles.cardBody}>
              Allow location to see nearby venues and get 5 m check-in alerts.
            </Text>
            <Pressable style={styles.cardButton} onPress={() => Linking.openSettings()}>
              <Text style={styles.cardButtonText}>Open Settings</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      )}

      {permission === 'undetermined' && (
        <SafeAreaView style={styles.overlayTop} pointerEvents="box-none">
          <Pressable style={styles.card} onPress={requestPermission}>
            <Text style={styles.cardTitle}>Enable location</Text>
            <Text style={styles.cardBody}>Tap to allow City Compass to know where you are.</Text>
          </Pressable>
        </SafeAreaView>
      )}

      {permission === 'granted' && !coords && !error && (
        <SafeAreaView style={styles.overlayTop} pointerEvents="box-none">
          <View style={styles.card}>
            <ActivityIndicator color={colors.accent} />
            <Text style={styles.cardBody}>Finding your location…</Text>
          </View>
        </SafeAreaView>
      )}

      {error && (
        <SafeAreaView style={styles.overlayTop} pointerEvents="box-none">
          <View style={styles.card}>
            <Text style={styles.cardBody}>{error}</Text>
          </View>
        </SafeAreaView>
      )}

      {nearby && (
        <SafeAreaView style={styles.overlayTop} pointerEvents="box-none">
          <ProximityBanner location={nearby} onView={handleBannerView} onDismiss={dismiss} />
        </SafeAreaView>
      )}

      {/* Selected venue card */}
      {selected && (
        <View style={styles.bottomCardWrap}>
          <View style={styles.bottomCard}>
            <Pressable
              style={styles.cardClose}
              onPress={() => setSelected(null)}
              hitSlop={8}
            >
              <Text style={styles.cardCloseText}>✕</Text>
            </Pressable>
            <View style={styles.cardThumb}>
              <Text style={styles.cardThumbEmoji}>{CATEGORY_META[selected.category].emoji}</Text>
            </View>
            <View style={styles.cardInfo}>
              <View style={styles.cardTitleRow}>
                <Text style={styles.venueCardTitle} numberOfLines={1}>
                  {selected.name}
                </Text>
                <View style={styles.ratingPill}>
                  <Text style={styles.ratingStar}>★</Text>
                  <Text style={styles.ratingText}>{pseudoRating(selected.id)}</Text>
                </View>
                {hasCheckedIn(selected.id) && (
                  <View style={styles.stampedTag}>
                    <Text style={styles.stampedTagText}>✓ Stamped</Text>
                  </View>
                )}
              </View>
              <Text style={styles.cardMeta}>
                {CATEGORY_META[selected.category].label}
                {distance !== null ? ` · ${Math.round(distance)} m away` : ''}
              </Text>
              <Pressable style={styles.cardCta} onPress={() => openDetail(selected)}>
                <Text style={styles.cardCtaText}>Visit & Claim Stamp</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerSafe: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    shadowColor: '#031632',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  headerSide: {
    width: 36,
  },
  headerSideRight: {
    alignItems: 'flex-end',
  },
  headerIcon: {
    fontSize: 18,
  },
  headerTitle: {
    fontFamily: fonts.headlineBold,
    fontSize: 17,
    color: colors.primary,
  },
  fabColumn: {
    position: 'absolute',
    right: 14,
    top: 76,
    gap: spacing.sm,
  },
  fab: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadowElevated,
  },
  fabIcon: {
    fontSize: 17,
  },
  bonusZone: {
    position: 'absolute',
    top: '34%',
    right: '8%',
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.accent,
    backgroundColor: 'rgba(254, 106, 52, 0.08)',
  },
  bonusZoneLabel: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
    backgroundColor: colors.accentContainer,
    borderRadius: radii.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  bonusZoneLabelText: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: colors.onAccentContainer,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  overlayTop: {
    position: 'absolute',
    top: 56,
    left: 0,
    right: 0,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    ...shadowElevated,
  },
  cardTitle: {
    fontFamily: fonts.headlineBold,
    fontSize: 15,
    color: colors.onSurface,
  },
  cardBody: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.onSurfaceVariant,
    marginTop: spacing.xs,
  },
  cardButton: {
    backgroundColor: colors.primaryDark,
    borderRadius: radii.sm,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  cardButtonText: {
    fontFamily: fonts.label,
    fontSize: 13,
    color: colors.onPrimary,
  },
  bottomCardWrap: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.md,
  },
  bottomCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    ...shadowElevated,
  },
  cardClose: {
    position: 'absolute',
    top: 8,
    right: 10,
    zIndex: 2,
  },
  cardCloseText: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
  },
  cardThumb: {
    width: 60,
    height: 60,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  cardThumbEmoji: {
    fontSize: 28,
  },
  cardInfo: {
    flex: 1,
    minWidth: 0,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  venueCardTitle: {
    flexShrink: 1,
    fontFamily: fonts.headlineBold,
    fontSize: 15,
    color: colors.onSurface,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: colors.surfaceContainer,
    borderRadius: radii.full,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  ratingStar: {
    color: colors.accent,
    fontSize: 10,
  },
  ratingText: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: colors.onSurface,
  },
  stampedTag: {
    backgroundColor: colors.surfaceContainer,
    borderRadius: radii.full,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  stampedTagText: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: colors.primary,
  },
  cardMeta: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  cardCta: {
    backgroundColor: colors.accentContainer,
    borderRadius: radii.sm,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  cardCtaText: {
    fontFamily: fonts.label,
    fontSize: 12,
    color: colors.onAccentContainer,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
});
