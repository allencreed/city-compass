import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSession } from '../context/SessionContext';
import { colors, fonts, radii, shadowCard, spacing } from '../theme';

const CITIES = [
  { name: 'London', emoji: '🎡' },
  { name: 'Tokyo', emoji: '🗼' },
  { name: 'Paris', emoji: '🗿' },
  { name: 'Los Angeles', emoji: '🌴' },
];

export default function CityOnboardingScreen() {
  const { completeOnboarding } = useSession();
  const [note, setNote] = useState<string | null>(null);

  const handleUnlock = () => {
    completeOnboarding();
    // Session change remounts the navigator onto Main automatically.
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>📍</Text>
        <Text style={styles.title}>Welcome to San Francisco</Text>
        <Text style={styles.subtitle}>We've detected your location. Ready to explore?</Text>
      </View>

      <Pressable style={styles.detectedCard} onPress={handleUnlock}>
        <View style={styles.hero}>
          <View style={styles.heroGlow} />
          <Text style={styles.heroEmoji}>🌉</Text>
          <View style={styles.heroMeta}>
            <Text style={styles.heroLabel}>Current Location</Text>
            <Text style={styles.heroCity}>San Francisco</Text>
          </View>
          <View style={styles.verifiedStamp}>
            <Text style={styles.verifiedText}>✓</Text>
          </View>
        </View>
        <View style={styles.heroFooter}>
          <Text style={styles.heroFooterText}>Unlock your first passport book!</Text>
          <View style={styles.unlockButton}>
            <Text style={styles.unlockButtonText}>Unlock Passport</Text>
          </View>
        </View>
      </Pressable>

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerLabel}>Or Change City</Text>
        <View style={styles.dividerLine} />
      </View>

      {note && (
        <View style={styles.note}>
          <Text style={styles.noteText}>{note}</Text>
        </View>
      )}

      <View style={styles.grid}>
        {CITIES.map((city) => (
          <Pressable
            key={city.name}
            style={styles.cityCard}
            onPress={() => setNote(`${city.name} joins in v2 — San Francisco is the pilot city.`)}
          >
            <View style={styles.cityEmojiWrap}>
              <Text style={styles.cityEmoji}>{city.emoji}</Text>
            </View>
            <View style={styles.cityNameRow}>
              <Text style={styles.cityName}>{city.name}</Text>
              <View style={styles.soonBadge}>
                <Text style={styles.soonText}>Soon</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.container,
    paddingBottom: spacing.xl * 2,
  },
  header: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  headerIcon: {
    fontSize: 36,
    marginBottom: spacing.sm,
  },
  title: {
    fontFamily: fonts.headline,
    fontSize: 26,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
  detectedCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    overflow: 'hidden',
    ...shadowCard,
  },
  hero: {
    height: 170,
    backgroundColor: colors.primary,
    justifyContent: 'flex-end',
    padding: spacing.md,
    overflow: 'hidden',
  },
  heroGlow: {
    position: 'absolute',
    top: -40,
    right: -30,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.accent,
    opacity: 0.18,
  },
  heroEmoji: {
    position: 'absolute',
    top: 18,
    right: 18,
    fontSize: 44,
  },
  heroMeta: {
    zIndex: 1,
  },
  heroLabel: {
    fontFamily: fonts.label,
    fontSize: 11,
    color: colors.onPrimary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    opacity: 0.85,
    marginBottom: 2,
  },
  heroCity: {
    fontFamily: fonts.headline,
    fontSize: 22,
    color: colors.onPrimary,
  },
  verifiedStamp: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: radii.full,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-8deg' }],
  },
  verifiedText: {
    color: colors.onAccentContainer,
    fontFamily: fonts.headline,
    fontSize: 18,
  },
  heroFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  heroFooterText: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.onSurface,
    marginRight: spacing.sm,
  },
  unlockButton: {
    backgroundColor: colors.primaryDark,
    borderRadius: radii.sm,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  unlockButtonText: {
    fontFamily: fonts.label,
    fontSize: 12,
    color: colors.onPrimary,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.outlineVariant,
  },
  dividerLabel: {
    fontFamily: fonts.label,
    fontSize: 12,
    color: colors.outline,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: spacing.md,
  },
  note: {
    backgroundColor: colors.surfaceContainer,
    borderRadius: radii.sm,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  noteText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.primary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  cityCard: {
    width: '47%',
    flexGrow: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    ...shadowCard,
  },
  cityEmojiWrap: {
    width: 72,
    height: 72,
    borderRadius: radii.lg,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  cityEmoji: {
    fontSize: 34,
  },
  cityNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cityName: {
    fontFamily: fonts.headlineBold,
    fontSize: 15,
    color: colors.primary,
  },
  soonBadge: {
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: radii.full,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  soonText: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
