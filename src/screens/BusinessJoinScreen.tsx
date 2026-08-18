import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ThemedInput from '../components/ThemedInput';
import type { RootStackParamList } from '../navigation/types';
import { colors, fonts, radii, shadowCard, spacing } from '../theme';

const CATEGORIES = ['Cafe & Bakery', 'Restaurant', 'Retail Store', 'Museum & Culture', 'Entertainment'];

const SLOT_COUNT = 4;

interface DiscountSlot {
  item: string;
  value: string;
}

export default function BusinessJoinScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'BusinessJoin'>>();
  const [name, setName] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [address, setAddress] = useState('');
  const [slots, setSlots] = useState<DiscountSlot[]>(
    Array.from({ length: SLOT_COUNT }, () => ({ item: '', value: '' })),
  );
  const [joined, setJoined] = useState(false);

  const canJoin = name.trim().length > 1 && category !== null && address.trim().length > 2;

  const updateSlot = (index: number, patch: Partial<DiscountSlot>) => {
    setSlots((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.topBar}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={styles.backButton}>
            <Text style={styles.backText}>←</Text>
          </Pressable>
          <Text style={styles.topBarTitle}>City Hub</Text>
          <View style={styles.topBarSpacer} />
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoEmoji}>🏪</Text>
            </View>
            <Text style={styles.title}>Put Your Business on the Map</Text>
            <Text style={styles.subtitle}>
              Join the City Hub network and attract urban explorers to your location.
            </Text>
          </View>

          {joined ? (
            <View style={styles.successCard}>
              <Text style={styles.successEmoji}>🎉</Text>
              <Text style={styles.successTitle}>Welcome to City Passport!</Text>
              <Text style={styles.successBody}>
                Your business is on the map. Explorers can now find you, claim your discounts, and
                stamp their passport at your register.
              </Text>
              <Pressable style={styles.doneButton} onPress={() => navigation.goBack()}>
                <Text style={styles.doneButtonText}>Back to the app</Text>
              </Pressable>
            </View>
          ) : (
            <>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>🏢 Business Details</Text>
                <ThemedInput
                  label="Business Name"
                  placeholder="e.g., The Local Grind"
                  value={name}
                  onChangeText={setName}
                />
                <View style={styles.field}>
                  <Text style={styles.label}>Category</Text>
                  <View style={styles.chipWrap}>
                    {CATEGORIES.map((c) => {
                      const active = category === c;
                      return (
                        <Pressable
                          key={c}
                          style={[styles.chip, active && styles.chipActive]}
                          onPress={() => setCategory(c)}
                        >
                          <Text style={[styles.chipText, active && styles.chipTextActive]}>{c}</Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
                <ThemedInput
                  label="Physical Address"
                  placeholder="123 Main St, City, ST 12345"
                  value={address}
                  onChangeText={setAddress}
                />
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>🎟️ Configure Your Passport Menu</Text>
                <Text style={styles.cardHint}>
                  Define up to {SLOT_COUNT} exclusive discounts for City Hub explorers.
                </Text>
                {slots.map((slot, index) => (
                  <View key={index} style={styles.slot}>
                    <View style={[styles.slotNumber, index === 0 && styles.slotNumberActive]}>
                      <Text style={styles.slotNumberText}>{index + 1}</Text>
                    </View>
                    <ThemedInput
                      compact
                      style={styles.slotInput}
                      placeholder={index === 0 ? 'Signature Latte' : 'Optional item'}
                      value={slot.item}
                      onChangeText={(text) => updateSlot(index, { item: text })}
                    />
                    <ThemedInput
                      compact
                      style={styles.slotValue}
                      placeholder="%"
                      value={slot.value}
                      onChangeText={(text) => updateSlot(index, { value: text })}
                      keyboardType="number-pad"
                    />
                  </View>
                ))}
              </View>

              <Pressable
                style={[styles.joinButton, !canJoin && styles.joinButtonDisabled]}
                disabled={!canJoin}
                onPress={() => setJoined(true)}
              >
                <Text style={styles.joinButtonText}>Join City Passport →</Text>
              </Pressable>
              <Text style={styles.terms}>By joining, you agree to our B2B Terms of Service.</Text>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    height: 56,
    backgroundColor: colors.surface,
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
  topBarSpacer: {
    width: 36,
  },
  content: {
    padding: spacing.container,
    paddingBottom: spacing.xl * 2,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: radii.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  logoEmoji: {
    fontSize: 28,
  },
  title: {
    fontFamily: fonts.headline,
    fontSize: 24,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadowCard,
  },
  cardTitle: {
    fontFamily: fonts.headlineBold,
    fontSize: 17,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  cardHint: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.md,
  },
  field: {
    marginBottom: spacing.md,
  },
  label: {
    fontFamily: fonts.label,
    fontSize: 11,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: spacing.xs,
  },
  input: {
    fontFamily: fonts.body,
    fontSize: 14,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    paddingHorizontal: 12,
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
  slot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  slotNumber: {
    width: 28,
    height: 28,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotNumberActive: {
    backgroundColor: colors.accentContainer,
  },
  slotNumberText: {
    fontFamily: fonts.label,
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
  slotInput: {
    flex: 1,
  },
  slotValue: {
    width: 64,
    textAlign: 'right',
  },
  joinButton: {
    backgroundColor: colors.primaryDark,
    borderRadius: radii.sm,
    paddingVertical: 16,
    alignItems: 'center',
  },
  joinButtonDisabled: {
    opacity: 0.45,
  },
  joinButtonText: {
    fontFamily: fonts.label,
    fontSize: 13,
    color: colors.onPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  terms: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.outline,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  successCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.xl,
    alignItems: 'center',
    ...shadowCard,
  },
  successEmoji: {
    fontSize: 44,
    marginBottom: spacing.md,
  },
  successTitle: {
    fontFamily: fonts.headline,
    fontSize: 22,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  successBody: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: spacing.lg,
  },
  doneButton: {
    backgroundColor: colors.accentContainer,
    borderRadius: radii.sm,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  doneButtonText: {
    fontFamily: fonts.label,
    fontSize: 13,
    color: colors.onAccentContainer,
  },
});
