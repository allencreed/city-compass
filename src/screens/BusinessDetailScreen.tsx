import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LottieView from 'lottie-react-native';
import { useEffect, useRef, useState } from 'react';
import QRCode from 'react-native-qrcode-svg';
import {
  Animated,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCheckIns } from '../context/CheckInsContext';
import { useLocation } from '../context/LocationContext';
import ScannerModal from '../components/ScannerModal';
import {
  CATEGORY_META,
  PROXIMITY_RADIUS_METERS,
  haversineMeters,
  LOCATIONS,
  pseudoRating,
} from '../data/locations';
import type { RootStackParamList } from '../navigation/types';
import { colors, fonts, radii, shadowCard, spacing } from '../theme';
import { venueQrPayload } from '../utils/qr';

export default function BusinessDetailScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'BusinessDetail'>>();
  const route = useRoute<RouteProp<RootStackParamList, 'BusinessDetail'>>();
  const { coords } = useLocation();
  const { checkIn, hasCheckedIn } = useCheckIns();

  const location = LOCATIONS.find((l) => l.id === route.params.locationId);
  const [claimed, setClaimed] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);

  const stampScale = useRef(new Animated.Value(1.6)).current;
  const stampOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (location && hasCheckedIn(location.id)) setClaimed(true);
  }, [location, hasCheckedIn]);

  if (!location) {
    return (
      <View style={styles.missing}>
        <Text style={styles.missingText}>Venue not found.</Text>
        <Pressable style={styles.missingButton} onPress={() => navigation.goBack()}>
          <Text style={styles.missingButtonText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const category = CATEGORY_META[location.category];
  const distance = coords
    ? haversineMeters(coords.latitude, coords.longitude, location.latitude, location.longitude)
    : null;
  const isWithinRadius = distance !== null && distance <= PROXIMITY_RADIUS_METERS;
  const canClaim = !claimed && isWithinRadius;

  /** Stamp a venue (GPS claim or QR scan) and play the stamp-in animation. */
  const applyStamp = (venueId: string) => {
    if (hasCheckedIn(venueId)) return;
    checkIn(venueId);
    if (venueId === location.id) {
      setClaimed(true);
      Animated.parallel([
        Animated.timing(stampOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.spring(stampScale, { toValue: 1, friction: 6, useNativeDriver: true }),
      ]).start();
    }
  };

  const handleClaim = () => {
    if (!canClaim) return;
    applyStamp(location.id);
  };

  /** A valid City Compass venue code was scanned — stamp that venue. */
  const handleQrStamped = (venueId: string) => {
    applyStamp(venueId);
  };

  const handleShare = () => {
    Share.share({
      message: `${location.name} — ${location.reward}. Find it in City Compass!`,
    }).catch(() => {});
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <Text style={styles.topBarTitle}>City Hub</Text>
        <Pressable onPress={handleShare} hitSlop={10} style={styles.shareButton}>
          <Text style={styles.shareText}>↗</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroGlow} />
          <Text style={styles.heroEmoji}>{category.emoji}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{category.label.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.bodyCard}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{location.name}</Text>
            <View style={styles.rating}>
              <Text style={styles.ratingStar}>★</Text>
              <Text style={styles.ratingText}>{pseudoRating(location.id)}</Text>
            </View>
          </View>
          <Text style={styles.description}>{location.description}</Text>
          <View style={styles.addressRow}>
            <Text style={styles.addressIcon}>📍</Text>
            <Text style={styles.address}>{location.address}</Text>
          </View>

          <View style={styles.divider} />

          {/* Passport discounts */}
          <Text style={styles.sectionTitle}>🎟️ Exclusive Passport Discounts</Text>
          <View style={styles.discountRow}>
            <View style={styles.discountIconWrap}>
              <Text style={styles.discountIcon}>{category.emoji}</Text>
            </View>
            <View style={styles.discountTextBlock}>
              <Text style={styles.discountName}>Member offer</Text>
              <Text style={styles.discountDesc}>{location.reward}</Text>
            </View>
            <View style={styles.discountBadge}>
              <Text style={styles.discountBadgeText}>-{location.rewardPoints} pts</Text>
            </View>
          </View>
          <View style={styles.discountRow}>
            <View style={styles.discountIconWrap}>
              <Text style={styles.discountIcon}>⭐</Text>
            </View>
            <View style={styles.discountTextBlock}>
              <Text style={styles.discountName}>Extra points</Text>
              <Text style={styles.discountDesc}>Bonus on your first stamped visit</Text>
            </View>
            <View style={styles.discountBadge}>
              <Text style={styles.discountBadgeText}>+{Math.round(location.rewardPoints / 2)} pts</Text>
            </View>
          </View>

          {/* Stamp claim */}
          <View style={styles.stampSection}>
            <View style={styles.stampDotPattern} pointerEvents="none" />
            <Text style={styles.stampTitle}>
              {claimed ? 'Passport stamped!' : 'Ready to claim your reward?'}
            </Text>
            <Text style={styles.stampHint}>
              Show this screen at the register to apply discounts and earn your digital stamp.
            </Text>

            {claimed && (
              <Animated.View
                style={[
                  styles.stampOverlay,
                  { opacity: stampOpacity, transform: [{ scale: stampScale }] },
                ]}
                pointerEvents="none"
              >
                <View style={styles.stampCircle}>
                  <Text style={styles.stampCircleIcon}>✓</Text>
                  <Text style={styles.stampCircleText}>
                    Visited{'\n'}2026
                  </Text>
                </View>
              </Animated.View>
            )}

            <Pressable
              style={[styles.claimButton, !canClaim && styles.claimButtonDisabled]}
              disabled={!canClaim}
              onPress={handleClaim}
            >
              <Text
                style={[styles.claimButtonText, !canClaim && styles.claimButtonTextDisabled]}
              >
                {claimed ? 'Stamp Claimed ✓' : 'Claim Discount & Stamp'}
              </Text>
            </Pressable>

            {!claimed && distance !== null && !isWithinRadius && (
              <Text style={styles.proximityHint}>
                You're {Math.round(distance)} m away — get within {PROXIMITY_RADIUS_METERS} m to
                claim.
              </Text>
            )}
            {!claimed && coords === null && (
              <Text style={styles.proximityHint}>Enable location to claim your stamp.</Text>
            )}

            {claimed && (
              <View style={styles.claimedRow}>
                <LottieView
                  source={require('../../assets/lottie/gatin.json')}
                  style={styles.claimedAnimation}
                  autoPlay
                  loop={false}
                />
                <Text style={styles.claimedText}>
                  Passport stamped · +{location.rewardPoints} pts
                </Text>
              </View>
            )}

            {/* QR check-in — the register shows a code, you scan it to stamp */}
            <Pressable style={styles.scanButton} onPress={() => setScannerOpen(true)}>
              <Text style={styles.scanButtonIcon}>📷</Text>
              <Text style={styles.scanButtonText}>Scan register QR to stamp</Text>
            </Pressable>
          </View>

          {/* Venue QR — what the register displays; scan it with a second phone to test */}
          <View style={styles.venueQrCard}>
            <View style={styles.venueQrBadge}>
              <Text style={styles.venueQrBadgeText}>REGISTER DISPLAY</Text>
            </View>
            <Text style={styles.venueQrTitle}>Venue QR code</Text>
            <Text style={styles.venueQrHint}>
              This is the code {location.name} shows at the register. You can&apos;t scan your
              own phone screen — point a second phone&apos;s scanner at it, or the cashier
              scans it for you.
            </Text>
            <View style={styles.venueQrBox}>
              <QRCode value={venueQrPayload(location.id)} size={150} />
            </View>
            <Text style={styles.venueQrCodeText}>{venueQrPayload(location.id)}</Text>
          </View>
        </View>
      </ScrollView>

      {scannerOpen && (
        <ScannerModal onClose={() => setScannerOpen(false)} onStamped={handleQrStamped} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    height: 56,
    backgroundColor: colors.surface,
    shadowColor: '#031632',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  backButton: {
    width: 36,
    alignItems: 'flex-start',
  },
  backText: {
    fontSize: 22,
    color: colors.primary,
  },
  topBarTitle: {
    fontFamily: fonts.headlineBold,
    fontSize: 18,
    color: colors.primary,
  },
  shareButton: {
    width: 36,
    alignItems: 'flex-end',
  },
  shareText: {
    fontSize: 20,
    color: colors.primary,
  },
  content: {
    paddingBottom: spacing.xl * 2,
  },
  hero: {
    height: 190,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  heroGlow: {
    position: 'absolute',
    bottom: -60,
    left: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.accent,
    opacity: 0.16,
  },
  heroEmoji: {
    fontSize: 64,
  },
  categoryBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: colors.surface,
    borderRadius: radii.full,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  categoryBadgeText: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: colors.primary,
    letterSpacing: 0.8,
  },
  bodyCard: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    marginTop: -22,
    padding: spacing.container,
    paddingBottom: spacing.xl,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  title: {
    flex: 1,
    fontFamily: fonts.headline,
    fontSize: 24,
    color: colors.primary,
    marginRight: spacing.sm,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: colors.surfaceContainer,
    borderRadius: radii.full,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ratingStar: {
    color: colors.accent,
    fontSize: 13,
  },
  ratingText: {
    fontFamily: fonts.label,
    fontSize: 12,
    color: colors.onSurface,
  },
  description: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.onSurfaceVariant,
    lineHeight: 21,
    marginBottom: spacing.sm,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addressIcon: {
    fontSize: 14,
  },
  address: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.onSurfaceVariant,
  },
  divider: {
    height: 1,
    backgroundColor: colors.outlineVariant,
    marginVertical: spacing.lg,
  },
  sectionTitle: {
    fontFamily: fonts.headlineBold,
    fontSize: 16,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  discountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radii.sm,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadowCard,
  },
  discountIconWrap: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  discountIcon: {
    fontSize: 18,
  },
  discountTextBlock: {
    flex: 1,
    marginRight: spacing.sm,
  },
  discountName: {
    fontFamily: fonts.label,
    fontSize: 12,
    color: colors.onSurface,
  },
  discountDesc: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.onSurfaceVariant,
    marginTop: 1,
  },
  discountBadge: {
    backgroundColor: colors.accentContainer,
    borderRadius: radii.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  discountBadgeText: {
    fontFamily: fonts.label,
    fontSize: 11,
    color: colors.onAccentContainer,
  },
  stampSection: {
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radii.lg,
    padding: spacing.lg,
    alignItems: 'center',
    overflow: 'hidden',
  },
  stampDotPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.04,
    backgroundColor: colors.primary,
  },
  stampTitle: {
    fontFamily: fonts.headlineBold,
    fontSize: 18,
    color: colors.onSurface,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  stampHint: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: spacing.lg,
  },
  stampOverlay: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 5,
  },
  stampCircle: {
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 4,
    borderColor: colors.accent,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-6deg' }],
  },
  stampCircleIcon: {
    color: colors.accentDark,
    fontSize: 26,
    fontFamily: fonts.headline,
    marginBottom: 2,
  },
  stampCircleText: {
    fontFamily: fonts.label,
    fontSize: 11,
    color: colors.accentDark,
    textTransform: 'uppercase',
    letterSpacing: 1,
    textAlign: 'center',
  },
  claimButton: {
    width: '100%',
    backgroundColor: colors.accentDark,
    borderRadius: radii.sm,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#AB3500',
    shadowOpacity: 0.39,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  claimButtonDisabled: {
    backgroundColor: colors.surfaceVariant,
    shadowOpacity: 0,
    elevation: 0,
  },
  claimButtonText: {
    fontFamily: fonts.label,
    fontSize: 13,
    color: colors.onPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  claimButtonTextDisabled: {
    color: colors.onSurfaceVariant,
  },
  proximityHint: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  claimedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  claimedAnimation: {
    width: 40,
    height: 40,
    marginRight: 6,
  },
  claimedText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.accentDark,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    marginTop: spacing.md,
    backgroundColor: colors.surfaceContainer,
    borderRadius: radii.sm,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  scanButtonIcon: {
    fontSize: 16,
  },
  scanButtonText: {
    fontFamily: fonts.label,
    fontSize: 13,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  venueQrCard: {
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radii.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  venueQrBadge: {
    alignSelf: 'center',
    backgroundColor: colors.accentContainer,
    borderRadius: radii.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: spacing.sm,
  },
  venueQrBadgeText: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: colors.onAccentContainer,
    letterSpacing: 0.8,
  },
  venueQrTitle: {
    fontFamily: fonts.headlineBold,
    fontSize: 16,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  venueQrHint: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  venueQrBox: {
    backgroundColor: colors.surface,
    padding: spacing.sm,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  venueQrCodeText: {
    fontFamily: fonts.body,
    fontSize: 10,
    color: colors.onSurfaceVariant,
    marginTop: spacing.sm,
    opacity: 0.6,
  },
  missing: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  missingText: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.md,
  },
  missingButton: {
    backgroundColor: colors.primaryDark,
    borderRadius: radii.sm,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  missingButtonText: {
    fontFamily: fonts.label,
    fontSize: 13,
    color: colors.onPrimary,
  },
});
