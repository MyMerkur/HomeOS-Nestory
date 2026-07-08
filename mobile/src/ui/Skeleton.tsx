import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, type DimensionValue, type ViewStyle } from 'react-native';
import { radius } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';

type Props = {
  width?: DimensionValue;
  height?: DimensionValue;
  radius?: number;
  style?: ViewStyle;
};

export function Skeleton({ width = '100%', height = 16, radius: cornerRadius = radius.sm, style }: Props) {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return (
    <Animated.View
      testID="skeleton"
      style={[
        styles.base,
        { width, height, borderRadius: cornerRadius, backgroundColor: colors.border, opacity },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
});
