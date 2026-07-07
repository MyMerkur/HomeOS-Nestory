import { useQueryClient } from '@tanstack/react-query';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useHomeStore } from '../../../store/useHomeStore';
import { UNIT_LABELS } from '../../pantry/constants';
import { INVENTORY_ITEMS_QUERY_KEY, useInventoryItemsQuery } from '../../pantry/hooks/useInventoryItemsQuery';
import { addToShopping, takeDose, type InventoryItem } from '../../pantry/services/pantryApi';
import { SHOPPING_ITEMS_QUERY_KEY } from '../../shopping/hooks/useShoppingItemsQuery';

type MedicineRowProps = {
  item: InventoryItem;
  onTakeDose: (itemId: string) => void;
  onAddToShopping: (itemId: string) => void;
};

function MedicineRow({ item, onTakeDose, onAddToShopping }: MedicineRowProps) {
  const outOfStock = item.quantity <= 0;

  return (
    <View testID={`medicine-card-${item.id}`} style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.meta}>
          {item.quantity} {UNIT_LABELS[item.unit]}
          {outOfStock ? ' · Stokta yok' : ''}
        </Text>
        {item.doseTimes.length > 0 && (
          <Text style={styles.doseTimes}>Saatler: {item.doseTimes.join(', ')}</Text>
        )}
      </View>
      {outOfStock ? (
        <Pressable
          testID={`add-to-shopping-${item.id}`}
          style={styles.shoppingButton}
          onPress={() => onAddToShopping(item.id)}
        >
          <Text style={styles.shoppingButtonText}>Alışverişe ekle</Text>
        </Pressable>
      ) : (
        <Pressable
          testID={`take-dose-${item.id}`}
          style={styles.doseButton}
          onPress={() => onTakeDose(item.id)}
        >
          <Text style={styles.doseButtonText}>Doz Aldım</Text>
        </Pressable>
      )}
    </View>
  );
}

export function MedicinesScreen() {
  const homeId = useHomeStore((state) => state.selectedHomeId) as string;
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useInventoryItemsQuery({
    category: 'Medicine',
    status: 'active',
    limit: 100,
  });

  const handleTakeDose = async (itemId: string) => {
    await takeDose(homeId, itemId);
    await queryClient.invalidateQueries({ queryKey: [INVENTORY_ITEMS_QUERY_KEY] });
  };

  const handleAddToShopping = async (itemId: string) => {
    await addToShopping(homeId, itemId);
    await queryClient.invalidateQueries({ queryKey: [SHOPPING_ITEMS_QUERY_KEY] });
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
        <Text style={styles.error}>İlaçlar yüklenemedi.</Text>
      </View>
    );
  }

  if (data.items.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.empty}>Henüz kayıtlı bir ilaç yok.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data.items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <MedicineRow item={item} onTakeDose={handleTakeDose} onAddToShopping={handleAddToShopping} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  error: { color: '#c0392b' },
  empty: { color: '#666', textAlign: 'center' },
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
  doseTimes: { fontSize: 12, color: '#999' },
  doseButton: {
    backgroundColor: '#1d76db',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  doseButtonText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  shoppingButton: {
    borderWidth: 1,
    borderColor: '#e67e22',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  shoppingButtonText: { color: '#e67e22', fontWeight: '600', fontSize: 13 },
});
