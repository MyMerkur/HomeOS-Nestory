import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { ItemCard } from '../../pantry/components/ItemCard';
import { useDashboardQuery } from '../hooks/useDashboardQuery';
import type { DashboardStackScreenProps } from '../../../app/navigation/types';

export function DashboardScreen({ navigation }: DashboardStackScreenProps<'Dashboard'>) {
  const { data, isLoading, isError } = useDashboardQuery();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Özet bilgiler yüklenemedi.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.shortcutsRow}>
        <Pressable
          testID="go-to-badges"
          style={styles.badgesButton}
          onPress={() => navigation.navigate('Badges')}
        >
          <Text style={styles.badgesButtonText}>Rozetlerim</Text>
        </Pressable>
        <Pressable
          testID="go-to-medicines"
          style={styles.badgesButton}
          onPress={() => navigation.navigate('Medicines')}
        >
          <Text style={styles.badgesButtonText}>İlaçlarım</Text>
        </Pressable>
      </View>

      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, styles.today]}>
          <Text style={styles.summaryValue}>{data.expiringToday}</Text>
          <Text style={styles.summaryLabel}>Bugün</Text>
        </View>
        <View style={[styles.summaryCard, styles.soon]}>
          <Text style={styles.summaryValue}>{data.expiringIn3Days}</Text>
          <Text style={styles.summaryLabel}>3 gün</Text>
        </View>
        <View style={[styles.summaryCard, styles.week]}>
          <Text style={styles.summaryValue}>{data.expiringInWeek}</Text>
          <Text style={styles.summaryLabel}>Hafta</Text>
        </View>
        <View style={[styles.summaryCard, styles.total]}>
          <Text style={styles.summaryValue}>{data.totalActive}</Text>
          <Text style={styles.summaryLabel}>Toplam</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Yaklaşan ürünler</Text>

      {data.upcomingItems.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.empty}>Yaklaşan SKT'si olan ürün yok.</Text>
        </View>
      ) : (
        <FlatList
          data={data.upcomingItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ItemCard
              item={item}
              onPress={() =>
                navigation.navigate('PantryTab', { screen: 'ItemForm', params: { itemId: item.id } })
              }
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  error: { color: '#c0392b' },
  empty: { color: '#666' },
  summaryRow: { flexDirection: 'row', padding: 12, gap: 8 },
  summaryCard: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 4,
  },
  summaryValue: { fontSize: 22, fontWeight: '700', color: '#fff' },
  summaryLabel: { fontSize: 12, color: '#fff' },
  today: { backgroundColor: '#c0392b' },
  soon: { backgroundColor: '#e67e22' },
  week: { backgroundColor: '#f1c40f' },
  total: { backgroundColor: '#1d76db' },
  sectionTitle: { fontSize: 15, fontWeight: '600', paddingHorizontal: 16, marginBottom: 4 },
  shortcutsRow: { flexDirection: 'row', gap: 8, margin: 12 },
  badgesButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  badgesButtonText: { fontSize: 13, fontWeight: '600', color: '#333' },
});
