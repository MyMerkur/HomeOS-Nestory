import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRecipeSuggestionsQuery } from '../hooks/useRecipeSuggestionsQuery';
import { useSavedRecipesQuery } from '../hooks/useSavedRecipesQuery';
import type { RecipeSuggestion } from '../services/recipeApi';
import type { RecipesStackScreenProps } from '../../../app/navigation/types';

type Tab = 'suggestions' | 'saved';

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
  const [tab, setTab] = useState<Tab>('suggestions');
  const suggestionsQuery = useRecipeSuggestionsQuery();
  const savedQuery = useSavedRecipesQuery();
  const { data: recipes, isLoading, isError } = tab === 'suggestions' ? suggestionsQuery : savedQuery;

  return (
    <View style={styles.container}>
      <View style={styles.tabsRow}>
        <Pressable
          testID="recipes-tab-suggestions"
          style={[styles.tab, tab === 'suggestions' && styles.tabActive]}
          onPress={() => setTab('suggestions')}
        >
          <Text style={[styles.tabText, tab === 'suggestions' && styles.tabTextActive]}>Öneriler</Text>
        </Pressable>
        <Pressable
          testID="recipes-tab-saved"
          style={[styles.tab, tab === 'saved' && styles.tabActive]}
          onPress={() => setTab('saved')}
        >
          <Text style={[styles.tabText, tab === 'saved' && styles.tabTextActive]}>Kaydedilenler</Text>
        </Pressable>
      </View>

      {isLoading && (
        <View style={styles.centered}>
          <ActivityIndicator />
        </View>
      )}

      {!isLoading && isError && (
        <View style={styles.centered}>
          <Text style={styles.error}>Tarifler yüklenemedi.</Text>
        </View>
      )}

      {!isLoading && !isError && (recipes?.length ?? 0) === 0 && (
        <View style={styles.centered}>
          <Text style={styles.empty}>
            {tab === 'suggestions'
              ? 'Şu an evdeki ürünlerle eşleşen bir tarif yok.'
              : 'Henüz kaydedilmiş bir tarif yok.'}
          </Text>
        </View>
      )}

      {!isLoading && !isError && (recipes?.length ?? 0) > 0 && (
        <FlatList
          data={recipes}
          keyExtractor={(recipe) => recipe.id}
          renderItem={({ item }) => (
            <RecipeCard
              recipe={item}
              onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabsRow: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, paddingTop: 12, gap: 8 },
  tab: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: '#f0f0f0' },
  tabActive: { backgroundColor: '#1d76db' },
  tabText: { fontSize: 13, color: '#333' },
  tabTextActive: { color: '#fff', fontWeight: '600' },
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
