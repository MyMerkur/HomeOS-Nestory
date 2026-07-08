import { useMemo } from 'react';
import type { TextInputProps } from 'react-native';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { fontSize, radius, spacing, typography, type ThemeColors } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';

type Props = TextInputProps & {
  label: string;
  error?: string;
  hideLabel?: boolean;
};

export function TextField({ label, error, hideLabel = false, style, ...inputProps }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      {hideLabel ? null : <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error ? styles.inputError : null, style]}
        placeholderTextColor={colors.textMuted}
        accessibilityLabel={label}
        {...inputProps}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      gap: spacing.xs,
    },
    label: {
      fontSize: fontSize.bodyMd,
      fontFamily: typography.bodyMedium.fontFamily,
      fontWeight: typography.bodyMedium.fontWeight,
      color: colors.textPrimary,
    },
    input: {
      minHeight: 44,
      borderWidth: 1,
      borderColor: colors.borderStrong,
      borderRadius: radius.md,
      paddingHorizontal: spacing.md,
      fontSize: fontSize.bodyLg,
      fontFamily: typography.body.fontFamily,
      color: colors.textPrimary,
      backgroundColor: colors.surface,
    },
    inputError: {
      borderColor: colors.dangerDark,
    },
    error: {
      fontSize: fontSize.caption,
      fontFamily: typography.caption.fontFamily,
      color: colors.dangerDark,
    },
  });
}
