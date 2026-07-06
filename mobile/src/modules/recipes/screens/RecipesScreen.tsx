import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRecipeSuggestionsQuery } from '../hooks/useRecipeSuggestionsQuery';
import type { RecipeSuggestion } from '../services/recipeApi';
import type { RecipesStackScreenProps } from '../../../app/navigation/types';

function coverageStyle(coveragePercent: number) {
  if (coveragePercent >= 80) return styles.coverageHigh;
  if (coveragePercent >= 50) return styles.coverageMedium;
  return styles.coverageLow;
}

function RecipeCard({ recipe, onPress }: { recipe: RecipeSuggestion; onPress: () => void }) {
  return (
    <Pressable testID={`recipe-card-${recipe.id}`} style={styles.card} onPress={onPress}>
      <View style={styles.info}>
        <Text style={styles.name}>{recipe.name}</Text>
        <Text style={styles.meta}>
          {recipe.missingIngredients.length === 0
            ? 'Tüm malzemeler evde'
            : `${recipe.missingIngredients.length} eksik malzeme`}
        </Text>
      </View>
      <View style={[styles.coverageBadge, coverageStyle(recipe.coveragePercent)]}>
        <Text style={styles.coverageText}>%{recipe.coveragePercent}</Text>
      </View>
    </Pressable>
  );
}

export function RecipesScreen({ navigation }: RecipesStackScreenProps<'Recipes'>) {
  const { data: recipes, isLoading, isError } = useRecipeSuggestionsQuery();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Tarifler yüklenemedi.</Text>
      </View>
    );
  }

  if (!recipes || recipes.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.empty}>Şu an evdeki ürünlerle eşleşen bir tarif yok.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={recipes}
      keyExtractor={(recipe) => recipe.id}
      renderItem={({ item }) => (
        <RecipeCard recipe={item} onPress={() => navigation.navigate('RecipeDetail', { recipe: item })} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  error: { color: '#c0392b' },
  empty: { color: '#666', textAlign: 'center' },
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
  coverageBadge: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  coverageText: { fontSize: 12, fontWeight: '600', color: '#fff' },
  coverageHigh: { backgroundColor: '#27ae60' },
  coverageMedium: { backgroundColor: '#f1c40f' },
  coverageLow: { backgroundColor: '#e67e22' },
});
