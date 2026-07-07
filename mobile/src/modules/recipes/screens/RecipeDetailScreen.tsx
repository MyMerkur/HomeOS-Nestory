import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useHomeStore } from '../../../store/useHomeStore';
import { RECIPE_SUGGESTIONS_QUERY_KEY } from '../hooks/useRecipeSuggestionsQuery';
import { SAVED_RECIPES_QUERY_KEY } from '../hooks/useSavedRecipesQuery';
import { saveRecipe, unsaveRecipe } from '../services/recipeApi';
import type { RecipesStackScreenProps } from '../../../app/navigation/types';

export function RecipeDetailScreen({ navigation, route }: RecipesStackScreenProps<'RecipeDetail'>) {
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
        queryClient.invalidateQueries({ queryKey: [RECIPE_SUGGESTIONS_QUERY_KEY] }),
        queryClient.invalidateQueries({ queryKey: [SAVED_RECIPES_QUERY_KEY] }),
      ]);
    } finally {
      setIsTogglingSave(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable
        testID="recipe-detail-save-button"
        style={[styles.saveButton, isSaved && styles.saveButtonActive]}
        onPress={handleToggleSave}
        disabled={isTogglingSave}
      >
        {isTogglingSave ? (
          <ActivityIndicator color={isSaved ? '#fff' : '#1d76db'} />
        ) : (
          <Text style={[styles.saveButtonText, isSaved && styles.saveButtonTextActive]}>
            {isSaved ? 'Kaydedildi ✓' : 'Kaydet'}
          </Text>
        )}
      </Pressable>

      <Text style={styles.coverage}>Evdeki malzemelerle kapsama: %{recipe.coveragePercent}</Text>

      <Text style={styles.sectionTitle}>Malzemeler</Text>
      {recipe.ingredients.map((ingredient) => (
        <Text key={ingredient.name} style={styles.ingredient}>
          {missing.has(ingredient.name) ? '✗' : '✓'} {ingredient.name}
          {ingredient.optional ? ' (opsiyonel)' : ''}
        </Text>
      ))}

      <Text style={styles.sectionTitle}>Talimatlar</Text>
      {recipe.instructions.map((step, index) => (
        <View key={`step-${index}`} style={styles.stepRow}>
          <Text style={styles.stepNumber}>{index + 1}.</Text>
          <Text style={styles.stepText}>{step}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 4 },
  coverage: { fontSize: 14, color: '#666', marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginTop: 16, marginBottom: 4 },
  ingredient: { fontSize: 15, paddingVertical: 2 },
  stepRow: { flexDirection: 'row', gap: 6, paddingVertical: 4 },
  stepNumber: { fontWeight: '600' },
  stepText: { flex: 1 },
  saveButton: {
    borderWidth: 1,
    borderColor: '#1d76db',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonActive: { backgroundColor: '#1d76db' },
  saveButtonText: { color: '#1d76db', fontWeight: '600' },
  saveButtonTextActive: { color: '#fff' },
});
