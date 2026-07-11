import { useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { IconCheck, IconPlus, IconShoppingCartOff, IconTrash } from '@tabler/icons-react-native';
import { useHomeStore } from '../../../store/useHomeStore';
import { Button } from '../../../ui/Button';
import { EmptyState } from '../../../ui/EmptyState';
import { Skeleton } from '../../../ui/Skeleton';
import { TextField } from '../../../ui/TextField';
import { fontSize, radius, spacing, typography, type ThemeColors } from '../../../theme/theme';
import { useTheme } from '../../../theme/ThemeContext';
import { useShoppingItemsQuery, SHOPPING_ITEMS_QUERY_KEY } from '../hooks/useShoppingItemsQuery';
import {
  SHOPPING_SUGGESTIONS_QUERY_KEY,
  useShoppingSuggestionsQuery,
} from '../hooks/useShoppingSuggestionsQuery';
import {
  addShoppingItem,
  deleteShoppingItem,
  toggleShoppingItemCheck,
  type ShoppingItem,
  type ShoppingSuggestion,
} from '../services/shoppingApi';

function ShoppingScreenSkeleton({ styles }: { styles: ReturnType<typeof createStyles> }) {
  return (
    <View style={styles.container}>
      <View style={styles.addRow}>
        <Skeleton height={44} style={styles.addInput} />
        <Skeleton width={96} height={44} />
      </View>
      <View style={styles.list}>
        <Skeleton height={44} style={styles.rowSkeleton} />
        <Skeleton height={44} style={styles.rowSkeleton} />
        <Skeleton height={44} style={styles.rowSkeleton} />
        <Skeleton height={44} style={styles.rowSkeleton} />
        <Skeleton height={44} style={styles.rowSkeleton} />
      </View>
    </View>
  );
}

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

function SuggestionRow({
  suggestion,
  styles,
  onAdd,
  isAdding,
}: {
  suggestion: ShoppingSuggestion;
  styles: ReturnType<typeof createStyles>;
  onAdd: () => void;
  isAdding: boolean;
}) {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <View style={styles.suggestionRow}>
      <View style={styles.suggestionInfo}>
        <Text style={styles.suggestionName}>{suggestion.name}</Text>
        <Text style={styles.suggestionMeta}>
          {t('shopping.suggestions.overdueBy', { count: suggestion.daysSinceLastConsumed })}
        </Text>
      </View>
      <Pressable
        testID={`shopping-suggestion-add-${suggestion.normalizedName}`}
        onPress={onAdd}
        disabled={isAdding}
        accessibilityLabel={t('shopping.suggestions.addA11y', { name: suggestion.name })}
        hitSlop={8}
        style={styles.suggestionAddButton}
      >
        <IconPlus color={colors.primaryDark} size={18} />
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
  const { data: items, isLoading, isError, refetch, isRefetching } = useShoppingItemsQuery();
  const { data: suggestions } = useShoppingSuggestionsQuery();

  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addingSuggestions, setAddingSuggestions] = useState<Set<string>>(new Set());

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

  const handleAddSuggestion = async (suggestion: ShoppingSuggestion) => {
    setAddingSuggestions((current) => new Set(current).add(suggestion.normalizedName));
    try {
      await addShoppingItem(homeId, {
        name: suggestion.name,
        category: suggestion.category ?? undefined,
        unit: suggestion.unit ?? undefined,
      });
      await Promise.all([
        invalidate(),
        queryClient.invalidateQueries({ queryKey: [SHOPPING_SUGGESTIONS_QUERY_KEY] }),
      ]);
    } finally {
      setAddingSuggestions((current) => {
        const next = new Set(current);
        next.delete(suggestion.normalizedName);
        return next;
      });
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

  if (isLoading) {
    return <ShoppingScreenSkeleton styles={styles} />;
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{t('shopping.errorLoad')}</Text>
        <Button label={t('common.retry')} onPress={() => refetch()} variant="outline" />
      </View>
    );
  }

  const pendingItems = (items ?? []).filter((item) => item.status === 'pending');
  const checkedItems = (items ?? []).filter((item) => item.status === 'checked');

  return (
    <FlatList
      testID="shopping-list"
      style={styles.container}
      data={[...pendingItems, ...checkedItems]}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      refreshing={isRefetching}
      onRefresh={refetch}
      ListHeaderComponent={
        <>
          {suggestions && suggestions.length > 0 ? (
            <View style={styles.suggestionsSection}>
              <Text style={styles.suggestionsTitle}>{t('shopping.suggestions.title')}</Text>
              {suggestions.map((suggestion) => (
                <SuggestionRow
                  key={suggestion.normalizedName}
                  suggestion={suggestion}
                  styles={styles}
                  onAdd={() => handleAddSuggestion(suggestion)}
                  isAdding={addingSuggestions.has(suggestion.normalizedName)}
                />
              ))}
            </View>
          ) : null}

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
        </>
      }
      ListEmptyComponent={<EmptyState icon={IconShoppingCartOff} title={t('shopping.emptyList')} />}
      renderItem={({ item }) => (
        <ShoppingRow
          item={item}
          styles={styles}
          onToggle={() => handleToggle(item.id)}
          onDelete={() => handleDelete(item.id)}
        />
      )}
    />
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    addRow: { flexDirection: 'row', padding: spacing.lg, gap: spacing.sm, alignItems: 'flex-end' },
    addInput: { flex: 1 },
    centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.xl,
      gap: spacing.md,
    },
    error: {
      fontSize: fontSize.bodyMd,
      fontFamily: typography.body.fontFamily,
      color: colors.textSecondary,
    },
    list: { paddingHorizontal: spacing.lg },
    rowSkeleton: { marginBottom: spacing.sm },
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
    suggestionsSection: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      gap: spacing.sm,
    },
    suggestionsTitle: {
      fontSize: fontSize.bodyMd,
      fontFamily: typography.heading.fontFamily,
      fontWeight: typography.heading.fontWeight,
      color: colors.textPrimary,
    },
    suggestionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.primaryTint,
      borderRadius: radius.md,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
    },
    suggestionInfo: { flex: 1, gap: 2 },
    suggestionName: {
      fontSize: fontSize.bodyMd,
      fontFamily: typography.bodyMedium.fontFamily,
      fontWeight: typography.bodyMedium.fontWeight,
      color: colors.textPrimary,
    },
    suggestionMeta: {
      fontSize: fontSize.bodySm,
      fontFamily: typography.caption.fontFamily,
      color: colors.textSecondary,
    },
    suggestionAddButton: {
      width: 32,
      height: 32,
      borderRadius: radius.pill,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}
