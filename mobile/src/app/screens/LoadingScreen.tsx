import { useEffect, useMemo, useRef } from 'react';
import { ActivityIndicator, Animated, StyleSheet, Text, View } from 'react-native';
import { fontSize, spacing, typography, type ThemeColors } from '../../theme/theme';
import { useTheme } from '../../theme/ThemeContext';

export function LoadingScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, [opacity]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity }]}>
        <Text style={styles.brand}>Nestory</Text>
        <ActivityIndicator color={colors.primary} style={styles.spinner} />
      </Animated.View>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
    },
    content: { alignItems: 'center' },
    brand: {
      fontSize: fontSize.displayLg,
      fontFamily: typography.display.fontFamily,
      fontWeight: typography.display.fontWeight,
      color: colors.primary,
      marginBottom: spacing.lg,
    },
    spinner: { marginTop: spacing.sm },
  });
}
