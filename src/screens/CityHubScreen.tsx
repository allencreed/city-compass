import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProgressRing from '../components/ProgressRing';
import { useCheckIns } from '../context/CheckInsContext';
import { useLocation } from '../context/LocationContext';
import { useSession } from '../context/SessionContext';
import {
  CATEGORY_META,
  haversineMeters,
  LOCATIONS,
  type CityLocation,
  type LocationCategory,
} from '../data/locations';
import type { MainTabParamList, RootStackParamList } from '../navigation/types';
import { colors, fonts, radii, shadowCard, spacing } from '../theme';

type HomeNav = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

const BOOKS: { category: LocationCategory; title: string; emoji: string; desc: string }[] = [
  { category: 'cafe', title: 'Café Crawl', emoji: '☕', desc: 'Brew your way through the city' },
  { category: 'restaurant', title: 'Restaurant Row', emoji: '🍽️', desc: 'Signature plates worth the walk' },
  { category: 'bar', title: 'Night Out', emoji: '🍻', desc: 'Evenings worth staying for' },
  { category: 'retail', title: 'Shop & Stroll', emoji: '🛍️', desc: 'Independent finds downtown' },
  { category: 'attraction', title: 'City Classics', emoji: '🏛️', desc: 'The landmarks that define SF' },
];

const BUSINESS_CATEGORIES: LocationCategory[] = ['cafe', 'restaurant', 'bar', 'retail'];

export default function CityHubScreen() {
  const navigation = useNavigation<HomeNav>();
  const { profile } = useSession();
  const { coords } = useLocation();
  const { hasCheckedIn } = useCheckIns();

  const [query, setQuery] = useState('');
  const [chip, setChip] = useState<LocationCategory | 'all'>('all');
  const [tab, setTab] = useState<'businesses' | 'landmarks'>('businesses');
  const [searchFocused, setSearchFocused] = useState(false);

  const stampedCount = LOCATIONS.filter((l) => hasCheckedIn(l.id)).length;
  const points = LOCATIONS.filter((l) => hasCheckedIn(l.id)).reduce(
    (sum, l) => sum + l.rewardPoints,
    0,
  );

  const firstName = profile?.name.split(' ')[0] ?? 'Explorer';

  const visible = useMemo(() => {
    const isLandmark = tab === 'landmarks';
    return LOCATIONS.filter((l) => {
      const matchesTab = isLandmark ? l.category === 'attraction' : BUSINESS_CATEGORIES.includes(l.category);
      const matchesChip = chip === 'all' || l.category === chip;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        q.length === 0 || l.name.toLowerCase().includes(q) || l.description.toLowerCase().includes(q);
      return matchesTab && matchesChip && matchesQuery;
    });
  }, [tab, chip, query]);

  const distanceTo = (l: CityLocation) =>
    coords ? Math.round(haversineMeters(coords.latitude, coords.longitude, l.latitude, l.longitude)) : null;

  const openDetail = (l: CityLocation) => navigation.navigate('BusinessDetail', { locationId: l.id });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <View style={styles.topBarSide}>
          <Text style={styles.topBarIcon}>🗺️</Text>
        </View>
        <Text style={styles.topBarTitle}>City Hub</Text>
        <View style={[styles.topBarSide, styles.topBarSideRight]}>
          <Text style={styles.topBarIcon}>🔔</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Dashboard header */}
        <View style={styles.dashboard}>
          <View style={styles.dashboardText}>
            <Text style={styles.greeting}>Hi {firstName} 👋</Text>
            <Text style={styles.dashboardTitle}>San Francisco Passport</Text>
            <Text style={styles.dashboardSub}>Your urban exploration journey.</Text>
          </View>
          <Pressable onPress={() => navigation.navigate('Passport')}>
            <ProgressRing
              progress={stampedCount / LOCATIONS.length}
              label={`${stampedCount}/${LOCATIONS.length}`}
              sublabel="Stamps"
            />
          </Pressable>
        </View>

        {/* Search */}
        <View style={[styles.searchWrap, searchFocused && styles.searchWrapFocused]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search venues or categories..."
            placeholderTextColor={colors.outline}
            value={query}
            onChangeText={setQuery}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          <Pressable style={styles.searchTune} hitSlop={8}>
            <Text style={styles.searchTuneIcon}>🎛️</Text>
          </Pressable>
        </View>

        {/* Filter chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          <Chip label="All" active={chip === 'all'} onPress={() => setChip('all')} />
          {(Object.keys(CATEGORY_META) as LocationCategory[]).map((c) => (
            <Chip
              key={c}
              label={CATEGORY_META[c].label}
              active={chip === c}
              onPress={() => setChip(c)}
            />
          ))}
        </ScrollView>

        {/* Passport books */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Current Books</Text>
          <Pressable onPress={() => navigation.navigate('Passport')}>
            <Text style={styles.sectionLink}>View All</Text>
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.books}>
          {BOOKS.map((book) => {
            const total = LOCATIONS.filter((l) => l.category === book.category).length;
            const done = LOCATIONS.filter((l) => l.category === book.category && hasCheckedIn(l.id)).length;
            return (
              <Pressable
                key={book.category}
                style={styles.bookCard}
                onPress={() => {
                  setTab(BUSINESS_CATEGORIES.includes(book.category) ? 'businesses' : 'landmarks');
                  setChip(book.category);
                }}
              >
                <View style={styles.bookCover}>
                  <Text style={styles.bookEmoji}>{book.emoji}</Text>
                </View>
                <Text style={styles.bookTitle}>{book.title}</Text>
                <Text style={styles.bookDesc} numberOfLines={2}>
                  {book.desc}
                </Text>
                <View style={styles.bookProgressRow}>
                  <View style={styles.bookTrack}>
                    <View style={[styles.bookFill, { width: `${(done / total) * 100}%` }]} />
                  </View>
                  <Text style={styles.bookCount}>
                    {done}/{total}
                  </Text>
                </View>
              </Pressable>
            );
          })}
          <View style={[styles.bookCard, styles.bookCardNew]}>
            <Text style={styles.bookNewIcon}>＋</Text>
            <Text style={styles.bookNewText}>Unlock New Book</Text>
            <Text style={styles.bookNewHint}>Complete books to unlock more</Text>
          </View>
        </ScrollView>

        {/* Businesses / Landmarks */}
        <View style={styles.tabs}>
          <Pressable
            style={[styles.tab, tab === 'businesses' && styles.tabActive]}
            onPress={() => setTab('businesses')}
          >
            <Text style={[styles.tabText, tab === 'businesses' && styles.tabTextActive]}>
              BUSINESSES
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, tab === 'landmarks' && styles.tabActive]}
            onPress={() => setTab('landmarks')}
          >
            <Text style={[styles.tabText, tab === 'landmarks' && styles.tabTextActive]}>
              LANDMARKS
            </Text>
          </Pressable>
        </View>

        <View style={styles.venueList}>
          {visible.map((l) => {
            const checked = hasCheckedIn(l.id);
            const d = distanceTo(l);
            return (
              <Pressable
                key={l.id}
                style={[styles.venueCard, checked && styles.venueCardStamped]}
                onPress={() => openDetail(l)}
              >
                <View style={[styles.venueThumb, checked && styles.venueThumbStamped]}>
                  <Text style={styles.venueThumbEmoji}>{CATEGORY_META[l.category].emoji}</Text>
                  {checked && (
                    <View style={styles.venueCheck}>
                      <Text style={styles.venueCheckText}>✓</Text>
                    </View>
                  )}
                </View>
                <View style={styles.venueInfo}>
                  <View style={styles.venueNameRow}>
                    <Text
                      style={[styles.venueName, checked && styles.venueNameStamped]}
                      numberOfLines={1}
                    >
                      {l.name}
                    </Text>
                    {checked ? (
                      <View style={styles.venueStampedTag}>
                        <Text style={styles.venueStampedTagText}>Stamped</Text>
                      </View>
                    ) : (
                      <View style={styles.discountBadge}>
                        <Text style={styles.discountBadgeText}>Discount</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.venueDesc} numberOfLines={1}>
                    {l.description}
                  </Text>
                  <View style={styles.venueMetaRow}>
                    <Text style={styles.venueMeta}>
                      {CATEGORY_META[l.category].label}
                      {d !== null ? ` · ${d} m away` : ''}
                    </Text>
                    <Text style={styles.venuePoints}>+{l.rewardPoints} pts</Text>
                  </View>
                </View>
              </Pressable>
            );
          })}
          {visible.length === 0 && (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No venues match — try another filter.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={[styles.chip, active && styles.chipActive]} onPress={onPress}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
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
    paddingBottom: spacing.xl,
  },
  dashboard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  dashboardText: {
    flex: 1,
    marginRight: spacing.md,
  },
  greeting: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.onSurfaceVariant,
    marginBottom: 2,
  },
  dashboardTitle: {
    fontFamily: fonts.headline,
    fontSize: 24,
    color: colors.primary,
  },
  dashboardSub: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderTopLeftRadius: radii.sm,
    borderTopRightRadius: radii.sm,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    paddingLeft: spacing.md,
    marginBottom: spacing.md,
  },
  searchWrapFocused: {
    borderBottomColor: colors.primary,
    backgroundColor: colors.surfaceContainerHigh,
  },
  searchTune: {
    paddingHorizontal: spacing.md,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  searchTuneIcon: {
    fontSize: 15,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.onSurface,
  },
  chips: {
    gap: spacing.sm,
    paddingBottom: spacing.sm,
  },
  chip: {
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: colors.surface,
  },
  chipActive: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
  },
  chipText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
  chipTextActive: {
    color: colors.onPrimary,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontFamily: fonts.headlineBold,
    fontSize: 17,
    color: colors.primary,
  },
  sectionLink: {
    fontFamily: fonts.label,
    fontSize: 12,
    color: colors.accentDark,
  },
  books: {
    gap: spacing.md,
    paddingBottom: spacing.xs,
  },
  bookCard: {
    width: 210,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    padding: spacing.md,
    ...shadowCard,
  },
  bookCover: {
    height: 64,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  bookEmoji: {
    fontSize: 30,
  },
  bookTitle: {
    fontFamily: fonts.headlineBold,
    fontSize: 15,
    color: colors.primary,
  },
  bookDesc: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.onSurfaceVariant,
    marginTop: 2,
    marginBottom: spacing.sm,
  },
  bookProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  bookTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.surfaceVariant,
    overflow: 'hidden',
  },
  bookFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: colors.accentContainer,
  },
  bookCount: {
    fontFamily: fonts.label,
    fontSize: 11,
    color: colors.accentDark,
  },
  bookCardNew: {
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: colors.outlineVariant,
  },
  bookNewIcon: {
    fontSize: 28,
    color: colors.outline,
    marginBottom: spacing.xs,
  },
  bookNewText: {
    fontFamily: fonts.label,
    fontSize: 13,
    color: colors.outline,
  },
  bookNewHint: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.outline,
    textAlign: 'center',
    marginTop: 2,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.accentContainer,
  },
  tabText: {
    fontFamily: fonts.label,
    fontSize: 12,
    color: colors.onSurfaceVariant,
    letterSpacing: 0.8,
  },
  tabTextActive: {
    color: colors.primary,
  },
  venueList: {
    gap: spacing.sm,
  },
  venueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    padding: spacing.md,
    ...shadowCard,
  },
  venueCardStamped: {
    opacity: 0.75,
  },
  venueThumb: {
    width: 56,
    height: 56,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  venueThumbStamped: {
    backgroundColor: colors.surfaceContainerHigh,
  },
  venueThumbEmoji: {
    fontSize: 24,
  },
  venueCheck: {
    position: 'absolute',
    bottom: -3,
    right: -3,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.accentContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  venueCheckText: {
    fontSize: 10,
    color: colors.onAccentContainer,
    fontFamily: fonts.headline,
  },
  venueInfo: {
    flex: 1,
    minWidth: 0,
  },
  venueNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  venueName: {
    flexShrink: 1,
    fontFamily: fonts.headlineBold,
    fontSize: 15,
    color: colors.onSurface,
  },
  venueNameStamped: {
    textDecorationLine: 'line-through',
    color: colors.onSurfaceVariant,
  },
  venueStampedTag: {
    backgroundColor: colors.surfaceContainer,
    borderRadius: radii.full,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  venueStampedTagText: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: colors.accentDark,
  },
  discountBadge: {
    backgroundColor: colors.accentContainer,
    borderRadius: 3,
    paddingHorizontal: 5,
    paddingVertical: 2,
    transform: [{ rotate: '-3deg' }],
  },
  discountBadgeText: {
    fontFamily: fonts.label,
    fontSize: 9,
    color: colors.onAccentContainer,
    textTransform: 'uppercase',
  },
  venueDesc: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  venueMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  venueMeta: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.outline,
  },
  venuePoints: {
    fontFamily: fonts.label,
    fontSize: 11,
    color: colors.accentDark,
  },
  empty: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.onSurfaceVariant,
  },
});
