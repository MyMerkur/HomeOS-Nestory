import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { fontSize, radius, spacing, typography } from '../theme/theme';

export type ToastVariant = 'success' | 'error' | 'info';

type Props = {
  message: string;
  variant: ToastVariant;
};

// Toasts intentionally use fixed dark chip colors regardless of the app's
// light/dark theme (the same convention as Material Snackbar) — the reactive
// theme palette's "dark" shades invert meaning between modes and aren't
// suitable for an always-dark-chip/white-text toast.
export function Toast({ message, variant }: Props) {
  const translateY = useRef(new Animated.Value(40)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  }, [translateY, opacity]);

  return (
    <Animated.View
      testID="toast"
      style={[styles.container, styles[variant], { transform: [{ translateY }], opacity }]}
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.xxl,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  text: {
    fontSize: fontSize.bodyMd,
    fontFamily: typography.bodyMedium.fontFamily,
    fontWeight: typography.bodyMedium.fontWeight,
    color: '#FFFFFF',
  },
  success: { backgroundColor: '#2C4A30' },
  error: { backgroundColor: '#8C3323' },
  info: { backgroundColor: '#24312A' },
});
