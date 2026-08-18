import { useState } from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { colors, fonts, radii, spacing } from '../theme';

interface ThemedInputProps extends TextInputProps {
  label?: string;
  /** Removes the bottom margin for use inside rows. */
  compact?: boolean;
}

/** Design-system input: light fill, bottom-only Passport Blue border when focused. */
export default function ThemedInput({
  label,
  compact,
  style,
  onFocus,
  onBlur,
  ...rest
}: ThemedInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.field, compact && styles.fieldCompact]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={[styles.input, focused && styles.inputFocused, style]}
        placeholderTextColor={colors.outline}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: spacing.md,
  },
  fieldCompact: {
    marginBottom: 0,
  },
  label: {
    fontFamily: fonts.label,
    fontSize: 12,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.surfaceContainerLow,
    borderTopLeftRadius: radii.sm,
    borderTopRightRadius: radii.sm,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.onSurface,
  },
  inputFocused: {
    borderBottomColor: colors.primary,
    backgroundColor: colors.surfaceContainerHigh,
  },
});
