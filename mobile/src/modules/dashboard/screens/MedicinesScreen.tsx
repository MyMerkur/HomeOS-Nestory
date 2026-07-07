import { useQueryClient } from '@tanstack/react-query';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { IconPill } from '@tabler/icons-react-native';
import { Button } from '../../../ui/Button';
import { Card } from '../../../ui/Card';
import { EmptyState } from '../../../ui/EmptyState';
import { colors, fontSize, spacing, typography } from '../../../theme/theme';
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
    <Card testID={`medicine-card-${item.id}`} style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.meta}>
          {item.quantity} {UNIT_LABELS[item.unit]}
          {outOfStock ? ' · Stokta yok' : ''}
        </Text>
        {item.doseTimes.length > 0 ? (
          <Text style={styles.doseTimes}>Saatler: {item.doseTimes.join(', ')}</Text>
        ) : null}
      </View>
      {outOfStock ? (
        <Button
          testID={`add-to-shopping-${item.id}`}
          label="Alışverişe ekle"
          onPress={() => onAddToShopping(item.id)}
          variant="warningOutline"
        />
      ) : (
        <Button
          testID={`take-dose-${item.id}`}
          label="Doz Aldım"
          onPress={() => onTakeDose(item.id)}
          variant="secondary"
        />
      )}
    </Card>
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
        <ActivityIndicator color={colors.primary} />
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
    return <EmptyState icon={IconPill} title="Henüz kayıtlı bir ilaç yok." />;
  }

  return (
    <FlatList
      data={data.items}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <MedicineRow item={item} onTakeDose={handleTakeDose} onAddToShopping={handleAddToShopping} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  error: {
    fontSize: fontSize.bodyMd,
    fontFamily: typography.body.fontFamily,
    color: colors.textSecondary,
  },
  list: { padding: spacing.lg },
  card: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm },
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
  doseTimes: {
    fontSize: fontSize.caption,
    fontFamily: typography.caption.fontFamily,
    color: colors.textMuted,
  },
});
