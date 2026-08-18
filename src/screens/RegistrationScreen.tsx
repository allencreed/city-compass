import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import ThemedInput from '../components/ThemedInput';
import { useLocation } from '../context/LocationContext';
import { useSession } from '../context/SessionContext';
import type { RootStackParamList } from '../navigation/types';
import { colors, fonts, radii, shadowCard, spacing } from '../theme';

export default function RegistrationScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'Registration'>>();
  const { completeRegistration } = useSession();
  const { permission, requestPermission } = useLocation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [locationOn, setLocationOn] = useState(permission === 'granted');

  const canRegister = name.trim().length > 1 && email.includes('@');

  const handleRegister = () => {
    if (!canRegister) return;
    completeRegistration({ name: name.trim(), email: email.trim() });
    // Session change remounts the navigator onto CityOnboarding automatically.
  };

  const toggleLocation = async (value: boolean) => {
    setLocationOn(value);
    if (value && permission !== 'granted') {
      const granted = await requestPermission();
      setLocationOn(granted);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.decorTop} pointerEvents="none" />
        <View style={styles.decorBottom} pointerEvents="none" />
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoEmoji}>🧭</Text>
            </View>
            <Text style={styles.title}>Start Your Adventure</Text>
            <Text style={styles.subtitle}>Create your City Passport and begin exploring.</Text>
          </View>

          <ThemedInput
            label="Full Name"
            placeholder="Jane Doe"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <ThemedInput
            label="Email Address"
            placeholder="jane@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordRow}>
              <ThemedInput
                style={styles.passwordInput}
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <Pressable
                style={styles.eyeButton}
                onPress={() => setShowPassword((v) => !v)}
                hitSlop={8}
              >
                <Text style={styles.eyeText}>{showPassword ? '🙈' : '👁️'}</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.locationCard}>
            <Text style={styles.locationIcon}>📍</Text>
            <View style={styles.locationTextBlock}>
              <Text style={styles.locationTitle}>Location Access</Text>
              <Text style={styles.locationBody}>
                City Passport uses your location to find the right passport for you.
              </Text>
            </View>
            <Switch
              value={locationOn}
              onValueChange={toggleLocation}
              trackColor={{ false: colors.outlineVariant, true: colors.accent }}
              thumbColor={colors.surface}
            />
          </View>

          <Pressable
            style={[styles.registerButton, !canRegister && styles.registerButtonDisabled]}
            disabled={!canRegister}
            onPress={handleRegister}
          >
            <Text style={styles.registerText}>Register →</Text>
          </Pressable>
        </View>

        <Pressable
          style={styles.businessLink}
          onPress={() => navigation.navigate('BusinessJoin')}
          hitSlop={8}
        >
          <Text style={styles.businessLinkText}>🏪 Are you a business? Join here.</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  decorTop: {
    position: 'absolute',
    top: -90,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.primary,
    opacity: 0.05,
  },
  decorBottom: {
    position: 'absolute',
    bottom: -110,
    left: -70,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: colors.accent,
    opacity: 0.06,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.container,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.lg,
    ...shadowCard,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoCircle: {
    width: 48,
    height: 48,
    borderRadius: radii.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  logoEmoji: {
    fontSize: 22,
  },
  title: {
    fontFamily: fonts.headline,
    fontSize: 24,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
  field: {
    marginBottom: spacing.md,
  },
  label: {
    fontFamily: fonts.label,
    fontSize: 12,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: spacing.xs,
  },
  passwordRow: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 44,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  eyeText: {
    fontSize: 16,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainer,
    borderRadius: radii.sm,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  locationIcon: {
    fontSize: 18,
    marginRight: spacing.sm,
  },
  locationTextBlock: {
    flex: 1,
    marginRight: spacing.sm,
  },
  locationTitle: {
    fontFamily: fonts.label,
    fontSize: 12,
    color: colors.onSurface,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  locationBody: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.onSurfaceVariant,
    lineHeight: 16,
  },
  registerButton: {
    backgroundColor: colors.primaryDark,
    borderRadius: radii.sm,
    paddingVertical: 16,
    alignItems: 'center',
  },
  registerButtonDisabled: {
    opacity: 0.45,
  },
  registerText: {
    fontFamily: fonts.headlineBold,
    fontSize: 16,
    color: colors.onPrimary,
  },
  businessLink: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  businessLinkText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.outline,
  },
});
