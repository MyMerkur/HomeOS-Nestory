import type { ComponentType } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, spacing, typography } from '../theme/theme';
import { Button } from './Button';

type IconProps = { color: string; size: number };

type Props = {
  icon: ComponentType<IconProps>;
  title: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ icon: Icon, title, actionLabel, onAction }: Props) {
  return (
    <View style={styles.container}>
      <Icon color={colors.textMuted} size={40} />
      <Text style={styles.title}>{title}</Text>
      {actionLabel && onAction ? (
        <View style={styles.action}>
          <Button label={actionLabel} onPress={onAction} variant="secondary" />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
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
