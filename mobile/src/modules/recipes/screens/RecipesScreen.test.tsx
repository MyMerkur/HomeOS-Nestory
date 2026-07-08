import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { RecipesScreen } from './RecipesScreen';
import { getSavedRecipes, getSuggestions } from '../services/recipeApi';
import { useHomeStore } from '../../../store/useHomeStore';
import { ThemeProvider } from '../../../theme/ThemeContext';
import type { RecipesStackScreenProps } from '../../../app/navigation/types';

jest.mock('../services/recipeApi');

const mockNavigation = {
  navigate: jest.fn(),
} as unknown as RecipesStackScreenProps<'Recipes'>['navigation'];

const mockRecipes = [
  {
    id: 'recipe-1',
    name: 'Menemen',
    category: 'Kahvaltı',
    imageUrl: null,
    coveragePercent: 100,
    missingIngredients: [],
    ingredients: [{ name: 'Yumurta', optional: false }],
    instructions: ['Pişirin.'],
    isSaved: false,
  },
];

const mockSavedRecipes = [
  {
    id: 'recipe-2',
    name: 'Mercimek Çorbası',
    category: 'Çorba',
    imageUrl: null,
    coveragePercent: 0,
    missingIngredients: ['Soğan'],
    ingredients: [{ name: 'Soğan', optional: false }],
    instructions: ['Kaynatın.'],
    isSaved: true,
  },
];

function renderScreen() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <RecipesScreen navigation={mockNavigation} route={{} as never} />
      </QueryClientProvider>
    </ThemeProvider>,
  );
}

describe('RecipesScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useHomeStore.setState({ selectedHomeId: 'home-1' });
    (getSuggestions as jest.Mock).mockResolvedValue(mockRecipes);
    (getSavedRecipes as jest.Mock).mockResolvedValue(mockSavedRecipes);
  });

  it('shows recipe cards with coverage percent', async () => {
    renderScreen();

    expect(await screen.findByText('Menemen')).toBeTruthy();
    expect(screen.getByText('%100')).toBeTruthy();
    expect(screen.getByText('All ingredients at home')).toBeTruthy();
  });

  it('refetches when the list is pulled to refresh', async () => {
    renderScreen();
    await screen.findByText('Menemen');

    fireEvent(screen.getByTestId('recipes-list'), 'refresh');

    await waitFor(() => expect(getSuggestions).toHaveBeenCalledTimes(2));
  });

  it('navigates to the detail screen with the recipe payload on press', async () => {
    renderScreen();

    fireEvent.press(await screen.findByText('Menemen'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('RecipeDetail', { recipe: mockRecipes[0] });
  });

  it('shows an empty state when there are no matching recipes', async () => {
    (getSuggestions as jest.Mock).mockResolvedValue([]);
    renderScreen();

    expect(await screen.findByText('No recipes currently match items at home.')).toBeTruthy();
  });

  it('switches to the saved-recipes list when the Saved tab is pressed', async () => {
    renderScreen();

    await screen.findByText('Menemen');
    fireEvent.press(screen.getByTestId('recipes-tab-saved'));

    expect(await screen.findByText('Mercimek Çorbası')).toBeTruthy();
    expect(screen.queryByText('Menemen')).toBeNull();
  });

  it('shows an empty state for the saved tab when there are no saved recipes', async () => {
    (getSavedRecipes as jest.Mock).mockResolvedValue([]);
    renderScreen();

    fireEvent.press(screen.getByTestId('recipes-tab-saved'));

    expect(await screen.findByText('No saved recipes yet.')).toBeTruthy();
  });
});
