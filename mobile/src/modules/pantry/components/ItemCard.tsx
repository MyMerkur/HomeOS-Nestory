import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CATEGORY_LABELS, UNIT_LABELS } from '../constants';
import type { InventoryItem } from '../services/pantryApi';
import { ExpiryBadge } from './ExpiryBadge';

type Props = {
  item: InventoryItem;
  onPress?: () => void;
  onLongPress?: () => void;
};

export function ItemCard({ item, onPress, onLongPress }: Props) {
  return (
    <Pressable
      testID={`item-card-${item.id}`}
      style={styles.card}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.meta}>
          {item.quantity} {UNIT_LABELS[item.unit]} · {CATEGORY_LABELS[item.category]}
        </Text>
      </View>
      <ExpiryBadge expiryDate={item.expiryDate} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
});
