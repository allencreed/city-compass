import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useCheckIns } from '../context/CheckInsContext';
import { CATEGORY_META, LOCATIONS, type CityLocation } from '../data/locations';
import type { RootStackParamList } from '../navigation/types';
import { colors, fonts, radii, shadowCard, spacing } from '../theme';

export default function PassportScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'Passport'>>();
  const { hasCheckedIn } = useCheckIns();

  const stamped = LOCATIONS.filter((l) => hasCheckedIn(l.id));
  const points = stamped.reduce((sum, l) => sum + l.rewardPoints, 0);

  // Stamped venues first so progress reads at a glance; rest keep city order.
  const ordered = [...LOCATIONS].sort(
    (a, b) => Number(hasCheckedIn(b.id)) - Number(hasCheckedIn(a.id)),
  );

  const openOnMap = (item: CityLocation) =>
    navigation.navigate('Main', { screen: 'Explore', params: { openLocationId: item.id } });

  const renderStamp = ({ item }: { item: CityLocation }) => {
    const checked = hasCheckedIn(item.id);
    const meta = CATEGORY_META[item.category];
    return (
      <Pressable style={styles.stamp} onPress={() => openOnMap(item)}>
        <View style={[styles.stampCircle, checked ? styles.stampCircleChecked : styles.stampCircleEmpty]}>
          {checked ? (
            <Text style={styles.stampCheck}>✓</Text>
          ) : (
            <Text style={[styles.stampEmoji, styles.stampEmojiEmpty]}>{meta.emoji}</Text>
          )}
        </View>
        <Text style={styles.stampName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={checked ? styles.stampPoints : styles.stampPointsEmpty}>
          {checked ? `${item.rewardPoints} pts` : `+${item.rewardPoints} pts`}
        </Text>
      </Pressable>
    );
  };

  return (
    <FlatList
      style={styles.container}
      data={ordered}
      keyExtractor={(item) => item.id}
      renderItem={renderStamp}
      numColumns={3}
      columnWrapperStyle={styles.stampRow}
      contentContainerStyle={styles.content}
      ListHeaderComponent={
        <View>
          <View style={styles.progressCard}>
            <View style={styles.progressTop}>
              <View style={styles.progressText}>
                <Text style={styles.progressTitle}>San Francisco Passport</Text>
                <Text style={styles.progressSub}>
                  {stamped.length} of {LOCATIONS.length} venues · {points} pts earned
                </Text>
              </View>
              <View style={styles.progressStamp}>
                <Text style={styles.progressStampText}>✓</Text>
              </View>
            </View>
            {/* Segmented progress */}
            <View style={styles.segments}>
              {LOCATIONS.map((l) => (
                <View
                  key={l.id}
                  style={[
                    styles.segment,
                    hasCheckedIn(l.id) && styles.segmentDone,
                  ]}
                />
              ))}
            </View>
            <Text style={styles.progressHint}>
              {stamped.length === 0
                ? 'Visit venues on the map and check in to collect your first stamp.'
                : `${LOCATIONS.length - stamped.length} more to collect them all.`}
            </Text>
          </View>
          <Text style={styles.sectionLabel}>Venues</Text>
        </View>
      }
      ListFooterComponent={
        <Text style={styles.footerHint}>
          Tap a venue to find it on the map. QR stamping at the register is coming soon.
        </Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.container,
    paddingBottom: spacing.xl,
  },
  progressCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    ...shadowCard,
  },
  progressTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressText: {
    flex: 1,
    marginRight: spacing.sm,
  },
  progressTitle: {
    fontFamily: fonts.headline,
    fontSize: 19,
    color: colors.primary,
  },
  progressSub: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  progressStamp: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-8deg' }],
  },
  progressStampText: {
    fontFamily: fonts.headline,
    fontSize: 18,
    color: colors.accentDark,
  },
  segments: {
    flexDirection: 'row',
    gap: 3,
    marginTop: spacing.md,
  },
  segment: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surfaceContainerHigh,
  },
  segmentDone: {
    backgroundColor: colors.accentContainer,
  },
  progressHint: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.outline,
    marginTop: spacing.sm,
  },
  sectionLabel: {
    fontFamily: fonts.label,
    fontSize: 12,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  stampRow: {
    gap: spacing.md,
  },
  stamp: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    ...shadowCard,
  },
  stampCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  stampCircleChecked: {
    borderWidth: 3,
    borderColor: colors.accent,
    transform: [{ rotate: '-6deg' }],
  },
  stampCircleEmpty: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainerLow,
  },
  stampCheck: {
    fontFamily: fonts.headline,
    fontSize: 24,
    color: colors.accentDark,
  },
  stampEmoji: {
    fontSize: 22,
  },
  stampEmojiEmpty: {
    opacity: 0.45,
  },
  stampName: {
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    color: colors.onSurface,
    textAlign: 'center',
    lineHeight: 14,
  },
  stampPoints: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: colors.accentDark,
    marginTop: 4,
  },
  stampPointsEmpty: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: colors.outline,
    marginTop: 4,
  },
  footerHint: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.outline,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
