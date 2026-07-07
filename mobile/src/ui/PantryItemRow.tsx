import { Pressable, StyleSheet, Text, View } from 'react-native';
import { IconChevronRight } from '@tabler/icons-react-native';
import { colors, fontSize, spacing, typography } from '../theme/theme';
import { FreshnessRing } from './FreshnessRing';

type Props = {
  name: string;
  subtitle: string;
  daysUntilExpiry: number | null;
  onPress?: () => void;
};

export function PantryItemRow({ name, subtitle, daysUntilExpiry, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && onPress && styles.pressed]}
    >
      {daysUntilExpiry !== null ? (
        <FreshnessRing daysUntilExpiry={daysUntilExpiry} size="small" />
      ) : (
        <View style={styles.ringPlaceholder} />
      )}
      <View style={styles.textContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>
      {onPress ? <IconChevronRight color={colors.textMuted} size={20} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 44,
  },
  pressed: {
    opacity: 0.7,
  },
  ringPlaceholder: {
    width: 28,
    height: 28,
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: fontSize.bodyMd,
    fontFamily: typography.bodyMedium.fontFamily,
    fontWeight: typography.bodyMedium.fontWeight,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: fontSize.bodySm,
    fontFamily: typography.caption.fontFamily,
    color: colors.textSecondary,
  },
});
