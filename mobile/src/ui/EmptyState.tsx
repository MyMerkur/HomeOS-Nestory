import type { ComponentType } from 'react';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { fontSize, spacing, typography, type ThemeColors } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';
import { Button } from './Button';

type IconProps = { color: string; size: number };

type Props = {
  icon: ComponentType<IconProps>;
  title: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ icon: Icon, title, actionLabel, onAction }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <View style={styles.content} accessible accessibilityRole="text" accessibilityLabel={title}>
        <Icon color={colors.textMuted} size={40} />
        <Text style={styles.title}>{title}</Text>
      </View>
      {actionLabel && onAction ? (
        <View style={styles.action}>
          <Button label={actionLabel} onPress={onAction} variant="secondary" />
        </View>
      ) : null}
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.xxl,
      paddingHorizontal: spacing.lg,
      gap: spacing.md,
    },
    content: {
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.md,
    },
    title: {
      fontSize: fontSize.bodyMd,
      fontFamily: typography.body.fontFamily,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    action: {
      marginTop: spacing.xs,
    },
  });
}
