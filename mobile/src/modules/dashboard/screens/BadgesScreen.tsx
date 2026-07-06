import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useBadgesQuery } from '../hooks/useBadgesQuery';
import type { Badge } from '../services/badgeApi';

function BadgeCard({ badge }: { badge: Badge }) {
  return (
    <View style={[styles.card, badge.earned && styles.cardEarned]}>
      <View style={styles.info}>
        <Text style={[styles.name, badge.earned && styles.nameEarned]}>
          {badge.earned ? '✓ ' : ''}
          {badge.name}
        </Text>
        <Text style={styles.description}>{badge.description}</Text>
      </View>
      <Text style={styles.progress}>
        {badge.progress}/{badge.target}
      </Text>
    </View>
  );
}

export function BadgesScreen() {
  const { data: badges, isLoading, isError } = useBadgesQuery();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  }

  if (isError || !badges) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Rozetler yüklenemedi.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={badges}
      keyExtractor={(badge) => badge.id}
      renderItem={({ item }) => <BadgeCard badge={item} />}
    />
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  error: { color: '#c0392b' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f7f7f7',
  },
  cardEarned: { backgroundColor: '#eafaf1' },
  info: { flex: 1, gap: 2 },
  name: { fontSize: 16, fontWeight: '600', color: '#999' },
  nameEarned: { color: '#27ae60' },
  description: { fontSize: 13, color: '#666' },
  progress: { fontSize: 13, fontWeight: '600', color: '#333' },
});
