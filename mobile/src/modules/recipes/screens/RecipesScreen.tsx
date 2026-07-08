import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { IconToolsKitchen2 } from '@tabler/icons-react-native';
import { EmptyState } from '../../../ui/EmptyState';
import { SegmentedControl } from '../../../ui/SegmentedControl';
import { fontSize, radius, spacing, typography, type ThemeColors } from '../../../theme/theme';
import { useTheme } from '../../../theme/ThemeContext';
import { useRecipeSuggestionsQuery } from '../hooks/useRecipeSuggestionsQuery';
import { useSavedRecipesQuery } from '../hooks/useSavedRecipesQuery';
import type { RecipeSuggestion } from '../services/recipeApi';
import type { RecipesStackScreenProps } from '../../../app/navigation/types';

type Tab = 'suggestions' | 'saved';

function coverageStyle(styles: ReturnType<typeof createStyles>, coveragePercent: number) {
  if (coveragePercent >= 80) return styles.coverageHigh;
  if (coveragePercent >= 50) return styles.coverageMedium;
  return styles.coverageLow;
}

function coverageTextStyle(styles: ReturnType<typeof createStyles>, coveragePercent: number) {
  if (coveragePercent >= 80) return styles.coverageTextHigh;
  if (coveragePercent >= 50) return styles.coverageTextMedium;
  return styles.coverageTextLow;
}

function RecipeCard({
  recipe,
  styles,
  onPress,
}: {
  recipe: RecipeSuggestion;
  styles: ReturnType<typeof createStyles>;
  onPress: () => void;
}) {
  const { t } = useTranslation();
  return (
    <Pressable testID={`recipe-card-${recipe.id}`} style={styles.card} onPress={onPress}>
      <View style={styles.info}>
        <Text style={styles.name}>{recipe.name}</Text>
        <Text style={styles.meta}>
          {recipe.missingIngredients.length === 0
            ? t('recipes.allIngredientsAvailable')
            : t('recipes.missingIngredients', { count: recipe.missingIngredients.length })}
        </Text>
      </View>
      <View style={[styles.coverageBadge, coverageStyle(styles, recipe.coveragePercent)]}>
        <Text style={[styles.coverageText, coverageTextStyle(styles, recipe.coveragePercent)]}>
          %{recipe.coveragePercent}
        </Text>
      </View>
    </Pressable>
  );
}

export function RecipesScreen({ navigation }: RecipesStackScreenProps<'Recipes'>) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [tab, setTab] = useState<Tab>('suggestions');
  const suggestionsQuery = useRecipeSuggestionsQuery();
  const savedQuery = useSavedRecipesQuery();
  const { data: recipes, isLoading, isError } = tab === 'suggestions' ? suggestionsQuery : savedQuery;

  return (
    <View style={styles.container}>
      <View style={styles.tabsRow}>
        <SegmentedControl
          options={[
            { value: 'suggestions', label: t('recipes.tabs.suggestions'), testID: 'recipes-tab-suggestions' },
            { value: 'saved', label: t('recipes.tabs.saved'), testID: 'recipes-tab-saved' },
          ]}
          value={tab}
          onChange={(value) => setTab(value as Tab)}
        />
      </View>

      {isLoading && (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.primary} />
        </View>
      )}

      {!isLoading && isError && (
        <View style={styles.centered}>
          <Text style={styles.error}>{t('recipes.errorLoad')}</Text>
        </View>
      )}

      {!isLoading && !isError && (recipes?.length ?? 0) === 0 && (
        <EmptyState
          icon={IconToolsKitchen2}
          title={
            tab === 'suggestions'
              ? t('recipes.emptySuggestions')
              : t('recipes.emptySaved')
          }
        />
      )}

      {!isLoading && !isError && (recipes?.length ?? 0) > 0 && (
        <FlatList
          data={recipes}
          keyExtractor={(recipe) => recipe.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <RecipeCard
              recipe={item}
              styles={styles}
              onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
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
    tabsRow: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
    centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
    error: {
      fontSize: fontSize.bodyMd,
      fontFamily: typography.body.fontFamily,
      color: colors.textSecondary,
    },
    list: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.sm,
      minHeight: 44,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
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
    coverageBadge: { borderRadius: radius.md, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs / 2 },
    coverageText: {
      fontSize: fontSize.bodySm,
      fontFamily: typography.bodyMedium.fontFamily,
      fontWeight: typography.bodyMedium.fontWeight,
    },
    coverageHigh: { backgroundColor: colors.primaryTint },
    coverageTextHigh: { color: colors.primaryDark },
    coverageMedium: { backgroundColor: colors.warningTint },
    coverageTextMedium: { color: colors.warningDark },
    coverageLow: { backgroundColor: colors.warningTint },
    coverageTextLow: { color: colors.warningDark },
  });
}
