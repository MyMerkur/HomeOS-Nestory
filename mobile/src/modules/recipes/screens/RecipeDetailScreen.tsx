import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../../ui/Button';
import { fontSize, radius, spacing, typography, type ThemeColors } from '../../../theme/theme';
import { useTheme } from '../../../theme/ThemeContext';
import { useHomeStore } from '../../../store/useHomeStore';
import { ALL_RECIPES_QUERY_KEY } from '../hooks/useAllRecipesQuery';
import { SAVED_RECIPES_QUERY_KEY } from '../hooks/useSavedRecipesQuery';
import { saveRecipe, unsaveRecipe } from '../services/recipeApi';
import type { RecipesStackScreenProps } from '../../../app/navigation/types';

export function RecipeDetailScreen({ navigation, route }: RecipesStackScreenProps<'RecipeDetail'>) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { recipe } = route.params;
  const homeId = useHomeStore((state) => state.selectedHomeId) as string;
  const queryClient = useQueryClient();
  const missing = new Set(recipe.missingIngredients);

  const [isSaved, setIsSaved] = useState(recipe.isSaved);
  const [isTogglingSave, setIsTogglingSave] = useState(false);

  useEffect(() => {
    navigation.setOptions({ title: recipe.name });
  }, [navigation, recipe.name]);

  const handleToggleSave = async () => {
    setIsTogglingSave(true);
    try {
      if (isSaved) {
        await unsaveRecipe(homeId, recipe.id);
      } else {
        await saveRecipe(homeId, recipe.id);
      }
      setIsSaved(!isSaved);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [ALL_RECIPES_QUERY_KEY] }),
        queryClient.invalidateQueries({ queryKey: [SAVED_RECIPES_QUERY_KEY] }),
      ]);
    } finally {
      setIsTogglingSave(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Button
        testID="recipe-detail-save-button"
        label={isSaved ? t('recipes.detail.savedButton') : t('recipes.detail.saveButton')}
        onPress={handleToggleSave}
        loading={isTogglingSave}
        variant={isSaved ? 'primary' : 'outline'}
      />

      <Text style={styles.coverage}>
        {t('recipes.detail.coverageLabel', { percent: recipe.coveragePercent })}
      </Text>

      <Text style={styles.sectionTitle}>{t('recipes.detail.ingredientsTitle')}</Text>
      {recipe.ingredients.map((ingredient) => (
        <View
          key={ingredient.name}
          style={[styles.ingredientRow, missing.has(ingredient.name) && styles.ingredientRowMissing]}
        >
          <Text style={styles.ingredient}>
            {missing.has(ingredient.name) ? '✗' : '✓'} {ingredient.name}
            {ingredient.optional ? t('recipes.detail.optionalTag') : ''}
          </Text>
        </View>
      ))}

      <Text style={styles.sectionTitle}>{t('recipes.detail.instructionsTitle')}</Text>
      {recipe.instructions.map((step, index) => (
        <View key={`step-${index}`} style={styles.stepRow}>
          <Text style={styles.stepNumber}>{index + 1}.</Text>
          <Text style={styles.stepText}>{step}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: { padding: spacing.lg, gap: spacing.xs, backgroundColor: colors.background },
    coverage: {
      fontSize: fontSize.bodyMd,
      fontFamily: typography.body.fontFamily,
      color: colors.textSecondary,
      marginTop: spacing.md,
      marginBottom: spacing.sm,
    },
    sectionTitle: {
      fontSize: fontSize.bodyMd,
      fontFamily: typography.heading.fontFamily,
      fontWeight: typography.heading.fontWeight,
      color: colors.textPrimary,
      marginTop: spacing.lg,
      marginBottom: spacing.xs,
    },
    ingredientRow: { paddingVertical: spacing.xs, paddingHorizontal: spacing.sm, borderRadius: radius.sm },
    ingredientRowMissing: { backgroundColor: colors.dangerTint },
    ingredient: {
      fontSize: fontSize.bodyLg,
      fontFamily: typography.body.fontFamily,
      color: colors.textPrimary,
    },
    stepRow: { flexDirection: 'row', gap: spacing.xs, paddingVertical: spacing.xs },
    stepNumber: {
      fontSize: fontSize.bodyLg,
      fontFamily: typography.bodyMedium.fontFamily,
      fontWeight: typography.bodyMedium.fontWeight,
      color: colors.textPrimary,
    },
    stepText: {
      flex: 1,
      fontSize: fontSize.bodyLg,
      fontFamily: typography.body.fontFamily,
      color: colors.textPrimary,
    },
  });
}
