import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useHomeStore } from '../../../store/useHomeStore';
import { getSavedRecipes, resolveRecipeLang } from '../services/recipeApi';

export const SAVED_RECIPES_QUERY_KEY = 'savedRecipes' as const;

export function useSavedRecipesQuery() {
  const homeId = useHomeStore((state) => state.selectedHomeId);
  const { i18n } = useTranslation();
  const lang = resolveRecipeLang(i18n.language);

  return useQuery({
    queryKey: [SAVED_RECIPES_QUERY_KEY, homeId, lang],
    queryFn: () => getSavedRecipes(homeId as string, lang),
    enabled: !!homeId,
  });
}
