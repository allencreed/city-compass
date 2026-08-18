import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCheckIns } from '../context/CheckInsContext';
import { useSession } from '../context/SessionContext';
import { LOCATIONS } from '../data/locations';
import { colors, fonts, radii, shadowCard, shadowElevated, spacing } from '../theme';

interface RankedExplorer {
  name: string;
  title: string;
  points: number;
  emoji: string;
  medal?: 'gold' | 'silver' | 'bronze';
}

const EXPLORERS: RankedExplorer[] = [
  { name: 'Alex Rivera', title: 'Master Explorer', points: 12450, emoji: '🧑‍🚀', medal: 'gold' },
  { name: 'Jordan Lee', title: 'City Navigator', points: 11200, emoji: '🧕', medal: 'silver' },
  { name: 'Casey Smith', title: 'Local Guide', points: 10850, emoji: '🧑‍💻', medal: 'bronze' },
  { name: 'Sam Taylor', title: 'Neighborhood Scout', points: 9420, emoji: '🧑‍🎨' },
  { name: 'Jamie Doe', title: 'First Steps', points: 8900, emoji: '🧑‍🌾' },
];

const MEDAL_COLORS: Record<'gold' | 'silver' | 'bronze', string> = {
  gold: colors.gold,
  silver: colors.silver,
  bronze: colors.bronze,
};

const MEDAL_EMOJI: Record<'gold' | 'silver' | 'bronze', string> = {
  gold: '🥇',
  silver: '🥈',
  bronze: '🥉',
};

export default function LeaderboardScreen() {
  const { profile } = useSession();
  const { hasCheckedIn } = useCheckIns();
  const [scope, setScope] = useState<'friends' | 'global'>('friends');

  const myPoints = LOCATIONS.filter((l) => hasCheckedIn(l.id)).reduce(
    (sum, l) => sum + l.rewardPoints,
    0,
  );
  const myStamps = LOCATIONS.filter((l) => hasCheckedIn(l.id)).length;
  const myInitials = (profile?.name ?? 'You')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <View style={styles.topBarSide}>
          <Text style={styles.topBarIcon}>🗺️</Text>
        </View>
        <Text style={styles.topBarTitle}>City Ranks</Text>
        <View style={[styles.topBarSide, styles.topBarSideRight]}>
          <Text style={styles.topBarIcon}>🔔</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Segmented control */}
        <View style={styles.segment}>
          {(['friends', 'global'] as const).map((s) => (
            <Pressable
              key={s}
              style={[styles.segmentItem, scope === s && styles.segmentItemActive]}
              onPress={() => setScope(s)}
            >
              <Text style={[styles.segmentText, scope === s && styles.segmentTextActive]}>
                {s === 'friends' ? 'Friends' : 'Global'}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.list}>
          {EXPLORERS.map((explorer, index) => (
            <View
              key={explorer.name}
              style={[
                styles.row,
                explorer.medal && { borderLeftWidth: 4, borderLeftColor: MEDAL_COLORS[explorer.medal] },
              ]}
            >
              <View style={styles.rankCol}>
                <Text style={styles.rankNumber}>{index + 1}</Text>
                {explorer.medal && <Text style={styles.medal}>{MEDAL_EMOJI[explorer.medal]}</Text>}
              </View>
              <View style={styles.avatar}>
                <Text style={styles.avatarEmoji}>{explorer.emoji}</Text>
              </View>
              <View style={styles.rowInfo}>
                <Text style={styles.rowName}>{explorer.name}</Text>
                <Text style={styles.rowTitle}>{explorer.title}</Text>
              </View>
              <View style={styles.rowPoints}>
                <Text style={styles.rowPointsValue}>{explorer.points.toLocaleString()}</Text>
                <Text style={styles.rowPointsLabel}>pts</Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.scopeNote}>
          {scope === 'friends'
            ? 'Your friends are out exploring — catch up this weekend!'
            : 'You are competing with explorers across the city.'}
        </Text>
      </ScrollView>

      {/* Pinned user */}
      <SafeAreaView edges={['bottom']} style={styles.pinnedWrap}>
        <View style={styles.pinned}>
          <View style={styles.pinnedRank}>
            <Text style={styles.pinnedRankValue}>42</Text>
          </View>
          <View style={[styles.avatar, styles.avatarYou]}>
            <Text style={styles.avatarYouText}>{myInitials || 'YOU'}</Text>
          </View>
          <View style={styles.pinnedInfo}>
            <Text style={styles.pinnedName}>{profile?.name ?? 'You'}</Text>
            <Text style={styles.pinnedTitle}>
              {myStamps > 0 ? 'City Explorer' : 'Rookie Explorer'}
            </Text>
          </View>
          <View style={styles.pinnedPoints}>
            <Text style={styles.pinnedPointsValue}>{myPoints.toLocaleString()}</Text>
            <Text style={styles.pinnedPointsLabel}>pts</Text>
          </View>
        </View>
      </SafeAreaView>
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
    height: 56,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    shadowColor: '#031632',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  topBarSide: {
    width: 36,
  },
  topBarSideRight: {
    alignItems: 'flex-end',
  },
  topBarIcon: {
    fontSize: 18,
  },
  topBarTitle: {
    fontFamily: fonts.headlineBold,
    fontSize: 17,
    color: colors.primary,
  },
  content: {
    padding: spacing.container,
    paddingBottom: 120,
  },
  segment: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceContainerHighest,
    borderRadius: radii.sm,
    padding: 4,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  segmentItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 6,
  },
  segmentItemActive: {
    backgroundColor: colors.surface,
    shadowColor: '#031632',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  segmentText: {
    fontFamily: fonts.label,
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
  segmentTextActive: {
    color: colors.primary,
  },
  list: {
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    padding: spacing.md,
    ...shadowCard,
  },
  rankCol: {
    width: 34,
    alignItems: 'center',
  },
  rankNumber: {
    fontFamily: fonts.headlineBold,
    fontSize: 16,
    color: colors.onSurface,
  },
  medal: {
    fontSize: 13,
    marginTop: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  avatarEmoji: {
    fontSize: 20,
  },
  rowInfo: {
    flex: 1,
    minWidth: 0,
  },
  rowName: {
    fontFamily: fonts.label,
    fontSize: 13,
    color: colors.onSurface,
  },
  rowTitle: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.onSurfaceVariant,
    marginTop: 1,
  },
  rowPoints: {
    alignItems: 'flex-end',
  },
  rowPointsValue: {
    fontFamily: fonts.headlineBold,
    fontSize: 16,
    color: colors.primary,
  },
  rowPointsLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    color: colors.onSurfaceVariant,
  },
  scopeNote: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.outline,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  pinnedWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.container,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  pinned: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radii.sm,
    padding: spacing.md,
    ...shadowElevated,
  },
  pinnedRank: {
    width: 34,
    alignItems: 'center',
  },
  pinnedRankValue: {
    fontFamily: fonts.headlineBold,
    fontSize: 16,
    color: colors.onPrimary,
  },
  avatarYou: {
    backgroundColor: colors.accentContainer,
    borderWidth: 2,
    borderColor: colors.onPrimary,
  },
  avatarYouText: {
    fontFamily: fonts.label,
    fontSize: 13,
    color: colors.onAccentContainer,
  },
  pinnedInfo: {
    flex: 1,
    minWidth: 0,
    marginLeft: spacing.sm,
  },
  pinnedName: {
    fontFamily: fonts.label,
    fontSize: 13,
    color: colors.onPrimary,
  },
  pinnedTitle: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.onPrimaryContainer,
    marginTop: 1,
  },
  pinnedPoints: {
    alignItems: 'flex-end',
  },
  pinnedPointsValue: {
    fontFamily: fonts.headlineBold,
    fontSize: 16,
    color: colors.onPrimary,
  },
  pinnedPointsLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    color: colors.onPrimaryContainer,
  },
});
