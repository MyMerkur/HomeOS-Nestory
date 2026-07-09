import type { ComponentType } from 'react';
import { useEffect, useRef } from 'react';
import { Animated, Dimensions, Modal, Pressable, StyleSheet, Text } from 'react-native';
import { fontSize, radius, spacing, typography, type ThemeColors } from '../theme/theme';

type IconProps = { color: string; size: number };

export type SideMenuItem = {
  testID: string;
  label: string;
  icon: ComponentType<IconProps>;
  onPress: () => void;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  items: SideMenuItem[];
  colors: ThemeColors;
};

const PANEL_WIDTH = Math.min(Dimensions.get('window').width * 0.78, 320);

export function SideMenu({ visible, onClose, items, colors }: Props) {
  const translateX = useRef(new Animated.Value(-PANEL_WIDTH)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: visible ? 0 : -PANEL_WIDTH,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: visible ? 1 : 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible, translateX, backdropOpacity]);

  const styles = createStyles(colors);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Pressable testID="side-menu-backdrop" style={styles.flex} onPress={onClose}>
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} />
      </Pressable>
      <Animated.View
        testID="side-menu-panel"
        style={[styles.panel, { transform: [{ translateX }] }]}
      >
        {items.map((item) => (
          <Pressable
            key={item.testID}
            testID={item.testID}
            style={styles.item}
            onPress={() => {
              onClose();
              item.onPress();
            }}
          >
            <item.icon color={colors.primary} size={22} />
            <Text style={styles.itemLabel}>{item.label}</Text>
          </Pressable>
        ))}
      </Animated.View>
    </Modal>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    flex: { flex: 1 },
    backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
    panel: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: PANEL_WIDTH,
      backgroundColor: colors.surface,
      paddingTop: spacing.xxl,
      paddingHorizontal: spacing.md,
      gap: spacing.xs,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.sm,
      borderRadius: radius.md,
    },
    itemLabel: {
      fontSize: fontSize.bodyLg,
      fontFamily: typography.bodyMedium.fontFamily,
      fontWeight: typography.bodyMedium.fontWeight,
      color: colors.textPrimary,
    },
  });
}
