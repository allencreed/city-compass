import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProgressRing from '../components/ProgressRing';
import { useCheckIns } from '../context/CheckInsContext';
import { useSession } from '../context/SessionContext';
import { LOCATIONS } from '../data/locations';
import type { MainTabParamList, RootStackParamList } from '../navigation/types';
import { colors, fonts, radii, shadowCard, spacing } from '../theme';

type ProfileNav = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Profile'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileNav>();
  const { profile, logout } = useSession();
  const { hasCheckedIn } = useCheckIns();

  const handleLogout = useCallback(() => {
    // Session change remounts the navigator onto Login automatically.
    logout();
  }, [logout]);

  const stamps = LOCATIONS.filter((l) => hasCheckedIn(l.id)).length;
  const points = LOCATIONS.filter((l) => hasCheckedIn(l.id)).reduce(
    (sum, l) => sum + l.rewardPoints,
    0,
  );
  const initials = (profile?.name ?? 'You')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials || '🧭'}</Text>
          </View>
          <Text style={styles.name}>{profile?.name ?? 'Explorer'}</Text>
          <Text style={styles.email}>{profile?.email ?? 'you@example.com'}</Text>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{stamps}</Text>
              <Text style={styles.statLabel}>Stamps</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{points}</Text>
              <Text style={styles.statLabel}>Points</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>SF</Text>
              <Text style={styles.statLabel}>City</Text>
            </View>
          </View>
        </View>

        <Pressable style={styles.passportCard} onPress={() => navigation.navigate('Passport')}>
          <View style={styles.passportText}>
            <Text style={styles.passportTitle}>My Passport</Text>
            <Text style={styles.passportSub}>
              {stamps} of {LOCATIONS.length} venues stamped · {points} pts earned
            </Text>
          </View>
          <ProgressRing
            size={56}
            stroke={5}
            progress={stamps / LOCATIONS.length}
            label={`${stamps}/${LOCATIONS.length}`}
            sublabel=""
          />
        </Pressable>

        <View style={styles.menu}>
          <Pressable
            style={styles.menuRow}
            onPress={() => navigation.navigate('BusinessJoin')}
          >
            <Text style={styles.menuEmoji}>🏪</Text>
            <Text style={styles.menuLabel}>Join as a Business</Text>
            <Text style={styles.menuChevron}>›</Text>
          </Pressable>
          <Pressable style={styles.menuRow} onPress={() => navigation.navigate('Passport')}>
            <Text style={styles.menuEmoji}>🛂</Text>
            <Text style={styles.menuLabel}>My Stamps</Text>
            <Text style={styles.menuChevron}>›</Text>
          </Pressable>
          <Pressable style={styles.menuRow} onPress={handleLogout}>
            <Text style={styles.menuEmoji}>🚪</Text>
            <Text style={[styles.menuLabel, styles.logoutLabel]}>Log Out</Text>
            <Text style={styles.menuChevron}>›</Text>
          </Pressable>
        </View>

        <Text style={styles.about}>
          City Compass · pilot city San Francisco. City switching, QR stamping at the register, and
          reward redemption arrive in the next milestones.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    shadowColor: '#031632',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  topBarTitle: {
    fontFamily: fonts.headlineBold,
    fontSize: 17,
    color: colors.primary,
  },
  content: {
    padding: spacing.container,
    paddingBottom: spacing.xl,
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginTop: spacing.lg,
    ...shadowCard,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  avatarText: {
    fontFamily: fonts.headline,
    fontSize: 24,
    color: colors.onPrimary,
  },
  name: {
    fontFamily: fonts.headlineBold,
    fontSize: 19,
    color: colors.primary,
  },
  email: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    alignSelf: 'stretch',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.outlineVariant,
  },
  statValue: {
    fontFamily: fonts.headlineBold,
    fontSize: 18,
    color: colors.accentDark,
  },
  statLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    color: colors.onSurfaceVariant,
    marginTop: 1,
  },
  passportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginTop: spacing.md,
    ...shadowCard,
  },
  passportText: {
    flex: 1,
    marginRight: spacing.md,
  },
  passportTitle: {
    fontFamily: fonts.headlineBold,
    fontSize: 16,
    color: colors.primary,
  },
  passportSub: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  menu: {
    marginTop: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    overflow: 'hidden',
    ...shadowCard,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
  },
  menuEmoji: {
    fontSize: 18,
    marginRight: spacing.sm,
  },
  menuLabel: {
    flex: 1,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.onSurface,
  },
  menuChevron: {
    fontSize: 20,
    color: colors.outline,
  },
  logoutLabel: {
    color: colors.error,
  },
  about: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.outline,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
