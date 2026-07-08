import { useQueryClient } from '@tanstack/react-query';
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { IconDevicesOff, IconPlus } from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';
import { WarrantyBadge } from '../components/WarrantyBadge';
import { ASSETS_QUERY_KEY, useAssetsQuery } from '../hooks/useAssetsQuery';
import { deleteAsset, updateAsset, type Asset } from '../services/assetApi';
import { EmptyState } from '../../../ui/EmptyState';
import { FAB } from '../../../ui/FAB';
import { colors, fontSize, spacing, typography } from '../../../theme/theme';
import { useHomeStore } from '../../../store/useHomeStore';
import type { DashboardStackScreenProps } from '../../../app/navigation/types';

function AssetCard({ asset, onPress, onLongPress }: { asset: Asset; onPress: () => void; onLongPress: () => void }) {
  const { t } = useTranslation();
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
          {t(`assets.categories.${asset.category}`)}
          {asset.room ? ` · ${asset.room}` : ''}
        </Text>
      </View>
      <WarrantyBadge warrantyEndDate={asset.warrantyEndDate} />
    </Pressable>
  );
}

export function AssetsScreen({ navigation }: DashboardStackScreenProps<'Assets'>) {
  const { t } = useTranslation();
  const homeId = useHomeStore((state) => state.selectedHomeId) as string;
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useAssetsQuery({ status: 'active', limit: 100 });

  const handleAssetAction = (asset: Asset) => {
    Alert.alert(asset.name, undefined, [
      {
        text: t('assets.archiveAction'),
        onPress: async () => {
          await updateAsset(homeId, asset.id, { status: 'archived' });
          await queryClient.invalidateQueries({ queryKey: [ASSETS_QUERY_KEY] });
        },
      },
      {
        text: t('assets.deleteAction'),
        style: 'destructive',
        onPress: async () => {
          await deleteAsset(homeId, asset.id);
          await queryClient.invalidateQueries({ queryKey: [ASSETS_QUERY_KEY] });
        },
      },
      { text: t('assets.cancelAction'), style: 'cancel' },
    ]);
  };

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
        <Text style={styles.error}>{t('assets.errorLoad')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {data.assets.length === 0 ? (
        <EmptyState icon={IconDevicesOff} title={t('assets.emptyList')} />
      ) : (
        <FlatList
          data={data.assets}
          keyExtractor={(asset) => asset.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <AssetCard
              asset={item}
              onPress={() => navigation.navigate('AssetForm', { assetId: item.id })}
              onLongPress={() => handleAssetAction(item)}
            />
          )}
        />
      )}

      <FAB
        testID="add-asset-button"
        icon={IconPlus}
        accessibilityLabel={t('assets.addA11y')}
        onPress={() => navigation.navigate('AssetForm', undefined)}
      />
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
  list: { paddingHorizontal: spacing.lg },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    minHeight: 44,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  info: { flex: 1, gap: 2 },
  name: {
    fontSize: fontSize.bodyMd,
    fontFamily: typography.bodyMedium.fontFamily,
    fontWeight: typography.bodyMedium.fontWeight,
    color: colors.textPrimary,
  },
  meta: {
    fontSize: fontSize.bodySm,
    fontFamily: typography.caption.fontFamily,
    color: colors.textSecondary,
  },
});
