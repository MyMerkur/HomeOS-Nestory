import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { RecipesStackScreenProps } from '../../../app/navigation/types';

export function RecipeDetailScreen({ navigation, route }: RecipesStackScreenProps<'RecipeDetail'>) {
  const { recipe } = route.params;
  const missing = new Set(recipe.missingIngredients);

  useEffect(() => {
    navigation.setOptions({ title: recipe.name });
  }, [navigation, recipe.name]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
});
