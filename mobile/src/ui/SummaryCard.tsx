import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, radius, spacing, typography } from '../theme/theme';

type Tint = 'primary' | 'danger' | 'warning';

type Props = {
  value: number | string;
  caption: string;
  tint: Tint;
};

export function SummaryCard({ value, caption, tint }: Props) {
  return (
    <View style={[styles.card, tintBackground[tint]]}>
      <Text style={[styles.value, tintText[tint]]}>{value}</Text>
      <Text style={styles.caption}>{caption}</Text>
    </View>
  );
}

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
