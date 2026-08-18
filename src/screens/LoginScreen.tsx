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
import ThemedInput from '../components/ThemedInput';
import { useSession } from '../context/SessionContext';
import type { RootStackParamList } from '../navigation/types';
import { colors, fonts, radii, shadowCard, spacing } from '../theme';

export default function LoginScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'Login'>>();
  const { login } = useSession();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const canLogin = email.includes('@') && password.length > 0;

  const handleLogin = () => {
    if (!canLogin) return;
    login(email.trim());
    // Session change remounts the navigator onto Main automatically.
  };

  const handleGuest = () => {
    login('guest@citycompass.app');
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
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Log in to continue your city adventure.</Text>
          </View>

          <ThemedInput
            label="Email Address"
            placeholder="jane@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <ThemedInput
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Pressable
            style={[styles.loginButton, !canLogin && styles.loginButtonDisabled]}
            disabled={!canLogin}
            onPress={handleLogin}
          >
            <Text style={styles.loginButtonText}>Log In →</Text>
          </Pressable>

          <Text style={styles.mockNote}>
            Demo mode — any email and password work. No account needed yet.
          </Text>

          <Pressable style={styles.guestButton} onPress={handleGuest}>
            <Text style={styles.guestButtonText}>Continue as guest</Text>
          </Pressable>

          <View style={styles.divider} />

          <Pressable
            style={styles.createAccount}
            onPress={() => navigation.navigate('Registration')}
          >
            <Text style={styles.createAccountText}>
              New here? <Text style={styles.createAccountLink}>Create an account</Text>
            </Text>
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
  loginButton: {
    backgroundColor: colors.primaryDark,
    borderRadius: radii.sm,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  loginButtonDisabled: {
    opacity: 0.45,
  },
  loginButtonText: {
    fontFamily: fonts.headlineBold,
    fontSize: 16,
    color: colors.onPrimary,
  },
  mockNote: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.outline,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  guestButton: {
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: spacing.xs,
  },
  guestButtonText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.accentDark,
  },
  divider: {
    height: 1,
    backgroundColor: colors.outlineVariant,
    marginVertical: spacing.md,
  },
  createAccount: {
    alignItems: 'center',
  },
  createAccountText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.onSurfaceVariant,
  },
  createAccountLink: {
    fontFamily: fonts.label,
    color: colors.primary,
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
