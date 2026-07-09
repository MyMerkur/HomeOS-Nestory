import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { fontSize, radius, spacing, typography, type ThemeColors } from '../../../theme/theme';
import { useTheme } from '../../../theme/ThemeContext';
import type { Bill } from '../services/billApi';

type Props = {
  status: Bill['status'];
  dueDate: string;
};

function daysUntil(dueDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  return Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function BillStatusBadge({ status, dueDate }: Props) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  if (status === 'paid') {
    return (
      <View style={[styles.badge, styles.paid]}>
        <Text style={[styles.text, styles.textPaid]}>{t('bills.status.paid')}</Text>
      </View>
    );
  }

  const daysLeft = daysUntil(dueDate);

  if (daysLeft < 0) {
    return (
      <View style={[styles.badge, styles.overdue]}>
        <Text style={[styles.text, styles.textOnDark]}>{t('bills.status.overdue')}</Text>
      </View>
    );
  }
  if (daysLeft <= 3) {
    return (
      <View style={[styles.badge, styles.soon]}>
        <Text style={[styles.text, styles.textWarning]}>{t('bills.status.daysLeft', { count: daysLeft })}</Text>
      </View>
    );
  }
  return (
    <View style={[styles.badge, styles.neutral]}>
      <Text style={[styles.text, styles.textNeutral]}>{t('bills.status.daysLeft', { count: daysLeft })}</Text>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
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
    overdue: { backgroundColor: colors.dangerDark },
    textOnDark: { color: colors.white },
    soon: { backgroundColor: colors.warningTint },
    textWarning: { color: colors.warningDark },
    paid: { backgroundColor: colors.primaryTint },
    textPaid: { color: colors.primaryDark },
  });
}
