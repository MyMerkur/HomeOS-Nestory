import type { PropsWithChildren } from 'react';
import { useMemo } from 'react';
import type { ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { radius, spacing, type ThemeColors } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';

type Props = PropsWithChildren<{
  style?: ViewStyle;
  tint?: 'default' | 'primary' | 'danger' | 'warning';
  testID?: string;
}>;

export function Card({ children, style, tint = 'default', testID }: Props) {
  const { colors } = useTheme();
  const { styles, tintStyles } = useMemo(() => createStyles(colors), [colors]);

  return (
    <View testID={testID} style={[styles.base, tintStyles[tint], style]}>
      {children}
    </View>
  );
}

function createStyles(colors: ThemeColors) {
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

  return { styles, tintStyles };
}
