import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import { fontSize, freshnessColor, typography, type ThemeColors } from '../theme/theme';
import { useTheme } from '../theme/ThemeContext';

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
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { diameter, stroke } = DIMENSIONS[size];
  const radius = (diameter - stroke) / 2;
  const center = diameter / 2;
  const color = freshnessColor(daysUntilExpiry, colors);

  return (
    <View
      style={{ width: diameter, height: diameter }}
      accessible
      accessibilityRole="text"
      accessibilityLabel={`${Math.max(daysUntilExpiry, 0)} ${t('common.daysLeftCaption')}`}
    >
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
          <Text style={styles.labelCaption}>{t('common.daysLeftCaption')}</Text>
        </View>
      ) : null}
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
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
}
