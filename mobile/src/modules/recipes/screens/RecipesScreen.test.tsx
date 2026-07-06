import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { RecipesScreen } from './RecipesScreen';
import { getSuggestions } from '../services/recipeApi';
import { useHomeStore } from '../../../store/useHomeStore';
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
  },
];

function renderScreen() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <RecipesScreen navigation={mockNavigation} route={{} as never} />
    </QueryClientProvider>,
  );
}

describe('RecipesScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useHomeStore.setState({ selectedHomeId: 'home-1' });
    (getSuggestions as jest.Mock).mockResolvedValue(mockRecipes);
  });

  it('shows recipe cards with coverage percent', async () => {
    renderScreen();

    expect(await screen.findByText('Menemen')).toBeTruthy();
    expect(screen.getByText('%100')).toBeTruthy();
    expect(screen.getByText('Tüm malzemeler evde')).toBeTruthy();
  });

  it('navigates to the detail screen with the recipe payload on press', async () => {
    renderScreen();

    fireEvent.press(await screen.findByText('Menemen'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('RecipeDetail', { recipe: mockRecipes[0] });
  });

  it('shows an empty state when there are no matching recipes', async () => {
    (getSuggestions as jest.Mock).mockResolvedValue([]);
    renderScreen();

    expect(await screen.findByText('Şu an evdeki ürünlerle eşleşen bir tarif yok.')).toBeTruthy();
  });
});
