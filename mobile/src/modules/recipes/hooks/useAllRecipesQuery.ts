import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useHomeStore } from '../../../store/useHomeStore';
import { getAllRecipes, resolveRecipeLang } from '../services/recipeApi';

export const ALL_RECIPES_QUERY_KEY = 'allRecipes' as const;

export function useAllRecipesQuery() {
  const homeId = useHomeStore((state) => state.selectedHomeId);
  const { i18n } = useTranslation();
  const lang = resolveRecipeLang(i18n.language);

  return useQuery({
    queryKey: [ALL_RECIPES_QUERY_KEY, homeId, lang],
    queryFn: () => getAllRecipes(homeId as string, lang),
    enabled: !!homeId,
  });
}
