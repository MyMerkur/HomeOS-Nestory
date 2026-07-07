import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors, fontSize, freshnessColor, typography } from '../theme/theme';

type Size = 'small' | 'large';

type Props = {
  daysUntilExpiry: number;
  size?: Size;
};

const DIMENSIONS: Record<Size, { diameter: number; stroke: number }> = {
  small: { diameter: 28, stroke: 4 },
  large: { diameter: 120, stroke: 10 },
};

export function FreshnessRing({ daysUntilExpiry, size = 'small' }: Props) {
  const { diameter, stroke } = DIMENSIONS[size];
  const radius = (diameter - stroke) / 2;
  const center = diameter / 2;
  const color = freshnessColor(daysUntilExpiry);

  return (
    <View style={{ width: diameter, height: diameter }}>
      <Svg width={diameter} height={diameter}>
        <Circle cx={center} cy={center} r={radius} stroke={colors.border} strokeWidth={stroke} fill="none" />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
        />
      </Svg>
      {size === 'large' ? (
        <View style={[styles.labelContainer, { width: diameter, height: diameter }]}>
          <Text style={styles.labelValue}>{Math.max(daysUntilExpiry, 0)}</Text>
          <Text style={styles.labelCaption}>gün kaldı</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  labelContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelValue: {
    fontSize: fontSize.displayLg,
    fontFamily: typography.display.fontFamily,
    fontWeight: typography.display.fontWeight,
    color: colors.textPrimary,
  },
  labelCaption: {
    fontSize: fontSize.caption,
    fontFamily: typography.caption.fontFamily,
    color: colors.textSecondary,
  },
});
