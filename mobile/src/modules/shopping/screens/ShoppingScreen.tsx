import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useHomeStore } from '../../../store/useHomeStore';
import { useShoppingItemsQuery, SHOPPING_ITEMS_QUERY_KEY } from '../hooks/useShoppingItemsQuery';
import {
  addShoppingItem,
  deleteShoppingItem,
  toggleShoppingItemCheck,
  type ShoppingItem,
} from '../services/shoppingApi';

function ShoppingRow({
  item,
  onToggle,
  onDelete,
}: {
  item: ShoppingItem;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const isChecked = item.status === 'checked';

  return (
    <View style={styles.row}>
      <Pressable
        testID={`shopping-item-toggle-${item.id}`}
        style={styles.rowMain}
        onPress={onToggle}
      >
        <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
          {isChecked && <Text style={styles.checkboxMark}>✓</Text>}
        </View>
        <Text style={[styles.rowText, isChecked && styles.rowTextChecked]}>
          {item.name}
          {item.quantity > 1 ? ` (${item.quantity})` : ''}
        </Text>
      </Pressable>
      <Pressable testID={`shopping-item-delete-${item.id}`} onPress={onDelete}>
        <Text style={styles.deleteText}>Sil</Text>
      </Pressable>
    </View>
  );
}

export function ShoppingScreen() {
  const homeId = useHomeStore((state) => state.selectedHomeId) as string;
  const queryClient = useQueryClient();
  const { data: items, isLoading, isError } = useShoppingItemsQuery();

  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: [SHOPPING_ITEMS_QUERY_KEY] });

  const handleAdd = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;

    setIsSubmitting(true);
    try {
      await addShoppingItem(homeId, { name: trimmed });
      setName('');
      await invalidate();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (itemId: string) => {
    await toggleShoppingItemCheck(homeId, itemId);
    await invalidate();
  };

  const handleDelete = async (itemId: string) => {
    await deleteShoppingItem(homeId, itemId);
    await invalidate();
  };

  const pendingItems = (items ?? []).filter((item) => item.status === 'pending');
  const checkedItems = (items ?? []).filter((item) => item.status === 'checked');

  return (
    <View style={styles.container}>
      <View style={styles.addRow}>
        <TextInput
          testID="shopping-add-input"
          style={styles.input}
          placeholder="Ürün ekle"
          value={name}
          onChangeText={setName}
          onSubmitEditing={handleAdd}
        />
        <Pressable
          testID="shopping-add-button"
          style={[styles.addButton, isSubmitting && styles.addButtonDisabled]}
          onPress={handleAdd}
          disabled={isSubmitting}
        >
          <Text style={styles.addButtonText}>Ekle</Text>
        </Pressable>
      </View>

      {isLoading && (
        <View style={styles.centered}>
          <ActivityIndicator />
        </View>
      )}

      {isError && (
        <View style={styles.centered}>
          <Text style={styles.error}>Alışveriş listesi yüklenemedi.</Text>
        </View>
      )}

      {!isLoading && !isError && (
        <FlatList
          data={[...pendingItems, ...checkedItems]}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={styles.empty}>Alışveriş listesi boş.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <ShoppingRow
              item={item}
              onToggle={() => handleToggle(item.id)}
              onDelete={() => handleDelete(item.id)}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  addRow: { flexDirection: 'row', padding: 12, gap: 8 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  addButton: {
    backgroundColor: '#1d76db',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  addButtonDisabled: { opacity: 0.6 },
  addButtonText: { color: '#fff', fontWeight: '600' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  error: { color: '#c0392b' },
  empty: { color: '#666' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  rowMain: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#1d76db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: '#1d76db' },
  checkboxMark: { color: '#fff', fontSize: 12, fontWeight: '700' },
  rowText: { fontSize: 16 },
  rowTextChecked: { color: '#999', textDecorationLine: 'line-through' },
  deleteText: { color: '#c0392b', fontSize: 13 },
});
