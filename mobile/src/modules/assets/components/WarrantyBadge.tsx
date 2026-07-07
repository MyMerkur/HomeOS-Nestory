import { StyleSheet, Text, View } from 'react-native';

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
// from ExpiryBadge's food-oriented ones (matches Asset's own default
// reminderDaysBefore [30, 7, 1, 0]).
export function WarrantyBadge({ warrantyEndDate }: Props) {
  if (!warrantyEndDate) {
    return (
      <View style={[styles.badge, styles.neutral]}>
        <Text style={styles.text}>Garanti yok</Text>
      </View>
    );
  }

  const daysLeft = daysLeftFrom(warrantyEndDate);

  if (daysLeft < 0) {
    return (
      <View style={[styles.badge, styles.expired]}>
        <Text style={styles.text}>Garantisi bitti</Text>
      </View>
    );
  }
  if (daysLeft === 0) {
    return (
      <View style={[styles.badge, styles.today]}>
        <Text style={styles.text}>Bugün bitiyor</Text>
      </View>
    );
  }
  if (daysLeft <= 7) {
    return (
      <View style={[styles.badge, styles.soon]}>
        <Text style={styles.text}>{daysLeft} gün</Text>
      </View>
    );
  }
  if (daysLeft <= 30) {
    return (
      <View style={[styles.badge, styles.week]}>
        <Text style={styles.text}>{daysLeft} gün</Text>
      </View>
    );
  }
  return (
    <View style={[styles.badge, styles.safe]}>
      <Text style={styles.text}>{daysLeft} gün</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  text: { fontSize: 12, fontWeight: '600', color: '#fff' },
  neutral: { backgroundColor: '#9e9e9e' },
  expired: { backgroundColor: '#7f1d1d' },
  today: { backgroundColor: '#c0392b' },
  soon: { backgroundColor: '#e67e22' },
  week: { backgroundColor: '#f1c40f' },
  safe: { backgroundColor: '#27ae60' },
});
