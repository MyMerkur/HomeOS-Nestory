import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { IconToolsKitchen2 } from '@tabler/icons-react-native';
import { Button } from '../../../ui/Button';
import { Chip } from '../../../ui/Chip';
import { EmptyState } from '../../../ui/EmptyState';
import { SegmentedControl } from '../../../ui/SegmentedControl';
import { Skeleton } from '../../../ui/Skeleton';
import { fontSize, radius, spacing, typography, type ThemeColors } from '../../../theme/theme';
import { useTheme } from '../../../theme/ThemeContext';
import { useAllRecipesQuery } from '../hooks/useAllRecipesQuery';
import { useSavedRecipesQuery } from '../hooks/useSavedRecipesQuery';
import { RECIPE_CATEGORIES, type RecipeCategory } from '../constants';
import type { RecipeSuggestion } from '../services/recipeApi';
import type { RecipesStackScreenProps } from '../../../app/navigation/types';

type Tab = 'all' | 'saved';
type CategoryFilter = 'All' | RecipeCategory;

const CATEGORY_FILTERS: CategoryFilter[] = ['All', ...RECIPE_CATEGORIES];

function coverageStyle(styles: ReturnType<typeof createStyles>, coveragePercent: number) {
  return coveragePercent === 100 ? styles.coverageReady : styles.coverageNotReady;
}

function coverageTextStyle(styles: ReturnType<typeof createStyles>, coveragePercent: number) {
  return coveragePercent === 100 ? styles.coverageTextReady : styles.coverageTextNotReady;
}

function RecipesScreenSkeleton({ styles }: { styles: ReturnType<typeof createStyles> }) {
  return (
    <View style={styles.list}>
      <Skeleton height={64} style={styles.rowSkeleton} />
      <Skeleton height={64} style={styles.rowSkeleton} />
      <Skeleton height={64} style={styles.rowSkeleton} />
    </View>
  );
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
  const [tab, setTab] = useState<Tab>('all');
  const [category, setCategory] = useState<CategoryFilter>('All');
  const allQuery = useAllRecipesQuery();
  const savedQuery = useSavedRecipesQuery();
  const {
    data: recipes,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = tab === 'all' ? allQuery : savedQuery;

  const filteredRecipes = useMemo(
    () => (category === 'All' ? recipes : recipes?.filter((recipe) => recipe.category === category)),
    [recipes, category],
  );

  const tabsRow = (
    <View style={styles.tabsRow}>
      <SegmentedControl
        options={[
          { value: 'all', label: t('recipes.tabs.all'), testID: 'recipes-tab-all' },
          { value: 'saved', label: t('recipes.tabs.saved'), testID: 'recipes-tab-saved' },
        ]}
        value={tab}
        onChange={(value) => setTab(value as Tab)}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryRow}
        contentContainerStyle={styles.categoryRowContent}
      >
        {CATEGORY_FILTERS.map((option) => (
          <Chip
            key={option}
            testID={`recipes-category-${option}`}
            label={t(`recipes.categories.${option}`)}
            selected={category === option}
            onPress={() => setCategory(option)}
          />
        ))}
      </ScrollView>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        {tabsRow}
        <RecipesScreenSkeleton styles={styles} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.container}>
        {tabsRow}
        <View style={styles.centered}>
          <Text style={styles.error}>{t('recipes.errorLoad')}</Text>
          <Button label={t('common.retry')} onPress={() => refetch()} variant="outline" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {tabsRow}
      <FlatList
        testID="recipes-list"
        data={filteredRecipes}
        keyExtractor={(recipe) => recipe.id}
        contentContainerStyle={styles.list}
        refreshing={isRefetching}
        onRefresh={refetch}
        ListEmptyComponent={
          <EmptyState
            icon={IconToolsKitchen2}
            title={
              category !== 'All' && (recipes?.length ?? 0) > 0
                ? t('recipes.emptyCategory')
                : tab === 'all'
                  ? t('recipes.emptyAll')
                  : t('recipes.emptySaved')
            }
          />
        }
        renderItem={({ item }) => (
          <RecipeCard
            recipe={item}
            styles={styles}
            onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
          />
        )}
      />
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    tabsRow: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, gap: spacing.sm },
    categoryRow: { marginHorizontal: -spacing.lg },
    categoryRowContent: { paddingHorizontal: spacing.lg, gap: spacing.xs },
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
    list: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
    rowSkeleton: { marginBottom: spacing.sm },
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
    coverageReady: { backgroundColor: colors.primaryTint },
    coverageTextReady: { color: colors.primaryDark },
    coverageNotReady: { backgroundColor: colors.border },
    coverageTextNotReady: { color: colors.textMuted },
  });
}
