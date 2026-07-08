import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { fontSize, radius, spacing, typography, type ThemeColors } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';

type Option = {
  value: string;
  label: string;
  testID?: string;
};

type Props = {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
};

export function SegmentedControl({ options, value, onChange }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.track}>
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <Pressable
            key={option.value}
            testID={option.testID}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            onPress={() => onChange(option.value)}
            style={[styles.segment, isActive && styles.segmentActive]}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    track: {
      flexDirection: 'row',
      borderRadius: radius.md,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.borderStrong,
      padding: spacing.xs / 2,
    },
    segment: {
      flex: 1,
      minHeight: 36,
      borderRadius: radius.sm,
      alignItems: 'center',
      justifyContent: 'center',
    },
    segmentActive: {
      backgroundColor: colors.primary,
    },
    label: {
      fontSize: fontSize.bodyMd,
      fontFamily: typography.bodyMedium.fontFamily,
      fontWeight: typography.bodyMedium.fontWeight,
      color: colors.textSecondary,
    },
    labelActive: {
      color: colors.white,
    },
  });
}
