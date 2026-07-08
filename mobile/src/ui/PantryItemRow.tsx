import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { IconChevronRight } from '@tabler/icons-react-native';
import { fontSize, spacing, typography, type ThemeColors } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';
import { FreshnessRing } from './FreshnessRing';

type Props = {
  name: string;
  subtitle: string;
  daysUntilExpiry: number | null;
  onPress?: () => void;
  onLongPress?: () => void;
  testID?: string;
};

export function PantryItemRow({
  name,
  subtitle,
  daysUntilExpiry,
  onPress,
  onLongPress,
  testID,
}: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Pressable
      testID={testID}
      accessibilityRole={onPress ? 'button' : undefined}
      onPress={onPress}
      onLongPress={onLongPress}
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

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
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
}
