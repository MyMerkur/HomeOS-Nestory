import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { IconPlus, IconPackageOff } from '@tabler/icons-react-native';
import { useHomeStore } from '../../../store/useHomeStore';
import { ItemCard } from '../components/ItemCard';
import { Button } from '../../../ui/Button';
import { Chip } from '../../../ui/Chip';
import { EmptyState } from '../../../ui/EmptyState';
import { FAB } from '../../../ui/FAB';
import { TextField } from '../../../ui/TextField';
import { colors, spacing } from '../../../theme/theme';
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

export function PantryScreen({ navigation }: PantryStackScreenProps<'Pantry'>) {
  const homeId = useHomeStore((state) => state.selectedHomeId) as string;
  const queryClient = useQueryClient();
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(ALL_LOCATIONS);
  const [search, setSearch] = useState('');

  const { data: locations } = useLocationsQuery();
  const {
    data: itemsResult,
    isLoading,
    isError,
  } = useInventoryItemsQuery({
    locationId: selectedLocationId ?? undefined,
    search: search.trim() || undefined,
    limit: 50,
  });

  const handleItemAction = (item: InventoryItem) => {
    Alert.alert(item.name, undefined, [
      {
        text: 'Tükettim',
        onPress: async () => {
          await consumeItem(homeId, item.id);
          await queryClient.invalidateQueries({ queryKey: [INVENTORY_ITEMS_QUERY_KEY] });
        },
      },
      {
        text: 'Attım',
        onPress: async () => {
          await discardItem(homeId, item.id);
          await queryClient.invalidateQueries({ queryKey: [INVENTORY_ITEMS_QUERY_KEY] });
        },
      },
      {
        text: 'Dondurdum',
        onPress: async () => {
          await freezeItem(homeId, item.id);
          await queryClient.invalidateQueries({ queryKey: [INVENTORY_ITEMS_QUERY_KEY] });
        },
      },
      {
        text: 'Alışveriş listesine ekle',
        onPress: async () => {
          await addToShopping(homeId, item.id);
          await queryClient.invalidateQueries({ queryKey: [SHOPPING_ITEMS_QUERY_KEY] });
        },
      },
      { text: 'İptal', style: 'cancel' },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextField
          testID="pantry-search"
          label="Ürün ara"
          hideLabel
          placeholder="Ürün ara"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={styles.tabsRow}>
        <Chip
          testID="location-tab-all"
          label="Tümü"
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

      {isLoading && (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.primary} />
        </View>
      )}

      {isError && (
        <View style={styles.centered}>
          <Text style={styles.error}>Ürünler yüklenemedi.</Text>
        </View>
      )}

      {!isLoading && !isError && (itemsResult?.items.length ?? 0) === 0 && (
        <EmptyState icon={IconPackageOff} title="Bu görünümde henüz ürün yok." />
      )}

      {!isLoading && !isError && (itemsResult?.items.length ?? 0) > 0 && (
        <FlatList
          data={itemsResult?.items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <ItemCard
              item={item}
              onPress={() => navigation.navigate('ItemForm', { itemId: item.id })}
              onLongPress={() => handleItemAction(item)}
            />
          )}
        />
      )}

      <View style={styles.barcodeButton}>
        <Button
          testID="quick-add-barcode-button"
          label="Barkod"
          onPress={() => navigation.navigate('QuickAddItem')}
          variant="outline"
        />
      </View>

      <FAB
        testID="add-item-button"
        icon={IconPlus}
        accessibilityLabel="Ürün ekle"
        onPress={() => navigation.navigate('ItemForm', undefined)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  searchContainer: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  tabsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    gap: spacing.sm,
  },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  error: { color: colors.dangerDark },
  list: { paddingHorizontal: spacing.lg },
  barcodeButton: {
    position: 'absolute',
    right: spacing.lg,
    bottom: 88,
  },
});
