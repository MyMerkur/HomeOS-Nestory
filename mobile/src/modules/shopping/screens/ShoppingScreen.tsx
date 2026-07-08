import { useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { IconCheck, IconShoppingCartOff, IconTrash } from '@tabler/icons-react-native';
import { useHomeStore } from '../../../store/useHomeStore';
import { Button } from '../../../ui/Button';
import { EmptyState } from '../../../ui/EmptyState';
import { TextField } from '../../../ui/TextField';
import { fontSize, radius, spacing, typography, type ThemeColors } from '../../../theme/theme';
import { useTheme } from '../../../theme/ThemeContext';
import { useShoppingItemsQuery, SHOPPING_ITEMS_QUERY_KEY } from '../hooks/useShoppingItemsQuery';
import {
  addShoppingItem,
  deleteShoppingItem,
  toggleShoppingItemCheck,
  type ShoppingItem,
} from '../services/shoppingApi';

function ShoppingRow({
  item,
  styles,
  onToggle,
  onDelete,
}: {
  item: ShoppingItem;
  styles: ReturnType<typeof createStyles>;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const isChecked = item.status === 'checked';
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      <Pressable testID={`shopping-item-toggle-${item.id}`} style={styles.rowMain} onPress={onToggle}>
        <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
          {isChecked ? <IconCheck color={colors.white} size={14} /> : null}
        </View>
        <Text style={[styles.rowText, isChecked && styles.rowTextChecked]}>
          {item.name}
          {item.quantity > 1 ? ` (${item.quantity})` : ''}
        </Text>
      </Pressable>
      <Pressable
        testID={`shopping-item-delete-${item.id}`}
        onPress={onDelete}
        accessibilityLabel={t('shopping.deleteA11y', { name: item.name })}
        hitSlop={8}
      >
        <IconTrash color={colors.dangerDark} size={20} />
      </Pressable>
    </View>
  );
}

export function ShoppingScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
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
        <View style={styles.addInput}>
          <TextField
            testID="shopping-add-input"
            label={t('shopping.addPlaceholder')}
            hideLabel
            placeholder={t('shopping.addPlaceholder')}
            value={name}
            onChangeText={setName}
            onSubmitEditing={handleAdd}
          />
        </View>
        <Button
          testID="shopping-add-button"
          label={t('shopping.addButton')}
          onPress={handleAdd}
          loading={isSubmitting}
        />
      </View>

      {isLoading && (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.primary} />
        </View>
      )}

      {isError && (
        <View style={styles.centered}>
          <Text style={styles.error}>{t('shopping.errorLoad')}</Text>
        </View>
      )}

      {!isLoading && !isError && (
        <FlatList
          data={[...pendingItems, ...checkedItems]}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <EmptyState icon={IconShoppingCartOff} title={t('shopping.emptyList')} />
          }
          renderItem={({ item }) => (
            <ShoppingRow
              item={item}
              styles={styles}
              onToggle={() => handleToggle(item.id)}
              onDelete={() => handleDelete(item.id)}
            />
          )}
        />
      )}
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    addRow: { flexDirection: 'row', padding: spacing.lg, gap: spacing.sm, alignItems: 'flex-end' },
    addInput: { flex: 1 },
    centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
    error: {
      fontSize: fontSize.bodyMd,
      fontFamily: typography.body.fontFamily,
      color: colors.textSecondary,
    },
    list: { paddingHorizontal: spacing.lg },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.sm,
      minHeight: 44,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    rowMain: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    checkbox: {
      width: 22,
      height: 22,
      borderRadius: radius.pill,
      borderWidth: 2,
      borderColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkboxChecked: { backgroundColor: colors.primary },
    rowText: {
      fontSize: fontSize.bodyLg,
      fontFamily: typography.body.fontFamily,
      color: colors.textPrimary,
    },
    rowTextChecked: {
      color: colors.textMuted,
      textDecorationLine: 'line-through',
    },
  });
}
