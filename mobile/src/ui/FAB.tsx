import type { ComponentType } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../theme/theme';

type IconProps = { color: string; size: number };

type Props = {
  icon: ComponentType<IconProps>;
  onPress: () => void;
  accessibilityLabel: string;
  testID?: string;
};

export function FAB({ icon: Icon, onPress, accessibilityLabel, testID }: Props) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [styles.fab, pressed && styles.pressed]}
    >
      <Icon color={colors.white} size={26} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  pressed: {
    opacity: 0.85,
  },
});
