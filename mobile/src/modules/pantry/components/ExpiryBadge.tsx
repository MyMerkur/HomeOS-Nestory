import { StyleSheet, Text, View } from 'react-native';

type Props = {
  expiryDate: string | null;
};

function daysLeftFrom(expiryDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  return Math.round((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

// Handbook 7.2: bugün/1-3 gün/7 gün/güvenli renk kodlaması.
export function ExpiryBadge({ expiryDate }: Props) {
  if (!expiryDate) {
    return (
      <View style={[styles.badge, styles.neutral]}>
        <Text style={styles.text}>SKT yok</Text>
      </View>
    );
  }

  const daysLeft = daysLeftFrom(expiryDate);

  if (daysLeft < 0) {
    return (
      <View style={[styles.badge, styles.expired]}>
        <Text style={styles.text}>Süresi geçti</Text>
      </View>
    );
  }
  if (daysLeft === 0) {
    return (
      <View style={[styles.badge, styles.today]}>
        <Text style={styles.text}>Bugün</Text>
      </View>
    );
  }
  if (daysLeft <= 3) {
    return (
      <View style={[styles.badge, styles.soon]}>
        <Text style={styles.text}>{daysLeft} gün</Text>
      </View>
    );
  }
  if (daysLeft <= 7) {
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
