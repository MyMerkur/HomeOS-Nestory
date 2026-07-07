import { useQueryClient } from '@tanstack/react-query';
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { ASSET_CATEGORY_LABELS } from '../constants';
import { WarrantyBadge } from '../components/WarrantyBadge';
import { ASSETS_QUERY_KEY, useAssetsQuery } from '../hooks/useAssetsQuery';
import { deleteAsset, updateAsset, type Asset } from '../services/assetApi';
import { useHomeStore } from '../../../store/useHomeStore';
import type { DashboardStackScreenProps } from '../../../app/navigation/types';

function AssetCard({ asset, onPress, onLongPress }: { asset: Asset; onPress: () => void; onLongPress: () => void }) {
  return (
    <Pressable
      testID={`asset-card-${asset.id}`}
      style={styles.card}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <View style={styles.info}>
        <Text style={styles.name}>{asset.name}</Text>
        <Text style={styles.meta}>
          {ASSET_CATEGORY_LABELS[asset.category]}
          {asset.room ? ` · ${asset.room}` : ''}
        </Text>
      </View>
      <WarrantyBadge warrantyEndDate={asset.warrantyEndDate} />
    </Pressable>
  );
}

export function AssetsScreen({ navigation }: DashboardStackScreenProps<'Assets'>) {
  const homeId = useHomeStore((state) => state.selectedHomeId) as string;
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useAssetsQuery({ status: 'active', limit: 100 });

  const handleAssetAction = (asset: Asset) => {
    Alert.alert(asset.name, undefined, [
      {
        text: 'Arşivle',
        onPress: async () => {
          await updateAsset(homeId, asset.id, { status: 'archived' });
          await queryClient.invalidateQueries({ queryKey: [ASSETS_QUERY_KEY] });
        },
      },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: async () => {
          await deleteAsset(homeId, asset.id);
          await queryClient.invalidateQueries({ queryKey: [ASSETS_QUERY_KEY] });
        },
      },
      { text: 'İptal', style: 'cancel' },
    ]);
  };

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
        <Text style={styles.error}>Eşyalar yüklenemedi.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {data.assets.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.empty}>Henüz kayıtlı bir eşya yok.</Text>
        </View>
      ) : (
        <FlatList
          data={data.assets}
          keyExtractor={(asset) => asset.id}
          renderItem={({ item }) => (
            <AssetCard
              asset={item}
              onPress={() => navigation.navigate('AssetForm', { assetId: item.id })}
              onLongPress={() => handleAssetAction(item)}
            />
          )}
        />
      )}

      <Pressable
        testID="add-asset-button"
        style={styles.fab}
        onPress={() => navigation.navigate('AssetForm', undefined)}
      >
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  error: { color: '#c0392b' },
  empty: { color: '#666' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  info: { flex: 1, gap: 2 },
  name: { fontSize: 16, fontWeight: '600' },
  meta: { fontSize: 13, color: '#666' },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1d76db',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  fabText: { color: '#fff', fontSize: 28, lineHeight: 30 },
});
