import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, fontSize, radius, spacing, typography } from '../../../theme/theme';

type Props = {
  warrantyEndDate: string | null;
};

function daysLeftFrom(warrantyEndDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endDate = new Date(warrantyEndDate);
  endDate.setHours(0, 0, 0, 0);
  return Math.round((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

// Warranty windows are months/years, not days, so thresholds are scaled up
// from FreshnessRing's food-oriented ones (matches Asset's own default
// reminderDaysBefore [30, 7, 1, 0]).
export function WarrantyBadge({ warrantyEndDate }: Props) {
  const { t } = useTranslation();

  if (!warrantyEndDate) {
    return (
      <View style={[styles.badge, styles.neutral]}>
        <Text style={[styles.text, styles.textNeutral]}>{t('assets.warranty.none')}</Text>
      </View>
    );
  }

  const daysLeft = daysLeftFrom(warrantyEndDate);

  if (daysLeft < 0) {
    return (
      <View style={[styles.badge, styles.expired]}>
        <Text style={[styles.text, styles.textOnDark]}>{t('assets.warranty.expired')}</Text>
      </View>
    );
  }
  if (daysLeft === 0) {
    return (
      <View style={[styles.badge, styles.today]}>
        <Text style={[styles.text, styles.textOnDark]}>{t('assets.warranty.today')}</Text>
      </View>
    );
  }
  if (daysLeft <= 7) {
    return (
      <View style={[styles.badge, styles.soon]}>
        <Text style={[styles.text, styles.textWarning]}>{t('assets.warranty.daysLeft', { count: daysLeft })}</Text>
      </View>
    );
  }
  if (daysLeft <= 30) {
    return (
      <View style={[styles.badge, styles.week]}>
        <Text style={[styles.text, styles.textWarning]}>{t('assets.warranty.daysLeft', { count: daysLeft })}</Text>
      </View>
    );
  }
  return (
    <View style={[styles.badge, styles.safe]}>
      <Text style={[styles.text, styles.textSafe]}>{t('assets.warranty.daysLeft', { count: daysLeft })}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: fontSize.bodySm,
    fontFamily: typography.bodyMedium.fontFamily,
    fontWeight: typography.bodyMedium.fontWeight,
  },
  neutral: { backgroundColor: colors.border },
  textNeutral: { color: colors.textSecondary },
  expired: { backgroundColor: colors.dangerDark },
  today: { backgroundColor: colors.danger },
  textOnDark: { color: colors.white },
  soon: { backgroundColor: colors.warningTint },
  week: { backgroundColor: colors.warningTint },
  textWarning: { color: colors.warningDark },
  safe: { backgroundColor: colors.primaryTint },
  textSafe: { color: colors.primaryDark },
});
