import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useHomeStore } from '../../../store/useHomeStore';
import { ItemCard } from '../components/ItemCard';
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
      <TextInput
        testID="pantry-search"
        style={styles.searchInput}
        placeholder="Ürün ara"
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.tabsRow}>
        <Pressable
          testID="location-tab-all"
          style={[styles.tab, selectedLocationId === ALL_LOCATIONS && styles.tabActive]}
          onPress={() => setSelectedLocationId(ALL_LOCATIONS)}
        >
          <Text
            style={[styles.tabText, selectedLocationId === ALL_LOCATIONS && styles.tabTextActive]}
          >
            Tümü
          </Text>
        </Pressable>
        {(locations ?? []).map((location) => (
          <Pressable
            key={location.id}
            testID={`location-tab-${location.id}`}
            style={[styles.tab, selectedLocationId === location.id && styles.tabActive]}
            onPress={() => setSelectedLocationId(location.id)}
          >
            <Text
              style={[styles.tabText, selectedLocationId === location.id && styles.tabTextActive]}
            >
              {location.name}
            </Text>
          </Pressable>
        ))}
      </View>

      {isLoading && (
        <View style={styles.centered}>
          <ActivityIndicator />
        </View>
      )}

      {isError && (
        <View style={styles.centered}>
          <Text style={styles.error}>Ürünler yüklenemedi.</Text>
        </View>
      )}

      {!isLoading && !isError && (itemsResult?.items.length ?? 0) === 0 && (
        <View style={styles.centered}>
          <Text style={styles.empty}>Bu görünümde henüz ürün yok.</Text>
        </View>
      )}

      {!isLoading && !isError && (itemsResult?.items.length ?? 0) > 0 && (
        <FlatList
          data={itemsResult?.items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ItemCard
              item={item}
              onPress={() => navigation.navigate('ItemForm', { itemId: item.id })}
              onLongPress={() => handleItemAction(item)}
            />
          )}
        />
      )}

      <Pressable
        testID="quick-add-barcode-button"
        style={styles.fabSecondary}
        onPress={() => navigation.navigate('QuickAddItem')}
      >
        <Text style={styles.fabSecondaryText}>Barkod</Text>
      </Pressable>

      <Pressable
        testID="add-item-button"
        style={styles.fab}
        onPress={() => navigation.navigate('ItemForm', undefined)}
      >
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchInput: {
    margin: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  tabsRow: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 8 },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
  },
  tabActive: { backgroundColor: '#1d76db' },
  tabText: { fontSize: 13, color: '#333' },
  tabTextActive: { color: '#fff', fontWeight: '600' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  error: { color: '#c0392b' },
  empty: { color: '#666' },
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
  fabSecondary: {
    position: 'absolute',
    right: 20,
    bottom: 88,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#1d76db',
    alignItems: 'center',
    elevation: 4,
  },
  fabSecondaryText: { color: '#1d76db', fontSize: 13, fontWeight: '600' },
});
