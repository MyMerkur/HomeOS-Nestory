import { useMemo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { fontSize, radius, spacing, typography, type ThemeColors } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';

type Props = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  testID?: string;
};

export function Chip({ label, selected = false, onPress, testID }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Pressable
      testID={testID}
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.base, selected && styles.selected]}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </Pressable>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    base: {
      minHeight: 32,
      borderRadius: radius.pill,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      backgroundColor: colors.primaryTint,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'flex-start',
    },
    selected: {
      backgroundColor: colors.primary,
    },
    label: {
      fontSize: fontSize.bodySm,
      fontFamily: typography.bodyMedium.fontFamily,
      fontWeight: typography.bodyMedium.fontWeight,
      color: colors.primaryDark,
    },
    labelSelected: {
      color: colors.white,
    },
  });
}
