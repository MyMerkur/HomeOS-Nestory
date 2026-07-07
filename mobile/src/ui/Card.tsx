import type { PropsWithChildren } from 'react';
import type { ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '../theme/theme';

type Props = PropsWithChildren<{
  style?: ViewStyle;
  tint?: 'default' | 'primary' | 'danger' | 'warning';
}>;

export function Card({ children, style, tint = 'default' }: Props) {
  return <View style={[styles.base, tintStyles[tint], style]}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.lg,
  },
});

const tintStyles = StyleSheet.create({
  default: {},
  primary: { backgroundColor: colors.primaryTint },
  danger: { backgroundColor: colors.dangerTint },
  warning: { backgroundColor: colors.warningTint },
});
