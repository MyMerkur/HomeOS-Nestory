import { useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { IconPlus, IconPackageOff } from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';
import { useHomeStore } from '../../../store/useHomeStore';
import { ItemCard } from '../components/ItemCard';
import { Button } from '../../../ui/Button';
import { Chip } from '../../../ui/Chip';
import { EmptyState } from '../../../ui/EmptyState';
import { FAB } from '../../../ui/FAB';
import { Skeleton } from '../../../ui/Skeleton';
import { TextField } from '../../../ui/TextField';
import { spacing, type ThemeColors } from '../../../theme/theme';
import { useTheme } from '../../../theme/ThemeContext';
import { useLocationsQuery } from '../hooks/useLocationsQuery';
import { INVENTORY_ITEMS_QUERY_KEY, useInventoryItemsQuery } from '../hooks/useInventoryItemsQuery';
import { SHOPPING_ITEMS_QUERY_KEY } from '../../shopping/hooks/useShoppingItemsQuery';
import {
  addToShopping,
  consumeItem,
  discardItem,
  freezeItem,
  type InventoryItem,
} from '../services/pantryApi';
import type { PantryStackScreenProps } from '../../../app/navigation/types';

const ALL_LOCATIONS = null;

function PantrySkeleton({ styles }: { styles: ReturnType<typeof createStyles> }) {
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Skeleton height={44} radius={12} />
      </View>
      <View style={styles.tabsRow}>
        {[0, 1, 2].map((key) => (
          <Skeleton key={key} width={80} height={32} radius={16} />
        ))}
      </View>
      <View style={styles.list}>
        <Skeleton height={64} style={styles.rowSkeleton} />
        <Skeleton height={64} style={styles.rowSkeleton} />
        <Skeleton height={64} style={styles.rowSkeleton} />
        <Skeleton height={64} style={styles.rowSkeleton} />
      </View>
    </View>
  );
}

export function PantryScreen({ navigation }: PantryStackScreenProps<'Pantry'>) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const homeId = useHomeStore((state) => state.selectedHomeId) as string;
  const queryClient = useQueryClient();
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(ALL_LOCATIONS);
  const [search, setSearch] = useState('');

  const { data: locations } = useLocationsQuery();
  const {
    data: itemsResult,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useInventoryItemsQuery({
    locationId: selectedLocationId ?? undefined,
    search: search.trim() || undefined,
    limit: 50,
  });

  const handleItemAction = (item: InventoryItem) => {
    Alert.alert(item.name, undefined, [
      {
        text: t('pantry.actions.consumed'),
        onPress: async () => {
          await consumeItem(homeId, item.id);
          await queryClient.invalidateQueries({ queryKey: [INVENTORY_ITEMS_QUERY_KEY] });
        },
      },
      {
        text: t('pantry.actions.discarded'),
        onPress: async () => {
          await discardItem(homeId, item.id);
          await queryClient.invalidateQueries({ queryKey: [INVENTORY_ITEMS_QUERY_KEY] });
        },
      },
      {
        text: t('pantry.actions.frozen'),
        onPress: async () => {
          await freezeItem(homeId, item.id);
          await queryClient.invalidateQueries({ queryKey: [INVENTORY_ITEMS_QUERY_KEY] });
        },
      },
      {
        text: t('pantry.actions.addToShopping'),
        onPress: async () => {
          await addToShopping(homeId, item.id);
          await queryClient.invalidateQueries({ queryKey: [SHOPPING_ITEMS_QUERY_KEY] });
        },
      },
      { text: t('pantry.actions.cancel'), style: 'cancel' },
    ]);
  };

  if (isLoading) {
    return <PantrySkeleton styles={styles} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        testID="pantry-list"
        data={itemsResult?.items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshing={isRefetching}
        onRefresh={refetch}
        ListHeaderComponent={
          <>
            <View style={styles.searchContainer}>
              <TextField
                testID="pantry-search"
                label={t('pantry.searchPlaceholder')}
                hideLabel
                placeholder={t('pantry.searchPlaceholder')}
                value={search}
                onChangeText={setSearch}
              />
            </View>

            <View style={styles.tabsRow}>
              <Chip
                testID="location-tab-all"
                label={t('pantry.tabAll')}
                selected={selectedLocationId === ALL_LOCATIONS}
                onPress={() => setSelectedLocationId(ALL_LOCATIONS)}
              />
              {(locations ?? []).map((location) => (
                <Chip
                  key={location.id}
                  testID={`location-tab-${location.id}`}
                  label={location.name}
                  selected={selectedLocationId === location.id}
                  onPress={() => setSelectedLocationId(location.id)}
                />
              ))}
            </View>
          </>
        }
        ListEmptyComponent={
          isError ? (
            <View style={styles.centered}>
              <Text style={styles.error}>{t('pantry.errorLoad')}</Text>
              <Button label={t('common.retry')} onPress={() => refetch()} variant="outline" />
            </View>
          ) : (
            <EmptyState icon={IconPackageOff} title={t('pantry.emptyView')} />
          )
        }
        renderItem={({ item }) => (
          <ItemCard
            item={item}
            onPress={() => navigation.navigate('ItemForm', { itemId: item.id })}
            onLongPress={() => handleItemAction(item)}
          />
        )}
      />

      <View style={styles.quickActions}>
        <Button
          testID="receipt-scan-button"
          label={t('pantry.receiptScanButton')}
          onPress={() => navigation.navigate('ReceiptScan')}
          variant="outline"
        />
        <Button
          testID="quick-add-barcode-button"
          label={t('pantry.barcodeButton')}
          onPress={() => navigation.navigate('QuickAddItem')}
          variant="outline"
        />
      </View>

      <FAB
        testID="add-item-button"
        icon={IconPlus}
        accessibilityLabel={t('pantry.addItemA11y')}
        onPress={() => navigation.navigate('ItemForm', undefined)}
      />
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    searchContainer: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
    tabsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.sm,
      gap: spacing.sm,
    },
    centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.xl,
      gap: spacing.md,
    },
    error: { color: colors.dangerDark },
    list: { paddingHorizontal: spacing.lg },
    rowSkeleton: { marginBottom: spacing.sm },
    quickActions: {
      position: 'absolute',
      right: spacing.lg,
      bottom: 88,
      gap: spacing.sm,
      alignItems: 'flex-end',
    },
  });
}
