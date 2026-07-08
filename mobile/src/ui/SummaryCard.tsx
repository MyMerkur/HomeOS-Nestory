import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { fontSize, radius, spacing, typography, type ThemeColors } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';

type Tint = 'primary' | 'danger' | 'warning';

type Props = {
  value: number | string;
  caption: string;
  tint: Tint;
};

export function SummaryCard({ value, caption, tint }: Props) {
  const { colors } = useTheme();
  const { styles, tintBackground, tintText } = useMemo(() => createStyles(colors), [colors]);

  return (
    <View
      style={[styles.card, tintBackground[tint]]}
      accessible
      accessibilityRole="text"
      accessibilityLabel={`${value} ${caption}`}
    >
      <Text style={[styles.value, tintText[tint]]}>{value}</Text>
      <Text style={styles.caption}>{caption}</Text>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  const styles = StyleSheet.create({
    card: {
      flex: 1,
      borderRadius: radius.card,
      padding: spacing.lg,
      gap: spacing.xs,
    },
    value: {
      fontSize: fontSize.displayLg,
      fontFamily: typography.display.fontFamily,
      fontWeight: typography.display.fontWeight,
    },
    caption: {
      fontSize: fontSize.bodySm,
      fontFamily: typography.caption.fontFamily,
      color: colors.textSecondary,
    },
  });

  const tintBackground = StyleSheet.create({
    primary: { backgroundColor: colors.primaryTint },
    danger: { backgroundColor: colors.dangerTint },
    warning: { backgroundColor: colors.warningTint },
  });

  const tintText = StyleSheet.create({
    primary: { color: colors.primaryDark },
    danger: { color: colors.dangerDark },
    warning: { color: colors.warningDark },
  });

  return { styles, tintBackground, tintText };
}
