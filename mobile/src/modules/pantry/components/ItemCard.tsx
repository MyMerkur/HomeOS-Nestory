import { PantryItemRow } from '../../../ui/PantryItemRow';
import { CATEGORY_LABELS, UNIT_LABELS } from '../constants';
import type { InventoryItem } from '../services/pantryApi';

type Props = {
  item: InventoryItem;
  onPress?: () => void;
  onLongPress?: () => void;
};

function daysUntilExpiry(expiryDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  return Math.round((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function ItemCard({ item, onPress, onLongPress }: Props) {
  return (
    <PantryItemRow
      testID={`item-card-${item.id}`}
      name={item.name}
      subtitle={`${item.quantity} ${UNIT_LABELS[item.unit]} · ${CATEGORY_LABELS[item.category]}`}
      daysUntilExpiry={item.expiryDate ? daysUntilExpiry(item.expiryDate) : null}
      onPress={onPress}
      onLongPress={onLongPress}
    />
  );
}
