import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { IconMoodEmpty } from '@tabler/icons-react-native';
import { ItemCard } from '../../pantry/components/ItemCard';
import { Chip } from '../../../ui/Chip';
import { EmptyState } from '../../../ui/EmptyState';
import { SummaryCard } from '../../../ui/SummaryCard';
import { colors, fontSize, spacing, typography } from '../../../theme/theme';
import { useDashboardQuery } from '../hooks/useDashboardQuery';
import type { DashboardStackScreenProps } from '../../../app/navigation/types';

export function DashboardScreen({ navigation }: DashboardStackScreenProps<'Dashboard'>) {
  const { data, isLoading, isError } = useDashboardQuery();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} />
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
        <Chip testID="go-to-badges" label="Rozetlerim" onPress={() => navigation.navigate('Badges')} />
        <Chip
          testID="go-to-medicines"
          label="İlaçlarım"
          onPress={() => navigation.navigate('Medicines')}
        />
        <Chip testID="go-to-assets" label="Varlıklarım" onPress={() => navigation.navigate('Assets')} />
        <Chip testID="go-to-family" label="Ailem" onPress={() => navigation.navigate('Family')} />
        <Chip testID="go-to-settings" label="Ayarlar" onPress={() => navigation.navigate('Settings')} />
      </View>

      <View style={styles.summaryRow}>
        <SummaryCard value={data.expiringToday} caption="Bugün" tint="danger" />
        <SummaryCard value={data.expiringIn3Days} caption="3 gün" tint="warning" />
        <SummaryCard value={data.expiringInWeek} caption="Hafta" tint="warning" />
        <SummaryCard value={data.totalActive} caption="Toplam" tint="primary" />
      </View>

      <Text style={styles.sectionTitle}>Yaklaşan ürünler</Text>

      {data.upcomingItems.length === 0 ? (
        <EmptyState icon={IconMoodEmpty} title="Yaklaşan SKT'si olan ürün yok." />
      ) : (
        <FlatList
          data={data.upcomingItems}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
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
  container: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  error: {
    fontSize: fontSize.bodyMd,
    fontFamily: typography.body.fontFamily,
    color: colors.textSecondary,
  },
  shortcutsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    margin: spacing.md,
  },
  summaryRow: { flexDirection: 'row', paddingHorizontal: spacing.md, gap: spacing.sm },
  sectionTitle: {
    fontSize: fontSize.bodyMd,
    fontFamily: typography.heading.fontFamily,
    fontWeight: typography.heading.fontWeight,
    color: colors.textPrimary,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  list: { paddingHorizontal: spacing.lg },
});
